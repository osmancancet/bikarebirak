"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Printer, ScanLine } from "lucide-react";

function Card({
  coupleLabel,
  uploadUrl,
}: {
  coupleLabel: string;
  uploadUrl: string;
}) {
  return (
    <div className="masa-card relative flex flex-col items-center justify-between overflow-hidden rounded-[1.5rem] bg-[#fdfbf7] p-9 text-center">
      {/* çift altın çerçeve */}
      <span className="pointer-events-none absolute inset-3 rounded-[1.1rem] border border-[#d9c7ad]" />
      <span className="pointer-events-none absolute inset-[14px] rounded-[1rem] border border-[#e7d8bd]" />

      <div className="relative">
        <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#b8935f]">
          Anılarınızı Paylaşın
        </p>
        <h2 className="mt-2.5 font-serif text-[2rem] leading-tight text-[#3b362f]">
          {coupleLabel}
        </h2>
        {/* süslü ayraç */}
        <div className="my-3 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#c2a14d]" />
          <span className="text-[#c2a14d]">&#10070;</span>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#c2a14d]" />
        </div>
        <p className="mx-auto max-w-[16rem] text-[13px] leading-relaxed text-[#6f675b]">
          Bu güzel günün her karesini sizinle ölümsüzleştirmek istiyoruz.
          Çektiğiniz fotoğrafları bizimle paylaşır mısınız?
        </p>
      </div>

      {/* QR */}
      <div className="relative my-5 rounded-2xl border border-[#ede3d3] bg-white p-3.5 shadow-sm">
        <QRCodeSVG
          value={uploadUrl}
          size={172}
          level="H"
          marginSize={1}
          fgColor="#3b362f"
        />
      </div>

      {/* adımlar */}
      <div className="relative w-full">
        <p className="mb-2.5 flex items-center justify-center gap-2 text-[13px] font-semibold tracking-wide text-[#3b362f]">
          <ScanLine className="h-4 w-4 text-[#c2a14d]" />
          KAREKODU TELEFONUNUZLA OKUTUN
        </p>
        <div className="flex items-center justify-center gap-2 text-[11px] text-[#6f675b]">
          <span className="rounded-full bg-[#f3ead9] px-2.5 py-1">
            1 · Kamerayı tutun
          </span>
          <span className="rounded-full bg-[#f3ead9] px-2.5 py-1">
            2 · Yükle&apos;ye basın
          </span>
          <span className="rounded-full bg-[#f3ead9] px-2.5 py-1">3 · Hazır!</span>
        </div>
        <p className="mt-3 text-[10px] text-[#9a8f7d]">
          Uygulama indirmenize ya da kayıt olmanıza gerek yok.
        </p>
      </div>

      <p className="relative mt-4 font-serif text-[15px] tracking-wide text-[#b8935f]">
        BiKareBırak
      </p>
    </div>
  );
}

export function PrintableCards({
  coupleLabel,
  uploadUrl,
  coupleId,
}: {
  coupleLabel: string;
  uploadUrl: string;
  coupleId: string;
}) {
  return (
    <>
      <style>{`
        /* Ekranda da kartların zarif zemini görünsün */
        .masa-card { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        @media print {
          body * { visibility: hidden !important; }
          #print-area, #print-area * { visibility: visible !important; }
          #print-area {
            position: absolute; left: 0; top: 0; width: 100%;
            -webkit-print-color-adjust: exact; print-color-adjust: exact;
          }
          .no-print { display: none !important; }
          .masa-card {
            break-inside: avoid; page-break-inside: avoid;
            box-shadow: none !important;
          }
          @page { size: A4; margin: 10mm; }
        }
      `}</style>

      {/* Ekran kontrolleri — yazdırmada gizlenir */}
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/admin/${coupleId}`}
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Çift detayına dön
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#c2a14d] to-[#b8935f] px-6 text-sm font-medium text-white shadow-md transition-all hover:brightness-105 active:scale-[0.98]"
        >
          <Printer className="h-5 w-5" />
          Yazdır / PDF&apos;e Kaydet
        </button>
      </div>

      <div className="no-print mb-6 rounded-2xl border border-beige bg-ivory/60 p-4 text-center text-sm text-ink-soft">
        Çift bu kartları kendi yazdırıp masalara koyacak. Sayfa başına{" "}
        <strong>4 kart</strong> dizilir; daha fazla masa için yazdırma
        penceresinde <strong>kopya sayısını</strong> artırması yeterli. Renklerin
        çıkması için yazdırma ayarlarında{" "}
        <strong>&quot;Arka plan grafikleri&quot;</strong> açık olmalı (genelde
        otomatiktir).
      </div>

      {/* Yazdırılacak alan: A4'e 4 kart */}
      <div
        id="print-area"
        className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} coupleLabel={coupleLabel} uploadUrl={uploadUrl} />
        ))}
      </div>
    </>
  );
}
