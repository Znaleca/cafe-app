'use client';

import dynamic from 'next/dynamic';

const MapViewerInner = dynamic(
  () => import('./MapViewerInner'),
  { 
    ssr: false, 
    loading: () => (
      <div className="h-64 flex items-center justify-center bg-slate-50 rounded-2xl w-full border border-slate-100">
        <p className="text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">Loading Map...</p>
      </div>
    ) 
  }
);

export default function MapViewer(props) {
  return <MapViewerInner {...props} />;
}
