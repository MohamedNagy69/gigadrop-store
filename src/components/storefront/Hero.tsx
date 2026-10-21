'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import dynamic from 'next/dynamic';
import { HardDrive, ShieldCheck, Truck, Wallet, Gamepad2, Headphones } from 'lucide-react';
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
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const highlights = [
    {
      icon: HardDrive,
      title: isAr ? '1.00 ج.م لكل جيجابايت' : '1.00 EGP Per GB',
      sub: isAr ? 'ادفع فقط مقابل المساحة المحملة' : 'Pay only for exact data loaded',
    },
    {
      icon: ShieldCheck,
      title: isAr ? 'ملفات مفحوصة SHA-256' : 'SHA-256 Verified Files',
      sub: isAr ? 'نسخ كاملة وآمنة 100% بدون ضغط' : '100% clean & verified PC builds',
    },
    {
      icon: Truck,
      title: isAr ? 'توصيل خلال 1–2 يوم' : '1–2 Days Cairo Courier',
      sub: isAr ? 'استلام وتسليم الهارد في جميع مناطق القاهرة' : 'Pickup & return across Greater Cairo',
    },
    {
      icon: Wallet,
      title: isAr ? 'الدفع عند الاستلام' : 'Cash on Delivery',
      sub: isAr ? 'ادفع كاش عند استلام الهارد جاهزاً ومفحوصاً' : 'Pay cash when your loaded drive is returned',
    },
  ];

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden border-b border-[var(--border)] pt-32 pb-20 sm:pt-36 sm:pb-24"
    >
      {/* 3D Background Scene */}
      <HeroScene />

      {/* Centered Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[460px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#CCFF00]/[0.07] blur-[140px]"
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* Centered Hero Content */}
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Top Status Pill Badge */}
          <div className="hero-animate mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#CCFF00]/30 bg-[var(--bg-card)]/90 px-4 py-1.5 shadow-sm backdrop-blur-md">
            <span className="h-2.5 w-2.5 rounded-full bg-[#CCFF00] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#CCFF00]">
              {t.availableAcrossCairo}
            </span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="hero-animate text-4xl sm:text-6xl lg:text-[72px] font-black leading-[1.12] tracking-tight text-[var(--text-primary)]">
            {t.heroTitleLine1}{' '}
            <span className="block sm:inline text-[#CCFF00]">
              {t.heroTitleLine2}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-animate mt-6 max-w-2xl text-base sm:text-lg leading-[1.75] text-[var(--text-secondary)]">
            {t.heroSubtitle}
          </p>

          {/* Action Buttons */}
          <div className="hero-animate mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href="#library"
              className="inline-flex h-12 items-center gap-2.5 rounded-full bg-[#CCFF00] px-8 text-sm font-extrabold text-black shadow-lg transition-all hover:bg-[#B8E600] hover:scale-[1.02]"
            >
              <Gamepad2 className="h-4 w-4" />
              <span>{t.browseLibraryBtn}</span>
            </a>

            <Link
              href="/contact"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)]/90 px-6 text-sm font-bold text-[var(--text-primary)] backdrop-blur-md transition-all hover:border-[#CCFF00] hover:text-[#CCFF00]"
            >
              <Headphones className="h-4 w-4 text-[#CCFF00]" />
              <span>{isAr ? 'التواصل مع الدعم الفني' : 'Contact Technical Support'}</span>
            </Link>
          </div>
        </div>

        {/* Balanced 4-Card Highlights Grid */}
        <div className="hero-animate mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group flex items-start gap-3.5 rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)]/90 p-5 backdrop-blur-md transition-all hover:border-[#CCFF00]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#CCFF00]/15 text-[#CCFF00] transition-colors group-hover:bg-[#CCFF00] group-hover:text-black">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
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
