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
import { supabase } from "@/lib/supabase";

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
  const [dbRecordId, setDbRecordId] = useState<string | null>(null);

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
      const { data, error: sbError } = await supabase
        .from("waitlist")
        .insert([
          { 
            email: trimmedEmail,
            utm_source: attribution.utm_source,
            utm_medium: attribution.utm_medium,
            utm_campaign: attribution.utm_campaign,
            referrer: attribution.referrer,
            placement
          }
        ])
        .select()
        .single();

      if (sbError) {
        console.error("Supabase Email Submit Error:", sbError);
        // Handle duplicate email or other DB errors
        if (sbError.code === "23505") {
          setError(lang === "ko" ? "이미 신청된 이메일입니다." : "This email is already registered.");
        } else {
          setError(copy.waitlist.networkError);
        }
        setStatus("error");
        return;
      }

      setDbRecordId(data.id);
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
      if (dbRecordId) {
        const { error: sbError } = await supabase
          .from("waitlist")
          .update({
            survey_completed: true,
            assets: selectedAssets,
            agents: selectedAgents,
            trading_styles: selectedStyles,
            info_gap: infoGapRating
          })
          .eq("id", dbRecordId);

        if (sbError) throw sbError;
      }

      trackEvent("waitlist_survey_complete", {
        placement,
        assets: selectedAssets,
        agents: selectedAgents.join(", "),
        styles: selectedStyles.join(", "),
        info_gap: infoGapRating
      });
      
      setStatus("success");
      setStep("completed");
    } catch (err) {
      console.error("Supabase Survey Submit Error:", err);
      setStatus("error");
      setError(copy.waitlist.networkError);
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
              {copy.waitlist.surveyQ2Options.map(agent => (
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
              {copy.waitlist.surveyQ3Options.map(style => (
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
    <div className={`relative w-full max-w-xl mx-auto ${compact ? "" : "mt-8"}`}>
      <form
        onSubmit={onEmailSubmit}
        className="group relative flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0 sm:bg-white sm:p-2 sm:rounded-full sm:border sm:border-stone-100 sm:shadow-2xl sm:shadow-indigo-900/10 transition-all focus-within:ring-8 focus-within:ring-indigo-500/5"
        noValidate
      >
        <div className="relative flex-1">
          <label htmlFor={`${id}-email`} className="sr-only">Email</label>
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
            className="h-14 w-full rounded-2xl sm:rounded-full border border-stone-200/50 sm:border-none bg-stone-50/50 sm:bg-transparent px-6 text-base text-stone-900 outline-none transition-all placeholder:text-stone-400 focus:bg-white sm:focus:bg-transparent"
          />
        </div>
        
        <button
          type="submit"
          disabled={status === "loading"}
          className="group relative inline-flex h-14 items-center justify-center gap-3 whitespace-nowrap rounded-2xl sm:rounded-full bg-indigo-600 px-10 text-base font-black text-white shadow-xl shadow-indigo-600/30 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/40 active:scale-[0.98] disabled:opacity-70 overflow-hidden animate-shimmer"
        >
          {status === "loading" ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>
              <span className="tracking-tight">{copy.waitlist.buttonIdle}</span>
              <ArrowRightIcon size={18} weight="bold" className="transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      { (error || emailError) && (
        <div className="absolute top-full left-0 right-0 mt-3 flex items-center justify-center gap-2 px-2 text-[11px] font-black text-red-500 animate-in fade-in slide-in-from-top-1">
          <WarningCircleIcon weight="bold" size={14} /> 
          {error || emailError}
        </div>
      )}
    </div>
  );
}
