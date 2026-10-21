'use client';

import React from 'react';
import { X, Trash2, HardDrive, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useThemeStore } from '@/stores/themeStore';
import { translations } from '@/lib/i18n';
import { formatNumber } from '@/lib/utils';

export default function CartSidebar() {
  const {
    items,
    isCartOpen,
    setCartOpen,
    setCheckoutOpen,
    removeItem,
    clearCart,
    getTotalGB,
    getTotalPrice,
  } = useCartStore();
  const { locale } = useThemeStore();
  const t = translations[locale];

  if (!isCartOpen) return null;

  const totalGB = getTotalGB();
  const totalPrice = getTotalPrice();

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Blurred Backdrop */}
      <div
        onClick={() => setCartOpen(false)}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-in Drawer */}
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-s border-[var(--border)] bg-[var(--bg-card)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] p-6">
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
              {t.yourOrder}
            </span>
            <div className="mt-1 flex items-center gap-2.5">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                {t.gameCart}
              </h2>
              <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[#CCFF00] px-2 text-xs font-extrabold text-black">
                {items.length}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[#CCFF00] hover:text-[var(--text-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {items.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bg-primary)] text-[var(--text-muted)]">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <p className="max-w-xs text-sm text-[var(--text-secondary)]">
                {t.cartEmpty}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs text-[var(--text-secondary)]">
                  {t.selectedTitlesForDrive}
                </span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-medium text-[var(--text-muted)] hover:text-[#FF4444]"
                >
                  {t.clearAll}
                </button>
              </div>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--bg-primary)] p-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.coverImage}
                      alt={item.name}
                      className="h-14 w-11 shrink-0 rounded-[6px] object-cover"
                    />
                    <div>
                      <h4 className="line-clamp-1 text-sm font-semibold text-[var(--text-primary)]">
                        {item.name}
                      </h4>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <span>{formatNumber(item.sizeGB)} {t.gbUnit}</span>
                        <span>·</span>
                        <span className="font-semibold text-[#CCFF00]">
                          {formatNumber(item.price)} {t.egpCurrency}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] text-[var(--text-muted)] hover:bg-[#FF4444]/10 hover:text-[#FF4444]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer Totals & Checkout CTA */}
        {items.length > 0 && (
          <div className="border-t border-[var(--border)] bg-[var(--bg-primary)] p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <HardDrive className="h-4 w-4 text-[#CCFF00]" />
                  {t.totalData}
                </span>
                <span className="font-mono font-bold text-[var(--text-primary)]">
                  {formatNumber(totalGB)} {t.gbUnit}
                </span>
              </div>

              {totalGB >= 250 && (
                <div className="flex items-center justify-between text-xs text-[#CCFF00]">
                  <span>{t.bulkDriveDiscount}</span>
                  <span>{t.autoApplied}</span>
                </div>
              )}

              <div className="flex items-baseline justify-between border-t border-[var(--border)] pt-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  {t.estimatedPrice}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-[var(--text-primary)]">
                    {formatNumber(totalPrice)}
                  </span>
                  <span className="text-xs font-bold text-[#CCFF00]">{t.egpCurrency}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCheckoutOpen(true)}
              className="w-full rounded-[8px] bg-[#CCFF00] py-3.5 text-sm font-extrabold text-black transition-all hover:bg-[#B8E600] hover:scale-[1.01]"
            >
              {t.continueToCheckout}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
