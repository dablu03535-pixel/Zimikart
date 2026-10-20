import { categories, products, sellers } from '@/data/mockCatalog';
import type { Category, PincodeResult, Product, ProductDetail, ProductQuery } from '@/types/models';
import { NotFoundError, read, toQuery } from './http';

const active = (p: Product) => p.listingStatus === 'active';

function filterProducts(q: ProductQuery): Product[] {
  const term = q.q?.trim().toLowerCase();
  let list = products.filter(active).filter((p) => {
    if (q.category && p.categorySlug !== q.category) return false;
    if (q.minPrice !== undefined && p.price < q.minPrice) return false;
    if (q.maxPrice !== undefined && p.price > q.maxPrice) return false;
    if (q.minRating !== undefined && p.rating < q.minRating) return false;
    if (q.inStockOnly && p.stock <= 0) return false;
    if (term) {
      const hay = `${p.name} ${p.shortDescription} ${p.tags.join(' ')}`.toLowerCase();
      return term.split(/\s+/).every((w) => hay.includes(w));
    }
    return true;
  });
  switch (q.sort) {
    case 'price-asc': list = [...list].sort((a, b) => a.price - b.price); break;
    case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break;
    case 'rating': list = [...list].sort((a, b) => b.rating - a.rating); break;
    case 'newest': list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
    default: break;
  }
  return list;
}

export const catalogService = {
  getCategories: (): Promise<Category[]> => read(() => categories, '/categories'),

  getProducts: (q: ProductQuery): Promise<Product[]> =>
    read(() => filterProducts(q), `/products${toQuery({ ...q })}`),

  getProductsByIds: (ids: string[]): Promise<Product[]> =>
    read(() => products.filter((p) => ids.includes(p.id) && active(p)), `/products${toQuery({ ids: ids.join(',') })}`),

  getHome: (): Promise<{ featured: Product[]; newest: Product[] }> =>
    read(
      () => ({
        featured: products.filter((p) => p.featured && active(p)),
        newest: [...products].filter(active).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4),
      }),
      '/home',
    ),

  getProduct: (slug: string): Promise<ProductDetail> =>
    read(() => {
      const product = products.find((p) => p.slug === slug && active(p));
      const seller = product && sellers.find((s) => s.id === product.sellerId);
      if (!product || !seller) throw new NotFoundError('This product is not available.');
      const related = products.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id && active(p)).slice(0, 4);
      return { product, seller, related };
    }, `/products/${encodeURIComponent(slug)}`),

  /** Mock rule only: pincodes starting with 9 are "not serviceable" so both states can be seen. */
  checkPincode: (pincode: string): Promise<PincodeResult> =>
    read<PincodeResult>(() => {
      if (pincode.startsWith('9')) return { serviceable: false, message: 'Sample rule: delivery is not available to this pincode.' };
      const etaDays = 3 + (Number(pincode.charAt(0)) % 4);
      return { serviceable: true, etaDays, message: `Sample estimate: delivery in about ${etaDays} days.` };
    }, `/serviceability/${encodeURIComponent(pincode)}`),
};
