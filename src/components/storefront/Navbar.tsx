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
  HardDrive,
  Gamepad2,
  Layers,
  HelpCircle,
  MessageSquare,
  Sun,
  Moon,
  Languages,
  UserPlus,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
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
  const { theme, setTheme, locale, setLocale } = useThemeStore();
  const isAr = locale === 'ar';
  const { user, isAuthenticated, isAdmin } = useAuth();
  const t = translations[locale];

  // Scroll detection for navbar blur / elevation
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Body scroll locking when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { href: '/#library', label: isAr ? 'مكتبة الألعاب' : 'Library' },
    { href: '/#hard-drives', label: isAr ? 'متجر الهاردات' : 'Hard Drives' },
    { href: '/games', label: t.navGenres },
    { href: '/#how-it-works', label: t.navHowItWorks },
    ...(isAuthenticated && !isAdmin ? [{ href: '/track', label: t.trackOrder }] : []),
  ];

  const mobileNavItems = [
    {
      href: '/#library',
      icon: Gamepad2,
      label: isAr ? 'مكتبة الألعاب' : 'Game Library',
      subtitle: isAr ? 'أضخم مكتبة ألعاب PC بأحدث التحديثات' : 'Browse latest PC games',
      badge: null,
    },
    {
      href: '/#hard-drives',
      icon: HardDrive,
      label: isAr ? 'متجر الهاردات الجديد' : 'Hard Drives Store',
      subtitle: isAr ? 'شراء هارد SSD أو HDD مع ألعابك' : 'Buy SSD/HDD loaded with games',
      badge: isAr ? 'جديد 🔥' : 'NEW 🔥',
      badgeColor: 'border-[#CCFF00]/40 bg-[#CCFF00]/15 text-[#CCFF00]',
    },
    {
      href: '/games',
      icon: Layers,
      label: t.navGenres,
      subtitle: isAr ? 'أكشن، سباقات، رعب، مغامرات والمزيد' : 'Action, RPG, Racing & more',
      badge: null,
    },
    {
      href: '/#how-it-works',
      icon: HelpCircle,
      label: t.navHowItWorks,
      subtitle: isAr ? 'كيف يتم تجهيز الهارد وتوصيله لباب بيتك' : 'Order steps & door delivery',
      badge: null,
    },
    {
      href: isAuthenticated ? '/dashboard/wishlist' : '/login',
      icon: Heart,
      label: isAr ? 'ألعابك المفضلة' : 'Wishlist',
      subtitle: isAr ? 'قائمة الألعاب التي حفظتها لاحقاً' : 'Your saved games list',
      badge: wishlistIds.length > 0 ? `${wishlistIds.length}` : null,
      badgeColor: 'bg-[#CCFF00] text-black font-extrabold',
    },
    {
      href: isAuthenticated ? '/dashboard/support' : '/login',
      icon: MessageSquare,
      label: isAr ? 'شات الدعم الفني المباشر' : 'Live Support Chat',
      subtitle: isAr ? 'تجهيز الهارد ديسك والاستفسارات' : 'Drive setup & inquiries',
      badge: isAr ? 'مباشر' : 'LIVE',
      badgeColor: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
    },
    ...(isAuthenticated && !isAdmin
      ? [
          {
            href: '/track',
            icon: Shield,
            label: t.trackOrder,
            subtitle: isAr ? 'متابعة حالة شحن وتوصيل طلبك' : 'Track your order delivery',
            badge: null,
          },
        ]
      : []),
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
            : 'border-b border-white/[0.06] bg-[var(--bg-primary)]/60 backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          
          {/* Start: Brand Logo + Clean Minimal Links */}
          <div className="flex items-center gap-6 lg:gap-9">
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
                  link.href !== '/#hard-drives' &&
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

          {/* End: Controls (Theme, Wishlist, Account, Cart, Mobile Menu) */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            {/* Unified Pill: Language + Theme (Hidden on small mobile phones to prevent header crowding) */}
            <div className="hidden sm:inline-flex">
              <ThemeToggle />
            </div>

            {/* Wishlist Icon Button (Desktop / Tablet) */}
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

            {/* Desktop Account Controls */}
            {isAuthenticated ? (
              isAdmin ? (
                <Link
                  href="/admin"
                  title={t.adminPanel}
                  className="hidden sm:inline-flex h-10 items-center gap-1.5 rounded-full border border-[#CCFF00]/40 bg-[#CCFF00]/10 px-3.5 text-xs font-bold text-[#CCFF00] transition-all hover:bg-[#CCFF00] hover:text-black whitespace-nowrap"
                >
                  <Shield className="h-3.5 w-3.5 shrink-0" />
                  <span>{t.adminPanel}</span>
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  title={t.dashboard}
                  className="hidden sm:inline-flex h-10 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3.5 text-xs font-bold text-[var(--text-primary)] transition-all hover:border-[#CCFF00] hover:text-[#CCFF00] whitespace-nowrap"
                >
                  <User className="h-4 w-4 shrink-0 text-[#CCFF00]" />
                  <span>{user?.name ? user.name.split(' ')[0] : t.dashboard}</span>
                </Link>
              )
            ) : (
              <Link
                href="/login"
                title={t.login}
                className="hidden sm:inline-flex h-10 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3.5 text-xs font-bold text-[var(--text-primary)] transition-all hover:border-[#CCFF00] hover:text-[#CCFF00] whitespace-nowrap"
              >
                <LogIn className="h-4 w-4 shrink-0 text-[#CCFF00]" />
                <span>{t.login}</span>
              </Link>
            )}

            {/* Desktop Sign Out Button */}
            {isAuthenticated && (
              <button
                type="button"
                onClick={async () => {
                  await signOut({ redirect: false });
                  window.location.href = '/login';
                }}
                title={t.signOut}
                className="hidden lg:inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#FF4444]/40 bg-[#FF4444]/10 text-[#FF4444] transition-colors hover:bg-[#FF4444] hover:text-white"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}

            {/* Signature GIGADROP Cart Button */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label="Open Cart"
              className="group flex h-10 items-center gap-2 rounded-full border border-[#CCFF00] bg-[#CCFF00]/10 px-3.5 sm:px-4 text-sm font-bold text-[var(--text-primary)] transition-all hover:bg-[#CCFF00] hover:text-black whitespace-nowrap shadow-sm"
            >
              <ShoppingBag className="h-4 w-4 shrink-0 text-[#CCFF00] group-hover:text-black" />
              <span className="hidden md:inline">{t.cart}</span>
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#CCFF00] px-1.5 text-xs font-extrabold text-black group-hover:bg-black group-hover:text-[#CCFF00]">
                {items.length}
              </span>
            </button>

            {/* Mobile Hamburger Drawer Trigger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="flex lg:hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* MOBILE LUXURY SLIDE-OVER NAVIGATION DRAWER */}
      {/* ============================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" dir={isAr ? 'rtl' : 'ltr'}>
          {/* Backdrop Blur Overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
            aria-hidden="true"
          />

          {/* Slide-over Drawer Sheet */}
          <div
            className={`fixed inset-y-0 ${
              isAr ? 'right-0' : 'left-0'
            } z-50 flex h-full w-full max-w-[340px] xs:max-w-[360px] sm:max-w-[400px] flex-col justify-between border-[var(--border)] bg-[var(--bg-card)]/98 dark:bg-black/95 light:bg-white/98 backdrop-blur-2xl shadow-2xl transition-transform animate-in ${
              isAr ? 'slide-in-from-right' : 'slide-in-from-left'
            } duration-300 overflow-y-auto ${
              isAr ? 'border-l' : 'border-r'
            }`}
          >
            {/* Top Header of Drawer */}
            <div className="flex items-center justify-between border-b border-[var(--border)] p-4 sm:p-5">
              <Link
                href="/"
                dir="ltr"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CCFF00] text-sm font-black text-black shadow-[0_0_15px_rgba(204,255,0,0.35)]">
                  G
                </span>
                <span className="text-lg font-black tracking-tight">
                  <span className="text-[var(--text-primary)]">GIGA</span>
                  <span className="text-[#CCFF00]">DROP</span>
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 space-y-5 px-4 py-4 sm:px-5">
              
              {/* User Account / Profile Card */}
              {isAuthenticated ? (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)]/80 p-3.5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#CCFF00]/15 border border-[#CCFF00]/40 text-base font-black text-[#CCFF00]">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[var(--bg-primary)] bg-emerald-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-bold text-[var(--text-primary)]">
                          {user?.name || (isAr ? 'لاعب جيجاد روب' : 'GigaDrop Player')}
                        </p>
                        <span className="rounded-md border border-[#CCFF00]/30 bg-[#CCFF00]/10 px-1.5 py-0.5 text-[10px] font-extrabold text-[#CCFF00]">
                          {isAdmin ? (isAr ? 'أدمن' : 'ADMIN') : (isAr ? 'عميل' : 'USER')}
                        </span>
                      </div>
                      <p className="truncate text-xs text-[var(--text-secondary)]">
                        {user?.email || ''}
                      </p>
                    </div>
                  </div>

                  {/* Account Action Buttons */}
                  <div className="mt-3 grid grid-cols-2 gap-2 pt-3 border-t border-[var(--border)]">
                    {isAdmin ? (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#CCFF00] bg-[#CCFF00]/15 py-2 text-xs font-black text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black transition-all"
                      >
                        <Shield className="h-3.5 w-3.5" />
                        <span>{t.adminPanel}</span>
                      </Link>
                    ) : (
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] py-2 text-xs font-bold text-[var(--text-primary)] hover:border-[#CCFF00] hover:text-[#CCFF00] transition-all"
                      >
                        <User className="h-3.5 w-3.5 text-[#CCFF00]" />
                        <span>{t.dashboard}</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={async () => {
                        setMobileMenuOpen(false);
                        await signOut({ redirect: false });
                        window.location.href = '/login';
                      }}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#FF4444]/40 bg-[#FF4444]/10 py-2 text-xs font-bold text-[#FF4444] hover:bg-[#FF4444] hover:text-white transition-all"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>{t.signOut}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Guest Welcome Card */
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)]/80 p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="h-4 w-4 text-[#CCFF00]" />
                    <h3 className="text-sm font-black text-[var(--text-primary)]">
                      {isAr ? 'أهلاً بك في جيجاد روب 🎮' : 'Welcome to GigaDrop 🎮'}
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                    {isAr
                      ? 'سجل دخولك لتتبع طلبات الهارد ديسك ومحادثة الدعم الفني مباشرة'
                      : 'Sign in to manage orders, wishlist, and direct support chat'}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#CCFF00] py-2.5 text-xs font-black text-black hover:bg-[#B8E600] transition-all shadow-sm"
                    >
                      <LogIn className="h-3.5 w-3.5" />
                      <span>{t.login}</span>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] py-2.5 text-xs font-bold text-[var(--text-primary)] hover:border-[#CCFF00] hover:text-[#CCFF00] transition-all"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>{isAr ? 'حساب جديد' : 'Register'}</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Navigation Links with Icons */}
              <div className="space-y-1.5">
                <span className="block px-1 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {isAr ? 'أقسام المتجر الرئيسية' : 'Store Navigation'}
                </span>

                {mobileNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href !== '/#library' &&
                    item.href !== '/#how-it-works' &&
                    item.href !== '/#hard-drives' &&
                    pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`group flex items-center justify-between rounded-xl p-2.5 transition-all ${
                        isActive
                          ? 'border border-[#CCFF00]/40 bg-[#CCFF00]/10 text-[#CCFF00]'
                          : 'border border-transparent bg-[var(--bg-primary)]/50 hover:border-[var(--border)] hover:bg-[var(--bg-primary)] text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            isActive
                              ? 'bg-[#CCFF00] text-black'
                              : 'bg-[var(--bg-card)] text-[#CCFF00] group-hover:bg-[#CCFF00] group-hover:text-black'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-xs sm:text-sm font-bold">
                            {item.label}
                          </p>
                          <p className="truncate text-[10px] text-[var(--text-secondary)]">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              item.badgeColor || 'bg-[#CCFF00] text-black'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {isAr ? (
                          <ChevronLeft className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[#CCFF00] transition-colors" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[#CCFF00] transition-colors" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Theme & Language Quick Controls Card */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)]/60 p-3.5 space-y-3">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {isAr ? 'الإعدادات والمظهر' : 'Appearance & Locale'}
                </span>

                <div className="grid grid-cols-2 gap-2">
                  {/* Language Selector */}
                  <div className="flex items-center rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-1">
                    <button
                      type="button"
                      onClick={() => setLocale('ar')}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                        isAr
                          ? 'bg-[#CCFF00] text-black shadow-sm'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      العربية
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocale('en')}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                        !isAr
                          ? 'bg-[#CCFF00] text-black shadow-sm'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      English
                    </button>
                  </div>

                  {/* Theme Selector */}
                  <div className="flex items-center rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-1">
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                        theme === 'dark'
                          ? 'bg-[#CCFF00] text-black shadow-sm'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Moon className="h-3 w-3" />
                      <span>{isAr ? 'داكن' : 'Dark'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                        theme === 'light'
                          ? 'bg-[#CCFF00] text-black shadow-sm'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Sun className="h-3 w-3" />
                      <span>{isAr ? 'فاتح' : 'Light'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Support Button */}
              <a
                href="https://wa.me/201000000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20GIGADROP%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%B7%D9%84%D8%A8%20%D8%A3%D9%84%D8%B9%D8%A7%D8%A8%20%D9%88%D9%87%D8%A7%D8%B1%D8%AF%D8%A7%D8%AA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-xs sm:text-sm font-black text-black shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:brightness-110 transition-all"
              >
                <MessageCircle className="h-4 w-4 shrink-0 fill-black" />
                <span>{isAr ? 'تواصل واتساب مباشرة 24/7' : 'WhatsApp Instant Support 24/7'}</span>
              </a>

            </div>

            {/* Bottom Footer Note */}
            <div className="border-t border-[var(--border)] p-4 text-center">
              <p className="text-[11px] text-[var(--text-muted)]">
                {isAr
                  ? 'GIGADROP 2026 • ألعابك حتى باب منزلك'
                  : 'GIGADROP 2026 • Games delivered to your door'}
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
