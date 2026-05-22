'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiMinus, FiPlus, FiShoppingCart, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { getSupabaseImageUrl } from '@/utils/supabase/getSupabaseImageUrl';

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartTotal,
    clearCart,
  } = useCart();

  const handleCheckout = () => {
    alert('Checkout successful! Enjoy your order.');
    clearCart();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#e0f2fe] border-b-2 border-sky-100">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-slate-700 font-bold uppercase tracking-widest text-sm hover:text-sky-600 transition-colors mb-6"
          >
            <FiArrowLeft className="w-4 h-4" />
            Continue shopping
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-sky-600">
              <FiShoppingCart className="w-7 h-7" />
            </div>
            <div>
              <p className="uppercase tracking-widest text-sky-600 font-bold text-sm">Your cart</p>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                Checkout
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        {cartItems.length === 0 ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center bg-slate-50 border border-slate-100 rounded-3xl p-10">
            <FiShoppingCart className="w-16 h-16 text-sky-300 mb-6" />
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-3">Your cart is empty</h2>
            <p className="text-slate-600 max-w-md mb-8">
              Add a few menu items and they will show up here for review before checkout.
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-slate-900 text-white font-bold uppercase tracking-wide hover:bg-slate-800 transition-colors"
            >
              Browse menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
            <div className="space-y-4">
              {cartItems.map((item) => {
                const imageUrl = getSupabaseImageUrl(item.image_url);

                return (
                  <div key={item.id} className="bg-white border-2 border-slate-100 rounded-3xl p-4 md:p-5 flex flex-col sm:flex-row gap-4 shadow-sm">
                    <div className="relative w-full sm:w-36 h-44 sm:h-36 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 144px"
                        />
                      ) : null}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-widest text-sky-600 font-bold mb-2">{item.category}</p>
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">{item.name}</h2>
                          </div>
                          <p className="text-xl font-black text-sky-600 whitespace-nowrap">${Number(item.price).toFixed(2)}</p>
                        </div>
                        <p className="text-slate-600 mt-3 leading-relaxed">{item.description}</p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 bg-slate-50 rounded-full px-3 py-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-slate-500 hover:text-sky-600 p-1"
                            aria-label={`Decrease ${item.name}`}
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-sm w-6 text-center text-slate-700">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-slate-500 hover:text-sky-600 p-1"
                            aria-label={`Increase ${item.name}`}
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="inline-flex items-center gap-2 text-sm font-bold text-rose-500 hover:text-rose-600"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="lg:sticky lg:top-28 bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-2xl shadow-slate-200">
              <p className="uppercase tracking-widest text-sky-300 font-bold text-sm mb-2">Order summary</p>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Ready to pay</h2>

              <div className="space-y-4 text-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Items</span>
                  <span className="font-bold">{cartItems.length}</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="text-slate-300">Total</span>
                  <span className="font-black text-sky-300">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-full bg-sky-500 text-white font-bold uppercase tracking-wide hover:bg-sky-400 transition-colors"
                >
                  Checkout
                </button>
                <Link
                  href="/menu"
                  className="block text-center w-full py-4 rounded-full border-2 border-white/20 text-white font-bold uppercase tracking-wide hover:bg-white hover:text-slate-900 transition-colors"
                >
                  Add more items
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}