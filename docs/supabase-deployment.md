# CARTA Supabase deployment and production handoff

Project ref: `mvcirldxcuvcuqvlmqxv` (Mumbai / `ap-south-1`)

## Frontend variables

Copy `.env.example` to `.env.local`. `VITE_SUPABASE_URL`, the publishable key and `VITE_CARTA_API_URL` are browser configuration. Never set a service-role/secret key in a `VITE_` variable.

## Supabase backend

The live project has the CARTA schema applied and the `carta-api` Edge Function deployed. Its gateway JWT verification is disabled because the API manually validates signed-in users with Supabase Auth and accepts anonymous public reads; user-scoped database calls still carry the caller JWT and are evaluated by RLS. Do not remove manual auth checks or use a service-role client in this function.

Public routes: `/health`, `/api/library`, `/api/feed`, `/api/search`, `/api/documents/:id`. Authenticated routes: `/api/library/me`, `/api/billing/status`; source administration requires `app_metadata.role = admin`. Legal chat, paid checkout, billing portal, verification and automatic ingestion intentionally return a configuration response until providers, a legal retrieval corpus and source rights are configured.

## First operational tasks

1. Set `CARTA_ALLOWED_ORIGINS` in Edge Function secrets to the exact production web origin(s).
2. Configure Supabase Auth site URL, redirect URLs, password policy and a production SMTP sender. Test confirmation and password reset flows.
3. Set the first administrator role in trusted `app_metadata` using a server-side administrative operation; do not use user-editable `user_metadata`.
4. Add signed provider credentials using Supabase Edge Function secrets, then implement and test the AI, billing and publisher adapters separately.
5. Verify each legal document's official version, effective dates, amendments, attribution and commercial/AI reuse permission before import.
6. Configure a reviewed scheduler; source registry rows are deliberately inactive until this work is complete.
7. Run database security/performance advisors, RLS integration tests, Edge Function tests, dependency audit, backup/restore test and end-to-end browser tests before public launch.

## Current limitations

The live database currently contains EAC jurisdiction metadata and source candidates only. It does not contain a verified constitutional text corpus. Kenya Law reuse requires written NCLR permission for the intended use. Somalia and other candidate sources need current-version reconciliation. The AI and subscription integrations are not enabled.
