"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Copy, Check } from "lucide-react";

const DEFAULT_TEMPLATE = (link: string) =>
  `Merhaba 💌

En özel günümüzde sizleri aramızda görmek bizim için çok kıymetli olacak.

Davetiyemize, katılım bildiriminize ve düğün galerimize buradan ulaşabilirsiniz:
${link}

Sevgilerimizle 🤍`;

export function InviteShareCard({
  coupleLabel,
  inviteUrl,
  title = "Misafirlere Davetiye Gönder",
  subtitle = "WhatsApp'tan kişiselleştirilmiş bir mesajla gönderin.",
}: {
  coupleLabel: string;
  inviteUrl: string;
  title?: string;
  subtitle?: string;
}) {
  const [text, setText] = useState(DEFAULT_TEMPLATE(inviteUrl));
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const waUrl = useMemo(
    () => `https://wa.me/?text=${encodeURIComponent(text)}`,
    [text]
  );

  const copy = async (value: string, which: "msg" | "link") => {
    try {
      await navigator.clipboard.writeText(value);
      if (which === "msg") {
        setCopiedMsg(true);
        setTimeout(() => setCopiedMsg(false), 1500);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 1500);
      }
    } catch {
      // sessiz geç
    }
  };

  return (
    <Card className="p-6">
      <h2 className="flex items-center gap-2 text-xl font-medium">
        <MessageCircle className="h-5 w-5 text-gold" />
        {title}
      </h2>
      <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>
      <p className="mt-2 text-xs text-ink-soft">
        Aşağıdaki metni düzenleyebilir, ardından WhatsApp'ta açıp{" "}
        <strong>{coupleLabel}</strong> davetlilerine gönderebilirsiniz.
      </p>

      <Textarea
        className="mt-4 min-h-44 font-mono text-sm"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-medium text-white shadow-sm hover:brightness-105"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp'ta Aç
        </a>
        <button
          onClick={() => copy(text, "msg")}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-sand bg-white px-5 text-sm text-ink transition-colors hover:bg-ivory"
        >
          {copiedMsg ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copiedMsg ? "Kopyalandı" : "Mesajı Kopyala"}
        </button>
        <button
          onClick={() => copy(inviteUrl, "link")}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-sand bg-white px-5 text-sm text-ink transition-colors hover:bg-ivory"
        >
          {copiedLink ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copiedLink ? "Kopyalandı" : "Linki Kopyala"}
        </button>
      </div>
    </Card>
  );
}
