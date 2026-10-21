'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { CAIRO_DISTRICTS } from '@/lib/utils';
import { useThemeStore } from '@/stores/themeStore';

export default function RegisterPage() {
  const router = useRouter();
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+20 10');
  const [address, setAddress] = useState(CAIRO_DISTRICTS[0]);
  const [password, setPassword] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          whatsapp: phone,
          address,
          password,
          referredBy: referredBy || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (isAr ? 'تعذر إنشاء الحساب' : 'Registration failed'));
        setLoading(false);
        return;
      }

      await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      router.push('/dashboard');
    } catch {
      setError(isAr ? 'حدث خطأ في الاتصال بالخادم' : 'Network error');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-4 py-12">
      <div className="w-full max-w-md rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-8 shadow-2xl">
        <Link href="/" className="mb-6 inline-flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CCFF00] text-sm font-black text-black">
            G
          </span>
          <span className="text-xl font-black" dir="ltr">
            <span className="text-[var(--text-primary)]">GIGA</span>
            <span className="text-[#CCFF00]">DROP</span>
          </span>
        </Link>

        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          {isAr ? 'إنشاء حساب جديد في GIGADROP' : 'Create your GIGADROP account'}
        </h1>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          {isAr
            ? 'احصل على كود الإحالة الخاص بك وتابع طلباتك خطوة بخطوة.'
            : 'Get your personal referral code and track every gigabyte.'}
        </p>

        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-[8px] border border-[#FF4444] bg-[#FF4444]/10 p-3 text-xs font-semibold text-[#FF4444]">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs text-[var(--text-secondary)]">
              {isAr ? 'الاسم بالكامل *' : 'Full Name *'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isAr ? 'أحمد حسن' : 'Ahmed Hassan'}
              className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-[var(--text-secondary)]">
              {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ahmed@example.com"
              dir="ltr"
              className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-[var(--text-secondary)]">
                {isAr ? 'رقم الموبايل (+20) *' : 'Mobile (+20) *'}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                dir="ltr"
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-[var(--text-secondary)]">
                {isAr ? 'المنطقة في القاهرة *' : 'Cairo Area *'}
              </label>
              <select
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              >
                {CAIRO_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-[var(--text-secondary)]">
              {isAr ? 'كلمة المرور *' : 'Password *'}
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isAr ? '6 أحرف على الأقل' : 'At least 6 characters'}
              dir="ltr"
              className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-[var(--text-secondary)]">
              {isAr ? 'كود إحالة صديق (اختياري)' : "Friend's Referral Code (optional)"}
            </label>
            <input
              type="text"
              value={referredBy}
              onChange={(e) => setReferredBy(e.target.value)}
              placeholder="e.g. GIGA-AHMED24"
              dir="ltr"
              className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm uppercase text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[8px] bg-[#CCFF00] py-3 text-sm font-extrabold text-black hover:bg-[#B8E600]"
          >
            {loading
              ? isAr
                ? 'جاري إنشاء الحساب...'
                : 'Creating account...'
              : isAr
              ? 'إنشاء الحساب ›'
              : 'Create Account ›'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--text-secondary)]">
          {isAr ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
          <Link href="/login" className="font-bold text-[#CCFF00] hover:underline">
            {isAr ? 'تسجيل الدخول' : 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  );
}
