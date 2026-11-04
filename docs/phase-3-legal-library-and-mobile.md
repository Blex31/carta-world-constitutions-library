# CARTA Phase 3 — legal library and native mobile product
**Decision and research snapshot: 5 November 2026**

## Product decision

CARTA is a web + native-mobile product. Native Android and iOS are required product targets, not optional future enhancements.

- Web: the current React + Vite application.
- Native mobile: Flutter for Android and iOS.
- Shared backend: the existing Supabase project, PostgreSQL schema, Supabase Auth and `carta-api` Edge Function.
- Shared content: one canonical legal-document record, version history, provisions, search chunks, source provenance, rights evidence and verified citations. Do not create separate web and mobile legal databases.

The Flutter app should use Supabase Auth for sign-in and a bearer session for the CARTA API. It must not connect directly to Postgres or contain service-role/provider secrets.

## Live corpus baseline

Checked directly against the live Supabase project on 5 November 2026:

| Data | Count |
|---|---:|
| Jurisdictions | 8 |
| Official-source candidates | 8 |
| Legal documents | 0 |
| Document sections/provisions | 0 |
| Searchable legal chunks | 0 |
| Feed items | 0 |

All eight legal source candidates remain inactive, `review_required`, and `commercial_use_allowed=false`. This is intentional. A public government URL or a downloadable PDF is not, by itself, evidence of permission to reproduce, redistribute, cache offline, make commercial use of, or process with AI.

## Initial corpus scope: EAC

Start with the eight EAC partner states already present in the database: Burundi (BI), Democratic Republic of the Congo (CD), Kenya (KE), Rwanda (RW), Somalia (SO), South Sudan (SS), Tanzania (TZ) and Uganda (UG). Treat Zanzibar's Constitution as a separate jurisdictional instrument, not as part of the Union Constitution.

### Source/version review queue

| Jurisdiction | Official source evidence located | Version issue / next verification |
|---|---|---|
| Burundi | Presidency of Burundi 2018 promulgation page and Constitution PDF: https://presidence.gov.bi/2018/07/6271-2/ and https://www.presidence.gov.bi/wp-content/uploads/2018/07/constitution-promulguee-le-7-juin-2018.pdf | Text is in Kirundi and French. Confirm subsequent amendments, official Gazette history and authoritative language treatment. |
| DR Congo | Presidency-hosted Journal Officiel consolidated PDF: https://www.presidence.cd/uploads/files/Constitution%20de%20la%20RDC%20%202011.pdf | PDF identifies the 18 February 2006 Constitution as modified by Law No. 11/002 of 20 January 2011. Verify any subsequent amendments and the latest Journal Officiel record. |
| Kenya | Kenya Law/NCLR terms and legislation service: https://kenyalaw.org/terms-of-use/ and https://new.kenyalaw.org/legislation/; Presidential Library archive record: https://www.presidentiallibrary.go.ke/index.php/documents/constitution-kenya-2010 | NCLR terms state raw documents are CC BY-NC 4.0 and prohibit automated bulk extraction, commercial redistribution and AI/ML training without an explicit licence. The Presidential Library describes its 2010 archival copy as public domain, but that is not automatically a current consolidated edition. Obtain counsel's confirmation of the archive record and the current amendment cut-off. |
| Rwanda | Official Gazette special issue of 4 August 2023: https://www.minijust.gov.rw/fileadmin/user_upload/Minijust/Publications/Laws/Constitution.pdf and https://www.rlrc.gov.rw/fileadmin/user_upload/RLRC/Laws_of_Rwanda_v2/Domestic_laws/Laws_in_force/1._Fundamental/1.1._National_Instruments/1.1.1._Constitution/1.1.1.1._Constitution_of_the_Rep._of_Rwanda_2023.pdf | The Gazette text is in Kinyarwanda, English and French. Verify post-August 2023 amendments and legal language hierarchy; rights not yet cleared. |
| Somalia | Presidency page: https://villasomalia.gov.so/constitution-2/; Ministry of Interior catalogue: https://moifar.gov.so/en/page/federal-constitution; Prime Minister's Office amendment page: https://opm.gov.so/en/policies/amendments-to-the-provisional-constitution-of-the-federal-republic-of-somalia-chapters-1-4 | Official government pages describe a 2026 Constitution approved in March and signed on 8 March, while another official page published in June 2026 still describes amendments to the 2012 Provisional Constitution with an effective date of 30 March 2024. The approval and mandate changes were politically disputed. Obtain the enacted full text, Gazette/promulgation instrument and a qualified Somali legal opinion on commencement, supersession and federal-state position before marking current. |
| South Sudan | Ministry of Justice PDF: https://mojca.gov.ss/wp-content/uploads/2023/04/The-Transitional-Constitution-of-the-Repulic-of-South-Sudan.pdf | The located text is the 2011 Transitional Constitution. Verify all amendments, including the 2015 amendment instruments, against a current consolidated version and the Official Gazette. |
| Tanzania | Parliament's Constitution page: https://www.parliament.go.tz/documents/constitution-of-tanzania; Office of the Solicitor General e-Library: https://elibrary.osg.go.tz/items/13d790c1-5bdd-42d8-8990-392dc3f1b5b6; National Prosecution Service publication page: https://nps.go.tz/publications/constitution | Parliament lists a Constitution upload dated 6 February 2025 and NPS lists a 4 March 2025 publication. The older OSG English edition explicitly consolidates only through the 14th Amendment of 2005; do not use it as current without reconciliation. Confirm the 2025 file, official English text and subsequent amendments. Catalogue Zanzibar separately. |
| Uganda | Parliament's official Constitution page: https://www.parliament.go.ug/page/constitution; Uganda Law Reform Commission record: https://publications.ulrc.go.ug/constitution/29; ULII current-version record: https://ulii.org/en/akn/ug/act/statute/1995/constitution/eng%402023-12-31 | ULII identifies a consolidated version at 31 December 2023 and records amendments applied through 2018, but ULII's general licence is CC BY-NC 4.0 and bulk scraping/downloads are prohibited. The official Parliament page says all rights reserved; ULRC lists subscription access. Seek an authorised commercial data licence or a separately verified public-domain source. |

The source URLs above establish discovery, not re-use permission or final currentness. Keep all eight sources blocked until rights and legal-version review is recorded.

## Rights clearance required for each source and document

The signed licence, official public-domain evidence or counsel-approved rights record must expressly cover the intended CARTA uses:

1. Full-text hosting and display in both web and mobile apps.
2. Reproduction, redistribution and commercial use, including the free tier and paid CARTA Plus product.
3. Full-text indexing, search, snippets and citation previews.
4. AI retrieval, embeddings, summarisation and legal-assistant prompts/outputs.
5. Offline download, local device caching and cross-device synchronisation.
6. Plain-language explanations, translation or other derivative material, where applicable.
7. Attribution wording, publisher link, update cadence, takedown/correction conditions and licence expiry.

Record rights separately for each language/edition and for third-party editorial annotations. Do not infer rights from accessibility, government ownership, a website's API, or another country's treatment of statutory texts.

## Import and publication gates

The importer at `scripts/import-constitution-documents.mjs` already rejects placeholders and requires:
- an official HTTPS source;
- an exact full text and provision structure;
- a verified document status;
- an allowed rights status and `commercialUseAllowed=true`;
- an HTTPS rights-evidence URL and documented rights notes;
- dates, version and checksum metadata.

Before importing a document, also complete:
- source authenticity and authority review;
- authoritative language and translation review;
- adoption, promulgation, publication and commencement dates;
- every amendment and transitional provision to a stated cut-off date;
- SHA-256 checksum and page/article reconciliation;
- two-person editorial/legal review;
- an importer dry run and database reconciliation.

Never set a source active merely to test ingestion. Do not serve candidate texts or use them for AI answers until every gate passes.

## Mobile requirements using the same corpus

The Flutter Android/iOS app must ship with:
- country/jurisdiction browsing and catalogue;
- document reader with chapter/article navigation and source/version information;
- search using the shared API;
- legal assistant with the same verified citations and no-source refusal;
- sign-up/sign-in and account settings;
- synced bookmarks, highlights, notes and saved documents;
- offline reading only for documents whose licence explicitly permits device copies;
- daily updates and opt-in push notifications;
- accessibility, text-size controls and low-bandwidth handling.

Offline cache entries must retain document ID, version label, effective dates, source URL, content hash and downloaded timestamp. When a newer version supersedes a cached one, mark it stale and prompt the user to refresh; never silently replace a legal text.

Push notifications use opt-in device tokens and user timezone preferences. Home-screen widgets are a separate native deliverable: Android AppWidget and iOS WidgetKit. Never put legal advice or sensitive user queries in notification previews.

The web Stripe checkout is not automatically the mobile payment implementation. Review current Apple App Store and Google Play billing requirements before building the mobile paywall. Regardless of payment provider, entitlements must resolve to the same authenticated CARTA account and backend subscription state.

## Phase 3 work order

1. Confirm the eight source records and keep their inactive/review-required status.
2. Prepare a rights-request pack for each publisher; request written rights for web/mobile display, commercial redistribution, AI retrieval and offline use.
3. In parallel, obtain the exact candidate documents and finish version/amendment verification without publishing them.
4. Resolve the high-risk version questions for Somalia, Tanzania, South Sudan and Uganda before assigning current status.
5. Import the first fully cleared document only after the legal and rights checklist passes; test full text, chapter/article hierarchy, search chunks, citations and version history.
6. Build the import/coverage audit and repeat the same pipeline for each cleared jurisdiction.
7. Keep Flutter implementation on the product roadmap and use the same Supabase API/data model from the first mobile sprint.

## Current decision

The EAC catalogue is a source-review queue, not eight completed constitutional texts. The next meaningful content milestone is the first rights-cleared, current, searchable constitution in Supabase—not a higher country count.
