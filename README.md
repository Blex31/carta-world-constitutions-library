# CARTA — World Constitutions Library

**Every Constitution. Every Country. In Plain Language.**

CARTA is a document-first legal information library. It is designed to preserve official provenance, version history and source rights while making constitutional and legal documents easier to navigate.

## Stack

- React + Vite frontend
- Supabase Postgres, Auth and Edge Functions
- Supabase Row Level Security for user-owned data and publication controls
- Official publisher registry with explicit licensing and reuse metadata

## Supabase project

Project: `CARTA-World-Constitutions-Library`  
Project ref: `mvcirldxcuvcuqvlmqxv`  
Region: `ap-south-1` (Mumbai)  
API: `https://mvcirldxcuvcuqvlmqxv.supabase.co`

The live project has three migrations applied and an active `carta-api` Edge Function. See [`docs/supabase-deployment.md`](docs/supabase-deployment.md) for the deployment record, configuration and outstanding release gates.

## Local development

1. Install Node.js 22 or later.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and adjust the browser-safe Supabase values as needed.
4. Run `npm run dev`.
5. Before release, run `npm test`, `npm run typecheck` and `npm run build`.

Never put a Supabase secret/service-role key, database password, AI provider key or payment secret in a `VITE_` variable. The publishable key is intended for frontend use and relies on the database RLS policies.

## What is deployed today

- Core tables for jurisdictions, official sources, legal documents, sections, searchable chunks, feed items, personal library, conversations and subscription status.
- RLS policies and least-privilege API grants.
- EAC country/source metadata for Burundi, DR Congo, Kenya, Rwanda, Somalia, South Sudan, Tanzania and Uganda.
- `carta-api` public-read/authenticated-user/admin API routes.

The database currently contains **metadata only**: eight jurisdictions, eight source candidates and zero verified legal documents. Source candidates remain inactive and rights review is required. The legal assistant, live feed polling and paid billing are intentionally disabled until the appropriate provider adapters, permissions and credentials are configured.

## Legal-content rule

Do not publish a document as current or reusable until its official publisher, exact version, commencement/effective dates, amendments, attribution, licence and commercial/AI reuse rights have been checked. In particular, Kenya Law/NCLR bulk extraction, commercial redistribution and AI use require written permission for the intended use.

## Project history

The `neon/` directory and `neon.ts` preserve the original Neon-oriented backend implementation as migration history/reference. They are **not** the live backend. Supabase is the current runtime.
