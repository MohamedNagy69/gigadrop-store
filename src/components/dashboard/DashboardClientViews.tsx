'use client';

import React from 'react';
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
  Button as MuiButton,
} from '@mui/material';
import {
  ShoppingBag,
  Gamepad2,
  HardDrive,
  Gift,
  FileText,
  Eye,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { useThemeStore } from '@/stores/themeStore';

export function statusLabelAr(status: string, isAr: boolean) {
  if (!isAr) return status;
  switch (status) {
    case 'PENDING':
      return 'قيد الانتظار';
    case 'PROCESSING':
      return 'جاري التحميل';
    case 'READY':
      return 'جاهز للاستلام';
    case 'DELIVERED':
      return 'تم التوصيل';
    case 'CANCELLED':
      return 'ملغي';
    default:
      return status;
  }
}

export function DashboardOverviewClient({
  user,
  orders,
  totalOrders,
  totalGames,
  totalGB,
  referralEarnings,
  recommendedGames,
}: {
  user: any;
  orders: any[];
  totalOrders: number;
  totalGames: number;
  totalGB: number;
  referralEarnings: number;
  recommendedGames: any[];
}) {
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';

  const stats = [
    {
      label: isAr ? 'إجمالي الطلبات' : 'Total Orders',
      value: String(totalOrders),
      sub: isAr ? 'الطلبات النشطة والمكتملة' : 'Active & Delivered',
      icon: ShoppingBag,
    },
    {
      label: isAr ? 'إجمالي الألعاب المملوكة' : 'Total Games Owned',
      value: String(totalGames),
      sub: isAr ? 'في مكتبة الهارد الخاصة بك' : 'In your drive library',
      icon: Gamepad2,
    },
    {
      label: isAr ? 'إجمالي الجيجابايت المحملة' : 'Total GB Purchased',
      value: `${formatNumber(totalGB)} ${isAr ? 'جيجا' : 'GB'}`,
      sub: isAr ? 'بسعر 1.00 ج.م لكل جيجا' : 'At 1.00 EGP / GB',
      icon: HardDrive,
    },
    {
      label: isAr ? 'مكافآت الإحالة' : 'Referral Earnings',
      value: `${formatNumber(referralEarnings)} ${isAr ? 'ج.م' : 'EGP'}`,
      sub: `${isAr ? 'الكود:' : 'Code:'} ${user?.referralCode || 'GIGA-AHMED24'}`,
      icon: Gift,
    },
  ];

  const statusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return { bg: 'rgba(204, 255, 0, 0.2)', color: '#CCFF00' };
      case 'READY':
        return { bg: 'rgba(204, 255, 0, 0.15)', color: '#CCFF00' };
      case 'PROCESSING':
        return { bg: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA' };
      case 'CANCELLED':
        return { bg: 'rgba(255, 68, 68, 0.2)', color: '#FF4444' };
      default:
        return { bg: 'rgba(234, 179, 8, 0.2)', color: '#FACC15' };
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Welcome Banner */}
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
              {isAr ? 'لوحة تحكم العميل' : 'CUSTOMER DASHBOARD'}
            </span>
            <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
              {isAr
                ? `مرحباً بعودتك، ${user?.name || 'أحمد حسن'} 👋`
                : `Welcome back, ${user?.name || 'Ahmed Hassan'} 👋`}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {isAr ? 'كود الإحالة الشخصي: ' : 'Personal Referral Code: '}
              <strong className="font-mono text-[#CCFF00]">
                {user?.referralCode || 'GIGA-AHMED24'}
              </strong>{' '}
              · {isAr ? 'المنطقة:' : 'Area:'} {user?.address || 'Nasr City, Cairo'}
            </Typography>
          </div>
          <Link href="/#library">
            <MuiButton
              variant="contained"
              sx={{
                bgcolor: '#CCFF00',
                color: '#000',
                fontWeight: 800,
                '&:hover': { bgcolor: '#B8E600' },
              }}
            >
              {isAr ? '+ اطلب ألعاب جديدة' : '+ Queue New Games'}
            </MuiButton>
          </Link>
        </div>
      </Paper>

      {/* Stats KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Paper key={s.label} sx={{ p: 3, borderRadius: 3 }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  {s.label}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#CCFF00]/15 text-[#CCFF00]">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-3 text-2xl font-extrabold text-[var(--text-primary)]">
                {s.value}
              </div>
              <div className="mt-1 text-xs text-[var(--text-secondary)]">{s.sub}</div>
            </Paper>
          );
        })}
      </div>

      {/* Recent Orders Table */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <Typography variant="h6" fontWeight={700}>
              {isAr ? 'أحدث الطلبات' : 'Recent Orders'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isAr
                ? 'آخر طلبات تحميل الألعاب على الهارد الخاصة بك'
                : 'Your latest hard disk load requests'}
            </Typography>
          </div>
          <Link
            href="/dashboard/orders"
            className="text-xs font-bold text-[#CCFF00] hover:underline"
          >
            {isAr ? 'عرض كل الطلبات ›' : 'View All Orders ›'}
          </Link>
        </div>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'رقم الطلب' : 'Order ID'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'التاريخ' : 'Date'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'الألعاب' : 'Games'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'المساحة' : 'Total GB'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'السعر الإجمالي' : 'Total Price'}
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
              {orders.slice(0, 5).map((order) => {
                const st = statusColor(order.status);
                return (
                  <TableRow key={order.id} hover>
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {order.items.length} {isAr ? 'ألعاب' : 'titles'}
                    </TableCell>
                    <TableCell>
                      {formatNumber(order.totalGB)} {isAr ? 'جيجا' : 'GB'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {formatNumber(order.totalPrice)} {isAr ? 'ج.م' : 'EGP'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabelAr(order.status, isAr)}
                        size="small"
                        sx={{
                          bgcolor: st.bg,
                          color: st.color,
                          fontWeight: 700,
                          fontSize: '11px',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/orders/${order.id}`}
                          className="text-xs font-bold text-[#CCFF00] hover:underline"
                        >
                          {isAr ? 'التفاصيل' : 'Details'}
                        </Link>
                        <a
                          href={`/api/invoices/${order.orderNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          title={isAr ? 'تحميل الفاتورة' : 'Download Invoice'}
                          className="inline-flex items-center gap-1 rounded border border-[var(--border)] px-2 py-1 text-[11px] hover:border-[#CCFF00]"
                        >
                          <FileText className="h-3 w-3 text-[#CCFF00]" />
                          PDF
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

      {/* Recommended Games */}
      <div>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          {isAr ? 'ألعاب مقترحة للهارد الخاص بك' : 'Recommended For Your Drive'}
        </Typography>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recommendedGames.map((g) => (
            <Link
              key={g.id}
              href={`/games/${g.id}`}
              className="group flex items-center gap-3 rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)] p-3 hover:border-[#CCFF00]"
            >
              <img
                src={g.coverImage}
                alt={g.name}
                className="h-16 w-12 rounded object-cover"
              />
              <div>
                <p className="line-clamp-1 text-sm font-bold text-[var(--text-primary)] group-hover:text-[#CCFF00]">
                  {g.name}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {formatNumber(g.sizeGB)} {isAr ? 'جيجا' : 'GB'} ·{' '}
                  {formatNumber(g.price)} {isAr ? 'ج.م' : 'EGP'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CustomerOrdersClient({ orders }: { orders: any[] }) {
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';

  const statusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return { bg: 'rgba(34, 197, 94, 0.2)', color: '#4ADE80' };
      case 'READY':
        return { bg: 'rgba(204, 255, 0, 0.2)', color: '#CCFF00' };
      case 'PROCESSING':
        return { bg: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA' };
      case 'CANCELLED':
        return { bg: 'rgba(255, 68, 68, 0.2)', color: '#FF4444' };
      default:
        return { bg: 'rgba(234, 179, 8, 0.2)', color: '#FACC15' };
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
          {isAr ? 'سجل الطلبات' : 'ORDER HISTORY'}
        </span>
        <Typography variant="h4" fontWeight={800}>
          {isAr ? 'طلباتي' : 'My Orders'}
        </Typography>
      </div>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'رقم الطلب' : 'Order ID'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'التاريخ' : 'Date'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'عدد الألعاب' : 'Games Count'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'إجمالي المساحة' : 'Total GB'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'طريقة الدفع' : 'Payment'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'السعر الإجمالي' : 'Total Price'}
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
                const st = statusBadge(order.status);
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
                          <span className="inline-flex items-center gap-1 rounded bg-[#CCFF00]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#CCFF00]">
                            <HardDrive className="h-3 w-3" />
                            {isAr ? 'شراء هارد جديد' : 'New Drive'}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {order.items.length} {isAr ? 'ألعاب' : 'games'}
                    </TableCell>
                    <TableCell>
                      {formatNumber(order.totalGB)} {isAr ? 'جيجا' : 'GB'}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold">
                        {order.paymentMethod} ({order.paymentStatus})
                      </span>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {formatNumber(order.totalPrice)} {isAr ? 'ج.م' : 'EGP'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabelAr(order.status, isAr)}
                        size="small"
                        sx={{
                          bgcolor: st.bg,
                          color: st.color,
                          fontWeight: 700,
                          fontSize: '11px',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-2">
                        {isHardDriveOrder && (
                          <Link
                            href="/dashboard/support"
                            className="inline-flex items-center gap-1 rounded-[6px] border border-[#CCFF00]/40 bg-[#CCFF00]/10 px-2 py-1 text-xs font-bold text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black transition-colors"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            {isAr ? 'شات الهارد' : 'Drive Chat'}
                          </Link>
                        )}
                        <Link
                          href={`/dashboard/orders/${order.id}`}
                          className="inline-flex items-center gap-1 rounded-[6px] bg-[#CCFF00] px-2.5 py-1 text-xs font-bold text-black"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          {isAr ? 'عرض' : 'View'}
                        </Link>
                        <a
                          href={`/api/invoices/${order.orderNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-[6px] border border-[var(--border)] px-2.5 py-1 text-xs font-semibold hover:border-[#CCFF00]"
                        >
                          <FileText className="h-3.5 w-3.5 text-[#CCFF00]" />
                          {isAr ? 'الفاتورة' : 'Invoice'}
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

export function CustomerOrderDetailClient({ order }: { order: any }) {
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/dashboard/orders"
        className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[#CCFF00]"
      >
        <BackIcon className="h-4 w-4" />
        {isAr ? 'العودة إلى طلباتي' : 'Back to My Orders'}
      </Link>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div>
            <span className="font-mono text-xs font-bold text-[#CCFF00]">
              {order.orderNumber}
            </span>
            <Typography variant="h5" fontWeight={800}>
              {isAr ? 'تفاصيل الطلب' : 'Order Breakdown'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isAr ? 'تاريخ الطلب: ' : 'Placed on '}
              {new Date(order.createdAt).toLocaleString()}
            </Typography>
          </div>

          <div className="flex items-center gap-3">
            <Chip
              label={statusLabelAr(order.status, isAr)}
              sx={{ bgcolor: '#CCFF00', color: '#000', fontWeight: 800 }}
            />
            <a
              href={`/api/invoices/${order.orderNumber}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#CCFF00] px-4 py-2 text-xs font-bold text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black"
            >
              <FileText className="h-4 w-4" />
              {isAr ? 'تحميل الفاتورة PDF' : 'Download Invoice PDF'}
            </a>
          </div>
        </div>

        {/* Delivery & Payment Info */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--bg-primary)] p-4">
            <p className="text-xs font-bold uppercase text-[#CCFF00]">
              {isAr ? 'بيانات التوصيل والاستلام' : 'Delivery Details'}
            </p>
            <p className="mt-2 text-sm font-bold">{order.customerName}</p>
            <p className="text-xs text-[var(--text-secondary)]" dir="ltr">
              {order.phone}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">{order.address}</p>
          </div>

          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--bg-primary)] p-4">
            <p className="text-xs font-bold uppercase text-[#CCFF00]">
              {isAr ? 'بيانات الدفع' : 'Payment Info'}
            </p>
            <p className="mt-2 text-sm font-bold">
              {isAr ? 'الوسيلة: ' : 'Method: '}
              {order.paymentMethod} ({order.paymentStatus})
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              {isAr ? 'المرجع: ' : 'Ref: '}
              {order.paymentRef || (isAr ? 'غير متاح' : 'N/A')}
            </p>
            <p className="mt-1 text-base font-extrabold text-[#CCFF00]">
              {isAr ? 'الإجمالي: ' : 'Total: '}
              {formatNumber(order.totalPrice)} {isAr ? 'ج.م' : 'EGP'} (
              {formatNumber(order.totalGB)} {isAr ? 'جيجا' : 'GB'})
            </p>
          </div>
        </div>

        {/* Games List */}
        <div className="mt-6">
          <Typography variant="subtitle2" sx={{ mb: 2, color: '#CCFF00' }}>
            {isAr
              ? `الألعاب المشمولة في هذا الطلب (${order.items.length})`
              : `GAMES IN THIS DRIVE LOAD (${order.items.length})`}
          </Typography>
          <div className="divide-y divide-[var(--border)] rounded-[12px] border border-[var(--border)] bg-[var(--bg-primary)]">
            {order.items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.game.coverImage}
                    alt={item.game.name}
                    className="h-14 w-10 rounded object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold">{item.game.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {formatNumber(item.sizeGB)} {isAr ? 'جيجا' : 'GB'}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#CCFF00]">
                  {formatNumber(item.price)} {isAr ? 'ج.م' : 'EGP'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Timeline */}
        <div className="mt-6">
          <Typography variant="subtitle2" sx={{ mb: 2, color: '#CCFF00' }}>
            {isAr ? 'سجل حالات الطلب' : 'STATUS TIMELINE'}
          </Typography>
          <div className="space-y-2">
            {order.statusHistory.map((h: any) => (
              <div
                key={h.id}
                className="flex items-center justify-between rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2.5 text-xs"
              >
                <div>
                  <strong className="text-[#CCFF00]">
                    {statusLabelAr(h.status, isAr)}
                  </strong>{' '}
                  — {h.note}
                </div>
                <span className="text-[var(--text-muted)]">
                  {new Date(h.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Link
            href="/dashboard/support"
            className="inline-flex items-center gap-2 rounded-[8px] bg-[#CCFF00] px-5 py-2.5 text-xs font-extrabold text-black"
          >
            <MessageSquare className="h-4 w-4" />
            {isAr
              ? 'تواصل مع الدعم الفني بخصوص هذا الطلب'
              : 'Contact Support About This Order'}
          </Link>
        </div>
      </Paper>
    </div>
  );
}

export function CustomerLibraryClient({
  purchasedList,
}: {
  purchasedList: { game: any; purchasedAt: string | Date }[];
}) {
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
          {isAr ? 'محملة على الهارد الخاص بك' : 'LOADED ON YOUR DRIVES'}
        </span>
        <Typography variant="h4" fontWeight={800}>
          {isAr
            ? `مكتبة ألعابي (${purchasedList.length})`
            : `My Games Library (${purchasedList.length})`}
        </Typography>
      </div>

      {purchasedList.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h6">
            {isAr ? 'لا توجد ألعاب في مكتبتك بعد' : 'No games in your library yet'}
          </Typography>
          <Link
            href="/#library"
            className="mt-4 inline-block rounded-[8px] bg-[#CCFF00] px-6 py-2.5 text-xs font-extrabold text-black"
          >
            {isAr ? 'تصفح مكتبة الألعاب ›' : 'Browse Games ›'}
          </Link>
        </Paper>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {purchasedList.map(({ game, purchasedAt }) => (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className="group overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)] transition-all hover:scale-[1.02] hover:border-[#CCFF00]"
            >
              <div className="aspect-[3/4] w-full overflow-hidden bg-black">
                <img
                  src={game.coverImage}
                  alt={game.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="line-clamp-1 font-bold text-[var(--text-primary)] group-hover:text-[#CCFF00]">
                  {game.name}
                </h3>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  {isAr ? 'المساحة:' : 'Size:'} {formatNumber(game.sizeGB)}{' '}
                  {isAr ? 'جيجا' : 'GB'}
                </p>
                <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                  {isAr ? 'تاريخ التحميل:' : 'Loaded:'}{' '}
                  {new Date(purchasedAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
