/* 세계 언어 확장 — 표현집(multi.js)에 언어를 더 얹는다.
 *
 * 고른 기준
 *   full  — 사용자가 많고 여행·영화제에서 실제로 쓸 일이 있는 언어. 45문장 전부.
 *           힌디어, 포르투갈어, 이탈리아어(베네치아 영화제), 베트남어, 태국어,
 *           인도네시아어, 튀르키예어, 필리핀어
 *   basic — 사용자는 많지만 여행 빈도가 낮거나, 사용자는 적지만 따로 요청받은 언어.
 *           생존 표현 위주. 벵골어, 우르두어, 스와힐리어, 페르시아어,
 *           리투아니아어, 퀘추아어, 티베트어
 *
 * 퀘추아어와 티베트어는 확신이 서는 문장만 넣었다. 틀린 문장을 외우는 것보다
 * 적게 외우는 편이 낫다. 나머지는 AI 번역으로 채울 수 있다.
 *
 * 각 언어는 [원문, 로마자 표기, 한글 발음]. 로마자는 라틴 문자가 아닌 언어에만 넣었다.
 * 태국어·힌디어처럼 말하는 사람의 성별에 따라 형태가 바뀌는 언어는 남성 화자 기준이고,
 * 여성형은 메모에 적었다.
 *
 * 이 파일은 multi.js 다음에 로드되며, 맨 아래에서 MULTI에 합쳐진다.
 */
window.MULTI_WORLD = {
  /* 지도 색은 이웃 나라끼리 겹치지 않게 골랐다 (hsl: 색상, 채도, 밝기) */
  extra: {
    ja: { color: 'hsl(300,70%,75%)', about: '어순이 한국어와 같아 가장 빨리 입에 붙는다. 존댓말 체계도 닮았다.' },
    zh: { color: 'hsl(5,85%,60%)', about: '성조가 4개다. 한글 발음은 뼈대일 뿐, 🔊로 높낮이를 꼭 들어보자. 대만·홍콩은 번체자를 쓴다.' },
    fr: { color: 'hsl(265,85%,72%)', about: '적힌 글자를 다 읽지 않는다. 문장 끝 자음은 대개 소리 내지 않는다.' },
    de: { color: 'hsl(180,65%,48%)', about: '적힌 대로 읽는 편이라 발음이 의외로 정직하다. 명사는 늘 대문자로 시작한다.' },
    es: { color: 'hsl(40,90%,55%)', about: '적힌 대로 읽으면 거의 맞다. 표현집은 스페인 기준이고, 중남미는 단어가 조금씩 다르다.' },
    ru: { color: 'hsl(320,50%,58%)', about: '강세 없는 o는 "아"처럼 읽는다. 키릴 문자 33자만 익히면 간판이 읽히기 시작한다.' },
    ar: { color: 'hsl(195,85%,72%)', about: '이집트 구어(Masri)다. 이집트 영화와 드라마 덕분에 아랍권 어디서나 알아듣는 방언이다.' }
  },

  langs: [
    { id: 'hi', name: '힌디어', flag: '🇮🇳', tts: 'hi-IN', tier: 'full', color: 'hsl(48,95%,62%)',
      about: '말로는 우르두어와 거의 같고 글자만 다르다. 인도에서는 영어가 함께 통한다.' },
    { id: 'pt', name: '포르투갈어', flag: '🇧🇷', tts: 'pt-BR', tier: 'full', color: 'hsl(145,60%,50%)',
      about: '브라질 기준이다. 포르투갈은 발음이 훨씬 닫혀 있고 몇몇 단어가 다르다.' },
    { id: 'it', name: '이탈리아어', flag: '🇮🇹', tts: 'it-IT', tier: 'full', color: 'hsl(340,85%,66%)',
      about: '적힌 대로 읽는다. 겹자음(tt, ll)은 잠깐 멈췄다 길게. 베네치아 영화제의 말이다.' },
    { id: 'vi', name: '베트남어', flag: '🇻🇳', tts: 'vi-VN', tier: 'full', color: 'hsl(100,50%,45%)',
      about: '성조가 6개다. 한글 발음은 뼈대일 뿐, 🔊로 높낮이를 꼭 들어보자. 한자어가 많아 한국어와 닮은 단어가 꽤 있다.' },
    { id: 'th', name: '태국어', flag: '🇹🇭', tts: 'th-TH', tier: 'full', color: 'hsl(280,55%,62%)',
      about: '성조가 5개다. 남자는 문장 끝에 ครับ(크랍), 여자는 ค่ะ(카)를 붙이는 게 예의다.' },
    { id: 'id', name: '인도네시아어', flag: '🇮🇩', tts: 'id-ID', tier: 'full', color: 'hsl(15,80%,56%)',
      about: '성조도 시제 변화도 없어 가장 배우기 쉬운 언어로 꼽힌다. 말레이시아어와 대부분 통한다.' },
    { id: 'tr', name: '튀르키예어', flag: '🇹🇷', tts: 'tr-TR', tier: 'full', color: 'hsl(25,95%,58%)',
      about: '어순이 한국어와 같다(주어-목적어-동사). 조사처럼 뒤에 붙는 어미로 문법을 만든다.' },
    { id: 'fil', name: '필리핀어', flag: '🇵🇭', tts: 'fil-PH', tier: 'full', color: 'hsl(210,60%,75%)',
      about: '영어를 섞어 쓰는 게(Taglish) 자연스럽다. 윗사람에겐 문장에 po를 붙인다.' },

    { id: 'bn', name: '벵골어', flag: '🇧🇩', tts: 'bn-BD', tier: 'basic', color: 'hsl(330,70%,72%)',
      about: '방글라데시와 인도 콜카타의 말. 사티야지트 레이 영화의 언어다. 사용자 수로 세계 7위권.' },
    { id: 'ur', name: '우르두어', flag: '🇵🇰', tts: 'ur-PK', tier: 'basic', rtl: true, color: 'hsl(160,55%,62%)',
      about: '파키스탄의 말. 힌디어와 말은 거의 같지만 아랍 문자로 쓰고 오른쪽에서 왼쪽으로 읽는다.' },
    { id: 'sw', name: '스와힐리어', flag: '🇰🇪', tts: 'sw-KE', tier: 'basic', color: 'hsl(70,70%,45%)',
      about: '케냐·탄자니아 등 동아프리카의 공용어. 적힌 대로 읽으면 된다. Hakuna matata도 실제 쓰는 말이다.' },
    { id: 'fa', name: '페르시아어', flag: '🇮🇷', tts: 'fa-IR', tier: 'basic', rtl: true, color: 'hsl(30,40%,66%)',
      about: '이란의 말. 아랍 문자를 쓰지만 아랍어와는 전혀 다른 언어다. 키아로스타미·파르하디 영화의 언어.' },
    { id: 'lt', name: '리투아니아어', flag: '🇱🇹', tts: 'lt-LT', tier: 'basic', color: 'hsl(80,65%,55%)',
      about: '인도유럽어 가운데 가장 옛 모습을 간직한 말로 꼽힌다. 사용자는 약 300만 명.' },
    { id: 'qu', name: '퀘추아어', flag: '🇵🇪', tts: 'qu-PE', tier: 'basic', noTts: true, color: 'hsl(35,60%,45%)',
      about: '잉카 제국의 말. 페루·볼리비아·에콰도르 안데스에서 쓴다. 쿠스코 말 기준. 기기 음성이 거의 없어 글자대로 읽으면 된다(스페인어식 철자).' },
    { id: 'bo', name: '티베트어', flag: '🏔️', tts: 'bo-CN', tier: 'basic', noTts: true, color: 'hsl(25,85%,70%)',
      about: '티베트 고원과 인도 다람살라, 네팔·부탄 일부에서 쓴다. 라싸 말 기준. 기기 음성이 거의 없다.' }
  ],

  t: {
    /* ================================================================ 힌디어 */
    hi: {
      'Thank you very much.': ['बहुत-बहुत धन्यवाद।', 'Bahut-bahut dhanyavād', '바훗 바훗 단냐와드'],
      'Excuse me.': ['सुनिए।', 'Suniye', '수니에'],
      "I'm sorry.": ['माफ़ कीजिए।', 'Māf kījiye', '마프 키지에'],
      'How much is this?': ['यह कितने का है?', 'Yah kitne kā hai?', '예 끼뜨네 까 해'],
      'Where is the restroom?': ['टॉयलेट कहाँ है?', 'Ṭŏyleṭ kahā̃ hai?', '토일렛 까항 해'],
      "I don't understand.": ['मुझे समझ नहीं आया।', 'Mujhe samajh nahī̃ āyā', '무제 사마즈 나힌 아야'],
      'Could you speak more slowly?': ['क्या आप धीरे बोल सकते हैं?', 'Kyā āp dhīre bol sakte haĩ?', '꺄 압 디레 볼 삭떼 행'],
      'Do you speak English?': ['क्या आप अंग्रेज़ी बोलते हैं?', 'Kyā āp angrezī bolte haĩ?', '꺄 압 앙그레지 볼떼 행'],
      'Nice to meet you.': ['आपसे मिलकर ख़ुशी हुई।', 'Āpse milkar khushī huī', '압세 밀까르 쿠시 후이'],
      'Cheers!': ['चीयर्स!', 'Chīyars!', '치어스'],
      'Delicious!': ['बहुत स्वादिष्ट है!', 'Bahut svādishṭ hai!', '바훗 스와디쉬뜨 해'],
      'Help!': ['बचाओ!', 'Bachāo!', '바차오'],
      "How's it going?": ['कैसे हो?', 'Kaise ho?', '깨세 호'],
      'No rush.': ['कोई जल्दी नहीं।', 'Koī jaldī nahī̃', '꼬이 잘디 나힌'],
      'Have a good one!': ['आपका दिन अच्छा हो!', 'Āpkā din acchhā ho!', '압까 딘 앗차 호'],
      "It's been forever.": ['बहुत दिनों बाद!', 'Bahut dinõ bād!', '바훗 디농 바드'],
      'What have you been up to?': ['आजकल क्या चल रहा है?', 'Ājkal kyā chal rahā hai?', '아즈깔 꺄 찰 라하 해'],
      'Fingers crossed.': ['उम्मीद है सब अच्छा होगा।', 'Ummīd hai sab acchhā hogā', '움미드 해 삽 앗차 호가'],
      'Take it easy.': ['आराम से।', 'Ārām se', '아람 세'],
      'Are you free this weekend?': ['क्या तुम इस वीकेंड फ़्री हो?', 'Kyā tum is vīkend frī ho?', '꺄 뚬 이스 위켄드 프리 호'],
      'Something came up.': ['कुछ काम आ गया।', 'Kuchh kām ā gayā', '꾸츠 깜 아 가야'],
      'I owe you one.': ['मैं आपका एहसानमंद हूँ।', 'Maĩ āpkā ehsānmand hū̃', '맹 압까 에산만드 훙'],
      'Give me a sec.': ['एक मिनट।', 'Ek minaṭ', '에끄 미낫'],
      "I'm here on business.": ['मैं काम के सिलसिले में आया हूँ।', 'Maĩ kām ke silsile mẽ āyā hū̃', '맹 깜 께 실실레 멩 아야 훙'],
      'Nothing to declare.': ['मेरे पास घोषित करने के लिए कुछ नहीं है।', 'Mere pās ghoshit karne ke lie kuchh nahī̃ hai', '메레 빠스 고시뜨 까르네 께 리에 꾸츠 나힌 해'],
      "My luggage didn't come out.": ['मेरा सामान नहीं आया।', 'Merā sāmān nahī̃ āyā', '메라 사만 나힌 아야'],
      'I have a reservation under Kim.': ['किम के नाम से बुकिंग है।', 'Kim ke nām se buking hai', '킴 께 남 세 부킹 해'],
      'Is breakfast included?': ['क्या नाश्ता शामिल है?', 'Kyā nāshtā shāmil hai?', '꺄 나쉬따 샤밀 해'],
      'Sorry to bother you, but…': ['माफ़ कीजिए, परेशान करने के लिए…', 'Māf kījiye, pareshān karne ke lie…', '마프 키지에 빠레샨 까르네 께 리에'],
      'What would you recommend?': ['आप क्या सुझाएँगे?', 'Āp kyā sujhāẽge?', '압 꺄 수자엥게'],
      "I can't do anything too spicy.": ['मैं ज़्यादा तीखा नहीं खा सकता।', 'Maĩ zyādā tīkhā nahī̃ khā saktā', '맹 쟈다 띠카 나힌 카 삭따'],
      'Could we get the check?': ['बिल दे दीजिए।', 'Bil de dījiye', '빌 데 디지에'],
      'Could you point me toward the station?': ['स्टेशन किधर है?', 'Sṭeshan kidhar hai?', '스테샨 끼다르 해'],
      'Is it walkable from here?': ['क्या यहाँ से पैदल जा सकते हैं?', 'Kyā yahā̃ se paidal jā sakte haĩ?', '꺄 야항 세 빼달 자 삭떼 행'],
      'Do I need to change trains?': ['क्या मुझे ट्रेन बदलनी पड़ेगी?', 'Kyā mujhe ṭren badalnī paṛegī?', '꺄 무제 트렌 바달니 빠레기'],
      'Just browsing, thanks.': ['बस देख रहा हूँ, शुक्रिया।', 'Bas dekh rahā hū̃, shukriyā', '바스 데크 라하 훙 슈크리야'],
      'Do you have this in a medium?': ['क्या यह मीडियम में है?', 'Kyā yah mīḍiyam mẽ hai?', '꺄 예 미디얌 멩 해'],
      "I'd like to return this.": ['मैं इसे लौटाना चाहता हूँ।', 'Maĩ ise lauṭānā chāhtā hū̃', '맹 이세 라우따나 차흐따 훙'],
      'I need to report a lost passport.': ['मेरा पासपोर्ट खो गया है, रिपोर्ट करनी है।', 'Merā pāsporṭ kho gayā hai, riporṭ karnī hai', '메라 파스포르트 코 가야 해 리포르트 까르니 해'],
      'Could you write that down for me?': ['क्या आप इसे लिख देंगे?', 'Kyā āp ise likh dẽge?', '꺄 압 이세 리크 뎅게'],
      "I'm a director out of Seoul.": ['मैं सियोल का फ़िल्म निर्देशक हूँ।', 'Maĩ Siyol kā film nirdeshak hū̃', '맹 시욜 까 필름 니르데샤끄 훙'],
      "Let's take it from the top.": ['शुरू से एक बार फिर।', 'Shurū se ek bār phir', '슈루 세 에끄 바르 피르'],
      "That's a wrap.": ['आज के लिए पैकअप! सबको धन्यवाद।', 'Āj ke lie paikap! Sabko dhanyavād', '아즈 께 리에 패깝 삽꼬 단냐와드'],
      'Not that I know of.': ['जहाँ तक मुझे पता है, नहीं।', 'Jahā̃ tak mujhe patā hai, nahī̃', '자항 딱 무제 빠따 해 나힌'],
      "I'll be honest with you —": ['सच कहूँ तो…', 'Sach kahū̃ to…', '사츠 까훙 또']
    },

    /* ================================================================ 포르투갈어 (브라질) */
    pt: {
      'Thank you very much.': ['Muito obrigado.', '', '무이뚜 오브리가두'],
      'Excuse me.': ['Com licença.', '', '꽁 리쎙사'],
      "I'm sorry.": ['Desculpe.', '', '지스꾸우삐'],
      'How much is this?': ['Quanto custa?', '', '꽌뚜 꾸스따'],
      'Where is the restroom?': ['Onde fica o banheiro?', '', '온지 피까 우 반녜이루'],
      "I don't understand.": ['Não entendi.', '', '나웅 잉뗑지'],
      'Could you speak more slowly?': ['Pode falar mais devagar?', '', '뽀지 팔라르 마이스 지바가르'],
      'Do you speak English?': ['Você fala inglês?', '', '보세 팔라 잉글레스'],
      'Nice to meet you.': ['Prazer em conhecer.', '', '쁘라제르 잉 꼬녜세르'],
      'Cheers!': ['Saúde!', '', '사우지'],
      'Delicious!': ['Que delícia!', '', '끼 델리시아'],
      'Help!': ['Socorro!', '', '소꼬후'],
      "How's it going?": ['Tudo bem?', '', '뚜두 벵'],
      'No rush.': ['Sem pressa.', '', '셍 쁘레사'],
      'Have a good one!': ['Tenha um bom dia!', '', '떼냐 웅 봉 지아'],
      "It's been forever.": ['Quanto tempo!', '', '꽌뚜 뗑뿌'],
      'What have you been up to?': ['E aí, quais as novidades?', '', '이아이 꽈이스 아스 노비다지스'],
      'Fingers crossed.': ['Vamos torcer!', '', '바무스 또르세르'],
      'Take it easy.': ['Vai com calma.', '', '바이 꽁 까우마'],
      'Are you free this weekend?': ['Você está livre neste fim de semana?', '', '보세 이스따 리브리 네스치 핑 지 세마나'],
      'Something came up.': ['Surgiu um imprevisto.', '', '수르지우 웅 잉쁘레비스뚜'],
      'I owe you one.': ['Te devo uma.', '', '치 데부 우마'],
      'Give me a sec.': ['Só um segundo.', '', '소 웅 세궁두'],
      "I'm here on business.": ['Estou aqui a trabalho.', '', '이스또우 아끼 아 뜨라발류'],
      'Nothing to declare.': ['Nada a declarar.', '', '나다 아 지끌라라르'],
      "My luggage didn't come out.": ['Minha bagagem não chegou.', '', '미냐 바가젱 나웅 셰고우'],
      'I have a reservation under Kim.': ['Tenho uma reserva em nome de Kim.', '', '떼뉴 우마 헤제르바 잉 노미 지 킴'],
      'Is breakfast included?': ['O café da manhã está incluído?', '', '우 까페 다 마냥 이스따 잉끌루이두'],
      'Sorry to bother you, but…': ['Desculpe incomodar, mas…', '', '지스꾸우삐 잉꼬모다르 마스'],
      'What would you recommend?': ['O que você recomenda?', '', '우 끼 보세 헤꼬멩다'],
      "I can't do anything too spicy.": ['Não consigo comer nada muito apimentado.', '', '나웅 꽁시구 꼬메르 나다 무이뚜 아삐멩따두'],
      'Could we get the check?': ['A conta, por favor.', '', '아 꽁따 뽀르 파보르'],
      'Could you point me toward the station?': ['Onde fica a estação?', '', '온지 피까 아 이스따사웅'],
      'Is it walkable from here?': ['Dá para ir a pé daqui?', '', '다 빠라 이르 아 뻬 다끼'],
      'Do I need to change trains?': ['Preciso fazer baldeação?', '', '쁘레시주 파제르 바우지아사웅'],
      'Just browsing, thanks.': ['Só estou olhando, obrigado.', '', '소 이스또우 올랸두 오브리가두'],
      'Do you have this in a medium?': ['Tem esse em tamanho M?', '', '뗑 에시 잉 따마뉴 에미'],
      "I'd like to return this.": ['Gostaria de devolver isto.', '', '고스따리아 지 데보우베르 이스뚜'],
      'I need to report a lost passport.': ['Perdi meu passaporte e preciso registrar.', '', '뻬르지 메우 빠사뽀르치 이 쁘레시주 헤지스뜨라르'],
      'Could you write that down for me?': ['Pode escrever para mim?', '', '뽀지 이스끄레베르 빠라 밍'],
      "I'm a director out of Seoul.": ['Sou diretor, de Seul.', '', '소우 지레또르 지 세우'],
      "Let's take it from the top.": ['De novo, do começo.', '', '지 노부 두 꼬메수'],
      "That's a wrap.": ['Por hoje é só! Obrigado, pessoal.', '', '뽀르 오지 에 소 오브리가두 뻬소아우'],
      'Not that I know of.': ['Que eu saiba, não.', '', '끼 에우 사이바 나웅'],
      "I'll be honest with you —": ['Sendo sincero…', '', '셍두 싱세루']
    },

    /* ================================================================ 이탈리아어 */
    it: {
      'Thank you very much.': ['Grazie mille.', '', '그라치에 밀레'],
      'Excuse me.': ['Mi scusi.', '', '미 스꾸지'],
      "I'm sorry.": ['Mi dispiace.', '', '미 디스삐아체'],
      'How much is this?': ['Quanto costa?', '', '꽌또 꼬스따'],
      'Where is the restroom?': ["Dov'è il bagno?", '', '도베 일 바뇨'],
      "I don't understand.": ['Non capisco.', '', '논 까삐스꼬'],
      'Could you speak more slowly?': ['Può parlare più lentamente?', '', '뿌오 빠를라레 삐우 렌따멘떼'],
      'Do you speak English?': ['Parla inglese?', '', '빠를라 잉글레제'],
      'Nice to meet you.': ['Piacere.', '', '삐아체레'],
      'Cheers!': ['Cin cin!', '', '친 친'],
      'Delicious!': ['Buonissimo!', '', '부오니씨모'],
      'Help!': ['Aiuto!', '', '아이우또'],
      "How's it going?": ['Come va?', '', '꼬메 바'],
      'No rush.': ['Con calma.', '', '꼰 깔마'],
      'Have a good one!': ['Buona giornata!', '', '부오나 조르나따'],
      "It's been forever.": ['Da quanto tempo!', '', '다 꽌또 뗌뽀'],
      'What have you been up to?': ['Che hai fatto di bello?', '', '께 아이 파또 디 벨로'],
      'Fingers crossed.': ['Incrocio le dita.', '', '잉끄로초 레 디따'],
      'Take it easy.': ['Prenditela comoda.', '', '쁘렌디뗄라 꼬모다'],
      'Are you free this weekend?': ['Sei libero questo fine settimana?', '', '세이 리베로 꿰스또 피네 세띠마나'],
      'Something came up.': ['Ho avuto un imprevisto.', '', '오 아부또 운 임쁘레비스또'],
      'I owe you one.': ['Ti devo un favore.', '', '띠 데보 운 파보레'],
      'Give me a sec.': ['Un attimo.', '', '운 아띠모'],
      "I'm here on business.": ['Sono qui per lavoro.', '', '소노 꾸이 뻬르 라보로'],
      'Nothing to declare.': ['Niente da dichiarare.', '', '니엔떼 다 디끼아라레'],
      "My luggage didn't come out.": ['Il mio bagaglio non è arrivato.', '', '일 미오 바갈리오 논 에 아리바또'],
      'I have a reservation under Kim.': ['Ho una prenotazione a nome Kim.', '', '오 우나 쁘레노따치오네 아 노메 킴'],
      'Is breakfast included?': ['La colazione è inclusa?', '', '라 꼴라치오네 에 잉끌루자'],
      'Sorry to bother you, but…': ['Mi scusi il disturbo, ma…', '', '미 스꾸지 일 디스뚜르보 마'],
      'What would you recommend?': ['Cosa mi consiglia?', '', '꼬자 미 꼰실리아'],
      "I can't do anything too spicy.": ['Non posso mangiare cose troppo piccanti.', '', '논 뽀쏘 만자레 꼬제 뜨로뽀 삐깐띠'],
      'Could we get the check?': ['Il conto, per favore.', '', '일 꼰또 뻬르 파보레'],
      'Could you point me toward the station?': ['Mi sa indicare la stazione?', '', '미 사 인디까레 라 스따치오네'],
      'Is it walkable from here?': ['Ci si arriva a piedi da qui?', '', '치 시 아리바 아 삐에디 다 꾸이'],
      'Do I need to change trains?': ['Devo cambiare treno?', '', '데보 깜비아레 뜨레노'],
      'Just browsing, thanks.': ['Sto solo guardando, grazie.', '', '스또 솔로 과르단도 그라치에'],
      'Do you have this in a medium?': ["Ce l'ha in una taglia M?", '', '체 라 인 우나 딸리아 엠메'],
      "I'd like to return this.": ['Vorrei restituire questo.', '', '보레이 레스띠뚜이레 꿰스또'],
      'I need to report a lost passport.': ['Ho perso il passaporto, devo denunciarlo.', '', '오 뻬르소 일 빠싸뽀르또 데보 데눈치아를로'],
      'Could you write that down for me?': ['Me lo può scrivere?', '', '메 로 뿌오 스끄리베레'],
      "I'm a director out of Seoul.": ['Sono un regista di Seul.', '', '소노 운 레지스따 디 세울'],
      "Let's take it from the top.": ["Ripartiamo dall'inizio.", '', '리빠르띠아모 달리니치오'],
      "That's a wrap.": ['Per oggi abbiamo finito! Grazie a tutti.', '', '뻬르 오지 아비아모 피니또 그라치에 아 뚜띠'],
      'Not that I know of.': ['Che io sappia, no.', '', '께 이오 사삐아 노'],
      "I'll be honest with you —": ['Ad essere sincero…', '', '아드 에쎄레 신체로']
    },

    /* ================================================================ 베트남어 (하노이 기준) */
    vi: {
      'Thank you very much.': ['Cảm ơn rất nhiều.', '', '깜 언 젓 니에우'],
      'Excuse me.': ['Xin lỗi.', '', '신 로이'],
      "I'm sorry.": ['Tôi xin lỗi.', '', '또이 신 로이'],
      'How much is this?': ['Cái này bao nhiêu tiền?', '', '까이 나이 바오 니에우 띠엔'],
      'Where is the restroom?': ['Nhà vệ sinh ở đâu?', '', '냐 베 신 어 더우'],
      "I don't understand.": ['Tôi không hiểu.', '', '또이 콩 히에우'],
      'Could you speak more slowly?': ['Bạn nói chậm lại được không?', '', '반 노이 쩜 라이 드억 콩'],
      'Do you speak English?': ['Bạn có nói tiếng Anh không?', '', '반 꼬 노이 띠엥 아잉 콩'],
      'Nice to meet you.': ['Rất vui được gặp bạn.', '', '젓 부이 드억 갑 반'],
      'Cheers!': ['Một, hai, ba, dô!', '', '못 하이 바 조'],
      'Delicious!': ['Ngon quá!', '', '응언 꽈'],
      'Help!': ['Cứu tôi với!', '', '끄우 또이 버이'],
      "How's it going?": ['Dạo này thế nào?', '', '자오 나이 테 나오'],
      'No rush.': ['Cứ từ từ.', '', '끄 뜨 뜨'],
      'Have a good one!': ['Chúc một ngày tốt lành!', '', '쭉 못 응아이 똣 라잉'],
      "It's been forever.": ['Lâu quá không gặp!', '', '러우 꽈 콩 갑'],
      'What have you been up to?': ['Dạo này bạn làm gì?', '', '자오 나이 반 람 지'],
      'Fingers crossed.': ['Chúc may mắn nhé!', '', '쭉 마이 만 녜'],
      'Take it easy.': ['Đừng làm quá sức nhé.', '', '등 람 꽈 쓱 녜'],
      'Are you free this weekend?': ['Cuối tuần này bạn rảnh không?', '', '꾸오이 뚜언 나이 반 자잉 콩'],
      'Something came up.': ['Tôi có việc đột xuất.', '', '또이 꼬 비엑 돗 쑤엇'],
      'I owe you one.': ['Tôi nợ bạn một lần.', '', '또이 너 반 못 런'],
      'Give me a sec.': ['Đợi một chút.', '', '더이 못 쭛'],
      "I'm here on business.": ['Tôi đến đây để công tác.', '', '또이 덴 더이 데 꽁 딱'],
      'Nothing to declare.': ['Không có gì cần khai báo.', '', '콩 꼬 지 껀 카이 바오'],
      "My luggage didn't come out.": ['Hành lý của tôi chưa ra.', '', '하잉 리 꾸어 또이 쯔어 자'],
      'I have a reservation under Kim.': ['Tôi đã đặt phòng tên Kim.', '', '또이 다 닷 퐁 뗀 킴'],
      'Is breakfast included?': ['Có bao gồm bữa sáng không?', '', '꼬 바오 곰 브어 상 콩'],
      'Sorry to bother you, but…': ['Xin lỗi đã làm phiền, nhưng…', '', '신 로이 다 람 피엔 니응'],
      'What would you recommend?': ['Bạn gợi ý món nào?', '', '반 거이 이 먼 나오'],
      "I can't do anything too spicy.": ['Tôi không ăn được cay lắm.', '', '또이 콩 안 드억 까이 람'],
      'Could we get the check?': ['Tính tiền giúp tôi.', '', '띵 띠엔 줍 또이'],
      'Could you point me toward the station?': ['Ga tàu ở đâu ạ?', '', '가 따우 어 더우 아'],
      'Is it walkable from here?': ['Từ đây đi bộ được không?', '', '뜨 더이 디 보 드억 콩'],
      'Do I need to change trains?': ['Tôi có phải đổi tàu không?', '', '또이 꼬 파이 도이 따우 콩'],
      'Just browsing, thanks.': ['Tôi chỉ xem thôi, cảm ơn.', '', '또이 찌 쌤 토이 깜 언'],
      'Do you have this in a medium?': ['Cái này có cỡ M không?', '', '까이 나이 꼬 꺼 엠 콩'],
      "I'd like to return this.": ['Tôi muốn trả lại cái này.', '', '또이 무온 짜 라이 까이 나이'],
      'I need to report a lost passport.': ['Tôi bị mất hộ chiếu, tôi cần trình báo.', '', '또이 비 멋 호 찌에우 또이 껀 찡 바오'],
      'Could you write that down for me?': ['Bạn viết ra giúp tôi được không?', '', '반 비엣 자 줍 또이 드억 콩'],
      "I'm a director out of Seoul.": ['Tôi là đạo diễn đến từ Seoul.', '', '또이 라 다오 지엔 덴 뜨 서울'],
      "Let's take it from the top.": ['Làm lại từ đầu nhé.', '', '람 라이 뜨 더우 녜'],
      "That's a wrap.": ['Hôm nay xong rồi! Cảm ơn mọi người.', '', '홈 나이 쏭 조이 깜 언 모이 응어이'],
      'Not that I know of.': ['Theo tôi biết thì không.', '', '테오 또이 비엣 티 콩'],
      "I'll be honest with you —": ['Nói thật là…', '', '노이 텃 라']
    },

    /* ================================================================ 태국어 (남성 화자) */
    th: {
      'Thank you very much.': ['ขอบคุณมากครับ', 'Khop khun mak khrap', '컵쿤 막 크랍'],
      'Excuse me.': ['ขอโทษครับ', 'Kho thot khrap', '커톳 크랍'],
      "I'm sorry.": ['ขอโทษจริงๆ ครับ', 'Kho thot ching ching khrap', '커톳 찡찡 크랍'],
      'How much is this?': ['อันนี้ราคาเท่าไหร่ครับ', 'An ni ra-kha thao rai khrap', '안니 라카 타오라이 크랍'],
      'Where is the restroom?': ['ห้องน้ำอยู่ที่ไหนครับ', 'Hong nam yu thi nai khrap', '홍남 유 티나이 크랍'],
      "I don't understand.": ['ไม่เข้าใจครับ', 'Mai khao jai khrap', '마이 카오짜이 크랍'],
      'Could you speak more slowly?': ['พูดช้าๆ หน่อยได้ไหมครับ', 'Phut cha cha noi dai mai khrap', '풋 차차 너이 다이마이 크랍'],
      'Do you speak English?': ['พูดภาษาอังกฤษได้ไหมครับ', 'Phut pha-sa ang-krit dai mai khrap', '풋 파사 앙끄릿 다이마이 크랍'],
      'Nice to meet you.': ['ยินดีที่ได้รู้จักครับ', 'Yin di thi dai ru-chak khrap', '인디 티 다이 루짝 크랍'],
      'Cheers!': ['ชนแก้ว!', 'Chon kaeo!', '촌 깨우'],
      'Delicious!': ['อร่อยมาก!', 'A-roi mak!', '아로이 막'],
      'Help!': ['ช่วยด้วย!', 'Chuai duai!', '추어이 두어이'],
      "How's it going?": ['สบายดีไหมครับ', 'Sa-bai di mai khrap', '사바이 디 마이 크랍'],
      'No rush.': ['ไม่ต้องรีบครับ', 'Mai tong rip khrap', '마이 똥 립 크랍'],
      'Have a good one!': ['ขอให้มีวันที่ดีครับ', 'Kho hai mi wan thi di khrap', '커 하이 미 완 티 디 크랍'],
      "It's been forever.": ['ไม่ได้เจอกันนานเลย!', 'Mai dai choe kan nan loei!', '마이 다이 쩌 깐 난 러이'],
      'What have you been up to?': ['ช่วงนี้ทำอะไรอยู่ครับ', 'Chuang ni tham a-rai yu khrap', '추엉 니 탐 아라이 유 크랍'],
      'Fingers crossed.': ['ขอให้โชคดีนะครับ', 'Kho hai chok di na khrap', '커 하이 촉 디 나 크랍'],
      'Take it easy.': ['ไม่ต้องหักโหมนะครับ', 'Mai tong hak hom na khrap', '마이 똥 학홈 나 크랍'],
      'Are you free this weekend?': ['เสาร์อาทิตย์นี้ว่างไหม', 'Sao a-thit ni wang mai', '사오 아팃 니 왕 마이'],
      'Something came up.': ['พอดีมีธุระด่วนครับ', 'Pho di mi thu-ra duan khrap', '퍼디 미 투라 두언 크랍'],
      'I owe you one.': ['ติดหนี้บุญคุณนะ', 'Tit ni bun-khun na', '띳니 분쿤 나'],
      'Give me a sec.': ['รอแป๊บนึงครับ', 'Ro paep nueng khrap', '러 뺍 능 크랍'],
      "I'm here on business.": ['มาทำธุรกิจครับ', 'Ma tham thu-ra-kit khrap', '마 탐 투라낏 크랍'],
      'Nothing to declare.': ['ไม่มีของต้องสำแดงครับ', 'Mai mi khong tong sam-daeng khrap', '마이 미 컹 똥 쌈댕 크랍'],
      "My luggage didn't come out.": ['กระเป๋าของผมยังไม่ออกมาครับ', 'Kra-pao khong phom yang mai ok ma khrap', '끄라빠오 컹 폼 양 마이 억 마 크랍'],
      'I have a reservation under Kim.': ['จองไว้ในชื่อคิมครับ', 'Chong wai nai chue Kim khrap', '쩡 와이 나이 츠 킴 크랍'],
      'Is breakfast included?': ['รวมอาหารเช้าไหมครับ', 'Ruam a-han chao mai khrap', '루엄 아한 차오 마이 크랍'],
      'Sorry to bother you, but…': ['ขอโทษที่รบกวนครับ แต่…', 'Kho thot thi rop-kuan khrap, tae…', '커톳 티 롭꾸언 크랍 때'],
      'What would you recommend?': ['แนะนำอะไรดีครับ', 'Nae-nam a-rai di khrap', '내남 아라이 디 크랍'],
      "I can't do anything too spicy.": ['ทานเผ็ดมากไม่ได้ครับ', 'Than phet mak mai dai khrap', '탄 펫 막 마이 다이 크랍'],
      'Could we get the check?': ['เช็คบิลด้วยครับ', 'Chek bin duai khrap', '첵빈 두어이 크랍'],
      'Could you point me toward the station?': ['สถานีไปทางไหนครับ', 'Sa-tha-ni pai thang nai khrap', '싸타니 빠이 탕 나이 크랍'],
      'Is it walkable from here?': ['จากตรงนี้เดินไปได้ไหมครับ', 'Chak trong ni doen pai dai mai khrap', '짝 뜨롱니 던 빠이 다이마이 크랍'],
      'Do I need to change trains?': ['ต้องเปลี่ยนรถไฟไหมครับ', 'Tong plian rot fai mai khrap', '똥 쁠리안 롯파이 마이 크랍'],
      'Just browsing, thanks.': ['ดูเฉยๆ ครับ ขอบคุณครับ', 'Du choei choei khrap, khop khun khrap', '두 처이처이 크랍 컵쿤 크랍'],
      'Do you have this in a medium?': ['อันนี้มีไซซ์ M ไหมครับ', 'An ni mi sai M mai khrap', '안니 미 사이 엠 마이 크랍'],
      "I'd like to return this.": ['อยากคืนสินค้าชิ้นนี้ครับ', 'Yak khuen sin-kha chin ni khrap', '약 큰 신카 친니 크랍'],
      'I need to report a lost passport.': ['พาสปอร์ตหาย ต้องแจ้งความครับ', 'Phat-sa-pot hai, tong chaeng khwam khrap', '팟사뻣 하이 똥 쨍쾀 크랍'],
      'Could you write that down for me?': ['ช่วยเขียนให้หน่อยได้ไหมครับ', 'Chuai khian hai noi dai mai khrap', '추어이 키안 하이 너이 다이마이 크랍'],
      "I'm a director out of Seoul.": ['ผมเป็นผู้กำกับจากโซลครับ', 'Phom pen phu-kam-kap chak Son khrap', '폼 뻰 푸깜깝 짝 쏜 크랍'],
      "Let's take it from the top.": ['เริ่มใหม่ตั้งแต่ต้นครับ', 'Roem mai tang tae ton khrap', '름 마이 땅때 똔 크랍'],
      "That's a wrap.": ['วันนี้เลิกกองแล้ว! ขอบคุณทุกคนครับ', 'Wan ni loek kong laeo! Khop khun thuk khon khrap', '완니 럭껑 래우 컵쿤 툭콘 크랍'],
      'Not that I know of.': ['เท่าที่รู้ ไม่มีครับ', 'Thao thi ru, mai mi khrap', '타오티 루 마이 미 크랍'],
      "I'll be honest with you —": ['พูดตรงๆ นะครับ…', 'Phut trong trong na khrap…', '풋 뜨롱뜨롱 나 크랍']
    },

    /* ================================================================ 인도네시아어 */
    id: {
      'Thank you very much.': ['Terima kasih banyak.', '', '뜨리마 까시 바냑'],
      'Excuse me.': ['Permisi.', '', '뻐르미시'],
      "I'm sorry.": ['Maaf.', '', '마아프'],
      'How much is this?': ['Ini berapa?', '', '이니 브라빠'],
      'Where is the restroom?': ['Toiletnya di mana?', '', '또일렛냐 디 마나'],
      "I don't understand.": ['Saya tidak mengerti.', '', '사야 띠닥 멍어르띠'],
      'Could you speak more slowly?': ['Bisa bicara lebih pelan?', '', '비사 비짜라 르비 쁠란'],
      'Do you speak English?': ['Bisa bahasa Inggris?', '', '비사 바하사 잉그리스'],
      'Nice to meet you.': ['Senang bertemu dengan Anda.', '', '스낭 버르뜨무 등안 안다'],
      'Cheers!': ['Bersulang!', '', '버르술랑'],
      'Delicious!': ['Enak sekali!', '', '에낙 스깔리'],
      'Help!': ['Tolong!', '', '똘롱'],
      "How's it going?": ['Apa kabar?', '', '아빠 까바르'],
      'No rush.': ['Santai saja.', '', '산따이 사자'],
      'Have a good one!': ['Semoga harimu menyenangkan!', '', '스모가 하리무 므녀낭깐'],
      "It's been forever.": ['Lama tidak bertemu!', '', '라마 띠닥 버르뜨무'],
      'What have you been up to?': ['Lagi sibuk apa sekarang?', '', '라기 시북 아빠 스까랑'],
      'Fingers crossed.': ['Semoga berhasil!', '', '스모가 버르하실'],
      'Take it easy.': ['Jangan terlalu capek, ya.', '', '장안 떠를랄루 짜뻭 야'],
      'Are you free this weekend?': ['Akhir pekan ini kamu kosong?', '', '악히르 쁘깐 이니 까무 꼬송'],
      'Something came up.': ['Ada urusan mendadak.', '', '아다 우루산 믄다닥'],
      'I owe you one.': ['Aku berutang budi padamu.', '', '아꾸 버르우땅 부디 빠다무'],
      'Give me a sec.': ['Sebentar, ya.', '', '스븐따르 야'],
      "I'm here on business.": ['Saya ke sini untuk urusan bisnis.', '', '사야 끄 시니 운뚝 우루산 비스니스'],
      'Nothing to declare.': ['Tidak ada yang perlu dideklarasikan.', '', '띠닥 아다 양 쁘를루 디데끌라라시깐'],
      "My luggage didn't come out.": ['Bagasi saya tidak keluar.', '', '바가시 사야 띠닥 끌루아르'],
      'I have a reservation under Kim.': ['Saya sudah reservasi atas nama Kim.', '', '사야 수다 레세르바시 아따스 나마 킴'],
      'Is breakfast included?': ['Apakah sudah termasuk sarapan?', '', '아빠까 수다 뜨르마숙 사라빤'],
      'Sorry to bother you, but…': ['Maaf mengganggu, tapi…', '', '마아프 멍강구 따삐'],
      'What would you recommend?': ['Apa yang Anda rekomendasikan?', '', '아빠 양 안다 레꼬멘다시깐'],
      "I can't do anything too spicy.": ['Saya tidak bisa makan yang terlalu pedas.', '', '사야 띠닥 비사 마깐 양 떠를랄루 쁘다스'],
      'Could we get the check?': ['Minta bonnya.', '', '민따 본냐'],
      'Could you point me toward the station?': ['Stasiunnya di mana?', '', '스따시운냐 디 마나'],
      'Is it walkable from here?': ['Bisa jalan kaki dari sini?', '', '비사 잘란 까끼 다리 시니'],
      'Do I need to change trains?': ['Apakah saya perlu ganti kereta?', '', '아빠까 사야 쁘를루 간띠 끄레따'],
      'Just browsing, thanks.': ['Lihat-lihat saja, terima kasih.', '', '리핫리핫 사자 뜨리마 까시'],
      'Do you have this in a medium?': ['Ada ukuran M?', '', '아다 우꾸란 엠'],
      "I'd like to return this.": ['Saya mau mengembalikan ini.', '', '사야 마우 멍음발리깐 이니'],
      'I need to report a lost passport.': ['Paspor saya hilang, saya perlu melapor.', '', '빠스뽀르 사야 힐랑 사야 쁘를루 믈라뽀르'],
      'Could you write that down for me?': ['Bisa tolong ditulis?', '', '비사 똘롱 디뚤리스'],
      "I'm a director out of Seoul.": ['Saya sutradara dari Seoul.', '', '사야 수뜨라다라 다리 서울'],
      "Let's take it from the top.": ['Ulang dari awal, ya.', '', '울랑 다리 아왈 야'],
      "That's a wrap.": ['Syuting hari ini selesai! Terima kasih semuanya.', '', '슈띵 하리 이니 슬르사이 뜨리마 까시 스무아냐'],
      'Not that I know of.': ['Setahu saya, tidak.', '', '스따후 사야 띠닥'],
      "I'll be honest with you —": ['Terus terang saja…', '', '뜨루스 뜨랑 사자']
    },

    /* ================================================================ 튀르키예어 */
    tr: {
      'Thank you very much.': ['Çok teşekkür ederim.', '', '촉 테셱퀴르 에데림'],
      'Excuse me.': ['Pardon.', '', '파르돈'],
      "I'm sorry.": ['Özür dilerim.', '', '외쥐르 딜레림'],
      'How much is this?': ['Bu ne kadar?', '', '부 네 카다르'],
      'Where is the restroom?': ['Tuvalet nerede?', '', '투발레트 네레데'],
      "I don't understand.": ['Anlamadım.', '', '안라마듬'],
      'Could you speak more slowly?': ['Daha yavaş konuşabilir misiniz?', '', '다하 야바쉬 코누샤빌리르 미시니즈'],
      'Do you speak English?': ['İngilizce biliyor musunuz?', '', '잉길리즈제 빌리요르 무수누즈'],
      'Nice to meet you.': ['Memnun oldum.', '', '멤눈 올둠'],
      'Cheers!': ['Şerefe!', '', '셰레페'],
      'Delicious!': ['Çok lezzetli!', '', '촉 레제틀리'],
      'Help!': ['İmdat!', '', '임닷'],
      "How's it going?": ['Nasılsın?', '', '나슬슨'],
      'No rush.': ['Acele yok.', '', '아젤레 욕'],
      'Have a good one!': ['İyi günler!', '', '이이 균레르'],
      "It's been forever.": ['Ne zamandır görüşmedik!', '', '네 자만드르 괴뤼슈메딕'],
      'What have you been up to?': ['Neler yapıyorsun bu aralar?', '', '넬레르 야프요르순 부 아랄라르'],
      'Fingers crossed.': ['Şans dilerim!', '', '샨스 딜레림'],
      'Take it easy.': ['Kendini fazla yorma.', '', '켄디니 파즐라 요르마'],
      'Are you free this weekend?': ['Bu hafta sonu boş musun?', '', '부 하프타 소누 보쉬 무순'],
      'Something came up.': ['Bir işim çıktı.', '', '비르 이심 측트'],
      'I owe you one.': ['Sana borçluyum.', '', '사나 보르츨루윰'],
      'Give me a sec.': ['Bir saniye.', '', '비르 사니예'],
      "I'm here on business.": ['İş için buradayım.', '', '이쉬 이친 부라다이음'],
      'Nothing to declare.': ['Beyan edecek bir şeyim yok.', '', '베얀 에데젝 비르 셰임 욕'],
      "My luggage didn't come out.": ['Bavulum çıkmadı.', '', '바불룸 측마드'],
      'I have a reservation under Kim.': ['Kim adına rezervasyonum var.', '', '킴 아드나 레제르바숀눔 바르'],
      'Is breakfast included?': ['Kahvaltı dahil mi?', '', '카흐발트 다힐 미'],
      'Sorry to bother you, but…': ['Rahatsız ettiğim için kusura bakmayın ama…', '', '라핫스즈 에티임 이친 쿠수라 박마이은 아마'],
      'What would you recommend?': ['Ne tavsiye edersiniz?', '', '네 타브시예 에데르시니즈'],
      "I can't do anything too spicy.": ['Çok acı yiyemem.', '', '촉 아즈 이예멤'],
      'Could we get the check?': ['Hesap, lütfen.', '', '헤삽 륏펜'],
      'Could you point me toward the station?': ['İstasyon ne tarafta?', '', '이스타숀 네 타라프타'],
      'Is it walkable from here?': ['Buradan yürüyerek gidilir mi?', '', '부라단 유뤼예렉 기딜리르 미'],
      'Do I need to change trains?': ['Aktarma yapmam gerekiyor mu?', '', '악타르마 얍맘 게레키요르 무'],
      'Just browsing, thanks.': ['Sadece bakıyorum, teşekkürler.', '', '사데제 바크요룸 테셱퀴를레르'],
      'Do you have this in a medium?': ['Bunun M bedeni var mı?', '', '부눈 메 베데니 바르 므'],
      "I'd like to return this.": ['Bunu iade etmek istiyorum.', '', '부누 이아데 에트멕 이스티요룸'],
      'I need to report a lost passport.': ['Pasaportumu kaybettim, bildirmem gerekiyor.', '', '파사포르투무 카이베팀 빌디르멤 게레키요르'],
      'Could you write that down for me?': ['Bunu yazabilir misiniz?', '', '부누 야자빌리르 미시니즈'],
      "I'm a director out of Seoul.": ["Seul'den bir yönetmenim.", '', '세울덴 비르 외네트메님'],
      "Let's take it from the top.": ['Baştan alalım.', '', '바쉬탄 알랄름'],
      "That's a wrap.": ['Bugünlük bu kadar! Herkese teşekkürler.', '', '부균뤽 부 카다르 헤르케세 테셱퀴를레르'],
      'Not that I know of.': ['Bildiğim kadarıyla hayır.', '', '빌디임 카다르을라 하이으르'],
      "I'll be honest with you —": ['Açıkçası…', '', '아측차스']
    },

    /* ================================================================ 필리핀어 */
    fil: {
      'Thank you very much.': ['Maraming salamat po.', '', '마라밍 살라맛 뽀'],
      'Excuse me.': ['Paumanhin po.', '', '빠우만힌 뽀'],
      "I'm sorry.": ['Pasensya na po.', '', '빠센샤 나 뽀'],
      'How much is this?': ['Magkano po ito?', '', '막까노 뽀 이또'],
      'Where is the restroom?': ['Saan po ang CR?', '', '사안 뽀 앙 씨알'],
      "I don't understand.": ['Hindi ko po naiintindihan.', '', '힌디 꼬 뽀 나이인띤디한'],
      'Could you speak more slowly?': ['Pakibagalan lang po.', '', '빠끼바갈란 랑 뽀'],
      'Do you speak English?': ['Marunong po ba kayong mag-Ingles?', '', '마루농 뽀 바 까용 막잉글레스'],
      'Nice to meet you.': ['Ikinagagalak ko kayong makilala.', '', '이끼나가갈락 꼬 까용 마낄랄라'],
      'Cheers!': ['Tagay!', '', '따가이'],
      'Delicious!': ['Ang sarap!', '', '앙 사랍'],
      'Help!': ['Saklolo!', '', '사끌롤로'],
      "How's it going?": ['Kumusta?', '', '꾸무스따'],
      'No rush.': ['Dahan-dahan lang.', '', '다한 다한 랑'],
      'Have a good one!': ['Magandang araw!', '', '마간당 아라우'],
      "It's been forever.": ['Ang tagal nating hindi nagkita!', '', '앙 따갈 나띵 힌디 낙끼따'],
      'What have you been up to?': ["Ano'ng pinagkakaabalahan mo?", '', '아농 삐낙까까아발라한 모'],
      'Fingers crossed.': ['Sana swertehin!', '', '사나 스웨르떼힌'],
      'Take it easy.': ['Huwag kang magpapagod nang sobra.', '', '후왁 깡 막빠빠곳 낭 소브라'],
      'Are you free this weekend?': ['Libre ka ba ngayong weekend?', '', '리브레 까 바 응아용 위켄드'],
      'Something came up.': ['May biglaang lakad ako.', '', '마이 비글라앙 라깟 아꼬'],
      'I owe you one.': ["May utang na loob ako sa 'yo.", '', '마이 우땅 나 로옵 아꼬 사 요'],
      'Give me a sec.': ['Sandali lang.', '', '산달리 랑'],
      "I'm here on business.": ['Nandito ako para sa trabaho.', '', '난디또 아꼬 빠라 사 뜨라바호'],
      'Nothing to declare.': ['Wala po akong idedeklara.', '', '왈라 뽀 아꽁 이데데끌라라'],
      "My luggage didn't come out.": ['Hindi lumabas ang bagahe ko.', '', '힌디 루마바스 앙 바가헤 꼬'],
      'I have a reservation under Kim.': ['May reservation po ako sa pangalang Kim.', '', '마이 레저베이션 뽀 아꼬 사 빵알랑 킴'],
      'Is breakfast included?': ['Kasama po ba ang almusal?', '', '까사마 뽀 바 앙 알무살'],
      'Sorry to bother you, but…': ['Pasensya na po sa abala, pero…', '', '빠센샤 나 뽀 사 아발라 뻬로'],
      'What would you recommend?': ['Ano po ang mairerekomenda ninyo?', '', '아노 뽀 앙 마이레레꼬멘다 닌요'],
      "I can't do anything too spicy.": ['Hindi po ako makakain ng sobrang anghang.', '', '힌디 뽀 아꼬 마까까인 낭 소브랑 앙항'],
      'Could we get the check?': ['Bill po, please.', '', '빌 뽀 플리즈'],
      'Could you point me toward the station?': ['Saan po ang istasyon?', '', '사안 뽀 앙 이스따숀'],
      'Is it walkable from here?': ['Kaya bang lakarin mula rito?', '', '까야 방 라까린 물라 리또'],
      'Do I need to change trains?': ['Kailangan ko bang lumipat ng tren?', '', '까일랑안 꼬 방 루미빳 낭 뜨렌'],
      'Just browsing, thanks.': ['Tumitingin-tingin lang po, salamat.', '', '뚜미띵인띵인 랑 뽀 살라맛'],
      'Do you have this in a medium?': ['May medium po ba nito?', '', '마이 미디엄 뽀 바 니또'],
      "I'd like to return this.": ['Gusto ko po itong ibalik.', '', '구스또 꼬 뽀 이똥 이발릭'],
      'I need to report a lost passport.': ['Nawala po ang pasaporte ko, kailangan kong i-report.', '', '나왈라 뽀 앙 빠사뽀르떼 꼬 까일랑안 꽁 이리뽀르트'],
      'Could you write that down for me?': ['Puwede po bang isulat ninyo?', '', '뿌웨데 뽀 방 이술랏 닌요'],
      "I'm a director out of Seoul.": ['Direktor po ako mula sa Seoul.', '', '디렉또르 뽀 아꼬 물라 사 서울'],
      "Let's take it from the top.": ['Ulitin natin mula sa simula.', '', '울리띤 나띤 물라 사 시물라'],
      "That's a wrap.": ['Pack up na tayo! Salamat sa lahat.', '', '팩업 나 따요 살라맛 사 라핫'],
      'Not that I know of.': ['Sa pagkakaalam ko, hindi.', '', '사 빡까까알람 꼬 힌디'],
      "I'll be honest with you —": ['Sa totoo lang…', '', '사 또또오 랑']
    },

    /* ================================================================ 벵골어 (기본) */
    bn: {
      'Thank you very much.': ['অনেক ধন্যবাদ।', 'Onek dhonnobad', '오넥 돈노밧'],
      'Excuse me.': ['শুনুন।', 'Shunun', '슈눈'],
      "I'm sorry.": ['দুঃখিত।', 'Dukkhito', '둑키또'],
      'How much is this?': ['এটার দাম কত?', 'Etar dam koto?', '에따르 담 꼬또'],
      'Where is the restroom?': ['বাথরুম কোথায়?', 'Bathrum kothay?', '바트룸 꼬타이'],
      "I don't understand.": ['আমি বুঝতে পারছি না।', 'Ami bujhte parchhi na', '아미 부즈떼 빠르치 나'],
      'Could you speak more slowly?': ['একটু আস্তে বলবেন?', 'Ektu aste bolben?', '엑뚜 아스떼 볼벤'],
      'Do you speak English?': ['আপনি কি ইংরেজি বলেন?', 'Apni ki ingreji bolen?', '압니 끼 잉레지 볼렌'],
      'Nice to meet you.': ['আপনার সাথে দেখা হয়ে ভালো লাগলো।', 'Apnar sathe dekha hoye bhalo laglo', '압나르 사테 데카 호예 발로 라글로'],
      'Delicious!': ['খুব মজা!', 'Khub moja!', '쿱 모자'],
      'Help!': ['বাঁচাও!', 'Bachao!', '바차오'],
      "How's it going?": ['কেমন আছেন?', 'Kemon achhen?', '께몬 아첸']
    },

    /* ================================================================ 우르두어 (기본) */
    ur: {
      'Thank you very much.': ['بہت شکریہ', 'Bohat shukriya', '보핫 슈크리야'],
      'Excuse me.': ['سنیے', 'Suniye', '수니에'],
      "I'm sorry.": ['معاف کیجیے', 'Maaf kijiye', '마아프 키지에'],
      'How much is this?': ['یہ کتنے کا ہے؟', 'Yeh kitne ka hai?', '예 끼뜨네 까 해'],
      'Where is the restroom?': ['ٹوائلٹ کہاں ہے؟', 'Toilet kahan hai?', '토일렛 까항 해'],
      "I don't understand.": ['مجھے سمجھ نہیں آیا', 'Mujhe samajh nahin aaya', '무제 사마즈 나힌 아야'],
      'Could you speak more slowly?': ['کیا آپ آہستہ بول سکتے ہیں؟', 'Kya aap aahista bol sakte hain?', '꺄 압 아히스따 볼 삭떼 행'],
      'Do you speak English?': ['کیا آپ انگریزی بولتے ہیں؟', 'Kya aap angrezi bolte hain?', '꺄 압 앙그레지 볼떼 행'],
      'Nice to meet you.': ['آپ سے مل کر خوشی ہوئی', 'Aap se mil kar khushi hui', '압 세 밀 까르 쿠시 후이'],
      'Delicious!': ['بہت مزیدار!', 'Bohat mazedaar!', '보핫 마제다르'],
      'Help!': ['بچاؤ!', 'Bachao!', '바차오'],
      "How's it going?": ['کیا حال ہے؟', 'Kya haal hai?', '꺄 할 해']
    },

    /* ================================================================ 스와힐리어 (기본) */
    sw: {
      'Thank you very much.': ['Asante sana.', '', '아산떼 사나'],
      'Excuse me.': ['Samahani.', '', '사마하니'],
      "I'm sorry.": ['Samahani sana.', '', '사마하니 사나'],
      'How much is this?': ['Hii ni bei gani?', '', '히 니 베이 가니'],
      'Where is the restroom?': ['Choo kiko wapi?', '', '초 끼꼬 와삐'],
      "I don't understand.": ['Sielewi.', '', '시엘레위'],
      'Could you speak more slowly?': ['Tafadhali ongea polepole.', '', '따파달리 옹게아 뽈레뽈레'],
      'Do you speak English?': ['Unazungumza Kiingereza?', '', '우나중굼자 끼잉게레자'],
      'Nice to meet you.': ['Nimefurahi kukutana nawe.', '', '니메푸라히 꾸꾸따나 나웨'],
      'Cheers!': ['Afya!', '', '아퍄'],
      'Delicious!': ['Kitamu sana!', '', '끼따무 사나'],
      'Help!': ['Msaada!', '', '음사아다'],
      "How's it going?": ['Habari gani?', '', '하바리 가니'],
      'No rush.': ['Pole pole.', '', '뽈레 뽈레']
    },

    /* ================================================================ 페르시아어 (기본) */
    fa: {
      'Thank you very much.': ['خیلی ممنون', 'Kheyli mamnun', '케일리 맘눈'],
      'Excuse me.': ['ببخشید', 'Bebakhshid', '베바크쉬드'],
      "I'm sorry.": ['معذرت می‌خوام', "Ma'zerat mikham", '마제랏 미캄'],
      'How much is this?': ['این چنده؟', 'In chande?', '인 찬데'],
      'Where is the restroom?': ['دستشویی کجاست؟', 'Dastshuyi kojast?', '다스트슈이 코자스트'],
      "I don't understand.": ['متوجه نمی‌شم', 'Motevajeh nemisham', '모테바제 네미샴'],
      'Could you speak more slowly?': ['میشه آروم‌تر صحبت کنید؟', 'Mishe aromtar sohbat konid?', '미셰 아롬타르 소흐밧 코니드'],
      'Do you speak English?': ['انگلیسی بلدید؟', 'Engelisi baladid?', '엥겔리시 발라디드'],
      'Nice to meet you.': ['از آشنایی‌تون خوشبختم', 'Az ashnayitun khoshbakhtam', '아즈 아쉬나이툰 코쉬바크탐'],
      'Cheers!': ['به سلامتی!', 'Be salamati!', '베 살라마티'],
      'Delicious!': ['خیلی خوشمزه‌ست!', 'Kheyli khoshmazast!', '케일리 코쉬마자스트'],
      'Help!': ['کمک!', 'Komak!', '코막'],
      "How's it going?": ['چطوری؟', 'Chetori?', '체토리']
    },

    /* ================================================================ 리투아니아어 (기본) */
    lt: {
      'Thank you very much.': ['Labai ačiū.', '', '라바이 아츄'],
      'Excuse me.': ['Atsiprašau.', '', '앗시쁘라샤우'],
      "I'm sorry.": ['Labai atsiprašau.', '', '라바이 앗시쁘라샤우'],
      'How much is this?': ['Kiek tai kainuoja?', '', '끼엑 따이 까이누오야'],
      'Where is the restroom?': ['Kur yra tualetas?', '', '꾸르 이라 뚜알레따스'],
      "I don't understand.": ['Nesuprantu.', '', '네수쁘란뚜'],
      'Could you speak more slowly?': ['Gal galite kalbėti lėčiau?', '', '갈 갈리떼 깔베띠 레치아우'],
      'Do you speak English?': ['Ar kalbate angliškai?', '', '아르 깔바떼 앙글리슈까이'],
      'Nice to meet you.': ['Malonu susipažinti.', '', '말로누 수시빠쥔띠'],
      'Cheers!': ['Į sveikatą!', '', '이 스베이까따'],
      'Delicious!': ['Labai skanu!', '', '라바이 스까누'],
      'Help!': ['Padėkite!', '', '빠데끼떼'],
      "How's it going?": ['Kaip sekasi?', '', '까입 세까시']
    },

    /* ================================================================ 퀘추아어 (쿠스코, 기본) */
    qu: {
      'Thank you very much.': ['Añaychayki.', '', '아냐이차이키'],
      "I'm sorry.": ['Pampachaway.', '', '팜파차와이'],
      "I don't understand.": ["Mana hamut'anichu.", '', '마나 하뭇아니추'],
      'Delicious!': ["Ancha misk'i!", '', '안차 미스키'],
      'Help!': ['Yanapaway!', '', '야나파와이'],
      "How's it going?": ['Allillanchu?', '', '알리얀추']
    },

    /* ================================================================ 티베트어 (라싸, 기본) */
    bo: {
      'Thank you very much.': ['ཐུགས་རྗེ་ཆེ།', 'Thuk-je-che', '툭제체'],
      'Excuse me.': ['དགོངས་དག', 'Gong-da', '공다'],
      "I'm sorry.": ['དགོངས་དག', 'Gong-da', '공다'],
      'How much is this?': ['གོང་ག་ཚོད་རེད།', 'Gong ka-tsö re?', '공 가쵸 레'],
      "I don't understand.": ['ང་ལ་གོ་མ་སོང་།', 'Nga la go ma song', '응아 라 고 마 송'],
      'Nice to meet you.': ['ཁྱེད་རང་ཐུག་པ་དགའ་པོ་བྱུང་།', 'Khye-rang thuk-pa ga-po jung', '케랑 툭바 가보 중'],
      'Delicious!': ['ཞིམ་པོ་འདུག', 'Zhim-po duk', '심보 둑'],
      "How's it going?": ['ཁྱེད་རང་སྐུ་གཟུགས་བདེ་པོ་ཡིན་པས།', 'Khye-rang ku-zuk de-po yin-pe?', '케랑 꾸숙 데보 인베'],
      'Have a good one!': ['བཀྲ་ཤིས་བདེ་ལེགས།', 'Tashi delek', '따시 델렉']
    }
  },

  /* 문화 메모 — 문장을 아는 것보다 이게 더 오래 기억에 남는다 */
  note: {
    hi: {
      'Thank you very much.': '일상에선 शुक्रिया(슈크리야)가 더 흔하다. 가까운 사이에 고맙다고 하면 오히려 거리감을 준다고 느끼는 사람도 있다.',
      'Excuse me.': '"들어보세요" — 사람을 부를 때. 길을 비켜 달라거나 사과할 땐 माफ़ कीजिए(마프 키지에).',
      'Where is the restroom?': '격식체는 शौचालय(쇼찰라이). 구어로는 영어 toilet이 가장 잘 통한다.',
      'Cheers!': '힌디어 고유 건배사는 거의 안 쓴다. 영어 Cheers가 그대로 통한다.',
      'Fingers crossed.': '손가락 꼬는 관습은 없다. "다 잘될 거라 믿어"로 말한다.',
      'Take it easy.': '"천천히, 편하게". 인도에서 가장 자주 듣는 말 중 하나.',
      "I'm here on business.": '여성 화자는 आई हूँ(아이 훙).',
      "I can't do anything too spicy.": '여성 화자는 सकती(삭띠). 식당에선 कम मिर्च(깜 미르치, 고추 적게)가 확실하다.',
      'Just browsing, thanks.': '여성 화자는 रही हूँ(라히 훙).',
      "I'd like to return this.": '여성 화자는 चाहती(차흐띠).',
      "I'm a director out of Seoul.": '업계에선 영어 director를 그대로 쓰는 경우가 많다. 뭄바이는 볼리우드의 본거지.',
      "That's a wrap.": '볼리우드 현장에선 촬영 종료를 영어 그대로 "pack-up"이라고 부른다.'
    },
    pt: {
      'Thank you very much.': '말하는 사람이 여성이면 obrigada(오브리가다). 듣는 사람이 아니라 말하는 사람의 성별을 따른다.',
      'Excuse me.': '사람을 부를 땐 Por favor(뽀르 파보르)도 많이 쓴다.',
      'Where is the restroom?': '포르투갈에서는 casa de banho(까자 드 바뉴).',
      'Cheers!': '브라질 친구들은 Tim-tim!(칭칭)도 쓴다.',
      "How's it going?": '대답도 Tudo bem!이다. 브라질 인사의 기본.',
      'Fingers crossed.': '축구를 응원한다는 동사 torcer를 쓴다. "같이 응원하자".',
      'Is breakfast included?': '포르투갈에서는 pequeno-almoço(삐께누 알모수).',
      "I'm a director out of Seoul.": '여성이면 diretora. 칸·베를린 마켓에서 브라질 제작사를 자주 만난다.'
    },
    it: {
      'Excuse me.': '친한 사이엔 Scusa(스꾸자).',
      'Cheers!': '일본에서 "친친"은 비속어다. 일본인 동료 앞에서는 조심.',
      'Have a good one!': '저녁이면 Buona serata!(부오나 세라따).',
      'What have you been up to?': '직역하면 "뭐 좋은 거 했어?" 이탈리아식 근황 인사.',
      'Fingers crossed.': '이탈리아에선 In bocca al lupo!(인 보까 알 루뽀, "늑대 입속으로")로 행운을 빌고, Crepi!(끄레삐)로 답한다.',
      'Are you free this weekend?': '상대가 여성이면 libera(리베라).',
      'Could we get the check?': '이탈리아 식당엔 자릿세 coperto(꼬뻬르또)가 붙는 경우가 많다.',
      "I'm a director out of Seoul.": '베네치아 영화제(Mostra)에서 이탈리아어 인사 한마디는 분위기를 바꾼다.',
      "That's a wrap.": '영화 전체가 끝나면 Fine riprese!(피네 리쁘레제).'
    },
    vi: {
      'Excuse me.': '"실례합니다·죄송합니다" 둘 다. 식당에서 종업원을 부를 땐 Em ơi!(엠 어이).',
      'Cheers!': '"하나, 둘, 셋, 건배!" 베트남 술자리의 구호다. 잔을 비울 때까지 몇 번이고 외친다.',
      "I can't do anything too spicy.": '주문할 땐 Không cay(콩 까이, 안 맵게).',
      'I have a reservation under Kim.': '베트남에도 김(Kim) 성이 흔하다. 한자 金에서 왔다.'
    },
    th: {
      'Thank you very much.': '문장 끝 ครับ(크랍)은 남성 존댓말. 여성은 ค่ะ(카).',
      'No rush.': '태국인의 여유를 담은 말로 ใจเย็นๆ(짜이옌옌, "마음을 시원하게")도 있다.',
      'I owe you one.': '직역하면 "은혜의 빚을 졌다". 분쿤(บุญคุณ)은 태국 인간관계의 핵심 개념이다.',
      "My luggage didn't come out.": 'ผม(폼)은 남성의 "나". 여성은 ฉัน(찬)이나 ดิฉัน(디찬).',
      "I can't do anything too spicy.": '주문할 땐 ไม่เผ็ด(마이 펫, 안 맵게). "조금만 맵게"는 เผ็ดน้อย(펫 너이).',
      "That's a wrap.": 'เลิกกอง(럭껑)은 "촬영팀 해산" — 태국 현장의 촬영 종료 표현.'
    },
    id: {
      'Cheers!': '무슬림이 다수라 술자리 건배는 드물다. 음료로 하는 건배에 쓴다.',
      "How's it going?": '대답은 Baik(바익, 좋아요).',
      'No rush.': '인도네시아의 느긋한 시간 감각을 jam karet(잠 까렛, 고무줄 시간)이라고 부른다.',
      "I can't do anything too spicy.": '주문할 땐 Tidak pedas(띠닥 쁘다스, 안 맵게).'
    },
    tr: {
      'Excuse me.': '식당에서 종업원을 부를 땐 Bakar mısınız?(바카르 므스느즈).',
      'Delicious!': '음식을 만든 사람에게는 Elinize sağlık!(엘리니제 사을륵, "손이 건강하길").',
      'Fingers crossed.': '튀르키예에선 푸른 눈 모양의 부적 나자르 본주우(nazar boncuğu)가 악운을 막는다.'
    },
    fil: {
      'Thank you very much.': 'po는 존댓말 꼬리. 윗사람이나 처음 만난 사람에게 붙인다.',
      'Excuse me.': '영어 Excuse me po도 자연스럽다. 필리핀어는 영어를 섞어 쓰는 게(Taglish) 기본이다.',
      'Where is the restroom?': '필리핀에서는 화장실을 CR(comfort room)이라고 부른다.',
      'Do you speak English?': '필리핀은 영어가 공용어라 대부분 통한다.',
      'Nice to meet you.': '격식체다. 일상에선 영어 Nice to meet you를 그대로 많이 쓴다.',
      'Cheers!': 'Mabuhay!(마부하이, "만세")도 건배 때 쓴다.',
      'Help!': '급할 땐 Tulong!(뚤롱)도 통한다.',
      'I owe you one.': 'utang na loob("마음의 빚")은 필리핀 인간관계의 핵심 개념이다.',
      'Could we get the check?': '손가락으로 허공에 네모를 그리는 몸짓으로도 통한다.',
      "That's a wrap.": '필리핀 현장도 촬영 종료를 영어 pack up으로 부른다.'
    },
    bn: {
      'Excuse me.': '"들어보세요" — 사람을 부를 때.',
      'Delicious!': 'মজা(모자)는 "맛있다"와 "재밌다"를 함께 뜻한다.'
    },
    ur: {
      "How's it going?": '직역하면 "상태가 어때?" 파키스탄과 북인도의 기본 인사.'
    },
    sw: {
      "I'm sorry.": '상대가 힘든 일을 겪었을 땐 Pole(뽈레, "안됐네요")를 쓴다. 사과의 Samahani와 구분한다.',
      'Could you speak more slowly?': 'polepole(뽈레뽈레, 천천히)는 동아프리카 여행에서 가장 많이 듣는 말이다.',
      'Cheers!': '"건강을!"',
      "How's it going?": '대답은 Nzuri(은주리, 좋아요). 더 짧게는 Mambo?(맘보) — Poa!(뽀아)',
      'No rush.': '동아프리카의 시간 감각을 한 단어로 압축한 말이다.'
    },
    fa: {
      'How much is this?': '이란에는 타로프(ta\'arof)라는 겸양 예절이 있다. 상인이 "값은 됐어요"라고 해도 진짜가 아니니 두세 번 되물어 값을 치른다.',
      "How's it going?": '친한 사이의 말투. 정중하게는 حال شما چطوره؟(할레 쇼마 체토레).'
    },
    lt: {
      'Cheers!': '직역하면 "건강을 위해".'
    },
    qu: {
      'Thank you very much.': '쿠스코 말이다. 지역에 따라 Sulpayki(술파이키)라고도 한다.',
      "How's it going?": '안데스의 기본 인사. 대답은 Allillanmi(알리얀미, 잘 지내).'
    },
    bo: {
      'Excuse me.': '"실례합니다·죄송합니다"를 함께 쓴다.',
      'Have a good one!': '만날 때·헤어질 때·축하할 때 두루 쓰는 티베트의 대표 인사. "상서로움과 평안"이라는 뜻이다.'
    }
  }
};

/* ---- multi.js의 MULTI에 합친다 (앱과 내보내기 스크립트가 모두 합쳐진 모습을 본다) ---- */
(function () {
  var W = window.MULTI_WORLD, M = window.MULTI;
  if (!W || !M) return;

  Object.keys(W.extra).forEach(function (id) {
    var l = M.langs.find(function (x) { return x.id === id; });
    if (l) { Object.keys(W.extra[id]).forEach(function (k) { l[k] = W.extra[id][k]; }); l.tier = l.tier || 'full'; }
  });

  W.langs.forEach(function (l) {
    if (!M.langs.some(function (x) { return x.id === l.id; })) M.langs.push(l);
  });

  M.items.forEach(function (it) {
    W.langs.forEach(function (l) {
      var t = W.t[l.id] && W.t[l.id][it.en];
      if (t) it[l.id] = t;
      var n = W.note[l.id] && W.note[l.id][it.en];
      if (n) { it.note = it.note || {}; it.note[l.id] = n; }
    });
  });
})();
