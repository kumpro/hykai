/* 로컬 저장소 — 학습 기록은 전부 이 기기 안에만 남는다. 서버 없음. */
(function () {
  'use strict';

  var KEY = 'hykai-english-v1';

  var DEFAULT = {
    cards: {},          // cardId -> { box, due, seen, wrong }
    scenes: {},         // sceneId -> { studied, lastAt }
    streak: { count: 0, lastDay: null, best: 0 },
    daily: { day: null, cards: 0, lines: 0, correct: 0, wrong: 0, goal: 12 },
    settings: {
      rate: 0.9,
      voice: null,
      hideKo: false,
      dialect: 'us',      // us | gb
      persona: 'man',     // personas.js의 id
      theme: 'auto',      // auto = 모드별 시대 테마 자동 적용
      pace: 'standard',   // standard | dense (초반 촘촘)
      packUrl: '',        // 비워두면 자동 갱신하지 않는다
      packChecked: 0,     // 마지막 확인 시각
      multi: {
        on: true,         // 카드·대사에 다국어 접이식 칸을 붙일지
        langs: ['ja', 'zh', 'fr', 'de', 'es', 'ru', 'ar'],  // 보여줄 언어
        focus: ''         // 표현집에서 한 언어만 크게 볼 때 그 언어
      },
      translate: null     // 우리말 번역에서 옮길 언어 (translate.js가 처음 쓸 때 채운다)
    },
    myPhrases: [],            // 우리말 번역에서 저장한 내 문장
    custom: { scenes: [] },   // 로그라인으로 생성한 장면
    exams: [],                // 시험 응시 기록
    slang: null,              // 사용자가 갱신한 신조어 팩 (없으면 내장 팩)
    log: []                   // 최근 학습 기록 (최대 90일)
  };

  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  /* 기본값의 배열·객체를 그대로 물려주면, 초기화한 뒤에도 기본값 자체가 오염된 채로 남는다.
   * 그래서 기본값은 늘 복사본에서 시작한다. */
  function deepMerge(base, patch) {
    var out = JSON.parse(JSON.stringify(base));
    Object.keys(patch || {}).forEach(function (k) {
      var bv = base[k], pv = patch[k];
      if (bv && pv && typeof bv === 'object' && typeof pv === 'object' && !Array.isArray(bv)) {
        out[k] = deepMerge(bv, pv);
      } else if (pv !== undefined) {
        out[k] = pv;
      }
    });
    return out;
  }

  var state;

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      state = raw ? deepMerge(DEFAULT, JSON.parse(raw)) : deepMerge(DEFAULT, {});
    } catch (e) {
      state = deepMerge(DEFAULT, {});
    }
    rollDay();
    return state;
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      /* 저장 공간이 없거나 시크릿 모드 — 학습 자체는 계속 굴러가게 둔다 */
    }
  }

  /* 날짜가 바뀌면 오늘 카운터를 초기화하고 스트릭을 정산한다 */
  function rollDay() {
    var t = today();
    if (state.daily.day !== t) {
      if (state.daily.day && (state.daily.cards > 0 || state.daily.lines > 0)) {
        state.log.unshift({
          day: state.daily.day,
          cards: state.daily.cards,
          lines: state.daily.lines,
          correct: state.daily.correct || 0,
          wrong: state.daily.wrong || 0
        });
        state.log = state.log.slice(0, 90);
      }
      state.daily.day = t;
      state.daily.cards = 0;
      state.daily.lines = 0;
      state.daily.correct = 0;
      state.daily.wrong = 0;
      save();
    }
  }

  function yesterday() {
    var d = new Date();
    d.setDate(d.getDate() - 1);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  /* 오늘 학습이 일어났음을 기록. 하루에 한 번만 스트릭이 오른다. */
  function touchStreak() {
    var t = today();
    var s = state.streak;
    if (s.lastDay === t) return;
    s.count = (s.lastDay === yesterday()) ? s.count + 1 : 1;
    s.lastDay = t;
    if (s.count > s.best) s.best = s.count;
    save();
  }

  window.Store = {
    load: load,
    save: save,
    today: today,
    touchStreak: touchStreak,
    get state() { return state || load(); },
    reset: function () {
      state = deepMerge(DEFAULT, {});
      save();
    }
  };
})();
