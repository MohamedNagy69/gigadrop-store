'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  PackageSearch,
  Clock,
  RefreshCw,
  CheckCircle2,
  PackageCheck,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { useThemeStore } from '@/stores/themeStore';
import { useAuth } from '@/hooks/useAuth';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const { locale } = useThemeStore();
  const { user: sessionUser } = useAuth();
  const isAr = locale === 'ar';

  const STEPS = [
    { key: 'PENDING', label: isAr ? 'قيد الانتظار' : 'Pending', icon: Clock, emoji: '⏳' },
    { key: 'PROCESSING', label: isAr ? 'جاري التحميل' : 'Processing', icon: RefreshCw, emoji: '🔄' },
    { key: 'READY', label: isAr ? 'جاهز للاستلام' : 'Ready', icon: CheckCircle2, emoji: '✅' },
    { key: 'DELIVERED', label: isAr ? 'تم التوصيل' : 'Delivered', icon: PackageCheck, emoji: '📦' },
  ];

  const initialOrderParam = searchParams.get('order') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrderParam);
  const [phone, setPhone] = useState(sessionUser?.phone || '');
  const [myOrders, setMyOrders] = useState<string[]>([]);
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e?: React.FormEvent, overrideOrderNum?: string) => {
    if (e) e.preventDefault();
    const targetOrder = overrideOrderNum || orderNumber;
    if (!targetOrder.trim()) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: targetOrder, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (isAr ? 'لم يتم العثور على الطلب' : 'Could not find order'));
        setOrder(null);
      } else {
        setOrder(data.order);
      }
    } catch {
      setError(isAr ? 'فشل الاتصال بخادم تتبع الطلبات' : 'Failed to connect to tracking server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionUser?.id) {
      fetch(`/api/orders?userId=${sessionUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.orders) && data.orders.length > 0) {
            const nums = data.orders.map((o: any) => o.orderNumber);
            setMyOrders(nums);
            if (!initialOrderParam) {
              setOrderNumber(nums[0]);
              handleTrack(undefined, nums[0]);
            }
          }
        })
        .catch(() => {});
    }
    if (initialOrderParam) {
      handleTrack(undefined, initialOrderParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionUser?.id]);

  const currentStepIdx = order
    ? STEPS.findIndex((s) => s.key === order.status)
    : -1;

  return (
    <div className="pt-32 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
            <PackageSearch className="h-4 w-4" />
            {isAr ? 'متتبع الطلبات المباشر' : 'REAL-TIME ORDER TRACKER'}
          </span>
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold text-[var(--text-primary)]">
            {isAr ? 'تتبع حالة الهارد الخاص بك' : 'Track Your Drive'}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {isAr
              ? 'أدخل رقم الطلب ورقم الموبايل لمتابعة حالة تحميل الألعاب وتوصيل الهارد لحظة بلحظة.'
              : 'Enter your Order Number and mobile number to check live drive loading status.'}
          </p>
        </div>

        {/* Tracking Form */}
        <form
          onSubmit={handleTrack}
          className="mt-8 rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-xl"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                {isAr ? 'رقم الطلب' : 'Order Number'}
              </label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. GD-2026-00001"
                dir="ltr"
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 text-sm font-mono uppercase text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                {isAr ? 'رقم الموبايل (اختياري للتحقق)' : 'Mobile Number (for verification)'}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 101 234 5678"
                dir="ltr"
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              />
            </div>
          </div>

          {/* Logged-in Customer's Orders Quick-Select */}
          {myOrders.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
              <span>{isAr ? 'طلباتك المسجلة:' : 'Your Orders:'}</span>
              {myOrders.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setOrderNumber(code);
                    handleTrack(undefined, code);
                  }}
                  className="rounded border border-[var(--border)] bg-[var(--bg-primary)] px-2.5 py-1 font-mono text-[11px] font-bold text-[#CCFF00] hover:border-[#CCFF00]"
                >
                  {code}
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-[8px] border border-[#FF4444] bg-[#FF4444]/10 p-3 text-xs font-semibold text-[#FF4444]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-[8px] bg-[#CCFF00] py-3.5 text-sm font-extrabold text-black transition-all hover:bg-[#B8E600]"
          >
            {loading
              ? isAr
                ? 'جاري البحث...'
                : 'Searching...'
              : isAr
              ? 'تتبع الطلب ›'
              : 'Track Order ›'}
          </button>
        </form>

        {/* Tracking Result */}
        {order && (
          <div className="mt-8 rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
              <div>
                <span className="text-xs font-mono font-bold text-[#CCFF00]">
                  {order.orderNumber}
                </span>
                <h2 className="mt-0.5 text-2xl font-bold text-[var(--text-primary)]">
                  {order.customerName}
                </h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  {isAr
                    ? `منطقة التوصيل: ${order.address} · المدة المتوقعة: خلال 24–48 ساعة`
                    : `Delivery Area: ${order.address} · Estimated: Within 24–48h`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`/api/invoices/${order.orderNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#CCFF00] bg-[#CCFF00]/10 px-4 py-2 text-xs font-bold text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black"
                >
                  <FileText className="h-3.5 w-3.5" />
                  {isAr ? 'تحميل الفاتورة PDF' : 'Invoice PDF'}
                </a>
              </div>
            </div>

            {/* Visual Status Timeline (Horizontal Stepper) */}
            <div>
              <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
                {isAr ? 'مراحل حالة الطلب' : 'LIVE STATUS TIMELINE'}
              </span>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {STEPS.map((step, idx) => {
                  const completed = idx <= currentStepIdx;
                  const active = idx === currentStepIdx;
                  return (
                    <div
                      key={step.key}
                      className={`rounded-[12px] border p-4 transition-all ${
                        active
                          ? 'border-[#CCFF00] bg-[#CCFF00]/15 shadow-[0_0_20px_rgba(204,255,0,0.2)]'
                          : completed
                          ? 'border-[#CCFF00]/40 bg-[var(--bg-primary)]'
                          : 'border-[var(--border)] bg-[var(--bg-primary)] opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{step.emoji}</span>
                        {completed && (
                          <span className="h-2.5 w-2.5 rounded-full bg-[#CCFF00]" />
                        )}
                      </div>
                      <p
                        className={`mt-2 text-sm font-bold ${
                          active ? 'text-[#CCFF00]' : 'text-[var(--text-primary)]'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[11px] text-[var(--text-secondary)]">
                        {active
                          ? isAr
                            ? 'المرحلة الحالية'
                            : 'Current stage'
                          : completed
                          ? isAr
                            ? 'مكتملة'
                            : 'Completed'
                          : isAr
                          ? 'القادمة'
                          : 'Upcoming'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ordered Games List */}
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                {isAr
                  ? `الألعاب المطلوبة (${order.items?.length || 0} ألعاب · ${formatNumber(order.totalGB)} جيجا)`
                  : `ORDERED GAMES (${order.items?.length || 0} TITLES · ${formatNumber(order.totalGB)} GB)`}
              </h3>
              <div className="divide-y divide-[var(--border)] rounded-[12px] border border-[var(--border)] bg-[var(--bg-primary)]">
                {order.items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      {item.game?.coverImage && (
                        <img
                          src={item.game.coverImage}
                          alt={item.game.name}
                          className="h-12 w-9 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-[var(--text-primary)]">
                          {item.game?.name}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {formatNumber(item.sizeGB)} {isAr ? 'جيجا' : 'GB'}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-[#CCFF00]">
                      {formatNumber(item.price)} {isAr ? 'ج.م' : 'EGP'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status History Logs */}
            {order.statusHistory?.length > 0 && (
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  {isAr ? 'سجل التحديثات' : 'ACTIVITY LOG'}
                </h3>
                <div className="space-y-2">
                  {order.statusHistory.map((h: any) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-[#CCFF00] px-2 py-0.5 text-[10px] font-bold text-black">
                          {h.status}
                        </span>
                        <span className="text-[var(--text-primary)]">{h.note}</span>
                      </div>
                      <span className="text-[var(--text-muted)]">
                        {new Date(h.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 text-xs text-[var(--text-secondary)]">
              <span className="inline-flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-[#CCFF00]" />
                {isAr ? 'هل تحتاج مساعدة بخصوص هذا الطلب؟' : 'Need help with this order?'}
              </span>
              <Link
                href="/contact"
                className="font-bold text-[#CCFF00] hover:underline"
              >
                {isAr ? 'افتح تذكرة دعم فني ›' : 'Open Support Ticket ›'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="pt-32 pb-20 text-center text-sm text-[var(--text-secondary)]">Loading...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
