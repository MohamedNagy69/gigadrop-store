'use client';

import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { Copy, Check, Share2, Gift, Users, Sparkles, Link as LinkIcon } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/utils';
import { useThemeStore } from '@/stores/themeStore';
import { useAuth } from '@/hooks/useAuth';

export default function ReferralsPage() {
  const { locale } = useThemeStore();
  const { user: sessionUser } = useAuth();
  const isAr = locale === 'ar';

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [referralEnabled, setReferralEnabled] = useState(true);
  const [discountPercent, setDiscountPercent] = useState('15');

  const referralCode = sessionUser?.referralCode || 'GIGA-AHMED24';
  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/?ref=${referralCode}`
      : `http://localhost:3000/?ref=${referralCode}`;

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setReferralEnabled(data.settings.referralProgramEnabled !== 'false');
          setDiscountPercent(data.settings.referralDiscountPercent || '15');
        }
      })
      .catch(() => {});
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const history = [
    {
      id: '1',
      email: 'omar@gigadrop.eg',
      date: '2026-10-18',
      discount: isAr ? '49.60 ج.م' : '49.60 EGP',
      status: 'USED',
    },
    {
      id: '2',
      email: 'karim.gamer@gmail.com',
      date: '2026-10-20',
      discount: isAr ? '35.00 ج.م' : '35.00 EGP',
      status: 'PENDING',
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
          {isAr ? 'شارك اللينك واكسب خصم' : 'SHARE LINK & EARN DISCOUNT'}
        </span>
        <Typography variant="h4" fontWeight={800}>
          {isAr ? 'برنامج الإحالة ومشاركة اللينك' : 'Referral Link & Discount Program'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isAr
            ? `أرسل اللينك أو الكود الخاص بك لأي صديق ليحصل تلقائياً على خصم ${discountPercent}% عند الطلب!`
            : `Send your personal link or code to a friend so they automatically get ${discountPercent}% off their order!`}
        </Typography>
      </div>

      {!referralEnabled && (
        <div className="rounded-[12px] border border-[#FF4444]/40 bg-[#FF4444]/10 p-4 text-xs font-bold text-[#FF4444]">
          {isAr
            ? 'تنبيه: نظام خصومات لينك الإحالة متوقف مؤقتاً من قِبل إدارة المتجر.'
            : 'Notice: The referral link discount program is currently paused by store administration.'}
        </div>
      )}

      {/* Personal Code & Shareable Link Card */}
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <div className="space-y-5">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#CCFF00]">
                {isAr
                  ? `كود الإحالة الشخصي الخاص بك (خصم ${discountPercent}%)`
                  : `YOUR PERSONAL REFERRAL CODE (${discountPercent}% OFF)`}
              </span>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="rounded-[10px] border border-[#CCFF00] bg-[var(--bg-primary)] px-5 py-2.5 font-mono text-2xl font-black text-[#CCFF00]">
                  {referralCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#CCFF00] px-4 py-3 text-xs font-extrabold text-black hover:bg-[#B8E600]"
                >
                  {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedCode
                    ? isAr
                      ? 'تم نسخ الكود!'
                      : 'Code Copied!'
                    : isAr
                    ? 'نسخ الكود'
                    : 'Copy Code'}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <a
                href={getWhatsAppUrl(
                  '',
                  `استخدم اللينك الخاص بي في متجر GIGADROP للحصول على خصم ${discountPercent}% على تحميل ألعاب الكمبيوتر: ${shareUrl}`
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-[8px] border border-[#CCFF00] bg-[#CCFF00]/10 px-4 py-2.5 text-xs font-bold text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black"
              >
                <Share2 className="h-4 w-4" />
                {isAr ? 'إرسال اللينك عبر واتساب' : 'Share Link via WhatsApp'}
              </a>
            </div>
          </div>

          {/* Direct Shareable Link Box */}
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--bg-primary)] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <LinkIcon className="h-4 w-4 shrink-0 text-[#CCFF00]" />
              <span className="truncate font-mono text-xs text-[var(--text-primary)]" dir="ltr">
                {shareUrl}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[8px] border border-[#CCFF00] bg-[#CCFF00]/15 px-4 py-2 text-xs font-extrabold text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedLink
                ? isAr
                  ? 'تم نسخ اللينك!'
                  : 'Link Copied!'
                : isAr
                ? 'نسخ لينك الخصم المباشر'
                : 'Copy Direct Discount Link'}
            </button>
          </div>
        </div>
      </Paper>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>{isAr ? 'إجمالي الإحالات' : 'Total Referrals'}</span>
            <Users className="h-4 w-4 text-[#CCFF00]" />
          </div>
          <p className="mt-2 text-3xl font-extrabold">2</p>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>{isAr ? 'الطلبات المكتملة' : 'Successful Orders'}</span>
            <Sparkles className="h-4 w-4 text-[#CCFF00]" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-[#CCFF00]">1</p>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>{isAr ? 'إجمالي رصيد الخصم المكتسب' : 'Total Discount Earned'}</span>
            <Gift className="h-4 w-4 text-[#CCFF00]" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-[#CCFF00]">
            49.60 {isAr ? 'ج.م' : 'EGP'}
          </p>
        </Paper>
      </div>

      {/* Referral History Table */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          {isAr ? 'سجل الإحالات' : 'Referral History'}
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'الصديق المدعو' : 'Referred Friend'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'التاريخ' : 'Date'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'المكافأة المكتسبة' : 'Reward Earned'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'الحالة' : 'Status'}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>{h.email}</TableCell>
                  <TableCell>{h.date}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{h.discount}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        isAr
                          ? h.status === 'USED'
                            ? 'مُستخدم'
                            : 'قيد الانتظار'
                          : h.status
                      }
                      size="small"
                      sx={{
                        bgcolor:
                          h.status === 'USED'
                            ? 'rgba(204,255,0,0.2)'
                            : 'rgba(250,204,21,0.2)',
                        color: h.status === 'USED' ? '#CCFF00' : '#FACC15',
                        fontWeight: 700,
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
  );
}
