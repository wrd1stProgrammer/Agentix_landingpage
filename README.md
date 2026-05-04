# SignalRoom Smoke-Test Landing Page

SignalRoom 출시 전 수요 검증을 위한 Next.js App Router 랜딩 페이지입니다.

현재 페이지는 한국어 i18n 키를 사용하며, 여러 AI Agent가 크립토 신호를 감시하고 매일 회의한 뒤 스레드형 앱 피드로 브리핑을 전달하는 컨셉을 보여줍니다.

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Create `.env.local` from `.env.example`:

```bash
WAITLIST_WEBHOOK_URL=
```

`WAITLIST_WEBHOOK_URL`은 `POST /api/waitlist`가 제출 데이터를 전달할 서버 사이드 웹훅 주소입니다.

개발 환경에서 이 값이 비어 있으면 API는 development-only success를 반환하고 서버 콘솔에 경고를 남깁니다. 프로덕션에서는 실제 수집을 가장하지 않도록 실패 응답을 반환합니다.

## Waitlist Backend Setup

광고나 외부 트래픽을 보내기 전에 반드시 실제 수집 백엔드를 연결하세요.

1. Formspree, Tally, Make, Zapier 또는 커스텀 웹훅 중 하나를 선택합니다.
2. JSON 요청을 받을 수 있는 엔드포인트를 만듭니다.
3. `.env.local`에 `WAITLIST_WEBHOOK_URL`을 설정합니다.
4. 수집 대상이 `email`, `asset`, `utm_source`, `utm_medium`, `utm_campaign`, `referrer` 필드를 저장하는지 확인합니다.
5. 랜딩 페이지에서 테스트 이메일을 제출하고 대상 시스템에 기록되는지 확인합니다.
6. 배포 환경에도 같은 환경 변수를 설정합니다.

커스텀 웹훅 예시:

```json
{
  "email": "operator@example.com",
  "asset": "SOL",
  "utm_source": "linkedin",
  "utm_medium": "paid",
  "utm_campaign": "smoke_test",
  "referrer": "https://example.com/referring-page"
}
```

## Localization

한국어 문구 키는 [src/lib/i18n.ts](/Users/sikgates/Desktop/brainpet_landing/src/lib/i18n.ts)에 있습니다.

현재 렌더링 언어는 `ko`이며, 메타데이터, 내비게이션, 히어로, 앱 목업, 폼, 에이전트 목록, 샘플 브리핑, FAQ, 푸터 카피가 같은 키 파일을 사용합니다.

## Suggested Smoke-Test Metrics

소스와 캠페인별로 다음 지표를 보세요.

- Landing page views: `page_view`
- Primary CTA clicks: `hero_cta_click`
- Sample briefing interest: `sample_briefing_click`
- Form attempts: `waitlist_submit_attempt`
- Successful waitlist submissions: `waitlist_submit_success`
- Submit errors: `waitlist_submit_error`
- FAQ engagement: `faq_expand`
- Waitlist conversion rate: successful submissions divided by landing page views
- Submit completion rate: successful submissions divided by form attempts
- Error rate: submit errors divided by form attempts

트래픽을 구매하기 전에 통과 기준과 중단 기준을 먼저 정하세요. development-mode 제출은 실제 수요로 집계하지 마세요.
