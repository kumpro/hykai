/* 간격 반복(Leitner 5박스).
 * 맞히면 다음 박스로, 틀리면 1번 박스로. 50대의 기억력은 반복 간격으로 이긴다. */
(function () {
  'use strict';

  var INTERVALS = [0, 1, 3, 7, 16, 35]; // box 1~5 → 다음 복습까지 일수

  function dayNumber(dateStr) {
    var p = (dateStr || Store.today()).split('-');
    return Math.floor(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000);
  }

  function cardId(modeId, sceneId, index) {
    return modeId + '/' + sceneId + '/' + index;
  }

  function get(id) {
    var c = Store.state.cards[id];
    if (!c) {
      c = { box: 1, due: dayNumber(), seen: 0, wrong: 0 };
      Store.state.cards[id] = c;
    }
    return c;
  }

  function isDue(id) {
    var c = Store.state.cards[id];
    if (!c) return true;
    return c.due <= dayNumber();
  }

  function grade(id, correct) {
    var c = get(id);
    c.seen += 1;
    if (correct) {
      c.box = Math.min(5, c.box + 1);
      Store.state.daily.correct = (Store.state.daily.correct || 0) + 1;
    } else {
      c.wrong += 1;
      c.box = 1;
      Store.state.daily.wrong = (Store.state.daily.wrong || 0) + 1;
    }
    c.due = dayNumber() + INTERVALS[c.box];
    Store.state.daily.cards += 1;
    Store.touchStreak();
    Store.save();
    return c;
  }

  /* 전체 팩에서 오늘 복습할 카드 목록을 뽑는다.
   * 밀린 카드 우선, 그다음 한 번도 안 본 카드. */
  function dueQueue(limit) {
    var out = [];
    Object.keys(window.PACKS).forEach(function (mid) {
      var pack = window.PACKS[mid];
      pack.scenes.forEach(function (scene) {
        scene.expressions.forEach(function (ex, i) {
          var id = cardId(mid, scene.id, i);
          var c = Store.state.cards[id];
          if (!c || c.due <= dayNumber()) {
            out.push({
              id: id, mode: mid, modeTitle: pack.title, icon: pack.icon,
              scene: scene.title, ex: ex,
              box: c ? c.box : 0, overdue: c ? dayNumber() - c.due : 999
            });
          }
        });
      });
    });
    out.sort(function (a, b) {
      if (a.box !== b.box) return a.box - b.box;      // 약한 카드 먼저
      return b.overdue - a.overdue;                    // 오래 밀린 것 먼저
    });
    return limit ? out.slice(0, limit) : out;
  }

  function stats() {
    var total = 0, learned = 0, mastered = 0;
    Object.keys(window.PACKS).forEach(function (mid) {
      window.PACKS[mid].scenes.forEach(function (s) { total += s.expressions.length; });
    });
    Object.keys(Store.state.cards).forEach(function (id) {
      var c = Store.state.cards[id];
      if (c.seen > 0) learned += 1;
      if (c.box >= 4) mastered += 1;
    });
    return { total: total, learned: learned, mastered: mastered, due: dueQueue().length };
  }

  /* 카드 id로 원래 표현을 되찾는다 — 점검 화면에서 약한 표현을 보여주기 위해 */
  function lookup(id) {
    var p = id.split('/');
    var pack = window.PACKS[p[0]];
    if (!pack) return null;
    var scene = pack.scenes.find(function (s) { return s.id === p[1]; });
    if (!scene) return null;
    var ex = scene.expressions[+p[2]];
    if (!ex) return null;
    return { id: id, ex: ex, scene: scene.title, icon: pack.icon, modeTitle: pack.title, mode: pack.id };
  }

  /* 가장 자주 틀린 표현들 — 여기가 실제 약점이다 */
  function weakest(limit) {
    return Object.keys(Store.state.cards)
      .map(function (id) {
        var c = Store.state.cards[id];
        var info = lookup(id);
        return info ? { info: info, wrong: c.wrong, seen: c.seen, box: c.box } : null;
      })
      .filter(function (x) { return x && x.wrong > 0; })
      .sort(function (a, b) { return b.wrong - a.wrong || a.box - b.box; })
      .slice(0, limit || 10);
  }

  /* 앞으로 며칠간 하루에 몇 장이 올라오는지 — 밀림을 미리 본다 */
  function forecast(days) {
    var base = dayNumber();
    var out = [];
    for (var d = 0; d < (days || 14); d++) out.push(0);
    Object.keys(Store.state.cards).forEach(function (id) {
      var offset = Store.state.cards[id].due - base;
      if (offset < 0) offset = 0;
      if (offset < out.length) out[offset] += 1;
    });
    return out;
  }

  /* 박스별 분포 — 1번에 몰려 있으면 진도가 아니라 반복이 필요하다는 뜻 */
  function boxSpread() {
    var out = [0, 0, 0, 0, 0];
    Object.keys(Store.state.cards).forEach(function (id) {
      var b = Store.state.cards[id].box;
      if (b >= 1 && b <= 5) out[b - 1] += 1;
    });
    return out;
  }

  window.SRS = {
    cardId: cardId, get: get, grade: grade, isDue: isDue,
    dueQueue: dueQueue, stats: stats, dayNumber: dayNumber,
    lookup: lookup, weakest: weakest, forecast: forecast, boxSpread: boxSpread
  };
})();
