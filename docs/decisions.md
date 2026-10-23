# Zimikart: Decision Log

**Status of this document:** Stage 1 documentation. Nothing here is implemented.
**Created:** 23 October 2026, from the security audit of `Zimikart-main.zip` and the owner's preliminary answers.

## Status vocabulary

| Status | Meaning |
|---|---|
| **DECIDED** | Owner has stated it as a decision. |
| **PRELIMINARY** | Owner's current preference. Not final. May change. |
| **OPEN** | No decision yet. Information is needed. |
| **UNCONFIRMED** | A fact (capability, eligibility, configuration) that has not been verified. Nothing may be assumed. |

## Fixed project requirements

| ID | Requirement | Status |
|---|---|---|
| R-1 | Preserve the existing Zimikart storefront design and behaviour. No screen is redesigned or replaced without explicit owner approval. Any required UI change is listed and approved first (see "UI changes awaiting approval"). | DECIDED |
| R-2 | Stack: existing React + TypeScript + Vite frontend, PHP 8.2+ REST API, MySQL/MariaDB, no WordPress. | DECIDED (hosting support for PHP 8.2+ is UNCONFIRMED, see H-3) |
| R-3 | No secrets or privileged credentials in frontend code or in the repository. | DECIDED |
| R-4 | No public administrator-registration endpoint. Admin creation is owner-only, outside HTTP. | DECIDED |
| R-5 | No live payment credentials are added at any point in development. | DECIDED |
| R-6 | No test, build, scan or deployment check is reported as passed unless it was actually run and the result is available. | DECIDED |
| R-7 | No production business policy (commission, settlement, KYC, tax, retention) is invented. Items stay OPEN until the owner provides them. | DECIDED |

## Decisions

### Hosts and architecture

| ID | Topic | Status | Current position | Information needed from owner |
|---|---|---|---|---|
| N-1 | Hostnames | PRELIMINARY | `www.zimikart.com` (customer), `seller.zimikart.com`, `admin.zimikart.com`. Planned, not confirmed. | Who controls DNS; whether the three subdomains can be created; domain and hosting verification. |
| N-2 | API exposure | PRELIMINARY | Per-portal same-origin `/api/v1` with a shared backend where practical. | Result of the hosting checks in `hosting-verification.md`. If code above the web root cannot be shared across the three roots, the fallback options must be chosen. |
| N-3 | Hostinger plan and capabilities | UNCONFIRMED | None assumed. | Plan name, PHP versions, SSH, cron, Composer, document-root layout, ability to store code and secrets outside the web root, database version, backups. See `hosting-verification.md`. |
| N-9a | Frontend structure | PRELIMINARY | Three separate builds (customer, seller, admin) sharing components where appropriate. | Confirmation after UI-change list is reviewed. |
| N-9b | Legacy `avani` storage keys and `AV-` order prefix | OPEN | Dependencies identified; migration plan drafted in `avani-migration-plan.md`. | New storage-key name; new order-number prefix; whether to migrate or drop old keys. |

### Payments

| ID | Topic | Status | Current position | Information needed from owner |
|---|---|---|---|---|
| N-4a | Payment gateway | PRELIMINARY | Razorpay is the preferred initial gateway. | Business entity type; whether a Razorpay account exists and is activated. |
| N-4b | Razorpay Route (marketplace split and seller settlement) | UNCONFIRMED | Eligibility, enablement, seller KYC and settlement terms for this business have **not** been confirmed. | Written confirmation from Razorpay of Route eligibility, linked-account KYC requirements and settlement timing for Zimikart. |
| N-4c | Cash on Delivery | PRELIMINARY | Configurable option wanted. | Who collects cash (seller or courier); order-value cap; eligible pincodes; any COD fee; cash remittance and reconciliation process. COD cash does not pass through the gateway, so its commission and seller remittance need a separate ledger design (OPEN). |
| N-4d | Live credentials | DECIDED | None are added. Test mode only until the owner separately authorises otherwise. | None. |

### Accounts and sign-in

| ID | Topic | Status | Current position | Information needed from owner |
|---|---|---|---|---|
| N-5a | Owner and first-admin details | OPEN | To be decided later. | Owner identity for the first admin account (provided outside chat and outside the repository). |
| N-5b | Admin and privileged MFA | PRELIMINARY | Authenticator-app (TOTP) MFA. | Final choice and recovery-code handling policy. |
| N-5c | Admin creation | DECIDED | Never a public endpoint. Owner-only provisioning outside HTTP. Whether this needs SSH is tied to N-3 (UNCONFIRMED). | None. |
| N-7a | Customer login methods | PRELIMINARY | Email/password plus a mobile OTP option. | Confirmation. |
| N-7b | Email provider | OPEN | Transactional email needed (verification, reset, order mail). | Provider choice; ability to publish SPF, DKIM and DMARC records for the domain. |
| N-7c | SMS provider for OTP | OPEN | Needed only for mobile OTP. | Provider choice. Sending SMS in India involves DLT registration (entity, sender ID, templates). Whether and when this is registered is UNCONFIRMED. |
| N-8 | Guest checkout | DECIDED | Disabled. Customers must sign in before placing an order. | None. |

### Sellers

| ID | Topic | Status | Current position | Information needed from owner |
|---|---|---|---|---|
| N-6a | Shipping model | PRELIMINARY | Support both seller-managed shipping and platform-managed logistics. | Which sellers or products use which model; logistics partner for platform-managed (OPEN). |
| N-6b | Commission rates and rules | OPEN | The admin screen shows sample values only (12%, category overrides). These are mock data, not policy. | Commission policy. |
| N-6c | Settlement schedule | OPEN | Mock payout periods in the UI are samples, not policy. | Schedule and hold rules. |
| N-6d | Seller KYC data | OPEN | Collect the minimum necessary. Do not collect more than needed. | Exact fields required by law, by Razorpay (if Route is used) and by the business. |
| N-6e | Tax handling (GST, TCS and similar) | OPEN | Not defined. | Guidance from the owner's accountant or tax adviser. |

### Legal, data and operations

| ID | Topic | Status | Current position | Information needed from owner |
|---|---|---|---|---|
| N-10a | Privacy policy, terms, refund/return, cancellation, seller agreement | OPEN | Requirement outlines drafted for review only in `legal-requirements-draft.md`. **Not approved policy.** | Name of the legal reviewer; business facts the documents depend on. |
| N-10b | Data-retention periods | OPEN | None chosen. | Retention periods per data type, as advised by legal counsel. |
| N-11 | Return window, refund timing, cancellation rules | OPEN | None chosen. | Business policy decisions. |
| N-12a | Backup provider | OPEN | None chosen. | Provider or method. |
| N-12b | Off-site backup location | OPEN | None chosen. | Location and access arrangements. |
| N-13 | Git history review | OPEN | The ZIP contained no Git history. | Owner supplies a repository export (for example a `git bundle`) or read-only access. **Never send secrets or credentials in chat.** |

## UI changes awaiting approval

None of these is approved or started. They are listed because the owner's decisions imply them. Each needs explicit approval before any change.

1. Remove the storefront footer links to "Seller dashboard (preview)" and "Admin login (preview)" (`src/components/layout/SiteLayout.tsx`, lines 125 and 128 at the time of audit).
2. Point "Become a seller" and "View storefront" links to absolute portal URLs once the hosts are confirmed.
3. Move the seller registration page into the seller build.
4. Add a sign-in requirement before checkout (guest checkout disabled) and define how a signed-out visitor's local cart is kept or merged after sign-in.
5. Remove the "Sample account" notice and the "Frontend preview only" notices when real accounts and server enforcement exist.
6. Add a visible state for COD vs online payment at checkout, only if COD is approved.

## Change log

| Date | Change |
|---|---|
| 23 Oct 2026 | Initial version created in Stage 1 from the audit and the owner's preliminary answers. |
