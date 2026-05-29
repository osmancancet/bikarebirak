import { ImageResponse } from "next/og";
import { promises as fs } from "fs";
import path from "path";
import { getCoupleBySlug } from "@/lib/queries";
import { formatWeddingDate } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Modül seviyesinde cache — soğuk başlangıçtan sonra her istek hızlanır
let fontDataCache: Buffer | null = null;
async function loadFont(): Promise<Buffer> {
  if (!fontDataCache) {
    fontDataCache = await fs.readFile(
      path.join(process.cwd(), "public/fonts/cormorant-garamond-600.woff")
    );
  }
  return fontDataCache;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const couple = await getCoupleBySlug(slug);
  if (!couple) {
    return new Response("Not found", { status: 404 });
  }

  const fontData = await loadFont();
  const fullName = `${couple.groom_name} & ${couple.bride_name}`;
  const dateStr = formatWeddingDate(couple.wedding_date);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #fdfbf7 0%, #f7f1e8 45%, #ede3d3 100%)",
          color: "#3b362f",
          fontFamily: "Cormorant Garamond, serif",
          position: "relative",
        }}
      >
        {/* Köşe altın işaretleri */}
        <div
          style={{
            position: "absolute",
            top: 50,
            left: 50,
            width: 80,
            height: 80,
            borderTop: "2px solid #c2a14d",
            borderLeft: "2px solid #c2a14d",
            borderTopLeftRadius: 16,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 50,
            right: 50,
            width: 80,
            height: 80,
            borderTop: "2px solid #c2a14d",
            borderRight: "2px solid #c2a14d",
            borderTopRightRadius: 16,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 50,
            width: 80,
            height: 80,
            borderBottom: "2px solid #c2a14d",
            borderLeft: "2px solid #c2a14d",
            borderBottomLeftRadius: 16,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 50,
            right: 50,
            width: 80,
            height: 80,
            borderBottom: "2px solid #c2a14d",
            borderRight: "2px solid #c2a14d",
            borderBottomRightRadius: 16,
          }}
        />

        {/* Kicker */}
        <div
          style={{
            fontSize: 22,
            letterSpacing: 12,
            textTransform: "uppercase",
            color: "#b8935f",
            marginBottom: 30,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Evleniyoruz
        </div>

        {/* Çift adı */}
        <div
          style={{
            fontSize: 120,
            lineHeight: 1.05,
            textAlign: "center",
            fontWeight: 600,
            padding: "0 80px",
          }}
        >
          {fullName}
        </div>

        {/* Süslü ayraç */}
        <div
          style={{
            marginTop: 28,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 100,
              height: 1,
              background:
                "linear-gradient(to right, transparent, #c2a14d)",
            }}
          />
          <div style={{ color: "#c2a14d", fontSize: 28 }}>◆</div>
          <div
            style={{
              width: 100,
              height: 1,
              background:
                "linear-gradient(to left, transparent, #c2a14d)",
            }}
          />
        </div>

        {/* Tarih */}
        <div
          style={{
            marginTop: 28,
            fontSize: 32,
            color: "#6f675b",
          }}
        >
          {dateStr}
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 65,
            fontSize: 24,
            color: "#b8935f",
            letterSpacing: 6,
            fontFamily: "system-ui, sans-serif",
            textTransform: "uppercase",
          }}
        >
          BiKareBırak
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Cormorant Garamond",
          data: fontData,
          weight: 600,
          style: "normal",
        },
      ],
    }
  );
}
