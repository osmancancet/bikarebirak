"use client";

import { useActionState, useRef, useTransition, useState } from "react";
import { uploadMusicAction, removeMusicAction, type ActionState } from "../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, Label } from "@/components/ui/card";
import { CheckCircle2, Music, Trash2 } from "lucide-react";

const initial: ActionState = {};

export function MusicUploadForm({
  coupleId,
  slug,
  currentUrl,
  currentLabel,
}: {
  coupleId: string;
  slug: string;
  currentUrl: string | null;
  currentLabel: string | null;
}) {
  const [state, formAction, pending] = useActionState(
    uploadMusicAction,
    initial
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const [removePending, startTransition] = useTransition();
  const [removed, setRemoved] = useState(false);

  const remove = () => {
    startTransition(async () => {
      await removeMusicAction(coupleId, slug);
      setRemoved(true);
    });
  };

  return (
    <Card className="p-7">
      <h2 className="flex items-center gap-2 text-2xl font-medium">
        <Music className="h-5 w-5 text-gold" />
        Çiftin Şarkısı
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        MP3 yüklediğinizde davetiyenin sağ altında bir player belirir. Tarayıcı
        otomatik çalmaz; misafir butona basınca başlar.
      </p>

      {currentUrl && !removed && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-beige bg-ivory/60 p-3">
          <div className="flex items-center gap-3">
            <Music className="h-4 w-4 text-gold" />
            <div>
              <p className="text-sm font-medium">
                {currentLabel ?? "Müzik yüklü"}
              </p>
              <audio
                controls
                src={currentUrl}
                className="mt-2 h-8 max-w-xs"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={remove}
            disabled={removePending}
            className="inline-flex h-9 items-center gap-1 rounded-full border border-rose-200 bg-white px-3 text-xs text-rose-gold hover:bg-rose-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {removePending ? "Kaldırılıyor…" : "Kaldır"}
          </button>
        </div>
      )}

      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="id" value={coupleId} />
        <input type="hidden" name="slug" value={slug} />

        <div>
          <Label htmlFor="music">Yeni şarkı (MP3/AAC/OGG, max 10 MB)</Label>
          <input
            ref={fileRef}
            id="music"
            name="music"
            type="file"
            accept="audio/*"
            className="block w-full text-sm text-ink-soft file:mr-4 file:rounded-full file:border-0 file:bg-ivory file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink hover:file:bg-beige"
          />
        </div>
        <div>
          <Label htmlFor="music_label">Şarkı adı (opsiyonel)</Label>
          <Input
            id="music_label"
            name="music_label"
            defaultValue={currentLabel ?? ""}
            placeholder="Sigur Rós — Hoppípolla"
          />
        </div>

        {state.error && <p className="text-sm text-rose-gold">{state.error}</p>}
        {state.success && (
          <p className="flex items-center gap-2 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            {state.success}
          </p>
        )}

        <Button type="submit" disabled={pending}>
          <Music className="h-4 w-4" />
          {pending ? "Yükleniyor…" : "Müziği Kaydet"}
        </Button>
      </form>
    </Card>
  );
}
