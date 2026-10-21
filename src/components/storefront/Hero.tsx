'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { HardDrive, ShieldCheck, Gamepad2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { translations } from '@/lib/i18n';
import GamingHeroVisual from './GamingHeroVisual';

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { locale } = useThemeStore();
  const t = translations[locale];
  const isAr = locale === 'ar';

  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-animate',
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [locale]);

  return (
    <section
      ref={heroRef}
      dir={isAr ? 'rtl' : 'ltr'}
      className={`relative min-h-[85vh] overflow-hidden border-b border-[var(--border)] pt-28 pb-20 sm:pt-36 sm:pb-28 flex items-center ${
        isAr ? 'font-cairo' : 'font-sans'
      }`}
    >
      {/* Background Cyber Grid & Subtle Ambient Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        {/* Soft Radial Ambient Glow */}
        <div
          className={`absolute ${
            isAr ? 'left-1/4' : 'right-1/4'
          } top-1/3 h-[520px] w-[520px] rounded-full bg-[#CCFF00]/[0.06] dark:bg-[#CCFF00]/[0.06] light:bg-emerald-600/[0.05] blur-[150px]`}
        />

        {/* Clean Tactical Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_90%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1260px] px-6 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          
          {/* Main Content Column (Right in RTL Arabic, Left in LTR English) */}
          <div
            className={`lg:col-span-7 flex flex-col ${
              isAr ? 'text-right items-start' : 'text-left items-start'
            }`}
          >
            {/* Main Headline */}
            <h1 className="hero-animate text-5xl sm:text-6xl md:text-7xl lg:text-[78px] font-black tracking-tight leading-[1.08]">
              <span className="block text-white dark:text-white light:text-slate-950">
                {t.heroTitleLine1}
              </span>
              <span className="block text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-700">
                {t.heroTitleLine2}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero-animate mt-6 max-w-xl text-base sm:text-lg leading-[1.75] text-zinc-400 dark:text-zinc-400 light:text-slate-600 font-normal">
              {t.heroSubtitle}
            </p>

            {/* CTA Button + Info Badges (Matching reference exactly) */}
            <div className="hero-animate mt-8 flex flex-wrap items-center gap-3 sm:gap-3.5">
              <a
                href="#library"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#CCFF00] dark:bg-[#CCFF00] light:bg-emerald-700 px-7 text-xs sm:text-sm font-black text-black light:text-white shadow-[0_0_24px_rgba(204,255,0,0.35)] light:shadow-[0_4px_16px_rgba(22,101,52,0.3)] transition-all hover:scale-105 hover:bg-[#B8E600] light:hover:bg-emerald-800"
              >
                <Gamepad2 className="h-4 w-4" />
                <span>{t.browseLibraryBtn}</span>
                {isAr ? (
                  <ArrowLeft className="h-3.5 w-3.5" />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5" />
                )}
              </a>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 dark:border-white/10 light:border-slate-300 bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-white px-4 py-3 text-xs font-bold text-white dark:text-white light:text-slate-800 backdrop-blur-md">
                <ShieldCheck className="h-4 w-4 text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-700" />
                <span>{t.badgeCashOnDelivery}</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 dark:border-white/10 light:border-slate-300 bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-white px-4 py-3 text-xs font-bold text-white dark:text-white light:text-slate-800 backdrop-blur-md">
                <HardDrive className="h-4 w-4 text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-700" />
                <span>{t.badgePricePerGB}</span>
              </div>
            </div>
          </div>

          {/* Visual Column (Left in RTL Arabic, Right in LTR English) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <GamingHeroVisual />
          </div>

        </div>
      </div>
    </section>
  );
}
