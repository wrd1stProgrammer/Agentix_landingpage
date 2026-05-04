"use client";

import { useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { trackEvent } from "@/lib/analytics";
import { getDictionary } from "@/lib/i18n";

export function FAQ({ lang }: { lang: "en" | "ko" }) {
  const copy = getDictionary(lang);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function toggle(index: number) {
    setOpenIndex((current) => {
      const next = current === index ? null : index;

      if (next !== null) {
        trackEvent("faq_expand", {
          question: copy.faq.items[index]?.question ?? "unknown",
          index,
        });
      }

      return next;
    });
  }

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.65fr_1.35fr]">
        <div>
          <p className="section-kicker">{copy.faq.kicker}</p>
          <h2 className="ko-keep mt-4 text-3xl font-semibold tracking-tight text-stone-950 md:text-5xl">
            {copy.faq.headline}
          </h2>
        </div>
        <div className="divide-y divide-stone-200 border-y border-stone-200">
          {copy.faq.items.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold tracking-tight text-stone-950 transition-colors duration-300 hover:text-[color:var(--accent-ink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--background)]"
                >
                  <span>{faq.question}</span>
                  <CaretDownIcon
                    size={18}
                    weight="bold"
                    aria-hidden="true"
                    className={`shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen ? (
                  <div className="reveal-in">
                    <p className="max-w-[70ch] pb-5 text-sm leading-6 text-stone-600">
                      {faq.answer}
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
