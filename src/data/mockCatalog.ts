/**
 * MOCK DATA - fictional sellers, products and prices for UI development only.
 * Nothing here describes a real business, stock level or order.
 */
import type { Category, Product, Seller, VariantGroup } from '@/types/models';

export const categories: Category[] = [
  { id: 'c1', slug: 'handloom-textiles', name: 'Handloom & Textiles', tagline: 'Sarees, stoles, home linen', hue: 340 },
  { id: 'c2', slug: 'home-decor', name: 'Home & Decor', tagline: 'Brass, clay and block prints', hue: 28 },
  { id: 'c3', slug: 'tea-pantry', name: 'Tea & Pantry', tagline: 'Leaves, spices, preserves', hue: 95 },
  { id: 'c4', slug: 'jewellery', name: 'Jewellery', tagline: 'Everyday and festive pieces', hue: 45 },
  { id: 'c5', slug: 'footwear-bags', name: 'Footwear & Bags', tagline: 'Leather and jute crafts', hue: 18 },
  { id: 'c6', slug: 'wellness', name: 'Wellness & Beauty', tagline: 'Oils, soaps, herbal care', hue: 160 },
  { id: 'c7', slug: 'toys-gifts', name: 'Toys & Gifts', tagline: 'Wooden toys, gift sets', hue: 200 },
  { id: 'c8', slug: 'stationery', name: 'Stationery', tagline: 'Handmade paper and journals', hue: 265 },
];

export const sellers: Seller[] = [
  { id: 's1', name: 'Kaveri Looms (sample)', city: 'Salem', state: 'Tamil Nadu', rating: 4.6, ratingCount: 812, since: 2019, about: 'Sample profile of a family handloom unit. Fictional.' },
  { id: 's2', name: 'Rangrez Studio (sample)', city: 'Jaipur', state: 'Rajasthan', rating: 4.4, ratingCount: 540, since: 2020, about: 'Sample profile of a block-print studio. Fictional.' },
  { id: 's3', name: 'Hill & Leaf Co. (sample)', city: 'Darjeeling', state: 'West Bengal', rating: 4.7, ratingCount: 1204, since: 2018, about: 'Sample profile of a small-batch tea blender. Fictional.' },
  { id: 's4', name: 'Mitti & Metal (sample)', city: 'Moradabad', state: 'Uttar Pradesh', rating: 4.3, ratingCount: 366, since: 2021, about: 'Sample profile of a brass and clay workshop. Fictional.' },
  { id: 's5', name: 'Channa Toy Works (sample)', city: 'Ramanagara', state: 'Karnataka', rating: 4.8, ratingCount: 298, since: 2022, about: 'Sample profile of a wooden toy maker. Fictional.' },
];

const colour = (opts: [string, string][]): VariantGroup => ({
  id: 'colour',
  label: 'Colour',
  options: opts.map(([value, label]) => ({ value, label })),
});
const size = (vals: string[]): VariantGroup => ({
  id: 'size',
  label: 'Size',
  options: vals.map((v) => ({ value: v, label: v })),
});

type Seed = Pick<Product, 'id' | 'slug' | 'name' | 'categorySlug' | 'sellerId' | 'price' | 'mrp' | 'rating' | 'ratingCount' | 'stock' | 'hue' | 'shortDescription' | 'createdAt'> &
  Partial<Pick<Product, 'variantGroups' | 'featured' | 'listingStatus' | 'tags' | 'highlights' | 'specs'>>;

const make = (s: Seed): Product => ({
  description: `${s.shortDescription} This is sample copy written for interface testing; the product, its materials and its measurements are fictional.`,
  highlights: ['Sample highlight: handmade in small batches', 'Sample highlight: gift-ready packaging', 'Sample highlight: care instructions included'],
  specs: { Material: 'Sample material', Origin: 'India (sample)', 'Care': 'Wipe clean / hand wash' },
  variantGroups: [],
  featured: false,
  listingStatus: 'active',
  tags: [],
  ...s,
});

export const products: Product[] = [
  make({ id: 'p1', slug: 'handloom-cotton-saree-indigo', name: 'Handloom Cotton Saree, Indigo Border', categorySlug: 'handloom-textiles', sellerId: 's1', price: 2499, mrp: 3299, rating: 4.6, ratingCount: 312, stock: 14, hue: 230, shortDescription: 'Soft cotton saree with a woven indigo border.', createdAt: '2026-09-02', featured: true, tags: ['saree', 'cotton', 'festive'], variantGroups: [colour([['indigo', 'Indigo'], ['madder', 'Madder red'], ['turmeric', 'Turmeric']])] }),
  make({ id: 'p2', slug: 'block-print-cushion-cover-set', name: 'Block-Print Cushion Covers, Set of 2', categorySlug: 'home-decor', sellerId: 's2', price: 799, mrp: 1099, rating: 4.4, ratingCount: 189, stock: 40, hue: 15, shortDescription: 'Hand block-printed cotton covers in a floral repeat.', createdAt: '2026-09-18', featured: true, tags: ['cushion', 'block print'], variantGroups: [size(['16 x 16 in', '18 x 18 in'])] }),
  make({ id: 'p3', slug: 'darjeeling-first-flush-tea-100g', name: 'Darjeeling First Flush Tea, 100 g', categorySlug: 'tea-pantry', sellerId: 's3', price: 449, mrp: 520, rating: 4.7, ratingCount: 964, stock: 120, hue: 110, shortDescription: 'Light, floral loose-leaf black tea.', createdAt: '2026-08-11', featured: true, tags: ['tea', 'loose leaf'] }),
  make({ id: 'p4', slug: 'brass-diya-set-of-4', name: 'Brass Diya Set of 4', categorySlug: 'home-decor', sellerId: 's4', price: 649, mrp: 899, rating: 4.3, ratingCount: 121, stock: 4, hue: 42, shortDescription: 'Hand-finished brass lamps for festive evenings.', createdAt: '2026-10-01', featured: true, tags: ['diya', 'brass', 'festive'] }),
  make({ id: 'p5', slug: 'wooden-toy-train-natural-dye', name: 'Wooden Toy Train, Natural Dye', categorySlug: 'toys-gifts', sellerId: 's5', price: 1199, mrp: 1499, rating: 4.8, ratingCount: 207, stock: 22, hue: 195, shortDescription: 'Lacquered wooden train with five linking carriages.', createdAt: '2026-09-25', featured: true, tags: ['toy', 'wood', 'kids'] }),
  make({ id: 'p6', slug: 'masala-chai-spice-blend-200g', name: 'Masala Chai Spice Blend, 200 g', categorySlug: 'tea-pantry', sellerId: 's3', price: 299, mrp: 349, rating: 4.5, ratingCount: 650, stock: 0, hue: 25, shortDescription: 'Warming blend of cardamom, ginger and cloves.', createdAt: '2026-07-20', tags: ['spice', 'chai'] }),
  make({ id: 'p7', slug: 'kolhapuri-style-leather-sandals', name: 'Leather Sandals, Kolhapuri Style', categorySlug: 'footwear-bags', sellerId: 's4', price: 1599, mrp: 2199, rating: 4.2, ratingCount: 98, stock: 9, hue: 24, shortDescription: 'Hand-stitched flat sandals with a cushioned insole.', createdAt: '2026-08-30', tags: ['sandals', 'leather'], variantGroups: [size(['UK 5', 'UK 6', 'UK 7', 'UK 8']), colour([['tan', 'Tan'], ['brown', 'Dark brown']])] }),
  make({ id: 'p8', slug: 'jute-tote-bag-embroidered', name: 'Embroidered Jute Tote Bag', categorySlug: 'footwear-bags', sellerId: 's2', price: 699, mrp: 899, rating: 4.1, ratingCount: 77, stock: 33, hue: 60, shortDescription: 'Roomy jute tote with cotton lining and thread embroidery.', createdAt: '2026-09-09', tags: ['bag', 'jute'] }),
  make({ id: 'p9', slug: 'silver-plated-jhumka-earrings', name: 'Silver-Plated Jhumka Earrings', categorySlug: 'jewellery', sellerId: 's4', price: 899, mrp: 1299, rating: 4.5, ratingCount: 244, stock: 18, hue: 275, shortDescription: 'Lightweight jhumkas with a oxidised finish.', createdAt: '2026-10-08', tags: ['earrings', 'festive'] }),
  make({ id: 'p10', slug: 'cold-pressed-coconut-oil-500ml', name: 'Cold-Pressed Coconut Oil, 500 ml', categorySlug: 'wellness', sellerId: 's1', price: 349, mrp: 399, rating: 4.6, ratingCount: 521, stock: 75, hue: 150, shortDescription: 'Unrefined coconut oil for hair and skin.', createdAt: '2026-06-30', tags: ['oil', 'hair'] }),
  make({ id: 'p11', slug: 'neem-sandalwood-soap-trio', name: 'Neem & Sandalwood Soap, Pack of 3', categorySlug: 'wellness', sellerId: 's1', price: 399, mrp: 480, rating: 4.3, ratingCount: 143, stock: 2, hue: 170, shortDescription: 'Cold-process bars with a gentle herbal scent.', createdAt: '2026-09-14', tags: ['soap'] }),
  make({ id: 'p12', slug: 'handmade-paper-journal-a5', name: 'Handmade Paper Journal, A5', categorySlug: 'stationery', sellerId: 's2', price: 349, mrp: 449, rating: 4.4, ratingCount: 88, stock: 60, hue: 40, shortDescription: 'Cotton-rag pages, thread-bound with a block-print cover.', createdAt: '2026-10-12', tags: ['journal', 'paper'], variantGroups: [colour([['saffron', 'Saffron'], ['peacock', 'Peacock'], ['ink', 'Ink']])] }),
  make({ id: 'p13', slug: 'ikat-cotton-stole', name: 'Ikat Cotton Stole', categorySlug: 'handloom-textiles', sellerId: 's1', price: 899, mrp: 1199, rating: 4.5, ratingCount: 176, stock: 27, hue: 320, shortDescription: 'Lightweight stole with a geometric ikat weave.', createdAt: '2026-08-05', tags: ['stole', 'ikat'] }),
  make({ id: 'p14', slug: 'terracotta-planter-pair', name: 'Terracotta Planters, Pair', categorySlug: 'home-decor', sellerId: 's4', price: 549, mrp: 699, rating: 3.9, ratingCount: 54, stock: 0, hue: 14, shortDescription: 'Hand-thrown planters with drainage holes.', createdAt: '2026-07-02', tags: ['planter', 'clay'], variantGroups: [size(['Small', 'Medium'])] }),
  make({ id: 'p15', slug: 'wild-forest-honey-350g', name: 'Wild Forest Honey, 350 g', categorySlug: 'tea-pantry', sellerId: 's3', price: 425, mrp: 475, rating: 4.7, ratingCount: 402, stock: 48, hue: 48, shortDescription: 'Raw, unprocessed honey in a glass jar.', createdAt: '2026-09-29', tags: ['honey'] }),
  make({ id: 'p16', slug: 'wooden-spinning-top-set', name: 'Wooden Spinning Top Set', categorySlug: 'toys-gifts', sellerId: 's5', price: 349, mrp: 399, rating: 4.9, ratingCount: 133, stock: 5, hue: 5, shortDescription: 'Three painted tops with a launcher string.', createdAt: '2026-10-15', tags: ['toy', 'wood'], listingStatus: 'draft' }),
];
