'use client';

import React, { useEffect, useState } from 'react';
import { Paper, Typography, Switch, FormControlLabel } from '@mui/material';
import { CheckCircle2, Gift } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

export default function AdminSettingsPage() {
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';

  const [settings, setSettings] = useState<Record<string, string>>({
    siteName: 'GIGADROP',
    tagline: 'Your next world. Ready to drop.',
    contactPhone: '+20 100 999 8877',
    contactWhatsapp: '+201009998877',
    contactEmail: 'drop@gigadrop.eg',
    instapayAddress: 'gigadrop@instapay',
    operatingAreas: 'Nasr City, Maadi, Heliopolis, New Cairo, Zamalek, Dokki, October',
    deliveryTime: '1–2 Days',
    maintenanceMode: 'false',
    referralProgramEnabled: 'true',
    referralDiscountPercent: '15',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings((prev) => ({ ...prev, ...data.settings }));
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
          {isAr ? 'إعدادات النظام العام' : 'PLATFORM CONFIGURATION'}
        </span>
        <Typography variant="h4" fontWeight={800}>
          {isAr ? 'إعدادات المنصة والمتجر' : 'Site & Business Settings'}
        </Typography>
      </div>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <form onSubmit={handleSave} className="space-y-6">
          {saved && (
            <div className="flex items-center gap-2 rounded-[8px] border border-[#CCFF00] bg-[#CCFF00]/10 p-3 text-xs font-bold text-[#CCFF00]">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>
                {isAr
                  ? 'تم حفظ إعدادات الموقع بنجاح!'
                  : 'Site settings saved successfully!'}
              </span>
            </div>
          )}

          {/* Customer Referral Link & Discount Option Card */}
          <div className="rounded-[12px] border border-[#CCFF00]/40 bg-[#CCFF00]/10 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#CCFF00] text-black">
                  <Gift className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-[var(--text-primary)]">
                    {isAr
                      ? 'أوبشن أكواد ولينك الإحالة للعملاء (خصم مشاركة اللينك)'
                      : 'Customer Referral Link & Discount Option'}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {isAr
                      ? 'عند التفعيل، يحصل كل عميل على كود ولينك خاص به، وإذا أرسل اللينك لصديق يحصل تلقائياً على الخصم المحدد أدناه.'
                      : 'When enabled, customers can share their personal referral link/code with friends to auto-apply a discount.'}
                  </p>
                </div>
              </div>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.referralProgramEnabled !== 'false'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        referralProgramEnabled: e.target.checked ? 'true' : 'false',
                      })
                    }
                    color="primary"
                  />
                }
                label={
                  <span className="text-xs font-bold text-[#CCFF00]">
                    {settings.referralProgramEnabled !== 'false'
                      ? isAr
                        ? 'مُفعّل (Active)'
                        : 'Enabled'
                      : isAr
                      ? 'مُغلق (Disabled)'
                      : 'Disabled'}
                  </span>
                }
              />
            </div>

            {settings.referralProgramEnabled !== 'false' && (
              <div className="max-w-xs pt-1">
                <label className="mb-1 block text-xs font-bold text-[var(--text-primary)]">
                  {isAr
                    ? 'نسبة الخصم عند استخدام لينك أو كود العميل (%)'
                    : 'Referral Link Discount Percentage (%)'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={settings.referralDiscountPercent || '15'}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      referralDiscountPercent: e.target.value,
                    })
                  }
                  className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2 text-sm font-bold text-[#CCFF00] outline-none focus:border-[#CCFF00]"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-[var(--text-secondary)]">
                {isAr ? 'اسم المتجر' : 'Site Name'}
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) =>
                  setSettings({ ...settings, siteName: e.target.value })
                }
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-[var(--text-secondary)]">
                {isAr ? 'الشعار الترويجي (Tagline)' : 'Hero Tagline'}
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) =>
                  setSettings({ ...settings, tagline: e.target.value })
                }
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-[var(--text-secondary)]">
                {isAr ? 'رقم هاتف الدعم الفني' : 'Support Phone'}
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) =>
                  setSettings({ ...settings, contactPhone: e.target.value })
                }
                dir="ltr"
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-[var(--text-secondary)]">
                {isAr ? 'البريد الإلكتروني للدعم' : 'Support Email'}
              </label>
              <input
                type="text"
                value={settings.contactEmail}
                onChange={(e) =>
                  setSettings({ ...settings, contactEmail: e.target.value })
                }
                dir="ltr"
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm font-mono text-[#CCFF00] outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-[var(--text-secondary)]">
                {isAr ? 'مناطق التغطية في القاهرة' : 'Operating Areas in Cairo'}
              </label>
              <input
                type="text"
                value={settings.operatingAreas}
                onChange={(e) =>
                  setSettings({ ...settings, operatingAreas: e.target.value })
                }
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              />
            </div>
          </div>

          <FormControlLabel
            control={
              <Switch
                checked={settings.maintenanceMode === 'true'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maintenanceMode: e.target.checked ? 'true' : 'false',
                  })
                }
                color="primary"
              />
            }
            label={isAr ? 'تفعيل وضع الصيانة للموقع' : 'Enable Maintenance Mode'}
          />

          <div>
            <button
              type="submit"
              className="rounded-[8px] bg-[#CCFF00] px-8 py-3 text-xs font-extrabold text-black hover:bg-[#B8E600]"
            >
              {isAr ? 'حفظ الإعدادات ›' : 'Save Settings ›'}
            </button>
          </div>
        </form>
      </Paper>
    </div>
  );
}
