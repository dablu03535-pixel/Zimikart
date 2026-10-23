# Zimikart: Threat Model

**Status:** Stage 1 documentation. Describes the current prototype and the threats the future system must address. Nothing is implemented.
**Basis:** security audit of `Zimikart-main.zip` (23 October 2026). Evidence references are to files in that ZIP.
**Limit:** no Git history, tests, CI, deployment files or backend existed in the ZIP. No build, lint, test or dependency audit was run during the audit.

## 1. Current state (verified from the code)

- The project is a React + TypeScript + Vite single-page frontend running on bundled sample data.
- No backend, database, authentication, payment or audit logging exists.
- Seller and admin routes have no guard (`src/App.tsx`, `PortalLayout.tsx`).
- The only persisted data is the visitor's cart and wishlist in browser `localStorage` (`src/context/CommerceContext.tsx`).
- No XSS sinks and no secrets were found in `src/` by search.

Threats in section 5 therefore describe what the **future** system must resist. Today the prototype holds no real data.

## 2. Assets (future system)

| Asset | Why it matters |
|---|---|
| Customer identity, contact and addresses | Personal data; privacy and legal exposure. |
| Order history and payment status | Privacy; fraud; financial records. |
| Seller business data, KYC references, payout references | Sensitive; tenant isolation required. |
| Admin accounts and sessions | Full platform control. |
| Product, price, inventory and commission data | Revenue integrity. |
| Payment gateway keys and webhook secret | Direct financial impact if leaked. |
| Database credentials and encryption keys | Full data exposure if leaked. |
| Audit logs | Evidence for investigations; must not be alterable. |
| Backups | Contain all of the above. |

## 3. Actors

| Actor | Trust level |
|---|---|
| Anonymous visitor | Untrusted |
| Customer | Authenticated, low privilege, owns only their own data |
| Seller (approved) | Authenticated, owns only their own tenant data |
| Seller applicant (pending) | Authenticated, no seller privileges |
| Admin (with named permissions) | Highest privilege; MFA required |
| Payment gateway | Trusted only via verified signatures |
| Logistics partner (platform-managed) | OPEN: integration not defined |
| Email and SMS providers | Third parties; receive minimal data |
| Attacker (external, or a malicious customer or seller) | Assumed hostile |

## 4. Trust boundaries and entry points

Boundaries (proposed, not implemented): browser to portal host; portal host to PHP API; API to database; API to payment gateway; gateway to webhook endpoint; API to email and SMS providers; server to private file storage.

Entry points: public catalog endpoints; authentication and recovery endpoints; mobile OTP endpoints; customer, seller and admin APIs; the payment webhook; the contact form; file uploads (seller images and documents); URL parameters such as search queries.

## 5. Threats and required controls

Finding IDs refer to the audit report. Test names are in `finding-to-test-map.md`. Status of every control below: **NOT IMPLEMENTED**.

| ID | Threat | Related findings | Required controls (proposed) |
|---|---|---|---|
| T-01 | Unauthenticated access to protected data or actions | F-01, F-02, F-03 | Server-side authentication on every protected endpoint; deny by default. |
| T-02 | Privilege escalation (customer to seller or admin; role set by request field) | F-02, F-03, F-05 | Role assigned only server-side; central policy layer; admin created only by owner-only provisioning; MFA for privileged roles. |
| T-03 | Cross-tenant access (seller A reads seller B) and customer IDOR/BOLA | F-09 | Ownership derived from session; every query scoped; 404 for non-owned objects; seller sub-orders; minimal customer data to sellers. |
| T-04 | Credential attacks (brute force, stuffing, reset abuse, OTP guessing) | F-08 | Rate limits and lockout; generic errors; hashed single-use tokens; OTP attempt caps; per-number and per-IP SMS limits. |
| T-05 | SMS cost abuse through OTP endpoint | F-08 | Daily caps per number and IP; cooldowns; monitoring and alerts. |
| T-06 | Session theft or fixation | F-01 | Secure, HttpOnly, SameSite cookies; session ID rotation; server-side session records; short admin lifetimes; no tokens in `localStorage`. |
| T-07 | CSRF against cookie-authenticated requests | F-07 | SameSite, Origin checks, per-session CSRF token header, strict CORS allowlist. |
| T-08 | Price, quantity or total tampering | F-06 | Server re-prices every line; client price fields ignored; quantity bounds; stock checks under row locks. |
| T-09 | Overselling and race conditions | F-06 | Transactions with row locks on inventory; idempotent checkout. |
| T-10 | Forged, replayed or altered payment webhooks | F-04 | Signature verification over raw body; timestamp tolerance; unique event ID; amount and currency checks; idempotent processing. |
| T-11 | COD abuse and cash reconciliation errors | F-04 | OPEN: COD policy undecided. Separate ledger design required once policy is decided. |
| T-12 | Injection (SQL, stored XSS in descriptions or reviews) | F-16, F-18 | Prepared statements only; allowlist validation; plain-text output escaped; no HTML from sellers. |
| T-13 | Malicious file uploads | F-18 | Content-type sniffing, size caps, re-encoding, random names, non-executable storage, no seller SVG. |
| T-14 | Secret leakage (repo, bundle, logs, error bodies, web-reachable files) | F-10, F-11, F-12 | Secrets outside web root and git; generic errors; log redaction; build and probe checks. |
| T-15 | Unsafe configuration (mock mode shipped to production) | F-10 | Production build refuses mock mode; visible mock banner. |
| T-16 | Missing headers, HTTP downgrade, framing | F-12 | HTTPS everywhere, HSTS, CSP, frame restrictions. |
| T-17 | Vulnerable dependencies | F-15 | Lockfile committed; scheduled audits. **Status UNCONFIRMED: no audit was run.** |
| T-18 | Insider or compromised admin actions go unnoticed | F-05 | Audit log for every privileged write; step-up MFA for settings and refunds; append-only log table. |
| T-19 | Data loss or ransomware | Backups | Automated backups, off-site copy, tested restore. Provider and location OPEN. |
| T-20 | Excess personal data collection | F-14 | Data minimisation; retention periods (OPEN); lawyer-reviewed policies. |
| T-21 | Regressions reintroduce vulnerabilities | F-13 | Authorization matrix and security tests in CI. |

## 6. Assumptions (all UNCONFIRMED)

- A-1: All three portals will be hosted under one hosting account sharing one database. UNCONFIRMED.
- A-2: Code and secrets can be stored outside the public document root. UNCONFIRMED.
- A-3: SSH or equivalent command-line access exists for migrations and admin provisioning. UNCONFIRMED.
- A-4: Cron jobs are available. UNCONFIRMED.
- A-5: Razorpay Route can be enabled for this business and sellers can be onboarded as linked accounts. UNCONFIRMED.
- A-6: Outbound HTTPS from the server to the gateway, email and SMS providers is permitted. UNCONFIRMED.

## 7. Out of scope for this document

Legal policy text (see `legal-requirements-draft.md`, not approved), final payment-provider contract terms, penetration-test results (none exist), and physical security.

## 8. Review

This model must be revised when decisions in `decisions.md` change, and before each implementation stage begins.
