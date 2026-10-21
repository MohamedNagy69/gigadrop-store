'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Paper, Typography, Chip } from '@mui/material';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { useThemeStore } from '@/stores/themeStore';
import { statusLabelAr } from '@/components/dashboard/DashboardClientViews';

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const customerId = params.id as string;
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const [customer, setCustomer] = useState<any | null>(null);

  useEffect(() => {
    fetch(`/api/customers/${customerId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.customer) setCustomer(data.customer);
      });
  }, [customerId]);

  if (!customer)
    return (
      <div className="p-8">
        {isAr ? 'جاري تحميل ملف العميل...' : 'Loading customer profile...'}
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[#CCFF00]"
      >
        <BackIcon className="h-4 w-4" />
        {isAr ? 'العودة إلى قائمة العملاء' : 'Back to Customers'}
      </Link>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div>
            <span className="font-mono text-xs font-bold text-[#CCFF00]">
              {isAr ? 'كود الإحالة: ' : 'Referral Code: '}
              {customer.referralCode}
            </span>
            <Typography variant="h5" fontWeight={800}>
              {customer.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {customer.email} · {customer.phone} · {customer.address}
            </Typography>
          </div>
          <Chip
            label={
              isAr
                ? customer.isActive
                  ? 'حساب نشط'
                  : 'حساب معطل'
                : customer.isActive
                ? 'ACTIVE ACCOUNT'
                : 'DISABLED'
            }
            sx={{ bgcolor: '#CCFF00', color: '#000', fontWeight: 800 }}
          />
        </div>

        <div className="mt-6">
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            {isAr
              ? `سجل الطلبات (${customer.orders?.length || 0})`
              : `Order History (${customer.orders?.length || 0})`}
          </Typography>
          <div className="space-y-3">
            {customer.orders?.map((o: any) => (
              <div
                key={o.id}
                className="flex items-center justify-between rounded-[10px] border border-[var(--border)] bg-[var(--bg-primary)] p-4 text-xs"
              >
                <div>
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="font-mono font-bold text-[#CCFF00] hover:underline"
                  >
                    {o.orderNumber}
                  </Link>
                  <p className="mt-0.5 text-[var(--text-secondary)]">
                    {o.items?.length || 0} {isAr ? 'ألعاب' : 'games'} ·{' '}
                    {formatNumber(o.totalGB)} {isAr ? 'جيجا' : 'GB'}
                  </p>
                </div>
                <div className="text-end">
                  <span className="block font-bold text-[var(--text-primary)]">
                    {formatNumber(o.totalPrice)} {isAr ? 'ج.م' : 'EGP'}
                  </span>
                  <span className="text-[10px] text-[#CCFF00]">
                    {statusLabelAr(o.status, isAr)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Paper>
    </div>
  );
}
