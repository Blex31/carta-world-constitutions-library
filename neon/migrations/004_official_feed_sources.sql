-- Official metadata feeds. The ingestion service stores headlines, timestamps and
-- canonical publisher URLs only unless the individual content licence is cleared.
-- UK OGL and Australian CC BY notices do not override per-item third-party exclusions.

insert into legal_sources
(slug,name,publisher,source_type,source_url,feed_url,api_url,documentation_url,authority_rank,is_official,license_status,commercial_use_allowed,content_scope,poll_interval_minutes,is_active,metadata)
values
('uk-legislation-new-feed','UK Legislation — New Legislation Feed','The National Archives / legislation.gov.uk','legislation_portal',
 'https://www.legislation.gov.uk/new','https://www.legislation.gov.uk/new/data.feed',
 'https://www.legislation.gov.uk/','https://legislation.github.io/data-documentation/api/search.html',
 1,true,'open_license',false,
 'Daily metadata feed for newly published UK, Scottish, Welsh and Northern Irish legislation. Content is generally reusable under OGL v3.0; item-level exclusions and Crown/parliamentary/third-party materials must be reviewed before text import.',
 1440,true,
 '{"jurisdiction":"GB","feedFormat":"Atom","metadataOnly":true,"rightsEvidenceUrl":"https://www.gov.uk/government/publications/open-government-licence/version/3","rightsNotes":"The National Archives says legislation.gov.uk content is reusable under OGL v3.0. Review the specific item for excluded parliamentary, third-party or separately licensed content before importing full text.","usage":"official_metadata_feed"}'::jsonb),
('australia-federal-register','Australian Federal Register of Legislation','Office of Parliamentary Counsel, Australia','legislation_portal',
 'https://www.legislation.gov.au/','',
 'https://api.prod.legislation.gov.au/v1/','https://api.prod.legislation.gov.au/swagger/index.html',
 1,true,'open_license',false,
 'Official Commonwealth legislation metadata and documents via the public REST/OData API. Most register content is CC BY 4.0 and commercially reusable with attribution; identified third-party content is excluded. API adapter remains a separate ingestion job.',
 1440,false,
 '{"jurisdiction":"AU","apiFormat":"OData v4","requiresApiKey":false,"metadataOnly":true,"rightsEvidenceUrl":"https://www.legislation.gov.au/terms-of-use","rightsNotes":"The Register says most content is CC BY 4.0 and permits commercial reuse with attribution. The Coat of Arms and identified third-party material are excluded; verify each document and preserve the required attribution.","usage":"api_metadata_pending_adapter"}'::jsonb)
on conflict (slug) do update set
 name=excluded.name,publisher=excluded.publisher,source_type=excluded.source_type,source_url=excluded.source_url,
 feed_url=excluded.feed_url,api_url=excluded.api_url,documentation_url=excluded.documentation_url,
 authority_rank=excluded.authority_rank,is_official=excluded.is_official,license_status=excluded.license_status,
 commercial_use_allowed=excluded.commercial_use_allowed,content_scope=excluded.content_scope,
 poll_interval_minutes=excluded.poll_interval_minutes,metadata=excluded.metadata,updated_at=now();

-- Enable only official RSS/Atom metadata feeds. RSS article bodies and snippets remain excluded
-- until a source-specific rights decision is recorded by an administrator.
update legal_sources
set is_active=true, updated_at=now()
where slug in ('echr-hudoc-rss','curia-rss','govinfo-federal-register-rss','govinfo-bills-rss','govinfo-us-reports-rss','uk-legislation-new-feed')
  and is_official=true and feed_url is not null;

-- Curia now exposes its feed over HTTPS; the ingestion worker rejects non-HTTPS URLs.
update legal_sources
set feed_url='https://curia.europa.eu/site/rss.jsp?lang=en&secondLang=fr', updated_at=now()
where slug='curia-rss';
