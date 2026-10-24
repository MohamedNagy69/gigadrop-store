'use client';

import React from 'react';
import { HardDrive, ShieldCheck, Zap, Truck } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

export default function AboutPage() {
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';

  const values = [
    {
      icon: Zap,
      title: isAr ? 'وداعاً لانتهاء باقة الإنترنت' : 'Zero Internet Quota Wasted',
      desc: isAr
        ? 'في مصر، تحميل لعبة واحدة بحجم 150 جيجا يستهلك نصف باقة الإنترنت المنزلية الشهرية. نحن نوفر لك الألعاب مباشرة بدون استهلاك جيجا واحدة من باقتك.'
        : 'In Egypt, downloading a single 150 GB AAA release consumes half your monthly home internet package. We eliminate bandwidth limits completely.',
    },
    {
      icon: HardDrive,
      title: isAr ? '1.00 جنيه لكل جيجابايت' : '1.00 EGP Per Gigabyte',
      desc: isAr
        ? 'تسعير واضح وعادل بالكامل. سواء طلبت 50 جيجا أو 1,000 جيجا من الألعاب، تدفع فقط مقابل المساحة الفعلية التي يتم نقلها على الهارد الخاص بك.'
        : 'Transparent, flat-rate pricing. Whether you order 50 GB or 1,000 GB of games, you only pay for the exact data loaded onto your drive.',
    },
    {
      icon: ShieldCheck,
      title: isAr ? 'ملفات مفحوصة SHA-256 وعناية فائقة بالهارد' : 'SHA-256 Verified & Safe Drive Care',
      desc: isAr
        ? 'كل هارد ديسك أو SSD يتم حفظه في غلاف مضاد للكهرباء الاستاتيكية، وفحصه قبل وبعد النقل للتأكد من سلامة الملفات بنسبة 100%.'
        : 'Every hard disk or SSD is sealed in anti-static protection, scanned before and after transfer, and verified for 100% file integrity.',
    },
    {
      icon: Truck,
      title: isAr ? 'توصيل سريع في القاهرة خلال 1–2 يوم' : '1–2 Days Cairo Courier',
      desc: isAr
        ? 'مندوبونا في القاهرة يقابلونك في أقرب نقطة لك في مدينة نصر، المعادي، التجمع، مصر الجديدة، الزمالك، والشيخ زايد وأكتوبر.'
        : 'Our dedicated Cairo couriers meet you at your preferred landmark across Nasr City, Maadi, New Cairo, Heliopolis, Zamalek, and October.',
    },
  ];

  return (
    <div className="pt-32 pb-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
            {isAr ? 'عن GIGADROP' : 'ABOUT GIGADROP'}
          </span>
          <h1 className="mt-2 text-4xl sm:text-6xl font-bold tracking-tight text-[var(--text-primary)]">
            {isAr
              ? 'صُمم للاعبي الكمبيوتر في القاهرة لتجاوز حدود باقات الإنترنت.'
              : 'Built for Cairo gamers tired of quota limits.'}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[var(--text-secondary)]">
            {isAr
              ? 'ألعاب الكمبيوتر الحديثة تتجاوز أحجامها 100 إلى 175 جيجابايت بسهولة. انطلقت GIGADROP في القاهرة لتمنح لاعبي الـ PC وصولاً فورياً لأقوى الألعاب العالمية دون الانتظار لأيام على سرعات التحميل البطيئة أو شراء باقات إضافية مكلفة.'
              : "Modern PC games routinely exceed 100 to 175 gigabytes. GIGADROP was born in Cairo to give PC gamers instant access to the world's biggest titles without waiting days on slow connections or burning expensive ISP data add-ons."}
          </p>
        </div>

        {/* Why GIGADROP Value Propositions */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
            {isAr ? 'لماذا GIGADROP؟' : 'WHY GIGADROP?'}
          </span>
          <h2 className="mt-1 text-3xl font-bold text-[var(--text-primary)]">
            {isAr ? 'الطريقة الأذكى والأوفر لتحميل مكتبة ألعابك' : 'The smarter way to load your library'}
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)] p-6"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#CCFF00]/15 text-[#CCFF00]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
