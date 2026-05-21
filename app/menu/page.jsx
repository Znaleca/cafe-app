'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import MenuCard from '@/components/MenuCard';

const CATEGORIES = ['All', 'Coffee', 'Tea', 'Pastry'];

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    async function fetchMenu() {
      try {
        const { data, error } = await supabase.from('menu_items').select('*');
        if (error) throw error;
        setMenuItems(data || []);
      } catch (err) {
        console.error('Error fetching menu:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const filtered = activeCategory === 'All'
    ? menuItems
    : menuItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-[#e0f2fe] py-24 px-4 text-center border-b-2 border-sky-100">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="uppercase tracking-widest font-bold text-sky-600 text-sm">Fresh &amp; Handcrafted</span>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Our Menu
          </h1>
          <div className="w-16 h-1.5 bg-sky-600 mx-auto mt-8 mb-6" />
          <p className="text-xl md:text-2xl text-slate-700 font-medium max-w-2xl mx-auto">
            Every item is made with love, using only the finest ingredients to bring you a taste of the sky.
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="sticky top-24 z-30 py-6 px-4 bg-white/95 backdrop-blur-sm border-b-2 border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 md:gap-4 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-200 border-2 ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-900 border-slate-200 hover:border-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-32 pt-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="border-2 border-slate-100 overflow-hidden animate-pulse flex flex-col h-[450px]">
                <div className="h-56 bg-slate-100 shrink-0" />
                <div className="p-6 space-y-4 flex-grow">
                  <div className="h-6 bg-slate-100 w-3/4" />
                  <div className="h-4 bg-slate-100 w-1/4" />
                  <div className="h-4 bg-slate-100 w-full" />
                  <div className="h-4 bg-slate-100 w-5/6" />
                  <div className="h-12 bg-slate-100 w-full mt-auto rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-2xl font-black text-slate-400 uppercase tracking-widest">No items in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((item, index) => (
              <MenuCard key={item.id} item={item} priority={index < 4} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
