# CARTA data sources and acquisition strategy

CARTA's objective is a trustworthy library of current written constitutions and other foundational legal instruments, not simply a very large text scrape. The first database migration creates a jurisdiction catalogue. It does **not** load every constitution. Jurisdiction entries begin as `metadata_only`, and a country is not marked complete until the exact current official text, amendments, dates and reuse rights have been verified.

## Source hierarchy

For each jurisdiction, locate the current publisher in this order:

1. Constitution, parliament or legislature website.
2. Ministry of Justice, Attorney-General, government printer or official legislation portal.
3. Official Gazette and amendment / commencement notices.
4. Constitutional court or supreme court repository for interpretations and constitutional decisions.
5. Regional legal information institutes and university repositories for discovery and cross-checking only.

The imported document should link to the publisher's canonical URL. Record the title exactly as published, jurisdiction, document number, language, promulgation/adoption date, commencement/effective date, current version/cut-off date, amendment history, publication date and an exact source locator for each provision. Where the jurisdiction does not have a single codified written constitution, classify it as such after expert review and catalogue its foundational statutes/instruments separately. Do not call an uncodified system “missing data”.

## Useful global and regional sources

| Source | What it is useful for | Important handling |
| --- | --- | --- |
| [Constitute / Comparative Constitutions Project](https://www.constituteproject.org/content/data?lang=en) | Constitution discovery, comparative metadata, topic and chronology datasets; useful to map which texts to look for. | CCP terms are not a blanket commercial reuse licence. The project identifies CC BY-NC 3.0 material and third-party materials; do not copy its constitution texts/translations into a paid CARTA service without a separate permission/right check. Use as discovery and verification aid. |
| [Kenya Law](https://kenyalaw.org/) | Kenya Constitution, consolidated legislation, over 275,000 judicial decisions, Gazette and parliamentary materials. | **Licensing gate:** NCLR terms prohibit automated bulk extraction, commercial redistribution and AI-related use without an explicit licensing agreement. Use metadata and source links only until CARTA has written permission for the exact text and AI workflow. |
| [GovInfo](https://www.govinfo.gov/developers) / [RSS feeds](https://www.govinfo.gov/feeds) | U.S. federal bills, public laws, Code of Federal Regulations, Federal Register, U.S. Reports and federal court opinions. RSS is available per collection and per court. | Metadata feed is enabled by the migration. Full XML/bulk import still needs document/version verification and third-party checks; API access uses a free api.data.gov key. |
| [EUR-Lex web service](https://eur-lex.europa.eu/content/help/data-reuse/webservice.html?locale=en) | EU treaties, regulations, directives, decisions and access to Cellar document metadata/content. | Webservice registration and data-reuse terms apply; retain document CELEX identifiers, language, version and consolidation date. |
| [HUDOC / European Court of Human Rights RSS](https://www.echr.coe.int/en/echr-rss-feeds) | ECHR judgments, decisions and press-release feed metadata, with links to HUDOC records. | Use the official HUDOC record as the case-law source. Feed metadata can be shown without copying full judgment or press-release text. |
| [Curia / CJEU](https://curia.europa.eu/site/jcms/d2_5156/en/media-centre) | Court of Justice of the EU press releases and case-law updates; official RSS feed. | Link to the official case/document. Review reuse conditions before copying summaries or document text. |
| [UN Treaty Collection](https://treaties.un.org/) | Treaty texts, signatories, parties, ratification/accession, reservations, declarations and objections. | Treaty status records change. Preserve the status date and distinguish treaty text from whether it binds a particular state. |
| [SAFLII](https://www.saflii.org/content/rss-feeds-0) | Southern African case-law discovery and court-specific RSS feeds. | **Discovery only by default:** SAFLII says it is not a repository for republication or AI/automated-system reuse and restricts scraping/crawling/mirroring absent a written agreement. Follow the link to the original authorised court/government publisher. |
| [UK legislation.gov.uk](https://www.legislation.gov.uk/new) | UK, Scottish, Welsh and Northern Irish new legislation; official Atom feed and XML API. | OGL v3.0 generally permits commercial reuse with attribution. The new-legislation metadata feed is enabled; inspect per-item exclusions and third-party content before importing full text. |
| [Australian Federal Register of Legislation](https://www.legislation.gov.au/) | Official Commonwealth legislation, lifecycle/versions and amendments through a free REST/OData API. | Most content is CC BY 4.0 and commercially reusable with attribution; the Coat of Arms and marked third-party material are excluded. The API is registered in CARTA; a dedicated API ingestion adapter remains to be enabled. |
| [WorldLII](https://www.worldlii.org/) / [Law Library of Congress Foreign Legal Gazette Collection](https://www.loc.gov/law/find/gazettes.php) | Discovery of national legal information institutes and foreign official gazettes. | Discovery only. Follow each item to the responsible national gazette, legislature, ministry or court and independently verify current status and reuse rights. |

## Per-country acquisition register

Maintain one onboarding row per jurisdiction in the data team's working register. Required fields:

- ISO code and human-reviewed jurisdiction classification (sovereign state, territory, dependent area, international or unclassified).
- Official constitution / framework source URL and responsible institution.
- Official Gazette and amendment source URL.
- Current consolidated text URL and document identifier.
- Languages and whether each is official, legally authoritative or a translation.
- Last checked date, effective date and amendment cut-off date.
- Licence / public-domain evidence, commercial reuse permission and attribution rules.
- Import status: not found, metadata only, rights review, text acquired, editorial review, verified current, superseded or no single written constitution.
- Reviewer and second-person verification record.

Start by completing a manageable set of jurisdictions, not a one-shot global scrape. CARTA's first regional batch is the eight East African Community Partner States: Burundi, Democratic Republic of the Congo, Kenya, Rwanda, Somalia, South Sudan, Tanzania and Uganda. See `eac-first-batch.md` for the verified publisher candidates, the current-version risks and the explicit rights gates. Only after this batch passes should CARTA expand to South Africa, Ghana, Nigeria, India, the United Kingdom, the United States, Canada, Australia and New Zealand. Verify each publisher and licence independently.

## Daily feed strategy

Daily content is different from the constitution corpus. Use separate official feeds for:

- enacted laws, bills and amendment notices;
- official Gazette notices and commencement orders;
- constitutional/supreme court judgments;
- regional/international court judgments and press releases;
- treaty status / reservation changes;
- official government legal-policy updates.

The source registry includes official metadata feeds for HUDOC/ECHR, Curia/CJEU, GovInfo and UK legislation. Their daily-ingestion trigger stores headlines, dates and canonical publisher links, not copied legal text. Kenya Law and SAFLII remain discovery-only pending explicit licensing; Australia is registered for API ingestion but its adapter is not yet enabled. The current ingestion function stores item title/date/canonical URL and source metadata. It does not scrape the entire article body. For a production daily feed, configure multiple per-country official feeds and a review workflow for relevance, duplicates, corrections and legal significance.

## Legal rights are a release gate

“Publicly accessible” does not automatically mean “free to republish commercially” or to process with an AI service. Kenya Law and SAFLII both explicitly restrict unlicensed bulk/automated or AI-related reuse. A web page can contain government text, third-party images, proprietary editorial summaries and privately supplied translations under different terms. CARTA Plus is a commercial service, so a non-commercial licence is not sufficient. Keep restricted sources in discovery-only mode and link to the source. A legal reviewer should document the rights basis for every imported text and translation before setting `commercial_use_allowed=true`.


## Additional official-first starting points (checked 4 November 2026)

- **New Zealand:** [New Zealand Legislation](https://www.legislation.govt.nz/) is the official legislation portal. Its copyright notice states that there is no copyright in New Zealand legislation under section 27 of the Copyright Act 1994, while works incorporated by reference and third-party material may still carry rights. The portal also identifies Crown copyright for other website content. A first batch can therefore include the Constitution Act 1986 and other foundational Acts once exact versions and incorporated material are checked. [Copyright notice](https://www.legislation.govt.nz/copyright/).
- **Australia:** the [Federal Register of Legislation](https://www.legislation.gov.au/) is the authorised whole-of-government Commonwealth legislation source. Its [reuse guidance](https://www.legislation.gov.au/help-and-resources/using-the-legislation-register/data-share-and-reuse) says its public API returns JSON and documents without an API key, permits automated downloading subject to crawl-delay, and most content is CC BY 4.0 with attribution; third-party material is excluded. API: `https://api.prod.legislation.gov.au/v1/`; OpenAPI: `https://api.prod.legislation.gov.au/swagger/index.html`.
- **United States:** [GovInfo](https://www.govinfo.gov/developers) publishes authoritative federal publications and RSS feeds. U.S. federal-government works are generally public domain under 17 U.S.C. § 105, but GovInfo warns that a government publication can include separately copyrighted third-party content. [GovInfo copyright policy](https://www.govinfo.gov/about/policies). The U.S. Constitution Annotated is a valuable Congressional Research Service resource but its annotations are editorial analysis, not constitutional text.
- **United Kingdom:** [legislation.gov.uk](https://www.legislation.gov.uk/) is maintained by The National Archives and exposes an XML/Atom API and feeds. Its content is generally reusable under OGL v3.0, subject to per-item exclusions and third-party rights. [API documentation](https://legislation.github.io/data-documentation/api/overview.html) and [National Data Library overview](https://www.data.gov.uk/collections/government-and-parliament/legislation).
- **Canada:** [Justice Laws Website](https://laws-lois.justice.gc.ca/eng/) is the authoritative federal statutes and regulations publisher. The Government's terms identify the Reproduction of Federal Law Order, which permits reproduction of federal enactments/consolidations and certain federal court reasons subject to accuracy and not representing the copy as an official version; separately copyrighted third-party material is excluded. Commercial use and editorial additions should be confirmed with counsel before enabling a paid corpus. [Justice Canada terms](https://canada.justice.gc.ca/eng/terms-avis/index.html).
- **India:** start with the [Legislative Department](https://legislative.gov.in/) and [India Code](https://www.indiacode.nic.in/). Do not infer that government-hosted text is automatically commercially reusable: the NIC portal terms say permission is required for reproducing its material, and third-party copyright remains separate. [NIC terms](https://www.nic.gov.in/terms-of-use/).
- **Kenya:** [Kenya Law](https://new.kenyalaw.org/legislation/) is the essential official source for the Constitution, consolidated laws, county legislation and treaties. The NCLR terms currently prohibit scraping, bulk extraction, commercial redistribution and AI training without an explicit licensing agreement. Raw NCLR documents are offered under CC BY-NC 4.0 for non-commercial use; CARTA must seek a commercial/AI licence or remain metadata/link-only for that content. [Current terms](https://kenyalaw.org/terms-of-use/) and [Laws of Kenya portal](https://new.kenyalaw.org/legislation/).
- **International treaties:** the [UN Treaty Collection](https://treaties.un.org/) has authoritative treaty texts, parties, entry-into-force dates, reservations and objections. Its FAQ says treaty status is updated daily and intra-daily. Preserve status timestamps and do not treat signature as ratification or entry into force. [Treaty status description](https://treaties.un.org/pages/Content.aspx?path=DB%2FMTDSGStatus%2FpageIntro_en.xml).
- **EU law:** [EUR-Lex](https://eur-lex.europa.eu/) provides searchable treaties, regulations, directives, decisions and case-law material. The webservice returns XML after registration; individual documents can be retrieved from the Cellar REST API or stable identifiers. Respect the EU legal notice and third-party content flags. [EUR-Lex webservice](https://eur-lex.europa.eu/content/help/data-reuse/webservice.html?locale=en).

### Recommended rollout by rights and integration readiness

1. **Start with legally reusable text and functioning publisher APIs:** New Zealand legislation, Australia Federal Register content, U.S. federal works, and UK legislation where the OGL/exclusions are checked.
2. **Add international instruments and courts:** UN Treaty Collection (metadata/status first), HUDOC/ECHR, Curia/CJEU and GovInfo court collections. Preserve the exact court/publisher link and version/date.
3. **Add Canada and other jurisdictions after rights review:** Canada federal law has a specific reproduction order; check whether the particular material and intended presentation meet it. For India, South Africa, Ghana, Nigeria, Uganda, Tanzania and Rwanda, use official gazettes, parliaments and justice ministry portals; clear rights and establish an amendment-monitoring route before publishing.
4. **Negotiate source agreements for restricted high-value content:** Kenya Law/NCLR and SAFLII need written permissions covering the intended bulk/API access, commercial redistribution, translations and LLM retrieval. Do not evade restrictions by scraping an alternative mirror.

A source registry record can enable metadata-only monitoring while its document text remains unpublished. For commercial text/AI retrieval, the document itself must independently pass the import rights gate; a source-level licence does not automatically clear every embedded third-party work or translation.

### Additional verified daily feeds (added 4 November 2026)

- **UN Geneva:** the UN Geneva RSS index exposes press-release and meeting-summary feeds. CARTA stores the headline, publication date and canonical UN link only; meeting summaries are institutional reporting, not treaty text or court holdings. [UN Geneva RSS index](https://www.ungeneva.org/en/news-media/rss).
- **South Africa:** the South African Government's RSS index lists the Department of Justice and Constitutional Development update feed. CARTA accepts the FeedBurner transport only because the official gov.za page links to it; item links are restricted to the declared `justice.gov.za` host. These remain government communications, not automatically legislation or judgments. [Official RSS index](https://www.gov.za/rss-feeds).
- **New Zealand:** the Parliamentary Counsel Office provides the [New Zealand Legislation API](https://api.legislation.govt.nz/docs/), with works, versions and XML/PDF formats. The API requires an API key; the source is registered but its adapter remains inactive until `NZ_LEGISLATION_API_KEY` is supplied and rate limits/version mapping are tested. It exposes work/version data; use `latest_matching_version.is_latest_version` rather than assuming the newest matching search result is the newest legal version. [Official feed guidance](https://www.legislation.govt.nz/learn-more/find-and-use-legislation/keep-up-to-date-with-legislation/).

Feed host validation normally requires the publisher feed and item URLs to share a domain. For a government-published feed delivered through an intermediary, CARTA permits only explicit source-registry `metadata.allowedHosts` declared after confirming the official publisher's feed index. Item URLs must still resolve to one of those allowed publisher domains.


## EAC initial batch

The eight EAC Partner States and their official constitutional source candidates are recorded in `data/eac-source-candidates.json` and seeded by migration `009_eac_constitution_sources.sql`. This migration adds source metadata only. It deliberately leaves every source inactive, with commercial use disabled and rights review pending; it does not populate any constitutional text or enable legal ingestion. Consult `eac-first-batch.md` before changing any source status.
