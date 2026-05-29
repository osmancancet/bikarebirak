"use client";

import { useState, useTransition } from "react";
import { setRetentionAction } from "../actions";
import { Card } from "@/components/ui/card";
import { Archive, RotateCcw, Check } from "lucide-react";

export function RetentionCard({
  coupleId,
  currentDays,
}: {
  coupleId: string;
  currentDays: number | null;
}) {
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const effective = currentDays ?? 7;

  const apply = (days: number | null) => {
    startTransition(async () => {
      const res = await setRetentionAction(coupleId, days);
      setMsg(res.success ?? res.error ?? null);
      setTimeout(() => setMsg(null), 2500);
    });
  };

  const options: Array<{ days: number | null; label: string; price?: string }> = [
    { days: null, label: "7 gün (varsayılan)" },
    { days: 30, label: "30 gün", price: "+10.000 ₺" },
    { days: 365, label: "1 yıl", price: "+50.000 ₺" },
  ];

  return (
    <Card className="p-6">
      <h2 className="flex items-center gap-2 text-xl font-medium">
        <Archive className="h-5 w-5 text-gold" />
        Arşiv Süresi
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        Şu anda aktif:{" "}
        <strong className="text-ink">{effective} gün</strong>{" "}
        {currentDays === null && (
          <span className="text-xs text-ink-soft">
            (env varsayılanı)
          </span>
        )}
      </p>
      <p className="mt-1 text-xs text-ink-soft">
        Değişiklik yalnızca <strong>YENİ</strong> yüklenen fotoğraflara
        uygulanır; mevcut fotolar kendi `expire_at`'lerine sadık kalır.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {options.map((o) => {
          const isActive = o.days === currentDays;
          return (
            <button
              key={o.label}
              onClick={() => apply(o.days)}
              disabled={pending}
              className={`group flex flex-col items-start rounded-xl border p-3 text-left transition-colors disabled:opacity-50 ${
                isActive
                  ? "border-gold bg-gold-soft/15"
                  : "border-sand bg-white hover:bg-ivory"
              }`}
            >
              <span className="flex w-full items-center justify-between text-sm font-medium text-ink">
                {o.label}
                {isActive && <Check className="h-4 w-4 text-gold" />}
              </span>
              {o.price && (
                <span className="mt-1 text-xs text-gold">{o.price}</span>
              )}
            </button>
          );
        })}
      </div>

      {currentDays !== null && (
        <button
          onClick={() => apply(null)}
          disabled={pending}
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink-soft transition-colors hover:text-ink disabled:opacity-50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Varsayılana sıfırla
        </button>
      )}

      {msg && (
        <p className="mt-3 text-sm text-gold">{msg}</p>
      )}
    </Card>
  );
}
