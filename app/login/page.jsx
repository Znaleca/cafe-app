'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createSession } from '@/actions/createSession';
import { BiCoffeeTogo } from 'react-icons/bi';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      setMessage('Error: Request timed out. Please try again.');
      setLoading(false);
    }, 10000);

    try {
      await createSession(email, password);
      clearTimeout(timeout);
      router.push('/');
      router.refresh();
    } catch (error) {
      clearTimeout(timeout);
      if (error.name !== 'AbortError') {
        setMessage(`Error: ${error.message}`);
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="glass-card rounded-3xl p-10 shadow-xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-500 shadow-lg shadow-sky-200 mb-4">
              <BiCoffeeTogo className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-800">Welcome back</h1>
            <p className="text-slate-500 mt-1 text-sm">Sign in to your Her&amp;Her account</p>
          </div>

          {message && (
            <div className={`px-4 py-3 rounded-xl mb-6 text-sm font-medium ${
              message.includes('Error')
                ? 'bg-red-50 text-red-600 border border-red-100'
                : 'bg-sky-50 text-sky-700 border border-sky-100'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all text-slate-800 placeholder:text-slate-300"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all text-slate-800 placeholder:text-slate-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full py-3.5 px-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold text-base transition-all active:scale-95 shadow-lg shadow-sky-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-sky-600 font-bold hover:text-sky-500 transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
