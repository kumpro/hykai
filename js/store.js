/* 로컬 저장소 — 학습 기록은 전부 이 기기 안에만 남는다. 서버 없음. */
(function () {
  'use strict';

  var KEY = 'hykai-english-v1';

  var DEFAULT = {
    cards: {},          // cardId -> { box, due, seen, wrong }
    scenes: {},         // sceneId -> { studied, lastAt }
    streak: { count: 0, lastDay: null, best: 0 },
    daily: { day: null, cards: 0, lines: 0, goal: 12 },
    settings: { rate: 0.9, voice: null, hideKo: false, autoAdvance: true },
    log: []             // 최근 학습 기록 (최대 60일)
  };

  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function deepMerge(base, patch) {
    var out = {};
    Object.keys(base).forEach(function (k) { out[k] = base[k]; });
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
        state.log.unshift({ day: state.daily.day, cards: state.daily.cards, lines: state.daily.lines });
        state.log = state.log.slice(0, 60);
      }
      state.daily.day = t;
      state.daily.cards = 0;
      state.daily.lines = 0;
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
