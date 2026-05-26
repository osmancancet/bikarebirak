"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/card";
import { Heart, Minus, Plus, PartyPopper } from "lucide-react";

export function RsvpForm({ coupleId }: { coupleId: string }) {
  const [fullName, setFullName] = useState("");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fullName.trim()) return setError("Lütfen ad soyad girin.");
    if (attending === null) return setError("Katılım durumunu seçin.");

    setStatus("sending");
    try {
      await addDoc(collection(getDb(), "guests_rsvp"), {
        couple_id: coupleId,
        full_name: fullName.trim(),
        attending,
        guest_count: attending ? guestCount : 0,
        created_at: serverTimestamp(),
      });
    } catch {
      setStatus("idle");
      setError("Bir şeyler ters gitti, tekrar deneyin.");
      return;
    }
    setStatus("done");
  };

  if (status === "done") {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center animate-float-up">
        <PartyPopper className="h-12 w-12 text-gold" />
        <p className="font-serif text-2xl">Teşekkür ederiz!</p>
        <p className="text-ink-soft">
          {attending
            ? "Sizi aramızda görmek için sabırsızlanıyoruz."
            : "Bildiriminiz için teşekkürler, sizi özleyeceğiz."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <Label htmlFor="full_name">Ad Soyad</Label>
        <Input
          id="full_name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Adınız Soyadınız"
          autoComplete="name"
        />
      </div>

      <div>
        <Label>Katılacak mısınız?</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAttending(true)}
            className={`h-12 rounded-xl border text-sm font-medium transition-all ${
              attending === true
                ? "border-gold bg-gold-soft/20 text-ink ring-2 ring-gold/30"
                : "border-sand bg-white/60 text-ink-soft hover:bg-ivory"
            }`}
          >
            Evet, geliyorum
          </button>
          <button
            type="button"
            onClick={() => setAttending(false)}
            className={`h-12 rounded-xl border text-sm font-medium transition-all ${
              attending === false
                ? "border-rose-gold bg-rose-50 text-rose-gold ring-2 ring-rose-gold/30"
                : "border-sand bg-white/60 text-ink-soft hover:bg-ivory"
            }`}
          >
            Maalesef gelemiyorum
          </button>
        </div>
      </div>

      {attending === true && (
        <div className="animate-float-up">
          <Label>Kaç kişi geliyorsunuz?</Label>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-10 text-center font-serif text-2xl font-semibold tabular-nums">
              {guestCount}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setGuestCount((c) => Math.min(20, c + 1))}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-rose-gold">{error}</p>}

      <Button
        type="submit"
        size="lg"
        variant="rose"
        className="w-full"
        disabled={status === "sending"}
      >
        <Heart className="h-4 w-4" />
        {status === "sending" ? "Gönderiliyor…" : "Katılımımı Bildir"}
      </Button>
    </form>
  );
}
