# BZ309 Mikroişlemciler — Vize Hazırlık Platformu

Ders notları ve çıkmış sınavlardan derlenmiş, **internetsiz çalışan** bir sınav hazırlık sitesi.

## Nasıl açılır?

1. Repoyu indir (**Code → Download ZIP**) ve zip'i aç.
2. `index.html` dosyasına çift tıkla. Kurulum, sunucu ya da internet gerekmez.

İlerlemen (çözdüğün sorular, yanlışların) yalnızca kendi tarayıcında saklanır.

## Sitede neler var?

| Bölüm | İçerik |
|---|---|
| **Konu anlatımı** | 8 konu: Temeller ve tarihçe, Sayı sistemleri ve IEEE 754, Bellek yönetimi, Yazmaçlar ve bayraklar, Adresleme modları ve yığın, Sık çıkan komutlar, Toolchain, Calling convention |
| **Tek sayfa özet** | Sınavdan önce son tekrar için kopya kâğıdı tadında özet |
| **Deneme sınavı** | Konu ağırlıklarına göre 25 soru ve 40 dakika, ya da süresiz çalışma modu |
| **Çıkmış sorular** | 2025 vize, 2024 yaz vize, 2023 vize, 2014 vize ve 2017 final. Hepsi tek tek çözüldü, cevap anahtarındaki hatalar düzeltildi |
| **Soru bankası** | Yaklaşık 340 soru (190 yeni ve 113+ çıkmış). Konu filtresi ve arama var |
| **Yanlışlarım** | Yanlış yaptığın sorular burada toplanır, doğru çözdükçe listeden düşer |
| **Hesaplama araçları** | Sayı/tümleyen çevirici, IEEE 754 (adım adım), segment:offset ve PUSH, bayrak (CF/OF/ZF/SF/PF/AF) simülatörü, db/dw/dd adres hesabı, endianness, ASCII tablosu |

## PDF'ler (`pdf/`)

- `1-konu-anlatimi.pdf`: tüm konu anlatımı
- `2-tek-sayfa-ozet.pdf`: özet
- `3-cikmis-sorular-cozumlu.pdf`: çıkmış sorular, cevaplar ve açıklamalar
- `4-soru-bankasi-cevapli.pdf`: soru bankası

## Klasör yapısı

```
index.html            → siteyi açan dosya
assets/               → stil ve uygulama kodu
data/                 → konular.js, sorular.js, cikmislar.js (içerik burada)
pdf/                  → yazdırılabilir PDF'ler
```

## İçerik düzeltmek

Bir soruyu ya da konuyu değiştirmek için `data/` içindeki ilgili `.js` dosyasını düzenle. Soru formatı şöyle:

```js
{t:"sayilar", q:"Soru metni", c:"isteğe bağlı kod", o:["A","B","C","D","E"], a:2, e:"açıklama"}
```

PDF'leri yeniden üretmek için sitede `#/yazdir/konular`, `#/yazdir/ozet`, `#/yazdir/cikmis` ya da `#/yazdir/sorular` sayfasını aç ve tarayıcıdan **Yazdır → PDF olarak kaydet** seç.
