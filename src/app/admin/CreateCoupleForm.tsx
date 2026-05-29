"use client";

import { useActionState } from "react";
import { createCoupleAction, type ActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, Label } from "@/components/ui/card";
import { UserPlus, CheckCircle2 } from "lucide-react";

const initial: ActionState = {};

export function CreateCoupleForm() {
  const [state, formAction, pending] = useActionState(
    createCoupleAction,
    initial
  );

  return (
    <Card className="p-7">
      <h2 className="flex items-center gap-2 text-2xl font-medium">
        <UserPlus className="h-5 w-5 text-gold" />
        Yeni Çift Oluştur
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        Ödemesi alınan çift için profil ve paylaşım linki oluşturun.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="groom_name">Damat Adı *</Label>
            <Input id="groom_name" name="groom_name" required placeholder="Ahmet" />
          </div>
          <div>
            <Label htmlFor="bride_name">Gelin Adı *</Label>
            <Input id="bride_name" name="bride_name" required placeholder="Ayşe" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="wedding_date">Düğün Tarihi & Saati *</Label>
            <Input
              id="wedding_date"
              name="wedding_date"
              type="datetime-local"
              required
            />
          </div>
          <div>
            <Label htmlFor="slug">Özel Link (slug)</Label>
            <Input id="slug" name="slug" placeholder="boş bırakılırsa otomatik" />
          </div>
        </div>

        <div>
          <Label htmlFor="venue_name">Mekan Adı *</Label>
          <Input
            id="venue_name"
            name="venue_name"
            required
            placeholder="Çırağan Sarayı, İstanbul"
          />
        </div>

        <div>
          <Label htmlFor="venue_maps_url">Google Maps Linki</Label>
          <Input
            id="venue_maps_url"
            name="venue_maps_url"
            type="url"
            placeholder="https://maps.google.com/..."
          />
        </div>

        <div>
          <Label htmlFor="welcome_message">Karşılama Metni</Label>
          <Textarea
            id="welcome_message"
            name="welcome_message"
            placeholder="Mutluluğumuzu sizlerle paylaşmaktan onur duyarız…"
          />
        </div>

        <div>
          <Label htmlFor="dress_code">Kıyafet Kodu</Label>
          <Input
            id="dress_code"
            name="dress_code"
            placeholder="Smart Casual · Beyazdan kaçınılması rica olunur"
          />
        </div>

        <div>
          <Label htmlFor="program">Program (her satır: SAAT=Etkinlik)</Label>
          <Textarea
            id="program"
            name="program"
            placeholder={"16:00=Nikah\n18:00=Kokteyl\n20:00=Yemek\n22:00=Müzik"}
            rows={5}
          />
          <p className="mt-1 text-xs text-ink-soft">
            Boş bırakırsanız davetiyede program bölümü görünmez.
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
          {pending ? "Oluşturuluyor…" : "Çifti Oluştur"}
        </Button>
      </form>
    </Card>
  );
}
