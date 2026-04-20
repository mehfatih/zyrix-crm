"use client";

import axios from "axios";

// ============================================================================
// PAYMENTS API CLIENT (public — no auth required)
// ============================================================================
// The checkout flow hits /api/payments/* endpoints. Auth is not strictly
// required because the server identifies the buyer via companyId + plan.
// ============================================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error?: { code?: string; message?: string };
}

export type CheckoutCurrency = "USD" | "TRY" | "SAR" | "AED";
export type CheckoutBilling = "monthly" | "yearly";

export interface CreateCheckoutSessionDto {
  companyId: string;
  planSlug: string;
  billingCycle: CheckoutBilling;
  currency: CheckoutCurrency;
  buyerCountry?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResponse {
  gateway: "iyzico" | "hyperpay";
  gatewaySessionId: string;
  redirectUrl: string;
  expiresAt: string;
  clientReference: string;
  amount: number;
  currency: CheckoutCurrency;
}

export async function createCheckoutSession(
  dto: CreateCheckoutSessionDto,
  accessToken?: string
): Promise<CheckoutSessionResponse> {
  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await axios.post<ApiEnvelope<CheckoutSessionResponse>>(
    `${API_URL}/api/payments/checkout/create-session`,
    dto,
    { headers }
  );
  return res.data.data;
}

export async function confirmStubPayment(
  clientReference: string
): Promise<{ activated: boolean; paymentId: string }> {
  const res = await axios.post<
    ApiEnvelope<{ activated: boolean; paymentId: string }>
  >(`${API_URL}/api/payments/checkout/confirm-stub`, { clientReference });
  return res.data.data;
}
