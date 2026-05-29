"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  photos: string[];
  /** Fallback olarak kullanılacak kapak görseli URL'i. */
  fallbackUrl?: string | null;
  /** Saniye cinsinden bir görseldeki süre. */
  intervalSeconds?: number;
}

/**
 * Davetiye hero'sunun arkasında otomatik dönen nişan fotoğrafı carousel'i.
 * Hafif Ken Burns efekti ve cream overlay ile metin okunabilir kalır.
 */
export function EngagementCarousel({
  photos,
  fallbackUrl,
  intervalSeconds = 5,
}: Props) {
  const list = photos.length > 0 ? photos : fallbackUrl ? [fallbackUrl] : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (list.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, intervalSeconds * 1000);
    return () => clearInterval(id);
  }, [list.length, intervalSeconds]);

  if (list.length === 0) return null;

  const src = list[Math.min(index, list.length - 1)];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] overflow-hidden"
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={src}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1.06 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.2 },
            scale: { duration: intervalSeconds + 1.5 },
          }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${src})` }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-cream/30 via-cream/70 to-cream" />
    </div>
  );
}
