import { NextResponse } from "next/server";

// ============================================================================
// /api/docs/analytics — proxy for the backend's POST /api/docs/analytics.
// Accepts view/dwell/search event payloads from the client tracker and
// forwards them to the API. Failures never bubble up to the user — we
// always return 200 so page transitions and unload beacons stay quiet.
// ============================================================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:4000";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await fetch(`${API_URL}/api/docs/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    /* swallow */
  }
  return NextResponse.json({ success: true });
}
