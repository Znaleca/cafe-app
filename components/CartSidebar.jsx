'use client';

import { useCart } from '@/context/CartContext';
import { FiX, FiPlus, FiMinus, FiShoppingCart } from 'react-icons/fi';
import Image from 'next/image';
import { getSupabaseImageUrl } from '@/utils/supabase/getSupabaseImageUrl';

export default function CartSidebar() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    clearCart,
  } = useCart();

  const handleCheckout = () => {
    alert('Checkout successful! Enjoy your order.');
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full md:w-96 bg-white/90 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-sky-600 flex items-center gap-2">
            <FiShoppingCart /> Your Cart
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-slate-400 hover:text-sky-500 transition-colors p-2 rounded-full hover:bg-sky-50"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
              <FiShoppingCart className="w-16 h-16 opacity-20" />
              <p className="text-lg">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 items-center bg-white p-3 rounded-xl shadow-sm border border-slate-50">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-sky-50">
                  {getSupabaseImageUrl(item.image_url) && (
                    <Image
                      src={getSupabaseImageUrl(item.image_url)}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate">{item.name}</h3>
                  <p className="text-sky-600 font-medium">${Number(item.price).toFixed(2)}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 bg-slate-50 rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-slate-500 hover:text-sky-500 p-1"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold text-sm w-4 text-center text-slate-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-slate-500 hover:text-sky-500 p-1"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-400 hover:text-red-500 font-medium px-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 bg-slate-50 border-t border-slate-100">
            <div className="flex justify-between items-center mb-4 text-lg">
              <span className="font-medium text-slate-600">Total</span>
              <span className="font-bold text-sky-600">${cartTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-sky-200"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
