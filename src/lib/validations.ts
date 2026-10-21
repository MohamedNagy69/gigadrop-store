import { z } from 'zod';

export const egyptPhoneRegex = /^(\+?20\s?1[0125]\d{1}\s?\d{3}\s?\d{4}|01[0125]\d{8})$/;

export const checkoutSchema = z.object({
  customerName: z.string().min(3, 'Full name must be at least 3 characters'),
  phone: z.string().min(10, 'Valid Egyptian mobile number (+20 1XX XXX XXXX) is required'),
  email: z.string().email('Please enter a valid email address'),
  whatsapp: z.string().optional(),
  birthdate: z.string().optional(),
  address: z.string().min(5, 'Please enter your area and street/district in Cairo'),
  referralCode: z.string().optional(),
  promoCode: z.string().optional(),
  paymentMethod: z.enum([
    'COD',
    'FAWRY',
    'VODAFONE_CASH',
    'ORANGE_MONEY',
    'ETISALAT_CASH',
    'WE_PAY',
    'INSTAPAY',
  ]),
  walletPhone: z.string().optional(),
  instapayRef: z.string().optional(),
  agreeHardDisk: z.boolean().refine((val) => val === true, {
    message: 'You must confirm the hard disk handover & delivery terms',
  }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(3, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid Egyptian mobile number is required'),
  whatsapp: z.string().optional(),
  address: z.string().min(4, 'Cairo district / address is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  referredBy: z.string().optional(),
});

export const gameSchema = z.object({
  name: z.string().min(2, 'Game title is required'),
  description: z.string().optional(),
  genre: z.array(z.string()).min(1, 'At least one genre is required'),
  coverImage: z.string().url('Valid image URL is required'),
  trailerUrl: z.string().optional(),
  sizeGB: z.number().positive('Size in GB must be greater than 0'),
  releaseYear: z.number().int().min(1990).max(2030),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).default('ACTIVE'),
  isFeatured: z.boolean().default(false),
  isOP: z.boolean().default(false),
});

export const trackOrderSchema = z.object({
  orderNumber: z.string().min(5, 'Order number is required (e.g. GD-2026-00001)'),
  phone: z.string().min(8, 'Mobile number is required for verification'),
});
