import { PATHS } from '@/config/routes';
import { useCommerce } from '@/context/CommerceContext';
import { useAsync } from '@/hooks/useAsync';
import { usePageTitle } from '@/hooks/usePageTitle';
import { catalogService } from '@/services/catalogService';
import { ButtonLink } from '@/components/ui/Button';
import { AsyncView, EmptyState } from '@/components/ui/Feedback';
import { ProductGrid } from '@/components/product/ProductCard';

export function WishlistPage() {
  usePageTitle('Wishlist');
  const { wishlist } = useCommerce();
  const { state, reload } = useAsync(() => catalogService.getProductsByIds(wishlist), []);
  return (
    <div className="container-page py-6 sm:py-10">
      <h1 className="mb-6 text-3xl font-semibold">Wishlist</h1>
      <AsyncView state={state} onRetry={reload} skeleton={<ProductGrid products={[]} loading />}>
        {(items) => {
          const shown = items.filter((p) => wishlist.includes(p.id));
          return shown.length ? <ProductGrid products={shown} /> : <EmptyState title="Nothing saved yet" message="Tap the heart on any product to keep it here. Your wishlist is saved on this device only." action={<ButtonLink to={PATHS.shop}>Browse products</ButtonLink>} />;
        }}
      </AsyncView>
    </div>
  );
}
