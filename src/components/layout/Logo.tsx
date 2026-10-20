import { Link } from 'react-router-dom';
import { BRAND } from '@/config/brand';
import { PATHS } from '@/config/routes';

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to={PATHS.home} className="inline-flex items-center gap-2" aria-label={`${BRAND.name} home`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-saffron-400" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="22" height="22"><path d="M32 12 14 52h9l3-8h12l3 8h9L32 12Zm0 15 4 11h-8l4-11Z" fill="currentColor" /></svg>
      </span>
      <span className={`font-display text-xl font-bold tracking-tight ${light ? 'text-cream' : 'text-ink'}`}>{BRAND.name}</span>
    </Link>
  );
}
