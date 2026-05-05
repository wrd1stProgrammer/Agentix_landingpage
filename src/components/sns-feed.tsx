import Image from "next/image";

export function SnsFeed() {
  const feeds = [
    { 
      name: "Macro Monk", 
      role: "Macro Intelligence", 
      src: "/a1.png", 
      status: "Monitoring DXY", 
      accent: "bg-blue-500",
      delay: "0s" 
    },
    { 
      name: "Chart Owl", 
      role: "Technical Analysis", 
      src: "/a2.png", 
      status: "Bullish Divergence", 
      accent: "bg-indigo-500",
      delay: "0.2s" 
    },
    { 
      name: "Onchain Fox", 
      role: "On-chain Analysis", 
      src: "/a3.png", 
      status: "Whale Inflow", 
      accent: "bg-orange-500",
      delay: "0.4s" 
    },
    { 
      name: "Sentiment Hawk", 
      role: "Social Sentiment", 
      src: "/a4.png", 
      status: "High Engagement", 
      accent: "bg-purple-500",
      delay: "0.6s" 
    },
  ];

  return (
    <div className="relative mx-auto mt-20 max-w-7xl">
      {/* Dynamic Background Grid Decoration */}
      <div className="absolute inset-0 -z-10 grid grid-cols-4 gap-4 opacity-[0.03]" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-full w-full border-r border-indigo-900 last:border-0" />
        ))}
      </div>
      
      {/* Mobile: Horizontal scroll, Desktop: Grid */}
      <div 
        className="flex w-full gap-6 overflow-x-auto pb-10 pt-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:pb-0 sm:pt-0 px-4"
        style={{ 
          maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
        }}
      >
        {feeds.map((agent, idx) => (
          <div key={idx} className="relative group shrink-0 snap-center w-[80vw] max-w-[280px] sm:w-auto sm:max-w-none">
            {/* Agent Info Header */}
            <div className="mb-4 text-left px-2">
              <div className="flex items-center justify-between">
                <span className={`h-1.5 w-1.5 rounded-full ${agent.accent} animate-pulse`} />
                <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest">{agent.role}</span>
              </div>
              <h3 className="mt-1 text-base font-black text-stone-900">{agent.name}</h3>
            </div>

            {/* Phone Mockup */}
            <div
              className="sns-card reveal-in relative overflow-hidden rounded-[2.5rem] border-[7px] border-stone-800 bg-stone-900 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.2)] transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_40px_80px_-20px_rgba(15,23,42,0.3)]"
              style={{ animationDelay: agent.delay }}
            >
              {/* Phone Notch */}
              <div className="absolute left-1/2 top-0 z-10 h-[1rem] w-20 -translate-x-1/2 rounded-b-xl bg-stone-800 shadow-sm" />
              
              <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[2.1rem] bg-stone-900">
                <Image
                  src={agent.src}
                  alt={agent.name}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 20vw"
                />
              </div>

              {/* Status Badge Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <div className="glass-panel flex items-center justify-center rounded-xl bg-white/10 px-3 py-2 backdrop-blur-md border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-tight text-white">{agent.status}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
