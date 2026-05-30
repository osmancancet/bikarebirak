#!/usr/bin/env node
/**
 * BiKareBırak — tek görsel Instagram Story collage.
 *
 * 6 sayfanın mobil ekran görüntülerini tek 1080×1920 görsele
 * 2×3 grid telefon mockup'ı olarak yerleştirir.
 *
 * Önce /tmp/bkb-mocks/*-raw.png arar. Yoksa veya --refresh verilirse,
 * Playwright ile yeniden ekran görüntüsü alır.
 *
 * Kullanım:
 *   node scripts/make-story-collage.mjs            # cache varsa kullan
 *   node scripts/make-story-collage.mjs --refresh  # ekran görüntülerini yeniden al
 *
 * Çıktı:
 *   ~/Desktop/bikarebirak-story-collage.png
 */

import { chromium, devices } from "playwright";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { homedir } from "os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const REFRESH = args.includes("--refresh");

const BASE_URL =
  process.env.BASE_URL ?? "https://bikarebirak-shuj.vercel.app";
const TMP = "/tmp/bkb-mocks";
const OUT_FILE = join(homedir(), "Desktop", "bikarebirak-story-collage.png");

const MOBILE_W = 432;
const MOBILE_H = 768;
const FINAL_W = 1080;
const FINAL_H = 1920;

const CREAM = "#fdfbf7";
const GOLD = "#c2a14d";
const INK = "#3b362f";

const PAGES = [
  {
    name: "1-landing",
    url: "/",
    label: "ANA SAYFA",
    subLabel: "Tüm hizmetler tek sayfada",
    scroll: 0,
  },
  {
    name: "2-davetiye-ornek",
    url: "/ornek",
    label: "DAVETİYE",
    subLabel: "Geri sayım + mekan + LCV",
    scroll: 200,
  },
  {
    name: "3-sevval-abdurrahman",
    url: "/sevval-abdurrahman",
    label: "ÇİFTİNİZE ÖZEL",
    subLabel: "Kendi davetiye sayfanız",
    scroll: 0,
  },
  {
    name: "4-yukle",
    url: "/sevval-abdurrahman/yukle",
    label: "MİSAFİR YÜKLEMESİ",
    subLabel: "Uygulama yok, tek dokunuş",
    scroll: 0,
  },
  {
    name: "5-galeri",
    url: "/",
    label: "CANLI GALERİ",
    subLabel: "Salondaki ekrana yansır",
    scroll: 0,
    selectorScroll: "section.bg-\\[\\#0f0d0a\\]",
  },
  {
    name: "6-fiyat",
    url: "/",
    label: "ANAHTAR TESLİM",
    subLabel: "5.000 ₺ · Tek seferlik ödeme",
    scroll: 0,
    selectorScroll: "#fiyat",
  },
];

// XML/HTML-safe text
function xml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function screenshotPage(browser, page, outPath) {
  const ctx = await browser.newContext({
    ...devices["iPhone 14 Pro"],
    viewport: { width: MOBILE_W, height: MOBILE_H },
    screen: { width: MOBILE_W, height: MOBILE_H },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const p = await ctx.newPage();
  await p.goto(`${BASE_URL}${page.url}`, { waitUntil: "domcontentloaded" });
  await p.waitForLoadState("load", { timeout: 20000 });
  await p.waitForTimeout(1500);
  if (page.selectorScroll) {
    await p.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
    }, page.selectorScroll);
    await p.waitForTimeout(600);
  } else if (page.scroll) {
    await p.evaluate((y) => window.scrollTo(0, y), page.scroll);
    await p.waitForTimeout(500);
  }
  await p.screenshot({ path: outPath, type: "png", fullPage: false });
  await p.close();
  await ctx.close();
}

function pngToDataUrl(path) {
  const buf = readFileSync(path);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

function buildCollageHtml(phones, fontDataUrl) {
  const phonesHtml = phones
    .map(
      (p) => `
    <div class="cell">
      <div class="phone">
        <div class="phone-inner">
          <div class="phone-screen" style="background-image:url('${p.dataUrl}')">
            <div class="island"></div>
          </div>
        </div>
      </div>
      <div class="cell-label">${xml(p.label)}</div>
    </div>`
    )
    .join("");

  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8"/>
<style>
  @font-face {
    font-family: 'CormorantBrand';
    src: url('${fontDataUrl}') format('woff');
    font-weight: 600;
    font-display: block;
  }
  html, body { margin: 0; padding: 0; }
  body {
    width: ${FINAL_W}px; height: ${FINAL_H}px;
    background:
      radial-gradient(ellipse at 50% 25%, #ffffff 0%, ${CREAM} 45%, #efe4cf 100%);
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: ${INK};
    overflow: hidden;
    position: relative;
  }

  /* Köşe altın aksanları */
  .corner {
    position: absolute; width: 88px; height: 88px;
    border: 1.5px solid ${GOLD};
  }
  .corner.tl { top: 56px; left: 56px; border-right: none; border-bottom: none; }
  .corner.tr { top: 56px; right: 56px; border-left: none; border-bottom: none; }
  .corner.bl { bottom: 56px; left: 56px; border-right: none; border-top: none; }
  .corner.br { bottom: 56px; right: 56px; border-left: none; border-top: none; }

  /* Üst marka */
  header {
    position: absolute; top: 100px; left: 0; right: 0;
    text-align: center;
  }
  .wordmark {
    display: inline-flex; align-items: center; gap: 28px;
    font-family: 'CormorantBrand', Georgia, serif;
    font-style: italic;
    font-size: 56px;
    color: ${GOLD};
    letter-spacing: 0.5px;
  }
  .wordmark::before, .wordmark::after {
    content: ''; display: block; width: 70px; height: 1px;
    background: linear-gradient(90deg, transparent, ${GOLD}, transparent);
  }
  .tagline {
    margin-top: 18px;
    font-family: 'CormorantBrand', Georgia, serif;
    font-size: 34px;
    color: ${INK};
    letter-spacing: 0.3px;
  }
  .subline {
    margin-top: 6px;
    font-size: 18px;
    color: #6f675b;
    letter-spacing: 4px;
    text-transform: uppercase;
  }

  /* Grid */
  .grid {
    position: absolute;
    top: 320px;
    left: 0; right: 0;
    display: grid;
    grid-template-columns: repeat(2, 220px);
    grid-template-rows: repeat(3, auto);
    justify-content: center;
    column-gap: 84px;
    row-gap: 28px;
  }
  .cell { text-align: center; }

  /* Telefon — 9:16 oranı */
  .phone {
    width: 220px;
    height: 390px;
    border-radius: 36px;
    background: linear-gradient(180deg, #2a2522, #1a1714 50%, #2a2522);
    padding: 6px;
    box-shadow:
      0 18px 38px rgba(0,0,0,0.22),
      0 0 0 1px rgba(255,255,255,0.04) inset;
  }
  .phone-inner {
    width: 100%; height: 100%;
    border-radius: 30px;
    background: #0a0907;
    padding: 4px;
    box-sizing: border-box;
  }
  .phone-screen {
    width: 100%; height: 100%;
    border-radius: 26px;
    background-size: cover;
    background-position: top center;
    background-repeat: no-repeat;
    position: relative;
    overflow: hidden;
  }
  .island {
    position: absolute; top: 8px; left: 50%; transform: translateX(-50%);
    width: 64px; height: 16px;
    background: #0a0907;
    border-radius: 10px;
  }
  .cell-label {
    margin-top: 10px;
    font-size: 14px;
    color: ${GOLD};
    letter-spacing: 3px;
    font-weight: 600;
  }

  /* Footer */
  footer {
    position: absolute; bottom: 100px; left: 0; right: 0;
    text-align: center;
  }
  .footer-line {
    display: inline-block;
    width: 240px; height: 1px;
    background: linear-gradient(90deg, transparent, ${GOLD}, transparent);
    margin-bottom: 16px;
  }
  .domain {
    font-size: 24px;
    color: ${GOLD};
    letter-spacing: 6px;
    font-weight: 600;
  }
  .cta {
    margin-top: 10px;
    font-size: 15px;
    color: #6f675b;
    letter-spacing: 2.5px;
  }
</style>
</head>
<body>
  <div class="corner tl"></div>
  <div class="corner tr"></div>
  <div class="corner bl"></div>
  <div class="corner br"></div>

  <header>
    <div class="wordmark">BiKareBırak</div>
    <div class="tagline">Düğününüzün her karesi, tek havuzda.</div>
    <div class="subline">Dijital Düğün Asistanı</div>
  </header>

  <div class="grid">
    ${phonesHtml}
  </div>

  <footer>
    <div class="footer-line"></div>
    <div class="domain">BİKAREBIRAK.COM</div>
    <div class="cta">WHATSAPP'TAN İLETİŞİM</div>
  </footer>
</body>
</html>`;
}

async function main() {
  if (!existsSync(TMP)) mkdirSync(TMP, { recursive: true });

  console.log(`🖼  Story Collage üretici — ${PAGES.length} sayfa → 1 görsel`);
  console.log(`   Çıktı: ${OUT_FILE}\n`);

  const browser = await chromium.launch({ headless: true });

  // 1) Raw ekran görüntüleri (cache varsa kullan)
  for (const page of PAGES) {
    const path = join(TMP, `${page.name}-raw.png`);
    if (existsSync(path) && !REFRESH) {
      console.log(`♻️  [${page.name}] cache'ten`);
    } else {
      console.log(`🎬 [${page.name}] → ${page.url}`);
      await screenshotPage(browser, page, path);
    }
  }

  // 2) Font'u data URL olarak yükle
  const fontPath = join(
    __dirname,
    "..",
    "public",
    "fonts",
    "cormorant-garamond-600.woff"
  );
  const fontDataUrl = `data:font/woff;base64,${readFileSync(fontPath).toString("base64")}`;

  // 3) Her sayfa için data URL hazırla
  const phones = PAGES.map((p) => ({
    label: p.label,
    dataUrl: pngToDataUrl(join(TMP, `${p.name}-raw.png`)),
  }));

  // 4) Collage HTML'ini render et
  const html = buildCollageHtml(phones, fontDataUrl);
  const htmlPath = join(TMP, "collage.html");
  writeFileSync(htmlPath, html, "utf8");

  console.log(`\n🎨 Collage render ediliyor (1080×1920)...`);
  const ctx = await browser.newContext({
    viewport: { width: FINAL_W, height: FINAL_H },
    deviceScaleFactor: 1,
  });
  const p = await ctx.newPage();
  await p.goto(`file://${htmlPath}`);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({
    path: OUT_FILE,
    type: "png",
    fullPage: false,
    clip: { x: 0, y: 0, width: FINAL_W, height: FINAL_H },
  });
  await p.close();
  await ctx.close();
  await browser.close();

  console.log(`\n✅ Story collage hazır:`);
  console.log(`   ${OUT_FILE}`);
  console.log(`   1080×1920 · Instagram Story uyumlu`);
  console.log(`\n   📲 Galeriye sürükle → Instagram Story → yükle.\n`);
}

main().catch((err) => {
  console.error("HATA:", err);
  process.exit(1);
});
