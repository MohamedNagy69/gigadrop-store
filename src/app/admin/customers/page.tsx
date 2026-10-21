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
import { Download, Eye, Bell, Search } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { useThemeStore } from '@/stores/themeStore';

export default function AdminCustomersPage() {
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';

  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [notifySent, setNotifySent] = useState('');

  const loadCustomers = async () => {
    const res = await fetch(`/api/customers?search=${encodeURIComponent(search)}`);
    const data = await res.json();
    if (data.customers) setCustomers(data.customers);
  };

  useEffect(() => {
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSendAlert = async (userId: string, name: string) => {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        title: isAr
          ? 'عرض خاص VIP من GIGADROP! 🎮'
          : 'Special VIP Offer from GIGADROP! 🎮',
        message: isAr
          ? 'استخدم الكود CAIRO25 للحصول على خصم 25 ج.م على طلبك القادم لتحميل الألعاب.'
          : 'Use code CAIRO25 for 25 EGP off your next hard disk game load.',
        type: 'PROMOTION',
      }),
    });
    setNotifySent(
      isAr ? `تم إرسال إشعار العرض إلى ${name}!` : `Notification sent to ${name}!`
    );
    setTimeout(() => setNotifySent(''), 3000);
  };

  const handleExportCSV = () => {
    const headers = ['ID,Name,Email,Phone,ReferralCode,TotalOrders,TotalSpentEGP,TotalGB'];
    const rows = customers.map(
      (c) =>
        `"${c.id}","${c.name}","${c.email}","${c.phone || ''}","${c.referralCode}",${
          c.totalOrders
        },${c.totalSpent},${c.totalGB}`
    );
    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gigadrop-customers.csv';
    a.click();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
            {isAr ? 'دليل العملاء وإدارة الحسابات' : 'CRM & GAMER DIRECTORY'}
          </span>
          <Typography variant="h4" fontWeight={800}>
            {isAr
              ? `إدارة العملاء (${customers.length})`
              : `Customer Management (${customers.length})`}
          </Typography>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#CCFF00] px-4 py-2.5 text-xs font-bold text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black"
        >
          <Download className="h-4 w-4" />
          {isAr ? 'تصدير بيانات العملاء CSV' : 'Export Customers CSV'}
        </button>
      </div>

      {notifySent && (
        <div className="rounded-[8px] border border-[#CCFF00] bg-[#CCFF00]/10 p-3 text-xs font-bold text-[#CCFF00]">
          {notifySent}
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            isAr
              ? 'ابحث بالاسم، البريد، الهاتف، أو كود الإحالة...'
              : 'Search customer name, email, phone, referral code...'
          }
          className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-card)] py-2.5 ps-9 pe-3 text-xs text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
        />
      </div>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'الاسم' : 'Name'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'البريد والهاتف' : 'Email & Phone'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'كود الإحالة' : 'Referral Code'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'إجمالي الطلبات' : 'Total Orders'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'إجمالي الإنفاق' : 'Total Spent'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'تاريخ الانضمام' : 'Join Date'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'الحالة' : 'Status'}
                </TableCell>
                <TableCell align="right" sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'إجراءات' : 'Actions'}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell sx={{ fontWeight: 700 }}>{c.name}</TableCell>
                  <TableCell>
                    <p className="text-xs">{c.email}</p>
                    <p className="text-[11px] text-[var(--text-secondary)]" dir="ltr">
                      {c.phone}
                    </p>
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', color: '#CCFF00' }}>
                    {c.referralCode}
                  </TableCell>
                  <TableCell>
                    {c.totalOrders} {isAr ? 'طلبات' : 'orders'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    {formatNumber(c.totalSpent)} {isAr ? 'ج.م' : 'EGP'}
                  </TableCell>
                  <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        isAr
                          ? c.isActive
                            ? 'نشط'
                            : 'معطل'
                          : c.isActive
                          ? 'ACTIVE'
                          : 'DISABLED'
                      }
                      size="small"
                      sx={{
                        bgcolor: c.isActive
                          ? 'rgba(204,255,0,0.2)'
                          : 'rgba(255,68,68,0.2)',
                        color: c.isActive ? '#CCFF00' : '#FF4444',
                        fontWeight: 700,
                        fontSize: '10px',
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/customers/${c.id}`}
                        className="rounded bg-[#CCFF00] p-1.5 text-black"
                        title={isAr ? 'ملف العميل' : 'Customer Profile'}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleSendAlert(c.id, c.name)}
                        className="rounded border border-[var(--border)] p-1.5 text-[#CCFF00] hover:border-[#CCFF00]"
                        title={isAr ? 'إرسال إشعار ترويجي' : 'Send Promo Notification'}
                      >
                        <Bell className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
