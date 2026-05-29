import { VARIANTS } from "@/data/social-variants";
import { MediaCard } from "./MediaCard";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon, Download, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default function MediaKitPage() {
  const squareVariants = VARIANTS.filter((v) => v.size === "square");
  const storyVariants = VARIANTS.filter((v) => v.size === "story");

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-medium">
            <ImageIcon className="h-6 w-6 text-gold" />
            Medya Kiti
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Instagram için hazır görseller + caption + hashtag paketi.
            Her bir görselden indir, caption'ı kopyala, paylaş.
          </p>
        </div>
        <a
          href="/api/social/zip-all"
          download="bikarebirak-medya-kit.zip"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-br from-[#c2a14d] to-[#b8935f] px-5 text-sm font-medium text-white shadow-sm hover:brightness-105"
        >
          <Download className="h-4 w-4" />
          Tüm Paketi ZIP İndir
        </a>
      </header>

      {/* Posts */}
      <section>
        <h2 className="mb-4 text-2xl font-medium">
          Post Görselleri ({squareVariants.length})
        </h2>
        <p className="mb-5 text-sm text-ink-soft">
          1080 × 1080 px · Instagram feed için
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {squareVariants.map((v) => (
            <MediaCard key={v.key} variant={v} />
          ))}
        </div>
      </section>

      {/* Stories */}
      <section>
        <h2 className="mb-4 text-2xl font-medium">
          Story Görselleri ({storyVariants.length})
        </h2>
        <p className="mb-5 text-sm text-ink-soft">
          1080 × 1920 px · Instagram story & reel kapağı için
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {storyVariants.map((v) => (
            <MediaCard key={v.key} variant={v} />
          ))}
        </div>
      </section>

      {/* Reel kurgusu */}
      <Card className="p-7">
        <h2 className="flex items-center gap-2 text-2xl font-medium">
          <FileText className="h-5 w-5 text-gold" />
          Reel Senaryosu (30 sn) — "Düğünün her karesi"
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Aşağıdaki kurguyu kullanarak ekran kaydı + canlı çekim ile 30 saniyelik reel'inizi hazırlayın.
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-beige text-left text-xs uppercase tracking-widest text-ink-soft">
                <th className="py-2 pr-4 font-medium">Sn</th>
                <th className="py-2 pr-4 font-medium">Sahne</th>
                <th className="py-2 pr-4 font-medium">Kaynak</th>
                <th className="py-2 font-medium">Müzik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige">
              <tr>
                <td className="py-3 pr-4 text-ink-soft tabular-nums">0–3</td>
                <td className="py-3 pr-4 text-ink">
                  Siyah → altın "BiKareBırak" logosu fade-in
                </td>
                <td className="py-3 pr-4 text-ink-soft">
                  Landing'in hero animasyonu (ekran kaydı)
                </td>
                <td className="py-3 text-ink-soft">Soft piano başlangıç</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-ink-soft tabular-nums">3–8</td>
                <td className="py-3 pr-4 text-ink">
                  Telefon mockup → Şevval & Abdurrahman davetiyesi açılıyor
                </td>
                <td className="py-3 pr-4 text-ink-soft">
                  /sevval-abdurrahman ekran kaydı (Chrome DevTools "iPhone 14 Pro")
                </td>
                <td className="py-3 text-ink-soft">Crescendo</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-ink-soft tabular-nums">8–14</td>
                <td className="py-3 pr-4 text-ink">
                  QR kod ekrana çıkıyor → telefon kamerası okutuyor → yükleme sayfası açılıyor
                </td>
                <td className="py-3 pr-4 text-ink-soft">
                  Gerçek telefon çekimi: masada QR + biri okutuyor
                </td>
                <td className="py-3 text-ink-soft">Müzik devam</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-ink-soft tabular-nums">14–20</td>
                <td className="py-3 pr-4 text-ink">
                  Yükleme animasyonu: progress bar + konfeti
                </td>
                <td className="py-3 pr-4 text-ink-soft">
                  /yukle akışının ekran kaydı
                </td>
                <td className="py-3 text-ink-soft">Müzik enerjik</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-ink-soft tabular-nums">20–26</td>
                <td className="py-3 pr-4 text-ink">
                  Galeri sayfası — fotoğraflar masonry'ye düşüyor
                </td>
                <td className="py-3 pr-4 text-ink-soft">
                  /galeri realtime sayfa ekran kaydı
                </td>
                <td className="py-3 text-ink-soft">Pik</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-ink-soft tabular-nums">26–30</td>
                <td className="py-3 pr-4 text-ink">
                  Final: "BiKareBırak.com" + WhatsApp CTA
                </td>
                <td className="py-3 pr-4 text-ink-soft">
                  Statik kart (yukarıdaki "hero" görselini kullanabilirsin)
                </td>
                <td className="py-3 text-ink-soft">Müzik fade</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-2xl border border-beige bg-ivory/60 p-5">
          <h3 className="text-sm font-semibold text-ink">Çekim ipuçları</h3>
          <ul className="mt-2 space-y-1 text-sm text-ink-soft">
            <li>
              • Telefon emülatörü: Chrome DevTools → Toggle device toolbar → "iPhone 14 Pro" → QuickTime "New Screen Recording" + "High Quality"
            </li>
            <li>
              • Canlı çekim sahneleri (QR okutma) iPhone'da 1080p 30fps
            </li>
            <li>
              • Müzik için telifsiz öneri:{" "}
              <a
                href="https://pixabay.com/music/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline"
              >
                Pixabay Music
              </a>{" "}
              "wedding piano" araması, veya Epidemic Sound abonelik
            </li>
            <li>
              • Altyazı için CapCut (ücretsiz mobil app) öneririz
            </li>
            <li>
              • <strong className="text-rose-gold">⚠️ Telif:</strong> Spotify/YouTube'dan rastgele şarkı kullanma — Instagram telifli müziği susturur veya reel'i kaldırır.
            </li>
          </ul>
        </div>
      </Card>

      {/* Reel 2 - kısa */}
      <Card className="p-7">
        <h2 className="text-xl font-medium">Reel 2 — Önce/Sonra (15 sn)</h2>
        <ul className="mt-3 space-y-2 text-sm text-ink-soft">
          <li>
            <strong>0–2sn:</strong> "Düğün foto'larınız nerede?" sorusu
          </li>
          <li>
            <strong>2–7sn:</strong> Karmaşık WhatsApp grupları, dağınık kareler montajı (stock veya temsili)
          </li>
          <li>
            <strong>7–12sn:</strong> "Tek havuza yüklüyorlar" → BiKareBırak yükleme + galeri akışı
          </li>
          <li>
            <strong>12–15sn:</strong> WhatsApp CTA
          </li>
        </ul>
      </Card>
    </div>
  );
}
