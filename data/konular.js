/* Konu anlatımları — Mikroişlemciler (BZ309) vize
   Kaynak: ders defteri (hafta 1–4), Doç. Dr. Bilal Babayiğit iskelet notları (hafta 1–5),
   ders içi el notları ve 2014–2025 çıkmış sorular.
   Not: file:// ile çalışabilmesi için veriler JSON değil, JS dosyası olarak tutulur. */
window.KONULAR = [
/* ======================================================================= 1 */
{
  id: "temeller",
  no: 1,
  hafta: "Hafta 1",
  baslik: "Mikroişlemci Temelleri ve Tarihçe",
  ozet: "MPU–MCU–SoC, Von Neumann–Harvard, Intel tarihi, Power Wall, çok çekirdek, CISC–RISC, önbellek.",
  agirlik: 5,
  html: `
<p class="lead">Sınavın en "sözel" kısmı burası. Her yıl 4–6 soru bu konudan geliyor: <b>ilk işlemci, ilk 32 bit, Power Wall, CISC/RISC, ARM, L1/L2/L3, mikroişlemci–mikrodenetleyici farkı</b>.</p>

<h2>1.1 Mikroişlemci (MPU) – Mikrodenetleyici (MCU) – SoC</h2>
<div class="box def"><b>CPU:</b> Komutları çalıştıran; aritmetik ve mantık işlemlerini yapan merkezi işlem birimi.<br>
<b>Mikroişlemci:</b> CPU'nun <u>tek bir entegre devre (çip)</u> üzerinde gerçekleştirilmiş hâli. Bellek ve G/Ç birimleri <b>dışarıdadır</b>.</div>
<table class="t">
<tr><th></th><th>Mikroişlemci (MPU)</th><th>Mikrodenetleyici (MCU)</th><th>SoC</th></tr>
<tr><td>İçerik</td><td>Sadece CPU; RAM, ROM, G/Ç yonga dışında</td><td>CPU + RAM + ROM + G/Ç <b>tek yongada</b></td><td>CPU + GPU + NPU + bellek denetleyicisi + modem… tek silikonda</td></tr>
<tr><td>Amaç</td><td>Genel amaçlı, işletim sistemi çalıştırır, yüksek performans</td><td>Belirli bir göreve adanmış (gömülü sistem), düşük maliyet/güç</td><td>Telefon/tablet gibi cihazda komple sistem</td></tr>
<tr><td>Mimari</td><td>Genelde Von Neumann</td><td>Genelde Harvard</td><td>Karma</td></tr>
<tr><td>Örnek</td><td>PC işlemcisi (Intel Core, AMD Ryzen)</td><td>Arduino (ATmega), PIC, STM32, ESP32</td><td>Apple M serisi, Snapdragon</td></tr>
</table>
<div class="box exam"><b>Sınavda nasıl soruldu?</b>
<ul>
<li>"Mikroişlemci nedir?" → <b>Bilgisayarın merkezi işlem birimidir; bellek ve G/Ç birimlerini içermez.</b> ("Kendine entegre bellek ve G/Ç bulunan" şıkkı <u>mikrodenetleyicinin</u> tanımıdır, tuzaktır.)</li>
<li>"Hangisi MPU–MCU farklarından <u>değildir</u>?" → "Mikrodenetleyici çok yüksek hafıza, hız ve işlem gereken yerlerde tercih edilir" (yanlış; MCU minimal ve özel işler içindir).</li>
<li><b>Arduino</b> = temelde bir mikrodenetleyici kartı (basit gömülü projeler). <b>Raspberry Pi</b> = Linux çalıştırabilen tek kartlı bilgisayar (SoC). <b>PIC</b> = bir mikrodenetleyicidir. <b>PLC</b> = endüstriyel otomasyon; Raspberry Pi eğitim/prototip.</li>
</ul></div>

<h2>1.2 Bellek Mimarileri: Von Neumann – Harvard</h2>
<div class="grid2">
<div class="card"><h4>Von Neumann</h4><div class="diag"><span class="blk">CPU</span><span class="arr">⇄ tek yol ⇄</span><span class="blk red">Bellek (komut + veri)</span></div>
<p>Komut ve veri <b>aynı bellekte</b>, <b>tek ortak yol</b>. Basit ve ucuz. Komut ve veri aynı anda taşınamaz → <b>Von Neumann darboğazı</b>.</p></div>
<div class="card"><h4>Harvard</h4><div class="diag"><span class="blk">CPU</span><span class="arr">⇄ yol 1 ⇄</span><span class="blk red">Komut belleği</span><br><span class="blk" style="visibility:hidden">CPU</span><span class="arr">⇄ yol 2 ⇄</span><span class="blk green">Veri belleği</span></div>
<p>Komut ve veri belleği <b>fiziksel olarak ayrı</b>, ayrı yollar → eş zamanlı erişim, darboğaz yok. Daha karmaşık/pahalı.</p></div>
</div>
<div class="box tip"><b>Günümüz = Değiştirilmiş (hibrit) Harvard:</b> Dışarıdan tek RAM → Von Neumann gibi. Çekirdeğin içinde <b>L1 komut (L1-I)</b> ve <b>L1 veri (L1-D)</b> önbelleği ayrı → çekirdek içinde Harvard.</div>

<h2>1.3 Tarihsel Süreç (zaman çizelgesi)</h2>
<div class="timeline">
<div><b>1971 · Intel 4004</b>İlk ticari (tek yongalı) mikroişlemci. <b>4 bit</b>, ~2300 transistör. Busicom <b>hesap makinesi</b> için yapıldı ama en önemli özelliği <b>programlanabilir</b> (genel amaçlı) olmasıydı.</div>
<div><b>1972 · Intel 8008</b>4004'ün <b>8 bit</b> versiyonu. 16 KB adresleme, 48 komut.</div>
<div><b>1974 · Intel 8080</b>8 bit, 64 KB adresleme, Altair 8800. Aynı dönemde <b>Zilog Z80</b> (Intel'den ayrılanlar kurdu), <b>Motorola 6800</b>, <b>MOS 6502</b> (çok ucuz → Apple II, Commodore 64, NES). <b>8085</b> (1977): Intel'in son 8 bit genel amaçlı işlemcisi.</div>
<div><b>1978 · Intel 8086</b><b>16 bit</b>, 16 bit veri yolu, <b>20 bit adres yolu → 1 MB</b>. <b>x86 mimarisinin babası.</b></div>
<div><b>1979 · 8088 / Motorola 68000</b>8088: içi 16 bit, dış veri yolu <b>8 bit</b> (eski 8 bit donanım/yazılımla uyum). <b>IBM PC 8088'i kullandı</b> → x86 standart oldu. 68000: 32 bit dâhili mimari, grafik arayüz çağı (Macintosh, Amiga, Atari ST, Sega Mega Drive).</div>
<div><b>1982 · 80286</b>24 bit adres → <b>16 MB</b>. Korumalı modu ilk sunan; <b>hem gerçek hem korumalı modda</b> çalışabilir. (Eski sınav anahtarı: "sanal bellek içeren ilk Intel = 80286".)</div>
<div><b>1985 · 80386</b><b>İlk 32 bit x86</b>, 32 bit adres → <b>4 GB</b>, ~275.000 transistör. Tam <b>korumalı mod + sayfalama (paging)</b> → çok görevli işletim sistemleri (Windows, Linux).</div>
<div><b>1989 · 80486</b>>1 milyon transistör, <b>FPU (matematik işlemci) ve 8 KB önbellek yonga içinde</b>.</div>
<div><b>1993 · Pentium</b>AMD "AM386/AM486" üretince Intel rakamları tescil ettiremedi → 586 yerine <b>Pentium</b> (penta = 5). <b>Süperskalar</b>: bir saat vuruşunda birden fazla komut. 64 bit dış veri yolu.</div>
<div><b>1995 · Pentium Pro</b>36 bit adres → 64 GB.</div>
<div><b>2000 · AMD Athlon</b><b>1 GHz'i aşan ilk</b> işlemci. 2003: AMD <b>x86'ya 64 biti getirdi</b> (AMD64 / x86-64).</div>
<div><b>~2005–2006 · Core Duo</b>Power Wall nedeniyle <b>çok çekirdeğe</b> geçiş (Core Duo, Core 2 Duo).</div>
<div><b>2021+ · Hibrit çekirdek</b>Intel P-Core/E-Core (Alder Lake, Meteor Lake), Apple M serisi, ARM big.LITTLE.</div>
</div>

<h3>Sahneden çekilen devler – dersler</h3>
<ul>
<li><b>Zilog Z80</b>: 8 bitin kralıydı. IBM'in Intel'i seçmesi ve x86'nın yükselişi + 16/32 bite geçişte geride kalması → kayboldu.</li>
<li><b>Motorola 68000</b>: Macintosh/Amiga'nın kalbiydi. x86'nın PC dünyasındaki ezici hâkimiyeti; Apple da Intel'e geçti.</li>
<li><b>MOS 6502</b>: Çok ucuz ve verimli; ama Intel gibi devlerin Ar-Ge bütçesine yetişemedi (Commodore pazar adaptasyonunu sağlayamadı).</li>
<li><b>ARM</b>: <b>Acorn RISC Machine</b> (Acorn Computers). Düşük güç hedefi; çip üretmek yerine <b>mimari lisans satar</b> → başarılı oldu.</li>
<li>Çıkarılan dersler: <i>Teknik üstünlük yeterli değildir · Ekosistem her şeydir · Adaptasyon ya da ölüm · Doğru zamanda doğru karar.</i></li>
</ul>
<div class="box exam"><b>Sınav tuzağı:</b> "Hangisi mikroişlemci üreticisi/firması değildir?" → <b>Dell</b> (bilgisayar toplar), <b>Army</b>. Freescale, Zilog, Fairchild, National Instruments, Intel, AMD, Motorola şık olarak gelebilir.</div>

<h2>1.4 Fiziksel Engeller: Moore, Power Wall, Dennard</h2>
<ul>
<li><b>Moore Yasası</b> (Gordon Moore, 1965): Yongadaki transistör sayısı yaklaşık <b>her 2 yılda ikiye katlanır</b>.</li>
<li><b>Frekans yarışı</b>: 2000'de AMD Athlon 1 GHz'i aştı. Frekans ↑ → güç tüketimi ↑↑ → ısı ↑↑.</li>
</ul>
<div class="diag flow"><span class="blk">Frekans ↑</span><span class="arr">→</span><span class="blk">Güç ↑↑</span><span class="arr">→</span><span class="blk">Isı ↑↑</span><span class="arr">→</span><span class="blk red"><b>Power Wall</b><br>3–4 GHz tavan</span></div>
<div class="box def"><b>Power Wall (Güç Duvarı):</b> Frekans artırıldıkça işlemcinin soğutulamayacak kadar ısınması (erime noktası) fiziksel sınırı. Bu yüzden saat hızları <b>3–4 GHz</b> civarında kaldı. <span class="tag">Sınav sorusu</span></div>
<div class="box def"><b>Dennard ölçeklemesinin çöküşü (~2005):</b> Eskiden transistör küçüldükçe voltaj/akım da orantılı düşer, <b>güç yoğunluğu sabit</b> kalırdı. Silikon sınırında kaçak akımlar başladı, voltaj daha fazla düşürülemedi.</div>
<p><b>Çözüm → Çok çekirdek:</b> Tek çekirdeği hızlandırmak yerine aynı yongaya birden fazla çekirdek (Intel <b>Core Duo</b>). Yeni felsefe: <i>"Daha hızlı değil, daha fazla"</i> — performans artık paralel kaç iş yapıldığına bağlı.</p>

<h2>1.5 CISC – RISC, Heterojen Çekirdek, RISC-V</h2>
<table class="t">
<tr><th></th><th>CISC (Complex Instruction Set Computer)</th><th>RISC (Reduced Instruction Set Computer)</th></tr>
<tr><td>Felsefe</td><td>"Donanım akıllı olsun": tek komutla karmaşık iş (bellekten oku + işle + yaz)</td><td>"Donanım basit ama çok hızlı olsun": basit komutların birleşimi</td></tr>
<tr><td>Temsilci</td><td><b>Intel / AMD x86</b>, Motorola 68000</td><td><b>ARM</b>, RISC-V, MIPS</td></tr>
<tr><td>Transistör / güç</td><td>Çok transistör, yüksek güç ve ısı</td><td>Az transistör, <b>düşük güç</b>, yüksek enerji verimliliği</td></tr>
</table>
<ul>
<li><b>ARM</b> işlemciler genellikle <b>düşük güç tüketimli cihazlar</b> için tasarlanır ve Intel'den <b>daha az enerji</b> tüketir.</li>
<li><b>Heterojen çekirdek</b> (big.LITTLE / P-Core + E-Core): Tüm çekirdekler aynı güçte değil. <b>P-Core</b>: oyun, render, ağır hesap. <b>E-Core</b>: arka plan işleri, boşta bekleme; pil tasarrufu, ısınmayı önler. Intel Meteor Lake'in öne çıkan yeniliği de budur.</li>
<li><b>RISC-V</b>: Telif ücreti olmayan, <b>açık kaynak</b> komut seti; <b>UC Berkeley</b> geliştirdi.</li>
<li>VLIW (Very Long Instruction Word), EPIC (Itanium) de şıklarda görülür; Intel x86 = CISC.</li>
</ul>

<h2>1.6 İşlemci Performansını Belirleyen Faktörler</h2>
<p>Performans <b>sadece GHz ile belirlenemez</b>.</p>
<ol>
<li><b>Çekirdek ve iş parçacığı (thread) sayısı</b> — aynı anda kaç bağımsız iş. <b>SMT / Hyper-Threading</b>: bir fiziksel çekirdeğin iki iş parçacığını aynı anda yürütmesi (aşçı fırını beklerken ikinci yemeğe başlar).</li>
<li><b>Saat hızı</b> (Base / Turbo) — saniyedeki saat çevrimi. Tek başına anlamsızdır çünkü bir çevrimde ne kadar iş yapıldığı (<b>IPC</b>, Instructions Per Cycle) da önemlidir. Periyot = 1/f (2 GHz → 0,5 ns).</li>
<li><b>Çekirdek dağılımı</b> (heterojen P/E).</li>
<li><b>Önbellek</b> (L1/L2/L3).</li>
<li><b>Komut seti mimarisi (ISA)</b> — x86, ARM…</li>
<li><b>Üretim teknolojisi</b> (nm). Intel 2024: Intel 4 (7 nm sınıfı) → Intel 20A (2 nm sınıfı) geçişi.</li>
<li><b>Paralellik</b>: Süperskalar (bir vuruşta çok komut) + Pipelining (boru hattı: getir → çöz → yürüt aşamaları üst üste).</li>
</ol>
<p>Bir mikroişlemcinin ayırt edici özellikleri: saat hızı, veri yolu genişliği (bus width), transistör sayısı, adreslenebilir bellek. ("Bit per second transmit" ayırt edici özellik <u>değildir</u>.)</p>

<h2>1.7 Önbellek (Cache) Hiyerarşisi</h2>
<p>RAM, işlemciye göre çok yavaştır. Çekirdeğin belleği beklememesi için çok hızlı ara bellekler kullanılır.</p>
<div class="pyramid">
<div style="width:30%">Yazmaç</div>
<div style="width:45%" class="c1">L1 — ceket cebi · KB · çekirdeğin içinde · I/D ayrı</div>
<div style="width:60%" class="c2">L2 — sırt çantası · KB–MB · çekirdeğe özel</div>
<div style="width:75%" class="c3">L3 — araba bagajı · onlarca MB · tüm çekirdekler paylaşır</div>
<div style="width:90%" class="c4">RAM — GB · anakart üzerinde · yavaş</div>
</div>
<p class="center small">Yukarı çıktıkça <b>hız ↑, kapasite ↓</b>. L1 en hızlı ve en küçük, L3 en yavaş ve en büyük.</p>
<div class="box exam"><b>Çıkmış:</b> "L1, L2, L3 veri erişim süresi?" → <b>L1 en hızlı, L3 en yavaş</b>. "En küçük kapasite?" → <b>L1</b>. 2023'te "Intel L1 boyutu?" diye belirsiz bir soru geldi; çekirdek başına tipik değer 32 KB komut + 32 KB veri = <b>64 KB</b> (yeni nesillerde 48 KB veri).</div>

<h2>1.8 Araştırma/ödev konuları (sınavda sözel gelebilir)</h2>
<ul>
<li><b>SIMD vektör yazmaçları</b>: MMX (1996, 64 bit, MM0–7) → SSE (128 bit, XMM) → AVX/AVX2 (256 bit, YMM) → <b>AVX-512</b> (512 bit, ZMM0–31). Tek komutla çok veri; multimedya, 3D, bilimsel hesap ve <b>yapay zekâ (LLM) çıkarımı</b>. 64 bit bir işlemcinin 512 bit yazmacı olabilir çünkü "64 bit" genel amaçlı yazmaç/adres genişliğini anlatır; vektör yazmaçları ayrı birimlerdir.</li>
<li><b>Telefon/PC işlemci raporu</b>: mimari, çekirdek sayısı, saat, L1/L2/L3, üretim teknolojisi.</li>
</ul>
`
},
/* ======================================================================= 2 */
{
  id: "sayilar",
  no: 2,
  hafta: "Hafta 2",
  baslik: "Sayı Sistemleri, ASCII, IEEE 754, Endianness",
  ozet: "Binary/hex çevrim, ikiye tümleyen, carry–overflow, ASCII/Unicode, IEEE 754 tek duyarlıklı, little/big endian.",
  agirlik: 5,
  html: `
<p class="lead">Hesaplama sorularının kaynağı. <b>IEEE 754 her sınavda en az 1–2 soru</b>; bayrak (CF/OF) ve tümleme soruları da çok sık.</p>

<h2>2.1 İkili (binary) – Onaltılı (hex)</h2>
<ul>
<li><b>8 bit = 1 bayt</b>. <b>4 bit = 1 hex basamağı</b> (nibble) → binary'yi 4'erli grupla.</li>
<li>Hex yazımı: <code>0x413F</code> veya <code>413Fh</code>. Assembly'de harfle başlayan hex'in önüne 0 konur: <code>0F2h</code>, <code>0FFFFh</code>.</li>
</ul>
<div class="bits4"><span>0100</span><span>0001</span><span>0011</span><span>1111</span><br><span>4</span><span>1</span><span>3</span><span>F</span></div>
<table class="t small"><tr><th>Dec</th><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td></tr>
<tr><th>Hex</th><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>A</td><td>B</td><td>C</td><td>D</td><td>E</td><td>F</td></tr>
<tr><th>Bin</th><td>0000</td><td>0001</td><td>0010</td><td>0011</td><td>0100</td><td>0101</td><td>0110</td><td>0111</td><td>1000</td><td>1001</td><td>1010</td><td>1011</td><td>1100</td><td>1101</td><td>1110</td><td>1111</td></tr></table>
<p><b>Örnekler:</b> 149 = 1001 0101b = 95h · 1101 0110b = D6h = 214 · B7h = 1011 0111b = 183 · <b>100 = 64h</b> (MOV AL,100 → AL = 64h).</p>
<p><b>Kesirli kısım</b>: 2 ile çarp, tam kısmı yaz. 0,375 → 0,75(0) → 1,5(1) → 1,0(1) ⇒ <b>0,011b</b>. 0,6875 = 0,1011b. 0,25 = 0,01b. 0,625 = 0,101b.</p>

<h2>2.2 İşaretsiz ve İşaretli Tam Sayılar</h2>
<table class="t"><tr><th></th><th>Aralık (n bit)</th><th>8 bit</th><th>16 bit</th></tr>
<tr><td>İşaretsiz</td><td>0 … 2<sup>n</sup>−1</td><td>0 … 255</td><td>0 … 65535</td></tr>
<tr><td>İşaretli (ikiye tümleyen)</td><td>−2<sup>n−1</sup> … 2<sup>n−1</sup>−1</td><td>−128 … +127</td><td>−32768 … +32767</td></tr></table>
<p><b>İşaret-büyüklük</b> yöntemi (MSB işaret, kalanı büyüklük) kusurludur: <b>iki sıfır</b> (+0 = 0000 0000, −0 = 1000 0000) ve toplama bozulur (+5 + (−5) = 1000 1010 = −10).</p>
<div class="box def"><b>İkiye tümleyen (2's complement):</b> Çıkarmayı ek devre olmadan toplayıcıyla yapar.<br>
1) Pozitif ikili yaz → 2) Tüm bitleri ters çevir (bire tümleyen) → 3) +1 ekle.<br>
+5 = 0000 0101 → 1111 1010 → <b>1111 1011 = −5</b> (FBh).<br>
MSB (en yüksek değerlikli bit) <b>işaret bitidir</b>: 1 ise negatif.</div>
<p>Hex'te hızlı yol: negatif = (FF..F − sayı) + 1. Örn. 16 bit −1 = FFFFh, −2 = FFFEh.</p>

<h2>2.3 Elde (Carry) ve Taşma (Overflow)</h2>
<table class="t"><tr><th></th><th>Carry Flag (CF)</th><th>Overflow Flag (OF)</th></tr>
<tr><td>Hangi aritmetik?</td><td><b>İşaretsiz</b></td><td><b>İşaretli</b></td></tr>
<tr><td>Anlamı</td><td>MSB'den dışarı elde çıktı (toplama) / ödünç alındı (çıkarma)</td><td>Sonuç işaretli aralığa sığmadı, işaret biti bozuldu</td></tr>
<tr><td>Donanım</td><td>CF = C<sub>n</sub> (son toplayıcının elde çıkışı)</td><td>OF = C<sub>n−1</sub> ⊕ C<sub>n</sub> (XOR kapısı)</td></tr></table>
<div class="box tip"><b>OF kısa yolu:</b> İki <b>pozitif</b> toplanıp sonuç <b>negatif</b> çıkarsa ya da iki <b>negatif</b> toplanıp <b>pozitif</b> çıkarsa OF = 1. Farklı işaretli iki sayının toplamında <u>asla</u> taşma olmaz.</div>
<p><b>Örnek (+70)+(+80)</b>: 0100 0110 + 0101 0000 = 1001 0110 = −106 (işaretli) → <b>OF=1</b>, CF=0 (işaretsiz 150 ≤ 255 sığar).</p>
<p><b>Örnek (hoca sorusu)</b>: A=5Ah (+90), B=4Ch (+76). A+B = <b>A6h</b> = 1010 0110 → işaretli −90. CF=0 (8 bitte dışarı elde yok), <b>OF=1</b> (iki pozitif toplandı, sonuç negatif; 166 > 127).</p>
<div class="box exam"><b>2023 vizesi:</b><br>
• AX=7FFFh (32767) + BX=1 → 8000h. İşaretsiz elde yok → <b>CF = 0 (sıfır olur)</b>; işaretli taşma var → OF=1. (Birçok öğrenci "CF set edilir" işaretledi — <u>yanlış</u>.)<br>
• AX=8000h + BX=8000h → 1 0000h → AX=0000h, CF=1, ZF=1, OF=1, düşük bayt 00h'da 1 sayısı çift (0) → <b>PF = 1 (set edilir)</b>.</div>

<h2>2.4 Karakter Kodlama</h2>
<ul>
<li><b>ASCII</b>: <b>7 bit</b>, 128 karakter. PC'lerde kullanılan klasik standart. Sadece temel Latin.</li>
<li>'A' = 65 = <b>41h</b>, 'a' = 97 = <b>61h</b>, '0' = 48 = <b>30h</b>, boşluk = 20h, <b>CR (satır başı) = 0Dh</b>, <b>LF (alt satır) = 0Ah</b>. CR+LF = yeni satır (\\n).</li>
<li>Büyük–küçük harf farkı <b>32 = 20h</b> = <b>5. bit</b>. <code>XOR AL, 20h</code> → harfin büyüklüğünü tersine çevirir; <code>AND AL, 0DFh</code> → büyük harf; <code>OR AL, 20h</code> → küçük harf.</li>
<li>Rakam karakteri → sayı: <code>SUB AL, 30h</code>; sayı → karakter: <code>ADD AL, 30h</code>.</li>
<li><b>Genişletilmiş ASCII</b>: 8 bit, 256 karakter.</li>
<li><b>Unicode</b>: Tüm diller, simgeler, emojiler. <b>UTF-8</b>: <b>değişken uzunluklu</b> (1–4 bayt), ASCII ile geriye uyumlu (ASCII karakterleri 1 bayt). (Eski notlarda "Unicode 16 bit" der — UTF-16'yı kastediyor.)</li>
</ul>

<h2>2.5 Kayan Noktalı Sayılar – IEEE 754</h2>
<p>İkili bilimsel gösterimde normalize sayı her zaman <b>1.xxxx × 2<sup>n</sup></b> şeklindedir; baştaki 1 saklanmaz (<b>gizli bit</b>), yalnızca virgülden sonrası (mantis) saklanır.</p>
<div class="bitfield"><span class="s">S<br><small>1 bit</small></span><span class="e">Üs (E)<br><small>8 bit</small></span><span class="m">Mantis (M)<br><small>23 bit</small></span></div>
<table class="t"><tr><th></th><th>Tek duyarlıklı (float, 32 bit)</th><th>Çift duyarlıklı (double, 64 bit)</th></tr>
<tr><td>İşaret / Üs / Mantis</td><td>1 / 8 / 23</td><td>1 / 11 / 52</td></tr>
<tr><td>Bias</td><td><b>127</b></td><td><b>1023</b></td></tr>
<tr><td>Değer</td><td>(−1)<sup>S</sup> × 1.M × 2<sup>E−127</sup></td><td>(−1)<sup>S</sup> × 1.M × 2<sup>E−1023</sup></td></tr></table>
<h3>Ondalık → IEEE 754 (5 adım)</h3>
<div class="steps">
<p><b>Örnek: −12,25</b></p>
<ol>
<li>İşaret: negatif → <b>S = 1</b></li>
<li>İkiliye çevir: 12 = 1100, 0,25 = 0,01 → <b>1100,01</b></li>
<li>Normalize: 1,10001 × 2<sup>3</sup> → gerçek üs 3</li>
<li>Saklanan üs: 3 + 127 = 130 = <b>1000 0010</b></li>
<li>Mantis: 10001 + 18 sıfır → 1 | 1000 0010 | 1000 1000…0</li>
</ol>
<p>Bitleri 4'erli grupla: 1100 0001 0100 0100 0000… = <b>0xC1440000</b></p>
</div>
<p>Diğer örnekler: <b>9,75</b> = 1001,11 = 1,00111×2³ → <b>0x411C0000</b> · <b>−12,6875</b> = 1100,1011 → <b>0xC14B0000</b> · <b>10,625</b> = 1010,101 → 0 10000010 0101010… = <b>0x412A0000</b> · <b>11,0</b> = 0x41300000.</p>
<h3>IEEE 754 → Ondalık</h3>
<div class="steps">
<p><b>Örnek: 0xBE200000</b></p>
<ol>
<li>Binary: 1011 1110 0010 0000 …</li>
<li>S = 1 (negatif); E = 0111 1100 = 124 → gerçek üs = 124 − 127 = <b>−3</b>; M = 0100…</li>
<li>Sayı = −1,01b × 2<sup>−3</sup> = −1,25 × 0,125 = <b>−0,15625</b></li>
</ol></div>
<p>Diğerleri: 0x411E0000 = <b>+9,875</b> · 0x41300000 = <b>11,0</b> · 0xC00C0000 = −1,00011b×2¹ = <b>−2,1875</b> (2024 çıkmışı).</p>
<div class="box tip"><b>Hızlı kontrol:</b> 0x41… ile başlayan pozitif sayılar 8–16 arası (üs 3), 0x40… 2–8 arası (üs 1–2), 0x3F… 0,5–2 arası, 0xC… negatif. Sitedeki <a href="#/araclar/ieee">IEEE 754 aracı</a> ile adım adım dene.</div>

<h2>2.6 Endianness (Bayt Sıralaması)</h2>
<p>Bellek <b>bayt adreslemelidir</b>. Çok baytlı bir veri belleğe hangi sırayla yazılır?</p>
<table class="t"><tr><th></th><th>Little Endian (küçük sonlu)</th><th>Big Endian (büyük sonlu)</th></tr>
<tr><td>Kural</td><td>En düşük değerli bayt (LSB) <b>en küçük adrese</b></td><td>En yüksek değerli bayt (MSB) en küçük adrese</td></tr>
<tr><td>Kullanan</td><td><b>Intel / AMD x86</b>, modern ARM varsayılanı</td><td>Motorola 68k, SPARC, <b>ağ (TCP/IP) – "Network Byte Order"</b></td></tr>
<tr><td>0x1A2B3C4D → 2000..2003</td><td>4D 3C 2B 1A</td><td>1A 2B 3C 4D</td></tr></table>
<p>Analoji: Gün/Ay/Yıl (little) – Yıl/Ay/Gün (big). ARM aslında <b>bi-endian</b> (iki modu da destekler) ama genelde little kullanılır.</p>
`
},
/* ======================================================================= 3 */
{
  id: "bellek",
  no: 3,
  hafta: "Hafta 3",
  baslik: "Bellek Yönetimi: Gerçek Mod, Korumalı Mod, Sayfalama",
  ozet: "Segment:Offset, fiziksel adres hesabı, GDT/LDT, seçici, Ring 0–3, 10-10-12 sayfalama, TLB, CR0/CR3, flat mod, A20.",
  agirlik: 5,
  html: `
<p class="lead">"Bellek yönetimi neden gerekli, nasıl hesaplanır?" — her sınavda 3–5 soru. <b>Fiziksel adres formülü</b> ve <b>mod–bellek sınırı</b> tablosunu ezberle.</p>

<h2>3.1 Adres hattı ↔ bellek kapasitesi</h2>
<p><b>n</b> adres hattı → <b>2<sup>n</sup></b> farklı bayt adreslenebilir.</p>
<table class="t"><tr><th>Adres yolu</th><th>Kapasite</th><th>İşlemci / mod</th></tr>
<tr><td>16 bit</td><td>64 KB</td><td>Tek 16 bit yazmacın görebildiği alan (bir segment)</td></tr>
<tr><td><b>20 bit</b></td><td><b>1 MB</b></td><td>8086/8088 – <b>gerçek mod</b></td></tr>
<tr><td>24 bit</td><td>16 MB</td><td>80286</td></tr>
<tr><td><b>32 bit</b></td><td><b>4 GB</b></td><td>80386+ – <b>korumalı mod</b> (32 bit Windows'ta 2×8 GB RAM taksan da 4 GB görürsün)</td></tr>
<tr><td>36 bit</td><td>64 GB</td><td>Pentium Pro (PAE)</td></tr>
<tr><td>40 bit</td><td>1 TB</td><td>Kitaptaki (Brey) 64 bit flat mod bilgisi – eski sınavlar</td></tr>
<tr><td>48 bit</td><td>256 TB</td><td>Günümüz x86-64 (4 seviyeli sayfalama); sunucular 57 bit</td></tr></table>
<p>Adres yolu <b>tek yönlüdür</b> (işlemciden belleğe/G/Ç'ye). Veri yolu <b>çift yönlüdür</b>. 8086'da veri yolu <b>16 bit</b>.</p>

<h2>3.2 Gerçek Mod (Real Mode) – Segment:Offset</h2>
<div class="box def"><b>Problem:</b> 8086'nın yazmaçları 16 bit (en fazla 64 KB görür) ama adres yolu 20 bit (1 MB).<br>
<b>Çözüm:</b> Bellek en fazla <b>64 KB</b>'lık <b>segmentlere</b> bölünür. Adres = <b>Segment</b> (bloğun başlangıcı) + <b>Offset</b> (blok içindeki uzaklık, 16 bit).</div>
<div class="formula">Fiziksel Adres = Segment × 16 + Offset = (Segment &lt;&lt; 4) + Offset</div>
<p>Hex'te ×16 = <b>sağa bir 0 eklemek</b> (4 bit sola kaydırma).</p>
<div class="steps"><p><b>Örnekler</b></p>
<ul>
<li>1234h:0010h → 12340h + 0010h = <b>12350h</b></li>
<li>CS = A000h, IP = 1234h → A0000h + 1234h = <b>A1234h</b> (sonraki komutun adresi)</li>
<li>1000:1F00 → 10000h + 1F00h = <b>11F00h</b></li>
<li>SS = 2400h, SP = 0100h, <code>PUSH AX</code> → SP = 0100h − 2 = 00FEh → fiziksel 24000h + 00FEh = <b>240FEh</b></li>
</ul></div>
<p><b>Bellek örtüşmesi (aliasing):</b> Farklı segment:offset çiftleri aynı fiziksel adresi gösterebilir: 0000:0100 = 0010:0000 = 00100h. Segmentler 16 baytlık sınırlardan (paragraf) başlar.</p>
<h3>Segment – offset yazmaç çiftleri</h3>
<table class="t"><tr><th>İş</th><th>Segment</th><th>Offset</th><th>Açıklama</th></tr>
<tr><td>Komut getirme</td><td><b>CS</b> (Code)</td><td><b>IP</b></td><td>Sonraki komutun adresi; IP otomatik artar</td></tr>
<tr><td>Yığın</td><td><b>SS</b> (Stack)</td><td><b>SP</b>, BP</td><td>PUSH/POP, dönüş adresi, yerel değişkenler</td></tr>
<tr><td>Veri</td><td><b>DS</b> (Data)</td><td>BX, SI, DI</td><td>Değişkenler, diziler</td></tr>
<tr><td>Ek veri</td><td><b>ES</b> (Extra)</td><td>DI</td><td>String/kopyalama işlemlerinde hedef</td></tr></table>
<p>4 segment yazmacı: <b>Code, Data, Stack, Extra</b> (sonradan FS, GS eklendi). Gerçek modda <b>sayfalama yoktur</b>, sadece segmentasyon; adres doğrudan fiziksel adrestir. 8086/8088/80186 sadece gerçek modda; <b>80286 ve üstü hem gerçek hem korumalı modda</b> çalışabilir.</p>

<h2>3.3 Korumalı Mod (Protected Mode, 80286/80386+)</h2>
<p><b>Neden?</b> Gerçek modda bellek koruması yok: bir program diğerinin (ya da işletim sisteminin) belleğine yazıp sistemi çökertebilir. Korumalı mod her programın sadece kendine izin verilen alana erişmesini donanımla sağlar → çok görevli, kararlı işletim sistemleri.</p>
<div class="diag flow"><span class="blk">Mantıksal adres<br><small>seçici : offset</small></span><span class="arr">segmentasyon →</span><span class="blk">Doğrusal (lineer) adres<br><small>32 bit</small></span><span class="arr">sayfalama (MMU) →</span><span class="blk red">Fiziksel adres<br><small>RAM'deki gerçek konum</small></span></div>
<ul>
<li>Segment yazmaçları artık taban adres değil, <b>seçici (selector)</b> tutar: tablodaki bir girdinin indeksi. Segment yazmacı → tablo → tanımlayıcı → taban adres.</li>
<li><b>Tanımlayıcı (descriptor)</b>: 8 baytlık girdi. İçinde segmentin <b>taban adresi (32 bit)</b>, <b>limiti (boyutu)</b>, <b>erişim hakları</b> (kod: çalıştırılabilir; veri: okunur/yazılır) ve türü.</li>
<li><b>GDT</b> (Global Descriptor Table): sistem geneli / işletim sistemi. <b>LDT</b> (Local): her göreve özel.</li>
</ul>
<div class="bitfield"><span class="m">İndeks (13 bit, bit 15–3)</span><span class="e">TI<br><small>1 bit</small></span><span class="s">RPL<br><small>2 bit</small></span></div>
<ul><li>13 bit indeks → 2<sup>13</sup> = <b>8192</b> tanımlayıcı. TI=0 → GDT, TI=1 → LDT. RPL: istenen ayrıcalık (2 bit → 4 seviye).</li>
<li>Korumalı modda (32 bit) bir program 16 bit seçici + 32 bit offset kullanır, sonuç <b>32 bit doğrusal adres</b>. Maksimum <b>4 GB</b>.</li></ul>
<h3>Koruma halkaları (Ring)</h3>
<div class="rings"><div class="r3">Ring 3 – Kullanıcı uygulamaları (en düşük yetki)<div class="r2">Ring 2<div class="r1">Ring 1<div class="r0">Ring 0<br>Kernel</div></div></div></div></div>
<p>Ring 1–2 sürücüler içindi, modern sistemlerde kullanılmıyor. Yetki aşımı → <b>GPF (General Protection Fault)</b>.</p>
<p>Korumalı mod yazmaçları: <b>GDTR, LDTR, IDTR, TR</b>; kontrol yazmaçları <b>CR0–CR4</b>.</p>

<h2>3.4 Sayfalama (Paging) ve Sanal Bellek</h2>
<ul>
<li>Programın gördüğü (sanal) adres uzayı eşit bloklara = <b>sayfa</b>; fiziksel RAM aynı boyutta <b>çerçevelere (frame)</b> bölünür. Sayfa boyutu genelde <b>4 KB</b>.</li>
<li><b>Sayfa tablosu</b>: hangi sanal sayfanın hangi fiziksel çerçevede olduğunu tutar. Sayfalar RAM'de <b>ardışık olmak zorunda değil</b> → belleğin verimli kullanımı.</li>
<li><b>Sanal belleğin amacı</b>: fiziksel RAM'den <b>daha büyük</b> bellek alanı sağlamak (disk takas alanı ile).</li>
</ul>
<h3>Neden 4 KB? — 10-10-12 kuralı (32 bit)</h3>
<div class="bitfield"><span class="s">Sayfa dizini<br><small>10 bit</small></span><span class="e">Sayfa tablosu<br><small>10 bit</small></span><span class="m">Offset<br><small>12 bit</small></span></div>
<p>Offset 12 bit → 2<sup>12</sup> = 4096 = <b>4 KB</b>. 2<sup>10</sup> × 2<sup>10</sup> × 4 KB = <b>4 GB</b> = 2<sup>32</sup>.</p>
<h3>Sayfa hatası (Page Fault, kesme 14)</h3>
<p>Sayfa tablosu girdisinde <b>P (present)</b> biti vardır. P = 0 olan sayfaya erişilirse MMU <b>sayfa hatası</b> üretir. İşletim sistemi: kesmeyi yakalar → sayfayı diskteki takas alanından okur → boş bir çerçeveye yükler → tabloyu günceller (P=1) → durdurulan komutu yeniden çalıştırır.</p>
<h3>Donanım birimleri</h3>
<ul>
<li><b>MMU</b> (Memory Management Unit): her erişimde sayfa tablolarını kullanarak sanal/doğrusal adresi fiziksele çevirir.</li>
<li><b>TLB</b> (Translation Look-aside Buffer): son çevrilen adreslerin önbelleği. TLB hit → tek çevrimde çeviri; miss → CR3'ten tabloları tara.</li>
<li><b>CR0</b>: <b>PE</b> biti korumalı modu, <b>PG</b> biti sayfalamayı açar. <b>CR3</b>: aktif görevin sayfa dizininin fiziksel taban adresi.</li>
</ul>

<h2>3.5 64 Bit ve Flat (Düz) Bellek Modeli</h2>
<ul>
<li>Segmentasyon büyük ölçüde terk edildi; program belleği <b>tek parça</b> görür, yönetim neredeyse tamamen <b>sayfalama</b> ile.</li>
<li>CS, DS, ES, SS tabanları donanımda <b>0</b> kabul edilir (CS hâlâ kod segmenti ve ayrıcalık bilgisi için kullanılır). <b>FS ve GS</b> istisna: <b>Thread Local Storage (TLS)</b> gibi işletim sistemi verileri için.</li>
<li>64 bit modda <b>gerçek mod yoktur</b>. Segment yazmaçları bellek konumunu adreslemek için kullanılmaz.</li>
<li>Eski sınav anahtarı (Brey): "64 bit flat modda adres 40 bittir, 1 TB adresler." Günümüzde sanal adres 48 bit (256 TB).</li>
</ul>
<table class="t"><tr><th>Mod</th><th>Adresleme</th><th>Adres</th><th>Bellek</th></tr>
<tr><td>Gerçek mod (8086)</td><td>Segment:Offset</td><td>20 bit</td><td>1 MB</td></tr>
<tr><td>Korumalı mod (386)</td><td>Segmentasyon + sayfalama</td><td>32 bit</td><td>4 GB</td></tr>
<tr><td>64 bit mod</td><td>Flat + sayfalama</td><td>48 bit (57 sunucu)</td><td>256 TB</td></tr></table>

<h2>3.6 A20 Gate (ödev)</h2>
<p>8086'da adres 1 MB'ı aşınca başa sarar (FFFFFh → 00000h, <i>wrap-around</i>); bazı DOS programları buna güveniyordu. 80286'nın 24 bit adres yolunda taşma olmayınca bu programlar çöktü. Çözüm: 21. adres hattı (<b>A20</b>) klavye denetleyicisindeki boş bir pinle açılıp kapatılabilen bir kapıya bağlandı; eski yazılımlar için A20 = 0 yapılarak taşma taklit edildi.</p>
`
},
/* ======================================================================= 4 */
{
  id: "yazmaclar",
  no: 4,
  hafta: "Hafta 4",
  baslik: "Yazmaçlar (Register) ve Bayraklar",
  ozet: "RAX/EAX/AX/AH/AL ailesi, R8–R15 ekleri, RSI/RDI/RBP/RSP/RIP, RFLAGS: ZF SF CF OF PF, boyut uyumu.",
  agirlik: 5,
  html: `
<p class="lead">Neredeyse her sınavda: "Hangisi 32 bitlik/8 bitlik yazmaçtır?", "Hangisi genel amaçlı yazmaç değildir?", "RAX/EBX/RSP ne için kullanılır?", "ZF ne zaman set edilir?"</p>

<h2>4.1 Neden yazmaç?</h2>
<p>RAM büyük ama yavaş ("kereste deposu"), yazmaç küçük ama işlemcinin kendi frekansında çalışan en hızlı bellek ("çalışma masası"). Verimli program: <b>RAM'den yazmaca yükle → işlemi yazmaçta yap → sonucu RAM'e yaz.</b> Hız sırası: <b>Yazmaç &gt; Önbellek &gt; RAM &gt; Disk</b>.</p>

<h2>4.2 Genel amaçlı yazmaçlar</h2>
<table class="t"><tr><th>64 bit</th><th>32 bit</th><th>16 bit</th><th>8 bit (yüksek / düşük)</th><th>Geleneksel rol</th></tr>
<tr><td><b>RAX</b></td><td>EAX</td><td>AX</td><td>AH / AL</td><td><b>Accumulator</b> – aritmetik/mantık, fonksiyon dönüş değeri</td></tr>
<tr><td><b>RBX</b></td><td>EBX</td><td>BX</td><td>BH / BL</td><td><b>Base</b> – bellek adreslemede taban</td></tr>
<tr><td><b>RCX</b></td><td>ECX</td><td>CX</td><td>CH / CL</td><td><b>Counter</b> – döngü sayacı (LOOP), kaydırma sayısı (CL)</td></tr>
<tr><td><b>RDX</b></td><td>EDX</td><td>DX</td><td>DH / DL</td><td><b>Data</b> – çarpma/bölmede yüksek kısım ve <b>kalan</b>, G/Ç port adresi</td></tr>
<tr><td>RSI</td><td>ESI</td><td>SI</td><td>SIL</td><td>Source Index – kaynak adres</td></tr>
<tr><td>RDI</td><td>EDI</td><td>DI</td><td>DIL</td><td>Destination Index – hedef adres</td></tr>
<tr><td>RBP</td><td>EBP</td><td>BP</td><td>BPL</td><td>Base Pointer – yığındaki yerel değişkenlere taban</td></tr>
<tr><td>RSP</td><td>ESP</td><td>SP</td><td>SPL</td><td>Stack Pointer – <b>yığının tepesi</b></td></tr>
<tr><td>R8–R15</td><td>R8D</td><td>R8W</td><td>R8B</td><td>Sadece 64 bitte var (yeni 8 yazmaç)</td></tr></table>
<div class="regbar"><div class="w64">RAX (64)<div class="w32">EAX (32)<div class="w16">AX (16)<div class="w8"><span>AH</span><span>AL</span></div></div></div></div></div>
<ul>
<li>Ön ekler: <b>E</b> = Extended (32), <b>R</b> = Register (64). R8–R15 için sonekler: <b>D</b> = Dword (32), <b>W</b> = Word (16), <b>B</b> = Byte (8). Örn. <b>R8D 32 bit</b>, <b>R8W 16 bit</b>, <b>R15B 8 bit</b>.</li>
<li><b>R7 diye bir yazmaç yoktur</b> (yeni yazmaçlar R8'den başlar) → "Hangisi genel amaçlı yazmaç değildir?" cevabı.</li>
<li>Assembly büyük/küçük harf duyarsız: <code>rax, RAX, Rax</code> aynı.</li>
<li>64 bit modda 32 bitlik bir yazmaca yazmak (<code>mov eax, …</code>) RAX'in üst 32 bitini <b>sıfırlar</b>; 8/16 bitlik yazma ise üst kısmı değiştirmez.</li>
</ul>
<table class="t small"><tr><th>Byte</th><th>Word</th><th>Dword (double word)</th><th>Qword (quad word)</th></tr><tr><td>8 bit</td><td>16 bit / 2 bayt</td><td>32 bit / 4 bayt</td><td>64 bit / 8 bayt</td></tr></table>

<h2>4.3 Özel amaçlı yazmaçlar</h2>
<ul>
<li><b>RIP</b> (Instruction Pointer): bir sonraki çalıştırılacak komutun adresi. "CPU şimdi ne yapacak?" sorusunun cevabı.</li>
<li><b>RSP</b>: yığının en üstteki adresi. PUSH ile <b>azalır</b>, POP ile artar.</li>
<li><b>RFLAGS</b> (16 bit: FLAGS, 32 bit: EFLAGS): son işlemin sonucuna dair bayrak bitleri → karar verme (if, koşullu atlama).</li>
<li>Segment yazmaçları: CS, DS, SS, ES, FS, GS. Kontrol: CR0–CR4.</li>
</ul>

<h2>4.4 Bayraklar (Flags)</h2>
<table class="t"><tr><th>Bayrak</th><th>Ne zaman 1?</th><th>Örnek</th></tr>
<tr><td><b>ZF</b> Zero</td><td>Sonuç <b>sıfır</b> ise</td><td><code>SUB EAX,EAX</code> → ZF=1 (eşitlik kontrolü: CMP)</td></tr>
<tr><td><b>SF</b> Sign</td><td>Sonuç negatif (MSB = 1)</td><td><code>MOV EAX,-5</code> sonra <code>TEST EAX,EAX</code> → SF=1</td></tr>
<tr><td><b>CF</b> Carry</td><td><b>İşaretsiz</b> taşma: MSB'den elde / çıkarmada ödünç</td><td>AL=255, <code>ADD AL,1</code> → AL=0, CF=1, ZF=1</td></tr>
<tr><td><b>OF</b> Overflow</td><td><b>İşaretli</b> taşma: işaret biti bozuldu</td><td>AL=127, <code>ADD AL,1</code> → AL=80h, OF=1, SF=1</td></tr>
<tr><td><b>PF</b> Parity</td><td>Sonucun <b>düşük baytındaki 1 sayısı çift</b> ise</td><td>Sonuç 00h → PF=1; 01h → PF=0</td></tr>
<tr><td>AF</td><td>Bit 3'ten bit 4'e elde (BCD)</td><td></td></tr>
<tr><td>DF, IF, TF</td><td>Yön, kesme izni, adım adım (trap)</td><td>8086'da toplam 9 bayrak</td></tr></table>
<div class="box warn"><b>Bayrakları etkilemeyen komutlar:</b> MOV, LEA, PUSH, POP, XCHG, JMP/Jcc, LOOP, CALL/RET, NOT. <b>INC/DEC</b> CF'yi etkilemez (diğer bayrakları etkiler). ADD, SUB, CMP, AND, OR, XOR, NEG ZF/SF/PF'yi günceller (AND/OR/XOR CF=OF=0 yapar).</div>
<div class="box exam"><b>Çıkmış:</b> "AX'e 5 değerini ata, ZF ne olur?" — beklenen cevap <b>ZF sıfır olur</b> (sonuç sıfır değil). Teknik not: MOV bayrakları hiç değiştirmez; hoca "sonuç sıfır değil" mantığını soruyor.<br>
"ZF'yi etkileyen işlem hangisi? (add, cmp, and, inc, or)" — aslında <b>hepsi</b> ZF'yi etkiler; soru hatalıydı. MOV/LEA/PUSH ZF'yi etkilemez.</div>
<p><b>İşaretsiz kullanım</b>: bellek adresleri, dizi indisleri, döngü sayaçları, RGB (0–255). <b>İşaretli</b>: finans, fizik simülasyonu, oyunlar, hata kodları.</p>

<h2>4.5 Boyut uyumu kuralları (MOV hedef, kaynak)</h2>
<table class="t"><tr><th>Komut</th><th></th><th>Neden</th></tr>
<tr><td><code>MOV EAX, EBX</code></td><td class="ok">✓</td><td>32 ← 32</td></tr>
<tr><td><code>MOV RAX, 10</code></td><td class="ok">✓</td><td>Sabit hedefin boyutuna uyar</td></tr>
<tr><td><code>MOV EAX, RBX</code> / <code>MOV AL, BX</code></td><td class="no">✗</td><td>operand size mismatch</td></tr>
<tr><td><code>MOV AL, 1FFh</code></td><td class="no">✗</td><td>1FFh 8 bite sığmaz</td></tr>
<tr><td><code>MOV [2000], 5</code></td><td class="no">✗</td><td>Boyut belirsiz → <code>MOV DWORD PTR [2000], 5</code></td></tr>
<tr><td><code>MOV [2000], [3000]</code></td><td class="no">✗</td><td>Bellekten belleğe doğrudan MOV yok; yazmaç üzerinden</td></tr>
<tr><td><code>MOV EAX, [RBX]</code></td><td class="ok">✓</td><td>RBX'teki adresten 4 bayt oku</td></tr></table>
`
},
/* ======================================================================= 5 */
{
  id: "adresleme",
  no: 5,
  hafta: "Hafta 4",
  baslik: "Adresleme Modları, Veri Tanımlama ve Yığın",
  ozet: "Register, immediate, direct, register indirect, register relative, base-indexed, scaled index; db/dw/dd/dq adres hesabı; LEA; PUSH/POP.",
  agirlik: 5,
  html: `
<p class="lead">Hoca: "Adresleme modları <b>hem vizede hem finalde</b> çıkar." Her yıl 3–5 soru: modu tanıma, dizi elemanının adresini hesaplama, LEA vs MOV.</p>
<p><b>Adresleme modu</b>: komutun işleyeceği verinin <b>nerede</b> olduğunu işlemciye söyleme yöntemi. Temel komut: <code>MOV hedef, kaynak</code> (kaynağı hedefe kopyalar, kaynak değişmez).</p>
<div class="mem"><div class="memh">Örnek bellek (int = 4 bayt)</div>
<div><span>2000</span><b>5</b><i>global_x</i></div><div><span>3000</span><b>1</b><i>s.a</i></div><div><span>3004</span><b>7</b><i>s.b</i></div>
<div><span>4000</span><b>10</b><i>arr[0]</i></div><div><span>4004</span><b>20</b><i>arr[1]</i></div><div><span>4008</span><b>30</b><i>arr[2]</i></div><div><span>4012</span><b>40</b><i>arr[3]</i></div></div>

<h2>5.1 Modlar</h2>
<table class="t">
<tr><th>#</th><th>Mod</th><th>Örnek</th><th>Veri nerede?</th><th>C karşılığı</th></tr>
<tr><td>1</td><td><b>Register</b> (yazmaç)</td><td><code>MOV RAX, RBX</code></td><td>Başka bir yazmaçta. Belleğe gidilmez → <b>en hızlı</b></td><td><code>y = x;</code></td></tr>
<tr><td>2</td><td><b>Immediate</b> (anlık/ivedi)</td><td><code>MOV EAX, 10</code></td><td>Komutun içinde sabit sayı</td><td><code>int x = 10;</code></td></tr>
<tr><td>3</td><td><b>Direct</b> (doğrudan)</td><td><code>MOV EAX, [2000h]</code></td><td>Adres komutta açıkça yazılı</td><td>global değişken</td></tr>
<tr><td>4</td><td><b>Register Indirect</b> (dolaylı)</td><td><code>MOV EAX, [RBX]</code></td><td>Adres bir yazmaçta (BX, SI, DI, BP…)</td><td><code>y = *p;</code></td></tr>
<tr><td>5</td><td><b>Register Relative</b> (taban + öteleme)</td><td><code>MOV EAX, [RBX+4]</code></td><td>Yazmaçtaki adres + sabit öteleme (displacement)</td><td><code>s.b</code>, struct alanı, yığın değişkeni <code>[RBP+8]</code></td></tr>
<tr><td>6</td><td><b>Base-Indexed</b> (taban + indeks)</td><td><code>MOV AX, [BX+SI]</code></td><td>Taban yazmacı + indeks yazmacı</td><td>2 boyutlu erişim</td></tr>
<tr><td>7</td><td><b>Relative Base-Indexed</b> (göreli taban indeksli)</td><td><code>MOV AX, [BP+SI+04h]</code></td><td>Taban + indeks + sabit</td><td>dizi içinde struct</td></tr>
<tr><td>8</td><td><b>Scaled Index</b> (ölçekli indeks)</td><td><code>MOV EAX, [RSI+RCX*4]</code></td><td>taban + indeks × ölçek + öteleme</td><td><code>x = arr[i];</code></td></tr></table>
<div class="formula">[ base + index × scale + displacement ] &nbsp; · &nbsp; scale ∈ {1, 2, 4, 8}</div>
<p>Ölçek = dizideki bir elemanın bayt boyutu: char 1, short 2, int 4, long/pointer/double 8. Scaled index <b>dizi elemanlarına, aralarındaki sabit artışlarla erişmek</b> için kullanılır; en güçlü ve esnek mod.</p>
<div class="steps"><p><b>C'den Assembly'ye:</b> <code>int arr[] = {10,20,30,40}; int i = 2; int x = arr[i];</code> — dizi adresi RSI'da, i RCX'te:</p>
<pre class="code">MOV EAX, [RSI + RCX*4]   ; 4000 + 2*4 = 4008 → EAX = 30</pre></div>
<div class="box exam"><b>Çıkmışlardan:</b><br>
• <code>MOV AX,[BP+SI+04H]</code> → <b>Göreli Taban İndeksli (Relative Base-Indexed)</b>.<br>
• Dolaylı adresleme örneği → <code>MOV AX,[BX]</code>. (<code>[1234H]</code> doğrudan, <code>1234H</code> anlık, <code>BX</code> yazmaç, <code>[SI+BX]</code> taban-indeksli.)<br>
• Register indirect'te "kaydedici içindeki değer, <b>verinin adresini</b> gösterir".<br>
• Register adreslemenin avantajı → <b>bellek kullanımını azaltır, program hızını artırır</b>.<br>
• Scaled index'te ölçek → <b>1, 2, 4 veya 8</b>.</div>

<h2>5.2 Veri tanımlama ve adres hesabı</h2>
<table class="t"><tr><th>Direktif</th><th>Anlamı</th><th>Eleman boyutu</th></tr>
<tr><td><code>db</code></td><td>define byte</td><td>1 bayt</td></tr>
<tr><td><code>dw</code></td><td>define word</td><td>2 bayt</td></tr>
<tr><td><code>dd</code></td><td>define double word</td><td>4 bayt</td></tr>
<tr><td><code>dq</code></td><td>define quad word</td><td>8 bayt</td></tr></table>
<p><code>?</code> = başlangıç değeri belirsiz (yer ayrılır). Değişkenler bellekte <b>tanımlandıkları sırayla art arda</b> yerleşir.</p>
<div class="steps"><p><b>Her yıl gelen soru kalıbı</b></p>
<pre class="code">notlar   dw 69H, 87H, 96H, 45H, 75H
enyuksek dw ?</pre>
<ul>
<li><b>notlar 1000H'de ise enyuksek nerede?</b> 5 eleman × 2 bayt = 10 = 0Ah → <b>100AH</b>. (2024)</li>
<li>Aynı soru <code>dd</code> ile: 5 × 4 = 20 = 14h → <b>1014H</b>. (2023)</li>
<li><b>3. elemanın adresi</b>: notlar + 2×boyut → dw: notlar+4, dd: notlar+8.</li>
<li><b>3. elemanın değeri</b> (96H) RAX'e: <code>LEA RBX, notlar</code> → <code>MOV AX, [RBX+4]</code> (dw). 64 bite genişletmek için <code>MOVZX RAX, WORD PTR [RBX+4]</code>. Sınavda "en doğru" şık <code>Lea rbx, notlar / Mov rax, word ptr [rbx+4]</code> idi.</li>
<li><code>Sayilar dw 34,45,56,67,75,89</code> → 6 × 2 = <b>12 bayt</b> yer.</li>
</ul></div>
<h3>LEA ve MOV farkı</h3>
<ul>
<li><code>MOV RAX, [RBX+8]</code> → o adresteki <b>veriyi</b> okur.</li>
<li><code>LEA RAX, [RBX+8]</code> → sadece <b>adresi hesaplar</b> (RBX+8), belleğe gitmez. <code>LEA RCX, mybyte</code> → RCX = mybyte'ın <b>adresi</b>. (<code>MOV RAX, OFFSET notlar</code> da adres verir.)</li>
<li>LEA hızlı çarpma için de kullanılır: <code>LEA EAX,[EAX+EAX*2]</code> = EAX×3, <code>LEA EAX,[EAX+EAX*4]</code> = ×5. Tek komutta yalnızca <b>bir</b> ölçekli indeks olabilir (<code>[eax*2+eax*3]</code> geçersiz). LEA, IMUL'dan hızlıdır ve bayrakları etkilemez.</li>
</ul>

<h2>5.3 Yığın (Stack): PUSH / POP</h2>
<ul>
<li>Yığın <b>aşağı doğru büyür</b>: <code>PUSH</code> önce SP/RSP'yi <b>azaltır</b>, sonra veriyi yazar. <code>POP</code> veriyi okur, sonra RSP'yi <b>artırır</b>. LIFO (son giren ilk çıkar).</li>
<li>16 bit: PUSH AX → SP −= 2. 64 bit: PUSH RAX → RSP −= <b>8</b>.</li>
<li>64 bit modda: <code>PUSH imm</code> (ör. <code>PUSH 0BEBAFECAh</code>) <b>8 bayt</b> yer kaplar (32 bit sabit 64'e işaret genişletilir); <code>PUSH AX</code> / <code>PUSH WORD PTR …</code> 2 bayt; <code>PUSH EAX</code> ve <code>PUSH AL</code> <b>geçersizdir</b> (sadece 16 ve 64 bit push).</li>
<li>Değer belleğe <b>little endian</b> yazılır.</li>
</ul>
<div class="steps"><p><b>Örnek (64 bit):</b> RSP = …FEE0h iken</p>
<pre class="code">MOV RAX, 123456789ABCDEF0H
PUSH RAX      ; RSP = ...FED8
MOV RBX, 0FEDCBA9876543210H
PUSH RBX      ; RSP = ...FED0
MOV RCX, 0F0F0F0F0F0F0F0FH
PUSH RCX      ; RSP = ...FEC8   (3 × 8 = 24 = 18h azaldı)</pre>
<p><b>Örnek (final tipi):</b> <code>MyByte dw 1234H,5678H</code>, RSP = 0938H.<br><code>PUSH 0BEBAH</code> → RSP = 0930H, [0930]: BA BE 00 00 00 00 00 00<br><code>PUSH WORD PTR [MyByte]</code> → RSP = <b>092EH</b>, [092E]: 34 12</p></div>
`
},
/* ======================================================================= 6 */
{
  id: "komutlar",
  no: 6,
  hafta: "Hafta 4–5 + çıkmışlar",
  baslik: "Sık Çıkan Komutlar ve Kesmeler",
  ozet: "MOV, ADD/SUB, INC/DEC, CMP, AND/OR/XOR, SHL/SHR/ROL/ROR, IMUL/IDIV, JMP/Jcc, LOOP, IN/OUT, INT 21h/10h/16h.",
  agirlik: 4,
  html: `
<p class="lead">Çıkmışlarda kısa kod parçası verip "AX/BX ne olur?", "Ekranda ne görünür?" diye soruluyor. Bu sayfadaki her komutun tek satırlık anlamını bilmek yeterli.</p>

<h2>6.1 Veri taşıma ve aritmetik</h2>
<table class="t">
<tr><th>Komut</th><th>İş</th><th>Not</th></tr>
<tr><td><code>MOV a, b</code></td><td>a ← b</td><td>Bayrakları etkilemez</td></tr>
<tr><td><code>ADD a, b</code> / <code>SUB a, b</code></td><td>a ← a ± b</td><td>CF, OF, ZF, SF, PF</td></tr>
<tr><td><code>INC a</code> / <code>DEC a</code></td><td>±1</td><td><b>CF'yi etkilemez</b> (bu yüzden ADD varken INC var)</td></tr>
<tr><td><code>CMP a, b</code></td><td>a − b yapar, sonucu yazmaz</td><td>Sadece bayraklar → sonrasında Jcc</td></tr>
<tr><td><code>NEG a</code></td><td>ikiye tümleyen (−a)</td><td></td></tr>
<tr><td><code>IMUL r</code></td><td>RDX:RAX ← RAX × r</td><td>İşaretli çarpma; sonuç büyükse üst kısım RDX</td></tr>
<tr><td><code>IMUL r1, r2</code> / <code>IMUL r1, r2, imm</code></td><td>r1 ← r1×r2 / r1 ← r2×imm</td><td></td></tr>
<tr><td><code>IDIV r</code></td><td>bölünen / r</td><td><b>Bölüm AX/EAX/RAX'te, kalan DX/EDX/RDX'te</b></td></tr></table>
<table class="t small"><tr><th>Bölen boyutu</th><th>Bölünen</th><th>Bölüm</th><th>Kalan</th></tr>
<tr><td>byte</td><td>AX</td><td>AL</td><td>AH</td></tr><tr><td>word (ör. <code>IDIV CX</code>)</td><td>DX:AX</td><td>AX</td><td><b>DX</b></td></tr>
<tr><td>dword</td><td>EDX:EAX</td><td>EAX</td><td>EDX</td></tr><tr><td>qword</td><td>RDX:RAX</td><td>RAX</td><td>RDX</td></tr></table>

<h2>6.2 Mantık, kaydırma, döndürme</h2>
<table class="t">
<tr><td><code>AND / OR / XOR / NOT</code></td><td>Bit bit işlemler. <code>XOR AX,0FFFFh</code> = tüm bitleri ters çevirir (1234h → <b>EDCBh</b>). <code>XOR AX,AX</code> = sıfırla.</td></tr>
<tr><td><code>SHL a, n</code></td><td>Sola kaydır, sağdan 0 gelir → <b>×2<sup>n</sup></b></td></tr>
<tr><td><code>SHR a, n</code></td><td>Sağa kaydır, soldan 0 gelir → <b>÷2<sup>n</sup></b> (işaretsiz). 00FFh SHR 2 = 003Fh (4'e bölündü)</td></tr>
<tr><td><code>ROL a, n</code></td><td>Sola döndür: soldan çıkan bitler sağdan girer. 0F0Fh ROL 4 = <b>F0F0h</b></td></tr>
<tr><td><code>ROR a, n</code></td><td>Sağa döndür. 10100110b ROR 3 = <b>11010100b</b></td></tr></table>
<div class="box tip"><b>Yazmacı sıfırlama yolları:</b> <code>MOV AX,0</code> · <code>SUB AX,AX</code> · <code>XOR AX,AX</code> · <code>AND AX,0</code> · yeterince <code>SHL</code>. <b>ADD ile sıfırlama yapılamaz.</b></div>

<h2>6.3 Akış kontrolü</h2>
<ul>
<li><code>JMP etiket</code> → koşulsuz olarak <b>bir bellek adresine atlama</b>.</li>
<li>Koşullu: <code>JE/JZ</code> (ZF=1), <code>JNE/JNZ</code>, <code>JG/JL/JGE/JLE</code> (işaretli), <code>JA/JB</code> (işaretsiz), <code>JC</code> (CF=1).</li>
<li><code>LOOP etiket</code> = <code>DEC CX/RCX</code> + <code>JNZ etiket</code>: CX sıfır olana kadar etikete döner.</li>
<li><code>CALL</code>: dönüş adresini yığına atar ve alt programa gider; <code>RET</code>: yığından adresi alıp döner.</li>
</ul>

<h2>6.4 Giriş/Çıkış ve DOS/BIOS kesmeleri (8086)</h2>
<ul>
<li><code>IN AL, 80h</code> → 80h portundan oku. <code>OUT 80h, AL</code> → AL'yi <b>80h portuna yaz</b>. Port 255'ten büyükse DX'te: <code>OUT DX, AL</code>.</li>
</ul>
<table class="t">
<tr><th>Kesme</th><th>AH</th><th>İş</th></tr>
<tr><td>INT 21h</td><td>01h</td><td>Klavyeden karakter oku (ekrana yansıtır), AL'ye</td></tr>
<tr><td>INT 21h</td><td>02h</td><td><b>DL</b>'deki karakteri ekrana yaz</td></tr>
<tr><td>INT 21h</td><td>07h/08h</td><td>Karakter oku, ekrana yansıtmaz</td></tr>
<tr><td>INT 21h</td><td>09h</td><td>DS:DX'teki <b>$ ile biten dizeyi (string) ekrana yazar</b></td></tr>
<tr><td>INT 21h</td><td>4Ch</td><td>Programı sonlandır</td></tr>
<tr><td>INT 10h</td><td>0Eh</td><td>AL'deki karakteri ekrana yaz (teletype)</td></tr>
<tr><td>INT 16h</td><td>00h</td><td><b>Bir tuş basılmasını bekler</b>, ASCII kodunu AL'ye (tarama kodunu AH'ye) döndürür</td></tr></table>
<div class="steps"><p><b>2025 sorusu:</b></p>
<pre class="code">        mov cx, 3
print_loop:
        mov ah, 0Eh
        mov al, '*'
        int 10h        ; *
        mov al, 0Dh
        int 10h        ; CR: satır başı
        mov al, 0Ah
        int 10h        ; LF: alt satır
        loop print_loop</pre>
<p>Döngü 3 kez → her satıra bir yıldız, alt alta 3 satır. (Sadece LF olsaydı yıldızlar <b>merdiven</b> gibi kayarak inerdi.)</p></div>
`
},
/* ======================================================================= 7 */
{
  id: "toolchain",
  no: 7,
  hafta: "Hafta 5",
  baslik: "Assembly Programlama Ortamı (Toolchain)",
  ozet: "Assembler, linker, loader, debugger; derleyici–yorumlayıcı; MASM/TASM/NASM/FASM/GAS; .asm→.obj→.exe; Intel vs AT&T; C++ + Assembly.",
  agirlik: 4,
  html: `
<p class="lead">Notlarda "<b>Bir soru gelir</b>" ve "Visual Studio'da C++ ve Assembly → <b>soru gelir</b>" yazıyor. Çıkmışlarda her yıl assembler adı, oluşan dosya ve araçların görevi soruluyor.</p>

<h2>7.1 Fikirden koda, koddan makineye</h2>
<p>Analoji – yemek tarifi: <b>Assembly kodu (.asm)</b> şefin yazdığı okunabilir tarif; <b>işlemci</b> sadece bitmiş yemeği yiyebilen müşteri; <b>toolchain</b> tarifi pişirip sunan mutfak ekibi.</p>
<div class="box def"><b>Toolchain (araç zinciri):</b> Kaynak kodu (.asm, .cpp) işletim sisteminin çalıştırabileceği dosyaya (.exe) dönüştüren programlar dizisi (assembler, compiler, linker, loader, debugger). Bir programlama <u>ortamı</u> (IDE) değildir.</div>
<div class="diag flow"><span class="blk">kaynak.asm</span><span class="arr">Assembler →</span><span class="blk">kaynak.obj<br><small>tek başına çalışmaz</small></span><span class="arr">Linker (+ .lib) →</span><span class="blk red">program.exe</span><span class="arr">Loader →</span><span class="blk green">RAM'de çalışır</span></div>
<ol>
<li><b>Assembler (çevirici)</b>: Assembly kodunu (.asm) <b>makine diline</b> (0/1) çevirir. Çıktı: <b>object file (.obj)</b>; henüz tek başına çalıştırılamaz. Ayrıca liste dosyası (.lst) üretebilir.</li>
<li><b>Linker (bağlayıcı)</b>: Bir veya daha fazla .obj ile kütüphaneleri (.lib) birleştirip "bağlantıları" kurar → <b>.exe</b>. Örn. kodunuz printf çağırıyorsa linker printf'in makine kodunu bulup birleştirir. (.map dosyası da linker'ın çıktısıdır.)</li>
<li><b>Loader (yükleyici)</b>: .exe'yi diskten <b>RAM'e yükler</b> ve çalıştırır (işletim sisteminin parçası).</li>
<li><b>Debugger (hata ayıklayıcı)</b>: Programı <b>satır satır</b> çalıştırıp durdurur; o anki <b>yazmaç ve bellek</b> değerlerini gösterir. Hatayı anlamanın en güçlü aracı.</li>
</ol>
<div class="box exam"><b>Çıkmış:</b> "MASM/TASM ornek.asm (enter) yaparsanız hangi dosya oluşur?" → <b>ornek.obj</b> (sonra LINK ornek.obj → ornek.exe).<br>
"Assembler, compiler ve debugger" → <b>farklı işlevlere sahiptir ve program geliştirmenin farklı aşamalarında kullanılır.</b><br>
"___ CPU'nun yürütebilmesi için assembly programlarını makine diline çevirir" → <b>Assembler</b>.</div>

<h2>7.2 Derleyici (Compiler) – Yorumlayıcı (Interpreter)</h2>
<table class="t"><tr><th></th><th>Derleyici</th><th>Yorumlayıcı</th></tr>
<tr><td>Çalışma</td><td>Kaynağın <b>tamamını tek seferde</b> makine koduna çevirir; .exe kendi başına çalışır</td><td>Kaynağı <b>satır satır</b> okur, her çalıştırmada anında çevirip çalıştırır</td></tr>
<tr><td>Hız</td><td>Hızlı</td><td>Daha yavaş</td></tr>
<tr><td>Örnek</td><td>C, C++, Go, Rust, (Assembly → assembler)</td><td>Python, JavaScript, PHP, Ruby</td></tr></table>
<p><b>Java (ödev)</b>: hibrittir. <code>javac</code> kaynağı <b>bytecode</b>'a derler; bytecode <b>JVM</b> tarafından yorumlanır/JIT ile derlenir → "bir kez yaz, her yerde çalıştır".</p>

<h2>7.3 Assembler programları</h2>
<table class="t">
<tr><td><b>MASM</b></td><td>Microsoft Macro Assembler (64 bit: <code>ml64.exe</code>); linker'ı <b>LINK</b>. Bu derste kullanılan.</td></tr>
<tr><td><b>TASM</b></td><td>Turbo Assembler (Borland; Pascal/Delphi'nin firması)</td></tr>
<tr><td><b>NASM</b></td><td>Netwide Assembler – açık kaynak, çok platformlu</td></tr>
<tr><td><b>FASM</b></td><td>Flat Assembler – çok küçük, hızlı, kendi kendini derler</td></tr>
<tr><td><b>GAS</b></td><td>GNU Assembler (as) – Linux/GCC, <b>AT&amp;T</b> sözdizimi</td></tr>
<tr><td>YASM, JWASM, WASM (Watcom)</td><td>Diğerleri</td></tr>
<tr><td class="no"><b>CASM</b></td><td><b>Böyle bir assembler yok</b> — "hangisi assembler değildir?" sorusunun cevabı (her yıl soruluyor!)</td></tr></table>

<h2>7.4 Intel vs AT&amp;T sözdizimi (araştırma)</h2>
<table class="t"><tr><th></th><th>Intel (bu derste)</th><th>AT&amp;T (GCC/Linux)</th></tr>
<tr><td>Operand sırası</td><td><code>mov rax, rbx</code> → <b>hedef, kaynak</b></td><td><code>movq %rbx, %rax</code> → <b>kaynak, hedef</b></td></tr>
<tr><td>Yazmaç</td><td>rax</td><td><b>%</b>rax</td></tr>
<tr><td>Sabit</td><td>5</td><td><b>$</b>5</td></tr>
<tr><td>Boyut</td><td>QWORD PTR</td><td>komut soneki: b, w, l, q</td></tr>
<tr><td>Bellek</td><td>[rbx+rcx*4+8]</td><td>8(%rbx,%rcx,4)</td></tr></table>

<h2>7.5 Assembly'nin yeri</h2>
<ul>
<li>Assembly komutları genellikle <b>bellek ve yazmaç manipülasyonunu</b> temsil eder.</li>
<li>Avantaj: hızlı, küçük programlar, donanıma en yakın kontrol; C/C++ ile yapılamayan bazı şeyler yapılabilir. Dezavantaj: programlaması zor, <b>işlemciye özeldir</b> — farklı işlemciler <b>aynı assembly dilini kullanmaz</b> (x86, ARM, MIPS ayrı).</li>
<li>Kullanım alanı: <b>donanım sürücüleri</b>, işletim sistemi çekirdeği, gömülü sistemler, performans kritik küçük fonksiyonlar.</li>
<li>"MIPS, x86, ARM" terimleri → <b>assembly dilleri ve mimariler</b> bağlamında.</li>
</ul>

<h2>7.6 Visual Studio'da C++ + Assembly (sınıf uygulaması)</h2>
<p>Modern ortamda Assembly tek başına değil, C/C++ ile birlikte kullanılır: C++ karmaşık mantığı yönetir, Assembly performansın en kritik olduğu küçük fonksiyonlarda "cerrahi müdahale" yapar.</p>
<div class="grid2"><div><b>main.cpp</b>
<pre class="code">#include &lt;iostream&gt;
// Assembly fonksiyonunu C++'a tanıt.
// extern "C": isim karıştırmayı (name mangling) kapatır
extern "C" int ToplamaFonksiyonu(int a, int b);

int main() {
    int sonuc = ToplamaFonksiyonu(10, 20);
    std::cout &lt;&lt; "Sonuc: " &lt;&lt; sonuc; // 30
    return 0;
}</pre></div>
<div><b>islemler.asm</b> (MASM x64)
<pre class="code">.code
PUBLIC ToplamaFonksiyonu
ToplamaFonksiyonu PROC
    ; 1. parametre (a) -> RCX (ECX)
    ; 2. parametre (b) -> RDX (EDX)
    mov eax, ecx      ; dönüş değeri EAX/RAX
    add eax, edx
    ret               ; C++'a geri dön
ToplamaFonksiyonu ENDP
END</pre></div></div>
<p><b>Komut satırından derleme:</b></p>
<pre class="code">ml64.exe /c islemler.asm        → islemler.obj
cl.exe   /c main.cpp            → main.obj
link main.obj islemler.obj /SUBSYSTEM:CONSOLE  → main.exe</pre>
<p><b>Kod çalışmaz, derlenir ve bağlanır</b> → <b>Debugger en iyi dostunuzdur</b> → <b>Modern assembly bir takım oyunudur.</b></p>
`
},
/* ======================================================================= 8 */
{
  id: "calling",
  no: 8,
  hafta: "Hafta 6",
  baslik: "Çağırma Kuralı (Calling Convention)",
  ozet: "Microsoft x64 ABI: RCX, RDX, R8, R9; dönüş RAX; shadow space; caller/callee-saved yazmaçlar; CALL/RET.",
  agirlik: 3,
  html: `
<p class="lead">Son işlenen konu. C++ ve Assembly'nin birbiriyle "konuşabilmesi" için uyulması gereken kurallar: parametreler nereye konur, sonuç nereden okunur, hangi yazmaçlar korunmalı?</p>

<h2>8.1 Microsoft x64 (Windows) çağırma kuralı</h2>
<table class="t"><tr><th>Parametre</th><th>64 bit (Qword)</th><th>32 bit (Dword)</th><th>16 bit</th><th>8 bit</th></tr>
<tr><td>1.</td><td><b>RCX</b></td><td>ECX</td><td>CX</td><td>CL</td></tr>
<tr><td>2.</td><td><b>RDX</b></td><td>EDX</td><td>DX</td><td>DL</td></tr>
<tr><td>3.</td><td><b>R8</b></td><td>R8D</td><td>R8W</td><td>R8B</td></tr>
<tr><td>4.</td><td><b>R9</b></td><td>R9D</td><td>R9W</td><td>R9B</td></tr>
<tr><td>5. ve sonrası</td><td colspan="4"><b>Yığın (stack)</b></td></tr></table>
<ul>
<li><b>Dönüş değeri</b>: tam sayı/işaretçi <b>RAX</b> (int için EAX); ondalık (float/double) XMM0. Ondalık parametreler XMM0–XMM3.</li>
<li><b>Shadow space (gölge alan)</b>: Çağıran, CALL'dan önce yığında 4 parametre için <b>32 bayt</b> yer ayırır.</li>
<li>CALL anında yığın <b>16 bayta hizalı</b> olmalıdır. <code>CALL</code> dönüş adresini (8 bayt) yığına iter; <code>RET</code> onu alıp geri döner.</li>
</ul>

<h2>8.2 Yazmaç sorumluluğu</h2>
<table class="t"><tr><th>Grup</th><th>Yazmaçlar</th><th>Kural</th></tr>
<tr><td><b>Volatile</b> (caller-saved, uçucu)</td><td>RAX, RCX, RDX, R8, R9, R10, R11</td><td>Fonksiyon bunları serbestçe bozabilir; çağıran değerini korumak istiyorsa kendisi saklar.</td></tr>
<tr><td><b>Non-volatile</b> (callee-saved, kalıcı)</td><td><b>RBX, RBP, RDI, RSI, RSP, R12–R15</b></td><td>Fonksiyon bunları kullanacaksa önce yığına <b>PUSH</b>'layıp çıkarken <b>POP</b> ile geri yüklemelidir; doğrudan değiştirilmemelidir.</td></tr></table>
<div class="box tip"><b>Linux (System V) farkı:</b> ilk 6 parametre RDI, RSI, RDX, RCX, R8, R9; dönüş yine RAX. Sınav Windows/MASM üzerinden.</div>

<h2>8.3 Örnekler</h2>
<div class="grid2"><div><b>İki sayının küçüğü</b>
<pre class="code">enkucuk PROC          ; int enkucuk(int a, int b)
    mov  eax, ecx     ; eax = a
    cmp  edx, eax
    jg   Bitti        ; b > a ise a kalsın
    mov  eax, edx     ; değilse eax = b
Bitti:
    ret               ; sonuç EAX'te
enkucuk ENDP</pre></div>
<div><b>Üç sayının küçüğü (ödev)</b>
<pre class="code">enkucuk3 PROC         ; (ecx, edx, r8d)
    mov  eax, ecx
    cmp  edx, eax
    jg   Atla1
    mov  eax, edx
Atla1:
    cmp  r8d, eax
    jg   Atla2
    mov  eax, r8d
Atla2:
    ret
enkucuk3 ENDP</pre></div></div>
<p>RBX'i kullanmak isteyen bir fonksiyon:</p>
<pre class="code">Fonk PROC
    push rbx          ; callee-saved → koru
    mov  rbx, rcx
    ...               ; işlemler
    mov  rax, rbx     ; sonuç
    pop  rbx          ; geri yükle
    ret
Fonk ENDP</pre>
`
}
];
