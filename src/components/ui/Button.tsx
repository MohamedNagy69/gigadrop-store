import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      'bg-[#CCFF00] text-black font-semibold hover:bg-[#B8E600] hover:scale-[1.02] active:scale-[0.99]',
    secondary:
      'border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[#CCFF00]',
    ghost:
      'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]',
    danger: 'bg-[#FF4444] text-white font-semibold hover:opacity-90',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-[6px]',
    md: 'px-5 py-2.5 text-sm rounded-[8px]',
    lg: 'px-6 py-3.5 text-base rounded-[8px]',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
