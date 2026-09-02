# 자동화 — 매일 아침 발송과 신조어 팩 갱신

앱은 브라우저 안에서만 돈다. 브라우저가 꺼져 있으면 아무것도 보낼 수 없다.
정해진 시각에 알아서 오게 하려면 바깥에서 깨워줄 스케줄러가 하나 필요하고, 그 역할을 n8n이 맡는다.

```
GitHub Pages                  n8n                        받는 곳
─────────────                 ───                        ──────
data/expressions.json  ──→  매일 08:00 트리거      ──→   Gmail (12개 전체)
   (푸시할 때 자동 생성)      → 날짜로 12개 회전     ──→   카카오톡 나에게 (3개 + 링크)
data/slang.json        ──→  앱이 하루 한 번 스스로 확인 → 버전이 올랐으면 교체
```

---

## 1. 앱을 GitHub Pages에 올리기

저장소 **Settings → Pages → Source**를 `GitHub Actions`로 바꾼다.
그 뒤 브랜치에 푸시하면 `.github/workflows/pages.yml`이 돌면서
`tools/export-json.js`로 데이터를 뽑고 사이트를 배포한다.

배포되면 이런 주소가 생긴다.

```
https://kumpro.github.io/hykai/                    앱
https://kumpro.github.io/hykai/data/expressions.json   표현 112개
https://kumpro.github.io/hykai/data/slang.json         신조어 팩
```

https라서 휴대폰에서도 마이크가 열리고, 홈 화면에 앱으로 설치된다.

---

## 2. 매일 아침 발송 (n8n)

`n8n-daily-english.json`을 n8n에서 **Import from File**로 불러온다.
노드 네 개가 이어져 있다.

| 노드 | 하는 일 |
| --- | --- |
| 매일 아침 8시 | Asia/Seoul 기준 08:00 트리거 |
| 표현 목록 가져오기 | Pages의 `expressions.json`을 읽는다 |
| 오늘의 12개 고르기 | 날짜를 씨앗으로 목록을 회전시켜 12개를 뽑고 메일·카톡용 본문을 만든다 |
| Gmail / 카카오톡 | 각각 발송 |

### 왜 "내 복습 카드"가 아니라 회전인가

앱의 라이트너 기록은 브라우저의 `localStorage`에만 있다. n8n에서는 읽을 수 없다.
그래서 여기서는 전체 112개를 날짜순으로 12개씩 돌린다 — 열흘이면 한 바퀴다.
받은 메일은 예습이고, 진짜 복습은 앱에서 한다. 이 구분을 지키는 편이 낫다.
개인 기록까지 서버로 보내면 앱이 서버 없이 굴러가는 장점이 사라진다.

### 설정할 것

**Gmail** — n8n의 Gmail 노드에 OAuth 자격증명을 연결한다. Gmail 노드의 **To** 칸을 받는 주소로 바꾼다 (기본값은 자리표시자다).

**카카오톡 나에게 보내기** — [Kakao Developers](https://developers.kakao.com)에서 앱을 만들고
카카오 로그인 활성화 후 `talk_message` 동의항목을 켠다. 그다음 사용자 액세스 토큰을 받아
n8n 환경변수 `KAKAO_ACCESS_TOKEN`에 넣는다. 워크플로우는 이 변수를 헤더에 그대로 쓴다.

> 액세스 토큰은 6시간이면 만료된다. 리프레시 토큰(약 2개월)을 저장해두고
> 발송 직전에 새 액세스 토큰을 받아오는 노드를 하나 앞에 붙이는 편이 안정적이다.
>
> ```
> POST https://kauth.kakao.com/oauth/token
> grant_type=refresh_token&client_id={REST_API_KEY}&refresh_token={REFRESH_TOKEN}
> ```
>
> 응답의 `access_token`을 다음 노드에서 쓰면 된다.

**카카오 텍스트 템플릿은 200자 제한이 있다.** 그래서 카톡으로는 3개만 짧게 가고,
버튼을 누르면 앱으로 넘어간다. 12개 전체는 메일로 온다.

이미 `daily-newsletter` 스킬에 카카오 발송 파이프라인이 있다면 그쪽 자격증명을 그대로 쓰면 된다.

---

## 3. 신조어 팩 자동 갱신

앱 쪽은 이미 준비돼 있다. **설정 → 신조어 팩 갱신**에서 주소를 넣고
"이 주소를 하루 한 번 자동으로 확인한다"에 체크한 뒤 불러오면 끝이다.

```
https://kumpro.github.io/hykai/data/slang.json
```

이후 앱은 하루에 한 번 조용히 주소를 확인하고, **`version` 숫자가 올라갔을 때만** 교체한다.
실패하면 아무 일도 일어나지 않는다 — 학습이 멈추면 안 되기 때문이다.

새 표현을 추가하려면 `js/data/slang.js`의 `items`에 넣고 `version`을 1 올린 뒤 푸시한다.
배포가 끝나면 다음 날 앱이 알아서 가져간다.

표현을 직접 쓰지 않고 채우고 싶다면, 월 1회 도는 n8n 워크플로우를 하나 더 만들어
새 표현 목록을 만들고 같은 JSON 형식으로 저장소에 커밋하게 하면 된다. 형식은 이것뿐이다.

```json
{
  "version": 2,
  "updated": "2026-10-01",
  "source": "월간 갱신",
  "items": [
    { "en": "circle back", "ko": "나중에 다시 논의하다", "note": "회의에서 결론을 미룰 때.", "register": "work" }
  ]
}
```

`register`는 `work`(업무) 또는 `casual`(또래). 앱이 이 값으로 장면을 나눈다.

---

## 4. 데이터만 다시 뽑기

내용을 고친 뒤 로컬에서 JSON만 갱신하려면:

```bash
node tools/export-json.js
# data/expressions.json, data/slang.json 갱신
```

푸시하면 Actions가 같은 일을 다시 한다.
