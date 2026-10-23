# Zimikart: Launch Checklist

**Status:** Stage 1 documentation. **Every box is unchecked.** Nothing on this list has been done or verified.
**Rule:** a box may be ticked only with recorded evidence (output, screenshot or document) stored by the owner. "Required" items block launch. "Optional" items are recommendations.

## A. Decisions (see `decisions.md`)

- [ ] Required: Hostnames confirmed and DNS control verified (N-1) - OPEN
- [ ] Required: API exposure model chosen after hosting verification (N-2) - OPEN
- [ ] Required: Hosting capabilities verified and recorded (N-3, `hosting-verification.md`) - UNCONFIRMED
- [ ] Required: Razorpay account active and Route eligibility confirmed in writing, or an alternative settlement model chosen (N-4b) - UNCONFIRMED
- [ ] Required: COD policy decided, or COD excluded from launch (N-4c) - OPEN
- [ ] Required: Seller shipping models and logistics partner decided (N-6a) - OPEN
- [ ] Required: Commission, settlement schedule, seller KYC fields and tax handling decided with an adviser (N-6b to N-6e) - OPEN
- [ ] Required: Email provider chosen; SPF, DKIM and DMARC configured (N-7b) - OPEN
- [ ] Required if mobile OTP is launched: SMS provider chosen and India DLT registration completed (N-7c) - OPEN
- [ ] Required: Legacy `avani` key and `AV-` prefix decision made (N-9b) - OPEN
- [ ] Required: Retention periods, backup provider and off-site location decided (N-10b, N-12) - OPEN

## B. Legal and policy (all content must come from the owner's legal reviewer)

- [ ] Required: Privacy policy reviewed and approved by counsel - NOT APPROVED
- [ ] Required: Terms of use approved - NOT APPROVED
- [ ] Required: Refund/return policy approved - NOT APPROVED
- [ ] Required: Cancellation policy approved - NOT APPROVED
- [ ] Required: Seller agreement approved - NOT APPROVED
- [ ] Required: Placeholder "demo" wording removed from About, FAQ, Privacy and Terms pages (requires UI approval) - NOT STARTED
- [ ] Required: Data-subject request process defined (access, correction, deletion) - OPEN

## C. Authentication and authorization

- [ ] Required: Server-side authentication on every protected endpoint (F-01)
- [ ] Required: Server-side role, permission and ownership checks on every protected operation (F-02, F-03)
- [ ] Required: Authorization matrix test passing in CI (`T-RBAC-MATRIX`)
- [ ] Required: Admin and seller-owner MFA enforced (F-05)
- [ ] Required: Admin created only through owner-only provisioning; no public admin-registration route exists (verified by test)
- [ ] Required: Password hashing with PHP's password-hashing API
- [ ] Required: Secure, HttpOnly, SameSite cookies; session rotation on login
- [ ] Required: CSRF protection and exact-origin CORS (F-07)
- [ ] Required: Rate limits on login, recovery, OTP, MFA, contact and checkout (F-08)
- [ ] Required: Guest checkout disabled and tested (N-8)
- [ ] Optional: Breached-password checking
- [ ] Optional: Extra access control (for example IP allowlist) for the admin host

## D. Data isolation and privacy

- [ ] Required: Seller tenant isolation tests passing (F-09)
- [ ] Required: Customer order privacy tests passing (F-09)
- [ ] Required: Sellers see only the customer data needed to ship their own items
- [ ] Required: Personal data minimised; no unnecessary KYC or sensitive data collected
- [ ] Required: Logs contain no passwords, tokens, OTPs, card data or full personal data

## E. Payments

- [ ] Required: Server-side pricing, tax and shipping; client prices ignored (F-06)
- [ ] Required: Idempotent checkout and stock reservation tested
- [ ] Required: Webhook signature verification, replay protection and amount checks tested (F-04)
- [ ] Required: Gateway in test mode verified end to end before any live step
- [ ] Required: Live credentials entered only by the owner, only on the server, never in the repository or frontend, and only after separate explicit authorisation
- [ ] Required if COD launches: COD limits, reconciliation and remittance process tested

## F. Application security

- [ ] Required: Prepared statements only; server-side validation for every endpoint (F-16)
- [ ] Required: Generic public errors with private diagnostics (F-11)
- [ ] Required: Production build refuses mock mode (F-10)
- [ ] Required: Security headers and CSP verified on each host (F-12)
- [ ] Required: Upload controls verified, if uploads launch (F-18)
- [ ] Required: Audit log written for every privileged action (T-18)
- [ ] Required: Dependency audits run and results reviewed (F-15) - UNCONFIRMED, none run so far
- [ ] Required: Secret scans of repository history, built bundle and server responses clean (including the Git history review, N-13)
- [ ] Optional: Third-party penetration test before opening seller registration
- [ ] Optional: Web application firewall or CDN

## G. Infrastructure and operations

- [ ] Required: HTTPS certificates valid for every host; HTTP redirects to HTTPS; HSTS enabled after verification
- [ ] Required: PHP 8.2+ with needed extensions confirmed on the host
- [ ] Required: Restricted database user for the application; separate migration user
- [ ] Required: Secrets stored outside the web root and outside Git
- [ ] Required: Direct-URL probes for `.env`, `.git`, backend source and storage directories return no content
- [ ] Required: Automated backups, off-site copy, and a **tested restore**
- [ ] Required: Logging and error monitoring with alerting
- [ ] Required: Written rollback plan, rehearsed
- [ ] Required: Cron jobs configured, if the host supports them (UNCONFIRMED)
- [ ] Optional: Staging environment mirroring production

## H. Quality gates

- [ ] Required: CI pipeline runs typecheck, lint, build and test suites on every change
- [ ] Required: Owner reviewed every changed screen against the current storefront design (R-1)
- [ ] Required: Every closed finding has a recorded passing test in `finding-to-test-map.md`
- [ ] Required: Owner sign-off on the final go-live decision

## Sign-off

| Role | Name | Date | Signature or evidence link |
|---|---|---|---|
| Owner | OPEN | OPEN | OPEN |
| Legal reviewer | OPEN | OPEN | OPEN |
| Technical reviewer | OPEN | OPEN | OPEN |
