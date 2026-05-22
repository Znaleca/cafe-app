'use client';

import SplitText from './SplitText'; // Adjust this path based on your folder structure

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-[#52b1e7] font-sans select-none m-0 p-0 overflow-hidden">
      
      {/* --- SPARKLING CSS ANIMATIONS --- */}
      <style jsx global>{`
        @keyframes sparkle {
          0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1) rotate(180deg); opacity: 1; }
        }
        .animate-sparkle-1 { animation: sparkle 3s infinite ease-in-out; }
        .animate-sparkle-2 { animation: sparkle 2.5s infinite ease-in-out 0.5s; }
        .animate-sparkle-3 { animation: sparkle 3.5s infinite ease-in-out 1s; }
        .animate-sparkle-4 { animation: sparkle 2.8s infinite ease-in-out 1.5s; }
      `}</style>

      {/* --- SPARKLING PARTICLES --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Sparkle 1 - Top Left */}
        <svg className="absolute top-[25%] left-[15%] w-6 h-6 text-white fill-current animate-sparkle-1" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        {/* Sparkle 2 - Top Right */}
        <svg className="absolute top-[20%] right-[18%] w-8 h-8 text-white fill-current opacity-75 animate-sparkle-2" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        {/* Sparkle 3 - Bottom Left */}
        <svg className="absolute bottom-[30%] left-[20%] w-5 h-5 text-white fill-current opacity-60 animate-sparkle-3" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        {/* Sparkle 4 - Bottom Right */}
        <svg className="absolute bottom-[25%] right-[12%] w-7 h-7 text-white fill-current animate-sparkle-4" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
      </div>

      {/* --- HERO CONTENT --- */}
      <div className="relative z-10 text-center px-4 max-w-6xl">
        {/* Main Header Tag */}
        <SplitText
          tag="h1"
          text="Your new coffee spot."
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tight leading-none uppercase"
          splitType="chars,words"
          delay={40}
          duration={1.2}
          from={{ opacity: 0, y: 50 }}
          to={{ opacity: 1, y: 0 }}
          ease="power4.out"
        />

        {/* Subtitle Tag */}
        <SplitText
          tag="span"
          text="Where moments are brewed."
          className="block text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mt-6 opacity-90 normal-case text-white"
          splitType="words"
          delay={60}
          duration={1.4}
          from={{ opacity: 0, y: 30 }}
          to={{ opacity: 1, y: 0 }}
          ease="power3.out"
        />
      </div>
    </section>
  );
}