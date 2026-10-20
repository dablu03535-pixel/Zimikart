# Avani Marketplace: Stage 1 frontend

Mobile-first multi-vendor marketplace UI built with **React + TypeScript + Vite + Tailwind CSS 3 + React Router**.
"Avani Marketplace" is a **provisional name**: change `VITE_BRAND_NAME` in `.env`.

> **This is a frontend prototype running on mock data.** There is no backend, database, authentication, payment, seller verification or settlement. Screens that would need those only validate input and say clearly that nothing was sent. Seller and admin routes are **not secured**.

## Setup on Termux (Android)

```bash
pkg update && pkg upgrade -y
pkg install -y nodejs-lts git unzip
cd ~
unzip avani-marketplace.zip && cd avani-marketplace   # or: git clone <your-repo-url> && cd <folder>
cp .env.example .env
npm install
npm run dev
```

Open <http://localhost:5173> in the Android browser (`--host` is already set, so other devices on your Wi-Fi can use the Network URL Vite prints).

Verify before deploying:

```bash
npm run typecheck   # tsc --noEmit (strict)
npm run lint        # eslint
npm run build       # typecheck + production build into dist/
npm run preview     # serve dist/ locally
npm run check       # typecheck + lint + build
```

If `npm install` fails on Termux with a native-module error (esbuild/rollup), copy the full error message; do not skip the failing package silently.

## Scripts
| Script | Purpose |
|---|---|
| `dev` | Vite dev server |
| `build` | `tsc --noEmit` then `vite build` |
| `preview` | Serve the build |
| `typecheck` | Strict TypeScript check |
| `lint` | ESLint (typescript-eslint + react-hooks) |
| `check` | All of the above |

## Architecture
- `src/config/routes.ts`: every URL in one place (`PATHS`, `to.*` builders). `App.tsx` uses only these.
- `src/types/models.ts`: typed domain models.
- `src/data/`: **mock data only**, kept out of components.
- `src/services/`: API abstraction. `http.ts` switches by `VITE_USE_MOCK_API`: `true` returns mock data; `false` calls `VITE_API_BASE_URL` with `fetch`. Unfinished actions (sign-in, register, reset, admin login) deliberately throw `NotConnectedError`; writes return `{ persisted: false }`.
- `src/hooks/`: `useAsync` (loading/error/retry), `useForm` (validation), `usePageTitle`.
- `src/context/CommerceContext.tsx`: cart and wishlist in this browser's `localStorage` (display snapshots; a backend must re-price).
- `src/components/`: `ui/` primitives, `layout/`, `product/`, `forms/`. `src/pages/`: route screens.

### Connecting the PHP REST API later
Set `VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL`. Paths the services already call (all JSON, cookies sent with `credentials: 'include'`):
`GET /categories`, `GET /products?q&category&minPrice&maxPrice&minRating&inStockOnly&sort`, `GET /products/{slug}` (returns `{product, seller, related}`), `GET /home`, `GET /serviceability/{pincode}`, `GET /account/orders`, `GET /account/orders/{id}`, `GET|POST /account/addresses`, `POST /checkout`, `POST /contact`, `/seller/*`, `/admin/*` (see `src/services/`). Auth endpoints are not wired; add them in `accountService` once the server defines them. Authorisation must be enforced server-side; hiding UI is not security.

## Implemented screens
Customer: home, shop (filters, sort, price range, rating, stock), category, search, product detail (gallery, variants, quantity, wishlist, pincode check, seller card, related), cart, checkout preview (address form, payment notice, honest result), wishlist, login, register, forgot password, account, addresses, orders, order detail.
Seller: registration, dashboard (stats, weekly chart, orders, inventory alerts, profile settings), products (search, inventory filters, add-product form), orders (status filter), earnings.
Admin: separate login layout, dashboard (stats, analytics placeholders, platform settings, commission configuration), seller approval queue, catalog moderation, order management.
Static: about, contact, FAQ, privacy, terms (drafts), custom 404 (also used for unknown products, categories and orders).

## Known limitations
- No backend, auth, payments, real order creation, seller verification, settlements or email. Forms validate client-side only.
- Seller/admin pages are open to anyone who knows the URL.
- Product imagery is generated SVG artwork, not photographs.
- Pincode serviceability is a mock rule (pincodes starting with 9 are "not deliverable").
- Cart/wishlist exist only in this browser; no cross-device sync.
- Privacy/terms are draft templates, not legal advice.
- No automated tests, no i18n, no SEO prerendering (client-rendered SPA).
- Static hosting needs a rewrite of all paths to `index.html` for deep links.
- **Status when generated:** written in an environment without network access, so `npm install`, `npm run build`, lint and a browser run were **not** executed. See "Verification" below.

## Verification
Written without network access. TypeScript was run (offline) over the whole source using loose stub types for React and the router, which found no unused symbols or logic-type errors; it could not check JSX prop types, ESLint, the Tailwind build or runtime behaviour. Run `npm run check` yourself and fix anything it reports.

## Security notes
No secrets belong in this repo. Every `VITE_*` variable is public in the built JavaScript. `.env` files are git-ignored; only `.env.example` (placeholders) is committed.

## File tree
```
.env.example
.gitignore
eslint.config.js
index.html
package.json
postcss.config.js
public/favicon.svg
src/App.tsx
src/components/forms/AddressForm.tsx
src/components/forms/AuthShell.tsx
src/components/layout/Logo.tsx
src/components/layout/PortalLayout.tsx
src/components/layout/SiteLayout.tsx
src/components/product/PincodeChecker.tsx
src/components/product/ProductCard.tsx
src/components/product/ProductListing.tsx
src/components/ui/Button.tsx
src/components/ui/Controls.tsx
src/components/ui/Display.tsx
src/components/ui/Feedback.tsx
src/components/ui/Fields.tsx
src/components/ui/Icon.tsx
src/components/ui/QuantityStepper.tsx
src/components/ui/Sheet.tsx
src/config/brand.ts
src/config/commerce.ts
src/config/routes.ts
src/context/CommerceContext.tsx
src/data/mockAccount.ts
src/data/mockCatalog.ts
src/hooks/useAsync.ts
src/hooks/useCategories.ts
src/hooks/useForm.ts
src/hooks/usePageTitle.ts
src/index.css
src/lib/format.ts
src/lib/validation.ts
src/main.tsx
src/pages/AuthPages.tsx
src/pages/CartPage.tsx
src/pages/HomePage.tsx
src/pages/ListingPages.tsx
src/pages/NotFoundPage.tsx
src/pages/ProductPage.tsx
src/pages/WishlistPage.tsx
src/pages/account/AccountPages.tsx
src/pages/admin/AdminPages.tsx
src/pages/info/InfoPages.tsx
src/pages/seller/SellerPages.tsx
src/services/accountService.ts
src/services/catalogService.ts
src/services/http.ts
src/services/portalService.ts
src/types/models.ts
src/vite-env.d.ts
tailwind.config.js
tsconfig.json
vite.config.ts
```
