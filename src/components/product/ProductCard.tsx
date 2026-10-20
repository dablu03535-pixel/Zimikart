import { Link } from 'react-router-dom';
import { to } from '@/config/routes';
import { useCommerce } from '@/context/CommerceContext';
import { discountPercent } from '@/lib/format';
import type { Product } from '@/types/models';
import { Icon } from '@/components/ui/Icon';
import { Price, ProductArt, Rating, StockBadge } from '@/components/ui/Display';
import { ProductGridSkeleton } from '@/components/ui/Feedback';

export function WishlistButton({ product, className = '' }: { product: Product; className?: string }) {
  const { isWished, toggleWishlist } = useCommerce();
  const on = isWished(product.id);
  return (
    <button type="button" aria-pressed={on} aria-label={on ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} onClick={() => toggleWishlist(product.id)} className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow ${on ? 'text-terracotta-600' : 'text-ink'} ${className}`}>
      <Icon name="heart" filled={on} />
    </button>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product.price, product.mrp);
  const out = product.stock <= 0;
  return (
    <article className="card group relative flex w-full flex-col overflow-hidden">
      <div className={`relative aspect-square overflow-hidden ${out ? 'opacity-60 grayscale-[40%]' : ''}`}>
        <ProductArt hue={product.hue} label="" className="transition-transform duration-300 group-hover:scale-105" />
        {off > 0 ? <span className="absolute left-2 top-2 rounded-full bg-peacock-700 px-2 py-0.5 text-xs font-bold text-white">{off}% off</span> : null}
      </div>
      <WishlistButton product={product} className="absolute right-2 top-2 z-10" />
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 font-sans text-sm font-semibold leading-snug">
          <Link to={to.product(product.slug)} className="after:absolute after:inset-0 after:content-['']">{product.name}</Link>
        </h3>
        <Rating value={product.rating} count={product.ratingCount} />
        <Price price={product.price} mrp={product.mrp} />
        <div className="mt-auto pt-1"><StockBadge stock={product.stock} /></div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, loading = false, cols = 4 }: { products: Product[]; loading?: boolean; cols?: 3 | 4 }) {
  if (loading) return <ProductGridSkeleton count={cols * 2} />;
  return (
    <ul className={`grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 ${cols === 4 ? 'lg:grid-cols-4' : ''}`}>
      {products.map((p) => (<li key={p.id} className="flex"><ProductCard product={p} /></li>))}
    </ul>
  );
}
