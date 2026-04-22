// ============================================================================
// AUTH TYPES — Must match backend types exactly
// ============================================================================

export type UserRole = "owner" | "admin" | "manager" | "member";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  companyId: string;
  emailVerified: boolean;
  phone?: string;
  twoFactorEnabled?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  // Profile expansion (UX #7)
  avatarUrl?: string | null;
  website?: string | null;
  timezone?: string | null;
  billingEmail?: string | null;
  preferredLocale?: "en" | "ar" | "tr" | null;
  notificationPrefs?: Record<string, boolean>;
  // RBAC (P1) — optional custom role override. When set, the user's
  // permissions come from that Role; otherwise they come from the
  // built-in `role` string above via the backend's default map.
  customRoleId?: string | null;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  plan: "free" | "starter" | "business" | "enterprise";
  country?: string | null;  // ISO-3166-1 alpha-2, e.g. "SA" / "TR"
  baseCurrency?: string | null; // USD / SAR / TRY — falls back to country's currency
  // Per-merchant feature overrides from the admin panel. Missing keys
  // default to true (enabled), so new features appear automatically
  // without needing a data migration.
  enabledFeatures?: Record<string, boolean>;
  // Auto-lock inactivity timeout in minutes. 10 default, 0 or null
  // disables auto-lock (e.g. for dashboards on TV screens).
  idleTimeoutMinutes?: number | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  company: Company;
  tokens: AuthTokens;
}

export interface SignupPayload {
  companyName: string;
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface SigninPayload {
  email: string;
  password: string;
}

// API response wrapper (matches backend)
export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;