'use client';

import { useEffect, useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { supabase } from '@/utils/supabase/client';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('target_type', 'shop')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;

        if (data && data.length > 0) {
          const userIds = [...new Set(data.map(r => r.user_id).filter(Boolean))];
          let nicknameMap = {};
          
          if (userIds.length > 0) {
             const { data: profiles } = await supabase.from('profiles').select('id, nickname').in('id', userIds);
             (profiles || []).forEach(p => { nicknameMap[p.id] = p.nickname; });
          }

          const realReviews = data.map(r => ({
            name: nicknameMap[r.user_id] || 'Guest',
            text: r.comment,
            stars: r.rating
          }));

          setReviews(realReviews);
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReviews();

    // Subscribe to new reviews
    const channel = supabase
      .channel('public-reviews')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reviews' },
        () => {
          fetchReviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading || reviews.length === 0) {
    return null; // Don't show the section if there are no actual reviews
  }

  return (
    <section id="home-reviews" className="relative w-full bg-white py-24 md:py-32 px-4 overflow-hidden border-t border-gray-100 select-none">
      
      <style jsx global>{`
        @keyframes sparkle { 0%,100%{transform:scale(0) rotate(0deg);opacity:0}50%{transform:scale(1.3) rotate(180deg);opacity:0.9} }
        @keyframes revealSkew { from{opacity:0;transform:translateY(45px) skewY(1deg);} to{opacity:1;transform:translateY(0) skewY(0deg);} }
        .animate-sparkle-1 { animation: sparkle 3.2s infinite ease-in-out; }
        .animate-sparkle-2 { animation: sparkle 2.8s infinite ease-in-out 0.4s; }
        .reveal-item { animation: revealSkew 1.05s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>

      {/* Decorative Brand Blue Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute top-[15%] right-[10%] w-7 h-7 text-[#52b1e7] fill-current opacity-30 animate-sparkle-1" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        <svg className="absolute bottom-[15%] left-[8%] w-8 h-8 text-[#52b1e7] fill-current opacity-[0.2] animate-sparkle-2" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[94%] sm:max-w-[96%] mx-auto px-4">
        {/* Title */}
        <h2 className="text-4xl md:text-6xl font-black text-[#52b1e7] uppercase text-center mb-16 md:mb-24 tracking-tighter reveal-item">
          What our guests say
        </h2>
        
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 items-start">
          {reviews.map((t, idx) => (
            <div key={idx} className="flex flex-col text-center items-center p-6 rounded-2xl bg-gray-50/50 border border-gray-100/80 reveal-item h-full">
              {/* Stars */}
              <div className="text-[#52b1e7] mb-5 flex gap-0.5">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <FiStar key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              
              {/* Quote Text */}
              <div className="flex-grow mb-6 flex items-center justify-center">
                {t.text ? (
                  <p className="text-gray-700 text-lg md:text-xl font-medium leading-relaxed">
                    "{t.text}"
                  </p>
                ) : (
                  <p className="text-gray-400/60 italic text-lg font-medium">
                    (No written review)
                  </p>
                )}
              </div>
              
              {/* Minimalist Divider Ring Line */}
              <div className="w-8 h-[2px] bg-[#52b1e7]/20 mb-4"></div>
              
              {/* Reviewer Name */}
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400">
                {t.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}