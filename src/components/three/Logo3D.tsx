'use client';

import React from 'react';

export default function Logo3D({ size = 80 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center rounded-2xl bg-[#111111] border border-[#CCFF00]/40 shadow-[0_0_30px_rgba(204,255,0,0.2)]"
    >
      <div className="absolute inset-1 rounded-xl border border-dashed border-[#CCFF00]/30 animate-spin" style={{ animationDuration: '12s' }} />
      <span className="text-3xl font-black text-[#CCFF00] select-none">G</span>
    </div>
  );
}
