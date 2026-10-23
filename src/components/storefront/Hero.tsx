'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { HardDrive, ShieldCheck, Gamepad2, ArrowRight, ArrowLeft, Sparkles, Flame } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { translations } from '@/lib/i18n';
import ThreeGamingCore from '@/components/three/ThreeGamingCore';

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
        { opacity: 0, y: -16, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }
      )
        .fromTo(
          '.hero-title-line-1',
          { opacity: 0, y: 36, rotateX: -20, filter: 'blur(8px)' },
          { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', duration: 0.85 },
          '-=0.4'
        )
        .fromTo(
          '.hero-title-line-2',
          { opacity: 0, y: 36, rotateX: -20, filter: 'blur(8px)' },
          { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', duration: 0.85 },
          '-=0.65'
        )
        .fromTo(
          '.hero-subtitle-text',
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.5'
        )
        .fromTo(
          '.hero-badge-pill',
          { opacity: 0, y: 22, scale: 0.95 },
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
          '.hero-3d-container',
          { opacity: 0, scale: 0.88, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'power4.out' },
          '-=0.7'
        );

      // 2. GSAP Magnetic Attraction Effect on CTA Button
      const btn = magneticBtnRef.current;
      if (btn) {
        const xTo = gsap.quickTo(btn, 'x', { duration: 0.35, ease: 'power3' });
        const yTo = gsap.quickTo(btn, 'y', { duration: 0.35, ease: 'power3' });

        const handleMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e;
          const { left, top, width, height } = btn.getBoundingClientRect();
          const x = clientX - (left + width / 2);
          const y = clientY - (top + height / 2);
          xTo(x * 0.32);
          yTo(y * 0.32);
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
      className={`relative min-h-[88vh] overflow-hidden border-b border-[var(--border)] pt-28 pb-20 sm:pt-36 sm:pb-28 flex items-center ${
        isAr ? 'font-cairo' : 'font-sans'
      }`}
    >
      {/* Dynamic 3D Neon Horizon Glow & Tactical Cyber Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        {/* Soft Radial Ambient Aura */}
        <div
          className={`absolute ${
            isAr ? 'left-1/4' : 'right-1/4'
          } top-1/4 h-[580px] w-[580px] rounded-full blur-[160px] opacity-70 transition-all duration-700`}
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(204,255,0,0.12) 0%, rgba(56,189,248,0.06) 50%, transparent 75%)'
              : 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(2,132,199,0.06) 50%, transparent 75%)',
          }}
        />

        {/* Clean Tactical Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_90%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          
          {/* Main Content Column (Right in RTL Arabic, Left in LTR English) */}
          <div
            className={`lg:col-span-7 flex flex-col ${
              isAr ? 'text-right items-start' : 'text-left items-start'
            }`}
          >
            {/* Top Kinetic Status Pill */}
            <div className="hero-pill-tag mb-5 inline-flex items-center gap-2 rounded-full border border-[#CCFF00]/30 dark:border-[#CCFF00]/30 light:border-emerald-600/30 bg-[#CCFF00]/10 dark:bg-[#CCFF00]/10 light:bg-emerald-600/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-800 shadow-[0_0_16px_rgba(204,255,0,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#CCFF00] dark:bg-[#CCFF00] light:bg-emerald-600 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#CCFF00] dark:bg-[#CCFF00] light:bg-emerald-600" />
              </span>
              <span>{isAr ? 'ألعاب PC على هاردك الشخصي • 2026' : 'PC GAMES ON YOUR HARD DRIVE • 2026'}</span>
            </div>

            {/* Main Headline with 3D Perspective Reveal */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[78px] font-black tracking-tight leading-[1.08] perspective-[1000px]">
              <span className="hero-title-line-1 block text-white dark:text-white light:text-slate-950">
                {t.heroTitleLine1}
              </span>
              <span className="hero-title-line-2 block text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-700 drop-shadow-[0_0_28px_rgba(204,255,0,0.25)]">
                {t.heroTitleLine2}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle-text mt-6 max-w-xl text-base sm:text-lg leading-[1.75] text-zinc-400 dark:text-zinc-400 light:text-slate-600 font-normal">
              {t.heroSubtitle}
            </p>

            {/* Badges Strip + Magnetic CTA Button */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-3.5">
              
              {/* Magnetic Primary CTA Button */}
              <a
                ref={magneticBtnRef}
                href="#library"
                className="hero-badge-pill group relative inline-flex h-12 items-center gap-2 rounded-full bg-[#CCFF00] dark:bg-[#CCFF00] light:bg-emerald-700 px-7 text-xs sm:text-sm font-black text-black light:text-white shadow-[0_0_28px_rgba(204,255,0,0.4)] light:shadow-[0_6px_20px_rgba(22,101,52,0.35)] transition-all hover:scale-105 hover:bg-[#B8E600] light:hover:bg-emerald-800"
              >
                <Gamepad2 className="h-4 w-4 transition-transform group-hover:rotate-12" />
                <span>{t.browseLibraryBtn}</span>
                {isAr ? (
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                )}
              </a>

              {/* COD Badge */}
              <div className="hero-badge-pill inline-flex items-center gap-2 rounded-full border border-white/10 dark:border-white/10 light:border-slate-300 bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-white px-4 py-3 text-xs font-bold text-white dark:text-white light:text-slate-800 backdrop-blur-md shadow-sm transition-all hover:border-[#CCFF00]/40">
                <ShieldCheck className="h-4 w-4 text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-700" />
                <span>{t.badgeCashOnDelivery}</span>
              </div>

              {/* Rate per GB Badge */}
              <div className="hero-badge-pill inline-flex items-center gap-2 rounded-full border border-white/10 dark:border-white/10 light:border-slate-300 bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-white px-4 py-3 text-xs font-bold text-white dark:text-white light:text-slate-800 backdrop-blur-md shadow-sm transition-all hover:border-[#CCFF00]/40">
                <HardDrive className="h-4 w-4 text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-700" />
                <span>{t.badgePricePerGB}</span>
              </div>

            </div>
          </div>

          {/* Visual Column: Three.js Interactive 3D WebGL Core */}
          <div className="hero-3d-container lg:col-span-5 flex items-center justify-center">
            <ThreeGamingCore />
          </div>

        </div>
      </div>
    </section>
  );
}
