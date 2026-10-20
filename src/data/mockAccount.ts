/** MOCK DATA - fictional customer, orders and portal figures. Not real people or transactions. */
import type {
  Address, AdminOverview, EarningsSummary, ModerationItem, Order, PlatformSettings,
  SellerApplicationRecord, SellerDashboardData,
} from '@/types/models';

export const addresses: Address[] = [
  { id: 'a1', label: 'Home', fullName: 'Sample Customer', phone: '9000000001', line1: '12, Sample Street', line2: 'Block B', landmark: 'Near Sample Park', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
  { id: 'a2', label: 'Work', fullName: 'Sample Customer', phone: '9000000001', line1: '4th Floor, Example Towers', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
];

const home = addresses[0] as Address;

export const orders: Order[] = [
  { id: 'AV-1001', placedOn: '2026-10-12', status: 'shipped', customerName: 'Sample Customer A', items: [{ productId: 'p1', name: 'Handloom Cotton Saree, Indigo Border', quantity: 1, unitPrice: 2499, variantSummary: 'Colour: Indigo' }, { productId: 'p3', name: 'Darjeeling First Flush Tea, 100 g', quantity: 2, unitPrice: 449, variantSummary: '' }], subtotal: 3397, shipping: 0, total: 3397, paymentMethod: 'Sample (no payment taken)', address: home },
  { id: 'AV-1002', placedOn: '2026-10-05', status: 'delivered', customerName: 'Sample Customer B', items: [{ productId: 'p4', name: 'Brass Diya Set of 4', quantity: 1, unitPrice: 649, variantSummary: '' }], subtotal: 649, shipping: 79, total: 728, paymentMethod: 'Sample (no payment taken)', address: home },
  { id: 'AV-1003', placedOn: '2026-10-17', status: 'placed', customerName: 'Sample Customer C', items: [{ productId: 'p5', name: 'Wooden Toy Train, Natural Dye', quantity: 1, unitPrice: 1199, variantSummary: '' }], subtotal: 1199, shipping: 0, total: 1199, paymentMethod: 'Sample (no payment taken)', address: home },
  { id: 'AV-1004', placedOn: '2026-09-28', status: 'cancelled', customerName: 'Sample Customer D', items: [{ productId: 'p7', name: 'Leather Sandals, Kolhapuri Style', quantity: 1, unitPrice: 1599, variantSummary: 'Size: UK 7, Colour: Tan' }], subtotal: 1599, shipping: 0, total: 1599, paymentMethod: 'Sample (no payment taken)', address: home },
  { id: 'AV-1005', placedOn: '2026-10-18', status: 'packed', customerName: 'Sample Customer E', items: [{ productId: 'p9', name: 'Silver-Plated Jhumka Earrings', quantity: 2, unitPrice: 899, variantSummary: '' }], subtotal: 1798, shipping: 0, total: 1798, paymentMethod: 'Sample (no payment taken)', address: home },
];

export const sellerDashboard: SellerDashboardData = {
  salesThisMonth: 48250, ordersThisMonth: 37, pendingOrders: 6, lowStockCount: 3,
  weekly: [
    { label: 'Mon', value: 4200 }, { label: 'Tue', value: 6100 }, { label: 'Wed', value: 3800 },
    { label: 'Thu', value: 7600 }, { label: 'Fri', value: 9400 }, { label: 'Sat', value: 11250 }, { label: 'Sun', value: 5900 },
  ],
};

export const earnings: EarningsSummary = {
  gross: 148900, commission: 17868, net: 131032, pending: 18420, commissionRate: 12,
  payouts: [
    { id: 'PO-301', period: '1-15 Oct 2026', amount: 21800, status: 'scheduled' },
    { id: 'PO-300', period: '16-30 Sep 2026', amount: 34150, status: 'paid' },
    { id: 'PO-299', period: '1-15 Sep 2026', amount: 29980, status: 'paid' },
    { id: 'PO-298', period: '16-31 Aug 2026', amount: 8400, status: 'on-hold' },
  ],
};

export const adminOverview: AdminOverview = { gmv: 1284500, orders: 842, activeSellers: 57, pendingSellers: 4, pendingProducts: 5 };

export const sellerApplications: SellerApplicationRecord[] = [
  { id: 'SA-01', businessName: 'Sample Silk House', ownerName: 'Owner One', city: 'Varanasi', state: 'Uttar Pradesh', category: 'Handloom & Textiles', submittedOn: '2026-10-16', status: 'pending' },
  { id: 'SA-02', businessName: 'Sample Spice Traders', ownerName: 'Owner Two', city: 'Kochi', state: 'Kerala', category: 'Tea & Pantry', submittedOn: '2026-10-15', status: 'pending' },
  { id: 'SA-03', businessName: 'Sample Bead Works', ownerName: 'Owner Three', city: 'Hyderabad', state: 'Telangana', category: 'Jewellery', submittedOn: '2026-10-13', status: 'pending' },
  { id: 'SA-04', businessName: 'Sample Clay Studio', ownerName: 'Owner Four', city: 'Khurja', state: 'Uttar Pradesh', category: 'Home & Decor', submittedOn: '2026-10-09', status: 'approved' },
  { id: 'SA-05', businessName: 'Sample Paper Mill', ownerName: 'Owner Five', city: 'Sanganer', state: 'Rajasthan', category: 'Stationery', submittedOn: '2026-10-02', status: 'rejected' },
];

export const moderationQueue: ModerationItem[] = [
  { id: 'MQ-01', productName: 'Pashmina-Style Shawl', sellerName: 'Sample Silk House', category: 'Handloom & Textiles', price: 3999, submittedOn: '2026-10-17', status: 'pending', note: 'Fibre claim needs supporting document.' },
  { id: 'MQ-02', productName: 'Organic Turmeric Powder 500 g', sellerName: 'Sample Spice Traders', category: 'Tea & Pantry', price: 289, submittedOn: '2026-10-16', status: 'pending', note: '"Organic" label to be checked.' },
  { id: 'MQ-03', productName: 'Beaded Necklace', sellerName: 'Sample Bead Works', category: 'Jewellery', price: 1250, submittedOn: '2026-10-14', status: 'pending', note: 'Images are low resolution.' },
  { id: 'MQ-04', productName: 'Hand-Painted Clay Pots', sellerName: 'Sample Clay Studio', category: 'Home & Decor', price: 899, submittedOn: '2026-10-11', status: 'approved', note: '' },
  { id: 'MQ-05', productName: 'Ayurvedic Pain Relief Balm', sellerName: 'Sample Herbal Co.', category: 'Wellness & Beauty', price: 199, submittedOn: '2026-10-10', status: 'pending', note: 'Health claims need review.' },
];

export const platformSettings: PlatformSettings = {
  platformName: 'Avani Marketplace',
  supportEmail: 'support@your-domain.example',
  defaultCommission: 12,
  freeShippingThreshold: 999,
  rules: [
    { categorySlug: 'handloom-textiles', percent: 10 },
    { categorySlug: 'jewellery', percent: 15 },
    { categorySlug: 'tea-pantry', percent: 8 },
  ],
};
