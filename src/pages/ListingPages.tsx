import { useState, type FormEvent } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { PATHS, to } from '@/config/routes';
import { useCategories } from '@/hooks/useCategories';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Fields';
import { AsyncView } from '@/components/ui/Feedback';
import { ProductListing } from '@/components/product/ProductListing';
import { NotFoundContent } from './NotFoundPage';

export function ShopPage() {
  usePageTitle('Shop');
  const { state } = useCategories();
  return <ProductListing title="All products" subtitle="Sample catalogue. Filter, sort and explore." categories={state.status === 'success' ? state.data : []} />;
}

export function CategoryPage() {
  const { slug = '' } = useParams();
  const { state, reload } = useCategories();
  const category = state.status === 'success' ? state.data.find((c) => c.slug === slug) : undefined;
  usePageTitle(category?.name ?? 'Category');
  return (
    <AsyncView state={state} onRetry={reload}>
      {(cats) =>
        category ? (
          <ProductListing key={slug} title={category.name} subtitle={category.tagline} fixedCategory={category.slug} categories={cats} />
        ) : (
          <NotFoundContent title="Category not found" message="We don't have a category with that name." />
        )
      }
    </AsyncView>
  );
}

const popular = ['saree', 'tea', 'brass', 'toy', 'honey', 'journal'];

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q')?.trim() ?? '';
  const [draft, setDraft] = useState(q);
  const { state } = useCategories();
  usePageTitle(q ? `Search: ${q}` : 'Search');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setParams(draft.trim() ? { q: draft.trim() } : {});
  };

  if (!q) {
    return (
      <div className="container-page py-10">
        <h1 className="text-3xl font-semibold sm:text-4xl">Search</h1>
        <form onSubmit={submit} role="search" className="mt-6 flex max-w-xl items-end gap-2">
          <div className="flex-1"><TextField label="What are you looking for?" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="e.g. cotton saree" /></div>
          <Button type="submit" size="lg">Search</Button>
        </form>
        <p className="mt-8 text-sm font-semibold text-ink-soft">Popular searches</p>
        <ul className="mt-2 flex flex-wrap gap-2">{popular.map((p) => (<li key={p}><Link to={to.search(p)} className="inline-block rounded-full border border-ink/25 bg-white px-4 py-2 text-sm hover:bg-cream-deep">{p}</Link></li>))}</ul>
        <p className="mt-8 text-sm text-ink-soft">Or <Link className="font-semibold underline" to={PATHS.shop}>browse everything</Link>.</p>
      </div>
    );
  }
  return <ProductListing key={q} title={`Results for “${q}”`} query={q} categories={state.status === 'success' ? state.data : []} />;
}
