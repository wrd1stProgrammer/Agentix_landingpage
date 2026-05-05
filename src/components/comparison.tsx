"use client";

import { WarningCircleIcon, CheckCircleIcon, ChartPolarIcon, ScanIcon, ShieldCheckIcon, LightningIcon } from "@phosphor-icons/react";
import { getDictionary } from "@/lib/i18n";

type ComparisonSectionProps = {
  lang: "en" | "ko";
};

export function ComparisonSection({ lang }: ComparisonSectionProps) {
  const copy = getDictionary(lang);
  
  const controlIcons = [ChartPolarIcon, ScanIcon, ShieldCheckIcon, LightningIcon];

  return (
    <section className="relative px-4 py-32 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-20">
          <p className="section-kicker">{copy.comparison.kicker}</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-stone-900 md:text-4xl lg:text-5xl text-balance break-keep">
            {copy.comparison.headline}
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
          {/* Chaos Side */}
          <div className="relative group overflow-hidden rounded-[2.5rem] bg-stone-50 border border-stone-100 p-8 sm:p-12 transition-all duration-500 hover:shadow-xl hover:shadow-stone-200/50">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-200 text-stone-500">
                <WarningCircleIcon weight="bold" size={24} />
              </div>
              <h3 className="text-xl font-bold text-stone-400">{copy.comparison.chaosTitle}</h3>
            </div>
            
            <ul className="space-y-6">
              {copy.comparison.chaosItems.map((item, i) => (
                <li key={i} className="flex items-start gap-4 opacity-50 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0">
                   <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-stone-300" />
                   <span className="text-lg font-medium text-stone-600">{item}</span>
                </li>
              ))}
            </ul>

            {/* Visual element: Blurred noise background */}
            <div className="absolute -bottom-10 -right-10 -z-10 h-64 w-64 bg-stone-200/30 blur-3xl rounded-full" />
          </div>

          {/* Control Side (Agentix) */}
          <div className="relative group overflow-hidden rounded-[2.5rem] bg-stone-900 p-8 sm:p-12 shadow-2xl shadow-indigo-900/10 transition-all duration-500 hover:-translate-y-1">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 h-64 w-64 bg-indigo-500/20 blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-cyan-500/10 blur-[100px]" />

            <div className="relative z-10">
              <div className="mb-10 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/40">
                  <CheckCircleIcon weight="fill" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{copy.comparison.controlTitle}</h3>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {copy.comparison.controlItems.map((item, i) => {
                  const Icon = controlIcons[i] || LightningIcon;
                  return (
                    <div key={i} className="group/item relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-5 transition-all hover:bg-white/10 hover:border-white/20">
                      <Icon weight="duotone" size={28} className="text-indigo-400 mb-4 transition-transform group-hover/item:scale-110" />
                      <h4 className="text-sm font-bold text-white mb-1.5">{item.title}</h4>
                      <p className="text-xs text-stone-400 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
