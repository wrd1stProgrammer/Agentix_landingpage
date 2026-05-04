"use client";

import type { CSSProperties } from "react";
import {
  ActivityIcon,
  BankIcon,
  ChartLineUpIcon,
  CoinsIcon,
  MegaphoneIcon,
  ShieldWarningIcon,
} from "@phosphor-icons/react";
import { getDictionary } from "@/lib/i18n";

const icons = [
  ActivityIcon,
  BankIcon,
  ChartLineUpIcon,
  CoinsIcon,
  MegaphoneIcon,
  ShieldWarningIcon,
] as const;

export function AgentRows({ lang }: { lang: "en" | "ko" }) {
  const copy = getDictionary(lang);
  return (
    <div className="divide-y divide-stone-200 border-y border-stone-200">
      {copy.agents.rows.map(({ name, watches, example }, index) => {
        const Icon = icons[index] ?? ShieldWarningIcon;

        return (
          <article
            key={name}
            className="reveal-in grid gap-4 py-5 transition-[background-color,transform] duration-300 ease-out hover:bg-white/70 md:grid-cols-[3rem_0.72fr_1fr] md:items-center md:px-3"
            style={{ "--index": index } as CSSProperties}
          >
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <Icon size={19} weight="duotone" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-base font-semibold tracking-tight text-stone-950">
                {name}
              </h3>
              <p className="mt-1 text-sm leading-6 text-stone-500">
                {watches}
              </p>
            </div>
            <p className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm leading-6 text-stone-700 shadow-[0_18px_38px_-32px_rgba(61,54,43,0.6)] md:ml-6">
              {example}
            </p>
          </article>
        );
      })}
    </div>
  );
}
