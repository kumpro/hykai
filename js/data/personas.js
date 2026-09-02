/* 대화 상대 목소리 프로필.
 * 브라우저가 주는 음성에 피치·속도를 얹어 인물의 결을 만든다.
 * 목소리 종류는 기기마다 다르므로, 이름 패턴으로 고르고 안 되면 피치로 보정한다. */
window.PERSONAS = [
  {
    id: 'actor',
    name: '배우',
    en: 'The Actor',
    desc: '낮고 느리게. 대사를 눌러 말하는 톤. 배우 디렉팅과 리허설 연습에 맞다.',
    icon: '🎭',
    pitch: 0.82, rate: 0.82,
    prefer: /Daniel|Alex|Fred|Google UK English Male|Male/i
  },
  {
    id: 'anime',
    name: '애니메이션',
    en: 'Anime Dub',
    desc: '높고 빠르게. 감정이 크게 실린 더빙 톤. 리스닝 난도를 올리고 싶을 때.',
    icon: '🌸',
    pitch: 1.55, rate: 1.12,
    prefer: /Samantha|Karen|Victoria|Google US English|Female/i
  },
  {
    id: 'man',
    name: '일반 남성',
    en: 'Everyday Man',
    desc: '표준 속도의 성인 남성. 비즈니스 미팅과 일상 대화의 기본값.',
    icon: '👤',
    pitch: 0.95, rate: 0.95,
    prefer: /Daniel|Alex|Google UK English Male|Male/i
  },
  {
    id: 'woman',
    name: '일반 여성',
    en: 'Everyday Woman',
    desc: '표준 속도의 성인 여성. 서비스 응대와 안내 상황에 가깝다.',
    icon: '👤',
    pitch: 1.1, rate: 0.95,
    prefer: /Samantha|Karen|Moira|Google US English|Female/i
  },
  {
    id: 'kid',
    name: '유아',
    en: 'Young Child',
    desc: '아주 높고 느리게. 단순한 문장을 또박또박. 초반 자신감 붙일 때 쓸 만하다.',
    icon: '🧒',
    pitch: 1.8, rate: 0.8,
    prefer: /Samantha|Google US English|Female/i
  },
  {
    id: 'teen',
    name: '청소년',
    en: 'Teenager',
    desc: '조금 높고 빠르게. 말끝을 흘리는 또래 화법. 신조어 모드와 잘 맞는다.',
    icon: '🧑',
    pitch: 1.3, rate: 1.15,
    prefer: /Google US English|Samantha|Female/i
  },
  {
    id: 'exec',
    name: '임원·바이어',
    en: 'The Executive',
    desc: '차분하고 단정하게. 감정을 싣지 않는 협상 톤. 피칭과 세일즈 미팅용.',
    icon: '💼',
    pitch: 0.9, rate: 0.88,
    prefer: /Daniel|Google UK English Male|Alex|Male/i
  },
  {
    id: 'narrator',
    name: '내레이터',
    en: 'Narrator',
    desc: '느리고 또렷하게. 받아쓰기와 듣기 시험 연습에 가장 정확하다.',
    icon: '🎙️',
    pitch: 1.0, rate: 0.75,
    prefer: /Daniel|Alex|Samantha|Google/i
  }
];

window.PERSONA_BY_ID = window.PERSONAS.reduce(function (m, p) { m[p.id] = p; return m; }, {});
