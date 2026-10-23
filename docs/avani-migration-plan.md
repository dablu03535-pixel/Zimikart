# Zimikart: Legacy "avani" Key and "AV-" Order Prefix Migration Plan

**Status:** Stage 1 documentation. **Proposal only. Nothing is migrated or changed.** The decision is **OPEN** (decision N-9b in `decisions.md`).
**Evidence date:** 23 October 2026.

## 1. Every dependency found

A case-insensitive search of the entire extracted project (all files outside `node_modules`, which the ZIP did not contain) for `avani` and `AV-` found exactly these references and no others:

| # | File | Line | Reference | Nature |
|---|---|---|---|---|
| 1 | `src/context/CommerceContext.tsx` | 8 | `CART_KEY = 'avani.cart.v1'` | Browser `localStorage` key for the cart |
| 2 | `src/context/CommerceContext.tsx` | 9 | `WISH_KEY = 'avani.wishlist.v1'` | Browser `localStorage` key for the wishlist |
| 3 | `src/context/CommerceContext.tsx` | 72, 73 | `load(CART_KEY, ...)`, `load(WISH_KEY, ...)` | Reads on startup |
| 4 | `src/context/CommerceContext.tsx` | 78, 79 | `setItem(CART_KEY, ...)`, `setItem(WISH_KEY, ...)` | Writes on every change |
| 5 | `src/data/mockAccount.ts` | 15-19 | Five sample orders with IDs `AV-1001` to `AV-1005` | Mock data only |

Not found: no `avani` or `AV-` in the README, `index.html`, `package.json`, configuration, services, routes or other pages. Re-run the same search on the full repository (including any Git history the owner provides, N-13) before implementing, in case other branches differ.

## 2. What is affected

- **Storage keys (items 1-4):** real browser state. A returning visitor's cart and wishlist are stored under the old keys. Renaming the keys without migration would silently empty their cart and wishlist. The data contains product snapshots (name, price, slug), no personal data and no credentials.
- **Order IDs (item 5):** sample data only. No real orders exist, so no real order number would change. Real order numbers will be created by the server in a later stage.
- **Other dependants:** the order ID is displayed on order pages and used in the order-detail URL, but because it is sample data nothing persisted depends on it. No other file references the keys.

## 3. Open decisions (owner)

| ID | Question | Status |
|---|---|---|
| M-1 | New storage-key prefix (for example one derived from the brand name) | OPEN |
| M-2 | New order-number prefix and format for real orders | OPEN |
| M-3 | Migrate old browser data, or let old carts expire? | OPEN. Recommendation below is a proposal only. |
| M-4 | Should sample order IDs be renamed in mock data before the backend exists? | OPEN. They are scheduled to be replaced by real data anyway. |
| M-5 | How long to keep reading the old key (one release, or a fixed period)? | OPEN |

Placeholders `<NEW_PREFIX>` and `<ORDER_PREFIX>` are used below because no choice has been made.

## 4. Proposed migration approach (not approved, not implemented)

**Storage keys**

1. Introduce new versioned keys such as `<NEW_PREFIX>.cart.v2` and `<NEW_PREFIX>.wishlist.v2`.
2. On startup, read the new key first. If it is absent, read the old key.
3. If old data exists, **validate it strictly** (shape of every field, numeric `unitPrice`, `maxQuantity` and `quantity` within bounds). Discard invalid entries. The audit noted the current loader checks only `key` and `quantity`.
4. Write the validated data to the new key.
5. Keep the old key untouched for the agreed period (M-5) so a rollback loses nothing, then remove it in a later release.
6. Treat migrated prices as display hints only. The server must re-price every line at checkout (finding F-06). Nothing about the migration may be trusted by the backend.
7. Wrap storage access in `try/catch` (private mode and blocked storage must not break the app).

**Order numbers**

1. Do not rename mock IDs unless the owner asks (M-4).
2. When the backend exists, real order numbers use `<ORDER_PREFIX>` and are generated server-side. Customers see a public order number, not a database ID.
3. Routes such as the order-detail URL keep working because only mock IDs ever existed.

**Three-build note (N-9a)**

If the frontend is split into customer, seller and admin builds, the cart keys belong only to the customer build. `localStorage` is per host, so cart data on `www` is not visible on `seller` or `admin`.

**Guest checkout note (N-8)**

Because guest checkout is disabled, a signed-out visitor's local cart must be kept and then merged after sign-in. The merge behaviour is a separate UI/behaviour decision awaiting approval (see "UI changes awaiting approval" in `decisions.md`).

## 5. Risks

| Risk | Mitigation |
|---|---|
| Visitors lose carts or wishlists | Read old key as fallback; keep it during the agreed period |
| Corrupt or tampered old data | Strict validation; discard bad entries |
| Duplicate items after merge | De-duplicate by product and variant key |
| Storage unavailable | Guarded access with in-memory fallback |
| Another file silently depends on the key | Re-run the search on the full repository before changing anything |

## 6. Proposed tests (not written, not run)

- Old key present, new key absent: items appear and are copied to the new key.
- Both present: the new key wins.
- Invalid or oversized old data: discarded without error.
- Storage blocked: app still loads.
- Cart and wishlist behaviour matches the current screens (design preserved, R-1).
- A search confirms no remaining `avani` references except the deliberate fallback read.

## 7. Rollback

Because the old key is kept untouched during the agreed period, reverting to the previous release restores all visitor data. Removal of the old key happens only in a later, separately approved release.

## 8. Approval needed before any change

Any edit to `src/context/CommerceContext.tsx` or `src/data/mockAccount.ts` requires a separate, explicit owner approval after M-1 to M-5 are decided.
