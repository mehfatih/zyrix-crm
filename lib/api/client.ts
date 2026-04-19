"use client";

import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearAuth,
} from "../auth/token-storage";

// ============================================================================
// API CLIENT — Axios instance with auth interceptors
// ============================================================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─────────────────────────────────────────────────────────────────────────
// REQUEST INTERCEPTOR — Attach access token
// ─────────────────────────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────────────────────────────────
// RESPONSE INTERCEPTOR — Auto-refresh on 401
// ─────────────────────────────────────────────────────────────────────────
let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function processQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // Not 401 → reject immediately
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // Already refreshing → queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((token) => {
          if (token) {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      isRefreshing = false;
      clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post(`${API_URL}/api/auth/refresh`, {
        refreshToken,
      });

      const newAccessToken = data.data.accessToken;
      const newRefreshToken = data.data.refreshToken;

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);

      processQueue(newAccessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(null);
      clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────
// HELPER — Extract error message from any API error
// ─────────────────────────────────────────────────────────────────────────
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.error?.message) return data.error.message;
    if (error.message === "Network Error") {
      return "Network error. Check your connection.";
    }
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}