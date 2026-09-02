#!/usr/bin/env node
/* 학습 내용을 JSON으로 내보낸다.
 * 앱은 브라우저 안에만 기록을 두기 때문에, 바깥(n8n·메일·카톡)에서 쓰려면
 * 표현 목록을 파일 하나로 뽑아둘 필요가 있다.
 *
 *   node tools/export-json.js
 *   → data/expressions.json  (모든 표현)
 *   → data/slang.json        (신조어 팩 — 앱의 자동 갱신 주소로 쓸 수 있다)
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const dataDir = path.join(root, 'js', 'data');
const outDir = path.join(root, 'data');

/* 데이터 파일은 window에 값을 얹는 평범한 스크립트다. 가짜 window를 주고 그대로 실행한다. */
const sandbox = { window: {} };
sandbox.window.window = sandbox.window;
vm.createContext(sandbox);

['daily.js', 'travel.js', 'film.js', 'focus.js', 'slang.js'].forEach((f) => {
  const code = fs.readFileSync(path.join(dataDir, f), 'utf8');
  vm.runInContext(code, sandbox, { filename: f });
});

const W = sandbox.window;
const rows = [];

Object.keys(W.PACKS).forEach((modeId) => {
  const pack = W.PACKS[modeId];
  pack.scenes.forEach((scene) => {
    scene.expressions.forEach((ex, i) => {
      rows.push({
        id: `${modeId}/${scene.id}/${i}`,
        mode: modeId,
        modeTitle: pack.title,
        scene: scene.title,
        en: ex.en,
        ko: ex.ko,
        note: ex.note || ''
      });
    });
  });
});

/* 후크 문구도 같은 형식으로 붙인다 — 매일 받아보기에 가장 값이 큰 표현들이다 */
W.FOCUS.hooks.forEach((h, i) => {
  rows.push({
    id: `hooks/core/${i}`,
    mode: 'hooks',
    modeTitle: '후크 문구',
    scene: '문장 접착제',
    en: h.en,
    ko: h.ko,
    note: h.note || '',
    examples: (h.examples || []).map((e) => ({ en: e.en, ko: e.ko }))
  });
});

fs.mkdirSync(outDir, { recursive: true });

const bundle = {
  generated: new Date().toISOString().slice(0, 10),
  count: rows.length,
  modes: Object.keys(W.PACKS).map((k) => ({ id: k, title: W.PACKS[k].title })),
  items: rows
};

fs.writeFileSync(path.join(outDir, 'expressions.json'), JSON.stringify(bundle, null, 2) + '\n');
fs.writeFileSync(path.join(outDir, 'slang.json'), JSON.stringify(W.SLANG, null, 2) + '\n');

console.log(`expressions.json — ${rows.length}개 표현`);
console.log(`slang.json — 버전 ${W.SLANG.version}, ${W.SLANG.items.length}개 항목`);
