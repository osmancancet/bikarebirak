import type { StoryItem } from "@/lib/types";
import { formatStoryDate } from "@/lib/utils";
import { Heart } from "lucide-react";

export function StoryTimeline({ items }: { items: StoryItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute left-[1.125rem] top-2 bottom-2 w-px bg-gradient-to-b from-gold/60 via-gold/30 to-transparent"
      />
      <ul className="space-y-6">
        {items.map((it, i) => (
          <li key={`${it.date}-${i}`} className="relative flex items-start gap-4">
            <span className="z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-beige bg-cream text-rose-gold">
              <Heart className="h-4 w-4" fill="currentColor" />
            </span>
            <div className="pt-1">
              <p className="text-xs uppercase tracking-[0.2em] text-gold">
                {formatStoryDate(it.date)}
              </p>
              <p className="mt-1 font-serif text-xl text-ink">{it.title}</p>
              {it.description && (
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {it.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
