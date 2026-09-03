/* 추가 모드들 — 학습 점검, 듣기 시험, 문법 드릴, 피칭 스튜디오, 내보내기.
 * 화면 이동과 카드 덱은 App(app.js)이 제공하는 것을 그대로 쓴다. */
window.VIEWS = (function () {
  'use strict';

  var el = UI.el, esc = UI.esc;

  /* ============ 학습 일정 체크 및 점검 ============ */

  function schedule() {
    var st = SRS.stats();
    var s = Store.state;
    var wrap = el('<div class="view"></div>');
    wrap.appendChild(App.topbar('학습 점검', function () { App.go({ name: 'home' }); }));
    wrap.appendChild(el('<p class="lead">지난 기록과 앞으로의 부담을 한 화면에서 본다. 계획은 감이 아니라 숫자로 세운다.</p>'));

    // 이번 주 정확도
    var week = s.log.slice(0, 6).concat([{ cards: s.daily.cards, correct: s.daily.correct, wrong: s.daily.wrong }]);
    var wc = week.reduce(function (a, r) { return a + (r.correct || 0); }, 0);
    var ww = week.reduce(function (a, r) { return a + (r.wrong || 0); }, 0);
    var acc = (wc + ww) ? Math.round((wc / (wc + ww)) * 100) : null;

    wrap.appendChild(el(
      '<section class="stat-row">' +
        '<div class="stat"><span class="stat-num">' + s.streak.count + '</span><span class="stat-label">연속 학습일</span></div>' +
        '<div class="stat"><span class="stat-num">' + s.streak.best + '</span><span class="stat-label">최고 기록</span></div>' +
        '<div class="stat"><span class="stat-num">' + (acc == null ? '—' : acc + '%') + '</span><span class="stat-label">최근 7일 정확도</span></div>' +
      '</section>'
    ));

    var heat = el('<section class="card"><h3 class="sec-title">최근 8주</h3></section>');
    heat.appendChild(UI.heatmap(8));
    heat.appendChild(el('<p class="hint">빈칸이 이어진 구간이 곧 다시 무너진 지점이다. 하루 5분이라도 칸을 채우는 편이 몰아치기보다 낫다.</p>'));
    wrap.appendChild(heat);

    // 박스 분포
    var spread = SRS.boxSpread();
    var box = el('<section class="card"><h3 class="sec-title">기억 단계 분포</h3></section>');
    box.appendChild(UI.barChart(spread, ['1', '2', '3', '4', '5']));
    var weakSide = spread[0] + spread[1], strongSide = spread[3] + spread[4];
    box.appendChild(el('<p class="hint">' +
      (spread.reduce(function (a, b) { return a + b; }, 0) === 0
        ? '아직 데이터가 없다. 카드를 한 세트만 돌려도 여기가 채워진다.'
        : weakSide > strongSide * 2
          ? '1~2단계에 몰려 있다. 새 표현을 늘리기보다 같은 카드를 며칠 더 돌리는 편이 낫다.'
          : '분포가 오른쪽으로 밀리고 있다. 새 장면을 열어도 좋은 상태다.') +
      '</p>'));
    wrap.appendChild(box);

    // 향후 14일 예보
    var fc = SRS.forecast(14);
    var labels = fc.map(function (_, i) { return i === 0 ? '오늘' : (i % 2 === 0 ? '+' + i : ''); });
    var fcard = el('<section class="card"><h3 class="sec-title">앞으로 14일 복습량</h3></section>');
    fcard.appendChild(UI.barChart(fc, labels));
    var peak = Math.max.apply(null, fc);
    fcard.appendChild(el('<p class="hint">' +
      (peak > 40 ? '하루 ' + peak + '장이 몰리는 날이 있다. 오늘 조금 더 해두면 그 봉우리가 낮아진다.'
                 : '봉우리가 완만하다. 지금 속도를 유지하면 된다.') +
      '</p>'));
    wrap.appendChild(fcard);

    // 약한 표현
    var weak = SRS.weakest(10);
    var wcard = el('<section class="card"><h3 class="sec-title">가장 자주 놓친 표현</h3></section>');
    if (!weak.length) {
      wcard.appendChild(el('<p class="hint">아직 틀린 기록이 없다. 카드를 돌리다 보면 여기에 진짜 약점이 쌓인다.</p>'));
    } else {
      var list = el('<div class="weak-list"></div>');
      weak.forEach(function (w) {
        var row = el(
          '<div class="weak-row">' +
            '<span class="weak-en">' + esc(UI.en(w.info.ex.en)) + '</span>' +
            '<span class="weak-ko">' + esc(w.info.ex.ko) + '</span>' +
            '<span class="weak-meta">' + w.wrong + '회 놓침 · ' + w.box + '단계</span>' +
          '</div>'
        );
        row.onclick = function () { Speech.speak(UI.en(w.info.ex.en)); };
        list.appendChild(row);
      });
      wcard.appendChild(list);
      var retry = el('<button class="btn wide">이 표현만 모아 다시 보기</button>');
      retry.onclick = function () {
        App.startDeck(weak.map(function (w) { return w.info; }), '약점 집중');
      };
      wcard.appendChild(retry);
    }
    wrap.appendChild(wcard);

    // 오늘의 처방
    var plan = el('<section class="card"><h3 class="sec-title">오늘의 처방</h3></section>');
    plan.appendChild(el('<ul class="plan-list">' +
      '<li>복습 대기 <b>' + st.due + '장</b> 중 오늘 몫은 <b>' + Math.min(st.due, 20) + '장</b>.</li>' +
      '<li>' + (s.streak.count === 0 ? '오늘 한 장면만 열어도 스트릭이 다시 시작된다.'
              : s.streak.count < 7 ? '연속 ' + s.streak.count + '일. 7일을 넘기면 습관 쪽으로 넘어간다.'
              : '연속 ' + s.streak.count + '일. 이 리듬이 실력을 만든다.') + '</li>' +
      '<li>' + (st.mastered < 10 ? '4단계 이상 표현이 ' + st.mastered + '개. 30개를 넘기면 말이 눈에 띄게 빨라진다.'
              : '4단계 이상 ' + st.mastered + '개. 롤플레이로 실전 감각을 얹을 때다.') + '</li>' +
      '</ul>'));
    wrap.appendChild(plan);

    // 내보내기
    var ex = el('<section class="card"><h3 class="sec-title">오늘 몫 내보내기</h3>' +
      '<p class="hint">복습할 표현을 텍스트로 뽑아 메일이나 메신저로 보낸다. 휴대폰에서 앱을 못 열 때 쓰는 우회로다.</p></section>');
    var row = el('<div class="grade-row"></div>');
    var copyBtn = el('<button class="btn">클립보드로 복사</button>');
    var mailBtn = el('<button class="btn primary">메일로 보내기</button>');
    copyBtn.onclick = function () { copyText(buildDigest()); };
    mailBtn.onclick = function () { mailDigest(); };
    row.appendChild(copyBtn); row.appendChild(mailBtn);
    ex.appendChild(row);
    var dl = el('<button class="btn ghost wide">텍스트 파일로 저장</button>');
    dl.onclick = function () { downloadText('english-' + Store.today() + '.txt', buildDigest()); };
    ex.appendChild(dl);
    wrap.appendChild(ex);

    return wrap;
  }

  /* ---- 내보내기 도구 ---- */

  function buildDigest() {
    var q = SRS.dueQueue(20);
    var lines = ['[오늘의 영어 ' + Store.today() + ']', ''];
    if (!q.length) {
      lines.push('오늘 복습할 표현이 없다. 새 장면을 열 차례.');
    } else {
      q.forEach(function (it, i) {
        lines.push((i + 1) + '. ' + UI.en(it.ex.en));
        lines.push('   ' + it.ex.ko);
        if (it.ex.note) lines.push('   · ' + it.ex.note);
        lines.push('');
      });
    }
    var s = Store.state;
    lines.push('---');
    lines.push('연속 학습 ' + s.streak.count + '일 · 대기 ' + SRS.stats().due + '장 · ' + DIALECT.label(s.settings.dialect));
    return lines.join('\n');
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { UI.toast('복사했다. 메신저에 붙여넣으면 된다.'); },
        function () { fallbackCopy(text); }
      );
    } else fallbackCopy(text);
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); UI.toast('복사했다.'); }
    catch (e) { UI.toast('복사가 막혔다. 텍스트 파일로 저장해서 옮기자.'); }
    ta.remove();
  }

  function mailDigest() {
    var body = buildDigest();
    var url = 'mailto:?subject=' + encodeURIComponent('오늘의 영어 ' + Store.today()) +
              '&body=' + encodeURIComponent(body);
    if (url.length > 1800) {
      copyText(body);
      UI.toast('분량이 많아 메일 대신 복사했다. 붙여넣어 보내자.');
      return;
    }
    window.location.href = url;
  }

  function downloadText(name, text) {
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* ---- 학습 기록 백업과 복원 ----
   * 기록이 이 기기의 localStorage에만 있다는 건, 폰을 바꾸거나 사이트 데이터를 지우면
   * 그동안 쌓은 게 통째로 사라진다는 뜻이다. 파일 하나로 들고 다닐 수 있게 해둔다. */

  function backupState() {
    var payload = {
      app: 'hykai-english',
      backupVersion: 1,
      exportedAt: new Date().toISOString(),
      state: Store.state
    };
    downloadText('english-backup-' + Store.today() + '.json', JSON.stringify(payload, null, 2));
    UI.toast('백업 파일을 저장했다. 메일로 보내두면 안전하다.');
  }

  function looksLikeState(s) {
    return !!(s && typeof s === 'object' &&
      s.cards && typeof s.cards === 'object' &&
      s.settings && typeof s.settings === 'object' &&
      s.daily && typeof s.daily === 'object');
  }

  function restoreState(onDone) {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.onchange = function () {
      var file = input.files && input.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        var parsed;
        try { parsed = JSON.parse(reader.result); }
        catch (e) { UI.toast('파일을 읽지 못했다. 백업 파일이 맞는지 확인하자.'); return; }

        // 백업 파일이면 state를 꺼내고, 예전 형식이면 그 자체를 상태로 본다
        var incoming = parsed && parsed.state ? parsed.state : parsed;
        if (!looksLikeState(incoming)) { UI.toast('이 앱의 백업 파일이 아니다.'); return; }

        var cardCount = Object.keys(incoming.cards).length;
        var when = parsed.exportedAt ? parsed.exportedAt.slice(0, 10) : '날짜 미상';
        if (!confirm(when + ' 백업 (' + cardCount + '장)으로 되돌린다.\n지금 이 기기의 기록은 사라진다. 계속할까?')) return;

        try {
          localStorage.setItem('hykai-english-v1', JSON.stringify(incoming));
        } catch (e) {
          UI.toast('저장 공간이 부족해 복원하지 못했다.');
          return;
        }
        if (onDone) onDone();
        location.reload();
      };
      reader.readAsText(file);
    };
    input.click();
  }

  /* ============ 듣기 시험 ============ */

  var exam = null;

  function examHome() {
    var wrap = el('<div class="view"></div>');
    wrap.appendChild(App.topbar('듣기 시험', function () { App.go({ name: 'home' }); }));
    wrap.appendChild(el('<p class="lead">토익 듣기 유형(Part 2·3·4)으로 만든 자체 문제다. 지문은 화면에 없다. 소리만 듣고 고른다.</p>'));

    var sets = [
      { id: 'p2', title: 'Part 2 — 질문·응답', n: EXAM.part2.length + '문항', desc: '한 문장을 듣고 가장 알맞은 응답을 고른다. 의문사 판별이 전부다.' },
      { id: 'p3', title: 'Part 3 — 짧은 대화', n: EXAM.part3.length * 3 + '문항', desc: '두 사람의 대화를 듣고 세 문제를 푼다. 문제를 먼저 읽는 습관이 점수를 만든다.' },
      { id: 'p4', title: 'Part 4 — 짧은 담화', n: EXAM.part4.length * 2 + '문항', desc: '안내 방송과 음성 메시지. 목적 → 세부 → 요청 순으로 흐른다.' },
      { id: 'all', title: '전체 모의고사', n: (EXAM.part2.length + EXAM.part3.length * 3 + EXAM.part4.length * 2) + '문항', desc: '한 번에 이어서 푼다. 실제 시험처럼 되돌아갈 수 없다.' }
    ];

    var list = el('<div class="scene-list"></div>');
    sets.forEach(function (s, i) {
      var it = el(
        '<button class="card scene-item">' +
          '<span class="scene-no">' + String(i + 1).padStart(2, '0') + '</span>' +
          '<span class="scene-body">' +
            '<span class="scene-title">' + esc(s.title) + '</span>' +
            '<span class="scene-en">' + esc(s.n) + '</span>' +
            '<span class="scene-sit">' + esc(s.desc) + '</span>' +
          '</span>' +
        '</button>'
      );
      it.onclick = function () { startExam(s.id); };
      list.appendChild(it);
    });
    wrap.appendChild(list);

    var past = Store.state.exams.slice(0, 5);
    if (past.length) {
      var h = el('<section class="card"><h3 class="sec-title">지난 응시</h3></section>');
      past.forEach(function (r) {
        h.appendChild(el('<div class="weak-row"><span class="weak-en">' + esc(r.set) + '</span>' +
          '<span class="weak-meta">' + r.day + ' · ' + r.correct + '/' + r.total + ' (' + Math.round(r.correct / r.total * 100) + '%)</span></div>'));
      });
      wrap.appendChild(h);
    }

    wrap.appendChild(el('<p class="note">듣기 시험은 내레이터 목소리로 재생된다. 인물 목소리는 설정에서 바꿔도 여기서는 또렷한 발음이 우선이다.</p>'));
    return wrap;
  }

  /* 문제 목록을 평평하게 펴서 하나의 흐름으로 만든다 */
  function buildExamQueue(setId) {
    var q = [];
    if (setId === 'p2' || setId === 'all') {
      EXAM.part2.forEach(function (item) {
        q.push({ kind: 'p2', audio: [item.prompt], q: '가장 알맞은 응답을 고르시오.', choices: item.choices, answer: item.answer, note: item.note });
      });
    }
    if (setId === 'p3' || setId === 'all') {
      EXAM.part3.forEach(function (conv) {
        conv.questions.forEach(function (qq, i) {
          q.push({
            kind: 'p3', title: conv.title,
            audio: conv.script.map(function (l) { return l.en; }),
            replayOnce: i === 0,
            q: qq.q, choices: qq.choices, answer: qq.answer, note: qq.note,
            script: conv.script
          });
        });
      });
    }
    if (setId === 'p4' || setId === 'all') {
      EXAM.part4.forEach(function (talk) {
        talk.questions.forEach(function (qq, i) {
          q.push({
            kind: 'p4', title: talk.title,
            audio: talk.script.map(function (l) { return l.en; }),
            replayOnce: i === 0,
            q: qq.q, choices: qq.choices, answer: qq.answer, note: qq.note,
            script: talk.script
          });
        });
      });
    }
    return q;
  }

  function startExam(setId) {
    var names = { p2: 'Part 2', p3: 'Part 3', p4: 'Part 4', all: '전체 모의고사' };
    exam = { setId: setId, name: names[setId], queue: buildExamQueue(setId), i: 0, answers: [] };
    App.go({ name: 'exam-run' });
  }

  function examRun() {
    if (!exam) { return examHome(); }
    var wrap = el('<div class="view"></div>');
    wrap.appendChild(App.topbar(exam.name, function () { exam = null; App.go({ name: 'exam' }); }));

    if (exam.i >= exam.queue.length) return examResult(wrap);

    var item = exam.queue[exam.i];
    var progress = el('<div class="bar"><i style="width:' + Math.round(exam.i / exam.queue.length * 100) + '%"></i></div>');
    wrap.appendChild(progress);
    wrap.appendChild(el('<p class="lead">' + (exam.i + 1) + ' / ' + exam.queue.length +
      (item.title ? ' · ' + esc(item.title) : '') + '</p>'));

    var card = el('<section class="card exam-card"></section>');
    card.appendChild(el('<p class="exam-q">' + esc(item.q) + '</p>'));

    var playRow = el('<div class="ctrl-row"></div>');
    var playBtn = el('<button class="btn">▶ 다시 듣기</button>');
    var slowBtn = el('<button class="btn ghost">🐢 느리게</button>');
    playRow.appendChild(playBtn); playRow.appendChild(slowBtn);
    card.appendChild(playRow);

    /* 대화 지문은 여러 줄을 이어 읽는다.
     * 화면을 빠져나가면 Speech.stop()이 세대를 올리므로 그 자리에서 끊긴다. */
    function playAll(rate) {
      var i = 0;
      var tok = Speech.token();
      (function next() {
        if (i >= item.audio.length || !Speech.alive(tok)) return;
        Speech.speak(UI.en(item.audio[i]), { persona: 'narrator', rate: rate || 0.85 })
          .then(function () {
            if (!Speech.alive(tok)) return;
            i++;
            setTimeout(next, 300);
          });
      })();
    }
    playBtn.onclick = function () { playAll(); };
    slowBtn.onclick = function () { playAll(0.62); };

    var choices = el('<div class="choices"></div>');
    item.choices.forEach(function (c, i) {
      var b = el('<button class="choice"><b>' + 'ABCD'[i] + '</b> <span>' + esc(UI.en(c)) + '</span></button>');
      b.onclick = function () { answer(i); };
      choices.appendChild(b);
    });
    card.appendChild(choices);

    var reveal = el('<div class="reveal"></div>');
    card.appendChild(reveal);
    wrap.appendChild(card);

    function answer(picked) {
      if (card.dataset.done === '1') return;
      card.dataset.done = '1';
      Speech.stop();
      var ok = picked === item.answer;
      exam.answers.push({ picked: picked, ok: ok });
      Array.prototype.forEach.call(choices.children, function (b, i) {
        if (i === item.answer) b.classList.add('right');
        else if (i === picked) b.classList.add('wrong');
      });
      var r = el('<div class="score ' + (ok ? 'good' : 'bad') + '">' +
        '<div class="score-top"><b>' + (ok ? '정답' : '오답') + '</b><span>' + esc(item.note) + '</span></div>' +
        (item.script ? '<div class="exam-script">' + item.script.map(function (l) {
          return '<p><em>' + esc(l.s) + '</em> ' + esc(UI.en(l.en)) + '</p>';
        }).join('') + '</div>' : '<div class="exam-script"><p>' + esc(UI.en(item.audio[0])) + '</p></div>') +
        '</div>');
      reveal.appendChild(r);
      var next = el('<button class="btn primary wide">' + (exam.i + 1 >= exam.queue.length ? '결과 보기' : '다음 문제') + '</button>');
      next.onclick = function () { exam.i += 1; App.go({ name: 'exam-run' }); };
      reveal.appendChild(next);
      next.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // 첫 진입 시 자동 재생
    setTimeout(function () { playAll(); }, 300);
    return wrap;
  }

  function examResult(wrap) {
    var correct = exam.answers.filter(function (a) { return a.ok; }).length;
    var total = exam.queue.length;
    var pct = Math.round(correct / total * 100);

    Store.state.exams.unshift({ day: Store.today(), set: exam.name, correct: correct, total: total });
    Store.state.exams = Store.state.exams.slice(0, 20);
    Store.touchStreak();
    Store.save();

    var card = el(
      '<section class="card done-card">' +
        '<h3>' + esc(exam.name) + ' 결과</h3>' +
        '<p class="big-score">' + correct + ' / ' + total + '</p>' +
        '<p>' + (pct >= 90 ? '거의 다 잡았다. 실전에서도 이 정도면 흔들리지 않는다.'
              : pct >= 70 ? '들리는 구간과 안 들리는 구간이 갈린다. 오답 해설의 유형만 따로 모아 보자.'
              : '아직 소리보다 문자에 기대고 있다. 대화 모드 쉐도잉을 며칠 더 쌓고 다시 오자.') + '</p>' +
      '</section>'
    );
    var row = el('<div class="grade-row"></div>');
    var again = el('<button class="btn">다시 풀기</button>');
    var back = el('<button class="btn primary">시험 목록</button>');
    again.onclick = function () { startExam(exam.setId); };
    back.onclick = function () { exam = null; App.go({ name: 'exam' }); };
    row.appendChild(again); row.appendChild(back);
    card.appendChild(row);
    wrap.appendChild(card);
    return wrap;
  }

  /* ============ 문법 드릴 ============ */

  var drill = null;

  function grammarHome() {
    var wrap = el('<div class="view"></div>');
    wrap.appendChild(App.topbar('문법 집중', function () { App.go({ name: 'home' }); }));
    wrap.appendChild(el('<p class="lead">한국어 화자가 실제로 계속 틀리는 여섯 지점만 골랐다. 설명을 읽고 바로 드릴로 넘어간다.</p>'));

    var list = el('<div class="scene-list"></div>');
    FOCUS.grammar.forEach(function (g, i) {
      var it = el(
        '<button class="card scene-item">' +
          '<span class="scene-no">' + String(i + 1).padStart(2, '0') + '</span>' +
          '<span class="scene-body">' +
            '<span class="scene-title">' + esc(g.title) + '</span>' +
            '<span class="scene-en">' + esc(g.point) + '</span>' +
            '<span class="scene-sit">' + esc(g.ko) + '</span>' +
          '</span>' +
          '<span class="scene-tags">' + UI.pill(g.drills.length + '문항', 'due') + '</span>' +
        '</button>'
      );
      it.onclick = function () { drill = { g: g, i: 0, right: 0 }; App.go({ name: 'drill' }); };
      list.appendChild(it);
    });
    wrap.appendChild(list);
    return wrap;
  }

  function normalizeAnswer(s) {
    return (s || '').toLowerCase().replace(/[().,'’]/g, '').replace(/\s+/g, ' ').trim();
  }

  function drillRun() {
    if (!drill) return grammarHome();
    var g = drill.g;
    var wrap = el('<div class="view"></div>');
    wrap.appendChild(App.topbar(g.title, function () { drill = null; App.go({ name: 'grammar' }); }));

    if (drill.i >= g.drills.length) {
      var card = el('<section class="card done-card">' +
        '<h3>드릴 완료</h3>' +
        '<p class="big-score">' + drill.right + ' / ' + g.drills.length + '</p>' +
        '<p>' + (drill.right === g.drills.length ? '이 지점은 정리됐다. 다른 문법으로 넘어가자.'
              : '틀린 문항의 힌트를 다시 읽고 한 번 더 돌리면 남는다.') + '</p></section>');
      var row = el('<div class="grade-row"></div>');
      var again = el('<button class="btn">다시</button>');
      var back = el('<button class="btn primary">문법 목록</button>');
      again.onclick = function () { drill = { g: g, i: 0, right: 0 }; App.go({ name: 'drill' }); };
      back.onclick = function () { drill = null; App.go({ name: 'grammar' }); };
      row.appendChild(again); row.appendChild(back);
      card.appendChild(row);
      wrap.appendChild(card);
      return wrap;
    }

    var d = g.drills[drill.i];
    wrap.appendChild(el('<div class="bar"><i style="width:' + Math.round(drill.i / g.drills.length * 100) + '%"></i></div>'));
    wrap.appendChild(el('<p class="lead">' + (drill.i + 1) + ' / ' + g.drills.length + ' · ' + esc(g.point) + '</p>'));

    var card2 = el('<section class="card"></section>');
    card2.appendChild(el('<p class="drill-q">' + esc(d.q) + '</p>'));
    card2.appendChild(el('<p class="drill-ko">' + esc(d.ko) + '</p>'));

    var inp = UI.input('빈칸에 들어갈 말', '');
    inp.className = 'drill-input';
    card2.appendChild(inp);

    var hintBtn = el('<button class="mini">힌트: ' + esc(d.hint) + '</button>');
    hintBtn.onclick = function () { UI.toast(d.hint); };
    card2.appendChild(hintBtn);

    var out = el('<div class="reveal"></div>');
    card2.appendChild(out);

    var check = el('<button class="btn primary wide">확인</button>');
    check.onclick = function () { grade(); };
    card2.appendChild(check);
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') grade(); });

    function grade() {
      if (card2.dataset.done === '1') return;
      card2.dataset.done = '1';
      var ok = normalizeAnswer(inp.value) === normalizeAnswer(d.a);
      if (ok) drill.right += 1;
      var r = el('<div class="score ' + (ok ? 'good' : 'bad') + '">' +
        '<div class="score-top"><b>' + (ok ? '정답' : '오답') + '</b><span>' + esc(d.hint) + '</span></div>' +
        '<div class="score-words">' + esc(d.q.replace('___', d.a)) + '</div>' +
        (ok ? '' : '<div class="score-said">쓴 답: ' + esc(inp.value || '(빈칸)') + '</div>') +
        '</div>');
      out.appendChild(r);

      if (!ok) {
        var accept = el('<button class="mini">사실상 맞음으로 인정</button>');
        accept.onclick = function () { drill.right += 1; accept.remove(); UI.toast('맞음으로 반영했다.'); };
        out.appendChild(accept);
      }
      var next = el('<button class="btn primary wide">' + (drill.i + 1 >= g.drills.length ? '결과 보기' : '다음') + '</button>');
      next.onclick = function () { drill.i += 1; App.go({ name: 'drill' }); };
      out.appendChild(next);
      check.remove();
      Store.state.daily.lines += 1;
      Store.touchStreak();
      Store.save();
    }

    wrap.appendChild(card2);
    setTimeout(function () { inp.focus(); }, 100);
    return wrap;
  }

  /* ============ 피칭 스튜디오 (로그라인 → 장면 생성) ============ */

  function studio() {
    var wrap = el('<div class="view"></div>');
    wrap.appendChild(App.topbar('피칭 스튜디오', function () { App.go({ name: 'home' }); }));
    wrap.appendChild(el('<p class="lead">작품 정보를 넣으면 피칭 미팅과 마켓 네트워킹 장면을 만들어낸다. 만들어진 장면은 다른 모드와 똑같이 롤플레이하고 복습할 수 있다.</p>'));

    var form = el('<section class="card"></section>');
    var f = {};

    function add(key, label, placeholder) {
      var i = UI.input(placeholder, (Store.state.lastPitch || {})[key] || '');
      f[key] = i;
      form.appendChild(UI.field(label, i));
    }

    add('title', '작품 제목', 'The Long Take');
    add('logline', '로그라인 (영어 한 문장)', 'A man finally makes the film he has been avoiding his whole life.');
    add('loglineKo', '로그라인 한국어 (선택)', '평생 피해온 영화를 마침내 찍는 남자');
    add('hook', '후크 — 한 문장 (영어)', 'The film he is making starts telling the truth he will not.');
    add('refA', '레퍼런스 A', 'a Kore-eda film');
    add('refB', '레퍼런스 B', 'a slow-burn thriller');
    add('why', '왜 나이고, 왜 지금인가 (영어)', 'I have spent twenty years making other people\'s films.');
    add('city', '활동 도시', 'Seoul');

    f.budget = UI.select([
      { v: 'micro', t: '10만 달러대 (micro)' },
      { v: 'low', t: '50만~100만 달러 (low)' },
      { v: 'mid', t: '100만 달러대 초반 (contained)' },
      { v: 'upper', t: '300만~500만 달러 (mid-range)' }
    ], (Store.state.lastPitch || {}).budget || 'mid');
    form.appendChild(UI.field('예산 규모', f.budget));

    f.stage = UI.select([
      { v: 'draft', t: '시나리오 2고, 배우 미정' },
      { v: 'package', t: '패키지 구성 중' },
      { v: 'financing', t: '일부 투자 확정' },
      { v: 'prep', t: '프리프로덕션' }
    ], (Store.state.lastPitch || {}).stage || 'draft');
    form.appendChild(UI.field('진행 단계', f.stage));

    f.market = UI.select([
      { v: 'festival', t: '영화제 우선' },
      { v: 'arthouse', t: '아트하우스 극장' },
      { v: 'streaming', t: '스트리밍 우선' },
      { v: 'crossover', t: '아트하우스 + 확장 가능' }
    ], (Store.state.lastPitch || {}).market || 'festival');
    form.appendChild(UI.field('배급 방향', f.market));

    function values() {
      var v = {};
      Object.keys(f).forEach(function (k) { v[k] = f[k].value; });
      Store.state.lastPitch = v;
      Store.save();
      return v;
    }

    var row = el('<div class="grade-row"></div>');
    var mkPitch = el('<button class="btn primary">피칭 미팅 만들기</button>');
    var mkNet = el('<button class="btn">네트워킹 대화 만들기</button>');
    mkPitch.onclick = function () {
      var sc = GENERATOR.saveScene(GENERATOR.pitchScene(values()));
      UI.toast('피칭 장면을 만들었다.');
      App.go({ name: 'scene', mode: 'mine', scene: sc.id, tab: 'dialogue' });
    };
    mkNet.onclick = function () {
      var sc = GENERATOR.saveScene(GENERATOR.networkScene(values()));
      UI.toast('네트워킹 장면을 만들었다.');
      App.go({ name: 'scene', mode: 'mine', scene: sc.id, tab: 'dialogue' });
    };
    row.appendChild(mkPitch); row.appendChild(mkNet);
    form.appendChild(row);
    wrap.appendChild(form);

    var saved = (Store.state.custom && Store.state.custom.scenes) || [];
    if (saved.length) {
      var sc2 = el('<section class="card"><h3 class="sec-title">만들어둔 장면</h3></section>');
      saved.forEach(function (s) {
        var r = el('<div class="weak-row">' +
          '<span class="weak-en">' + esc(s.title) + '</span>' +
          '<span class="weak-meta">' + (s.kind === 'pitch' ? '피칭' : '네트워킹') + '</span>' +
          '</div>');
        var del = el('<button class="mini">삭제</button>');
        del.onclick = function (e) {
          e.stopPropagation();
          GENERATOR.removeScene(s.id);
          App.go({ name: 'studio' });
        };
        r.onclick = function () { App.go({ name: 'scene', mode: 'mine', scene: s.id, tab: 'roleplay' }); };
        r.appendChild(del);
        sc2.appendChild(r);
      });
      wrap.appendChild(sc2);
    }

    wrap.appendChild(el('<p class="note">영어로 입력한 문장은 그대로 대사가 되고 그대로 읽힌다. 한국어를 넣으면 그 부분만 한국어로 읽히니, 로그라인과 후크는 영어로 다듬어 넣는 편이 낫다.</p>'));
    return wrap;
  }

  return {
    schedule: schedule,
    examHome: examHome, examRun: examRun,
    grammarHome: grammarHome, drillRun: drillRun,
    studio: studio,
    buildDigest: buildDigest, copyText: copyText, mailDigest: mailDigest, downloadText: downloadText,
    backupState: backupState, restoreState: restoreState, looksLikeState: looksLikeState
  };
})();
