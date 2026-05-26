# BiKareBırak — Dijital Düğün Asistanı

Düğünlerde davetlilerin çektiği fotoğrafları tek havuzda toplayan; dijital
davetiye ve LCV (katılım) yönetimi sağlayan premium platform.

**İş modeli:** Concierge (anahtar teslim). Kullanıcı kaydı **yoktur**. Çiftler
sistemi WhatsApp üzerinden satın alır, kurulumu yalnızca yönetici `/admin`
panelinden yapar.

## Teknolojiler

- **Next.js 16** (App Router) + **TypeScript** (strict)
- **Tailwind CSS v4** + özel düğün teması (beyaz / bej / altın / rose-gold)
- **Firebase** — Firestore (çift & LCV), Storage (fotoğraflar), `onSnapshot` ile realtime galeri
- **Framer Motion** (animasyonlar) · **canvas-confetti** · **qrcode.react** · **lucide-react**

## Kurulum

### 1. Firebase projesi oluştur
[console.firebase.google.com](https://console.firebase.google.com) → yeni proje.
- **Build → Firestore Database** → veritabanı oluştur (production mode).
- **Build → Storage** → başlat.
- Storage'ın "kullandıkça öde" (Blaze) planı istemesi normaldir; düğün ölçeğinde
  maliyet çok düşüktür ve cömert ücretsiz kota vardır.

### 2. Güvenlik kuralları
- Firestore kuralları: [`firebase/firestore.rules`](firebase/firestore.rules) içeriğini
  Firestore → Rules sekmesine yapıştır.
- Storage kuralları: [`firebase/storage.rules`](firebase/storage.rules) içeriğini
  Storage → Rules sekmesine yapıştır.

### 3. Anahtarlar
- **Web app config**: Project Settings → General → "Your apps" → Web app ekle.
  Çıkan değerleri `NEXT_PUBLIC_FIREBASE_*` alanlarına gir.
- **Service Account**: Project Settings → Service accounts → "Generate new private key".
  İnen JSON'dan `project_id`, `client_email`, `private_key` değerlerini
  `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` alanlarına gir.
  (private_key'i tırnak içinde, `\n` kaçışlarıyla tek satır olarak yapıştır.)

`.env.local` örneği için [`.env.example`](.env.example) dosyasına bak.

### 4. Çalıştır
```bash
npm install
npm run dev
```

## Sayfalar & Kullanıcı Yolculuğu

| Rota | Açıklama |
|------|----------|
| `/` | Tanıtım / satış sayfası (WhatsApp'a yönlendirir) |
| `/admin` | Yönetici paneli — çift oluştur, QR üret, LCV listesi (şifre korumalı) |
| `/admin/login` | Yönetici giriş ekranı |
| `/admin/[id]` | Çift detayı: istatistikler, QR kodlar, LCV listesi |
| `/[cift_slug]` | Dijital davetiye: geri sayım, mekan, LCV formu |
| `/[cift_slug]/yukle` | Idiot-proof fotoğraf yükleme (büyük buton, progress, konfeti) |
| `/[cift_slug]/galeri` | Karanlık mod, masonry, **realtime** canlı galeri |

## Akış özeti

1. **Satış & Kurulum** — Yönetici `/admin`'den çift profili oluşturur, sistem
   `cift_slug` + QR kod + link üretir.
2. **Davetiye & LCV** — Çift, `/[cift_slug]` linkini misafirlere iletir;
   misafirler katılım bildirir.
3. **Fotoğraf Yükleme** — Masadaki QR → `/[cift_slug]/yukle`. Şifre/üyelik yok.
4. **Canlı Galeri** — `/[cift_slug]/galeri` projeksiyona yansıtılır, yeni
   fotoğraflar sayfa yenilenmeden düşer.

## Otomatik Fotoğraf Temizliği (1 hafta saklama)

Her fotoğraf, **yüklendiği andan itibaren 7 gün** sonra otomatik silinir
(`NEXT_PUBLIC_RETENTION_DAYS` ile değiştirilebilir). Silme her fotoğrafın kendi
`expire_at` damgasına göre yapıldığı için **aynı hafta içindeki farklı düğünler
birbirini etkilemez** — yeni düğünün fotoğrafları dururken, süresi dolan eski
fotoğraflar temizlenir.

- Temizliği [`src/app/api/cleanup/route.ts`](src/app/api/cleanup/route.ts) yapar;
  süresi dolan fotoğrafları hem **Storage'dan** hem **Firestore'dan** siler.
- Endpoint `CRON_SECRET` ile korunur. [`vercel.json`](vercel.json) içindeki cron
  her gün 04:00 UTC'de tetikler (Vercel, `CRON_SECRET` env'i varsa `Authorization`
  başlığını otomatik ekler).
- **Vercel dışı** barındırmada: herhangi bir cron servisi (örn. cron-job.org) ile
  günlük şu adresi çağırın:
  `https://siteniz.com/api/cleanup?secret=CRON_SECRET`
- **Yedek/alternatif (kodsuz):**
  - Firestore → TTL policy: `photos` koleksiyonunda `expire_at` alanı için TTL aç.
  - Cloud Storage → Lifecycle: bucket'a "7 günden eski nesneleri sil" kuralı ekle.

## Notlar
- Canlı galeri Firestore `onSnapshot` ile çalışır; ekstra kurulum gerekmez.
- Fotoğraflar Firebase Storage'a `photos/{slug}/{uuid}` yoluna yüklenir, indirme
  URL'i Firestore `photos` koleksiyonunda saklanır.
- Galeri görselleri `next/image` ile `unoptimized` modda servis edilir; istenirse
  `next.config.ts` içindeki `remotePatterns` (firebasestorage.googleapis.com) ile
  optimizasyon açılabilir.
