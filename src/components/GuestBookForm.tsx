"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/card";
import { Send, CheckCircle2 } from "lucide-react";

const MAX_LEN = 400;

export function GuestBookForm({ coupleId }: { coupleId: string }) {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (honeypot) {
      // Bot — sessizce başarılı gibi davran
      setStatus("done");
      return;
    }
    if (!name.trim() || !msg.trim()) {
      return setError("Ad ve dilek alanlarını doldurun.");
    }
    if (msg.length > MAX_LEN) {
      return setError(`Mesaj ${MAX_LEN} karakterden uzun olamaz.`);
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/guest-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couple_id: coupleId,
          full_name: name.trim(),
          message: msg.trim(),
          honeypot,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus("idle");
        setError(data?.error ?? "Bir şeyler ters gitti, tekrar deneyin.");
        return;
      }
      setStatus("done");
      setName("");
      setMsg("");
    } catch (err) {
      console.error(err);
      setStatus("idle");
      setError("Bağlantı hatası, tekrar deneyin.");
    }
  };

  if (status === "done") {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-beige bg-white/70 p-6 text-center animate-float-up">
        <CheckCircle2 className="h-10 w-10 text-gold" />
        <p className="font-serif text-xl">Dileğiniz için teşekkürler!</p>
        <p className="text-sm text-ink-soft">Mesajınız anı defterine düşer düşmez göründü.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm text-gold hover:underline"
        >
          Yeni bir dilek bırak
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* Honeypot: insan dolduramaz */}
      <input
        type="text"
        name="hp"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div>
        <Label htmlFor="gb_name">Adınız</Label>
        <Input
          id="gb_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Adınız Soyadınız"
          autoComplete="name"
        />
      </div>
      <div>
        <Label htmlFor="gb_msg">Dileğiniz</Label>
        <Textarea
          id="gb_msg"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Bu özel günde size en güzel dileklerimle…"
          rows={3}
          maxLength={MAX_LEN}
        />
        <p className="mt-1 text-right text-xs text-ink-soft">
          {msg.length}/{MAX_LEN}
        </p>
      </div>

      {error && <p className="text-sm text-rose-gold">{error}</p>}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={status === "sending"}
      >
        <Send className="h-4 w-4" />
        {status === "sending" ? "Gönderiliyor…" : "Dileğimi Bırak"}
      </Button>
    </form>
  );
}
