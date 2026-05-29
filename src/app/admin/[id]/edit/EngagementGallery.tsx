"use client";

import { useActionState, useTransition } from "react";
import {
  uploadEngagementPhotoAction,
  removeEngagementPhotoAction,
  type ActionState,
} from "../../actions";
import { Button } from "@/components/ui/button";
import { Card, Label } from "@/components/ui/card";
import { CheckCircle2, Heart, Trash2 } from "lucide-react";

const initial: ActionState = {};

export function EngagementGallery({
  coupleId,
  slug,
  photos,
}: {
  coupleId: string;
  slug: string;
  photos: string[];
}) {
  const [state, formAction, pending] = useActionState(
    uploadEngagementPhotoAction,
    initial
  );
  const [removePending, startTransition] = useTransition();

  const remove = (url: string) => {
    startTransition(async () => {
      await removeEngagementPhotoAction(coupleId, slug, url);
    });
  };

  return (
    <Card className="p-7">
      <h2 className="flex items-center gap-2 text-2xl font-medium">
        <Heart className="h-5 w-5 text-rose-gold" fill="currentColor" />
        Nişan Fotoğrafları
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        Davetiyenin üst kısmında otomatik dönen carousel olur. 6 adete kadar
        ekleyebilirsiniz; biri yetiyorsa o da carousel olarak gösterilir.
      </p>

      {photos.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {photos.map((url) => (
            <div
              key={url}
              className="relative aspect-square overflow-hidden rounded-xl border border-beige bg-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt="Nişan fotoğrafı"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => remove(url)}
                disabled={removePending}
                className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 disabled:opacity-50"
                aria-label="Kaldır"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length >= 6 ? (
        <p className="mt-4 text-sm text-ink-soft">
          Maksimum 6 fotoğraf eklendi. Yeni eklemek için önce bir tanesini kaldır.
        </p>
      ) : (
        <form action={formAction} className="mt-6 space-y-4">
          <input type="hidden" name="id" value={coupleId} />
          <input type="hidden" name="slug" value={slug} />

          <div>
            <Label htmlFor="photo">Yeni fotoğraf (JPG/PNG, max 8 MB)</Label>
            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              className="block w-full text-sm text-ink-soft file:mr-4 file:rounded-full file:border-0 file:bg-ivory file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink hover:file:bg-beige"
            />
          </div>

          {state.error && (
            <p className="text-sm text-rose-gold">{state.error}</p>
          )}
          {state.success && (
            <p className="flex items-center gap-2 text-sm text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              {state.success}
            </p>
          )}

          <Button type="submit" disabled={pending}>
            <Heart className="h-4 w-4" />
            {pending ? "Yükleniyor…" : "Ekle"}
          </Button>
        </form>
      )}
    </Card>
  );
}
