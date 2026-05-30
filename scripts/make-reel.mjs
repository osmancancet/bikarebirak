#!/usr/bin/env node
/**
 * BiKareBırak Instagram Reel üretici (seslendirmeli)
 *
 * 1080×1920 (9:16), ~30 sn, ElevenLabs TR seslendirmesi + .srt altyazı.
 *
 * Kullanım:
 *   node scripts/make-reel.mjs                 # default reel ('her-kare')
 *   node scripts/make-reel.mjs --reel her-kare
 *   node scripts/make-reel.mjs --silent        # VO atla, sadece sessiz video
 *
 * Gerekli env:
 *   ELEVENLABS_API_KEY=...      (yoksa --silent moduna düşer)
 *
 * İsteğe bağlı env:
 *   BASE_URL=https://...        (default: prod URL)
 *   ELEVENLABS_VOICE_ID=...     (override; default JSON'dan)
 *
 * Çıktı:
 *   ~/Desktop/bikarebirak-reel.mp4
 *   ~/Desktop/bikarebirak-reel.srt
 */

import { chromium, devices } from "playwright";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  existsSync,
  mkdirSync,
  unlinkSync,
  writeFileSync,
  readFileSync,
} from "fs";
import { homedir } from "os";
import ffmpegPath from "ffmpeg-static";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// --- CLI args ---
const args = process.argv.slice(2);
const argVal = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : null;
};
const REEL_ID = argVal("--reel") ?? "her-kare";
const SILENT_MODE = args.includes("--silent");
const REUSE_VIDEO = args.includes("--reuse-video"); // mevcut /tmp kayıtlarını yeniden kullan

// --- Config ---
const BASE_URL = process.env.BASE_URL ?? "https://bikarebırak.com";
const TMP_DIR = "/tmp/bkb-reel";
const FINAL_MP4 = join(homedir(), "Desktop", "bikarebirak-reel.mp4");
const FINAL_SRT = join(homedir(), "Desktop", "bikarebirak-reel.srt");

// --- Load scenarios from JSON (single source of truth, shared with /admin/medya) ---
const scenariosPath = join(ROOT, "src", "data", "reel-scenarios.json");
const SCENARIOS = JSON.parse(readFileSync(scenariosPath, "utf8"));
const REEL = SCENARIOS.reels.find((r) => r.id === REEL_ID);
if (!REEL) {
  console.error(`HATA: '${REEL_ID}' reel'i bulunamadı. Mevcut: ${SCENARIOS.reels.map((r) => r.id).join(", ")}`);
  process.exit(1);
}

const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? SCENARIOS.elevenlabs.voiceId;
const VO_ENABLED = !SILENT_MODE && !!ELEVENLABS_KEY;

// --- Helpers ---
function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const p = spawn(ffmpegPath, args, { stdio: "inherit" });
    p.on("error", reject);
    p.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exit ${code}`));
    });
  });
}

function srtTimestamp(sec) {
  const h = Math.floor(sec / 3600).toString().padStart(2, "0");
  const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  const ms = Math.floor((sec - Math.floor(sec)) * 1000).toString().padStart(3, "0");
  return `${h}:${m}:${s},${ms}`;
}

// --- ElevenLabs TTS ---
async function synthesizeScene(scene, outPath) {
  console.log(`   🔊 VO: "${scene.voiceover.slice(0, 50)}..."`);
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": ELEVENLABS_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: scene.voiceover,
      model_id: SCENARIOS.elevenlabs.model,
      voice_settings: SCENARIOS.elevenlabs.voiceSettings,
    }),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`ElevenLabs ${res.status}: ${errBody.slice(0, 200)}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(outPath, buf);
}

// --- Mobile viewport: Tailwind responsive breakpoints (md: ≥768, lg: ≥1024)
//     altında kalmak için 9:16 mobil boyutu seçiyoruz. ffmpeg sonra 1080x1920'ye upscale eder.
const MOBILE_W = 432;
const MOBILE_H = 768;

// --- Scene recording (Playwright) ---
async function recordScene(scene) {
  const sceneDir = join(TMP_DIR, scene.name);
  if (!existsSync(sceneDir)) mkdirSync(sceneDir, { recursive: true });

  const durationMs = (scene.endSec - scene.startSec) * 1000;
  console.log(`\n🎬 [${scene.name}] ${scene.endSec - scene.startSec}sn → ${scene.url}`);

  const iPhone = devices["iPhone 14 Pro"];
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...iPhone,
    viewport: { width: MOBILE_W, height: MOBILE_H },
    screen: { width: MOBILE_W, height: MOBILE_H },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    recordVideo: {
      dir: sceneDir,
      size: { width: MOBILE_W, height: MOBILE_H },
    },
  });

  const page = await context.newPage();
  await page.goto(`${BASE_URL}${scene.url}`, { waitUntil: "domcontentloaded" });

  // Senaryo başına özel aksiyon (scroll vb.) gerekirse burada eklenebilir.
  // Şimdilik sahnenin tam süresi kadar bekliyoruz.
  await page.waitForLoadState("load", { timeout: 20000 });

  // Sahneye özel scroll davranışı (basit kural-bazlı)
  if (scene.url.includes("/ornek")) {
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: "smooth" }));
  } else if (scene.url === "/" && scene.name.includes("galeri")) {
    await page.evaluate(() => {
      const el = document.querySelector('section.bg-\\[\\#0f0d0a\\]');
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 2400, behavior: "smooth" });
    });
  } else if (scene.url === "/" && scene.name.includes("final")) {
    await page.waitForTimeout(800);
    await page.evaluate(() => {
      const el = document.querySelector("#fiyat");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  await page.waitForTimeout(durationMs);

  await page.close();
  await context.close();
  await browser.close();

  const fs = await import("fs/promises");
  const files = await fs.readdir(sceneDir);
  const webm = files.find((f) => f.endsWith(".webm"));
  if (!webm) throw new Error(`${scene.name} için video bulunamadı`);
  console.log(`   ✓ ${webm}`);
  return join(sceneDir, webm);
}

// --- SRT generation ---
function writeSrt(reel, srtPath) {
  const lines = reel.scenes.map((s, i) => {
    return `${i + 1}\n${srtTimestamp(s.startSec)} --> ${srtTimestamp(s.endSec)}\n${s.voiceover}\n`;
  });
  writeFileSync(srtPath, lines.join("\n"), "utf8");
  console.log(`   ✓ SRT yazıldı`);
}

// --- Audio assembly (VO clips → master track aligned to scene timing) ---
async function buildVoiceoverTrack(voPaths, reel, outPath) {
  // adelay + amix: her clip kendi startSec'inde başlasın, sonra mix
  const totalSec = reel.durationSec;
  const inputs = voPaths.flatMap((p) => ["-i", p]);
  const filterParts = reel.scenes.map((s, i) => {
    const delayMs = Math.round(s.startSec * 1000);
    return `[${i}:a]adelay=${delayMs}|${delayMs}[a${i}]`;
  });
  const mixInputs = reel.scenes.map((_, i) => `[a${i}]`).join("");
  const filter = `${filterParts.join(";")};${mixInputs}amix=inputs=${reel.scenes.length}:duration=longest:normalize=0[aout]`;

  await runFfmpeg([
    "-y",
    ...inputs,
    "-filter_complex",
    filter,
    "-map",
    "[aout]",
    "-t",
    String(totalSec),
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    outPath,
  ]);
}

async function main() {
  if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true });

  console.log(`📹 BiKareBırak Reel üretici`);
  console.log(`   Reel: ${REEL.id} — ${REEL.title}`);
  console.log(`   ${REEL.scenes.length} sahne × ${REEL.durationSec / REEL.scenes.length}sn ≈ ${REEL.durationSec}sn`);
  console.log(`   VO: ${VO_ENABLED ? `AÇIK (voice=${VOICE_ID})` : "KAPALI (sessiz)"}`);
  console.log(`   Hedef: ${FINAL_MP4}\n`);

  if (!VO_ENABLED && !SILENT_MODE) {
    console.warn(`   ⚠️  ELEVENLABS_API_KEY bulunamadı — sessiz mod\n`);
  }

  // 1) Sahneleri kaydet (veya cache'ten oku)
  const webms = [];
  for (const scene of REEL.scenes) {
    if (REUSE_VIDEO) {
      const sceneDir = join(TMP_DIR, scene.name);
      const fs = await import("fs/promises");
      try {
        const files = await fs.readdir(sceneDir);
        const webm = files.find((f) => f.endsWith(".webm"));
        if (webm) {
          console.log(`♻️  [${scene.name}] cache'ten: ${webm}`);
          webms.push(join(sceneDir, webm));
          continue;
        }
      } catch {
        // klasör yok, yeniden kaydet
      }
    }
    const path = await recordScene(scene);
    webms.push(path);
  }

  // 2) VO clipleri üret (sıralı — ElevenLabs free tier 2 paralel istekle sınırlı)
  let voPaths = [];
  if (VO_ENABLED) {
    console.log(`\n🎙  ElevenLabs ile seslendirme üretiliyor (${REEL.scenes.length} clip, sıralı)...`);
    for (let i = 0; i < REEL.scenes.length; i++) {
      const out = join(TMP_DIR, `vo-${i + 1}.mp3`);
      await synthesizeScene(REEL.scenes[i], out);
      voPaths.push(out);
    }
  }

  // 3) Video concat
  const concatList = join(TMP_DIR, "concat.txt");
  writeFileSync(concatList, webms.map((p) => `file '${p}'`).join("\n"), "utf8");

  console.log(`\n🎞  Sahneler birleştiriliyor + 1080x1920'ye upscale ediliyor...`);
  const tmpVideoMp4 = join(TMP_DIR, "video-only.mp4");
  await runFfmpeg([
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    concatList,
    "-vf",
    // Mobil viewport kaydı → 1080x1920 (Instagram 9:16) lanczos upscale
    "scale=1080:1920:flags=lanczos",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "20",
    "-pix_fmt",
    "yuv420p",
    "-r",
    "30",
    "-an",
    "-movflags",
    "+faststart",
    tmpVideoMp4,
  ]);

  // 4) VO track'i (varsa) zaman-hizalı master audio olarak inşa et
  let voMasterPath = null;
  if (VO_ENABLED) {
    console.log(`\n🎚  Seslendirme master track'i hazırlanıyor...`);
    voMasterPath = join(TMP_DIR, "vo-master.m4a");
    await buildVoiceoverTrack(voPaths, REEL, voMasterPath);
  }

  // 5) Final: video + (varsa) VO + trim + fade
  console.log(`\n✂️   ${REEL.durationSec}sn'ye kırpılıyor + fade ekleniyor...`);
  const finalArgs = [
    "-y",
    "-i",
    tmpVideoMp4,
  ];
  if (voMasterPath) {
    finalArgs.push("-i", voMasterPath);
  }
  finalArgs.push(
    "-t",
    String(REEL.durationSec),
    "-vf",
    `fade=t=in:st=0:d=0.5,fade=t=out:st=${REEL.durationSec - 1}:d=1`,
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-crf",
    "23",
    "-pix_fmt",
    "yuv420p",
    "-r",
    "30",
  );
  if (voMasterPath) {
    finalArgs.push(
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-map",
      "0:v:0",
      "-map",
      "1:a:0",
      "-shortest"
    );
  }
  finalArgs.push("-movflags", "+faststart", FINAL_MP4);
  await runFfmpeg(finalArgs);

  // 6) SRT altyazı
  console.log(`\n📝 Altyazı üretiliyor...`);
  writeSrt(REEL, FINAL_SRT);

  // 7) Temizlik
  try {
    unlinkSync(tmpVideoMp4);
  } catch {}

  console.log(`\n✅ Reel hazır:`);
  console.log(`   Video: ${FINAL_MP4}`);
  console.log(`   Altyazı: ${FINAL_SRT}`);
  console.log(`   ${VO_ENABLED ? "Seslendirme: dahili (ElevenLabs)" : "Sessiz — müzik & VO'yu CapCut'ta ekle"}`);
  console.log(`   1080×1920 · ${REEL.durationSec}sn\n`);
  console.log(`   📲 CapCut'a alıp altyazı dosyasını sürükle, müzik ekle, Instagram'a yükle.\n`);
}

main().catch((err) => {
  console.error("HATA:", err);
  process.exit(1);
});
