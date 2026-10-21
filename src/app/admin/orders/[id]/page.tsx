'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Paper, Typography, Chip } from '@mui/material';
import {
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { formatNumber, getWhatsAppUrl } from '@/lib/utils';
import { useThemeStore } from '@/stores/themeStore';
import { statusLabelAr } from '@/components/dashboard/DashboardClientViews';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const [order, setOrder] = useState<any | null>(null);
  const [status, setStatus] = useState('PENDING');
  const [paymentStatus, setPaymentStatus] = useState('PENDING');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  const loadOrder = async () => {
    const res = await fetch(`/api/orders/${orderId}`);
    const data = await res.json();
    if (data.order) {
      setOrder(data.order);
      setStatus(data.order.status);
      setPaymentStatus(data.order.paymentStatus);
      setNotes(data.order.notes || '');
    }
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        paymentStatus,
        note: note || `Updated to ${status}`,
        notes,
        changedBy: 'Mohamed Admin',
      }),
    });
    setNote('');
    setSavedMsg(
      isAr
        ? 'تم تحديث حالة الطلب والدفع وإرسال إشعار للعميل بنجاح!'
        : 'Order status & payment updated and WhatsApp notification logged!'
    );
    loadOrder();
    setTimeout(() => setSavedMsg(''), 4000);
  };

  if (!order) {
    return (
      <div className="p-8">
        {isAr ? 'جاري تحميل تفاصيل الطلب...' : 'Loading order details...'}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[#CCFF00]"
      >
        <BackIcon className="h-4 w-4" />
        {isAr ? 'العودة إلى إدارة الطلبات' : 'Back to Order Management'}
      </Link>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div>
            <span className="font-mono text-xs font-bold text-[#CCFF00]">
              {order.orderNumber}
            </span>
            <Typography variant="h5" fontWeight={800}>
              {isAr ? `العميل: ${order.customerName}` : `Customer: ${order.customerName}`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isAr ? 'الهاتف: ' : 'Phone: '}
              {order.phone} · {isAr ? 'البريد: ' : 'Email: '}
              {order.email} · {isAr ? 'المنطقة: ' : 'District: '}
              {order.address}
            </Typography>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={getWhatsAppUrl(
                order.whatsapp || order.phone,
                `Hi ${order.customerName}! Your GIGADROP order ${order.orderNumber} (${order.totalGB} GB) is now ${order.status}.`
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#CCFF00] px-4 py-2 text-xs font-extrabold text-black"
            >
              <MessageCircle className="h-4 w-4" />
              {isAr ? 'مراسلة العميل واتساب' : 'WhatsApp Customer'}
            </a>
            <a
              href={`/api/invoices/${order.orderNumber}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#CCFF00] px-4 py-2 text-xs font-bold text-[#CCFF00]"
            >
              <FileText className="h-4 w-4" />
              {isAr ? 'إصدار فاتورة PDF' : 'Generate Invoice'}
            </a>
          </div>
        </div>

        {savedMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-[8px] border border-[#CCFF00] bg-[#CCFF00]/10 p-3 text-xs font-bold text-[#CCFF00]">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{savedMsg}</span>
          </div>
        )}

        {/* Admin Status & Payment Control Form */}
        <form
          onSubmit={handleUpdateOrder}
          className="mt-6 grid grid-cols-1 gap-4 rounded-[12px] border border-[var(--border)] bg-[var(--bg-primary)] p-5 sm:grid-cols-3"
        >
          <div>
            <label className="mb-1 block text-xs font-bold text-[#CCFF00]">
              {isAr ? 'حالة الطلب' : 'Order Status'}
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
            >
              {['PENDING', 'PROCESSING', 'READY', 'DELIVERED', 'CANCELLED'].map(
                (s) => (
                  <option key={s} value={s}>
                    {statusLabelAr(s, isAr)}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#CCFF00]">
              {isAr
                ? `حالة الدفع (${order.paymentMethod})`
                : `Payment Status (${order.paymentMethod})`}
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
            >
              {['PENDING', 'AWAITING_PAYMENT', 'PAID', 'FAILED', 'REFUNDED'].map(
                (p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#CCFF00]">
              {isAr ? 'ملاحظة سجل الحالة' : 'Timeline Note'}
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                isAr ? 'مثال: تم تسليم الهارد للمندوب' : 'e.g. Drive handed to courier'
              }
              className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs text-[var(--text-secondary)]">
              {isAr
                ? 'ملاحظات الأدمن الداخلية (الرقم التسلسلي للهارد / بيانات المندوب)'
                : 'Internal Admin Notes (Drive Serial / Courier Info)'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isAr ? 'ملاحظات داخلية...' : 'Internal notes...'}
              className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-[8px] bg-[#CCFF00] py-2.5 text-xs font-extrabold text-black hover:bg-[#B8E600]"
            >
              {isAr ? 'تحديث الطلب وإشعار العميل ›' : 'Update Order & Notify ›'}
            </button>
          </div>
        </form>

        {/* Games List */}
        <div className="mt-6">
          <Typography variant="subtitle2" sx={{ mb: 2, color: '#CCFF00' }}>
            {isAr
              ? `الألعاب المطلوبة (${order.items?.length} ألعاب · ${formatNumber(order.totalGB)} جيجا · ${formatNumber(order.totalPrice)} ج.م)`
              : `ORDERED GAMES (${order.items?.length} TITLES · ${formatNumber(order.totalGB)} GB · ${formatNumber(order.totalPrice)} EGP)`}
          </Typography>
          <div className="divide-y divide-[var(--border)] rounded-[12px] border border-[var(--border)] bg-[var(--bg-primary)]">
            {order.items?.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 text-sm"
              >
                <span className="font-bold">{item.game?.name}</span>
                <span className="font-mono text-xs text-[#CCFF00]">
                  {formatNumber(item.sizeGB)} {isAr ? 'جيجا' : 'GB'} (
                  {formatNumber(item.price)} {isAr ? 'ج.م' : 'EGP'})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status History */}
        <div className="mt-6">
          <Typography variant="subtitle2" sx={{ mb: 2, color: '#CCFF00' }}>
            {isAr ? 'سجل تتبع حالات الطلب' : 'STATUS AUDIT TRAIL'}
          </Typography>
          <div className="space-y-2">
            {order.statusHistory?.map((h: any) => (
              <div
                key={h.id}
                className="flex items-center justify-between rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2 text-xs"
              >
                <div>
                  <Chip
                    label={statusLabelAr(h.status, isAr)}
                    size="small"
                    sx={{
                      me: 1.5,
                      height: 20,
                      fontSize: '10px',
                      bgcolor: '#CCFF00',
                      color: '#000',
                      fontWeight: 800,
                    }}
                  />
                  <span>{h.note}</span>
                  <span className="ms-2 text-[var(--text-muted)]">
                    {isAr ? 'بواسطة' : 'by'} {h.changedBy || 'System'}
                  </span>
                </div>
                <span className="text-[var(--text-muted)]">
                  {new Date(h.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Paper>
    </div>
  );
}
