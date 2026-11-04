-- Additional official daily sources, selected from publishers' own feed/API indexes.
-- Ingestion is metadata-only. It stores title, date, canonical publisher URL and a
-- publisher label; no RSS summaries or full text are copied by default.

insert into legal_sources
(slug,name,publisher,source_type,jurisdiction_iso,source_url,feed_url,api_url,documentation_url,
 authority_rank,is_official,license_status,commercial_use_allowed,content_scope,poll_interval_minutes,is_active,metadata)
values
('un-geneva-press-rss','UN Geneva Press Releases','United Nations Office at Geneva','government_news',null,
 'https://www.ungeneva.org/en/news-media/rss','https://www.ungeneva.org/news-media/press-releases-list/rss.xml',null,
 'https://www.ungeneva.org/en/news-media/rss',1,true,'review_required',false,
 'Official United Nations press-release metadata. Use for global human-rights, treaty and institutional updates; each item links to the publisher. Metadata-only until content reuse is separately cleared.',360,true,
 '{"region":"International","feedFormat":"RSS","metadataOnly":true,"allowedHosts":["ungeneva.org"],"feedEvidenceUrl":"https://www.ungeneva.org/en/news-media/rss","rightsNotes":"Feed discovery and headline/date/link display only. Do not republish body text or summaries without confirming UN content reuse terms and any third-party rights."}'::jsonb),
('un-geneva-meetings-rss','UN Geneva Meeting Summaries','United Nations Office at Geneva','government_news',null,
 'https://www.ungeneva.org/en/news-media/rss','https://www.ungeneva.org/news-media/meeting-summaries-list/rss.xml',null,
 'https://www.ungeneva.org/en/news-media/rss',1,true,'review_required',false,
 'Official UN Geneva meeting-summary metadata. Treat summaries as institutional reporting, not as binding treaty text or court holdings.',360,true,
 '{"region":"International","feedFormat":"RSS","metadataOnly":true,"allowedHosts":["ungeneva.org"],"feedEvidenceUrl":"https://www.ungeneva.org/en/news-media/rss","rightsNotes":"Metadata-only. Do not copy the full meeting summary into CARTA without a documented reuse basis."}'::jsonb),
('za-justice-updates-rss','South Africa Justice and Constitutional Development Updates','Department of Justice and Constitutional Development, South Africa','government_news','ZA',
 'https://www.justice.gov.za/','https://feeds2.feedburner.com/JusticegovUpdates',null,
 'https://www.gov.za/rss-feeds',1,true,'review_required',false,
 'Official government-listed RSS feed for Justice and Constitutional Development updates. Treat headlines as government communications, not as enacted legislation or judicial decisions.',360,true,
 '{"jurisdiction":"ZA","feedFormat":"RSS","metadataOnly":true,"allowedHosts":["justice.gov.za"],"feedEvidenceUrl":"https://www.gov.za/rss-feeds","rightsNotes":"The South African Government RSS index lists this Justice Department feed. The feed host is FeedBurner; canonical item links must resolve to justice.gov.za. Metadata-only until reuse terms for any linked content are cleared."}'::jsonb),
('nz-legislation-api','New Zealand Legislation API','Parliamentary Counsel Office, New Zealand','legislation_portal','NZ',
 'https://www.legislation.govt.nz/','', 'https://api.legislation.govt.nz/v0/works/','https://api.legislation.govt.nz/docs/',
 1,true,'public_domain_verified',true,
 'Official API for searching legislation and retrieving versions and official XML/PDF links. Requires an API key; adapter not yet enabled. New Zealand legislation is not subject to copyright under section 27, but third-party/incorporated content remains excluded.',1440,false,
 '{"jurisdiction":"NZ","apiFormat":"REST","requiresApiKey":true,"apiKeyEnv":"NZ_LEGISLATION_API_KEY","metadataOnly":true,"rightsEvidenceUrl":"https://www.legislation.govt.nz/copyright/","rightsNotes":"The official copyright notice states no copyright subsists in New Zealand legislation under section 27 of the Copyright Act 1994. Exclude third-party and incorporated works; API use requires an API key. The importer must preserve work/version IDs and effective dates.","usage":"official_api_adapter_pending"}'::jsonb),
('un-treaty-collection','United Nations Treaty Collection','United Nations Treaty Section','treaty_database',null,
 'https://treaties.un.org/','', 'https://treaties.un.org/Pages/ParticipationStatus.aspx','https://treaties.un.org/pages/Content.aspx?path=DB/MTDSGStatus/pageIntro_en.xml',
 1,true,'review_required',false,
 'Authoritative multilateral treaty texts and status data: signatures, ratifications, accessions, reservations, declarations, objections and entry-into-force dates. Status metadata changes daily; a structured API/export adapter and item-level reuse review are required before ingestion.',1440,false,
 '{"region":"International","metadataOnly":true,"feedEvidenceUrl":"https://treaties.un.org/pages/Content.aspx?path=DB/MTDSGStatus/pageIntro_en.xml","rightsNotes":"Treaty status is authoritative. Do not imply signature equals ratification or entry into force. Build a dedicated metadata adapter and verify terms for treaty text reuse before indexing full text.","usage":"structured_adapter_pending"}'::jsonb)
on conflict (slug) do update set
 name=excluded.name,publisher=excluded.publisher,source_type=excluded.source_type,
 jurisdiction_iso=excluded.jurisdiction_iso,source_url=excluded.source_url,
 feed_url=excluded.feed_url,api_url=excluded.api_url,documentation_url=excluded.documentation_url,
 authority_rank=excluded.authority_rank,is_official=excluded.is_official,license_status=excluded.license_status,
 commercial_use_allowed=excluded.commercial_use_allowed,content_scope=excluded.content_scope,
 poll_interval_minutes=excluded.poll_interval_minutes,is_active=excluded.is_active,
 metadata=excluded.metadata,updated_at=now();

-- Explicit note: Kenya Law and SAFLII remain disabled as full-text/AI sources until
-- CARTA has written permission for commercial redistribution and AI retrieval.
update legal_sources set is_active=false, commercial_use_allowed=false,
  metadata=metadata || '{"usage":"discovery_only_until_written_permission"}'::jsonb, updated_at=now()
where slug in ('kenya-law','saflii-directory');
