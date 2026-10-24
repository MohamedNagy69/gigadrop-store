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
    <footer className="dark-footer border-t border-[#222222] bg-[#111111] py-12 text-[#999999]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2" dir="ltr">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#BFFF00] text-sm font-black text-black">
              G
            </span>
            <span className="text-lg font-black tracking-tight">
              <span className="text-white">GIGA</span>
              <span className="text-[#BFFF00]">DROP</span>
            </span>
          </Link>

          {/* Center: Publisher Note + Legal Links */}
          <div className="text-center">
            <p className="text-xs text-[#999999]">{t.footerCenter}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-[#666666]">
              <Link href="/about" className="hover:text-[#BFFF00] transition-colors">
                {t.footerAbout}
              </Link>
              <Link href="/faq" className="hover:text-[#BFFF00] transition-colors">
                {t.footerFaq}
              </Link>
              {isAuthenticated && !isAdmin && (
                <Link href="/track" className="hover:text-[#BFFF00] transition-colors">
                  {t.footerTrack}
                </Link>
              )}
              <Link href="/contact" className="hover:text-[#BFFF00] transition-colors">
                {t.footerContact}
              </Link>
              <Link href="/terms" className="hover:text-[#BFFF00] transition-colors">
                {t.footerTerms}
              </Link>
              <Link href="/privacy" className="hover:text-[#BFFF00] transition-colors">
                {t.footerPrivacy}
              </Link>
            </div>
          </div>

          {/* Right: Tagline */}
          <div className="text-xs font-medium text-[#999999]">
            {t.footerRight}
          </div>
        </div>
      </div>
    </footer>
  );
}
