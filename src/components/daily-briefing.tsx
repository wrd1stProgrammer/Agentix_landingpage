import Image from "next/image";
import { getDictionary } from "@/lib/i18n";

export function DailyBriefing({ lang }: { lang: "en" | "ko" }) {
  const copy = getDictionary(lang);
  return (
    <div className="relative mx-auto mt-20 max-w-6xl">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        
        {/* Text Content */}
        <div className="reveal-in" style={{ animationDelay: "0.2s" }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            <span className="status-dot h-2 w-2 rounded-full bg-indigo-500" />
            {copy.app.councilTitle}
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-balance text-stone-900 sm:text-4xl md:text-5xl">
            {copy.steps.items[2].title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-balance text-stone-600">
            {copy.steps.items[2].body}
          </p>
          
          <ul className="mt-8 space-y-4">
            {copy.dailyBriefing.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3 text-stone-700">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Image Mockup */}
        <div className="reveal-in" style={{ animationDelay: "0.4s" }}>
          <div className="relative mx-auto w-full max-w-[280px] lg:max-w-[340px]">
            {/* Background decorative blob */}
            <div className="absolute -inset-4 -z-10 rounded-full bg-gradient-to-tr from-indigo-300 to-cyan-300 opacity-30 blur-2xl" />
            
            <div className="sns-card relative overflow-hidden rounded-[2.5rem] border-[8px] border-stone-800 bg-stone-900 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.4)]">
              {/* Phone Notch/Dynamic Island mock */}
              <div className="absolute left-1/2 top-0 z-10 h-[1.15rem] w-24 -translate-x-1/2 rounded-b-xl bg-stone-800 shadow-sm" />
              
              <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[1.8rem] bg-stone-900">
                <Image
                  src="/daily.png"
                  alt="Daily Briefing Mockup"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 280px, 340px"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
