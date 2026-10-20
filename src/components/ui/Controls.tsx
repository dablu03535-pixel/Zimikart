import type { ReactNode } from 'react';
import type { OrderStatus } from '@/types/models';
import { Badge } from './Display';

export function FilterTabs<T extends string>({ label, options, value, onChange }: { label: string; options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)} className={`min-h-[40px] rounded-full border px-4 text-sm font-medium ${value === o.value ? 'border-ink bg-ink text-cream' : 'border-ink/25 bg-white hover:bg-cream-deep'}`}>{o.label}</button>
      ))}
    </div>
  );
}

const tone: Record<OrderStatus, 'neutral' | 'good' | 'warn' | 'bad'> = { placed: 'warn', packed: 'warn', shipped: 'neutral', delivered: 'good', cancelled: 'bad' };
export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => <Badge tone={tone[status]}>{status}</Badge>;

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>{subtitle ? <p className="mt-1 text-sm text-ink-soft">{subtitle}</p> : null}</div>
      {action}
    </div>
  );
}
