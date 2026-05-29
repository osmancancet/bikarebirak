"use client";

import { useState } from "react";
import { Card, Label } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Palette, CheckCircle2 } from "lucide-react";
import type { ThemeName, CoverFilter } from "@/lib/types";

const themes: Array<{
  id: ThemeName;
  name: string;
  description: string;
  swatches: [string, string, string];
}> = [
  {
    id: "classic-gold",
    name: "Klasik Altın",
    description: "Beyaz · bej · altın — zamansız zarafet",
    swatches: ["#fdfbf7", "#ede3d3", "#c2a14d"],
  },
  {
    id: "romantic-rose",
    name: "Romantik Gül",
    description: "Pudra · gül-altın — yumuşak ve romantik",
    swatches: ["#fdf5f6", "#ebd5d8", "#b76e79"],
  },
  {
    id: "modern-beige",
    name: "Modern Bej",
    description: "Doğal toprak tonları — sade ve şık",
    swatches: ["#f7f3eb", "#ddd2c0", "#8c7853"],
  },
];

const filters: Array<{ id: CoverFilter; name: string }> = [
  { id: "none", name: "Filtresiz" },
  { id: "bw", name: "Siyah-Beyaz" },
  { id: "vintage", name: "Vintage" },
  { id: "soft", name: "Soft" },
];

export function ThemePicker({
  slug,
  currentTheme,
  currentFilter,
}: {
  slug: string;
  currentTheme: ThemeName | null;
  currentFilter: CoverFilter | null;
}) {
  const [theme, setTheme] = useState<ThemeName>(currentTheme ?? "classic-gold");
  const [coverFilter, setCoverFilter] = useState<CoverFilter>(
    currentFilter ?? "none"
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setError(null);
    setStatus("saving");
    try {
      const res = await fetch(`/api/p/${slug}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, cover_filter: coverFilter }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? "Kaydedilemedi.");
        setStatus("error");
        return;
      }
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1500);
    } catch {
      setError("Bağlantı hatası.");
      setStatus("error");
    }
  };

  return (
    <Card className="p-7" data-theme={theme}>
      <h2 className="flex items-center gap-2 text-2xl font-medium">
        <Palette className="h-5 w-5 text-gold" />
        Tema & Filtre
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        Davetiyenin renk paleti ve kapak görselinin filtresi. Aşağıdaki seçim
        sayfanın renklerinde anlık değişir — beğenince kaydet.
      </p>

      <div className="mt-6">
        <Label>Renk Teması</Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={`relative rounded-2xl border bg-white p-4 text-left transition-all ${
                theme === t.id
                  ? "border-gold ring-2 ring-gold/30"
                  : "border-beige hover:bg-ivory"
              }`}
            >
              <div className="mb-3 flex gap-1.5">
                {t.swatches.map((c, i) => (
                  <span
                    key={i}
                    className="h-7 w-7 rounded-full border border-black/5"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-ink">{t.name}</p>
              <p className="mt-0.5 text-xs text-ink-soft">{t.description}</p>
              {theme === t.id && (
                <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold text-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Label>Kapak Filtresi</Label>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setCoverFilter(f.id)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                coverFilter === f.id
                  ? "border-gold bg-gold-soft/20 text-ink"
                  : "border-sand bg-white text-ink-soft hover:bg-ivory"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-rose-gold">{error}</p>}
      {status === "saved" && (
        <p className="mt-4 flex items-center gap-2 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          Kaydedildi
        </p>
      )}

      <div className="mt-6">
        <Button onClick={save} size="lg" disabled={status === "saving"}>
          <Palette className="h-4 w-4" />
          {status === "saving" ? "Kaydediliyor…" : "Temayı Kaydet"}
        </Button>
      </div>
    </Card>
  );
}
