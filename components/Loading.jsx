'use client';

import Image from 'next/image';

export default function Loading({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
      <div className="relative mb-6">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full border-4 border-sky-100 opacity-50"></div>
        
        {/* Spinning gradient ring */}
        <div className="w-20 h-20 rounded-full border-4 border-transparent border-t-sky-400 border-r-sky-300 animate-spin"></div>
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
            <div className="w-8 h-8 relative animate-pulse">
              <Image src="/logo.png" alt="Loading" fill className="object-contain" sizes="32px" />
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-sm font-bold uppercase tracking-widest text-sky-500 animate-pulse">
        {text}
      </p>
    </div>
  );
}
