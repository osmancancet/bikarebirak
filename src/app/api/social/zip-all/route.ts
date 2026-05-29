import { NextResponse } from "next/server";
import { Readable } from "stream";
import archiver from "archiver";
import { VARIANTS } from "@/data/social-variants";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * 12 sosyal medya görselini tek ZIP olarak indir (admin-only).
 * Her variant için /api/social/<variant> endpoint'ini fetch eder, PNG buffer'ı alıp ZIP'e ekler.
 */
export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const origin = new URL(request.url).origin;
  const archive = archiver("zip", { zlib: { level: 6 } });
  archive.on("warning", (err) => console.warn("archive warning:", err));
  archive.on("error", (err) => console.error("archive error:", err));

  // Önce tüm PNG'leri paralel çek, sonra ZIP'e ekle
  const pngs = await Promise.all(
    VARIANTS.map(async (v) => {
      try {
        const res = await fetch(`${origin}/api/social/${v.key}`);
        if (!res.ok) {
          console.warn(`Variant ${v.key} fetch failed: ${res.status}`);
          return null;
        }
        const buf = Buffer.from(await res.arrayBuffer());
        return { key: v.key, size: v.size, buf };
      } catch (err) {
        console.error(`Variant ${v.key} fetch error:`, err);
        return null;
      }
    })
  );

  // Caption.txt'i de ZIP'in içine koy
  const { CAPTIONS, fullCaptionText } = await import("@/data/social-captions");
  const captionsTxt = CAPTIONS.map((c) => {
    const variantLabel = VARIANTS.find((v) => v.key === c.variant)?.label ?? c.variant;
    return `### ${variantLabel} (${c.variant})\n${fullCaptionText(c)}\n\n---\n`;
  }).join("\n");
  archive.append(captionsTxt, { name: "captions.txt" });

  for (const png of pngs) {
    if (!png) continue;
    const folder = png.size === "story" ? "stories" : "posts";
    archive.append(png.buf, { name: `${folder}/${png.key}.png` });
  }

  archive.finalize();

  const webStream = Readable.toWeb(archive) as ReadableStream<Uint8Array>;
  return new Response(webStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="bikarebirak-medya-kit.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
