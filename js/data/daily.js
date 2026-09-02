/* 모드 1 — 일상회화 (Everyday English)
 * 교과서 문장이 아니라 원어민이 실제로 흘리듯 말하는 표현 위주로 구성.
 * en: 실제 발화 / ko: 의미 중심 번역 / tip: 왜 그렇게 말하는지 */
window.PACKS = window.PACKS || {};

window.PACKS.daily = {
  id: 'daily',
  title: '일상회화',
  titleEn: 'Everyday',
  icon: '☕',
  blurb: '동네, 카페, 집, 친구. 매일 쓰는 말부터 자연스럽게.',
  scenes: [
    {
      id: 'daily-coffee',
      title: '카페에서 주문하고 잡담하기',
      titleEn: 'At the coffee shop',
      situation: '단골 카페. 바리스타와 짧게 인사를 주고받는 상황.',
      lines: [
        { s: 'Barista', en: "Hey, how's it going?", ko: '안녕하세요, 잘 지내시죠?', tip: '"How are you?"보다 훨씬 흔한 인사. 대답도 가볍게 던지면 된다.' },
        { s: 'You', en: "Pretty good, thanks. Yourself?", ko: '괜찮아요, 고마워요. 그쪽은요?', tip: '"And you?" 대신 "Yourself?" 한 단어면 충분하다.' },
        { s: 'Barista', en: "Can't complain. What can I get started for you?", ko: '나쁘지 않아요. 뭐 드릴까요?', tip: '"Can\'t complain"은 "그럭저럭 괜찮아"의 국민 대답.' },
        { s: 'You', en: "I'll do a large flat white, please. For here.", ko: '플랫화이트 라지로 주세요. 매장에서 먹을게요.', tip: '주문할 때 "I\'ll do~"가 "I want~"보다 자연스럽고 부드럽다.' },
        { s: 'Barista', en: "You got it. Anything else?", ko: '알겠습니다. 더 필요하신 건요?', tip: '"You got it"은 "알겠어요"의 캐주얼 버전.' },
        { s: 'You', en: "That'll be it, thanks.", ko: '그거면 됐어요, 감사합니다.', tip: '"That\'s all"보다 말맛이 좋다.' },
        { s: 'Barista', en: "Cool. It'll be just a couple minutes.", ko: '네. 2분 정도면 나와요.' },
        { s: 'You', en: "No rush.", ko: '천천히 하세요.', tip: '두 단어로 여유를 표현하는 만능 표현.' },
        { s: 'Barista', en: "Here you go. Have a good one!", ko: '나왔습니다. 좋은 하루 보내세요!' },
        { s: 'You', en: "You too. Take care.", ko: '그쪽도요. 조심히 가세요.' }
      ],
      expressions: [
        { en: "How's it going?", ko: '잘 지내?', note: '가장 흔한 캐주얼 인사. 진짜 안부를 묻는 게 아니라 인사말이다.' },
        { en: "Can't complain.", ko: '뭐, 나쁘지 않아.', note: '"좋다"고 말하기 애매할 때 쓰는 어른스러운 대답.' },
        { en: "I'll do a large latte.", ko: '라떼 라지로 할게요.', note: '주문할 때 do를 쓰면 훨씬 부드럽다.' },
        { en: 'You got it.', ko: '알겠어요 / 그럼요.', note: '점원, 동료 모두에게 쓰는 가벼운 수락.' },
        { en: 'No rush.', ko: '천천히 하세요.', note: '기다림에 여유를 보여주는 배려 표현.' },
        { en: 'Have a good one!', ko: '좋은 하루 보내세요!', note: '"Have a good day"의 구어체. 저녁에도 쓸 수 있다.' }
      ]
    },
    {
      id: 'daily-catchup',
      title: '오랜만에 만난 친구와 근황 나누기',
      titleEn: 'Catching up with a friend',
      situation: '몇 달 만에 만난 친구. 서로 근황을 묻는다.',
      lines: [
        { s: 'Friend', en: "Look who it is! It's been forever.", ko: '이게 누구야! 진짜 오랜만이다.', tip: '"Long time no see"보다 원어민스럽다.' },
        { s: 'You', en: "I know, right? What have you been up to?", ko: '그러게 말이야. 요즘 뭐 하고 지내?', tip: '"What have you been up to?"가 근황 묻는 표준 표현.' },
        { s: 'Friend', en: "Same old, same old. Work's been crazy.", ko: '늘 똑같지 뭐. 일이 정신없었어.', tip: '"Same old"는 "그냥 그렇지"의 뉘앙스.' },
        { s: 'You', en: "Tell me about it. I've been swamped too.", ko: '내 말이. 나도 일에 파묻혀 살았어.', tip: '"Tell me about it"은 공감의 맞장구. "말도 마"에 가깝다.' },
        { s: 'Friend', en: "Are you still doing the film thing on the side?", ko: '아직 영화 쪽 일도 병행하고 있어?', tip: '"on the side"는 본업 외에 따로 하는 일.' },
        { s: 'You', en: "Yeah, I'm working on a script right now, actually.", ko: '응, 사실 지금 시나리오 쓰고 있어.', tip: '"actually"를 문장 끝에 붙이면 자연스럽다.' },
        { s: 'Friend', en: "No way. That's huge. How far along are you?", ko: '진짜? 대단하다. 얼마나 진행됐어?', tip: '"How far along are you?"는 진행 상황을 묻는 표현.' },
        { s: 'You', en: "About halfway. It's slow going, but I'm getting there.", ko: '절반쯤. 더디지만 조금씩 가고 있어.', tip: '"I\'m getting there"는 "조금씩 나아지고 있어"의 겸손한 표현.' },
        { s: 'Friend', en: "Good for you. Seriously. Let me know when I can read it.", ko: '잘하고 있네. 진심으로. 읽을 수 있게 되면 알려줘.' },
        { s: 'You', en: "Will do. Let's not leave it this long next time.", ko: '그럴게. 다음엔 이렇게 오래 두지 말자.' }
      ],
      expressions: [
        { en: "It's been forever.", ko: '진짜 오랜만이다.', note: '과장 표현이지만 일상에서 매우 흔하다.' },
        { en: 'What have you been up to?', ko: '요즘 뭐 하고 지냈어?', note: '근황을 묻는 가장 자연스러운 문장.' },
        { en: 'Same old, same old.', ko: '늘 그렇지 뭐.', note: '특별한 일 없을 때의 정석 대답.' },
        { en: 'Tell me about it.', ko: '내 말이 / 말도 마.', note: '"나한테 말해봐"가 아니라 강한 공감이다. 헷갈리기 쉬움.' },
        { en: "I've been swamped.", ko: '일에 파묻혀 살았어.', note: 'busy보다 강도가 세고 원어민이 훨씬 자주 쓴다.' },
        { en: "I'm getting there.", ko: '조금씩 되어가고 있어.', note: '완성 전 상태를 긍정적으로 말하는 방법.' },
        { en: 'Good for you.', ko: '잘됐다 / 잘하고 있네.', note: '톤이 중요하다. 밋밋하게 말하면 비꼬는 뉘앙스가 된다.' }
      ]
    },
    {
      id: 'daily-family',
      title: '가족과 저녁 식탁에서',
      titleEn: 'Dinner table with family',
      situation: '하루를 마치고 가족과 밥을 먹으며 나누는 대화.',
      lines: [
        { s: 'You', en: "Dinner's ready! Come grab a plate.", ko: '저녁 다 됐어! 와서 접시 들고 가.', tip: '"grab"은 캐주얼하게 "가져가다".' },
        { s: 'Kid', en: "Give me a sec, I'm almost done with this.", ko: '잠깐만, 이것만 거의 다 끝났어.', tip: '"Give me a sec"은 "잠깐만"의 구어체.' },
        { s: 'You', en: "It's getting cold. How was your day, anyway?", ko: '식는다. 그건 그렇고 오늘 하루 어땠어?', tip: '"anyway"로 화제를 자연스럽게 돌린다.' },
        { s: 'Kid', en: "It was okay. Nothing special happened.", ko: '그냥 그랬어. 별일 없었어.' },
        { s: 'Spouse', en: "Did you ever hear back about that thing at work?", ko: '회사 그 건은 연락 왔어?', tip: '"hear back"은 답을 받는 것. 회신 여부를 묻는 표현.' },
        { s: 'You', en: "Not yet. They said they'd let me know by Friday.", ko: '아직. 금요일까지 알려준다고 했어.' },
        { s: 'Spouse', en: "Fingers crossed. You've put a lot into it.", ko: '잘되길 바라. 정말 많이 쏟아부었잖아.', tip: '"Fingers crossed"는 행운을 비는 관용구.' },
        { s: 'You', en: "We'll see. Either way, life goes on.", ko: '두고 봐야지. 어느 쪽이든 사는 건 계속되니까.' },
        { s: 'Kid', en: "Can I be excused? I've got homework.", ko: '저 일어나도 돼요? 숙제 있어요.', tip: '식탁에서 먼저 일어날 때 쓰는 정중한 표현.' },
        { s: 'You', en: "Go ahead. Put your dish in the sink, though.", ko: '그래. 대신 접시는 싱크대에 넣어놓고.' }
      ],
      expressions: [
        { en: 'Give me a sec.', ko: '잠깐만.', note: 'second를 sec으로 줄여 말하는 게 기본이다.' },
        { en: 'How was your day?', ko: '오늘 하루 어땠어?', note: '가족 대화의 문을 여는 표준 문장.' },
        { en: 'Did you hear back from them?', ko: '그쪽에서 연락 왔어?', note: '이메일·지원 결과 등 회신을 묻는 표현.' },
        { en: 'Fingers crossed.', ko: '잘되길 빌어.', note: '손가락을 꼬는 제스처에서 온 관용구.' },
        { en: "We'll see.", ko: '두고 봐야지.', note: '확답을 피하며 여지를 남기는 어른의 화법.' },
        { en: 'Can I be excused?', ko: '먼저 일어나도 될까요?', note: '식탁 예절 표현. 아이들이 특히 자주 쓴다.' }
      ]
    },
    {
      id: 'daily-notwell',
      title: '컨디션이 안 좋을 때',
      titleEn: "When you're not feeling great",
      situation: '몸이 찌뿌둥한 날, 동료나 친구에게 상태를 설명한다.',
      lines: [
        { s: 'Friend', en: "You look a little off today. Everything alright?", ko: '오늘 좀 안 좋아 보이네. 괜찮아?', tip: '"off"는 평소 같지 않다는 뜻. 아주 자주 쓴다.' },
        { s: 'You', en: "Honestly, I'm running on fumes. Barely slept.", ko: '솔직히 완전 방전됐어. 거의 못 잤어.', tip: '"running on fumes"는 연료가 바닥난 상태. 체력 고갈에 딱 맞는다.' },
        { s: 'Friend', en: "That's rough. Is it the usual stuff keeping you up?", ko: '힘들겠다. 늘 그 문제 때문에 못 자는 거야?', tip: '"keep you up"은 잠 못 들게 하다.' },
        { s: 'You', en: "Yeah. My head just won't shut off at night.", ko: '응. 밤에 머리가 안 꺼져.', tip: '생각이 멈추지 않는 상태를 원어민은 이렇게 표현한다.' },
        { s: 'Friend', en: "Have you tried cutting back on caffeine after lunch?", ko: '점심 이후 카페인 줄여봤어?', tip: '"cut back on"은 양을 줄이다.' },
        { s: 'You', en: "I keep meaning to. Old habits die hard.", ko: '계속 그러려고는 해. 습관 고치기가 어렵네.', tip: '"I keep meaning to"는 "계속 하려고는 하는데" 하는 미룸의 표현.' },
        { s: 'Friend', en: "Take it easy today. Don't push yourself.", ko: '오늘은 좀 쉬엄쉬엄해. 무리하지 말고.' },
        { s: 'You', en: "I'll try. I might call it an early night.", ko: '그럴게. 오늘은 일찍 잘까 봐.', tip: '"call it an early night"은 일찍 마무리하고 자다.' },
        { s: 'Friend', en: "Good idea. Get some real rest.", ko: '좋은 생각이야. 제대로 좀 쉬어.' },
        { s: 'You', en: "Thanks for checking in.", ko: '신경 써줘서 고마워.', tip: '"check in on someone"은 안부를 확인하다.' }
      ],
      expressions: [
        { en: 'You look a little off.', ko: '오늘 좀 안 좋아 보여.', note: '컨디션·기분이 평소 같지 않을 때.' },
        { en: "I'm running on fumes.", ko: '완전히 방전됐어.', note: '50대의 체력 고갈을 표현하기에 가장 그럴듯한 문장.' },
        { en: "My head won't shut off.", ko: '생각이 멈추질 않아.', note: '불면·잡념을 설명하는 원어민식 표현.' },
        { en: 'I keep meaning to.', ko: '계속 하려고는 했어.', note: '미루고 있는 일을 인정하는 부드러운 방식.' },
        { en: 'Take it easy.', ko: '무리하지 마 / 살살해.', note: '작별 인사로도 쓰인다.' },
        { en: "I'll call it an early night.", ko: '오늘은 일찍 자야겠어.', note: '"call it a day"의 밤 버전.' }
      ]
    },
    {
      id: 'daily-plans',
      title: '약속 잡고, 미루고, 취소하기',
      titleEn: 'Making and breaking plans',
      situation: '주말 약속을 잡다가 일정이 꼬여 조정하는 상황.',
      lines: [
        { s: 'Friend', en: "Are you free this weekend? We should grab dinner.", ko: '이번 주말에 시간 돼? 저녁 한번 먹자.', tip: '"grab"이 붙으면 부담 없는 만남이 된다.' },
        { s: 'You', en: "I should be. What day were you thinking?", ko: '아마 될 거야. 무슨 요일 생각했어?', tip: '"What day were you thinking?"이 확정 전 조율의 표준 문장.' },
        { s: 'Friend', en: "Saturday works best for me. Around seven?", ko: '토요일이 제일 좋아. 7시쯤?' },
        { s: 'You', en: "Let me double-check and get back to you tonight.", ko: '확인해보고 오늘 밤에 알려줄게.', tip: '"get back to you"는 다시 연락하겠다는 뜻.' },
        { s: 'Friend', en: "Sounds good. Just shoot me a text.", ko: '좋아. 문자 하나 보내줘.', tip: '"shoot me a text"는 가볍게 문자 보내라는 뜻.' },
        { s: 'You', en: "Hey, something came up. Any chance we could push it to Sunday?", ko: '있잖아, 일이 생겼어. 혹시 일요일로 미룰 수 있을까?', tip: '"something came up"은 취소·연기의 만능 사유.' },
        { s: 'Friend', en: "No worries at all. Sunday's fine.", ko: '전혀 괜찮아. 일요일도 좋아.' },
        { s: 'You', en: "You're a lifesaver. I owe you one.", ko: '진짜 고마워. 내가 한 번 신세 졌다.', tip: '"I owe you one"은 신세를 갚겠다는 뉘앙스.' },
        { s: 'Friend', en: "I'll hold you to that. Dinner's on you, then.", ko: '그 말 기억할게. 그럼 저녁은 네가 사는 걸로.', tip: '"hold you to that"은 약속을 지키게 하겠다는 농담조.' },
        { s: 'You', en: "Fair enough. See you Sunday.", ko: '그건 인정. 일요일에 봐.' }
      ],
      expressions: [
        { en: 'Are you free this weekend?', ko: '이번 주말에 시간 돼?', note: '가장 무난한 약속 제안.' },
        { en: 'What day were you thinking?', ko: '무슨 요일 생각했어?', note: '거절 여지를 남기면서 조율하는 문장.' },
        { en: "I'll get back to you.", ko: '다시 연락줄게.', note: '업무에서도 그대로 쓰인다.' },
        { en: 'Something came up.', ko: '갑자기 일이 생겼어.', note: '구체적 설명 없이 정중히 미룰 수 있는 표현.' },
        { en: 'Any chance we could push it to Sunday?', ko: '일요일로 미룰 수 있을까?', note: '"push it to~"가 일정 연기의 자연스러운 동사.' },
        { en: 'I owe you one.', ko: '내가 신세 졌다.', note: '관계를 부드럽게 만드는 마무리 표현.' }
      ]
    }
  ]
};
