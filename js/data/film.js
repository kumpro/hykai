/* 모드 3 — 영화 비즈니스 회화 (Film Business English)
 * 피칭, 마켓 네트워킹, 공동제작 협상, 현장 연출, 세일즈까지.
 * 업계에서 실제로 쓰이는 용어와 화법 중심. */
window.PACKS = window.PACKS || {};

window.PACKS.film = {
  id: 'film',
  title: '영화 비즈니스 회화',
  titleEn: 'Film Business',
  icon: '🎬',
  blurb: '피칭, 마켓, 공동제작, 현장 연출, 세일즈. 감독의 언어.',
  scenes: [
    {
      id: 'film-pitch',
      title: '피칭 미팅 — 로그라인부터 톤까지',
      titleEn: 'The pitch meeting',
      situation: '제작사 임원 앞에서 자신의 시나리오를 소개하는 자리. 첫 90초가 전부다.',
      lines: [
        { s: 'Exec', en: "Thanks for coming in. So, what have you got for us?", ko: '와주셔서 감사합니다. 어떤 작품을 가져오셨나요?', tip: '"What have you got?"이 피칭 시작 신호다.' },
        { s: 'You', en: "It's a slow-burn drama about a man who spends thirty years preparing for a life he never starts.", ko: '30년 동안 시작하지 못한 삶을 준비만 해온 남자에 관한, 서서히 타오르는 드라마입니다.', tip: '로그라인은 한 문장. 주인공 + 상황 + 아이러니.' },
        { s: 'Exec', en: 'Interesting. What\'s the hook?', ko: '흥미롭네요. 후크가 뭐죠?', tip: 'hook = 관객을 끌어당기는 한 방. 반드시 준비할 것.' },
        { s: 'You', en: "He starts shooting a film about his own life — and the film starts telling the truth he won't.", ko: '그가 자기 인생에 관한 영화를 찍기 시작하는데, 그 영화가 그가 말하지 못하는 진실을 말하기 시작합니다.' },
        { s: 'Exec', en: 'Who\'s the audience? Where does this play?', ko: '관객층은요? 어디서 통할 작품인가요?', tip: '"Where does this play?"는 배급 경로와 시장을 묻는 질문.' },
        { s: 'You', en: "Festival first, then streaming. Think the tone of a Kore-eda film with the structure of a thriller.", ko: '영화제 먼저, 이후 스트리밍입니다. 고레에다 영화의 톤에 스릴러의 구조라고 보시면 됩니다.', tip: '레퍼런스 두 개를 겹치면 톤이 즉시 전달된다.' },
        { s: 'Exec', en: 'What are you thinking budget-wise?', ko: '예산은 어느 정도로 보시나요?', tip: '"~wise"를 붙이면 "~ 측면에서"가 된다. 업계에서 매우 흔하다.' },
        { s: 'You', en: "We're looking at low seven figures. It's contained — mostly two locations.", ko: '100만 달러대 초반을 보고 있습니다. 규모가 제한적이고, 로케이션도 두 곳 정도입니다.', tip: 'contained = 규모가 작고 통제 가능한. 예산 설득의 핵심 단어.' },
        { s: 'Exec', en: 'Is there anyone attached yet?', ko: '현재 붙어 있는 사람이 있나요?', tip: 'attached = 배우·감독·프로듀서가 이미 참여 확정된 상태.' },
        { s: 'You', en: "No talent attached yet. I wanted to bring it to you before it gets shaped by anyone else.", ko: '아직 배우는 없습니다. 다른 누구의 손을 타기 전에 먼저 보여드리고 싶었습니다.', tip: '약점을 존중의 언어로 뒤집는 화법.' },
        { s: 'Exec', en: "Let me talk to my team. Can you send over the treatment?", ko: '팀과 논의해보겠습니다. 트리트먼트 보내주실 수 있나요?' },
        { s: 'You', en: "It'll be in your inbox this afternoon. Thanks for the time.", ko: '오늘 오후에 보내드리겠습니다. 시간 내주셔서 감사합니다.', tip: '구체적인 시점을 말하면 프로처럼 들린다.' }
      ],
      expressions: [
        { en: "What's the hook?", ko: '후크가 뭐죠?', note: '피칭에서 반드시 나오는 질문. 답을 미리 문장으로 준비할 것.' },
        { en: "It's a slow-burn drama.", ko: '서서히 고조되는 드라마입니다.', note: 'slow-burn은 장르 톤을 한 단어로 전달한다.' },
        { en: 'Where does this play?', ko: '어느 시장에서 통하나요?', note: 'play = 통하다, 먹히다. 배급 관점의 질문.' },
        { en: "Think A meets B.", ko: 'A에 B를 더한 느낌입니다.', note: '피칭의 고전 공식. 레퍼런스 두 개로 톤을 압축한다.' },
        { en: "We're looking at low seven figures.", ko: '100만 달러대 초반을 보고 있습니다.', note: 'seven figures = 100만 단위. 금액을 직접 말하지 않는 업계 화법.' },
        { en: "It's contained.", ko: '규모가 작고 통제 가능합니다.', note: '저예산 기획을 매력적으로 만드는 핵심 형용사.' },
        { en: 'Is there anyone attached?', ko: '참여 확정된 사람이 있나요?', note: 'attached / packaged는 기획 단계의 필수 용어.' },
        { en: 'Can you send over the treatment?', ko: '트리트먼트 보내주시겠어요?', note: '이 말이 나오면 미팅은 성공이다.' }
      ]
    },
    {
      id: 'film-festival',
      title: '영화제·마켓에서 네트워킹',
      titleEn: 'Festival & market networking',
      situation: '칸, 베를린 마켓의 리셉션장. 3분 안에 관계를 만들어야 한다.',
      lines: [
        { s: 'You', en: "Sorry to jump in — are you with the sales side or production?", ko: '실례지만, 세일즈 쪽이신가요 제작 쪽이신가요?', tip: '"Sorry to jump in"이 대화에 끼어드는 가장 안전한 문장.' },
        { s: 'Them', en: "Sales. I handle Asian territories for a Paris-based outfit.", ko: '세일즈입니다. 파리 회사에서 아시아 지역을 담당해요.', tip: 'territory = 판권 지역. outfit = 회사(캐주얼).' },
        { s: 'You', en: "Good to meet you. I'm a director out of Seoul — first feature in development.", ko: '반갑습니다. 서울에서 온 감독이고, 첫 장편을 개발 중입니다.', tip: '"out of + 도시"는 소속 도시를 말하는 업계식 표현.' },
        { s: 'Them', en: "What's it about?", ko: '어떤 작품인가요?', tip: '이 질문에 30초 안에 답하지 못하면 대화는 끝난다.' },
        { s: 'You', en: "One line: a man finally makes the film he's been avoiding his whole life.", ko: '한 줄로: 평생 피해온 영화를 마침내 찍는 남자 이야기입니다.', tip: '"One line:"으로 시작하면 상대가 귀를 연다.' },
        { s: 'Them', en: "That's a strong premise. Where are you in the process?", ko: '전제가 좋네요. 지금 어느 단계인가요?' },
        { s: 'You', en: "Second draft. We're putting the package together now.", ko: '2고입니다. 지금 패키지를 구성하고 있습니다.', tip: 'package = 시나리오 + 감독 + 배우 + 예산을 묶은 기획 단위.' },
        { s: 'Them', en: "Are you looking for co-production or financing?", ko: '공동제작을 찾으시나요, 투자를 찾으시나요?' },
        { s: 'You', en: "Both, honestly. But mostly I'm here to listen this year.", ko: '솔직히 둘 다요. 다만 올해는 주로 듣기 위해 왔습니다.', tip: '겸손한 태도가 첫 마켓에서는 오히려 유리하다.' },
        { s: 'Them', en: "Smart. Send me the logline and I'll keep an eye out.", ko: '현명하네요. 로그라인 보내주시면 눈여겨보겠습니다.', tip: '"keep an eye out"은 관심 갖고 지켜보겠다는 뜻.' },
        { s: 'You', en: "Appreciate that. Would it be alright if I followed up after the market?", ko: '감사합니다. 마켓 끝나고 연락드려도 될까요?', tip: 'follow up = 후속 연락. 반드시 허락을 구하고 실제로 할 것.' },
        { s: 'Them', en: "Please do. Here's my card — email works better than LinkedIn.", ko: '그럼요. 명함 드릴게요. 링크드인보다 이메일이 낫습니다.' }
      ],
      expressions: [
        { en: 'Sorry to jump in —', ko: '실례지만 끼어들자면요,', note: '낯선 무리에 합류할 때의 안전한 진입 문장.' },
        { en: "I'm a director out of Seoul.", ko: '서울에서 활동하는 감독입니다.', note: '"from"보다 "out of"가 업계 뉘앙스에 맞다.' },
        { en: 'One line: …', ko: '한 줄로 말하면요…', note: '상대의 집중을 확보하는 프레이밍.' },
        { en: "We're putting the package together.", ko: '패키지를 구성 중입니다.', note: '기획 진행 단계를 프로페셔널하게 표현하는 법.' },
        { en: "I'm here to listen this year.", ko: '올해는 배우러 왔습니다.', note: '경력 전환기에 쓰기 좋은, 문을 여는 겸손.' },
        { en: "I'll keep an eye out.", ko: '관심 갖고 지켜볼게요.', note: '긍정적이지만 확약은 아닌 업계식 대답.' },
        { en: 'Would it be alright if I followed up?', ko: '나중에 연락드려도 될까요?', note: '허락을 구하면 후속 메일의 회신율이 크게 오른다.' }
      ]
    },
    {
      id: 'film-coprod',
      title: '공동제작·예산 협상',
      titleEn: 'Co-production & budget talk',
      situation: '해외 프로듀서와 공동제작 조건, 예산, 지분을 조율하는 회의.',
      lines: [
        { s: 'Producer', en: "Let's talk numbers. What does the budget look like as it stands?", ko: '숫자 이야기를 해보죠. 현재 예산은 어떻게 되나요?', tip: '"as it stands"는 "현재 상태로는".' },
        { s: 'You', en: "One-point-eight, all in. That includes contingency and post.", ko: '전부 포함 180만입니다. 예비비와 후반작업 포함이고요.', tip: 'all in = 총액 기준. contingency = 예비비.' },
        { s: 'Producer', en: 'How much of that is locked?', ko: '그중 확정된 건 얼마인가요?', tip: 'locked = 확정된, 더는 바뀌지 않는.' },
        { s: 'You', en: "About forty percent, through a regional fund. The rest is soft.", ko: '지역 펀드로 40% 정도요. 나머지는 아직 유동적입니다.', tip: 'soft money(유동적 자금) ↔ hard money(확정 자금).' },
        { s: 'Producer', en: 'If we come in, we\'d be looking at a meaningful equity position.', ko: '저희가 참여한다면 상당한 지분을 원할 겁니다.', tip: 'equity position = 지분 참여 구조.' },
        { s: 'You', en: "Understood. What I can't move on is final cut.", ko: '이해합니다. 다만 제가 양보할 수 없는 건 최종 편집권입니다.', tip: '"What I can\'t move on is~"는 협상에서 선을 긋는 가장 세련된 문장.' },
        { s: 'Producer', en: "That's fair for a film this size. Let's put that in writing early.", ko: '이 규모 영화에선 합리적입니다. 그건 초반에 문서화하죠.' },
        { s: 'You', en: "Agreed. Where do you see the flexibility on your end?", ko: '동의합니다. 그쪽에서는 어디에 여지가 있다고 보시나요?', tip: '상대의 양보 가능 지점을 묻는 정중한 방식.' },
        { s: 'Producer', en: "We could bring post services in-kind. That takes pressure off cash.", ko: '후반작업을 현물로 지원할 수 있습니다. 현금 부담이 줄죠.', tip: 'in-kind = 현금 대신 서비스·설비로 제공하는 투자.' },
        { s: 'You', en: "That's a real solution. Let me run the numbers and circle back Thursday.", ko: '실질적인 해법이네요. 계산해보고 목요일에 다시 말씀드리겠습니다.', tip: '"circle back"은 나중에 다시 논의하다. 회의에서 매우 흔하다.' },
        { s: 'Producer', en: "Works for me. I'll have our line producer send a template budget.", ko: '좋습니다. 저희 라인프로듀서가 예산 양식을 보내드릴 겁니다.' },
        { s: 'You', en: "Perfect. Let's keep this moving.", ko: '완벽합니다. 계속 진행하시죠.', tip: '"Let\'s keep this moving"으로 회의를 긍정적으로 닫는다.' }
      ],
      expressions: [
        { en: 'What does the budget look like as it stands?', ko: '현재 예산이 어떻게 되나요?', note: 'as it stands = 지금 상태로는.' },
        { en: 'One-point-eight, all in.', ko: '전부 포함 180만입니다.', note: '금액을 말할 때 all in을 붙여 총액임을 분명히 한다.' },
        { en: 'How much of that is locked?', ko: '그중 확정된 건 얼마죠?', note: 'locked ↔ soft. 자금 확정도를 묻는 핵심 단어.' },
        { en: "What I can't move on is final cut.", ko: '최종 편집권만은 양보할 수 없습니다.', note: '감독이 반드시 익혀야 할 협상 문장.' },
        { en: 'Where do you see the flexibility on your end?', ko: '그쪽은 어디에 여지가 있나요?', note: '대립 대신 협력의 틀로 협상을 옮긴다.' },
        { en: 'We could bring post services in-kind.', ko: '후반작업을 현물로 지원할 수 있습니다.', note: 'in-kind 투자는 저예산 영화의 현실적 해법.' },
        { en: "Let me circle back Thursday.", ko: '목요일에 다시 말씀드리겠습니다.', note: '즉답을 피하면서 신뢰를 유지하는 표현.' }
      ]
    },
    {
      id: 'film-set',
      title: '현장 연출 — 스태프와 배우에게',
      titleEn: 'Directing on set',
      situation: '촬영 현장. 짧고 명확하게, 그러나 존중을 담아 지시한다.',
      lines: [
        { s: 'You', en: "Let's take it from the top. Same energy, half the volume.", ko: '처음부터 갑시다. 에너지는 같게, 볼륨은 절반으로.', tip: '"from the top"은 처음부터. 연출 지시의 기본 어휘.' },
        { s: 'AD', en: 'Copy that. Quiet on set, please. Rolling!', ko: '알겠습니다. 현장 정숙해주세요. 촬영 들어갑니다!', tip: '"Copy that"은 무전기 응답의 정석.' },
        { s: 'You', en: "Cut. That was good — let's go again for safety.", ko: '컷. 좋았어요. 안전하게 한 번 더 갑시다.', tip: '"for safety"는 만약을 위한 추가 테이크.' },
        { s: 'You', en: "Can we get a little more separation between him and the wall?", ko: '인물과 벽 사이 간격을 좀 더 벌릴 수 있을까요?', tip: '"Can we get~"은 명령 대신 요청으로 지시하는 현장 화법.' },
        { s: 'DP', en: "We can, but we'll lose the practical in the back.", ko: '가능하지만 뒤쪽 실사 조명이 빠집니다.', tip: 'practical = 화면 안에 실제로 보이는 조명기구.' },
        { s: 'You', en: "Let's live with that. The frame matters more here.", ko: '그건 감수합시다. 여기선 프레임이 더 중요해요.', tip: '"live with that"은 단점을 감수하다.' },
        { s: 'You', en: "Hey — one adjustment. Don't play the sadness. Just let it sit.", ko: '하나만 조정할게요. 슬픔을 연기하지 마세요. 그냥 놔두세요.', tip: '"Don\'t play the emotion"은 배우 디렉팅의 고전적 조언.' },
        { s: 'Actor', en: 'So less on the line, more in the pause?', ko: '대사에선 덜하고, 멈춤에서 더 하라는 말씀이죠?' },
        { s: 'You', en: "Exactly. Trust the silence. The camera's already close.", ko: '정확합니다. 침묵을 믿으세요. 카메라는 이미 가까이 있어요.' },
        { s: 'AD', en: 'We\'re losing the light in about forty minutes.', ko: '40분 후면 해가 넘어갑니다.', tip: '"losing the light"는 매직아워 종료 경고. 현장 필수 표현.' },
        { s: 'You', en: "Then let's prioritize the wide and pick up coverage tomorrow.", ko: '그럼 와이드부터 갑시다. 커버리지는 내일 보충하고요.', tip: 'coverage = 편집을 위한 다양한 각도의 촬영분.' },
        { s: 'You', en: "That's a wrap on this location. Great work, everyone.", ko: '이 장소 촬영 종료합니다. 모두 수고 많으셨습니다.', tip: '"That\'s a wrap"은 촬영 종료 선언의 관용구.' }
      ],
      expressions: [
        { en: "Let's take it from the top.", ko: '처음부터 다시 갑시다.', note: '리허설·테이크 재시작의 표준 표현.' },
        { en: "Let's go again for safety.", ko: '안전하게 한 번 더 갑시다.', note: '배우를 탓하지 않고 재촬영하는 방법.' },
        { en: 'Can we get a little more separation?', ko: '간격을 좀 더 벌릴 수 있을까요?', note: '요청형 지시가 현장 분위기를 만든다.' },
        { en: "Let's live with that.", ko: '그건 감수하고 갑시다.', note: '완벽을 포기하고 진행하는 결단의 언어.' },
        { en: "Don't play the sadness. Let it sit.", ko: '슬픔을 연기하지 말고 그냥 두세요.', note: '배우 디렉팅의 핵심. 통째로 익혀둘 것.' },
        { en: "We're losing the light.", ko: '해가 넘어갑니다.', note: '야외 촬영의 시간 압박을 알리는 신호.' },
        { en: "That's a wrap.", ko: '촬영 종료합니다.', note: '현장에서 가장 듣기 좋은 두 단어.' }
      ]
    },
    {
      id: 'film-cast',
      title: '배우에게 제안하기',
      titleEn: 'Approaching an actor',
      situation: '원하는 배우와의 첫 자리. 돈이 아니라 역할로 설득해야 하는 대화.',
      lines: [
        { s: 'Actor', en: "My agent sent me the script. I read it twice.", ko: '에이전트가 시나리오 보내줬어요. 두 번 읽었습니다.', tip: '두 번 읽었다는 건 관심이 있다는 강한 신호다.' },
        { s: 'You', en: "That means something. What stayed with you?", ko: '그건 의미가 있네요. 어떤 게 남으셨나요?', tip: '"What did you think?"보다 훨씬 좋은 질문. 인상에 남은 것을 묻는다.' },
        { s: 'Actor', en: "The silence in the third act. He doesn't explain himself once.", ko: '3막의 침묵이요. 그가 한 번도 자기를 설명하지 않더군요.' },
        { s: 'You', en: "That's exactly the part I can't compromise on.", ko: '바로 그 부분이 제가 타협할 수 없는 지점입니다.', tip: '배우가 짚은 것을 감독의 원칙으로 되받으면 신뢰가 생긴다.' },
        { s: 'Actor', en: "How much of it is on the page versus what you'll find on the day?", ko: '어디까지가 대본에 있고, 어디부터가 현장에서 찾는 건가요?', tip: '연출 방식을 묻는 질문. 배우가 가장 알고 싶어 하는 것.' },
        { s: 'You', en: "The structure is locked. The performance isn't. I want to find it with you.", ko: '구조는 확정입니다. 연기는 아니고요. 그건 함께 찾고 싶습니다.', tip: '통제와 여지를 동시에 보여주는 답. 외워둘 만하다.' },
        { s: 'Actor', en: "I appreciate that. What's the shooting schedule looking like?", ko: '좋네요. 촬영 일정은 어떻게 되나요?' },
        { s: 'You', en: "Twenty-six days in the spring. Six-day weeks, but your character is out by day eighteen.", ko: '봄에 26회차입니다. 주 6일이지만 그쪽 캐릭터는 18일차에 끝납니다.', tip: '배우의 실제 관심사는 총 기간이 아니라 자기 촬영 일수다.' },
        { s: 'Actor', en: "I have to be honest — the offer is well below my quote.", ko: '솔직히 말씀드리면, 제안이 제 개런티보다 한참 낮습니다.', tip: 'quote = 배우의 통상 출연료. 반드시 알아야 할 단어.' },
        { s: 'You', en: "I know. I can't fix that with money. I can only offer you the role.", ko: '압니다. 돈으로는 해결해드릴 수가 없어요. 드릴 수 있는 건 역할뿐입니다.', tip: '저예산 영화가 배우를 설득하는 유일한 정직한 문장.' },
        { s: 'Actor', en: "Let me sit with it over the weekend.", ko: '주말 동안 생각해보겠습니다.', tip: '"sit with it"은 서둘러 결정하지 않고 곱씹어보다.' },
        { s: 'You', en: "Take your time. And thank you for reading it twice.", ko: '천천히 보세요. 두 번 읽어주셔서 감사합니다.' }
      ],
      expressions: [
        { en: 'What stayed with you?', ko: '어떤 게 기억에 남으셨나요?', note: '감상을 묻는 가장 좋은 질문. 상대가 진짜 읽었는지도 드러난다.' },
        { en: "That's the part I can't compromise on.", ko: '그 부분은 타협할 수 없습니다.', note: '감독의 원칙을 밝히는 문장. 협상에서도 그대로 쓴다.' },
        { en: "The structure is locked. The performance isn't.", ko: '구조는 확정, 연기는 열려 있습니다.', note: '통제와 여지를 동시에 보여주는 연출관.' },
        { en: 'Your character is out by day eighteen.', ko: '그 배역은 18일차에 촬영이 끝납니다.', note: '배우가 실제로 궁금해하는 건 총 회차가 아니라 자기 일정이다.' },
        { en: "The offer is below my quote.", ko: '제안이 제 개런티보다 낮습니다.', note: 'quote = 배우의 통상 출연료. 듣기용으로 반드시 알아둘 것.' },
        { en: "I can only offer you the role.", ko: '제가 드릴 수 있는 건 역할뿐입니다.', note: '저예산이 가진 유일한 무기를 정직하게 내미는 말.' },
        { en: 'Let me sit with it.', ko: '좀 더 생각해보겠습니다.', note: '거절도 수락도 아닌 상태. 재촉하면 잃는다.' }
      ]
    },
    {
      id: 'film-post',
      title: '후반작업 — 색보정과 사운드',
      titleEn: 'Post-production review',
      situation: '색보정실과 사운드 믹싱룸. 20년 해온 일을 영어로 말해야 하는 자리.',
      lines: [
        { s: 'Colorist', en: "I've done a first pass. Take a look and tell me where it's off.", ko: '1차 작업했습니다. 보시고 어디가 어긋나는지 말씀해주세요.', tip: 'pass = 작업 회차. "first pass"는 초벌.' },
        { s: 'You', en: "The skin tones are reading a little warm for me.", ko: '피부톤이 제 눈엔 좀 따뜻하게 읽히네요.', tip: '"read"는 화면에서 그렇게 보인다는 뜻. 색보정실의 기본 동사.' },
        { s: 'Colorist', en: 'Want me to pull some red out globally, or just in the close-ups?', ko: '전체적으로 레드를 뺄까요, 클로즈업만 할까요?', tip: 'globally = 전체 샷에 일괄로.' },
        { s: 'You', en: "Just the close-ups. The wides are doing what I want.", ko: '클로즈업만요. 와이드는 원하는 대로 나왔습니다.' },
        { s: 'You', en: "Can we crush the blacks a touch in this sequence?", ko: '이 시퀀스에서 블랙을 조금만 더 눌러줄 수 있을까요?', tip: 'crush the blacks = 어두운 부분을 더 깊게. "a touch"는 아주 조금.' },
        { s: 'Colorist', en: "We can, but we'll lose detail in the coat.", ko: '가능합니다만 코트의 디테일이 사라집니다.' },
        { s: 'You', en: "I'll take that trade. The mood matters more than the fabric.", ko: '그 정도는 감수하겠습니다. 질감보다 분위기가 중요해요.', tip: '"I\'ll take that trade"는 손익을 알고 선택한다는 뜻.' },
        { s: 'Mixer', en: "On the mix — the dialogue is fighting the score in scene forty.", ko: '믹스 쪽인데, 40씬에서 대사와 음악이 부딪힙니다.', tip: '"fighting"은 두 소리가 서로를 잡아먹는 상태.' },
        { s: 'You', en: "Then duck the score. I'd rather lose the music than a word.", ko: '그럼 음악을 낮춰주세요. 단어 하나 잃느니 음악을 잃겠습니다.', tip: 'duck = 다른 소리를 위해 볼륨을 눌러주다. 사운드 현장의 필수 동사.' },
        { s: 'Mixer', en: "Understood. And the room tone changes at the cut — want me to smooth it?", ko: '알겠습니다. 컷에서 룸톤이 튀는데 부드럽게 갈까요?', tip: 'room tone = 공간의 기본 소음. 편집점에서 튀면 티가 난다.' },
        { s: 'You', en: "Please. Let's not let the audience hear the edit.", ko: '네. 관객이 편집을 듣게 하지는 맙시다.', tip: '이 한 문장이 후반작업의 원칙 전부를 담고 있다.' },
        { s: 'Mixer', en: "I'll have a new version up by tomorrow morning.", ko: '내일 아침까지 새 버전 올려두겠습니다.' }
      ],
      expressions: [
        { en: 'The skin tones are reading warm.', ko: '피부톤이 따뜻하게 보입니다.', note: 'read = 화면에서 그렇게 보이다. 색보정실의 핵심 동사.' },
        { en: 'Can we crush the blacks a touch?', ko: '블랙을 조금만 더 눌러줄까요?', note: 'a touch = 아주 살짝. 미세 조정을 요청하는 표현.' },
        { en: "I'll take that trade.", ko: '그 손해는 감수하겠습니다.', note: '무엇을 잃는지 알고 선택한다는 프로의 화법.' },
        { en: 'The dialogue is fighting the score.', ko: '대사와 음악이 부딪힙니다.', note: '두 소리가 서로를 잡아먹는 상태.' },
        { en: 'Duck the score under the line.', ko: '대사 밑으로 음악을 낮춰주세요.', note: 'duck = 다른 소리를 위해 볼륨을 눌러주다.' },
        { en: 'The room tone changes at the cut.', ko: '편집점에서 룸톤이 튑니다.', note: 'room tone은 공간의 기본 소음. 후반작업 필수 용어.' },
        { en: "Let's not let the audience hear the edit.", ko: '관객이 편집을 듣게 하지 맙시다.', note: '후반작업의 원칙을 한 문장으로 압축한 말.' }
      ]
    },
    {
      id: 'film-gv',
      title: '영화제 관객과의 대화',
      titleEn: 'Festival Q&A',
      situation: '상영 직후 무대. 통역 없이 답해야 하는 순간이 온다.',
      lines: [
        { s: 'Moderator', en: "Congratulations on the premiere. Where did this story come from?", ko: '프리미어 축하합니다. 이 이야기는 어디서 왔나요?', tip: 'GV의 첫 질문은 거의 항상 이것이다. 답을 통째로 준비해둘 것.' },
        { s: 'You', en: "I spent twenty years preparing to make a film, and never made one. That became the film.", ko: '20년을 영화 만들 준비만 하며 보냈고, 한 편도 못 만들었습니다. 그게 이 영화가 됐습니다.', tip: '개인적인 사실 하나가 어떤 설명보다 강하다.' },
        { s: 'Moderator', en: "That's a hell of an origin. Let's open it up to the audience.", ko: '대단한 출발점이네요. 관객 질문 받겠습니다.' },
        { s: 'Audience', en: "Why did you choose to shoot so much of it in one room?", ko: '왜 그렇게 많은 부분을 한 방에서 찍으셨나요?' },
        { s: 'You', en: "Partly budget, honestly. But the limit turned out to be the point.", ko: '솔직히 절반은 예산 때문입니다. 그런데 그 제약이 결국 주제가 됐어요.', tip: '한계를 인정하면서 의미로 바꾸는 답. 관객이 가장 좋아한다.' },
        { s: 'Audience', en: "Sorry, could you say more about the ending? I'm not sure I understood it.", ko: '죄송한데 결말에 대해 좀 더 말씀해주시겠어요? 이해를 못 한 것 같아서요.' },
        { s: 'You', en: "I'd rather not explain it — that would take it away from you.", ko: '설명하지 않는 편이 낫겠습니다. 그러면 그 몫을 빼앗는 게 되니까요.', tip: '설명을 거절하면서도 무례하지 않은 문장. 감독의 정석 답변.' },
        { s: 'You', en: "But I'll say this: he isn't lying at the end. That's the one thing I'd defend.", ko: '다만 이건 말씀드리죠. 마지막에 그는 거짓말하고 있지 않습니다. 그것만은 지키겠습니다.', tip: '전부 닫지 않고 하나만 열어주는 방식.' },
        { s: 'Moderator', en: "We have time for one more.", ko: '한 분만 더 받겠습니다.' },
        { s: 'Audience', en: "What's next for you?", ko: '다음 작품은 무엇인가요?' },
        { s: 'You', en: "Something smaller, and sooner. I'm not waiting twenty years again.", ko: '더 작고, 더 빨리요. 다시 20년을 기다리지는 않을 겁니다.', tip: '유머와 결심을 함께 담은 마무리. 이런 답이 기억에 남는다.' },
        { s: 'Moderator', en: "Please join me in thanking the director.", ko: '감독님께 박수 부탁드립니다.' }
      ],
      expressions: [
        { en: 'Where did this story come from?', ko: '이 이야기는 어디서 왔나요?', note: 'GV의 첫 질문. 답을 문장으로 굳혀 외워둘 것.' },
        { en: 'The limit turned out to be the point.', ko: '그 제약이 결국 주제가 됐습니다.', note: '저예산을 미학으로 바꿔 말하는 방법.' },
        { en: "I'd rather not explain it.", ko: '설명하지 않는 편이 낫겠습니다.', note: '거절이 아니라 관객을 존중하는 태도로 들린다.' },
        { en: "That's the one thing I'd defend.", ko: '그것만은 지키겠습니다.', note: '전부 닫지 않고 하나만 열어주는 답변 기술.' },
        { en: 'Could you say more about…?', ko: '~에 대해 더 말씀해주시겠어요?', note: '관객이 자주 쓰는 표현. 듣기용으로 익혀둘 것.' },
        { en: "What's next for you?", ko: '다음 작품은요?', note: '반드시 나온다. 짧고 구체적으로 답할 것.' },
        { en: 'We have time for one more.', ko: '한 분만 더 받겠습니다.', note: '사회자의 마무리 신호. 답을 짧게 줄여야 할 때다.' }
      ]
    },
    {
      id: 'film-sales',
      title: '배급·세일즈 미팅과 계약 용어',
      titleEn: 'Sales, distribution & deal terms',
      situation: '완성된 영화의 판권을 논의하는 미팅. 숫자와 조건의 언어.',
      lines: [
        { s: 'Buyer', en: "We screened it last night. There's a lot to like here.", ko: '어젯밤에 봤습니다. 마음에 드는 부분이 많더군요.', tip: '"There\'s a lot to like"는 긍정적이지만 조건부인 평가.' },
        { s: 'You', en: "Glad it landed. What's your read on the audience?", ko: '잘 전달됐다니 다행입니다. 관객에 대한 판단은 어떠신가요?', tip: '"land"는 의도한 대로 가닿다. "What\'s your read?"는 견해를 묻는 말.' },
        { s: 'Buyer', en: "Arthouse core, but it could cross over with the right campaign.", ko: '아트하우스 관객이 중심이지만, 캠페인만 잘하면 확장될 수 있습니다.', tip: 'cross over = 주류 관객으로 확장되다.' },
        { s: 'You', en: "That's been our sense too. What territories are you looking at?", ko: '저희 판단도 그렇습니다. 어느 지역을 보고 계신가요?' },
        { s: 'Buyer', en: "North America, all rights. We'd want a seven-year term.", ko: '북미 전권입니다. 7년 계약을 원합니다.', tip: 'all rights = 극장·방송·스트리밍 전체 권리. term = 계약 기간.' },
        { s: 'You', en: "Seven is long for a first feature. Could we look at five with an option?", ko: '첫 장편에 7년은 깁니다. 5년에 옵션을 붙이면 어떨까요?', tip: '거절 대신 대안을 제시하는 것이 협상의 기본기.' },
        { s: 'Buyer', en: "We can discuss that. What are you thinking on the MG?", ko: '논의 가능합니다. 최소보증금은 어느 정도 생각하시나요?', tip: 'MG(Minimum Guarantee) = 최소보증금. 세일즈의 핵심 숫자.' },
        { s: 'You', en: "We'd need to cover our P&A commitment at minimum.", ko: '최소한 마케팅·프린트 비용은 커버되어야 합니다.', tip: 'P&A = Prints and Advertising, 배급 마케팅 비용.' },
        { s: 'Buyer', en: "Understood. And how does the back end split?", ko: '알겠습니다. 수익 배분은 어떻게 되나요?', tip: 'back end = 손익분기 이후의 수익 배분.' },
        { s: 'You', en: "Standard split after recoupment. Our sales agent can walk you through it.", ko: '회수 이후 표준 배분입니다. 저희 세일즈 에이전트가 설명드릴 겁니다.', tip: 'recoupment = 투자금 회수. "walk you through"는 차근차근 설명하다.' },
        { s: 'Buyer', en: "Let's get the deal memo drafted and go from there.", ko: '딜메모부터 작성하고 진행하시죠.', tip: 'deal memo = 정식 계약 전의 핵심 조건 합의서.' },
        { s: 'You', en: "Sounds good. I'll loop in our lawyer today.", ko: '좋습니다. 오늘 변호사를 참여시키겠습니다.', tip: '"loop someone in"은 논의에 참여시키다. 업무 영어의 필수 표현.' }
      ],
      expressions: [
        { en: "There's a lot to like here.", ko: '마음에 드는 지점이 많습니다.', note: '완전한 수락은 아닌, 업계식 긍정 평가.' },
        { en: "What's your read on it?", ko: '어떻게 보시나요?', note: '"opinion"보다 프로페셔널하게 들린다.' },
        { en: 'It could cross over.', ko: '주류 관객으로 확장될 수 있습니다.', note: '아트하우스 영화의 상업적 가능성을 말하는 방식.' },
        { en: 'What territories are you looking at?', ko: '어느 지역 판권을 보시나요?', note: 'territory는 세일즈 대화의 기본 단위.' },
        { en: 'Could we look at five with an option?', ko: '5년에 옵션을 붙이면 어떨까요?', note: '거절 대신 대안. 협상력을 유지하는 문장.' },
        { en: "What are you thinking on the MG?", ko: '최소보증금은 어떻게 보시나요?', note: 'MG = Minimum Guarantee. 반드시 알아야 할 약어.' },
        { en: 'How does the back end split?', ko: '수익 배분은 어떻게 되나요?', note: 'back end = 회수 이후 수익. 계약의 실질적 핵심.' },
        { en: "I'll loop in our lawyer.", ko: '변호사를 참여시키겠습니다.', note: 'loop in은 모든 비즈니스 상황에서 통용된다.' }
      ]
    }
  ]
};
