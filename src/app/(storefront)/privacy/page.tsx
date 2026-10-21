'use client';

import React from 'react';
import { useThemeStore } from '@/stores/themeStore';

export default function PrivacyPage() {
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';

  return (
    <div className="pt-32 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-6">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
          {isAr ? 'الخصوصية وحماية البيانات' : 'PRIVACY & DATA PROTECTION'}
        </span>
        <h1 className="text-4xl font-bold text-[var(--text-primary)]">
          {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
        </h1>
        <div className="space-y-4 rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)] p-6 text-sm leading-relaxed text-[var(--text-secondary)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {isAr ? '1. البيانات الشخصية التي نجمعها' : '1. Personal Data We Collect'}
          </h2>
          <p>
            {isAr
              ? 'نقوم بجمع الاسم، رقم الموبايل، رقم الواتساب، البريد الإلكتروني، والمنطقة السكنية في القاهرة فقط بهدف تنسيق استلام الهارد وتحميل الألعاب وإعادته إليك.'
              : 'We collect your name, Egyptian mobile number, WhatsApp number, email address, and Cairo delivery district solely to coordinate drive pickup, loading, and return.'}
          </p>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {isAr ? '2. ضمان خصوصية الهارد ديسك' : '2. Hard Drive Privacy Guarantee'}
          </h2>
          <p>
            {isAr
              ? 'تقوم محطات التحميل الآلية لدينا بالكتابة فقط داخل مجلد مخصص باسم `/GIGADROP_GAMES` على الهارد الخاص بك، ولا نقوم أبداً بالاطلاع على أو نسخ أو تعديل أي ملفات شخصية موجودة على وحدة التخزين الخاصة بك.'
              : 'Our automated loading stations only write to a dedicated `/GIGADROP_GAMES` directory on your drive and never inspect, copy, or modify existing personal files on your storage device.'}
          </p>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {isAr ? '3. ملفات تعريف الارتباط والتخزين المحلي' : '3. Cookies & Local Storage'}
          </h2>
          <p>
            {isAr
              ? 'نستخدم التخزين المحلي في المتصفح (localStorage) لحفظ سلة الألعاب، تفضيل المظهر (الداكن/الفاتح)، اللغة، وقائمة الأمنيات الخاصة بك.'
              : 'We use browser localStorage to persist your game cart, theme preference (Dark/Light), and wishlist items across sessions.'}
          </p>
        </div>
      </div>
    </div>
  );
}
