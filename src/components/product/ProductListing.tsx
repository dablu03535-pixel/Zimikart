import { useEffect, useId, useMemo, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAsync } from '@/hooks/useAsync';
import { catalogService } from '@/services/catalogService';
import { formatINR } from '@/lib/format';
import type { Category, ProductQuery, SortKey } from '@/types/models';
import { Button } from '@/components/ui/Button';
import { SelectField, TextField } from '@/components/ui/Fields';
import { EmptyState, ErrorState } from '@/components/ui/Feedback';
import { Icon } from '@/components/ui/Icon';
import { Sheet } from '@/components/ui/Sheet';
import { ProductGrid } from './ProductCard';

const PAGE_SIZE = 8;
const MAX_PRICE = 5000;
const SORTS: { value: SortKey; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Customer rating' },
];
const PRESETS: { label: string; min?: number; max?: number }[] = [
  { label: 'Under ₹500', max: 500 },
  { label: '₹500 - ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 - ₹2,500', min: 1000, max: 2500 },
  { label: 'Over ₹2,500', min: 2500 },
];

interface Filters { category: string; min: string; max: string; rating: string; stock: boolean }

interface PanelProps {
  filters: Filters;
  categories: Category[];
  showCategory: boolean;
  onApply: (patch: Partial<Filters>) => void;
  onClear: () => void;
}

function FilterPanel({ filters, categories, showCategory, onApply, onClear }: PanelProps) {
  const [min, setMin] = useState(filters.min);
  const [max, setMax] = useState(filters.max);
  const [err, setErr] = useState<string>();
  const sliderId = useId();
  useEffect(() => {
    setMin(filters.min);
    setMax(filters.max);
  }, [filters.min, filters.max]);

  const applyPrice = (e?: FormEvent) => {
    e?.preventDefault();
    if ((min && Number(min) < 0) || (max && Number(max) < 0)) return setErr('Prices cannot be negative.');
    if (min && max && Number(min) > Number(max)) return setErr('Minimum price is higher than maximum.');
    setErr(undefined);
    onApply({ min, max });
  };

  return (
    <div className="space-y-6">
      {showCategory ? (
        <SelectField label="Category" value={filters.category} onChange={(e) => onApply({ category: e.target.value })}>
          <option value="">All categories</option>
          {categories.map((c) => (<option key={c.id} value={c.slug}>{c.name}</option>))}
        </SelectField>
      ) : null}

      <form onSubmit={applyPrice} className="space-y-3" aria-label="Price range">
        <fieldset className="space-y-3">
          <legend className="mb-1 text-sm font-medium">Price range</legend>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button key={p.label} type="button" onClick={() => { const mn = p.min?.toString() ?? ''; const mx = p.max?.toString() ?? ''; setMin(mn); setMax(mx); onApply({ min: mn, max: mx }); }} className="rounded-full border border-ink/25 bg-white px-3 py-1.5 text-xs font-medium hover:bg-cream-deep">{p.label}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Min (₹)" type="number" inputMode="numeric" min={0} value={min} onChange={(e) => setMin(e.target.value)} />
            <TextField label="Max (₹)" type="number" inputMode="numeric" min={0} value={max} onChange={(e) => setMax(e.target.value)} />
          </div>
          <div>
            <label htmlFor={sliderId} className="mb-1 block text-xs text-ink-mute">Max price slider: {formatINR(Number(max || MAX_PRICE))}</label>
            <input id={sliderId} type="range" min={100} max={MAX_PRICE} step={100} value={max || MAX_PRICE} onChange={(e) => setMax(e.target.value === String(MAX_PRICE) ? '' : e.target.value)} className="w-full accent-ink" />
          </div>
          {err ? <p role="alert" className="text-xs font-medium text-terracotta-700">{err}</p> : null}
          <Button type="submit" variant="outline" size="sm" full>Apply price</Button>
        </fieldset>
      </form>

      <SelectField label="Minimum rating" value={filters.rating} onChange={(e) => onApply({ rating: e.target.value })}>
        <option value="">Any rating</option>
        <option value="4.5">4.5 and above</option>
        <option value="4">4.0 and above</option>
        <option value="3">3.0 and above</option>
      </SelectField>

      <label className="flex min-h-[44px] items-center gap-3 text-sm">
        <input type="checkbox" className="h-5 w-5 accent-ink" checked={filters.stock} onChange={(e) => onApply({ stock: e.target.checked })} />
        In stock only
      </label>

      <Button variant="ghost" full onClick={() => { setMin(''); setMax(''); onClear(); }}>Clear all filters</Button>
    </div>
  );
}

interface ListingProps {
  title: string;
  subtitle?: string;
  fixedCategory?: string;
  query?: string;
  categories: Category[];
}

export function ProductListing({ title, subtitle, fixedCategory, query, categories }: ListingProps) {
  const [params, setParams] = useSearchParams();
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [sheet, setSheet] = useState(false);

  const filters: Filters = {
    category: fixedCategory ?? params.get('category') ?? '',
    min: params.get('min') ?? '',
    max: params.get('max') ?? '',
    rating: params.get('rating') ?? '',
    stock: params.get('stock') === '1',
  };
  const sort = (params.get('sort') as SortKey | null) ?? 'relevance';

  const update = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next, { replace: true });
    setLimit(PAGE_SIZE);
  };
  const apply = (p: Partial<Filters>) =>
    update({
      ...(p.category !== undefined ? { category: p.category } : {}),
      ...(p.min !== undefined ? { min: p.min } : {}),
      ...(p.max !== undefined ? { max: p.max } : {}),
      ...(p.rating !== undefined ? { rating: p.rating } : {}),
      ...(p.stock !== undefined ? { stock: p.stock ? '1' : undefined } : {}),
    });
  const clear = () => update({ category: undefined, min: undefined, max: undefined, rating: undefined, stock: undefined });

  const q: ProductQuery = useMemo(() => {
    const out: ProductQuery = { sort };
    if (query) out.q = query;
    if (filters.category) out.category = filters.category;
    if (filters.min) out.minPrice = Number(filters.min);
    if (filters.max) out.maxPrice = Number(filters.max);
    if (filters.rating) out.minRating = Number(filters.rating);
    if (filters.stock) out.inStockOnly = true;
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, query, filters.category, filters.min, filters.max, filters.rating, filters.stock]);

  const { state, reload } = useAsync(() => catalogService.getProducts(q), [JSON.stringify(q)]);

  const activeCount = [!fixedCategory && filters.category, filters.min, filters.max, filters.rating, filters.stock].filter(Boolean).length;
  const showCategory = !fixedCategory;
  const panel = <FilterPanel filters={filters} categories={categories} showCategory={showCategory} onApply={apply} onClear={clear} />;

  return (
    <div className="container-page py-6 sm:py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-ink-soft">{subtitle}</p> : null}
      </div>
      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
        <aside className="hidden lg:block" aria-label="Filters"><div className="card sticky top-36 p-4">{panel}</div></aside>
        <section aria-label="Product results">
          <div className="mb-4 flex items-end justify-between gap-3">
            <p className="text-sm text-ink-soft" aria-live="polite">{state.status === 'success' ? `${state.data.length} product${state.data.length === 1 ? '' : 's'}` : 'Loading…'}</p>
            <div className="flex items-end gap-2">
              <Button variant="outline" className="lg:hidden" onClick={() => setSheet(true)} aria-haspopup="dialog"><Icon name="filter" size={18} />Filters{activeCount ? ` (${activeCount})` : ''}</Button>
              <div className="w-44 sm:w-52">
                <SelectField label="Sort by" value={sort} onChange={(e) => update({ sort: e.target.value === 'relevance' ? undefined : e.target.value })}>
                  {SORTS.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
                </SelectField>
              </div>
            </div>
          </div>
          {state.status === 'loading' ? <ProductGrid products={[]} loading cols={3} /> : null}
          {state.status === 'error' ? <ErrorState message={state.message} onRetry={reload} /> : null}
          {state.status === 'success' && state.data.length === 0 ? (
            <EmptyState title="No products match" message="Try removing a filter or searching for something broader." action={<Button onClick={clear}>Clear filters</Button>} />
          ) : null}
          {state.status === 'success' && state.data.length > 0 ? (
            <>
              <ProductGrid products={state.data.slice(0, limit)} cols={3} />
              {limit < state.data.length ? (
                <div className="mt-8 text-center"><Button variant="outline" size="lg" onClick={() => setLimit((l) => l + PAGE_SIZE)}>Show more ({state.data.length - limit} left)</Button></div>
              ) : null}
            </>
          ) : null}
        </section>
      </div>
      <Sheet open={sheet} onClose={() => setSheet(false)} title="Filters" side="bottom">
        {panel}
        <div className="sticky bottom-0 -mx-4 mt-6 border-t border-line bg-cream p-4"><Button full size="lg" onClick={() => setSheet(false)}>Show results</Button></div>
      </Sheet>
    </div>
  );
}
