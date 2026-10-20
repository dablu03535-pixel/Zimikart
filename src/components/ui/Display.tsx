import { useId, type ReactNode } from 'react';
import { discountPercent, formatINR, stockState } from '@/lib/format';
import { Icon } from './Icon';

export function Rating({ value, count, size = 14 }: { value: number; count?: number; size?: number }) {
  const label = `Rated ${value.toFixed(1)} out of 5${count !== undefined ? ` from ${count} ratings` : ''}`;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-ink-soft" role="img" aria-label={label}>
      <span className="inline-flex text-saffron-500" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
            <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9L12 2.5Z" fill={value >= i - 0.25 ? 'currentColor' : value >= i - 0.75 ? '#f5a52488' : '#e3dac8'} />
          </svg>
        ))}
      </span>
      <span aria-hidden="true" className="font-semibold text-ink">{value.toFixed(1)}</span>
      {count !== undefined ? <span aria-hidden="true">({count.toLocaleString('en-IN')})</span> : null}
    </span>
  );
}

export function Price({ price, mrp, large = false }: { price: number; mrp?: number; large?: boolean }) {
  const off = mrp ? discountPercent(price, mrp) : 0;
  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span className={`font-bold text-ink ${large ? 'text-3xl' : 'text-base'}`}>{formatINR(price)}</span>
      {off > 0 && mrp ? (
        <>
          <span className="text-xs text-ink-mute line-through"><span className="sr-only">Original price </span>{formatINR(mrp)}</span>
          <span className={`font-semibold text-peacock-700 ${large ? 'text-base' : 'text-xs'}`}>{off}% off</span>
        </>
      ) : null}
    </p>
  );
}

export function StockBadge({ stock }: { stock: number }) {
  const s = stockState(stock);
  const map = {
    out: ['Out of stock', 'bg-terracotta-50 text-terracotta-700'],
    low: [`Only ${stock} left`, 'bg-saffron-100 text-saffron-700'],
    in: ['In stock', 'bg-peacock-50 text-peacock-700'],
  } as const;
  const [text, cls] = map[s];
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{text}</span>;
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'good' | 'warn' | 'bad' }) {
  const t = { neutral: 'bg-cream-deep text-ink-soft', good: 'bg-peacock-50 text-peacock-700', warn: 'bg-saffron-100 text-saffron-700', bad: 'bg-terracotta-50 text-terracotta-700' }[tone];
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${t}`}>{children}</span>;
}

/** Original generated artwork used in place of photographs (no third-party images). */
export function ProductArt({ hue, variant = 0, label, className = '' }: { hue: number; variant?: number; label: string; className?: string }) {
  const gid = `g${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const h = (hue + variant * 14) % 360;
  const a = `hsl(${h} 60% 90%)`;
  const b = `hsl(${h} 50% 70%)`;
  const dark = `hsl(${h} 45% 28%)`;
  const motif = [
    <g key="0" fill="none" stroke={dark} strokeWidth="2" opacity=".55">{[18, 34, 50, 66].map((r) => <circle key={r} cx="100" cy="100" r={r} />)}<circle cx="100" cy="100" r="6" fill={dark} /></g>,
    <g key="1" fill="none" stroke={dark} strokeWidth="2" opacity=".55">{[20, 40, 60].map((r) => <path key={r} d={`M100 ${100 - r}L${100 + r} 100L100 ${100 + r}L${100 - r} 100Z`} />)}</g>,
    <g key="2" fill={dark} opacity=".45">{Array.from({ length: 25 }, (_, i) => <circle key={i} cx={40 + (i % 5) * 30} cy={40 + Math.floor(i / 5) * 30} r={i % 2 ? 4 : 7} />)}</g>,
    <g key="3" stroke={dark} strokeWidth="6" opacity=".4">{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${20 + i * 24} 30L${40 + i * 24} 170`} />)}</g>,
  ];
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={label} className={`block h-full w-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#${gid})`} />
      {motif[variant % motif.length]}
    </svg>
  );
}

export function SectionHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4 sm:mb-6">
      <div>
        <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-ink-soft">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, icon, note }: { label: string; value: string; icon: Parameters<typeof Icon>[0]['name']; note?: string }) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between text-ink-soft"><p className="text-xs font-semibold uppercase tracking-wide">{label}</p><Icon name={icon} /></div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {note ? <p className="mt-1 text-xs text-ink-mute">{note}</p> : null}
    </div>
  );
}
