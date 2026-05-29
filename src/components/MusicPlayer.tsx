"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Music } from "lucide-react";

export function MusicPlayer({
  url,
  label,
}: {
  url: string;
  label: string | null;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onEnd = () => setPlaying(false);
    a.addEventListener("ended", onEnd);
    return () => a.removeEventListener("ended", onEnd);
  }, []);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      try {
        await a.play();
        setPlaying(true);
      } catch {
        // autoplay engellenmiş olabilir; sessiz geç
      }
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-30 sm:bottom-7 sm:right-7">
      <audio
        ref={audioRef}
        src={url}
        loop
        preload="metadata"
        className="hidden"
      />
      <button
        onClick={toggle}
        className="group flex items-center gap-3 rounded-full border border-gold/30 bg-white/85 px-4 py-3 shadow-lg shadow-gold/20 backdrop-blur transition-all hover:scale-[1.02]"
        aria-label={playing ? "Müziği duraklat" : "Müziği çal"}
      >
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#c2a14d] to-[#b8935f] text-white">
          {playing ? (
            <Pause className="h-4 w-4" fill="currentColor" />
          ) : (
            <Play className="h-4 w-4" fill="currentColor" />
          )}
        </span>
        <span className="hidden flex-col text-left sm:flex">
          <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-gold">
            <Music className="h-3 w-3" />
            Çiftin Şarkısı
          </span>
          {label && (
            <span className="max-w-44 truncate text-xs font-medium text-ink">
              {label}
            </span>
          )}
        </span>
      </button>
    </div>
  );
}
