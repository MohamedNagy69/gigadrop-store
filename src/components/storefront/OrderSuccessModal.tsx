'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, FileText, PackageSearch, MessageSquare, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useThemeStore } from '@/stores/themeStore';
import { translations } from '@/lib/i18n';
import { formatNumber } from '@/lib/utils';

export default function OrderSuccessModal() {
  const { orderSuccess, setOrderSuccess } = useCartStore();
  const { locale } = useThemeStore();
  const t = translations[locale];
  const isAr = locale === 'ar';

  if (!orderSuccess) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred bg */}
      <div
        onClick={() => setOrderSuccess(null)}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Centered Card */}
      <div className="relative z-10 w-full max-w-md rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center shadow-2xl">
        {/* Large Lime Checkmark Circle Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#CCFF00] text-black shadow-[0_0_30px_rgba(204,255,0,0.4)]">
          <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
        </div>

        <span className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
          {t.orderSuccessLabel}
        </span>

        <h2 className="mt-1 text-3xl font-bold text-[var(--text-primary)]">
          {t.yourGamesAreQueued}
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          {t.orderSuccessDesc}
        </p>

        {/* Order Details Box */}
        <div className="mt-6 rounded-[12px] border border-[var(--border)] bg-[var(--bg-primary)] p-4 text-start space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-secondary)]">{t.orderNumberLabel}</span>
            <span className="font-mono font-bold text-[#CCFF00]">
              {orderSuccess.orderNumber}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-secondary)]">{t.totalData}</span>
            <span className="font-semibold text-[var(--text-primary)]">
              {orderSuccess.gamesCount} · {formatNumber(orderSuccess.totalGB)} {t.gbUnit}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-secondary)]">{t.paymentMethodLabel}</span>
            <span className="font-semibold text-[var(--text-primary)]">
              {isAr ? 'الدفع عند الاستلام (الألعاب)' : 'Cash on Delivery (Games)'}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-[var(--border)] pt-2 text-sm">
            <span className="font-bold text-[var(--text-secondary)]">{t.totalAmountLabel}</span>
            <span className="font-extrabold text-[#CCFF00]">
              {formatNumber(orderSuccess.totalPrice)} {t.egpCurrency}
            </span>
          </div>
        </div>

        {/* Hard Drive Chat Prompt if customer requested buying a new drive */}
        {orderSuccess.withHardDrive && (
          <div className="mt-5 rounded-[12px] border border-[#CCFF00] bg-[#CCFF00]/15 p-4 text-start shadow-[0_0_20px_rgba(204,255,0,0.15)]">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-[#CCFF00]">
              <ShoppingBag className="h-4 w-4" />
              <span>{isAr ? 'طلب شراء هارد ديسك جديد مع الألعاب' : 'NEW HARD DRIVE ORDER'}</span>
            </div>
            <p className="mt-1.5 text-xs text-[var(--text-primary)] leading-relaxed font-medium">
              {isAr
                ? 'تم فتح شات مباشر مع الإدارة في الداش بورد الخاص بك للاتفاق على مواصفات الهارد وسعره، ودفع ثمن الهارد أولاً قبل بدء التحميل.'
                : 'A live support chat has been opened in your dashboard to coordinate drive specifications and upfront payment.'}
            </p>
            <Link
              href={`/dashboard/support${orderSuccess.ticketId ? `?ticketId=${orderSuccess.ticketId}` : ''}`}
              onClick={() => setOrderSuccess(null)}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#CCFF00] px-4 py-2.5 text-xs font-black text-black shadow-md transition-all hover:bg-[#B8E600]"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{isAr ? 'فتح الشات للاتفاق ودفع ثمن الهارد الآن ›' : 'Open Support Chat & Pay for Drive Now ›'}</span>
            </Link>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => setOrderSuccess(null)}
            className="w-full rounded-[8px] bg-[#CCFF00] py-3 text-sm font-extrabold text-black transition-all hover:bg-[#B8E600]"
          >
            {t.backToGamesBtn}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/track?order=${encodeURIComponent(orderSuccess.orderNumber)}`}
              onClick={() => setOrderSuccess(null)}
              className="inline-flex items-center justify-center gap-1.5 rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] py-2.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[#CCFF00]"
            >
              <PackageSearch className="h-3.5 w-3.5 text-[#CCFF00]" />
              {t.trackOrder}
            </Link>
            <a
              href={`/api/invoices/${orderSuccess.orderNumber}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] py-2.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[#CCFF00]"
            >
              <FileText className="h-3.5 w-3.5 text-[#CCFF00]" />
              {t.invoicePdfBtn}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
