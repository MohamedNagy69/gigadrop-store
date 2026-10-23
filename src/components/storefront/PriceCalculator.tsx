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
  const isAr = locale === 'ar';

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
    <div className="relative w-full rounded-2xl border border-white/10 dark:border-white/10 light:border-slate-300 bg-[#0B0B0E]/90 dark:bg-[#0B0B0E]/90 light:bg-white/95 p-6 sm:p-7 backdrop-blur-xl shadow-2xl transition-all">
      {/* Top Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#CCFF00]/15 dark:bg-[#CCFF00]/15 light:bg-emerald-600/15 text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-700 shadow-sm">
            <HardDrive className="h-4 w-4" />
          </span>
          <span className="text-xs font-black uppercase tracking-[0.08em] text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-800">
            {t.priceCalculator}
          </span>
        </div>
        <span className="rounded-md bg-[#CCFF00] dark:bg-[#CCFF00] light:bg-emerald-700 px-2.5 py-1 text-[11px] font-black text-black light:text-white shadow-[0_0_12px_rgba(204,255,0,0.3)]">
          {formatNumber(ratePerGB)} {t.egpCurrency} / {t.gbUnit}
        </span>
      </div>

      {/* Size in Gigabytes Input */}
      <div className="mb-5">
        <label
          htmlFor="gb-calculator-input"
          className="mb-2 block text-xs font-semibold text-zinc-400 dark:text-zinc-400 light:text-slate-600"
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
            className="w-full rounded-xl border border-white/10 dark:border-white/10 light:border-slate-300 bg-black/50 dark:bg-black/50 light:bg-slate-100 px-4 py-3 pr-14 text-lg font-black text-white dark:text-white light:text-slate-900 outline-none transition-colors focus:border-[#CCFF00] dark:focus:border-[#CCFF00] light:focus:border-emerald-600"
          />
          <span className="pointer-events-none absolute right-4 text-xs font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-400 light:text-slate-500">
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
        <div className="mt-3 flex justify-between text-[11px] font-bold">
          {[50, 150, 300, 500, 1000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setSizeGB(preset)}
              className={`rounded-md px-2 py-1 transition-all ${
                sizeGB === preset
                  ? 'bg-[#CCFF00] dark:bg-[#CCFF00] light:bg-emerald-700 text-black light:text-white font-black shadow-[0_0_12px_rgba(204,255,0,0.35)] scale-105'
                  : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900'
              }`}
            >
              {preset} {t.gbUnit}
            </button>
          ))}
        </div>
      </div>

      {/* Calculated Total Card */}
      <div className="rounded-xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-black/40 dark:bg-black/40 light:bg-slate-50 p-5">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.08em] text-zinc-400 dark:text-zinc-400 light:text-slate-600">
              {t.estimatedTotal}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white dark:text-white light:text-slate-950">
                {formatNumber(calculatedPrice)}
              </span>
              <span className="text-base font-black text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-700">
                {t.egpCurrency}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CCFF00]/30 dark:border-[#CCFF00]/30 light:border-emerald-600/30 bg-[#CCFF00]/10 dark:bg-[#CCFF00]/10 light:bg-emerald-600/10 px-2.5 py-1 text-[11px] font-black text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-800">
              <Sparkles className="h-3 w-3" />
              {t.shaVerified}
            </span>
          </div>
        </div>

        <div className="mt-3.5 border-t border-white/10 dark:border-white/10 light:border-slate-200 pt-3 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600">
          <span>{t.formulaLabel}</span>
          <span className="font-mono font-bold text-zinc-200 dark:text-zinc-200 light:text-slate-800" dir="ltr">
            {formatNumber(sizeGB)} GB × {formatNumber(ratePerGB)} EGP
          </span>
        </div>
      </div>
    </div>
  );
}
