import {
  escapeHtml,
  isValidEmail,
  isValidHttpUrl,
  sanitizePhone,
  checkRateLimit,
} from '@/lib/security';

describe('Security Utilities', () => {
  describe('escapeHtml', () => {
    it('escapes dangerous XSS characters correctly', () => {
      const malicious = '<script>alert("XSS")</script>&foo=\'bar\'/';
      const safe = escapeHtml(malicious);
      expect(safe).not.toContain('<script>');
      expect(safe).toContain('&lt;script&gt;');
      expect(safe).toContain('&quot;XSS&quot;');
      expect(safe).toContain('&#39;bar&#39;');
      expect(safe).toContain('&amp;foo=');
    });

    it('handles null, undefined and non-strings safely', () => {
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
      expect(escapeHtml(123)).toBe('123');
    });
  });

  describe('isValidEmail', () => {
    it('validates correct email addresses', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('ahmed.hassan+test@gigadrop.eg')).toBe(true);
    });

    it('rejects invalid or dangerous email inputs', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user<script>@evil.com')).toBe(false);
      expect(isValidEmail('not-an-email')).toBe(false);
    });
  });

  describe('isValidHttpUrl', () => {
    it('allows valid http and https URLs', () => {
      expect(isValidHttpUrl('https://images.unsplash.com/photo')).toBe(true);
      expect(isValidHttpUrl('http://example.com/cover.png')).toBe(true);
    });

    it('rejects javascript:, data:, and file: protocols', () => {
      expect(isValidHttpUrl('javascript:alert(1)')).toBe(false);
      expect(isValidHttpUrl('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==')).toBe(false);
      expect(isValidHttpUrl('file:///etc/passwd')).toBe(false);
      expect(isValidHttpUrl('invalid-url')).toBe(false);
    });
  });

  describe('sanitizePhone', () => {
    it('strips non-phone characters and limits length', () => {
      expect(sanitizePhone('+20 100 123 4567')).toBe('+20 100 123 4567');
      expect(sanitizePhone('0100<script>1234')).toBe('01001234');
    });
  });

  describe('checkRateLimit', () => {
    it('enforces request thresholds within window', () => {
      const key = `test_limit_${Date.now()}`;
      const res1 = checkRateLimit(key, 2, 5000);
      expect(res1.allowed).toBe(true);
      expect(res1.remaining).toBe(1);

      const res2 = checkRateLimit(key, 2, 5000);
      expect(res2.allowed).toBe(true);
      expect(res2.remaining).toBe(0);

      const res3 = checkRateLimit(key, 2, 5000);
      expect(res3.allowed).toBe(false);
      expect(res3.remaining).toBe(0);
    });
  });
});
