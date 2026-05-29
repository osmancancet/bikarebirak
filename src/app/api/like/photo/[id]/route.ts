import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { assertRateLimit, RateLimitError, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: { honeypot?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    // body opsiyonel
  }
  if (typeof body.honeypot === "string" && body.honeypot.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const ip = getClientIp(request);
  try {
    await assertRateLimit(`like::${ip}`, "global", 60, 3600);
  } catch (err) {
    if (err instanceof RateLimitError) {
      return NextResponse.json({ error: err.message }, { status: 429 });
    }
    throw err;
  }

  try {
    await getAdminDb()
      .collection("photos")
      .doc(id)
      .update({ like_count: FieldValue.increment(1) });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
