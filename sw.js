/* 오프라인 캐시. 지하철에서도 열려야 하므로 앱 파일 전체를 미리 받아둔다.
 * VERSION을 올리면 다음 방문 때 새 파일로 갈아끼워진다. */
var VERSION = 'net-v3';
var SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/style.css',
  './assets/themes.css',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './js/data/daily.js',
  './js/data/travel.js',
  './js/data/film.js',
  './js/data/focus.js',
  './js/data/slang.js',
  './js/data/exam.js',
  './js/data/dialect.js',
  './js/data/personas.js',
  './js/data/derived.js',
  './js/store.js',
  './js/srs.js',
  './js/speech.js',
  './js/ui.js',
  './js/generator.js',
  './js/autopack.js',
  './js/views.js',
  './js/app.js'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(VERSION)
      .then(function (c) { return c.addAll(SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.filter(function (k) { return k !== VERSION; })
          .map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);

  /* 신조어 팩처럼 바깥에서 받아오는 것은 캐시를 믿지 않는다 — 늘 새로 받아본다 */
  if (url.origin !== self.location.origin) {
    e.respondWith(fetch(req).catch(function () { return caches.match(req); }));
    return;
  }

  /* 앱 파일은 캐시 우선. 대신 뒤에서 새 버전을 받아 다음 실행에 반영한다 */
  e.respondWith(
    caches.match(req).then(function (hit) {
      var live = fetch(req).then(function (res) {
        if (res && res.status === 200) {
          var copy = res.clone();
          caches.open(VERSION).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return hit; });
      return hit || live;
    })
  );
});
