import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SHIPPING } from '@/config/commerce';
import { PATHS, to } from '@/config/routes';
import { useCommerce } from '@/context/CommerceContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { accountService } from '@/services/accountService';
import { formatINR } from '@/lib/format';
import type { WriteResult } from '@/types/models';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Alert, EmptyState } from '@/components/ui/Feedback';
import { Icon } from '@/components/ui/Icon';
import { ProductArt } from '@/components/ui/Display';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { AddressForm, type AddressValues } from '@/components/forms/AddressForm';

function Summary({ cta }: { cta?: ReactNode }) {
  const { subtotal, mrpTotal, cartCount } = useCommerce();
  const shipping = subtotal >= SHIPPING.freeOver || subtotal === 0 ? 0 : SHIPPING.flatFee;
  const row = 'flex justify-between text-sm';
  return (
    <aside className="card h-fit space-y-3 p-5" aria-labelledby="sum-h">
      <h2 id="sum-h" className="text-xl font-semibold">Order summary</h2>
      <div className={row}><span>Items ({cartCount})</span><span>{formatINR(mrpTotal)}</span></div>
      {mrpTotal > subtotal ? <div className={`${row} text-peacock-700`}><span>Discount</span><span>-{formatINR(mrpTotal - subtotal)}</span></div> : null}
      <div className={row}><span>Delivery (sample rule)</span><span>{shipping === 0 ? 'Free' : formatINR(shipping)}</span></div>
      <div className="flex justify-between border-t border-line pt-3 text-lg font-bold"><span>Total</span><span>{formatINR(subtotal + shipping)}</span></div>
      <p className="text-xs text-ink-mute">Free delivery over {formatINR(SHIPPING.freeOver)} is a sample rule. Taxes and final prices will be calculated by the backend.</p>
      {cta}
    </aside>
  );
}

type Step = 'cart' | 'checkout' | 'done';

export function CartPage() {
  usePageTitle('Cart');
  const { cart, setQuantity, removeLine, toggleWishlist } = useCommerce();
  const [step, setStep] = useState<Step>('cart');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<WriteResult>();
  const [failure, setFailure] = useState<string>();

  if (cart.length === 0 && step !== 'done') {
    return (
      <div className="container-page py-16">
        <EmptyState title="Your cart is empty" message="Add something you love. Your cart is saved on this device only." action={<ButtonLink to={PATHS.shop}>Start shopping</ButtonLink>} />
      </div>
    );
  }

  const placeholder = async (address: AddressValues) => {
    setBusy(true);
    setFailure(undefined);
    try {
      setResult(await accountService.previewCheckout({ address, lines: cart.map((l) => ({ productId: l.productId, quantity: l.quantity })) }));
      setStep('done');
    } catch (e) {
      setFailure(e instanceof Error ? e.message : 'Could not complete the checkout preview.');
    } finally {
      setBusy(false);
    }
  };

  if (step === 'done') {
    return (
      <div className="container-page py-16">
        <div className="card mx-auto max-w-xl space-y-4 p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-peacock-50 text-peacock-700"><Icon name="check" size={28} /></span>
          <h1 className="text-2xl font-semibold">Checkout preview complete</h1>
          <Alert tone="warning" title="No order was placed">{result?.message ?? 'Nothing was sent.'} No payment was taken, and your cart is unchanged.</Alert>
          <div className="flex flex-wrap justify-center gap-3"><Button variant="outline" onClick={() => setStep('cart')}>Back to cart</Button><ButtonLink to={PATHS.shop}>Continue shopping</ButtonLink></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-6 sm:py-10">
      <h1 className="mb-6 text-3xl font-semibold">{step === 'cart' ? 'Your cart' : 'Checkout (preview)'}</h1>
      <ol className="mb-6 flex gap-2 text-sm" aria-label="Progress">
        {(['cart', 'checkout'] as const).map((s, i) => (<li key={s} aria-current={step === s ? 'step' : undefined} className={`rounded-full px-3 py-1 font-semibold ${step === s ? 'bg-ink text-cream' : 'bg-cream-deep text-ink-soft'}`}>{i + 1}. {s === 'cart' ? 'Cart' : 'Address & review'}</li>))}
      </ol>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {step === 'cart' ? (
          <ul className="space-y-4">
            {cart.map((l) => (
              <li key={l.key} className="card flex gap-4 p-4">
                <Link to={to.product(l.slug)} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28"><ProductArt hue={l.hue} label="" /></Link>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Link to={to.product(l.slug)} className="font-semibold leading-snug hover:underline">{l.name}</Link>
                  <p className="text-xs text-ink-mute">{l.sellerName}{l.variantSummary ? ` · ${l.variantSummary}` : ''}</p>
                  <p className="font-bold">{formatINR(l.unitPrice * l.quantity)}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-3">
                    <QuantityStepper value={l.quantity} max={l.maxQuantity} onChange={(n) => setQuantity(l.key, n)} label={`Quantity of ${l.name}`} />
                    <Button variant="ghost" size="sm" onClick={() => { toggleWishlist(l.productId); removeLine(l.key); }}>Move to wishlist</Button>
                    <Button variant="ghost" size="sm" onClick={() => removeLine(l.key)} aria-label={`Remove ${l.name} from cart`}><Icon name="trash" size={16} />Remove</Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-8">
            <section className="card p-5" aria-labelledby="addr-h">
              <h2 id="addr-h" className="mb-4 text-xl font-semibold">Delivery address</h2>
              {failure ? <div className="mb-4"><Alert tone="error">{failure}</Alert></div> : null}
              <AddressForm submitLabel="Review order (preview)" busy={busy} onSubmit={placeholder} onCancel={() => setStep('cart')} />
            </section>
            <section className="card p-5" aria-labelledby="pay-h">
              <h2 id="pay-h" className="mb-3 text-xl font-semibold">Payment</h2>
              <Alert tone="warning" title="Payments are not implemented">No gateway is connected. This screen will never take or request card, UPI or bank details.</Alert>
            </section>
          </div>
        )}
        <Summary cta={step === 'cart' ? <Button full size="lg" variant="accent" onClick={() => setStep('checkout')}>Proceed to checkout</Button> : undefined} />
      </div>
    </div>
  );
}
