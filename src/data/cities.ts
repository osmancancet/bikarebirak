export interface City {
  slug: string;
  name: string;
  description: string;
  popular_venues?: string[];
}

export const CITIES: City[] = [
  {
    slug: "istanbul",
    name: "İstanbul",
    description:
      "İstanbul, hem boğaz kıyısındaki tarihi yalılar hem de modern düğün salonları ile yılın her dönemi düğüne ev sahipliği yapan tek şehir. BiKareBırak dijital davetiyesi ile İstanbul'un tüm semtlerinde düğününüzü premium bir deneyime dönüştürün.",
    popular_venues: [
      "Sait Halim Paşa Yalısı",
      "Çırağan Sarayı",
      "Esma Sultan Yalısı",
      "The Marmara Esma Sultan",
    ],
  },
  {
    slug: "ankara",
    name: "Ankara",
    description:
      "Başkentte hem klasik şıklığı hem de modern düğün konseptlerini birleştirmek mümkün. Ankara'nın seçkin mekanlarında BiKareBırak ile davetiyeden anı defterine kadar her şey dijital.",
  },
  {
    slug: "izmir",
    name: "İzmir",
    description:
      "Ege'nin gelininin payına ferah, açık hava düğünleri düşer. İzmir ve çevresinde plaj kıyısı veya bağ evi düğünleri için BiKareBırak'ın dijital davetiyesi, misafirlerin yol tarifi ve katılım bildirimi konusunda kolaylık sağlar.",
  },
  {
    slug: "antalya",
    name: "Antalya",
    description:
      "Destinasyon düğününün başkenti Antalya'da, yurt dışından gelen misafirler için davetiye linkinizi WhatsApp'tan paylaşmak gerek. BiKareBırak'ın çoklu cihaz desteği ile her cihazdan kullanım sorunsuz.",
  },
  {
    slug: "bursa",
    name: "Bursa",
    description:
      "Bursa'da köklü aile düğünlerinin geleneksel sıcaklığını dijital davetiye ile sade ve şık bir şekilde misafirlere ulaştırın.",
  },
  {
    slug: "eskisehir",
    name: "Eskişehir",
    description:
      "Genç ve modern bir düğün kültürüne sahip Eskişehir'de BiKareBırak'ın minimalist temaları çiftlerin tarzıyla mükemmel uyum sağlar.",
  },
  {
    slug: "adana",
    name: "Adana",
    description:
      "Akdeniz'in misafirperver şehri Adana'da büyük katılımlı düğünlerin LCV ve fotoğraf yönetimi BiKareBırak ile kolay.",
  },
  {
    slug: "konya",
    name: "Konya",
    description:
      "Konya'nın geleneksel ve şık düğün anlayışına dijital davetiyenin pratiklik katması için BiKareBırak ideal.",
  },
];
