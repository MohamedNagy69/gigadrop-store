import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculatePrice(sizeGB: number, ratePerGB: number = 1.0): number {
  if (sizeGB <= 0 || ratePerGB <= 0) return 0;
  return Number((sizeGB * ratePerGB).toFixed(2));
}

export function formatEGP(amount: number): string {
  return `${Number(amount || 0).toFixed(2)} EGP`;
}

export function formatNumber(amount: number, decimals: number = 2): string {
  return Number(amount || 0).toFixed(decimals);
}

export function formatGB(sizeGB: number): string {
  return `${Number(sizeGB || 0).toFixed(2)} GB`;
}

export function formatEgyptPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('20') && digits.length === 12) {
    return `+20 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  if (digits.startsWith('01') && digits.length === 11) {
    return `+20 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return phone;
}

export function generateOrderNumber(seq?: number): string {
  const year = new Date().getFullYear();
  const num = seq
    ? String(seq).padStart(5, '0')
    : String(Math.floor(10000 + Math.random() * 90000));
  return `GD-${year}-${num}`;
}

export function generateReferralCode(name: string): string {
  const clean = name
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .slice(0, 6) || 'PLAYER';
  const rand = Math.floor(10 + Math.random() * 90);
  return `GIGA-${clean}${rand}`;
}

export function generateFawryRef(): string {
  return `988${Math.floor(1000000 + Math.random() * 9000000)}`;
}

export function getWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const formatted = cleanPhone.startsWith('0') ? `2${cleanPhone}` : cleanPhone;
  return `https://wa.me/${formatted}?text=${encodeURIComponent(message)}`;
}

export const CAIRO_DISTRICTS = [
  'Nasr City',
  'Maadi',
  'Heliopolis (Masr El Gedida)',
  'New Cairo (5th Settlement)',
  'Rehab & Madinaty',
  'Zamalek',
  'Downtown Cairo',
  'Dokki & Mohandessin',
  '6th of October City',
  'Sheikh Zayed',
  'Shubra',
  'Ain Shams & El Marg',
  'Mokattam',
  'Giza & Haram',
];

export const ALL_GENRES = [
  'Action',
  'RPG',
  'Adventure',
  'Open World',
  'Shooter',
  'Sports',
  'Racing',
  'Horror',
  'Sci-Fi',
  'Fantasy',
  'Strategy',
  'Simulation',
  'Puzzle',
];
