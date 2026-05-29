"use client";

import { useActionState } from "react";
import { updateCoupleAction, type ActionState } from "../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, Label } from "@/components/ui/card";
import { CheckCircle2, Save } from "lucide-react";
import type { Couple } from "@/lib/types";
import { stringifyProgramItems, stringifyStoryItems } from "@/lib/utils";

const initial: ActionState = {};

/** Datetime-local input formatı için ISO'yu "YYYY-MM-DDTHH:mm" hale getirir. */
function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function EditCoupleForm({ couple }: { couple: Couple }) {
  const [state, formAction, pending] = useActionState(
    updateCoupleAction,
    initial
  );

  return (
    <Card className="p-7">
      <h2 className="text-2xl font-medium">Çift Bilgilerini Düzenle</h2>

      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="id" value={couple.id} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="groom_name">Damat Adı *</Label>
            <Input
              id="groom_name"
              name="groom_name"
              defaultValue={couple.groom_name}
              required
            />
          </div>
          <div>
            <Label htmlFor="bride_name">Gelin Adı *</Label>
            <Input
              id="bride_name"
              name="bride_name"
              defaultValue={couple.bride_name}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="wedding_date">Düğün Tarihi & Saati *</Label>
            <Input
              id="wedding_date"
              name="wedding_date"
              type="datetime-local"
              defaultValue={toLocalInput(couple.wedding_date)}
              required
            />
          </div>
          <div>
            <Label htmlFor="slug">Özel Link (slug)</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={couple.slug}
              placeholder="otomatik üretilir"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="venue_name">Mekan Adı *</Label>
          <Input
            id="venue_name"
            name="venue_name"
            defaultValue={couple.venue_name}
            required
          />
        </div>

        <div>
          <Label htmlFor="venue_maps_url">Google Maps Linki</Label>
          <Input
            id="venue_maps_url"
            name="venue_maps_url"
            type="url"
            defaultValue={couple.venue_maps_url ?? ""}
          />
        </div>

        <div>
          <Label htmlFor="welcome_message">Karşılama Metni</Label>
          <Textarea
            id="welcome_message"
            name="welcome_message"
            defaultValue={couple.welcome_message ?? ""}
          />
        </div>

        <div>
          <Label htmlFor="dress_code">Kıyafet Kodu</Label>
          <Input
            id="dress_code"
            name="dress_code"
            defaultValue={couple.dress_code ?? ""}
            placeholder="Smart Casual · Beyazdan kaçınılması rica olunur"
          />
        </div>

        <div>
          <Label htmlFor="program">Program (her satır: SAAT=Etkinlik)</Label>
          <Textarea
            id="program"
            name="program"
            rows={5}
            defaultValue={stringifyProgramItems(couple.program_items)}
            placeholder={"16:00=Nikah\n18:00=Kokteyl\n20:00=Yemek"}
          />
          <p className="mt-1 text-xs text-ink-soft">
            Boş bırakırsanız davetiyede program bölümü görünmez.
          </p>
        </div>

        <div>
          <Label htmlFor="story">
            Bizim Hikayemiz (her satır: YYYY-MM=Başlık=Açıklama)
          </Label>
          <Textarea
            id="story"
            name="story"
            rows={5}
            defaultValue={stringifyStoryItems(couple.story_items)}
            placeholder={
              "2018-06=Tanıştık=İstanbul'da bir kafede\n2024-09=Nişanlandık=Boğaz'da gün batımı"
            }
          />
          <p className="mt-1 text-xs text-ink-soft">
            Açıklama opsiyoneldir; ikinci `=` koymadan sadece başlık yazabilirsiniz.
          </p>
        </div>

        {state.error && <p className="text-sm text-rose-gold">{state.error}</p>}
        {state.success && (
          <p className="flex items-center gap-2 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            {state.success}
          </p>
        )}

        <Button type="submit" size="lg" disabled={pending}>
          <Save className="h-4 w-4" />
          {pending ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}
        </Button>
      </form>
    </Card>
  );
}
