import imageCompression from "browser-image-compression";

/**
 * Fotoğrafı tarayıcıda yüklemeye hazırlar:
 * 1) HEIC ise lazy import ile heic2any kullanarak JPEG'e çevirir.
 * 2) Maks 2048px, ~2MB hedefiyle sıkıştırır (browser-image-compression
 *    EXIF rotasyonunu otomatik düzeltir).
 *
 * Hem dosya boyutunu ~70% düşürür hem de iPhone HEIC sorununu çözer.
 */
export async function preparePhoto(input: File): Promise<File> {
  let file: File = input;
  const isHeic =
    /image\/hei[cf]/i.test(input.type) || /\.hei[cf]$/i.test(input.name);

  if (isHeic) {
    try {
      // heic2any sadece tarayıcıda ve sadece HEIC için import edilsin
      const { default: heic2any } = await import("heic2any");
      const converted = await heic2any({
        blob: input,
        toType: "image/jpeg",
        quality: 0.9,
      });
      const blob = Array.isArray(converted) ? converted[0] : converted;
      const baseName = input.name.replace(/\.hei[cf]$/i, "");
      file = new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
    } catch (err) {
      console.warn("HEIC dönüştürme başarısız, orijinali deniyoruz:", err);
    }
  }

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 2,
      maxWidthOrHeight: 2048,
      useWebWorker: true,
      initialQuality: 0.85,
      fileType: "image/jpeg",
    });
    // Sonuç File değilse File'a sar
    if (compressed instanceof File) return compressed;
    return new File([compressed], file.name.replace(/\.[^.]+$/, ".jpg"), {
      type: "image/jpeg",
    });
  } catch (err) {
    console.warn("Sıkıştırma başarısız, orijinali yüklüyoruz:", err);
    return file;
  }
}

/** Tarayıcıda küçük thumbnail önizleme URL'i üretir (Object URL). */
export function makePreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}
