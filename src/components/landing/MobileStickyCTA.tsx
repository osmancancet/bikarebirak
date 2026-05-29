"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

/**
 * Sadece mobile (sm:hidden) — sayfanın altında kullanıcı 200px scroll ettikten
 * sonra beliren sticky WhatsApp CTA.
 */
export function MobileStickyCTA({ href }: { href: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-40 transition-all duration-300 sm:hidden ${
        visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
    >
      <a
        href={href}
        className="flex items-center justify-between gap-3 rounded-full bg-gradient-to-br from-[#c2a14d] to-[#b8935f] px-5 py-3 text-white shadow-2xl shadow-gold/40"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <MessageCircle className="h-4 w-4" />
          WhatsApp'tan Yaz
        </span>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
          5.000 ₺
        </span>
      </a>
    </div>
  );
}
