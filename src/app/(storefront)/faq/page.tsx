'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

const FAQ_DATA_EN = [
  {
    category: 'Ordering',
    q: 'How is the price calculated?',
    a: 'Every game is priced strictly by its storage size at 1.00 EGP per Gigabyte (GB). For example, a 75 GB game costs 75.00 EGP. Orders over 250 GB automatically receive a 10% bulk discount.',
  },
  {
    category: 'Delivery',
    q: 'How do I hand over my hard disk?',
    a: 'Once you submit your order, our courier team contacts you via phone/WhatsApp to arrange a convenient pickup point in your Cairo district. You hand over your external HDD, SSD, or NVMe enclosure and receive a tamper-evident receipt tag.',
  },
  {
    category: 'Payment',
    q: 'What payment methods are supported?',
    a: 'All orders are paid via Cash on Delivery (COD) when your loaded hard drive is returned to you.',
  },
  {
    category: 'Technical',
    q: 'Are the game files safe and verified?',
    a: 'Yes! Every title in our library is checksum-verified (SHA-256) and scanned with enterprise antivirus before being copied onto your drive over high-speed USB 3.2 / Thunderbolt.',
  },
  {
    category: 'Refunds',
    q: 'What if a game does not run on my PC?',
    a: 'If any file is corrupted during transfer, we re-load it for free or credit the full GB value toward your next order.',
  },
];

const FAQ_DATA_AR = [
  {
    category: 'الطلبات والأسعار',
    q: 'كيف يتم حساب سعر الألعاب؟',
    a: 'يتم تسعير كل لعبة حسب مساحتها الفعلية بسعر 1.00 جنيه لكل جيجابايت. على سبيل المثال، لعبة بحجم 75 جيجا تكلفتها 75 جنيه فقط. الطلبات التي تتجاوز 250 جيجا تحصل تلقائياً على خصم 10%.',
  },
  {
    category: 'الاستلام والتوصيل',
    q: 'كيف أقوم بتسليم الهارد ديسك واستلامه؟',
    a: 'بمجرد تأكيد طلبك، يتواصل معك مندوبنا عبر الهاتف أو الواتساب لتحديد نقطة وموعد الاستلام في منطقتك بالقاهرة. تستلم إيصال استلام رسمي برقم تسلسلي، ويعود إليك الهارد محملاً بالألعاب خلال 24 إلى 48 ساعة.',
  },
  {
    category: 'طرق الدفع',
    q: 'ما هي وسائل الدفع المتاحة؟',
    a: 'يتم الدفع نقداً عند الاستلام (Cash on Delivery) فقط عند استلام الهارد الخاص بك محملاً بالألعاب وجاهزاً للتشغيل.',
  },
  {
    category: 'الفحص والأمان',
    q: 'هل ملفات الألعاب آمنة ومفحوصة بالكامل؟',
    a: 'نعم بالتأكيد! جميع الألعاب في مكتبتنا مفحوصة ببصمة SHA-256 ومفحوصة ببرامج الحماية قبل نسخها على الهارد الخاص بك عبر منافذ USB 3.2 / Thunderbolt فائقة السرعة.',
  },
  {
    category: 'الضمان والاستبدال',
    q: 'ماذا لو واجهت مشكلة في تشغيل لعبة؟',
    a: 'إذا حدث أي تلف في أي ملف أثناء النقل، نقوم بإعادة تحميلها لك مجاناً أو إضافة رصيد بقيمة الجيجابايت كاملة لطلبك القادم.',
  },
];

export default function FAQPage() {
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';

  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const data = isAr ? FAQ_DATA_AR : FAQ_DATA_EN;

  const filtered = data.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
          {isAr ? 'مركز المساعدة' : 'HELP CENTER'}
        </span>
        <h1 className="mt-1 text-4xl sm:text-5xl font-bold text-[var(--text-primary)]">
          {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
        </h1>

        <div className="relative mt-6">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isAr
                ? 'ابحث في الأسئلة (الأسعار، التوصيل، الدفع، الأمان)...'
                : 'Search questions (Ordering, Payment, Delivery, Technical)...'
            }
            className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-card)] py-3 ps-10 pe-4 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
          />
        </div>

        <div className="mt-8 space-y-3">
          {filtered.map((item, idx) => {
            const open = openIndex === idx;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-start"
                >
                  <div>
                    <span className="rounded bg-[#CCFF00]/15 px-2 py-0.5 text-[10px] font-bold uppercase text-[#CCFF00]">
                      {item.category}
                    </span>
                    <h3 className="mt-1.5 text-base font-bold text-[var(--text-primary)]">
                      {item.q}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#CCFF00] transition-transform ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {open && (
                  <div className="border-t border-[var(--border)] px-5 py-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)] p-6 text-center">
          <h3 className="text-lg font-bold text-[var(--text-primary)]">
            {isAr ? 'هل لديك استفسار آخر؟' : 'Still have questions?'}
          </h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {isAr
              ? 'فريق الدعم الفني في القاهرة جاهز لمساعدتك عبر التذاكر أو الواتساب.'
              : 'Our Cairo support team is ready to help via ticket or WhatsApp.'}
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-block rounded-[8px] bg-[#CCFF00] px-6 py-2.5 text-xs font-extrabold text-black"
          >
            {isAr ? 'تواصل مع الدعم الفني ›' : 'Contact Support ›'}
          </Link>
        </div>
      </div>
    </div>
  );
}
