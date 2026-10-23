# Zimikart: Hosting Verification Worksheet

**Status:** Stage 1 documentation. **Every capability below is UNCONFIRMED.** No hosting capability has been assumed or checked. This worksheet is for the owner to fill in.

## How to use

1. Check each item in your hosting control panel, your plan description, or with your host's support.
2. Record the answer and where you found it. Use "Not available" where that is the case.
3. **Never write passwords, API keys, database credentials or tokens in this file or in chat.** Record only facts such as versions and yes/no answers. Screenshots must hide any credentials.
4. Third-party articles are not evidence. Use your host's own documentation or panel.

## 1. Account and plan

| # | Item | Answer | Source | Why it matters |
|---|---|---|---|---|
| 1.1 | Exact plan name and type (shared, cloud, VPS) | UNCONFIRMED | | Capabilities differ by plan |
| 1.2 | Number of websites/subdomains allowed | UNCONFIRMED | | Three hosts are planned |
| 1.3 | Are all three subdomains inside one hosting account? | UNCONFIRMED | | Shared database and shared code (N-2) |
| 1.4 | Who controls DNS for zimikart.com (registrar vs host)? | UNCONFIRMED | | Records for hosts, email authentication |
| 1.5 | Resource limits (CPU, memory, processes, inodes) | UNCONFIRMED | | Checkout and webhook reliability |

## 2. PHP

| # | Item | Answer | Source | Why it matters |
|---|---|---|---|---|
| 2.1 | PHP versions available; is 8.2 or newer selectable per site? | UNCONFIRMED | | Required by R-2 |
| 2.2 | Extensions: `pdo_mysql`, `mbstring`, `openssl`, `sodium`, `json`, `fileinfo`, `curl`, and `gd` or `imagick` | UNCONFIRMED | | Hashing, DB, uploads, outbound calls |
| 2.3 | Can `php.ini` settings be changed (`display_errors`, upload and memory limits, error log path)? | UNCONFIRMED | | Error leakage control (F-11) |
| 2.4 | Is the `php` command-line binary available? | UNCONFIRMED | | Migrations, admin provisioning, jobs |

## 3. Access and tooling

| # | Item | Answer | Source | Why it matters |
|---|---|---|---|---|
| 3.1 | SSH access available on this plan? | UNCONFIRMED | | Owner-only admin provisioning must not be a web endpoint (R-4) |
| 3.2 | Can Composer run on the server, or must dependencies be built elsewhere and uploaded? | UNCONFIRMED | | PHP dependency installation |
| 3.3 | Git-based deployment or SFTP only? | UNCONFIRMED | | Deployment and rollback process |
| 3.4 | Is there a staging environment? | UNCONFIRMED | | Safer testing |

## 4. Filesystem and document roots

| # | Item | Answer | Source | Why it matters |
|---|---|---|---|---|
| 4.1 | Can each subdomain's document root be set to a chosen folder? | UNCONFIRMED | | Same-origin routing (N-2) |
| 4.2 | Can you create writable folders **above** every document root for code, secrets and private storage? | UNCONFIRMED | | R-3: secrets outside the web root |
| 4.3 | Can one codebase above the roots be used by all three hosts (shared access or symbolic links)? | UNCONFIRMED | | If not, N-2 needs a fallback |
| 4.4 | Are `.htaccess` rules honoured (rewrites, deny rules, headers)? Which web server is used? | UNCONFIRMED | | SPA fallback, API routing, headers (F-12) |
| 4.5 | Are files in private folders unreachable by URL? | UNCONFIRMED | | Verified later by `T-DOCROOT-PROBE` |

## 5. Database

| # | Item | Answer | Source | Why it matters |
|---|---|---|---|---|
| 5.1 | MySQL or MariaDB, and the exact version | UNCONFIRMED | | Syntax and feature support (for example CHECK constraints, JSON, full-text) |
| 5.2 | InnoDB and `utf8mb4` supported? | UNCONFIRMED | | Transactions, foreign keys |
| 5.3 | Can you create separate DB users with limited privileges? | UNCONFIRMED | | Application user vs migration user; insert-only audit table |
| 5.4 | Is remote database access disabled by default and can it stay off? | UNCONFIRMED | | Attack surface |
| 5.5 | Database size and connection limits | UNCONFIRMED | | Capacity |

## 6. Background jobs and outbound connections

| # | Item | Answer | Source | Why it matters |
|---|---|---|---|---|
| 6.1 | Cron jobs available? How many, and minimum interval? | UNCONFIRMED | | Session cleanup, notification queue, reconciliation |
| 6.2 | Outbound HTTPS (curl) to the payment gateway, email and SMS providers permitted? | UNCONFIRMED | | Payments, OTP, email |
| 6.3 | Can the server receive HTTPS POST webhooks on a public URL? | UNCONFIRMED | | Payment webhooks |

## 7. HTTPS and email

| # | Item | Answer | Source | Why it matters |
|---|---|---|---|---|
| 7.1 | Free or paid certificates for all three hosts; auto-renewal? | UNCONFIRMED | | HTTPS everywhere |
| 7.2 | Can HTTP be redirected to HTTPS and HSTS be set? | UNCONFIRMED | | F-12 |
| 7.3 | Can SPF, DKIM and DMARC DNS records be published for the domain? | UNCONFIRMED | | Deliverability of verification and reset mail |
| 7.4 | Does the host's own email sending have sending limits? | UNCONFIRMED | | Order and OTP mail volume |

## 8. Backups and recovery

| # | Item | Answer | Source | Why it matters |
|---|---|---|---|---|
| 8.1 | Backup frequency and retention on this plan | UNCONFIRMED | | Recovery point |
| 8.2 | Does a backup include databases and files? Can you restore one yourself? | UNCONFIRMED | | Recovery test |
| 8.3 | Is an off-site backup provider chosen? Location? | OPEN | | N-12 |

## 9. Outcome and decision impact

Fill in after sections 1-8.

| Question | Answer | Consequence |
|---|---|---|
| Can all three hosts safely share one backend above their document roots? | UNCONFIRMED | If yes: N-2 stays as preferred. If no: choose a fallback (separate backend copies, or a single shared API host) and re-assess cookies and CORS. |
| Is command-line access available for provisioning the first admin? | UNCONFIRMED | If no: an alternative secure provisioning method or a different hosting tier must be decided **before** Stage 4. |
| Are cron jobs sufficient? | UNCONFIRMED | If not, reduce background features or change tier. |
| Does the plan meet the PHP, database and backup needs? | UNCONFIRMED | If not, upgrade or change host. |

## 10. Verification evidence

Date checked: OPEN. Checked by: OPEN. Evidence stored at: OPEN.
