"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export function ShareButton({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    const nav: Navigator | undefined =
      typeof window !== "undefined" ? window.navigator : undefined;
    if (!nav) return;

    if (typeof nav.share === "function") {
      try {
        await nav.share({ title, url });
        return;
      } catch {
        // kullanıcı iptal etti — fallback'e düşme
        return;
      }
    }
    try {
      await nav.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // pano izin verilmediyse sessiz geç
    }
  };

  return (
    <button
      onClick={onClick}
      className="inline-flex h-11 items-center gap-2 rounded-full border border-sand bg-white/70 px-5 text-sm font-medium text-ink transition-colors hover:bg-ivory"
      aria-label="Davetiyeyi paylaş"
    >
      {copied ? <Check className="h-4 w-4 text-gold" /> : <Share2 className="h-4 w-4 text-gold" />}
      {copied ? "Kopyalandı" : "Paylaş"}
    </button>
  );
}
