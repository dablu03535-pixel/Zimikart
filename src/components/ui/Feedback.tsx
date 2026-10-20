import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { Button } from './Button';
import type { AsyncState } from '@/hooks/useAsync';

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-10 text-ink-soft">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-ink border-t-transparent" aria-hidden="true" />
      <span className="text-sm">{label}…</span>
    </div>
  );
}

export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div aria-hidden="true" className={`animate-pulse rounded-xl bg-cream-deep ${className}`} />
);

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading products" className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="card overflow-hidden">
          <Skeleton className="aspect-square rounded-none" />
          <div className="space-y-2 p-3"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, message, action }: { title: string; message: string; action?: ReactNode }) {
  return (
    <div className="card mx-auto flex max-w-lg flex-col items-center px-6 py-12 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-saffron-100 text-saffron-700"><Icon name="package" size={28} /></span>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-ink-soft">{message}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="card mx-auto flex max-w-lg flex-col items-center border-terracotta-600/40 px-6 py-10 text-center">
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-700"><Icon name="alert" size={26} /></span>
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="mt-1 text-sm text-ink-soft">{message}</p>
      {onRetry ? <Button className="mt-5" onClick={onRetry}>Try again</Button> : null}
    </div>
  );
}

type Tone = 'info' | 'success' | 'warning' | 'error';
const tones: Record<Tone, string> = {
  info: 'border-peacock-600/30 bg-peacock-50 text-peacock-700',
  success: 'border-peacock-600/30 bg-peacock-50 text-peacock-700',
  warning: 'border-saffron-500/40 bg-saffron-50 text-saffron-700',
  error: 'border-terracotta-600/30 bg-terracotta-50 text-terracotta-700',
};

export function Alert({ tone = 'info', title, children }: { tone?: Tone; title?: string; children: ReactNode }) {
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex gap-3 rounded-xl border p-3 text-sm ${tones[tone]}`}>
      <Icon name={tone === 'success' ? 'check' : tone === 'info' ? 'info' : 'alert'} className="mt-0.5 shrink-0" />
      <div>{title ? <p className="font-semibold">{title}</p> : null}<div>{children}</div></div>
    </div>
  );
}

export const MockNotice = ({ children = 'Sample data for interface testing. Not real.' }: { children?: ReactNode }) => (
  <p className="inline-flex items-center gap-2 rounded-full bg-saffron-100 px-3 py-1 text-xs font-semibold text-saffron-700">
    <Icon name="info" size={14} /> {children}
  </p>
);

interface AsyncViewProps<T> {
  state: AsyncState<T>;
  onRetry: () => void;
  skeleton?: ReactNode;
  notFound?: ReactNode;
  children: (data: T) => ReactNode;
}

export function AsyncView<T>({ state, onRetry, skeleton, notFound, children }: AsyncViewProps<T>) {
  if (state.status === 'loading') return <>{skeleton ?? <Spinner />}</>;
  if (state.status === 'error') return state.notFound && notFound ? <>{notFound}</> : <ErrorState message={state.message} onRetry={onRetry} />;
  return <>{children(state.data)}</>;
}
