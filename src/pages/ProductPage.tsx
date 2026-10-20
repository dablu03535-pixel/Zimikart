import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MAX_QTY_PER_LINE } from '@/config/commerce';
import { PATHS, to } from '@/config/routes';
import { useCommerce } from '@/context/CommerceContext';
import { useAsync } from '@/hooks/useAsync';
import { usePageTitle } from '@/hooks/usePageTitle';
import { catalogService } from '@/services/catalogService';
import type { ProductDetail } from '@/types/models';
import { Button } from '@/components/ui/Button';
import { Alert, AsyncView, MockNotice, Spinner } from '@/components/ui/Feedback';
import { Icon } from '@/components/ui/Icon';
import { Price, ProductArt, Rating, SectionHeading, StockBadge } from '@/components/ui/Display';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { PincodeChecker } from '@/components/product/PincodeChecker';
import { ProductGrid, WishlistButton } from '@/components/product/ProductCard';
import { NotFoundContent } from './NotFoundPage';

function Gallery({ hue, name }: { hue: number; name: string }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="card aspect-square overflow-hidden"><ProductArt hue={hue} variant={active} label={`${name}: illustrative image ${active + 1} of 4`} /></div>
      <ul className="mt-3 grid grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <li key={i}>
            <button type="button" aria-pressed={active === i} aria-label={`Show image ${i + 1} of 4`} onClick={() => setActive(i)} className={`block aspect-square w-full overflow-hidden rounded-xl border-2 ${active === i ? 'border-ink' : 'border-transparent'}`}>
              <ProductArt hue={hue} variant={i} label="" />
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-ink-mute">Illustrative artwork. Real product photos will come from seller uploads.</p>
    </div>
  );
}

function ProductView({ detail }: { detail: ProductDetail }) {
  const { product, seller, related } = detail;
  usePageTitle(product.name);
  const navigate = useNavigate();
  const { addToCart } = useCommerce();
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string>();
  const [added, setAdded] = useState(false);
  const out = product.stock <= 0;
  const maxQty = Math.min(product.stock, MAX_QTY_PER_LINE);

  const submit = (): boolean => {
    const missing = product.variantGroups.find((g) => !selected[g.id]);
    if (missing) {
      setError(`Please choose a ${missing.label.toLowerCase()}.`);
      setAdded(false);
      return false;
    }
    setError(undefined);
    const summary = product.variantGroups.map((g) => `${g.label}: ${g.options.find((o) => o.value === selected[g.id])?.label ?? ''}`).join(', ');
    addToCart({
      key: `${product.id}|${product.variantGroups.map((g) => selected[g.id]).join('|')}`,
      productId: product.id, slug: product.slug, name: product.name, sellerName: seller.name,
      unitPrice: product.price, mrp: product.mrp, quantity: qty, maxQuantity: maxQty, hue: product.hue, variantSummary: summary,
    });
    return true;
  };

  return (
    <div className="container-page py-6 sm:py-10">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-mute">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link className="hover:underline" to={PATHS.shop}>Shop</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link className="hover:underline" to={to.category(product.categorySlug)}>{product.categorySlug.replace(/-/g, ' ')}</Link></li>
        </ol>
      </nav>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <Gallery hue={product.hue} name={product.name} />
        <div className="space-y-5">
          <div>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{product.name}</h1>
            <p className="mt-1 text-sm text-ink-soft">Sold by <span className="font-semibold">{seller.name}</span></p>
            <div className="mt-2"><Rating value={product.rating} count={product.ratingCount} size={16} /></div>
          </div>
          <Price price={product.price} mrp={product.mrp} large />
          <p className="text-xs text-ink-mute">Inclusive of taxes (sample pricing).</p>
          <p className="text-ink-soft">{product.shortDescription}</p>

          {product.variantGroups.map((g) => (
            <fieldset key={g.id}>
              <legend className="mb-2 text-sm font-medium">{g.label}{selected[g.id] ? <span className="font-normal text-ink-soft">: {g.options.find((o) => o.value === selected[g.id])?.label}</span> : null}</legend>
              <div className="flex flex-wrap gap-2">
                {g.options.map((o) => (
                  <label key={o.value} className="cursor-pointer">
                    <input type="radio" name={g.id} value={o.value} checked={selected[g.id] === o.value} onChange={() => { setSelected((s) => ({ ...s, [g.id]: o.value })); setError(undefined); }} className="peer sr-only" />
                    <span className="flex min-h-[44px] items-center rounded-xl border border-ink/30 bg-white px-4 text-sm font-medium peer-checked:border-ink peer-checked:bg-ink peer-checked:text-cream peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-saffron-700">{o.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}

          <div className="flex flex-wrap items-center gap-4">
            <StockBadge stock={product.stock} />
            {!out ? <QuantityStepper value={qty} max={maxQty} onChange={setQty} /> : null}
          </div>
          {error ? <p role="alert" className="text-sm font-medium text-terracotta-700">{error}</p> : null}

          <div className="flex flex-wrap gap-3">
            <Button size="lg" variant="accent" disabled={out} className="flex-1 sm:flex-none" onClick={() => setAdded(submit())}><Icon name="cart" />{out ? 'Unavailable' : 'Add to cart'}</Button>
            <Button size="lg" disabled={out} className="flex-1 sm:flex-none" onClick={() => { if (submit()) navigate(PATHS.cart); }}>Buy now</Button>
            <WishlistButton product={product} className="!border !border-ink/25" />
          </div>
          <div aria-live="polite">{added ? <Alert tone="success" title="Added to cart">Saved on this device. <Link className="font-semibold underline" to={PATHS.cart}>View cart</Link></Alert> : null}</div>

          <div className="card p-4"><h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Icon name="truck" />Delivery</h2><PincodeChecker /></div>
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2" aria-labelledby="about-h">
          <h2 id="about-h" className="text-2xl font-semibold">About this product</h2>
          <p className="mt-3 text-ink-soft">{product.description}</p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-ink-soft">{product.highlights.map((h) => (<li key={h}>{h}</li>))}</ul>
          <h3 className="mb-2 mt-8 text-xl font-semibold">Specifications</h3>
          <dl className="card divide-y divide-line">
            {Object.entries(product.specs).map(([k, v]) => (<div key={k} className="grid grid-cols-3 gap-3 px-4 py-3 text-sm"><dt className="font-medium text-ink-soft">{k}</dt><dd className="col-span-2">{v}</dd></div>))}
          </dl>
        </section>
        <aside className="card h-fit space-y-3 p-5" aria-labelledby="seller-h">
          <h2 id="seller-h" className="text-xl font-semibold">Seller</h2>
          <MockNotice>Fictional seller profile</MockNotice>
          <p className="font-semibold">{seller.name}</p>
          <p className="flex items-center gap-1 text-sm text-ink-soft"><Icon name="pin" size={16} />{seller.city}, {seller.state}</p>
          <Rating value={seller.rating} count={seller.ratingCount} />
          <p className="text-sm text-ink-soft">On the platform since {seller.since}. {seller.about}</p>
          <p className="text-xs text-ink-mute">Seller verification, returns and delivery policies are not implemented in Stage 1.</p>
        </aside>
      </div>

      {related.length ? (<section className="mt-14" aria-labelledby="rel-h"><SectionHeading title="You may also like" /><h2 id="rel-h" className="sr-only">Related products</h2><ProductGrid products={related} /></section>) : null}
    </div>
  );
}

export function ProductPage() {
  const { slug = '' } = useParams();
  const { state, reload } = useAsync(() => catalogService.getProduct(slug), [slug]);
  return (
    <AsyncView state={state} onRetry={reload} skeleton={<div className="container-page py-10"><Spinner label="Loading product" /></div>} notFound={<NotFoundContent title="Product not found" message="This product is unavailable or the link is incorrect." />}>
      {(d) => <ProductView key={d.product.id} detail={d} />}
    </AsyncView>
  );
}
