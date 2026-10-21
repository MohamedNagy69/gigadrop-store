'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import dynamic from 'next/dynamic';
import {
  HardDrive,
  ShieldCheck,
  Truck,
  Wallet,
  Gamepad2,
  Headphones,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { translations } from '@/lib/i18n';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
});

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
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power3.out',
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [locale]);

  const highlights = [
    {
      icon: HardDrive,
      stat: isAr ? '1.00 ج.م / جيجا' : '1.00 EGP / GB',
      title: isAr ? 'سعر ثابت للجيجابايت' : 'Flat 1.00 EGP Per GB',
      sub: isAr
        ? 'ادفع فقط ثمن مساحة الألعاب المحملة بدون أي اشتراكات أو رسوم إضافية'
        : 'Pay strictly for the exact data loaded — zero hidden subscriptions',
      badgeClass:
        'border-emerald-700/30 bg-emerald-700/10 text-emerald-800 dark:border-lime-500/30 dark:bg-lime-500/10 dark:text-[#CCFF00]',
    },
    {
      icon: ShieldCheck,
      stat: 'SHA-256',
      title: isAr ? 'ملفات مفحوصة ومضمونة' : 'SHA-256 Verified Builds',
      sub: isAr
        ? 'نسخ كاملة ومحدثة بدون فك ضغط معقد وبدون أي ملفات تالفة نهائياً'
        : 'Full, clean PC builds with latest patches, zero file corruptions',
      badgeClass:
        'border-sky-700/30 bg-sky-700/10 text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400',
    },
    {
      icon: Truck,
      stat: isAr ? '24–48 ساعة' : '24–48 Hours',
      title: isAr ? 'توصيل لباب بيتك' : 'Express Courier Service',
      sub: isAr
        ? 'استلام وتسليم هاردك في جميع مناطق القاهرة والجيزة مع تتبع لحظي'
        : 'Doorstep pickup & return across Greater Cairo with live order tracking',
      badgeClass:
        'border-amber-700/30 bg-amber-700/10 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400',
    },
    {
      icon: Wallet,
      stat: isAr ? 'كاش / إنستاباي' : 'Cash on Delivery',
      title: isAr ? 'الدفع عند الاستلام' : 'Zero-Risk Payment',
      sub: isAr
        ? 'عاين هاردك وتأكد من اكتمال ألعابك بنفسك قبل دفع أي مليم'
        : 'Inspect your loaded drive first, pay cash or InstaPay with zero risk',
      badgeClass:
        'border-teal-700/30 bg-teal-700/10 text-teal-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400',
    },
  ];

  return (
    <section
      ref={heroRef}
      className={`relative overflow-hidden border-b border-[var(--border)] pt-32 pb-20 sm:pt-40 sm:pb-28 ${
        isAr ? 'font-cairo' : 'font-sans'
      }`}
    >
      {/* 3D Atmospheric Background Scene */}
      <HeroScene />

      {/* Futuristic Background Gradients & Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        {/* Center Primary Glow */}
        <div className="absolute left-1/2 top-1/3 h-[520px] w-[750px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-600/[0.08] dark:bg-[#CCFF00]/[0.08] blur-[140px]" />

        {/* Secondary Cyan Glow */}
        <div className="absolute right-10 top-1/4 h-[380px] w-[380px] rounded-full bg-sky-600/[0.05] dark:bg-cyan-500/[0.04] blur-[120px]" />

        {/* Cyber Grid Overlay with Radial Fade */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1240px] px-4 sm:px-6">
        {/* Main Hero Header Stack */}
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Top Status Telemetry Pill */}
          <div className="hero-animate mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-700/30 dark:border-[#CCFF00]/35 bg-white/90 dark:bg-zinc-950/80 px-4 py-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(204,255,0,0.15)] backdrop-blur-xl transition-transform hover:scale-[1.02]">
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-600 dark:bg-[#CCFF00] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600 dark:bg-[#CCFF00]" />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-emerald-800 dark:text-[#CCFF00]">
              {t.availableAcrossCairo}
            </span>
          </div>

          {/* Epic Main Heading */}
          <h1 className="hero-animate text-4xl sm:text-6xl lg:text-[74px] font-black leading-[1.16] tracking-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 dark:from-white dark:via-zinc-100 dark:to-zinc-300">
              {t.heroTitleLine1}
            </span>
            <span className="mt-1 block text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-green-700 to-teal-800 dark:from-[#CCFF00] dark:via-[#E2FF4D] dark:to-[#86EFAC] drop-shadow-[0_2px_10px_rgba(22,101,52,0.2)] dark:drop-shadow-[0_0_35px_rgba(204,255,0,0.35)]">
              {t.heroTitleLine2}
            </span>
          </h1>

          {/* Subtitle with High-Contrast Typography */}
          <p className="hero-animate mt-6 max-w-2xl text-base sm:text-lg lg:text-xl font-medium dark:font-normal leading-relaxed text-slate-700 dark:text-zinc-300">
            {t.heroSubtitle}
          </p>

          {/* Action CTA Buttons */}
          <div className="hero-animate mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#library"
              className="group inline-flex h-13 items-center gap-3 rounded-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white dark:bg-none dark:bg-[#CCFF00] dark:hover:bg-[#B8E600] dark:text-black px-8 py-3.5 text-sm sm:text-base font-black shadow-[0_4px_20px_rgba(22,101,52,0.3)] dark:shadow-[0_0_30px_rgba(204,255,0,0.35)] transition-all duration-300 hover:scale-[1.03] dark:hover:shadow-[0_0_42px_rgba(204,255,0,0.55)]"
            >
              <Gamepad2 className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
              <span>{t.browseLibraryBtn}</span>
              {isAr ? (
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              ) : (
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              )}
            </a>

            <Link
              href="/contact"
              className="inline-flex h-13 items-center gap-2.5 rounded-full border border-slate-300/90 dark:border-zinc-700/80 bg-white/90 dark:bg-zinc-900/80 px-7 py-3.5 text-sm sm:text-base font-bold text-slate-800 dark:text-zinc-100 backdrop-blur-xl shadow-sm transition-all duration-300 hover:border-emerald-600 dark:hover:border-[#CCFF00] hover:text-emerald-700 dark:hover:text-[#CCFF00] hover:bg-white dark:hover:bg-zinc-800/90"
            >
              <Headphones className="h-4 w-4 text-emerald-700 dark:text-[#CCFF00]" />
              <span>{isAr ? 'التواصل مع الدعم الفني' : 'Contact Technical Support'}</span>
            </Link>
          </div>

          {/* Quick Trust Badges Strip */}
          <div className="hero-animate mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-zinc-400">
            <div className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-[#CCFF00]" />
              <span>{isAr ? 'فحص ملفات SHA-256 بنسبة 100%' : '100% SHA-256 Verified Files'}</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-[#CCFF00]" />
              <span>{isAr ? 'توصيل لباب بيتك في 24–48 ساعة' : '24–48h Cairo Courier Pickup'}</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-[#CCFF00]" />
              <span>{isAr ? 'الدفع كاش أو إنستاباي بعد المعاينة' : 'Cash on Delivery Guarantee'}</span>
            </div>
          </div>
        </div>

        {/* The 4 Highlights Feature Cards Grid */}
        <div className="hero-animate mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-gradient-to-b from-white/95 via-slate-50/95 to-slate-100/90 dark:from-[#111116]/95 dark:via-[#0d0d12]/95 dark:to-[#09090c]/95 p-5 sm:p-6 backdrop-blur-xl shadow-sm hover:shadow-[0_12px_28px_rgba(22,101,52,0.12)] dark:hover:shadow-[0_12px_32px_rgba(204,255,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-600/70 dark:hover:border-[#CCFF00]/50"
              >
                {/* Top Subtle Edge Highlight */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-600/40 dark:via-[#CCFF00]/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div>
                  {/* Top Bar: Icon + Stat Badge */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 dark:border-white/[0.06] bg-slate-100 dark:bg-zinc-900/90 text-emerald-700 dark:text-[#CCFF00] shadow-inner transition-colors duration-300 group-hover:bg-emerald-700 group-hover:text-white dark:group-hover:bg-[#CCFF00] dark:group-hover:text-black">
                      <Icon className="h-6 w-6" />
                    </span>

                    <span
                      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-black tracking-wide ${item.badgeClass}`}
                    >
                      {item.stat}
                    </span>
                  </div>

                  {/* Title & Sub */}
                  <h3 className="mt-5 text-base sm:text-lg font-black text-slate-900 dark:text-white transition-colors group-hover:text-emerald-800 dark:group-hover:text-[#CCFF00]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                    {item.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
