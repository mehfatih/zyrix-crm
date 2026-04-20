"use client";

import { apiClient } from "./client";
import type {
  SignupPayload,
  SigninPayload,
  AuthResponse,
  User,
  Company,
  ApiSuccess,
} from "../auth/types";

// ============================================================================
// AUTH API — Wrapper around backend /api/auth endpoints
// ============================================================================

type MeResponse = {
  user: User;
  company: Company;
};

export async function signupApi(
  payload: SignupPayload
): Promise<AuthResponse> {
  const response = await apiClient.post<ApiSuccess<AuthResponse>>(
    "/api/auth/signup",
    payload
  );
  return response.data.data;
}

export async function signinApi(
  payload: SigninPayload
): Promise<AuthResponse> {
  const response = await apiClient.post<ApiSuccess<AuthResponse>>(
    "/api/auth/signin",
    payload
  );
  return response.data.data;
}

export async function googleAuthApi(
  idToken: string
): Promise<AuthResponse> {
  const response = await apiClient.post<ApiSuccess<AuthResponse>>(
    "/api/auth/google",
    { idToken }
  );
  return response.data.data;
}

export async function logoutApi(refreshToken: string): Promise<void> {
  await apiClient.post("/api/auth/logout", { refreshToken });
}

export async function meApi(): Promise<MeResponse> {
  const response = await apiClient.get<ApiSuccess<MeResponse>>(
    "/api/auth/me"
  );
  return response.data.data;
}

export async function verifyEmailApi(
  token: string
): Promise<{ verified: boolean; email: string }> {
  const response = await apiClient.post<ApiSuccess<{ verified: boolean; email: string }>>(
    "/api/auth/verify-email",
    { token }
  );
  return response.data.data;
}

export async function resendVerificationApi(
  email: string
): Promise<{ sent: boolean }> {
  const response = await apiClient.post<ApiSuccess<{ sent: boolean }>>(
    "/api/auth/resend-verification",
    { email }
  );
  return response.data.data;
}

export async function requestPasswordResetApi(
  email: string
): Promise<{ sent: boolean }> {
  const response = await apiClient.post<ApiSuccess<{ sent: boolean }>>(
    "/api/auth/request-password-reset",
    { email }
  );
  return response.data.data;
}

export async function resetPasswordApi(
  token: string,
  password: string
): Promise<{ reset: boolean }> {
  const response = await apiClient.post<ApiSuccess<{ reset: boolean }>>(
    "/api/auth/reset-password",
    { token, password }
  );
  return response.data.data;
}
