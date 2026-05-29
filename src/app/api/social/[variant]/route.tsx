import { ImageResponse } from "next/og";
import { promises as fs } from "fs";
import path from "path";
import { getCoupleBySlug } from "@/lib/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ------------------------------------------------------------
// Marka renkleri
// ------------------------------------------------------------
const CREAM = "#fdfbf7";
const IVORY = "#f7f1e8";
const BEIGE = "#ede3d3";
const GOLD = "#c2a14d";
const GOLD_SOFT = "#d4b878";
const ROSE_GOLD = "#b76e79";
const INK = "#3b362f";
const INK_SOFT = "#6f675b";

// Font cache (cold start sonrası tüm istekler hızlı)
let fontDataCache: Buffer | null = null;
async function loadFont(): Promise<Buffer> {
  if (!fontDataCache) {
    fontDataCache = await fs.readFile(
      path.join(process.cwd(), "public/fonts/cormorant-garamond-600.woff")
    );
  }
  return fontDataCache;
}

// ------------------------------------------------------------
// Variant tanımları
// ------------------------------------------------------------
type Size = "square" | "story";

import { VARIANTS_SQUARE, VARIANTS_STORY } from "@/data/social-variants";

function sizeFromVariant(variant: string, override?: string | null): Size {
  if (override === "story") return "story";
  if (override === "square") return "square";
  if (VARIANTS_STORY.includes(variant)) return "story";
  return "square";
}

// ------------------------------------------------------------
// Variant render'ları
// ------------------------------------------------------------

function CornerOrnaments({ size }: { size: number }) {
  const c = {
    position: "absolute" as const,
    width: size,
    height: size,
    borderColor: GOLD,
  };
  return (
    <>
      <div
        style={{
          ...c,
          top: 50,
          left: 50,
          borderTop: `3px solid ${GOLD}`,
          borderLeft: `3px solid ${GOLD}`,
          borderTopLeftRadius: 24,
        }}
      />
      <div
        style={{
          ...c,
          top: 50,
          right: 50,
          borderTop: `3px solid ${GOLD}`,
          borderRight: `3px solid ${GOLD}`,
          borderTopRightRadius: 24,
        }}
      />
      <div
        style={{
          ...c,
          bottom: 50,
          left: 50,
          borderBottom: `3px solid ${GOLD}`,
          borderLeft: `3px solid ${GOLD}`,
          borderBottomLeftRadius: 24,
        }}
      />
      <div
        style={{
          ...c,
          bottom: 50,
          right: 50,
          borderBottom: `3px solid ${GOLD}`,
          borderRight: `3px solid ${GOLD}`,
          borderBottomRightRadius: 24,
        }}
      />
    </>
  );
}

function Divider({ width = 200 }: { width?: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginTop: 28,
        marginBottom: 28,
      }}
    >
      <div
        style={{
          width,
          height: 1,
          background: `linear-gradient(to right, transparent, ${GOLD})`,
        }}
      />
      <div style={{ color: GOLD, fontSize: 32 }}>◆</div>
      <div
        style={{
          width,
          height: 1,
          background: `linear-gradient(to left, transparent, ${GOLD})`,
        }}
      />
    </div>
  );
}

function BackgroundBase({ size }: { size: Size }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(135deg, ${CREAM} 0%, ${IVORY} 45%, ${BEIGE} 100%)`,
      }}
    />
  );
}

// 1) hero (square)
function renderHero() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <BackgroundBase size="square" />
      <CornerOrnaments size={90} />

      <div
        style={{
          fontSize: 22,
          letterSpacing: 12,
          color: ROSE_GOLD,
          fontFamily: "system-ui, sans-serif",
          textTransform: "uppercase",
        }}
      >
        Premium Dijital Düğün Asistanı
      </div>

      <div
        style={{
          fontSize: 96,
          fontFamily: "Cormorant Garamond, serif",
          fontWeight: 600,
          lineHeight: 1.05,
          textAlign: "center",
          marginTop: 40,
          color: INK,
          padding: "0 80px",
        }}
      >
        Düğününüzün her karesi
      </div>
      <div
        style={{
          fontSize: 96,
          fontFamily: "Cormorant Garamond, serif",
          fontWeight: 600,
          lineHeight: 1.05,
          textAlign: "center",
          color: GOLD,
          marginTop: 10,
        }}
      >
        tek bir havuzda.
      </div>

      <Divider width={150} />

      <div
        style={{
          fontSize: 26,
          color: INK_SOFT,
          fontFamily: "system-ui, sans-serif",
          maxWidth: 800,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        Dijital davetiye · LCV · Canlı fotoğraf galerisi
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 80,
          fontSize: 28,
          color: GOLD,
          letterSpacing: 8,
          fontFamily: "system-ui, sans-serif",
          textTransform: "uppercase",
        }}
      >
        BiKareBırak
      </div>
    </div>
  );
}

// 2) pricing (square)
function renderPricing() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <BackgroundBase size="square" />
      <CornerOrnaments size={90} />

      <div
        style={{
          fontSize: 22,
          letterSpacing: 12,
          color: GOLD,
          fontFamily: "system-ui, sans-serif",
          textTransform: "uppercase",
        }}
      >
        Anahtar Teslim Paket
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          marginTop: 50,
        }}
      >
        <div
          style={{
            fontSize: 280,
            fontFamily: "Cormorant Garamond, serif",
            fontWeight: 600,
            lineHeight: 1,
            color: INK,
          }}
        >
          5.000
        </div>
        <div
          style={{
            fontSize: 80,
            color: INK_SOFT,
            marginBottom: 40,
            marginLeft: 16,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          ₺
        </div>
      </div>

      <Divider width={120} />

      <div
        style={{
          fontSize: 28,
          color: INK_SOFT,
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        Düğün başına tek ödeme · KDV dahil
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginTop: 30,
        }}
      >
        {[
          "Dijital davetiye + LCV yönetimi",
          "QR kodlar · Canlı fotoğraf galerisi",
          "Anı defteri + Misafir paylaşımları",
        ].map((t) => (
          <div
            key={t}
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 26,
              color: INK,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            <div style={{ color: GOLD, marginRight: 12 }}>✓</div>
            {t}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 80,
          fontSize: 24,
          color: GOLD,
          letterSpacing: 6,
          fontFamily: "system-ui, sans-serif",
          textTransform: "uppercase",
        }}
      >
        BiKareBırak · WhatsApp'tan Yaz
      </div>
    </div>
  );
}

// 3) how-it-works (square)
function renderHowItWorks() {
  const steps = [
    { n: "1", label: "Sipariş", desc: "WhatsApp'tan ulaşın" },
    { n: "2", label: "Davetiye", desc: "Linki misafire gönderin" },
    { n: "3", label: "Düğün Günü", desc: "Masadaki QR'ı okutsunlar" },
    { n: "4", label: "Anılar", desc: "Tüm fotolar tek havuzda" },
  ];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "80px",
      }}
    >
      <BackgroundBase size="square" />

      <div
        style={{
          fontSize: 20,
          letterSpacing: 10,
          color: GOLD,
          fontFamily: "system-ui, sans-serif",
          textTransform: "uppercase",
        }}
      >
        Nasıl Çalışır
      </div>
      <div
        style={{
          fontSize: 72,
          fontFamily: "Cormorant Garamond, serif",
          color: INK,
          marginTop: 12,
          marginBottom: 50,
        }}
      >
        4 Basit Adım
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          width: "100%",
        }}
      >
        {steps.map((s) => (
          <div
            key={s.n}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              background: "white",
              border: `1px solid ${BEIGE}`,
              borderRadius: 24,
              padding: "28px 32px",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD_SOFT})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                fontFamily: "Cormorant Garamond, serif",
                fontWeight: 600,
                color: "white",
              }}
            >
              {s.n}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 28,
                  color: INK,
                  fontFamily: "Cormorant Garamond, serif",
                  fontWeight: 600,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: INK_SOFT,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {s.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 40,
          fontSize: 22,
          color: GOLD,
          letterSpacing: 5,
          fontFamily: "system-ui, sans-serif",
          textTransform: "uppercase",
        }}
      >
        BiKareBırak
      </div>
    </div>
  );
}

// 4) comparison (square)
function renderComparison() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        padding: "70px",
      }}
    >
      <BackgroundBase size="square" />

      <div
        style={{
          textAlign: "center",
          fontSize: 18,
          letterSpacing: 8,
          color: GOLD,
          fontFamily: "system-ui, sans-serif",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        Karşılaştırma
      </div>
      <div
        style={{
          textAlign: "center",
          fontSize: 56,
          fontFamily: "Cormorant Garamond, serif",
          color: INK,
          marginBottom: 30,
        }}
      >
        Geleneksel vs BiKareBırak
      </div>

      <div style={{ display: "flex", flex: 1, gap: 20 }}>
        {/* Sol — Geleneksel */}
        <div
          style={{
            flex: 1,
            background: "white",
            border: `2px solid ${ROSE_GOLD}30`,
            borderRadius: 28,
            padding: 28,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 14,
              letterSpacing: 6,
              color: ROSE_GOLD,
              textTransform: "uppercase",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Geleneksel
          </div>
          <div
            style={{
              fontSize: 30,
              fontFamily: "Cormorant Garamond, serif",
              color: INK,
              marginTop: 10,
              marginBottom: 20,
            }}
          >
            Dağınık
          </div>
          {[
            "WhatsApp grupları kaybolur",
            "Fotolar dağınık",
            "Profesyonel kaçırdı",
            "Premium hissi yok",
          ].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: 12,
                fontSize: 20,
                color: INK_SOFT,
                fontFamily: "system-ui, sans-serif",
                lineHeight: 1.3,
              }}
            >
              <div
                style={{
                  color: ROSE_GOLD,
                  marginRight: 10,
                  fontWeight: 700,
                }}
              >
                ✕
              </div>
              {t}
            </div>
          ))}
        </div>

        {/* Sağ — BiKareBırak */}
        <div
          style={{
            flex: 1,
            background: "white",
            border: `2px solid ${GOLD}`,
            borderRadius: 28,
            padding: 28,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 14,
              letterSpacing: 6,
              color: GOLD,
              textTransform: "uppercase",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            BiKareBırak
          </div>
          <div
            style={{
              fontSize: 30,
              fontFamily: "Cormorant Garamond, serif",
              color: INK,
              marginTop: 10,
              marginBottom: 20,
            }}
          >
            Tek Havuz
          </div>
          {[
            "Tüm fotolar tek dosya",
            "QR ile saniyede yükleme",
            "Profesyonelin kaçırdığı anlar",
            "Canlı projeksiyon galerisi",
          ].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: 12,
                fontSize: 20,
                color: INK,
                fontFamily: "system-ui, sans-serif",
                lineHeight: 1.3,
              }}
            >
              <div
                style={{
                  color: GOLD,
                  marginRight: 10,
                  fontWeight: 700,
                }}
              >
                ✓
              </div>
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 5) demo-invite (square) — Şevval & Abdurrahman'ı çerçeveli kart
async function renderDemoInvite(weddingDateIso: string | null) {
  let dateStr = "28 Ağustos 2026";
  if (weddingDateIso) {
    const d = new Date(weddingDateIso);
    dateStr = new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  }
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <BackgroundBase size="square" />

      {/* Kart */}
      <div
        style={{
          width: 760,
          height: 860,
          background: "white",
          borderRadius: 36,
          border: `2px solid ${GOLD}30`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 60,
          position: "relative",
        }}
      >
        {/* iç çift çerçeve */}
        <div
          style={{
            position: "absolute",
            inset: 18,
            borderRadius: 28,
            border: `1px solid ${BEIGE}`,
          }}
        />

        <div
          style={{
            fontSize: 18,
            letterSpacing: 10,
            color: GOLD,
            textTransform: "uppercase",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Evleniyoruz
        </div>

        <div
          style={{
            fontSize: 96,
            fontFamily: "Cormorant Garamond, serif",
            fontWeight: 600,
            lineHeight: 1.05,
            color: INK,
            marginTop: 28,
          }}
        >
          Abdurrahman
        </div>
        <div
          style={{
            fontSize: 56,
            color: GOLD,
            fontFamily: "Cormorant Garamond, serif",
            marginTop: 4,
          }}
        >
          &
        </div>
        <div
          style={{
            fontSize: 96,
            fontFamily: "Cormorant Garamond, serif",
            fontWeight: 600,
            lineHeight: 1.05,
            color: INK,
            marginTop: 4,
          }}
        >
          Şevval
        </div>

        <Divider width={100} />

        <div
          style={{
            fontSize: 24,
            color: INK_SOFT,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {dateStr}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 20,
            color: GOLD,
            letterSpacing: 4,
            fontFamily: "system-ui, sans-serif",
            textTransform: "uppercase",
          }}
        >
          BiKareBırak
        </div>
      </div>
    </div>
  );
}

// 6) testimonial (square)
function renderTestimonial() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: 100,
      }}
    >
      <BackgroundBase size="square" />

      <div style={{ fontSize: 200, color: `${GOLD}40`, lineHeight: 1 }}>“</div>

      <div
        style={{
          fontSize: 40,
          fontFamily: "Cormorant Garamond, serif",
          fontStyle: "italic",
          color: INK,
          textAlign: "center",
          lineHeight: 1.4,
          marginTop: -40,
          marginBottom: 40,
        }}
      >
        Düğün gecesi salondaki dev ekrana yansıyan galeride misafirlerin attığı
        fotoğrafları görmek müthişti. Bizim göremediğimiz onlarca anı yakalandı.
      </div>

      <div style={{ display: "flex", color: GOLD, fontSize: 32 }}>
        ★ ★ ★ ★ ★
      </div>

      <div
        style={{
          marginTop: 24,
          fontSize: 28,
          fontFamily: "Cormorant Garamond, serif",
          color: INK,
        }}
      >
        Ayşe & Burak
      </div>
      <div
        style={{
          fontSize: 18,
          color: INK_SOFT,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Eylül 2025 · Erken Kullanıcılarımızdan
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          fontSize: 22,
          color: GOLD,
          letterSpacing: 6,
          fontFamily: "system-ui, sans-serif",
          textTransform: "uppercase",
        }}
      >
        BiKareBırak
      </div>
    </div>
  );
}

// 7) gallery-preview (square) — dark mode masonry mockup
function renderGalleryPreview() {
  // 8 placeholder photo seed
  const tiles = [
    "g1",
    "g2",
    "g3",
    "g4",
    "g5",
    "g6",
    "g7",
    "g8",
  ];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#14110d",
        display: "flex",
        flexDirection: "column",
        padding: 60,
        position: "relative",
      }}
    >
      {/* başlık çubuğu */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 30,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 24,
            color: "white",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              background: ROSE_GOLD,
              marginRight: 12,
            }}
          />
          Canlı Galeri
        </div>
        <div
          style={{
            fontSize: 18,
            color: GOLD_SOFT,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          BiKareBırak
        </div>
      </div>

      <div
        style={{
          fontSize: 64,
          fontFamily: "Cormorant Garamond, serif",
          color: "white",
          marginBottom: 30,
        }}
      >
        Şevval & Abdurrahman
      </div>

      {/* grid 4x2 */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          flex: 1,
        }}
      >
        {tiles.map((t, i) => (
          <div
            key={t}
            style={{
              width: "calc(25% - 11px)",
              height: 220,
              background: `url(https://picsum.photos/seed/${t}/300/350)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// 8) feature-music (square)
function renderFeatureMusic() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: 80,
      }}
    >
      <BackgroundBase size="square" />

      <div
        style={{
          fontSize: 22,
          letterSpacing: 10,
          color: ROSE_GOLD,
          fontFamily: "system-ui, sans-serif",
          textTransform: "uppercase",
        }}
      >
        Premium Davetiye
      </div>

      <div
        style={{
          fontSize: 84,
          fontFamily: "Cormorant Garamond, serif",
          color: INK,
          textAlign: "center",
          marginTop: 16,
          marginBottom: 50,
        }}
      >
        Çiftin Şarkısı
      </div>

      {/* Player mockup */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          background: "white",
          border: `1px solid ${GOLD}50`,
          borderRadius: 999,
          padding: "22px 40px 22px 22px",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_SOFT})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 28,
          }}
        >
          ▶
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 14,
              color: GOLD,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Çiftin Şarkısı
          </div>
          <div
            style={{
              fontSize: 24,
              color: INK,
              fontFamily: "Cormorant Garamond, serif",
            }}
          >
            Sigur Rós — Hoppípolla
          </div>
        </div>
      </div>

      <div
        style={{
          fontSize: 26,
          color: INK_SOFT,
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          marginTop: 50,
          maxWidth: 700,
          lineHeight: 1.4,
        }}
      >
        Davetiye sayfanızda çalan kendi şarkınız — misafiriniz açar açmaz
        ortamın atmosferine girer.
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          fontSize: 22,
          color: GOLD,
          letterSpacing: 6,
          fontFamily: "system-ui, sans-serif",
          textTransform: "uppercase",
        }}
      >
        BiKareBırak
      </div>
    </div>
  );
}

// 9) hero-story (1080×1920)
function renderHeroStory() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: 100,
      }}
    >
      <BackgroundBase size="story" />

      <div
        style={{
          fontSize: 26,
          letterSpacing: 14,
          color: GOLD,
          fontFamily: "system-ui, sans-serif",
          textTransform: "uppercase",
        }}
      >
        Evleniyoruz
      </div>

      <div
        style={{
          fontSize: 130,
          fontFamily: "Cormorant Garamond, serif",
          fontWeight: 600,
          color: INK,
          textAlign: "center",
          lineHeight: 1.05,
          marginTop: 60,
        }}
      >
        Düğününüzün
      </div>
      <div
        style={{
          fontSize: 130,
          fontFamily: "Cormorant Garamond, serif",
          fontWeight: 600,
          color: INK,
          textAlign: "center",
          lineHeight: 1.05,
        }}
      >
        her karesi
      </div>
      <div
        style={{
          fontSize: 130,
          fontFamily: "Cormorant Garamond, serif",
          fontWeight: 600,
          color: GOLD,
          textAlign: "center",
          lineHeight: 1.05,
          marginTop: 10,
        }}
      >
        tek havuzda.
      </div>

      <Divider width={150} />

      <div
        style={{
          fontSize: 36,
          color: INK_SOFT,
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          lineHeight: 1.4,
          maxWidth: 800,
        }}
      >
        Premium dijital düğün asistanı
      </div>

      <div
        style={{
          marginTop: 80,
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: `linear-gradient(135deg, ${GOLD}, ${GOLD_SOFT})`,
          color: "white",
          padding: "26px 50px",
          borderRadius: 999,
          fontSize: 32,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        💬 WhatsApp'tan Bilgi Al
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 100,
          fontSize: 32,
          color: GOLD,
          letterSpacing: 8,
          fontFamily: "system-ui, sans-serif",
          textTransform: "uppercase",
        }}
      >
        BiKareBırak
      </div>
    </div>
  );
}

// 10) countdown-story (1080×1920)
function renderCountdownStory(weddingDateIso: string | null) {
  let days = 90;
  let dateStr = "28 Ağustos 2026";
  if (weddingDateIso) {
    const d = new Date(weddingDateIso);
    days = Math.max(
      0,
      Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    );
    dateStr = new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  }
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: 80,
      }}
    >
      <BackgroundBase size="story" />

      <div
        style={{
          display: "flex",
          fontSize: 28,
          letterSpacing: 14,
          color: GOLD,
          fontFamily: "system-ui, sans-serif",
          textTransform: "uppercase",
        }}
      >
        Düğüne Az Kaldı
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 84,
          fontFamily: "Cormorant Garamond, serif",
          color: INK,
          marginTop: 60,
        }}
      >
        Şevval
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 52,
          color: GOLD,
          fontFamily: "Cormorant Garamond, serif",
        }}
      >
        &
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 84,
          fontFamily: "Cormorant Garamond, serif",
          color: INK,
        }}
      >
        Abdurrahman
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 60,
          fontSize: 320,
          fontFamily: "Cormorant Garamond, serif",
          fontWeight: 600,
          color: GOLD,
        }}
      >
        {String(days)}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 50,
          color: INK_SOFT,
          fontFamily: "system-ui, sans-serif",
          marginTop: 10,
        }}
      >
        gün kaldı
      </div>

      <Divider width={120} />

      <div
        style={{
          display: "flex",
          fontSize: 36,
          color: INK,
          fontFamily: "Cormorant Garamond, serif",
        }}
      >
        {dateStr}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 100,
          display: "flex",
          fontSize: 28,
          color: GOLD,
          letterSpacing: 8,
          fontFamily: "system-ui, sans-serif",
          textTransform: "uppercase",
        }}
      >
        BiKareBırak
      </div>
    </div>
  );
}

// 11) qr-story (1080×1920) — masa kartı tarzı
function renderQrStory() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: 100,
      }}
    >
      <BackgroundBase size="story" />

      <div
        style={{
          display: "flex",
          fontSize: 26,
          letterSpacing: 12,
          color: GOLD,
          fontFamily: "system-ui, sans-serif",
          textTransform: "uppercase",
        }}
      >
        Masadaki QR
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 80,
          fontFamily: "Cormorant Garamond, serif",
          color: INK,
          marginTop: 30,
        }}
      >
        Anılarınızı
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 80,
          fontFamily: "Cormorant Garamond, serif",
          color: GOLD,
          marginBottom: 50,
        }}
      >
        Paylaşın
      </div>

      {/* Sahte QR kasası — köşe süslemeli kart */}
      <div
        style={{
          width: 520,
          height: 520,
          background: "white",
          border: `4px solid ${GOLD}`,
          borderRadius: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 200,
            color: INK,
            fontFamily: "system-ui, sans-serif",
            fontWeight: 700,
          }}
        >
          ▦
        </div>
        {/* Köşe işaretleri */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            width: 60,
            height: 60,
            borderTop: `4px solid ${INK}`,
            borderLeft: `4px solid ${INK}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 40,
            width: 60,
            height: 60,
            borderTop: `4px solid ${INK}`,
            borderRight: `4px solid ${INK}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 40,
            width: 60,
            height: 60,
            borderBottom: `4px solid ${INK}`,
            borderLeft: `4px solid ${INK}`,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 36,
          color: INK,
          fontFamily: "system-ui, sans-serif",
          marginTop: 60,
        }}
      >
        Karekodu okutun
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 26,
          color: INK_SOFT,
          fontFamily: "system-ui, sans-serif",
          marginTop: 12,
        }}
      >
        Uygulama yok · Üyelik yok · Şifre yok
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 100,
          display: "flex",
          fontSize: 28,
          color: GOLD,
          letterSpacing: 8,
          fontFamily: "system-ui, sans-serif",
          textTransform: "uppercase",
        }}
      >
        BiKareBırak
      </div>
    </div>
  );
}

// 12) feature-story-story (1080×1920) — Bizim Hikayemiz
function renderFeatureStory() {
  const items = [
    { date: "Haziran 2018", title: "Tanıştık" },
    { date: "Temmuz 2021", title: "Birlikte yaşadık" },
    { date: "Aralık 2024", title: "Nişanlandık" },
    { date: "Ağustos 2026", title: "Evleniyoruz" },
  ];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        padding: "120px 80px",
      }}
    >
      <BackgroundBase size="story" />

      <div
        style={{
          fontSize: 26,
          letterSpacing: 12,
          color: GOLD,
          fontFamily: "system-ui, sans-serif",
          textTransform: "uppercase",
        }}
      >
        Premium Davetiye
      </div>
      <div
        style={{
          fontSize: 100,
          fontFamily: "Cormorant Garamond, serif",
          color: INK,
          marginTop: 16,
          marginBottom: 80,
          textAlign: "center",
          lineHeight: 1.05,
        }}
      >
        Bizim Hikayemiz
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 40,
          width: "100%",
        }}
      >
        {items.map((it) => (
          <div
            key={it.date}
            style={{ display: "flex", alignItems: "center", gap: 32 }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                background: ROSE_GOLD,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 30,
                flexShrink: 0,
              }}
            >
              ♥
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 20,
                  color: GOLD,
                  letterSpacing: 5,
                  textTransform: "uppercase",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {it.date}
              </div>
              <div
                style={{
                  fontSize: 44,
                  fontFamily: "Cormorant Garamond, serif",
                  color: INK,
                  marginTop: 6,
                }}
              >
                {it.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 80,
          fontSize: 28,
          color: GOLD,
          letterSpacing: 8,
          fontFamily: "system-ui, sans-serif",
          textTransform: "uppercase",
        }}
      >
        BiKareBırak
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Variant ↔ renderer mapping
// ------------------------------------------------------------
async function renderVariant(
  variant: string,
  weddingDateIso: string | null
): Promise<React.ReactElement | null> {
  switch (variant) {
    case "hero":
      return renderHero();
    case "pricing":
      return renderPricing();
    case "how-it-works":
      return renderHowItWorks();
    case "comparison":
      return renderComparison();
    case "demo-invite":
      return await renderDemoInvite(weddingDateIso);
    case "testimonial":
      return renderTestimonial();
    case "gallery-preview":
      return renderGalleryPreview();
    case "feature-music":
      return renderFeatureMusic();
    case "hero-story":
      return renderHeroStory();
    case "countdown-story":
      return renderCountdownStory(weddingDateIso);
    case "qr-story":
      return renderQrStory();
    case "feature-story-story":
      return renderFeatureStory();
    default:
      return null;
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ variant: string }> }
) {
  const { variant } = await params;
  const url = new URL(request.url);
  const size = sizeFromVariant(variant, url.searchParams.get("size"));

  // Şevval & Abdurrahman çiftinin tarihini Firestore'dan çek (countdown + demo-invite için)
  let weddingDateIso: string | null = null;
  if (variant === "countdown-story" || variant === "demo-invite") {
    const couple = await getCoupleBySlug("sevval-abdurrahman");
    weddingDateIso = couple?.wedding_date ?? null;
  }

  const element = await renderVariant(variant, weddingDateIso);
  if (!element) {
    return new Response("Variant bulunamadı", { status: 404 });
  }

  const fontData = await loadFont();
  const [width, height] = size === "story" ? [1080, 1920] : [1080, 1080];

  return new ImageResponse(element, {
    width,
    height,
    fonts: [
      {
        name: "Cormorant Garamond",
        data: fontData,
        weight: 600,
        style: "normal",
      },
    ],
  });
}

