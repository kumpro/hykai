#!/usr/bin/env node
/* 세계지도 데이터를 미리 구워 js/data/world-map.js로 내보낸다.
 *
 * 폰에서 지도 라이브러리를 매번 내려받아 그리면 느리고, 오프라인에서는 아예 안 뜬다.
 * 그래서 나라 경계를 한 번만 투영해서 SVG 경로 문자열로 저장해둔다.
 *
 *   준비 (저장소 바깥 아무 폴더에서):
 *     npm i world-atlas@2 topojson-client@3 d3-geo@3 i18n-iso-countries@7
 *   실행:
 *     node tools/build-map.mjs <그 폴더의 node_modules 경로>
 *
 * 원본: Natural Earth 1:110m (world-atlas). 퍼블릭 도메인.
 * 투영: Natural Earth 1 — 대륙 모양이 덜 일그러지고 한눈에 보기 편하다.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const mods = path.resolve(process.argv[2] || 'node_modules');
const require = createRequire(path.join(mods, 'noop.js'));
const topojson = require('topojson-client');
const countriesLib = require('i18n-iso-countries');
const d3 = await import(pathToFileURL(path.join(mods, 'd3-geo/dist/d3-geo.mjs')).href);

const topo = JSON.parse(fs.readFileSync(path.join(mods, 'world-atlas/countries-110m.json'), 'utf8'));
const fc = topojson.feature(topo, topo.objects.countries);

/* 코드가 비어 있는 몇몇 지역은 이름으로 정한다 */
const BY_NAME = { 'Kosovo': 'XK', 'N. Cyprus': 'NCY', 'Somaliland': 'SOL' };
const NAME_KO = { NCY: '북키프로스', SOL: '소말릴란드', HK: '홍콩', MO: '마카오', VA: '바티칸' };

const ko = new Intl.DisplayNames(['ko'], { type: 'region' });
const en = new Intl.DisplayNames(['en'], { type: 'region' });

const features = fc.features
  .map((f) => {
    let a2 = f.id ? countriesLib.numericToAlpha2(f.id) : null;
    if (!a2) a2 = BY_NAME[f.properties.name] || null;
    return { f, a2 };
  })
  .filter((x) => x.a2 && x.a2 !== 'AQ');   // 남극은 뺀다 — 화면만 차지하고 언어가 없다

const unknown = fc.features.filter((f) => !(f.id ? countriesLib.numericToAlpha2(f.id) : BY_NAME[f.properties.name]));
if (unknown.length) console.warn('코드를 못 찾은 지역:', unknown.map((f) => f.properties.name).join(', '));

const W = 1000;
const projection = d3.geoNaturalEarth1().fitWidth(W, { type: 'FeatureCollection', features: features.map((x) => x.f) });
const geoPath = d3.geoPath(projection).digits(1);
const [[, y0], [, y1]] = geoPath.bounds({ type: 'FeatureCollection', features: features.map((x) => x.f) });
const H = Math.ceil(y1 + 2);

const round = (n) => Math.round(n * 10) / 10;

const rows = features.map(({ f, a2 }) => {
  const d = geoPath(f);
  const [cx, cy] = geoPath.centroid(f);
  const [[bx0, by0], [bx1, by1]] = geoPath.bounds(f);
  const nameKo = NAME_KO[a2] || (a2.length === 2 ? ko.of(a2) : a2);
  const nameEn = a2.length === 2 ? en.of(a2) : f.properties.name;
  return [a2, nameKo, nameEn, d, round(cx), round(cy), round(bx0), round(by0), round(bx1), round(by1)];
});

/* 110m 축척에서는 너무 작아 사라지는 나라들 — 점으로 찍는다 */
const SMALL = {
  SG: [103.82, 1.35], HK: [114.17, 22.32], MO: [113.54, 22.19], MT: [14.45, 35.9],
  BH: [50.56, 26.07], MV: [73.22, 3.2], MU: [57.55, -20.35], LU: [6.13, 49.81],
  MC: [7.42, 43.74], VA: [12.45, 41.9], AD: [1.52, 42.51], LI: [9.55, 47.16],
  SM: [12.46, 43.94], CV: [-23.6, 15.1], SC: [55.49, -4.68], BB: [-59.54, 13.19],
  KM: [43.87, -11.88], ST: [6.61, 0.19], WS: [-172.1, -13.76], TO: [-175.2, -21.18]
};
const have = new Set(rows.map((r) => r[0]));
const dots = Object.entries(SMALL)
  .filter(([a2]) => !have.has(a2))
  .map(([a2, ll]) => {
    const [x, y] = projection(ll);
    return [a2, NAME_KO[a2] || ko.of(a2), en.of(a2), round(x), round(y)];
  });

/* 권역 바로가기 — 경도·위도 상자를 화면 좌표 [x, y, 너비, 높이]로 바꿔둔다 */
function box(lon0, lat0, lon1, lat1) {
  const pts = [];
  for (let lo = lon0; lo <= lon1; lo += (lon1 - lon0) / 8) {
    for (let la = lat0; la <= lat1; la += (lat1 - lat0) / 8) pts.push(projection([lo, la]));
  }
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys);
  return [round(x), round(y), round(Math.max(...xs) - x), round(Math.max(...ys) - y)];
}
const regions = {
  europe: box(-12, 34, 42, 71),
  asia: box(60, -11, 150, 55),
  mideast_africa: box(-20, -36, 65, 42),
  americas: box(-170, -56, -30, 72),
  oceania: box(110, -48, 180, 0)
};

const out = `/* 자동 생성 파일 — 손으로 고치지 말 것. tools/build-map.mjs가 만든다.
 * 원본: Natural Earth 1:110m (world-atlas, 퍼블릭 도메인), 투영: Natural Earth 1.
 * c: [국가코드, 한국어 이름, 영어 이름, SVG 경로, 중심 x, 중심 y, 경계 x0, y0, x1, y1]
 * dots: 너무 작아 지도에서 사라지는 나라 [코드, 한국어, 영어, x, y] */
window.WORLD_MAP = ${JSON.stringify({ w: W, h: H, c: rows, dots, regions })};
`;
fs.writeFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'js', 'data', 'world-map.js'), out);
console.log(`나라 ${rows.length}개 + 점 ${dots.length}개, ${W}×${H}, ${(out.length / 1024).toFixed(0)}KB`);
console.log('점으로 찍은 나라:', dots.map((d) => d[1]).join(', '));
