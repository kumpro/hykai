/* 테스트 모드 — 토익 듣기 형식(Part 2·3·4)을 본뜬 자체 문제.
 * 실제 시험 문항을 옮긴 것이 아니라 같은 유형으로 새로 쓴 것이다.
 * Part 2: 질문-응답 / Part 3: 짧은 대화 / Part 4: 짧은 담화 */
window.EXAM = {
  part2: [
    {
      id: 'p2-1',
      prompt: "When does the shooting schedule get finalized?",
      choices: ["By the end of next week.", "In the editing room.", "Yes, it was finalized."],
      answer: 0,
      note: 'When 의문문에는 시점으로 답한다. 3번처럼 Yes/No로 답하면 틀린다 — 의문사 의문문에 Yes/No는 오답 신호다.'
    },
    {
      id: 'p2-2',
      prompt: "Who's handling the international rights?",
      choices: ["Sometime in March.", "A sales agent in Paris.", "It's on the third floor."],
      answer: 1,
      note: 'Who 의문문에는 사람 또는 조직으로 답한다.'
    },
    {
      id: 'p2-3',
      prompt: "Why was the location scout postponed?",
      choices: ["The permit hasn't come through.", "At the studio.", "For about two hours."],
      answer: 0,
      note: 'Why에는 이유. Because가 없어도 이유 문장이면 정답이다.'
    },
    {
      id: 'p2-4',
      prompt: "Would you like me to book the screening room?",
      choices: ["It was a great screening.", "That would be a big help.", "No, he booked it."],
      answer: 1,
      note: '제안에는 수락 또는 거절로 답한다. 같은 단어(screening, book)를 반복하는 선택지가 함정이다.'
    },
    {
      id: 'p2-5',
      prompt: "How long have you been working on this script?",
      choices: ["About three years now.", "In the second draft.", "Yes, quite a while."],
      answer: 0,
      note: 'How long에는 기간. 3번은 그럴듯하지만 의문사 의문문이라 Yes로 시작할 수 없다.'
    },
    {
      id: 'p2-6',
      prompt: "The budget meeting is at two, isn't it?",
      choices: ["I think it got moved to three.", "Yes, I budgeted for it.", "In the conference room."],
      answer: 0,
      note: '부가의문문에는 사실 확인으로 답한다. 정정하는 답도 정답이 된다.'
    },
    {
      id: 'p2-7',
      prompt: "Should we hire a local crew or bring our own?",
      choices: ["They arrived yesterday.", "Whichever keeps us on budget.", "No, I don't think so."],
      answer: 1,
      note: '선택의문문에는 둘 중 하나, 또는 "어느 쪽이든"으로 답한다. Yes/No는 오답이다.'
    },
    {
      id: 'p2-8',
      prompt: "Where did you put the signed contract?",
      choices: ["Last Thursday.", "The lawyer has it.", "It costs quite a lot."],
      answer: 1,
      note: 'Where에 장소 대신 사람이 나와도, 그 사람이 있는 곳을 뜻하면 정답이다.'
    },
    {
      id: 'p2-9',
      prompt: "I couldn't reach anyone at the fund office.",
      choices: ["They're closed for the holiday.", "I reached for it.", "About twenty applicants."],
      answer: 0,
      note: '평서문에는 공감이나 정보로 답한다. reach의 다른 뜻을 쓴 2번이 전형적인 함정이다.'
    },
    {
      id: 'p2-10',
      prompt: "How did the test screening go?",
      choices: ["By train, actually.", "Better than we expected.", "It goes there twice a day."],
      answer: 1,
      note: 'How가 방법이 아니라 상태를 묻는 경우다. go를 교통수단으로 받은 1번이 함정.'
    }
  ],

  part3: [
    {
      id: 'p3-1',
      title: '호텔 예약 문제',
      script: [
        { s: 'W', en: "Hi, I'm checking in — the reservation should be under Park, two nights." },
        { s: 'M', en: "Let me pull that up… I'm seeing a booking for one night only, arriving today." },
        { s: 'W', en: "That can't be right. I booked two nights through the festival office back in January." },
        { s: 'M', en: "The festival block was reissued last month, so some dates got dropped. I can extend you a second night, but it'd be a different room type." },
        { s: 'W', en: "As long as I don't have to move rooms twice, that's fine." }
      ],
      questions: [
        {
          q: 'What is the problem?',
          choices: ['The reservation is one night short.', 'The hotel is fully booked.', 'The payment was declined.', 'She arrived on the wrong day.'],
          answer: 0,
          note: '문제 유형은 대개 두 번째 화자의 말에서 드러난다. "I\'m seeing a booking for one night only"가 근거다.'
        },
        {
          q: 'Why did the error occur?',
          choices: ['She canceled by mistake.', 'The festival block was reissued.', 'The hotel changed owners.', 'She used the wrong name.'],
          answer: 1,
          note: '원인은 직원의 설명에 있다. reissue = 재발행되다.'
        },
        {
          q: 'What does the woman agree to?',
          choices: ['Staying at another hotel.', 'Paying an extra fee.', 'Changing room types once.', 'Checking out early.'],
          answer: 2,
          note: '"As long as I don\'t have to move rooms twice"는 한 번은 괜찮다는 뜻이다. 조건부 수락을 놓치지 말 것.'
        }
      ]
    },
    {
      id: 'p3-2',
      title: '투자 미팅 후속',
      script: [
        { s: 'M', en: "Thanks for sending the treatment. My team read it over the weekend." },
        { s: 'W', en: "And? I'd rather hear it straight." },
        { s: 'M', en: "The writing's strong. The concern is the budget — one-point-eight is a lot for a first feature with no cast attached." },
        { s: 'W', en: "What if we brought it down to one-two by cutting the third location?" },
        { s: 'M', en: "That changes the conversation. Send me a revised budget and I'll take it back to them." }
      ],
      questions: [
        {
          q: "What is the man's main concern?",
          choices: ['The writing quality.', 'The budget relative to the risk.', 'The shooting schedule.', 'The distribution plan.'],
          answer: 1,
          note: '"The concern is~"가 정답 신호다. 앞의 칭찬은 함정용 대비 문장이다.'
        },
        {
          q: 'What does the woman propose?',
          choices: ['Casting a known actor.', 'Delaying the shoot.', 'Removing a location to lower the cost.', 'Finding a co-producer.'],
          answer: 2,
          note: 'What if ~? 는 제안 신호다.'
        },
        {
          q: 'What will the woman most likely do next?',
          choices: ['Sign a contract.', 'Submit a revised budget.', 'Meet the investors in person.', 'Start pre-production.'],
          answer: 1,
          note: '"most likely do next"는 대화 마지막 요청에 답이 있다.'
        }
      ]
    },
    {
      id: 'p3-3',
      title: '현장 일정 조정',
      script: [
        { s: 'W', en: "We're losing the light in about forty minutes. We still have three setups." },
        { s: 'M', en: "Three is not happening. Which one can we pick up tomorrow?" },
        { s: 'W', en: "The two-shot on the bench. The wide has the sunset in it, so that one has to be today." },
        { s: 'M', en: "Then let's shoot the wide now and the close-ups after dark with the lights." },
        { s: 'W', en: "I'll tell the AD to reorder the board." }
      ],
      questions: [
        {
          q: 'What is the main constraint?',
          choices: ['A shortage of crew.', 'Remaining daylight.', 'An actor arriving late.', 'Equipment failure.'],
          answer: 1,
          note: '"losing the light"은 야외 촬영의 시간 압박을 뜻하는 현장 관용구다.'
        },
        {
          q: 'Which shot must be filmed today?',
          choices: ['The two-shot on the bench.', 'The close-ups.', 'The wide shot.', 'All three setups.'],
          answer: 2,
          note: '이유가 함께 제시된다 — "has the sunset in it".'
        },
        {
          q: 'What will happen after dark?',
          choices: ['Filming will stop.', 'The close-ups will be shot with lights.', 'The crew will move locations.', 'The scene will be cut.'],
          answer: 1,
          note: '남자의 마지막 제안이 그대로 답이 된다.'
        }
      ]
    }
  ],

  part4: [
    {
      id: 'p4-1',
      title: '영화제 안내 방송',
      script: [
        { s: 'Announcer', en: "Good morning, and welcome to the industry section of the festival. A quick note before the first screening: the market badge does not grant access to the gala theater, so please pick up a separate ticket at the accreditation desk on level two. Screenings begin ten minutes after the posted time to allow for seating, but latecomers will not be admitted once the lights go down. Finally, the co-production forum has moved from room C to the pavilion by the marina — shuttles run every fifteen minutes from the main entrance." }
      ],
      questions: [
        {
          q: 'What must attendees do to enter the gala theater?',
          choices: ['Show a market badge.', 'Get a separate ticket on level two.', 'Arrive ten minutes early.', 'Register at the pavilion.'],
          answer: 1,
          note: '"does not grant access ~ so please"의 흐름에 요구사항이 들어 있다.'
        },
        {
          q: 'What has changed?',
          choices: ['The screening times.', 'The badge policy.', 'The location of the forum.', 'The shuttle schedule.'],
          answer: 2,
          note: 'Finally 뒤에 변경 사항이 오는 것이 담화문의 전형적 구성이다.'
        }
      ]
    },
    {
      id: 'p4-2',
      title: '음성 메시지',
      script: [
        { s: 'Caller', en: "Hi, this is Dana from the rights department, returning your call about the archive footage. Two things. First, the clip you asked about is cleared for festival use, but theatrical release would need a separate license, and that runs about four thousand per minute. Second, I couldn't open the file you sent — it came through as a broken link. If you resend it as an attachment today, I can get you a written quote before the weekend." }
      ],
      questions: [
        {
          q: 'What is the caller mainly discussing?',
          choices: ['A scheduling conflict.', 'Licensing terms for footage.', 'A payment that was declined.', 'A job opening.'],
          answer: 1,
          note: '전화 목적은 보통 첫 두 문장에서 밝혀진다.'
        },
        {
          q: 'What does the caller ask the listener to do?',
          choices: ['Call back next week.', 'Resend the file as an attachment.', 'Visit the office in person.', 'Approve a payment.'],
          answer: 1,
          note: '"If you resend~"의 조건절이 사실상 요청이다.'
        }
      ]
    }
  ]
};
