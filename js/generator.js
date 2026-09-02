/* 입력한 작품 정보로 피칭 장면과 네트워킹 대화를 만들어낸다.
 * 전부 브라우저 안에서 규칙 기반으로 조립한다 — 어디로도 전송되지 않는다.
 * 만들어진 장면은 기존 장면과 똑같이 대화·카드·롤플레이로 굴러간다. */
window.GENERATOR = (function () {
  'use strict';

  var BUDGETS = {
    micro: { en: 'in the low six figures', ko: '10만 달러대', tag: 'micro-budget' },
    low: { en: 'in the high six figures', ko: '50만~100만 달러', tag: 'low-budget' },
    mid: { en: 'in the low seven figures', ko: '100만 달러대 초반', tag: 'contained feature' },
    upper: { en: 'in the mid seven figures', ko: '300만~500만 달러', tag: 'mid-range feature' }
  };

  var STAGES = {
    draft: {
      en: "I'm on the second draft. No talent attached yet — I wanted to bring it to you before it gets shaped by anyone else.",
      ko: '2고 작업 중입니다. 아직 붙은 배우는 없고, 다른 손을 타기 전에 먼저 보여드리고 싶었습니다.'
    },
    package: {
      en: "The script is locked and we're putting the package together now. I'm in conversations on the lead.",
      ko: '시나리오는 확정됐고 지금 패키지를 구성 중입니다. 주연은 논의가 오가고 있습니다.'
    },
    financing: {
      en: "About forty percent is locked through a regional fund. The rest is soft, which is why I'm here.",
      ko: '지역 펀드로 40% 정도가 확정됐습니다. 나머지는 유동적이고, 그래서 이 자리에 왔습니다.'
    },
    prep: {
      en: "We're in prep. Cast is set and we shoot in the spring, so the window to come in is now.",
      ko: '프리프로덕션 중입니다. 캐스팅은 끝났고 봄에 촬영이라, 참여하실 수 있는 시점은 지금입니다.'
    }
  };

  var MARKETS = {
    festival: { en: 'Festival first, then streaming. This is a premiere play.', ko: '영화제 먼저, 이후 스트리밍입니다. 프리미어를 노리는 작품입니다.' },
    arthouse: { en: 'Arthouse theatrical in key territories, with a long tail on streaming.', ko: '주요 지역 아트하우스 극장 개봉, 이후 스트리밍에서 길게 갑니다.' },
    streaming: { en: 'Streaming-first. The subject travels better on a platform than in theaters.', ko: '스트리밍 우선입니다. 이 소재는 극장보다 플랫폼에서 더 멀리 갑니다.' },
    crossover: { en: 'Arthouse core, but it could cross over with the right campaign.', ko: '아트하우스가 중심이지만 캠페인만 잘하면 확장될 수 있습니다.' }
  };

  function clean(s, fallback) {
    var t = (s || '').trim().replace(/\s+/g, ' ');
    return t || fallback;
  }

  /* 문장 끝에 마침표가 없으면 붙여준다 — 합성음이 문장을 끊어 읽게 하려면 필요하다 */
  function period(s) {
    return /[.!?]$/.test(s) ? s : s + '.';
  }

  /* ---------- 피칭 미팅 장면 ---------- */

  function pitchScene(f) {
    var title = clean(f.title, 'the film');
    var logline = period(clean(f.logline, 'A man finally makes the film he has been avoiding his whole life'));
    var loglineKo = clean(f.loglineKo, '');
    var hook = period(clean(f.hook, 'The film he is making starts telling the truth he will not'));
    var refA = clean(f.refA, 'a Kore-eda film');
    var refB = clean(f.refB, 'a slow-burn thriller');
    var budget = BUDGETS[f.budget] || BUDGETS.mid;
    var stage = STAGES[f.stage] || STAGES.draft;
    var market = MARKETS[f.market] || MARKETS.festival;
    var why = period(clean(f.why, 'I have spent twenty years making other people\'s films. I know exactly how this one is built'));

    var lines = [
      { s: 'Exec', en: "Thanks for coming in. So, what have you got for us?", ko: '와주셔서 감사합니다. 어떤 작품을 가져오셨나요?', tip: '첫 90초가 전부다. 제목과 로그라인을 붙여서 한 번에 내보낸다.' },
      { s: 'You', en: "It's called " + title + ". " + logline, ko: (loglineKo ? '제목은 ' + title + '. ' + loglineKo : '제목과 로그라인을 한 호흡에 말한다.'), tip: '로그라인은 한 문장. 주인공 + 상황 + 아이러니.' },
      { s: 'Exec', en: "Interesting. What's the hook?", ko: '흥미롭네요. 후크가 뭐죠?', tip: '반드시 나오는 질문이다. 답을 문장으로 미리 굳혀둘 것.' },
      { s: 'You', en: hook, ko: '후크를 한 문장으로.', tip: '설명하지 말고 장면 하나를 던진다.' },
      { s: 'Exec', en: 'How would you describe the tone?', ko: '톤은 어떻게 설명하시겠어요?' },
      { s: 'You', en: 'Think ' + refA + ' with the structure of ' + refB + '.', ko: refA + '에 ' + refB + '의 구조를 더한 느낌입니다.', tip: '레퍼런스 두 개를 겹치면 톤이 즉시 전달된다.' },
      { s: 'Exec', en: "Who's the audience? Where does this play?", ko: '관객층은요? 어디서 통할 작품인가요?', tip: 'play = 통하다. 배급 관점의 질문이다.' },
      { s: 'You', en: market.en, ko: market.ko },
      { s: 'Exec', en: 'What are you thinking budget-wise?', ko: '예산은 어느 정도로 보시나요?', tip: '~wise = ~ 측면에서. 업계에서 매우 흔하다.' },
      { s: 'You', en: "We're looking at something " + budget.en + '. It\'s contained — we can protect the scale.', ko: budget.ko + ' 정도로 보고 있습니다. 규모가 통제 가능한 작품입니다.', tip: 'contained가 저예산 기획을 매력적으로 만든다.' },
      { s: 'Exec', en: 'Is there anyone attached yet?', ko: '현재 붙어 있는 사람이 있나요?', tip: 'attached = 참여가 확정된 상태.' },
      { s: 'You', en: stage.en, ko: stage.ko, tip: '약점을 숨기지 말고 존중의 언어로 뒤집는다.' },
      { s: 'Exec', en: "Why you? And why now?", ko: '왜 당신이고, 왜 지금이죠?', tip: '가장 개인적인 질문이자 가장 결정적인 질문이다.' },
      { s: 'You', en: why, ko: '경력과 시기를 한 문장으로 묶는다.', tip: '감정에 기대지 말고 근거를 댄다.' },
      { s: 'Exec', en: "Let me talk to my team. Can you send over the treatment?", ko: '팀과 논의해보겠습니다. 트리트먼트 보내주실 수 있나요?', tip: '이 말이 나오면 미팅은 성공이다.' },
      { s: 'You', en: "It'll be in your inbox this afternoon. Thanks for the time.", ko: '오늘 오후에 보내드리겠습니다. 시간 내주셔서 감사합니다.', tip: '구체적인 시점을 말하면 프로처럼 들린다.' }
    ];

    return {
      id: 'gen-pitch-' + Date.now(),
      generated: true,
      kind: 'pitch',
      title: title + ' — 피칭 미팅',
      titleEn: 'Pitching ' + title,
      situation: '입력한 작품 정보로 만든 피칭 장면. 임원의 질문은 자동 재생되고, 답변은 직접 말해야 한다.',
      lines: lines,
      expressions: [
        { en: "What's the hook?", ko: '후크가 뭐죠?', note: '피칭에서 반드시 나온다. 답을 문장으로 굳혀둘 것.' },
        { en: 'Think A with the structure of B.', ko: 'A에 B의 구조를 더한 느낌입니다.', note: '톤을 압축하는 고전 공식.' },
        { en: "We're looking at something " + budget.en + '.', ko: budget.ko + ' 정도로 보고 있습니다.', note: '금액을 직접 말하지 않는 업계 화법.' },
        { en: "It's contained.", ko: '규모가 통제 가능합니다.', note: '저예산을 강점으로 바꾸는 형용사.' },
        { en: 'Is there anyone attached yet?', ko: '참여 확정된 사람이 있나요?', note: '패키징 단계의 필수 어휘.' },
        { en: 'Why you? And why now?', ko: '왜 당신이고, 왜 지금이죠?', note: '답을 준비하지 않으면 반드시 무너지는 질문.' },
        { en: 'Can you send over the treatment?', ko: '트리트먼트 보내주시겠어요?', note: '미팅 성공의 신호.' }
      ]
    };
  }

  /* ---------- 마켓 네트워킹 대화 (3분, 5단계) ---------- */

  function networkScene(f) {
    var title = clean(f.title, 'the film');
    var logline = period(clean(f.logline, 'A man finally makes the film he has been avoiding his whole life'));
    var stage = STAGES[f.stage] || STAGES.draft;
    var city = clean(f.city, 'Seoul');
    var market = MARKETS[f.market] || MARKETS.festival;

    var lines = [
      { s: 'You', en: "Sorry to jump in — are you with the sales side or production?", ko: '실례지만, 세일즈 쪽이신가요 제작 쪽이신가요?', tip: '1단계 진입. 질문으로 들어가면 거절당해도 대화가 남는다.' },
      { s: 'Them', en: "Sales. I handle Asian territories for a Paris-based outfit.", ko: '세일즈입니다. 파리 회사에서 아시아 지역을 담당해요.', tip: 'territory = 판권 지역. outfit = 회사.' },
      { s: 'You', en: "Good to meet you. I'm a director out of " + city + " — first feature in development.", ko: '반갑습니다. ' + city + '에서 온 감독이고, 첫 장편을 개발 중입니다.', tip: '2단계 자기소개. 15초 안에 끝낸다.' },
      { s: 'Them', en: "What's it about?", ko: '어떤 작품인가요?', tip: '이 질문에 30초 안에 답하지 못하면 대화는 끝난다.' },
      { s: 'You', en: 'One line: ' + logline, ko: '한 줄로 던진다.', tip: '3단계 피칭. "One line:"으로 시작하면 상대가 귀를 연다.' },
      { s: 'Them', en: "That's a strong premise. Where are you in the process?", ko: '전제가 좋네요. 지금 어느 단계인가요?' },
      { s: 'You', en: stage.en, ko: stage.ko },
      { s: 'You', en: 'Are you looking at co-productions this year, or mostly acquisitions?', ko: '올해는 공동제작을 보시나요, 주로 판권 구매를 보시나요?', tip: '4단계 상대 파악. 내 얘기만 하다 끝나는 것이 최악이다.' },
      { s: 'Them', en: "Acquisitions mostly, but we look at co-pro when the package is right.", ko: '주로 구매지만, 패키지가 맞으면 공동제작도 봅니다.' },
      { s: 'You', en: market.en, ko: market.ko, tip: '상대의 관심사에 내 배급 전략을 맞춰 붙인다.' },
      { s: 'You', en: 'Would it be alright if I followed up after the market?', ko: '마켓 끝나고 연락드려도 될까요?', tip: '5단계 후속. 허락을 구하면 회신율이 크게 오른다.' },
      { s: 'Them', en: "Please do. Here's my card — email works better than LinkedIn.", ko: '그럼요. 명함 드릴게요. 링크드인보다 이메일이 낫습니다.' },
      { s: 'You', en: "I'll send the logline and a one-pager on " + title + ". Enjoy the rest of the market.", ko: title + '의 로그라인과 원페이저를 보내드리겠습니다. 남은 마켓 잘 보내세요.', tip: '무엇을 보낼지 구체적으로 약속하고 끝낸다.' }
    ];

    return {
      id: 'gen-net-' + Date.now(),
      generated: true,
      kind: 'network',
      title: title + ' — 마켓 네트워킹 3분',
      titleEn: 'Networking about ' + title,
      situation: '리셉션장에서 처음 만난 상대와 3분 안에 관계를 만드는 5단계 대화. 진입 → 소개 → 한 줄 피칭 → 상대 파악 → 후속 약속.',
      lines: lines,
      expressions: [
        { en: 'Sorry to jump in —', ko: '실례지만 끼어들자면요,', note: '1단계. 낯선 무리에 합류하는 안전한 진입.' },
        { en: "I'm a director out of " + city + '.', ko: city + '에서 활동하는 감독입니다.', note: '2단계. from보다 out of가 업계 뉘앙스에 맞다.' },
        { en: 'One line: …', ko: '한 줄로 말하면요…', note: '3단계. 상대의 집중을 확보하는 프레이밍.' },
        { en: 'Are you looking at co-productions this year?', ko: '올해 공동제작을 보시나요?', note: '4단계. 대화를 상대에게 넘기는 질문.' },
        { en: 'Would it be alright if I followed up?', ko: '나중에 연락드려도 될까요?', note: '5단계. 허락을 구하고 실제로 보낸다.' },
        { en: "I'll send the logline and a one-pager.", ko: '로그라인과 원페이저를 보내드리겠습니다.', note: '무엇을 보낼지 못 박으면 기억에 남는다.' }
      ]
    };
  }

  /* ---------- 저장 ---------- */

  function saveScene(scene) {
    var st = Store.state;
    if (!st.custom) st.custom = { scenes: [] };
    st.custom.scenes.unshift(scene);
    st.custom.scenes = st.custom.scenes.slice(0, 30);
    Store.save();
    rebuildPack();
    return scene;
  }

  function removeScene(id) {
    var st = Store.state;
    if (!st.custom) return;
    st.custom.scenes = st.custom.scenes.filter(function (s) { return s.id !== id; });
    Store.save();
    rebuildPack();
  }

  /* 저장된 생성 장면을 하나의 모드로 묶어 앱에 꽂는다 */
  function rebuildPack() {
    var scenes = (Store.state.custom && Store.state.custom.scenes) || [];
    if (!scenes.length) { delete window.PACKS.mine; return; }
    window.PACKS.mine = {
      id: 'mine',
      title: '내 작품 피칭',
      titleEn: 'My Project',
      icon: '📝',
      theme: 'future',
      blurb: '입력한 로그라인으로 만든 피칭과 네트워킹 장면.',
      scenes: scenes
    };
  }

  return {
    pitchScene: pitchScene,
    networkScene: networkScene,
    saveScene: saveScene,
    removeScene: removeScene,
    rebuildPack: rebuildPack,
    BUDGETS: BUDGETS, STAGES: STAGES, MARKETS: MARKETS
  };
})();
