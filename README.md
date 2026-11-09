# CARTA — World Constitutions Library

**Every Constitution. Every Country. In Plain Language.**

CARTA is a document-first legal information platform. It preserves official provenance, amendment history, effective dates and source rights while helping readers navigate constitutional and legal documents in plain language.

## Product

- **Web:** React + Vite.
- **Android and iOS:** Flutter native clients under `apps/mobile`.
- **Shared backend:** Supabase Postgres, Supabase Auth and the `carta-api` Edge Function.
- **Personal library:** saved documents, bookmarks, highlights and private notes.
- **Legal research:** retrieval restricted to verified, current, official and rights-cleared legal passages.
- **Publisher updates:** source-scoped feed ingestion, with publisher approval and rights checks.

The first Flutter client and the initial web/mobile foundation have been merged into `main`. Build checks are automated through GitHub Actions. Physical-device acceptance, store signing and public web deployment remain release tasks.

## Current directory and corpus status — 9 November 2026

The live Supabase directory contains 250 country/area records:

| Classification | Live count |
|---|---:|
| UN Member States | 193 |
| UN non-member observer states | 2 |
| Other country/area records awaiting precise status review | 55 |
| Geographic metadata gaps | 0 |

The legal corpus is still empty: **0 verified legal documents, 0 provisions/sections and 0 searchable chunks**. Eight East African official-source candidates are registered, but all remain inactive and rights-review-required. There are no sources cleared for commercial reuse.

The [global constitutional collection queue](data/global-constitution-collection-queue.json) tracks 195 assignments (193 members + two observers). Africa's 54 UN Member States are the first research wave. The queue records official source leads, version status, rights evidence, currentness and publication state. Its entries are research tasks, not published coverage.

See the [global collection plan](docs/global-constitution-collection-plan.md), [African corpus plan](docs/africa-first-wave-corpus-plan.md), and [EAC source review](docs/eac-first-batch.md).

## Legal-content rule

Do not publish a legal document as current or reusable until its official publisher, exact edition, commencement/effective dates, amendments, language precedence, attribution and intended reuse rights have been checked.

CARTA's rights review must separately cover free/paid web and mobile display, reproduction/redistribution, search/indexing/snippets, AI retrieval/embeddings/summaries, translations/derivatives and offline/device copies. Public access or an official government URL is not, by itself, permission for these uses.

The importer in `scripts/import-constitution-documents.mjs` enforces the source, version, complete-text and commercial-rights gates. Dry-run first; import only after the legal and second-review sign-offs. The legal assistant must refuse to invent an answer when no qualifying passage is available.

## Repository and backend

Project: `CARTA-World-Constitutions-Library`  
Supabase project ref: `mvcirldxcuvcuqvlmqxv`  
Region: `ap-south-1` (Mumbai)  
API: `https://mvcirldxcuvcuqvlmqxv.supabase.co`

The live `carta-api` Edge Function is active. The repository contains the Supabase migrations and Flutter/web clients. The global jurisdiction classification migration is applied to live Supabase. Reconstructed historical migrations 004/005 still need validation in a disposable clean environment before claiming a fully reproducible fresh install.

## Development

1. Install Node.js 22 or later.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and set browser-safe Supabase values.
4. Run `npm run dev`.
5. Run `npm test`, `npm run audit:global-queue`, `npm run typecheck`, `npm run syntaxcheck` and `npm run build`.

Never place a Supabase service-role key, database password, AI provider key, payment secret or other backend credential in a browser variable, mobile binary or GitHub source file. Use Supabase Edge Function secrets for backend credentials.

## Project links

- [GitHub repository](https://github.com/Blex31/carta-world-constitutions-library)
- [Supabase project dashboard](https://supabase.com/dashboard/project/mvcirldxcuvcuqvlmqxv)
- [Master launch checklist](docs/launch-checklist.md)
- [Global constitution collection plan](docs/global-constitution-collection-plan.md)
- [Architecture](docs/architecture.md)
- [Supabase deployment handoff](docs/supabase-deployment.md)
