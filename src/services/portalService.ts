import {
  adminOverview, earnings, moderationQueue, orders, platformSettings, sellerApplications, sellerDashboard,
} from '@/data/mockAccount';
import { products, sellers } from '@/data/mockCatalog';
import type {
  AdminOverview, EarningsSummary, ModerationItem, Order, PlatformSettings, Product, Seller,
  SellerApplicationRecord, SellerDashboardData, WriteResult,
} from '@/types/models';
import { notPersisted, read, write } from './http';

const mySellerId = 's1'; // Mock: pretend the signed-in seller is s1.

export const sellerService = {
  getDashboard: (): Promise<SellerDashboardData> => read(() => sellerDashboard, '/seller/dashboard'),
  getProfile: (): Promise<Seller> => read(() => sellers.find((s) => s.id === mySellerId) as Seller, '/seller/profile'),
  getProducts: (): Promise<Product[]> => read(() => products.filter((p) => p.sellerId === mySellerId || p.sellerId === 's2'), '/seller/products'),
  getOrders: (): Promise<Order[]> => read(() => orders, '/seller/orders'),
  getEarnings: (): Promise<EarningsSummary> => read(() => earnings, '/seller/earnings'),
  submitApplication: (payload: Record<string, string>): Promise<WriteResult> =>
    write(() => notPersisted('Your application was not submitted and nobody has reviewed it.'), '/seller/applications', payload),
  saveProfile: (payload: Record<string, string>): Promise<WriteResult> =>
    write(() => notPersisted('Profile changes were not saved.'), '/seller/profile', payload, 'PUT'),
  saveProduct: (payload: Record<string, string>): Promise<WriteResult> =>
    write(() => notPersisted('The product was not created.'), '/seller/products', payload),
};

export const adminService = {
  getOverview: (): Promise<AdminOverview> => read(() => adminOverview, '/admin/overview'),
  getSellerApplications: (): Promise<SellerApplicationRecord[]> => read(() => sellerApplications, '/admin/seller-applications'),
  getModerationQueue: (): Promise<ModerationItem[]> => read(() => moderationQueue, '/admin/moderation'),
  getOrders: (): Promise<Order[]> => read(() => orders, '/admin/orders'),
  getSettings: (): Promise<PlatformSettings> => read(() => platformSettings, '/admin/settings'),
  saveSettings: (payload: Record<string, string>): Promise<WriteResult> =>
    write(() => notPersisted('Settings were not saved.'), '/admin/settings', payload, 'PUT'),
};
