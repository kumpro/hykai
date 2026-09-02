/* 화면 조각을 만드는 최소한의 도구들. 프레임워크 대신 이것만 쓴다. */
window.UI = (function () {
  'use strict';

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* 영국식 설정이면 표기를 바꿔서 보여준다 */
  function en(text) {
    return window.DIALECT ? DIALECT.convert(text, Store.state.settings.dialect) : text;
  }

  function toast(msg) {
    var t = el('<div class="toast">' + esc(msg) + '</div>');
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('out'); }, 2000);
    setTimeout(function () { t.remove(); }, 2400);
  }

  /* 값 배열을 막대 그래프로 — 라이브러리 없이 div 높이만 쓴다 */
  function barChart(values, labels, opts) {
    opts = opts || {};
    var max = Math.max.apply(null, values.concat([1]));
    var wrap = el('<div class="chart"></div>');
    values.forEach(function (v, i) {
      var h = Math.round((v / max) * 100);
      var col = el(
        '<div class="chart-col" title="' + esc((labels && labels[i]) || '') + ': ' + v + '">' +
          '<div class="chart-bar" style="height:' + Math.max(v > 0 ? 6 : 2, h) + '%"></div>' +
          '<span class="chart-label">' + esc((labels && labels[i]) || '') + '</span>' +
        '</div>'
      );
      if (opts.highlight === i) col.classList.add('on');
      wrap.appendChild(col);
    });
    return wrap;
  }

  /* 최근 n주 학습 히트맵 — 빈칸이 보이면 그게 곧 피드백이다 */
  function heatmap(weeks) {
    weeks = weeks || 8;
    var byDay = {};
    Store.state.log.forEach(function (r) { byDay[r.day] = (r.cards || 0) + (r.lines || 0); });
    var d0 = Store.state.daily;
    byDay[d0.day] = (d0.cards || 0) + (d0.lines || 0);

    var wrap = el('<div class="heat"></div>');
    var today = new Date();
    var total = weeks * 7;
    var cells = [];
    for (var i = total - 1; i >= 0; i--) {
      var d = new Date(today);
      d.setDate(d.getDate() - i);
      var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      var v = byDay[key] || 0;
      var level = v === 0 ? 0 : v < 6 ? 1 : v < 15 ? 2 : v < 30 ? 3 : 4;
      cells.push('<i class="heat-cell l' + level + '" title="' + key + ' · ' + v + '"></i>');
    }
    wrap.innerHTML = cells.join('');
    return wrap;
  }

  function pill(text, cls) {
    return '<em class="tag ' + (cls || '') + '">' + esc(text) + '</em>';
  }

  function field(label, inner) {
    var f = el('<label class="field">' + esc(label) + '</label>');
    f.appendChild(inner);
    return f;
  }

  function input(placeholder, value) {
    return el('<input type="text" placeholder="' + esc(placeholder) + '" value="' + esc(value || '') + '">');
  }

  function select(options, value) {
    var s = el('<select></select>');
    options.forEach(function (o) {
      var opt = el('<option value="' + esc(o.v) + '">' + esc(o.t) + '</option>');
      if (o.v === value) opt.selected = true;
      s.appendChild(opt);
    });
    return s;
  }

  return {
    el: el, esc: esc, en: en, toast: toast,
    barChart: barChart, heatmap: heatmap, pill: pill,
    field: field, input: input, select: select
  };
})();
