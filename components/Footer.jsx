import Link from 'next/link';
import { BiCoffeeTogo } from 'react-icons/bi';
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

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

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-1 space-y-6">
            <Link href="/" className="inline-flex items-center gap-2 text-white font-black text-2xl uppercase tracking-tighter hover:text-sky-400 transition-colors">
              <BiCoffeeTogo className="w-8 h-8 text-sky-400" />
              <span>Her&amp;Her</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              A sanctuary of sky-blue aesthetics, sparkling pastries, and perfectly brewed moments.
            </p>
            <div className="flex items-center gap-4">
              {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-sky-500 text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title} className="space-y-6">
              <h4 className="font-bold text-white text-sm tracking-widest uppercase">{title}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-slate-400 font-medium hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="font-bold text-white text-sm tracking-widest uppercase">Find Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 font-medium">
                <FiMapPin className="w-5 h-5 text-sky-400 mt-0.5 shrink-0" />
                <span>123 Cloud Street, Sky District, PH</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 font-medium">
                <FiPhone className="w-5 h-5 text-sky-400 shrink-0" />
                <span>+63 912 345 6789</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 font-medium">
                <FiMail className="w-5 h-5 text-sky-400 shrink-0" />
                <span>hello@herher.cafe</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t-2 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-bold text-slate-500 tracking-wide uppercase">
            © {new Date().getFullYear()} Her&amp;Her Café. All rights reserved.
          </p>
          <p className="text-sm font-bold text-slate-500 tracking-wide uppercase flex items-center gap-1.5">
            Made with <span className="text-sky-400">♥</span> for dreamers
          </p>
        </div>
      </div>
    </footer>
  );
}
