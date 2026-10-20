import { BRAND } from '@/config/brand';

const inr = new Intl.NumberFormat(BRAND.locale, {
  style: 'currency',
  currency: BRAND.currency,
  maximumFractionDigits: 0,
});

export const formatINR = (value: number): string => inr.format(value);

export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(BRAND.locale, { day: 'numeric', month: 'short', year: 'numeric' });
};

export const discountPercent = (price: number, mrp: number): number =>
  mrp > price && mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

export type StockState = 'out' | 'low' | 'in';
export const stockState = (stock: number): StockState => (stock <= 0 ? 'out' : stock <= 5 ? 'low' : 'in');

export const titleCase = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
