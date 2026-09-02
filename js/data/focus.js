/* 문법·어휘 집중 모드.
 * hooks  — 원어민이 문장을 붙일 때 쓰는 접착제 표현. 이게 없으면 문장이 늘 뚝뚝 끊긴다.
 * grammar — 한국어 화자가 실제로 계속 틀리는 지점만 골라 드릴로 만들었다. */
window.FOCUS = {
  hooks: [
    {
      en: 'The thing is, …',
      ko: '사실 문제는 말이죠,',
      note: '변명이나 사정을 꺼낼 때. 상대를 준비시키고 본론으로 들어간다.',
      examples: [
        { en: "The thing is, I've already committed to another project.", ko: '사실 문제는, 다른 프로젝트를 이미 맡기로 했다는 겁니다.' },
        { en: "The thing is, we don't have the budget for that this year.", ko: '문제는 올해 그럴 예산이 없다는 거예요.' }
      ]
    },
    {
      en: 'Here\'s the thing —',
      ko: '이게 핵심인데요,',
      note: '"The thing is"보다 단호하다. 상대의 오해를 바로잡을 때 쓴다.',
      examples: [
        { en: "Here's the thing — the script isn't the problem. The budget is.", ko: '핵심은 이겁니다. 시나리오가 문제가 아니라 예산이 문제예요.' },
        { en: "Here's the thing — I've done this for twenty years.", ko: '이게 핵심인데요, 저는 이 일을 20년 했습니다.' }
      ]
    },
    {
      en: 'Any chance you could …?',
      ko: '혹시 ~해주실 수 있을까요?',
      note: '부탁의 문턱을 낮추는 최고의 문장. 거절해도 서로 민망하지 않다.',
      examples: [
        { en: 'Any chance you could send that over by Friday?', ko: '혹시 금요일까지 보내주실 수 있을까요?' },
        { en: 'Any chance we could push the meeting an hour?', ko: '혹시 회의를 한 시간 미룰 수 있을까요?' }
      ]
    },
    {
      en: 'I was wondering if …',
      ko: '~인지 여쭤보고 싶었는데요',
      note: '과거진행형이 정중함을 만든다. 처음 연락하는 메일과 통화에 특히 좋다.',
      examples: [
        { en: 'I was wondering if you had a moment this week.', ko: '이번 주에 시간이 되시는지 여쭤보고 싶었습니다.' },
        { en: 'I was wondering if the position is still open.', ko: '그 자리가 아직 열려 있는지 궁금했습니다.' }
      ]
    },
    {
      en: 'That said, …',
      ko: '그렇긴 한데,',
      note: '앞말을 인정하고 반대편을 꺼낸다. 회의에서 반대할 때의 표준 완충재.',
      examples: [
        { en: "That said, I'd still want final cut.", ko: '그렇긴 해도, 최종 편집권은 여전히 원합니다.' },
        { en: "That said, the numbers don't support it.", ko: '그렇긴 한데, 숫자가 뒷받침해주지 않습니다.' }
      ]
    },
    {
      en: 'To be fair, …',
      ko: '공정하게 말하면,',
      note: '상대편 입장을 인정하며 균형을 잡는다. 품위 있게 들린다.',
      examples: [
        { en: 'To be fair, they gave us very little time.', ko: '공정하게 말하면, 그쪽도 시간을 거의 안 줬어요.' },
        { en: 'To be fair, the first cut was too long.', ko: '솔직히 말하면 첫 편집본이 길긴 했습니다.' }
      ]
    },
    {
      en: 'If anything, …',
      ko: '오히려 ~에 가깝다',
      note: '상대의 짐작을 뒤집는다. "그 반대"라고 말하는 세련된 방식.',
      examples: [
        { en: "If anything, it's too quiet, not too loud.", ko: '오히려 너무 조용해요. 시끄러운 게 아니라.' },
        { en: 'If anything, the delay helped the script.', ko: '오히려 지연된 게 시나리오에 도움이 됐습니다.' }
      ]
    },
    {
      en: 'Not that I know of.',
      ko: '내가 아는 한은 아니에요.',
      note: '모른다는 걸 인정하면서 단정하지 않는다. 통째로 외울 것.',
      examples: [
        { en: '"Has anyone else been attached?" "Not that I know of."', ko: '"다른 사람이 붙었나요?" "제가 아는 한은 아닙니다."' }
      ]
    },
    {
      en: "It's not that I don't …, it's just …",
      ko: '~하기 싫은 게 아니라, 다만 ~',
      note: '거절을 부드럽게 만드는 이중 구조. 관계를 지키면서 선을 긋는다.',
      examples: [
        { en: "It's not that I don't like the idea, it's just too early.", ko: '아이디어가 싫은 게 아니라, 다만 너무 이릅니다.' },
        { en: "It's not that I don't trust him, it's just a big call.", ko: '그를 못 믿는 게 아니라, 다만 큰 결정이라서요.' }
      ]
    },
    {
      en: 'Last I heard, …',
      ko: '마지막으로 듣기로는,',
      note: '정보가 오래됐을 수 있다는 안전장치를 미리 깔아둔다.',
      examples: [
        { en: 'Last I heard, they were still in post.', ko: '마지막으로 듣기로는 아직 후반작업 중이었어요.' },
        { en: 'Last I heard, the fund closes in March.', ko: '제가 듣기로는 그 펀드가 3월에 마감입니다.' }
      ]
    },
    {
      en: "I'll be honest with you —",
      ko: '솔직히 말씀드리면,',
      note: '나쁜 소식이나 진짜 속내를 꺼내기 직전에 놓는다. 신뢰를 산다.',
      examples: [
        { en: "I'll be honest with you — we're not there yet.", ko: '솔직히 말씀드리면, 아직 거기까진 못 갔습니다.' },
        { en: "I'll be honest with you — that number scares me.", ko: '솔직히 그 숫자는 부담스럽습니다.' }
      ]
    },
    {
      en: 'What I can\'t move on is …',
      ko: '제가 양보할 수 없는 건 ~입니다',
      note: '협상에서 선을 긋는 가장 단단하고도 정중한 문장.',
      examples: [
        { en: "What I can't move on is the release window.", ko: '개봉 시기만은 양보할 수 없습니다.' },
        { en: "What I can't move on is who cuts the film.", ko: '누가 편집하느냐만은 양보할 수 없습니다.' }
      ]
    }
  ],

  grammar: [
    {
      id: 'articles',
      title: '관사 — a / the / 무관사',
      ko: '한국어에 없는 문법이라 평생 흔들린다. 규칙은 하나다. 듣는 사람이 그것을 특정할 수 있으면 the.',
      point: '처음 꺼내는 것은 a, 이미 아는 것은 the, 개념 전체는 무관사.',
      drills: [
        { q: "I'm writing ___ script about a director.", a: 'a', ko: '시나리오를 하나 쓰고 있어요.', hint: '처음 꺼내는 것' },
        { q: "___ script I mentioned is finally done.", a: 'The', ko: '말씀드린 그 시나리오가 드디어 끝났어요.', hint: '상대도 아는 그것' },
        { q: "He works in ___ film.", a: '(무관사)', ko: '그는 영화계에서 일합니다.', hint: '산업·분야 전체' },
        { q: "Could you send me ___ budget you drafted?", a: 'the', ko: '작성하신 그 예산안 보내주시겠어요?', hint: '뒤에 한정하는 절이 붙었다' },
        { q: "We shot it in ___ two locations.", a: '(무관사)', ko: '두 곳에서 찍었습니다.', hint: '수사 앞에는 보통 안 붙는다' }
      ]
    },
    {
      id: 'tense',
      title: '시제 — 현재완료 vs 과거',
      ko: '한국어는 둘을 잘 구분하지 않는다. 영어는 "지금과 이어져 있느냐"로 가른다.',
      point: '언제인지 못 박으면 과거. 지금까지의 경험·결과면 현재완료.',
      drills: [
        { q: "I ___ (work) here for twenty years.", a: "have worked", ko: '여기서 20년째 일하고 있습니다.', hint: '지금도 계속' },
        { q: "I ___ (work) there in 2005.", a: 'worked', ko: '2005년에 거기서 일했습니다.', hint: '시점이 못 박혔다' },
        { q: "___ you ever ___ (pitch) to a studio?", a: 'Have / pitched', ko: '스튜디오에 피칭해본 적 있어요?', hint: '평생의 경험' },
        { q: "The script ___ (change) a lot since we met.", a: 'has changed', ko: '만난 이후로 시나리오가 많이 바뀌었어요.', hint: 'since가 있으면 현재완료' },
        { q: "We ___ (finish) shooting last month.", a: 'finished', ko: '지난달에 촬영을 끝냈습니다.', hint: 'last month는 끝난 시점' }
      ]
    },
    {
      id: 'prepositions',
      title: '전치사 — 시간과 공간의 감각',
      ko: '외우는 게 아니라 크기로 잡는다. 점은 at, 면은 on, 공간은 in.',
      point: 'at(점) → on(면·날짜) → in(공간·기간) 순으로 넓어진다.',
      drills: [
        { q: "The meeting is ___ 3 p.m.", a: 'at', ko: '회의는 오후 3시입니다.', hint: '시각은 점' },
        { q: "We wrap ___ Friday.", a: 'on', ko: '금요일에 촬영을 끝냅니다.', hint: '날짜는 면' },
        { q: "It comes out ___ March.", a: 'in', ko: '3월에 나옵니다.', hint: '달은 공간' },
        { q: "I'll get back to you ___ a couple of days.", a: 'in', ko: '이삼일 안에 연락드리겠습니다.', hint: '앞으로 ~후에' },
        { q: "She's good ___ handling difficult actors.", a: 'at', ko: '그는 까다로운 배우를 잘 다룹니다.', hint: 'good at + 동명사' }
      ]
    },
    {
      id: 'modals',
      title: '조동사 — 세기 조절',
      ko: '같은 말도 조동사 하나로 명령이 되고 제안이 된다. 협상에서 가장 실전적인 문법.',
      point: 'will(확정) > should(권고) > could(가능) > might(약한 가능). 과거형일수록 부드럽다.',
      drills: [
        { q: "___ you mind sending the deck again?", a: 'Would', ko: '덱을 다시 보내주실 수 있을까요?', hint: '가장 정중한 부탁' },
        { q: "We ___ look at five years instead.", a: 'could', ko: '대신 5년으로 볼 수도 있겠습니다.', hint: '대안 제시' },
        { q: "That ___ work, but I need to check.", a: 'might', ko: '될 수도 있는데, 확인이 필요합니다.', hint: '가장 약한 확신' },
        { q: "You ___ talk to your lawyer first.", a: 'should', ko: '변호사와 먼저 상의하시는 게 좋습니다.', hint: '권고' },
        { q: "I ___ have taken that meeting.", a: 'should', ko: '그 미팅에 갔어야 했는데.', hint: '지나간 후회' }
      ]
    },
    {
      id: 'conditionals',
      title: '가정법 — 후회와 제안',
      ko: '"만약 ~했더라면"을 말하려다 문장이 무너지는 지점. 형태 두 개만 몸에 넣으면 된다.',
      point: '현재의 가정: If + 과거, would + 동사원형 / 과거의 후회: If + had p.p., would have p.p.',
      drills: [
        { q: "If I ___ (be) you, I'd wait for a better offer.", a: 'were', ko: '제가 당신이라면 더 나은 제안을 기다리겠습니다.', hint: '주어와 무관하게 were' },
        { q: "If we ___ (have) more time, we would reshoot it.", a: 'had', ko: '시간이 더 있으면 다시 찍을 텐데요.', hint: '현재의 가정' },
        { q: "If I ___ (start) ten years earlier, I'd have three films by now.", a: 'had started', ko: '10년 일찍 시작했더라면 지금쯤 세 편은 있었을 텐데.', hint: '과거의 후회' },
        { q: "I would have called, but I ___ (not / have) your number.", a: "didn't have", ko: '전화하려 했는데 번호가 없었어요.', hint: '실제 과거는 그냥 과거형' },
        { q: "It ___ (be) easier if we shot it in one location.", a: 'would be', ko: '한 장소에서 찍으면 훨씬 수월할 텐데요.', hint: '주절은 would + 원형' }
      ]
    },
    {
      id: 'wordorder',
      title: '어순 — 뒤에서 꾸미기',
      ko: '한국어는 앞에서 꾸미고 영어는 뒤에서 꾸민다. 이 방향만 바꿔도 문장이 갑자기 영어다워진다.',
      point: '명사 → 관계절·분사·전치사구가 뒤에 붙는다. 앞에 다 넣으려 하면 문장이 막힌다.',
      drills: [
        { q: "제가 지난주에 만난 그 프로듀서 → the producer ___", a: 'I met last week', ko: '뒤에서 꾸민다.', hint: '관계대명사는 생략 가능' },
        { q: "칸에서 상영된 그 영화 → the film ___ at Cannes", a: 'screened', ko: '과거분사가 뒤에서 꾸민다.', hint: '수동이면 p.p.' },
        { q: "예산을 짜고 있는 그 여자 → the woman ___ the budget", a: 'putting together', ko: '현재분사가 뒤에서 꾸민다.', hint: '능동이면 -ing' },
        { q: "제가 양보할 수 없는 그 한 가지 → the one thing ___", a: "I can't move on", ko: '관계절이 통째로 뒤에 붙는다.', hint: '목적격 관계대명사 생략' },
        { q: "테이블 위에 있는 그 계약서 → the contract ___ the table", a: 'on', ko: '전치사구가 뒤에서 꾸민다.', hint: '위치는 뒤에서' }
      ]
    }
  ]
};
