'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  Menu,
  X,
  User,
  Shield,
  LogIn,
  LogOut,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import ThemeToggle from './ThemeToggle';
import { useCartStore } from '@/stores/cartStore';
import { useThemeStore } from '@/stores/themeStore';
import { useAuth } from '@/hooks/useAuth';
import { translations } from '@/lib/i18n';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { items, wishlistIds, setCartOpen } = useCartStore();
  const { locale } = useThemeStore();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const t = translations[locale];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/#library', label: t.navLibrary },
    { href: '/games', label: t.navGenres },
    { href: '/#how-it-works', label: t.navHowItWorks },
    ...(isAuthenticated && !isAdmin ? [{ href: '/track', label: t.trackOrder }] : []),
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
          : 'border-b border-white/[0.06] bg-[var(--bg-primary)]/60 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        {/* Start: Brand Logo + Clean Minimal Links */}
        <div className="flex items-center gap-7 lg:gap-9">
          <Link
            href="/"
            dir="ltr"
            className="group flex shrink-0 items-center gap-2.5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#CCFF00] text-base font-black text-black shadow-[0_0_20px_rgba(204,255,0,0.35)] transition-transform duration-200 group-hover:scale-105">
              G
            </span>
            <span className="text-xl font-black tracking-tight">
              <span className="text-[var(--text-primary)]">GIGA</span>
              <span className="text-[#CCFF00]">DROP</span>
            </span>
          </Link>

          {/* Desktop Navigation Links — Minimal & Clean */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive =
                link.href !== '/#library' &&
                link.href !== '/#how-it-works' &&
                pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 text-sm font-semibold transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-[#CCFF00]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-[#CCFF00]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* End: Role-Separated Account Controls + Cart */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Unified Pill: Language + Theme */}
          <ThemeToggle />

          {/* Wishlist Icon Button (for Customers / Guests) */}
          {!isAdmin && (
            <Link
              href={isAuthenticated ? '/dashboard/wishlist' : '/login'}
              title={t.wishlist}
              className="relative hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition-colors hover:border-[#CCFF00] hover:text-[#CCFF00]"
            >
              <Heart className="h-4 w-4" />
              {wishlistIds.length > 0 && (
                <span className="absolute -end-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#CCFF00] px-1 text-[10px] font-extrabold text-black">
                  {wishlistIds.length}
                </span>
              )}
            </Link>
          )}

          {/* Role-Specific Account Button:
              - Admin -> /admin ONLY
              - Customer -> /dashboard ONLY
              - Guest -> /login (Sign In) */}
          {isAuthenticated ? (
            isAdmin ? (
              <Link
                href="/admin"
                title={t.adminPanel}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#CCFF00]/40 bg-[#CCFF00]/10 px-3.5 text-xs font-bold text-[#CCFF00] transition-all hover:bg-[#CCFF00] hover:text-black whitespace-nowrap"
              >
                <Shield className="h-3.5 w-3.5 shrink-0" />
                <span>{t.adminPanel}</span>
              </Link>
            ) : (
              <Link
                href="/dashboard"
                title={t.dashboard}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3.5 text-xs font-bold text-[var(--text-primary)] transition-all hover:border-[#CCFF00] hover:text-[#CCFF00] whitespace-nowrap"
              >
                <User className="h-4 w-4 shrink-0 text-[#CCFF00]" />
                <span className="hidden sm:inline">
                  {user?.name ? user.name.split(' ')[0] : t.dashboard}
                </span>
              </Link>
            )
          ) : (
            <Link
              href="/login"
              title={t.login}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3.5 text-xs font-bold text-[var(--text-primary)] transition-all hover:border-[#CCFF00] hover:text-[#CCFF00] whitespace-nowrap"
            >
              <LogIn className="h-4 w-4 shrink-0 text-[#CCFF00]" />
              <span className="hidden sm:inline">{t.login}</span>
            </Link>
          )}

          {/* Sign Out Button when Authenticated */}
          {isAuthenticated && (
            <button
              type="button"
              onClick={async () => {
                await signOut({ redirect: false });
                window.location.href = '/login';
              }}
              title={t.signOut}
              className="hidden sm:inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#FF4444]/40 bg-[#FF4444]/10 text-[#FF4444] transition-colors hover:bg-[#FF4444] hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}

          {/* Signature GIGADROP Cart Button */}
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="group flex h-10 items-center gap-2 rounded-full border border-[#CCFF00] bg-[#CCFF00]/10 px-4 text-sm font-bold text-[var(--text-primary)] transition-all hover:bg-[#CCFF00] hover:text-black whitespace-nowrap"
          >
            <ShoppingBag className="h-4 w-4 shrink-0 text-[#CCFF00] group-hover:text-black" />
            <span className="hidden sm:inline">{t.cart}</span>
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#CCFF00] px-1.5 text-xs font-extrabold text-black group-hover:bg-black group-hover:text-[#CCFF00]">
              {items.length}
            </span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
            className="flex lg:hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border)] bg-[var(--bg-card)] px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3.5 py-2.5 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] hover:text-[#CCFF00]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[var(--border)] flex flex-wrap gap-2">
            {isAuthenticated ? (
              isAdmin ? (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#CCFF00] bg-[#CCFF00]/10 px-3 py-2.5 text-xs font-bold text-[#CCFF00]"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span>{t.adminPanel}</span>
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2.5 text-xs font-bold"
                >
                  <User className="h-3.5 w-3.5 text-[#CCFF00]" />
                  <span>{t.dashboard}</span>
                </Link>
              )
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#CCFF00] bg-[#CCFF00]/10 px-3 py-2.5 text-xs font-bold text-[#CCFF00]"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>{t.login}</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
