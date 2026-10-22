import { Link } from 'react-router-dom';
import { BRAND } from '@/config/brand';
import { PATHS } from '@/config/routes';

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to={PATHS.home} className="inline-flex items-center gap-2" aria-label={`${BRAND.name} home`}>

      <span className={`font-display text-xl font-bold tracking-tight ${light ? 'text-cream' : 'text-ink'}`}>{BRAND.name}</span>
    </Link>
  );
}
