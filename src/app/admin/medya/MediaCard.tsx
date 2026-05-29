"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { captionFor, fullCaptionText } from "@/data/social-captions";
import type { SocialVariant } from "@/data/social-variants";
import { Download, Copy, Check } from "lucide-react";

export function MediaCard({ variant }: { variant: SocialVariant }) {
  const cap = captionFor(variant.key);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!cap) return;
    try {
      await navigator.clipboard.writeText(fullCaptionText(cap));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // sessiz
    }
  };

  const aspect = variant.size === "story" ? "aspect-[9/16]" : "aspect-square";

  return (
    <Card className="overflow-hidden p-0">
      <a
        href={`/api/social/${variant.key}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`block w-full ${aspect} bg-cover bg-center transition-opacity hover:opacity-90`}
        style={{
          backgroundImage: `url(/api/social/${variant.key})`,
        }}
        aria-label={`${variant.label} önizleme`}
      />

      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-medium text-ink">{variant.label}</h3>
          <span className="rounded-full bg-ivory px-2 py-0.5 text-[10px] uppercase tracking-widest text-gold">
            {variant.size === "story" ? "Story" : "Post"}
          </span>
        </div>
        <p className="text-xs text-ink-soft line-clamp-2">
          {variant.description}
        </p>

        <div className="flex gap-2 pt-2">
          <a
            href={`/api/social/${variant.key}`}
            download={`${variant.key}.png`}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-br from-[#c2a14d] to-[#b8935f] text-xs font-medium text-white hover:brightness-105"
          >
            <Download className="h-3.5 w-3.5" />
            İndir
          </a>
          {cap && (
            <button
              onClick={copy}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-sand bg-white text-xs text-ink hover:bg-ivory"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Kopyalandı" : "Caption"}
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
