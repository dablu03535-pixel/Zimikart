import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/config/routes';
import { useAsync } from '@/hooks/useAsync';
import { useCategories } from '@/hooks/useCategories';
import { useForm } from '@/hooks/useForm';
import { usePageTitle } from '@/hooks/usePageTitle';
import { sellerService } from '@/services/portalService';
import { formatDate, formatINR, stockState } from '@/lib/format';
import { all, email, gstin, indianMobile, pincode, positiveNumber, required, truthy } from '@/lib/validation';
import type { Seller, WriteResult } from '@/types/models';
import { Button } from '@/components/ui/Button';
import { Badge, ProductArt, StatCard, StockBadge } from '@/components/ui/Display';
import { CheckField, SelectField, TextAreaField, TextField } from '@/components/ui/Fields';
import { Alert, AsyncView, MockNotice, Skeleton } from '@/components/ui/Feedback';
import { FilterTabs, OrderStatusBadge, PageHeader } from '@/components/ui/Controls';
import { INDIAN_STATES } from '@/components/forms/AddressForm';

function useWrite() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<WriteResult>();
  const [failure, setFailure] = useState<string>();
  const run = async (fn: () => Promise<WriteResult>) => {
    setBusy(true);
    setFailure(undefined);
    try {
      setResult(await fn());
    } catch (e) {
      setFailure(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };
  return { busy, result, failure, run };
}

function WriteNotice({ result, failure }: { result?: WriteResult | undefined; failure?: string | undefined }) {
  return (
    <div aria-live="polite">
      {result ? <Alert tone="warning" title={result.persisted ? 'Saved' : 'Not saved'}>{result.message}</Alert> : null}
      {failure ? <Alert tone="error">{failure}</Alert> : null}
    </div>
  );
}

export function SellerRegisterPage() {
  usePageTitle('Become a seller');
  const cats = useCategories();
  const w = useWrite();
  const f = useForm(
    { business: '', owner: '', email: '', phone: '', city: '', state: '', pincode: '', category: '', gstin: '', about: '', agree: '' },
    {
      business: required('Business name'), owner: required('Owner name'),
      email: all(required('Email'), email()), phone: all(required('Mobile number'), indianMobile()),
      city: required('City'), state: required('State'), pincode: all(required('Pincode'), pincode()),
      category: required('Main category'), gstin: gstin(), agree: truthy('Please confirm to continue.'),
    },
  );
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (f.validate()) void w.run(() => sellerService.submitApplication({ business: f.values.business, email: f.values.email }));
  };
  return (
    <div className="container-page max-w-3xl py-8 sm:py-12">
      <h1 className="text-3xl font-semibold sm:text-4xl">Sell on this marketplace</h1>
      <p className="mt-2 text-ink-soft">This is the onboarding form design. Submitting it does not create a seller account and nobody reviews it in Stage 1.</p>
      <div className="mt-4"><Alert tone="info" title="Keep sensitive data out">This preview never asks for PAN, Aadhaar, bank or payout details. Those need secure, server-side handling.</Alert></div>
      <form onSubmit={submit} noValidate className="card mt-6 grid gap-4 p-5 sm:grid-cols-2 sm:p-8">
        <div className="sm:col-span-2"><TextField label="Business / shop name" required {...f.field('business')} /></div>
        <TextField label="Owner name" autoComplete="name" required {...f.field('owner')} />
        <TextField label="Email" type="email" autoComplete="email" required {...f.field('email')} />
        <TextField label="Mobile number" type="tel" inputMode="numeric" maxLength={10} required {...f.field('phone')} />
        <SelectField label="Main category" required {...f.field('category')}>
          <option value="">Select category</option>
          {cats.state.status === 'success' ? cats.state.data.map((c) => (<option key={c.id} value={c.slug}>{c.name}</option>)) : null}
        </SelectField>
        <TextField label="City" required {...f.field('city')} />
        <SelectField label="State" required {...f.field('state')}><option value="">Select state</option>{INDIAN_STATES.map((s) => (<option key={s}>{s}</option>))}</SelectField>
        <TextField label="Pickup pincode" inputMode="numeric" maxLength={6} required {...f.field('pincode')} />
        <TextField label="GSTIN (optional)" maxLength={15} hint="Format is checked only. It is not verified." {...f.field('gstin')} />
        <div className="sm:col-span-2"><TextAreaField label="About your products (optional)" {...f.field('about')} /></div>
        <div className="sm:col-span-2"><CheckField label="I understand this form is a preview and my details are not sent anywhere." {...f.check('agree')} /></div>
        <div className="space-y-3 sm:col-span-2"><Button type="submit" size="lg" loading={w.busy}>Submit application</Button><WriteNotice result={w.result} failure={w.failure} /></div>
      </form>
    </div>
  );
}

function ProfileForm({ seller }: { seller: Seller }) {
  const w = useWrite();
  const f = useForm(
    { name: seller.name, email: 'seller@example.com', phone: '9000000002', city: seller.city, about: seller.about },
    { name: required('Shop name'), email: all(required('Email'), email()), phone: all(required('Mobile number'), indianMobile()), city: required('City') },
  );
  const submit = (e: FormEvent) => { e.preventDefault(); if (f.validate()) void w.run(() => sellerService.saveProfile({ name: f.values.name })); };
  return (
    <form onSubmit={submit} noValidate className="card grid gap-4 p-5 sm:grid-cols-2" aria-labelledby="profile-h">
      <h2 id="profile-h" className="text-xl font-semibold sm:col-span-2">Profile settings</h2>
      <TextField label="Shop name" required {...f.field('name')} />
      <TextField label="Contact email" type="email" required {...f.field('email')} />
      <TextField label="Mobile number" type="tel" inputMode="numeric" maxLength={10} required {...f.field('phone')} />
      <TextField label="City" required {...f.field('city')} />
      <div className="sm:col-span-2"><TextAreaField label="About" {...f.field('about')} /></div>
      <div className="space-y-3 sm:col-span-2"><Button type="submit" loading={w.busy}>Save profile</Button><WriteNotice result={w.result} failure={w.failure} /></div>
    </form>
  );
}

export function SellerDashboardPage() {
  usePageTitle('Seller dashboard');
  const dash = useAsync(() => sellerService.getDashboard(), []);
  const orders = useAsync(() => sellerService.getOrders(), []);
  const profile = useAsync(() => sellerService.getProfile(), []);
  const prods = useAsync(() => sellerService.getProducts(), []);
  return (
    <>
      <PageHeader title="Dashboard" action={<MockNotice>Mock figures</MockNotice>} />
      <AsyncView state={dash.state} onRetry={dash.reload} skeleton={<Skeleton className="h-28" />}>
        {(d) => {
          const peak = Math.max(...d.weekly.map((w) => w.value));
          return (
            <>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatCard label="Sales (month)" value={formatINR(d.salesThisMonth)} icon="wallet" />
                <StatCard label="Orders (month)" value={String(d.ordersThisMonth)} icon="package" />
                <StatCard label="Pending orders" value={String(d.pendingOrders)} icon="truck" />
                <StatCard label="Low stock" value={String(d.lowStockCount)} icon="alert" />
              </div>
              <section className="card p-5" aria-labelledby="week-h">
                <h2 id="week-h" className="mb-4 text-xl font-semibold">Sales this week</h2>
                <ul className="flex h-40 items-end gap-2 sm:gap-4">
                  {d.weekly.map((w) => (
                    <li key={w.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                      <span className="text-[11px] text-ink-mute">{formatINR(w.value)}</span>
                      <div className="w-full rounded-t-lg bg-peacock-600" style={{ height: `${Math.max(6, (w.value / peak) * 80)}%` }} />
                      <span className="text-xs font-medium">{w.label}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          );
        }}
      </AsyncView>
      <div className="grid gap-6 xl:grid-cols-2">
        <section aria-labelledby="ro-h" className="min-w-0">
          <div className="mb-2 flex items-center justify-between"><h2 id="ro-h" className="text-xl font-semibold">Recent orders</h2><Link className="text-sm font-semibold underline" to={PATHS.sellerOrders}>All orders</Link></div>
          <AsyncView state={orders.state} onRetry={orders.reload} skeleton={<Skeleton className="h-40" />}>
            {(list) => (
              <div className="table-wrap"><table className="table-base"><thead><tr><th>Order</th><th>Date</th><th>Status</th><th>Total</th></tr></thead><tbody>
                {list.slice(0, 4).map((o) => (<tr key={o.id}><td className="font-semibold">{o.id}</td><td>{formatDate(o.placedOn)}</td><td><OrderStatusBadge status={o.status} /></td><td>{formatINR(o.total)}</td></tr>))}
              </tbody></table></div>
            )}
          </AsyncView>
        </section>
        <section aria-labelledby="ls-h" className="min-w-0">
          <h2 id="ls-h" className="mb-2 text-xl font-semibold">Inventory alerts</h2>
          <AsyncView state={prods.state} onRetry={prods.reload} skeleton={<Skeleton className="h-40" />}>
            {(list) => {
              const low = list.filter((p) => p.stock <= 5);
              return low.length ? (<ul className="card divide-y divide-line">{low.map((p) => (<li key={p.id} className="flex items-center justify-between gap-3 p-3 text-sm"><span className="font-medium">{p.name}</span><StockBadge stock={p.stock} /></li>))}</ul>) : <Alert tone="success">No low-stock items.</Alert>;
            }}
          </AsyncView>
        </section>
      </div>
      <AsyncView state={profile.state} onRetry={profile.reload} skeleton={<Skeleton className="h-60" />}>{(s) => <ProfileForm seller={s} />}</AsyncView>
    </>
  );
}

function AddProductForm({ onDone }: { onDone: () => void }) {
  const cats = useCategories();
  const w = useWrite();
  const f = useForm(
    { name: '', category: '', price: '', mrp: '', stock: '', description: '' },
    {
      name: required('Product name'), category: required('Category'),
      price: all(required('Price'), positiveNumber('Price')),
      mrp: all(required('MRP'), positiveNumber('MRP'), (v, a) => (Number(v) < Number(a.price) ? 'MRP cannot be lower than the selling price.' : undefined)),
      stock: (v) => (v === '' || !/^\d+$/.test(v) ? 'Enter a whole number (0 or more).' : undefined),
      description: required('Description'),
    },
  );
  const submit = (e: FormEvent) => { e.preventDefault(); if (f.validate()) void w.run(() => sellerService.saveProduct({ name: f.values.name })); };
  return (
    <form onSubmit={submit} noValidate className="card grid gap-4 p-5 sm:grid-cols-2" aria-labelledby="addp-h">
      <h2 id="addp-h" className="text-xl font-semibold sm:col-span-2">Add product (preview form)</h2>
      <div className="sm:col-span-2"><TextField label="Product name" required {...f.field('name')} /></div>
      <SelectField label="Category" required {...f.field('category')}><option value="">Select</option>{cats.state.status === 'success' ? cats.state.data.map((c) => (<option key={c.id} value={c.slug}>{c.name}</option>)) : null}</SelectField>
      <TextField label="Stock quantity" inputMode="numeric" required {...f.field('stock')} />
      <TextField label="Selling price (₹)" inputMode="decimal" required {...f.field('price')} />
      <TextField label="MRP (₹)" inputMode="decimal" required {...f.field('mrp')} />
      <div className="sm:col-span-2"><TextAreaField label="Description" required {...f.field('description')} /></div>
      <div className="space-y-3 sm:col-span-2"><div className="flex gap-3"><Button type="submit" loading={w.busy}>Create product</Button><Button variant="ghost" onClick={onDone}>Close</Button></div><WriteNotice result={w.result} failure={w.failure} /></div>
    </form>
  );
}

export function SellerProductsPage() {
  usePageTitle('Seller products');
  const { state, reload } = useAsync(() => sellerService.getProducts(), []);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'all' | 'low' | 'out' | 'draft'>('all');
  const [adding, setAdding] = useState(false);
  return (
    <>
      <PageHeader title="Products & inventory" subtitle="Sample listings." action={!adding ? <Button onClick={() => setAdding(true)}>Add product</Button> : undefined} />
      {adding ? <AddProductForm onDone={() => setAdding(false)} /> : null}
      <AsyncView state={state} onRetry={reload} skeleton={<Skeleton className="h-64" />}>
        {(list) => {
          const rows = list.filter((p) => p.name.toLowerCase().includes(q.trim().toLowerCase()) && (status === 'all' || (status === 'low' && stockState(p.stock) === 'low') || (status === 'out' && p.stock <= 0) || (status === 'draft' && p.listingStatus === 'draft')));
          return (
            <>
              <div className="flex flex-wrap items-end gap-4">
                <div className="w-full sm:w-72"><TextField label="Filter by name" type="search" value={q} onChange={(e) => setQ(e.target.value)} /></div>
                <FilterTabs label="Inventory status" value={status} onChange={setStatus} options={[{ value: 'all', label: 'All' }, { value: 'low', label: 'Low stock' }, { value: 'out', label: 'Out of stock' }, { value: 'draft', label: 'Drafts' }]} />
              </div>
              {rows.length === 0 ? <Alert tone="info">No products match this filter.</Alert> : (
                <div className="table-wrap"><table className="table-base"><thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Inventory</th><th>Listing</th></tr></thead><tbody>
                  {rows.map((p) => (
                    <tr key={p.id}>
                      <td><div className="flex items-center gap-3"><div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg"><ProductArt hue={p.hue} label="" /></div><span className="font-medium">{p.name}</span></div></td>
                      <td>{formatINR(p.price)}</td><td>{p.stock}</td><td><StockBadge stock={p.stock} /></td>
                      <td><Badge tone={p.listingStatus === 'active' ? 'good' : 'neutral'}>{p.listingStatus}</Badge></td>
                    </tr>
                  ))}
                </tbody></table></div>
              )}
            </>
          );
        }}
      </AsyncView>
    </>
  );
}

export function SellerOrdersPage() {
  usePageTitle('Seller orders');
  const { state, reload } = useAsync(() => sellerService.getOrders(), []);
  const [status, setStatus] = useState<'all' | 'placed' | 'packed' | 'shipped' | 'delivered' | 'cancelled'>('all');
  return (
    <>
      <PageHeader title="Orders" subtitle="Sample orders. Customer details are fictional." />
      <FilterTabs label="Order status" value={status} onChange={setStatus} options={(['all', 'placed', 'packed', 'shipped', 'delivered', 'cancelled'] as const).map((s) => ({ value: s, label: s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1) }))} />
      <AsyncView state={state} onRetry={reload} skeleton={<Skeleton className="h-64" />}>
        {(list) => {
          const rows = list.filter((o) => status === 'all' || o.status === status);
          return rows.length === 0 ? <Alert tone="info">No orders with this status.</Alert> : (
            <div className="table-wrap"><table className="table-base"><thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Items</th><th>Status</th><th>Total</th></tr></thead><tbody>
              {rows.map((o) => (<tr key={o.id}><td className="font-semibold">{o.id}</td><td>{formatDate(o.placedOn)}</td><td>{o.customerName}</td><td>{o.items.reduce((n, i) => n + i.quantity, 0)}</td><td><OrderStatusBadge status={o.status} /></td><td>{formatINR(o.total)}</td></tr>))}
            </tbody></table></div>
          );
        }}
      </AsyncView>
    </>
  );
}

export function SellerEarningsPage() {
  usePageTitle('Seller earnings');
  const { state, reload } = useAsync(() => sellerService.getEarnings(), []);
  return (
    <>
      <PageHeader title="Earnings" action={<MockNotice>Mock figures</MockNotice>} />
      <Alert tone="warning" title="Settlements are not implemented">No payouts are calculated or sent. These numbers only demonstrate the layout.</Alert>
      <AsyncView state={state} onRetry={reload} skeleton={<Skeleton className="h-64" />}>
        {(e) => (
          <>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard label="Gross sales" value={formatINR(e.gross)} icon="chart" />
              <StatCard label={`Commission (${e.commissionRate}%)`} value={formatINR(e.commission)} icon="settings" />
              <StatCard label="Net earnings" value={formatINR(e.net)} icon="wallet" />
              <StatCard label="Pending" value={formatINR(e.pending)} icon="truck" />
            </div>
            <section aria-labelledby="po-h"><h2 id="po-h" className="mb-2 text-xl font-semibold">Payout history</h2>
              <div className="table-wrap"><table className="table-base"><thead><tr><th>Payout</th><th>Period</th><th>Amount</th><th>Status</th></tr></thead><tbody>
                {e.payouts.map((p) => (<tr key={p.id}><td className="font-semibold">{p.id}</td><td>{p.period}</td><td>{formatINR(p.amount)}</td><td><Badge tone={p.status === 'paid' ? 'good' : p.status === 'on-hold' ? 'bad' : 'warn'}>{p.status}</Badge></td></tr>))}
              </tbody></table></div>
            </section>
          </>
        )}
      </AsyncView>
    </>
  );
}
