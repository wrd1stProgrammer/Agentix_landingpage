"use client";

import { trackEvent } from "@/lib/analytics";
import { getDictionary } from "@/lib/i18n";

export function NavLinks({ lang }: { lang: "en" | "ko" }) {
  const copy = getDictionary(lang);
  return (
    <div className="flex shrink-0 items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
      <a
        href="#waitlist"
        onClick={() => trackEvent("hero_cta_click", { target: "nav_waitlist" })}
        className="whitespace-nowrap rounded-full border border-indigo-600 bg-indigo-600 px-3 py-2 font-semibold text-white transition-all duration-300 ease-out hover:bg-indigo-700 active:translate-y-[1px] sm:px-4"
      >
        {copy.nav.waitlist}
      </a>
    </div>
  );
}
