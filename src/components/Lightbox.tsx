"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Star,
  Heart,
} from "lucide-react";
import type { Photo } from "@/lib/types";

const LIKED_KEY = (id: string) => `bkb_liked_photo_${id}`;

export function Lightbox({
  photos,
  openIndex,
  onClose,
  onPrev,
  onNext,
  coupleSlug: _coupleSlug,
  favoriteIds,
  onToggleFavorite,
}: {
  photos: Photo[];
  openIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  coupleSlug?: string;
  favoriteIds?: Set<string>;
  onToggleFavorite?: (photoId: string) => void;
}) {
  // Klavye yönetimi
  useEffect(() => {
    if (openIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    // Scroll'u kilitle
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [openIndex, onClose, onPrev, onNext]);

  const current = openIndex !== null ? photos[openIndex] : null;
  const [likeOptimistic, setLikeOptimistic] = useState(0);
  const [liked, setLiked] = useState(false);

  // Aktif fotoğraf değiştiğinde liked durumunu localStorage'dan oku
  useEffect(() => {
    if (!current) return;
    setLikeOptimistic(0);
    setLiked(
      typeof window !== "undefined" &&
        localStorage.getItem(LIKED_KEY(current.id)) === "1"
    );
  }, [current]);

  const sendLike = async () => {
    if (!current || liked) return;
    setLiked(true);
    setLikeOptimistic((n) => n + 1);
    localStorage.setItem(LIKED_KEY(current.id), "1");
    try {
      await fetch(`/api/like/photo/${current.id}`, { method: "POST" });
    } catch {
      // sessiz geç (optimistic kalır)
    }
  };

  const download = async () => {
    if (!current) return;
    try {
      const res = await fetch(current.public_url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `foto-${current.id}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("İndirme hatası:", err);
    }
  };

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={onClose}
        >
          {/* Üst bar */}
          <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-4 text-white">
            <div className="flex flex-col text-sm text-white/70">
              <span>
                {openIndex! + 1} / {photos.length}
              </span>
              {current?.uploader_name && (
                <span className="text-xs text-white/50">
                  📷 {current.uploader_name}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {current && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sendLike();
                  }}
                  disabled={liked}
                  className={`inline-flex h-10 items-center gap-1.5 rounded-full px-3 transition-colors ${
                    liked
                      ? "bg-rose-gold/90 text-white"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                  aria-label="Bu fotoya kalp at"
                >
                  <Heart
                    className="h-4 w-4"
                    fill={liked ? "currentColor" : "none"}
                  />
                  <span className="text-sm tabular-nums">
                    {(current.like_count ?? 0) + likeOptimistic}
                  </span>
                </button>
              )}
              {onToggleFavorite && current && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(current.id);
                  }}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    favoriteIds?.has(current.id)
                      ? "bg-gold text-white"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                  aria-label="Favorile"
                >
                  <Star
                    className="h-5 w-5"
                    fill={
                      favoriteIds?.has(current.id) ? "currentColor" : "none"
                    }
                  />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  download();
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                aria-label="İndir"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Önceki */}
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-2 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
              aria-label="Önceki"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Görsel (drag ile swipe) */}
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) onNext();
              else if (info.offset.x > 80) onPrev();
            }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-[92vw] cursor-grab active:cursor-grabbing"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.public_url}
              alt="Düğün fotoğrafı"
              className="max-h-[88vh] max-w-[92vw] object-contain"
              draggable={false}
            />
          </motion.div>

          {/* Sonraki */}
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-2 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
              aria-label="Sonraki"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
