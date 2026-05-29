import Link from "next/link";
import { Card } from "@/components/ui/card";
import { KeyRound, MessageCircle } from "lucide-react";

export default async function InvalidLinkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <Card className="max-w-md p-8 text-center">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-ivory text-gold">
          <KeyRound className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-medium">Linkiniz hatalı veya süresi dolmuş</h1>
        <p className="mt-3 text-ink-soft">
          Bu portala erişebilmek için BiKareBırak'ın size ilettiği özel linki
          kullanmanız gerekir. Linki kaybettiyseniz veya çalışmıyorsa bize
          WhatsApp'tan ulaşın.
        </p>
        <a
          href={`https://wa.me/905548364486?text=${encodeURIComponent(
            `Merhaba, ${slug} portal linkimi yenilemek istiyorum.`
          )}`}
          className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#c2a14d] to-[#b8935f] px-6 text-sm font-medium text-white"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp'tan Yaz
        </a>
        <Link
          href="/"
          className="mt-3 block text-xs text-ink-soft hover:text-ink"
        >
          Ana sayfaya dön
        </Link>
      </Card>
    </main>
  );
}
