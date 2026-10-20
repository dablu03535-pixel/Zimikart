import { Link, NavLink, Outlet } from 'react-router-dom';
import { PATHS } from '@/config/routes';
import { Alert } from '@/components/ui/Feedback';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Logo } from './Logo';

interface NavItem { to: string; label: string; icon: IconName }

const config = {
  seller: {
    title: 'Seller Centre',
    nav: [
      { to: PATHS.sellerDashboard, label: 'Dashboard', icon: 'chart' },
      { to: PATHS.sellerProducts, label: 'Products', icon: 'package' },
      { to: PATHS.sellerOrders, label: 'Orders', icon: 'truck' },
      { to: PATHS.sellerEarnings, label: 'Earnings', icon: 'wallet' },
    ] as NavItem[],
    notice: 'Seller screens are a UI preview with mock data. No sign-in exists yet, so anyone with the URL can open them. Nothing here is saved, verified or paid out.',
    bar: 'bg-peacock-700',
  },
  admin: {
    title: 'Admin Console',
    nav: [
      { to: PATHS.adminDashboard, label: 'Dashboard', icon: 'chart' },
      { to: PATHS.adminSellers, label: 'Sellers', icon: 'store' },
      { to: PATHS.adminProducts, label: 'Catalog', icon: 'package' },
      { to: PATHS.adminOrders, label: 'Orders', icon: 'truck' },
    ] as NavItem[],
    notice: 'Admin screens are a UI preview with mock data. They are NOT secured: there is no authentication or authorisation in Stage 1, and buttons only change what you see in this browser tab. Real access control must be enforced by the backend.',
    bar: 'bg-ink',
  },
} as const;

export function PortalLayout({ area }: { area: keyof typeof config }) {
  const c = config[area];
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-ink text-cream' : 'text-ink-soft hover:bg-cream-deep'}`;
  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only z-50 rounded-lg bg-white px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:left-2 focus:top-2">Skip to main content</a>
      <header className={`${c.bar} text-cream`}>
        <div className="container-page flex items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3"><Logo light /><span className="hidden rounded-full bg-white/15 px-3 py-1 text-xs font-semibold sm:inline">{c.title}</span></div>
          <Link to={PATHS.home} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10">View storefront</Link>
        </div>
      </header>
      <div className="container-page py-4 lg:grid lg:grid-cols-[220px_1fr] lg:gap-8 lg:py-8">
        <nav aria-label={`${c.title} navigation`} className="-mx-4 mb-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:mb-0 lg:flex-col lg:px-0">
          {c.nav.map((n) => (<NavLink key={n.to} to={n.to} className={linkCls}><Icon name={n.icon} size={18} />{n.label}</NavLink>))}
        </nav>
        <main id="main" tabIndex={-1} className="min-w-0 space-y-6 outline-none">
          <Alert tone="warning" title="Frontend preview only">{c.notice}</Alert>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AccountLayout() {
  const items: NavItem[] = [
    { to: PATHS.account, label: 'Overview', icon: 'user' },
    { to: PATHS.orders, label: 'Orders', icon: 'package' },
    { to: PATHS.addresses, label: 'Addresses', icon: 'pin' },
    { to: PATHS.wishlist, label: 'Wishlist', icon: 'heart' },
  ];
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-ink text-cream' : 'text-ink-soft hover:bg-cream-deep'}`;
  return (
    <div className="container-page py-6 lg:grid lg:grid-cols-[220px_1fr] lg:gap-8 lg:py-10">
      <nav aria-label="Account navigation" className="-mx-4 mb-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:mb-0 lg:flex-col lg:px-0">
        {items.map((n) => (<NavLink key={n.to} to={n.to} end className={linkCls}><Icon name={n.icon} size={18} />{n.label}</NavLink>))}
      </nav>
      <div className="min-w-0 space-y-6">
        <Alert tone="info" title="Sample account">Sign-in is not connected, so this page shows a fictional customer. Nothing you do here is saved to a server.</Alert>
        <Outlet />
      </div>
    </div>
  );
}
