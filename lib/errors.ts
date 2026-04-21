// ============================================================================
// ERROR MESSAGE EXTRACTOR
// ----------------------------------------------------------------------------
// Pulls human-readable error messages out of axios / fetch / plain Error
// objects. Especially important for 422 validation errors — the raw
// axios message says 'Request failed with status code 422', which tells
// the user nothing. The backend actually sends structured details in
// response.data.error.details; this helper surfaces them.
//
// Usage:
//   try { await createQuote(dto) }
//   catch (e) { setFormError(extractErrorMessage(e)) }
// ============================================================================

import { AxiosError } from "axios";

export interface ValidationDetail {
  path: string;
  message: string;
}

/**
 * Extract the best human-readable message from any error. Priority:
 *   1. Backend validation details (422 responses with error.details[])
 *   2. Backend error.message
 *   3. Plain Error.message
 *   4. Generic 'Something went wrong' fallback
 */
export function extractErrorMessage(err: unknown): string {
  // Axios error with structured backend response
  if (err && typeof err === "object" && "isAxiosError" in err) {
    const axErr = err as AxiosError<{
      error?: {
        code?: string;
        message?: string;
        details?: ValidationDetail[] | unknown;
      };
    }>;
    const body = axErr.response?.data?.error;
    if (body) {
      // 422 zod validation with per-field details — format as:
      //   "Please fix these fields:\n  • items.0.quantity: must be >= 0\n  • title: required"
      if (
        Array.isArray(body.details) &&
        body.details.length > 0 &&
        typeof body.details[0] === "object"
      ) {
        const lines = (body.details as ValidationDetail[])
          .map((d) => `  • ${d.path || "field"}: ${d.message}`)
          .join("\n");
        return `${body.message ?? "Validation failed"}:\n${lines}`;
      }
      if (body.message) return body.message;
    }
    // No structured body — fall through to axios default
    if (axErr.message) return axErr.message;
  }

  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Something went wrong";
}

/**
 * Extract just the validation details array (or empty). Useful when a
 * form wants to highlight specific fields rather than show a banner.
 */
export function extractValidationDetails(err: unknown): ValidationDetail[] {
  if (!err || typeof err !== "object") return [];
  const axErr = err as AxiosError<{
    error?: { details?: ValidationDetail[] | unknown };
  }>;
  const details = axErr.response?.data?.error?.details;
  if (Array.isArray(details)) {
    return details.filter(
      (d): d is ValidationDetail =>
        d && typeof d === "object" && "path" in d && "message" in d
    );
  }
  return [];
}
