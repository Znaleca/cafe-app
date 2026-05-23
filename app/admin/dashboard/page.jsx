'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { FiCoffee, FiUsers, FiShoppingBag, FiActivity } from 'react-icons/fi';
import LoadingComponent from '@/components/Loading';

export default function DashboardPage() {
  const [stats, setStats] = useState({ menuItems: 0, accounts: 0, pendingOrders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const { count: menuCount } = await supabase.from('menu_items').select('*', { count: 'exact', head: true });
      const { count: accountsCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      
      const { data: ordersData } = await supabase.from('orders').select('status, total_amount');
      
      let pendingCount = 0;
      let totalRev = 0;
      if (ordersData) {
        ordersData.forEach(o => {
          if (o.status === 'pending') pendingCount++;
          if (o.status === 'completed' || o.status === 'ready' || o.status === 'preparing') {
             totalRev += Number(o.total_amount || 0);
          }
        });
      }

      setStats({
        menuItems: menuCount || 0,
        accounts: accountsCount || 0,
        pendingOrders: pendingCount,
        revenue: totalRev,
      });
      setLoading(false);
    }
    fetchStats();

    // Setup realtime subscriptions to automatically update stats
    const channels = [
      supabase.channel('dash-orders').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchStats).subscribe(),
      supabase.channel('dash-menu').on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, fetchStats).subscribe(),
      supabase.channel('dash-profiles').on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchStats).subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <LoadingComponent text="Loading Stats..." />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <style jsx global>{`
        @keyframes dashboardSparkle {
          0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1) rotate(180deg); opacity: 0.8; }
        }
        .animate-dash-sparkle { animation: dashboardSparkle 4s infinite ease-in-out; }
      `}</style>

      {/* Hero Header */}
      <div className="bg-[#52b1e7] rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden mb-12 shadow-xl shadow-sky-900/5">
        
        {/* Abstract Background Element */}
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl pointer-events-none" />
        
        <svg className="absolute top-[20%] right-[15%] w-8 h-8 text-white fill-current animate-dash-sparkle pointer-events-none" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>

        <div className="relative z-10">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-white/70 block mb-4">
            System Overview
          </span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase mb-4 leading-none">
            Welcome back, <br/>
            <span className="font-serif font-light lowercase italic tracking-normal text-sky-100">Admin</span>.
          </h1>
          <p className="text-xl md:text-2xl font-light text-sky-50 opacity-90 tracking-wide max-w-2xl">
            Here is a quick glance at your cafe&apos;s performance today.
          </p>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Revenue */}
        <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-8 relative overflow-hidden group hover:border-emerald-200 transition-colors shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <FiActivity className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Revenue</h3>
          <p className="text-4xl font-black text-slate-800 tracking-tight">${stats.revenue.toFixed(2)}</p>
        </div>

        {/* Pending Orders */}
        <div className={`bg-white border-2 rounded-[2rem] p-8 relative overflow-hidden group transition-colors shadow-sm ${stats.pendingOrders > 0 ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100 hover:border-sky-200'}`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${stats.pendingOrders > 0 ? 'bg-amber-100 text-amber-600' : 'bg-sky-50 text-sky-500'}`}>
            <FiShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Pending Orders</h3>
          <p className={`text-4xl font-black tracking-tight ${stats.pendingOrders > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
            {stats.pendingOrders}
          </p>
          {stats.pendingOrders > 0 && (
             <span className="absolute top-8 right-8 flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
             </span>
          )}
        </div>

        {/* Menu Items */}
        <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-8 relative overflow-hidden group hover:border-sky-200 transition-colors shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <FiCoffee className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Menu Items</h3>
          <p className="text-4xl font-black text-slate-800 tracking-tight">{stats.menuItems}</p>
        </div>

        {/* Total Accounts */}
        <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-8 relative overflow-hidden group hover:border-violet-200 transition-colors shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <FiUsers className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">User Accounts</h3>
          <p className="text-4xl font-black text-slate-800 tracking-tight">{stats.accounts}</p>
        </div>

      </div>
    </div>
  );
}
