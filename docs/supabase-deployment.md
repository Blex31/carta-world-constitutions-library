# CARTA Supabase deployment

Project ref: `mvcirldxcuvcuqvlmqxv`  
Region: `ap-south-1` (Mumbai)  
API URL: `https://mvcirldxcuvcuqvlmqxv.supabase.co`

## Live deployment record

- Supabase project: ACTIVE_HEALTHY.
- Migrations applied: `001_initial_carta_supabase_schema`, `002_policy_and_index_hardening`, `003_user_library_constraints`.
- Public schema: 18 tables with RLS enabled.
- Edge Function: `carta-api`, ACTIVE version 1. The deployed source is stored in `supabase/functions/carta-api/index.ts`.

## Browser configuration

Copy `.env.example` to `.env.local`. The Supabase publishable key may be used by the browser when RLS is enforced. Never expose a service-role key, database password, AI provider key or payment key through a `VITE_` variable.

## API routes

Public: health, library catalogue, official feed, verified legal document search and document lookup. Authenticated: personal bookmarks, highlights, notes, saved documents, preferences and subscription-status read. Administrator source controls require `app_metadata.role = admin`.

Legal chat, checkout, billing portal, payment verification and automated feed ingestion deliberately return a not-configured response until the relevant provider adapter, secret and tests exist.

## Production release gates

1. Set `CARTA_ALLOWED_ORIGINS` in Edge Function secrets to exact deployed frontend origins.
2. Configure Supabase Auth Site URL, redirect URL allow-list, SMTP sender and password reset/confirmation flows.
3. Provision the first admin role using a trusted server-side `app_metadata` operation.
4. Import only official, current, versioned documents whose licence and intended commercial/AI reuse are approved.
5. Implement provider-backed legal Q&A with source-grounded answers and citations, plus tested billing webhooks before enabling paid features.
6. Add approved publisher feed adapters and a scheduler. Candidate source rows are intentionally inactive.
7. Run real-user RLS tests, API HTTP smoke tests, dependency audit, browser E2E tests and backup/restore drills.

## Current data status

There are eight EAC jurisdiction records and eight official-source candidates. There are zero verified legal documents or full-text provisions. All source candidates remain inactive, `review_required` and not cleared for commercial use. This is a secure backend foundation, not yet a public production launch.
