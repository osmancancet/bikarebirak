/**
 * Hero mockup içinde gösterilen sahte davetiye önizlemesi.
 * Telefon kasası içinde küçültülmüş "Aslı & Mert" sahte davetiyesi.
 * Server-safe: ikon yok, sadece tipografi + CSS.
 */
export function FauxInvitationPreview() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-cream via-ivory to-beige p-5 text-center">
      <p className="text-[8px] uppercase tracking-[0.35em] text-gold">
        Evleniyoruz
      </p>
      <p className="mt-3 font-serif text-2xl leading-tight text-ink">
        Aslı
        <span className="mx-1.5 text-gold-gradient">&amp;</span>
        Mert
      </p>
      <div className="my-2 flex items-center gap-1.5">
        <span className="h-px w-6 bg-gradient-to-r from-transparent to-gold/70" />
        <span className="text-[10px] text-gold">◆</span>
        <span className="h-px w-6 bg-gradient-to-l from-transparent to-gold/70" />
      </div>
      <p className="text-[9px] text-ink-soft">12 Haziran 2026</p>

      {/* mini geri sayım */}
      <div className="mt-3 flex gap-1">
        {["12", "08", "32", "11"].map((n, i) => (
          <div
            key={i}
            className="rounded-md border border-beige bg-white/70 px-1.5 py-0.5"
          >
            <p className="font-serif text-[11px] font-semibold tabular-nums text-ink">
              {n}
            </p>
          </div>
        ))}
      </div>

      {/* mini RSVP */}
      <div className="mt-3 w-full space-y-1.5">
        <div className="h-1.5 w-full rounded-full bg-white/60" />
        <div className="h-1.5 w-3/4 rounded-full bg-white/60" />
        <div className="mt-1 flex gap-1">
          <div className="flex h-3.5 flex-1 items-center justify-center rounded-full bg-gold/30">
            <span className="text-[6px] font-medium text-ink">Evet</span>
          </div>
          <div className="h-3.5 flex-1 rounded-full bg-white/40" />
        </div>
      </div>

      <p className="mt-3 font-serif text-[8px] text-gold-gradient">
        BiKareBırak
      </p>
    </div>
  );
}
