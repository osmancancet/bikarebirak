import type { GuestRsvp } from "@/lib/types";

/** CSV alanı için tırnak/kaçış kuralları. */
function csvField(value: string | number | boolean): string {
  const s = String(value);
  if (s.includes(",") || s.includes("\"") || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/** RSVP listesini Türkçe başlıklı CSV stringine çevirir (UTF-8 BOM ile Excel uyumlu). */
export function rsvpToCsv(rsvps: GuestRsvp[]): string {
  const header = ["Ad Soyad", "Katılım", "Kişi Sayısı", "Bildirim Tarihi"];
  const rows = rsvps.map((r) => [
    csvField(r.full_name),
    csvField(r.attending ? "Evet" : "Hayır"),
    csvField(r.attending ? r.guest_count : 0),
    csvField(new Date(r.created_at).toLocaleString("tr-TR")),
  ]);
  const body = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
  // BOM, Excel'in UTF-8'i Türkçe karakterlerle doğru açması için
  return "﻿" + body + "\n";
}
