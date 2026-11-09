/* 세계 지도 — 언어별로 색칠하고, 나라를 누르면 그 나라 말로 배운다.
 *
 * 지도 모양은 js/data/world-map.js에 미리 구워둔 SVG 경로다(라이브러리 없음, 오프라인 동작).
 * 색은 그 나라의 첫 번째 언어(countries.js)로 정한다.
 *   - 표현집 언어  → 그 언어 색
 *   - 비슷한 언어로 통하는 곳(말레이시아→인도네시아어 등) → 그 언어 색을 옅게
 *   - 그 밖 → 회색 (눌러보면 AI 번역으로 이어진다)
 *
 * 화면을 다시 그리지 않고 경로의 클래스만 바꿔서, 확대해 둔 상태가 유지되게 한다. */
window.WORLDMAP = (function () {
  'use strict';

  var el = UI.el, esc = UI.esc;
  var SVGNS = 'http://www.w3.org/2000/svg';

  var vb = null;            // 현재 보이는 영역 {x, y, w, h}
  var selected = '';        // 고른 나라 코드
  var activeLang = '';      // 패널에서 펼친 언어
  var highlight = '';       // 범례에서 고른 언어
  var svg = null, panel = null;

  var REGION_NAMES = [
    ['all', '전체'], ['asia', '아시아'], ['europe', '유럽'],
    ['mideast_africa', '중동·아프리카'], ['americas', '아메리카'], ['oceania', '오세아니아']
  ];

  function M() { return window.WORLD_MAP; }
  function langsOf(a2) { return (window.COUNTRY_LANGS[a2] || []).slice(); }

  function countryRow(a2) {
    var r = M().c.find(function (x) { return x[0] === a2; });
    if (r) return { a2: r[0], ko: r[1], en: r[2], box: [r[6], r[7], r[8], r[9]], cx: r[4], cy: r[5] };
    var d = M().dots.find(function (x) { return x[0] === a2; });
    if (d) return { a2: d[0], ko: d[1], en: d[2], box: [d[3] - 4, d[4] - 4, d[3] + 4, d[4] + 4], cx: d[3], cy: d[4] };
    return null;
  }

  function flagOf(a2) {
    if (!/^[A-Z]{2}$/.test(a2)) return '🏳️';
    return String.fromCodePoint.apply(null, a2.split('').map(function (c) { return 0x1F1E6 + c.charCodeAt(0) - 65; }));
  }

  /* 그 나라 색 — 첫 언어 기준 */
  function colorOf(a2) {
    var ls = langsOf(a2);
    var p = ls[0];
    if (!p) return { fill: 'var(--wm-none)', kind: 'none' };
    if (p === 'ko') return { fill: 'var(--accent)', kind: 'home' };
    if (p === 'en') return { fill: MULTILANG.langById('en').color, kind: 'lang', lang: 'en' };
    if (MULTILANG.supported(p)) return { fill: MULTILANG.langById(p).color, kind: 'lang', lang: p };
    var rel = window.LANG_RELATED[p];
    if (rel && MULTILANG.supported(rel.to)) return { fill: MULTILANG.langById(rel.to).color, kind: 'related', lang: rel.to };
    return { fill: 'var(--wm-none)', kind: 'none' };
  }

  /* 이 나라에서 그 언어가 통하는가 — 범례 강조용 */
  function speaks(a2, lang) {
    return langsOf(a2).some(function (l) {
      if (l === lang) return true;
      var rel = window.LANG_RELATED[l];
      return rel && rel.to === lang;
    });
  }

  /* ---------- 보이는 영역 ---------- */

  function aspect() {
    var r = svg && svg.getBoundingClientRect();
    return r && r.width ? r.height / r.width : 0.62;
  }

  function fit(box, pad) {
    var a = aspect();
    pad = pad == null ? 0.15 : pad;
    var w = Math.max(box[2] - box[0], 60) * (1 + pad * 2);
    var h = Math.max(box[3] - box[1], 40) * (1 + pad * 2);
    if (h / w > a) w = h / a; else h = w * a;
    var cx = (box[0] + box[2]) / 2, cy = (box[1] + box[3]) / 2;
    setVB({ x: cx - w / 2, y: cy - h / 2, w: w, h: h });
  }

  function fitAll() {
    var a = aspect();
    var w = M().w, h = w * a;
    setVB({ x: 0, y: (M().h - h) / 2, w: w, h: h });
  }

  function setVB(v) {
    var maxW = M().w * 1.15, minW = 24;
    var a = aspect();
    if (v.w > maxW) { var s = maxW / v.w; v.x += v.w * (1 - s) / 2; v.y += v.h * (1 - s) / 2; v.w = maxW; v.h = maxW * a; }
    if (v.w < minW) { var s2 = minW / v.w; v.x -= (minW - v.w) / 2; v.y -= (v.h * s2 - v.h) / 2; v.w = minW; v.h = minW * a; }
    // 지도 바깥으로 너무 멀리 밀려나지 않게
    var W = M().w, H = M().h;
    v.x = Math.min(Math.max(v.x, -v.w * 0.5), W - v.w * 0.5);
    v.y = Math.min(Math.max(v.y, -v.h * 0.5), H - v.h * 0.5);
    vb = v;
    if (svg) svg.setAttribute('viewBox', [v.x, v.y, v.w, v.h].map(function (n) { return n.toFixed(1); }).join(' '));
    if (svg) svg.style.setProperty('--wm-stroke', (v.w / 1000 * 0.6).toFixed(3));
  }

  function zoomAt(factor, px, py) {
    var nw = vb.w / factor, nh = vb.h / factor;
    setVB({ x: px - (px - vb.x) * (nw / vb.w), y: py - (py - vb.y) * (nh / vb.h), w: nw, h: nh });
  }

  function toSvg(clientX, clientY) {
    var pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    var m = svg.getScreenCTM();
    return m ? pt.matrixTransform(m.inverse()) : { x: vb.x + vb.w / 2, y: vb.y + vb.h / 2 };
  }

  /* ---------- 손가락·마우스 ---------- */

  function attachGestures() {
    var pts = {}, start = null, pinch = null, moved = 0;

    svg.addEventListener('pointerdown', function (e) {
      svg.setPointerCapture(e.pointerId);
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pts);
      if (ids.length === 1) { start = { x: e.clientX, y: e.clientY, t: Date.now(), target: e.target }; moved = 0; }
      if (ids.length === 2) {
        var a = pts[ids[0]], b = pts[ids[1]];
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) };
        moved = 99;   // 두 손가락이면 탭이 아니다
      }
    });

    svg.addEventListener('pointermove', function (e) {
      if (!pts[e.pointerId]) return;
      var prev = pts[e.pointerId];
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pts);
      var rect = svg.getBoundingClientRect();

      if (ids.length === 1) {
        var dx = e.clientX - prev.x, dy = e.clientY - prev.y;
        moved += Math.abs(dx) + Math.abs(dy);
        if (moved > 6) setVB({ x: vb.x - dx * vb.w / rect.width, y: vb.y - dy * vb.h / rect.height, w: vb.w, h: vb.h });
      } else if (ids.length === 2 && pinch) {
        var a = pts[ids[0]], b = pts[ids[1]];
        var d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > 0 && pinch.d > 0) {
          var mid = toSvg((a.x + b.x) / 2, (a.y + b.y) / 2);
          zoomAt(d / pinch.d, mid.x, mid.y);
          pinch.d = d;
        }
      }
    });

    function end(e) {
      if (!pts[e.pointerId]) return;
      delete pts[e.pointerId];
      if (Object.keys(pts).length < 2) pinch = null;
      if (Object.keys(pts).length === 0 && start && moved <= 6 && Date.now() - start.t < 600) {
        var a2 = start.target && start.target.getAttribute && start.target.getAttribute('data-a2');
        if (a2) select(a2, { zoom: false });
      }
      if (Object.keys(pts).length === 0) start = null;
    }
    svg.addEventListener('pointerup', end);
    svg.addEventListener('pointercancel', end);

    svg.addEventListener('wheel', function (e) {
      e.preventDefault();
      var p = toSvg(e.clientX, e.clientY);
      zoomAt(e.deltaY < 0 ? 1.25 : 0.8, p.x, p.y);
    }, { passive: false });
  }

  /* ---------- 그리기 ---------- */

  function buildSvg() {
    svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'wm-svg');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', '언어별로 색칠한 세계 지도');

    var g = document.createElementNS(SVGNS, 'g');
    M().c.forEach(function (r) {
      var p = document.createElementNS(SVGNS, 'path');
      var c = colorOf(r[0]);
      p.setAttribute('d', r[3]);
      p.setAttribute('data-a2', r[0]);
      p.setAttribute('class', 'wm-c wm-' + c.kind);
      p.style.fill = c.fill;
      var t = document.createElementNS(SVGNS, 'title');
      t.textContent = r[1];
      p.appendChild(t);
      g.appendChild(p);
    });
    // 너무 작은 나라는 점으로
    M().dots.forEach(function (d) {
      var c = colorOf(d[0]);
      var dot = document.createElementNS(SVGNS, 'circle');
      dot.setAttribute('cx', d[3]); dot.setAttribute('cy', d[4]);
      dot.setAttribute('r', 2.6);
      dot.setAttribute('data-a2', d[0]);
      dot.setAttribute('class', 'wm-c wm-dot wm-' + c.kind);
      dot.style.fill = c.fill;
      var t = document.createElementNS(SVGNS, 'title');
      t.textContent = d[1];
      dot.appendChild(t);
      g.appendChild(dot);
    });
    svg.appendChild(g);
    attachGestures();
    return svg;
  }

  function refreshClasses() {
    if (!svg) return;
    svg.querySelectorAll('[data-a2]').forEach(function (n) {
      var a2 = n.getAttribute('data-a2');
      n.classList.toggle('sel', a2 === selected);
      n.classList.toggle('dim', !!highlight && !speaks(a2, highlight));
    });
  }

  /* ---------- 범례 ---------- */

  function legend() {
    // 지도에 실제로 칠해지는 언어만, 칠해진 나라 수가 많은 순으로
    var counts = {};
    M().c.concat(M().dots).forEach(function (r) {
      langsOf(r[0]).forEach(function (l) {
        var k = MULTILANG.supported(l) || l === 'en' ? l : (window.LANG_RELATED[l] ? window.LANG_RELATED[l].to : null);
        if (k) counts[k] = (counts[k] || 0) + 1;
      });
    });
    var ids = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });

    var wrap = el('<div class="wm-legend"></div>');
    ids.forEach(function (id) {
      var l = MULTILANG.langById(id);
      var b = el('<button class="wm-key' + (highlight === id ? ' on' : '') + '">' +
        '<i style="background:' + l.color + '"></i>' + esc(l.name) + ' <small>' + counts[id] + '</small></button>');
      b.onclick = function () {
        highlight = highlight === id ? '' : id;
        wrap.querySelectorAll('.wm-key').forEach(function (k) { k.classList.remove('on'); });
        if (highlight) b.classList.add('on');
        refreshClasses();
        if (highlight) UI.toast(l.name + '이(가) 통하는 곳만 밝게 보여준다. 한 번 더 누르면 해제.');
      };
      wrap.appendChild(b);
    });
    wrap.appendChild(el('<span class="wm-key static"><i class="none"></i>표현집에 없는 언어</span>'));
    return wrap;
  }

  /* ---------- 나라 패널 ---------- */

  function select(a2, opts) {
    opts = opts || {};
    selected = a2;
    var ls = langsOf(a2);
    // 패널에서 먼저 펼칠 언어 — 배울 거리가 있는 첫 언어
    // 나라의 주 언어 순서를 지킨다 — 말레이시아는 중국어가 아니라 말레이어(→인도네시아어)가 먼저다
    activeLang = ls.find(function (l) { return l === 'en' || MULTILANG.supported(l) || window.LANG_RELATED[l]; }) || ls[0] || '';
    refreshClasses();
    if (opts.zoom) { var c = countryRow(a2); if (c) fit(c.box, 0.6); }
    renderPanel();
    if (opts.scroll !== false && panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function statusOf(l) {
    if (l === 'ko') return '모국어';
    if (l === 'en') return '영어 회화';
    if (MULTILANG.supported(l)) {
      var lang = MULTILANG.langById(l);
      return MULTILANG.itemsIn(l).length + '문장' + (lang.tier === 'basic' ? ' · 기본' : '');
    }
    if (window.LANG_RELATED[l]) return '비슷한 말로';
    return 'AI 번역';
  }

  function renderPanel() {
    if (!panel) return;
    panel.innerHTML = '';
    if (!selected) {
      panel.appendChild(el('<p class="hint wm-empty">나라를 눌러보자. 그 나라 말로 된 표현이 여기에 열린다.</p>'));
      return;
    }
    var c = countryRow(selected) || { ko: selected, en: '' };
    var ls = langsOf(selected);
    var note = window.COUNTRY_NOTES[selected];

    var head = el(
      '<div class="wm-head">' +
        '<span class="wm-flag">' + flagOf(selected) + '</span>' +
        '<div><h3>' + esc(c.ko) + '</h3><p class="hint">' + esc(c.en) + '</p></div>' +
      '</div>'
    );
    panel.appendChild(head);
    if (note) panel.appendChild(el('<p class="wm-note">' + esc(note) + '</p>'));

    var chips = el('<div class="wm-langs"></div>');
    ls.forEach(function (l) {
      var info = MULTILANG.langById(l);
      var col = l === 'ko' ? 'var(--accent)' : (info.color || (window.LANG_RELATED[l] && MULTILANG.langById(window.LANG_RELATED[l].to).color) || 'var(--wm-none)');
      var b = el('<button class="chip' + (l === activeLang ? ' on' : '') + '"><i class="wm-sw" style="background:' + col + '"></i>' +
        esc(l === 'ko' ? '한국어' : info.name) + ' <small>' + esc(statusOf(l)) + '</small></button>');
      b.onclick = function () { activeLang = l; renderPanel(); };
      chips.appendChild(b);
    });
    panel.appendChild(chips);

    panel.appendChild(langBody(activeLang));
  }

  function langBody(l) {
    var box = el('<div class="wm-body"></div>');
    var name = l === 'ko' ? '한국어' : MULTILANG.langName(l);

    if (l === 'ko') {
      box.appendChild(el('<p class="hint">우리말을 세계 말로 옮기는 건 번역 화면에서 한다.</p>'));
      box.appendChild(goTranslate('', '우리말 → 세계 말로 번역하기'));
      return box;
    }

    if (l === 'en') {
      box.appendChild(el('<p class="hint">영어권이다. 회화 모드에 있는 표현이 그대로 통한다. 생존 표현만 모아 보여준다.</p>'));
      MULTI.items.filter(function (it) { return it.cat === 'survival' || it.cat === 'travel'; }).slice(0, 14).forEach(function (it) {
        var r = el('<div class="wm-item"><div class="ml-row"><div class="ml-lang"><span class="ml-flag">🇬🇧</span><span class="ml-name">영어</span></div>' +
          '<div class="ml-body"><p class="ml-native">' + esc(UI.en(it.en)) + '</p><p class="ml-kr">' + esc(it.ko) + '</p></div>' +
          '<button class="mini ml-play">🔊</button></div></div>');
        r.querySelector('.ml-play').onclick = function () { Speech.speak(UI.en(it.en)); };
        box.appendChild(r);
      });
      var toHome = el('<button class="btn wide">영어 회화 모드로</button>');
      toHome.onclick = function () { App.go({ name: 'home' }); };
      box.appendChild(toHome);
      return box;
    }

    // 표현집에 없는 언어 — 비슷한 언어가 있으면 그쪽으로, 없으면 AI 번역으로
    var useLang = l;
    if (!MULTILANG.supported(l)) {
      var rel = window.LANG_RELATED[l];
      if (rel && MULTILANG.supported(rel.to)) {
        box.appendChild(el('<p class="wm-note">' + esc(rel.why) + '</p>'));
        useLang = rel.to;
      } else {
        box.appendChild(el('<p class="hint">' + esc(name) + '는 표현집에 아직 없다. 하고 싶은 말을 우리말로 쓰면 AI가 ' +
          esc(name) + '로 옮기고 한글 발음까지 붙여준다. 저장하면 이 나라를 누를 때마다 여기 나온다.</p>'));
        var mine = MULTILANG.itemsIn(l);
        if (mine.length) {
          box.appendChild(el('<h4 class="wm-sub">내 문장 · ' + mine.length + '</h4>'));
          mine.forEach(function (it) { box.appendChild(itemRow(it, MULTILANG.langById(l))); });
        }
        box.appendChild(goTranslate(l, name + '로 하고 싶은 말 번역하기'));
        return box;
      }
    }

    var lang = MULTILANG.langById(useLang);
    if (lang.about) box.appendChild(el('<p class="hint">' + esc(lang.about) + '</p>'));

    var items = MULTILANG.itemsIn(useLang);
    var groups = [{ id: 'mine', title: '내 문장' }].concat(MULTI.cats);
    groups.forEach(function (g, gi) {
      var list = items.filter(function (it) { return it.cat === g.id; });
      if (!list.length) return;
      // 내 문장과 생존 표현은 펼쳐두고, 나머지는 접어둔다
      var open = g.id === 'mine' || g.id === 'survival';
      var d = el('<details class="wm-group"' + (open ? ' open' : '') + '><summary>' + esc(g.title) + ' <small>' + list.length + '</small></summary></details>');
      list.forEach(function (it) { d.appendChild(itemRow(it, lang)); });
      box.appendChild(d);
    });

    var more = el('<div class="grade-row"></div>');
    var book = el('<button class="btn">표현집에서 크게 보기</button>');
    book.onclick = function () {
      var m = Store.state.settings.multi || (Store.state.settings.multi = {});
      m.focus = useLang; Store.save();
      App.go({ name: 'phrasebook' });
    };
    more.appendChild(book);
    more.appendChild(goTranslate(useLang, '내 말 번역하기', true));
    box.appendChild(more);
    return box;
  }

  function itemRow(it, lang) {
    var w = el('<div class="wm-item"><p class="wm-ko">' + esc(it.ko) + ' <span>· ' + esc(UI.en(it.en)) + '</span></p></div>');
    var r = MULTILANG.row(it, lang);
    if (r) w.appendChild(r);
    return w;
  }

  function goTranslate(lang, label, inline) {
    var b = el('<button class="btn' + (inline ? '' : ' primary wide') + '">' + esc(label) + '</button>');
    b.onclick = function () { TRANSLATE.preset(lang); App.go({ name: 'translate' }); };
    return b;
  }

  /* ---------- 화면 ---------- */

  function view() {
    var wrap = el('<div class="view wm-view"></div>');
    wrap.appendChild(App.topbar('세계 지도', function () { App.go({ name: 'home' }); }));
    wrap.appendChild(el('<p class="lead">언어별로 색을 칠했다. 나라를 누르면 그 나라 말로 표현이 열린다. ' +
      '끌어서 이동, 두 손가락이나 휠로 확대.</p>'));

    // 나라 찾기 — 작은 나라는 지도에서 누르기 어렵다
    var search = el('<div class="wm-search"><input type="search" placeholder="나라 이름으로 찾기 (예: 리투아니아, 페루)" aria-label="나라 찾기"><div class="wm-results"></div></div>');
    var input = search.querySelector('input'), results = search.querySelector('.wm-results');
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      results.innerHTML = '';
      if (!q) return;
      M().c.concat(M().dots.map(function (d) { return [d[0], d[1], d[2]]; }))
        .filter(function (r) { return r[1].toLowerCase().indexOf(q) >= 0 || (r[2] || '').toLowerCase().indexOf(q) >= 0; })
        .slice(0, 8)
        .forEach(function (r) {
          var b = el('<button class="chip">' + flagOf(r[0]) + ' ' + esc(r[1]) + '</button>');
          b.onclick = function () { results.innerHTML = ''; input.value = ''; select(r[0], { zoom: true }); };
          results.appendChild(b);
        });
    });
    wrap.appendChild(search);

    var regions = el('<div class="wm-regions"></div>');
    REGION_NAMES.forEach(function (rn) {
      var b = el('<button class="chip">' + esc(rn[1]) + '</button>');
      b.onclick = function () {
        if (rn[0] === 'all') fitAll();
        else { var r = M().regions[rn[0]]; fit([r[0], r[1], r[0] + r[2], r[1] + r[3]], 0.02); }
      };
      regions.appendChild(b);
    });
    wrap.appendChild(regions);

    var stage = el('<div class="wm-stage"></div>');
    stage.appendChild(buildSvg());
    var zoom = el('<div class="wm-zoom"><button aria-label="확대">＋</button><button aria-label="축소">－</button><button aria-label="한국으로">🇰🇷</button></div>');
    zoom.children[0].onclick = function () { zoomAt(1.6, vb.x + vb.w / 2, vb.y + vb.h / 2); };
    zoom.children[1].onclick = function () { zoomAt(1 / 1.6, vb.x + vb.w / 2, vb.y + vb.h / 2); };
    zoom.children[2].onclick = function () { var r = countryRow('KR'); fit([r.box[0] - 60, r.box[1] - 40, r.box[2] + 60, r.box[3] + 40], 0.3); };
    stage.appendChild(zoom);
    wrap.appendChild(stage);

    wrap.appendChild(legend());

    panel = el('<section class="card wm-panel"></section>');
    wrap.appendChild(panel);

    // 화면에 붙은 뒤에야 크기를 알 수 있다 — 그때 보이는 영역을 맞춘다
    requestAnimationFrame(function () {
      if (vb) setVB({ x: vb.x, y: vb.y, w: vb.w, h: vb.w * aspect() }); else fitAll();
      // 다른 화면에서 open(나라)로 들어왔으면 그 나라를 골라 확대해 둔다
      if (selected && !activeLang) select(selected, { zoom: true, scroll: false });
      else { refreshClasses(); renderPanel(); }
    });
    return wrap;
  }

  /* 다른 화면에서 특정 나라를 열고 싶을 때 */
  function open(a2) { selected = a2; activeLang = ''; vb = null; }

  return { view: view, open: open, colorOf: colorOf, select: select, _state: function () { return { vb: vb, selected: selected, activeLang: activeLang, highlight: highlight }; } };
})();
