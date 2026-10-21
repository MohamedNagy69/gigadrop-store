'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ShoppingBag,
  Gamepad2,
  Heart,
  User,
  Ticket,
  MessageSquare,
  Bell,
  ArrowLeft,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useThemeStore } from '@/stores/themeStore';
import { translations } from '@/lib/i18n';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { locale } = useThemeStore();
  const t = translations[locale];
  const isAr = locale === 'ar';

  const NAV_ITEMS = [
    { href: '/dashboard', label: t.dashOverview, icon: Home },
    { href: '/dashboard/orders', label: t.dashOrders, icon: ShoppingBag },
    { href: '/dashboard/library', label: t.dashLibrary, icon: Gamepad2 },
    { href: '/dashboard/wishlist', label: t.dashWishlist, icon: Heart },
    { href: '/dashboard/profile', label: t.dashProfile, icon: User },
    { href: '/dashboard/referrals', label: t.dashReferrals, icon: Ticket },
    { href: '/dashboard/support', label: t.dashSupport, icon: MessageSquare },
    { href: '/dashboard/notifications', label: t.dashNotifications, icon: Bell },
  ];

  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  return (
    <aside className="flex w-full flex-col border-b border-[var(--border)] bg-[var(--bg-card)] lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-e lg:min-h-screen">
      {/* Clean Pure Brand Logo */}
      <div className="flex h-20 items-center border-b border-[var(--border)] px-6">
        <Link href="/" className="flex items-center gap-3" dir="ltr">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#CCFF00] text-base font-black text-black shadow-[0_0_18px_rgba(204,255,0,0.3)]">
            G
          </span>
          <div className="leading-none">
            <span className="block text-lg font-black tracking-tight">
              <span className="text-[var(--text-primary)]">GIGA</span>
              <span className="text-[#CCFF00]">DROP</span>
            </span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
              CUSTOMER HUB
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto p-3.5 lg:flex-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                active
                  ? 'bg-[#CCFF00] text-black font-bold shadow-[0_0_15px_rgba(204,255,0,0.2)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="hidden lg:flex flex-col gap-2 border-t border-[var(--border)] p-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-[8px] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[#CCFF00]"
        >
          <BackIcon className="h-4 w-4 shrink-0" />
          <span>{t.backToStorefront}</span>
        </Link>
        <button
          type="button"
          onClick={async () => {
            await signOut({ redirect: false });
            window.location.href = '/login';
          }}
          className="flex items-center gap-2 rounded-[8px] px-3 py-2 text-xs font-medium text-[#FF4444] hover:bg-[#FF4444]/10"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>{t.signOut}</span>
        </button>
      </div>
    </aside>
  );
}
