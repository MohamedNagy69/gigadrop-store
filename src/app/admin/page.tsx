'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Paper,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  DollarSign,
  Package,
  Users,
  Gamepad2,
  HardDrive,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { useThemeStore } from '@/stores/themeStore';
import { statusLabelAr } from '@/components/dashboard/DashboardClientViews';

export default function AdminOverviewPage() {
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((resData) => setData(resData));
  }, []);

  const kpis = data?.kpis || {
    totalRevenue: 1301.0,
    totalOrders: 4,
    totalCustomers: 3,
    totalGames: 52,
    avgOrderSizeGB: 256.4,
    conversionRate: 6.8,
  };

  const kpiCards = [
    {
      label: isAr ? 'إجمالي الإيرادات' : 'Total Revenue',
      value: `${formatNumber(kpis.totalRevenue)} ${isAr ? 'ج.م' : 'EGP'}`,
      sub: isAr ? '+18.4% هذا الشهر' : '+18.4% this month',
      icon: DollarSign,
    },
    {
      label: isAr ? 'إجمالي الطلبات' : 'Total Orders',
      value: String(kpis.totalOrders),
      sub: isAr ? 'في جميع أنحاء القاهرة' : 'Across Greater Cairo',
      icon: Package,
    },
    {
      label: isAr ? 'إجمالي العملاء' : 'Total Customers',
      value: String(kpis.totalCustomers),
      sub: isAr ? 'حسابات نشطة' : 'Active accounts',
      icon: Users,
    },
    {
      label: isAr ? 'إجمالي الألعاب' : 'Total Games',
      value: String(kpis.totalGames),
      sub: isAr ? 'متاحة في المكتبة' : 'Active in library',
      icon: Gamepad2,
    },
    {
      label: isAr ? 'متوسط حجم الطلب' : 'Avg Order Size',
      value: `${formatNumber(kpis.avgOrderSizeGB, 1)} ${isAr ? 'جيجا' : 'GB'}`,
      sub: isAr ? 'لكل هارد ديسك' : 'Per hard disk load',
      icon: HardDrive,
    },
    {
      label: isAr ? 'معدل التحويل' : 'Conversion Rate',
      value: `${kpis.conversionRate}%`,
      sub: isAr ? 'إتمام الشراء في المتجر' : 'Storefront checkout',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
            {isAr ? 'مركز قيادة المتجر' : 'MERCHANT COMMAND CENTER'}
          </span>
          <Typography variant="h4" fontWeight={800}>
            {isAr ? 'نظرة عامة والإحصائيات' : 'Dashboard Overview'}
          </Typography>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/games/new"
            className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#CCFF00] px-4 py-2.5 text-xs font-extrabold text-black hover:bg-[#B8E600]"
          >
            <Plus className="h-4 w-4" />
            {isAr ? 'إضافة لعبة جديدة' : 'Add New Game'}
          </Link>
        </div>
      </div>

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <Paper key={card.label} sx={{ p: 2.5, borderRadius: 3 }}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase text-[var(--text-secondary)]">
                  {card.label}
                </span>
                <Icon className="h-4 w-4 text-[#CCFF00]" />
              </div>
              <p className="mt-2 text-2xl font-extrabold text-[var(--text-primary)]">
                {card.value}
              </p>
              <span className="mt-1 block text-[11px] text-[#CCFF00]">
                {card.sub}
              </span>
            </Paper>
          );
        })}
      </div>

      {/* Charts Row: Revenue Trend + Orders by Status */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Paper sx={{ p: 3.5, borderRadius: 3 }} className="lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
            <div>
              <Typography variant="h6" fontWeight={800}>
                {isAr
                  ? 'اتجاه الإيرادات (آخر 7 أيام — ج.م)'
                  : 'Revenue Trend (Last 7 Days — EGP)'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isAr
                  ? 'مؤشر المبيعات اليومية لتحميل الهاردات في القاهرة'
                  : 'Daily hard drive loading revenue across Cairo'}
              </Typography>
            </div>
            <span className="rounded-full border border-[#CCFF00]/40 bg-[#CCFF00]/10 px-3 py-1 text-xs font-extrabold text-[#CCFF00]">
              {isAr ? 'نمو مستمر +18.4%' : '+18.4% Weekly Growth'}
            </span>
          </div>

          {(() => {
            const trend = data?.revenueTrend || [
              { day: 'Day 1', revenue: 420 },
              { day: 'Day 2', revenue: 685 },
              { day: 'Day 3', revenue: 510 },
              { day: 'Day 4', revenue: 890 },
              { day: 'Day 5', revenue: 740 },
              { day: 'Day 6', revenue: 1120 },
              { day: 'Today', revenue: 1269.53 },
            ];
            const maxRev = Math.max(...trend.map((d: any) => Number(d.revenue) || 0), 1400);

            const dayNameAr: Record<string, string> = {
              'Day 1': 'اليوم 1',
              'Day 2': 'اليوم 2',
              'Day 3': 'اليوم 3',
              'Day 4': 'اليوم 4',
              'Day 5': 'اليوم 5',
              'Day 6': 'أمس',
              Today: 'اليوم',
            };

            return (
              <div className="relative mt-5 rounded-[14px] border border-[var(--border)] bg-[var(--bg-primary)]/60 p-4 sm:p-5">
                {/* Subtle Background Grid Lines */}
                <div className="pointer-events-none absolute inset-x-5 top-12 bottom-12 flex flex-col justify-between">
                  {[0, 1, 2, 3].map((line) => (
                    <div
                      key={line}
                      className="w-full border-b border-dashed border-[var(--border)]/70"
                    />
                  ))}
                </div>

                {/* Bars Row */}
                <div className="relative z-10 grid grid-cols-7 gap-2.5 sm:gap-4 items-end">
                  {trend.map((pt: any, idx: number) => {
                    const val = Number(pt.revenue) || 0;
                    const barHeightPx = Math.round(
                      Math.max(24, Math.min(148, (val / maxRev) * 148))
                    );
                    const isToday = pt.day === 'Today' || idx === trend.length - 1;

                    return (
                      <div
                        key={pt.day}
                        className="group flex flex-col items-center gap-2"
                      >
                        {/* Value Pill */}
                        <span
                          className={`rounded px-1.5 py-0.5 font-mono text-[10px] sm:text-xs font-extrabold transition-transform group-hover:-translate-y-0.5 ${
                            isToday
                              ? 'bg-[#CCFF00] text-black shadow-sm'
                              : 'text-[#CCFF00]'
                          }`}
                        >
                          {formatNumber(val)}
                        </span>

                        {/* Bar Track + Filled Bar */}
                        <div className="flex h-[150px] w-full max-w-[48px] items-end justify-center rounded-[10px] bg-[var(--bg-card)]/80 p-1 border border-[var(--border)]/60">
                          <div
                            style={{ height: `${barHeightPx}px` }}
                            className={`w-full rounded-[7px] transition-all duration-500 group-hover:brightness-110 ${
                              isToday
                                ? 'bg-[#CCFF00] shadow-[0_0_18px_rgba(204,255,0,0.35)]'
                                : 'bg-gradient-to-t from-[#CCFF00]/35 via-[#CCFF00]/75 to-[#CCFF00]'
                            }`}
                          />
                        </div>

                        {/* Day Label */}
                        <span
                          className={`text-[11px] font-bold ${
                            isToday
                              ? 'text-[#CCFF00]'
                              : 'text-[var(--text-secondary)]'
                          }`}
                        >
                          {isAr ? dayNameAr[pt.day] || pt.day : pt.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </Paper>

        <Paper sx={{ p: 3.5, borderRadius: 3 }} className="lg:col-span-4">
          <Typography variant="h6" fontWeight={700}>
            {isAr ? 'الطلبات حسب الحالة' : 'Orders by Status'}
          </Typography>
          <div className="mt-5 space-y-3">
            {Object.entries(
              data?.statusCounts || {
                PENDING: 1,
                PROCESSING: 1,
                READY: 1,
                DELIVERED: 1,
                CANCELLED: 0,
              }
            ).map(([status, count]: any) => (
              <div key={status} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{statusLabelAr(status, isAr)}</span>
                  <span className="text-[#CCFF00]">
                    {count} {isAr ? 'طلبات' : 'orders'}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-primary)]">
                  <div
                    style={{ width: `${Math.max(12, count * 25)}%` }}
                    className="h-full rounded-full bg-[#CCFF00]"
                  />
                </div>
              </div>
            ))}
          </div>
        </Paper>
      </div>

      {/* Top Selling Games & Recent Orders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Paper sx={{ p: 3, borderRadius: 3 }} className="lg:col-span-5">
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            {isAr ? 'الألعاب الأكثر طلباً' : 'Top Selling Games'}
          </Typography>
          <div className="space-y-3">
            {(data?.topGames || []).slice(0, 6).map((g: any, idx: number) => (
              <div
                key={g.id}
                className="flex items-center justify-between rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] p-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-[#CCFF00] font-black text-black">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-bold text-[var(--text-primary)]">{g.name}</p>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      {g.sizeGB} {isAr ? 'جيجا' : 'GB'} · {g.ordersCount}{' '}
                      {isAr ? 'طلبات' : 'orders'}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-[#CCFF00]">
                  {formatNumber(g.revenue)} {isAr ? 'ج.م' : 'EGP'}
                </span>
              </div>
            ))}
          </div>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 3 }} className="lg:col-span-7">
          <div className="mb-3 flex items-center justify-between">
            <Typography variant="h6" fontWeight={700}>
              {isAr ? 'أحدث الطلبات' : 'Recent Orders'}
            </Typography>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#CCFF00] hover:underline"
            >
              {isAr ? 'إدارة كل الطلبات ›' : 'Manage All Orders ›'}
            </Link>
          </div>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                    {isAr ? 'الطلب' : 'Order'}
                  </TableCell>
                  <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                    {isAr ? 'العميل' : 'Customer'}
                  </TableCell>
                  <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                    {isAr ? 'المساحة' : 'Data'}
                  </TableCell>
                  <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                    {isAr ? 'الدفع' : 'Payment'}
                  </TableCell>
                  <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                    {isAr ? 'الحالة' : 'Status'}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data?.recentOrders || []).map((o: any) => (
                  <TableRow key={o.id} hover>
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="text-[#CCFF00] hover:underline"
                      >
                        {o.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{o.customerName}</TableCell>
                    <TableCell>
                      {formatNumber(o.totalGB)} {isAr ? 'جيجا' : 'GB'}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs">
                        {o.paymentMethod} · <strong>{o.paymentStatus}</strong>
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabelAr(o.status, isAr)}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(204,255,0,0.18)',
                          color: '#CCFF00',
                          fontWeight: 700,
                          fontSize: '10px',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
}
