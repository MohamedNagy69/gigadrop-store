'use client';

import React, { useEffect, useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { Download, MapPin } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { useThemeStore } from '@/stores/themeStore';

export default function AdminAnalyticsPage() {
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';

  const [data, setData] = useState<any | null>(null);
  const [range, setRange] = useState('30d');

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((d) => setData(d));
  }, []);

  const handleExportReport = () => {
    if (!data) return;
    const csv = [
      'Metric,Value',
      `Total Revenue EGP,${data.kpis.totalRevenue}`,
      `Total Orders,${data.kpis.totalOrders}`,
      `Total GB Loaded,${data.kpis.totalGBSold}`,
      `Average Order Size GB,${data.kpis.avgOrderSizeGB}`,
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gigadrop-analytics-${range}.csv`;
    a.click();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
            {isAr ? 'ذكاء الأعمال والإحصائيات' : 'BUSINESS INTELLIGENCE'}
          </span>
          <Typography variant="h4" fontWeight={800}>
            {isAr ? 'التقارير والتحليلات' : 'Analytics & Reports'}
          </Typography>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="rounded-[8px] border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-xs font-bold text-[var(--text-primary)] outline-none"
          >
            <option value="7d">{isAr ? 'آخر 7 أيام' : 'Last 7 Days'}</option>
            <option value="30d">{isAr ? 'آخر 30 يوماً' : 'Last 30 Days'}</option>
            <option value="90d">{isAr ? 'آخر 3 أشهر' : 'Last Quarter'}</option>
          </select>

          <button
            type="button"
            onClick={handleExportReport}
            className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#CCFF00] px-4 py-2 text-xs font-extrabold text-black"
          >
            <Download className="h-4 w-4" />
            {isAr ? 'تصدير التقرير CSV' : 'Export Report CSV'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Games by Revenue */}
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
            {isAr
              ? 'الألعاب الأعلى تحقيقاً للإيرادات والطلبات'
              : 'Top Games by Revenue & Volume'}
          </Typography>
          <div className="space-y-3">
            {(data?.topGames || []).map((g: any) => (
              <div key={g.id} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold">{g.name}</span>
                  <span className="font-mono text-[#CCFF00]">
                    {formatNumber(g.revenue)} {isAr ? 'ج.م' : 'EGP'} ({g.ordersCount}{' '}
                    {isAr ? 'مرات تحميل' : 'loads'})
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[var(--bg-primary)]">
                  <div
                    style={{ width: `${Math.min(100, (g.revenue / 200) * 100)}%` }}
                    className="h-full rounded-full bg-[#CCFF00]"
                  />
                </div>
              </div>
            ))}
          </div>
        </Paper>

        {/* Geographic Distribution Across Cairo */}
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
            {isAr
              ? 'التوزيع الجغرافي للطلبات (مناطق القاهرة)'
              : 'Geographic Distribution (Cairo Districts)'}
          </Typography>
          <div className="space-y-3">
            {(data?.geographicDistribution || []).map((geo: any) => (
              <div
                key={geo.area}
                className="flex items-center justify-between rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] p-3 text-xs"
              >
                <span className="flex items-center gap-2 font-bold">
                  <MapPin className="h-4 w-4 text-[#CCFF00]" />
                  {geo.area}
                </span>
                <span className="rounded bg-[#CCFF00]/15 px-2.5 py-0.5 font-bold text-[#CCFF00]">
                  {geo.count} {isAr ? 'طلبات' : 'orders'}
                </span>
              </div>
            ))}
          </div>
        </Paper>
      </div>
    </div>
  );
}
