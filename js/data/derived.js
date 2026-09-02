/* FOCUS의 후크 문구와 SLANG의 신조어를 일반 모드와 같은 형태로 감싼다.
 * 이렇게 해두면 대화·카드·롤플레이·간격 반복이 전부 그대로 굴러간다. */
(function () {
  'use strict';

  window.buildDerivedPacks = function () {
    /* ---- 후크 문구 반복 모드 ---- */
    var hooks = window.FOCUS.hooks;
    var perScene = 4;
    var hookScenes = [];
    for (var i = 0; i < hooks.length; i += perScene) {
      var chunk = hooks.slice(i, i + perScene);
      var n = Math.floor(i / perScene) + 1;
      var lines = [];
      chunk.forEach(function (h) {
        (h.examples || []).forEach(function (ex) {
          lines.push({ s: 'You', en: ex.en, ko: ex.ko, tip: h.en + ' — ' + h.note });
        });
      });
      hookScenes.push({
        id: 'hooks-' + n,
        title: '후크 문구 ' + n + '세트',
        titleEn: 'Sentence hooks ' + n,
        situation: chunk.map(function (h) { return h.en; }).join(' · '),
        lines: lines,
        expressions: chunk.map(function (h) {
          return { en: h.en, ko: h.ko, note: h.note };
        })
      });
    }

    window.PACKS.hooks = {
      id: 'hooks',
      title: '후크 문구 반복',
      titleEn: 'Sentence Hooks',
      icon: '🧩',
      theme: 'ancient',
      blurb: '문장을 붙이는 접착제. 이게 없으면 말이 늘 뚝뚝 끊긴다.',
      scenes: hookScenes
    };

    /* ---- 신조어 모드 ---- */
    var pack = Store.state.slang || window.SLANG;
    var work = pack.items.filter(function (x) { return x.register === 'work'; });
    var casual = pack.items.filter(function (x) { return x.register !== 'work'; });

    function slangScene(id, title, titleEn, sit, items) {
      return {
        id: id,
        title: title,
        titleEn: titleEn,
        situation: sit,
        lines: items.map(function (it) {
          return { s: 'You', en: exampleOf(it), ko: it.ko, tip: it.note };
        }),
        expressions: items.map(function (it) {
          return { en: it.en, ko: it.ko, note: it.note };
        })
      };
    }

    /* note 안에 따옴표로 든 예문이 있으면 그걸 쓰고, 없으면 표현 자체를 읽힌다 */
    function exampleOf(it) {
      var m = (it.note || '').match(/"([^"]+)"/);
      return m ? m[1] : it.en;
    }

    var slangScenes = [];
    for (var w = 0; w < work.length; w += 6) {
      slangScenes.push(slangScene(
        'slang-work-' + (w / 6 + 1),
        '업무 표현 ' + (w / 6 + 1) + '세트',
        'Workplace slang ' + (w / 6 + 1),
        '회의와 메일에서 실제로 오가는 말. 알아듣지 못하면 대화에서 밀린다.',
        work.slice(w, w + 6)
      ));
    }
    for (var c = 0; c < casual.length; c += 6) {
      slangScenes.push(slangScene(
        'slang-casual-' + (c / 6 + 1),
        '또래 표현 ' + (c / 6 + 1) + '세트',
        'Casual slang ' + (c / 6 + 1),
        '쓰기보다 알아듣기 위한 말. 자막 없이 볼 때 걸리는 지점들이다.',
        casual.slice(c, c + 6)
      ));
    }

    window.PACKS.slang = {
      id: 'slang',
      title: '신조어·최신 표현',
      titleEn: 'Current Slang',
      icon: '⚡',
      theme: 'future',
      blurb: '업무 은어와 또래 표현. 팩 버전 ' + pack.version + ' · ' + pack.updated,
      meta: { version: pack.version, updated: pack.updated, source: pack.source },
      scenes: slangScenes
    };
  };
})();
