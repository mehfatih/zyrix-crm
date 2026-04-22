"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  signupApi,
  signinApi,
  googleAuthApi,
  logoutApi,
  meApi,
  twoFactorChallengeApi,
} from "../api/auth";
import { recordSessionEvent } from "../api/session-events";
import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  setUser as cacheUser,
  getUser as getCachedUser,
  setCompany as cacheCompany,
  getCompany as getCachedCompany,
  setCachedPermissions,
  getCachedPermissions,
  clearAuth,
} from "./token-storage";
import type {
  User,
  Company,
  SignupPayload,
  SigninPayload,
} from "./types";
import { fetchMyPermissions, type Permission } from "../api/roles";

// ============================================================================
// AUTH CONTEXT
// ============================================================================

interface AuthContextValue {
  user: User | null;
  company: Company | null;
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  hasAllPermissions: (...permissions: Permission[]) => boolean;
  hasAnyPermission: (...permissions: Permission[]) => boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  signup: (payload: SignupPayload) => Promise<void>;
  // signin resolves to { requires2FA: true, challengeToken } when the
  // account has 2FA enabled — caller must then show a TOTP prompt and
  // call complete2FAChallenge to finish the login.
  signin: (
    payload: SigninPayload
  ) => Promise<{ requires2FA: true; challengeToken: string } | void>;
  complete2FAChallenge: (challengeToken: string, code: string) => Promise<void>;
  googleSignIn: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────
export function AuthProvider({
  children,
  locale = "en",
}: {
  children: ReactNode;
  locale?: string;
}) {
  const router = useRouter();
  const [user, setUserState] = useState<User | null>(null);
  const [company, setCompanyState] = useState<Company | null>(null);
  const [permissions, setPermissionsState] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFromCache = useCallback(() => {
    const cachedUser = getCachedUser();
    const cachedCompany = getCachedCompany();
    const cachedPerms = getCachedPermissions();
    if (cachedUser) setUserState(cachedUser);
    if (cachedCompany) setCompanyState(cachedCompany);
    if (cachedPerms) setPermissionsState(cachedPerms as Permission[]);
  }, []);

  const loadPermissions = useCallback(async () => {
    try {
      const perms = await fetchMyPermissions();
      setPermissionsState(perms);
      setCachedPermissions(perms);
    } catch {
      // Permission fetch failed (e.g. offline) — keep whatever we have
      // cached so the UI stays usable for the current session.
    }
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const { user: u, company: c } = await meApi();
      setUserState(u);
      setCompanyState(c);
      cacheUser(u);
      cacheCompany(c);
      // /api/permissions/me is independent of /me; run in parallel but
      // don't let a permissions hiccup kill the session hydration.
      await loadPermissions();
    } catch {
      // Token expired / invalid → clear
      clearAuth();
      setUserState(null);
      setCompanyState(null);
      setPermissionsState([]);
    }
  }, [loadPermissions]);

  // On mount, restore session if possible
  useEffect(() => {
    loadFromCache();
    const token = getAccessToken();
    if (token) {
      fetchMe().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchMe, loadFromCache]);

  // ───────────────────────────────────────────────────────────────────
  // Actions
  // ───────────────────────────────────────────────────────────────────
  const signup = useCallback(
    async (payload: SignupPayload) => {
      const result = await signupApi(payload);
      setAccessToken(result.tokens.accessToken);
      setRefreshToken(result.tokens.refreshToken);
      setUserState(result.user);
      setCompanyState(result.company);
      cacheUser(result.user);
      cacheCompany(result.company);
      await loadPermissions();
      // Session-events telemetry — fire-and-forget, never block signup
      recordSessionEvent("login", { method: "signup" }).catch(() => {});
      router.push(`/${locale}/dashboard`);
    },
    [locale, loadPermissions, router]
  );

  const signin = useCallback(
    async (payload: SigninPayload) => {
      const result = await signinApi(payload);
      if ("requires2FA" in result && result.requires2FA) {
        // Don't route — let the caller (SigninForm) render the TOTP
        // prompt using the challengeToken we return here.
        return { requires2FA: true as const, challengeToken: result.challengeToken };
      }
      const full = result as Exclude<typeof result, { requires2FA: true }>;
      setAccessToken(full.tokens.accessToken);
      setRefreshToken(full.tokens.refreshToken);
      setUserState(full.user);
      setCompanyState(full.company);
      cacheUser(full.user);
      cacheCompany(full.company);
      await loadPermissions();
      recordSessionEvent("login", { method: "password" }).catch(() => {});
      router.push(`/${locale}/dashboard`);
      return;
    },
    [locale, loadPermissions, router]
  );

  const complete2FAChallenge = useCallback(
    async (challengeToken: string, code: string) => {
      const result = await twoFactorChallengeApi(challengeToken, code);
      setAccessToken(result.tokens.accessToken);
      setRefreshToken(result.tokens.refreshToken);
      setUserState(result.user);
      setCompanyState(result.company);
      cacheUser(result.user);
      cacheCompany(result.company);
      await loadPermissions();
      recordSessionEvent("login", { method: "password_2fa" }).catch(() => {});
      router.push(`/${locale}/dashboard`);
    },
    [locale, loadPermissions, router]
  );

  const googleSignIn = useCallback(
    async (idToken: string) => {
      const result = await googleAuthApi(idToken);
      setAccessToken(result.tokens.accessToken);
      setRefreshToken(result.tokens.refreshToken);
      setUserState(result.user);
      setCompanyState(result.company);
      cacheUser(result.user);
      cacheCompany(result.company);
      await loadPermissions();
      recordSessionEvent("login", { method: "google" }).catch(() => {});
      router.push(`/${locale}/dashboard`);
    },
    [locale, loadPermissions, router]
  );

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await logoutApi(refreshToken);
      } catch {
        // Silent fail — always clear locally
      }
    }
    clearAuth();
    setUserState(null);
    setCompanyState(null);
    setPermissionsState([]);
    router.push(`/${locale}/signin`);
  }, [locale, router]);

  const refresh = useCallback(async () => {
    await fetchMe();
  }, [fetchMe]);

  const hasPermission = useCallback(
    (permission: Permission) => permissions.includes(permission),
    [permissions]
  );
  const hasAllPermissions = useCallback(
    (...required: Permission[]) => required.every((p) => permissions.includes(p)),
    [permissions]
  );
  const hasAnyPermission = useCallback(
    (...options: Permission[]) => options.some((p) => permissions.includes(p)),
    [permissions]
  );

  const value: AuthContextValue = {
    user,
    company,
    permissions,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    isAuthenticated: !!user,
    isLoading,
    signup,
    signin,
    complete2FAChallenge,
    googleSignIn,
    logout,
    refresh,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}