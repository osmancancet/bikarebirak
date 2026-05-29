"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// 12 placeholder foto (her seed başka random Picsum görsel verir).
const ALL_SEEDS = [
  "wedding1",
  "wedding2",
  "wedding3",
  "wedding4",
  "wedding5",
  "wedding6",
  "wedding7",
  "wedding8",
  "wedding9",
  "weddingA",
  "weddingB",
  "weddingC",
];

const urlFor = (seed: string) =>
  `https://picsum.photos/seed/${seed}/400/${
    seed.charCodeAt(seed.length - 1) % 2 === 0 ? 540 : 460
  }`;

export function MiniGalleryPreview() {
  // İlk 8 görsel ekranda; her ~3sn'de bir slot rastgele bir yenisi ile değişir.
  const [slots, setSlots] = useState<string[]>(ALL_SEEDS.slice(0, 8));

  useEffect(() => {
    const id = setInterval(() => {
      setSlots((prev) => {
        const next = [...prev];
        const slotIdx = Math.floor(Math.random() * 8);
        // mevcutta olmayan bir seed seç
        const candidates = ALL_SEEDS.filter((s) => !prev.includes(s));
        if (candidates.length === 0) return prev;
        next[slotIdx] = candidates[Math.floor(Math.random() * candidates.length)];
        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#14110d] p-4 shadow-2xl shadow-black/30">
      {/* başlık çubuğu */}
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs text-white/60">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-gold opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-gold" />
          </span>
          Canlı
        </span>
        <span className="text-xs text-white/40">aslıvemert.bikarebirak.com</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {slots.map((seed, i) => (
          <div key={i} className="relative aspect-[3/4] overflow-hidden rounded-lg">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={seed}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${urlFor(seed)})` }}
              />
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
