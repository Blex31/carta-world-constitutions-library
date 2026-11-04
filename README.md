# CARTA — World Constitutions Library

**Every Constitution. Every Country. In Plain Language.**

CARTA is a document-first library for national constitutions, regional instruments and selected international law, with plain-language explanations and source provenance.

## Project principles

- Prefer official primary sources and preserve source/version metadata.
- Do not present generated explanations as legal advice.
- Show jurisdiction, document version, effective date and official source for every legal text.
- Respect publisher licensing and re-use conditions. Do not scrape or redistribute sources without the necessary rights.
- Apply least-privilege database access and row-level security to all exposed Supabase tables.

## Current activation status

The project source is being transferred from the prepared working bundle. That bundle is currently Neon-configured; Supabase compatibility work is required before deploying migrations or functions to a Supabase project.

The initial package contains application source, ingestion research, jurisdiction metadata, schema migrations and tests. It does **not** contain a complete verified corpus of every constitution. EAC sources are candidates pending confirmation of current versions and reuse rights.

See `docs/activation-status.md` and `docs/data-sources.md` once the source tree has been committed.
