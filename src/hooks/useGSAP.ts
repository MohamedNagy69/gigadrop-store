'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function useGSAPEntrance(dependencies: any[] = []) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-fade-up',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, dependencies);

  return containerRef;
}
