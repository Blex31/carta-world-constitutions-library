# CARTA — World Constitutions Library

**Every Constitution. Every Country. In Plain Language.**

CARTA is a document-first library for national constitutions, regional instruments and selected international law, with plain-language explanations and source provenance.

## Project principles

- Prefer official primary sources and preserve source/version metadata.
- Do not present generated explanations as legal advice.
- Show jurisdiction, document version, effective date and official source for every legal text.
- Respect publisher licensing and re-use conditions. Do not scrape or redistribute sources without the necessary rights.
- Apply least-privilege database access and row-level security to all exposed Supabase tables.

## Repository transfer status

This repository currently contains the CARTA project overview only. The prepared 41-file working bundle remains separate and has **not yet been committed as source files**.

The bundle currently targets Neon. Supabase compatibility work is required before its migrations and API functions can be deployed to Supabase.

## Initial package scope

The prepared bundle contains the React application, ingestion research, jurisdiction metadata, schema migrations, API function source, and tests. It does **not** contain a complete verified corpus of every constitution. EAC source entries are candidates pending confirmation of current versions and reuse rights.

## Useful files in the prepared bundle

- `docs/activation-status.md`
- `docs/data-sources.md`
- `docs/eac-first-batch.md`
- `docs/constitution-ingestion.md`

No production database or legal-text corpus has been deployed from this repository yet.
