/* 음성 엔진 — 듣기(TTS)와 말하기(음성인식), 그리고 발음 채점.
 * 브라우저 내장 기능만 쓴다. 외부 서버로 목소리가 나가지 않는다. */
(function () {
  'use strict';

  var synth = window.speechSynthesis;
  var voices = [];
  var currentUtter = null;

  /* 재생 세대(generation).
   * 여러 줄을 이어 읽는 화면들은 다음 줄을 재생하기 전에 이 번호가 그대로인지 확인한다.
   * stop()이 번호를 올리므로, 화면을 빠져나가면 이어지던 재생이 그 자리에서 끊긴다.
   * synth.cancel()만으로는 부족하다 — 취소도 onend를 부르기 때문에
   * 다음 줄을 재생하는 콜백이 그대로 이어져버린다. */
  var generation = 0;
  function token() { return generation; }
  function alive(t) { return t === generation; }

  var allVoices = [];   // 다국어 표현집용 — 영어 외 목소리까지 전부

  function loadVoices() {
    if (!synth) return;
    allVoices = synth.getVoices();
    voices = allVoices.filter(function (v) { return /^en(-|_)/i.test(v.lang); });
  }
  if (synth) {
    loadVoices();
    synth.onvoiceschanged = loadVoices;
  }

  function listVoices() { return voices; }

  /* 영국식/미국식 설정에 맞는 목소리를, 그 안에서 다시 페르소나에 맞는 목소리를 고른다.
   * 기기에 해당 목소리가 없으면 피치와 속도로 인물의 결을 흉내 낸다. */
  function pickVoice(name, personaId, dialect) {
    if (name) {
      var found = voices.find(function (v) { return v.name === name; });
      if (found) return found;
    }
    var want = dialect === 'gb' ? /en-GB/i : /en-US/i;
    var pool = voices.filter(function (v) { return want.test(v.lang); });
    if (!pool.length) pool = voices;

    var persona = window.PERSONA_BY_ID && window.PERSONA_BY_ID[personaId];
    if (persona && persona.prefer) {
      var matched = pool.find(function (v) { return persona.prefer.test(v.name); });
      if (matched) return matched;
    }
    return pool.find(function (v) { return /Google|Samantha|Daniel|Karen|Alex/i.test(v.name); })
      || pool[0] || voices[0] || null;
  }

  function speak(text, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      if (!synth || !text) { resolve(false); return; }
      var s = Store.state.settings;
      var dialect = opts.dialect || s.dialect || 'us';
      var personaId = opts.persona || s.persona || 'man';
      var persona = (window.PERSONA_BY_ID && window.PERSONA_BY_ID[personaId]) || { pitch: 1, rate: 1 };

      synth.cancel();
      var u = new SpeechSynthesisUtterance(text);
      var v = pickVoice(opts.voice || s.voice, personaId, dialect);
      if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = window.DIALECT ? DIALECT.lang(dialect) : 'en-US'; }

      var base = opts.rate != null ? opts.rate : (s.rate || 0.9);
      u.rate = Math.max(0.5, Math.min(1.6, base * (opts.ignorePersona ? 1 : persona.rate)));
      u.pitch = opts.pitch != null ? opts.pitch : (opts.ignorePersona ? 1 : persona.pitch);

      u.onend = function () { currentUtter = null; resolve(true); };
      u.onerror = function () { currentUtter = null; resolve(false); };
      currentUtter = u;
      synth.speak(u);
    });
  }

  function stop() {
    generation += 1;
    if (synth) synth.cancel();
    currentUtter = null;
  }

  /* ---------- 다른 언어로 읽기 ----------
   * tag는 'ja-JP', 'ar-EG' 같은 언어 태그다.
   * 정확히 같은 지역 목소리를 먼저 찾고, 없으면 같은 언어의 아무 목소리를 쓴다
   * (이집트 목소리가 없으면 다른 아랍어 목소리로 읽는다).
   *
   * 그 언어 목소리가 기기에 아예 없으면 읽지 않고 'no-voice'를 돌려준다.
   * 그냥 읽게 두면 영어 목소리가 일본어를 더듬거리며 읽어서 오히려 해롭다. */

  function voiceFor(tag) {
    var lang = tag.split('-')[0].toLowerCase();
    var norm = function (s) { return (s || '').replace('_', '-').toLowerCase(); };
    return allVoices.find(function (v) { return norm(v.lang) === tag.toLowerCase(); })
      || allVoices.find(function (v) { return norm(v.lang).split('-')[0] === lang; })
      || null;
  }

  function hasVoiceFor(tag) {
    if (!synth) return false;
    if (!allVoices.length) loadVoices();
    return !!voiceFor(tag);
  }

  function speakIn(text, tag) {
    return new Promise(function (resolve) {
      if (!synth || !text) { resolve('unsupported'); return; }
      if (!allVoices.length) loadVoices();
      var v = voiceFor(tag);
      // 목소리 목록이 아직 비어 있는 기기(일부 안드로이드 첫 실행)는 언어 태그만 주고 맡겨본다
      if (!v && allVoices.length) { resolve('no-voice'); return; }

      synth.cancel();
      var u = new SpeechSynthesisUtterance(text);
      if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = tag; }
      u.rate = Math.max(0.6, Math.min(1.1, (Store.state.settings.rate || 0.9)));
      u.pitch = 1;
      u.onend = function () { currentUtter = null; resolve('ok'); };
      u.onerror = function () { currentUtter = null; resolve('error'); };
      currentUtter = u;
      synth.speak(u);
    });
  }

  /* ---------- 음성 인식 ---------- */

  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognizer = null;

  function canListen() { return !!SR; }

  function listen(handlers) {
    handlers = handlers || {};
    if (!SR) { if (handlers.onerror) handlers.onerror('unsupported'); return null; }
    abortRecognizer();   // 세대는 올리지 않는다 — 이어지던 롤플레이가 끊기면 안 되기 때문
    var r = new SR();
    r.lang = window.DIALECT ? DIALECT.lang(Store.state.settings.dialect) : 'en-US';
    r.interimResults = true;
    r.continuous = false;
    r.maxAlternatives = 3;

    r.onresult = function (e) {
      var interim = '', finalText = '';
      for (var i = e.resultIndex; i < e.results.length; i++) {
        var res = e.results[i];
        if (res.isFinal) finalText += res[0].transcript;
        else interim += res[0].transcript;
      }
      if (interim && handlers.oninterim) handlers.oninterim(interim);
      if (finalText && handlers.onfinal) handlers.onfinal(finalText.trim());
    };
    r.onerror = function (e) { if (handlers.onerror) handlers.onerror(e.error); };
    r.onend = function () { recognizer = null; if (handlers.onend) handlers.onend(); };
    recognizer = r;
    try { r.start(); } catch (e) { if (handlers.onerror) handlers.onerror('start-failed'); }
    return r;
  }

  function abortRecognizer() {
    if (recognizer) {
      try { recognizer.stop(); } catch (e) { /* 이미 멈춘 상태 */ }
      recognizer = null;
    }
  }

  /* 바깥에서 부르는 중단 — 이어지던 흐름까지 끊는다 */
  function stopListening() {
    generation += 1;
    abortRecognizer();
  }

  /* ---------- 발음/문장 채점 ----------
   * 단어 단위 편집거리로 정답 문장과 비교해 점수와 단어별 판정을 낸다. */

  function normalize(s) {
    return (s || '')
      .toLowerCase()
      .replace(/[’']/g, "'")
      .replace(/[^a-z0-9'\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokens(s) {
    var n = normalize(s);
    return n ? n.split(' ') : [];
  }

  /* 축약형 차이를 같은 말로 본다 — 인식기가 제멋대로 풀어 쓰기 때문 */
  var EQUIV = {
    "i'm": 'i am', "you're": 'you are', "it's": 'it is', "that's": 'that is',
    "we're": 'we are', "they're": 'they are', "i've": 'i have', "we've": 'we have',
    "don't": 'do not', "doesn't": 'does not', "didn't": 'did not', "can't": 'can not',
    "won't": 'will not', "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not',
    "i'll": 'i will', "we'll": 'we will', "you'll": 'you will', "it'll": 'it will',
    "i'd": 'i would', "we'd": 'we would', "you'd": 'you would', "there's": 'there is',
    "let's": 'let us', "what's": 'what is', "here's": 'here is', "he's": 'he is',
    "she's": 'she is', "couldn't": 'could not', "wouldn't": 'would not', "cannot": 'can not'
  };

  function expand(list) {
    var out = [];
    list.forEach(function (w) {
      if (EQUIV[w]) out = out.concat(EQUIV[w].split(' '));
      else out.push(w);
    });
    return out;
  }

  function align(target, said) {
    var a = expand(tokens(target));
    var b = expand(tokens(said));
    var n = a.length, m = b.length;
    var dp = [], i, j;
    for (i = 0; i <= n; i++) { dp.push(new Array(m + 1).fill(0)); dp[i][0] = i; }
    for (j = 0; j <= m; j++) dp[0][j] = j;
    for (i = 1; i <= n; i++) {
      for (j = 1; j <= m; j++) {
        var cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    // 역추적해서 원문 단어별 hit/miss를 만든다
    var marks = new Array(n).fill('miss');
    i = n; j = m;
    while (i > 0 && j > 0) {
      var cost2 = a[i - 1] === b[j - 1] ? 0 : 1;
      if (dp[i][j] === dp[i - 1][j - 1] + cost2) {
        if (cost2 === 0) marks[i - 1] = 'hit';
        i--; j--;
      } else if (dp[i][j] === dp[i - 1][j] + 1) {
        i--;
      } else {
        j--;
      }
    }
    var hits = marks.filter(function (m2) { return m2 === 'hit'; }).length;
    var score = n === 0 ? 0 : Math.round((hits / n) * 100);
    return { score: score, marks: marks, words: a, saidWords: b };
  }

  /* 원문 표기(대소문자·구두점 유지)에 판정을 입혀 렌더링용 배열을 만든다 */
  function markup(target, said) {
    var res = align(target, said);
    var raw = (target || '').split(/\s+/).filter(Boolean);
    var expandedIdx = 0, out = [];
    raw.forEach(function (word) {
      var norm = normalize(word);
      var span = EQUIV[norm] ? EQUIV[norm].split(' ').length : (norm ? 1 : 1);
      var slice = res.marks.slice(expandedIdx, expandedIdx + span);
      var ok = slice.length > 0 && slice.every(function (m) { return m === 'hit'; });
      out.push({ word: word, ok: ok });
      expandedIdx += span;
    });
    return { score: res.score, parts: out };
  }

  window.Speech = {
    speak: speak, stop: stop, listVoices: listVoices, pickVoice: pickVoice,
    canListen: canListen, listen: listen, stopListening: stopListening,
    score: markup, supported: !!synth,
    token: token, alive: alive,
    speakIn: speakIn, hasVoiceFor: hasVoiceFor
  };
})();
