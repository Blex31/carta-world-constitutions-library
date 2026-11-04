# East African Community first constitutional corpus batch

**Research checked:** 4 November 2026  
**Coverage basis:** the East African Community's official overview lists eight Partner States: Burundi, the Democratic Republic of the Congo, Kenya, Rwanda, Somalia, South Sudan, Tanzania and Uganda. See [EAC Overview](https://www.eac.int/overview-of-eac).

## Import status

This is a source-verification queue, not a completed corpus. Migration `009_eac_constitution_sources.sql` registers the primary publisher candidates for the eight partner states. All are deliberately `review_required`, `commercial_use_allowed=false`, and `is_active=false`. It adds no constitutional text and does not enable feed polling. The eight jurisdiction catalogue entries remain metadata until actual current documents are legally cleared and imported.

| Partner State | Primary official publisher candidate | Candidate text / version issue | Current gate |
|---|---|---|---|
| Burundi (BI) | [Presidency of Burundi](https://presidence.gov.bi/2018/07/6271-2/); cross-check [Constitutional Court](https://courconstitutionnelle.gov.bi/) | Constitution promulgated 7 June 2018. Confirm subsequent amendments and current consolidation. | Official source located; rights and amendment history pending. |
| DR Congo (CD) | [Cour de Cassation](https://cassation.cd/textes-legaux/constitution-rdc) | Constitution of 18 February 2006, modified by Law No. 11/002 of 20 January 2011. Confirm later amendments and Journal Officiel. | Official court-hosted text located; current-version and rights checks pending. |
| Kenya (KE) | [Kenya Law / NCLR](https://new.kenyalaw.org/legislation/) | Constitution of Kenya, 2010. Use the publisher's current consolidation, not an old archival scan. | **Written NCLR licensing agreement required** before automated bulk extraction, commercial redistribution or AI/LLM use. Kenya Law's [current terms](https://kenyalaw.org/terms-of-use/) say these activities are prohibited without express licensing. |
| Rwanda (RW) | [Ministry of Justice / Official Gazette PDF](https://www.minijust.gov.rw/fileadmin/user_upload/Minijust/Publications/Laws/Constitution.pdf); cross-check [Parliament PDF](https://www.parliament.gov.rw/fileadmin/user_upload/The_Constitution_of_the_Republic_of_Rwanda.pdf) | Official Gazette special issue, 4 August 2023; 2003 Constitution revised in 2015 and again in 2023. Confirm later changes and language hierarchy. | Official Gazette source located; rights review pending. |
| Somalia (SO) | [Federal Ministry of Interior, Federal Affairs & Reconciliation](https://moifar.gov.so/en/page/federal-constitution) | Government pages refer both to a 2026 Federal Constitution and amendments to the 2012 Provisional Constitution. Compare [Villa Somalia](https://villasomalia.gov.so/constitution-2/) and [Prime Minister's Office](https://opm.gov.so/en/policies/amendments-to-the-provisional-constitution-of-the-federal-republic-of-somalia-chapters-1-4). | **Hold for legal review.** Resolve the official-version, promulgation, commencement and supersession questions before selecting the current text. |
| South Sudan (SS) | [Ministry of Justice and Constitutional Affairs](https://mojca.gov.ss/the-transitional-constitution-of-the-repulic-of-south-sudan/) | Transitional Constitution of 2011. Obtain and verify the latest consolidated amendments and effective dates. | Official Ministry page located; consolidation and rights pending. |
| Tanzania (TZ) | [Office of the Attorney General — OAGMIS](https://oagmis.oag.go.tz/public); cross-check [Parliament document page](https://www.parliament.go.tz/documents/constitution-of-tanzania) and [Solicitor General e-Library](https://elibrary.osg.go.tz/items/13d790c1-5bdd-42d8-8990-392dc3f1b5b6) | 1977 Union Constitution. Parliament lists a 6 February 2025 upload; the OSG e-Library description for an English revised version says it consolidates amendments only through the 14th Amendment (2005). Reconcile before import. | Official publisher routes located; current-version and rights checks pending. Treat the Zanzibar Constitution separately. |
| Uganda (UG) | [Uganda Law Reform Commission](https://publications.ulrc.go.ug/constitution/29) | Updated Constitution of 1995. The ULRC record marks access as subscription. Cross-check [State House](https://statehouse.go.ug/the-constitution/) and [ULII 2023-12-31 version](https://ulii.org/en/akn/ug/act/statute/1995/constitution/eng%402023-12-31); ULII is a secondary cross-check, not the primary publisher. | Official source located; subscription, latest amendment cut-off and rights pending. |

## Legal rights policy

A government URL, free PDF download, or “official” publisher label is not itself a commercial-reuse or AI-processing licence. No EAC source in this first register is authorised for full-text ingestion yet. The importer will continue to reject any document unless the source and document both carry approved rights evidence, the source is official, the document is an exact verified text, and commercial reuse is explicitly allowed.

Kenya is a specific restriction: the National Council for Law Reporting's [terms of use](https://kenyalaw.org/terms-of-use/) prohibit automated scraping, bulk extraction, commercial redistribution and AI/ML training absent an explicit licensing agreement. Raw NCLR documents are stated to be CC BY-NC 4.0 for non-commercial use, which is not sufficient for a commercial CARTA tier. The [Kenya Presidential Library record](https://presidentiallibrary.go.ke/documents/constitution-kenya-2010) labels its archival 2010 copy public domain, but that original archival copy does not by itself establish a current consolidated text or a right to use Kenya Law's editorial/consolidated content.

For each country, the next review must capture: (1) exact source PDF/HTML and SHA-256, (2) official language(s) and legal status of translations, (3) promulgation and commencement instrument, (4) every amendment through a stated cut-off date, (5) rights evidence that explicitly covers commercial redistribution and LLM retrieval, (6) attribution requirements, and (7) a second-person legal review. If any item is unresolved, keep the jurisdiction in metadata/link-only state.

## Follow-up implementation sequence

1. Apply migrations `001`–`009` to the dedicated CARTA Neon database after account access is restored.
2. Confirm the eight source rows exist and are all inactive / rights-review pending.
3. Obtain written licences or documented public-domain/open-license bases for each exact constitutional text and language edition.
4. Acquire exact official text, verify amendment status and provision structure, then populate the document import JSON.
5. Run importer dry-run and legal editorial review; only then run `--apply` for a cleared document.
6. Keep the daily-update feed registry separate from the constitutional-text corpus. Activate official feeds only after their own source URL, publisher-host and reuse checks.

No legal questions should be answered from these source-candidate records; the AI assistant must remain limited to the verified corpus.
