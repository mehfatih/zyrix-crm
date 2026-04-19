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
  logoutApi,
  meApi,
} from "../api/auth";
import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  setUser as cacheUser,
  getUser as getCachedUser,
  setCompany as cacheCompany,
  getCompany as getCachedCompany,
  clearAuth,
} from "./token-storage";
import type {
  User,
  Company,
  SignupPayload,
  SigninPayload,
} from "./types";

// ============================================================================
// AUTH CONTEXT
// ============================================================================

interface AuthContextValue {
  user: User | null;
  company: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signup: (payload: SignupPayload) => Promise<void>;
  signin: (payload: SigninPayload) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);

  const loadFromCache = useCallback(() => {
    const cachedUser = getCachedUser();
    const cachedCompany = getCachedCompany();
    if (cachedUser) setUserState(cachedUser);
    if (cachedCompany) setCompanyState(cachedCompany);
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const { user: u, company: c } = await meApi();
      setUserState(u);
      setCompanyState(c);
      cacheUser(u);
      cacheCompany(c);
    } catch {
      // Token expired / invalid → clear
      clearAuth();
      setUserState(null);
      setCompanyState(null);
    }
  }, []);

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
      router.push(`/${locale}/dashboard`);
    },
    [locale, router]
  );

  const signin = useCallback(
    async (payload: SigninPayload) => {
      const result = await signinApi(payload);
      setAccessToken(result.tokens.accessToken);
      setRefreshToken(result.tokens.refreshToken);
      setUserState(result.user);
      setCompanyState(result.company);
      cacheUser(result.user);
      cacheCompany(result.company);
      router.push(`/${locale}/dashboard`);
    },
    [locale, router]
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
    router.push(`/${locale}/signin`);
  }, [locale, router]);

  const refresh = useCallback(async () => {
    await fetchMe();
  }, [fetchMe]);

  const value: AuthContextValue = {
    user,
    company,
    isAuthenticated: !!user,
    isLoading,
    signup,
    signin,
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