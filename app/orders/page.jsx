'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiArrowLeft,
  FiRefreshCw,
  FiChevronDown,
  FiShoppingBag,
  FiXCircle,
  FiStar,
  FiCoffee,
  FiDollarSign,
  FiSmartphone,
  FiImage,
  FiTruck,
} from 'react-icons/fi';
import { supabase } from '@/utils/supabase/client';
import LoadingComponent from '@/components/Loading';

const STATUS_META = {
  pending: {
    label: 'Pending',
    desc: 'Waiting for cafe to confirm your order.',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-400',
    icon: FiClock,
  },
  'order placed': {
    label: 'Order Confirmed',
    desc: 'Your order has been confirmed by the cafe!',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    dot: 'bg-sky-500',
    icon: FiCheckCircle,
  },
  preparing: {
    label: 'Preparing',
    desc: 'Your order is being prepared.',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    dot: 'bg-violet-500',
    icon: FiPackage,
  },
  ready: {
    label: 'Ready for Pickup',
    desc: 'Your order is ready! Please come and collect it.',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    icon: FiCheckCircle,
  },
  completed: {
    label: 'Completed',
    desc: 'Order completed. Thank you!',
    bg: 'bg-slate-100',
    text: 'text-slate-500',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
    icon: FiCheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    desc: 'This order was cancelled.',
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-200',
    dot: 'bg-rose-400',
    icon: FiXCircle,
  },
};

const STATUS_STEPS = ['pending', 'order placed', 'preparing', 'ready', 'completed'];

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META['pending'];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${meta.bg} ${meta.text} ${meta.border}`}>
      <Icon className="w-3.5 h-3.5" />
      {meta.label}
    </span>
  );
}

function ProgressBar({ status }) {
  if (status === 'cancelled') return null;
  const currentIdx = STATUS_STEPS.indexOf(status);

  return (
    <div className="mt-4">
      <div className="flex items-center gap-0">
        {STATUS_STEPS.map((step, idx) => {
          const isCompleted = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                isCompleted
                  ? 'bg-sky-500 shadow-md shadow-sky-200'
                  : 'bg-slate-100 border-2 border-slate-200'
              }`}>
                {isCompleted && (
                  <div className={`w-2 h-2 rounded-full bg-white ${isCurrent ? 'animate-pulse' : ''}`} />
                )}
              </div>
              {idx < STATUS_STEPS.length - 1 && (
                <div className={`h-1 flex-1 transition-all duration-700 ${idx < currentIdx ? 'bg-sky-400' : 'bg-slate-100'}`} />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2">
        {STATUS_STEPS.map((step) => (
          <p key={step} className="text-[10px] text-slate-400 font-semibold text-center" style={{ flex: '1', minWidth: 0 }}>
            {STATUS_META[step]?.label}
          </p>
        ))}
      </div>
    </div>
  );
}

function ReviewForm({ order, onReviewSubmitted }) {
  const [shopRating, setShopRating] = useState(0);
  const [shopHover, setShopHover] = useState(0);
  const [shopComment, setShopComment] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (shopRating === 0) {
      alert('Please rate the cafe before submitting!');
      return;
    }
    setIsSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not logged in');
      
      const reviewsToInsert = [];
      // Shop review
      reviewsToInsert.push({
        order_id: order.id,
        user_id: session.user.id,
        target_type: 'shop',
        target_id: 'cafe',
        rating: shopRating,
        comment: shopComment.trim() || null
      });
      

      
      const { error: insertError } = await supabase.from('reviews').insert(reviewsToInsert);
      if (insertError) throw insertError;
      
      const { error: updateError } = await supabase.from('orders').update({ is_reviewed: true }).eq('id', order.id);
      if (updateError) throw updateError;
      
      onReviewSubmitted(order.id);
    } catch (err) {
      alert(`Error submitting review: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
      <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
        <FiStar className="text-sky-500 w-5 h-5 fill-current" />
        Rate Your Experience
      </h3>

      {/* Shop Rating */}
      <div className="mb-6 bg-white p-4 rounded-xl border border-slate-100">
        <p className="font-bold text-slate-700 text-sm mb-2">How was Her&Her Cafe?</p>
        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setShopRating(star)}
              onMouseEnter={() => setShopHover(star)}
              onMouseLeave={() => setShopHover(0)}
              className={`p-1 transition-colors ${
                star <= (shopHover || shopRating) ? 'text-sky-500' : 'text-slate-200'
              }`}
            >
              <FiStar className="w-6 h-6 fill-current" />
            </button>
          ))}
        </div>
        <textarea
          value={shopComment}
          onChange={(e) => setShopComment(e.target.value)}
          placeholder="What did you love? (Optional)"
          rows="2"
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent resize-none"
        ></textarea>
      </div>



      <button
        type="submit"
        disabled={isSubmitting || shopRating === 0}
        className="w-full py-3 bg-sky-500 text-white rounded-xl font-bold text-sm hover:bg-sky-400 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
      >
        {isSubmitting ? (
          <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Submitting...</>
        ) : (
          'Submit Review'
        )}
      </button>
    </form>
  );
}

function OrderCard({ order, onReviewSubmitted }) {
  const [expanded, setExpanded] = useState(false);
  const meta = STATUS_META[order.status] || STATUS_META['pending'];

  const date = new Date(order.created_at);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`bg-white border-2 rounded-3xl overflow-hidden transition-all duration-200 hover:shadow-md ${
      order.status === 'ready' ? 'border-emerald-200 shadow-emerald-100 shadow-md' :
      order.status === 'pending' ? 'border-amber-100' : 'border-slate-100'
    }`}>
      {/* Ready banner */}
      {order.status === 'ready' && (
        <div className="bg-emerald-500 text-white text-center py-2 px-4 text-xs font-black uppercase tracking-widest animate-pulse">
          🎉 Your order is ready for pickup!
        </div>
      )}

      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${meta.bg}`}>
            <FiPackage className={`w-5 h-5 ${meta.text}`} />
          </div>
          <div>
            <p className="font-black text-slate-800 text-sm">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {formattedDate} · {formattedTime}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
          <StatusBadge status={order.status} />
          <span className="font-black text-sky-600 text-sm">${Number(order.total_amount).toFixed(2)}</span>
          <FiChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-slate-100 p-5">
          {/* Status message */}
          <div className={`flex items-start gap-3 p-3 rounded-2xl mb-5 border ${meta.bg} ${meta.border}`}>
            <meta.icon className={`w-4 h-4 mt-0.5 shrink-0 ${meta.text}`} />
            <p className={`text-sm font-semibold ${meta.text}`}>{meta.desc}</p>
          </div>

          {/* Progress tracker */}
          {order.status !== 'cancelled' && (
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3">Order Progress</p>
              <ProgressBar status={order.status} />
            </div>
          )}

          {/* Order Meta Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {order.order_type && (() => {
              const typeMap = {
                'dine in':  { icon: FiCoffee,      bg: 'bg-sky-50',    text: 'text-sky-700',    border: 'border-sky-200',    label: 'Dine In' },
                'takeout':  { icon: FiPackage,     bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  label: 'Takeout' },
                'pick up':  { icon: FiShoppingBag, bg: 'bg-sky-50',    text: 'text-sky-700',    border: 'border-sky-200',    label: 'Pick Up' },
                'delivery': { icon: FiTruck,       bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', label: 'Delivery' },
              };
              const t = typeMap[order.order_type] || typeMap['pick up'];
              const Icon = t.icon;
              return (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${t.bg} ${t.text} ${t.border}`}>
                  <Icon className="w-3 h-3" />{t.label}
                </span>
              );
            })()}
            {order.payment_method && (() => {
              const payMap = {
                'cash':           { icon: FiDollarSign,  bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Cash' },
                'online payment': { icon: FiSmartphone,  bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200',  label: 'Online Payment' },
                'cod':            { icon: FiShoppingBag, bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   label: 'COD' },
              };
              const p = payMap[order.payment_method] || payMap['cash'];
              const Icon = p.icon;
              return (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${p.bg} ${p.text} ${p.border}`}>
                  <Icon className="w-3 h-3" />{p.label}
                </span>
              );
            })()}
          </div>

          {/* Items */}
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3">Items Ordered</p>
          <div className="space-y-2 mb-4">
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm bg-slate-50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 text-xs font-black flex items-center justify-center shrink-0">
                    {item.quantity}
                  </span>
                  <div>
                    <p className="font-bold text-slate-700">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.category}</p>
                  </div>
                </div>
                <span className="font-bold text-slate-600">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-3 border-t border-slate-100 mb-6">
            <span className="font-bold text-slate-500 text-sm">Total</span>
            <span className="font-black text-sky-600">${Number(order.total_amount).toFixed(2)}</span>
          </div>

          {/* Review Section */}
          {order.status === 'completed' && !order.is_reviewed && (
            <div className="mt-2 border-t border-slate-100 pt-6">
              <ReviewForm order={order} onReviewSubmitted={onReviewSubmitted} />
            </div>
          )}
          {order.status === 'completed' && order.is_reviewed && (
            <div className="mt-2 border-t border-slate-100 pt-6">
              <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-emerald-100">
                <FiStar className="w-5 h-5 fill-current" />
                Thanks for your review!
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const router = useRouter();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
      return session.user.id;
    } catch (err) {
      console.error('Failed to fetch orders:', err.message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    let channel;

    async function init() {
      const userId = await fetchOrders();
      if (!userId) return;

      // Subscribe to realtime changes for this user's orders
      channel = supabase
        .channel('my-orders-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setOrders((prev) => [payload.new, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setOrders((prev) =>
                prev.map((o) => (o.id === payload.new.id ? { ...o, ...payload.new } : o))
              );
            } else if (payload.eventType === 'DELETE') {
              setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
            }
          }
        )
        .subscribe();
    }

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  const handleReviewSubmitted = useCallback((orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, is_reviewed: true } : o));
  }, []);

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'order placed', label: 'Confirmed' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const filtered = filterStatus === 'all'
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  const activeCount = orders.filter((o) => ['pending', 'order placed', 'preparing', 'ready'].includes(o.status)).length;

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-[#e0f2fe] border-b-2 border-sky-100">
        <div className="max-w-3xl mx-auto px-4 py-16 md:py-20">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-slate-700 font-bold uppercase tracking-widest text-sm hover:text-sky-600 transition-colors mb-6"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to menu
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-sky-600">
                <FiShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <p className="uppercase tracking-widest text-sky-600 font-bold text-sm">Track your orders</p>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                  My Orders
                </h1>
              </div>
            </div>
            <button
              onClick={fetchOrders}
              className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 border border-sky-200 text-sky-600 font-bold text-sm hover:bg-white transition-all"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {activeCount > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-amber-200 text-amber-700 text-sm font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              {activeCount} active order{activeCount > 1 ? 's' : ''} in progress
            </div>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                filterStatus === tab.key
                  ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-sky-200 hover:text-sky-600'
              }`}
            >
              {tab.label}
              {tab.key !== 'all' && (
                <span className="ml-1.5 opacity-60">
                  {orders.filter((o) => o.status === tab.key).length || ''}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {loading ? (
          <LoadingComponent text="Loading your orders..." />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 border border-slate-100 rounded-3xl">
            <FiShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-400">
              {orders.length === 0 ? "You haven't placed any orders yet." : 'No orders match this filter.'}
            </p>
            {orders.length === 0 && (
              <Link
                href="/menu"
                className="inline-flex mt-5 px-6 py-3 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors"
              >
                Browse Menu
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} onReviewSubmitted={handleReviewSubmitted} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
