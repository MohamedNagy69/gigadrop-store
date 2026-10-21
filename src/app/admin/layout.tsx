'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, LogOut, ShieldCheck } from 'lucide-react';
import { signOut } from 'next-auth/react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ThemeToggle from '@/components/storefront/ThemeToggle';
import { useThemeStore } from '@/stores/themeStore';
import { useAuth } from '@/hooks/useAuth';
import { translations } from '@/lib/i18n';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale } = useThemeStore();
  const { user } = useAuth();
  const t = translations[locale];
  const isAr = locale === 'ar';

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <AdminSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        {/* Spacious Top Header Bar — Strictly Admin Only */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-card)]/90 px-4 sm:px-8 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CCFF00]/15 text-[#CCFF00]">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <span className="block text-sm font-bold text-[var(--text-primary)]">
                {isAr ? 'لوحة تحكم الإدارة والتاجر' : 'Merchant & Admin Console'}
              </span>
              {user?.email && (
                <span className="block text-[11px] text-[#CCFF00]">
                  {user.email} ({user.role})
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[#CCFF00] bg-[#CCFF00]/10 px-4 text-xs font-bold text-[#CCFF00] transition-all hover:bg-[#CCFF00] hover:text-black whitespace-nowrap"
            >
              <span className="hidden sm:inline">{t.backToStorefront}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={async () => {
                await signOut({ redirect: false });
                window.location.href = '/login';
              }}
              title={t.signOut}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#FF4444]/40 bg-[#FF4444]/10 px-4 text-xs font-bold text-[#FF4444] transition-all hover:bg-[#FF4444] hover:text-white whitespace-nowrap"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              <span>{t.signOut}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
