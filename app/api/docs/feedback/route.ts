import { NextResponse } from "next/server";

// ============================================================================
// /api/docs/feedback — proxy for the backend's POST /api/docs/feedback.
// Server-side proxy so the browser doesn't hit cross-origin endpoints
// and we can keep the backend URL private to the runtime.
// ============================================================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:4000";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const r = await fetch(`${API_URL}/api/docs/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await r.json().catch(() => ({ success: r.ok }));
    return NextResponse.json(json, { status: r.status });
  } catch {
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
