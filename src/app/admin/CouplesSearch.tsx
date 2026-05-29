"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Couple } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatWeddingDate } from "@/lib/utils";
import { Calendar, ChevronRight, Search } from "lucide-react";

export function CouplesSearch({ couples }: { couples: Couple[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLocaleLowerCase("tr-TR");
    if (!needle) return couples;
    return couples.filter((c) => {
      const hay = `${c.groom_name} ${c.bride_name} ${c.slug} ${c.venue_name}`
        .toLocaleLowerCase("tr-TR");
      return hay.includes(needle);
    });
  }, [q, couples]);

  if (couples.length === 0) {
    return (
      <Card className="p-8 text-center text-ink-soft">
        Henüz çift eklenmedi. Yukarıdaki formdan ilk çifti oluşturun.
      </Card>
    );
  }

  return (
    <>
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Çift ara: isim, slug, mekan…"
          className="pl-11"
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="p-8 text-center text-ink-soft">
          “{q}” için eşleşme bulunamadı.
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <Link key={c.id} href={`/admin/${c.id}`}>
              <Card className="flex items-center justify-between p-5 transition-colors hover:bg-ivory">
                <div>
                  <p className="text-xl font-medium">
                    {c.groom_name} & {c.bride_name}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatWeddingDate(c.wedding_date)}
                  </p>
                  <p className="mt-0.5 text-sm text-gold">/{c.slug}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-ink-soft" />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
