"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { Photo } from "@/lib/types";

export function NewPhotoToast({ photo }: { photo: Photo | null }) {
  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/80 p-3 pr-5 text-white backdrop-blur-md"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.public_url}
            alt=""
            className="h-14 w-14 rounded-xl object-cover"
          />
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <Sparkles className="h-3.5 w-3.5 text-gold-soft" />
              Yeni fotoğraf eklendi
            </p>
            <p className="text-xs text-white/60">Anılar büyümeye devam ediyor</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
