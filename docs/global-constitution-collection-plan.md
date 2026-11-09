# Global constitutional collection plan

**Prepared:** 9 November 2026  
**Product:** CARTA — World Constitutions Library  
**Collection target:** 193 UN Member States + two UN non-member observer states, with separately curated constitutional instruments for territories and special jurisdictions.

## Current verified baseline

The live Supabase jurisdiction directory now has 250 rows, correctly classified by the merged UN/M49 crosswalk:

| Live directory measure | Current value |
|---|---:|
| Total country/area directory records | 250 |
| UN Member States | 193 |
| UN non-member observer states | 2 |
| Other country/area records awaiting precise status review | 55 |
| Geographic gaps | 0 |
| Verified legal documents | 0 |
| Document sections/provisions | 0 |
| Searchable legal chunks | 0 |
| Approved commercial-use sources | 0 |

The 250 directory records are not 250 sovereign states and are not a claim of constitutional-text coverage. The global collection target is represented by 195 research assignments. The other 55 area records remain separate until their constitutional and territorial status is individually assessed.

## Important rights finding
The [PollsAfrica constitutional-source inventory](https://pollsafrica.com/constitutions), checked on 10 October 2026, is a useful Africa-wide discovery index: it lists 54 countries and reports PDF links for 47, including 27 links to official publishers and 20 copies hosted by PollsAfrica where the source allows hosting. PollsAfrica's inventory metadata is published under CC BY 4.0, and its open JSON file index is at https://pollsafrica.com/data/json/index.json. This metadata licence does **not** license the underlying constitution texts. Each linked edition still needs independent primary-source, version/currentness and CARTA-specific rights checks.


CARTA is planned as a commercial product with free and paid access, web/mobile reading, search, AI retrieval/summaries and potentially offline copies. Therefore every exact constitutional edition needs a rights basis that covers the actual intended uses.

The following well-known research collections can help identify a constitution, version or source lead, but they are **not** general commercial republication licences:

- [Constitute / Comparative Constitutions Project terms](https://www.constituteproject.org/content/terms): its current terms say content and software are for informational use and expressly prohibit commercial use.
- [WIPO Lex terms](https://www.wipo.int/en/web/wipolex/terms-of-use): reproduction of IP legal texts and translations is allowed for academic, research and non-commercial purposes; source/third-party terms may add restrictions.
- [Kenya Law terms](https://kenyalaw.org/terms-of-use/): raw NCLR material is offered under CC BY-NC 4.0; commercial redistribution, automated bulk extraction and AI/ML training require an explicit NCLR licensing agreement.
- [Laws.Africa commercial content licensing](https://laws.africa/platform/content/): a potential commercial integration route for participating African countries. Its packages distinguish indexing/retrieval from displaying law in the customer's product; obtain an order covering the exact countries, formats and use.

The text being publicly viewable, downloadable, government-hosted or labelled “official” is not alone enough to establish all CARTA reuse rights. Where a national statute excludes official legislative texts from copyright, record the specific law and obtain jurisdiction-qualified legal confirmation that the exact constitution and CARTA's intended uses are covered.

## What the queue records

`data/global-constitution-collection-queue.json` is the controlled research manifest for 195 assignments. It tracks:

- ISO code, display name, geographic region and UN membership/observer status.
- Research priority (Africa first, then remaining regions).
- Whether an official publisher/source lead has been identified.
- Candidate source URLs and a candidate instrument/version where an existing research record provides one.
- Instrument form, exact currentness, rights status, commercial/AI/translation/offline permissions.
- Whether complete text has actually been acquired, checksum, CARTA document identifiers and publication state.
- A concrete next action for each country.

**30 official/source leads have been identified**: the eight EAC candidates plus 22 additional African leads. These are source-discovery starting points only; all remain rights-review required, and no text is approved by inclusion in this queue.

## African first-wave source leads

The following are source-discovery starting points recorded in the queue. A link is not a rights approval or proof that the linked edition is current.

| Jurisdiction | Initial official/source lead | Version/currentness note |
|---|---|---|
| Burundi | [Presidency](https://presidence.gov.bi/2018/07/6271-2/) / [Constitutional Court](https://courconstitutionnelle.gov.bi/textes-fondamentaux/) | 2018 Constitution located; later amendment and official-language checks remain. |
| DR Congo | [Cour de Cassation](https://cassation.cd/textes-legaux/constitution-rdc) | Text identifies 2006 Constitution modified by Law 11/002 of 2011; later changes and Gazette history to verify. |
| Kenya | [Kenya Law](https://kenyalaw.org/legislation/) | NCLR licensing required for CARTA commercial redistribution, bulk extraction and AI use under current terms. |
| Rwanda | [RLRC Official Gazette text](https://www.rlrc.gov.rw/fileadmin/user_upload/RLRC/Laws_of_Rwanda_v2/Domestic_laws/Laws_in_force/1._Fundamental/1.1._National_Instruments/1.1.1._Constitution/1.1.1.1._Constitution_of_the_Rep._of_Rwanda_2023.pdf) | 2023 trilingual Gazette text located; currentness, controlling language and rights opinion pending. |
| Uganda | [Parliament](https://www.parliament.go.ug/page/constitution) | Parliament provides Constitution and amendment acts; confirm latest complete consolidation. |
| Botswana | [Parliament PDF](https://parliament.gov.bw/images/constitution.pdf) | Official-hosted text located; edition and all amendment instruments need reconciliation. |
| Ghana | [Judicial Service — Constitution](https://www.judicial.gov.gh/index.php/the-constitution) / [amendments](https://www.judicial.gov.gh/index.php/ammendments-of-the-constitution) | Official text and amendment page located; complete current consolidation and rights basis remain pending. |
| Malawi | [PPDA-hosted Fourth Revised Edition](https://ppda.mw/storage/documents/resources/THE%20CONSTITUTION%20OF%20THE%20REPUBLIC%20OF%20MALAWI.pdf) | Consolidates amendments through 31 January 2025 but states it does not replace the original Gazette text; obtain official confirmation and 2025–2026 check. |
| Namibia | [Government-hosted Constitution PDF](https://www.gov.na/documents/146489/641903/Namibia_Constitution.pdf/d2d4c4cd-3f19-ab0b-8bdb-8d5a5da3ee79) | Compare with later consolidated reference and verify all amendment lineage to the cut-off. |
| Nigeria | [Federal Ministry of Justice PDF](https://justice.gov.ng/wp-content/uploads/2020/09/Nigerian-Constitution.pdf) / [National Library repository record](https://nigeriareposit.nln.gov.ng/items/399df25a-52d0-4972-9365-c618cd3ddf5f) | Base text must be reconciled with all assented Fifth Alteration Acts, including the 2023 series. |
| South Africa | [Government Constitution page](https://www.gov.za/documents/constitution/constitution-republic-south-africa-1996-04-feb-1997) / [DoJ amendments register](https://www.justice.gov.za/constitution/amendments.html) | Available consolidated online text includes only the 17th Amendment; the 18th Amendment Act 3 of 2023 must be incorporated and checked. |
| Zambia | [Official constitutional review portal](https://www.constitution.gov.zm/) / [Act No. 13 of 2025](https://www.constitution.gov.zm/act-13-2025) | Act assented 18 December 2025; reconcile 2016 and 2025 changes into a full current version. |
| Zimbabwe | [Parliament Constitution page](https://www.parlzim.gov.zw/constitution-of-zimbabwe/) | Parliament-hosted 2013 Constitution located; later amendment Acts and current consolidated edition remain to verify. |
| The Gambia | [Ministry of Justice downloads](https://www.moj.gm/downloads) | Ministry lists 1997 Constitution (2002 revision) and a separate 2020 draft; do not treat the draft as enacted. |
| Sierra Leone | [Parliament Constitution page](https://www.parliament.gov.sl/constitution-of-sierra-leone.html) | Parliament's 1991 text is a source lead, not a consolidated version; verify all later amendment Acts, including those identified through 2022. |
| Angola | [National Assembly digital library](https://bi-digital.parlamento.ao/items/885395b6-825d-4605-89f7-2d44f9bdc039) | 2010 republication under Law 18/21 (16 August 2021); item-specific repository licence must be reviewed; later amendments to check. |
| Gabon | [Official Gazette — 2024 Constitution](https://journal-officiel.ga/21489-002-r-2024-/) / [promulgation decree](https://journal-officiel.ga/21491-0458-pr/) | New Constitution adopted by referendum and promulgated 19 December 2024; verify transition, commencement and post-2024 status. |
| Togo | [Official Gazette](https://jo.gouv.tg/node/15758) / [Constitutional Court copy](https://courconstitutionnelle.tg/download/loi-n-2024-005-du-06-05-2024-portant-constitution-de-la-republique-togolaise/) | Law 2024-005 of 6 May 2024; reconcile Constitutional Court decisions ES-00325 (24 Feb 2025) and C-001/25 (24 Mar 2025). |
| Benin | [SGG laws library](https://sgg.gouv.bj/documentheque/loi/) / [Law 2025-20](https://sgg.gouv.bj/doc/loi-2025-20/download) | Constitution 1990 as revised in 2019 and modified by Law 2025-20 of 17 December 2025; consolidate and check 2026 updates. |
| Senegal | [Government source — Constitution](https://forcesarmees.gouv.sn/dossiers/lois/loi-ndeg-2001-03-du-22-janvier-2001-portant-constitution-modifiee) / [Lexenegal revision history cross-check](https://www.lexenegal.sn/code/constitution-senegal) | Official base text is old; private Lexenegal index identifies revision laws through 2024-15 (19 Dec 2024). Obtain all Gazettes and an official current consolidation. |
| Mozambique | [Tribunal Supremo legislation catalogue](https://www.ts.gov.mz/legislacao/) | Catalogue lists the 2018 Constitution as the latest instrument; obtain Gazette edition and confirm all post-2018 amendments. |
| Algeria | [Official OCRC legal-text portal](https://www.ocrc.gov.dz/en/legal-texts) | 2020 constitutional amendment issued by Decree 20-442; obtain the Official Journal text and verify Arabic/French authority and later changes. |
| Cabo Verde | [National Assembly legislation register](https://www.parlamento.cv/constituicao/downloads_cr.php) / [Government Constitution page](https://www.governo.cv/governo/constituicao/) | 1992 Constitution, revised in 1995, 1999 and by Law 1/VII/2010; online consolidated text says it does not replace the Gazette. |
| Cameroon | [Presidency Constitution page](https://prc.cm/en/cameroon/constitution) / [Law 2026/002](https://prc.cm/en/news/the-acts/laws/8241-law-no-2026-002-of-14-april-2026-to-amend-and-supplement-the-constitution-of-2-june-1972-as-amended-and-supplemented-by-law-no-96-06-of-18-january-1996-and-law-no-2008-001-of-14-april-2008) | 1972 Constitution as amended in 1996 and 2008, plus Law 2026/002 of 14 April 2026; older consolidations must incorporate the 2026 Act. |
| Chad | [Presidency decree archive](https://presidencetchad.org/decrets/) / [FAOLEX version history](https://faolex.fao.org/en/documents/LEX-FAOC226894/constitution-de-la-republique-du-tchad-tcd-2023) | 2023 Constitution revised by Constitutional Law 001/PC/2025 of 3 October 2025; obtain the official 2025 Gazette and later changes. |
| Egypt | [National Election Authority legal library](https://www.election.eg/digital-library-laws) / [Ministry of Finance law library](https://mof.gov.eg/en/legislation/legislation) | 2014 Constitution amended in 2019; Ministry electronic copy is guidance only and the Official Gazette is the legal reference. |
| Burkina Faso | [Presidency constitutional texts](https://www.presidencedufaso.bf/textes-fondamentaux/) / [2026 Government programme](https://gouvernement.gov.bf/wp-content/uploads/2026/03/PND-2026-2030__RELANCE.pdf) | Presidency's displayed text says amended in 2015, while a 2026 Government programme cites Law 045-2023/ALT; a 2024 proposal also exists. Hold until enacted laws and proposal status are reconciled. |

The 22 additional leads beyond the EAC group were recorded on 9 November 2026. The legal/currentness and reuse review remains incomplete for all first-wave jurisdictions.

## Collection rules

A country can have more than one constitutional instrument, a transitional charter, or no single codified constitution. Do not force every entry into a single “constitution.pdf” slot. Before import, determine whether the relevant collection is:

1. One written constitution.
2. Several foundational constitutional instruments.
3. An uncodified/unwritten constitutional system.
4. A transitional or interim instrument (clearly labelled as such).
5. A special status requiring specialist review.

For a no-single-written-constitution system, CARTA should show that legal position and link the verified foundational sources rather than inventing a consolidated constitution.

## Release gate — every text, language edition and version

No text becomes publicly available until all applicable checks are complete:

1. **Identity:** exact jurisdiction, title, instrument type, language, source publisher and canonical HTTPS URL.
2. **Authority:** official publisher or a fully evidenced legal basis for another source.
3. **Currentness:** promulgation/publication, commencement, amendments, repeal, replacement, court orders and cut-off date checked.
4. **Language:** identify the official versions and which controls in a conflict. Never assume an English translation is authoritative.
5. **Completeness:** compare every article/section, schedule and annex against the official publication; document missing pages and OCR/manual corrections.
6. **Rights:** written permission, open licence, verified public-domain status or jurisdiction-qualified official-text legal opinion; specify web/mobile display, free/paid use, reproduction, redistribution, indexing/search/snippets, AI retrieval/embeddings/summaries, translations/derivatives and offline/device caching separately.
7. **Attribution/update:** publisher attribution, canonical link, version label, update cadence, correction and takedown obligations recorded.
8. **Integrity:** SHA-256 checksum, import record and source snapshot retained.
9. **Second review:** a second legal/editorial reviewer signs off the exact text and rights scope.
10. **Technical QA:** importer dry run, provision structure, full-text search, reader navigation, citations, account-safe My Library and mobile/web rendering verified.

A rights approval for one language or one edition does not automatically approve another translation, later edition, publisher compilation, annotations or graphics.

## Delivery batches

### Batch 1 — Africa (54 UN Member States)
Prioritise Africa because CARTA's first source work and user context are already concentrated here. The existing first-wave launch plan identifies 15 research priorities, but the target is to research all 54. Import the first documents that clear the full release gate; do not lower the rights or version standard to hit a number.

- Carry forward the eight EAC source candidates with their existing review flags.
- Research the remaining African member states using official gazettes, national parliaments, justice ministries, attorney-general portals and government printers.
- Track non-codified or transitional constitutional arrangements correctly.
- Keep Somalia, South Sudan, Tanzania/Zanzibar and other conflicting-version cases on specialist review until reconciled.

### Batch 2 — Europe and the Americas
Research national gazettes, official legislation databases and constitutional court/parliament publishers. Explicitly handle systems such as the United Kingdom and New Zealand that may require multiple foundational instruments rather than one codified text.

### Batch 3 — Asia and Oceania
Prioritise authoritative-language and translation rules, special administrative and federal arrangements, interim constitutional instruments and source-specific rights.

### Batch 4 — observer states and special jurisdictions
Maintain separate treatment of the Holy See and State of Palestine as UN observer states, and review the 55 other directory areas and separately catalogued constitutional instruments such as Zanzibar's Constitution.

## Technical path

1. Use the 195-entry manifest as the master acquisition queue.
2. Add or activate a publisher record only after authority and rights metadata are documented. All new publishers must start inactive and blocked.
3. Acquire the exact permitted source text through official downloads, written publisher delivery or licensed provider API. Do not scrape restricted aggregators.
4. Run `npm run import:constitutions -- --input <file>` in dry-run mode first. The importer requires a complete exact text, official HTTPS source, verified document status, accepted rights basis, commercial-use approval, rights evidence and provision structure.
5. Import only with the explicit `--apply` flag after legal and second-review sign-off.
6. Verify the live document, all sections/chunks, checksums, search, citations, web reader and Flutter reader.
7. Update the manifest's publication state only after verification.

The live database remains empty until these gates have been satisfied. This is deliberate.

## Current first-document work

- **Rwanda (RW):** primary first-corpus candidate; 2023 Gazette text located, but RLRC currentness/language confirmation and Rwanda-qualified legal opinion remain pending. The request is drafted at [Rwanda publisher request](rights-requests/rwanda-constitution-permission-request.md); it has not been sent.
- **Kenya (KE):** current official publisher route located; standard Kenya Law terms are not enough for CARTA's commercial/AI uses. NCLR licensing request drafted at [Kenya licensing request](rights-requests/kenya-nclr-licensing-request.md); it has not been sent.
- **Other EAC partners:** official source leads are recorded in [EAC first-batch source review](eac-first-batch.md). None is cleared for publication.

## Sources

- [UN Member States](https://www.un.org/about-us/member-states) — current membership list.
- [UN observer states](https://research.un.org/en/unmembers/observers) — observer-state status.
- [UN M49](https://unstats.un.org/unsd/methodology/m49/overview) — neutral geographic grouping.
- [Constitute terms](https://www.constituteproject.org/content/terms) and [CCP research datasets](https://comparativeconstitutionsproject.org/download-data/) — research/discovery only; commercial-use restriction applies.
- [WIPO Lex terms](https://www.wipo.int/en/web/wipolex/terms-of-use) — non-commercial reproduction permission and third-party source restrictions.
- [Laws.Africa commercial licensing](https://laws.africa/platform/content/) — potential commercial provider to evaluate.
- [WIPO copyright FAQ](https://www.wipo.int/en/web/copyright/faq-copyright) — public availability online does not automatically make a work public domain.

**Coverage statement rule:** the home screen and store listing must report only the number of legally verified, currently effective, rights-cleared documents that are actually published. The 195 queue entries represent research scope, not current coverage.
