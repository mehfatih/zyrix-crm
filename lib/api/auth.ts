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

export async function logoutApi(refreshToken: string): Promise<void> {
  await apiClient.post("/api/auth/logout", { refreshToken });
}

export async function meApi(): Promise<MeResponse> {
  const response = await apiClient.get<ApiSuccess<MeResponse>>(
    "/api/auth/me"
  );
  return response.data.data;
}