'use client';

import Link from 'next/link';

export default function CTA() {
  return (
    <section id="home-cta" className="relative w-full bg-white py-24 md:py-32 px-4 overflow-hidden border-t border-gray-100 select-none">
      
      <style jsx global>{`
        @keyframes sparkle { 0%,100%{transform:scale(0) rotate(0deg);opacity:0}50%{transform:scale(1.3) rotate(180deg);opacity:0.9} }
        @keyframes revealSkew { from{opacity:0;transform:translateY(45px) skewY(1deg);} to{opacity:1;transform:translateY(0) skewY(0deg);} }
        .animate-sparkle-1 { animation: sparkle 3.2s infinite ease-in-out; }
        .animate-sparkle-2 { animation: sparkle 2.8s infinite ease-in-out 0.4s; }
        .reveal-item { animation: revealSkew 1.05s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>

      {/* Decorative Brand Blue Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute top-[20%] left-[10%] w-8 h-8 text-[#52b1e7] fill-current opacity-40 animate-sparkle-1" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        <svg className="absolute bottom-[25%] right-[12%] w-10 h-10 text-[#52b1e7] fill-current opacity-[0.25] animate-sparkle-2" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 max-w-4xl mx-auto text-center text-[#52b1e7] reveal-item">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tighter uppercase leading-none text-[#52b1e7]">
          Ready to taste the magic?
        </h2>
        
        <p className="text-gray-600 text-lg md:text-xl font-medium max-w-xl mx-auto mb-10 leading-relaxed">
          Join the Her<span className="font-serif font-light lowercase italic tracking-normal text-[#52b1e7]">&</span>Her community and start your journey into a world of sky-blue dreams today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/menu"
            className="w-full sm:w-auto text-center px-10 py-3.5 bg-[#52b1e7] text-white rounded-full font-bold text-sm tracking-wider uppercase shadow-md shadow-sky-200/50 hover:bg-[#43a2d8] transition-all duration-200"
          >
            Order Now
          </Link>
          <Link
            href="/register"
            className="w-full sm:w-auto text-center px-10 py-3.5 bg-transparent border-2 border-[#52b1e7]/60 text-[#52b1e7] rounded-full font-bold text-sm tracking-wider uppercase hover:border-[#52b1e7] hover:bg-[#52b1e7]/5 transition-all duration-200"
          >
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
}