"use client";

import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Download, Check } from "lucide-react";

function QrCard({
  title,
  url,
  fileName,
}: {
  title: string;
  url: string;
  fileName: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const canvas = ref.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${fileName}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <Card className="flex flex-col items-center p-6 text-center">
      <h3 className="text-lg font-medium">{title}</h3>
      <div ref={ref} className="my-4 rounded-xl bg-white p-3 shadow-sm">
        <QRCodeCanvas
          value={url}
          size={180}
          level="H"
          marginSize={2}
          fgColor="#3b362f"
        />
      </div>
      <p className="mb-4 max-w-full truncate text-xs text-ink-soft">{url}</p>
      <div className="flex w-full gap-2">
        <Button variant="outline" size="default" className="flex-1" onClick={copy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Kopyalandı" : "Linki Kopyala"}
        </Button>
        <Button size="default" onClick={download}>
          <Download className="h-4 w-4" />
          QR İndir
        </Button>
      </div>
    </Card>
  );
}

export function QrPanel({
  slug,
  baseUrl,
  coupleLabel,
}: {
  slug: string;
  baseUrl: string;
  coupleLabel: string;
}) {
  const inviteUrl = `${baseUrl}/${slug}`;
  const uploadUrl = `${baseUrl}/${slug}/yukle`;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <QrCard
        title="Davetiye & LCV"
        url={inviteUrl}
        fileName={`davetiye-${slug}`}
      />
      <QrCard
        title="Fotoğraf Yükleme (Masa QR)"
        url={uploadUrl}
        fileName={`yukle-${slug}`}
      />
      <p className="sm:col-span-2 text-center text-xs text-ink-soft">
        Galeri ekranı için:{" "}
        <span className="text-gold">
          {baseUrl}/{slug}/galeri
        </span>{" "}
        — {coupleLabel} düğün salonundaki projeksiyona yansıtılır.
      </p>
    </div>
  );
}
