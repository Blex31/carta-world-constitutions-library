# CARTA activation status — 6 November 2026

This file is the current operational snapshot. It distinguishes code and infrastructure that are present from launch features that still need configuration or legal approval.

## Verified in GitHub

- The complete prepared **React + Vite web source tree** is in this repository (web application code, Supabase function source, nine migration files, global data seed, tests and project documentation).
- Main branch code review was performed at commit `98bd6e4e32d549a061da3da34f533abb38c13d14`; the launch checklist and status notes were committed afterward.
- Latest verified GitHub Actions run: [CARTA CI #54](https://github.com/Blex31/carta-world-constitutions-library/actions/runs/42013346054), completed successfully. Tests, coverage audit, JavaScript syntax, TypeScript typecheck and production Vite build passed. Dependency installation, tests, data-coverage audit, JavaScript syntax, TypeScript typecheck and production Vite build all passed.
- The repository includes `supabase/functions/carta-api/index.ts`; its contents match the currently deployed Supabase Edge Function version 9.
- Rwanda Phase 3 preflight, legal-rights notes, draft publisher request, EAC source review, importer and rights-control migrations are committed.

## Live Supabase infrastructure

- Project `mvcirldxcuvcuqvlmqxv` is `ACTIVE_HEALTHY`, region `ap-south-1`.
- `carta-api` is ACTIVE at version 9.
- Nine migrations are recorded as applied in the live project: 001–007, the global jurisdiction catalogue seed (`20261105103601`) and administrator ingestion-run RLS optimization (`20261105104522`).
- The live database has 19 public tables; RLS is enabled on all 19. Its 250 global ISO jurisdiction entries are metadata-only; no document coverage is implied. Three server-only tables (`chat_rate_limits`, `payment_events`, `billing_customers`) have service-role-only policies.
- The active `carta-official-feed-daily` cron runs at 03:10 UTC (06:10 Africa/Nairobi).
- The source file in GitHub and deployed Edge Function version 9 were compared and are an exact content match.

The password-reset request and new-password update flows are implemented in the web client and covered by regression tests; SMTP delivery, production redirects and real inbox testing are still pending. Sign-out clears private shelf data from the shared browser.

## Current database contents

| Data | Live count |
|---|---:|
| Global jurisdiction catalogue records | 250 |
| EAC partner states included | 8 |
| Official-source candidates | 8 |
| Legal documents | 0 |
| Document sections / provisions | 0 |
| Searchable legal chunks | 0 |
| Feed items | 0 |
| Ingestion runs recorded | 3 |

The three recorded ingestion runs have not populated legal updates; no publisher is eligible yet because all eight candidate sources remain inactive and rights-review-required.

## Rwanda first-document status

- Candidate: Constitution of the Republic of Rwanda, Official Gazette n° Special of 04/08/2023; three official language versions and 176 articles identified.
- The RLRC and Parliament copies are recorded in `docs/rwanda-constitution-2023-preflight.md`.
- The publisher confirmation request is drafted in `docs/rights-requests/rwanda-constitution-permission-request.md`; it has **not** been sent.
- The live `rwanda-minijust` source remains inactive, `review_required`, and `commercial_use_allowed=false`.
- A WIPO Law No. 055/2024 reference URL is recorded, but no `legal_opinion_on_file` review status or substantive legal-opinion notes are recorded. Article 282 has not been treated as automatic approval.
- No Rwanda text has been downloaded, reconciled, hashed, independently reviewed, imported or indexed.

## Known repository reproducibility gap

The live Supabase project has applied reconstructed migrations 004 and 005:
- `20261104215041_phase_2_identity_limits_scheduler`
- `20261104215451_phase_2_private_rpc_hardening`

Their SQL files have now been reconstructed from the live schema, function definitions, policies and migration history and committed to `supabase/migrations/`. The repository now contains SQL files for all nine applied migrations (001–009), plus the legacy Neon migration history. Review the reconstructed 004/005 SQL against a disposable clean-install database before calling the repository fully reproducible. The remaining caveat is independent clean-install validation of the reconstructed 004/005 SQL; this is recorded in `supabase/migrations/README.md`.

## Living launch checklist

The canonical phase-by-phase release tracker is [`docs/launch-checklist.md`](launch-checklist.md). Update it after each development session and only mark work complete after verification.

## Launch blockers

1. Validate the reconstructed Supabase migration SQL 004 and 005 against a clean-install database.
2. Obtain Rwanda publisher confirmation and a Rwanda-qualified legal opinion covering web/mobile display, commercial use, search, AI retrieval and offline copies.
3. Verify the authoritative language and amendment/currentness position; then reconcile, hash and second-review all 176 articles before an importer dry-run.
4. Import the first legally cleared document and verify reading, search, provision citations and AI retrieval.
5. Deploy the React/Vite frontend to a production HTTPS host. No production frontend URL or frontend deployment workflow is currently recorded in this repository.
6. Finish production Auth configuration (site URL, redirect allow-list, SMTP/confirmation and password-reset flow) and test user isolation.
7. Configure and test the OpenAI and Stripe provider secrets, prices and webhooks before enabling AI answers or CARTA Plus payments. The existing routes are not evidence that those providers are active.
8. Build the separate Flutter Android and iOS clients. Mobile is a committed product requirement, but no Flutter application source, Android project or iOS project is currently in this repository.
9. Add a committed npm lockfile and use deterministic CI installation; the current workflow uses `npm install`.
10. Complete browser/native end-to-end tests, dependency/security review, monitoring and backup/restore testing.

## Live advisor results

- Supabase Security Advisor: no current security lints.
- Supabase Performance Advisor: one RLS initialization-plan warning on the admin read policy for `ingestion_runs`, plus unused-index notices. The previous ingestion-run RLS performance warning has been fixed by migration 009. The advisor now reports only informational unused-index notices (29 findings); reassess after meaningful production traffic exists.
