'use client';

import React from 'react';
import Link from 'next/link';
import { RefreshCcw, Home, AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" className="dark">
      <body className="min-h-screen bg-black text-white antialiased flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center text-center max-w-lg">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-lg">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <span className="mt-6 text-xs font-bold uppercase tracking-[0.08em] text-[#CCFF00]">
            CRITICAL RECOVERY · استعادة الاتصال
          </span>

          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            انقطع الاتصال المؤقت بالخادم
          </h1>

          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
            تم تسجيل الخطأ وحفظ سلة المشتريات الخاصة بك. يمكنك إعادة المحاولة الآن.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              type="button"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#CCFF00] px-6 text-sm font-black text-black shadow-lg hover:bg-[#B8E600]"
            >
              <RefreshCcw className="h-4 w-4" />
              <span>إعادة المحاولة / Retry</span>
            </button>

            <a
              href="/"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-6 text-sm font-bold text-white hover:border-[#CCFF00] hover:text-[#CCFF00]"
            >
              <Home className="h-4 w-4" />
              <span>الرئيسية / Home</span>
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
