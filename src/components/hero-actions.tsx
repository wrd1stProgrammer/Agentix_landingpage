"use client";

import { ArrowDownIcon } from "@phosphor-icons/react";
import { trackEvent } from "@/lib/analytics";
import { getDictionary } from "@/lib/i18n";

export function HeroActions({ lang }: { lang: "en" | "ko" }) {
  const copy = getDictionary(lang);
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <a
        href="#waitlist"
        onClick={() => trackEvent("hero_cta_click", { target: "hero_form" })}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-indigo-600 bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_-24px_rgba(79,70,229,0.9)] transition-all duration-300 ease-out hover:bg-indigo-700 hover:shadow-[0_16px_34px_-20px_rgba(79,70,229,0.95)] focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-[var(--background)] active:translate-y-[1px]"
      >
        {copy.hero.primaryCta}
        <ArrowDownIcon size={16} weight="bold" aria-hidden="true" />
      </a>
    </div>
  );
}
