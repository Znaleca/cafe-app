'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/utils/supabase/client';
import {
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiRefreshCw,
  FiChevronDown,
  FiSearch,
  FiX,
  FiUser,
  FiCoffee,
  FiDollarSign,
  FiSmartphone,
  FiImage,
  FiTruck,
  FiShoppingBag,
  FiUpload,
} from 'react-icons/fi';
import MapViewer from '@/components/MapViewer';

import LoadingComponent from '@/components/Loading';

const STATUS_FLOW = ['pending', 'order placed', 'preparing', 'ready', 'completed'];

const STATUS_META = {
  pending: {
    label: 'Pending',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-400',
  },
  'order placed': {
    label: 'Order Placed',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    dot: 'bg-sky-500',
  },
  preparing: {
    label: 'Preparing',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    dot: 'bg-violet-500',
  },
  ready: {
    label: 'Ready',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-slate-100',
    text: 'text-slate-500',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-200',
    dot: 'bg-rose-400',
  },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META['pending'];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${meta.bg} ${meta.text} ${meta.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

function ProofImage({ path }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    async function fetchUrl() {
      const { data } = await supabase.storage
        .from('payment-proofs')
        .createSignedUrl(path, 60 * 10); // valid for 10 mins
      if (data) setUrl(data.signedUrl);
    }
    fetchUrl();
  }, [path]);

  if (!url) return <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden border border-slate-200 hover:border-sky-300 transition-colors max-w-xs">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="Payment proof" className="w-full object-cover max-h-48" />
      <p className="text-xs text-center py-1.5 text-sky-600 font-bold bg-sky-50">Click to view full image</p>
    </a>
  );
}

function OrderRow({ order, onStatusChange, updatingId, onProofUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const date = new Date(order.created_at);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const currentIdx = STATUS_FLOW.indexOf(order.status);
  const nextStatus = STATUS_FLOW[currentIdx + 1] || null;
  const isUpdating = updatingId === order.id;

  const handleProofUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `admin/${order.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('orders')
        .update({ payment_proof_url: filePath })
        .eq('id', order.id);

      if (updateError) throw updateError;
      
      if (onProofUpdate) {
        onProofUpdate(order.id, filePath);
      }
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-sky-100">
      {/* ORDER HEADER */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
            <FiPackage className="w-5 h-5 text-sky-500" />
          </div>
          <div>
            <p className="font-black text-slate-800 text-sm">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </p>
            <div className="flex items-center gap-3 mt-0.5">
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <FiClock className="w-3 h-3" />
                {formattedDate} · {formattedTime}
              </p>
              {order.nickname && (
                <p className="text-xs font-bold text-sky-600 flex items-center gap-1">
                  <FiUser className="w-3 h-3" />
                  {order.nickname}
                </p>
              )}
              {!order.nickname && (
                <p className="text-xs text-slate-300 flex items-center gap-1">
                  <FiUser className="w-3 h-3" />
                  Guest
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
          <StatusBadge status={order.status} />
          <span className="font-black text-sky-600 text-sm">${Number(order.total_amount).toFixed(2)}</span>
          <FiChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* EXPANDED DETAILS */}
      {expanded && (
        <div className="border-t border-slate-100 p-5">
          {/* Items list */}
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3">Items</p>
          <div className="space-y-2 mb-6">
            {(order.items || []).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-sm bg-slate-50 rounded-xl px-4 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-600 text-xs font-black flex items-center justify-center">
                    {item.quantity}
                  </span>
                  <span className="font-semibold text-slate-700">{item.name}</span>
                  <span className="text-slate-400 text-xs">{item.category}</span>
                </div>
                <span className="font-bold text-slate-600">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Order Type / Payment Meta */}
          <div className="flex flex-wrap gap-2 mb-4">
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
                'cash':           { icon: FiDollarSign, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Cash' },
                'online payment': { icon: FiSmartphone, bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200',  label: 'Online Payment' },
                'cod':            { icon: FiShoppingBag, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'COD' },
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

          {/* Map Viewer (If Delivery & Has Coordinates) */}
          {order.order_type === 'delivery' && order.delivery_lat && order.delivery_lng && (
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3">Delivery Location</p>
              <MapViewer lat={order.delivery_lat} lng={order.delivery_lng} address={order.delivery_address} />
            </div>
          )}

          {/* Payment Proof */}
          {order.payment_method !== 'cash' && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1">
                  <FiImage className="w-3 h-3" /> Payment Proof
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  {isUploading ? (
                    <><span className="w-3 h-3 border-2 border-sky-600/40 border-t-sky-600 rounded-full animate-spin" /> Uploading...</>
                  ) : (
                    <><FiUpload className="w-3 h-3" /> {order.payment_proof_url ? 'Replace Image' : 'Upload Image'}</>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProofUpload}
                  className="hidden"
                />
              </div>
              {order.payment_proof_url ? (
                <ProofImage path={order.payment_proof_url} />
              ) : (
                <div className="bg-slate-50 border border-slate-100 border-dashed rounded-xl p-4 text-center text-sm text-slate-400">
                  No proof uploaded yet.
                </div>
              )}
            </div>
          )}

          {/* Order ID */}
          <p className="text-xs text-slate-400 font-mono mb-4 break-all">
            Full ID: {order.id}
          </p>

          {/* Action buttons */}
          {order.status !== 'completed' && order.status !== 'cancelled' && (
            <div className="flex flex-wrap gap-3">
              {/* Confirm / advance button */}
              {nextStatus && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(order.id, nextStatus);
                  }}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold transition-all disabled:opacity-60"
                >
                  {isUpdating ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FiCheckCircle className="w-4 h-4" />
                  )}
                  {order.status === 'pending'
                    ? 'Confirm Order'
                    : `Mark as ${STATUS_META[nextStatus]?.label}`}
                </button>
              )}

              {/* Cancel button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Cancel this order?')) onStatusChange(order.id, 'cancelled');
                }}
                disabled={isUpdating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 text-sm font-bold transition-all disabled:opacity-60"
              >
                <FiX className="w-4 h-4" />
                Cancel Order
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;

      // Fetch nicknames for all unique user_ids
      const userIds = [...new Set((ordersData || []).map((o) => o.user_id).filter(Boolean))];
      let nicknameMap = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, nickname')
          .in('id', userIds);
        (profiles || []).forEach((p) => {
          nicknameMap[p.id] = p.nickname || null;
        });
      }

      // Merge nickname into each order
      const merged = (ordersData || []).map((o) => ({
        ...o,
        nickname: nicknameMap[o.user_id] || null,
      }));

      setOrders(merged);
    } catch (err) {
      console.error('Failed to fetch orders:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    // Subscribe to ALL order changes in realtime
    const channel = supabase
      .channel('admin-orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            // Fetch nickname for new order's user
            let nickname = null;
            if (payload.new.user_id) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('nickname')
                .eq('id', payload.new.user_id)
                .single();
              nickname = profile?.nickname || null;
            }
            setOrders((prev) => [{ ...payload.new, nickname }, ...prev]);
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      if (error) throw error;
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert(`Failed to update: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleProofUpdate = (orderId, newPath) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, payment_proof_url: newPath } : o))
    );
  };

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    active: orders.filter((o) => ['order placed', 'preparing', 'ready'].includes(o.status)).length,
    completed: orders.filter((o) => o.status === 'completed').length,
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !searchQuery ||
      o.id.toLowerCase().includes(q) ||
      (o.nickname || '').toLowerCase().includes(q) ||
      (o.items || []).some((item) =>
        item.name.toLowerCase().includes(q)
      );
    return matchStatus && matchSearch;
  });

  return (
    <div>
      {/* Hero Header */}
      <div className="bg-[#52b1e7] rounded-[2.5rem] p-10 text-white relative overflow-hidden mb-8 shadow-xl shadow-sky-900/5">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none" />
        <svg className="absolute top-[20%] right-[12%] w-6 h-6 text-white fill-current animate-[sparkle_3.2s_infinite_ease-in-out] pointer-events-none" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        <div className="relative z-10 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-white/70 block mb-3">Admin Panel</span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2 leading-none">
              Order <span className="font-serif font-light lowercase italic tracking-normal text-sky-100">management.</span>
            </h1>
            <p className="text-base font-light text-sky-50/90 tracking-wide">Review and confirm customer orders.</p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm transition-all border border-white/30 shrink-0"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: stats.total, color: 'text-slate-700' },
          { label: 'Pending', value: stats.pending, color: 'text-amber-500' },
          { label: 'Active', value: stats.active, color: 'text-sky-500' },
          { label: 'Completed', value: stats.completed, color: 'text-emerald-500' },
        ].map((stat) => (
          <div key={stat.label} className="glass-panel p-5 rounded-2xl">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order ID, nickname or item…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex flex-wrap gap-2">
          {['all', ...STATUS_FLOW, 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                filterStatus === s
                  ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-sky-200 hover:text-sky-600'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_META[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <LoadingComponent text="Loading orders..." />
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 border border-slate-100 rounded-3xl">
          <FiPackage className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-400">No orders found</p>
          <p className="text-sm text-slate-400 mt-1">
            {filterStatus !== 'all' ? 'Try a different filter.' : 'Orders will appear here once customers check out.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              updatingId={updatingId}
              onProofUpdate={handleProofUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
