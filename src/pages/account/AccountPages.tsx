import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PATHS, to } from '@/config/routes';
import { useAsync } from '@/hooks/useAsync';
import { usePageTitle } from '@/hooks/usePageTitle';
import { accountService } from '@/services/accountService';
import { formatDate, formatINR } from '@/lib/format';
import type { Address, Order } from '@/types/models';
import { ButtonLink, Button } from '@/components/ui/Button';
import { Alert, AsyncView, EmptyState, Skeleton } from '@/components/ui/Feedback';
import { Icon } from '@/components/ui/Icon';
import { OrderStatusBadge, PageHeader } from '@/components/ui/Controls';
import { AddressForm, type AddressValues } from '@/components/forms/AddressForm';
import { NotFoundContent } from '../NotFoundPage';

export function AccountHomePage() {
  usePageTitle('My account');
  const orders = useAsync(() => accountService.getOrders(), []);
  const tile = 'card flex items-center gap-3 p-4 hover:bg-cream-deep';
  return (
    <>
      <PageHeader title="My account" />
      <div className="card flex items-center gap-4 p-5">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-saffron-100 text-saffron-700"><Icon name="user" size={28} /></span>
        <div><p className="font-semibold">Sample Customer</p><p className="text-sm text-ink-soft">sample.customer@example.com (fictional)</p></div>
      </div>
      <ul className="grid gap-3 sm:grid-cols-3">
        <li><Link className={tile} to={PATHS.orders}><Icon name="package" />Orders</Link></li>
        <li><Link className={tile} to={PATHS.addresses}><Icon name="pin" />Addresses</Link></li>
        <li><Link className={tile} to={PATHS.wishlist}><Icon name="heart" />Wishlist</Link></li>
      </ul>
      <section aria-labelledby="recent-h">
        <h2 id="recent-h" className="mb-3 text-xl font-semibold">Recent orders</h2>
        <AsyncView state={orders.state} onRetry={orders.reload} skeleton={<Skeleton className="h-24" />}>
          {(list) => <OrderList orders={list.slice(0, 2)} />}
        </AsyncView>
      </section>
    </>
  );
}

function OrderList({ orders }: { orders: Order[] }) {
  return (
    <ul className="space-y-3">
      {orders.map((o) => (
        <li key={o.id}>
          <Link to={to.order(o.id)} className="card flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-cream-deep">
            <div><p className="font-semibold">{o.id}</p><p className="text-sm text-ink-soft">{formatDate(o.placedOn)} · {o.items.length} item{o.items.length > 1 ? 's' : ''}</p></div>
            <div className="flex items-center gap-4"><OrderStatusBadge status={o.status} /><span className="font-bold">{formatINR(o.total)}</span><Icon name="right" /></div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function OrdersPage() {
  usePageTitle('Orders');
  const { state, reload } = useAsync(() => accountService.getOrders(), []);
  return (
    <>
      <PageHeader title="Orders" subtitle="Fictional sample orders." />
      <AsyncView state={state} onRetry={reload} skeleton={<Skeleton className="h-40" />}>
        {(list) => (list.length ? <OrderList orders={list} /> : <EmptyState title="No orders yet" message="When you place orders they will appear here." action={<ButtonLink to={PATHS.shop}>Shop now</ButtonLink>} />)}
      </AsyncView>
    </>
  );
}

const steps = ['placed', 'packed', 'shipped', 'delivered'] as const;

export function OrderDetailPage() {
  const { id = '' } = useParams();
  usePageTitle(`Order ${id}`);
  const { state, reload } = useAsync(() => accountService.getOrder(id), [id]);
  return (
    <AsyncView state={state} onRetry={reload} skeleton={<Skeleton className="h-72" />} notFound={<NotFoundContent title="Order not found" message="We couldn't find that order." />}>
      {(o) => {
        const idx = steps.indexOf(o.status as (typeof steps)[number]);
        return (
          <>
            <PageHeader title={`Order ${o.id}`} subtitle={`Placed on ${formatDate(o.placedOn)}`} action={<OrderStatusBadge status={o.status} />} />
            {o.status === 'cancelled' ? <Alert tone="warning">This sample order was cancelled.</Alert> : (
              <ol className="card grid grid-cols-4 gap-2 p-4 text-center text-xs sm:text-sm" aria-label="Order progress">
                {steps.map((s, i) => (<li key={s} aria-current={i === idx ? 'step' : undefined} className={`rounded-lg py-2 font-semibold capitalize ${i <= idx ? 'bg-peacock-50 text-peacock-700' : 'bg-cream-deep text-ink-mute'}`}>{s}</li>))}
              </ol>
            )}
            <section className="card divide-y divide-line" aria-label="Items">
              {o.items.map((it) => (<div key={it.productId} className="flex justify-between gap-4 p-4 text-sm"><div><p className="font-semibold">{it.name}</p><p className="text-ink-mute">Qty {it.quantity}{it.variantSummary ? ` · ${it.variantSummary}` : ''}</p></div><p className="font-semibold">{formatINR(it.unitPrice * it.quantity)}</p></div>))}
            </section>
            <div className="grid gap-4 md:grid-cols-2">
              <section className="card space-y-1 p-4 text-sm"><h2 className="mb-1 text-lg font-semibold">Delivery address</h2><p>{o.address.fullName}</p><p>{o.address.line1}{o.address.line2 ? `, ${o.address.line2}` : ''}</p><p>{o.address.city}, {o.address.state} {o.address.pincode}</p></section>
              <section className="card space-y-1 p-4 text-sm"><h2 className="mb-1 text-lg font-semibold">Payment</h2><p className="flex justify-between"><span>Subtotal</span>{formatINR(o.subtotal)}</p><p className="flex justify-between"><span>Delivery</span>{o.shipping ? formatINR(o.shipping) : 'Free'}</p><p className="flex justify-between border-t border-line pt-2 font-bold"><span>Total</span>{formatINR(o.total)}</p><p className="text-xs text-ink-mute">{o.paymentMethod}</p></section>
            </div>
            <Link to={PATHS.orders} className="inline-block text-sm font-semibold underline">← All orders</Link>
          </>
        );
      }}
    </AsyncView>
  );
}

export function AddressesPage() {
  usePageTitle('Addresses');
  const { state, reload } = useAsync(() => accountService.getAddresses(), []);
  const [added, setAdded] = useState<Address[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string>();
  const [failure, setFailure] = useState<string>();

  const save = async (a: AddressValues) => {
    setBusy(true);
    setFailure(undefined);
    try {
      const r = await accountService.saveAddress(a);
      setAdded((list) => [...list, { ...a, id: `local-${list.length + 1}` }]);
      setNotice(r.message);
      setOpen(false);
    } catch (e) {
      setFailure(e instanceof Error ? e.message : 'Could not save the address.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Addresses" subtitle="Fictional sample addresses." action={!open ? <Button onClick={() => { setOpen(true); setNotice(undefined); }}><Icon name="plus" size={18} />Add address</Button> : undefined} />
      {notice ? <Alert tone="info" title="Added to this page only">{notice} It will disappear when you reload.</Alert> : null}
      {open ? (
        <section className="card p-5" aria-labelledby="new-addr">
          <h2 id="new-addr" className="mb-4 text-xl font-semibold">New address</h2>
          {failure ? <div className="mb-4"><Alert tone="error">{failure}</Alert></div> : null}
          <AddressForm submitLabel="Save address" busy={busy} onSubmit={save} onCancel={() => setOpen(false)} />
        </section>
      ) : null}
      <AsyncView state={state} onRetry={reload} skeleton={<Skeleton className="h-40" />}>
        {(list) => {
          const all = [...list, ...added];
          return all.length ? (
            <ul className="grid gap-4 sm:grid-cols-2">
              {all.map((a) => (
                <li key={a.id} className="card space-y-1 p-4 text-sm">
                  <p className="inline-block rounded-full bg-cream-deep px-2.5 py-0.5 text-xs font-semibold">{a.label}</p>
                  <p className="font-semibold">{a.fullName}</p>
                  <p>{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
                  {a.landmark ? <p className="text-ink-mute">Landmark: {a.landmark}</p> : null}
                  <p>{a.city}, {a.state} {a.pincode}</p>
                  <p className="text-ink-mute">Mobile: {a.phone}</p>
                </li>
              ))}
            </ul>
          ) : <EmptyState title="No saved addresses" message="Add an address to speed up checkout." />;
        }}
      </AsyncView>
    </>
  );
}
