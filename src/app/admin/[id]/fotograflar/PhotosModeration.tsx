"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { deletePhotoAction } from "../../actions";
import type { Photo } from "@/lib/types";
import { Trash2, Image as ImageIcon } from "lucide-react";

export function PhotosModeration({
  initialPhotos,
}: {
  initialPhotos: Photo[];
}) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const remove = (id: string) => {
    setError(null);
    startTransition(async () => {
      const res = await deletePhotoAction(id);
      if (res.error) {
        setError(res.error);
        return;
      }
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      setConfirmId(null);
    });
  };

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-beige bg-white/60 p-12 text-center text-ink-soft">
        <ImageIcon className="h-10 w-10" />
        <p>Henüz fotoğraf yok.</p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <p className="mb-4 rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-gold">
          {error}
        </p>
      )}
      <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
        {photos.map((p) => (
          <div
            key={p.id}
            className="group relative break-inside-avoid overflow-hidden rounded-xl border border-beige bg-white"
          >
            <Image
              src={p.public_url}
              alt="Fotoğraf"
              width={400}
              height={600}
              className="h-auto w-full object-cover"
              sizes="(max-width: 640px) 50vw, 25vw"
              unoptimized
            />
            {confirmId === p.id ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 p-3 text-center text-white">
                <p className="text-sm">Bu fotoğrafı sil?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => remove(p.id)}
                    className="rounded-full bg-rose-gold px-3 py-1.5 text-xs font-medium"
                  >
                    Evet, sil
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="rounded-full bg-white/20 px-3 py-1.5 text-xs"
                  >
                    Vazgeç
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmId(p.id)}
                className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Fotoğrafı sil"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
