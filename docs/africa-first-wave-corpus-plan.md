# CARTA — African corpus launch plan

**Prepared:** 8 November 2026  
**Purpose:** Build a legally defensible first launch collection without confusing a country directory, a downloadable PDF, or a permissive copyright rule with a verified, reusable legal document.

## Launch coverage target

- **First public release target:** 15 verified African constitutional collections.
- **Stretch target:** 25 verified African constitutional collections.
- **Regional expansion target:** all 54 African UN member states, with separate treatment for disputed territories and special jurisdictions.
- **Long-term global target:** coverage across the 193 UN member states, the two UN observer states where appropriate, and separately labelled territories/dependent jurisdictions.

These are delivery targets, not current coverage claims. The live CARTA database currently has 250 jurisdiction rows, but only eight are classified as sovereign states and UN members. The other 242 rows remain unclassified. The live database has zero legal documents, zero provisions, zero searchable chunks and zero approved publisher sources. Do not advertise the 250 rows as 250 countries or as 250 available constitutions.

## What the research gives us

1. The PollsAfrica constitutional-source inventory (checked October 2026) has sourcing leads for all 54 African countries and identifies PDF copies for 47: 27 hosted by official publishers and 20 hosted by PollsAfrica where its source notes say hosting was permitted. The dataset is a discovery tool, not a blanket licence for commercial redistribution of the underlying texts.
2. Open Law Africa's legal-information copyright index (last updated July 2023) identifies permissive public-domain treatment for official legal information in 53 of 55 African jurisdictions it reviewed. This is an important screening signal, not a substitute for checking whether the rule is still current, exactly which text is covered, or whether any publisher formatting, annotations, compilation, metadata or third-party material is protected.
3. CARTA must separately check whether each instrument is currently in force, whether it has been amended or superseded, which language version is authoritative, and whether the proposed use covers paid web/mobile display, indexing, AI retrieval and summaries, translation/plain-language derivatives and offline device copies.

Research references:
- PollsAfrica constitution source inventory: https://pollsafrica.com/constitutions
- Open Law Africa copyright research: https://www.openlawafrica.org/copyright-in-legal-information-africa
- WIPO Lex national legislation references are linked from the Open Law Africa country entries: https://www.wipo.int/wipolex/en/

## Proposed first-wave candidate pool

The following 15 are **research priorities only**, not approved sources and not a claim that their current texts are ready to publish:

1. Kenya
2. Rwanda
3. Uganda
4. Burundi
5. Democratic Republic of the Congo
6. Botswana
7. Ghana
8. Malawi
9. Namibia
10. Nigeria
11. South Africa
12. Zambia
13. Zimbabwe
14. The Gambia
15. Sierra Leone

Selection should be adjusted after the current-text check, primary-source quality, language/translation availability and a rights review. If a candidate cannot pass the gates, replace it with another African jurisdiction; do not weaken the gates to reach 15.

## Special review / legal-hold queue

- **Somalia:** reconcile the 2012 Provisional Constitution and subsequent amendment process with official 2026 instruments and the status of the text said to have been approved and signed in March 2026. Keep out of the current corpus until a qualified Somali reviewer confirms the authoritative instrument, commencement and constitutional status.
- **South Sudan:** obtain a complete consolidated text and reconcile the 2011 Transitional Constitution with amendment instruments and current effective changes.
- **Tanzania:** reconcile the 2025 official publication(s) against the current consolidated text; treat Zanzibar's Constitution as a separate instrument.
- **Sudan:** multiple transitional instruments and competing constitutional positions require specialist verification.
- **Eritrea:** do not invent a constitution-in-force entry; distinguish the ratified 1997 text from whether it was promulgated/entered into force.
- **Libya and Niger:** distinguish permanent constitutions from interim constitutional declarations or transitional charters. A legally operative interim text may be included as such, not mislabeled as a permanent constitution.
- **Equatorial Guinea and Guinea:** the 2023 Open Law Africa copyright index does not identify a full official-text exemption. These require specific permission or legal clearance rather than assuming public-domain status.

## Required release gate for every document

No document is publishable until all of the following are recorded:

- Jurisdiction and instrument type are correct. Distinguish constitution, transitional constitution, constitutional declaration, charter, amendment, statute and treaty.
- Primary official publisher and canonical HTTPS source are recorded.
- Exact text is complete, machine-readable and checked against the official publication.
- Currentness is verified against all later amendment, commencement, repeal and replacement instruments up to a dated cut-off.
- Official-language versions and language-precedence rules are recorded. A community translation or third-party translation is separately rights-checked.
- Rights basis is documented for each exact edition and each use: free and paid display, copying/redistribution, search/indexing, excerpts/snippets, AI retrieval/embeddings/summaries, translations/derivatives and offline device copies.
- Any legal opinion or written permission is linked to the source and document record, with attribution, permitted scope, exclusions, expiry, update and takedown obligations.
- Full text and provision structure are reconciled; a second reviewer signs off.
- SHA-256 checksum and version label are recorded.
- The importer passes dry-run validation; the resulting document, sections and chunks are checked in the live database.
- Reader, article navigation, search and legal-assistant citations are tested against the imported version.

The existing importer deliberately blocks imports unless the document is verified, the source is official, commercial use is explicitly cleared and rights evidence is present. Preserve that safeguard.

## Batch plan

### Batch 0 — fix directory metadata
- Correct the 242 unclassified jurisdiction rows using a reviewed ISO-3166 / UN crosswalk.
- Record sovereign states, UN membership, observer states, territories, dependencies, special jurisdictions and international instruments as distinct types.
- Populate continent and region consistently.
- Do not change a jurisdiction's legal/constitutional status merely because a country name exists.
- Verify the target denominator: 193 UN members, two observer states, plus separately listed territories/dependencies. Avoid using the 250 total as the country count.

### Batch 1 — first 15
- Run source/version/right checks on the candidate pool.
- Clear and import only the documents that pass all gates.
- Aim for 15 verified collections; publish a smaller number rather than lowering the standard.
- Launch language editions only when each is itself verified and cleared.

### Batch 2 — expand Africa
- Review the remaining African countries and special cases.
- Target 25 verified collections, then all 54 African UN member states where valid current instruments and rights permit.
- Add non-constitution documents (amendments, key acts, treaties and court decisions) only as a separately scoped product expansion.

### Batch 3 — global coverage
- Expand by region in controlled batches.
- Prioritise countries with an official, machine-readable current consolidated text, clear version lineage and a clear reuse basis.
- Keep countries with no single written constitution accurately labelled; do not fabricate a single document to fill a metric.

## Current project blockers

- No legal source is active or commercially cleared in the live database.
- No legal document has been imported.
- The eight EAC source records all remain inactive and rights-review-required.
- Somalia, South Sudan and Tanzania have additional currentness/consolidation questions.
- The Open Law Africa index is from 2023 and must be refreshed against current laws before a 2026 launch decision.

## Acceptance dashboard

| Metric | Current live value | First release goal |
|---|---:|---:|
| Jurisdiction directory rows | 250 | Correctly classified, with territories separate |
| Sovereign states / UN members classified | 8 | 193 global directory records correctly classified |
| Approved commercial-use sources | 0 | At least one for each published document |
| Verified current documents | 0 | 15 target; smaller number acceptable if rights-limited |
| Provisions / searchable chunks | 0 / 0 | Complete indexed structure for each published document |
| Approved official update publishers | 0 | At least one end-to-end tested publisher |
| AI answers with exact provision citations | Not enabled | Pass evidence and no-evidence test suite |

**Launch rule:** CARTA may show the global directory before full corpus coverage, but every country must clearly display whether it has a verified current document. Only verified, rights-cleared documents count toward the coverage claim.
