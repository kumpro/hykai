/* 우리말 → 여러 언어 번역.
 *
 * 1순위: Claude API — 번역, 한글 발음, 로마자, 문화 메모를 한 번에 받는다.
 *        키는 이 기기 브라우저에만 저장하고(localStorage 'hykai-ai'), 학습 기록과 따로 둔다.
 *        그래서 기록 백업 파일에도 들어가지 않는다. 요청은 api.anthropic.com으로만 간다.
 * 2순위: 브라우저 내장 번역(Translator API) — 데스크톱 크롬에서만, 발음 없이 번역만.
 *
 * 응답 형식은 도구 호출(tool use)로 강제한다. 자유 문장으로 받으면
 * 언어가 빠지거나 형식이 흐트러지기 쉽기 때문이다.
 */
window.AI = (function () {
  'use strict';

  var KEY = 'hykai-ai';
  var ENDPOINT = 'https://api.anthropic.com/v1/messages';

  var MODELS = [
    { id: 'claude-sonnet-5-5', name: 'Sonnet 5.5 — 균형 (기본)' },
    { id: 'claude-opus-5-5', name: 'Opus 5.5 — 가장 정확, 비용 높음' },
    { id: 'claude-haiku-5-5', name: 'Haiku 5.5 — 가장 빠르고 저렴' }
  ];

  /* 언어별로 어느 변종으로 옮길지. 표현집과 같은 기준을 지킨다. */
  var VARIETY = {
    en: 'natural native English',
    ar: 'Egyptian Colloquial Arabic (Masri), Arabic script',
    pt: 'Brazilian Portuguese',
    zh: 'Mandarin Chinese, Simplified characters, with pinyin tone marks',
    es: 'Spain Spanish',
    fil: 'Filipino (Tagalog); light English mixing is fine if natural',
    qu: 'Southern Quechua (Cusco variety)',
    bo: 'Lhasa Tibetan, Tibetan script',
    th: 'Thai, Thai script',
    hi: 'Hindi, Devanagari script',
    ur: 'Urdu, Nastaliq script',
    fa: 'Iranian Persian, Persian script'
  };

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
  }
  function save(v) {
    try { localStorage.setItem(KEY, JSON.stringify(v)); return true; } catch (e) { return false; }
  }

  function cfg() {
    var c = load();
    return {
      key: c.key || '',
      model: c.model || MODELS[0].id,
      speaker: c.speaker || 'male'
    };
  }
  function set(patch) {
    var c = load();
    Object.keys(patch).forEach(function (k) { c[k] = patch[k]; });
    return save(c);
  }
  function hasKey() { return !!cfg().key; }
  function clearKey() { var c = load(); delete c.key; save(c); }

  var TOOL = {
    name: 'give_translations',
    description: 'Return the translations of the Korean sentence.',
    input_schema: {
      type: 'object',
      properties: {
        english: { type: 'string', description: 'The most natural thing a native English speaker would say in this situation.' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              lang: { type: 'string', description: 'The language id exactly as given in the request.' },
              text: { type: 'string', description: 'The sentence in the native script.' },
              romanization: { type: 'string', description: 'Latin-letter reading for non-Latin scripts. Empty string for Latin-script languages.' },
              hangul: { type: 'string', description: 'Pronunciation written in Korean Hangul so a Korean reader can say it aloud.' },
              note: { type: 'string', description: 'One short sentence in Korean only when it matters (gender/politeness forms, regional variety, cultural point). Otherwise empty string.' }
            },
            required: ['lang', 'text', 'romanization', 'hangul', 'note']
          }
        }
      },
      required: ['english', 'items']
    }
  };

  function systemPrompt(speaker) {
    return [
      'You are an interpreter and language coach for a Korean film director in his fifties who travels and works internationally.',
      'Translate the Korean sentence into each requested language the way a native speaker would actually say it in everyday conversation: natural, not word-for-word.',
      'Keep the requested register (polite or casual) and keep the intent, including softness or bluntness.',
      'The speaker is ' + (speaker === 'female' ? 'female' : 'male') + '. Where a language changes form by the speaker\'s gender (Thai ครับ/ค่ะ, Hindi verbs, Portuguese obrigado/obrigada and so on), write it for this speaker and mention the other form in the note.',
      'For each language give: the text in its native script; a romanization only for non-Latin scripts (otherwise an empty string); a Hangul pronunciation guide in the style Korean learners use (for example 메르시 보꾸, 아리가또 고자이마스); and a one-sentence Korean note only when something truly matters, otherwise an empty string.',
      'Also give the single most natural English version.',
      'Use the language variety stated for each language. If a language is rarely written or you are not confident, still give your best natural rendering and say so briefly in the note.',
      'Return everything through the give_translations tool, one item per requested language, using the exact language ids given.'
    ].join(' ');
  }

  function userPrompt(ko, tone, targets) {
    var list = targets.map(function (t) {
      return '- ' + t.id + ': ' + t.en + (VARIETY[t.id] ? ' (' + VARIETY[t.id] + ')' : '');
    }).join('\n');
    return 'Korean sentence:\n' + ko + '\n\nRegister: ' + (tone === 'casual' ? 'casual, between friends' : 'polite, to someone you do not know well') +
      '\n\nTarget languages:\n' + list;
  }

  /* 사람이 읽을 수 있는 오류 문구로 바꾼다 */
  function explain(status, body) {
    var msg = body && body.error && body.error.message ? body.error.message : '';
    if (status === 401) return 'API 키가 맞지 않다. 설정에서 키를 다시 확인하자.';
    if (status === 403) return '이 키로는 이 기능을 쓸 권한이 없다. (' + msg + ')';
    if (status === 404) return '모델 이름을 찾지 못했다. 설정에서 다른 모델을 골라보자. (' + msg + ')';
    if (status === 429) return '요청이 너무 잦다. 잠시 뒤에 다시 하자.';
    if (status === 529 || status === 503) return '서버가 붐빈다. 잠시 뒤에 다시 하자.';
    if (status === 400) return '요청 형식 오류: ' + msg;
    return '번역에 실패했다 (' + status + ') ' + msg;
  }

  /* targets: [{ id, en(영어 이름) }] */
  function translate(ko, tone, targets) {
    var c = cfg();
    if (!c.key) return Promise.reject(new Error('API 키가 없다. 설정에서 넣어두자.'));

    var body = {
      model: c.model,
      max_tokens: 8000,
      system: systemPrompt(c.speaker),
      tools: [TOOL],
      tool_choice: { type: 'tool', name: TOOL.name },
      messages: [{ role: 'user', content: userPrompt(ko, tone, targets) }]
    };

    return fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': c.key,
        'anthropic-version': '2023-06-01',
        // 서버 없이 브라우저에서 바로 부르기 위한 헤더. 키는 이 기기에만 있다.
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) throw new Error(explain(res.status, data));
        var call = (data.content || []).find(function (b) { return b.type === 'tool_use'; });
        if (!call || !call.input) throw new Error('응답 형식이 예상과 다르다. 다시 시도하자.');
        var out = call.input;
        var byLang = {};
        (out.items || []).forEach(function (it) { if (it && it.lang) byLang[it.lang] = it; });
        return {
          english: out.english || '',
          items: targets.map(function (t) {
            var it = byLang[t.id];
            return it ? { lang: t.id, text: it.text || '', rom: it.romanization || '', kr: it.hangul || '', note: it.note || '' }
                      : { lang: t.id, text: '', rom: '', kr: '', note: '', missing: true };
          }),
          model: c.model
        };
      });
    }, function () {
      throw new Error('인터넷 연결을 확인하자. 오프라인에서는 표현집 검색만 된다.');
    });
  }

  /* ---------- 브라우저 내장 번역 (데스크톱 크롬) ---------- */

  function hasBuiltin() { return typeof self !== 'undefined' && 'Translator' in self; }

  function builtinTranslate(ko, targets) {
    if (!hasBuiltin()) return Promise.reject(new Error('이 브라우저에는 내장 번역이 없다.'));
    var chain = Promise.resolve([]);
    targets.forEach(function (t) {
      chain = chain.then(function (acc) {
        var code = t.id === 'fil' ? 'tl' : t.id;
        return self.Translator.availability({ sourceLanguage: 'ko', targetLanguage: code })
          .then(function (a) {
            if (a === 'unavailable') return { lang: t.id, text: '', missing: true };
            return self.Translator.create({ sourceLanguage: 'ko', targetLanguage: code })
              .then(function (tr) { return tr.translate(ko); })
              .then(function (text) { return { lang: t.id, text: text, rom: '', kr: '', note: '' }; });
          })
          .catch(function () { return { lang: t.id, text: '', missing: true }; })
          .then(function (r) { acc.push(r); return acc; });
      });
    });
    return chain.then(function (items) {
      var en = items.find(function (x) { return x.lang === 'en'; });
      return { english: en ? en.text : '', items: items.filter(function (x) { return x.lang !== 'en'; }), builtin: true };
    });
  }

  return {
    MODELS: MODELS, cfg: cfg, set: set, hasKey: hasKey, clearKey: clearKey,
    translate: translate, hasBuiltin: hasBuiltin, builtinTranslate: builtinTranslate,
    _systemPrompt: systemPrompt, _userPrompt: userPrompt
  };
})();
