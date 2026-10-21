'use client';

import React, { useState } from 'react';
import { HardDrive, Sparkles } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useThemeStore } from '@/stores/themeStore';
import { translations } from '@/lib/i18n';
import { calculatePrice, formatNumber } from '@/lib/utils';

export default function PriceCalculator() {
  const [sizeGB, setSizeGB] = useState<number>(150);
  const { ratePerGB } = useCartStore();
  const { locale } = useThemeStore();
  const t = translations[locale];

  const calculatedPrice = calculatePrice(sizeGB, ratePerGB);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val) || val < 0) {
      setSizeGB(0);
    } else if (val > 4000) {
      setSizeGB(4000);
    } else {
      setSizeGB(val);
    }
  };

  return (
    <div className="relative rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)]/95 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      {/* Top header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#CCFF00]/15 text-[#CCFF00]">
            <HardDrive className="h-4 w-4" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
            {t.priceCalculator}
          </span>
        </div>
        <span className="rounded-[6px] bg-[#CCFF00] px-2.5 py-0.5 text-[11px] font-bold text-black">
          {formatNumber(ratePerGB)} {t.egpCurrency} / {t.gbUnit}
        </span>
      </div>

      {/* Size in gigabytes input */}
      <div className="mb-5">
        <label
          htmlFor="gb-calculator-input"
          className="mb-2 block text-xs font-medium text-[var(--text-secondary)]"
        >
          {t.sizeInGigabytes}
        </label>
        <div className="relative flex items-center" dir="ltr">
          <input
            id="gb-calculator-input"
            type="number"
            min={0}
            max={4000}
            step={5}
            value={sizeGB}
            onChange={handleInputChange}
            className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 pr-14 text-lg font-bold text-[var(--text-primary)] outline-none transition-colors focus:border-[#CCFF00]"
          />
          <span className="pointer-events-none absolute right-4 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            {t.gbUnit}
          </span>
        </div>
      </div>

      {/* Interactive Range Slider */}
      <div className="mb-6" dir="ltr">
        <input
          type="range"
          min={10}
          max={1000}
          step={5}
          value={Math.min(sizeGB, 1000)}
          onChange={(e) => setSizeGB(Number(e.target.value))}
          aria-label="Size in gigabytes slider"
          className="giga-slider"
        />
        <div className="mt-2 flex justify-between text-[11px] font-medium text-[var(--text-muted)]">
          {[50, 150, 300, 500, 1000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setSizeGB(preset)}
              className={`rounded px-1.5 py-0.5 transition-colors ${
                sizeGB === preset
                  ? 'bg-[#CCFF00] text-black font-bold'
                  : 'hover:text-[var(--text-primary)]'
              }`}
            >
              {preset} {t.gbUnit}
            </button>
          ))}
        </div>
      </div>

      {/* Calculated Price Display */}
      <div className="rounded-[10px] border border-[var(--border)] bg-[var(--bg-primary)] p-5">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
              {t.estimatedTotal}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
                {formatNumber(calculatedPrice)}
              </span>
              <span className="text-base font-bold text-[#CCFF00]">{t.egpCurrency}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#CCFF00]/30 bg-[#CCFF00]/10 px-2.5 py-1 text-[11px] font-semibold text-[#CCFF00]">
              <Sparkles className="h-3 w-3" />
              {t.shaVerified}
            </span>
          </div>
        </div>

        <div className="mt-3 border-t border-[var(--border)] pt-3 flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <span>{t.formulaLabel}</span>
          <span className="font-mono font-semibold text-[var(--text-primary)]" dir="ltr">
            {formatNumber(sizeGB)} GB × {formatNumber(ratePerGB)} EGP
          </span>
        </div>
      </div>
    </div>
  );
}
