#!/usr/bin/env node
/**
 * BiKareBırak mobil paylaşım mockup üretici
 *
 * 6 sayfa × 2 stil = 12 PNG, hepsi 1080×1920 (Instagram Story / Reel uyumlu).
 *
 *   1) raw-*.png       — sayfanın temiz mobil ekran görüntüsü (full bleed)
 *   2) mockup-*.png    — krem markalı arka plan + telefon çerçevesi + ekran
 *
 * Kullanım:
 *   node scripts/make-mockups.mjs
 *
 * Çıktı:
 *   ~/Desktop/bikarebirak-mocks/
 */

import { chromium, devices } from "playwright";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync, mkdirSync, writeFileSync, unlinkSync, readFileSync } from "fs";
import { homedir } from "os";
import ffmpegPath from "ffmpeg-static";

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_URL = process.env.BASE_URL ?? "https://bikarebirak-shuj.vercel.app";
const OUT_DIR = join(homedir(), "Desktop", "bikarebirak-mocks");

const MOBILE_W = 432;
const MOBILE_H = 768;
const FINAL_W = 1080;
const FINAL_H = 1920;

// --- Marka renkleri (api/social ile uyumlu) ---
const CREAM = "#fdfbf7";
const GOLD = "#c2a14d";
const INK = "#3b362f";

// --- Sahneler ---
const PAGES = [
  {
    name: "1-landing",
    url: "/",
    label: "BiKareBırak",
    sublabel: "Dijital Düğün Asistanı",
    scroll: 0,
  },
  {
    name: "2-davetiye-ornek",
    url: "/ornek",
    label: "Örnek Davetiye",
    sublabel: "Geri sayım + mekan + LCV",
    scroll: 200,
  },
  {
    name: "3-sevval-abdurrahman",
    url: "/sevval-abdurrahman",
    label: "Şevval & Abdurrahman",
    sublabel: "28 Ağustos 2026",
    scroll: 0,
  },
  {
    name: "4-yukle",
    url: "/sevval-abdurrahman/yukle",
    label: "Anılarınızı Paylaşın",
    sublabel: "Tek dokunuş, üyelik yok",
    scroll: 0,
  },
  {
    name: "5-galeri",
    url: "/",
    label: "Canlı Galeri",
    sublabel: "Salondaki ekrana yansır",
    scroll: 2400,
    selectorScroll: "section.bg-\\[\\#0f0d0a\\]",
  },
  {
    name: "6-fiyat",
    url: "/",
    label: "Anahtar Teslim",
    sublabel: "5.000 ₺ · Tek seferlik",
    scroll: 0,
    selectorScroll: "#fiyat",
  },
];

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const p = spawn(ffmpegPath, args, { stdio: ["inherit", "pipe", "pipe"] });
    let stderr = "";
    p.stderr?.on("data", (d) => (stderr += d.toString()));
    p.on("error", reject);
    p.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exit ${code}: ${stderr.slice(-400)}`));
    });
  });
}

// XML-safe text (SVG için)
function xml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Telefon çerçeveli mockup için HTML belgesi üretir (Playwright render eder)
// Cormorant Garamond brand serif font + rafine altın detaylar + Dynamic Island bezel.
function buildMockupHtml(label, sublabel, fontDataUrl) {
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
      radial-gradient(ellipse at 50% 30%, #ffffff 0%, ${CREAM} 50%, #f3ead7 100%);
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: ${INK};
    overflow: hidden;
    position: relative;
  }

  /* Köşe altın aksanları */
  .corner {
    position: absolute; width: 96px; height: 96px;
    border: 1.5px solid ${GOLD};
  }
  .corner.tl { top: 64px; left: 64px; border-right: none; border-bottom: none; }
  .corner.tr { top: 64px; right: 64px; border-left: none; border-bottom: none; }
  .corner.bl { bottom: 64px; left: 64px; border-right: none; border-top: none; }
  .corner.br { bottom: 64px; right: 64px; border-left: none; border-top: none; }

  /* Üst wordmark */
  .brand {
    position: absolute; top: 140px; left: 50%; transform: translateX(-50%);
    display: flex; align-items: center; gap: 28px;
    font-family: 'CormorantBrand', Georgia, serif;
    font-style: italic;
    font-size: 38px;
    letter-spacing: 0.5px;
    color: ${GOLD};
  }
  .brand::before, .brand::after {
    content: ''; display: block; width: 60px; height: 1px;
    background: linear-gradient(90deg, transparent, ${GOLD}, transparent);
  }

  /* Telefon */
  .phone {
    position: absolute; top: 232px; left: 50%; transform: translateX(-50%);
    width: 632px; height: 1296px;
    border-radius: 72px;
    background: linear-gradient(180deg, #2a2522 0%, #1a1714 50%, #2a2522 100%);
    padding: 12px;
    box-shadow:
      0 30px 80px rgba(0,0,0,0.25),
      0 0 0 1px rgba(255,255,255,0.04) inset,
      0 -1px 0 rgba(255,255,255,0.06) inset;
  }
  .phone-inner {
    width: 100%; height: 100%;
    border-radius: 60px;
    background: #0a0907;
    padding: 10px;
    position: relative;
    overflow: hidden;
  }
  .screen {
    width: 100%; height: 100%;
    border-radius: 52px;
    background: #fdfbf7;
    overflow: hidden;
    position: relative;
  }
  /* Dynamic Island */
  .island {
    position: absolute; top: 18px; left: 50%; transform: translateX(-50%);
    width: 116px; height: 32px;
    background: #0a0907;
    border-radius: 20px;
    z-index: 10;
  }

  /* Alt etiketler */
  .label {
    position: absolute; bottom: 220px; left: 50%; transform: translateX(-50%);
    font-family: 'CormorantBrand', Georgia, serif;
    font-size: 64px;
    font-weight: 600;
    color: ${INK};
    letter-spacing: 0.2px;
    white-space: nowrap;
  }
  .sublabel {
    position: absolute; bottom: 168px; left: 50%; transform: translateX(-50%);
    font-size: 26px;
    color: #6f675b;
    letter-spacing: 1.5px;
    white-space: nowrap;
  }

  /* Alt çift altın çizgi + domain */
  .footer {
    position: absolute; bottom: 96px; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 14px;
  }
  .footer::before {
    content: '';
    width: 220px; height: 1px;
    background: linear-gradient(90deg, transparent, ${GOLD}, transparent);
  }
  .domain {
    font-size: 22px;
    color: ${GOLD};
    letter-spacing: 5px;
    font-weight: 600;
  }
</style>
</head>
<body>
  <div class="corner tl"></div>
  <div class="corner tr"></div>
  <div class="corner bl"></div>
  <div class="corner br"></div>

  <div class="brand">BiKareBırak</div>

  <div class="phone">
    <div class="phone-inner">
      <div class="screen">
        <div class="island"></div>
        <!-- screen content (mobil ekran görüntüsü) buraya ffmpeg ile bindirilecek -->
      </div>
    </div>
  </div>

  <div class="label">${xml(label)}</div>
  <div class="sublabel">${xml(sublabel)}</div>

  <div class="footer">
    <div class="domain">BİKAREBIRAK.COM</div>
  </div>
</body>
</html>`;
}

async function screenshotPage(browser, page, outRaw) {
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

  // Sahneye özel scroll
  if (page.selectorScroll) {
    await p.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
    }, page.selectorScroll);
    await p.waitForTimeout(800);
  } else if (page.scroll) {
    await p.evaluate((y) => window.scrollTo(0, y), page.scroll);
    await p.waitForTimeout(600);
  }

  // Mobil viewport ekran görüntüsü
  await p.screenshot({ path: outRaw, type: "png", fullPage: false });
  await p.close();
  await ctx.close();
}

// Raw screenshot'ı 1080x1920'ye upscale et (full-bleed Story)
async function upscaleRaw(rawPath, outPath) {
  await runFfmpeg([
    "-y",
    "-i",
    rawPath,
    "-vf",
    `scale=${FINAL_W}:${FINAL_H}:flags=lanczos`,
    "-frames:v",
    "1",
    outPath,
  ]);
}

// HTML+CSS arka planı render edip raw ekran görüntüsünü telefon ekranına bindir
async function buildMockup(label, sublabel, rawPath, outPath, tmpDir, fontDataUrl) {
  // 1) HTML şablonunu Playwright ile render et (CSS, web font, gradient, shadow)
  const html = buildMockupHtml(label, sublabel, fontDataUrl);
  const htmlPath = join(tmpDir, "bg.html");
  const bgPng = join(tmpDir, "bg.png");
  writeFileSync(htmlPath, html, "utf8");

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: FINAL_W, height: FINAL_H },
    deviceScaleFactor: 1,
  });
  const p = await ctx.newPage();
  await p.goto(`file://${htmlPath}`);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({
    path: bgPng,
    type: "png",
    fullPage: false,
    clip: { x: 0, y: 0, width: FINAL_W, height: FINAL_H },
  });
  await p.close();
  await ctx.close();
  await browser.close();

  // 2) Raw screenshot'ı telefon ekran alanına bindir.
  //    Yeni telefon koordinatları (HTML şablonundan):
  //    phone: top=232, left=224, w=632, h=1296, padding=12 + inner padding=10
  //    → screen alanı: x=224+22=246, y=232+22=254, w=632-44=588, h=1296-44=1252
  await runFfmpeg([
    "-y",
    "-i",
    bgPng,
    "-i",
    rawPath,
    "-filter_complex",
    "[1:v]scale=588:1252:flags=lanczos[ph];[0:v][ph]overlay=246:254",
    "-frames:v",
    "1",
    outPath,
  ]);
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  const tmp = "/tmp/bkb-mocks";
  if (!existsSync(tmp)) mkdirSync(tmp, { recursive: true });

  // Brand font'u base64 data URL olarak yükle (HTML şablonunda @font-face)
  const fontPath = join(
    __dirname,
    "..",
    "public",
    "fonts",
    "cormorant-garamond-600.woff"
  );
  const fontBase64 = readFileSync(fontPath).toString("base64");
  const fontDataUrl = `data:font/woff;base64,${fontBase64}`;

  console.log(`📸 BiKareBırak Mockup üretici`);
  console.log(`   ${PAGES.length} sayfa × 2 stil = ${PAGES.length * 2} PNG`);
  console.log(`   Mobil viewport: ${MOBILE_W}×${MOBILE_H} (Tailwind <sm:)`);
  console.log(`   Brand font: Cormorant Garamond 600 (data URL)`);
  console.log(`   Çıktı: ${OUT_DIR}\n`);

  const browser = await chromium.launch({ headless: true });

  for (const page of PAGES) {
    console.log(`🎬 [${page.name}] → ${page.url}`);
    const rawScreenshot = join(tmp, `${page.name}-raw.png`);
    await screenshotPage(browser, page, rawScreenshot);

    // 1) Full bleed Story (1080×1920)
    const outRaw = join(OUT_DIR, `raw-${page.name}.png`);
    await upscaleRaw(rawScreenshot, outRaw);
    console.log(`   ✓ raw-${page.name}.png`);

    // 2) Telefon çerçeveli mockup
    const outMockup = join(OUT_DIR, `mockup-${page.name}.png`);
    await buildMockup(
      page.label,
      page.sublabel,
      rawScreenshot,
      outMockup,
      tmp,
      fontDataUrl
    );
    console.log(`   ✓ mockup-${page.name}.png`);
  }

  await browser.close();

  console.log(`\n✅ ${PAGES.length * 2} mockup hazır:`);
  console.log(`   ${OUT_DIR}`);
  console.log(`\n   • raw-*.png   — Story full bleed (direkt yükle)`);
  console.log(`   • mockup-*.png — Telefon çerçeveli, markalı arka plan\n`);
}

main().catch((err) => {
  console.error("HATA:", err);
  process.exit(1);
});
