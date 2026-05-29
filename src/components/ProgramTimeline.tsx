import type { ProgramItem } from "@/lib/types";
import { Clock } from "lucide-react";

export function ProgramTimeline({ items }: { items: ProgramItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute left-[1.125rem] top-1 bottom-1 w-px bg-gradient-to-b from-gold/60 via-gold/30 to-transparent"
      />
      <ul className="space-y-5">
        {items.map((it, i) => (
          <li key={`${it.time}-${i}`} className="relative flex items-start gap-4">
            <span className="z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-beige bg-cream text-gold">
              <Clock className="h-4 w-4" />
            </span>
            <div className="pt-1">
              <p className="font-serif text-xl text-ink tabular-nums">
                {it.time}
              </p>
              <p className="text-sm text-ink-soft">{it.label}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
