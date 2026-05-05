import Image from "next/image";
import { FAQ } from "@/components/faq";
import { HeroActions } from "@/components/hero-actions";
import { NavLinks } from "@/components/nav-links";
import { PageViewTracker } from "@/components/page-view-tracker";
import { WaitlistForm } from "@/components/waitlist-form";
import { SnsFeed } from "@/components/sns-feed";
import { DailyBriefing } from "@/components/daily-briefing";
import { ScrollVideoMockup } from "@/components/scroll-video-mockup";
import { ComparisonSection } from "@/components/comparison";
import { getDictionary, Dictionary } from "@/lib/i18n";
import { ScrollReveal } from "@/components/scroll-reveal";



export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const copy = getDictionary(lang as "en" | "ko");
  
  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-white text-stone-900">
      <PageViewTracker />
      


      {/* Hero Section */}
      <section
        id="waitlist"
        className="relative px-4 pb-24 pt-16 sm:px-6 md:pt-20 lg:px-8 overflow-hidden"
      >
        {/* Hazy Background Layer */}
        <div className="absolute inset-0 -z-20">
          <div className="absolute top-0 h-[600px] w-full bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.08),transparent_70%)]" />
          <div className="absolute top-[20%] right-[10%] h-[400px] w-[400px] bg-indigo-200/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 h-[800px] w-full bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-top opacity-5 mix-blend-multiply grayscale blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-white" />
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* Left Column: Text Content */}
            <div className="text-left">
              <ScrollReveal delay={100}>
                <div className="section-kicker !px-4 !justify-start">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  {copy.hero.kicker}
                </div>
              </ScrollReveal>
              
              <ScrollReveal delay={200}>
                <h1 className="mt-8 text-3xl font-black leading-[1.1] tracking-tight text-stone-900 sm:text-4xl md:text-5xl lg:text-6xl break-keep text-balance">
                  {copy.hero.headline}
                </h1>
              </ScrollReveal>
              
              <ScrollReveal delay={300}>
                <p className="mt-8 max-w-xl text-lg leading-relaxed text-stone-500 sm:text-xl">
                  {copy.hero.subheadline}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={400} className="mt-12 max-w-xl">
                <div className="flex items-center gap-2 mb-6">
                  <span className="h-px w-8 bg-stone-200" />
                  <p className="text-xs font-black text-stone-400 uppercase tracking-[0.3em]">{copy.beta.kicker}</p>
                </div>
                <WaitlistForm id="hero-waitlist" placement="hero" lang={lang as "en" | "ko"} />
                <p className="mt-6 text-xs font-medium text-stone-400">
                  {copy.hero.note}
                </p>
              </ScrollReveal>
            </div>

            {/* Right Column: Scroll Video Mockup */}
            <ScrollReveal delay={500} className="relative">
              <ScrollVideoMockup 
                videoSrc="/hero-video.mp4" 
                fallbackImage="/main.png" 
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 2. Agent Feeds Section */}
      <section id="agents" className="relative px-4 py-32 sm:px-6 lg:px-8 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl text-center">
          <ScrollReveal>
            <p className="section-kicker">{copy.agents.kicker}</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-black tracking-tight text-stone-900 md:text-5xl break-keep text-balance">
              {copy.agents.headline}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-stone-500 leading-relaxed">
              {copy.steps.items[1].body}
            </p>
          </ScrollReveal>
          
          <ScrollReveal delay={200}>
            <SnsFeed />
          </ScrollReveal>
        </div>
      </section>

      {/* 3. Daily Briefing Section */}
      <section className="relative overflow-hidden bg-white px-4 py-32 sm:px-6 lg:px-8">
        <ScrollReveal>
          <DailyBriefing lang={lang as "en" | "ko"} />
        </ScrollReveal>
      </section>

      {/* 4. Comparison Section: Chaos vs Control */}
      <ScrollReveal>
        <ComparisonSection lang={lang as "en" | "ko"} />
      </ScrollReveal>

      {/* 4. Bottom CTA Section */}
      <section id="beta" className="px-4 py-32 sm:px-6 lg:px-8 bg-stone-50/50 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05),transparent_50%)]" />
        
        <ScrollReveal className="glass-panel relative mx-auto max-w-5xl overflow-hidden rounded-[3rem] p-10 text-center shadow-2xl shadow-indigo-900/5 sm:p-20">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50/50 to-cyan-50/50 opacity-80" />
          <p className="section-kicker">{copy.beta.kicker}</p>
          <h2 className="mt-8 text-4xl font-black tracking-tight text-stone-900 md:text-5xl break-keep text-balance">
            {copy.beta.headline}
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-stone-500 leading-relaxed">
            {copy.beta.body}
          </p>
          <div className="mx-auto mt-12 max-w-lg">
            <WaitlistForm id="beta-waitlist" placement="beta" compact lang={lang as "en" | "ko"} />
          </div>
        </ScrollReveal>
      </section>

      {/* 5. FAQ & Footer */}
      <div className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
          <FAQ lang={lang as "en" | "ko"} />
        </div>

        <footer className="border-t border-stone-100 bg-stone-50/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                <span className="h-2.5 w-2.5 rounded-full bg-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-stone-900">Agentix</p>
                <p className="text-xs font-medium text-stone-500 tracking-wide uppercase">{copy.footer.tagline}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8 text-sm font-semibold text-stone-400">
               <a href="#" className="hover:text-stone-900 transition-colors">Privacy</a>
               <a href="#" className="hover:text-stone-900 transition-colors">Terms</a>
               <a href="#" className="hover:text-stone-900 transition-colors">Twitter</a>
            </div>

            <p className="text-sm font-medium text-stone-400">{copy.footer.disclaimer}</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
