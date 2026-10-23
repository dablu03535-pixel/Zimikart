# DRAFT FOR LEGAL REVIEW — NOT APPROVED POLICY

**This document is not legal advice, not a legal policy and not approved.** It is an internal outline of the topics each customer-facing or seller-facing legal document will need to cover, so a qualified lawyer can review and decide. It contains **no** operative policy text. Nothing here may be published, copied onto the website or presented to customers or sellers as Zimikart's policy.

**Created:** 23 October 2026 (Stage 1).
**Legal reviewer:** OPEN (not yet named).
**Approval status of every section below:** NOT APPROVED.

## How to read this

- **"Facts needed"** are business decisions or facts only the owner can supply. All are OPEN unless stated.
- **"Counsel to determine"** means the applicable law and wording must come from a qualified lawyer. This outline does not name specific statutes as applicable to Zimikart; counsel should identify which Indian data-protection, consumer-protection, e-commerce, payments and tax rules apply, and whether any further licences or registrations are needed.
- The current site pages (`src/pages/info/InfoPages.tsx`) contain placeholder drafts that say they must be lawyer-reviewed. They must not be treated as approved either.

## 1. Privacy policy

**Counsel to determine:** applicable data-protection law, lawful basis or consent model, children's data rules, cross-border transfer rules, breach notification duties, grievance-officer or equivalent requirements.

**Topics to cover:**
- Who operates Zimikart (legal entity name and address: OPEN).
- Categories of personal data collected: account (name, email, mobile), addresses, orders, payment status, device and log data, support messages. Seller data is covered in the seller agreement.
- Purpose for each category; data minimisation commitment.
- Sharing with payment gateway, logistics partners, email and SMS providers, sellers (only what is needed to ship), and authorities where required. Provider names: OPEN.
- Cookies and browser storage in use. At the time of audit, only cart and wishlist were stored in browser storage; sign-in cookies will be added later.
- Retention periods per data type: OPEN (N-10b).
- User rights and how to exercise them (access, correction, deletion, withdrawal of consent); process: OPEN.
- Security measures (described accurately; only statements that are true at launch).
- Grievance or contact point: OPEN.
- Policy change and notification process.

**Facts needed:** entity details, providers, retention periods, contact point, whether mobile OTP launches.

## 2. Terms of use (customers)

**Counsel to determine:** enforceability, jurisdiction, dispute resolution, marketplace-intermediary positioning and obligations.

**Topics to cover:**
- Account eligibility and responsibilities; sign-in required to order (guest checkout disabled, N-8).
- Marketplace role: Zimikart's role versus sellers' responsibility for products.
- Pricing, taxes, availability errors and order acceptance.
- Payment methods: online via the gateway; Cash on Delivery only if approved (N-4c), with its conditions.
- Delivery, risk of loss, delivery timelines (OPEN).
- Prohibited conduct; reviews and content rules.
- Account suspension and termination.
- Liability limits and disclaimers (counsel's wording only).
- Governing law and dispute handling.

**Facts needed:** legal entity, jurisdiction, COD decision, delivery commitments.

## 3. Refund and return policy

**Counsel to determine:** mandatory consumer rights, rules on returns, refunds and product categories that cannot be returned.

**Topics to cover:**
- Return window length: OPEN (N-11).
- Eligible and non-returnable categories: OPEN.
- Condition requirements and proof (photos and similar): OPEN.
- Who pays return shipping, by seller-managed versus platform-managed shipping: OPEN.
- Refund method and timing for online payments and for COD orders: OPEN.
- Defective, damaged or wrong-item handling; dispute and escalation path.
- Relationship to seller responsibilities.

**Facts needed:** all items marked OPEN above.

## 4. Cancellation policy

**Topics to cover:**
- When a customer may cancel (before packing, before shipping, after): OPEN.
- Seller-initiated and platform-initiated cancellations (stock-outs, suspected fraud).
- Refund treatment on cancellation; timing: OPEN.
- Cancellation of COD orders and handling of refused deliveries: OPEN.

**Facts needed:** cancellation windows and refund timing.

## 5. Seller agreement

**Counsel to determine:** marketplace and intermediary obligations, seller liabilities, tax and invoicing obligations, indemnities, data-processing roles.

**Topics to cover:**
- Eligibility and onboarding; KYC and verification. **Exact data to collect is OPEN (N-6d)**; collect the minimum required by law, by the payment provider (if Razorpay Route is used) and by the business.
- Approval, rejection, suspension and termination by Zimikart.
- Listing standards, prohibited and restricted products, intellectual-property rules, moderation.
- Pricing and stock accuracy.
- Fulfilment models: seller-managed and platform-managed logistics (N-6a), with responsibilities for each: OPEN.
- Commission, fees and deductions: OPEN (N-6b). **No rates are approved; sample numbers in the admin screens are mock data.**
- Settlement timing, holds, reserves, chargebacks and refunds' effect on payouts: OPEN (N-6c). Depends on whether Route is available (UNCONFIRMED, N-4b).
- COD remittance and reconciliation, if COD is approved (N-4c).
- Tax responsibilities (GST, TCS and similar): OPEN, to be set with the owner's tax adviser (N-6e).
- Returns and refunds responsibilities.
- Handling of customer personal data received for fulfilment; limits on use.
- Audit, records and cooperation duties.
- Liability, indemnity, dispute resolution.

**Facts needed:** all OPEN items; the payment-provider terms once confirmed in writing.

## 6. Additional items counsel may want to consider

- Payment-gateway terms the business must flow down (OPEN until Razorpay eligibility is confirmed in writing).
- COD terms for customers (only if COD is approved).
- Notice and consent wording for SMS OTP (OPEN; depends on SMS provider and registration).
- Reviews and moderation policy.
- Grievance redressal and contact page requirements.
- Accessibility and content-ownership statements.

## 7. Process

1. Owner names a legal reviewer (OPEN).
2. Owner answers the "Facts needed" items.
3. Counsel drafts and approves each document.
4. Only then is the website content replaced, which requires separate UI approval (R-1).
5. Record approval date, reviewer and version in `launch-checklist.md`, section B.

Until step 3 is complete for a document, it remains **DRAFT FOR LEGAL REVIEW — NOT APPROVED POLICY**.
