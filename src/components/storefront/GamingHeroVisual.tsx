'use client';

import React from 'react';
import { useThemeStore } from '@/stores/themeStore';
import { Zap, ShieldCheck, Gamepad2, HardDrive, Sparkles } from 'lucide-react';

export default function GamingHeroVisual() {
  const { locale, theme } = useThemeStore();
  const isAr = locale === 'ar';
  const isDark = theme !== 'light';

  return (
    <div className="relative flex w-full items-center justify-center select-none py-4">
      {/* Ambient Neon Backlights */}
      <div
        className="pointer-events-none absolute -inset-4 rounded-full blur-[100px] opacity-40 dark:opacity-40 light:opacity-20 transition-all duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(204,255,0,0.22) 0%, rgba(204,255,0,0.05) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, rgba(16,185,129,0.06) 50%, transparent 75%)',
        }}
      />

      {/* Subtle Orbital Circuit Rings */}
      <div className="pointer-events-none absolute h-[380px] w-[380px] sm:h-[440px] sm:w-[440px] rounded-full border border-white/[0.06] dark:border-white/[0.06] light:border-slate-300/50" />
      <div className="pointer-events-none absolute h-[290px] w-[290px] sm:h-[330px] sm:w-[330px] rounded-full border border-dashed border-[#CCFF00]/20 dark:border-[#CCFF00]/20 light:border-emerald-600/25 animate-[spin_60s_linear_infinite]" />

      {/* Main Floating Controller Container */}
      <div className="relative z-10 w-full max-w-[460px] transform-gpu transition-transform duration-500 hover:scale-[1.02]">
        
        {/* Floating Badge 1 - Top Corner (4K 120FPS Ready) */}
        <div
          className={`absolute -top-3 sm:-top-5 ${
            isAr ? '-right-2 sm:-right-4' : '-left-2 sm:-left-4'
          } z-20 flex items-center gap-2 rounded-full border border-white/10 dark:border-white/10 light:border-slate-200/80 bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-white/90 px-3.5 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.3)] light:shadow-[0_8px_20px_rgba(0,0,0,0.06)] backdrop-blur-md`}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#CCFF00] dark:bg-[#CCFF00] light:bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#CCFF00] dark:bg-[#CCFF00] light:bg-emerald-600" />
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-white dark:text-white light:text-slate-900">
            4K • 120 FPS Ready
          </span>
        </div>

        {/* Floating Badge 2 - Middle Corner (Plug & Play) */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 ${
            isAr ? '-left-3 sm:-left-6' : '-right-3 sm:-right-6'
          } z-20 hidden sm:flex items-center gap-2 rounded-2xl border border-[#CCFF00]/30 dark:border-[#CCFF00]/30 light:border-emerald-600/30 bg-zinc-950/85 dark:bg-zinc-950/85 light:bg-white/95 px-3.5 py-2 shadow-[0_12px_32px_rgba(204,255,0,0.12)] light:shadow-[0_12px_24px_rgba(16,185,129,0.1)] backdrop-blur-md`}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#CCFF00]/15 dark:bg-[#CCFF00]/15 light:bg-emerald-600/10 text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-700">
            <Zap className="h-4 w-4" />
          </div>
          <div className="text-right flex flex-col">
            <span className="text-[11px] font-black leading-tight text-white dark:text-white light:text-slate-900">
              {isAr ? 'توصيل ولعب فوري' : 'Plug & Play'}
            </span>
            <span className="text-[9px] font-semibold text-zinc-400 dark:text-zinc-400 light:text-slate-500">
              {isAr ? 'بدون إنترنت • 100% أوفلاين' : '100% Offline Single-Player'}
            </span>
          </div>
        </div>

        {/* Floating Badge 3 - Bottom Corner (Fast NVMe Drive) */}
        <div
          className={`absolute -bottom-3 sm:-bottom-4 ${
            isAr ? '-right-1 sm:-right-2' : '-left-1 sm:-left-2'
          } z-20 flex items-center gap-2 rounded-full border border-white/10 dark:border-white/10 light:border-slate-200/80 bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-white/90 px-3.5 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.3)] light:shadow-[0_8px_20px_rgba(0,0,0,0.06)] backdrop-blur-md`}
        >
          <HardDrive className="h-3.5 w-3.5 text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-600" />
          <span className="text-[11px] font-extrabold text-white dark:text-white light:text-slate-900">
            {isAr ? 'هارد خارجي فائق السرعة' : 'Ultra-Fast USB 3.2 Drive'}
          </span>
        </div>

        {/* High-Precision Next-Gen Controller SVG */}
        <div className="relative mx-auto w-full filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] light:drop-shadow-[0_20px_30px_rgba(0,0,0,0.12)]">
          <svg
            viewBox="0 0 600 420"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto transition-all duration-300"
          >
            <defs>
              {/* Outer Shell Gradient */}
              <linearGradient id="controllerBodyDark" x1="300" y1="40" x2="300" y2="400" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#22252a" />
                <stop offset="45%" stopColor="#121316" />
                <stop offset="100%" stopColor="#0a0b0d" />
              </linearGradient>

              <linearGradient id="controllerBodyLight" x1="300" y1="40" x2="300" y2="400" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#f3f4f6" />
                <stop offset="100%" stopColor="#e5e7eb" />
              </linearGradient>

              {/* Grip Accent Inner Gradient */}
              <linearGradient id="gripAccentDark" x1="120" y1="120" x2="480" y2="380" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1e2025" />
                <stop offset="100%" stopColor="#0d0e11" />
              </linearGradient>

              <linearGradient id="gripAccentLight" x1="120" y1="120" x2="480" y2="380" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f9fafb" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>

              {/* Neon Glow Filters */}
              <filter id="neonGlowLime" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Thumbstick Metallic Radial Gradient */}
              <radialGradient id="stickCapDark" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2a2e35" />
                <stop offset="70%" stopColor="#14161a" />
                <stop offset="100%" stopColor="#090a0c" />
              </radialGradient>

              <radialGradient id="stickCapLight" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#94a3b8" />
              </radialGradient>
            </defs>

            {/* Controller Shadow / Ground Reflection */}
            <ellipse
              cx="300"
              cy="395"
              rx="230"
              ry="20"
              fill={isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'}
              filter="url(#softGlow)"
            />

            {/* Left & Right Top Shoulder Triggers (L1 / R1, L2 / R2) */}
            <path
              d="M165 72 C175 42 225 36 248 40 L242 66 C220 63 182 66 165 72 Z"
              fill={isDark ? '#2a2d34' : '#d1d5db'}
              stroke={isDark ? '#3f434d' : '#9ca3af'}
              strokeWidth="2"
            />
            <path
              d="M435 72 C425 42 375 36 352 40 L358 66 C380 63 418 66 435 72 Z"
              fill={isDark ? '#2a2d34' : '#d1d5db'}
              stroke={isDark ? '#3f434d' : '#9ca3af'}
              strokeWidth="2"
            />

            {/* Main Outer Controller Body Silhouette */}
            <path
              d="M172 70 
                 C220 62 380 62 428 70 
                 C462 76 502 120 522 195 
                 C546 280 540 365 504 382 
                 C470 398 438 340 404 286 
                 C374 238 348 238 300 238 
                 C252 238 226 238 196 286 
                 C162 340 130 398 96 382 
                 C60 365 54 280 78 195 
                 C98 120 138 76 172 70 Z"
              fill={isDark ? 'url(#controllerBodyDark)' : 'url(#controllerBodyLight)'}
              stroke={isDark ? '#343842' : '#cbd5e1'}
              strokeWidth="3.5"
            />

            {/* Inner Grip Seam Insets (DualSense Ergonomic lines) */}
            <path
              d="M110 365 C136 375 160 325 192 278 C222 234 250 232 300 232 C350 232 378 234 408 278 C440 325 464 375 490 365"
              fill="none"
              stroke={isDark ? '#262930' : '#e2e8f0'}
              strokeWidth="2.5"
            />

            {/* Futuristic Grip Accent Panels */}
            <path
              d="M86 210 C70 275 74 340 102 360 C122 345 138 290 148 235 C122 225 102 218 86 210 Z"
              fill={isDark ? 'url(#gripAccentDark)' : 'url(#gripAccentLight)'}
              stroke={isDark ? '#2a2e38' : '#e2e8f0'}
              strokeWidth="1.5"
            />
            <path
              d="M514 210 C530 275 526 340 498 360 C478 345 462 290 452 235 C478 225 498 218 514 210 Z"
              fill={isDark ? 'url(#gripAccentDark)' : 'url(#gripAccentLight)'}
              stroke={isDark ? '#2a2e38' : '#e2e8f0'}
              strokeWidth="1.5"
            />

            {/* Central Touchpad / Screen */}
            <rect
              x="222"
              y="74"
              width="156"
              height="102"
              rx="14"
              fill={isDark ? '#14161a' : '#f8fafc'}
              stroke={isDark ? '#2e333d' : '#cbd5e1'}
              strokeWidth="2"
            />

            {/* Glowing Neon LED Lightbar (Surrounding the Touchpad) */}
            <path
              d="M218 78 L218 168 C218 174 224 179 230 179 L370 179 C376 179 382 174 382 168 L382 78"
              fill="none"
              stroke={isDark ? '#CCFF00' : '#059669'}
              strokeWidth="3.5"
              filter="url(#neonGlowLime)"
            />
            {/* Core bright light trace */}
            <path
              d="M218 78 L218 168 C218 174 224 179 230 179 L370 179 C376 179 382 174 382 168 L382 78"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.2"
              opacity="0.85"
            />

            {/* GIGADROP Watermark on Touchpad */}
            <text
              x="300"
              y="126"
              textAnchor="middle"
              fill={isDark ? 'rgba(204,255,0,0.5)' : 'rgba(5,150,105,0.7)'}
              fontSize="12"
              fontWeight="900"
              letterSpacing="3"
            >
              GIGADROP
            </text>

            {/* Status indicator dot on Touchpad */}
            <circle
              cx="300"
              cy="145"
              r="2.5"
              fill={isDark ? '#CCFF00' : '#10b981'}
              filter="url(#softGlow)"
            />

            {/* Directional D-PAD (Left Side) */}
            <g transform="translate(142, 126)">
              {/* D-Pad Base Circle */}
              <circle cx="44" cy="44" r="46" fill={isDark ? '#14161b' : '#e2e8f0'} stroke={isDark ? '#23262f' : '#cbd5e1'} strokeWidth="1.5" />
              {/* D-Pad Cross */}
              <path
                d="M34 10 L54 10 L54 34 L78 34 L78 54 L54 54 L54 78 L34 78 L34 54 L10 54 L10 34 L34 34 Z"
                fill={isDark ? '#252932' : '#ffffff'}
                stroke={isDark ? '#3a404e' : '#94a3b8'}
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* D-Pad Arrows / Neon Markers */}
              <polygon points="44,18 40,24 48,24" fill={isDark ? '#CCFF00' : '#059669'} opacity="0.9" />
              <polygon points="44,70 40,64 48,64" fill={isDark ? '#CCFF00' : '#059669'} opacity="0.9" />
              <polygon points="18,44 24,40 24,48" fill={isDark ? '#CCFF00' : '#059669'} opacity="0.9" />
              <polygon points="70,44 64,40 64,48" fill={isDark ? '#CCFF00' : '#059669'} opacity="0.9" />
            </g>

            {/* Action Face Buttons (Right Side: △ ○ ✕ □) */}
            <g transform="translate(370, 126)">
              {/* Base Circle */}
              <circle cx="44" cy="44" r="46" fill={isDark ? '#14161b' : '#e2e8f0'} stroke={isDark ? '#23262f' : '#cbd5e1'} strokeWidth="1.5" />
              
              {/* Top Button: Triangle △ */}
              <circle cx="44" cy="18" r="11" fill={isDark ? '#1d2027' : '#ffffff'} stroke={isDark ? '#353a47' : '#94a3b8'} strokeWidth="1.5" />
              <polygon points="44,13 39,21 49,21" fill="none" stroke="#22d3ee" strokeWidth="2" />

              {/* Right Button: Circle ○ */}
              <circle cx="70" cy="44" r="11" fill={isDark ? '#1d2027' : '#ffffff'} stroke={isDark ? '#353a47' : '#94a3b8'} strokeWidth="1.5" />
              <circle cx="70" cy="44" r="4.5" fill="none" stroke="#f43f5e" strokeWidth="2" />

              {/* Bottom Button: Cross ✕ */}
              <circle cx="44" cy="70" r="11" fill={isDark ? '#1d2027' : '#ffffff'} stroke={isDark ? '#353a47' : '#94a3b8'} strokeWidth="1.5" />
              <path d="M40.5 66.5 L47.5 73.5 M47.5 66.5 L40.5 73.5" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />

              {/* Left Button: Square □ */}
              <circle cx="18" cy="44" r="11" fill={isDark ? '#1d2027' : '#ffffff'} stroke={isDark ? '#353a47' : '#94a3b8'} strokeWidth="1.5" />
              <rect x="14" y="40" width="8" height="8" fill="none" stroke="#e879f9" strokeWidth="2" />
            </g>

            {/* Left Analog Thumbstick */}
            <g transform="translate(196, 218)">
              {/* Outer Well Ring */}
              <circle cx="36" cy="36" r="38" fill={isDark ? '#0f1013' : '#cbd5e1'} stroke={isDark ? '#22252c' : '#94a3b8'} strokeWidth="2" />
              {/* Neon Accent Ring */}
              <circle cx="36" cy="36" r="32" fill="none" stroke={isDark ? '#CCFF00' : '#10b981'} strokeWidth="2" opacity="0.75" filter="url(#softGlow)" />
              {/* Stick Cap */}
              <circle cx="36" cy="36" r="28" fill={isDark ? 'url(#stickCapDark)' : 'url(#stickCapLight)'} stroke={isDark ? '#343844' : '#64748b'} strokeWidth="2" />
              {/* Grip Indent */}
              <circle cx="36" cy="36" r="16" fill="none" stroke={isDark ? '#23262f' : '#cbd5e1'} strokeWidth="2" strokeDasharray="4 3" />
            </g>

            {/* Right Analog Thumbstick */}
            <g transform="translate(296, 218)">
              {/* Outer Well Ring */}
              <circle cx="36" cy="36" r="38" fill={isDark ? '#0f1013' : '#cbd5e1'} stroke={isDark ? '#22252c' : '#94a3b8'} strokeWidth="2" />
              {/* Neon Accent Ring */}
              <circle cx="36" cy="36" r="32" fill="none" stroke={isDark ? '#CCFF00' : '#10b981'} strokeWidth="2" opacity="0.75" filter="url(#softGlow)" />
              {/* Stick Cap */}
              <circle cx="36" cy="36" r="28" fill={isDark ? 'url(#stickCapDark)' : 'url(#stickCapLight)'} stroke={isDark ? '#343844' : '#64748b'} strokeWidth="2" />
              {/* Grip Indent */}
              <circle cx="36" cy="36" r="16" fill="none" stroke={isDark ? '#23262f' : '#cbd5e1'} strokeWidth="2" strokeDasharray="4 3" />
            </g>

            {/* PlayStation / Home Logo Button */}
            <circle
              cx="300"
              cy="198"
              r="10"
              fill={isDark ? '#1e2129' : '#e2e8f0'}
              stroke={isDark ? '#383e4d' : '#94a3b8'}
              strokeWidth="1.5"
            />
            <path
              d="M296 200 L300 194 L304 200 Z"
              fill={isDark ? '#CCFF00' : '#059669'}
            />

            {/* Speaker Grille Dots */}
            <circle cx="295" cy="180" r="1" fill={isDark ? '#3f4453' : '#94a3b8'} />
            <circle cx="300" cy="180" r="1" fill={isDark ? '#3f4453' : '#94a3b8'} />
            <circle cx="305" cy="180" r="1" fill={isDark ? '#3f4453' : '#94a3b8'} />
            <circle cx="297.5" cy="184" r="1" fill={isDark ? '#3f4453' : '#94a3b8'} />
            <circle cx="302.5" cy="184" r="1" fill={isDark ? '#3f4453' : '#94a3b8'} />
          </svg>
        </div>
      </div>
    </div>
  );
}
