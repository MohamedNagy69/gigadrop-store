import React from 'react';
import Link from 'next/link';
import Logo3D from '@/components/three/Logo3D';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-primary)] px-4 text-center">
      <Logo3D size={96} />
      <span className="mt-6 text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
        ERROR 404 · SECTOR NOT FOUND
      </span>
      <h1 className="mt-2 text-4xl sm:text-6xl font-bold text-[var(--text-primary)]">
        Lost in Night City?
      </h1>
      <p className="mt-3 max-w-md text-sm text-[var(--text-secondary)]">
        The game or page you are looking for isn&apos;t on this drive sector. Head back to the GIGADROP library to queue your titles.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-[8px] bg-[#CCFF00] px-6 py-3 text-sm font-extrabold text-black hover:bg-[#B8E600]"
      >
        Back to Storefront ›
      </Link>
    </div>
  );
}
