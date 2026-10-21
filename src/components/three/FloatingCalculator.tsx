'use client';

import React, { useRef, useState } from 'react';

export default function FloatingCalculator({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`
    );
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Large Faded "G" Watermark Letter Behind the Calculator */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-6 -top-12 text-[260px] sm:text-[320px] font-black leading-none text-[#CCFF00]/[0.05] tracking-tighter"
      >
        G
      </div>

      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform,
          transition: 'transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
          transformStyle: 'preserve-3d',
        }}
        className="relative z-10 w-full max-w-md"
      >
        {children}
      </div>
    </div>
  );
}
