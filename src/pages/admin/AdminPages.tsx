import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/config/routes';
import { useAsync } from '@/hooks/useAsync';
import { useForm } from '@/hooks/useForm';
import { usePageTitle } from '@/hooks/usePageTitle';
import { adminService } from '@/services/portalService';
import { formatDate, formatINR } from '@/lib/format';
import { all, email, positiveNumber, required } from '@/lib/validation';
import type { ModerationItem, PlatformSettings, ReviewStatus, SellerApplicationRecord, WriteResult } from '@/types/models';
import { Button } from '@/components/ui/Button';
import { Badge, StatCard } from '@/components/ui/Display';
import { TextField } from '@/components/ui/Fields';
import { Alert, AsyncView, MockNotice, Skeleton } from '@/components/ui/Feedback';
import { FilterTabs, OrderStatusBadge, PageHeader } from '@/components/ui/Controls';

const reviewTone = (s: ReviewStatus) => (s === 'approved' ? 'good' : s === 'rejected' ? 'bad' : 'warn');
type ReviewFilter = 'all' | ReviewStatus;
const reviewTabs: { value: ReviewFilter; label: string }[] = [{ value: 'all', label: 'All' }, { value: 'pending', label: 'Pending' }, { value: 'approved', label: 'Approved' }, { value: 'rejected', label: 'Rejected' }];

function ReviewActions({ status, name, onSet }: { status: ReviewStatus; name: string; onSet: (s: ReviewStatus) => void }) {
  if (status !== 'pending') return <Button size="sm" variant="ghost" onClick={() => onSet('pending')} aria-label={`Move ${name} back to pending`}>Reopen</Button>;
  return (
    <div className="flex gap-2">
      <Button size="sm" onClick={() => onSet('approved')} aria-label={`Approve ${name}`}>Approve</Button>
      <Button size="sm" variant="danger" onClick={() => onSet('rejected')} aria-label={`Reject ${name}`}>Reject</Button>
    </div>
  );
}

function SettingsForms({ s }: { s: PlatformSettings }) {
  const [result, setResult] = useState<WriteResult>();
  const [failure, setFailure] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [rules, setRules] = useState(s.rules.map((r) => ({ ...r, percent: String(r.percent) })));
  const [ruleError, setRuleError] = useState<string>();
  const f = useForm(
    { platformName: s.platformName, supportEmail: s.supportEmail, defaultCommission: String(s.defaultCommission), freeShipping: String(s.freeShippingThreshold) },
    {
      platformName: required('Platform name'), supportEmail: all(required('Support email'), email()),
      defaultCommission: all(required('Default commission'), positiveNumber('Commission'), (v) => (Number(v) > 50 ? 'Commission above 50% looks wrong.' : undefined)),
      freeShipping: all(required('Free shipping threshold'), positiveNumber('Threshold')),
    },
  );
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const rulesOk = rules.every((r) => r.percent !== '' && Number(r.percent) > 0 && Number(r.percent) <= 50);
    setRuleError(rulesOk ? undefined : 'Each category commission must be between 0.1 and 50.');
    if (!f.validate() || !rulesOk) return;
    setBusy(true);
    setFailure(undefined);
    try {
      setResult(await adminService.saveSettings({ platformName: f.values.platformName }));
    } catch (err) {
      setFailure(err instanceof Error ? err.message : 'Could not save settings.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <section className="card grid gap-4 p-5 sm:grid-cols-2" aria-labelledby="ps-h">
        <h2 id="ps-h" className="text-xl font-semibold sm:col-span-2">Platform settings</h2>
        <TextField label="Platform name" required {...f.field('platformName')} />
        <TextField label="Support email" type="email" required {...f.field('supportEmail')} />
        <TextField label="Free-shipping threshold (₹)" inputMode="numeric" required {...f.field('freeShipping')} />
      </section>
      <section className="card grid gap-4 p-5 sm:grid-cols-2" aria-labelledby="cc-h">
        <h2 id="cc-h" className="text-xl font-semibold sm:col-span-2">Commission configuration</h2>
        <TextField label="Default commission (%)" inputMode="decimal" required hint="Applied when a category has no rule." {...f.field('defaultCommission')} />
        <div className="sm:col-span-2"><p className="mb-2 text-sm font-medium">Category overrides</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {rules.map((r, i) => (<TextField key={r.categorySlug} label={`${r.categorySlug.replace(/-/g, ' ')} (%)`} inputMode="decimal" value={r.percent} onChange={(e) => { const v = e.target.value; setRuleError(undefined); setRules((list) => list.map((x, j) => (j === i ? { ...x, percent: v } : x))); }} />))}
          </div>
          {ruleError ? <p role="alert" className="mt-2 text-xs font-medium text-terracotta-700">{ruleError}</p> : null}
        </div>
      </section>
      <div className="space-y-3"><Button type="submit" size="lg" loading={busy}>Save settings (preview)</Button>
        <div aria-live="polite">{result ? <Alert tone="warning" title="Not saved">{result.message}</Alert> : null}{failure ? <Alert tone="error">{failure}</Alert> : null}</div></div>
    </form>
  );
}

function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <div className="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink/25 bg-white/60 p-4 text-center">
      <p className="font-semibold">{title}</p><p className="mt-1 text-xs text-ink-mute">{note}</p>
    </div>
  );
}

export function AdminDashboardPage() {
  usePageTitle('Admin dashboard');
  const ov = useAsync(() => adminService.getOverview(), []);
  const st = useAsync(() => adminService.getSettings(), []);
  return (
    <>
      <PageHeader title="Dashboard" action={<MockNotice>Mock figures</MockNotice>} />
      <AsyncView state={ov.state} onRetry={ov.reload} skeleton={<Skeleton className="h-28" />}>
        {(o) => (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="GMV (sample)" value={formatINR(o.gmv)} icon="wallet" />
            <StatCard label="Orders" value={String(o.orders)} icon="package" />
            <StatCard label="Active sellers" value={String(o.activeSellers)} icon="store" />
            <StatCard label="Awaiting review" value={String(o.pendingSellers + o.pendingProducts)} icon="alert" note={`${o.pendingSellers} sellers · ${o.pendingProducts} products`} />
          </div>
        )}
      </AsyncView>
      <section aria-labelledby="an-h"><h2 id="an-h" className="mb-3 text-xl font-semibold">Analytics</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Placeholder title="Sales trend" note="Chart placeholder. Needs real order data." />
          <Placeholder title="Top categories" note="Chart placeholder." />
          <Placeholder title="Seller performance" note="Table placeholder." />
        </div>
      </section>
      <ul className="flex flex-wrap gap-3 text-sm font-semibold">
        <li><Link className="underline" to={PATHS.adminSellers}>Seller approval queue →</Link></li>
        <li><Link className="underline" to={PATHS.adminProducts}>Catalog moderation →</Link></li>
        <li><Link className="underline" to={PATHS.adminOrders}>Order management →</Link></li>
      </ul>
      <AsyncView state={st.state} onRetry={st.reload} skeleton={<Skeleton className="h-64" />}>{(s) => <SettingsForms s={s} />}</AsyncView>
    </>
  );
}

function SellerQueue({ initial }: { initial: SellerApplicationRecord[] }) {
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState<ReviewFilter>('pending');
  const shown = rows.filter((r) => filter === 'all' || r.status === filter);
  return (
    <>
      <FilterTabs label="Application status" value={filter} onChange={setFilter} options={reviewTabs} />
      {shown.length === 0 ? <Alert tone="info">Nothing in this view.</Alert> : (
        <div className="table-wrap"><table className="table-base"><thead><tr><th>Business</th><th>Owner</th><th>Location</th><th>Category</th><th>Submitted</th><th>Status</th><th>Action</th></tr></thead><tbody>
          {shown.map((r) => (
            <tr key={r.id}><td className="font-semibold">{r.businessName}</td><td>{r.ownerName}</td><td>{r.city}, {r.state}</td><td>{r.category}</td><td>{formatDate(r.submittedOn)}</td><td><Badge tone={reviewTone(r.status)}>{r.status}</Badge></td>
              <td><ReviewActions status={r.status} name={r.businessName} onSet={(s) => setRows((l) => l.map((x) => (x.id === r.id ? { ...x, status: s } : x)))} /></td></tr>
          ))}
        </tbody></table></div>
      )}
    </>
  );
}

export function AdminSellersPage() {
  usePageTitle('Seller approvals');
  const { state, reload } = useAsync(() => adminService.getSellerApplications(), []);
  return (
    <>
      <PageHeader title="Seller approval queue" />
      <Alert tone="warning" title="Local preview">Approve and reject only change this screen in your browser. No decision is recorded or sent, and no verification checks exist.</Alert>
      <AsyncView state={state} onRetry={reload} skeleton={<Skeleton className="h-64" />}>{(d) => <SellerQueue initial={d} />}</AsyncView>
    </>
  );
}

function ModerationTable({ initial }: { initial: ModerationItem[] }) {
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState<ReviewFilter>('pending');
  const shown = rows.filter((r) => filter === 'all' || r.status === filter);
  return (
    <>
      <FilterTabs label="Moderation status" value={filter} onChange={setFilter} options={reviewTabs} />
      {shown.length === 0 ? <Alert tone="info">Nothing in this view.</Alert> : (
        <div className="table-wrap"><table className="table-base"><thead><tr><th>Product</th><th>Seller</th><th>Price</th><th>Note</th><th>Status</th><th>Action</th></tr></thead><tbody>
          {shown.map((r) => (
            <tr key={r.id}><td><p className="font-semibold">{r.productName}</p><p className="text-xs text-ink-mute">{r.category} · {formatDate(r.submittedOn)}</p></td><td>{r.sellerName}</td><td>{formatINR(r.price)}</td><td className="max-w-[220px] text-ink-soft">{r.note || '-'}</td><td><Badge tone={reviewTone(r.status)}>{r.status}</Badge></td>
              <td><ReviewActions status={r.status} name={r.productName} onSet={(s) => setRows((l) => l.map((x) => (x.id === r.id ? { ...x, status: s } : x)))} /></td></tr>
          ))}
        </tbody></table></div>
      )}
    </>
  );
}

export function AdminProductsPage() {
  usePageTitle('Catalog moderation');
  const { state, reload } = useAsync(() => adminService.getModerationQueue(), []);
  return (
    <>
      <PageHeader title="Catalog moderation" />
      <Alert tone="warning" title="Local preview">Decisions here are not stored. No listing is actually published or removed.</Alert>
      <AsyncView state={state} onRetry={reload} skeleton={<Skeleton className="h-64" />}>{(d) => <ModerationTable initial={d} />}</AsyncView>
    </>
  );
}

export function AdminOrdersPage() {
  usePageTitle('Order management');
  const { state, reload } = useAsync(() => adminService.getOrders(), []);
  const [q, setQ] = useState('');
  return (
    <>
      <PageHeader title="Order management" subtitle="Sample orders. Read-only." />
      <div className="w-full sm:w-72"><TextField label="Search by order ID or customer" type="search" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <AsyncView state={state} onRetry={reload} skeleton={<Skeleton className="h-64" />}>
        {(list) => {
          const term = q.trim().toLowerCase();
          const rows = list.filter((o) => !term || o.id.toLowerCase().includes(term) || o.customerName.toLowerCase().includes(term));
          return rows.length === 0 ? <Alert tone="info">No orders match “{q}”.</Alert> : (
            <div className="table-wrap"><table className="table-base"><thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>City</th><th>Status</th><th>Total</th></tr></thead><tbody>
              {rows.map((o) => (<tr key={o.id}><td className="font-semibold">{o.id}</td><td>{formatDate(o.placedOn)}</td><td>{o.customerName}</td><td>{o.address.city}</td><td><OrderStatusBadge status={o.status} /></td><td>{formatINR(o.total)}</td></tr>))}
            </tbody></table></div>
          );
        }}
      </AsyncView>
    </>
  );
}
