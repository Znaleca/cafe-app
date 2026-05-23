'use client';

import Link from 'next/link';

export default function About() {
  return (
    <section id="home-about" className="relative w-full min-h-screen flex items-center justify-center bg-[#52b1e7] font-sans select-none m-0 p-0 overflow-hidden py-12 md:py-16">

      {/* --- ADVANCED UNIQUE DESIGN STYLES --- */}
      <style jsx global>{`
        @keyframes sparkle {
          0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.3) rotate(180deg); opacity: 0.9; }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes revealSkew {
          from {
            opacity: 0;
            transform: translateY(45px) skewY(1deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) skewY(0deg);
          }
        }
        
        .animate-sparkle-1 { animation: sparkle 3.2s infinite ease-in-out; }
        .animate-sparkle-2 { animation: sparkle 2.8s infinite ease-in-out 0.4s; }
        .animate-sparkle-3 { animation: sparkle 4s infinite ease-in-out 0.8s; }
        
        .animate-float-extended { animation: floatSlow 10s infinite ease-in-out; }

        .reveal-item-1 { animation: revealSkew 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .reveal-item-2 { animation: revealSkew 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.15s; }
        .reveal-item-3 { animation: revealSkew 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.3s; }
      `}</style>

      {/* --- MONUMENTAL WHITE WATERMARK (TOP & BOTTOM ONLY) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex flex-col justify-between py-4 mix-blend-normal">
        {/* Top Watermark Row */}
        <div
          className="flex max-w-full justify-start items-center gap-24 font-black uppercase tracking-tighter whitespace-nowrap text-white/[0.08] text-8xl sm:text-[12rem] md:text-[16rem] lg:text-[22rem] leading-none"
          style={{ transform: 'translateX(-15%)' }}
        >
          {Array.from({ length: 3 }).map((_, colIndex) => (
            <span key={colIndex} className="inline-block">
              HER<span className="font-serif font-light lowercase italic tracking-normal text-white/[0.04]">&</span>HER
            </span>
          ))}
        </div>

        {/* Bottom Watermark Row */}
        <div
          className="flex max-w-full justify-start items-center gap-24 font-black uppercase tracking-tighter whitespace-nowrap text-white/[0.08] text-8xl sm:text-[12rem] md:text-[16rem] lg:text-[22rem] leading-none"
          style={{ transform: 'translateX(8%)' }}
        >
          {Array.from({ length: 3 }).map((_, colIndex) => (
            <span key={colIndex} className="inline-block">
              HER<span className="font-serif font-light lowercase italic tracking-normal text-white/[0.04]">&</span>HER
            </span>
          ))}
        </div>
      </div>

      {/* Additional Visual Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large Aesthetic White Line Ring */}
        <div className="absolute -right-32 -top-32 w-[500px] h-[500px] rounded-full border-[2px] border-white/10 md:w-[750px] md:h-[750px] lg:w-[1000px] lg:h-[1000px] animate-float-extended" />

        {/* Dynamic Sparkle Placement */}
        <svg className="absolute top-[12%] left-[8%] w-6 h-6 text-white fill-current animate-sparkle-1" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        <svg className="absolute top-[35%] right-[8%] w-8 h-8 text-white fill-current opacity-75 animate-sparkle-2" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        <svg className="absolute bottom-[30%] left-[38%] w-5 h-5 text-white fill-current opacity-60 animate-sparkle-3" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
      </div>

      {/* --- EDGE-TO-EDGE EXPANDED EDITORIAL GRID LAYOUT --- */}
      <div id="about-text-content" className="relative z-10 px-4 sm:px-8 md:px-12 lg:px-16 max-w-[92%] sm:max-w-[95%] w-full grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-16 items-center">

        {/* Left Column: Giant Typographic Hook Statement */}
        <div className="flex flex-col items-start justify-center w-full">
          <div className="overflow-hidden mb-1">
            <span className="text-xs font-bold tracking-[0.5em] uppercase text-white/70 block transform translate-y-full reveal-item-1">
              Welcome to Her&Her
            </span>
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white uppercase tracking-tighter leading-[0.9] text-left opacity-0 reveal-item-1">
            Every cup <br />
            tells a <span className="font-serif font-light lowercase italic tracking-normal text-sky-100">story.</span>
          </h2>
        </div>

        {/* Right Column: High-Density Body Copy & Action Element */}
        <div className="flex flex-col items-start justify-center lg:pl-12 lg:border-l lg:border-white/20 gap-6 md:gap-8 w-full">
          <p className="text-xl sm:text-2xl md:text-3xl font-light tracking-wide text-white/90 leading-relaxed text-left opacity-0 reveal-item-2 max-w-none">
            Our cozy pastel-inspired coffee space is crafted for slow mornings,
            meaningful conversations, creative energy, and peaceful escapes —
            serving handcrafted coffee, fresh pastries, and warm moments in every single visit.
          </p>

          {/* Scaled-down, Sleeker Minimal CTA Button */}
          <div className="opacity-0 reveal-item-3">
            <Link
              href="/menu"
              className="group relative inline-flex items-center justify-center px-5 py-2.5 overflow-hidden font-bold tracking-widest uppercase text-[10px] rounded-lg bg-white text-[#52b1e7] shadow-lg shadow-sky-950/5 transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              {/* Animated Slide Color Fill Background Block */}
              <span className="absolute inset-0 w-full h-full bg-sky-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />

              <span className="relative flex items-center gap-2">
                Browse Menu
                <svg className="w-2.5 h-2.5 transform transition-transform duration-300 ease-out group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}