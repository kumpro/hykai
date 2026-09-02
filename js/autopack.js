/* 신조어 팩 자동 갱신.
 * 설정에 팩 주소가 들어 있으면 하루 한 번 조용히 확인하고,
 * 버전이 올라갔을 때만 교체한다. 실패해도 학습은 그대로 굴러가야 하므로 조용히 넘어간다. */
window.AUTOPACK = (function () {
  'use strict';

  var DAY = 24 * 60 * 60 * 1000;

  function valid(pack) {
    return pack && Array.isArray(pack.items) && pack.items.length > 0 &&
      pack.items.every(function (x) { return x && typeof x.en === 'string' && typeof x.ko === 'string'; });
  }

  function currentVersion() {
    var cur = Store.state.slang || window.SLANG;
    return Number(cur.version) || 0;
  }

  /* onApplied(pack) — 실제로 갈아끼웠을 때만 호출된다 */
  function check(opts) {
    opts = opts || {};
    var s = Store.state.settings;
    var url = (s.packUrl || '').trim();
    if (!url) return Promise.resolve(null);
    if (!opts.force && Date.now() - (s.packChecked || 0) < DAY) return Promise.resolve(null);

    s.packChecked = Date.now();
    Store.save();

    return fetch(url, { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)); })
      .then(function (pack) {
        if (!valid(pack)) throw new Error('형식 불일치');
        if (Number(pack.version) <= currentVersion() && !opts.force) return null;
        pack.source = pack.source || url;
        pack.updated = pack.updated || Store.today();
        Store.state.slang = pack;
        Store.save();
        if (opts.onApplied) opts.onApplied(pack);
        return pack;
      })
      .catch(function (e) {
        if (opts.onError) opts.onError(e);
        return null;
      });
  }

  return { check: check, valid: valid, currentVersion: currentVersion };
})();
