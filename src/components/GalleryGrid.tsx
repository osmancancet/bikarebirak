"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import type { Photo } from "@/lib/types";
import { Camera, Star } from "lucide-react";
import { Lightbox } from "./Lightbox";
import { SlideshowView } from "./SlideshowView";
import { NewPhotoToast } from "./NewPhotoToast";

interface Props {
  coupleId: string;
  initialPhotos: Photo[];
  mode?: "grid" | "slideshow";
  slideshowInterval?: number;
  /** Çift görünümü için: favori toggle butonları görünür. */
  coupleSlug?: string;
  initialFavoriteIds?: string[];
  /** Empty state'i özelleştirmek için. */
  emptyState?: React.ReactNode;
  /** Sadece favori foto'ları göster (favoriler sayfası). */
  showFavoritesOnly?: boolean;
  /** Realtime onSnapshot'u devre dışı bırak. */
  disableRealtime?: boolean;
}

export function GalleryGrid({
  coupleId,
  initialPhotos,
  mode = "grid",
  slideshowInterval = 5,
  coupleSlug,
  initialFavoriteIds,
  emptyState,
  showFavoritesOnly = false,
  disableRealtime = false,
}: Props) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [toastPhoto, setToastPhoto] = useState<Photo | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(
    () => new Set(initialFavoriteIds ?? [])
  );
  const isCoupleView = !!coupleSlug;

  const toggleFavorite = async (photoId: string) => {
    const isFav = favoriteIds.has(photoId);
    // Optimistic
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isFav) next.delete(photoId);
      else next.add(photoId);
      return next;
    });
    try {
      const res = await fetch(`/api/p/${coupleSlug}/favorites`, {
        method: isFav ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId }),
      });
      if (!res.ok) throw new Error("hata");
    } catch {
      // Geri al
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (isFav) next.add(photoId);
        else next.delete(photoId);
        return next;
      });
    }
  };
  const isFirstSnapshotRef = useRef(true);
  const knownIdsRef = useRef(new Set(initialPhotos.map((p) => p.id)));
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (disableRealtime) return;
    const q = query(
      collection(getDb(), "photos"),
      where("couple_id", "==", coupleId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: Photo[] = snapshot.docs.map((doc) => {
        const d = doc.data();
        const ts = d.created_at as { toMillis?: () => number } | null;
        const millis = ts?.toMillis ? ts.toMillis() : Date.now();
        return {
          id: doc.id,
          couple_id: d.couple_id,
          storage_path: d.storage_path,
          public_url: d.public_url,
          uploader_name: d.uploader_name ?? null,
          like_count: typeof d.like_count === "number" ? d.like_count : 0,
          created_at: new Date(millis).toISOString(),
        };
      });
      docs.sort((a, b) => b.created_at.localeCompare(a.created_at));

      // İlk snapshot'tan sonra yeni gelenleri toast olarak göster
      if (!isFirstSnapshotRef.current && mode === "grid") {
        const newest = docs.find((p) => !knownIdsRef.current.has(p.id));
        if (newest) {
          setToastPhoto(newest);
          if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
          toastTimerRef.current = setTimeout(() => setToastPhoto(null), 4000);
        }
      }
      knownIdsRef.current = new Set(docs.map((p) => p.id));
      isFirstSnapshotRef.current = false;
      setPhotos(docs);
    });

    return () => {
      unsubscribe();
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [coupleId, mode, disableRealtime]);

  // Favoriler sayfası: yalnızca favori işaretli foto'ları göster
  const displayedPhotos = showFavoritesOnly
    ? photos.filter((p) => favoriteIds.has(p.id))
    : photos;

  if (mode === "slideshow") {
    return (
      <SlideshowView photos={displayedPhotos} intervalSeconds={slideshowInterval} />
    );
  }

  if (displayedPhotos.length === 0) {
    if (emptyState) return <>{emptyState}</>;
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-32 text-center text-white/50">
        <Camera className="h-14 w-14" />
        <p className="font-serif text-2xl text-white/70">
          İlk fotoğrafı bekliyoruz…
        </p>
        <p className="max-w-xs text-sm">
          Misafirler masadaki QR kodu okutup fotoğraf yükledikçe kareler burada
          belirecek.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
        <AnimatePresence initial={false}>
          {displayedPhotos.map((photo, i) => {
            const isFav = favoriteIds.has(photo.id);
            return (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.92, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 24 }}
                className="group relative block w-full break-inside-avoid overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left"
              >
                <button
                  onClick={() => setOpenIndex(i)}
                  className="block w-full cursor-zoom-in transition-transform hover:scale-[1.02]"
                >
                  <Image
                    src={photo.public_url}
                    alt="Düğün fotoğrafı"
                    width={500}
                    height={700}
                    className="h-auto w-full object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    unoptimized
                  />
                </button>

                {/* Favori (yıldız) — sadece çift görünümünde */}
                {isCoupleView && (
                  <button
                    onClick={() => toggleFavorite(photo.id)}
                    aria-label={
                      isFav ? "Favorilerden çıkar" : "Favorilere ekle"
                    }
                    className={`absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-all ${
                      isFav
                        ? "bg-gold/90 text-white shadow-md shadow-gold/30"
                        : "bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-black/60"
                    }`}
                  >
                    <Star
                      className="h-4 w-4"
                      fill={isFav ? "currentColor" : "none"}
                    />
                  </button>
                )}

                {/* Yükleyici adı */}
                {photo.uploader_name && (
                  <p className="absolute bottom-2 left-2 max-w-[80%] truncate rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] text-white/90 backdrop-blur">
                    📷 {photo.uploader_name}
                  </p>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Lightbox
        photos={displayedPhotos}
        openIndex={openIndex}
        onClose={() => setOpenIndex(null)}
        onPrev={() =>
          setOpenIndex((i) =>
            i === null
              ? null
              : (i - 1 + displayedPhotos.length) % displayedPhotos.length
          )
        }
        onNext={() =>
          setOpenIndex((i) =>
            i === null ? null : (i + 1) % displayedPhotos.length
          )
        }
        coupleSlug={coupleSlug}
        favoriteIds={favoriteIds}
        onToggleFavorite={isCoupleView ? toggleFavorite : undefined}
      />

      <NewPhotoToast photo={toastPhoto} />
    </>
  );
}
