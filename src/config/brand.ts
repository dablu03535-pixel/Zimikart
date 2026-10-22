/** Provisional brand settings. Change VITE_BRAND_NAME in .env to rename the site. */
export const BRAND = {
  name: import.meta.env.VITE_BRAND_NAME?.trim() || 'Zimikart',
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL?.trim() || 'support@your-domain.example',
  currency: 'INR',
  locale: 'en-IN',
} as const;
