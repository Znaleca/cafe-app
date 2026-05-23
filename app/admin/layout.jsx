'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiGrid, FiCoffee, FiBox, FiUsers, FiLogOut, FiShoppingBag, FiMonitor } from 'react-icons/fi';

import LoadingComponent from '@/components/Loading';

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    }
    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingComponent text="Loading Admin..." />
      </div>
    );
  }

  if (!user) return null;

  const navLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: FiGrid },
    { name: 'POS', href: '/admin/create-order', icon: FiMonitor },
    { name: 'Menu', href: '/admin/menu', icon: FiCoffee },
    { name: 'Inventory', href: '/admin/inventory', icon: FiBox },
    { name: 'Orders', href: '/admin/orders', icon: FiShoppingBag },
    { name: 'Accounts', href: '/admin/accounts', icon: FiUsers },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <style jsx global>{`
        @keyframes sparkle {
          0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.3) rotate(180deg); opacity: 0.9; }
        }
        .animate-sparkle-1 { animation: sparkle 3.2s infinite ease-in-out; }
        .animate-sparkle-2 { animation: sparkle 2.8s infinite ease-in-out 0.4s; }
      `}</style>

      {/* Sidebar Navigation */}
      <aside className="w-72 bg-[#52b1e7] border-r border-sky-400 flex flex-col fixed h-full z-10 overflow-hidden shadow-2xl">
        {/* Subtle Watermark */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-12 opacity-[0.03] text-white font-black uppercase tracking-tighter leading-none text-9xl transform -translate-x-1/3 rotate-90 origin-left select-none">
          <span>HER<span className="font-serif font-light lowercase italic tracking-normal">&</span>HER</span>
        </div>

        {/* Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute top-[10%] left-[80%] w-5 h-5 text-white fill-current animate-sparkle-1" viewBox="0 0 24 24">
            <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
          </svg>
          <svg className="absolute bottom-[20%] left-[10%] w-6 h-6 text-white fill-current opacity-75 animate-sparkle-2" viewBox="0 0 24 24">
            <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
          </svg>
        </div>

        <div className="p-8 relative z-10">
          <Link href="/" className="block">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
              Admin<br /><span className="font-serif font-light lowercase italic text-sky-100 tracking-normal text-4xl">panel.</span>
            </h2>
          </Link>
        </div>
        
        <nav className="flex-1 px-6 py-4 space-y-4 overflow-y-auto relative z-10">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`group relative flex items-center h-12 w-full transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                <div className={`absolute left-0 w-1 h-8 rounded-r-full bg-white transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 scale-y-0 group-hover:scale-y-50 group-hover:opacity-50'}`} />
                <div className="ml-6 flex items-center gap-4 w-full">
                  <link.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  
                  {/* Text Container with Typography Swap */}
                  <div className="relative flex-1 h-full flex items-center">
                    <span className={`absolute inset-0 flex items-center text-lg font-black uppercase tracking-tight transition-all duration-300 ${isActive ? 'opacity-0 scale-90' : 'group-hover:opacity-0 group-hover:scale-90'}`}>
                      {link.name}
                    </span>
                    <span className={`absolute inset-0 flex items-center text-2xl font-serif font-light italic lowercase tracking-normal whitespace-nowrap transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-110 group-hover:opacity-100 group-hover:scale-100'}`}>
                      {link.name}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 relative z-10">
          <button 
            onClick={handleSignOut}
            className="group flex items-center gap-4 w-full px-4 py-3 rounded-2xl font-black uppercase text-xs tracking-widest text-sky-100 hover:text-white bg-black/10 hover:bg-black/20 transition-all duration-300"
          >
            <FiLogOut className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-8 h-screen overflow-y-auto">
        <div className={pathname === '/admin/create-order' ? 'w-full h-full' : 'max-w-6xl mx-auto'}>
          {children}
        </div>
      </main>
    </div>
  );
}
