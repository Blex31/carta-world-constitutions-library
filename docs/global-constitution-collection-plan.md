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

**54 African constitutional source/status leads have been identified**: the eight EAC candidates plus 46 further African source/status leads. These are source-discovery starting points only; all remain rights-review required, and no text is approved by inclusion in this queue.

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
| Eswatini | [Judiciary legislation registry](https://www.judiciary.org.sz/legislation) / [Government Constitution PDF](https://www.gov.sz/images/Media/constitution.pdf) | 2005 Constitution Act; confirm later amendments, court decisions and current consolidated text. |
| Ethiopia | [Ministry of Justice — Constitution](https://justice.gov.et/am/sector/ethiopian-constitution/) / [Proclamation No. 1/1995](https://justice.gov.et/am/law/proclamation-of-the-constitution-of-the-federal-democratic-republic-of-ethiopia/) | Obtain authoritative Amharic text and Gazette, verify other official-language versions and amendment history. |
| Lesotho | [Government of Lesotho](https://www.gov.ls/) / [Refworld amendment record](https://www.refworld.org/legal/legislation/natlegbod/1993/en/123191) | 1993 Constitution including Tenth Amendment 2022; Ninth Amendment was held invalid by the Court of Appeal in 2024; check later court orders and whether 2024 Tenth Amendment Bill became law. |
| Morocco | [Government Secretariat General — 2011 Constitution](https://www.sgg.gov.ma/Portals/0/constitution/constitution_2011_Fr.pdf) / [Arabic Official Bulletin](https://www.sgg.gov.ma/BO/bo_ar/2011/BO_5964-bis_Ar.pdf) | Official French text and Arabic Official Bulletin located; verify amendments since 2011 and controlling language. |
| Niger | [Government — fundamental texts](https://www.gouv.ne/index.php/textes-fondamentaux) / [2026 refoundation statement](https://www.gouv.ne/index.php/90-autres-actualites/1101-an-1-de-la-refondation-au-niger-mise-en-orbite-des-institutions-adaptees-et-credibles) | Government says the 26 March 2025 Charter of the Refoundation has constitutional value and governs the 60-month transition; keep 2010 Constitution historical pending specialist review. |
| Seychelles | [National Assembly — Third Republic Constitution](https://www.nationalassembly.sc/publications/parliamentary-procedures/constitution-third-republic-seychelles) | Official National Assembly text dated 30 October 2020; verify incorporated amendment schedule and later legal changes. |
| Sudan | [Ministry of Justice file index](https://moj.gov.sd/files/index/28%20) / [Refworld 2019 document](https://www.refworld.org/legal/legislation/natlegbod/2019/en/73677) | Transitional Constitutional Document 2019, amended 2025, but competing transitional instruments and divided authority require specialist Sudanese review; keep on legal hold. |
| Tunisia | [Presidential Decree No. 2022-691](https://legislation-securite.tn/latest-laws/decret-presidentiel-n-2022-691-du-17-aout-2022-portant-promulgation-de-la-constitution-de-la-republique-tunisienne/) | 2022 Constitution promulgated 17 August and published in JORT No. 91 on 18 August 2022; obtain original Arabic Gazette and verify later amendments. |
| Comoros | [Presidency — 2018 referendum](https://beit-salam.km/actualit%C3%A9s/le-pr%C3%A9sident-de-la-r%C3%A9publique-convoque-le-corps-%C3%A9lectoral-pour-un-r%C3%A9f%C3%A9rendum-constitutionnel.html) / [WHO CPCD discovery copy](https://extranet.who.int/cpcd/health-legislation/constitution-de-lunion-des-comores) | 2001 Constitution revised in 2018; obtain exact promulgated full text and verify post-2018 amendments. |
| Eritrea | [1997 ratified text](https://www.refworld.org/legal/legislation/natlegbod/1997/13634) / [UN Special Rapporteur 2024 report](https://digitallibrary.un.org/record/4050331/files/A_HRC_56_24-EN.pdf) | 1997 text has never entered into force according to the UN's 2024 report; the 2025 UK country note also records it as unimplemented. Do not label it the current Constitution. |
| Guinea-Bissau | [National Assembly legal collection](https://anp.gw/) / [FAOLEX 2026 Constitutional Law No. 05/2026 record](https://faolex.fao.org/en/documents/LEX-FAOC247821/constitution-of-the-republic-of-guinea-bissau-gnb-2026) | New transitional constitutional law reported adopted 13 January, promulgated 6 February and effective 24 February 2026. Obtain the Official Gazette and expert review of authority/current effect; the Assembly page still surfaces the older text. |
| São Tomé and Príncipe | [Constitutional legislation archive](https://www2.camara.leg.br/saotomeeprincipe/saotomeeprincipe/legislacao/legislacao-constitucional) / [Government registry/legal texts](https://dgrn.gov.st/Legislacao.php) | Law No. 1/2003 of 29 January 2003 revising the 1990 Constitution; obtain original Diário da República and all later revisions. |
| Central African Republic | [Embassy of the Central African Republic — official texts](https://paris.diplomatie.gouv.cf/textes-officiels) | Embassy hosts the French-language 2023 Constitution; reconcile with the Gazette and verify post-2023 changes. |
| Republic of the Congo | [Presidency of the Republic](https://presidence.cg/la-constitution/) | Official Presidency page publishes the Constitution dated 25 October 2015; check later amendments and currentness. |
| Côte d’Ivoire | [Presidency — Constitution](https://www.presidence.ci/en/ivory-coast/the-constitution/) | Official page hosts the 2016 Constitution and a 2025 PDF; reconcile the 2020 revision and subsequent changes. |
| Djibouti | [Constitutional Council](https://www.conseil-constitutionnel.dj/la-constitution/) | Official Council records the 1992 Constitution and revisions in 2006, 2008 and 2010. |
| Equatorial Guinea | [Ministry of Public Function](https://minfuncionpublica.gob.gq/regulacion/constitucion/) | Ministry identifies the new Fundamental Law promulgated 16 February 2012; verify later amendments and reuse basis. |
| Guinea | [Government Secretariat General — 2025 Constitution PDF](https://www.sgg.gov.gn/document/downloadfile/546) / [Official Journal platform](https://journal-officiel.sgg.gov.gn) | Fifth Republic Constitution adopted 21 September 2025 and promulgated by Decree D/2025/176 on 26 September 2025; verify any subsequent 2026 changes. |
| Liberia | [Judiciary Constitution page](https://judiciary.gov.lr/constitution-of-liberia-2/) / [Senate legislation records](https://senate.gov.lr/legislation-and-records/) | Official publishers host the 1986 Constitution; reconcile amendments, including the 2011 changes, against the Gazette. |
| Libya | [Supreme Judicial Council — Constitutional Declaration](https://www.sjc.gov.ly/Laws/Details/f4f161ce-405e-470a-b3a3-c0f90f5911ba) | Judiciary portal lists the amended 2011 Constitutional Declaration as applicable; this is an interim framework and requires specialist review, not a permanent constitution label. |
| Mali | [Journal Officiel copy of 2023 Constitution](https://extranet.who.int/cpcd/sites/default/files/public_file_repository/MLI_Mali_Constitution_2023.pdf) | Copy includes Decree 2023-0401/PT-RM of 22 July 2023; acquire the original Gazette and check later transition/constitutional instruments. |
| Mauritania | [Constitutional Council](https://conseil-constitutionnel.mr/fr/?p=1162) / [Government legal texts portal](https://dgat.interieur.gov.mr/textes-juridiques) | 1991 Constitution, revised in 2006, 2012 and 2017; government portal also lists a consolidated French PDF. Check later changes. |
| Madagascar | [National Assembly — IVème République Constitution record](https://www.parlement.mg/fr/textes/constitution-de-la-iveme-republique/) | Parliament record shows a 2026 Fourth Republic constitution deposited 18 May 2026 with status “Promulgation”; obtain signed decree, Gazette publication and commencement before treating it as operative. |
| Mauritius | [Government Constitution page](https://www.govmu.org/EN/infoservices/govadministration/Pages/constitution.aspx) / [2025 amendment discovery record](https://www.refworld.org/legal/legislation/natlegbod/1968/18626) | Government consolidation is only to March 2016; a 2025 amendment reportedly repealed section 7(2). Obtain the official amendment Act and consolidate. |

The 46 additional African source/status leads beyond the original EAC group were recorded on 9 November 2026. The legal/currentness and reuse review remains incomplete for all African jurisdictions. Eritrea is not represented as having a current Constitution; Guinea-Bissau, Niger, Libya and Sudan retain specialist transition/status holds.

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
**Source/status discovery complete for all 54 assignments (9 November 2026).** The queue now contains 54 African source/status leads: 53 constitutional instrument source leads and one special status finding for Eritrea, whose 1997 ratified text has not entered into force according to the latest UN and UK government reporting reviewed. This is not 54 verified current constitutions. All 54 remain rights-review-required; zero full texts have been acquired and zero are cleared for CARTA publication. The original 15-country first-wave research priorities are a prioritisation subset, not a separate total. Import only documents that pass the full legal and technical release gate.

- Carry forward the eight EAC source candidates with their existing review flags.
- All 54 African member-state entries now have an official source lead or a documented constitutional-status finding; the queue preserves the lead URL and the next verification task for each.
- Track non-codified or transitional constitutional arrangements correctly.
- Keep Somalia, South Sudan, Tanzania/Zanzibar and other conflicting-version cases on specialist review until reconciled.

### Batch 2 — Europe, the Americas and Oceania

**Initial source-discovery batch added: 12 assignments on 9 November 2026.** The global queue now has 66 source/status leads: 54 for Africa and 12 for this initial non-African tranche. These entries remain catalogue-only and rights-review-required.

| Jurisdiction | Official publisher/source lead | Version and acquisition caution |
|---|---|---|
| United States | [National Archives Constitution transcription](https://www.archives.gov/founding-docs/constitution-transcript) / [Congress Constitution Annotated](https://constitution.congress.gov/constitution/) | Build from the 1787 parchment transcription plus all 27 ratified amendments; keep the transcription's original spelling and annotations separate. |
| Canada | [Department of Justice — Constitution Acts 1867 to 1982](https://laws-lois.justice.gc.ca/eng/Const/FullText.html) | Not a single standalone codified text. Catalogue Constitution Acts 1867/1982 and other constitutional enactments as separate instruments; use both official language versions and check amendments. |
| Mexico | [Chamber of Deputies constitutional PDF](https://www.diputados.gob.mx/LeyesBiblio/pdf/CPEUM.pdf) / [Supreme Court Constitution history](https://www.scjn.gob.mx/constitucion-politica-de-los-estados-unidos-mexicanos) | Chamber PDF reports DOF reform 3 March 2026; SCJN current text records have later dates in June/September 2026. Reconcile every DOF decree and the official full consolidation before treating one file as current. |
| Brazil | [Chamber of Deputies — Constitution 1988](https://www2.camara.leg.br/atividade-legislativa/legislacao/constituicao1988) / [Senate promulgation record for EC 141/2026](https://www25.senado.leg.br/pt_BR/web/atividade/materias/-/materia/174386) | Main text updated through Constitutional Amendment No. 141/2026 promulgated 16 October 2026; the Chamber separately lists ADCT through EC 139/2026, so reconcile transitional provisions. |
| Argentina | [Argentina.gob.ar — Law 24,430 official publication](https://www.argentina.gob.ar/normativa/nacional/804/texto) | Official publication reproduces the 1853 Constitution with reforms through 1994; verify whether any later amendment exists and retain reform-law provenance. |
| Germany | [Federal Ministry of Justice — Basic Law](https://www.gesetze-im-internet.de/gg/) / [official English translation](https://www.gesetze-im-internet.de/englisch_gg/) | English translation states it includes amendments through 22 March 2025 and warns German text may be newer; confirm full current German text before using translation. |
| France | [Légifrance — Constitution of 4 October 1958](https://www.legifrance.gouv.fr/loda/texte_lc/LEGITEXT000006071194/) | Article 34 was amended by Law 2024-200 of 8 March 2024; verify complete text and all Journal officiel amendments to the 2026 cut-off. |
| Spain | [BOE consolidated Constitution](https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229&p=20260520&tn=6) | BOE consolidation updated 20 May 2026 but expressly has no legal value; for legal verification consult the original and each official BOE amendment, including 2024 Article 49. |
| Italy | [Senate 2026 current Constitution publication](https://www.senato.it/relazioni-con-i-cittadini/pubblicazioni-del-senato/indice-per-anno/2026) | Senate edition includes Constitutional Law No. 1 of 26 September 2023 amending Article 33; check for later constitutional laws and verify the Gazzetta Ufficiale. |
| Portugal | [Assembly of the Republic — Constitution](https://www.parlamento.pt/Legislacao/Paginas/ConstituicaoRepublicaPortuguesa.aspx) / [VII Revision (2005) PDF](https://www.parlamento.pt/Legislacao/Documents/constpt2005.pdf) | Available PDF is the 2005 VII Revision; verify no subsequent revision and reconcile all Diário da República revision laws. |
| Australia | [Federal Register — Commonwealth of Australia Constitution Act](https://www.legislation.gov.au/C2004Q00685/latest) | Act is in force; latest compilation listed as 29 July 1977, with a document rectification registered 13 May 2026. Verify the corrected official file; keep explanatory publications separate from legal text. |
| New Zealand | [New Zealand Legislation — Constitution Act 1986](https://www.legislation.govt.nz/act/public/1986/114/en/latest/) | Constitutional framework is uncodified. The Act is current to 4 September 2026, including 2026 Amendment Act No. 45 and Emergency Management Act No. 53 changes; catalogue the Bill of Rights Act 1990, Electoral Act 1993 and other constitutional materials separately. |

These 12 entries do not represent a single consolidated “complete constitution” for every jurisdiction. Canada and New Zealand have multi-source constitutional arrangements; Spain's online consolidated text is informational rather than legally authoritative; and some English translations lag behind the official-language text.

Research national gazettes, official legislation databases and constitutional court/parliament publishers. Explicitly handle systems such as the United Kingdom and New Zealand that may require multiple foundational instruments rather than one codified text.

### Batch 3 — Asia

**Initial source-discovery batch added: 12 assignments on 9 November 2026.** The global queue now has 78 source/status leads: 54 Africa, 12 Americas/Europe/Oceania and 12 Asia. These are research assignments, not a claim of 78 current constitutional editions or 78 legally reusable documents.

| Jurisdiction | Official publisher/source lead | Version and acquisition caution |
|---|---|---|
| India | [Legislative Department — Constitution documents](https://www.legislative.gov.in/documents/constitution-of-india) | Official portal lists a Constitution of India edition published 23 December 2025 and separate amendment Acts. Confirm the exact edition's amendment cut-off and Hindi/English language status. |
| Japan | [National Diet Commission on the Constitution](https://www.shugiin.go.jp/internet/itdb_kenpou.nsf/html/kenpou/en/constitution.htm) / [e-Gov Japanese original](https://laws.e-gov.go.jp/law/321CONSTITUTION?occasion_date=20260105) | Constitution promulgated 3 November 1946 and in force 3 May 1947; verify the official Japanese text and formal amendment history through the cut-off. |
| China | [State Council English Constitution page](https://english.www.gov.cn/archive/lawregulations/201911/20/content_WS5ed8856ec6d0b3f0e9499913.html) / [NPC portal](https://www.npc.gov.cn/) | English page lists amendment packages through 2018 and was updated in 2019. Obtain the current authoritative Chinese text and check all later NPC amendments/interpretations. |
| South Korea | [National Law Information Center — English reference](https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=61603&urlMode=engLsInfoR&viewCls=engLsInfoR) / [Korean text](https://www.law.go.kr/법령/대한민국헌법) | Current Constitution is the whole amendment of 29 October 1987. The English translation expressly says it has no legal/official effect and may not be current; Korean original controls. |
| Philippines | [Official Gazette — Constitutions](https://officialgazette.gov.ph/constitutions/) | Official Gazette identifies the 1987 Constitution, ratified 2 February and proclaimed in force 11 February 1987; verify no later amendment and retain any proposed charters as proposals only. |
| Singapore | [Attorney-General's Chambers — Singapore Statutes Online](https://sso.agc.gov.sg/Act/CONS1963) | Live statutory version is dated September 2026; amendment timeline includes Act 9 of 2025 and earlier 2024/2023 Acts. Fix an exact point-in-time version for release. |
| Malaysia | [Attorney General's Chambers — Federal Constitution](https://lom.agc.gov.my/federal-constitution.php) | AGC warns online updated reprints are not the statutory reprint made under the Revision of Laws Act; each version carries its own cut-off. Verify latest reprint, amendment schedule and Bahasa Malaysia authority. |
| Bangladesh | [Bangladesh Laws — Constitution](https://bdlaws.minlaw.gov.bd/act-367/act-chapter-print-685.html) | 1972 Constitution with amendment annotations including the 17th Amendment Act 2018; post-2024 reform proposals and recommendations must not be treated as enacted amendments. |
| Nepal | [Nepal Law Commission — Constitution](https://lawcommission.gov.np/content/13437/) | Law Commission lists an English Constitution of Nepal edition labelled Second Amendment, dated 21 Bhadra 2081 (2024); confirm the exact Gazette amendment law and authoritative Nepali text. |
| Sri Lanka | [Parliament of Sri Lanka — Constitution](https://www.parliament.lk/en/constitution/main) | Parliament provides a text incorporating amendments through the 21st Amendment and separately lists the 22nd Amendment. Verify whether the latter is a proposal or enacted law before inclusion. |
| Pakistan | [National Assembly downloads](https://na.gov.pk/en/downloads.php) | National Assembly page lists an English Constitution amended up to 21 November 2025; confirm any post-November 2025 amendment and obtain the latest Gazette text. |
| Indonesia | [MPR RI Legal Documentation Network](https://jdih.mpr.go.id/dokumen/view?id=46) / [English version](https://jdih.mpr.go.id/dokumen/view?id=496) / [BPK legal database](https://peraturan.bpk.go.id/Details/101646/uud-no--?oBgGIsCmIfJ=XzzMj5csP3e) | 1945 Constitution amended in four rounds in 1999, 2000, 2001 and 2002; reconcile the official one-text edition against all four amendment instruments and keep judicial interpretations separate. |

Prioritise authoritative-language and translation rules, special administrative and federal arrangements, interim constitutional instruments and source-specific rights.

### Batch 4 — Middle East and Gulf

**Initial source/status discovery batch added: six assignments on 9 November 2026.** The global queue now holds 84 source/status leads. This tranche includes codified, multi-instrument and transitional constitutional frameworks. It does not constitute legal clearance.

| Jurisdiction | Official publisher/source lead | Version/status caution |
|---|---|---|
| United Arab Emirates | [UAE Government Portal — Constitution](https://u.ae/en/about-the-uae/the-constitution-of-the-uae) | Permanent Constitution adopted July 1996; verify the Arabic text and all Article 144 amendment instruments. |
| Qatar | [Council of Ministers — Permanent Constitution](https://www.cm.gov.qa/en/Pages/Constitution.aspx) / [2024 amendments](https://www.cm.gov.qa/en/Pages/Constitutional-Amendments.aspx) | Permanent Constitution promulgated 8 June 2004; 2024 referendum amendments ratified 6 November 2024 changed a number of articles and repealed others. Obtain the exact Gazette and consolidated Arabic version. |
| Syria | [People's Assembly — 2025 Constitutional Declaration](https://syrianassembly.com/documents/constitutional-declaration-2025) | Temporary declaration signed 13 March 2025 establishes a five-year transition ending with a permanent Constitution and elections; specialist status/currentness review required. |
| Iran | [UN Peacemaker — Constitution of Iran](https://peacemaker.un.org/en/documents/constitution-islamic-republic-iran-current) | 1979 Constitution amended in 1989 according to the UN collection; acquire the official Persian original and verify the current formal amendment history. |
| Bahrain | [Legislation and Legal Opinion Commission](https://www.lloc.gov.bh/en/Legislation/id/Constitution) / [National Institution for Human Rights](https://www.nihr.org.bh/EN/HumanRights/NationalLegal.aspx) | Constitution issued 14 February 2002; official LLOC lists three amendments. Obtain all amendment Acts and current Arabic text. |
| Saudi Arabia | [Bureau of Experts — Basic Law of Governance](https://laws.boe.gov.sa/Files/Download/?attId=ed4842e1-9543-40b9-973b-ada200d4ed10) | Royal Order A/90 of 2 March 1992 is a Basic Law within a wider framework where Qur'an and Sunna are described as the constitution; do not present the Basic Law as the entire constitutional framework. |
| Jordan | [Royal Hashemite Court — Constitution](https://rhc.jo/en/jordans-constitution) / [Ministry of Finance](https://mof.gov.jo/EN/List/The___Jordanian_Constitution) | Official Arabic 2022 consolidation published in Gazette No. 5770 on 31 January 2022; no current English version was found. |
| Iraq | [Council of Representatives — Constitution](https://iq.parliament.iq/en/the-constitution/) | Constitution approved by referendum on 15 October 2005; verify whether any proposed Article 142 amendments have been enacted and separate court interpretations. |
| Lebanon | [Ministry of Justice](https://justice.gov.lb/index.php/law-details/1/1) / [Parliament English copy](https://lp.gov.lb/backoffice/uploads/files/Lebanese%20%20Constitution-%20En.pdf) | Constitution promulgated in 1926 and amended, including the Taif constitutional law of 21 September 1990; reconcile later changes and language editions. |
| Kuwait | [Ministry of State for National Assembly Affairs](https://mona.gov.kw/en/ourconstitution.aspx) / [Kuwait Government Online](https://e.gov.kw/sites/kgoenglish/Pages/Visitors/AboutKuwait/GoverningBodyTheGovernment.aspx) | 183-article Constitution adopted in 1962; verify formal constitutional amendments separately from ordinary law or proposed political reforms. |
| Oman | [Qanoon — Royal Decree 6/2021](https://qanoon.om/p/2021/l2021006/) | Basic Statute of the State issued by RD 6/2021; official record now shows it amended through RD 79/2026. Obtain the full integrated 2026 Gazette text. |
| Israel | [Knesset — Basic Laws and Constitution](https://main.knesset.gov.il/EN/activity/Pages/BasicLawsAndConstitution.aspx) / [Basic Laws register](https://main.knesset.gov.il/en/activity/pages/basiclaws.aspx) | Knesset says Israel has no single constitution; Basic Laws have constitutional status. Knesset lists Basic-Law: Torah Study passed 13 July 2026. Use current Hebrew legislation and treat English translations as unofficial. |

For each entry, the queue separates the legal instrument from any wider constitutional framework and records the required specialist verification. In particular, Syria's declaration is transitional and Saudi Arabia's system is not a single written constitution.

### Batch 5 — Europe

**Initial European source/status batch added: 12 assignments on 9 November 2026.** The global queue now has 102 source/status leads: 54 Africa, 12 Americas/Europe/Oceania, 12 Asia, 12 Middle East/Gulf, plus 12 further European jurisdictions. All remain research leads, not current or rights-approved corpus items.

| Jurisdiction | Official publisher/source lead | Version and acquisition caution |
|---|---|---|
| United Kingdom | [UK Parliament — sovereignty and constitution](https://www.parliament.uk/about/how/role/sovereignty/) / [Commons Library briefing, 3 Sep 2026](https://commonslibrary.parliament.uk/research-briefings/cbp-10986/) | The UK constitution is partly written and wholly uncodified. Catalogue constitutional statutes, case law, conventions and principles separately; do not create a single composite text. |
| Ireland | [Electronic Irish Statute Book](https://www.irishstatutebook.ie/eli/cons/en/html) / [2026 presidential legislation index](https://president.ie/en/the-president/2026-legislation) | eISB copy is the text enrolled 13 Nov 2019 and printed Jan 2020. The 2024 constitutional referendum proposals were rejected; verify no subsequent amendment through the release cut-off and use the controlling Irish text. |
| Netherlands | [Government — Constitution and Charter](https://www.government.nl/themes/government-and-democracy/constitution/constitution-and-charter) / [Overheid.nl legislation](https://wetten.overheid.nl/BWBR0001840/) | Current Constitution dates from the 1983 revision and is subordinate to the Charter for the Kingdom, which governs relations with Aruba, Curaçao and Sint Maarten. Catalogue the Charter and Constitution separately. |
| Norway | [Lovdata — Constitution](https://lovdata.no/dokument/NLE/lov/1814-05-17/ARTIKKEL_28) | Last consolidated 21 May 2024. Storting's English translation is unofficial and says the Norwegian text prevails; verify post-May 2024 amendment resolutions. |
| Austria | [RIS — Federal Constitutional Law, version 21 Oct 2026](https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10000138) / [RIS legal information system](https://www.bundeskanzleramt.gv.at/service/rechtsinformation.html) | B-VG is one of several constitutional acts/provisions. RIS says authentic Federal Law Gazette is legally binding; consolidated text is a legal information version. |
| Finland | [Finlex — updated Finnish Constitution 731/1999](https://www.finlex.fi/en/legislation/1999/731) / [English translation history](https://www.finlex.fi/en/legislation/translations/1999/eng/731) | English translation completed 9 June 2026 but tracks amendments only through 817/2018; Finnish and Swedish official texts control. |
| Sweden | [Government — four fundamental laws](https://www.government.se/how-sweden-is-governed/the-constitution/) / [Riksdag constitutional amendments pending](https://www.riksdagen.se/en/news/articles/2026/jun/16/constitutional-amendments-pending-decision_cms2d688979-b1a3-4158-90eb-f6bf86a98087en/) | Four fundamental laws make up the Constitution. Proposals approved in the first vote during 2022–2026 need an identical second vote after an election to take effect; do not include them before enactment. |
| Poland | [Sejm — official Constitution in English](https://www.sejm.gov.pl/prawo/konst/angielski/konse.htm) / [Polish text](https://www.sejm.gov.pl/prawo/konst/polski/kon1.htm) | Constitution adopted 2 April 1997; verify all subsequent constitutional enactments against Dziennik Ustaw and retain Polish as authoritative. |
| Belgium | [Belgian Senate — Constitution coordinated 25 Jun 2025](https://www.senate.be/doc/20250625_CONSTITUTION.pdf) | Constitution is published in Dutch, French and German. Verify that no later constitutional revision occurred and reconcile each language text with the Official Gazette. |
| Ukraine | [Verkhovna Rada — Constitution](https://zakon.rada.gov.ua/laws/show/254%D0%BA/96-%D0%B2%D1%80) / [English database copy](https://zakon.rada.gov.ua/laws/show/en/%D0%BA%D0%BE%D0%BD%D1%81%D1%82%D0%B8%D1%82%D1%83%D1%86%D0%B8%D1%8F) | Official database lists current revision 1 Jan 2020 under Law 27-IX and says content is CC BY 4.0 unless otherwise stated. Verify further amendments, martial-law constraints and any source-specific exceptions; Ukrainian text controls. |
| Switzerland | [Federal Assembly — Federal Constitution](https://www.parlament.ch/en/%C3%BCber-das-parlament/Pages/bundesverfassung.aspx) / [Fedlex SR 101](https://www.fedlex.admin.ch/eli/cc/1999/404/en) | Federal Constitution of 18 April 1999, available in German, French and Italian (and Romansh publication); do not rely on an older single-language PDF as the current consolidation. |
| Czech Republic | [Prague Castle — Constitution](https://www.hrad.cz/en/czech-republic/constitution-of-the-cr) / [Chamber legal framework](https://pspen.psp.cz/chamber-members/legal-framework/) | Constitutional Act No. 1/1993 Coll.; official Presidency page includes amendment No. 87/2024 Coll. Constitutional order also includes the Charter of Fundamental Rights and Basic Freedoms and other constitutional acts. |

### Batch 6 — observer states and special jurisdictions
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
