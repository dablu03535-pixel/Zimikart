import { useState, type FormEvent } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BRAND } from '@/config/brand';
import { PATHS, to } from '@/config/routes';
import { useCommerce } from '@/context/CommerceContext';
import { useAsync } from '@/hooks/useAsync';
import { catalogService } from '@/services/catalogService';
import type { Category } from '@/types/models';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Sheet } from '@/components/ui/Sheet';
import { Logo } from './Logo';

function CountBadge({ n }: { n: number }) {
  if (n <= 0) return null;
  return <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-terracotta-600 px-1 text-[11px] font-bold text-white" aria-hidden="true">{n > 99 ? '99+' : n}</span>;
}

function SearchBar({ className = '' }: { className?: string }) {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? to.search(q.trim()) : PATHS.search);
  };
  return (
    <form role="search" onSubmit={submit} className={`flex ${className}`}>
      <label htmlFor="site-search" className="sr-only">Search products</label>
      <input id="site-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search sarees, tea, brass…" className="min-h-[44px] w-full rounded-l-xl border border-r-0 border-ink/25 bg-white px-4 text-base sm:text-sm" />
      <button type="submit" className="flex min-h-[44px] items-center gap-2 rounded-r-xl bg-ink px-4 text-cream hover:bg-ink-soft" aria-label="Search">
        <Icon name="search" />
      </button>
    </form>
  );
}

function Header({ categories }: { categories: Category[] }) {
  const { cartCount, wishlist } = useCommerce();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const iconLink = 'relative flex h-11 w-11 items-center justify-center rounded-full hover:bg-cream-deep';
  const navLink = ({ isActive }: { isActive: boolean }) => `whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ${isActive ? 'bg-ink text-cream' : 'text-ink-soft hover:bg-cream-deep'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur">
      <p className="bg-ink px-4 py-1.5 text-center text-xs text-cream">Demo storefront: sample products only. No real orders or payments.</p>
      <div className="container-page">
        <div className="flex items-center gap-2 py-2 sm:gap-4">
          <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-cream-deep lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-haspopup="dialog">
            <Icon name="menu" />
          </button>
          <Logo />
          <SearchBar className="mx-auto hidden max-w-xl flex-1 md:flex" />
          <nav aria-label="Account and cart" className="ml-auto flex items-center">
            <Link to={PATHS.sellerRegister} className="mr-2 hidden rounded-full border border-ink/30 px-4 py-2 text-sm font-semibold hover:bg-cream-deep lg:inline-block">Sell on {BRAND.name.split(' ')[0]}</Link>
            <Link to={PATHS.wishlist} className={iconLink} aria-label={`Wishlist, ${wishlist.length} items`}><Icon name="heart" /><CountBadge n={wishlist.length} /></Link>
            <Link to={PATHS.cart} className={iconLink} aria-label={`Cart, ${cartCount} items`}><Icon name="cart" /><CountBadge n={cartCount} /></Link>
            <Link to={PATHS.account} className={`${iconLink} hidden sm:flex`} aria-label="Account"><Icon name="user" /></Link>
          </nav>
        </div>
        <SearchBar className="pb-2 md:hidden" />
        <nav aria-label="Categories" className="hidden gap-1 overflow-x-auto pb-2 lg:flex">
          <NavLink to={PATHS.shop} end className={navLink}>All products</NavLink>
          {categories.map((c) => (<NavLink key={c.id} to={to.category(c.slug)} className={navLink}>{c.name}</NavLink>))}
        </nav>
      </div>
      <Sheet open={menuOpen} onClose={closeMenu} title="Menu" side="left">
        <nav aria-label="Mobile menu" className="space-y-6 text-base">
          <ul className="space-y-1">
            <li><Link onClick={closeMenu} to={PATHS.shop} className="block rounded-lg px-3 py-2.5 font-semibold hover:bg-cream-deep">All products</Link></li>
            {categories.map((c) => (<li key={c.id}><Link onClick={closeMenu} to={to.category(c.slug)} className="block rounded-lg px-3 py-2.5 hover:bg-cream-deep">{c.name}</Link></li>))}
          </ul>
          <ul className="space-y-1 border-t border-line pt-4">
            {([['Sell with us', PATHS.sellerRegister], ['My account', PATHS.account], ['Help & FAQ', PATHS.faq], ['Contact', PATHS.contact]] as const).map(([label, href]) => (
              <li key={href}><Link onClick={closeMenu} to={href} className="block rounded-lg px-3 py-2.5 hover:bg-cream-deep">{label}</Link></li>
            ))}
          </ul>
        </nav>
      </Sheet>
    </header>
  );
}

function BottomNav() {
  const { cartCount, wishlist } = useCommerce();
  const items: { to: string; label: string; icon: IconName; count?: number; end?: boolean }[] = [
    { to: PATHS.home, label: 'Home', icon: 'home', end: true },
    { to: PATHS.shop, label: 'Shop', icon: 'grid' },
    { to: PATHS.wishlist, label: 'Wishlist', icon: 'heart', count: wishlist.length },
    { to: PATHS.cart, label: 'Cart', icon: 'cart', count: cartCount },
    { to: PATHS.account, label: 'Account', icon: 'user' },
  ];
  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      <ul className="grid grid-cols-5">
        {items.map((i) => (
          <li key={i.to}>
            <NavLink to={i.to} end={i.end ?? false} className={({ isActive }) => `flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${isActive ? 'text-ink' : 'text-ink-mute'}`}>
              {({ isActive }) => (
                <>
                  <span className="relative"><Icon name={i.icon} filled={isActive && i.icon === 'heart'} /><CountBadge n={i.count ?? 0} /></span>
                  {i.label}
                  {isActive ? <span className="sr-only"> (current page)</span> : null}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Footer({ categories }: { categories: Category[] }) {
  const col = 'space-y-2 text-sm text-cream/80';
  const link = 'hover:text-saffron-400 hover:underline';
  return (
    <footer className="mt-16 bg-ink pb-20 text-cream md:pb-0">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-3 text-sm text-cream/70">A Stage 1 frontend prototype of a multi-vendor marketplace. Products, sellers and prices are sample data.</p>
        </div>
        <div><h3 className="mb-3 font-semibold">Shop</h3><ul className={col}>{categories.slice(0, 5).map((c) => <li key={c.id}><Link className={link} to={to.category(c.slug)}>{c.name}</Link></li>)}<li><Link className={link} to={PATHS.shop}>All products</Link></li></ul></div>
        <div><h3 className="mb-3 font-semibold">Company</h3><ul className={col}>
          {([['About', PATHS.about], ['Contact', PATHS.contact], ['FAQ', PATHS.faq], ['Become a seller', PATHS.sellerRegister], ['Seller dashboard (preview)', PATHS.sellerDashboard]] as const).map(([l, h]) => <li key={h}><Link className={link} to={h}>{l}</Link></li>)}
        </ul></div>
        <div><h3 className="mb-3 font-semibold">Legal & admin</h3><ul className={col}>
          {([['Privacy policy', PATHS.privacy], ['Terms of use', PATHS.terms], ['Admin login (preview)', PATHS.adminLogin]] as const).map(([l, h]) => <li key={h}><Link className={link} to={h}>{l}</Link></li>)}
        </ul></div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-cream/60">© {new Date().getFullYear()} {BRAND.name} (provisional name). Demo only.</p>
    </footer>
  );
}

export function SiteLayout() {
  const { state } = useAsync(() => catalogService.getCategories(), []);
  const categories = state.status === 'success' ? state.data : [];
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only z-50 rounded-lg bg-white px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:left-2 focus:top-2">Skip to main content</a>
      <Header categories={categories} />
      <main id="main" tabIndex={-1} className="flex-1 pb-24 outline-none md:pb-0"><Outlet /></main>
      <Footer categories={categories} />
      <BottomNav />
    </div>
  );
}
