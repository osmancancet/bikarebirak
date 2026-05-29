"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Pause, Play } from "lucide-react";
import type { Photo } from "@/lib/types";

/**
 * Projeksiyon için tam ekran slayt gösterisi. Yeni fotoğraflar
 * snapshot'tan otomatik akarsa burada da görünür (parent'ın photos
 * state'i güncellenir, biz onu izleriz).
 */
export function SlideshowView({
  photos,
  intervalSeconds,
}: {
  photos: Photo[];
  intervalSeconds: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Foto sayısı değişirse index taşmasını engelle
  useEffect(() => {
    if (index >= photos.length && photos.length > 0) setIndex(0);
  }, [photos.length, index]);

  // Otomatik döngü
  useEffect(() => {
    if (paused || photos.length === 0) return;
    const ms = Math.max(2, intervalSeconds) * 1000;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % Math.max(1, photos.length));
    }, ms);
    return () => clearInterval(id);
  }, [paused, intervalSeconds, photos.length]);

  if (photos.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-32 text-center text-white/60">
        <Camera className="h-14 w-14" />
        <p className="font-serif text-2xl text-white/80">
          İlk fotoğrafı bekliyoruz…
        </p>
      </div>
    );
  }

  const current = photos[Math.min(index, photos.length - 1)];

  return (
    <div className="relative h-[calc(100vh-80px)] w-full overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0, scale: 1.07 }}
          transition={{
            opacity: { duration: 1.4 },
            scale: { duration: Math.max(2, intervalSeconds) },
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.public_url}
            alt="Düğün fotoğrafı"
            className="h-full w-full object-contain"
          />
        </motion.div>
      </AnimatePresence>

      {/* Üst sağ rozet + kontroller */}
      <div className="absolute right-5 top-5 z-10 flex items-center gap-2">
        <button
          onClick={() => setPaused((p) => !p)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
          aria-label={paused ? "Oynat" : "Duraklat"}
        >
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
        <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/80 backdrop-blur">
          Slayt · {index + 1}/{photos.length}
        </span>
      </div>
    </div>
  );
}
