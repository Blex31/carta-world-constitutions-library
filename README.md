# CARTA — World Constitutions Library

**Every Constitution. Every Country. In Plain Language.**

CARTA is a document-first legal information platform. It preserves official provenance, amendment history, effective dates and source rights while helping readers navigate constitutional and legal documents in plain language.

## Product targets

- **Web:** React + Vite single-page application (current implementation).
- **Android and iOS:** native Flutter applications (committed product requirement; separate client implementation).
- **Shared backend:** Supabase Postgres, Supabase Auth and the `carta-api` Edge Function. Web and mobile share one legal corpus, account system, API and citation model.

The native app is not yet included in the current React/Vite source tree. See [native mobile requirements](docs/native-widget-fcm.md) and the [Phase 3 legal library and mobile plan](docs/phase-3-legal-library-and-mobile.md).

## Stack

- React + Vite web frontend
- Flutter/Dart native Android and iOS clients (planned)
- Supabase Postgres, Auth and Edge Functions
- Supabase Row Level Security for user-owned data and publication controls
- Official publisher registry with explicit licensing and reuse metadata

## Supabase project

Project: `CARTA-World-Constitutions-Library`  
Project ref: `mvcirldxcuvcuqvlmqxv`  
Region: `ap-south-1` (Mumbai)  
API: `https://mvcirldxcuvcuqvlmqxv.supabase.co`

The live backend has migrations 001–007 and an active `carta-api` Edge Function. SQL for live migrations 004–005 still needs to be reconstructed and checked into this repository for a clean-install migration history. See [Supabase deployment and production handoff](docs/supabase-deployment.md).

## Current legal-library status

The live database currently contains eight EAC jurisdiction metadata records and eight inactive official-source candidates. It contains **zero verified legal documents and zero searchable legal-text chunks**. No source is cleared for commercial reuse, AI retrieval or offline redistribution. The current work is to confirm exact current texts and obtain rights that cover CARTA's web, mobile, search, AI and paid product uses.

See [EAC first-batch source review](docs/eac-first-batch.md).

## Legal-content rule

Do not publish a document as current or reusable until its official publisher, exact version, commencement/effective dates, amendments, attribution, licence and intended reuse rights have been checked. Public access is not the same as permission to reproduce, commercially redistribute, index for AI or cache offline.

The legal assistant must only use verified, current, rights-cleared documents and must refuse when no qualifying source passage is available.

## Development

1. Install Node.js 22 or later.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and set browser-safe Supabase values.
4. Run `npm run dev`.
5. Run `npm test`, `npm run typecheck` and `npm run build` before release.

Never put a Supabase secret/service-role key, database password, AI provider key or payment secret in a `VITE_*` variable. The publishable key is intended for client use with RLS and server-side authorization.

The Flutter app will be added as a separate native client and must use the same Supabase Auth and CARTA API. It must never connect directly to Postgres or contain server credentials.

## Project links

- [GitHub repository](https://github.com/Blex31/carta-world-constitutions-library)
- [Supabase project dashboard](https://supabase.com/dashboard/project/mvcirldxcuvcuqvlmqxv)
- [Architecture](docs/architecture.md)
- [Phase 3 legal library + mobile plan](docs/phase-3-legal-library-and-mobile.md)
