"use client";

import { useEffect, useState } from "react";

function diff(target: number) {
  const now = Date.now();
  const delta = Math.max(0, target - now);
  return {
    days: Math.floor(delta / 86_400_000),
    hours: Math.floor((delta % 86_400_000) / 3_600_000),
    minutes: Math.floor((delta % 3_600_000) / 60_000),
    seconds: Math.floor((delta % 60_000) / 1000),
    passed: delta === 0,
  };
}

const labels: Record<string, string> = {
  days: "Gün",
  hours: "Saat",
  minutes: "Dakika",
  seconds: "Saniye",
};

export function Countdown({ targetIso }: { targetIso: string }) {
  const target = new Date(targetIso).getTime();
  const [time, setTime] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (time.passed) {
    return (
      <p className="text-center font-serif text-2xl text-gold-gradient">
        Bugün o gün! 🥂
      </p>
    );
  }

  const units: Array<keyof typeof time> = [
    "days",
    "hours",
    "minutes",
    "seconds",
  ];

  return (
    <div className="flex justify-center gap-3 sm:gap-5">
      {units.map((u) => (
        <div
          key={u}
          className="flex min-w-16 flex-col items-center rounded-2xl border border-beige bg-white/60 px-3 py-3 backdrop-blur sm:min-w-20"
        >
          <span className="font-serif text-3xl font-semibold text-ink sm:text-4xl tabular-nums">
            {String(time[u]).padStart(2, "0")}
          </span>
          <span className="mt-0.5 text-[10px] uppercase tracking-widest text-ink-soft sm:text-xs">
            {labels[u]}
          </span>
        </div>
      ))}
    </div>
  );
}
