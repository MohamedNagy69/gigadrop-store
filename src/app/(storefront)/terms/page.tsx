'use client';

import React from 'react';
import { useThemeStore } from '@/stores/themeStore';

export default function TermsPage() {
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';

  return (
    <div className="pt-32 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-6">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
          {isAr ? 'الشروط القانونية · آخر تحديث أكتوبر 2026' : 'LEGAL · LAST UPDATED OCTOBER 2026'}
        </span>
        <h1 className="text-4xl font-bold text-[var(--text-primary)]">
          {isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}
        </h1>
        <div className="space-y-4 rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)] p-6 text-sm leading-relaxed text-[var(--text-secondary)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {isAr ? '1. نظرة عامة على الخدمة' : '1. Service Overview'}
          </h2>
          <p>
            {isAr
              ? 'تقدم GIGADROP خدمة تحميل البيانات وخدمات التوصيل في جميع أنحاء القاهرة، مصر، ويتم المحاسبة فقط مقابل حجم البيانات المنقولة (1.00 جنيه لكل جيجابايت ما لم تطبق عروض ترويجية).'
              : 'GIGADROP provides data loading and courier logistics across Cairo, Egypt, charging strictly for data transfer volume (1.00 EGP per GB unless promotional rates apply).'}
          </p>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {isAr ? '2. وحدات التخزين الخاصة بالعميل' : '2. Customer Storage Media'}
          </h2>
          <p>
            {isAr
              ? 'يلتزم العميل بتوفير هارد ديسك خارجي (HDD) أو (SSD) أو فلاشة عالية السعة تعمل بحالة سليمة وبها مساحة فارغة كافية لاستيعاب الجيجابايت المطلوبة.'
              : 'Customers must provide a healthy, functioning external hard disk drive (HDD), solid-state drive (SSD), or high-capacity flash drive with sufficient free space for the ordered gigabytes.'}
          </p>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {isAr ? '3. مدة التنفيذ والدفع' : '3. Turnaround & Payment'}
          </h2>
          <p>
            {isAr
              ? 'يستغرق التوصيل القياسي من يوم إلى يومي عمل داخل القاهرة الكبرى. يتم الدفع نقداً عند الاستلام (Cash on Delivery) عند استلام الهارد محملاً بالألعاب.'
              : 'Standard delivery takes 1–2 business days within Greater Cairo. All orders are paid via Cash on Delivery (COD) upon receiving your loaded drive back.'}
          </p>
        </div>
      </div>
    </div>
  );
}
