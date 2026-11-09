/* 우리말 번역 — 우리말 한 문장을 영어와 여러 언어로 한 번에.
 *
 * 순서
 *   1. 표현집에서 비슷한 우리말 문장을 먼저 찾는다 — 오프라인, 즉시, 검증된 문장.
 *   2. Claude API 키가 있으면 AI가 번역·한글 발음·메모를 한 번에 만든다.
 *   3. 키가 없고 데스크톱 크롬이면 브라우저 내장 번역으로 번역만.
 * 마음에 들면 "내 문장"에 저장한다 — 표현집, 지도, 복습 카드에 함께 들어간다. */
window.TRANSLATE = (function () {
  'use strict';

  var el = UI.el, esc = UI.esc;

  var DEFAULT_LANGS = ['ja', 'zh', 'fr', 'de', 'es', 'ru', 'ar', 'hi', 'pt', 'it', 'vi', 'th', 'id', 'tr', 'fil'];
  var EXAMPLES = ['화장실이 어디예요?', '이 영화 어떻게 보셨어요?', '물 좀 주시겠어요?', '다음에 또 만나요.', '사진 한 장 찍어주실 수 있나요?'];

  var draft = '';
  var tone = 'polite';
  var last = null;        // 마지막 결과 — 화면을 나갔다 와도 남겨둔다
  var busy = false;

  function conf() {
    var s = Store.state.settings;
    var t = s.translate || (s.translate = {});
    if (!Array.isArray(t.langs) || !t.langs.length) t.langs = DEFAULT_LANGS.slice();
    if (!Array.isArray(t.custom)) t.custom = [];
    return t;
  }

  /* 지도에서 "이 나라 말로 번역하기"를 누르면 그 언어를 골라둔 채로 연다 */
  function preset(lang) {
    if (!lang || lang === 'ko') return;
    var t = conf();
    if (!MULTILANG.supported(lang) && lang !== 'en' && t.custom.indexOf(lang) < 0) t.custom.push(lang);
    if (t.langs.indexOf(lang) < 0) t.langs.unshift(lang);
    t.focus = lang;
    Store.save();
  }

  /* ---------- 표현집에서 비슷한 우리말 찾기 ---------- */

  function koNorm(s) {
    return (s || '').replace(/\([^)]*\)/g, '').replace(/[^가-힣a-zA-Z0-9]/g, '');
  }
  function bigrams(s) {
    var out = {};
    for (var i = 0; i < s.length - 1; i++) out[s.slice(i, i + 2)] = 1;
    if (s.length === 1) out[s] = 1;
    return out;
  }
  function similar(q) {
    var a = koNorm(q);
    if (a.length < 2) return [];
    var A = bigrams(a);
    return MULTILANG.allItems()
      .map(function (it) {
        var b = koNorm(it.ko);
        if (!b) return null;
        var B = bigrams(b), inter = 0, union = 0, k;
        for (k in A) { union++; if (B[k]) inter++; }
        for (k in B) if (!A[k]) union++;
        var score = union ? inter / union : 0;
        if (b.indexOf(a) >= 0 || a.indexOf(b) >= 0) score += 0.3;
        return { it: it, score: score };
      })
      .filter(function (x) { return x && x.score >= 0.34; })
      .sort(function (x, y) { return y.score - x.score; })
      .slice(0, 3);
  }

  /* ---------- 언어 이름 찾기 (다른 언어 추가) ---------- */

  var EXTRA_CODES = ['nl', 'pl', 'sv', 'no', 'da', 'fi', 'el', 'cs', 'sk', 'hu', 'ro', 'bg', 'uk', 'he', 'mn', 'km', 'lo', 'my',
    'ms', 'ne', 'si', 'ta', 'te', 'mr', 'gu', 'pa', 'ka', 'hy', 'az', 'kk', 'uz', 'am', 'so', 'yo', 'ha', 'zu', 'af',
    'mi', 'haw', 'ga', 'cy', 'is', 'et', 'lv', 'sr', 'hr', 'sl', 'sq', 'mk', 'eu', 'ca', 'gl', 'la', 'eo', 'yue'];

  function codeFor(name) {
    var q = name.trim().replace(/\s/g, '');
    if (!q) return null;
    var codes = EXTRA_CODES.concat(Object.keys(window.COUNTRY_LANGS || {}).reduce(function (acc, k) {
      return acc.concat(window.COUNTRY_LANGS[k]);
    }, [])).concat(MULTI.langs.map(function (l) { return l.id; }));
    var seen = {};
    for (var i = 0; i < codes.length; i++) {
      var c = codes[i];
      if (seen[c]) continue;
      seen[c] = 1;
      var n = MULTILANG.langName(c).replace(/\s/g, '');
      if (n === q || n === q + '어' || n.replace(/어$/, '') === q || c === q.toLowerCase()) return c;
    }
    return null;
  }

  /* ---------- 화면 ---------- */

  function view() {
    var t = conf();
    var wrap = el('<div class="view tr-view"></div>');
    wrap.appendChild(App.topbar('우리말 번역', function () { App.go({ name: 'home' }); }));
    wrap.appendChild(el('<p class="lead">하고 싶은 말을 우리말로 쓰면, 원어민이 실제로 하는 말로 한 번에 옮긴다. ' +
      '영어가 먼저, 그다음 고른 언어들. 한글 발음과 꼭 알아둘 메모까지.</p>'));

    var form = el('<section class="card tr-form"></section>');
    var ta = el('<textarea class="tr-input" rows="3" placeholder="예: 이 영화 어떻게 보셨어요?"></textarea>');
    ta.value = draft;
    ta.addEventListener('input', function () { draft = ta.value; go.disabled = !draft.trim() || busy; });
    form.appendChild(ta);

    var ex = el('<div class="tr-examples"></div>');
    EXAMPLES.forEach(function (s) {
      var b = el('<button class="chip">' + esc(s) + '</button>');
      b.onclick = function () { draft = s; ta.value = s; go.disabled = busy; ta.focus(); };
      ex.appendChild(b);
    });
    form.appendChild(ex);

    var toneRow = el('<div class="tr-tone"><span>말투</span></div>');
    [['polite', '존댓말'], ['casual', '반말']].forEach(function (o) {
      var b = el('<button class="chip' + (tone === o[0] ? ' on' : '') + '">' + o[1] + '</button>');
      b.onclick = function () { tone = o[0]; toneRow.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on'); };
      toneRow.appendChild(b);
    });
    form.appendChild(toneRow);

    // 옮길 언어
    var langBox = el('<details class="tr-langs"' + (t.focus ? ' open' : '') + '><summary>옮길 언어 <b class="tr-count"></b></summary><div class="tr-chips"></div>' +
      '<div class="tr-add"><input type="text" placeholder="다른 언어 추가 (예: 폴란드어, 네덜란드어)"><button class="btn">추가</button></div></details>');
    var chips = langBox.querySelector('.tr-chips');
    function drawChips() {
      chips.innerHTML = '';
      var ids = MULTI.langs.map(function (l) { return l.id; }).concat(t.custom);
      ids.forEach(function (id) {
        var l = MULTILANG.langById(id);
        var on = t.langs.indexOf(id) >= 0;
        var b = el('<button class="chip' + (on ? ' on' : '') + (l.custom ? ' custom' : '') + '">' + l.flag + ' ' + esc(l.name) + '</button>');
        b.onclick = function () {
          var at = t.langs.indexOf(id);
          if (at >= 0) t.langs.splice(at, 1); else t.langs.push(id);
          Store.save();
          drawChips();
        };
        chips.appendChild(b);
      });
      langBox.querySelector('.tr-count').textContent = '영어 + ' + t.langs.length + '개';
    }
    drawChips();
    var addIn = langBox.querySelector('.tr-add input');
    langBox.querySelector('.tr-add button').onclick = function () {
      var code = codeFor(addIn.value);
      if (!code) { UI.toast('그 언어를 찾지 못했다. "폴란드어"처럼 한국어 이름으로 써보자.'); return; }
      if (!MULTILANG.supported(code) && t.custom.indexOf(code) < 0) t.custom.push(code);
      if (t.langs.indexOf(code) < 0) t.langs.push(code);
      Store.save();
      addIn.value = '';
      drawChips();
      UI.toast(MULTILANG.langName(code) + '를 추가했다.');
    };
    form.appendChild(langBox);

    var go = el('<button class="btn primary wide">번역하기</button>');
    go.disabled = !draft.trim() || busy;
    form.appendChild(go);

    // 키 상태 안내
    if (!AI.hasKey()) {
      var keyHint = el('<div class="tr-keyhint"><p>AI 번역은 Claude API 키가 있어야 켜진다. 키는 이 기기 안에만 저장된다. ' +
        '키가 없어도 표현집에 있는 문장은 바로 찾아준다.</p></div>');
      var openSet = el('<button class="btn">설정에서 키 넣기</button>');
      openSet.onclick = function () { App.openSettings('ai'); };
      keyHint.appendChild(openSet);
      form.appendChild(keyHint);
    }
    wrap.appendChild(form);

    var out = el('<div class="tr-out"></div>');
    wrap.appendChild(out);
    if (last) renderResult(out, last);

    go.onclick = function () { run(out, go); };
    return wrap;
  }

  function targetsNow() {
    var t = conf();
    return t.langs.filter(function (id) { return id !== 'en' && id !== 'ko'; }).map(function (id) {
      var en = id;
      try { en = new Intl.DisplayNames(['en'], { type: 'language' }).of(id === 'fil' ? 'fil' : id) || id; } catch (e) { /* 이름을 못 얻어도 코드로 보낸다 */ }
      return { id: id, en: en };
    });
  }

  function run(out, btn) {
    var ko = draft.trim();
    if (!ko || busy) return;
    var targets = targetsNow();
    last = { ko: ko, tone: tone, matches: similar(ko), ai: null, error: '', pending: true };
    renderResult(out, last);

    if (!AI.hasKey()) {
      last.pending = false;
      last.error = AI.hasBuiltin() ? 'builtin' : 'nokey';
      renderResult(out, last);
      return;
    }

    busy = true; btn.disabled = true; btn.textContent = '번역하는 중… (10~30초)';
    AI.translate(ko, tone, targets).then(function (r) {
      last.ai = r;
    }, function (e) {
      last.error = e.message || String(e);
    }).then(function () {
      busy = false;
      last.pending = false;
      // 기다리는 동안 다른 화면에 다녀왔으면 지금 보이는 번역 화면에 그린다
      var curOut = document.querySelector('.tr-out');
      var curBtn = document.querySelector('.tr-form .btn.primary');
      if (curBtn) { curBtn.disabled = !draft.trim(); curBtn.textContent = '번역하기'; }
      if (curOut) renderResult(curOut, last);
    });
  }

  function aiItem(r) {
    var it = { en: r.english, ko: last.ko, note: {} };
    r.items.forEach(function (x) {
      if (!x.text) return;
      it[x.lang] = [x.text, x.rom || '', x.kr || ''];
      if (x.note) it.note[x.lang] = x.note;
    });
    return it;
  }

  function renderResult(out, st) {
    out.innerHTML = '';

    // 1. 표현집에서 찾은 비슷한 문장
    if (st.matches && st.matches.length) {
      var sec = el('<section class="tr-sec"><h3 class="sec-title spaced">표현집에 비슷한 문장이 있다</h3></section>');
      st.matches.forEach(function (m) {
        var c = el('<div class="card ml-card"><div class="ml-head"><div><p class="ml-en">' + esc(UI.en(m.it.en)) + '</p>' +
          '<p class="ml-ko">' + esc(m.it.ko) + '</p></div><button class="mini">🔊 EN</button></div></div>');
        c.querySelector('.mini').onclick = function () { Speech.speak(UI.en(m.it.en)); };
        var d = MULTILANG.fold(m.it, conf().langs.map(MULTILANG.langById));
        if (d) c.appendChild(d);
        sec.appendChild(c);
      });
      out.appendChild(sec);
    }

    // 2. AI 결과
    if (st.pending) {
      out.appendChild(el('<div class="card tr-wait"><span class="tr-spin"></span> ' +
        (AI.hasKey() ? '원어민 표현으로 옮기는 중이다. 언어가 많으면 30초쯤 걸린다.' : '표현집을 찾는 중…') + '</div>'));
      return;
    }

    if (st.error === 'nokey' || st.error === 'builtin') {
      var box = el('<div class="card tr-keyhint"><p>' +
        (st.matches && st.matches.length ? '위 문장이 가장 가까운 표현집 문장이다. ' : '표현집에는 비슷한 문장이 없다. ') +
        '새 문장을 번역하려면 설정에 Claude API 키를 넣자.</p></div>');
      var k = el('<button class="btn">설정에서 키 넣기</button>');
      k.onclick = function () { App.openSettings('ai'); };
      box.appendChild(k);
      if (st.error === 'builtin') {
        var b = el('<button class="btn">이 브라우저 내장 번역으로 (발음 없이)</button>');
        b.onclick = function () {
          b.disabled = true; b.textContent = '번역하는 중…';
          AI.builtinTranslate(st.ko, [{ id: 'en' }].concat(targetsNow())).then(function (r) {
            st.ai = r; st.error = ''; renderResult(out, st);
          }, function (e) { UI.toast(e.message); b.disabled = false; });
        };
        box.appendChild(b);
      }
      out.appendChild(box);
      return;
    }

    if (st.error) {
      out.appendChild(el('<div class="card tr-error"><p>' + esc(st.error) + '</p></div>'));
      return;
    }

    if (!st.ai) return;
    var r = st.ai;
    var item = aiItem(r);

    var res = el('<section class="tr-sec"><h3 class="sec-title spaced">' + (r.builtin ? '브라우저 내장 번역' : 'AI 번역') + '</h3></section>');
    var card = el('<div class="card ml-card tr-card">' +
      '<p class="ml-ko">' + esc(st.ko) + '</p>' +
      '<div class="tr-en"><p class="ml-en">' + esc(r.english || '—') + '</p><button class="mini">🔊 EN</button></div>' +
      '<div class="ml-list"></div></div>');
    card.querySelector('.tr-en .mini').onclick = function () { Speech.speak(r.english); };
    var list = card.querySelector('.ml-list');
    r.items.forEach(function (x) {
      var lang = MULTILANG.langById(x.lang);
      if (!x.text) {
        list.appendChild(el('<div class="ml-row missing"><div class="ml-lang"><span class="ml-flag">' + lang.flag + '</span><span class="ml-name">' + esc(lang.name) + '</span></div>' +
          '<div class="ml-body"><p class="hint">이 언어는 번역을 받지 못했다.</p></div></div>'));
        return;
      }
      var row = MULTILANG.row(item, lang);
      if (row) list.appendChild(row);
    });
    res.appendChild(card);

    if (!r.builtin) {
      var acts = el('<div class="grade-row"></div>');
      var save = el('<button class="btn primary">내 문장에 저장</button>');
      var again = el('<button class="btn">다시 번역</button>');
      save.onclick = function () {
        MULTILANG.savePhrase({
          ko: st.ko, en: r.english,
          items: r.items.map(function (x) {
            return { lang: x.lang, text: x.text, rom: x.rom, kr: x.kr, note: x.note, custom: !MULTILANG.supported(x.lang), customName: MULTILANG.langName(x.lang) };
          })
        });
        App.refreshPacks();
        save.disabled = true; save.textContent = '저장했다 ✓';
        UI.toast('내 문장에 저장했다. 표현집·지도·복습 카드에 함께 들어간다.');
      };
      again.onclick = function () { draft = st.ko; App.go({}); setTimeout(function () { var b = document.querySelector('.tr-form .btn.primary'); if (b) b.click(); }, 50); };
      acts.appendChild(save); acts.appendChild(again);
      res.appendChild(acts);
      res.appendChild(el('<p class="note">' + esc(r.model || '') + ' · AI 번역도 가끔 어긋난다. 중요한 자리에서 쓸 문장은 🔊로 듣고 한글 발음과 함께 두세 번 소리 내 보자.</p>'));
    }
    out.appendChild(res);
  }

  return { view: view, preset: preset, _similar: similar, _codeFor: codeFor, _reset: function () { last = null; draft = ''; busy = false; } };
})();
