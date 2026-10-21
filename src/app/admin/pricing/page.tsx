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
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Plus, Trash2, CheckCircle2, Copy, Check, Link as LinkIcon } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

export default function AdminPricingPage() {
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';

  const [ratePerGB, setRatePerGB] = useState('1.00');
  const [referralProgramEnabled, setReferralProgramEnabled] = useState('true');
  const [referralDiscountPercent, setReferralDiscountPercent] = useState('15');
  const [bulkThresholdGB, setBulkThresholdGB] = useState('250');
  const [bulkDiscountPercent, setBulkDiscountPercent] = useState('10');
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('FIXED');
  const [value, setValue] = useState(25);
  const [maxUses, setMaxUses] = useState(100);
  const [savedBanner, setSavedBanner] = useState('');

  const loadData = async () => {
    const [settingsRes, promosRes, customersRes] = await Promise.all([
      fetch('/api/settings'),
      fetch('/api/promo-codes'),
      fetch('/api/customers'),
    ]);
    const sData = await settingsRes.json();
    const pData = await promosRes.json();
    const cData = await customersRes.json();

    if (sData.settings) {
      setRatePerGB(sData.settings.ratePerGB || '1.00');
      setReferralProgramEnabled(
        sData.settings.referralProgramEnabled !== 'false' ? 'true' : 'false'
      );
      setReferralDiscountPercent(sData.settings.referralDiscountPercent || '15');
      setBulkThresholdGB(sData.settings.bulkThresholdGB || '250');
      setBulkDiscountPercent(sData.settings.bulkDiscountPercent || '10');
    }
    if (pData.promoCodes) {
      setPromoCodes(pData.promoCodes);
    }
    if (cData.customers) {
      setCustomers(cData.customers);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSavePricingRules = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ratePerGB,
        referralProgramEnabled,
        referralDiscountPercent,
        bulkThresholdGB,
        bulkDiscountPercent,
      }),
    });
    setSavedBanner(
      isAr
        ? `تم حفظ إعدادات الأسعار وأوبشن أكواد إحالة العملاء بنجاح!`
        : `Pricing & Customer Referral Link option updated successfully!`
    );
    setTimeout(() => setSavedBanner(''), 4000);
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    await fetch('/api/promo-codes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, discountType, value, maxUses }),
    });
    setCode('');
    loadData();
  };

  const handleDeletePromo = async (id: string) => {
    await fetch(`/api/promo-codes?id=${id}`, { method: 'DELETE' });
    setPromoCodes((prev) => prev.filter((p) => p.id !== id));
  };

  const handleCopyCustomerLink = (id: string, refCode: string) => {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const link = `${origin}/?ref=${refCode}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
          {isAr ? 'محرك التسعير والعروض الترويجية' : 'REVENUE & PROMO ENGINE'}
        </span>
        <Typography variant="h4" fontWeight={800}>
          {isAr ? 'الأسعار والكوبونات وأكواد العملاء' : 'Pricing, Promos & Referral Links'}
        </Typography>
      </div>

      {savedBanner && (
        <div className="flex items-center gap-2 rounded-[8px] border border-[#CCFF00] bg-[#CCFF00]/10 p-3.5 text-xs font-bold text-[#CCFF00]">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{savedBanner}</span>
        </div>
      )}

      {/* Base Rate + Referral Option + Bulk Rules */}
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
          <div>
            <Typography variant="h6" fontWeight={700}>
              {isAr
                ? 'سعر الجيجابايت وأوبشن أكواد إحالة العملاء'
                : 'Global Gigabyte Rate & Customer Referral Option'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isAr
                ? 'تحكم في تفعيل أو إيقاف خاصية منح خصم عندما يرسل العميل لينك الكود الخاص به لصديق.'
                : 'Enable or disable customer referral link discounts and adjust percentages.'}
            </Typography>
          </div>

          <FormControlLabel
            control={
              <Switch
                checked={referralProgramEnabled === 'true'}
                onChange={(e) =>
                  setReferralProgramEnabled(e.target.checked ? 'true' : 'false')
                }
                color="primary"
              />
            }
            label={
              <span className="text-xs font-extrabold text-[#CCFF00]">
                {referralProgramEnabled === 'true'
                  ? isAr
                    ? 'أوبشن لينك خصم العميل: مُفعّل'
                    : 'Customer Referral Link: ENABLED'
                  : isAr
                  ? 'أوبشن لينك خصم العميل: مُغلق'
                  : 'Customer Referral Link: DISABLED'}
              </span>
            }
          />
        </div>

        <form
          onSubmit={handleSavePricingRules}
          className="grid grid-cols-1 gap-4 sm:grid-cols-4"
        >
          <div>
            <label className="mb-1 block text-xs font-bold text-[#CCFF00]">
              {isAr ? 'السعر الأساسي (ج.م لكل جيجا)' : 'Base Rate (EGP per GB)'}
            </label>
            <input
              type="number"
              step="0.05"
              value={ratePerGB}
              onChange={(e) => setRatePerGB(e.target.value)}
              className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-[var(--text-secondary)]">
              {isAr
                ? 'نسبة خصم لينك/كود العميل (%)'
                : 'Customer Referral Link Discount (%)'}
            </label>
            <input
              type="number"
              disabled={referralProgramEnabled !== 'true'}
              value={referralDiscountPercent}
              onChange={(e) => setReferralDiscountPercent(e.target.value)}
              className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00] disabled:opacity-40"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-[var(--text-secondary)]">
              {isAr ? 'الحد الأدنى لخصم الكميات (GB)' : 'Bulk Order Threshold (GB)'}
            </label>
            <input
              type="number"
              value={bulkThresholdGB}
              onChange={(e) => setBulkThresholdGB(e.target.value)}
              className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-[var(--text-secondary)]">
              {isAr ? 'نسبة خصم الكميات الكبيرة (%)' : 'Bulk Discount (%)'}
            </label>
            <input
              type="number"
              value={bulkDiscountPercent}
              onChange={(e) => setBulkDiscountPercent(e.target.value)}
              className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
            />
          </div>

          <div className="sm:col-span-4">
            <button
              type="submit"
              className="rounded-[8px] bg-[#CCFF00] px-6 py-2.5 text-xs font-extrabold text-black hover:bg-[#B8E600]"
            >
              {isAr
                ? 'حفظ الإعدادات وتحديث خصومات وأكواد العملاء ›'
                : 'Save Rate & Referral Option ›'}
            </button>
          </div>
        </form>
      </Paper>

      {/* Customer Referral Codes & Shareable Links Table (Controlled by Admin) */}
      <Paper sx={{ p: 3.5, borderRadius: 3 }}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <Typography variant="h6" fontWeight={700}>
              {isAr
                ? 'أكواد ولينكات الإحالة الخاصة بالعملاء (لو العميل بعت اللينك لحد ياخد ديسكوند)'
                : 'Customer Referral Codes & Shareable Discount Links'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isAr
                ? `عندما يشارك العميل الرابط الخاص به مع أي شخص، يحصل المشتري تلقائياً على خصم ${referralDiscountPercent}% عند الطلب.`
                : `When a customer shares their link with a friend, the friend gets ${referralDiscountPercent}% off at checkout.`}
            </Typography>
          </div>
          <Chip
            label={
              referralProgramEnabled === 'true'
                ? isAr
                  ? `نشط (${referralDiscountPercent}% خصم)`
                  : `ACTIVE (${referralDiscountPercent}% OFF)`
                : isAr
                ? 'مُغلق من الإدارة'
                : 'DISABLED BY ADMIN'
            }
            sx={{
              bgcolor:
                referralProgramEnabled === 'true'
                  ? 'rgba(204,255,0,0.2)'
                  : 'rgba(255,68,68,0.2)',
              color: referralProgramEnabled === 'true' ? '#CCFF00' : '#FF4444',
              fontWeight: 800,
            }}
          />
        </div>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'اسم العميل' : 'Customer'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'كود العميل' : 'Referral Code'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'لينك الدعوة والخصم' : 'Shareable Discount Link'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'نسبة الخصم' : 'Discount'}
                </TableCell>
                <TableCell align="right" sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'نسخ اللينك' : 'Copy Link'}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell sx={{ fontWeight: 700 }}>{c.name}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontWeight: 800, color: '#CCFF00' }}>
                    {c.referralCode}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '11px' }} dir="ltr">
                    {`/?ref=${c.referralCode}`}
                  </TableCell>
                  <TableCell>
                    {referralProgramEnabled === 'true'
                      ? isAr
                        ? `خصم ${referralDiscountPercent}%`
                        : `${referralDiscountPercent}% OFF`
                      : isAr
                      ? 'متوقف'
                      : 'Disabled'}
                  </TableCell>
                  <TableCell align="right">
                    <button
                      type="button"
                      onClick={() => handleCopyCustomerLink(c.id, c.referralCode)}
                      className="inline-flex items-center gap-1 rounded-[6px] border border-[#CCFF00] bg-[#CCFF00]/10 px-2.5 py-1 text-xs font-bold text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black"
                    >
                      {copiedId === c.id ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copiedId === c.id
                        ? isAr
                          ? 'تم نسخ اللينك!'
                          : 'Copied!'
                        : isAr
                        ? 'نسخ لينك الخصم'
                        : 'Copy Link'}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create Promo Code + Promo Table */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Paper sx={{ p: 3.5, borderRadius: 3 }} className="lg:col-span-4">
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            {isAr ? 'إنشاء كوبون خصم جديد' : 'Create Promo Code'}
          </Typography>
          <form onSubmit={handleCreatePromo} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-[var(--text-secondary)]">
                {isAr ? 'كود الخصم' : 'Code'}
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. RAMADAN30"
                dir="ltr"
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-xs font-mono uppercase text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-[var(--text-secondary)]">
                {isAr ? 'نوع الخصم' : 'Discount Type'}
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              >
                <option value="FIXED">
                  {isAr ? 'مبلغ ثابت (ج.م)' : 'Fixed Amount (EGP)'}
                </option>
                <option value="PERCENTAGE">
                  {isAr ? 'نسبة مئوية (%)' : 'Percentage (%)'}
                </option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs text-[var(--text-secondary)]">
                  {isAr ? 'قيمة الخصم' : 'Value'}
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--text-secondary)]">
                  {isAr ? 'الحد الأقصى للاستخدام' : 'Max Uses'}
                </label>
                <input
                  type="number"
                  value={maxUses}
                  onChange={(e) => setMaxUses(Number(e.target.value))}
                  className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-[8px] bg-[#CCFF00] py-2.5 text-xs font-extrabold text-black"
            >
              <Plus className="h-4 w-4" />
              {isAr ? 'إضافة كوبون الخصم' : 'Add Promo Code'}
            </button>
          </form>
        </Paper>

        <Paper sx={{ p: 3.5, borderRadius: 3 }} className="lg:col-span-8">
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            {isAr ? 'كوبونات الخصم الفعالة' : 'Active Promo Codes'}
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                    {isAr ? 'الكود' : 'Code'}
                  </TableCell>
                  <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                    {isAr ? 'قيمة الخصم' : 'Discount'}
                  </TableCell>
                  <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                    {isAr ? 'مرات الاستخدام' : 'Usage'}
                  </TableCell>
                  <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                    {isAr ? 'الحالة' : 'Status'}
                  </TableCell>
                  <TableCell align="right" sx={{ color: '#CCFF00', fontWeight: 700 }}>
                    {isAr ? 'حذف' : 'Action'}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {promoCodes.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 800 }}>
                      {p.code}
                    </TableCell>
                    <TableCell>
                      {p.discountType === 'PERCENTAGE'
                        ? isAr
                          ? `خصم ${p.value}%`
                          : `${p.value}% OFF`
                        : isAr
                        ? `خصم ${p.value} ج.م`
                        : `${p.value} EGP OFF`}
                    </TableCell>
                    <TableCell>
                      {p.usedCount} / {p.maxUses || '∞'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          isAr
                            ? p.isActive
                              ? 'نشط'
                              : 'غير نشط'
                            : p.isActive
                            ? 'ACTIVE'
                            : 'INACTIVE'
                        }
                        size="small"
                        sx={{
                          bgcolor: 'rgba(204,255,0,0.2)',
                          color: '#CCFF00',
                          fontWeight: 700,
                          fontSize: '10px',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <button
                        type="button"
                        onClick={() => handleDeletePromo(p.id)}
                        className="rounded p-1.5 text-[var(--text-muted)] hover:text-[#FF4444]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
