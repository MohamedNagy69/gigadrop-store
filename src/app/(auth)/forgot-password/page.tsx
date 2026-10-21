'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

export default function ForgotPasswordPage() {
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';

  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-4">
      <div className="w-full max-w-md rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          {isAr ? 'استعادة كلمة المرور' : 'Reset Password'}
        </h1>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          {isAr
            ? 'أدخل بريدك الإلكتروني لإرسال رابط استعادة كلمة المرور.'
            : 'Enter your email to receive a password recovery link.'}
        </p>

        {sent ? (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2 rounded-[8px] border border-[#CCFF00] bg-[#CCFF00]/10 p-4 text-xs font-bold text-[#CCFF00]">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>
                {isAr
                  ? `تم إرسال تعليمات استعادة كلمة المرور إلى ${email}.`
                  : `Recovery instructions have been sent to ${email}.`}
              </span>
            </div>
            <Link
              href="/login"
              className="block w-full rounded-[8px] bg-[#CCFF00] py-3 text-center text-xs font-extrabold text-black"
            >
              {isAr ? 'العودة لتسجيل الدخول' : 'Return to Sign In'}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ahmed@gigadrop.eg"
              dir="ltr"
              className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
            />
            <button
              type="submit"
              className="w-full rounded-[8px] bg-[#CCFF00] py-3 text-sm font-extrabold text-black"
            >
              {isAr ? 'إرسال رابط الاستعادة ›' : 'Send Reset Link ›'}
            </button>
            <Link
              href="/login"
              className="block text-center text-xs text-[var(--text-secondary)] hover:text-[#CCFF00]"
            >
              {isAr ? 'العودة لتسجيل الدخول' : 'Back to Sign In'}
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
