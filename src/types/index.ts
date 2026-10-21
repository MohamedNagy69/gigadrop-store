export type RoleType = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN' | 'SUPPORT';
export type GameStatusType = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
export type OrderStatusType = 'PENDING' | 'PROCESSING' | 'READY' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethodType =
  | 'COD'
  | 'FAWRY'
  | 'VODAFONE_CASH'
  | 'ORANGE_MONEY'
  | 'ETISALAT_CASH'
  | 'WE_PAY'
  | 'INSTAPAY';
export type PaymentStatusType = 'PENDING' | 'AWAITING_PAYMENT' | 'PAID' | 'FAILED' | 'REFUNDED';
export type LocaleType = 'en' | 'ar';

export interface GameItem {
  id: string;
  name: string;
  description?: string | null;
  genre: string[];
  coverImage: string;
  trailerUrl?: string | null;
  sizeGB: number;
  price: number;
  releaseYear: number;
  status: GameStatusType;
  isFeatured: boolean;
  isOP: boolean;
  avgRating?: number;
  reviewsCount?: number;
  createdAt?: string;
}

export interface CartItem {
  id: string;
  name: string;
  coverImage: string;
  sizeGB: number;
  price: number;
  releaseYear: number;
  genre: string[];
}

export interface OrderSuccessData {
  orderId: string;
  orderNumber: string;
  totalGB: number;
  totalPrice: number;
  discount: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatusType;
  paymentRef?: string | null;
  gamesCount: number;
  customerName: string;
}
