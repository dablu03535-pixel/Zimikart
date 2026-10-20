import { PATHS } from '@/config/routes';
import { usePageTitle } from '@/hooks/usePageTitle';
import { ButtonLink } from '@/components/ui/Button';

export function NotFoundContent({ title = 'Page not found', message = 'The page you are looking for does not exist or has moved.' }: { title?: string; message?: string }) {
  return (
    <div className="container-page flex flex-col items-center py-20 text-center">
      <p className="font-display text-7xl font-bold text-saffron-500" aria-hidden="true">404</p>
      <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
      <p className="mt-2 max-w-md text-ink-soft">{message}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink to={PATHS.home}>Back to home</ButtonLink>
        <ButtonLink to={PATHS.shop} variant="outline">Browse the shop</ButtonLink>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  usePageTitle('Page not found');
  return <NotFoundContent />;
}
