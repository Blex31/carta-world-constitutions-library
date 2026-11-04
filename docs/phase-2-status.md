# CARTA Phase 2 — implementation and release state

Last updated: 2026-11-05

## Implemented in the Supabase API

- Legal research endpoint: `POST /api/legal-chat`, authenticated, per-user rate-limited, with conversation/message persistence and structured source-index citations.
- Evidence controls: only current, verified, official documents whose source and document licences allow reuse can enter retrieval. No-match questions receive an explicit no-source response; generated answers require the OpenAI Responses API secret.
- User library sync: private profiles, bookmarks, highlights, notes, saved documents and conversation listing.
- Billing routes: Stripe subscription checkout, billing portal, session verification, membership status and signed webhook event processing. Stripe secret, webhook secret, two recurring price IDs and production site URL must be configured before checkout works.
- Official publisher polling: RSS/Atom/JSON feed parser with HTTPS-only URLs, exact hostname allow-list, redirect refusal, response-size/time limits, deduplication and ingestion run history.
- Admin source activation: a source cannot be enabled for commercial reuse without a recognised rights status and recorded evidence URL.
- Cron schedule: every day at 03:10 UTC (06:10 Africa/Nairobi), using Supabase Vault, pg_cron and pg_net. The token is held in Vault and validated by a service-role-only RPC.
- Identity and security: auth-user profile trigger; private service-role-only rate limits, payment events and billing-customer mapping; explicit RPC grants.

## Provider configuration still required

Set these as **server-side Edge Function secrets**; never expose them in `VITE_*` variables:

- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_MONTHLY`
- `STRIPE_PRICE_YEARLY`
- `CARTA_SITE_URL` (the exact deployed frontend origin)
- `CARTA_ALLOWED_ORIGINS` (comma-separated exact browser origins)
- Optional `CARTA_AI_MODEL`

The Supabase Edge Function has a deployment-time health route that reports only whether provider configuration values are present. It does not reveal secrets.

## Legal data and publication gate

The EAC seed currently contains eight jurisdiction metadata rows and eight candidate official sources. They remain inactive and rights-review-required. There are no verified constitutional documents or searchable text chunks in the database. In particular, public accessibility is not treated as permission for bulk extraction, commercial redistribution or AI use. Each publisher must be approved individually and each text version must be checked for amendments, effective dates and provenance.

## Verification state

- Database migrations 001–005 are intended for the live CARTA project; see Supabase migration history.
- The application repository contains the full prepared application source tree.
- The initial corpus/security test suite previously passed 11/11 tests. Phase 2 static contract tests are now added.
- Full Vite production build/typecheck and browser E2E tests still need a dependency-enabled CI runner.
- Live HTTP smoke testing must confirm `GET /health`, authenticated legal-chat refusal (with no corpus), scheduled-ingestion response, and webhook signature failures.
- No production frontend URL is supplied yet; configure CORS and Stripe return URLs before public release.

## Supabase project

Project ref: `mvcirldxcuvcuqvlmqxv`  
Region: `ap-south-1` (Mumbai)  
Edge Function: `carta-api`  
API: `https://mvcirldxcuvcuqvlmqxv.supabase.co/functions/v1/carta-api`
