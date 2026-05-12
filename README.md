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
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_CONTACT_EMAIL=
```

`SUPABASE_SERVICE_ROLE_KEY`는 서버의 `POST/PATCH /api/waitlist`에서만 사용됩니다. `NEXT_PUBLIC_` 접두사를 붙이지 마세요.

`NEXT_PUBLIC_META_PIXEL_ID`를 설정하면 Meta Pixel이 로드되고, 이메일 저장 성공 시 `Lead`, 설문 완료 시 `CompleteRegistration` 이벤트가 발생합니다.

## Waitlist Backend Setup

광고나 외부 트래픽을 보내기 전에 반드시 실제 수집 백엔드를 연결하세요.

1. Supabase SQL Editor에서 `supabase_setup.sql`을 실행합니다.
2. `.env.local`과 배포 환경에 Supabase URL, anon key, service role key를 설정합니다.
3. Meta Events Manager에서 데이터셋/픽셀을 만들고 `NEXT_PUBLIC_META_PIXEL_ID`를 설정합니다.
4. 랜딩 페이지에서 테스트 이메일을 제출합니다.
5. Supabase `waitlist` 테이블에 이메일, 동의 필드, UTM 필드가 저장되는지 확인합니다.
6. Meta Events Manager의 Test Events에서 `PageView`, `Lead`, `CompleteRegistration`을 확인합니다.

API 제출 예시:

```json
{
  "email": "operator@example.com",
  "privacyConsent": true,
  "marketingConsent": false,
  "placement": "hero",
  "utm_source": "meta",
  "utm_medium": "paid_social",
  "utm_campaign": "smoke_test",
  "utm_content": "problem_01",
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
- Meta Lead conversions: `Lead`
- Meta survey completions: `CompleteRegistration`
- Submit errors: `waitlist_submit_error`
- FAQ engagement: `faq_expand`
- Waitlist conversion rate: successful submissions divided by landing page views
- Submit completion rate: successful submissions divided by form attempts
- Error rate: submit errors divided by form attempts

트래픽을 구매하기 전에 통과 기준과 중단 기준을 먼저 정하세요. development-mode 제출은 실제 수요로 집계하지 마세요.
