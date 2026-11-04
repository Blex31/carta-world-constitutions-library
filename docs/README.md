# CARTA documentation index

- `architecture.md` — React/Vite + Neon services and security boundaries.
- `data-sources.md` — authoritative legal publishers, discovery catalogues and rights rules.
- `eac-first-batch.md` — the eight EAC partner-state publisher candidates, version risks and rights gates.
- `constitution-ingestion.md` — review workflow and importer format.
- `legal-ai.md` — legal assistant retrieval flow, guardrails and test cases.
- `monetization-and-sync.md` — account library and CARTA Plus billing model.
- `native-widget-fcm.md` — future Android/iOS widget and notification work.
- `release-checklist.md` — launch validation.
- `activation-status.md` — current external setup blockers and verification status.
- `../scripts/audit-coverage.mjs` — per-jurisdiction official-source and verified-text coverage report.

Migration order: `001_initial_schema.sql`, `002_source_registry.sql`, `003_seed_jurisdictions.sql`, `004_official_feed_sources.sql`, `005_official_national_sources.sql`, `006_official_daily_sources.sql`, `007_feed_poll_index.sql`, `008_chunk_section_uniqueness.sql`, `009_eac_constitution_sources.sql`.
