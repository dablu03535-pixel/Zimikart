import { Link } from 'react-router-dom';
import { PATHS, to } from '@/config/routes';
import { useAsync } from '@/hooks/useAsync';
import { useCategories } from '@/hooks/useCategories';
import { usePageTitle } from '@/hooks/usePageTitle';
import { catalogService } from '@/services/catalogService';
import { BRAND } from '@/config/brand';
import { ButtonLink } from '@/components/ui/Button';
import { AsyncView, MockNotice, Skeleton } from '@/components/ui/Feedback';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ProductArt, SectionHeading } from '@/components/ui/Display';
import { ProductGrid } from '@/components/product/ProductCard';

const promos = [
  { title: 'Festive lights edit', text: 'Brass diyas, block prints and terracotta for the season.', to: to.category('home-decor'), hue: 38 },
  { title: 'Tea & pantry', text: 'Loose-leaf teas, spices and honey from small producers.', to: to.category('tea-pantry'), hue: 105 },
  { title: 'Sell with us', text: 'Preview the seller onboarding flow and dashboard.', to: PATHS.sellerRegister, hue: 190 },
];
const strip: { icon: IconName; title: string; text: string }[] = [
  { icon: 'pin', title: 'Pincode check', text: 'Every product page has a delivery check (sample rules).' },
  { icon: 'store', title: 'Seller profiles', text: 'See who makes and ships each product.' },
  { icon: 'heart', title: 'Wishlist', text: 'Save favourites on this device while you browse.' },
];

export function HomePage() {
  usePageTitle();
  const cats = useCategories();
  const home = useAsync(() => catalogService.getHome(), []);

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-cream">
        <div className="container-page grid items-center gap-8 py-12 md:grid-cols-2 md:py-20">
          <div>
            <MockNotice>Stage 1 demo: sample catalogue</MockNotice>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">Made in India, <span className="text-saffron-400">chosen with care.</span></h1>
            <p className="mt-4 max-w-lg text-lg text-cream/80">{BRAND.name} is a prototype of a multi-vendor marketplace for makers: textiles, brass, tea, toys and more.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to={PATHS.shop} variant="accent" size="lg">Shop all products</ButtonLink>
              <ButtonLink to={PATHS.sellerRegister} variant="outline" size="lg" className="!bg-transparent !text-cream !border-cream/50 hover:!bg-white/10">Become a seller</ButtonLink>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-4" aria-hidden="true">
            {[[230, 0], [38, 1], [110, 2], [340, 3], [15, 0], [195, 1]].map(([h, v], i) => (
              <div key={i} className={`overflow-hidden rounded-2xl ${i % 3 === 1 ? 'translate-y-6' : ''}`}><div className="aspect-[3/4]"><ProductArt hue={h as number} variant={v as number} label="" /></div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-14" aria-labelledby="cats-h">
        <SectionHeading title="Shop by category" />
        <h2 id="cats-h" className="sr-only">Categories</h2>
        <AsyncView state={cats.state} onRetry={cats.reload} skeleton={<div className="grid grid-cols-2 gap-3 md:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-32" />)}</div>}>
          {(list) => (
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {list.map((c, i) => (
                <li key={c.id}>
                  <Link to={to.category(c.slug)} className="card group block overflow-hidden">
                    <div className="aspect-[16/9] overflow-hidden"><ProductArt hue={c.hue} variant={i} label="" className="transition-transform duration-300 group-hover:scale-105" /></div>
                    <div className="p-3"><p className="font-semibold">{c.name}</p><p className="text-xs text-ink-mute">{c.tagline}</p></div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </AsyncView>
      </section>

      <section className="container-page" aria-label="Promotions">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-mute">Sample promotions</p>
        <ul className="grid gap-4 md:grid-cols-3">
          {promos.map((p) => (
            <li key={p.title}>
              <Link to={p.to} className="card flex h-full items-center gap-4 p-4 hover:bg-cream-deep">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl"><ProductArt hue={p.hue} variant={1} label="" /></div>
                <div><h3 className="text-lg font-semibold">{p.title}</h3><p className="text-sm text-ink-soft">{p.text}</p></div>
                <Icon name="right" className="ml-auto shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page py-10 sm:py-14">
        <SectionHeading title="Featured picks" subtitle="Hand-picked sample products" action={<Link to={PATHS.shop} className="text-sm font-semibold underline">View all</Link>} />
        <AsyncView state={home.state} onRetry={home.reload} skeleton={<ProductGrid products={[]} loading />}>
          {(d) => (
            <>
              <ProductGrid products={d.featured.slice(0, 4)} />
              <div className="mt-12"><SectionHeading title="New arrivals" /><ProductGrid products={d.newest} /></div>
            </>
          )}
        </AsyncView>
      </section>

      <section className="container-page pb-4" aria-label="Highlights">
        <ul className="grid gap-4 md:grid-cols-3">
          {strip.map((s) => (
            <li key={s.title} className="card flex gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-saffron-100 text-saffron-700"><Icon name={s.icon} /></span>
              <div><h3 className="font-semibold">{s.title}</h3><p className="text-sm text-ink-soft">{s.text}</p></div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
