/* 모드 2 — 여행회화 (Travel English)
 * 공항부터 트러블 대응까지. 실제로 말이 막히는 지점 위주로 구성. */
window.PACKS = window.PACKS || {};

window.PACKS.travel = {
  id: 'travel',
  title: '여행회화',
  titleEn: 'Travel',
  icon: '✈️',
  blurb: '입국심사, 호텔, 식당, 길찾기, 사고 대응까지.',
  scenes: [
    {
      id: 'travel-immigration',
      title: '입국심사와 공항',
      titleEn: 'Immigration & airport',
      situation: '해외 공항 입국심사대. 짧고 분명하게 답하는 것이 핵심.',
      lines: [
        { s: 'Officer', en: "What's the purpose of your visit?", ko: '방문 목적이 무엇입니까?', tip: '가장 먼저 나오는 질문. 한 문장으로 끊어 답한다.' },
        { s: 'You', en: "I'm here for a film festival. Business.", ko: '영화제 참석차 왔습니다. 업무입니다.', tip: '문장을 길게 늘이지 않는 게 오히려 신뢰를 준다.' },
        { s: 'Officer', en: 'How long do you plan to stay?', ko: '얼마나 머무를 예정입니까?' },
        { s: 'You', en: 'Ten days. I fly back on the 21st.', ko: '10일이요. 21일에 돌아갑니다.', tip: '귀국일을 함께 말하면 추가 질문이 줄어든다.' },
        { s: 'Officer', en: 'Where will you be staying?', ko: '어디에 머무릅니까?' },
        { s: 'You', en: "I've got a hotel booked downtown. I have the confirmation here.", ko: '시내에 호텔 예약해뒀습니다. 확인서 여기 있습니다.', tip: '"I have it here"라고 먼저 꺼내면 대화가 빨리 끝난다.' },
        { s: 'Officer', en: 'Are you traveling alone?', ko: '혼자 여행하십니까?' },
        { s: 'You', en: "Yes, but I'm meeting colleagues there.", ko: '네, 다만 현지에서 동료들을 만납니다.' },
        { s: 'Officer', en: 'Anything to declare?', ko: '신고할 물품이 있습니까?' },
        { s: 'You', en: 'Nothing to declare. Just personal belongings.', ko: '신고할 것 없습니다. 개인 소지품뿐입니다.', tip: '"Nothing to declare"는 통째로 외워두면 좋다.' },
        { s: 'Officer', en: "Alright. Enjoy your stay.", ko: '좋습니다. 즐거운 체류 되세요.' },
        { s: 'You', en: 'Thank you. Have a good day.', ko: '감사합니다. 좋은 하루 보내세요.' }
      ],
      expressions: [
        { en: "I'm here on business.", ko: '업무차 왔습니다.', note: '관광이면 "I\'m here on vacation."' },
        { en: 'I fly back on the 21st.', ko: '21일에 돌아갑니다.', note: '귀국 일정을 먼저 밝히면 심사가 짧아진다.' },
        { en: "I've got a hotel booked downtown.", ko: '시내에 호텔을 예약해뒀습니다.', note: '"I have~"보다 "I\'ve got~"이 구어적이다.' },
        { en: 'Nothing to declare.', ko: '신고할 물품 없습니다.', note: '세관 통과 시 그대로 사용.' },
        { en: 'My connecting flight is at 3.', ko: '환승 비행기가 3시입니다.', note: '경유 시 반드시 필요한 단어가 connecting flight.' },
        { en: 'My luggage didn\'t come out.', ko: '수하물이 안 나왔어요.', note: '분실 신고는 baggage claim의 lost luggage counter에서.' }
      ]
    },
    {
      id: 'travel-hotel',
      title: '호텔 체크인과 문제 해결',
      titleEn: 'Hotel check-in & problems',
      situation: '체크인 후 방에 문제가 생겨 프런트에 요청하는 상황.',
      lines: [
        { s: 'You', en: "Hi, I have a reservation under Kim.", ko: '안녕하세요, 김으로 예약되어 있습니다.', tip: '"under + 성"이 예약 확인의 표준 표현.' },
        { s: 'Staff', en: 'Let me pull that up. Two nights, king bed, correct?', ko: '확인해보겠습니다. 2박, 킹베드 맞으신가요?', tip: '"pull that up"은 시스템에서 조회하다.' },
        { s: 'You', en: "That's right. Is early check-in possible?", ko: '맞습니다. 얼리 체크인 가능할까요?' },
        { s: 'Staff', en: "The room isn't quite ready, but we can hold your bags.", ko: '방이 아직 준비 전인데, 짐은 맡아드릴 수 있습니다.' },
        { s: 'You', en: "That works. I'll come back around two.", ko: '그럼 됐어요. 2시쯤 다시 올게요.', tip: '"That works"는 "그거면 됩니다"의 만능 수락.' },
        { s: 'You', en: "Sorry to bother you — the AC in 704 isn't working.", ko: '번거롭게 해서 죄송한데, 704호 에어컨이 안 됩니다.', tip: '"Sorry to bother you"로 시작하면 클레임도 부드러워진다.' },
        { s: 'Staff', en: "I apologize for that. I'll send someone up right away.", ko: '죄송합니다. 바로 사람 올려보내겠습니다.' },
        { s: 'You', en: "If it can't be fixed, would it be possible to switch rooms?", ko: '수리가 안 되면 방 변경이 가능할까요?', tip: '"Would it be possible to~"는 정중한 요청의 뼈대 문장.' },
        { s: 'Staff', en: "Of course. I'll see what we have available.", ko: '물론입니다. 가능한 객실 확인해보겠습니다.' },
        { s: 'You', en: "I appreciate it. One more thing — what time is checkout?", ko: '감사합니다. 하나만 더요, 체크아웃 몇 시죠?', tip: '"One more thing"으로 추가 질문을 자연스럽게 붙인다.' },
        { s: 'Staff', en: 'Eleven, but we can do a late checkout until one.', ko: '11시입니다만, 1시까지 레이트 체크아웃 가능합니다.' },
        { s: 'You', en: "Perfect. Could you put me down for that?", ko: '좋네요. 그걸로 등록해주시겠어요?', tip: '"put me down for~"는 명단·예약에 올려달라는 뜻.' }
      ],
      expressions: [
        { en: 'I have a reservation under Kim.', ko: '김으로 예약했습니다.', note: '호텔·식당 모두 동일한 형식.' },
        { en: 'That works.', ko: '그거면 됩니다.', note: '수락의 가장 간결한 표현.' },
        { en: 'Sorry to bother you, but…', ko: '번거롭게 해서 죄송한데요…', note: '클레임의 첫 문장으로 최고. 상대의 방어심을 낮춘다.' },
        { en: 'Would it be possible to switch rooms?', ko: '방을 바꿀 수 있을까요?', note: '"Can I~"보다 훨씬 정중하다.' },
        { en: 'Could you put me down for a late checkout?', ko: '레이트 체크아웃으로 올려주시겠어요?', note: '예약 명단에 올려달라는 관용 표현.' },
        { en: 'Is breakfast included?', ko: '조식 포함인가요?', note: '체크인 시 반드시 확인할 문장.' }
      ]
    },
    {
      id: 'travel-restaurant',
      title: '식당 주문과 컴플레인',
      titleEn: 'Ordering & sending food back',
      situation: '현지 레스토랑. 주문하고, 음식이 잘못 나와 정중히 바로잡는다.',
      lines: [
        { s: 'Server', en: 'Have you had a chance to look at the menu?', ko: '메뉴 보셨나요?', tip: '"Are you ready to order?"의 부드러운 버전.' },
        { s: 'You', en: "Still deciding. Could you give us another minute?", ko: '아직 고르는 중이에요. 잠깐만 더 주시겠어요?', tip: '"Still deciding"만 말해도 충분히 통한다.' },
        { s: 'Server', en: 'Take your time. Can I start you off with something to drink?', ko: '천천히 보세요. 음료부터 준비해드릴까요?' },
        { s: 'You', en: "Just tap water for now, thanks.", ko: '일단 수돗물이면 됩니다, 감사합니다.', tip: '유럽·미국에선 tap water라고 해야 무료 물이 나온다.' },
        { s: 'You', en: "What would you recommend? It's our first time here.", ko: '추천해주실 만한 게 있나요? 여기 처음이라서요.', tip: '이 한 문장이 여행 식사의 질을 크게 바꾼다.' },
        { s: 'Server', en: 'The lamb is what we\'re known for. It comes with roasted vegetables.', ko: '양고기가 저희 대표 메뉴입니다. 구운 채소가 함께 나옵니다.' },
        { s: 'You', en: "I'll go with that. And could I get the sauce on the side?", ko: '그걸로 할게요. 소스는 따로 주실 수 있을까요?', tip: '"on the side"는 따로 담아달라는 뜻. 알레르기·취향 대응에 유용.' },
        { s: 'Server', en: 'Absolutely. Any allergies I should know about?', ko: '물론입니다. 알레르기 있으신가요?' },
        { s: 'You', en: "No allergies, but I can't do anything too spicy.", ko: '알레르기는 없는데, 너무 매운 건 못 먹어요.', tip: '"I can\'t do~"는 "못 먹는다"의 캐주얼 표현.' },
        { s: 'You', en: "Excuse me — I think there's been a mix-up. I ordered the lamb.", ko: '실례합니다, 주문이 바뀐 것 같아요. 저는 양고기를 시켰는데요.', tip: '"there\'s been a mix-up"은 상대를 탓하지 않는 클레임 화법.' },
        { s: 'Server', en: "I'm so sorry about that. Let me get that sorted right away.", ko: '정말 죄송합니다. 바로 처리하겠습니다.' },
        { s: 'You', en: "No problem at all. Could we get the check when you have a moment?", ko: '전혀 괜찮습니다. 여유되실 때 계산서 주시겠어요?', tip: '"when you have a moment"가 재촉을 부드럽게 만든다.' }
      ],
      expressions: [
        { en: 'Still deciding.', ko: '아직 고르는 중이에요.', note: '메뉴판 앞에서 압박받을 때 쓸 두 단어.' },
        { en: 'What would you recommend?', ko: '뭘 추천하시나요?', note: '현지 음식을 제대로 먹는 가장 빠른 길.' },
        { en: 'Could I get the sauce on the side?', ko: '소스는 따로 주시겠어요?', note: 'on the side = 따로 곁들여.' },
        { en: "I can't do anything too spicy.", ko: '너무 매운 건 못 먹어요.', note: '"I can\'t eat~"보다 부드럽다.' },
        { en: "I think there's been a mix-up.", ko: '주문이 바뀐 것 같아요.', note: '잘못을 지적하지 않으면서 바로잡는 최고의 문장.' },
        { en: 'Could we get the check?', ko: '계산서 주시겠어요?', note: '영국에서는 check 대신 bill을 쓴다.' },
        { en: 'Is service included?', ko: '봉사료 포함인가요?', note: '팁 문화권에서 반드시 확인할 것.' }
      ]
    },
    {
      id: 'travel-directions',
      title: '길 찾기와 교통',
      titleEn: 'Getting around',
      situation: '낯선 도시에서 길을 묻고 대중교통을 이용한다.',
      lines: [
        { s: 'You', en: "Excuse me, could you point me toward the train station?", ko: '실례합니다, 기차역이 어느 쪽인지 알려주시겠어요?', tip: '"point me toward~"는 정중하고 자연스러운 길 묻기.' },
        { s: 'Local', en: "Sure. Go straight for two blocks, then hang a left.", ko: '네. 두 블록 직진하시고 왼쪽으로 꺾으세요.', tip: '"hang a left"는 "turn left"의 캐주얼 버전.' },
        { s: 'You', en: "Two blocks, then left. Is it walkable from here?", ko: '두 블록, 그다음 좌회전. 여기서 걸어갈 만한가요?', tip: '들은 걸 되짚어 확인하는 습관이 실수를 막는다.' },
        { s: 'Local', en: "Definitely. Ten minutes, tops.", ko: '그럼요. 길어야 10분이에요.', tip: '"tops"는 문장 끝에서 "최대"라는 뜻.' },
        { s: 'You', en: "Great, thanks a lot. One more thing — does that line run this late?", ko: '좋네요, 감사합니다. 하나만 더요, 그 노선이 이 시간에도 다니나요?', tip: '"run"은 교통편이 운행하다.' },
        { s: 'Local', en: "It runs until about midnight on weekdays.", ko: '평일엔 자정까지 다녀요.' },
        { s: 'You', en: "Good to know. Do I need to change trains?", ko: '알아두면 좋겠네요. 갈아타야 하나요?', tip: '"change trains"가 환승. transfer도 쓴다.' },
        { s: 'Local', en: 'You\'ll transfer once at Central. Follow the signs for Line 3.', ko: '센트럴에서 한 번 갈아타요. 3호선 표지판 따라가세요.' },
        { s: 'You', en: "Perfect. I really appreciate the help.", ko: '완벽해요. 도와주셔서 정말 감사합니다.' },
        { s: 'Driver', en: 'Where to?', ko: '어디로 모실까요?', tip: '택시에서 가장 흔한 첫마디.' },
        { s: 'You', en: "Could you take me to this address? And no rush.", ko: '이 주소로 가주시겠어요? 천천히 가셔도 됩니다.' },
        { s: 'Driver', en: 'You got it. Traffic\'s light this time of day.', ko: '알겠습니다. 이 시간엔 차가 안 막혀요.' }
      ],
      expressions: [
        { en: 'Could you point me toward the station?', ko: '역이 어느 쪽인가요?', note: '"Where is~"보다 정중하고 원어민스럽다.' },
        { en: 'Is it walkable from here?', ko: '여기서 걸어갈 만한가요?', note: 'walkable 한 단어로 거리 감각을 물을 수 있다.' },
        { en: 'Ten minutes, tops.', ko: '길어야 10분.', note: 'tops = 최대치. 문장 끝에 붙인다.' },
        { en: 'Does that line run this late?', ko: '그 노선 이 시간에도 다녀요?', note: '지하철·버스 운행을 묻는 표현.' },
        { en: 'Do I need to change trains?', ko: '환승해야 하나요?', note: 'transfer와 함께 외워둘 것.' },
        { en: 'Where to?', ko: '어디로 가세요?', note: '택시 기사의 표준 첫마디. 듣기용으로 익혀둘 것.' }
      ]
    },
    {
      id: 'travel-trouble',
      title: '쇼핑, 환불, 그리고 사고 대응',
      titleEn: 'Shopping & when things go wrong',
      situation: '물건을 사고 교환하거나, 여권·지갑을 잃어버렸을 때.',
      lines: [
        { s: 'Clerk', en: 'Are you finding everything okay?', ko: '찾으시는 거 잘 보이시나요?', tip: '매장 직원의 표준 인사. 필요 없으면 "Just browsing."' },
        { s: 'You', en: "Just browsing, thanks. Actually — do you have this in a medium?", ko: '그냥 둘러보는 중이에요. 아, 이거 미디엄 사이즈 있나요?' },
        { s: 'Clerk', en: "Let me check the back for you.", ko: '창고 확인해보겠습니다.', tip: '"the back"은 매장 뒤 재고 창고.' },
        { s: 'You', en: "Could I try it on?", ko: '입어봐도 될까요?', tip: '"try on"은 옷·신발을 착용해보다.' },
        { s: 'You', en: "I'd like to return this. It's unworn, and I have the receipt.", ko: '이거 반품하고 싶어요. 착용 안 했고, 영수증도 있습니다.', tip: '반품의 세 요소: 물건 상태, 영수증, 이유.' },
        { s: 'Clerk', en: 'Was there something wrong with it?', ko: '제품에 문제가 있었나요?' },
        { s: 'You', en: "It just didn't fit right. Can I get a refund rather than store credit?", ko: '사이즈가 안 맞았어요. 적립금 말고 환불로 받을 수 있을까요?', tip: 'store credit(매장 적립금)과 refund(현금 환불)를 구분해서 말해야 한다.' },
        { s: 'Clerk', en: "Since it's within thirty days, that's no problem.", ko: '30일 이내라 문제없습니다.' },
        { s: 'You', en: "I need to report a lost passport. Where do I go?", ko: '여권 분실 신고를 해야 합니다. 어디로 가야 하나요?', tip: '"report a lost~"가 분실 신고의 표준 동사.' },
        { s: 'Officer', en: "You'll want to file a police report first, then contact your embassy.", ko: '먼저 경찰 신고서를 작성하시고, 대사관에 연락하세요.', tip: '"You\'ll want to~"는 "~하시는 게 좋습니다"의 부드러운 지시.' },
        { s: 'You', en: "Could you write that down for me? My phone died.", ko: '적어주실 수 있을까요? 휴대폰 배터리가 나갔어요.', tip: '"My phone died"는 배터리가 방전됐다는 뜻.' },
        { s: 'Officer', en: "Of course. Take a breath — this happens all the time.", ko: '물론이죠. 진정하세요, 흔한 일입니다.' }
      ],
      expressions: [
        { en: 'Just browsing, thanks.', ko: '그냥 둘러보는 중이에요.', note: '점원의 접근을 정중히 거절하는 표준 문장.' },
        { en: 'Do you have this in a medium?', ko: '이거 미디엄 있나요?', note: '"in a + 사이즈" 구조를 통째로 기억할 것.' },
        { en: "I'd like to return this.", ko: '반품하고 싶습니다.', note: '교환은 exchange, 환불은 refund.' },
        { en: 'It just didn\'t fit right.', ko: '잘 안 맞았어요.', note: '이유를 길게 말할 필요 없다.' },
        { en: 'I need to report a lost passport.', ko: '여권 분실 신고를 해야 합니다.', note: '위급 상황에서 가장 먼저 나와야 할 문장.' },
        { en: 'My phone died.', ko: '휴대폰이 꺼졌어요.', note: 'battery is dead와 같은 뜻의 구어체.' },
        { en: 'Could you write that down for me?', ko: '적어주시겠어요?', note: '알아듣기 어려울 때의 최후 수단이자 최선의 수단.' }
      ]
    }
  ]
};
