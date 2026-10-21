import {
  calculatePrice,
  formatEGP,
  formatGB,
  formatEgyptPhone,
  generateOrderNumber,
  generateReferralCode,
} from '@/lib/utils';

describe('GIGADROP Utility Functions', () => {
  test('calculatePrice computes sizeGB * ratePerGB accurately', () => {
    expect(calculatePrice(112.5, 1.0)).toBe(112.5);
    expect(calculatePrice(150, 1.5)).toBe(225.0);
    expect(calculatePrice(0, 1.0)).toBe(0);
    expect(calculatePrice(-20, 1.0)).toBe(0);
  });

  test('formatEGP formats currency with EGP suffix', () => {
    expect(formatEGP(75)).toBe('75.00 EGP');
    expect(formatEGP(112.5)).toBe('112.50 EGP');
  });

  test('formatGB formats gigabytes with 2 decimals', () => {
    expect(formatGB(68.4)).toBe('68.40 GB');
  });

  test('formatEgyptPhone normalizes Egyptian mobile numbers', () => {
    expect(formatEgyptPhone('01012345678')).toBe('+20 101 234 5678');
    expect(formatEgyptPhone('201123456789')).toBe('+20 112 345 6789');
  });

  test('generateOrderNumber generates GD-YYYY-XXXXX format', () => {
    const orderNum = generateOrderNumber(42);
    expect(orderNum).toMatch(/^GD-\d{4}-00042$/);
  });

  test('generateReferralCode prefixes with GIGA-', () => {
    const code = generateReferralCode('Ahmed Hassan');
    expect(code).toMatch(/^GIGA-AHMEDH\d{2}$/);
  });
});
