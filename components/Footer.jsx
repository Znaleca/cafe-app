'use client';

import Link from 'next/link';
import { FiInstagram, FiFacebook, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { SiTiktok } from 'react-icons/si';

const links = {
  'Quick Links': [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
    { label: 'Login', href: '/login' },
    { label: 'Sign Up', href: '/register' },
  ],
  'Our Menu': [
    { label: 'Coffee & Lattes', href: '/menu' },
    { label: 'Artisan Teas', href: '/menu' },
    { label: 'Pastries', href: '/menu' },
    { label: 'Seasonal Specials', href: '/menu' },
  ],
};

const socials = [
  { icon: FiInstagram, href: 'https://www.instagram.com/herandhercafe' },
  { icon: FiFacebook, href: 'https://www.facebook.com/profile.php?id=61573866232721' },
  { icon: SiTiktok, href: 'https://www.tiktok.com/@herandher.cafe' },
];

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#52b1e7] text-white font-sans select-none m-0 p-0 overflow-hidden">

      <style jsx global>{`
        @keyframes sparkle { 0%,100%{transform:scale(0) rotate(0deg);opacity:0}50%{transform:scale(1.3) rotate(180deg);opacity:0.9} }
        @keyframes revealSkew { from{opacity:0;transform:translateY(45px) skewY(1deg);} to{opacity:1;transform:translateY(0) skewY(0deg);} }
        .animate-sparkle-1 { animation: sparkle 3.2s infinite ease-in-out; }
        .animate-sparkle-2 { animation: sparkle 2.8s infinite ease-in-out 0.4s; }
        .reveal-item { animation: revealSkew 1.05s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>

      {/* Decorative Background Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute top-[10%] left-[6%] w-6 h-6 text-white fill-current animate-sparkle-1" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        <svg className="absolute top-[28%] right-[8%] w-8 h-8 text-white fill-current opacity-75 animate-sparkle-2" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
      </div>

      {/* Main container */}
      <div className="relative z-10 max-w-[94%] sm:max-w-[96%] mx-auto px-4 py-12 md:py-16">

        {/* Five-column layout optimized to pull data wide across desktop monitors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 items-start">

          {/* Column 1: Wide Brand Block with Minimal Identity typography */}
          <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-12 reveal-item">
            <Link href="/" className="inline-flex items-center text-white font-black text-2xl uppercase tracking-tighter hover:text-sky-100 transition-colors">
              <span>
                HER<span className="font-serif font-light lowercase italic tracking-normal text-white/90">&</span>HER
              </span>
            </Link>
            <p className="text-white/90 text-sm leading-relaxed font-medium max-w-sm">
              A sanctuary of sky-blue aesthetics, sparkling pastries, and perfectly brewed moments crafted for creative escapes.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {socials.map((social, i) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={i} 
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/30 transition-all duration-200 text-white"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Columns 2 & 3: Navigation Columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title} className="space-y-4">
              <h4 className="font-bold text-white text-xs tracking-[0.2em] uppercase opacity-90">{title}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-white/80 font-medium text-sm hover:text-white transition-colors block"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 4: Contact details */}
          <div className="space-y-4 reveal-item">
            <h4 className="font-bold text-white text-xs tracking-[0.2em] uppercase opacity-90">Find Us</h4>
            <ul className="space-y-3 text-sm text-white/90">
              <li className="flex items-start gap-2.5 font-medium">
                <FiMapPin className="w-4 h-4 text-white/90 mt-0.5 shrink-0" />
                <span>123 Cloud Street, Sky District, PH</span>
              </li>
              <li className="flex items-center gap-2.5 font-medium">
                <FiPhone className="w-4 h-4 text-white/90 shrink-0" />
                <span>+63 912 345 6789</span>
              </li>
              <li className="flex items-center gap-2.5 font-medium">
                <FiMail className="w-4 h-4 text-white/90 shrink-0" />
                <span>hello@herher.cafe</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Base Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-white/80 tracking-wider uppercase">
          <p>
            © {new Date().getFullYear()} Her&Her Café. All rights reserved.
          </p>
          <p className="text-white/90 tracking-wide normal-case">
            Made by <span className="text-white font-black tracking-normal">Acelanz Studio</span>
          </p>
        </div>

      </div>
    </footer>
  );
}