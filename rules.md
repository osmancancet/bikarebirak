Proje: BiKareBırak (Dijital Düğün Asistanı)

1. Proje Özeti ve İş Modeli

BiKareBırak, düğünlerde davetlilerin çektiği fotoğrafları tek bir havuzda toplayan, dijital davetiye ve LCV (Katılım Durumu) yönetimini sağlayan premium bir platformdur.
ÖNEMLİ İŞ MODELİ KURALI: Bu sistemde kullanıcıların kendi kendine kayıt olduğu (Sign up/Register) bir ekran YOKTUR. Sistem tamamen "Concierge (Anahtar Teslim)" mantığıyla çalışır. Çiftler sistemi 2500 TL karşılığında satın alır. Satışlar WhatsApp üzerinden yapılır. Kayıtları, veritabanı kurulumlarını ve QR kod üretimlerini sadece sistem yöneticisi (biz) /admin paneli üzerinden yaparız.

2. Adım Adım Kullanıcı Yolculuğu (Uygulama Akışı)

Yapay zeka asistanı kod yazarken aşağıdaki 4 aşamalı kullanıcı yolculuğunu her zaman baz almalıdır:

Adım 1: Satış ve Kurulum (Admin Süreci)

Müşteri WhatsApp'tan ulaşır, ödemeyi yapar.

Admin, /admin paneline girer (Sadece Admin yetkisi olanlar girebilir).

Çift için yeni bir profil oluşturur: cift_slug (örn: ahmet-ayse-2026), Düğün Tarihi, Mekan Bilgisi, Karşılama Metni.

Sistem bu çifte özel bir QR Kod ve paylaşılabilir link üretir.

Adım 2: Dijital Davetiye ve LCV (Düğün Öncesi Misafir Süreci)

Admin, çifte özel linki (bikarebirak.com/[cift_slug]) çifte iletir. Çift bunu misafirlerine WhatsApp'tan atar.

Misafirler linke tıklar, şık bir dijital davetiye ekranı açılır (Geri sayım, mekan haritası vb. bulunur).

Sayfanın altında LCV formu vardır: "Ad Soyad", "Katılacak mısınız? (Evet/Hayır)", "Kaç kişi geliyorsunuz?".

LCV verileri Supabase veritabanına kaydedilir. Admin ve Çift bu listeyi bir panelden görebilir.

Adım 3: Fotoğraf Yükleme (Düğün Günü Misafir Süreci - EN KRİTİK ADIM)

Düğün mekanındaki masalara QR kodlar yerleştirilir.

Misafirler QR kodu telefon kamerasıyla okutur.

Doğrudan bikarebirak.com/[cift_slug]/yukle sayfasına yönlendirilirler.

DİKKAT: Şifre, üyelik, uygulama indirme KESİNLİKLE YOKTUR. Sistem "Idiot-Proof" (herkesin anlayacağı kadar basit) olmalıdır.

Ekranda büyük bir "Fotoğraf Yükle" butonu vardır. Basınca telefonun kamerası veya galerisi açılır.

Yükleme sırasında bir Progress Bar (İlerleme Çubuğu) görünür ve bitince konfeti animasyonu ile "Başarıyla Yüklendi" mesajı çıkar.

Adım 4: Canlı Galeri (Düğün Günü Mekan Süreci)

Düğün salonundaki dev ekrana veya projeksiyona bikarebirak.com/[cift_slug]/galeri sayfası yansıtılır.

Bu sayfa karanlık mod (Dark Mode) uyumlu, şık bir Masonry Grid (tuğla dizilimi) yapısındadır.

Misafirler telefondan fotoğraf yükledikçe, ekrandaki galeri SAYFA YENİLENMEDEN (Real-time / WebSocket veya Polling ile) anında güncellenir ve yeni fotoğraf ekrana düşer.

3. Teknoloji Yığını (Tech Stack)

Framework: Next.js (App Router)

Dil: TypeScript (Strict mode aktif, any kullanımı yasak).

Stil & UI: Tailwind CSS, Shadcn UI (Hızlı ve erişilebilir bileşenler için), Framer Motion (Mikro etkileşimler ve konfeti/yükleme animasyonları için).

Veritabanı & Backend: Supabase (PostgreSQL LCV'ler ve Çift bilgileri için, Storage Buckets fotoğraflar için).

İkonlar: Lucide React veya FontAwesome.

4. Geliştirme Felsefesi (Vibe Coding)

İzin İsteme: Bana kod yazarken "Şunu yapayım mı?", "Bu dosyayı güncelleyeyim mi?" diye sorma. Doğrudan çalışan, kopyala-yapıştır yapılabilir tam dosyaları ver.

Mobil Öncelikli (Mobile-First): Özellikle /yukle ve /[cift_slug] sayfaları %99 mobilden kullanılacaktır. UI tasarımı tamamen mobile göre optimize edilmeli, butonlar büyük ve tıklanabilir olmalıdır.

Hız: Next.js Server Components kullanarak davetiye sayfalarını olabildiğince hızlı render et. Fotoğraf yüklemeleri Supabase Storage'a doğrudan ve optimize edilmiş şekilde gitmeli.

Görsellik: Düğün konseptine uygun olarak beyaz, kırık beyaz, bej ve altın/rose-gold tonlarında zarif bir arayüz tasarla.

5. Veritabanı Şeması Beklentisi

Kod yazmaya başlamadan veya yeni bir özellik eklerken Supabase için şu 3 temel tablo yapısını aklında bulundur:

couples (id, slug, bride_name, groom_name, wedding_date, venue_name, created_at)

guests_rsvp (id, couple_id, full_name, attending, guest_count, created_at)

photos (id, couple_id, storage_path, public_url, created_at)