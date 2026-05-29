import { NextResponse } from "next/server";
import { getCoupleBySlug, getRsvps } from "@/lib/queries";
import { isCoupleAuthenticated } from "@/lib/couple-auth";
import { rsvpToCsv } from "@/lib/csv";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const couple = await getCoupleBySlug(slug);
  if (!couple) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }

  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const ok =
    (await isCoupleAuthenticated(couple.id, couple.portal_token)) ||
    (!!key && key === couple.portal_token);
  if (!ok) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const rsvps = await getRsvps(couple.id);
  const csv = rsvpToCsv(rsvps);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="lcv-${couple.slug}.csv"`,
    },
  });
}
