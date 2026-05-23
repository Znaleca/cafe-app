'use client';

import dynamic from 'next/dynamic';

const DeliveryMapInner = dynamic(
  () => import('./DeliveryMapInner'),
  { 
    ssr: false, 
    loading: () => (
      <div className="h-96 flex items-center justify-center bg-slate-50 rounded-3xl w-full border border-slate-100">
        <p className="text-slate-400 font-bold animate-pulse text-sm uppercase tracking-widest">Loading Map Engine...</p>
      </div>
    ) 
  }
);

export default function DeliveryMap(props) {
  return <DeliveryMapInner {...props} />;
}
