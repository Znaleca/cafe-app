'use client';

export default function About() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-start bg-[#52b1e7] font-sans select-none m-0 p-0 overflow-hidden">
      
      {/* --- SPARKLING & FADE-IN CSS ANIMATIONS --- */}
      <style jsx global>{`
        @keyframes sparkle {
          0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1) rotate(180deg); opacity: 1; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-sparkle-1 { animation: sparkle 3s infinite ease-in-out; }
        .animate-sparkle-2 { animation: sparkle 2.5s infinite ease-in-out 0.5s; }
        .animate-sparkle-3 { animation: sparkle 3.5s infinite ease-in-out 1s; }
        .animate-sparkle-4 { animation: sparkle 2.8s infinite ease-in-out 1.5s; }
        
        .animate-fade-in-up {
          animation: fadeInUp 1.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>

      {/* --- SPARKLING PARTICLES --- */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute top-[15%] left-[45%] w-6 h-6 text-white fill-current animate-sparkle-1" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        <svg className="absolute top-[35%] right-[10%] w-8 h-8 text-white fill-current opacity-75 animate-sparkle-2" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        <svg className="absolute bottom-[20%] left-[35%] w-5 h-5 text-white fill-current opacity-60 animate-sparkle-3" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        <svg className="absolute bottom-[15%] right-[25%] w-7 h-7 text-white fill-current animate-sparkle-4" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
      </div>

      {/* --- ABOUT CONTENT --- */}
      <div className="relative z-10 px-8 sm:px-16 md:px-24 max-w-4xl w-full flex flex-col items-start justify-center">
        <p className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide normal-case text-white leading-relaxed text-left block opacity-0 animate-fade-in-up">
  Every cup tells a story. Our cozy pastel-inspired coffee space is crafted for 
  slow mornings, meaningful conversations, creative energy, and peaceful escapes — 
  serving handcrafted coffee, fresh pastries, and warm moments in every visit.
</p>
      </div>
    </section>
  );
}