import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms | Agentix",
  description: "Terms for using the Agentix waitlist landing page.",
};

type LegalPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function TermsPage({ params }: LegalPageProps) {
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
          {isKo ? "이용약관" : "Terms"}
        </h1>
        <p className="mt-4 text-sm font-semibold text-stone-400">
          {isKo ? "시행일: 2026년 5월 12일" : "Effective date: May 12, 2026"}
        </p>

        <div className="mt-12 space-y-10 text-sm leading-7 text-stone-600">
          {isKo ? (
            <>
              <section>
                <h2 className="text-lg font-black text-stone-900">서비스 상태</h2>
                <p className="mt-3">
                  Agentix는 출시 전 수요 검증 단계의 웨이트리스트 페이지입니다.
                  표시된 기능, 화면, 혜택, 출시 일정은 변경될 수 있습니다.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-black text-stone-900">투자 조언 아님</h2>
                <p className="mt-3">
                  Agentix의 콘텐츠는 리서치와 정보 정리를 위한 것이며, 투자 자문,
                  매수/매도 권유, 수익 보장으로 해석되어서는 안 됩니다. 모든 투자
                  결정과 책임은 사용자에게 있습니다.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-black text-stone-900">웨이트리스트</h2>
                <p className="mt-3">
                  이메일을 제출하면 베타 초대와 출시 관련 안내를 받을 수 있습니다.
                  웨이트리스트 등록이 서비스 이용 권리, 우선권, 보상 지급을
                  보장하지는 않습니다.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-black text-stone-900">금지 행위</h2>
                <p className="mt-3">
                  자동화된 대량 제출, 허위 정보 입력, 서비스 안정성을 해치는 행위,
                  타인의 이메일을 무단으로 제출하는 행위를 금지합니다.
                </p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-lg font-black text-stone-900">Service Status</h2>
                <p className="mt-3">
                  Agentix is a pre-launch waitlist landing page for demand validation.
                  Features, screens, benefits, and launch timing may change.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-black text-stone-900">Not Financial Advice</h2>
                <p className="mt-3">
                  Agentix content is for research and information organization only. It is
                  not investment advice, a buy or sell recommendation, or a promise of
                  returns. You are responsible for your own investment decisions.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-black text-stone-900">Waitlist</h2>
                <p className="mt-3">
                  By submitting your email, you may receive beta invitations and launch
                  updates. Joining the waitlist does not guarantee service access, priority,
                  or any reward.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-black text-stone-900">Prohibited Conduct</h2>
                <p className="mt-3">
                  Automated bulk submissions, false information, attempts to harm service
                  stability, or submitting another person&apos;s email without permission are not
                  allowed.
                </p>
              </section>
            </>
          )}
        </div>
      </article>
    </main>
  );
}
