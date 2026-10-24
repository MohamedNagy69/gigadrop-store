'use client';

import React from 'react';
import Link from 'next/link';
import { useThemeStore } from '@/stores/themeStore';
import { useAuth } from '@/hooks/useAuth';
import { translations } from '@/lib/i18n';

export default function Footer() {
  const { locale } = useThemeStore();
  const { isAuthenticated, isAdmin } = useAuth();
  const t = translations[locale];

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-primary)] py-12">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2" dir="ltr">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#CCFF00] text-sm font-black text-black">
              G
            </span>
            <span className="text-lg font-black tracking-tight">
              <span className="text-[var(--text-primary)]">GIGA</span>
              <span className="text-[#CCFF00]">DROP</span>
            </span>
          </Link>

          {/* Center: Publisher Note + Legal Links */}
          <div className="text-center">
            <p className="text-xs text-[var(--text-secondary)]">{t.footerCenter}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--text-muted)]">
              <Link href="/about" className="hover:text-[#CCFF00]">
                {t.footerAbout}
              </Link>
              <Link href="/faq" className="hover:text-[#CCFF00]">
                {t.footerFaq}
              </Link>
              {isAuthenticated && !isAdmin && (
                <Link href="/track" className="hover:text-[#CCFF00]">
                  {t.footerTrack}
                </Link>
              )}
              <Link href="/contact" className="hover:text-[#CCFF00]">
                {t.footerContact}
              </Link>
              <Link href="/terms" className="hover:text-[#CCFF00]">
                {t.footerTerms}
              </Link>
              <Link href="/privacy" className="hover:text-[#CCFF00]">
                {t.footerPrivacy}
              </Link>
            </div>
          </div>

          {/* Right: Tagline */}
          <div className="text-xs font-medium text-[var(--text-secondary)]">
            {t.footerRight}
          </div>
        </div>
      </div>
    </footer>
  );
}
