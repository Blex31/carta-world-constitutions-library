# Phase 3 execution status — Rwanda first corpus candidate

**Updated:** 5 November 2026  
**Product scope:** React/Vite web + Flutter Android/iOS, sharing one Supabase backend.

## Current verified state

- Live Supabase: 250 global jurisdiction catalogue records (including 8 EAC partner states), 8 EAC candidate sources, 0 legal documents, 0 provisions, 0 searchable chunks and 0 feed items.
- Rwanda candidate source slug: `rwanda-minijust`.
- Rwanda source remains `is_active=false`, `license_status=review_required`, `commercial_use_allowed=false`.
- Candidate text: Constitution of the Republic of Rwanda, Official Gazette n° Special of 04/08/2023; RLRC and Parliament copies identified; three official language versions; 176 articles.
- Currentness and adopted-language precedence need RLRC / Rwanda counsel confirmation.
- Law N°055/2024 Article 282 is a candidate statutory basis for official-text exclusion, but a Rwanda-qualified legal opinion covering CARTA's actual intended uses has not been received.
- No legal text has been downloaded, extracted, hashed, reviewed, imported, published or indexed for AI yet.

## Legal-rights technical changes

Live migrations 006 and 007:
- Add `official_text_exclusion` as a distinct rights category without conflating it with open licence or public domain.
- Make public document, section and chunk reads require both document-level and official-source-level eligible rights status.
- Require a documented legal opinion, HTTPS evidence URL and substantive notes at source and document level before an official-text-exclusion status can be recorded.
- The importer and admin API enforce the same gate.

These controls do not approve the Rwanda document. The source continues to be blocked pending written legal confirmation.

## Deployment verification

- `carta-api` Edge Function version 9 is active.
- Live health route: HTTP 200.
- Live public library route: HTTP 200.
- Library response correctly contains no legal documents and coverage indicates eight metadata-only jurisdictions.
- Supabase Security Advisor: no current security lints.
- Supabase Performance Advisor: one RLS initialization-plan warning for the ingestion-run admin read policy and unused-index notices. The latter are expected to be reviewed after meaningful production workload exists.

## Outstanding work

1. Receive written RLRC confirmation on current version, later amendments, and which adopted language controls under Constitution Article 96(4).
2. Obtain a Rwanda-qualified legal opinion applying Article 282 to web/mobile display, commercial use, indexing, AI retrieval and summaries, and offline downloads.
3. Download the exact official Gazette text, extract it faithfully, reconcile all 176 article headings and text against the source, record SHA-256, and have a second reviewer sign off.
4. Run importer dry-run, then import only when legal review and rights gates pass.
5. Verify document reading, full-text search, citations and version metadata through web and API.
6. Start Flutter client work against the same API contract; do not fork the corpus or user library.
7. Reconstruct and check in live migrations 004 and 005; they are applied in Supabase but currently missing as SQL files from the GitHub repository.

## Publisher request

A copy-ready request to RLRC is in [Rwanda publisher currentness and reuse request](rights-requests/rwanda-constitution-permission-request.md). It has been drafted and saved to the repository; it has **not** been sent.
