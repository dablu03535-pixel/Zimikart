export type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

export interface Category {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  hue: number;
}

export interface Seller {
  id: string;
  name: string;
  city: string;
  state: string;
  rating: number;
  ratingCount: number;
  since: number;
  about: string;
}

export interface VariantOption {
  value: string;
  label: string;
}

export interface VariantGroup {
  id: string;
  label: string;
  options: VariantOption[];
}

export type ListingStatus = 'active' | 'draft';

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  sellerId: string;
  price: number;
  mrp: number;
  rating: number;
  ratingCount: number;
  stock: number;
  hue: number;
  shortDescription: string;
  description: string;
  highlights: string[];
  specs: Record<string, string>;
  variantGroups: VariantGroup[];
  tags: string[];
  createdAt: string;
  featured: boolean;
  listingStatus: ListingStatus;
}

export interface ProductQuery {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  sort?: SortKey;
}

export interface ProductDetail {
  product: Product;
  seller: Seller;
  related: Product[];
}

export interface CartLine {
  key: string;
  productId: string;
  slug: string;
  name: string;
  sellerName: string;
  unitPrice: number;
  mrp: number;
  quantity: number;
  maxQuantity: number;
  hue: number;
  variantSummary: string;
}

export interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderStatus = 'placed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  variantSummary: string;
}

export interface Order {
  id: string;
  placedOn: string;
  status: OrderStatus;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  address: Address;
}

export interface PincodeResult {
  serviceable: boolean;
  etaDays?: number;
  message: string;
}

export interface WriteResult {
  persisted: boolean;
  message: string;
}

export interface SellerDashboardData {
  salesThisMonth: number;
  ordersThisMonth: number;
  pendingOrders: number;
  lowStockCount: number;
  weekly: { label: string; value: number }[];
}

export interface Payout {
  id: string;
  period: string;
  amount: number;
  status: 'scheduled' | 'paid' | 'on-hold';
}

export interface EarningsSummary {
  gross: number;
  commission: number;
  net: number;
  pending: number;
  commissionRate: number;
  payouts: Payout[];
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface SellerApplicationRecord {
  id: string;
  businessName: string;
  ownerName: string;
  city: string;
  state: string;
  category: string;
  submittedOn: string;
  status: ReviewStatus;
}

export interface ModerationItem {
  id: string;
  productName: string;
  sellerName: string;
  category: string;
  price: number;
  submittedOn: string;
  status: ReviewStatus;
  note: string;
}

export interface AdminOverview {
  gmv: number;
  orders: number;
  activeSellers: number;
  pendingSellers: number;
  pendingProducts: number;
}

export interface CommissionRule {
  categorySlug: string;
  percent: number;
}

export interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  defaultCommission: number;
  freeShippingThreshold: number;
  rules: CommissionRule[];
}
