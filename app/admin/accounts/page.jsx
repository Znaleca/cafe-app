'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { FiUser } from 'react-icons/fi';

export default function AccountsManagementPage() {
  const [accounts, setAccounts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    async function fetchAccounts() {
      setIsFetching(true);
      try {
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setAccounts(data || []);
      } catch (error) {
        console.error("Error fetching accounts:", error.message);
      } finally {
        setIsFetching(false);
      }
    }
    
    fetchAccounts();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    if (!confirm(`Change role to ${newRole}?`)) return;
    
    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
      if (error) throw error;
      setAccounts(accounts.map(acc => acc.id === userId ? { ...acc, role: newRole } : acc));
    } catch (err) {
      alert(`Failed to update role: ${err.message}`);
    }
  };

  return (
    <div>
      {/* Hero Header */}
      <div className="bg-[#52b1e7] rounded-[2.5rem] p-10 text-white relative overflow-hidden mb-8 shadow-xl shadow-sky-900/5">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none" />
        <svg className="absolute top-[20%] right-[12%] w-6 h-6 text-white fill-current animate-[sparkle_3.2s_infinite_ease-in-out] pointer-events-none" viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        <div className="relative z-10">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-white/70 block mb-3">Admin Panel</span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2 leading-none">
            User <span className="font-serif font-light lowercase italic tracking-normal text-sky-100">accounts.</span>
          </h1>
          <p className="text-base font-light text-sky-50/90 tracking-wide">Manage user roles and permissions.</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-3xl">
        {isFetching ? (
          <div className="text-center py-12 text-slate-400">Loading accounts...</div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No accounts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sky-100 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="pb-4 font-semibold pl-2">User ID</th>
                  <th className="pb-4 font-semibold">Joined At</th>
                  <th className="pb-4 font-semibold text-right pr-2">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {accounts.map(acc => (
                  <tr key={acc.id} className="hover:bg-sky-50/50 transition-colors">
                    <td className="py-4 pl-2 font-mono text-sm text-slate-600">{acc.id}</td>
                    <td className="py-4 text-sm text-slate-500">
                      {new Date(acc.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-4 text-right pr-2">
                      <button
                        onClick={() => handleRoleToggle(acc.id, acc.role)}
                        className={`tag-pill transition-colors cursor-pointer hover:opacity-80 ${
                          acc.role === 'admin' 
                            ? 'bg-rose-100/50 text-rose-600 border-rose-200' 
                            : 'bg-sky-100/50 text-sky-600 border-sky-200'
                        }`}
                      >
                        {acc.role}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-slate-400 mt-6 text-center">
              * Click on a role badge to toggle the user's permissions. Emails are hidden due to security policies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
