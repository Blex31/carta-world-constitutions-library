# CARTA — Master launch checklist

**Last verified:** 6 November 2026  
**Repository:** https://github.com/Blex31/carta-world-constitutions-library  
**Live backend:** Supabase project `mvcirldxcuvcuqvlmqxv`  
**Code baseline reviewed:** `98bd6e4e32d549a061da3da34f533abb38c13d14`  
**Checklist creation commit:** `b922334102fd3abf644be8978fbd13cdc8ee00c6`  
**Latest verified CI at checklist creation:** [Run #55 — passed](https://github.com/Blex31/carta-world-constitutions-library/actions/runs/42208017731)

This is CARTA's single running checklist. Update it after each meaningful development session. Do not mark an item complete just because code exists: complete it only after the stated acceptance test has passed.

## Status key

- [x] Done and verified.
- [ ] Not done.
- [~] Implemented or partly configured, but not yet verified in a real production/staging user journey.
- [!] Blocked by an external approval, credential, decision or legal review.

## Current verified baseline

| Area | Verified state |
|---|---|
| Web client | React + Vite application is in GitHub; latest CI build passes |
| Backend | Supabase project is ACTIVE_HEALTHY |
| Database | 19 public tables; RLS enabled on all 19 |
| Global directory | 250 jurisdiction records; metadata only |
| Publisher candidates | 8 EAC candidates; all still inactive and rights-review-required |
| Legal corpus | 0 legal documents, 0 sections/provisions, 0 searchable chunks |
| Legal updates | 0 feed items; scheduled poll is active but has no eligible publisher |
| API | `carta-api` Edge Function is active at version 9 |
| Scheduled job | `carta-official-feed-daily` active at 03:10 UTC / 06:10 Africa/Nairobi |
| Migrations | 9 migration records applied in the live project; SQL files are checked in |
| Supabase advisors | No security lints; the previous ingestion-run RLS performance warning is fixed; unused-index notices remain |
| Native apps | No Flutter project yet; Android/iOS remain a required product deliverable |
| Public web launch | No production frontend URL confirmed |

---

## Phase 0 — Keep the foundation reproducible

- [x] Commit the React/Vite web client, Supabase function source, tests, seed data and project documentation to GitHub.
- [x] Keep the deployed `carta-api` source in sync with the checked-in function source (last direct comparison: exact match at version 9).
- [x] Apply the core schema, RLS, user-library, Phase 2 identity, private RPC, rights-control and global-jurisdiction migrations.
- [x] Restore the missing Phase 2 migration SQL files 004 and 005 to the repository.
- [x] Seed the global 250-jurisdiction directory without marking any constitution as verified.
- [x] Fix the Supabase RLS initialization-plan warning on the administrator ingestion-run read policy.
- [x] Keep GitHub Actions test, coverage audit, syntax, typecheck and production Vite build passing.
- [ ] Validate migrations 001–009 from an empty disposable Supabase project or clean local Supabase stack. This is especially important for reconstructed migrations 004 and 005.
- [ ] Add a committed npm lockfile, switch CI from `npm install` to `npm ci`, and verify a clean reproducible build.
- [ ] Add an automated check that the deployed Edge Function and repository source do not drift.

**Acceptance:** A new environment can be created from the repository migrations and seeds, all tests pass, and the deployed API source matches GitHub.

## Phase 1 — Legal source and constitution collection (critical path)

**The legal corpus is CARTA's main launch blocker.** A country appearing in the directory does not mean its Constitution is available or verified.

### 1A. Clear the first document — Rwanda is the current first-corpus candidate

- [ ] Send the prepared publisher confirmation/permission request to the Rwanda Law Reform Commission / relevant official publisher.
- [!] Obtain a Rwanda-qualified legal opinion on the proposed use of the Constitution and relevant official-text/copyright provisions. Do not assume that an official government URL or Article 282 automatically grants all CARTA rights.
- [ ] Confirm which text is authoritative, its adoption/promulgation/publication/commencement dates, current amendment cut-off and language precedence.
- [ ] Obtain or formally identify the official text and its three language editions; record exact source URLs and publisher details.
- [ ] Reconcile all 176 articles and their chapter structure against the authoritative copy.
- [ ] Record source provenance, version label, effective dates, attribution, rights evidence and permitted uses for each edition.
- [ ] Calculate and record SHA-256 checksums; complete an independent second-person legal/editorial review.
- [ ] Run the existing importer in dry-run mode and resolve every validation warning before importing.
- [ ] Import only the approved edition(s); verify document, sections and chunks in the live database.
- [ ] Test the document reader, chapter/article navigation, full-text search, source links and exact provision citations against the imported text.

Rights clearance must explicitly cover each intended activity: web and mobile display; reproduction and redistribution; free and paid/commercial use; search/indexing/snippets; AI retrieval, embeddings and summarisation; offline/device caching; translations or derivative plain-language explanations; attribution; correction/takedown; and any licence expiry or update requirements.

### 1B. Expand the legal library

- [ ] Reconcile the current versions and rights of the other seven EAC partner-state constitutions: Burundi, DR Congo, Kenya, Somalia, South Sudan, Tanzania and Uganda.
- [ ] Treat Zanzibar's Constitution as a separate legal instrument/jurisdictional collection where included.
- [ ] For every document, establish official source, language edition, amendment history, effective dates, publication status, rights evidence and checksum.
- [ ] Import each document only after the same rights and editorial gates pass.
- [ ] Build a repeatable source/version monitoring and correction process.
- [ ] Expand beyond the EAC in controlled country batches until the global directory has meaningful verified coverage.

**Acceptance:** Every published document has an auditable official source, verified version/currentness, rights record, attribution, checksum and searchable provision structure. Unverified countries remain visibly marked as catalogue-only.

## Phase 2 — Public web deployment

- [ ] Select the production hosting provider and deployment method (for example, Vercel, Netlify or another static host).
- [ ] Configure the three browser-safe build variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` and `VITE_CARTA_API_URL`.
- [ ] Set exact production origins in the Edge Function's `CARTA_ALLOWED_ORIGINS`; do not use a wildcard.
- [ ] Configure production site URL, HTTPS, domain, DNS and redirect URLs.
- [ ] Deploy the React/Vite app to a staging URL first.
- [ ] Verify desktop, tablet and mobile browser layouts; confirm all navigation and deep links work.
- [ ] Verify public catalogue, document, search and feed endpoints from the deployed frontend.
- [ ] Promote to the production domain only after staging checks pass.

**Acceptance:** A visitor can open the HTTPS site, browse the catalogue and use all public features without console errors or incorrect CORS/API responses.

## Phase 3 — Authentication and personal library

- [x] Supabase email sign-up and sign-in integration exists.
- [x] Session restoration and auth-state listener are implemented.
- [x] Password-reset request and new-password update flows are implemented in the web client.
- [x] Regression tests cover password recovery and clearing private local shelf data on sign-out.
- [ ] Configure Supabase Auth site URL and allowed redirect URLs for staging and production.
- [ ] Configure a verified production SMTP/email sender, sender domain and delivery monitoring.
- [ ] Test email confirmation, sign-in, sign-out, password reset, password update, expired session and account recovery on the deployed site.
- [ ] Create the initial administrator through trusted server-side `app_metadata`; never use user-editable `user_metadata` for admin privileges.
- [ ] Test two separate accounts: bookmarks, highlights, notes, saved documents and chats must not leak between users.
- [ ] Verify changes sync across browsers/devices and resolve local-vs-cloud conflict behaviour.
- [ ] Test account deletion/export, session revocation and appropriate retention rules.

**Acceptance:** A new reader can register, confirm email, sign in, recover an account and keep a private library that remains isolated from other accounts.

## Phase 4 — Legal research assistant

- [x] Authenticated legal-chat API route and rate-limiting logic are implemented.
- [x] Retrieval filters require current, verified, official, reusable legal text.
- [x] The no-verified-source path refuses to invent a legal answer.
- [x] Source-index citations are stored with assistant messages.
- [!] Legal answers cannot be meaningfully enabled until verified legal documents and searchable chunks exist.
- [ ] Add `OPENAI_API_KEY` as a Supabase Edge Function secret; never place it in browser variables or GitHub.
- [ ] Confirm the approved model and operational budget/rate limits.
- [ ] Test questions against imported provisions and verify every citation opens the exact document edition and article.
- [ ] Test cross-country comparisons, amendments, conflicting sources, out-of-date texts and questions with no supporting passage.
- [ ] Test prompt-injection attempts embedded in documents or feed content; retrieved legal text must be treated as untrusted data.
- [ ] Display clear educational-information/not-legal-advice language and show the source/version date with every answer.
- [ ] Add monitoring and an explicit fallback when the AI provider is unavailable.

**Acceptance:** AI answers are grounded only in approved source passages, every legal claim is cited, and unsupported questions receive a clear no-source response.

## Phase 5 — Official updates and publisher ingestion

- [x] Publisher registry and administrator source-management API exist.
- [x] Feed parser enforces HTTPS, explicit hostname allow-lists, redirect refusal, size/time limits and deduplication.
- [x] Daily scheduler is deployed and active.
- [ ] Obtain source-specific permission/rights evidence for feed content and any snippets; add only verified official publishers.
- [ ] Configure each publisher's exact allowed hosts, feed/API URL, polling interval and content scope.
- [ ] Test one approved feed end to end; confirm publisher, canonical URL, published date and jurisdiction are retained.
- [ ] Confirm correction, duplicate, malformed-feed, hostile-content, timeout and publisher-removal behaviour.
- [ ] Show source attribution and publication dates in the app.
- [ ] Add admin monitoring/alerts for failed ingestion and stale publisher feeds.

**Acceptance:** An approved publisher update is ingested once, attributed correctly, visible in the correct jurisdiction and traceable through an ingestion run. The scheduler must not activate unapproved sources.

## Phase 6 — CARTA Plus, payments and advertising

- [x] Stripe checkout, portal, status, verification and signed/idempotent webhook routes are implemented.
- [x] Paywall UI and ad-free entitlement logic are implemented.
- [ ] Decide launch prices, currency, billing intervals, tax/refund terms and whether Kenya-focused pricing should be in KES.
- [ ] Create Stripe test-mode monthly/yearly prices and configure test secret, webhook secret and price IDs in Supabase Edge Function secrets.
- [ ] Test checkout, successful payment, cancellation, renewal, failed payment, refund, duplicate webhook and account switching.
- [ ] Confirm CARTA Plus entitlement switches sponsor placements off immediately and remains correct after refresh/sign-in.
- [ ] Configure live Stripe credentials only after test mode passes.
- [ ] Decide whether web advertising will be enabled; configure the approved ad provider, publisher ID, slot IDs, privacy/consent notices and blocking rules.
- [!] Before enabling subscriptions in native mobile apps, decide the Apple/Google-compliant in-app purchase and receipt-validation approach. The current Stripe routes are for web.

**Acceptance:** A reader can subscribe and cancel safely; paid entitlement is server-verified and ad-free access is consistent across sessions. Advertising and billing must remain disabled until their provider configuration and tests pass.

## Phase 7 — Native Android and iOS applications

**Status:** Flutter first slice committed on branch `feature/flutter-native-clients`. Platform build checks are in progress; do not merge until CI is green.

- [x] Create the Flutter/Dart project under `apps/mobile` with Supabase Flutter, secure session storage, API client and shared CARTA theme.
- [x] Generate and commit the Android and iOS runner projects; register the `carta://auth-callback` deep link and CARTA display name in both native projects.
- [x] Implement email sign-up/sign-in, password reset request and password update screen.
- [x] Implement the global jurisdiction catalogue with metadata-only empty states.
- [x] Implement the verified document reader and provision bookmarking through the existing CARTA API.
- [x] Implement verified legal passage search and source-aware empty states.
- [x] Implement official updates list and authenticated legal research request.
- [~] Implement account screen and personal-library summary; full note/highlight management UI and device-sync QA remain.
- [x] Add Flutter analyze, widget-test, Android debug APK and unsigned iOS build workflows.
- [x] Commit the resolved `apps/mobile/pubspec.lock` after CI dependency resolution.
- [~] Latest CI: Flutter analysis and widget tests pass; iOS unsigned build passes; Android debug APK compile is still running (run #21).
- [ ] Configure Supabase Auth redirect allow-list with `carta://auth-callback`; test confirmation and password recovery on physical devices.
- [ ] Build a real saved-library flow for highlights and notes and verify cross-device synchronisation.
- [!] Implement licensed offline document storage only after the API exposes explicit per-version offline/device-copy permission; include SHA-256 validation, version identifiers and stale-document warnings.
- [!] Implement FCM for Android and APNs-backed FCM for iOS after Firebase project registration, APNs key upload, device-token backend and user opt-in are configured.
- [!] Implement Android AppWidget and iOS WidgetKit after a verified daily-item feed exists and native widget extensions are generated.
- [!] Implement mobile subscription/restore purchase using the applicable Google Play Billing and Apple In-App Purchase flow; the existing Stripe route is web-only.
- [ ] Test on real Android and iOS devices, including low bandwidth, accessibility, text scaling, offline mode and session expiry.
- [ ] Prepare Play Store and App Store listings, privacy disclosures, screenshots, signing keys and release builds.

**Acceptance:** The same account and reading shelf work on web and mobile; licensed offline content is safe; daily notifications/widgets respect timezone and user preferences.

**Why the remaining mobile items are blocked and how to clear them:** see [Blockers and solutions](blockers-and-solutions.md).

## Phase 8 — Security, legal operations and launch readiness

- [x] RLS enabled on all 19 public tables.
- [x] Supabase Security Advisor returned no current security lints on 6 November 2026.
- [x] Previous admin ingestion-run RLS performance warning was corrected.
- [ ] Review remaining unused-index notices after real query traffic exists; do not drop indexes solely because the current empty corpus has not used them.
- [ ] Run dependency vulnerability and licence audits; pin dependencies and commit the lockfile.
- [ ] Test API rate limits, authentication boundaries, RLS isolation, CORS and abuse cases.
- [ ] Test scheduled-job retries, Stripe webhook retries and ingestion recovery.
- [ ] Configure database backups and complete a restore drill.
- [ ] Configure production error reporting, uptime checks, log retention and alert ownership.
- [ ] Prepare Terms of Use, Privacy Policy, legal-information disclaimer, rights/attribution policy, corrections process and takedown contact.
- [ ] Complete accessibility, browser compatibility and performance testing.
- [ ] Complete final release acceptance on staging and record sign-off before public launch.

**Acceptance:** The release has passed security, recovery, legal-content, user-privacy and product acceptance checks, and the team can detect and recover from service failures.

---

## Recommended execution order

1. **Finish repository reproducibility:** validate migrations 001–009 from a clean environment and add the npm lockfile.
2. **Start the first legal corpus:** send the Rwanda publisher request and obtain qualified legal review; then verify and import the first approved constitutional text.
3. **Deploy staging web:** configure the Supabase browser variables, production origins and Auth redirect/email settings.
4. **Test real user journeys:** account creation/recovery, document reading, search, bookmarks and cross-account isolation.
5. **Activate legal AI and official updates:** only after verified, rights-cleared documents and publishers exist.
6. **Activate CARTA Plus:** choose pricing, configure Stripe and test the complete billing lifecycle.
7. **Build native Flutter clients:** Android/iOS, offline reading, notifications, widgets and store billing.
8. **Run launch sign-off:** security, backup/restore, monitoring, legal and store checks.

## Blocker explanations and solutions

Every pending or blocked item has a reason, a concrete solution and a test for clearing it in [docs/blockers-and-solutions.md](blockers-and-solutions.md). Update both this checklist and that document when a blocker changes.

## Update log

Add one entry after each development session. Record the commit/run, verified result, checklist items changed and any new blockers.

| Date | Commit / CI | Verified change | Checklist updated by |
|---|---|---|---|
| 6 Nov 2026 | `b922334` / [CI #55](https://github.com/Blex31/carta-world-constitutions-library/actions/runs/42208017731) | Created the master checklist after verifying the backend, migration state, global catalogue, password recovery and RLS policy fix | CARTA project session |

### Entry template

| Date | Commit / CI | Verified change | Checklist updated by |
|---|---|---|---|
| YYYY-MM-DD | `commit` / CI run | What was actually tested and passed | Project session |

| 6 Nov 2026 | `feature/flutter-native-clients` / [mobile CI #21](https://github.com/Blex31/carta-world-constitutions-library/actions/runs/42214335106) | Committed Flutter app, 94 native runner files, `pubspec.lock`; Flutter analyze, widget tests and unsigned iOS build passed; Android debug APK compile running | CARTA project session |
