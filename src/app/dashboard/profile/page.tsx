'use client';

import React, { useEffect, useState } from 'react';
import { Paper, Typography, Switch, FormControlLabel } from '@mui/material';
import { CheckCircle2, Trash2 } from 'lucide-react';
import { CAIRO_DISTRICTS } from '@/lib/utils';
import { useThemeStore } from '@/stores/themeStore';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileSettingsPage() {
  const { locale } = useThemeStore();
  const { user: sessionUser } = useAuth();
  const isAr = locale === 'ar';

  const [customerId, setCustomerId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('Nasr City, Cairo');
  const [birthdate, setBirthdate] = useState('1999-05-14');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/customers')
      .then((res) => res.json())
      .then((data) => {
        const list = data.customers || [];
        const matched =
          (sessionUser?.email &&
            list.find((c: any) => c.email.toLowerCase() === sessionUser.email.toLowerCase())) ||
          list[0];
        if (matched) {
          setCustomerId(matched.id);
          setName(matched.name);
          setEmail(matched.email);
          setPhone(matched.phone || '');
          setWhatsapp(matched.whatsapp || '');
          setAddress(matched.address || 'Nasr City, Cairo');
        }
      });
  }, [sessionUser?.email]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customerId) {
      await fetch(`/api/customers/${customerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, whatsapp, address, birthdate }),
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
          {isAr ? 'إعدادات الحساب' : 'ACCOUNT PREFERENCES'}
        </span>
        <Typography variant="h4" fontWeight={800}>
          {isAr ? 'الملف الشخصي والإعدادات' : 'Profile & Settings'}
        </Typography>
      </div>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <form onSubmit={handleSave} className="space-y-5">
          <Typography variant="h6" fontWeight={700}>
            {isAr ? 'البيانات الشخصية وبيانات التوصيل' : 'Personal & Delivery Details'}
          </Typography>

          {saved && (
            <div className="flex items-center gap-2 rounded-[8px] border border-[#CCFF00] bg-[#CCFF00]/10 p-3 text-xs font-bold text-[#CCFF00]">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>
                {isAr
                  ? 'تم حفظ تعديلات الملف الشخصي بنجاح!'
                  : 'Profile updated successfully!'}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-[var(--text-secondary)]">
                {isAr ? 'الاسم بالكامل' : 'Full Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-[var(--text-secondary)]">
                {isAr ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <input
                type="email"
                value={email}
                disabled
                dir="ltr"
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-muted)]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-[var(--text-secondary)]">
                {isAr ? 'رقم الموبايل (+20)' : 'Mobile Number (+20)'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                dir="ltr"
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-[var(--text-secondary)]">
                {isAr ? 'رقم الواتساب' : 'WhatsApp Number'}
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                dir="ltr"
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-[var(--text-secondary)]">
                {isAr ? 'تاريخ الميلاد' : 'Birthdate'}
              </label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-[var(--text-secondary)]">
                {isAr ? 'منطقة التوصيل المفضلة في القاهرة' : 'Preferred Cairo District'}
              </label>
              <select
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              >
                <option value={address}>{address}</option>
                {CAIRO_DISTRICTS.map((d) => (
                  <option key={d} value={`${d}, Cairo`}>
                    {d}, Cairo
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-[8px] bg-[#CCFF00] px-6 py-2.5 text-xs font-extrabold text-black hover:bg-[#B8E600]"
          >
            {isAr ? 'حفظ تعديلات الملف الشخصي' : 'Save Profile Changes'}
          </button>
        </form>
      </Paper>

      {/* Notification Preferences */}
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          {isAr ? 'تفضيلات الإشعارات' : 'Notification Preferences'}
        </Typography>
        <div className="flex flex-col space-y-2">
          <FormControlLabel
            control={<Switch defaultChecked color="primary" />}
            label={
              isAr
                ? 'تحديثات حالة الهارد تلقائياً عبر الواتساب'
                : 'WhatsApp automated drive status updates'
            }
          />
          <FormControlLabel
            control={<Switch defaultChecked color="primary" />}
            label={
              isAr
                ? 'إرسال فواتير الطلبات عبر البريد الإلكتروني عند التوصيل'
                : 'Email invoice receipts on delivery'
            }
          />
          <FormControlLabel
            control={<Switch defaultChecked color="primary" />}
            label={
              isAr
                ? 'أكواد الخصم الأسبوعية وإشعارات الألعاب الجديدة'
                : 'Weekend promo codes & new AAA game drops'
            }
          />
        </div>
      </Paper>

      {/* Danger Zone */}
      <Paper sx={{ p: 4, borderRadius: 3, borderColor: '#FF4444' }}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <Typography variant="subtitle1" fontWeight={700} color="error">
              {isAr ? 'حذف الحساب' : 'Delete Account'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isAr
                ? 'حذف حسابك وسجل طلباتك ورصيد الإحالة نهائياً.'
                : 'Permanently remove your account, order history, and referral credits.'}
            </Typography>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#FF4444] px-4 py-2 text-xs font-bold text-[#FF4444] hover:bg-[#FF4444] hover:text-white"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {isAr ? 'حذف الحساب' : 'Delete Account'}
          </button>
        </div>
      </Paper>
    </div>
  );
}
