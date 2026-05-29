import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "ahmet-ayse-2026" gibi URL dostu, Türkçe karaktersiz slug üretir. */
export function slugify(input: string): string {
  const map: Record<string, string> = {
    ç: "c",
    ğ: "g",
    ı: "i",
    İ: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    Ç: "c",
    Ğ: "g",
    Ö: "o",
    Ş: "s",
    Ü: "u",
  };
  return input
    .trim()
    .replace(/[çğıİöşüÇĞÖŞÜ]/g, (c) => map[c] ?? c)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Çok satırlı program metnini ProgramItem dizisine çevirir.
 *  Her satır "HH:MM=Etkinlik" formatında. Boş satırlar ve geçersizler atlanır.
 */
export function parseProgramItems(
  raw: string
): Array<{ time: string; label: string }> {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const eq = line.indexOf("=");
      if (eq < 0) return null;
      const time = line.slice(0, eq).trim();
      const label = line.slice(eq + 1).trim();
      if (!time || !label) return null;
      return { time, label };
    })
    .filter((x): x is { time: string; label: string } => x !== null);
}

/** ProgramItem dizisini düzenleme textarea'sı için string'e çevirir. */
export function stringifyProgramItems(
  items: Array<{ time: string; label: string }> | null | undefined
): string {
  if (!items) return "";
  return items.map((i) => `${i.time}=${i.label}`).join("\n");
}

/** "YYYY-MM=Başlık=Açıklama" formatındaki story textarea'sını parse eder.
 *  Açıklama opsiyonel. Geçersiz satırlar atlanır.
 */
export function parseStoryItems(
  raw: string
): Array<{ date: string; title: string; description: string | null }> {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("=").map((s) => s.trim());
      if (parts.length < 2) return null;
      const [date, title, ...rest] = parts;
      if (!date || !title) return null;
      const description = rest.length > 0 ? rest.join("=") : null;
      return { date, title, description };
    })
    .filter(
      (x): x is { date: string; title: string; description: string | null } =>
        x !== null
    );
}

/** Story dizisini düzenleme textarea'sı için string'e çevirir. */
export function stringifyStoryItems(
  items: Array<{
    date: string;
    title: string;
    description: string | null;
  }> | null | undefined
): string {
  if (!items) return "";
  return items
    .map((i) =>
      i.description ? `${i.date}=${i.title}=${i.description}` : `${i.date}=${i.title}`
    )
    .join("\n");
}

/** "YYYY-MM" formatlı tarihi Türkçe "Haziran 2018" yapar. */
export function formatStoryDate(raw: string): string {
  const m = raw.match(/^(\d{4})-(\d{1,2})$/);
  if (!m) return raw;
  const year = parseInt(m[1], 10);
  const month = parseInt(m[2], 10);
  if (year < 1900 || month < 1 || month > 12) return raw;
  const d = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat("tr-TR", {
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Tarihi "12 Haziran 2026, Cuma" formatında Türkçe gösterir. */
export function formatWeddingDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(date);
}
