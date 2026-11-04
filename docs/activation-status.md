# CARTA activation status — 4 November 2026

## Active infrastructure

- Dedicated Supabase project `mvcirldxcuvcuqvlmqxv` in `ap-south-1` (Mumbai), status `ACTIVE_HEALTHY`.
- Three database migrations applied: `001_initial_carta_supabase_schema`, `002_policy_and_index_hardening`, `003_user_library_constraints`.
- 18 public tables have RLS enabled. Two private operational tables (`chat_rate_limits`, `payment_events`) intentionally have no client-facing RLS policies and have client grants revoked.
- Edge Function `carta-api` is deployed and ACTIVE, version 1. It manually validates bearer tokens for private routes; user-scoped requests carry the user JWT so Postgres RLS applies.
- GitHub repository: `Blex31/carta-world-constitutions-library` (private). It currently contains the project overview README; the full source tree still needs to be imported.

## Database contents

- Eight EAC jurisdictions: BI, CD, KE, RW, SO, SS, TZ, UG.
- Eight official-source candidate records. Every source is inactive, `review_required`, and not approved for commercial reuse.
- Zero legal documents/full-text provisions imported.

The 250-entry ISO jurisdiction catalogue in the working package is metadata only. It must not be represented as coverage of 250 constitutions.

## API capabilities

Public: health, jurisdiction/library listing, verified current document listing, verified feed listing, full-text search, document lookup.  
Authenticated: personal bookmarks, highlights, notes, saved documents and preferences; subscription-status lookup.  
Admin: source registry review and rights-state management, gated by trusted `app_metadata.role = admin`.

Legal chat, checkout, billing portal, payment verification and automated ingestion return explicit not-configured responses. No fake legal answers, feed items or payment entitlements are returned.

## Release blockers

1. Import every file of the prepared working source bundle into the private GitHub repository and verify the tree/commit.
2. Check in reproducible Supabase migration SQL and the deployed Edge Function source alongside the legacy Neon history.
3. Install pinned dependencies in a network-enabled environment and run the full Vite build; the current environment could run 11/11 Node tests and syntax checks, but npm registry DNS resolution failed (`EAI_AGAIN`) and `vite` is not installed, so the production build is unverified.
4. Configure production frontend hosting and exact `CARTA_ALLOWED_ORIGINS` origins.
5. Configure Supabase Auth Site URL, redirect allow-list, production SMTP and password reset/confirmation flows.
6. Create the first administrator through a trusted server-side app-metadata operation; never use user-editable `user_metadata` for role checks.
7. Obtain and record legal-content reuse permissions, verify current consolidated versions and import the first approved EAC documents. Kenya Law/NCLR requires written permission for the intended automated/commercial/AI usage.
8. Implement and configure provider-backed legal AI (with retrieved-source citations), official-feed adapters/scheduler and payment provider/webhooks before enabling those UI features.
9. Complete RLS integration tests with real test users, Edge Function HTTP tests, dependency audit, backup/restore test and browser end-to-end QA.

## Verification record

- `npm test`: 11/11 passing.
- `npm run syntaxcheck`: passed. Actual TypeScript type checking is not verified; `npm run typecheck` requires the pinned local TypeScript/dependency installation.
- Supabase migrations 001–003: applied; migration history confirmed.
- Supabase schema inspection: RLS enabled on all 18 public tables; counts verified as 8 jurisdictions, 8 sources, 0 legal documents.
- Security advisor: only informational no-policy findings are the two intentionally private operational tables.
- Edge Function inventory: `carta-api` ACTIVE, version 1.
- `npm run build`: not verified; the local container had no `node_modules`, and package installation failed because `registry.npmjs.org` DNS resolution returned `EAI_AGAIN`.
- External HTTP smoke test could not run in this container because the Supabase hostname could not resolve from its network. Deployment status was verified through the Supabase control plane, not a direct browser request.
