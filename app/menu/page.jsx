'use client';

import { useEffect, useRef, useState } from 'react';
import MenuCard from '@/components/MenuCard';
import SplitText from '@/components/SplitText';
import { getMenu } from '@/actions/getMenu';
import { supabase } from '@/utils/supabase/client';

// Updated category structure
const CATEGORIES = [
  'All',
  'Quick Bites',
  'Hearty Meals',
  'Pasta Picks',
  'Sweet Treats',
  'Coffee-Based',
  'Non-Coffee',
  'Specials'
];

function normalizeCategory(category) {
  return (category || '').trim().toLowerCase();
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [role, setRole] = useState(null);

  // Updated section references for scrolling
  const sectionRefs = {
    'Quick Bites': useRef(null),
    'Hearty Meals': useRef(null),
    'Pasta Picks': useRef(null),
    'Sweet Treats': useRef(null),
    'Coffee-Based': useRef(null),
    'Non-Coffee': useRef(null),
    Specials: useRef(null),
    Other: useRef(null),
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchMenu() {
      try {
        const data = await getMenu();
        if (isMounted) {
          setMenuItems(Array.isArray(data) ? data : []);
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && isMounted) {
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
          if (profile) setRole(profile.role);
        }
      } catch (error) {
        console.error('Error fetching menu or role:', error);
        if (isMounted) {
          setMenuItems([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchMenu();

    return () => {
      isMounted = false;
    };
  }, []);

  // Groups incoming backend data into your designated categories
  const groupedItems = menuItems.reduce(
    (acc, item) => {
      const category = normalizeCategory(item.category);

      if (category.includes('quick') || category.includes('bite')) {
        acc['Quick Bites'].push(item);
      } else if (category.includes('hearty') || category.includes('meal')) {
        acc['Hearty Meals'].push(item);
      } else if (category.includes('pasta') || category.includes('pick')) {
        acc['Pasta Picks'].push(item);
      } else if (category.includes('sweet') || category.includes('treat') || category.includes('pastry')) {
        acc['Sweet Treats'].push(item);
      } else if (category.includes('coffee')) {
        acc['Coffee-Based'].push(item);
      } else if (category.includes('non-coffee') || category.includes('tea') || category.includes('drink')) {
        acc['Non-Coffee'].push(item);
      } else if (category.includes('special') || category.includes('seasonal') || category.includes('occasion')) {
        acc.Specials.push(item);
      } else {
        acc.Other.push(item);
      }

      return acc;
    },
    {
      'Quick Bites': [],
      'Hearty Meals': [],
      'Pasta Picks': [],
      'Sweet Treats': [],
      'Coffee-Based': [],
      'Non-Coffee': [],
      Specials: [],
      Other: [],
    }
  );

  const visibleItemsCount =
    activeCategory === 'All'
      ? Object.values(groupedItems).reduce((sum, arr) => sum + arr.length, 0)
      : groupedItems[activeCategory]?.length || 0;

  const scrollToSection = (category) => {
    setActiveCategory(category);

    if (category === 'All') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetRef = sectionRefs[category];
    if (targetRef?.current) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = targetRef.current.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-900 font-sans antialiased">
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

      {/* Hero Banner */}
      <div className="relative w-full flex items-center justify-center bg-[#52b1e7] select-none py-20 px-4 overflow-hidden">

        {/* Watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <span className="font-black uppercase tracking-tighter text-white/[0.05] text-[20vw] leading-none whitespace-nowrap select-none">
            HER<span className="font-serif font-light lowercase italic tracking-normal">&</span>HER
          </span>
        </div>

        {/* Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute top-[25%] left-[8%] w-6 h-6 text-white fill-current opacity-80 animate-sparkle-1" viewBox="0 0 24 24"><path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" /></svg>
          <svg className="absolute top-[18%] right-[12%] w-9 h-9 text-white fill-current opacity-60 animate-sparkle-2" viewBox="0 0 24 24"><path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" /></svg>
          <svg className="absolute bottom-[22%] left-[20%] w-5 h-5 text-white fill-current opacity-60 animate-sparkle-3" viewBox="0 0 24 24"><path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" /></svg>
          <svg className="absolute bottom-[18%] right-[8%] w-7 h-7 text-white fill-current opacity-80 animate-sparkle-4" viewBox="0 0 24 24"><path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" /></svg>
        </div>

        <div className="relative z-10 text-center px-4">
          <span className="text-xs font-bold tracking-[0.4em] uppercase text-white/70 block mb-6">Her &amp; Her Cafe</span>
          <SplitText
            tag="h1"
            text="Our Menu"
            className="text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] font-black text-white tracking-tighter uppercase leading-none"
            splitType="chars,words"
            delay={40}
            duration={1.2}
            from={{ opacity: 0, y: 50 }}
            to={{ opacity: 1, y: 0 }}
            ease="power4.out"
          />
          <p className="mt-6 text-xl md:text-2xl font-light text-white/80 tracking-wide">
            Where every cup tells a <span className="font-serif italic text-sky-100">story.</span>
          </p>
        </div>
      </div>

      {/* Filter Category Bar */}
      <div className="sticky top-0 z-40 py-5 px-4 bg-[#faf9f6]/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm overflow-x-auto whitespace-nowrap scrollbar-none">
        <div className="max-w-6xl mx-auto flex items-center justify-start md:justify-center gap-2 sm:gap-4 px-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => scrollToSection(cat)}
                className={`px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest transition-all duration-300 flex-shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-900 hover:border-slate-400'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Menu Grid Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {loading ? (
          <div className="space-y-16 animate-pulse">
            {[1, 2].map((group) => (
              <div key={group} className="space-y-8">
                <div className="h-8 bg-slate-200 w-48 mx-auto rounded-md" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 bg-slate-200 rounded-2xl w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : visibleItemsCount === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-xl font-bold text-slate-400 uppercase tracking-wider">No items available yet.</p>
          </div>
        ) : (
          <div className="space-y-24">
            
            {/* FOOD MENU */}
            {(activeCategory === 'All' || activeCategory === 'Quick Bites') && groupedItems['Quick Bites'].length > 0 && (
              <div ref={sectionRefs['Quick Bites']} className="space-y-12 transition-all duration-500">
                <div className="text-center space-y-2">
                  <h2 className="text-4xl font-black uppercase tracking-wider text-slate-900">Quick Bites</h2>
                  <div className="w-12 h-1 bg-[#52b1e7] mx-auto rounded-full" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8 items-stretch">
                  {groupedItems['Quick Bites'].map((item) => (
                    <MenuCard key={item.id} item={item} role={role} />
                  ))}
                </div>
              </div>
            )}

            {(activeCategory === 'All' || activeCategory === 'Hearty Meals') && groupedItems['Hearty Meals'].length > 0 && (
              <div ref={sectionRefs['Hearty Meals']} className="space-y-12 transition-all duration-500">
                <div className="text-center space-y-2">
                  <h2 className="text-4xl font-black uppercase tracking-wider text-slate-900">Hearty Meals</h2>
                  <div className="w-12 h-1 bg-[#52b1e7] mx-auto rounded-full" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8 items-stretch">
                  {groupedItems['Hearty Meals'].map((item) => (
                    <MenuCard key={item.id} item={item} role={role} />
                  ))}
                </div>
              </div>
            )}

            {(activeCategory === 'All' || activeCategory === 'Pasta Picks') && groupedItems['Pasta Picks'].length > 0 && (
              <div ref={sectionRefs['Pasta Picks']} className="space-y-12 transition-all duration-500">
                <div className="text-center space-y-2">
                  <h2 className="text-4xl font-black uppercase tracking-wider text-slate-900">Pasta Picks</h2>
                  <div className="w-12 h-1 bg-[#52b1e7] mx-auto rounded-full" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8 items-stretch">
                  {groupedItems['Pasta Picks'].map((item) => (
                    <MenuCard key={item.id} item={item} role={role} />
                  ))}
                </div>
              </div>
            )}

            {(activeCategory === 'All' || activeCategory === 'Sweet Treats') && groupedItems['Sweet Treats'].length > 0 && (
              <div ref={sectionRefs['Sweet Treats']} className="space-y-12 transition-all duration-500">
                <div className="text-center space-y-2">
                  <h2 className="text-4xl font-black uppercase tracking-wider text-slate-900">Sweet Treats</h2>
                  <div className="w-12 h-1 bg-[#52b1e7] mx-auto rounded-full" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8 items-stretch">
                  {groupedItems['Sweet Treats'].map((item) => (
                    <MenuCard key={item.id} item={item} role={role} />
                  ))}
                </div>
              </div>
            )}

            {/* DRINKS MENU */}
            {(activeCategory === 'All' || activeCategory === 'Coffee-Based') && groupedItems['Coffee-Based'].length > 0 && (
              <div ref={sectionRefs['Coffee-Based']} className="space-y-12 transition-all duration-500">
                <div className="text-center space-y-2">
                  <h2 className="text-4xl font-black uppercase tracking-wider text-slate-900">Coffee-Based</h2>
                  <div className="w-12 h-1 bg-[#52b1e7] mx-auto rounded-full" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8 items-stretch">
                  {groupedItems['Coffee-Based'].map((item) => (
                    <MenuCard key={item.id} item={item} role={role} />
                  ))}
                </div>
              </div>
            )}

            {(activeCategory === 'All' || activeCategory === 'Non-Coffee') && groupedItems['Non-Coffee'].length > 0 && (
              <div ref={sectionRefs['Non-Coffee']} className="space-y-12 transition-all duration-500">
                <div className="text-center space-y-2">
                  <h2 className="text-4xl font-black uppercase tracking-wider text-slate-900">Non-Coffee</h2>
                  <div className="w-12 h-1 bg-[#52b1e7] mx-auto rounded-full" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8 items-stretch">
                  {groupedItems['Non-Coffee'].map((item) => (
                    <MenuCard key={item.id} item={item} role={role} />
                  ))}
                </div>
              </div>
            )}

            {/* SPECIALS MENU */}
            {(activeCategory === 'All' || activeCategory === 'Specials') && groupedItems.Specials.length > 0 && (
              <div ref={sectionRefs.Specials} className="space-y-12 transition-all duration-500">
                <div className="text-center space-y-2">
                  <h2 className="text-4xl font-black uppercase tracking-wider text-slate-900">Specials</h2>
                  <div className="w-12 h-1 bg-[#52b1e7] mx-auto rounded-full" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8 items-stretch">
                  {groupedItems.Specials.map((item) => (
                    <MenuCard key={item.id} item={item} role={role} />
                  ))}
                </div>
              </div>
            )}

            {/* FALLBACK FOR OTHER UNMAPPED ITEMS */}
            {activeCategory === 'All' && groupedItems.Other.length > 0 && (
              <div ref={sectionRefs.Other} className="space-y-12 transition-all duration-500">
                <div className="text-center space-y-2">
                  <h2 className="text-4xl font-black uppercase tracking-wider text-slate-900">Other Delights</h2>
                  <div className="w-12 h-1 bg-[#52b1e7] mx-auto rounded-full" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8 items-stretch">
                  {groupedItems.Other.map((item) => (
                    <MenuCard key={item.id} item={item} role={role} />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}