'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCcw, Home, AlertTriangle } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Handled application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-lg">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <span className="mt-6 text-xs font-bold uppercase tracking-[0.08em] text-[#CCFF00]">
        SYSTEM RECOVERY · استعادة الاتصال
      </span>

      <h1 className="mt-2 text-2xl sm:text-4xl font-black text-[var(--text-primary)]">
        حدث خطأ أثناء تحميل البيانات
      </h1>

      <p className="mt-3 max-w-md text-sm text-[var(--text-secondary)] leading-relaxed">
        حدث انقطاع مؤقت في الاتصال بقاعدة البيانات أو الخادم. تم تفعيل وضع الأمان التلقائي لحماية طلبك.
      </p>

      {error.digest && (
        <code className="mt-3 rounded bg-zinc-900 px-2.5 py-1 text-xs text-zinc-500 font-mono">
          Code: {error.digest}
        </code>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          type="button"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-[#CCFF00] px-6 text-sm font-black text-black shadow-lg transition-transform hover:scale-[1.02] hover:bg-[#B8E600]"
        >
          <RefreshCcw className="h-4 w-4" />
          <span>إعادة المحاولة / Retry</span>
        </button>

        <Link
          href="/"
          className="inline-flex h-12 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-6 text-sm font-bold text-[var(--text-primary)] transition-colors hover:border-[#CCFF00] hover:text-[#CCFF00]"
        >
          <Home className="h-4 w-4" />
          <span>الرئيسية / Storefront</span>
        </Link>
      </div>
    </div>
  );
}
