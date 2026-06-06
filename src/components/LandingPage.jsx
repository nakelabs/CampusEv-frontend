import { useState } from 'react';

const features = [
  {
    title: "1. Intelligent EV Readiness Scoring",
    content: "We evaluate your campus's infrastructure health using a multi-variable assessment engine. The platform analyzes student population, fleet sizing, current grid limitations, and network status to generate an instant, definitive EV Readiness Score—actively identifying operational bottlenecks before you break ground."
  },
  {
    title: "2. \"Smart-Split\" Budget Allocator",
    content: "Maximize every Naira of your transition capital. Our dynamic financial modeling layer automatically breaks down your total available budget into precise, data-driven line-item allocations—such as charging hardware, solar backup buffers, civil trenching, and network access points—tailored to your specific infrastructure risk profile."
  },
  {
    title: "3. Live Grid IoT Telemetry",
    content: "Ensure campus grid safety before and during charger deployment. By ingesting real-time MQTT data streams from live physical hardware monitors, CampusEV Intel tracks transformer voltage levels and instantly triggers visual dashboard warnings if local electrical grids face potential overload risks."
  },
  {
    title: "4. Geospatial Heatmap & Trenching Calculator",
    content: "Plan your physical deployment with pinpoint geographic accuracy. Our interactive, map-based layout tool allows administrators to click and position virtual charging stations anywhere on campus, automatically calculating exact real-world trenching distances and copper cabling costs back to the nearest power source."
  },
  {
    title: "5. Live Student Demand Polling",
    content: "Validate infrastructure spending with real-time community data. The platform generates public-facing QR codes that link students to a mobile-responsive voting portal. Every submission instantly aggregates back to the central dashboard, giving administrators bulletproof proof-of-demand to justify initial investments."
  },
  {
    title: "6. Context-Aware AI Procurement Copilot",
    content: "Bridge the institutional intelligence gap with automated advisory services. Powered by Amazon Bedrock foundational models, our integrated generative AI assistant reads your unique campus profile data to draft local ISP upgrade letters, recommend hardware brands matching your grid constraints, and compile board-ready executive summaries."
  }
];

const LandingPage = ({ onNavigate }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="relative flex flex-col overflow-x-hidden bg-background">

      {/* Logo */}
      <div className="absolute top-0 left-0 w-full p-6 sm:px-8 z-50 animate-[fadeIn_0.5s_ease-out]">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <span className="font-black text-xl tracking-tight text-slate-900 uppercase">CampusEV</span>
        </div>
      </div>

      {/* Main hero content */}
      <div className="relative min-h-[85vh] z-10 flex flex-col justify-center pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="max-w-xl mb-12">
          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 uppercase tracking-tight leading-[1.05] mb-6 animate-[fadeIn_1s_ease-out]">
            University
            <br />
            AI Powered
            <br />
            EV Infrastructure
            <br />
            Planning.
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 font-medium text-base sm:text-lg mb-10 leading-relaxed animate-[fadeIn_1.2s_ease-out]">
            CampusEV Intel deploys smart charging networks with data-driven precision. We analyze your grid telemetry, student demand, and budget constraints to architect the optimal rollout.
          </p>

          {/* CTA */}
          <div className="animate-[fadeIn_1.4s_ease-out]">
            <button
              onClick={() => onNavigate('assess')}
              className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold text-sm px-7 py-3.5 border border-[#10b981] hover:bg-slate-800 tracking-widest uppercase transition-all"
              style={{ clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)' }}
            >
              Launch Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Features Accordion Section (Replicating the provided FAQ Layout) */}
      <section className="py-12 bg-[#f5f4f0] border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            
            {/* Left: Heading */}
            <div className="lg:w-80 flex-shrink-0">
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
                What Our<br />Platform Does
              </h2>
              <p className="mt-4 text-slate-500 text-sm leading-relaxed">
                Everything university staff need to plan, budget, and deploy charging infrastructure.
              </p>
            </div>

            {/* Right: Accordion */}
            <div className="flex-1 flex flex-col divide-y divide-slate-200">
              {features.map((feature, index) => (
                <div key={index} className="py-5">
                  <button
                    className="w-full flex items-start justify-between gap-4 text-left group"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  >
                    <span className={`text-base font-semibold transition-colors ${openIndex === index ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                      {feature.title}
                    </span>
                    <span className={`flex-shrink-0 w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-[#0f0f14] border-[#0f0f14] rotate-180' : 'bg-white'}`}>
                      <svg className={`w-3.5 h-3.5 transition-colors ${openIndex === index ? 'text-white' : 'text-slate-400'}`} viewBox="0 0 14 14" fill="none">
                        <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-64 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-slate-500 text-sm leading-relaxed pr-8">
                      {feature.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
