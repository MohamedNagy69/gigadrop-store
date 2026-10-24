'use client';

import React from 'react';
import { ShoppingCart, HardDrive, CheckCircle2 } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { translations } from '@/lib/i18n';

export default function HowItWorks() {
  const { locale } = useThemeStore();
  const t = translations[locale];
  const isAr = locale === 'ar';

  const steps = [
    {
      num: '01',
      icon: ShoppingCart,
      title: t.step1Title,
      desc: t.step1Desc,
    },
    {
      num: '02',
      icon: HardDrive,
      title: t.step2Title,
      desc: t.step2Desc,
    },
    {
      num: '03',
      icon: CheckCircle2,
      title: t.step3Title,
      desc: t.step3Desc,
    },
  ];

  return (
    <section id="how-it-works" className="py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-8 sm:p-14">
          {/* Large "G" Watermark */}
          <div
            aria-hidden="true"
            className="pointer-events-none select-none absolute -bottom-16 right-6 text-[280px] font-black leading-none text-[#CCFF00]/[0.04]"
          >
            G
          </div>

          <div className="relative z-10">
            <span className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
              {t.howItWorksLabel}
            </span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
              {t.howItWorksTitle}
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="group relative rounded-[12px] border border-[var(--border)] bg-[var(--bg-primary)]/80 p-6 transition-all duration-300 hover:border-[#CCFF00]/60"
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#CCFF00]/15 text-[#CCFF00] transition-colors group-hover:bg-[#CCFF00] group-hover:text-black">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="font-mono text-2xl font-extrabold text-[#CCFF00]">
                        {step.num}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* New Hard Drives Store Option Banner */}
            <div className="mt-8 rounded-[12px] border border-[#CCFF00]/40 bg-[#CCFF00]/10 p-5 sm:p-6 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#CCFF00] text-black shadow-md">
                    <HardDrive className="h-6 w-6" />
                  </span>
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-[var(--text-primary)]">
                      {isAr
                        ? 'لا تملك هارد ديسك كافي؟ نوفر لك هاردات جديدة أصلية ومضمونة!'
                        : 'Don’t have a drive? We provide brand-new verified hard drives!'}
                    </h4>
                    <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      {isAr
                        ? 'يمكنك اختيار (شراء هارد جديد) عند إتمام الطلب، وسيتم فتح محادثة شات مباشرة مع الإدارة في لوحة تحكمك لاختيار سعة الهارد المناسبة لك (SSD أو HDD) ودفع ثمن الهارد أولاً، ثم نملأه بألعابك المفضلة!'
                        : 'Select "Buy New Hard Drive" at checkout. A live chat opens in your dashboard to agree on the drive model, pricing, and upfront payment before games are loaded!'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
