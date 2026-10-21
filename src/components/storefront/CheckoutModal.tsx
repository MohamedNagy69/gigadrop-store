'use client';

import React, { useEffect, useState } from 'react';
import {
  X,
  Banknote,
  CheckCircle2,
  Tag,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useThemeStore } from '@/stores/themeStore';
import { useAuth } from '@/hooks/useAuth';
import { CAIRO_DISTRICTS, formatNumber } from '@/lib/utils';
import { translations } from '@/lib/i18n';

export default function CheckoutModal() {
  const {
    items,
    isCheckoutOpen,
    setCheckoutOpen,
    getTotalGB,
    getTotalPrice,
    clearCart,
    setOrderSuccess,
  } = useCartStore();
  const { locale } = useThemeStore();
  const t = translations[locale];
  const isAr = locale === 'ar';
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '+20 10');
  const [email, setEmail] = useState(user?.email || '');
  const [whatsapp, setWhatsapp] = useState(user?.phone || '+20 10');
  const [birthdate, setBirthdate] = useState('');
  const [district, setDistrict] = useState(CAIRO_DISTRICTS[0]);
  const [streetAddress, setStreetAddress] = useState(user?.address || '');
  const [referralCode, setReferralCode] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountLabel, setDiscountLabel] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [referralProgramEnabled, setReferralProgramEnabled] = useState(true);
  const [referralDiscountPercent, setReferralDiscountPercent] = useState(15);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const refFromUrl = params.get('ref');
      if (refFromUrl) {
        localStorage.setItem('gigadrop_ref_code', refFromUrl.trim().toUpperCase());
        setReferralCode(refFromUrl.trim().toUpperCase());
      } else {
        const savedRef = localStorage.getItem('gigadrop_ref_code');
        if (savedRef) setReferralCode(savedRef);
      }
    }

    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setReferralProgramEnabled(data.settings.referralProgramEnabled !== 'false');
          setReferralDiscountPercent(
            parseFloat(data.settings.referralDiscountPercent || '15') || 15
          );
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (
      isCheckoutOpen &&
      referralProgramEnabled &&
      referralCode &&
      discountAmount === 0
    ) {
      const sub = getTotalPrice();
      if (sub > 0) {
        fetch('/api/referrals/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: referralCode, subtotal: sub }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.valid) {
              setDiscountAmount(data.discountAmount || 0);
              setDiscountLabel(
                isAr
                  ? `تم تطبيق لينك/كود الدعوة ${data.referralCode} تلقائياً (-${data.discountPercent}%)`
                  : `Referral link/code ${data.referralCode} auto-applied (-${data.discountPercent}%)`
              );
            }
          })
          .catch(() => {});
      }
    }
  }, [isCheckoutOpen, referralProgramEnabled, referralCode, discountAmount, getTotalPrice, isAr]);

  if (!isCheckoutOpen) return null;

  const totalGB = getTotalGB();
  const subtotal = getTotalPrice();
  const bulkAutoDiscount =
    discountAmount === 0 && totalGB >= 250 ? Number((subtotal * 0.1).toFixed(2)) : 0;
  const effectiveDiscount = discountAmount || bulkAutoDiscount;
  const finalTotal = Math.max(0, Number((subtotal - effectiveDiscount).toFixed(2)));

  const handleValidateCode = async (type: 'promo' | 'referral') => {
    setErrorMsg('');
    const code = type === 'promo' ? promoCode.trim() : referralCode.trim();
    if (!code) return;

    try {
      const endpoint =
        type === 'promo' ? '/api/promo-codes/validate' : '/api/referrals/validate';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || (isAr ? 'الكود غير صالح' : 'Invalid code'));
        return;
      }
      setDiscountAmount(data.discountAmount || 0);
      setDiscountLabel(
        type === 'promo'
          ? isAr
            ? `تم تطبيق الكوبون ${data.code} (-${data.discountAmount} ج.م)`
            : `Promo ${data.code} applied (-${data.discountAmount} EGP)`
          : isAr
          ? `تم تطبيق كود الصديق ${data.referralCode} (-${data.discountPercent || referralDiscountPercent}%)`
          : `Friend code ${data.referralCode} applied (-${data.discountPercent || referralDiscountPercent}%)`
      );
    } catch {
      setErrorMsg(isAr ? 'تعذر التحقق من الكود' : 'Failed to validate code');
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!agreeTerms) {
      setErrorMsg(
        isAr
          ? 'يرجى الموافقة على شروط تسليم واستلام الهارد ديسك.'
          : 'Please confirm the hard disk handover & delivery agreement.'
      );
      return;
    }

    if (items.length === 0) {
      setErrorMsg(isAr ? 'سلة الألعاب فارغة.' : 'Your game cart is empty.');
      return;
    }

    setSubmitting(true);
    try {
      const fullAddress = streetAddress
        ? `${district}, ${streetAddress}`
        : `${district}, Cairo`;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || null,
          customerName,
          phone,
          email,
          whatsapp: whatsapp || phone,
          birthdate: birthdate || null,
          address: fullAddress,
          promoCode: promoCode || undefined,
          referralCode: referralCode || undefined,
          paymentMethod: 'COD',
          items: items.map((i) => ({ gameId: i.id, sizeGB: i.sizeGB })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || (isAr ? 'تعذر إرسال الطلب' : 'Could not submit order'));
        setSubmitting(false);
        return;
      }

      clearCart();
      setOrderSuccess(data.summary);
    } catch {
      setErrorMsg(
        isAr
          ? 'حدث خطأ في الاتصال أثناء إرسال الطلب. حاول مرة أخرى.'
          : 'Network error submitting order. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      {/* Backdrop */}
      <div
        onClick={() => setCheckoutOpen(false)}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 my-8 w-full max-w-2xl overflow-hidden rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between border-b border-[var(--border)] pb-4">
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
              {t.finalStep}
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {t.deliveryDetails}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCheckoutOpen(false)}
            aria-label="Close checkout"
            className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[#CCFF00] hover:text-[var(--text-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="space-y-6">
          {/* Payment Method: Cash on Delivery Only */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
              {isAr ? 'طريقة الدفع المعتمدة' : 'PAYMENT METHOD'}
            </label>
            <div className="flex items-center justify-between rounded-[12px] border border-[#CCFF00] bg-[#CCFF00]/15 p-4 shadow-[0_0_15px_rgba(204,255,0,0.15)]">
              <div className="flex items-center gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#CCFF00] text-black">
                  <Banknote className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-[var(--text-primary)]">
                    {t.codLabel} (Cash on Delivery)
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                    {t.codSub}
                  </p>
                </div>
              </div>
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#CCFF00]" />
            </div>
          </div>

          {/* 2-Column Delivery Details Form */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                {t.fullName}
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={isAr ? 'أحمد حسن' : 'Ahmed Hassan'}
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                {t.mobileNumber}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 101 234 5678"
                dir="ltr"
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                {t.emailAddress}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ahmed@example.com"
                dir="ltr"
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                {t.whatsappNumber}
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+20 101 234 5678"
                dir="ltr"
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                {t.birthdateLabel}
              </label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                {t.cairoDistrict}
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              >
                {CAIRO_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                {t.streetAddress}
              </label>
              <input
                type="text"
                required
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder={
                  isAr
                    ? 'شارع عباس العقاد، بجوار سيتي ستارز بوابة 1'
                    : 'Abbas El-Akkad St, near City Stars Mall Gate 1'
                }
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              />
            </div>

            {/* Friend's Referral Code (Shown only if enabled in Admin) */}
            {referralProgramEnabled && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                  {t.friendReferralCode} (-{referralDiscountPercent}%)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="GIGA-AHMED24"
                    dir="ltr"
                    className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-sm uppercase text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
                  />
                  <button
                    type="button"
                    onClick={() => handleValidateCode('referral')}
                    className="shrink-0 rounded-[8px] border border-[#CCFF00] px-3 py-2 text-xs font-bold text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black"
                  >
                    {t.applyBtn}
                  </button>
                </div>
              </div>
            )}

            {/* Promo Code */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                {t.promoCodeLabel}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="CAIRO25 / GIGA10"
                  dir="ltr"
                  className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-sm uppercase text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
                />
                <button
                  type="button"
                  onClick={() => handleValidateCode('promo')}
                  className="shrink-0 rounded-[8px] border border-[#CCFF00] px-3 py-2 text-xs font-bold text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black"
                >
                  {t.applyBtn}
                </button>
              </div>
            </div>
          </div>

          {discountLabel && (
            <div className="flex items-center gap-2 rounded-[8px] border border-[#CCFF00]/40 bg-[#CCFF00]/10 px-3.5 py-2 text-xs font-semibold text-[#CCFF00]">
              <Tag className="h-3.5 w-3.5" />
              <span>{discountLabel}</span>
            </div>
          )}

          {/* Checkbox Confirmation */}
          <label className="flex cursor-pointer items-start gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--bg-primary)] p-3.5">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#CCFF00]"
            />
            <span className="text-xs leading-relaxed text-[var(--text-secondary)]">
              {t.agreeHardDiskTerms}
            </span>
          </label>

          {errorMsg && (
            <div className="rounded-[8px] border border-[#FF4444] bg-[#FF4444]/10 px-4 py-2.5 text-xs font-semibold text-[#FF4444]">
              {errorMsg}
            </div>
          )}

          {/* Order Summary Bar */}
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--bg-primary)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {items.length} · {formatNumber(totalGB)} {t.gbUnit}
                </span>
                <span className="rounded bg-[#CCFF00]/15 px-2 py-0.5 text-[10px] font-bold text-[#CCFF00]">
                  {isAr ? 'الدفع عند الاستلام (COD)' : 'Cash on Delivery (COD)'}
                </span>
              </div>
              {effectiveDiscount > 0 && (
                <p className="text-xs text-[#CCFF00]">
                  -{formatNumber(effectiveDiscount)} {t.egpCurrency}
                </p>
              )}
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-xs uppercase text-[var(--text-secondary)]">
                {t.totalLabel}
              </span>
              <span className="text-2xl font-extrabold text-[var(--text-primary)]">
                {formatNumber(finalTotal)}
              </span>
              <span className="text-xs font-bold text-[#CCFF00]">
                {t.egpCurrency}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-[8px] bg-[#CCFF00] py-3.5 text-base font-extrabold text-black transition-all hover:bg-[#B8E600] disabled:opacity-50"
          >
            {submitting ? t.submittingOrder : t.submitOrderBtn}
          </button>

          <p className="text-center text-xs text-[var(--text-secondary)]">
            <Sparkles className="me-1 inline h-3.5 w-3.5 text-[#CCFF00]" />
            {t.referralFooterNote}
          </p>
        </form>
      </div>
    </div>
  );
}
