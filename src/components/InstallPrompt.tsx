"use client";

import { useEffect, useState } from "react";
import { Download, X, Share, Plus } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "bkb_install_dismissed";

/**
 * Davetiye sayfasında "Ana Ekrana Ekle" mini öneri.
 * - Chrome/Edge: native beforeinstallprompt event yakalanır.
 * - iOS Safari: "Paylaş → Ana Ekrana Ekle" talimatı gösterilir.
 * - Bir kez kapatılırsa 30 gün boyunca tekrar gösterilmez.
 */
export function InstallPrompt() {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIos, setShowIos] = useState(false);
  const [dismissed, setDismissed] = useState(true); // SSR safe

  useEffect(() => {
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const ts = Number(dismissedAt);
      if (Number.isFinite(ts) && Date.now() - ts < 30 * 86400 * 1000) {
        return;
      }
    }

    // Zaten standalone modda mı?
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;
    if (isStandalone) return;

    setDismissed(false);

    // iOS algılama
    const ua = window.navigator.userAgent;
    const isIos = /iPhone|iPad|iPod/.test(ua);
    if (isIos) {
      // 8 saniye sonra göster (rahatsız etmemek için)
      const t = setTimeout(() => setShowIos(true), 8000);
      return () => clearTimeout(t);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const close = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setEvent(null);
    setShowIos(false);
    setDismissed(true);
  };

  const install = async () => {
    if (!event) return;
    await event.prompt();
    await event.userChoice;
    close();
  };

  if (dismissed) return null;
  if (!event && !showIos) return null;

  return (
    <div className="fixed bottom-5 left-5 right-5 z-30 mx-auto max-w-sm rounded-2xl border border-beige bg-white/95 p-4 shadow-2xl shadow-gold/20 backdrop-blur sm:left-7 sm:right-auto sm:bottom-7 sm:max-w-sm">
      <button
        onClick={close}
        className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full text-ink-soft hover:bg-ivory"
        aria-label="Kapat"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <div className="flex gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#c2a14d] to-[#b8935f] text-white">
          <Download className="h-4 w-4" />
        </span>
        <div className="pr-4">
          <p className="text-sm font-medium text-ink">
            Davetiyeyi telefonuna ekle
          </p>
          {event && (
            <>
              <p className="mt-1 text-xs text-ink-soft">
                Tek tıkla ana ekrana ekle, düğün gününde daha hızlı eriş.
              </p>
              <button
                onClick={install}
                className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-br from-[#c2a14d] to-[#b8935f] px-4 text-xs font-medium text-white shadow-sm hover:brightness-105"
              >
                <Download className="h-3.5 w-3.5" />
                Ana Ekrana Ekle
              </button>
            </>
          )}
          {showIos && (
            <>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                Safari'de aşağıdaki <Share className="inline h-3.5 w-3.5 text-gold" />{" "}
                <strong>Paylaş</strong> butonuna basın, sonra "
                <Plus className="inline h-3.5 w-3.5 text-gold" />{" "}
                <strong>Ana Ekrana Ekle</strong>" seçeneğini seçin.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
