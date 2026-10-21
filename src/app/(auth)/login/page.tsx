'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { Lock } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

export default function LoginPage() {
  const router = useRouter();
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email: email.trim().toLowerCase(),
      password,
    });

    if (res?.error) {
      setLoading(false);
      setError(
        isAr
          ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
          : 'Invalid email or password'
      );
      return;
    }

    const session = await getSession();
    const role = (session?.user as any)?.role;
    setLoading(false);

    const params =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : null;
    const callbackUrl = params?.get('callbackUrl');

    if (role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'SUPPORT') {
      router.push(callbackUrl?.startsWith('/admin') ? callbackUrl : '/admin');
    } else {
      router.push(
        callbackUrl && !callbackUrl.startsWith('/admin')
          ? callbackUrl
          : '/dashboard'
      );
    }
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-4 py-12">
      <div className="w-full max-w-md rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CCFF00] text-sm font-black text-black">
              G
            </span>
            <span className="text-xl font-black" dir="ltr">
              <span className="text-[var(--text-primary)]">GIGA</span>
              <span className="text-[#CCFF00]">DROP</span>
            </span>
          </Link>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#CCFF00]/30 bg-[#CCFF00]/10 px-2.5 py-1 text-[10px] font-bold text-[#CCFF00]">
            <Lock className="h-3 w-3" />
            {isAr ? 'اتصال آمن ومشفر' : 'Encrypted Auth'}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          {isAr ? 'تسجيل الدخول إلى حسابك' : 'Sign in to your account'}
        </h1>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          {isAr
            ? 'أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك.'
            : 'Enter your email and password to access your account.'}
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-[8px] border border-[#FF4444] bg-[#FF4444]/10 p-3 text-xs font-semibold text-[#FF4444]">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
              {isAr ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@gigadrop.eg"
              dir="ltr"
              className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium text-[var(--text-secondary)]">
                {isAr ? 'كلمة المرور' : 'Password'}
              </span>
              <Link
                href="/forgot-password"
                className="text-[#CCFF00] hover:underline"
              >
                {isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
              </Link>
            </div>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              dir="ltr"
              className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[8px] bg-[#CCFF00] py-3 text-sm font-extrabold text-black hover:bg-[#B8E600]"
          >
            {loading
              ? isAr
                ? 'جاري التحقق وتسجيل الدخول...'
                : 'Signing in...'
              : isAr
              ? 'تسجيل الدخول ›'
              : 'Sign In ›'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--text-secondary)]">
          {isAr ? 'ليس لديك حساب على GIGADROP؟ ' : 'New to GIGADROP? '}
          <Link href="/register" className="font-bold text-[#CCFF00] hover:underline">
            {isAr ? 'إنشاء حساب عميل جديد' : 'Create a customer account'}
          </Link>
        </p>
      </div>
    </div>
  );
}
