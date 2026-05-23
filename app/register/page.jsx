'use client';

import { useState } from 'react';
import Link from 'next/link';
import { registerUser } from '@/actions/registerUser';
import { BiCoffeeTogo } from 'react-icons/bi';
import { FiMail, FiLock, FiCheckCircle, FiSmile } from 'react-icons/fi';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await registerUser(email, password, nickname);
      setSuccess(true);
      setMessage('Registration successful! Please check your email to verify your account.');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-3xl p-10 shadow-xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 shadow-lg shadow-sky-200 mb-4">
              <BiCoffeeTogo className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-800">Join Her&amp;Her</h1>
            <p className="text-slate-500 mt-1 text-sm">Create your free account and start your journey</p>
          </div>

          {/* Success State */}
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="flex items-center justify-center">
                <FiCheckCircle className="w-16 h-16 text-sky-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Check your inbox!</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                We&apos;ve sent a verification link to <strong>{email}</strong>. Click the link to activate your account.
              </p>
              <Link
                href="/login"
                className="inline-block mt-4 px-6 py-3 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-400 transition-colors"
              >
                Go to Sign In
              </Link>
            </div>
          ) : (
            <>
              {message && (
                <div className="px-4 py-3 rounded-xl mb-6 text-sm font-medium bg-red-50 text-red-600 border border-red-100">
                  {message}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                {/* Nickname */}
                <div>
                  <label htmlFor="register_nickname" className="block text-sm font-semibold text-slate-700 mb-2">
                    Nickname
                  </label>
                  <div className="relative">
                    <FiSmile className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      id="register_nickname"
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all text-slate-800 placeholder:text-slate-300"
                      placeholder="What should we call you?"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="register_email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      id="register_email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all text-slate-800 placeholder:text-slate-300"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="register_password" className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      id="register_password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all text-slate-800 placeholder:text-slate-300"
                      placeholder="Min. 6 characters"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold text-base transition-all active:scale-95 shadow-lg shadow-sky-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link href="/login" className="text-sky-600 font-bold hover:text-sky-500 transition-colors">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
