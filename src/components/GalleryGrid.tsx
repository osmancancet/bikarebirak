"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import type { Photo } from "@/lib/types";
import { Camera } from "lucide-react";

export function GalleryGrid({
  coupleId,
  initialPhotos,
}: {
  coupleId: string;
  initialPhotos: Photo[];
}) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);

  useEffect(() => {
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
          created_at: new Date(millis).toISOString(),
        };
      });
      // Yeniden eskiye sırala (yeni fotoğraf en üstte)
      docs.sort((a, b) => b.created_at.localeCompare(a.created_at));
      setPhotos(docs);
    });

    return () => unsubscribe();
  }, [coupleId]);

  if (photos.length === 0) {
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
    <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
      <AnimatePresence initial={false}>
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            layout
            initial={{ opacity: 0, scale: 0.92, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="break-inside-avoid overflow-hidden rounded-xl border border-white/10 bg-white/5"
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
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
