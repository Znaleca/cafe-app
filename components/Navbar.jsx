'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BiCoffeeTogo } from 'react-icons/bi';
import { FiMenu, FiX, FiShoppingCart } from 'react-icons/fi';
import { supabase } from '@/utils/supabase/client';
import { signOut } from '@/actions/signOut';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const { cartItemCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        setRole(data?.role || 'customer');
      }
    };
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        setRole(data?.role || 'customer');
      } else {
        setRole(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
  ];

  if (user && role === 'admin') {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b-2 border-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-slate-900 font-black text-2xl tracking-tighter hover:text-sky-600 transition-colors uppercase"
            onClick={() => setIsOpen(false)}
          >
            <BiCoffeeTogo className="w-8 h-8 text-sky-600" />
            <span>Her&Her</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <div className="flex space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    className={`text-sm font-bold uppercase tracking-widest transition-colors duration-200 ${
                      isActive ? 'text-sky-600' : 'text-slate-900 hover:text-sky-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="flex items-center space-x-4 border-l-2 border-slate-100 pl-8">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-slate-900 hover:text-sky-600 transition-colors mr-2"
                aria-label="Open cart"
              >
                <FiShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-sky-600 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {!user ? (
                <>
                  <Link
                    href="/login"
                    className="px-6 py-2.5 rounded-full text-slate-900 font-bold border-2 border-transparent hover:bg-slate-100 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-bold border-2 border-slate-900 hover:bg-slate-800 hover:border-slate-800 transition-colors"
                  >
                    Join Now
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleSignOut}
                  className="px-6 py-2.5 rounded-full bg-slate-100 text-slate-900 font-bold border-2 border-slate-100 hover:bg-slate-200 hover:border-slate-200 transition-colors"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-900 hover:text-sky-600 transition-colors"
              aria-label="Open cart"
            >
              <FiShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-sky-600 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              onClick={toggleMenu}
              className="text-slate-900 hover:text-sky-600 focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX className="w-7 h-7" /> : <FiMenu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden absolute top-[96px] left-0 w-full bg-white border-b-2 border-slate-100 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100 py-6' : 'max-h-0 opacity-0 py-0'
        }`}
      >
        <div className="px-6 flex flex-col space-y-6">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-black uppercase tracking-widest transition-colors ${
                    isActive 
                      ? 'text-sky-600' 
                      : 'text-slate-900 hover:text-sky-600'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
          
          {/* Mobile CTA Buttons */}
          <div className="flex flex-col space-y-4 pt-6 border-t-2 border-slate-100">
            {!user ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-6 py-4 rounded-full text-slate-900 font-bold border-2 border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-6 py-4 rounded-full bg-slate-900 text-white font-bold border-2 border-slate-900 hover:bg-slate-800 transition-colors"
                >
                  Join Now
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                className="w-full text-center px-6 py-4 rounded-full bg-slate-100 text-slate-900 font-bold hover:bg-slate-200 transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}