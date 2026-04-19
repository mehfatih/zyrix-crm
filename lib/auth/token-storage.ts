"use client";

import Cookies from "js-cookie";
import type { User, Company } from "./types";

// ============================================================================
// TOKEN STORAGE — Secure localStorage + cookies hybrid
// ============================================================================
// Access token: memory + localStorage (fast access)
// Refresh token: httpOnly cookie is best, but we use secure cookie for MVP
// ============================================================================

const ACCESS_TOKEN_KEY = "zyrix_crm_access_token";
const REFRESH_TOKEN_KEY = "zyrix_crm_refresh_token";
const USER_KEY = "zyrix_crm_user";
const COMPANY_KEY = "zyrix_crm_company";

const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  secure: typeof window !== "undefined" && window.location.protocol === "https:",
  sameSite: "strict",
  expires: 7, // 7 days for refresh token
};

// ─────────────────────────────────────────────────────────────────────────
// ACCESS TOKEN
// ─────────────────────────────────────────────────────────────────────────
export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    // localStorage blocked (private mode)
  }
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function removeAccessToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // Silent fail
  }
}

// ─────────────────────────────────────────────────────────────────────────
// REFRESH TOKEN (cookie for persistence)
// ─────────────────────────────────────────────────────────────────────────
export function setRefreshToken(token: string): void {
  Cookies.set(REFRESH_TOKEN_KEY, token, COOKIE_OPTIONS);
}

export function getRefreshToken(): string | null {
  return Cookies.get(REFRESH_TOKEN_KEY) || null;
}

export function removeRefreshToken(): void {
  Cookies.remove(REFRESH_TOKEN_KEY);
}

// ─────────────────────────────────────────────────────────────────────────
// USER / COMPANY (lightweight cache — always verify with /me)
// ─────────────────────────────────────────────────────────────────────────
export function setUser(user: User): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // Silent fail
  }
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    return null;
  }
}

export function setCompany(company: Company): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COMPANY_KEY, JSON.stringify(company));
  } catch {
    // Silent fail
  }
}

export function getCompany(): Company | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(COMPANY_KEY);
    return stored ? (JSON.parse(stored) as Company) : null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────
// CLEAR EVERYTHING
// ─────────────────────────────────────────────────────────────────────────
export function clearAuth(): void {
  removeAccessToken();
  removeRefreshToken();
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(COMPANY_KEY);
  } catch {
    // Silent fail
  }
}