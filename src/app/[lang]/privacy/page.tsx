import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Agentix",
  description: "How Agentix collects and uses waitlist information.",
};

type LegalPageProps = {
  params: Promise<{ lang: string }>;
};

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@agentix.app";

export default async function PrivacyPage({ params }: LegalPageProps) {
  const { lang } = await params;
  const isKo = lang === "ko";

  return (
    <main className="min-h-[100dvh] bg-white px-5 py-16 text-stone-900 sm:px-8">
      <article className="mx-auto max-w-3xl">
        <Link
          href={`/${lang}`}
          className="text-sm font-bold text-stone-400 transition-colors hover:text-stone-900"
        >
          {isKo ? "Agentix로 돌아가기" : "Back to Agentix"}
        </Link>

        <h1 className="mt-10 text-4xl font-black tracking-tight sm:text-5xl">
          {isKo ? "개인정보처리방침" : "Privacy Policy"}
        </h1>
        <p className="mt-4 text-sm font-semibold text-stone-400">
          {isKo ? "시행일: 2026년 5월 12일" : "Effective date: May 12, 2026"}
        </p>

        <div className="mt-12 space-y-10 text-sm leading-7 text-stone-600">
          {isKo ? (
            <>
              <section>
                <h2 className="text-lg font-black text-stone-900">수집하는 정보</h2>
                <p className="mt-3">
                  Agentix는 웨이트리스트 운영을 위해 이메일 주소, 선택 설문 응답,
                  신청 경로 정보(UTM 파라미터, referrer, landing path), 동의 여부,
                  브라우저 user agent를 수집할 수 있습니다.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-black text-stone-900">수집 및 이용 목적</h2>
                <p className="mt-3">
                  수집한 정보는 베타 초대, 출시 알림, 제품 수요 검증, 광고 성과
                  측정, 스팸 및 중복 제출 방지에 사용됩니다. 선택 마케팅 수신에
                  동의한 경우 제품 업데이트와 이벤트 안내 이메일을 보낼 수 있습니다.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-black text-stone-900">보유 기간</h2>
                <p className="mt-3">
                  이메일과 설문 응답은 수집일로부터 1년 또는 수신 거부/삭제 요청
                  시까지 보유합니다. 법령상 보관 의무가 있는 경우 해당 기간 동안
                  보관할 수 있습니다.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-black text-stone-900">광고 및 분석 도구</h2>
                <p className="mt-3">
                  Agentix는 Meta Pixel, Vercel Analytics 등 분석 도구를 사용해
                  페이지 방문, 웨이트리스트 신청, 설문 완료 같은 이벤트를 측정할
                  수 있습니다. Meta로 이메일 주소 자체를 전송하지 않습니다.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-black text-stone-900">처리 위탁 및 저장</h2>
                <p className="mt-3">
                  웨이트리스트 데이터는 Supabase 등 클라우드 인프라에 저장될 수
                  있습니다. 서비스 운영에 필요한 범위에서만 접근합니다.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-black text-stone-900">동의 거부 및 삭제 요청</h2>
                <p className="mt-3">
                  개인정보 수집 및 이용 동의를 거부할 수 있으나, 거부 시 베타
                  초대와 출시 알림을 받을 수 없습니다. 삭제 또는 수신 거부 요청은
                  {` ${contactEmail} `}으로 보낼 수 있습니다.
                </p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-lg font-black text-stone-900">Information We Collect</h2>
                <p className="mt-3">
                  Agentix may collect your email address, optional survey responses,
                  attribution data such as UTM parameters, referrer, landing path,
                  consent records, and browser user agent for waitlist operations.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-black text-stone-900">How We Use Information</h2>
                <p className="mt-3">
                  We use this information to send beta invitations and launch updates,
                  validate demand, measure advertising performance, and prevent spam or
                  duplicate submissions. If you opt in to marketing emails, we may send
                  product updates and event notices.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-black text-stone-900">Retention</h2>
                <p className="mt-3">
                  Waitlist data is retained for one year from collection or until you
                  request deletion or unsubscribe, unless a longer period is required by law.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-black text-stone-900">Advertising and Analytics</h2>
                <p className="mt-3">
                  Agentix may use Meta Pixel and Vercel Analytics to measure page views,
                  waitlist submissions, and survey completion events. We do not send your
                  email address itself to Meta.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-black text-stone-900">Storage and Vendors</h2>
                <p className="mt-3">
                  Waitlist data may be stored in cloud infrastructure such as Supabase.
                  Access is limited to what is necessary to operate the service.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-black text-stone-900">Your Choices</h2>
                <p className="mt-3">
                  You may decline collection, but we will not be able to send beta invites
                  or launch updates. You can request deletion or unsubscribe by contacting
                  {` ${contactEmail}`}.
                </p>
              </section>
            </>
          )}
        </div>
      </article>
    </main>
  );
}
