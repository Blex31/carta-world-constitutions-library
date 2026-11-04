# East African Community first constitutional corpus batch

**Research checked:** 5 November 2026  
**Coverage basis:** the EAC lists eight Partner States: Burundi, Democratic Republic of the Congo, Kenya, Rwanda, Somalia, South Sudan, Tanzania and Uganda.

## Live import status

The live Supabase database currently contains eight jurisdiction rows and eight official-source candidates. It has **zero legal documents, zero provisions and zero searchable chunks**. Every source is deliberately inactive, `review_required` and `commercial_use_allowed=false`. This is a source-verification queue, not an imported legal corpus.

## First-pass source/version review

| Partner State | Official source candidates | Version question before publication | Current gate |
|---|---|---|---|
| Burundi (BI) | [Presidency](https://presidence.gov.bi/2018/07/6271-2/), [official PDF](https://www.presidence.gov.bi/wp-content/uploads/2018/07/constitution-promulguee-le-7-juin-2018.pdf), [Constitutional Court](https://courconstitutionnelle.gov.bi/textes-fondamentaux/) | Constitution promulgated 7 June 2018. Check later amendments and language treatment for Kirundi/French. | Rights and consolidation review pending. |
| DR Congo (CD) | [Presidency / Journal Officiel PDF](https://www.presidence.cd/uploads/files/Constitution%20de%20la%20RDC%20%202011.pdf), [Cour de Cassation](https://cassation.cd/textes-legaux/constitution-rdc) | Located text is the 2006 Constitution modified by Law No. 11/002 of 20 January 2011. Check later constitutional amendments and Gazette notices. | Current-version and rights review pending. |
| Kenya (KE) | [Kenya Law/NCLR](https://new.kenyalaw.org/legislation/), [terms of use](https://kenyalaw.org/terms-of-use/), [Presidential Library archival copy](https://www.presidentiallibrary.go.ke/index.php/documents/constitution-kenya-2010) | Use a current consolidated version and a known amendment cut-off. The Presidential Library labels its 2010 archival copy public domain, but that does not itself prove it is consolidated/current. | NCLR's terms say raw documents are CC BY-NC 4.0 and prohibit automated bulk extraction, commercial redistribution and AI/ML training without express licence. Obtain legal review and written licence or a verified independent public-domain basis. |
| Rwanda (RW) | [RLRC current Laws of Rwanda PDF](https://www.rlrc.gov.rw/fileadmin/user_upload/RLRC/Laws_of_Rwanda_v2/Domestic_laws/Laws_in_force/1._Fundamental/1.1._National_Instruments/1.1.1._Constitution/1.1.1.1._Constitution_of_the_Rep._of_Rwanda_2023.pdf), [Parliament-hosted Official Gazette copy](https://www.parliament.gov.rw/fileadmin/user_upload/Parliament/STATUTORY_DOCUMENTS/The_Constitution_of_the_Republic_of_Rwanda.pdf) | Official Gazette n° Special of 04/08/2023; trilingual Kinyarwanda/English/French publication; 176 articles. RLRC says its Laws of Rwanda collection is updated daily. Targeted 2024–2026 Gazette search did not locate a later constitutional amendment; confirm currentness and language precedence with RLRC/counsel. | Law N°055/2024 Article 282 excludes official legislative texts and official translations from copyright protection. This is a candidate rights basis, not yet cleared for CARTA's specific web/mobile, AI and offline uses. Source remains inactive and commercial use false pending local counsel/publisher confirmation. |
| Somalia (SO) | [Villa Somalia](https://villasomalia.gov.so/constitution-2/), [Ministry of Interior constitution catalogue](https://moifar.gov.so/en/page/federal-constitution), [Prime Minister's Office amendments page](https://opm.gov.so/en/policies/amendments-to-the-provisional-constitution-of-the-federal-republic-of-somalia-chapters-1-4) | Government pages say the 2026 Constitution was approved 4 March and signed 8 March 2026. Another official page published 22 June 2026 describes amendments to the 2012 Provisional Constitution with an effective date of 30 March 2024. The process and term changes were disputed. Reconcile the complete enacted text, promulgation instrument, commencement, supersession and federal-state position with a qualified Somali legal reviewer. | **Legal hold.** Do not label current or import until reconciled. |
| South Sudan (SS) | [Ministry of Justice 2011 Transitional Constitution PDF](https://mojca.gov.ss/wp-content/uploads/2023/04/The-Transitional-Constitution-of-the-Repulic-of-South-Sudan.pdf), [Ministry constitution page](https://mojca.gov.ss/constitution-and-government/) | The located document is the original 2011 Transitional Constitution. Obtain a complete consolidated version with all amendments, including the 2015 amendment instruments and later effective changes. | Consolidation and rights review pending. |
| Tanzania (TZ) | [Parliament Constitution page](https://www.parliament.go.tz/documents/constitution-of-tanzania), [NPS publications](https://nps.go.tz/publications/constitution), [OSG e-Library](https://elibrary.osg.go.tz/items/13d790c1-5bdd-42d8-8990-392dc3f1b5b6) | Parliament lists a 6 February 2025 Constitution upload and NPS lists a 4 March 2025 publication. The older OSG English edition explicitly consolidates through the 14th Amendment of 2005 only; do not treat it as current. Verify the actual 2025 text and subsequent amendments. Catalogue Zanzibar's Constitution separately. | Current English text and rights review pending. |
| Uganda (UG) | [Parliament's Constitution page](https://www.parliament.go.ug/page/constitution), [Uganda Law Reform Commission](https://publications.ulrc.go.ug/constitution/29), [ULII consolidated 31 Dec 2023 text](https://ulii.org/en/akn/ug/act/statute/1995/constitution/eng%402023-12-31) | ULII identifies its consolidated version at 31 December 2023 and lists amendments through 2018. It is a useful cross-check, not the primary official publisher. | Parliament page states all rights reserved; ULRC lists subscription access; ULII general reuse is CC BY-NC 4.0 with bulk scraping/download prohibited. Obtain an authorised commercial licence or independent public-domain determination. |

## Rights policy

No source is approved for full-text ingestion yet. A source being official, downloadable or publicly viewable does not automatically permit CARTA to reproduce or redistribute it.

Kenya Law/NCLR terms expressly restrict automated bulk extraction, commercial redistribution and AI/ML training without an explicit licence; its raw-document CC BY-NC 4.0 route does not cover CARTA's commercial model. See [Kenyalaw Terms of Use](https://kenyalaw.org/terms-of-use/).

ULII likewise states that its general primary and secondary law content is CC BY-NC 4.0, prohibits scraping/bulk downloading and requires permission for bulk access; special collections may have different terms. See [ULII Terms of Use](https://ulii.org/en/terms-of-use/).

Potential commercial data licensing is available through [Laws.Africa's commercial legislation API](https://laws.africa/api), with country-specific plans and separate permissions. Evaluate price and scope before selecting it; do not assume its free non-commercial plan is suitable for CARTA Plus.

For each exact publisher/document/language edition, obtain rights that explicitly cover web and mobile display, commercial redistribution, indexing, AI retrieval/embeddings, summaries/translations and offline device copies. Record attribution, licence scope, expiry, update and takedown requirements.

## Import workflow

The current importer is `scripts/import-constitution-documents.mjs`. It requires a complete non-placeholder text, official HTTPS source, verified status, approved licence/public-domain/permission state, `commercialUseAllowed=true`, a rights-evidence URL and rights notes, provision records and dates. Use a dry run before applying.

The live runtime is Supabase, not Neon. The authoritative migrations are in `supabase/migrations/`; the current live project reports migrations 001–005 applied. Do not run old Neon migration instructions in legacy project notes.

## Next steps

1. Keep all eight live source records inactive and blocked.
2. Prepare rights-request packs and obtain written terms for all CARTA uses.
3. Verify current consolidated texts and exact official-language versions; prioritise non-contested documents first.
4. Resolve the Somalia, Tanzania, South Sudan and Uganda version issues.
5. Import the first fully cleared document, then verify article structure, checksum, full-text search and citations in Supabase.
6. Repeat country by country. Never count a metadata row as a constitution in coverage metrics.

See [Phase 3 legal library and mobile plan](phase-3-legal-library-and-mobile.md) for the shared web/mobile scope and release gates.


### Rwanda first-corpus review

A detailed source and rights preflight is recorded in [Rwanda Constitution 2023 preflight](rwanda-constitution-2023-preflight.md). A copy-ready confirmation request is in [Rwanda publisher request](rights-requests/rwanda-constitution-permission-request.md). The live source row now records the 2023 Gazette candidate and the 2024 Article 282 rights basis while deliberately remaining inactive, `review_required`, and `commercial_use_allowed=false`.
