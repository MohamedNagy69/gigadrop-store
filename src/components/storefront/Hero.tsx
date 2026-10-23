'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import dynamic from 'next/dynamic';
import { ShieldCheck, Gamepad2, ArrowRight, ArrowLeft, Flame, HardDrive } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { translations } from '@/lib/i18n';
import PriceCalculator from '@/components/storefront/PriceCalculator';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
});

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const magneticBtnRef = useRef<HTMLAnchorElement | null>(null);
  const { locale, theme } = useThemeStore();
  const t = translations[locale];
  const isAr = locale === 'ar';
  const isDark = theme !== 'light';

  // -------------------------------------------------------------
  // GSAP TIMELINE & MAGNETIC BUTTON EFFECT
  // -------------------------------------------------------------
  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Cinematic Staggered Entrance
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-pill-tag',
        { opacity: 0, y: -16, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }
      )
        .fromTo(
          '.hero-title-line-1',
          { opacity: 0, y: 32, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 },
          '-=0.4'
        )
        .fromTo(
          '.hero-title-line-2',
          { opacity: 0, y: 32, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          '.hero-subtitle-text',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.5'
        )
        .fromTo(
          '.hero-badge-pill',
          { opacity: 0, y: 20, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: 'back.out(1.4)',
          },
          '-=0.4'
        )
        .fromTo(
          '.hero-calc-card',
          { opacity: 0, y: 28, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' },
          '-=0.6'
        );

      // 2. Magnetic Attraction on Browse Library CTA Button
      const btn = magneticBtnRef.current;
      if (btn) {
        const xTo = gsap.quickTo(btn, 'x', { duration: 0.35, ease: 'power3' });
        const yTo = gsap.quickTo(btn, 'y', { duration: 0.35, ease: 'power3' });

        const handleMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e;
          const { left, top, width, height } = btn.getBoundingClientRect();
          const x = clientX - (left + width / 2);
          const y = clientY - (top + height / 2);
          xTo(x * 0.3);
          yTo(y * 0.3);
        };

        const handleMouseLeave = () => {
          xTo(0);
          yTo(0);
        };

        btn.addEventListener('mousemove', handleMouseMove);
        btn.addEventListener('mouseleave', handleMouseLeave);
      }
    }, heroRef);

    return () => ctx.revert();
  }, [locale, theme]);

  return (
    <section
      ref={heroRef}
      dir={isAr ? 'rtl' : 'ltr'}
      className={`relative min-h-[86vh] overflow-hidden border-b border-[var(--border)] pt-28 pb-20 sm:pt-36 sm:pb-24 flex items-center ${
        isAr ? 'font-cairo' : 'font-sans'
      }`}
    >
      {/* 3D Scientific Wireframe Sphere Scene in Background */}
      <HeroScene />

      {/* Dynamic 3D Ambient Glowing Horizon Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[700px] rounded-full blur-[150px] opacity-70 pointer-events-none"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(204,255,0,0.14) 0%, rgba(204,255,0,0.02) 55%, transparent 75%)'
              : 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(2,132,199,0.04) 55%, transparent 75%)',
          }}
        />

        {/* Tactical Cyber Grid Background Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_88%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          
          {/* Main Content Column (Left in LTR English, Right in RTL Arabic) */}
          <div
            className={`lg:col-span-7 flex flex-col ${
              isAr ? 'text-right items-start' : 'text-left items-start'
            }`}
          >
            {/* Top Status Tag */}
            <div className="hero-pill-tag mb-5 inline-flex items-center gap-2 rounded-full border border-[#CCFF00]/30 dark:border-[#CCFF00]/30 light:border-emerald-600/30 bg-[#CCFF00]/10 dark:bg-[#CCFF00]/10 light:bg-emerald-600/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-800 shadow-[0_0_16px_rgba(204,255,0,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#CCFF00] dark:bg-[#CCFF00] light:bg-emerald-600 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#CCFF00] dark:bg-[#CCFF00] light:bg-emerald-600" />
              </span>
              <span>{t.availableAcrossCairo}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-black tracking-tight leading-[1.08]">
              <span className="hero-title-line-1 block text-white dark:text-white light:text-slate-950">
                {t.heroTitleLine1}
              </span>
              <span className="hero-title-line-2 block text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-700 drop-shadow-[0_0_28px_rgba(204,255,0,0.25)]">
                {t.heroTitleLine2}
              </span>
            </h1>

            {/* Subtitle Paragraph */}
            <p className="hero-subtitle-text mt-6 max-w-xl text-base sm:text-lg leading-[1.75] text-zinc-400 dark:text-zinc-400 light:text-slate-600 font-normal">
              {t.heroSubtitle}
            </p>

            {/* Badges Strip + Magnetic CTA Button */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-3.5">
              
              {/* Rate per GB Badge */}
              <div className="hero-badge-pill inline-flex items-center gap-2 rounded-full border border-white/10 dark:border-white/10 light:border-slate-300 bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-white px-4 py-2.5 text-xs font-bold text-white dark:text-white light:text-slate-800 backdrop-blur-md shadow-sm transition-all hover:border-[#CCFF00]/40">
                <Flame className="h-4 w-4 text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-700" />
                <span>{t.badgePricePerGB}</span>
              </div>

              {/* Cash on Delivery Badge */}
              <div className="hero-badge-pill inline-flex items-center gap-2 rounded-full border border-white/10 dark:border-white/10 light:border-slate-300 bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-white px-4 py-2.5 text-xs font-bold text-white dark:text-white light:text-slate-800 backdrop-blur-md shadow-sm transition-all hover:border-[#CCFF00]/40">
                <ShieldCheck className="h-4 w-4 text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-700" />
                <span>{t.badgeCashOnDelivery}</span>
              </div>

              {/* Magnetic Primary CTA Button */}
              <a
                ref={magneticBtnRef}
                href="#library"
                className="hero-badge-pill group relative inline-flex h-11 items-center gap-2 rounded-full bg-[#CCFF00] dark:bg-[#CCFF00] light:bg-emerald-700 px-6 text-xs sm:text-sm font-black text-black light:text-white shadow-[0_0_24px_rgba(204,255,0,0.4)] light:shadow-[0_4px_16px_rgba(22,101,52,0.35)] transition-all hover:scale-105 hover:bg-[#B8E600] light:hover:bg-emerald-800"
              >
                <Gamepad2 className="h-4 w-4 transition-transform group-hover:rotate-12" />
                <span>{t.browseLibraryBtn}</span>
                {isAr ? (
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                )}
              </a>

            </div>
          </div>

          {/* Right Column: Price Calculator Card */}
          <div className="hero-calc-card lg:col-span-5 flex items-center justify-center w-full">
            <PriceCalculator />
          </div>

        </div>
      </div>
    </section>
  );
}
