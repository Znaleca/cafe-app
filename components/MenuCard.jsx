import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { FiPlus } from 'react-icons/fi';

export default function MenuCard({ item, priority = false }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white border-2 border-slate-100 overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative h-56 w-full bg-sky-50 shrink-0 overflow-hidden">
        {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
            />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sky-300 font-bold uppercase tracking-widest text-xs">
            No Image
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-black text-slate-900 leading-tight pr-4">{item.name}</h3>
          <span className="text-lg font-black text-sky-600">
            ${Number(item.price).toFixed(2)}
          </span>
        </div>
        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">{item.category}</p>
        <p className="text-slate-600 line-clamp-2 flex-grow font-medium leading-relaxed">{item.description}</p>
        
        <button
          onClick={() => addToCart(item)}
          className="mt-8 w-full py-3.5 bg-white border-2 border-slate-900 text-slate-900 rounded-full font-bold uppercase tracking-wide hover:bg-slate-900 hover:text-white transition-colors flex items-center justify-center gap-2 active:scale-95"
        >
          <FiPlus className="w-5 h-5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
