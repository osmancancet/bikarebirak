"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Copy, Check, MessageCircle, KeyRound } from "lucide-react";

export function PortalLinkCard({
  coupleLabel,
  portalUrl,
}: {
  coupleLabel: string;
  portalUrl: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const waMessage = encodeURIComponent(
    `Merhaba ${coupleLabel}! Düğününüzün online panelinize buradan ulaşabilirsiniz:\n${portalUrl}\n\nBu linkte misafirlerinizin katılım bildirimlerini, fotoğraf sayılarını ve tüm fotoğrafları ZIP olarak indirme seçeneğini bulacaksınız. Linki kendiniz haricinde paylaşmayın.`
  );

  return (
    <Card className="p-6">
      <h2 className="flex items-center gap-2 text-xl font-medium">
        <KeyRound className="h-5 w-5 text-gold" />
        Çiftin Özel Portal Linki
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        Bu linki çifte iletin; bu linkle kendi panellerini açıp LCV ve
        fotoğrafları görebilirler. Bu linki başkalarıyla paylaşmamalarını
        hatırlatın.
      </p>

      <div className="mt-4 rounded-xl border border-beige bg-white/70 p-3 text-xs break-all text-ink-soft font-mono">
        {portalUrl}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={copy}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-sand bg-white px-4 text-sm text-ink transition-colors hover:bg-ivory"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Kopyalandı" : "Linki Kopyala"}
        </button>
        <a
          href={`https://wa.me/?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-medium text-white hover:brightness-105"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp ile Gönder
        </a>
      </div>
    </Card>
  );
}
