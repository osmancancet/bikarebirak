import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getCoupleById, getRsvps } from "@/lib/queries";
import { rsvpToCsv } from "@/lib/csv";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const { id } = await params;
  const couple = await getCoupleById(id);
  if (!couple) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

  const rsvps = await getRsvps(id);
  const csv = rsvpToCsv(rsvps);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="lcv-${couple.slug}.csv"`,
    },
  });
}
