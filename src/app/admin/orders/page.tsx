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
import { Eye, FileText, MessageCircle, Search, HardDrive, MessageSquare } from 'lucide-react';
import { formatNumber, getWhatsAppUrl } from '@/lib/utils';
import { useThemeStore } from '@/stores/themeStore';
import { statusLabelAr } from '@/components/dashboard/DashboardClientViews';

export default function AdminOrdersPage() {
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';

  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const loadOrders = async () => {
    const res = await fetch(
      `/api/orders?status=${statusFilter}&search=${encodeURIComponent(search)}`
    );
    const data = await res.json();
    if (data.orders) setOrders(data.orders);
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, search]);

  const handleQuickStatusChange = async (orderId: string, status: string) => {
    await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    loadOrders();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
          {isAr ? 'إدارة التوصيل وتحميل الهاردات' : 'DRIVE LOGISTICS & DISPATCH'}
        </span>
        <Typography variant="h4" fontWeight={800}>
          {isAr
            ? `إدارة الطلبات (${orders.length})`
            : `Order Management (${orders.length})`}
        </Typography>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {['ALL', 'PENDING', 'PROCESSING', 'READY', 'DELIVERED', 'CANCELLED'].map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${
                  statusFilter === st
                    ? 'bg-[#CCFF00] text-black'
                    : 'border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)]'
                }`}
              >
                {st === 'ALL'
                  ? isAr
                    ? 'الكل'
                    : 'ALL'
                  : statusLabelAr(st, isAr)}
              </button>
            )
          )}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isAr
                ? 'ابحث برقم الطلب، اسم العميل، الهاتف...'
                : 'Search order ID, customer, phone...'
            }
            className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-card)] py-2 ps-9 pe-3 text-xs text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
          />
        </div>
      </div>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'رقم الطلب' : 'Order ID'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'العميل' : 'Customer'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'الألعاب / المساحة' : 'Games / GB'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'الإجمالي' : 'Total EGP'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'الدفع' : 'Payment'}
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
              {orders.map((order) => {
                const isHardDriveOrder =
                  order.notes &&
                  (order.notes.includes('شراء هارد') ||
                    order.notes.includes('BUY_NEW') ||
                    order.notes.includes('شراء هارد جديد'));
                return (
                  <TableRow key={order.id} hover>
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                      <div className="flex flex-col gap-1">
                        <span>{order.orderNumber}</span>
                        {isHardDriveOrder && (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                            <HardDrive className="h-2.5 w-2.5" />
                            {isAr ? 'طلب شراء هارد' : 'Hard Drive Request'}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs font-bold">{order.customerName}</p>
                      <p className="text-[11px] text-[var(--text-secondary)]" dir="ltr">
                        {order.phone}
                      </p>
                    </TableCell>
                    <TableCell>
                      {order.items?.length || 0} {isAr ? 'ألعاب' : 'games'} ·{' '}
                      {formatNumber(order.totalGB)} {isAr ? 'جيجا' : 'GB'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#CCFF00' }}>
                      {formatNumber(order.totalPrice)} {isAr ? 'ج.م' : 'EGP'}
                    </TableCell>
                    <TableCell>
                      <span className="block text-xs font-bold">{order.paymentMethod}</span>
                      <Chip
                        label={order.paymentStatus}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '9px',
                          bgcolor:
                            order.paymentStatus === 'PAID'
                              ? 'rgba(204,255,0,0.2)'
                              : 'rgba(250,204,21,0.2)',
                          color:
                            order.paymentStatus === 'PAID' ? '#CCFF00' : '#FACC15',
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleQuickStatusChange(order.id, e.target.value)
                        }
                        className="rounded border border-[var(--border)] bg-[var(--bg-primary)] px-2 py-1 text-xs font-bold text-[#CCFF00] outline-none"
                      >
                        {['PENDING', 'PROCESSING', 'READY', 'DELIVERED', 'CANCELLED'].map(
                          (s) => (
                            <option key={s} value={s}>
                              {statusLabelAr(s, isAr)}
                            </option>
                          )
                        )}
                      </select>
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isHardDriveOrder && (
                          <Link
                            href="/admin/tickets"
                            className="rounded border border-amber-400/50 bg-amber-400/10 p-1.5 text-amber-400 hover:bg-amber-400 hover:text-black transition-colors"
                            title={isAr ? 'محادثة شراء الهارد في الدعم الفني' : 'Drive Support Chat'}
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="rounded bg-[#CCFF00] p-1.5 text-black"
                          title={isAr ? 'تفاصيل الطلب' : 'Order Details'}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        <a
                          href={getWhatsAppUrl(
                            order.whatsapp || order.phone,
                            `Hello ${order.customerName}! Regarding your GIGADROP order ${order.orderNumber} (${order.totalGB} GB):`
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded border border-[var(--border)] p-1.5 text-[#CCFF00] hover:border-[#CCFF00]"
                          title={isAr ? 'تواصل عبر واتساب' : 'WhatsApp Customer'}
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                        </a>
                        <a
                          href={`/api/invoices/${order.orderNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded border border-[var(--border)] p-1.5 text-[var(--text-secondary)] hover:border-[#CCFF00]"
                          title={isAr ? 'إصدار الفاتورة' : 'Generate Invoice'}
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
