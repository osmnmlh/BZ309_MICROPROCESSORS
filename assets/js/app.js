/* BZ309 Mikroişlemciler — Vize Hazırlık
   Sunucu ya da derleme gerektirmez: index.html'i tarayıcıda açmak yeterli (file:// dahil). */
(function () {
  "use strict";
  var KONULAR = window.KONULAR || [], SORULAR = window.SORULAR || [], CIKMISLAR = window.CIKMISLAR || [];
  var app = document.getElementById("app");
  var LET = "ABCDE";

  /* ---------------------------------------------------------------- yardımcılar */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function h(html) { app.innerHTML = html; window.scrollTo(0, 0); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("bz309:" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("bz309:" + k, JSON.stringify(v)); } catch (e) { } }
  };

  /* ---------------------------------------------------------------- soru havuzu */
  var TOPIC = {}; KONULAR.forEach(function (k) { TOPIC[k.id] = k; });
  var POOL = [], BYID = {};
  SORULAR.forEach(function (s, i) { POOL.push(Object.assign({ id: "s" + i, src: null, mix: true }, s)); });
  CIKMISLAR.forEach(function (ex) {
    ex.sorular.forEach(function (s, i) {
      POOL.push(Object.assign({ id: ex.id + "-" + (i + 1), src: ex.baslik + " · S" + (i + 1), exam: ex.id, n: i + 1, mix: false }, s));
    });
  });
  POOL.forEach(function (q) { BYID[q.id] = q; });
  function topicQs(t) { return POOL.filter(function (q) { return q.t === t; }); }

  /* ---------------------------------------------------------------- ilerleme */
  var prog = store.get("prog", {});            // qid -> {c,w,last}
  function record(id, ok) {
    var p = prog[id] || { c: 0, w: 0 };
    if (ok) p.c++; else p.w++;
    p.last = ok; prog[id] = p; store.set("prog", prog);
  }
  function wrongIds() { return Object.keys(prog).filter(function (id) { return prog[id].last === false && BYID[id]; }); }
  function topicStat(t) {
    var qs = topicQs(t), done = 0, right = 0;
    qs.forEach(function (q) { var p = prog[q.id]; if (p) { done++; if (p.last) right++; } });
    return { total: qs.length, done: done, right: right };
  }
  function isRight(q, ans) { return ans != null && (q.any || ans === q.a); }

  /* ---------------------------------------------------------------- tema & menü */
  function applyTheme(t) { if (t) document.documentElement.setAttribute("data-theme", t); else document.documentElement.removeAttribute("data-theme"); }
  applyTheme(store.get("theme", null));
  document.getElementById("themeBtn").addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme");
    var dark = cur ? cur === "dark" : window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var nt = dark ? "light" : "dark"; applyTheme(nt); store.set("theme", nt);
  });
  var side = document.getElementById("side");
  document.getElementById("menuBtn").addEventListener("click", function () { side.classList.toggle("open"); });
  document.addEventListener("click", function (e) { if (side.classList.contains("open") && !side.contains(e.target) && e.target.id !== "menuBtn") side.classList.remove("open"); });

  function buildNav() {
    var n = '<div class="sec">Başla</div>' +
      '<a href="#/">🏠 Ana sayfa</a>' +
      '<a href="#/ozet">📋 Tek sayfa özet</a>' +
      '<div class="sec">Konu anlatımı</div>' +
      KONULAR.map(function (k) { return '<a href="#/konu/' + k.id + '"><span class="num">' + k.no + '</span>' + esc(k.baslik) + '</a>'; }).join("") +
      '<div class="sec">Sınava hazırlık</div>' +
      '<a href="#/deneme">⏱️ Deneme sınavı (25 soru)</a>' +
      '<a href="#/cikmis">📝 Çıkmış sorular</a>' +
      '<a href="#/sorular">📚 Soru bankası</a>' +
      '<a href="#/yanlis">🔁 Yanlışlarım</a>' +
      '<div class="sec">Araçlar</div>' +
      '<a href="#/araclar">🧮 Hesaplama araçları</a>' +
      '<a href="#/kaynaklar">📂 PDF\'ler</a>';
    document.getElementById("nav").innerHTML = n;
  }
  function markNav() {
    var hsh = location.hash || "#/";
    document.querySelectorAll("#nav a").forEach(function (a) {
      var href = a.getAttribute("href");
      a.classList.toggle("active", href === hsh || (href !== "#/" && hsh.indexOf(href + "/") === 0));
    });
  }

  /* ---------------------------------------------------------------- ana sayfa */
  function viewHome() {
    var totalDone = Object.keys(prog).length, right = Object.keys(prog).filter(function (k) { return prog[k].last; }).length;
    var cards = KONULAR.map(function (k) {
      var s = topicStat(k.id), pct = s.total ? Math.round(100 * s.right / s.total) : 0;
      return '<a class="card tcard" href="#/konu/' + k.id + '"><div class="tno">KONU ' + k.no + ' · ' + esc(k.hafta) + ' <span class="stars" title="Sınavdaki ağırlığı">' + "★★★★★".slice(0, k.agirlik) + '</span></div>' +
        '<h3>' + esc(k.baslik) + '</h3><p>' + esc(k.ozet) + '</p>' +
        '<div class="bar"><i style="width:' + pct + '%"></i></div><div class="small muted" style="margin-top:4px">' + s.right + '/' + s.total + ' soru doğru</div></a>';
    }).join("");
    h('<div class="hero"><h1>Mikroişlemciler Vize Hazırlık</h1>' +
      '<p>Doç. Dr. Bilal Babayiğit · BZ309 · Erciyes Üniversitesi Bilgisayar Mühendisliği</p>' +
      '<p><b>Sınav formatı:</b> 20–25 çoktan seçmeli test sorusu, her soru 4 puan, 35–40 dakika. Her konudan soru var; son işlenen konu Calling Convention.</p>' +
      '<div class="row" style="margin-top:12px"><a class="btn primary" href="#/deneme">⏱️ Deneme sınavına başla</a><a class="btn" href="#/cikmis/2025-vize">Geçen yılın vizesi</a><a class="btn" href="#/ozet">Tek sayfa özet</a></div></div>' +
      '<div class="stats">' +
      '<div class="stat"><b>' + POOL.length + '</b><span>toplam soru (' + (POOL.length - SORULAR.length) + ' çıkmış)</span></div>' +
      '<div class="stat"><b>' + totalDone + '</b><span>çözdüğün farklı soru</span></div>' +
      '<div class="stat"><b>' + (totalDone ? Math.round(100 * right / totalDone) : 0) + '%</b><span>son denemedeki doğruluk</span></div>' +
      '<div class="stat"><b>' + wrongIds().length + '</b><span><a href="#/yanlis">tekrar edilecek yanlış</a></span></div></div>' +
      '<div class="box exam"><b>Hocanın son derste verdiği sınav konuları (geçen yıl):</b> İşlemci tarihi (Intel, önbellekler, bit dönem geçişleri, Power Wall, çekirdek kavramı, AMD ve diğer firmalar) · L1/L2/L3 · Binary–Decimal–IEEE 754 çevrimleri · ASCII · Bellek yönetimi (neden gerekli, nasıl hesaplanır) · Korumalı mod 32 bit · Segmentasyon ve sayfalama · Yazmaç mimarileri · Register · Adresleme modları · Debugger, Assembler, C++–Assembly bağlama.</div>' +
      '<h2>Konular</h2><div class="grid">' + cards + '</div>' +
      '<h2>Nasıl çalışmalı?</h2><div class="grid2">' +
      '<div class="card"><h3 style="margin-top:0">1 günün varsa</h3><ol class="small"><li><a href="#/ozet">Tek sayfa özeti</a> baştan sona oku (30 dk).</li><li><a href="#/cikmis">Çıkmışları</a> çalışma modunda çöz: 2025 → 2024 → 2023 (her soruda açıklamayı oku).</li><li>IEEE 754 ve segment:offset hesaplarını <a href="#/araclar">araçlarla</a> 3–4 örnekle pekiştir.</li><li>Bir <a href="#/deneme">deneme sınavı</a> çöz, <a href="#/yanlis">yanlışlarını</a> tekrar et.</li></ol></div>' +
      '<div class="card"><h3 style="margin-top:0">Sınav taktikleri</h3><ul class="small"><li>Her yıl tekrar edenler: <b>CASM</b> assembler değil, <b>MASM x.asm → x.obj</b>, <b>R8D 32 bit</b>, <b>R7 yok</b>, dizi adresi (<b>dw</b>=2, <b>dd</b>=4 bayt), <b>IEEE 754</b>, <b>CF/OF</b>, <b>Segment×16+Offset</b>.</li><li>"Hangisi <u>yanlıştır / değildir</u>" kalıbına dikkat.</li><li>CF = işaretsiz taşma, OF = işaretli taşma. 7FFF+1 → CF=0, OF=1.</li><li>Hex sayıyı onluk sanma: 5×2=10 bayt = <b>0Ah</b>, 20 bayt = <b>14h</b>.</li></ul></div></div>'
    );
  }

  /* ---------------------------------------------------------------- konu */
  function viewTopic(id) {
    var k = TOPIC[id]; if (!k) return viewHome();
    var i = KONULAR.indexOf(k), prev = KONULAR[i - 1], next = KONULAR[i + 1], s = topicStat(id);
    h('<div class="muted small">KONU ' + k.no + ' · ' + esc(k.hafta) + '</div><h1>' + esc(k.baslik) + '</h1>' + k.html +
      '<div class="card noprint" style="margin-top:26px"><b>Bu konuyu pekiştir:</b> ' + s.total + ' soru (' + s.right + ' doğru)<div class="row" style="margin-top:10px">' +
      '<button class="btn primary" data-act="topicquiz" data-t="' + id + '">Bu konudan 10 soru çöz</button>' +
      '<button class="btn" data-act="topicall" data-t="' + id + '">Tüm ' + s.total + ' soruyu çöz</button>' +
      '<a class="btn" href="#/sorular/' + id + '">Soruları cevaplarıyla listele</a></div></div>' +
      '<div class="topicnav">' + (prev ? '<a class="btn" href="#/konu/' + prev.id + '">← ' + esc(prev.baslik) + '</a>' : '<span></span>') +
      (next ? '<a class="btn" href="#/konu/' + next.id + '">' + esc(next.baslik) + ' →</a>' : '<a class="btn primary" href="#/deneme">Deneme sınavı →</a>') + '</div>');
  }

  /* ---------------------------------------------------------------- quiz motoru */
  var S = null, timerId = null;
  function startQuiz(o) {
    var qs = o.ids.map(function (id) {
      var q = BYID[id], order = q.o.map(function (_, i) { return i; });
      if (o.mix !== false && q.mix) order = shuffle(order);
      return { id: id, order: order };
    });
    S = { title: o.title, mode: o.mode || "practice", qs: qs, ans: qs.map(function () { return null; }), idx: 0, start: Date.now(), limit: o.limit || 0, done: false, back: o.back || "#/", scored: o.scored };
    if (location.hash === "#/quiz") viewQuiz(); else location.hash = "#/quiz";
  }
  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
  function fmt(sec) { sec = Math.max(0, Math.round(sec)); return Math.floor(sec / 60) + ":" + ("0" + sec % 60).slice(-2); }
  function qHTML(q, entry, sel, reveal) {
    var opts = entry.order.map(function (oi, pos) {
      var cls = "opt";
      if (reveal) { if (oi === q.a || q.any) cls += " right"; else if (sel === oi) cls += " wrong"; }
      else if (sel === oi) cls += " sel";
      return '<button class="' + cls + '" data-act="pick" data-o="' + oi + '"' + (reveal ? " disabled" : "") + '><span class="l">' + LET[pos] + '</span><span>' + esc(q.o[oi]) + '</span></button>';
    }).join("");
    var tags = '<span class="tag gray">' + esc(TOPIC[q.t] ? TOPIC[q.t].baslik : q.t) + '</span> ' + (q.src ? '<span class="tag">Çıkmış · ' + esc(q.src) + '</span>' : '');
    var ex = "";
    if (reveal) {
      var ok = isRight(q, sel), corrPos = entry.order.indexOf(q.a);
      ex = '<div class="expl">' + (sel == null ? '<b class="no">Boş bırakıldı.</b> ' : ok ? '<b class="ok">✓ Doğru!</b> ' : '<b class="no">✗ Yanlış.</b> ') +
        'Doğru cevap: <b>' + LET[corrPos] + ') ' + esc(q.o[q.a]) + '</b>' + (q.e ? '<div style="margin-top:6px">' + esc(q.e) + '</div>' : '') +
        (q.z ? '<div class="disp">⚠️ ' + esc(q.z) + '</div>' : '') + '</div>';
    }
    return '<div class="qcard"><div class="small" style="margin-bottom:6px">' + tags + '</div><div class="qtext">' + esc(q.q) + '</div>' +
      (q.c ? '<pre class="code">' + esc(q.c) + '</pre>' : '') + '<div class="opts">' + opts + '</div>' + ex + '</div>';
  }
  function viewQuiz() {
    if (!S) { location.hash = "#/deneme"; return; }
    if (S.done) return viewResult();
    var e = S.qs[S.idx], q = BYID[e.id], sel = S.ans[S.idx], practice = S.mode === "practice";
    var reveal = practice && sel !== null;
    var answered = S.ans.filter(function (a) { return a !== null; }).length;
    var dots = S.qs.map(function (qq, i) {
      var c = i === S.idx ? "cur" : "", a = S.ans[i];
      if (a !== null) c += practice ? (isRight(BYID[qq.id], a) ? " r" : " w") : " ans";
      return '<button class="' + c + '" data-act="go" data-i="' + i + '">' + (i + 1) + '</button>';
    }).join("");
    h('<div class="qwrap"><div class="qhead"><div><div class="muted small">' + (practice ? "Çalışma modu · anında geri bildirim" : "Sınav modu · cevaplar sonda") + '</div><h1 style="margin:0">' + esc(S.title) + '</h1></div>' +
      '<div class="row">' + (S.limit ? '<span class="timer" id="timer">--:--</span>' : '') + '<button class="btn small" data-act="finish">' + (practice ? "Bitir" : "Sınavı bitir") + '</button></div></div>' +
      '<div class="muted small">Soru ' + (S.idx + 1) + ' / ' + S.qs.length + ' · ' + answered + ' cevaplandı</div>' +
      '<div class="qprog"><i style="width:' + (100 * answered / S.qs.length) + '%"></i></div>' +
      qHTML(q, e, sel, reveal) +
      '<div class="qnav"><button class="btn" data-act="prev"' + (S.idx === 0 ? " disabled" : "") + '>← Önceki</button>' +
      (S.idx < S.qs.length - 1 ? '<button class="btn primary" data-act="next">Sonraki →</button>' : '<button class="btn primary" data-act="finish">Bitir ve sonucu gör</button>') + '</div>' +
      '<div class="dots">' + dots + '</div><div class="muted small">Klavye: <kbd>A</kbd>–<kbd>E</kbd> veya <kbd>1</kbd>–<kbd>5</kbd> şık seçer, <kbd>←</kbd> <kbd>→</kbd> gezinir.</div></div>');
    tick();
    if (S.limit && !timerId) timerId = setInterval(tick, 1000);
  }
  function tick() {
    if (!S || !S.limit) return;
    var left = S.limit - (Date.now() - S.start) / 1000, el = document.getElementById("timer");
    if (el) { el.textContent = "⏱ " + fmt(left); el.classList.toggle("low", left < 300); }
    if (left <= 0 && !S.done) finishQuiz(true);
  }
  function finishQuiz(timeout) {
    if (!S || S.done) return;
    stopTimer();
    if (!timeout && S.mode === "exam") {
      var empty = S.ans.filter(function (a) { return a === null; }).length;
      if (empty && !window.confirm(empty + " soru boş. Yine de bitirilsin mi?")) return;
    }
    S.done = true; S.timeout = !!timeout; S.end = Date.now();
    if (S.mode === "exam") S.qs.forEach(function (e, i) { if (S.ans[i] !== null) record(e.id, isRight(BYID[e.id], S.ans[i])); });
    if (location.hash === "#/quiz") viewResult(); else location.hash = "#/quiz";
  }
  function viewResult() {
    var n = S.qs.length, right = 0, wrong = 0, empty = 0;
    S.qs.forEach(function (e, i) { var a = S.ans[i]; if (a === null) empty++; else if (isRight(BYID[e.id], a)) right++; else wrong++; });
    var score = Math.round(100 * right / n);
    var list = S.qs.map(function (e, i) {
      var q = BYID[e.id], a = S.ans[i], cls = a === null ? "e" : isRight(q, a) ? "r" : "w";
      return '<div class="revq ' + cls + '"><div class="small muted">Soru ' + (i + 1) + (q.src ? ' · ' + esc(q.src) : '') + '</div><div><b>' + esc(q.q) + '</b></div>' +
        (q.c ? '<pre class="code">' + esc(q.c) + '</pre>' : '') +
        '<div class="ans">' + (a === null ? '<span class="tag gray">Boş</span> ' : cls === "r" ? '<span class="tag ok">Doğru</span> ' : '<span class="tag no">Yanlış</span> Senin cevabın: ' + esc(q.o[a]) + '<br>') +
        'Doğru cevap: <b>' + esc(q.o[q.a]) + '</b>' + (q.e ? '<div class="muted" style="margin-top:4px">' + esc(q.e) + '</div>' : '') + (q.z ? '<div class="disp">⚠️ ' + esc(q.z) + '</div>' : '') + '</div></div>';
    }).join("");
    var mins = Math.round(((S.end || Date.now()) - S.start) / 60000);
    h('<div class="qwrap"><h1>' + esc(S.title) + ' — Sonuç</h1>' +
      '<div class="card center"><div class="score" style="color:' + (score >= 50 ? "var(--ok)" : "var(--no)") + '">' + (n === 25 ? right * 4 : score) + (n === 25 ? " / 100" : "%") + '</div>' +
      '<div>' + right + ' doğru · ' + wrong + ' yanlış · ' + empty + ' boş · ' + mins + ' dk' + (S.timeout ? ' · <b>süre doldu</b>' : '') + '</div>' +
      '<div class="row" style="justify-content:center;margin-top:12px"><a class="btn primary" href="#/deneme">Yeni deneme</a><a class="btn" href="#/yanlis">Yanlışlarımı tekrar et</a><a class="btn" href="' + esc(S.back) + '">Geri dön</a></div></div>' +
      '<h2>Cevaplar ve açıklamalar</h2>' + list + '</div>');
  }
  function pick(oi) {
    if (!S || S.done) return;
    var practice = S.mode === "practice";
    if (practice && S.ans[S.idx] !== null) return;
    S.ans[S.idx] = oi;
    if (practice) record(S.qs[S.idx].id, isRight(BYID[S.qs[S.idx].id], oi));
    viewQuiz();
  }
  function go(i) { if (!S) return; S.idx = Math.max(0, Math.min(S.qs.length - 1, i)); viewQuiz(); }

  document.addEventListener("keydown", function (ev) {
    if (location.hash !== "#/quiz" || !S || S.done) return;
    if (ev.target && /INPUT|SELECT|TEXTAREA/.test(ev.target.tagName)) return;
    var k = ev.key.toUpperCase(), pos = "ABCDE".indexOf(k); if (pos < 0) pos = "12345".indexOf(k);
    var e = S.qs[S.idx];
    if (pos >= 0 && pos < e.order.length) { pick(e.order[pos]); ev.preventDefault(); }
    else if (ev.key === "ArrowRight" || ev.key === "Enter") { if (S.idx < S.qs.length - 1) go(S.idx + 1); }
    else if (ev.key === "ArrowLeft") go(S.idx - 1);
  });

  /* ---------------------------------------------------------------- deneme sınavı */
  var DAGILIM = { temeller: 5, sayilar: 5, bellek: 5, yazmaclar: 3, adresleme: 4, komutlar: 1, toolchain: 1, calling: 1 };
  function makeExamIds() {
    var ids = [];
    Object.keys(DAGILIM).forEach(function (t) {
      var qs = topicQs(t), fresh = qs.filter(function (q) { return !prog[q.id] || prog[q.id].last === false; });
      var pick = shuffle(fresh).concat(shuffle(qs.filter(function (q) { return fresh.indexOf(q) < 0; })));
      var seen = {}, chosen = [];
      for (var i = 0; i < pick.length && chosen.length < DAGILIM[t]; i++) {
        var key = pick[i].q.slice(0, 40); if (seen[key]) continue; seen[key] = 1; chosen.push(pick[i].id);
      }
      ids = ids.concat(chosen);
    });
    return shuffle(ids);
  }
  function viewDeneme() {
    h('<h1>Deneme Sınavı</h1><p class="lead">Gerçek sınav gibi: <b>25 soru · 40 dakika · her soru 4 puan</b>. Konu dağılımı çıkmışlara göre ayarlandı; daha önce doğru çözdüğün sorular en sona bırakılır, yani her denemede farklı sorular gelir.</p>' +
      '<table class="t"><tr><th>Konu</th><th>Soru</th></tr>' + Object.keys(DAGILIM).map(function (t) { return '<tr><td>' + esc(TOPIC[t].baslik) + '</td><td>' + DAGILIM[t] + '</td></tr>'; }).join("") + '</table>' +
      '<div class="row"><button class="btn primary" data-act="exam">⏱️ Sınav modunda başlat (40 dk)</button><button class="btn" data-act="exampractice">Çalışma modunda başlat (süresiz, anında cevap)</button></div>' +
      '<h2>Diğer seçenekler</h2><div class="row"><button class="btn" data-act="random" data-n="10">Rastgele 10 soru</button><button class="btn" data-act="random" data-n="50">Rastgele 50 soru</button><button class="btn" data-act="onlypast">Sadece çıkmışlardan 25 soru</button><a class="btn" href="#/yanlis">Yanlışlarım</a></div>');
  }

  /* ---------------------------------------------------------------- çıkmışlar */
  function viewCikmisList() {
    h('<h1>Çıkmış Sorular</h1><p class="lead">Hepsi aynı hocanın (Doç. Dr. Bilal Babayiğit) sınavları. Fotoğraflardan birebir aktarıldı ve <b>her cevap tek tek kontrol edildi</b>. Elde dolaşan işaretli kopyalardaki yanlış cevaplar açıklamada belirtildi.</p>' +
      CIKMISLAR.map(function (ex) {
        var done = ex.sorular.filter(function (_, i) { return prog[ex.id + "-" + (i + 1)]; }).length;
        return '<div class="card" style="margin:12px 0"><div class="row" style="justify-content:space-between"><div><h3 style="margin:0">' + esc(ex.baslik) + '</h3><div class="muted small">' + esc(ex.tarih) + ' · ' + esc(ex.sure) + ' · ' + done + '/' + ex.sorular.length + ' çözüldü</div></div>' +
          '<div class="row"><button class="btn primary small" data-act="pastexam" data-x="' + ex.id + '">Sınav gibi çöz</button><button class="btn small" data-act="pastpractice" data-x="' + ex.id + '">Çalışma modu</button><a class="btn small" href="#/cikmis/' + ex.id + '">Cevaplar ve çözümler</a></div></div>' +
          '<p class="small" style="margin:.6em 0 0">' + esc(ex.not) + '</p></div>';
      }).join("") +
      '<div class="box tip">Aynı sorular yıllar içinde tekrar ediyor: "CASM assembler değildir", "MASM ornek.asm → ornek.obj", dizi adres hesabı (dw/dd), "R8D 32 bit", IEEE 754 ve CF/OF/PF soruları en az iki sınavda çıktı.</div>');
  }
  function viewCikmis(id) {
    var ex = CIKMISLAR.filter(function (x) { return x.id === id; })[0]; if (!ex) return viewCikmisList();
    var list = ex.sorular.map(function (q, i) {
      return '<div class="revq"><div class="small muted">Soru ' + (i + 1) + ' · ' + esc(TOPIC[q.t].baslik) + '</div><div><b>' + esc(q.q) + '</b></div>' + (q.c ? '<pre class="code">' + esc(q.c) + '</pre>' : '') +
        '<ol type="A" class="small" style="margin:6px 0">' + q.o.map(function (o, j) { return '<li' + (j === q.a ? ' style="color:var(--ok);font-weight:700"' : '') + '>' + esc(o) + (j === q.a ? " ✓" : "") + '</li>'; }).join("") + '</ol>' +
        '<details><summary class="small">Açıklama</summary><div class="small" style="margin-top:4px">' + esc(q.e || "—") + '</div></details>' + (q.z ? '<div class="disp">⚠️ ' + esc(q.z) + '</div>' : '') + '</div>';
    }).join("");
    var key = ex.sorular.map(function (q, i) { return (i + 1) + "-" + LET[q.a]; }).join("  ");
    h('<a href="#/cikmis" class="small">← Çıkmış sorular</a><h1>' + esc(ex.baslik) + '</h1><div class="muted">' + esc(ex.tarih) + ' · ' + esc(ex.sure) + '</div><p>' + esc(ex.not) + '</p>' +
      '<div class="row noprint"><button class="btn primary" data-act="pastexam" data-x="' + ex.id + '">Sınav gibi çöz</button><button class="btn" data-act="pastpractice" data-x="' + ex.id + '">Çalışma modu</button>' + (ex.pdf ? '<a class="btn" href="' + ex.pdf + '" target="_blank">Orijinal PDF</a>' : '') + '</div>' +
      '<div class="card" style="margin-top:14px"><b>Cevap anahtarı:</b> <span class="mono small">' + key + '</span></div>' +
      '<h2>Sorular, cevaplar ve çözümler</h2>' + list +
      ((ex.resimler || []).length ? '<h2>Orijinal fotoğraflar</h2><div class="gallery">' + ex.resimler.map(function (r) { return '<a href="' + r + '" target="_blank"><img loading="lazy" src="' + r + '" alt=""><span>' + esc(r.split("/").pop()) + '</span></a>'; }).join("") + '</div>' : ''));
  }

  /* ---------------------------------------------------------------- soru bankası */
  var bankFilter = { t: "all", s: "all", q: "" };
  function bankList() {
    return POOL.filter(function (q) {
      if (bankFilter.t !== "all" && q.t !== bankFilter.t) return false;
      if (bankFilter.s === "past" && !q.src) return false;
      if (bankFilter.s === "new" && q.src) return false;
      if (bankFilter.q) { var s = (q.q + " " + q.o.join(" ") + " " + (q.c || "") + " " + (q.e || "")).toLocaleLowerCase("tr"); if (s.indexOf(bankFilter.q.toLocaleLowerCase("tr")) < 0) return false; }
      return true;
    });
  }
  function viewBank(t) {
    if (t) bankFilter.t = t;
    var chips = '<button class="chip' + (bankFilter.t === "all" ? " on" : "") + '" data-act="bf" data-k="t" data-v="all">Tümü</button>' + KONULAR.map(function (k) { return '<button class="chip' + (bankFilter.t === k.id ? " on" : "") + '" data-act="bf" data-k="t" data-v="' + k.id + '">' + k.no + '. ' + esc(k.baslik) + '</button>'; }).join("");
    var src = [["all", "Hepsi"], ["past", "Sadece çıkmış"], ["new", "Sadece yeni"]].map(function (x) { return '<button class="chip' + (bankFilter.s === x[0] ? " on" : "") + '" data-act="bf" data-k="s" data-v="' + x[0] + '">' + x[1] + '</button>'; }).join("");
    h('<h1>Soru Bankası</h1><p class="muted">' + POOL.length + ' soru: ' + SORULAR.length + ' yeni (çıkmış soru tarzında yazıldı) + ' + (POOL.length - SORULAR.length) + ' çıkmış. Filtrele, ara, cevapları gör ya da filtreden pratik başlat.</p>' +
      '<div class="filters">' + chips + '</div><div class="filters">' + src + '<input type="text" id="bsearch" placeholder="Ara: IEEE, CASM, ROL, segment…" value="' + esc(bankFilter.q) + '" style="flex:1;min-width:200px"></div>' +
      '<div id="bankout"></div>');
    renderBankOut();
    var inp = document.getElementById("bsearch");
    inp.addEventListener("input", function () { bankFilter.q = inp.value; renderBankOut(); });
  }
  function renderBankOut() {
    var L = bankList();
    document.getElementById("bankout").innerHTML = '<div class="row" style="margin-bottom:10px"><b>' + L.length + ' soru</b><button class="btn primary small" data-act="bankpractice"' + (L.length ? "" : " disabled") + '>Bunları çalışma modunda çöz</button><button class="btn small" data-act="toggleall">Tüm cevapları aç/kapa</button></div>' +
      '<div class="searchres">' + L.map(function (q) {
        var p = prog[q.id];
        return '<div class="revq ' + (p ? (p.last ? "r" : "w") : "") + '"><div class="small muted">' + esc(TOPIC[q.t].baslik) + (q.src ? ' · <span class="tag">' + esc(q.src) + '</span>' : '') + '</div><b>' + esc(q.q) + '</b>' + (q.c ? '<pre class="code">' + esc(q.c) + '</pre>' : '') +
          '<details class="ansd"><summary class="small">Şıklar ve cevap</summary><ol type="A" class="small">' + q.o.map(function (o, j) { return '<li' + (j === q.a ? ' style="color:var(--ok);font-weight:700"' : '') + '>' + esc(o) + '</li>'; }).join("") + '</ol><div class="small">' + esc(q.e || "") + '</div>' + (q.z ? '<div class="disp">⚠️ ' + esc(q.z) + '</div>' : '') + '</details></div>';
      }).join("") + '</div>';
  }

  /* ---------------------------------------------------------------- yanlışlar */
  function viewWrong() {
    var ids = wrongIds();
    h('<h1>Yanlışlarım</h1><p class="muted">Son denemende yanlış yaptığın sorular burada toplanır. Doğru çözdüğünde listeden düşer. (İlerleme yalnızca bu tarayıcıda saklanır.)</p>' +
      (ids.length ? '<div class="row"><button class="btn primary" data-act="wrongquiz">' + ids.length + ' soruyu tekrar çöz</button><button class="btn" data-act="reset">Tüm ilerlemeyi sıfırla</button></div>' +
        ids.map(function (id) { var q = BYID[id]; return '<div class="revq w"><div class="small muted">' + esc(TOPIC[q.t].baslik) + (q.src ? " · " + esc(q.src) : "") + '</div><b>' + esc(q.q) + '</b><div class="small">Doğru: <b>' + esc(q.o[q.a]) + '</b></div></div>'; }).join("")
        : '<div class="card">Henüz yanlış yok. <a href="#/deneme">Bir deneme çöz →</a></div><div class="row" style="margin-top:12px"><button class="btn" data-act="reset">İlerlemeyi sıfırla</button></div>'));
  }

  /* ---------------------------------------------------------------- araçlar */
  function hex(n, w) { var s = n.toString(16).toUpperCase(); while (s.length < w / 4) s = "0" + s; return s; }
  function bin(n, w) { var s = n.toString(2); while (s.length < w) s = "0" + s; return s.replace(/(.{4})(?=.)/g, "$1 "); }
  function parseNum(str) {
    str = String(str).trim().replace(/[\s_]/g, ""); if (!str) return NaN;
    var neg = false; if (str[0] === "-") { neg = true; str = str.slice(1); }
    var v;
    if (/^0x[0-9a-f]+$/i.test(str)) v = parseInt(str.slice(2), 16);
    else if (/^[0-9a-f]+h$/i.test(str)) v = parseInt(str.slice(0, -1), 16);
    else if (/^0b[01]+$/i.test(str)) v = parseInt(str.slice(2), 2);
    else if (/^[01]+b$/i.test(str)) v = parseInt(str.slice(0, -1), 2);
    else if (/^\d+$/.test(str)) v = parseInt(str, 10);
    else return NaN;
    return neg ? -v : v;
  }
  var TOOLS = [
    ["sayi", "Sayı çevirici & ikiye tümleyen"], ["ieee", "IEEE 754 (adım adım)"], ["segment", "Segment:Offset → fiziksel adres"],
    ["bayrak", "Toplama/çıkarma ve bayraklar (CF, OF, ZF, SF, PF)"], ["veri", "db/dw/dd/dq adres hesabı"], ["endian", "Little / Big endian"], ["ascii", "ASCII tablosu"]
  ];
  function viewTools(which) {
    which = which || "sayi";
    var tabs = TOOLS.map(function (t) { return '<a class="chip' + (t[0] === which ? " on" : "") + '" href="#/araclar/' + t[0] + '">' + t[1] + '</a>'; }).join("");
    var body = "";
    if (which === "sayi") body = '<div class="card tool"><h3 style="margin-top:0">Sayı çevirici</h3><p class="small muted">Yazım: <code>149</code>, <code>-5</code>, <code>95h</code>, <code>0x95</code>, <code>10010101b</code></p><div class="row"><input type="text" id="n_in" value="-5" style="width:200px"><select id="n_w"><option>8</option><option selected>16</option><option>32</option></select> bit</div><div class="out" id="n_out"></div></div>';
    if (which === "ieee") body = '<div class="grid2"><div class="card tool"><h3 style="margin-top:0">Ondalık → IEEE 754</h3><input type="text" id="f_in" value="-12.25"><div class="out" id="f_out"></div></div><div class="card tool"><h3 style="margin-top:0">Hex → Ondalık</h3><input type="text" id="x_in" value="BE200000"><div class="out" id="x_out"></div></div></div>';
    if (which === "segment") body = '<div class="card tool"><h3 style="margin-top:0">Gerçek mod adres hesabı</h3><div class="row"><label>Segment (hex) <input type="text" id="s_seg" value="1000" style="width:110px"></label><label>Offset (hex) <input type="text" id="s_off" value="1F00" style="width:110px"></label></div><div class="out" id="s_out"></div></div>' +
      '<div class="card tool"><h3 style="margin-top:0">PUSH sonrası yığın adresi</h3><div class="row"><label>SS (hex) <input type="text" id="p_ss" value="2400" style="width:100px"></label><label>SP (hex) <input type="text" id="p_sp" value="0100" style="width:100px"></label><label>PUSH sayısı <input type="number" id="p_n" value="1" min="1" max="20" style="width:70px"></label><label>Boyut <select id="p_sz"><option value="2">16 bit (2 bayt)</option><option value="8">64 bit (8 bayt)</option></select></label></div><div class="out" id="p_out"></div></div>';
    if (which === "bayrak") body = '<div class="card tool"><h3 style="margin-top:0">ALU simülatörü</h3><div class="row"><input type="text" id="a_a" value="7FFFh" style="width:130px"><select id="a_op"><option value="add">+ (ADD)</option><option value="sub">− (SUB / CMP)</option></select><input type="text" id="a_b" value="1" style="width:130px"><select id="a_w"><option>8</option><option selected>16</option><option>32</option></select> bit</div><div id="a_flags" class="flagrow"></div><div class="out" id="a_out"></div><p class="small muted">Dene: 8000h+8000h (16 bit) · FFh+1 (8 bit) · 7Fh+1 (8 bit) · 5Ah+4Ch (8 bit) · FFFFFFF3h+158 (32 bit)</p></div>';
    if (which === "veri") body = '<div class="card tool"><h3 style="margin-top:0">Dizi tanımı ve adresler</h3><p class="small muted">Örn. <code>notlar dw 69H, 87H, 96H, 45H, 75H</code> ve ardından <code>enyuksek dw ?</code></p><div class="row"><label>Direktif <select id="d_t"><option value="1">db (1 bayt)</option><option value="2" selected>dw (2 bayt)</option><option value="4">dd (4 bayt)</option><option value="8">dq (8 bayt)</option></select></label><label>Eleman sayısı <input type="number" id="d_n" value="5" min="1" max="64" style="width:80px"></label><label>Başlangıç adresi (hex) <input type="text" id="d_a" value="1000" style="width:100px"></label></div><div class="out" id="d_out"></div></div>';
    if (which === "endian") body = '<div class="card tool"><h3 style="margin-top:0">Bayt sıralaması</h3><div class="row"><label>Değer (hex) <input type="text" id="e_v" value="1A2B3C4D" style="width:200px"></label><label>Başlangıç adresi (hex) <input type="text" id="e_a" value="2000" style="width:100px"></label></div><div id="e_out"></div></div>';
    if (which === "ascii") {
      var cells = [[0x0A, "LF"], [0x0D, "CR"], [0x20, "boşluk"]].map(function (c) { return '<div><b>' + c[1] + '</b> ' + c[0] + ' · ' + hex(c[0], 8) + 'h</div>'; }).join("");
      for (var c = 33; c < 127; c++) cells += '<div><b>' + esc(String.fromCharCode(c)) + '</b> ' + c + ' · ' + hex(c, 8) + 'h</div>';
      body = '<div class="card"><p class="small">Kurallar: <b>\'0\' = 30h</b>, <b>\'A\' = 41h (65)</b>, <b>\'a\' = 61h (97)</b>, büyük↔küçük farkı <b>20h</b> (5. bit). Standart ASCII 7 bit, 128 karakter.</p><div class="ascii">' + cells + '</div></div>';
    }
    h('<h1>Hesaplama Araçları</h1><p class="muted">Sınavdaki hesap sorularını kendi örneklerinle dene; her araç adımları da gösterir.</p><div class="filters">' + tabs + '</div>' + body);
    var upd = TOOL_FN[which]; if (upd) { upd(); app.querySelectorAll("input,select").forEach(function (el) { el.addEventListener("input", upd); el.addEventListener("change", upd); }); }
  }
  var TOOL_FN = {
    sayi: function () {
      var v = parseNum(val("n_in")), w = +val("n_w"), out = document.getElementById("n_out"), M = Math.pow(2, w);
      if (isNaN(v)) { out.textContent = "Geçersiz sayı."; return; }
      if (v >= M || v < -M / 2) { out.textContent = "Bu sayı " + w + " bite sığmaz (işaretsiz 0…" + (M - 1) + ", işaretli " + (-M / 2) + "…" + (M / 2 - 1) + ")."; return; }
      var u = v < 0 ? v + M : v, sg = u >= M / 2 ? u - M : u, t = "";
      t += "İşaretsiz onluk : " + u + "\nİşaretli onluk  : " + sg + "  (MSB = " + (u >= M / 2 ? "1 → negatif" : "0 → pozitif") + ")\nHex             : " + hex(u, w) + "h\nBinary          : " + bin(u, w) + "b";
      if (v < 0) { var p = -v; t += "\n\nİkiye tümleyen adımları (" + v + "):\n 1) +" + p + "      = " + bin(p, w) + "\n 2) Bitleri ters = " + bin((M - 1) - p, w) + "\n 3) +1           = " + bin(u, w) + "  = " + hex(u, w) + "h"; }
      out.textContent = t;
    },
    ieee: function () {
      var f = document.getElementById("f_out"), x = document.getElementById("x_out");
      var s = val("f_in").replace(",", ".");
      var num = parseFloat(s);
      if (s.trim() === "" || isNaN(num)) f.textContent = "Bir ondalık sayı gir (ör. 9,75)";
      else { var dv = new DataView(new ArrayBuffer(4)); dv.setFloat32(0, num); f.textContent = ieeeSteps(dv.getUint32(0), num); }
      var hx = val("x_in").replace(/^0x/i, "").replace(/h$/i, "").replace(/\s/g, "");
      if (!/^[0-9a-f]{1,8}$/i.test(hx)) x.textContent = "8 haneli hex gir (ör. 41300000)";
      else { while (hx.length < 8) hx += "0"; var bits = parseInt(hx, 16) >>> 0, dv2 = new DataView(new ArrayBuffer(4)); dv2.setUint32(0, bits); x.textContent = ieeeSteps(bits, dv2.getFloat32(0), true); }
    },
    segment: function () {
      var seg = parseInt(val("s_seg"), 16), off = parseInt(val("s_off"), 16), o = document.getElementById("s_out");
      if (isNaN(seg) || isNaN(off) || seg > 0xFFFF || off > 0xFFFF) o.textContent = "Segment ve offset 4 haneli hex olmalı.";
      else { var ph = seg * 16 + off; o.textContent = "Segment × 16   = " + hex(seg, 16) + "0h  (sağa bir 0 ekle = 4 bit sola kaydır)\n+ Offset       = " + hex(off, 20).replace(/^0/, " ") + "h\n" + "─".repeat(32) + "\nFiziksel adres = " + hex(ph % 0x100000, 20) + "h" + (ph > 0xFFFFF ? "  (1 MB aşıldı! 8086'da başa sarar = wrap-around / A20)" : ""); }
      var ss = parseInt(val("p_ss"), 16), sp = parseInt(val("p_sp"), 16), n = +val("p_n"), sz = +val("p_sz"), p = document.getElementById("p_out");
      if (isNaN(ss) || isNaN(sp) || !n) { p.textContent = "Değerleri kontrol et."; return; }
      var nsp = sp - n * sz, lines = "Her PUSH SP'yi " + sz + " azaltır → " + n + " × " + sz + " = " + (n * sz) + " bayt (" + (n * sz).toString(16).toUpperCase() + "h)\nYeni SP = " + hex(sp, 16) + "h − " + (n * sz).toString(16).toUpperCase() + "h = " + hex((nsp + 0x10000) % 0x10000, 16) + "h";
      if (sz === 2) lines += "\nSon yazılan fiziksel adres = SS×16 + SP = " + hex(ss, 16) + "0h + " + hex((nsp + 0x10000) % 0x10000, 16) + "h = " + hex((ss * 16 + ((nsp + 0x10000) % 0x10000)) % 0x100000, 20) + "h";
      p.textContent = lines;
    },
    bayrak: function () {
      var a = parseNum(val("a_a")), b = parseNum(val("a_b")), w = +val("a_w"), op = val("a_op"), o = document.getElementById("a_out"), fl = document.getElementById("a_flags");
      var M = Math.pow(2, w), H = M / 2;
      if (isNaN(a) || isNaN(b)) { o.textContent = "Sayıları kontrol et (ör. 7FFFh, 1, -5)."; fl.innerHTML = ""; return; }
      a = ((a % M) + M) % M; b = ((b % M) + M) % M;
      var raw = op === "add" ? a + b : a - b, r = ((raw % M) + M) % M;
      var CF = op === "add" ? raw >= M : a < b;
      var sa = a >= H, sb = b >= H, sr = r >= H;
      var OF = op === "add" ? (sa === sb && sr !== sa) : (sa !== sb && sr !== sa);
      var ZF = r === 0, SF = sr, lb = r & 0xFF, ones = 0; for (var i = 0; i < 8; i++) if (lb & (1 << i)) ones++;
      var PF = ones % 2 === 0, AF = ((a ^ b ^ r) & 0x10) !== 0;
      var sg = function (x) { return x >= H ? x - M : x; };
      fl.innerHTML = [["CF", CF], ["OF", OF], ["ZF", ZF], ["SF", SF], ["PF", PF], ["AF", AF]].map(function (f) { return '<span class="flag' + (f[1] ? " on" : "") + '">' + f[0] + "=" + (f[1] ? 1 : 0) + '</span>'; }).join("");
      o.textContent = "  " + bin(a, w) + "  (" + hex(a, w) + "h = " + a + " işaretsiz, " + sg(a) + " işaretli)\n" + (op === "add" ? "+ " : "− ") + bin(b, w) + "  (" + hex(b, w) + "h = " + b + ", " + sg(b) + ")\n" + "─".repeat(w + w / 4 + 2) + "\n= " + bin(r, w) + "  (" + hex(r, w) + "h = " + r + " işaretsiz, " + sg(r) + " işaretli)\n\n" +
        "CF=" + (CF ? 1 : 0) + " : " + (op === "add" ? (CF ? "işaretsiz sonuç " + w + " bite sığmadı (MSB'den elde çıktı)" : "MSB'den elde çıkmadı") : (CF ? "küçükten büyük çıkarıldı → ödünç alındı" : "ödünç yok")) + "\n" +
        "OF=" + (OF ? 1 : 0) + " : " + (OF ? "işaretli taşma: işaretli sonuç " + (op === "add" ? sg(a) + sg(b) : sg(a) - sg(b)) + " aralığa (" + (-H) + "…" + (H - 1) + ") sığmadı" : "işaretli sonuç aralıkta") + "\n" +
        "ZF=" + (ZF ? 1 : 0) + " : sonuç " + (ZF ? "sıfır" : "sıfır değil") + "\nSF=" + (SF ? 1 : 0) + " : MSB = " + (SF ? 1 : 0) + "\nPF=" + (PF ? 1 : 0) + " : düşük bayt " + hex(lb, 8) + "h içinde " + ones + " tane 1 (" + (PF ? "çift" : "tek") + ")";
    },
    veri: function () {
      var sz = +val("d_t"), n = +val("d_n"), a = parseInt(val("d_a"), 16), o = document.getElementById("d_out");
      if (isNaN(a) || !n) { o.textContent = "Değerleri kontrol et."; return; }
      var t = "Her eleman " + sz + " bayt, " + n + " eleman → toplam " + n * sz + " bayt = " + (n * sz).toString(16).toUpperCase() + "h\n\n";
      for (var i = 0; i < Math.min(n, 16); i++) t += (i + 1) + ". eleman  [dizi+" + i * sz + "]  → " + hex(a + i * sz, 16) + "h\n";
      if (n > 16) t += "…\n";
      t += "\nSonraki değişken (ör. enyuksek) → " + hex(a, 16) + "h + " + (n * sz).toString(16).toUpperCase() + "h = " + hex(a + n * sz, 16) + "h";
      o.textContent = t;
    },
    endian: function () {
      var v = val("e_v").replace(/^0x/i, "").replace(/h$/i, "").replace(/\s/g, ""), a = parseInt(val("e_a"), 16), o = document.getElementById("e_out");
      if (!/^[0-9a-f]+$/i.test(v) || isNaN(a)) { o.innerHTML = '<div class="out">Hex değer gir.</div>'; return; }
      if (v.length % 2) v = "0" + v;
      var bytes = v.toUpperCase().match(/../g), little = bytes.slice().reverse();
      var row = function (arr) { return arr.map(function (b, i) { return '<tr><td class="mono">' + hex(a + i, 16) + 'h</td><td class="mono"><b>' + b + '</b></td></tr>'; }).join(""); };
      o.innerHTML = '<div class="grid2" style="margin-top:10px"><div><b>Little endian (Intel/AMD)</b><table class="t"><tr><th>Adres</th><th>Bayt</th></tr>' + row(little) + '</table></div><div><b>Big endian (ağ sırası)</b><table class="t"><tr><th>Adres</th><th>Bayt</th></tr>' + row(bytes) + '</table></div></div>';
    }
  };
  function val(id) { var el = document.getElementById(id); return el ? el.value : ""; }
  function ieeeSteps(bits, value, fromHex) {
    var S = bits >>> 31, E = (bits >>> 23) & 255, M = bits & 0x7FFFFF;
    var mb = M.toString(2); while (mb.length < 23) mb = "0" + mb;
    var all = bin(bits >>> 0, 32), t = "";
    if (fromHex) t += "Binary: " + all + "\n\n";
    t += "S (işaret) = " + S + (S ? "  → negatif" : "  → pozitif") + "\n";
    if (E === 0 || E === 255) { t += "E = " + E + " → özel değer (" + (E === 255 ? (M ? "NaN" : "sonsuz") : "sıfır / denormal") + ")\nSonuç: " + value; return t; }
    var e = E - 127, mt = mb.replace(/0+$/, "");
    if (!fromHex) {
      var absb = binStr(Math.abs(value));
      t = "1) İşaret: " + (S ? "negatif → S = 1" : "pozitif → S = 0") + "\n2) İkiliye çevir: " + Math.abs(value) + " = " + absb + "b\n3) Normalize et: 1," + (mt || "0") + " × 2^" + e + "  (gerçek üs " + e + ")\n4) Üs alanı: " + e + " + 127 = " + E + " = " + bin(E, 8).replace(" ", "") + "b\n5) Mantis (23 bit): " + mb + "\n\n   S | E        | M\n   " + S + " | " + bin(E, 8).replace(" ", "") + " | " + mb + "\n\nBinary: " + all + "\nHex   : 0x" + hex(bits >>> 0, 32) + (value !== Math.fround(value) ? "\n(Not: " + value + " tam temsil edilemez, en yakın değer " + Math.fround(value) + ")" : "");
      return t;
    }
    t += "E (üs alanı) = " + bin(E, 8).replace(" ", "") + "b = " + E + "  → gerçek üs = " + E + " − 127 = " + e + "\nM (mantis) = " + mb + "\n\nDeğer = " + (S ? "−" : "+") + "1," + (mt || "0") + "b × 2^" + e + "\n      = " + (S ? "−" : "") + shiftPoint(mt, e) + "b\n      = " + value;
    return t;
  }
  function binStr(x) {
    var ip = Math.floor(x), fp = x - ip, s = ip.toString(2), f = "";
    for (var i = 0; i < 24 && fp > 0; i++) { fp *= 2; if (fp >= 1) { f += "1"; fp -= 1; } else f += "0"; }
    return s + (f ? "," + f : "");
  }
  function shiftPoint(mt, e) {
    var digits = "1" + mt, pos = 1 + e;
    if (pos <= 0) return "0," + "0".repeat(-pos) + digits;
    if (pos >= digits.length) return digits + "0".repeat(pos - digits.length);
    return digits.slice(0, pos) + "," + digits.slice(pos);
  }

  /* ---------------------------------------------------------------- özet */
  var OZET = '' +
    '<div class="cheat">' +
    '<div class="card"><h3>Tarih – mutlaka bil</h3><ul><li><b>4004</b> (1971): ilk mikroişlemci, 4 bit, hesap makinesi, programlanabilir</li><li><b>8008</b>: 4004\'ün 8 bit versiyonu, 16 KB, 48 komut · <b>8080</b>: 64 KB, Altair · <b>8085</b>: son 8 bit</li><li><b>8086</b> (1978): 16 bit, 20 bit adres = 1 MB, x86\'nın babası · <b>8088</b>: 8 bit dış veri yolu, IBM PC</li><li><b>80286</b>: 24 bit = 16 MB, korumalı mod (gerçek + korumalı)</li><li><b>80386</b> (1985): ilk 32 bit, 4 GB, sayfalama</li><li><b>80486</b>: FPU + 8 KB önbellek içeride, >1M transistör</li><li><b>Pentium</b> (1993): süperskalar, ad tescili</li><li><b>AMD</b>: ilk 1 GHz (Athlon 2000), x86-64\'ü getirdi</li><li><b>Core Duo</b>: çok çekirdek ← Power Wall</li><li><b>ARM</b> = Acorn RISC Machine, lisans satar, düşük güç</li><li>Mikroişlemci firması <u>değil</u>: <b>Dell, Army</b></li></ul></div>' +
    '<div class="card"><h3>Kavramlar</h3><ul><li><b>Power Wall</b>: frekans↑ → güç/ısı↑↑, 3–4 GHz tavan</li><li><b>Moore</b>: transistör sayısı ~2 yılda ×2 · <b>Dennard</b> ~2005 çöktü</li><li><b>Von Neumann</b>: komut+veri aynı bellek, tek yol → darboğaz · <b>Harvard</b>: ayrı bellek/yol · modern: L1-I/L1-D ayrı</li><li><b>CISC</b> (x86): karmaşık komut, çok güç · <b>RISC</b> (ARM, RISC-V): basit, düşük güç</li><li><b>MPU</b>: sadece CPU · <b>MCU</b>: CPU+RAM+ROM+G/Ç tek yonga (Arduino, PIC) · <b>SoC</b>: CPU+GPU+NPU…</li><li><b>P-Core/E-Core</b>: heterojen · <b>SMT</b>: 1 çekirdek 2 thread</li><li><b>L1</b> en hızlı/küçük → <b>L3</b> en yavaş/büyük, paylaşımlı</li><li>Periyot = 1/f (2 GHz → 0,5 ns)</li></ul></div>' +
    '<div class="card"><h3>Sayılar</h3><ul><li>n bit işaretsiz: 0…2ⁿ−1 · işaretli: −2ⁿ⁻¹…2ⁿ⁻¹−1 (8 bit −128…127, 16 bit −32768…32767)</li><li>İkiye tümleyen: ters çevir + 1 (−5 = FBh)</li><li><b>CF</b> işaretsiz taşma (Cₙ) · <b>OF</b> işaretli taşma (Cₙ₋₁ ⊕ Cₙ)</li><li>7FFFh+1 → CF=0, OF=1 · 8000h+8000h → 0, CF=1 ZF=1 OF=1 PF=1</li><li>ASCII 7 bit 128 · \'A\'=41h \'a\'=61h \'0\'=30h · CR=0Dh LF=0Ah · fark 20h (5. bit)</li><li>UTF-8 değişken 1–4 bayt</li><li>Little endian (Intel): düşük bayt düşük adrese · Big: ağ</li></ul></div>' +
    '<div class="card"><h3>IEEE 754 (float)</h3><ul><li>S 1 | E 8 | M 23, bias 127 · double 1|11|52, bias 1023</li><li>Değer = (−1)ˢ × 1.M × 2^(E−127)</li><li>Adımlar: işaret → ikili → 1,xxx×2ⁿ → E=n+127 → mantis</li></ul><table class="t"><tr><td>−12,25</td><td>C1440000</td></tr><tr><td>9,75</td><td>411C0000</td></tr><tr><td>9,875</td><td>411E0000</td></tr><tr><td>10,625</td><td>412A0000</td></tr><tr><td>11,0</td><td>41300000</td></tr><tr><td>−12,6875</td><td>C14B0000</td></tr><tr><td>−2,1875</td><td>C00C0000</td></tr><tr><td>−0,15625</td><td>BE200000</td></tr><tr><td>1,0</td><td>3F800000</td></tr></table></div>' +
    '<div class="card"><h3>Bellek</h3><ul><li>n adres hattı → 2ⁿ bayt: 16→64 KB, <b>20→1 MB</b>, 24→16 MB, <b>32→4 GB</b>, 36→64 GB, 40→1 TB, 48→256 TB</li><li><b>Fiziksel = Segment×16 + Offset</b> (1000:1F00 → 11F00h)</li><li>CS:IP kod · SS:SP/BP yığın · DS:BX,SI,DI veri · ES:DI ek</li><li>Gerçek mod: sayfalama yok, segment ≤ 64 KB</li><li>Korumalı: mantıksal → doğrusal → fiziksel; seçici = indeks 13 | TI 1 | RPL 2; tanımlayıcı 8 bayt; GDT/LDT; 8192 girdi</li><li>Ring 0 kernel … Ring 3 kullanıcı; ihlal → GPF</li><li>Sayfalama 10-10-12 → 4 KB sayfa, 4 GB; P=0 → page fault</li><li>MMU çevirir, TLB önbellek, CR0 (PE, PG), CR3 sayfa dizini</li><li>64 bit flat: segment tabanı 0, FS/GS → TLS, gerçek mod yok</li><li>Sanal bellek amacı: RAM\'den büyük alan</li></ul></div>' +
    '<div class="card"><h3>Yazmaçlar</h3><ul><li>RAX(acc) RBX(base) RCX(counter) RDX(data, kalan) RSI/RDI(kaynak/hedef) RBP(taban) RSP(yığın tepesi) RIP(sonraki komut)</li><li>RAX ⊃ EAX ⊃ AX = AH:AL · R8 64 · <b>R8D 32</b> · R8W 16 · R8B 8 · <b>R7 yok</b></li><li>Byte 1 · Word 2 · Dword 4 · Qword 8 bayt</li><li>ZF sonuç 0 · SF negatif · CF işaretsiz taşma · OF işaretli taşma · PF düşük baytta çift sayıda 1</li><li>MOV/LEA/PUSH/POP/JMP bayrak etkilemez · INC/DEC CF etkilemez</li><li>Boyutlar eşit olmalı; bellekten belleğe MOV yok; MOV [x],5 → DWORD PTR gerekir</li></ul></div>' +
    '<div class="card"><h3>Adresleme</h3><table class="t"><tr><td>Register</td><td>MOV RAX,RBX</td></tr><tr><td>Immediate</td><td>MOV EAX,10</td></tr><tr><td>Direct</td><td>MOV EAX,[2000h]</td></tr><tr><td>Reg. indirect</td><td>MOV EAX,[RBX]</td></tr><tr><td>Reg. relative</td><td>MOV EAX,[RBP+8]</td></tr><tr><td>Base-indexed</td><td>MOV AX,[BX+SI]</td></tr><tr><td>Rel. base-indexed</td><td>MOV AX,[BP+SI+4]</td></tr><tr><td>Scaled index</td><td>[RSI+RCX*4]</td></tr></table><ul><li>scale ∈ {1,2,4,8} · db 1, dw 2, dd 4, dq 8 bayt</li><li>5 eleman dw → +0Ah; dd → +14h</li><li>LEA adres hesaplar (bellek okumaz); LEA ×3,×5,×9 hızlı çarpma</li><li>PUSH: RSP azalır (64 bit −8, 16 bit −2); push imm (64 bit) = 8 bayt; PUSH EAX geçersiz</li></ul></div>' +
    '<div class="card"><h3>Komutlar</h3><ul><li>XOR AX,0FFFFh → tersi (1234→EDCB) · XOR AX,AX → 0</li><li>SHL n → ×2ⁿ · SHR n → ÷2ⁿ · ROL/ROR döndürür (0F0F ROL 4 = F0F0)</li><li>IDIV CX → AX bölüm, DX kalan · IMUL r → RDX:RAX</li><li>LOOP = DEC CX + JNZ · JMP koşulsuz atlama · CMP = SUB ama sonucu yazmaz</li><li>OUT 80h,AL yazar · IN AL,80h okur</li><li>INT 21h: 01 oku, 02 DL yaz, 09 $-string yaz, 4C çık · INT 10h/0E karakter yaz · INT 16h/00 tuş bekle</li><li>Sıfırlama: MOV 0, SUB, XOR, AND 0, SHL — <b>ADD ile olmaz</b></li></ul></div>' +
    '<div class="card"><h3>Toolchain & Calling convention</h3><ul><li>.asm →(assembler)→ <b>.obj</b> →(linker)→ .exe →(loader)→ RAM</li><li>Debugger: satır satır, yazmaç/bellek görür</li><li>Assembler: MASM (Microsoft, ml64, LINK), TASM (Borland), NASM (Netwide), FASM (Flat), GAS (GNU, AT&amp;T) · <b>CASM yok</b></li><li>Derleyici tek seferde (C/C++) · Yorumlayıcı satır satır (Python, JS) · Java bytecode + JVM</li><li>Intel: mov hedef,kaynak · AT&amp;T: mov %kaynak,%hedef, $sabit</li><li>Assembly işlemciye özel; donanım sürücüleri</li><li><b>Windows x64</b>: parametreler RCX, RDX, R8, R9, sonra yığın; dönüş RAX; 32 bayt shadow space</li><li>Korunacak (callee-saved): RBX, RBP, RDI, RSI, R12–R15 · bozulabilir: RAX, RCX, RDX, R8–R11</li><li>extern "C" + PROC/ENDP + PUBLIC</li></ul></div>' +
    '</div>';
  function viewOzet() { h('<h1>Tek Sayfa Özet</h1><p class="muted noprint">Sınavdan önceki son okuma. Yazdırmak için <kbd>Ctrl</kbd>+<kbd>P</kbd> (ya da PDF klasöründeki hazır sürüm).</p>' + OZET); }

  /* ---------------------------------------------------------------- kaynaklar */
  var FILES = [
    ["Bu sitenin PDF sürümleri", [
      ["pdf/1-konu-anlatimi.pdf", "Konu anlatımı (8 konu, tamamı)"], ["pdf/2-tek-sayfa-ozet.pdf", "Tek sayfa özet / formül kâğıdı"],
      ["pdf/3-cikmis-sorular-cozumlu.pdf", "Çıkmış sorular (2014–2025) cevap ve çözümleriyle"], ["pdf/4-soru-bankasi-cevapli.pdf", "Soru bankasının tamamı (cevaplı)"]]]
  ];
  function viewKaynaklar() {
    h('<h1>PDF\'ler</h1><p class="muted">Sitenin yazdırılabilir sürümleri; bağlantılar internet olmadan da açılır.</p>' +
      FILES.map(function (g) { return '<h2>' + esc(g[0]) + '</h2><ul>' + g[1].map(function (f) { return '<li><a href="' + f[0] + '" target="_blank">' + esc(f[1]) + '</a> <span class="muted small">' + esc(f[0].split("/").pop()) + '</span></li>'; }).join("") + '</ul>'; }).join(""));
  }

  /* ---------------------------------------------------------------- yazdırma görünümleri (PDF üretimi için) */
  function viewPrint(kind) {
    if (kind === "konular") return h('<h1>Mikroişlemciler Vize — Konu Anlatımı</h1><p class="muted">Doç. Dr. Bilal Babayiğit · BZ309 · ders notları, iskelet notlar ve çıkmış sorulardan derlendi.</p>' + KONULAR.map(function (k, ki) { return '<section' + (ki ? ' style="break-before:page"' : '') + '><div class="muted small">KONU ' + k.no + ' · ' + esc(k.hafta) + '</div><h1>' + esc(k.baslik) + '</h1>' + k.html + '</section>'; }).join(""));
    if (kind === "cikmis") return h('<h1>Mikroişlemciler — Çıkmış Sorular (Çözümlü)</h1>' + CIKMISLAR.map(function (ex, ei) {
      return '<section' + (ei ? ' style="break-before:page"' : '') + '><h1>' + esc(ex.baslik) + '</h1><div class="muted">' + esc(ex.tarih) + ' · ' + esc(ex.sure) + '</div><p>' + esc(ex.not) + '</p>' +
        '<div class="card"><b>Cevap anahtarı:</b> <span class="mono small">' + ex.sorular.map(function (q, i) { return (i + 1) + "-" + LET[q.a]; }).join("  ") + '</span></div>' +
        ex.sorular.map(function (q, i) { return printQ(q, i + 1); }).join("") + '</section>';
    }).join(""));
    if (kind === "sorular") return h('<h1>Mikroişlemciler — Soru Bankası (Cevaplı)</h1>' + KONULAR.map(function (k, ki) {
      var qs = SORULAR.filter(function (q) { return q.t === k.id; });
      return '<section' + (ki ? ' style="break-before:page"' : '') + '><h1>' + k.no + '. ' + esc(k.baslik) + '</h1>' + qs.map(function (q, i) { return printQ(q, i + 1); }).join("") + '</section>';
    }).join(""));
    if (kind === "ozet") return h('<h1>Mikroişlemciler Vize — Tek Sayfa Özet</h1>' + OZET);
    viewHome();
  }
  function printQ(q, n) {
    return '<div class="revq" style="break-inside:avoid"><b>' + n + ') ' + esc(q.q) + '</b>' + (q.c ? '<pre class="code">' + esc(q.c) + '</pre>' : '') +
      '<ol type="A" style="margin:4px 0">' + q.o.map(function (o, j) { return '<li' + (j === q.a ? ' style="font-weight:700;color:var(--ok)"' : '') + '>' + esc(o) + (j === q.a ? " ✓" : "") + '</li>'; }).join("") + '</ol>' +
      (q.e ? '<div class="small muted">' + esc(q.e) + '</div>' : '') + (q.z ? '<div class="disp">⚠️ ' + esc(q.z) + '</div>' : '') + '</div>';
  }

  /* ---------------------------------------------------------------- olaylar */
  app.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-act]"); if (!b) return;
    var act = b.getAttribute("data-act");
    if (act === "pick") return pick(+b.getAttribute("data-o"));
    if (act === "next") return go(S.idx + 1);
    if (act === "prev") return go(S.idx - 1);
    if (act === "go") return go(+b.getAttribute("data-i"));
    if (act === "finish") return finishQuiz(false);
    if (act === "topicquiz" || act === "topicall") {
      var t = b.getAttribute("data-t"), ids = shuffle(topicQs(t).map(function (q) { return q.id; }));
      if (act === "topicquiz") ids = ids.slice(0, 10);
      return startQuiz({ ids: ids, title: TOPIC[t].baslik, mode: "practice", back: "#/konu/" + t });
    }
    if (act === "exam") return startQuiz({ ids: makeExamIds(), title: "Deneme Sınavı", mode: "exam", limit: 40 * 60, back: "#/deneme" });
    if (act === "exampractice") return startQuiz({ ids: makeExamIds(), title: "Deneme (çalışma modu)", mode: "practice", back: "#/deneme" });
    if (act === "random") return startQuiz({ ids: shuffle(POOL.map(function (q) { return q.id; })).slice(0, +b.getAttribute("data-n")), title: "Rastgele " + b.getAttribute("data-n") + " soru", mode: "practice", back: "#/deneme" });
    if (act === "onlypast") return startQuiz({ ids: shuffle(POOL.filter(function (q) { return q.src; }).map(function (q) { return q.id; })).slice(0, 25), title: "Çıkmışlardan 25 soru", mode: "exam", limit: 40 * 60, back: "#/deneme" });
    if (act === "pastexam" || act === "pastpractice") {
      var ex = CIKMISLAR.filter(function (x) { return x.id === b.getAttribute("data-x"); })[0];
      return startQuiz({ ids: ex.sorular.map(function (_, i) { return ex.id + "-" + (i + 1); }), title: ex.baslik, mode: act === "pastexam" ? "exam" : "practice", limit: act === "pastexam" ? (ex.sorular.length >= 25 ? 40 : 30) * 60 : 0, mix: false, back: "#/cikmis/" + ex.id });
    }
    if (act === "bf") { bankFilter[b.getAttribute("data-k")] = b.getAttribute("data-v"); return viewBank(); }
    if (act === "bankpractice") return startQuiz({ ids: bankList().map(function (q) { return q.id; }), title: "Soru bankası", mode: "practice", back: "#/sorular" });
    if (act === "toggleall") { var ds = app.querySelectorAll("details.ansd"), open = !(ds[0] && ds[0].open); ds.forEach(function (d) { d.open = open; }); return; }
    if (act === "wrongquiz") return startQuiz({ ids: shuffle(wrongIds()), title: "Yanlışlarım", mode: "practice", back: "#/yanlis" });
    if (act === "reset") { if (window.confirm("Tüm ilerleme silinsin mi?")) { prog = {}; store.set("prog", prog); viewWrong(); } return; }
  });

  /* ---------------------------------------------------------------- yönlendirme */
  function route() {
    var parts = (location.hash || "#/").slice(2).split("/");
    if (parts[0] !== "quiz") stopTimer();
    side.classList.remove("open");
    switch (parts[0]) {
      case "": viewHome(); break;
      case "konu": viewTopic(parts[1]); break;
      case "quiz": viewQuiz(); break;
      case "deneme": viewDeneme(); break;
      case "cikmis": parts[1] ? viewCikmis(parts[1]) : viewCikmisList(); break;
      case "sorular": viewBank(parts[1]); break;
      case "yanlis": viewWrong(); break;
      case "araclar": viewTools(parts[1]); break;
      case "ozet": viewOzet(); break;
      case "kaynaklar": viewKaynaklar(); break;
      case "yazdir": viewPrint(parts[1]); break;
      default: viewHome();
    }
    markNav();
  }
  buildNav();
  window.addEventListener("hashchange", route);
  route();
})();
