"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  CaretRightIcon,
  CaretLeftIcon,
} from "@phosphor-icons/react";
import { trackEvent } from "@/lib/analytics";
import { getDictionary } from "@/lib/i18n";

type WaitlistFormProps = {
  id: string;
  placement: "hero" | "beta";
  compact?: boolean;
  lang: "en" | "ko";
};

type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
};

type SubmitState = "idle" | "loading" | "success" | "error";
type Step = "email" | "survey_1" | "survey_2" | "completed";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AGENTS = [
  "Chart Agent",
  "News Agent",
  "On-chain Agent",
  "Narrative Agent",
  "Risk Agent"
];

const TRADING_STYLES = [
  "Scalping",
  "Day Trading",
  "Swing Trading",
  "HODL",
  "DCA",
  "Momentum",
  "Mean Reversion",
  "Arbitrage",
  "TA Focused",
  "FA Focused"
];

function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);

  return {
    utm_source: params.get("utm_source") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
    referrer: document.referrer || undefined,
  };
}

export function WaitlistForm({
  id,
  placement,
  compact = false,
  lang,
}: WaitlistFormProps) {
  const copy = getDictionary(lang);
  
  const INFO_GAP_OPTIONS = [
    { value: "5", label: lang === "ko" ? "매우 많음" : "Very Much" },
    { value: "4", label: lang === "ko" ? "자주 느끼는 편" : "Frequently" },
    { value: "3", label: lang === "ko" ? "가끔 느끼는 편" : "Sometimes" },
    { value: "2", label: lang === "ko" ? "별로 없음" : "Rarely" },
    { value: "1", label: lang === "ko" ? "전혀 없음" : "Never" }
  ];

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  
  // Survey state
  const [selectedAssets, setSelectedAssets] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [infoGapRating, setInfoGapRating] = useState("");

  const [attribution, setAttribution] = useState<Attribution>({});
  const [status, setStatus] = useState<SubmitState>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    setAttribution(getAttribution());
  }, []);

  const emailError = useMemo(() => {
    const trimmed = email.trim();
    if (!trimmed) return "";
    return EMAIL_PATTERN.test(trimmed) ? "" : copy.waitlist.invalidEmail;
  }, [email]);

  const toggleItem = (list: string[], item: string) => {
    return list.includes(item) ? list.filter(i => i !== item) : [...list, item];
  };

  async function onEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    setError("");

    if (!trimmedEmail || !EMAIL_PATTERN.test(trimmedEmail)) {
      setStatus("error");
      setError(copy.waitlist.invalidEmail);
      return;
    }

    setStatus("loading");
    try {
      await new Promise(r => setTimeout(r, 800));
      setStatus("idle");
      setStep("survey_1");
      trackEvent("waitlist_email_success", { placement });
    } catch {
      setStatus("error");
      setError(copy.waitlist.networkError);
    }
  }

  async function onFinalSubmit() {
    setStatus("loading");
    try {
      trackEvent("waitlist_survey_complete", {
        placement,
        assets: selectedAssets,
        agents: selectedAgents.join(", "),
        styles: selectedStyles.join(", "),
        info_gap: infoGapRating
      });
      
      await new Promise(r => setTimeout(r, 800));
      setStatus("success");
      setStep("completed");
    } catch {
      setStatus("error");
    }
  }

  if (step === "completed") {
    return (
      <div className="glass-panel reveal-in rounded-[2rem] p-8 text-center shadow-2xl shadow-indigo-900/5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-sm">
          <CheckCircleIcon size={32} weight="fill" />
        </div>
        <h3 className="mt-6 text-xl font-bold text-stone-900">{copy.waitlist.surveyComplete}</h3>
        <p className="mt-2 text-stone-600 leading-relaxed">
          {copy.waitlist.surveyCompletedBody}
        </p>
      </div>
    );
  }

  if (step === "survey_1") {
    return (
      <div className="glass-panel reveal-in rounded-[2rem] p-6 shadow-2xl shadow-indigo-900/5 sm:p-8">
        <div className="mb-8 flex items-center justify-between">
           <h3 className="text-xl font-black text-stone-900">{copy.waitlist.surveyStep1}</h3>
           <div className="flex gap-1">
             <div className="h-1 w-8 rounded-full bg-indigo-600" />
             <div className="h-1 w-8 rounded-full bg-stone-200" />
           </div>
        </div>

        <div className="grid gap-8">
          <div className="grid gap-3">
            <label className="text-sm font-bold uppercase tracking-widest text-stone-400">{copy.waitlist.surveyQ1Label}</label>
            <input 
              type="text"
              placeholder={copy.waitlist.surveyQ1Placeholder}
              value={selectedAssets}
              onChange={(e) => setSelectedAssets(e.target.value)}
              className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>

          <div className="grid gap-3">
            <label className="text-sm font-bold uppercase tracking-widest text-stone-400">{copy.waitlist.surveyQ2Label}</label>
            <div className="flex flex-wrap gap-2">
              {AGENTS.map(agent => (
                <button
                  key={agent}
                  type="button"
                  onClick={() => setSelectedAgents(toggleItem(selectedAgents, agent))}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all border ${
                    selectedAgents.includes(agent) 
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                      : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
                  }`}
                >
                  {agent}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setStep("survey_2")}
          className="group mt-10 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 text-white font-bold transition-all hover:bg-stone-800"
        >
          {copy.waitlist.surveyNext}
          <CaretRightIcon weight="bold" className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    );
  }

  if (step === "survey_2") {
    return (
      <div className="glass-panel reveal-in rounded-[2rem] p-6 shadow-2xl shadow-indigo-900/5 sm:p-8">
        <div className="mb-8 flex items-center justify-between">
           <button onClick={() => setStep("survey_1")} className="flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-stone-900 transition-colors">
              <CaretLeftIcon weight="bold" /> {copy.waitlist.surveyBack}
           </button>
           <h3 className="text-xl font-black text-stone-900">{copy.waitlist.surveyStep2}</h3>
           <div className="flex gap-1">
             <div className="h-1 w-8 rounded-full bg-indigo-600" />
             <div className="h-1 w-8 rounded-full bg-indigo-600" />
           </div>
        </div>

        <div className="grid gap-8">
          <div className="grid gap-3">
            <label className="text-sm font-bold uppercase tracking-widest text-stone-400">{copy.waitlist.surveyQ3Label}</label>
            <div className="flex flex-wrap gap-2">
              {TRADING_STYLES.map(style => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setSelectedStyles(toggleItem(selectedStyles, style))}
                  className={`rounded-xl px-3 py-2 text-[11px] font-bold transition-all border ${
                    selectedStyles.includes(style) 
                      ? "bg-stone-900 border-stone-900 text-white shadow-md" 
                      : "bg-white border-stone-200 text-stone-500 hover:border-stone-300"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <label className="text-sm font-bold uppercase tracking-widest text-stone-400">{copy.waitlist.surveyQ4Label}</label>
            <div className="grid grid-cols-1 gap-2">
               {INFO_GAP_OPTIONS.map(opt => (
                 <button
                   key={opt.value}
                   type="button"
                   onClick={() => setInfoGapRating(opt.value)}
                   className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                     infoGapRating === opt.value 
                       ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
                       : "bg-white border-stone-100 text-stone-600 hover:bg-stone-50"
                   }`}
                 >
                   {opt.label}
                   {infoGapRating === opt.value && <CheckCircleIcon weight="fill" className="text-indigo-500" />}
                 </button>
               ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={status === "loading"}
          onClick={onFinalSubmit}
          className="group mt-10 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-white font-black shadow-xl shadow-indigo-600/20 transition-all hover:bg-indigo-700 disabled:opacity-50"
        >
          {status === "loading" ? "..." : copy.waitlist.surveyFinish}
          {status !== "loading" && <ArrowRightIcon weight="bold" className="transition-transform group-hover:translate-x-1" />}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onEmailSubmit}
      className={`glass-panel rounded-[2rem] p-4 shadow-2xl shadow-indigo-900/5 ${
        compact ? "sm:p-5" : "sm:p-6"
      }`}
      noValidate
    >
      <div className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor={`${id}-email`} className="sr-only">Email</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (status === "error") {
                   setError("");
                   setStatus("idle");
                }
              }}
              placeholder={copy.waitlist.emailPlaceholder}
              className="h-14 w-full flex-1 rounded-2xl border border-stone-100 bg-white px-5 text-base text-stone-900 outline-none transition-all placeholder:text-stone-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="group inline-flex h-14 items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-indigo-600 px-8 text-base font-bold text-white shadow-xl shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-70"
            >
              {status === "loading" ? "..." : copy.waitlist.buttonIdle}
              <ArrowRightIcon size={18} weight="bold" className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          { (error || emailError) && (
            <p className="mt-2 flex items-center gap-2 px-2 text-sm font-bold text-red-500">
              <WarningCircleIcon weight="bold" /> {error || emailError}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
