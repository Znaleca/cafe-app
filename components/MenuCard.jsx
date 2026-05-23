import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { FiPlus } from 'react-icons/fi';
import { getSupabaseImageUrl } from '@/utils/supabase/getSupabaseImageUrl';

export default function MenuCard({ item, role }) {
  const { addToCart } = useCart();
  const imageUrl = getSupabaseImageUrl(item.image_url);

  return (
    <div className="flex gap-4 sm:gap-6 items-start p-4 bg-white hover:bg-white/60 rounded-2xl border border-slate-100/50 hover:border-slate-200 transition-all duration-300 group">
      
      {/* Mini Profile Thumbnail Image */}
      <div className="relative h-20 w-20 sm:h-24 sm:w-24 bg-slate-100 rounded-xl shrink-0 overflow-hidden shadow-sm">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 80px, 96px"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-[9px] text-slate-400 font-black uppercase tracking-tighter">
            No Item Image
          </div>
        )}
      </div>

      {/* Structural Menu Details Column */}
      <div className="flex-grow min-w-0 self-center">
        
        {/* Title / Leader Line / Pricing Alignment Row */}
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate group-hover:text-[#52b1e7] transition-colors duration-300">
            {item.name}
          </h3>
          
          {/* Classic Café Leader Dot-Line Connector */}
          <div className="grow border-b border-dashed border-slate-200 mx-2 hidden sm:block" />
          
          <span className="text-base sm:text-lg font-black text-slate-900 shrink-0">
            ${Number(item.price).toFixed(2)}
          </span>
        </div>
        
        {/* Description line */}
        <p className="text-slate-500 text-xs sm:text-sm font-medium line-clamp-2 mt-1 pr-6 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Minimal Action Trigger Button */}
      {role !== 'admin' && (
        <div className="self-center shrink-0 pl-2">
          <button
            onClick={() => addToCart(item)}
            title="Add to Cart"
            className="p-2.5 sm:p-3 bg-slate-900 text-white rounded-xl hover:bg-[#52b1e7] shadow-sm transition-all duration-300 flex items-center justify-center transform active:scale-90"
          >
            <FiPlus className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      )}

    </div>
  );
}