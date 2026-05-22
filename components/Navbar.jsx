'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { FiLogOut } from 'react-icons/fi';
import { supabase } from '@/utils/supabase/client';
import { signOut } from '@/actions/signOut';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [open, setOpen] = useState(false);
  const [showNavContent, setShowNavContent] = useState(true);

  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const toggleBtnRef = useRef(null);
  
  const lineTopRef = useRef(null);
  const lineMiddleRef = useRef(null);
  const lineBottomRef = useRef(null);

  const panelItemRefs = useRef([]);
  const busyRef = useRef(false);
  const openRef = useRef(false);
  const openTlRef = useRef(null);
  const closeTlRef = useRef(null);
  const lastScrollYRef = useRef(0);

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

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
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

  const menuItems = useMemo(() => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Menu', href: '/menu' },
      { label: 'Cart', href: '/cart' },
    ];

    if (user && role === 'admin') {
      items.push({ label: 'Admin', href: '/admin' });
    }

    if (user) {
      items.push({ label: 'Profile', href: '/profile' });
      items.push({ label: 'Settings', href: '/account-settings' });
      items.push({ label: 'Sign Out', href: '#sign-out' });
    } else {
      items.push({ label: 'Log in', href: '/login' });
      items.push({ label: 'Sign up', href: '/register' });
    }

    return items;
  }, [role, user]);

  const closeMenu = useCallback(() => {
    if (!openRef.current) return;

    openRef.current = false;
    setOpen(false);
    busyRef.current = true;

    openTlRef.current?.kill();
    openTlRef.current = null;
    closeTlRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayersRef.current ? Array.from(preLayersRef.current.querySelectorAll('.sm-prelayer')) : [];
    if (!panel) {
      busyRef.current = false;
      return;
    }

    const all = [...layers, panel].filter(Boolean);

    closeTlRef.current = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        busyRef.current = false;
      },
    });

    closeTlRef.current.to(panelItemRefs.current.filter(Boolean), { yPercent: 40, opacity: 0, duration: 0.25, stagger: 0.01 }, 0);
    closeTlRef.current.to(all, { yPercent: 100, duration: 0.5, stagger: 0.02 }, 0.02);
    
    closeTlRef.current.to(toggleBtnRef.current, { backgroundColor: '#ffffff', color: '#0284c7', duration: 0.3 }, 0); 
    closeTlRef.current.to(lineTopRef.current, { y: 0, rotate: 0, duration: 0.3 }, 0);
    closeTlRef.current.to(lineMiddleRef.current, { opacity: 1, scaleX: 1, duration: 0.2 }, 0);
    closeTlRef.current.to(lineBottomRef.current, { y: 0, rotate: 0, duration: 0.3 }, 0);
  }, []);

  const openMenu = useCallback(() => {
    if (busyRef.current) return;

    openRef.current = true;
    setOpen(true);
    busyRef.current = true;

    closeTlRef.current?.kill();
    closeTlRef.current = null;

    const panel = panelRef.current;
    const layers = preLayersRef.current ? Array.from(preLayersRef.current.querySelectorAll('.sm-prelayer')) : [];
    if (!panel) {
      busyRef.current = false;
      return;
    }

    const items = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));

    gsap.set([panel, ...layers], { yPercent: 100, opacity: 1 });
    gsap.set(items, { yPercent: 60, opacity: 0 });

    const tl = gsap.timeline({
      defaults: { ease: 'power4.out' },
      onComplete: () => {
        busyRef.current = false;
      },
    });

    layers.forEach((layer, index) => {
      tl.to(layer, { yPercent: 0, duration: 0.6, ease: 'power3.inOut' }, index * 0.04);
    });

    tl.to(panel, { yPercent: 0, duration: 0.7, ease: 'power4.out' }, layers.length * 0.04 + 0.01);
    tl.to(items, { yPercent: 0, opacity: 1, duration: 0.55, stagger: 0.03, ease: 'power2.out' }, '-=0.35');
    
    tl.to(toggleBtnRef.current, { backgroundColor: '#0c4a6e', color: '#ffffff', duration: 0.25 }, 0); 
    tl.to(lineTopRef.current, { y: 6, rotate: 45, duration: 0.25 }, 0);
    tl.to(lineMiddleRef.current, { opacity: 0, scaleX: 0, duration: 0.15 }, 0);
    tl.to(lineBottomRef.current, { y: -6, rotate: -45, duration: 0.25 }, 0);

    openTlRef.current = tl;
  }, []);

  const toggleMenu = useCallback(() => {
    if (busyRef.current) return;
    if (openRef.current) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [closeMenu, openMenu]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    closeMenu();
    router.push('/login');
    router.refresh();
  }, [closeMenu, router]);

  const handleMenuAction = useCallback(
    async (href) => {
      if (href === '#sign-out') {
        await handleSignOut();
        return;
      }
      closeMenu();
      router.push(href);
    },
    [closeMenu, handleSignOut, router]
  );

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const layers = preLayersRef.current ? Array.from(preLayersRef.current.querySelectorAll('.sm-prelayer')) : [];
    if (!panel) return undefined;

    const ctx = gsap.context(() => {
      gsap.set([panel, ...layers], { yPercent: 100, opacity: 1 });
      gsap.set([lineTopRef.current, lineBottomRef.current], { transformOrigin: '50% 50%' });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [closeMenu]);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;

      if (openRef.current) {
        setShowNavContent(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (Math.abs(delta) < 6) return;

      if (currentScrollY <= 24) {
        setShowNavContent(true);
      } else if (delta > 0) {
        setShowNavContent(false);
      } else {
        setShowNavContent(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-[1000] pointer-events-none p-4 md:p-8 font-sans">
      
      {/* Permanent Structural Top Header Bar */}
      <div className="mx-auto grid max-w-full w-full grid-cols-[3rem_1fr_3rem] items-center pointer-events-auto relative z-[1050]">

        <div className="h-12 w-12" aria-hidden="true" />

        <div
          className={`justify-self-center overflow-hidden transition-all duration-300 ${isHomePage && showNavContent && !open ? 'max-w-[320px] opacity-100 translate-y-0' : 'max-w-0 opacity-0 -translate-y-3 pointer-events-none'}`}
        >
          {isHomePage && (
            <Link
              href="/"
              aria-label="Her&Her Cafe Home"
              onClick={closeMenu}
              className="flex flex-col items-center justify-center text-center select-none whitespace-nowrap"
            >
              <span className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-none">
                Her<span className="font-serif font-light lowercase italic tracking-normal text-sky-100">&</span>Her
              </span>
              <span className="text-sm md:text-base font-light tracking-[0.3em] uppercase text-sky-50 mt-1 block">
                Cafe
              </span>
            </Link>
          )}
        </div>

        {/* Drawer Toggle Control Button without Shadows/Animations */}
        <button
          ref={toggleBtnRef}
          onClick={toggleMenu}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="staggered-menu-panel"
          className="justify-self-end flex h-12 w-12 flex-col items-center justify-center gap-[4px] rounded-full bg-white text-sky-950"
          type="button"
        >
          <span ref={lineTopRef} className="h-[2px] w-4 bg-current transform-gpu" />
          <span ref={lineMiddleRef} className="h-[2px] w-4 bg-current transform-gpu" />
          <span ref={lineBottomRef} className="h-[2px] w-4 bg-current transform-gpu" />
        </button>
      </div>

      {/* Transitional Background Slide Layers */}
      <div ref={preLayersRef} className="pointer-events-none fixed inset-0 z-[5]" aria-hidden="true">
        {['#f0f9ff', '#e0f2fe', '#bae6fd'].map((color, index) => (
          <div
            key={color}
            className="sm-prelayer absolute inset-0 h-full w-full"
            style={{ background: color, transform: `translateY(${index * 16}px)` }}
          />
        ))}
      </div>

      {/* Full Screen Drawer Overlay */}
      <aside
        id="staggered-menu-panel"
        ref={panelRef}
        className="pointer-events-auto fixed inset-0 z-20 flex h-screen w-screen flex-col overflow-y-auto bg-[#52b1e7] px-6 py-12 md:px-16 lg:px-24"
        aria-hidden={!open}
      >
        <div className="mx-auto flex h-full w-full max-w-full flex-col justify-center">
          
          <ul className="group flex flex-col items-center justify-center gap-2 p-0 list-none" role="list">
            {menuItems.map((item, index) => {
              const isDanger = item.href === '#sign-out';

              return (
                <li key={`${item.label}-${item.href}`} className="w-full text-center h-20 md:h-28 lg:h-32 flex items-center justify-center">
                  {isDanger ? (
                    <button
                      ref={(el) => { panelItemRefs.current[index] = el; }}
                      type="button"
                      onClick={() => handleMenuAction(item.href)}
                      className="nav-target sm-panel-itemLabel group/item relative inline-flex items-center justify-center w-fit text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white transition-colors duration-300 group-has-[.nav-target:hover]:text-white/30 hover:!text-white"
                    >
                      <span className="transition-all duration-300 group-hover/item:opacity-0 group-hover/item:scale-90 flex items-center gap-4">
                        {item.label} <FiLogOut className="h-6 w-6 md:h-8 md:w-8" />
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center font-serif font-bold italic tracking-normal opacity-0 scale-110 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:scale-100 whitespace-nowrap pointer-events-none">
                        {item.label}
                      </span>
                    </button>
                  ) : (
                    <Link
                      ref={(el) => { panelItemRefs.current[index] = el; }}
                      href={item.href}
                      onClick={closeMenu}
                      className="nav-target sm-panel-itemLabel group/item relative inline-flex items-center justify-center w-fit text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white transition-colors duration-300 group-has-[.nav-target:hover]:text-white/30 hover:!text-white"
                    >
                      <span className="transition-all duration-300 group-hover/item:opacity-0 group-hover/item:scale-90 flex items-center gap-4">
                        {item.label}
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center font-serif font-bold italic tracking-normal opacity-0 scale-110 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:scale-100 whitespace-nowrap pointer-events-none">
                        {item.label}
                      </span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

        </div>
      </aside>
    </div>
  );
}