/* 세계 표현집 — 찾기, 접이식 칸, 표현집 화면, 그리고 "내 문장".
 *
 * 영어 카드나 대사의 문장이 표현집(js/data/multi.js + multi-world.js)에 있으면
 * 그 자리에 "🌐 N개 국어" 접이식 칸이 붙는다. 기본은 접혀 있다 —
 * 영어 학습의 흐름을 끊지 않고, 궁금할 때만 펼쳐보게 하기 위해서다.
 *
 * "내 문장"은 우리말 번역에서 저장한 문장이다. 표현집 문장과 같은 모양으로 다뤄서
 * 지도, 표현집, 카드 어디서든 똑같이 보이게 한다. */
window.MULTILANG = (function () {
  'use strict';

  var el = UI.el, esc = UI.esc;

  /* 문장부호·말줄임·대시·따옴표 차이는 무시하고 찾는다 */
  function norm(s) {
    return (s || '')
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/[^a-z0-9'\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* ---------- 내 문장 ---------- */

  function myPhrases() {
    if (!Array.isArray(Store.state.myPhrases)) Store.state.myPhrases = [];
    return Store.state.myPhrases;
  }

  /* 저장된 형태 { id, ko, en, t:{lang:[원문,로마자,한글]}, note:{lang:메모} } 를
   * 표현집 항목과 같은 모양으로 바꾼다 */
  function asItem(p) {
    // 'id'는 인도네시아어 코드라서 문장 번호는 pid에 둔다
    var it = { en: p.en || p.ko, ko: p.ko, cat: 'mine', mine: true, pid: p.id, note: p.note || {} };
    Object.keys(p.t || {}).forEach(function (k) { it[k] = p.t[k]; });
    return it;
  }

  function allItems() {
    return myPhrases().map(asItem).concat((window.MULTI && MULTI.items) || []);
  }

  var index = null;
  function buildIndex() {
    index = {};
    // 표현집 문장을 나중에 넣어서, 같은 영어 문장이면 검증된 표현집 쪽이 이긴다
    allItems().forEach(function (it) { if (it.en) index[norm(it.en)] = it; });
  }
  function invalidate() { index = null; }

  function find(en) {
    if (!index) buildIndex();
    return index[norm(en)] || null;
  }

  /* 대사 속에 박혀 있는 표현을 찾는다.
   * "Fingers crossed. You've put a lot into it." → "Fingers crossed."
   * 두 단어 이상인 표현만 본다. "Help!" 같은 한 단어는 엉뚱한 문장에 걸리기 쉽다.
   * 여러 개가 걸리면 가장 긴 것을 고른다 — 더 구체적인 쪽이 맞을 확률이 높다. */
  function findIn(text) {
    var exact = find(text);
    if (exact) return exact;
    var hay = ' ' + norm(text) + ' ';
    var best = null, bestLen = 0;
    ((window.MULTI && MULTI.items) || []).forEach(function (it) {
      var needle = norm(it.en);
      if (needle.split(' ').length < 2) return;
      if (hay.indexOf(' ' + needle + ' ') >= 0 && needle.length > bestLen) {
        best = it; bestLen = needle.length;
      }
    });
    return best;
  }

  function savePhrase(p) {
    var list = myPhrases();
    var item = {
      id: 'p' + Date.now().toString(36),
      ko: p.ko, en: p.en, t: {}, note: {}, at: Store.today()
    };
    (p.items || []).forEach(function (x) {
      if (!x.text) return;
      item.t[x.lang] = [x.text, x.rom || '', x.kr || ''];
      if (x.note) item.note[x.lang] = x.note;
      if (x.custom) { item.custom = item.custom || {}; item.custom[x.lang] = x.customName || x.lang; }
    });
    list.unshift(item);
    Store.save();
    invalidate();
    return item;
  }

  function removePhrase(id) {
    Store.state.myPhrases = myPhrases().filter(function (p) { return p.id !== id; });
    // 이 문장의 복습 카드 기록도 함께 지운다
    Object.keys(Store.state.cards).forEach(function (k) {
      if (k.indexOf('myphr/myphr-' + id + '/') === 0) delete Store.state.cards[k];
    });
    Store.save();
    invalidate();
  }

  /* ---------- 언어 ---------- */

  var NAMES = { en: '영어', ko: '한국어' };
  var dn = null;
  try { dn = new Intl.DisplayNames(['ko'], { type: 'language' }); } catch (e) { dn = null; }

  function langName(id) {
    var l = MULTI.langs.find(function (x) { return x.id === id; });
    if (l) return l.name;
    if (NAMES[id]) return NAMES[id];
    try { return (dn && dn.of(id)) || id; } catch (e) { return id; }
  }

  /* 표현집에 없는 언어도 이름과 음성 태그를 가진 언어로 다룬다 */
  function langById(id) {
    var l = MULTI.langs.find(function (x) { return x.id === id; });
    if (l) return l;
    if (id === 'en') return { id: 'en', name: '영어', flag: '🇬🇧', tts: 'en-US', color: 'hsl(222,85%,64%)', builtin: true };
    return { id: id, name: langName(id), flag: '🌐', tts: id, custom: true };
  }

  function supported(id) { return MULTI.langs.some(function (l) { return l.id === id; }); }

  /* 처음 7개 언어로 저장돼 있던 설정에 새 언어를 얹어준다 (한 번만) */
  function settings() {
    var s = Store.state.settings;
    var m = s.multi || (s.multi = {});
    var all = MULTI.langs.map(function (l) { return l.id; });
    if (m.langsV !== 2) {
      var cur = Array.isArray(m.langs) && m.langs.length ? m.langs : [];
      all.forEach(function (id) { if (cur.indexOf(id) < 0) cur.push(id); });
      m.langs = all.filter(function (id) { return cur.indexOf(id) >= 0; });
      m.langsV = 2;
      Store.save();
    }
    return {
      on: m.on !== false,
      langs: Array.isArray(m.langs) && m.langs.length ? m.langs : all,
      focus: m.focus || ''
    };
  }

  /* ---------- 한 언어 한 줄 ---------- */

  function row(item, lang, big) {
    var t = item[lang.id];
    if (!t) return null;
    var note = item.note && item.note[lang.id];
    var r = el(
      '<div class="ml-row' + (big ? ' big' : '') + '">' +
        '<div class="ml-lang"><span class="ml-flag">' + lang.flag + '</span><span class="ml-name">' + esc(lang.name) + '</span></div>' +
        '<div class="ml-body">' +
          '<p class="ml-native" lang="' + esc(lang.tts) + '"' + (lang.rtl ? ' dir="rtl"' : '') + '>' + esc(t[0]) + '</p>' +
          // 한글 발음이 가장 쓸모 있으므로 따로 한 줄, 로마자는 그 아래 작게
          (t[2] ? '<p class="ml-kr">' + esc(t[2]) + '</p>' : '') +
          (t[1] ? '<p class="ml-read">' + esc(t[1]) + '</p>' : '') +
          (note ? '<p class="ml-note">' + esc(note) + '</p>' : '') +
        '</div>' +
        (lang.noTts ? '<span class="ml-nov" title="기기 음성이 거의 없는 언어">🔇</span>'
                    : '<button class="mini ml-play" aria-label="' + esc(lang.name) + '로 듣기">🔊</button>') +
      '</div>'
    );
    var btn = r.querySelector('.ml-play');
    if (btn) btn.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      play(t[0], lang);
    };
    return r;
  }

  function play(text, lang) {
    if (lang.id === 'en') { Speech.speak(text); return; }
    Speech.speakIn(text, lang.tts).then(function (res) {
      if (res === 'no-voice' || res === 'error') {
        // 목소리 목록이 비어 있는 기기는 일단 읽어보고, 실패하면 여기로 온다
        UI.toast('이 기기에 ' + lang.name + ' 음성이 없다. 휴대폰 설정 › 텍스트 음성 변환에서 추가하면 들린다.');
      } else if (res === 'unsupported') {
        UI.toast('이 브라우저는 음성 재생을 지원하지 않는다.');
      }
    });
  }

  /* 카드·대사에 붙는 접이식 칸. 해당 문장이 표현집에 없거나 기능이 꺼져 있으면 null.
   * loose: 대사처럼 긴 문장 안에서 표현을 찾아 붙일 때. 이때는 어떤 표현인지 제목에 밝힌다. */
  function block(en, opts) {
    opts = opts || {};
    var s = settings();
    if (!s.on) return null;
    var item = opts.loose ? findIn(en) : find(en);
    if (!item) return null;
    return fold(item, s.langs.map(langById), opts.loose && norm(item.en) !== norm(en) ? item.en : null);
  }

  function fold(item, langs, label) {
    langs = langs.filter(function (l) { return l && item[l.id]; });
    if (!langs.length) return null;
    var d = el(
      '<details class="ml-fold">' +
        '<summary>🌐 ' + (label ? '<b>' + esc(UI.en(label)) + '</b> ' : '') + langs.length + '개 국어로 <span class="ml-flags">' +
          langs.slice(0, 12).map(function (l) { return l.flag; }).join('') + (langs.length > 12 ? '…' : '') + '</span></summary>' +
        '<div class="ml-list"></div>' +
      '</details>'
    );
    // 접이식 칸을 눌러도 카드가 넘어가거나 대사가 재생되지 않게 한다
    d.addEventListener('click', function (e) { e.stopPropagation(); });
    var list = d.querySelector('.ml-list');
    langs.forEach(function (l) { var r = row(item, l); if (r) list.appendChild(r); });
    return d;
  }

  /* 한 언어로 된 문장 목록 — 지도에서 나라를 눌렀을 때 쓴다 */
  function itemsIn(langId) {
    return allItems().filter(function (it) { return it[langId]; });
  }

  /* ============ 표현집 화면 ============ */

  function phrasebook() {
    var s = settings();
    var wrap = el('<div class="view"></div>');
    wrap.appendChild(App.topbar('세계 표현집', function () { App.go({ name: 'home' }); }));
    wrap.appendChild(el(
      '<p class="lead">영어가 중심이고, 이건 여행 가방에 넣어두는 비상용이다. ' + MULTI.langs.length + '개 언어. ' +
      '어느 나라에서든 바로 쓰이는 문장만 골랐고, 나라마다 다른 몸짓과 관습은 메모로 붙였다.</p>'
    ));

    var tools = el('<div class="grade-row ml-tools"></div>');
    var toMap = el('<button class="btn">🗺️ 지도에서 고르기</button>');
    var toTr = el('<button class="btn">🇰🇷 우리말로 번역</button>');
    toMap.onclick = function () { App.go({ name: 'worldmap' }); };
    toTr.onclick = function () { App.go({ name: 'translate' }); };
    tools.appendChild(toMap); tools.appendChild(toTr);
    wrap.appendChild(tools);

    // 한 언어에 집중하기 — "이번 여행은 스페인어만"
    var focusRow = el('<div class="ml-focus"></div>');
    var allChip = el('<button class="chip' + (!s.focus ? ' on' : '') + '">전체 보기</button>');
    allChip.onclick = function () { setFocus(''); };
    focusRow.appendChild(allChip);
    MULTI.langs.forEach(function (l) {
      var c = el('<button class="chip' + (s.focus === l.id ? ' on' : '') + (l.tier === 'basic' ? ' basic' : '') + '">' +
        l.flag + ' ' + esc(l.name) + '</button>');
      c.onclick = function () { setFocus(l.id); };
      focusRow.appendChild(c);
    });
    wrap.appendChild(focusRow);

    var focusLang = s.focus ? langById(s.focus) : null;
    if (focusLang && focusLang.custom) focusLang = null;
    if (focusLang) {
      var voiceOk = focusLang.noTts ? false : Speech.hasVoiceFor(focusLang.tts);   // true / false / null(아직 모름)
      var n = itemsIn(focusLang.id).length;
      wrap.appendChild(el('<div class="card ml-about">' +
        '<p><b>' + focusLang.flag + ' ' + esc(focusLang.name) + '</b> · ' + n + '문장' +
          (focusLang.tier === 'basic' ? ' · 기본 표현' : '') + '</p>' +
        '<p class="hint">' + esc(focusLang.about || '') + '</p>' +
        '<p class="hint">' + (voiceOk === false
          ? (focusLang.noTts ? '기기 음성이 거의 없는 언어다. 한글 발음을 보고 소리 내 읽자.'
                             : '이 기기에는 ' + esc(focusLang.name) + ' 음성이 아직 없다. 휴대폰 설정에서 텍스트 음성 변환 언어를 추가하면 들린다.')
          : '🔊로 원어민 발음을 들어보자.') + '</p>' +
      '</div>'));
    }

    var cats = [{ id: 'mine', title: '내 문장', blurb: '우리말 번역에서 저장한 문장. 복습 카드에도 들어간다.' }].concat(MULTI.cats);
    var items = allItems();

    cats.forEach(function (cat) {
      var list = items.filter(function (it) { return it.cat === cat.id && (!focusLang || it[focusLang.id]); });
      if (!list.length) return;

      var sec = el('<section class="ml-section"><h3 class="sec-title spaced">' + esc(cat.title) +
        ' <span class="ml-count">' + list.length + '</span></h3><p class="hint">' + esc(cat.blurb) + '</p></section>');

      list.forEach(function (it) {
        var card = el(
          '<div class="card ml-card">' +
            '<div class="ml-head">' +
              '<div><p class="ml-en">' + esc(UI.en(it.en)) + '</p><p class="ml-ko">' + esc(it.ko) + '</p></div>' +
              '<div class="ml-head-btns"><button class="mini" data-a="en" aria-label="영어로 듣기">🔊 EN</button></div>' +
            '</div>' +
          '</div>'
        );
        card.querySelector('[data-a=en]').onclick = function () { Speech.speak(UI.en(it.en)); };
        if (it.mine) {
          var del = el('<button class="mini" aria-label="내 문장에서 지우기">삭제</button>');
          del.onclick = function () {
            if (!confirm('이 문장을 지운다. 복습 기록도 함께 사라진다.')) return;
            removePhrase(it.pid);
            App.refreshPacks();
            App.go({});
          };
          card.querySelector('.ml-head-btns').appendChild(del);
        }

        if (focusLang) {
          var r = row(it, focusLang, true);
          if (r) card.appendChild(r);
        } else {
          var langIds = s.langs.slice();
          // 내 문장에 표현집 밖 언어(예: 폴란드어)가 있으면 함께 보여준다
          if (it.mine) Object.keys(it).forEach(function (k) {
            if (Array.isArray(it[k]) && langIds.indexOf(k) < 0) langIds.push(k);
          });
          var d = fold(it, langIds.map(langById));
          if (d) card.appendChild(d);
        }
        sec.appendChild(card);
      });
      wrap.appendChild(sec);
    });

    wrap.appendChild(el(
      '<p class="note">한글 발음은 근사치다. 성조 언어(중국어·베트남어·태국어)의 높낮이, 프랑스어 콧소리, 아랍어 목구멍소리는 한글로 다 담기지 않으니 🔊로 들어보자. ' +
      '아랍어는 카이로에서 실제로 쓰는 이집트 구어(Masri)다. 퀘추아어와 티베트어는 확신이 서는 문장만 넣었다.</p>'
    ));
    return wrap;
  }

  function setFocus(id) {
    var m = Store.state.settings.multi || (Store.state.settings.multi = {});
    m.focus = id;
    Store.save();
    App.go({});
  }

  return {
    find: find, findIn: findIn, block: block, fold: fold, row: row, play: play,
    phrasebook: phrasebook, settings: settings,
    langById: langById, langName: langName, supported: supported, itemsIn: itemsIn,
    allItems: allItems, myPhrases: myPhrases, savePhrase: savePhrase, removePhrase: removePhrase,
    count: function () { return (window.MULTI && MULTI.items.length) || 0; },
    langCount: function () { return (window.MULTI && MULTI.langs.length) || 0; }
  };
})();
