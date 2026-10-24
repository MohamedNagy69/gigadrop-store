'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import dynamic from 'next/dynamic';
import { ShieldCheck, Gamepad2, ArrowRight, ArrowLeft, Flame, HardDrive, ChevronDown } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { translations } from '@/lib/i18n';
import HeroStarfield from '@/components/storefront/HeroStarfield';

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
          '.hero-3d-visual',
          { opacity: 0, scale: 0.85, y: 24 },
          { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: 'power3.out' },
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
      className={`relative min-h-[100dvh] lg:h-screen lg:max-h-screen w-full overflow-hidden border-b border-[var(--border)] pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-20 lg:pb-4 flex items-center justify-center ${
        isAr ? 'font-cairo' : 'font-sans'
      }`}
    >
      {/* Full-Screen Interactive Cyber Starfield across Hero */}
      <HeroStarfield />

      {/* Dynamic Ambient Background Aura & Tactical Cyber Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[700px] rounded-full blur-[160px] opacity-60 pointer-events-none"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(204,255,0,0.12) 0%, rgba(204,255,0,0.02) 55%, transparent 75%)'
              : 'radial-gradient(circle, rgba(16,185,129,0.14) 0%, rgba(2,132,199,0.04) 55%, transparent 75%)',
          }}
        />

        {/* Tactical Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_88%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-8">
          
          {/* Main Content Column (Left in LTR English, Right in RTL Arabic) */}
          <div
            className={`lg:col-span-7 flex flex-col ${
              isAr ? 'text-right items-start' : 'text-left items-start'
            }`}
          >
            {/* Top Status Tag */}
            <div className="hero-pill-tag mb-3 inline-flex items-center gap-2 rounded-full border border-[#CCFF00]/30 dark:border-[#CCFF00]/30 light:border-emerald-600/30 bg-[#CCFF00]/10 dark:bg-[#CCFF00]/10 light:bg-emerald-500/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-700 shadow-[0_0_16px_rgba(204,255,0,0.15)] light:shadow-[0_2px_10px_rgba(5,150,105,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#CCFF00] dark:bg-[#CCFF00] light:bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#CCFF00] dark:bg-[#CCFF00] light:bg-emerald-600" />
              </span>
              <span>{t.availableAcrossCairo}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[58px] font-black tracking-tight leading-[1.12] sm:leading-[1.08]">
              <span className="hero-title-line-1 block text-white dark:text-white light:text-slate-950">
                {t.heroTitleLine1}
              </span>
              <span className="hero-title-line-2 block text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-700 drop-shadow-[0_0_28px_rgba(204,255,0,0.25)] light:drop-shadow-[0_0_20px_rgba(5,150,105,0.2)]">
                {t.heroTitleLine2}
              </span>
            </h1>

            {/* Subtitle Paragraph */}
            <p className="hero-subtitle-text mt-3 sm:mt-4 max-w-lg text-xs sm:text-sm md:text-base leading-[1.65] text-zinc-400 dark:text-zinc-400 light:text-slate-600 font-normal">
              {t.heroSubtitle}
            </p>

            {/* Badges Strip + Magnetic CTA Button */}
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
              
              {/* Hard Drive Options Badge */}
              <div className="hero-badge-pill inline-flex items-center gap-2 rounded-full border border-white/10 dark:border-white/10 light:border-slate-300/80 bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-white px-3 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white dark:text-white light:text-slate-800 backdrop-blur-md shadow-sm transition-all hover:border-[#CCFF00]/40 light:hover:border-emerald-600/40">
                <HardDrive className="h-3.5 w-3.5 text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-600 shrink-0" />
                <span>{isAr ? 'شراء هارد جديد أو التحميل على هاردك' : 'Buy New Hard Drive or Load on Yours'}</span>
              </div>

              {/* Cash on Delivery Badge */}
              <div className="hero-badge-pill inline-flex items-center gap-2 rounded-full border border-white/10 dark:border-white/10 light:border-slate-300/80 bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-white px-3 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white dark:text-white light:text-slate-800 backdrop-blur-md shadow-sm transition-all hover:border-[#CCFF00]/40 light:hover:border-emerald-600/40">
                <ShieldCheck className="h-3.5 w-3.5 text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-600 shrink-0" />
                <span>{t.badgeCashOnDelivery}</span>
              </div>

              {/* Magnetic Primary CTA Button */}
              <a
                ref={magneticBtnRef}
                href="#library"
                className="hero-badge-pill group relative inline-flex h-9 sm:h-10 items-center gap-2 rounded-full bg-[#CCFF00] dark:bg-[#CCFF00] light:bg-gradient-to-r light:from-emerald-600 light:to-emerald-700 px-4 sm:px-5 text-xs sm:text-sm font-black text-black light:text-white shadow-[0_0_24px_rgba(204,255,0,0.4)] light:shadow-[0_4px_16px_rgba(5,150,105,0.35)] transition-all hover:scale-105 hover:bg-[#B8E600] light:hover:from-emerald-500 light:hover:to-emerald-600"
              >
                <Gamepad2 className="h-4 w-4 transition-transform group-hover:rotate-12" />
                <span>{t.browseLibraryBtn}</span>
                {isAr ? (
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                )}
              </a>

              {/* Hard Drive Store CTA Button */}
              <a
                href="#hard-drives"
                className="hero-badge-pill group relative inline-flex h-9 sm:h-10 items-center gap-2 rounded-full border border-[#CCFF00]/40 bg-[#CCFF00]/10 dark:bg-[#CCFF00]/10 light:border-emerald-600/40 light:bg-emerald-500/10 px-3.5 sm:px-4 text-xs sm:text-sm font-black text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-700 hover:bg-[#CCFF00] hover:text-black dark:hover:bg-[#CCFF00] dark:hover:text-black light:hover:bg-emerald-600 light:hover:text-white transition-all hover:scale-105"
              >
                <HardDrive className="h-3.5 w-3.5" />
                <span>{isAr ? 'متجر الهاردات' : 'Hard Drives Store'}</span>
              </a>

            </div>
          </div>

          {/* Right Column: 3D Scientific Moving Object (Wireframe Geodesic Sphere + Core + Parallax) */}
          <div className="hero-3d-visual lg:col-span-5 flex items-center justify-center relative w-full">
            <div className="relative w-full max-w-[250px] xs:max-w-[280px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[440px] xl:max-w-[480px] aspect-square flex items-center justify-center">
              {/* Volumetric Radial Glow behind 3D Object */}
              <div
                className="pointer-events-none absolute inset-4 rounded-full blur-[90px] opacity-60"
                style={{
                  background: isDark
                    ? 'radial-gradient(circle, rgba(204,255,0,0.18) 0%, rgba(204,255,0,0.03) 60%, transparent 80%)'
                    : 'radial-gradient(circle, rgba(5,150,105,0.2) 0%, rgba(2,132,199,0.05) 60%, transparent 80%)',
                }}
              />
              <HeroScene />
            </div>
          </div>

        </div>
      </div>

      {/* Subtle Scroll Down Indicator - visible on desktop/large screens */}
      <a
        href="#library"
        aria-label="Scroll down to game library"
        className="hidden lg:flex absolute bottom-5 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity z-20 group"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#CCFF00] drop-shadow-[0_0_8px_rgba(204,255,0,0.4)]">
          {isAr ? 'مرر للأسفل' : 'SCROLL'}
        </span>
        <ChevronDown className="h-4 w-4 text-[#CCFF00] transition-transform duration-300 group-hover:translate-y-1 animate-bounce" />
      </a>
    </section>
  );
}
