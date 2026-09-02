/* 화면과 학습 흐름 전체를 담당한다. */
(function () {
  'use strict';

  var app = document.getElementById('app');
  var view = { name: 'home', mode: null, scene: null, tab: 'dialogue' };
  var session = null; // 롤플레이/복습 진행 상태

  /* ---------- 유틸 ---------- */

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function packOf(id) { return window.PACKS[id]; }

  function sceneOf(modeId, sceneId) {
    return packOf(modeId).scenes.find(function (s) { return s.id === sceneId; });
  }

  function go(next) {
    Speech.stop();
    Speech.stopListening();
    Object.assign(view, next);
    render();
    window.scrollTo(0, 0);
  }

  function toast(msg) {
    var t = el('<div class="toast">' + esc(msg) + '</div>');
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('out'); }, 1800);
    setTimeout(function () { t.remove(); }, 2200);
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

    // 한 세션은 20장까지. 밀린 게 100장이어도 오늘 할 몫만 보여준다.
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
    goal.querySelector('#startReview').onclick = function () { startReview(); };
    wrap.appendChild(goal);

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

    if (!Speech.canListen()) {
      wrap.appendChild(el(
        '<p class="note">말하기 채점은 크롬 계열 브라우저에서, 그리고 https 또는 localhost로 열었을 때 작동한다. ' +
        '파일을 직접 열면 듣기와 카드 학습만 가능하다.</p>'
      ));
    }

    return wrap;
  }

  /* ---------- 모드(장면 목록) ---------- */

  function renderMode() {
    var p = packOf(view.mode);
    var wrap = el('<div class="view"></div>');
    wrap.appendChild(topbar(p.icon + ' ' + p.title, function () { go({ name: 'home' }); }));
    wrap.appendChild(el('<p class="lead">' + esc(p.blurb) + '</p>'));

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
            (prog.studied ? '<em class="tag done">학습함</em>' : '') +
            (dueCount ? '<em class="tag due">복습 ' + dueCount + '</em>' : '') +
          '</span>' +
        '</button>'
      );
      item.onclick = function () { go({ name: 'scene', scene: sc.id, tab: 'dialogue' }); };
      list.appendChild(item);
    });
    wrap.appendChild(list);
    return wrap;
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

  /* ---------- 장면 ---------- */

  function renderScene() {
    var p = packOf(view.mode);
    var sc = sceneOf(view.mode, view.scene);
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

  /* ---------- 대화 (듣기 + 쉐도잉) ---------- */

  function renderDialogue(pack, scene) {
    var box = el('<div class="dialogue"></div>');

    var ctrl = el(
      '<div class="ctrl-row">' +
        '<button class="btn" id="playAll">▶ 전체 듣기</button>' +
        '<button class="btn ghost" id="toggleKo">' + (Store.state.settings.hideKo ? '한글 보이기' : '한글 가리기') + '</button>' +
        '<label class="speed">속도 <input type="range" min="0.6" max="1.1" step="0.05" value="' + (Store.state.settings.rate || 0.9) + '"></label>' +
      '</div>'
    );
    box.appendChild(ctrl);

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
      Store.state.settings.hideKo = !Store.state.settings.hideKo;
      Store.save();
      box.classList.toggle('hide-ko', Store.state.settings.hideKo);
      e.currentTarget.textContent = Store.state.settings.hideKo ? '한글 보이기' : '한글 가리기';
    };
    ctrl.querySelector('input[type=range]').oninput = function (e) {
      Store.state.settings.rate = parseFloat(e.target.value);
      Store.save();
    };

    if (Store.state.settings.hideKo) box.classList.add('hide-ko');

    scene.lines.forEach(function (line, i) {
      var mine = /^you$/i.test(line.s);
      var row = el(
        '<div class="line' + (mine ? ' mine' : '') + '" data-i="' + i + '">' +
          '<div class="line-head"><span class="who">' + esc(line.s) + '</span></div>' +
          '<p class="en">' + esc(line.en) + '</p>' +
          '<p class="ko">' + esc(line.ko) + '</p>' +
          (line.tip ? '<p class="tip">' + esc(line.tip) + '</p>' : '') +
          '<div class="line-actions">' +
            '<button class="mini" data-a="play">🔊 듣기</button>' +
            '<button class="mini" data-a="slow">🐢 느리게</button>' +
            (Speech.canListen() ? '<button class="mini" data-a="say">🎤 따라 말하기</button>' : '') +
          '</div>' +
          '<div class="result"></div>' +
        '</div>'
      );
      row.querySelector('[data-a=play]').onclick = function () {
        Speech.speak(line.en);
        countLine(scene.id);
      };
      row.querySelector('[data-a=slow]').onclick = function () {
        Speech.speak(line.en, { rate: 0.65 });
      };
      var sayBtn = row.querySelector('[data-a=say]');
      if (sayBtn) sayBtn.onclick = function () { shadow(line.en, row, sayBtn); };
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
    Speech.speak(lines[i].en).then(function () {
      setTimeout(function () { playSequence(lines, i + 1, box, stopFlag, done); }, 420);
    });
  }

  /* 한 문장 따라 말하고 채점받기 */
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

  /* 카드 덱 — 장면 학습과 전체 복습이 같은 UI를 쓴다 */
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
      var c = el(
        '<div class="card flashcard">' +
          '<div class="fc-meta">' + (it.icon || '') + ' ' + esc(it.scene || '') + '<span class="fc-count">' + (idx + 1) + ' / ' + items.length + '</span></div>' +
          '<p class="fc-en">' + esc(it.ex.en) + '</p>' +
          '<div class="fc-back' + (revealed ? '' : ' hidden') + '">' +
            '<p class="fc-ko">' + esc(it.ex.ko) + '</p>' +
            '<p class="fc-note">' + esc(it.ex.note || '') + '</p>' +
          '</div>' +
          '<div class="fc-actions"></div>' +
        '</div>'
      );
      var acts = c.querySelector('.fc-actions');

      var playBtn = el('<button class="mini">🔊 듣기</button>');
      playBtn.onclick = function () { Speech.speak(it.ex.en); };
      acts.appendChild(playBtn);

      if (Speech.canListen()) {
        var sayBtn = el('<button class="mini">🎤 말해보기</button>');
        sayBtn.onclick = function () { shadow(it.ex.en, c, sayBtn); };
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

      if (!c.querySelector('.result')) c.appendChild(el('<div class="result"></div>'));
      box.appendChild(c);
      Speech.speak(it.ex.en);
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

    var row = el(
      '<div class="rp-line' + (mine ? ' mine' : '') + '">' +
        '<span class="who">' + esc(line.s) + '</span>' +
        (mine ? '<p class="en cue">' + esc(line.ko) + '</p>' : '<p class="en">' + esc(line.en) + '</p>') +
        '<div class="result"></div>' +
      '</div>'
    );
    stage.appendChild(row);
    row.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (!mine) {
      Speech.speak(line.en).then(function () {
        session.i = i + 1;
        setTimeout(function () { runRoleplay(scene, myRole, stage); }, 350);
      });
      return;
    }

    // 내 차례 — 한국어 힌트만 보여주고 영어를 스스로 만들게 한다
    var res = row.querySelector('.result');
    var help = el(
      '<div class="rp-help">' +
        '<button class="mini" data-a="peek">영어 보기</button>' +
        '<button class="mini" data-a="skip">넘기기</button>' +
      '</div>'
    );
    row.appendChild(help);
    help.querySelector('[data-a=peek]').onclick = function () {
      row.querySelector('.cue').textContent = line.en;
      row.querySelector('.cue').classList.remove('cue');
      Speech.speak(line.en);
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
        var r = Speech.score(line.en, said);
        session.scores.push(r.score);
        res.innerHTML = '';
        res.appendChild(scoreCard(line.en, said));
        var cue = row.querySelector('.cue');
        if (cue) { cue.textContent = line.en; cue.classList.remove('cue'); }
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

  /* ---------- 복습 세션 ---------- */

  function startReview() {
    var q = SRS.dueQueue(20);
    if (!q.length) {
      // 밀린 게 없으면 아직 안 본 표현을 새로 꺼내온다
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
    if (!q.length) { toast('모든 표현을 익혔다. 오늘은 장면 롤플레이를 해보자.'); return; }
    session = { queue: q };   // 화면을 그리기 전에 큐부터 채워둔다
    go({ name: 'review' });
  }

  function renderReview() {
    if (!session || !session.queue) { view.name = 'home'; return renderHome(); }
    var wrap = el('<div class="view"></div>');
    wrap.appendChild(topbar('오늘의 복습', function () { go({ name: 'home' }); }));
    wrap.appendChild(el('<p class="lead">뜻을 먼저 떠올리고, 소리 내어 말한 다음 확인하자.</p>'));
    wrap.appendChild(cardDeck(session.queue, function () { go({ name: 'home' }); }));
    return wrap;
  }

  /* ---------- 진행 기록 ---------- */

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
        '<label class="field">목소리<select id="vsel">' + opts + '</select></label>' +
        '<label class="field">말하기 속도 <b id="rlab">' + (s.rate || 0.9) + '</b>' +
          '<input id="rsel" type="range" min="0.6" max="1.1" step="0.05" value="' + (s.rate || 0.9) + '"></label>' +
        '<label class="field">하루 목표 (카드)' +
          '<input id="gsel" type="number" min="4" max="60" value="' + (Store.state.daily.goal || 12) + '"></label>' +
        '<div class="grade-row">' +
          '<button class="btn bad" id="reset">기록 초기화</button>' +
          '<button class="btn primary" id="close">닫기</button>' +
        '</div>' +
      '</div>'
    );
    back.appendChild(m);
    document.body.appendChild(back);

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
    m.querySelector('#close').onclick = function () { back.remove(); render(); };
    m.querySelector('#reset').onclick = function () {
      if (confirm('학습 기록을 모두 지운다. 되돌릴 수 없다.')) { Store.reset(); back.remove(); go({ name: 'home' }); }
    };
    back.onclick = function (e) { if (e.target === back) { back.remove(); render(); } };
  }

  /* ---------- 렌더 ---------- */

  function render() {
    app.innerHTML = '';
    var node;
    if (view.name === 'home') node = renderHome();
    else if (view.name === 'mode') node = renderMode();
    else if (view.name === 'scene') node = renderScene();
    else if (view.name === 'review') node = renderReview();
    app.appendChild(node);
  }

  Store.load();
  render();

  // 화면을 벗어나면 소리부터 끈다
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { Speech.stop(); Speech.stopListening(); }
  });
})();
