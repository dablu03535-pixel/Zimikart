# Zimikart: Finding-to-Stage-to-Test Map

**Status:** Stage 1 documentation. Every test named below is **proposed, not yet written, and not run.**
**Source:** security audit of `Zimikart-main.zip`, 23 October 2026.

**Result column key:** `NOT WRITTEN / NOT RUN` means the test does not exist and no result is available. Results may only be recorded here after the test has actually been executed, with the command and date.

## Mapping

| Finding | Severity | Type | Stage(s) | Proposed tests | Result |
|---|---|---|---|---|---|
| F-01 No authentication or session management | Critical | Missing | 4 | `T-AUTH-401-ALL`, `T-SESSION-ROTATE`, `T-LOGOUT-INVALIDATES` | NOT WRITTEN / NOT RUN |
| F-02 Seller and admin portals reachable by anyone | Critical | Confirmed | 4, 6, 9 | `T-RBAC-MATRIX`, `T-HOST-BINDING` | NOT WRITTEN / NOT RUN |
| F-03 No server-side authorization or backend | Critical | Missing | 2-9, CI in 11 | `T-RBAC-MATRIX` (in CI) | NOT WRITTEN / NOT RUN |
| F-04 No payment, order creation or webhook handling | High | Missing | 8 | `T-WEBHOOK-SIGNATURE`, `T-WEBHOOK-REPLAY`, `T-AMOUNT-MISMATCH`, `T-CHECKOUT-IDEMPOTENT`, `T-COD-LIMITS`, `T-CHECKOUT-REQUIRES-AUTH` | NOT WRITTEN / NOT RUN |
| F-05 No secure admin provisioning, MFA or recovery | High | Missing | 4, 9 | `T-ADMIN-NO-PUBLIC-CREATE`, `T-ADMIN-MFA-REQUIRED`, `T-STEPUP-MFA` | NOT WRITTEN / NOT RUN |
| F-06 Client-held prices and quantities | High | Potential | 8 | `T-PRICE-TAMPER`, `T-STOCK-RACE`, `T-QTY-BOUNDS` | NOT WRITTEN / NOT RUN |
| F-07 Cookie auth planned without CSRF protection | High | Potential | 4, 11 | `T-CSRF-NO-TOKEN`, `T-CSRF-BAD-ORIGIN`, `T-CORS-ALLOWLIST` | NOT WRITTEN / NOT RUN |
| F-08 No rate limiting or brute-force protection | High | Missing | 4, 10; tuned in 11 | `T-RATE-LOGIN`, `T-RATE-RESET`, `T-RATE-OTP`, `T-RATE-SMS-COST` | NOT WRITTEN / NOT RUN |
| F-09 No tenant isolation or ownership model | Medium | Confirmed in mock; potential if copied | 5, 6 | `T-IDOR-ORDER`, `T-IDOR-ADDRESS`, `T-TENANT-PRODUCT`, `T-TENANT-ORDER`, `T-SELLER-PII-MINIMAL` | NOT WRITTEN / NOT RUN |
| F-10 Unsafe default: silent fallback to mock mode | Medium | Confirmed | 2, 12 | `T-BUILD-FAILS-MOCK-IN-PROD`, `T-MOCK-BANNER` | NOT WRITTEN / NOT RUN |
| F-11 Raw error text can reach users | Medium | Potential | 2 | `T-ERR-GENERIC-500`, `T-ERR-NONJSON-UI` | NOT WRITTEN / NOT RUN |
| F-12 No security headers, CSP or deployment config | Medium | Missing | 2, 11, 12 | `T-HEADERS-SCAN`, `T-DOCROOT-PROBE` | NOT WRITTEN / NOT RUN |
| F-13 No automated tests or CI | Medium | Confirmed | 1 (plan), 2, 11 | `T-CI-GREEN-ON-PR` | NOT WRITTEN / NOT RUN |
| F-14 Privacy and legal content is placeholder | Medium | Confirmed | 1 (requirements), 10, 12 | Manual gate: lawyer-approved policies before launch (not an automated test) | NOT STARTED (legal review OPEN) |
| F-15 Dependency vulnerability status unverified | Low | Potential | 2, 11 | `T-NPM-AUDIT`, `T-COMPOSER-AUDIT` | NOT WRITTEN / NOT RUN |
| F-16 Partial payloads and client-only validation | Low | Confirmed | 4-10 | `T-INPUT-INVALID` (one per endpoint) | NOT WRITTEN / NOT RUN |
| F-17 Dev server exposed to the LAN (`--host`) | Low | Confirmed (dev only) | 2 | Configuration review. Changing `package.json` needs separate approval. | NOT STARTED |
| F-18 Uploads not yet supported | Low | Missing | 7 | `T-UPLOAD-DISGUISED`, `T-UPLOAD-SIZE`, `T-UPLOAD-SVG` | NOT WRITTEN / NOT RUN |

## Additional tests from owner decisions

| Source | Stage | Proposed test | Result |
|---|---|---|---|
| N-8 Guest checkout disabled | 8 | `T-CHECKOUT-REQUIRES-AUTH` (also listed under F-04) | NOT WRITTEN / NOT RUN |
| N-7 Mobile OTP | 4 | `T-OTP-EXPIRY`, `T-OTP-ATTEMPT-LIMIT`, `T-OTP-SINGLE-USE` | NOT WRITTEN / NOT RUN |
| N-9b Legacy key migration | (after approval) | See `avani-migration-plan.md` | NOT WRITTEN / NOT RUN |
| Secret leakage | 2, 11, 12 | `T-SECRET-SCAN-REPO`, `T-SECRET-SCAN-BUNDLE`, `T-SECRET-ERROR-BODIES` | NOT WRITTEN / NOT RUN |
| Design preservation (R-1) | all UI stages | `T-UI-REVIEW`: owner reviews screens against the current storefront before sign-off | NOT STARTED |

## Verification commands

### Existing today (from `package.json`)

```
npm ci
npm run typecheck
npm run lint
npm run build
npm run check
npm audit --omit=dev      # needs network access
```

**None of these has been run as part of this work.** The README states they were not run when the project was generated. Results are UNCONFIRMED until the owner (or an approved later step) runs them and records output.

### Proposed, after implementation stages

```
composer validate && composer audit
php -l <each backend PHP file>
vendor/bin/phpstan analyse
vendor/bin/phpunit
```

None of these exists yet. No PHP project is present.

## Recording results

For each executed test, add: date, command, environment (local, staging), commit identifier, pass/fail, and a link to the output. Do not mark a finding closed without a recorded passing result.
