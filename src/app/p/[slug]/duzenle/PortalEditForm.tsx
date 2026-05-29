"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, Label } from "@/components/ui/card";
import { CheckCircle2, Save } from "lucide-react";
import type { Couple } from "@/lib/types";
import { stringifyProgramItems, stringifyStoryItems } from "@/lib/utils";

export function PortalEditForm({ couple }: { couple: Couple }) {
  const [welcome, setWelcome] = useState(couple.welcome_message ?? "");
  const [dressCode, setDressCode] = useState(couple.dress_code ?? "");
  const [program, setProgram] = useState(
    stringifyProgramItems(couple.program_items)
  );
  const [story, setStory] = useState(stringifyStoryItems(couple.story_items));
  const [musicLabel, setMusicLabel] = useState(couple.music_label ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus("saving");
    try {
      const res = await fetch(`/api/p/${couple.slug}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          welcome_message: welcome,
          dress_code: dressCode,
          program,
          story,
          music_label: musicLabel,
        }),
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
    <Card className="p-7">
      <h2 className="text-2xl font-medium">Mesaj, Program & Hikaye</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Karşılama metni, kıyafet kodu, program ve hikayemiz alanlarını
        düzenleyin.
      </p>

      <form onSubmit={save} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="welcome">Karşılama Metni</Label>
          <Textarea
            id="welcome"
            rows={3}
            value={welcome}
            onChange={(e) => setWelcome(e.target.value)}
            placeholder="Mutluluğumuzu sizlerle paylaşmaktan onur duyarız…"
            maxLength={600}
          />
        </div>

        <div>
          <Label htmlFor="dress_code">Kıyafet Kodu</Label>
          <Input
            id="dress_code"
            value={dressCode}
            onChange={(e) => setDressCode(e.target.value)}
            placeholder="Smart Casual"
            maxLength={200}
          />
        </div>

        <div>
          <Label htmlFor="program">Program (her satır: SAAT=Etkinlik)</Label>
          <Textarea
            id="program"
            rows={5}
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            placeholder={"16:00=Nikah\n18:00=Kokteyl\n20:00=Yemek"}
          />
        </div>

        <div>
          <Label htmlFor="story">
            Bizim Hikayemiz (her satır: YYYY-MM=Başlık=Açıklama)
          </Label>
          <Textarea
            id="story"
            rows={5}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder={
              "2018-06=Tanıştık=İstanbul'da bir kafede\n2024-09=Nişanlandık"
            }
          />
        </div>

        <div>
          <Label htmlFor="music_label">Çiftin Şarkı Adı</Label>
          <Input
            id="music_label"
            value={musicLabel}
            onChange={(e) => setMusicLabel(e.target.value)}
            placeholder="Sigur Rós — Hoppípolla"
          />
          <p className="mt-1 text-xs text-ink-soft">
            Yeni MP3 yüklemek için aşağıdaki "Çiftin Şarkısı" bölümünü kullanın.
          </p>
        </div>

        {error && <p className="text-sm text-rose-gold">{error}</p>}
        {status === "saved" && (
          <p className="flex items-center gap-2 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            Kaydedildi
          </p>
        )}

        <Button type="submit" size="lg" disabled={status === "saving"}>
          <Save className="h-4 w-4" />
          {status === "saving" ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}
        </Button>
      </form>
    </Card>
  );
}
