# CARTA import playbook — rights-gated, Kenya first

This playbook turns "add all the constitutions" into a process that can survive legal review.
CARTA never bulk-imports constitutional text. Every text enters the library only after the
publisher route, the exact current version, and a commercial-reuse rights basis are documented.
The importer (`scripts/import-constitution-documents.mjs`) enforces the same gates mechanically.

## The five gates (all must pass before `--apply`)

1. **Official publisher source registered and marked official** in `legal_sources`.
2. **Rights cleared at source level**: `license_status` in
   (`approved`, `public_domain_verified`, `open_license`, `permission_granted`, `official_text_exclusion`),
   `commercial_use_allowed = true`, an HTTPS `rightsEvidenceUrl`, and substantive rights notes
   (20+ characters). `official_text_exclusion` additionally requires a documented legal opinion
   (`rightsReviewStatus = legal_opinion_on_file`).
3. **Exact version verified**: current consolidation, amendment cut-off, authoritative language.
4. **Document bundle prepared** (`data/import/constitutions.json`): complete official text,
   per-provision sections, HTTPS official URL, document-level rights evidence.
5. **Dry run passes**: `node scripts/import-constitution-documents.mjs` (then `--apply`).

Check readiness at any time:

```bash
node scripts/import-readiness-report.mjs                 # all jurisdictions
node scripts/import-readiness-report.mjs --jurisdiction KE   # Kenya focus (exit 1 while gated)
```

## Kenya first (current status: gated on NCLR licence)

- Rights request drafted: [`docs/rights-requests/kenya-nclr-licensing-request.md`](rights-requests/kenya-nclr-licensing-request.md)
  — National Council for Law Reporting / Kenya Law.
- Kenya Law's terms prohibit automated bulk extraction, commercial redistribution and AI/ML
  training without an explicit NCLR licensing agreement. The Presidential Library's archival
  2010 copy is not a substitute for a verified current consolidation.
- **Do not import** any Kenya text until the NCLR agreement (or another documented rights basis)
  is signed and recorded in the source registry via the Sources page rights-review form.
- Once cleared: register/confirm the source record, prepare the bundle (2010 Constitution,
  current consolidation), dry run, `--apply`, then re-run the readiness report —
  Kenya's `constitution_status` flips to `verified_current` and the text becomes searchable
  and eligible for legal Q&A.

## First African wave (15 jurisdictions)

Wave 1 — EAC partner states (source candidates in
[`data/eac-source-candidates.json`](../data/eac-source-candidates.json), all
`metadata_only` / `review_required` until cleared):

| ISO | Country | Official publisher route | State |
|-----|---------|------------------------|-------|
| BI | Burundi | Presidency / Constitutional Court | Version verification pending |
| CD | DR Congo | Court of Cassation | 2011 revision; Gazette history pending |
| KE | Kenya | NCLR / Kenya Law | **Licence request pending — first priority** |
| RW | Rwanda | RLRC / Official Gazette | Candidate statutory basis (Law 055/2024 art. 282) under counsel review |
| SO | Somalia | MOIFAR / Villa Somalia | **Hold** — 2012 vs 2026 instrument conflict, needs legal reconciliation |
| SS | South Sudan | Ministry of Justice | Latest consolidation pending |
| TZ | Tanzania | OAG / Parliament | 2005 consolidation vs 2025 document must be reconciled |
| UG | Uganda | ULRC | Subscription access and amendment cut-off pending |

Wave 2 — next seven (all start `review_required`; publisher route to be confirmed before
any text is sourced):

| ISO | Country | Publisher route to confirm |
|-----|---------|---------------------------|
| NG | Nigeria | Federal Ministry of Justice / Official Gazette |
| GH | Ghana | Attorney-General's Department / Ghana Publishing |
| ZA | South Africa | Department of Justice / Constitutional Court |
| ET | Ethiopia | House of the People's Representatives |
| EG | Egypt | Official Gazette / State Information Service |
| MA | Morocco | Bulletin Officiel |
| SN | Senegal | Journal Officiel |

Wave 2 countries need the same preflight treatment as Wave 1: a research note under
`docs/country-research/`, a rights-request letter under `docs/rights-requests/`, and a
source record that stays inactive until the rights review is recorded.

## Operating rules (unchanged)

- Sources start inactive, `review_required`, commercial use blocked.
- Discovery repositories (Constitute, WorldLII, SAFLII, ULII) are for discovery only —
  never for republication or AI retrieval.
- A blank coverage row means "not yet verified", not "no constitution".
- Every import is dry-run first; `--apply` only after the readiness report is green.
