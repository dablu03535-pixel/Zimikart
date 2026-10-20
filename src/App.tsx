import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { PATHS } from '@/config/routes';
import { AccountLayout, PortalLayout } from '@/components/layout/PortalLayout';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { HomePage } from '@/pages/HomePage';
import { CategoryPage, SearchPage, ShopPage } from '@/pages/ListingPages';
import { ProductPage } from '@/pages/ProductPage';
import { CartPage } from '@/pages/CartPage';
import { WishlistPage } from '@/pages/WishlistPage';
import { AdminLoginPage, ForgotPasswordPage, LoginPage, RegisterPage } from '@/pages/AuthPages';
import { AccountHomePage, AddressesPage, OrderDetailPage, OrdersPage } from '@/pages/account/AccountPages';
import { SellerDashboardPage, SellerEarningsPage, SellerOrdersPage, SellerProductsPage, SellerRegisterPage } from '@/pages/seller/SellerPages';
import { AdminDashboardPage, AdminOrdersPage, AdminProductsPage, AdminSellersPage } from '@/pages/admin/AdminPages';
import { AboutPage, ContactPage, FaqPage, PrivacyPage, TermsPage } from '@/pages/info/InfoPages';
import { NotFoundPage } from '@/pages/NotFoundPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path={PATHS.home} element={<HomePage />} />
          <Route path={PATHS.shop} element={<ShopPage />} />
          <Route path={PATHS.category} element={<CategoryPage />} />
          <Route path={PATHS.search} element={<SearchPage />} />
          <Route path={PATHS.product} element={<ProductPage />} />
          <Route path={PATHS.cart} element={<CartPage />} />
          <Route path={PATHS.wishlist} element={<WishlistPage />} />
          <Route path={PATHS.login} element={<LoginPage />} />
          <Route path={PATHS.register} element={<RegisterPage />} />
          <Route path={PATHS.forgotPassword} element={<ForgotPasswordPage />} />
          <Route element={<AccountLayout />}>
            <Route path={PATHS.account} element={<AccountHomePage />} />
            <Route path={PATHS.addresses} element={<AddressesPage />} />
            <Route path={PATHS.orders} element={<OrdersPage />} />
            <Route path={PATHS.order} element={<OrderDetailPage />} />
          </Route>
          <Route path={PATHS.sellerRegister} element={<SellerRegisterPage />} />
          <Route path={PATHS.about} element={<AboutPage />} />
          <Route path={PATHS.contact} element={<ContactPage />} />
          <Route path={PATHS.faq} element={<FaqPage />} />
          <Route path={PATHS.privacy} element={<PrivacyPage />} />
          <Route path={PATHS.terms} element={<TermsPage />} />
        </Route>

        <Route element={<PortalLayout area="seller" />}>
          <Route path={PATHS.sellerDashboard} element={<SellerDashboardPage />} />
          <Route path={PATHS.sellerProducts} element={<SellerProductsPage />} />
          <Route path={PATHS.sellerOrders} element={<SellerOrdersPage />} />
          <Route path={PATHS.sellerEarnings} element={<SellerEarningsPage />} />
        </Route>

        <Route path={PATHS.adminLogin} element={<AdminLoginPage />} />
        <Route element={<PortalLayout area="admin" />}>
          <Route path={PATHS.adminDashboard} element={<AdminDashboardPage />} />
          <Route path={PATHS.adminSellers} element={<AdminSellersPage />} />
          <Route path={PATHS.adminProducts} element={<AdminProductsPage />} />
          <Route path={PATHS.adminOrders} element={<AdminOrdersPage />} />
        </Route>

        <Route element={<SiteLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
