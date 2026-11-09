/* 7개 국어 — 찾기, 접이식 칸, 표현집 화면.
 *
 * 영어 카드나 대사의 문장이 표현집(js/data/multi.js)에 있으면
 * 그 자리에 "🌐 7개 국어" 접이식 칸이 붙는다. 기본은 접혀 있다 —
 * 영어 학습의 흐름을 끊지 않고, 궁금할 때만 펼쳐보게 하기 위해서다. */
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

  var index = null;
  function buildIndex() {
    index = {};
    (window.MULTI && MULTI.items || []).forEach(function (it) { index[norm(it.en)] = it; });
  }

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
    (window.MULTI && MULTI.items || []).forEach(function (it) {
      var needle = norm(it.en);
      if (needle.split(' ').length < 2) return;
      if (hay.indexOf(' ' + needle + ' ') >= 0 && needle.length > bestLen) {
        best = it; bestLen = needle.length;
      }
    });
    return best;
  }

  function settings() {
    var m = Store.state.settings.multi || {};
    return {
      on: m.on !== false,
      langs: Array.isArray(m.langs) && m.langs.length ? m.langs : MULTI.langs.map(function (l) { return l.id; }),
      focus: m.focus || ''
    };
  }

  function langById(id) {
    return MULTI.langs.find(function (l) { return l.id === id; });
  }

  /* 한 언어 한 줄 — 원문(크게), 로마자·한글 발음, 문화 메모, 듣기 버튼 */
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
        '<button class="mini ml-play" aria-label="' + esc(lang.name) + '로 듣기">🔊</button>' +
      '</div>'
    );
    r.querySelector('.ml-play').onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      play(t[0], lang);
    };
    return r;
  }

  function play(text, lang) {
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

    var langs = s.langs.map(langById).filter(function (l) { return l && item[l.id]; });
    if (!langs.length) return null;

    var partial = opts.loose && norm(item.en) !== norm(en);
    var d = el(
      '<details class="ml-fold">' +
        '<summary>🌐 ' + (partial ? '<b>' + esc(UI.en(item.en)) + '</b> ' : '') + langs.length + '개 국어로 <span class="ml-flags">' +
          langs.map(function (l) { return l.flag; }).join('') + '</span></summary>' +
        '<div class="ml-list"></div>' +
      '</details>'
    );
    // 접이식 칸을 눌러도 카드가 넘어가거나 대사가 재생되지 않게 한다
    d.addEventListener('click', function (e) { e.stopPropagation(); });
    var list = d.querySelector('.ml-list');
    langs.forEach(function (l) { var r = row(item, l); if (r) list.appendChild(r); });
    return d;
  }

  /* ============ 표현집 화면 ============ */

  function phrasebook() {
    var s = settings();
    var wrap = el('<div class="view"></div>');
    wrap.appendChild(App.topbar('7개 국어 표현집', function () { App.go({ name: 'home' }); }));
    wrap.appendChild(el(
      '<p class="lead">영어가 중심이고, 이건 여행 가방에 넣어두는 비상용이다. ' +
      '어느 나라에서든 바로 쓰이는 문장만 골랐고, 나라마다 다른 몸짓과 관습은 메모로 붙였다.</p>'
    ));

    // 한 언어에 집중하기 — "이번 여행은 스페인어만"
    var focusRow = el('<div class="ml-focus"></div>');
    var allChip = el('<button class="chip' + (!s.focus ? ' on' : '') + '">전체 보기</button>');
    allChip.onclick = function () { setFocus(''); };
    focusRow.appendChild(allChip);
    MULTI.langs.forEach(function (l) {
      var c = el('<button class="chip' + (s.focus === l.id ? ' on' : '') + '">' + l.flag + ' ' + esc(l.name) + '</button>');
      c.onclick = function () { setFocus(l.id); };
      focusRow.appendChild(c);
    });
    wrap.appendChild(focusRow);

    var focusLang = s.focus ? langById(s.focus) : null;
    if (focusLang) {
      var voiceOk = Speech.hasVoiceFor(focusLang.tts);   // true / false / null(아직 모름)
      wrap.appendChild(el('<p class="hint">' + focusLang.flag + ' ' + esc(focusLang.name) + '만 크게 보여준다. ' +
        (voiceOk === false
          ? '이 기기에는 ' + esc(focusLang.name) + ' 음성이 아직 없다. 휴대폰 설정에서 텍스트 음성 변환 언어를 추가하면 들린다.'
          : '🔊로 원어민 발음을 들어보자.') +
        '</p>'));
    }

    MULTI.cats.forEach(function (cat) {
      var items = MULTI.items.filter(function (it) { return it.cat === cat.id; });
      if (!items.length) return;

      var sec = el('<section class="ml-section"><h3 class="sec-title spaced">' + esc(cat.title) +
        ' <span class="ml-count">' + items.length + '</span></h3><p class="hint">' + esc(cat.blurb) + '</p></section>');

      items.forEach(function (it) {
        var card = el(
          '<div class="card ml-card">' +
            '<div class="ml-head">' +
              '<div><p class="ml-en">' + esc(UI.en(it.en)) + '</p><p class="ml-ko">' + esc(it.ko) + '</p></div>' +
              '<button class="mini" aria-label="영어로 듣기">🔊 EN</button>' +
            '</div>' +
          '</div>'
        );
        card.querySelector('.ml-head .mini').onclick = function () { Speech.speak(UI.en(it.en)); };

        if (focusLang) {
          var r = row(it, focusLang, true);
          if (r) card.appendChild(r);
        } else {
          var langs = s.langs.map(langById).filter(function (l) { return l && it[l.id]; });
          var d = el('<details class="ml-fold"><summary>🌐 ' + langs.length + '개 국어로 <span class="ml-flags">' +
            langs.map(function (l) { return l.flag; }).join('') + '</span></summary><div class="ml-list"></div></details>');
          var list = d.querySelector('.ml-list');
          langs.forEach(function (l) { var rr = row(it, l); if (rr) list.appendChild(rr); });
          card.appendChild(d);
        }
        sec.appendChild(card);
      });
      wrap.appendChild(sec);
    });

    wrap.appendChild(el(
      '<p class="note">한글 발음은 근사치다. 중국어 성조와 프랑스어 콧소리, 아랍어 목구멍소리는 한글로 다 담기지 않으니 🔊로 들어보자. ' +
      '아랍어는 카이로에서 실제로 쓰는 이집트 구어(Masri)로 넣었다. 뉴스·문서용 표준 아랍어와는 단어와 발음이 다르고, ' +
      '기기에 따라 표준 아랍어 억양의 목소리로 읽힐 수 있다.</p>'
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
    find: find, block: block, phrasebook: phrasebook, settings: settings,
    count: function () { return (window.MULTI && MULTI.items.length) || 0; }
  };
})();
