/* 화면 이동과 학습 흐름의 중심. 나머지 모드는 views.js가 그린다. */
(function () {
  'use strict';

  var app = document.getElementById('app');
  var el = UI.el, esc = UI.esc, toast = UI.toast;

  var view = { name: 'home', mode: null, scene: null, tab: 'dialogue' };
  var session = null;

  /* 모드와 화면마다 다른 시대를 입힌다 */
  var THEME_BY_MODE = {
    daily: 'modern', travel: 'deco', film: 'future',
    hooks: 'ancient', slang: 'future', mine: 'future'
  };
  var THEME_BY_VIEW = {
    home: 'modern', review: 'modern', schedule: 'modern',
    exam: 'medieval', 'exam-run': 'medieval',
    grammar: 'ancient', drill: 'ancient',
    studio: 'future'
  };

  function applyTheme() {
    var pref = Store.state.settings.theme;
    var t;
    if (pref && pref !== 'auto') t = pref;
    else if (view.mode && THEME_BY_MODE[view.mode] && (view.name === 'mode' || view.name === 'scene')) t = THEME_BY_MODE[view.mode];
    else t = THEME_BY_VIEW[view.name] || 'modern';
    document.documentElement.setAttribute('data-theme', t);
  }

  function packOf(id) { return window.PACKS[id]; }
  function sceneOf(modeId, sceneId) {
    var p = packOf(modeId);
    return p && p.scenes.find(function (s) { return s.id === sceneId; });
  }

  function go(next) {
    Speech.stop();
    Speech.stopListening();
    Object.assign(view, next || {});
    render();
    window.scrollTo(0, 0);
  }

  function topbar(title, onBack) {
    var b = el(
      '<div class="topbar">' +
        '<button class="icon-btn" aria-label="뒤로">←</button>' +
        '<h2>' + esc(title) + '</h2>' +
        '<button class="icon-btn" aria-label="설정">⚙</button>' +
      '</div>'
    );
    b.children[0].onclick = onBack;
    b.children[2].onclick = openSettings;
    return b;
  }

  /* ---------- 홈 ---------- */

  function renderHome() {
    var st = SRS.stats();
    var s = Store.state;
    var pct = st.total ? Math.round((st.mastered / st.total) * 100) : 0;
    var goalPct = Math.min(100, Math.round((s.daily.cards / (s.daily.goal || 12)) * 100));
    var wrap = el('<div class="view"></div>');

    wrap.appendChild(el(
      '<header class="hero">' +
        '<p class="hero-eyebrow">Native English Trainer</p>' +
        '<h1 class="hero-title">오늘도 한 장면씩.</h1>' +
        '<p class="hero-sub">외우는 공부가 아니라, 입에서 나오게 만드는 연습.</p>' +
      '</header>'
    ));

    wrap.appendChild(el(
      '<section class="stat-row">' +
        '<div class="stat"><span class="stat-num">' + s.streak.count + '</span><span class="stat-label">연속 학습일</span></div>' +
        '<div class="stat"><span class="stat-num">' + st.due + '</span><span class="stat-label">대기 중인 표현</span></div>' +
        '<div class="stat"><span class="stat-num">' + pct + '%</span><span class="stat-label">익힌 비율</span></div>' +
      '</section>'
    ));

    var take = Math.min(st.due, 20);
    var label = st.due === 0 ? '복습 완료 — 새 표현 보기'
      : st.learned === 0 ? '첫 표현 익히기 (' + take + '장)'
      : '오늘의 복습 시작 (' + take + '장)';

    var goal = el(
      '<section class="card goal">' +
        '<div class="goal-head"><span>오늘의 목표</span><b>' + s.daily.cards + ' / ' + (s.daily.goal || 12) + '</b></div>' +
        '<div class="bar"><i style="width:' + goalPct + '%"></i></div>' +
        '<button class="btn primary wide" id="startReview">' + label + '</button>' +
      '</section>'
    );
    goal.querySelector('#startReview').onclick = startReview;
    wrap.appendChild(goal);

    // 빠른 진입 — 회화 모드가 아닌 기능들
    var tools = el('<section class="tool-grid"></section>');
    [
      { t: '학습 점검', d: '기록·예보·약점', i: '📊', go: { name: 'schedule' } },
      { t: '듣기 시험', d: '토익 유형', i: '🎧', go: { name: 'exam' } },
      { t: '문법 집중', d: '여섯 지점 드릴', i: '🧠', go: { name: 'grammar' } },
      { t: '피칭 스튜디오', d: '내 작품으로', i: '🎞️', go: { name: 'studio' } }
    ].forEach(function (x) {
      var b = el('<button class="card tool"><span class="tool-i">' + x.i + '</span>' +
        '<span class="tool-t">' + esc(x.t) + '</span><span class="tool-d">' + esc(x.d) + '</span></button>');
      b.onclick = function () { go(x.go); };
      tools.appendChild(b);
    });
    wrap.appendChild(tools);

    wrap.appendChild(el('<h3 class="sec-title spaced">회화 모드</h3>'));

    var modes = el('<section class="mode-grid"></section>');
    Object.keys(window.PACKS).forEach(function (mid) {
      var p = window.PACKS[mid];
      var done = p.scenes.filter(function (sc) { return (Store.state.scenes[sc.id] || {}).studied; }).length;
      var c = el(
        '<button class="card mode-card">' +
          '<span class="mode-icon">' + p.icon + '</span>' +
          '<span class="mode-body">' +
            '<span class="mode-title">' + esc(p.title) + '</span>' +
            '<span class="mode-en">' + esc(p.titleEn) + '</span>' +
            '<span class="mode-blurb">' + esc(p.blurb) + '</span>' +
          '</span>' +
          '<span class="mode-meta">' + done + '/' + p.scenes.length + '</span>' +
        '</button>'
      );
      c.onclick = function () { go({ name: 'mode', mode: mid }); };
      modes.appendChild(c);
    });
    wrap.appendChild(modes);

    var set = Store.state.settings;
    var persona = window.PERSONA_BY_ID[set.persona] || PERSONAS[0];
    wrap.appendChild(el('<p class="note">현재 설정: ' + esc(DIALECT.label(set.dialect)) + ' · ' +
      esc(persona.icon + ' ' + persona.name) + ' 목소리' +
      (Speech.canListen() ? '' : ' · 말하기 채점은 크롬 계열에서 https 또는 localhost로 열었을 때 작동한다') + '</p>'));

    return wrap;
  }

  /* ---------- 모드(장면 목록) ---------- */

  function renderMode() {
    var p = packOf(view.mode);
    if (!p) return renderHome();
    var wrap = el('<div class="view"></div>');
    wrap.appendChild(topbar(p.icon + ' ' + p.title, function () { go({ name: 'home' }); }));
    wrap.appendChild(el('<p class="lead">' + esc(p.blurb) + '</p>'));

    if (p.meta) {
      var meta = el('<section class="card"><h3 class="sec-title">팩 정보</h3>' +
        '<p class="hint">버전 ' + esc(p.meta.version) + ' · 갱신 ' + esc(p.meta.updated) + ' · ' + esc(p.meta.source) + '</p></section>');
      var up = el('<button class="btn wide">최신 팩 불러오기</button>');
      up.onclick = openSlangImport;
      meta.appendChild(up);
      wrap.appendChild(meta);
    }

    var list = el('<div class="scene-list"></div>');
    p.scenes.forEach(function (sc, i) {
      var prog = Store.state.scenes[sc.id] || {};
      var dueCount = sc.expressions.filter(function (_, idx) {
        return SRS.isDue(SRS.cardId(p.id, sc.id, idx));
      }).length;
      var item = el(
        '<button class="card scene-item">' +
          '<span class="scene-no">' + String(i + 1).padStart(2, '0') + '</span>' +
          '<span class="scene-body">' +
            '<span class="scene-title">' + esc(sc.title) + '</span>' +
            '<span class="scene-en">' + esc(sc.titleEn) + '</span>' +
            '<span class="scene-sit">' + esc(sc.situation) + '</span>' +
          '</span>' +
          '<span class="scene-tags">' +
            (prog.studied ? UI.pill('학습함', 'done') : '') +
            (dueCount ? UI.pill('복습 ' + dueCount, 'due') : '') +
          '</span>' +
        '</button>'
      );
      item.onclick = function () { go({ name: 'scene', scene: sc.id, tab: 'dialogue' }); };
      list.appendChild(item);
    });
    wrap.appendChild(list);
    return wrap;
  }

  /* ---------- 장면 ---------- */

  function renderScene() {
    var p = packOf(view.mode);
    var sc = sceneOf(view.mode, view.scene);
    if (!sc) return renderHome();
    var wrap = el('<div class="view"></div>');
    wrap.appendChild(topbar(sc.title, function () { go({ name: 'mode' }); }));
    wrap.appendChild(el('<p class="lead">' + esc(sc.situation) + '</p>'));

    var tabs = el(
      '<div class="tabs">' +
        '<button data-t="dialogue">대화</button>' +
        '<button data-t="cards">표현 카드</button>' +
        '<button data-t="roleplay">롤플레이</button>' +
      '</div>'
    );
    Array.prototype.forEach.call(tabs.children, function (b) {
      if (b.dataset.t === view.tab) b.classList.add('on');
      b.onclick = function () { go({ tab: b.dataset.t }); };
    });
    wrap.appendChild(tabs);

    if (view.tab === 'dialogue') wrap.appendChild(renderDialogue(p, sc));
    if (view.tab === 'cards') wrap.appendChild(renderCards(p, sc));
    if (view.tab === 'roleplay') wrap.appendChild(renderRoleplay(p, sc));
    return wrap;
  }

  /* 대화 상대 목소리를 고르는 줄 — 어느 화면에서든 같은 모양으로 쓴다 */
  function personaRow(onChange) {
    var row = el('<div class="persona-row"></div>');
    PERSONAS.forEach(function (p) {
      var b = el('<button class="chip' + (Store.state.settings.persona === p.id ? ' on' : '') + '" title="' + esc(p.desc) + '">' +
        p.icon + ' ' + esc(p.name) + '</button>');
      b.onclick = function () {
        Store.state.settings.persona = p.id;
        Store.save();
        row.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        Speech.speak('This is the voice you picked. Ready when you are.');
        if (onChange) onChange(p);
      };
      row.appendChild(b);
    });
    return row;
  }

  /* ---------- 대화 ---------- */

  function renderDialogue(pack, scene) {
    var box = el('<div class="dialogue"></div>');
    var set = Store.state.settings;

    var ctrl = el(
      '<div class="ctrl-row">' +
        '<button class="btn" id="playAll">▶ 전체 듣기</button>' +
        '<button class="btn ghost" id="toggleKo">' + (set.hideKo ? '한글 보이기' : '한글 가리기') + '</button>' +
        '<button class="btn ghost" id="toggleDialect">' + esc(DIALECT.label(set.dialect)) + '</button>' +
        '<label class="speed">속도 <input type="range" min="0.6" max="1.1" step="0.05" value="' + (set.rate || 0.9) + '"></label>' +
      '</div>'
    );
    box.appendChild(ctrl);

    var pRow = el('<details class="persona-fold"><summary>대화 상대 목소리 — ' +
      esc((window.PERSONA_BY_ID[set.persona] || PERSONAS[0]).name) + '</summary></details>');
    pRow.appendChild(personaRow(function () { go({}); }));
    box.appendChild(pRow);

    var stopFlag = { v: false };
    ctrl.querySelector('#playAll').onclick = function (e) {
      var btn = e.currentTarget;
      if (btn.dataset.on === '1') { stopFlag.v = true; Speech.stop(); btn.dataset.on = ''; btn.textContent = '▶ 전체 듣기'; return; }
      btn.dataset.on = '1'; btn.textContent = '■ 정지';
      stopFlag.v = false;
      playSequence(scene.lines, 0, box, stopFlag, function () {
        btn.dataset.on = ''; btn.textContent = '▶ 전체 듣기';
      });
      markStudied(scene.id);
    };
    ctrl.querySelector('#toggleKo').onclick = function (e) {
      set.hideKo = !set.hideKo;
      Store.save();
      box.classList.toggle('hide-ko', set.hideKo);
      e.currentTarget.textContent = set.hideKo ? '한글 보이기' : '한글 가리기';
    };
    ctrl.querySelector('#toggleDialect').onclick = function () {
      set.dialect = set.dialect === 'gb' ? 'us' : 'gb';
      Store.save();
      toast(DIALECT.label(set.dialect) + '으로 바꿨다.');
      go({});
    };
    ctrl.querySelector('input[type=range]').oninput = function (e) {
      set.rate = parseFloat(e.target.value);
      Store.save();
    };
    if (set.hideKo) box.classList.add('hide-ko');

    scene.lines.forEach(function (line, i) {
      var mine = /^you$/i.test(line.s);
      var text = UI.en(line.en);
      var dnote = set.dialect === 'gb' ? DIALECT.noteFor(line.en) : null;
      var row = el(
        '<div class="line' + (mine ? ' mine' : '') + '" data-i="' + i + '">' +
          '<div class="line-head"><span class="who">' + esc(line.s) + '</span></div>' +
          '<p class="en">' + esc(text) + '</p>' +
          '<p class="ko">' + esc(line.ko) + '</p>' +
          (line.tip ? '<p class="tip">' + esc(line.tip) + '</p>' : '') +
          (dnote ? '<p class="tip">' + esc(dnote) + '</p>' : '') +
          '<div class="line-actions">' +
            '<button class="mini" data-a="play">🔊 듣기</button>' +
            '<button class="mini" data-a="slow">🐢 느리게</button>' +
            (Speech.canListen() ? '<button class="mini" data-a="say">🎤 따라 말하기</button>' : '') +
          '</div>' +
          '<div class="result"></div>' +
        '</div>'
      );
      row.querySelector('[data-a=play]').onclick = function () { Speech.speak(text); countLine(); };
      row.querySelector('[data-a=slow]').onclick = function () { Speech.speak(text, { rate: 0.62 }); };
      var sayBtn = row.querySelector('[data-a=say]');
      if (sayBtn) sayBtn.onclick = function () { shadow(text, row, sayBtn); };
      box.appendChild(row);
    });

    return box;
  }

  function playSequence(lines, i, box, stopFlag, done) {
    if (stopFlag.v || i >= lines.length) { done && done(); return; }
    var row = box.querySelector('.line[data-i="' + i + '"]');
    if (row) {
      box.querySelectorAll('.line.active').forEach(function (n) { n.classList.remove('active'); });
      row.classList.add('active');
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    Speech.speak(UI.en(lines[i].en)).then(function () {
      setTimeout(function () { playSequence(lines, i + 1, box, stopFlag, done); }, 420);
    });
  }

  function shadow(target, row, btn) {
    var res = row.querySelector('.result');
    res.innerHTML = '<span class="listening">듣고 있다… 지금 말해보자</span>';
    btn.classList.add('rec');
    Speech.listen({
      oninterim: function (t) { res.innerHTML = '<span class="listening">' + esc(t) + '</span>'; },
      onfinal: function (said) { res.innerHTML = ''; res.appendChild(scoreCard(target, said)); countLine(); },
      onerror: function (e) {
        res.innerHTML = '<span class="err">' +
          (e === 'not-allowed' ? '마이크 권한이 필요하다.' :
           e === 'no-speech' ? '소리가 안 잡혔다. 다시 한 번.' :
           e === 'unsupported' ? '이 브라우저에서는 말하기 채점이 안 된다.' : '인식에 실패했다. 다시 시도.') +
          '</span>';
      },
      onend: function () { btn.classList.remove('rec'); }
    });
  }

  function scoreCard(target, said) {
    var r = Speech.score(target, said);
    var cls = r.score >= 85 ? 'good' : r.score >= 60 ? 'ok' : 'bad';
    var html = r.parts.map(function (p) {
      return '<span class="' + (p.ok ? 'w-ok' : 'w-no') + '">' + esc(p.word) + '</span>';
    }).join(' ');
    var msg = r.score >= 85 ? '거의 그대로 나왔다.' : r.score >= 60 ? '통한다. 빨간 단어만 다시.' : '천천히 한 번 더 가보자.';
    return el(
      '<div class="score ' + cls + '">' +
        '<div class="score-top"><b>' + r.score + '점</b><span>' + msg + '</span></div>' +
        '<div class="score-words">' + html + '</div>' +
        '<div class="score-said">인식된 말: ' + esc(said) + '</div>' +
      '</div>'
    );
  }

  /* ---------- 표현 카드 ---------- */

  function renderCards(pack, scene) {
    var items = scene.expressions.map(function (ex, i) {
      return { id: SRS.cardId(pack.id, scene.id, i), ex: ex, scene: scene.title, icon: pack.icon, modeTitle: pack.title };
    });
    return cardDeck(items, function () {
      markStudied(scene.id);
      go({ tab: 'roleplay' });
    });
  }

  function cardDeck(items, onDone) {
    var idx = 0, revealed = false;
    var box = el('<div class="deck"></div>');

    function draw() {
      box.innerHTML = '';
      if (idx >= items.length) {
        var end = el(
          '<div class="card done-card">' +
            '<h3>' + items.length + '장 완료</h3>' +
            '<p>오늘 몫은 끝냈다. 내일 이 중 몇 장이 다시 올라온다.</p>' +
            '<button class="btn primary wide">다음으로</button>' +
          '</div>'
        );
        end.querySelector('button').onclick = onDone;
        box.appendChild(end);
        return;
      }
      var it = items[idx];
      var text = UI.en(it.ex.en);
      var dnote = Store.state.settings.dialect === 'gb' ? DIALECT.noteFor(it.ex.en) : null;
      var c = el(
        '<div class="card flashcard">' +
          '<div class="fc-meta">' + (it.icon || '') + ' ' + esc(it.scene || '') + '<span class="fc-count">' + (idx + 1) + ' / ' + items.length + '</span></div>' +
          '<p class="fc-en">' + esc(text) + '</p>' +
          '<div class="fc-back' + (revealed ? '' : ' hidden') + '">' +
            '<p class="fc-ko">' + esc(it.ex.ko) + '</p>' +
            '<p class="fc-note">' + esc(it.ex.note || '') + (dnote ? ' · ' + esc(dnote) : '') + '</p>' +
          '</div>' +
          '<div class="fc-actions"></div>' +
        '</div>'
      );
      var acts = c.querySelector('.fc-actions');

      var playBtn = el('<button class="mini">🔊 듣기</button>');
      playBtn.onclick = function () { Speech.speak(text); };
      acts.appendChild(playBtn);

      if (Speech.canListen()) {
        var sayBtn = el('<button class="mini">🎤 말해보기</button>');
        sayBtn.onclick = function () { shadow(text, c, sayBtn); };
        acts.appendChild(sayBtn);
      }

      if (!revealed) {
        var showBtn = el('<button class="btn wide">뜻 보기</button>');
        showBtn.onclick = function () { revealed = true; draw(); };
        c.appendChild(showBtn);
      } else {
        var grade = el(
          '<div class="grade-row">' +
            '<button class="btn bad">아직 애매</button>' +
            '<button class="btn good">입에서 나온다</button>' +
          '</div>'
        );
        grade.children[0].onclick = function () { SRS.grade(it.id, false); idx++; revealed = false; draw(); };
        grade.children[1].onclick = function () { SRS.grade(it.id, true); idx++; revealed = false; draw(); };
        c.appendChild(grade);
      }

      c.appendChild(el('<div class="result"></div>'));
      box.appendChild(c);
      Speech.speak(text);
    }

    draw();
    return box;
  }

  /* ---------- 롤플레이 ---------- */

  function renderRoleplay(pack, scene) {
    var box = el('<div class="roleplay"></div>');
    var roles = [];
    scene.lines.forEach(function (l) { if (roles.indexOf(l.s) < 0) roles.push(l.s); });
    var myRole = (session && session.scene === scene.id && session.role) || (roles.indexOf('You') >= 0 ? 'You' : roles[0]);

    var setup = el(
      '<div class="card setup">' +
        '<h3>어느 쪽을 맡을까</h3>' +
        '<div class="role-row"></div>' +
        '<h3 class="sec-title spaced">상대 목소리</h3>' +
        '<p class="hint">상대 대사는 자동으로 재생된다. 내 차례가 오면 마이크가 켜지고, 말한 문장이 채점된다.</p>' +
        '<button class="btn primary wide" id="startRp">롤플레이 시작</button>' +
      '</div>'
    );
    var rr = setup.querySelector('.role-row');
    roles.forEach(function (r) {
      var b = el('<button class="chip' + (r === myRole ? ' on' : '') + '">' + esc(r) + '</button>');
      b.onclick = function () {
        myRole = r;
        rr.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
      };
      rr.appendChild(b);
    });
    setup.insertBefore(personaRow(), setup.querySelector('.hint'));
    box.appendChild(setup);

    var stage = el('<div class="stage"></div>');
    box.appendChild(stage);

    setup.querySelector('#startRp').onclick = function () {
      session = { scene: scene.id, role: myRole, i: 0, scores: [] };
      stage.innerHTML = '';
      setup.classList.add('slim');
      runRoleplay(scene, myRole, stage);
      markStudied(scene.id);
    };

    if (!Speech.canListen()) {
      box.appendChild(el('<p class="note">마이크 인식이 없는 환경이면, 상대 대사를 듣고 소리 내어 따라 말하는 것만으로도 절반은 된다.</p>'));
    }
    return box;
  }

  function runRoleplay(scene, myRole, stage) {
    var i = session.i;
    if (i >= scene.lines.length) { finishRoleplay(scene, stage); return; }
    var line = scene.lines[i];
    var mine = line.s === myRole;
    var text = UI.en(line.en);

    var row = el(
      '<div class="rp-line' + (mine ? ' mine' : '') + '">' +
        '<span class="who">' + esc(line.s) + '</span>' +
        (mine ? '<p class="en cue">' + esc(line.ko) + '</p>' : '<p class="en">' + esc(text) + '</p>') +
        '<div class="result"></div>' +
      '</div>'
    );
    stage.appendChild(row);
    row.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (!mine) {
      Speech.speak(text).then(function () {
        session.i = i + 1;
        setTimeout(function () { runRoleplay(scene, myRole, stage); }, 350);
      });
      return;
    }

    var res = row.querySelector('.result');
    var help = el(
      '<div class="rp-help">' +
        '<button class="mini" data-a="peek">영어 보기</button>' +
        '<button class="mini" data-a="skip">넘기기</button>' +
      '</div>'
    );
    row.appendChild(help);
    help.querySelector('[data-a=peek]').onclick = function () {
      var cue = row.querySelector('.cue');
      if (cue) { cue.textContent = text; cue.classList.remove('cue'); }
      Speech.speak(text);
    };
    help.querySelector('[data-a=skip]').onclick = function () {
      Speech.stopListening();
      session.i = i + 1;
      runRoleplay(scene, myRole, stage);
    };

    if (!Speech.canListen()) {
      res.innerHTML = '<span class="listening">소리 내어 말한 뒤 "영어 보기"로 확인하고 넘기자.</span>';
      return;
    }

    res.innerHTML = '<span class="listening">🎤 말할 차례</span>';
    Speech.listen({
      oninterim: function (t) { res.innerHTML = '<span class="listening">' + esc(t) + '</span>'; },
      onfinal: function (said) {
        var r = Speech.score(text, said);
        session.scores.push(r.score);
        res.innerHTML = '';
        res.appendChild(scoreCard(text, said));
        var cue = row.querySelector('.cue');
        if (cue) { cue.textContent = text; cue.classList.remove('cue'); }
        countLine();
        session.i = i + 1;
        setTimeout(function () { runRoleplay(scene, myRole, stage); }, 1400);
      },
      onerror: function (e) {
        res.innerHTML = '<span class="err">' + (e === 'no-speech' ? '못 들었다. 다시 말하거나 넘기자.' : '인식 실패. 다시 시도하자.') + '</span>';
      }
    });
  }

  function finishRoleplay(scene, stage) {
    var sc = session.scores;
    var avg = sc.length ? Math.round(sc.reduce(function (a, b) { return a + b; }, 0) / sc.length) : null;
    var card = el(
      '<div class="card done-card">' +
        '<h3>장면 완주</h3>' +
        (avg != null ? '<p class="big-score">' + avg + '점</p><p>' +
          (avg >= 85 ? '이 장면은 몸에 붙었다. 다음 장면으로.' :
           avg >= 60 ? '통하는 수준이다. 한 번 더 돌리면 훨씬 매끄러워진다.' :
           '아직 문장이 입에 안 붙었다. 대화 탭에서 쉐도잉부터 다시.') + '</p>' : '<p>수고했다.</p>') +
        '<div class="grade-row">' +
          '<button class="btn">한 번 더</button>' +
          '<button class="btn primary">표현 카드로</button>' +
        '</div>' +
      '</div>'
    );
    card.querySelectorAll('button')[0].onclick = function () {
      session.i = 0; session.scores = [];
      stage.innerHTML = '';
      runRoleplay(scene, session.role, stage);
    };
    card.querySelectorAll('button')[1].onclick = function () { go({ tab: 'cards' }); };
    stage.appendChild(card);
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    Store.touchStreak();
  }

  /* ---------- 복습 ---------- */

  function startReview() {
    var q = SRS.dueQueue(20);
    if (!q.length) {
      q = [];
      Object.keys(window.PACKS).some(function (mid) {
        var p = window.PACKS[mid];
        return p.scenes.some(function (s) {
          return s.expressions.some(function (ex, i) {
            var id = SRS.cardId(mid, s.id, i);
            if (!Store.state.cards[id]) q.push({ id: id, ex: ex, scene: s.title, icon: p.icon });
            return q.length >= 12;
          });
        });
      });
    }
    if (!q.length) { toast('모든 표현을 익혔다. 오늘은 롤플레이나 듣기 시험으로 가보자.'); return; }
    startDeck(q, '오늘의 복습');
  }

  function startDeck(items, title) {
    session = { queue: items, title: title || '복습' };
    go({ name: 'review' });
  }

  function renderReview() {
    if (!session || !session.queue) { view.name = 'home'; return renderHome(); }
    var wrap = el('<div class="view"></div>');
    wrap.appendChild(topbar(session.title || '오늘의 복습', function () { go({ name: 'home' }); }));
    wrap.appendChild(el('<p class="lead">뜻을 먼저 떠올리고, 소리 내어 말한 다음 확인하자.</p>'));
    wrap.appendChild(cardDeck(session.queue, function () { go({ name: 'home' }); }));
    return wrap;
  }

  /* ---------- 기록 ---------- */

  function markStudied(sceneId) {
    Store.state.scenes[sceneId] = { studied: true, lastAt: Date.now() };
    Store.touchStreak();
    Store.save();
  }

  function countLine() {
    Store.state.daily.lines += 1;
    Store.touchStreak();
    Store.save();
  }

  /* ---------- 설정 ---------- */

  function openSettings() {
    var s = Store.state.settings;
    var voices = Speech.listVoices();
    var opts = ['<option value="">자동 선택</option>'].concat(voices.map(function (v) {
      return '<option value="' + esc(v.name) + '"' + (s.voice === v.name ? ' selected' : '') + '>' + esc(v.name) + ' (' + v.lang + ')</option>';
    })).join('');

    var back = el('<div class="modal-back"></div>');
    var m = el(
      '<div class="modal card">' +
        '<h3>설정</h3>' +
        '<label class="field">발음 기준' +
          '<select id="dsel">' +
            '<option value="us"' + (s.dialect === 'us' ? ' selected' : '') + '>미국식 (American)</option>' +
            '<option value="gb"' + (s.dialect === 'gb' ? ' selected' : '') + '>영국식 (British)</option>' +
          '</select></label>' +
        '<label class="field">화면 테마' +
          '<select id="tsel">' +
            '<option value="auto"' + (s.theme === 'auto' ? ' selected' : '') + '>모드별 자동 (고대~미래)</option>' +
            '<option value="ancient"' + (s.theme === 'ancient' ? ' selected' : '') + '>고대 — 파피루스</option>' +
            '<option value="medieval"' + (s.theme === 'medieval' ? ' selected' : '') + '>중세 — 필사본</option>' +
            '<option value="deco"' + (s.theme === 'deco' ? ' selected' : '') + '>근대 — 아르데코</option>' +
            '<option value="modern"' + (s.theme === 'modern' ? ' selected' : '') + '>현대 — 편집실</option>' +
            '<option value="future"' + (s.theme === 'future' ? ' selected' : '') + '>미래 — 네온</option>' +
          '</select></label>' +
        '<label class="field">목소리<select id="vsel">' + opts + '</select></label>' +
        '<label class="field">말하기 속도 <b id="rlab">' + (s.rate || 0.9) + '</b>' +
          '<input id="rsel" type="range" min="0.6" max="1.1" step="0.05" value="' + (s.rate || 0.9) + '"></label>' +
        '<label class="field">하루 목표 (카드)' +
          '<input id="gsel" type="number" min="4" max="60" value="' + (Store.state.daily.goal || 12) + '"></label>' +
        '<div class="grade-row">' +
          '<button class="btn" id="slang">신조어 팩 갱신</button>' +
          '<button class="btn" id="digest">오늘 몫 내보내기</button>' +
        '</div>' +
        '<div class="grade-row">' +
          '<button class="btn bad" id="reset">기록 초기화</button>' +
          '<button class="btn primary" id="close">닫기</button>' +
        '</div>' +
      '</div>'
    );
    back.appendChild(m);
    document.body.appendChild(back);

    m.querySelector('#dsel').onchange = function (e) {
      s.dialect = e.target.value; Store.save();
      Speech.speak('This is the accent you selected.');
    };
    m.querySelector('#tsel').onchange = function (e) { s.theme = e.target.value; Store.save(); applyTheme(); };
    m.querySelector('#vsel').onchange = function (e) {
      s.voice = e.target.value || null; Store.save();
      Speech.speak('This is how I sound. Let us get to work.');
    };
    m.querySelector('#rsel').oninput = function (e) {
      s.rate = parseFloat(e.target.value);
      m.querySelector('#rlab').textContent = s.rate;
      Store.save();
    };
    m.querySelector('#gsel').onchange = function (e) {
      Store.state.daily.goal = Math.max(4, Math.min(60, parseInt(e.target.value, 10) || 12));
      Store.save();
    };
    m.querySelector('#slang').onclick = function () { back.remove(); openSlangImport(); };
    m.querySelector('#digest').onclick = function () { VIEWS.copyText(VIEWS.buildDigest()); };
    m.querySelector('#close').onclick = function () { back.remove(); go({}); };
    m.querySelector('#reset').onclick = function () {
      if (confirm('학습 기록을 모두 지운다. 되돌릴 수 없다.')) {
        Store.reset(); back.remove(); boot(); go({ name: 'home' });
      }
    };
    back.onclick = function (e) { if (e.target === back) { back.remove(); go({}); } };
  }

  /* 신조어 팩 갱신 — URL로 받아오거나 JSON을 직접 붙여넣는다 */
  function openSlangImport() {
    var cur = Store.state.slang || window.SLANG;
    var back = el('<div class="modal-back"></div>');
    var m = el(
      '<div class="modal card">' +
        '<h3>신조어 팩 갱신</h3>' +
        '<p class="hint">현재 버전 ' + esc(cur.version) + ' · ' + esc(cur.updated) + ' · ' + esc(cur.source) + '</p>' +
        '<label class="field">팩 주소 (JSON)<input id="purl" type="text" placeholder="https://example.com/slang.json"></label>' +
        '<label class="field">또는 JSON 직접 붙여넣기<textarea id="pjson" rows="6" placeholder=\'{"version":2,"updated":"2026-10-01","source":"직접 추가","items":[{"en":"...","ko":"...","note":"...","register":"work"}]}\'></textarea></label>' +
        '<div class="grade-row">' +
          '<button class="btn" id="pload">주소에서 불러오기</button>' +
          '<button class="btn primary" id="papply">붙여넣은 것 적용</button>' +
        '</div>' +
        '<div class="grade-row">' +
          '<button class="btn bad" id="pdefault">기본 팩으로 되돌리기</button>' +
          '<button class="btn" id="pclose">닫기</button>' +
        '</div>' +
      '</div>'
    );
    back.appendChild(m);
    document.body.appendChild(back);

    function apply(pack, source) {
      if (!pack || !Array.isArray(pack.items) || !pack.items.length) { toast('형식이 맞지 않는다. items 배열이 필요하다.'); return; }
      pack.source = pack.source || source || '사용자 팩';
      pack.version = pack.version || (cur.version + 1);
      pack.updated = pack.updated || Store.today();
      Store.state.slang = pack;
      Store.save();
      boot();
      back.remove();
      toast('신조어 팩을 버전 ' + pack.version + '으로 갱신했다.');
      go({ name: 'mode', mode: 'slang' });
    }

    m.querySelector('#pload').onclick = function () {
      var url = m.querySelector('#purl').value.trim();
      if (!url) { toast('주소를 넣자.'); return; }
      fetch(url).then(function (r) { return r.json(); })
        .then(function (j) { apply(j, url); })
        .catch(function () { toast('불러오지 못했다. 주소나 CORS 설정을 확인하자.'); });
    };
    m.querySelector('#papply').onclick = function () {
      try { apply(JSON.parse(m.querySelector('#pjson').value), '붙여넣기'); }
      catch (e) { toast('JSON을 읽지 못했다. 대괄호와 따옴표를 확인하자.'); }
    };
    m.querySelector('#pdefault').onclick = function () {
      Store.state.slang = null; Store.save(); boot(); back.remove();
      toast('기본 팩으로 되돌렸다.');
      go({});
    };
    m.querySelector('#pclose').onclick = function () { back.remove(); go({}); };
    back.onclick = function (e) { if (e.target === back) { back.remove(); go({}); } };
  }

  /* ---------- 렌더 ---------- */

  function render() {
    applyTheme();
    app.innerHTML = '';
    var node;
    switch (view.name) {
      case 'home': node = renderHome(); break;
      case 'mode': node = renderMode(); break;
      case 'scene': node = renderScene(); break;
      case 'review': node = renderReview(); break;
      case 'schedule': node = VIEWS.schedule(); break;
      case 'exam': node = VIEWS.examHome(); break;
      case 'exam-run': node = VIEWS.examRun(); break;
      case 'grammar': node = VIEWS.grammarHome(); break;
      case 'drill': node = VIEWS.drillRun(); break;
      case 'studio': node = VIEWS.studio(); break;
      default: node = renderHome();
    }
    app.appendChild(node);
  }

  /* 저장된 데이터에서 파생 모드를 다시 만든다 (초기화·팩 갱신 후에도 호출) */
  function boot() {
    ['hooks', 'slang', 'mine'].forEach(function (k) { delete window.PACKS[k]; });
    window.buildDerivedPacks();
    GENERATOR.rebuildPack();
  }

  window.App = { go: go, topbar: topbar, cardDeck: cardDeck, startDeck: startDeck, scoreCard: scoreCard };

  Store.load();
  boot();
  render();

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { Speech.stop(); Speech.stopListening(); }
  });
})();
