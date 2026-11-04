# CARTA pre-release checklist

## Product targets
- [ ] Web React/Vite client deployed on HTTPS.
- [ ] Native Flutter apps built for Android and iOS.
- [ ] Both clients use the same Supabase Auth accounts, CARTA API and legal corpus.
- [ ] Shared API contract and client-version compatibility tests pass.

## Supabase infrastructure
- [ ] Confirm production project, migration history and Edge Function deployment.
- [ ] Configure exact `CARTA_ALLOWED_ORIGINS` for the web origin(s).
- [ ] Configure Supabase Auth Site URL, redirect allow-list, password policy and production SMTP sender.
- [ ] Create first administrator through trusted server-side `app_metadata`; never use user-editable `user_metadata` for permissions.
- [ ] Verify every exposed table has appropriate RLS and grants; run Supabase security and performance advisors.
- [ ] Configure server-side OpenAI and Stripe secrets only after their features are ready.
- [ ] Configure backups and complete a restore drill.

## Legal corpus and official sources
- [ ] Confirm jurisdiction classification and do not equate catalogue size with constitution coverage.
- [ ] Verify official publisher, exact text, authoritative language(s), promulgation and commencement.
- [ ] Reconcile every amendment and effective date through a stated cut-off.
- [ ] Obtain written licence, open licence or legal public-domain determination for web/mobile display, commercial use, indexing, AI retrieval and offline downloads.
- [ ] Store rights evidence, attribution text, permitted uses and licence scope for every source and document.
- [ ] Compute and store the text SHA-256 checksum.
- [ ] Have a second reviewer reconcile the extracted text and article/section hierarchy against the official source.
- [ ] Run the importer dry-run; import only documents that pass every rights and legal-version gate.
- [ ] Confirm current vs superseded versions and searchable chunk-to-provision citations.
- [ ] Keep restricted or unclear sources metadata-only and inactive.

## AI legal assistant
- [ ] Configure server-side OpenAI credentials.
- [ ] Confirm retrieval selects only verified, current/effective, rights-cleared chunks.
- [ ] Test exact citations, provision numbers, version labels and official URLs.
- [ ] Test no-source refusal, false citations, prompt injection, amendment changes, bill-vs-law confusion and jurisdiction confusion.
- [ ] Confirm legal-information disclaimers and escalation to qualified counsel where appropriate.
- [ ] Confirm chat history is isolated by authenticated user.

## Authentication and personal library
- [ ] Test sign-up, confirmation, sign-in, password reset, sign-out and session restoration.
- [ ] Save/remove bookmarks, highlights, notes and downloads as User A.
- [ ] Sign in as User B and confirm no access to User A's data or conversations.
- [ ] Sync notes/bookmarks across web, Android and iOS.
- [ ] Test local cache migration and account switching.

## Billing
- [ ] Configure Stripe web secrets, Price IDs, webhook and return URLs.
- [ ] Test web checkout, ownership verification, renewals, cancellation, failed payments, duplicate webhooks and portal.
- [ ] Review current Apple and Google rules and implement compliant mobile subscriptions/purchases.
- [ ] Test restore purchases, refunds, account switching and entitlement reconciliation.
- [ ] Confirm free/Plus access and ad-free entitlement are enforced by the backend.

## Feeds and updates
- [ ] Approve publisher rights and host allow-lists before activating any source.
- [ ] Test scheduler, deduplication, redirects/hostile content, timeouts and rate limits.
- [ ] Confirm update headlines link to canonical publishers and do not copy unlicensed text.
- [ ] Confirm the 06:00 daily rotation uses user timezone preferences.

## Native mobile quality
- [ ] Flutter Android and iOS build/release pipelines set up.
- [ ] Offline reading retains version, checksum, source and retrieval timestamp.
- [ ] Superseded offline copies are marked stale and never silently presented as current.
- [ ] FCM/APNs opt-in, revocation, token rotation and timezone behaviour tested.
- [ ] Android AppWidget and iOS WidgetKit verified with source attribution and deep links.
- [ ] Accessibility, dynamic text size, screen readers, low-bandwidth and deep-link tests pass.
- [ ] Test on supported physical devices and complete store privacy/content declarations.

## Operations, privacy and launch
- [ ] Add privacy policy, terms, legal-information disclaimer, attribution and correction/takedown process.
- [ ] Review data-protection, consumer, tax and subscription obligations in launch markets.
- [ ] Complete dependency/security review, rate-limit abuse tests and hostile feed tests.
- [ ] Run browser E2E and native-device E2E suites.
- [ ] Configure monitoring, error alerts, incident contacts and restore procedure.
- [ ] Publish web app and submit Android/iOS builds only after all critical gates pass.
