import type { ReactNode } from 'react';
import { Logo } from '@/components/layout/Logo';

export function AuthCard({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="container-page flex justify-center py-10 sm:py-16">
      <div className="card w-full max-w-md space-y-6 p-6 sm:p-8">
        <div><h1 className="text-3xl font-semibold">{title}</h1>{subtitle ? <p className="mt-1 text-sm text-ink-soft">{subtitle}</p> : null}</div>
        {children}
        {footer ? <div className="border-t border-line pt-4 text-center text-sm text-ink-soft">{footer}</div> : null}
      </div>
    </div>
  );
}

export function StandaloneAuth({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-4 py-10">
      <div className="mb-6"><Logo light /></div>
      <div className="w-full max-w-md rounded-2xl bg-cream p-6 shadow-2xl sm:p-8">{children}</div>
    </div>
  );
}
