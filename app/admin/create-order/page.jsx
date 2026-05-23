'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/utils/supabase/client';
import { FiPlus, FiMinus, FiTrash2, FiShoppingBag, FiCheckCircle, FiCoffee, FiPackage, FiDollarSign, FiSmartphone } from 'react-icons/fi';
import Image from 'next/image';
import { getSupabaseImageUrl } from '@/utils/supabase/getSupabaseImageUrl';
import LoadingComponent from '@/components/Loading';

export default function POSPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isFetching, setIsFetching] = useState(true);

  // POS Local Cart State
  const [cartItems, setCartItems] = useState([]);
  const [orderType, setOrderType] = useState('dine in');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    async function fetchMenuItems() {
      setIsFetching(true);
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .order('category', { ascending: true });

        if (error) throw error;
        setMenuItems(data || []);

        const uniqueCats = ['All', ...new Set((data || []).map((item) => item.category))];
        setCategories(uniqueCats);
      } catch (err) {
        console.error('Failed to fetch menu items:', err.message);
      } finally {
        setIsFetching(false);
      }
    }
    fetchMenuItems();
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return menuItems;
    return menuItems.filter((item) => item.category === activeCategory);
  }, [menuItems, activeCategory]);

  // Cart Functions
  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) => {
      return prev.map((i) => {
        if (i.id === id) {
          const newQ = i.quantity + delta;
          if (newQ < 1) return i; // Use remove instead
          return { ...i, quantity: newQ };
        }
        return i;
      });
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not logged in');

      const itemsForDb = cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
      }));

      const { error } = await supabase.from('orders').insert({
        user_id: session.user.id,
        total_amount: cartTotal,
        items: itemsForDb,
        status: 'order placed',
        order_type: orderType,
        payment_method: paymentMethod,
      });

      if (error) throw error;

      setCartItems([]);
      setSuccessMessage('Order Placed Successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert(`Error creating order: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full gap-6 select-none pb-6">
      {/* Left Area: Menu Grid */}
      <div className="flex-1 flex flex-col min-w-0 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Header & Categories */}
        <div className="bg-[#52b1e7] px-6 py-5 relative overflow-hidden">
          {/* Sparkle */}
          <svg className="absolute top-3 right-10 w-4 h-4 text-white fill-current opacity-60 animate-[sparkle_3s_infinite_ease-in-out]" viewBox="0 0 24 24">
            <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
          </svg>
          <h1 className="text-xs font-bold tracking-[0.3em] uppercase text-white/70 mb-1">Admin</h1>
          <p className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
            Point of <span className="font-serif font-light lowercase italic tracking-normal text-sky-100">sale.</span>
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 mt-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-white text-sky-600 shadow-sm'
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
          {isFetching ? (
            <div className="h-full flex items-center justify-center">
              <LoadingComponent text="Loading Menu..." />
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="flex flex-col bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:shadow-md hover:border-sky-200 transition-all text-left group active:scale-95"
                >
                  <div className="w-full aspect-square relative rounded-xl overflow-hidden bg-slate-100 mb-3">
                    <Image
                      src={getSupabaseImageUrl(item.image_url)}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                      priority
                    />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1 truncate w-full">{item.name}</h3>
                  <p className="text-sky-600 font-black text-sm mt-auto">${Number(item.price).toFixed(2)}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Area: Cart / Receipt */}
      <div className="w-96 flex flex-col bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm shrink-0">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <FiShoppingBag className="text-sky-500" />
            Current Order
          </h2>
          <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-lg text-xs font-bold">
            {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items
          </span>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3 opacity-50">
              <FiShoppingBag className="w-12 h-12" />
              <p className="font-bold">Order is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex flex-col bg-slate-50 rounded-2xl p-3 border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-slate-700 text-sm">{item.name}</span>
                  <span className="font-black text-slate-800 text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 p-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 rounded bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <FiMinus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 rounded bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                    >
                      <FiPlus className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">

          {/* Order Type */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Order Type</p>
            <div className="grid grid-cols-2 gap-2">
              {[['dine in', FiCoffee], ['takeout', FiPackage]].map(([type, Icon]) => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                    orderType === type ? 'bg-sky-500 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-sky-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />{type}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Payment</p>
            <div className="grid grid-cols-2 gap-2">
              {[['cash', FiDollarSign], ['online payment', FiSmartphone]].map(([method, Icon]) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                    paymentMethod === method ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />{method}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-lg pt-1">
            <span className="font-bold text-slate-500">Total</span>
            <span className="text-2xl font-black text-sky-600">${cartTotal.toFixed(2)}</span>
          </div>

          {successMessage ? (
            <div className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black flex items-center justify-center gap-2">
              <FiCheckCircle className="w-5 h-5" />
              {successMessage}
            </div>
          ) : (
            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0 || isSubmitting}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-sky-500 transition-all disabled:opacity-50 disabled:hover:bg-slate-900 flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing...</>
              ) : (
                'Place Order'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
