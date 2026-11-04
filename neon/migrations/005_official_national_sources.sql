-- Official publisher catalogue for the first national-coverage wave.
-- Source records point to authoritative publishers; they do not imply that
-- every jurisdiction's full Constitution is already imported or verified.
-- Every document still needs its own effective-date/version and rights review.

insert into legal_sources
(slug,name,publisher,source_type,jurisdiction_iso,source_url,feed_url,api_url,documentation_url,
 authority_rank,is_official,license_status,commercial_use_allowed,attribution_text,content_scope,
 poll_interval_minutes,is_active,metadata)
values
('new-zealand-legislation','New Zealand Legislation','Parliamentary Counsel Office, New Zealand','legislation_portal','NZ',
 'https://www.legislation.govt.nz/','', 'https://www.legislation.govt.nz/','https://www.legislation.govt.nz/copyright/',
 1,true,'public_domain_verified',true,
 'Source: New Zealand Legislation. Check the current official version and identify any incorporated third-party material.',
 'Official New Zealand Acts, Bills and secondary legislation. Section 27 Copyright Act 1994 states no copyright subsists in legislation; incorporated-by-reference and third-party content requires separate review.',
 null,false,'{"jurisdiction":"NZ","rightsEvidenceUrl":"https://www.legislation.govt.nz/copyright/","rightsNotes":"New Zealand Legislation states that no copyright exists in New Zealand legislation under section 27 of the Copyright Act 1994. Exclude or independently clear works incorporated by reference and third-party material. Verify exact document/version before import.","usage":"official_primary_text"}'::jsonb),
('canada-justice-laws','Justice Laws Website','Department of Justice Canada','legislation_portal','CA',
 'https://laws-lois.justice.gc.ca/eng/','', 'https://laws-lois.justice.gc.ca/eng/','https://canada.justice.gc.ca/eng/terms-avis/index.html',
 1,true,'review_required',false,null,
 'Official federal statutes and regulations, including constitutional instruments. The Reproduction of Federal Law Order has conditions; confirm intended commercial presentation, accuracy and third-party exceptions before import.',
 null,false,'{"jurisdiction":"CA","rightsEvidenceUrl":"https://canada.justice.gc.ca/eng/terms-avis/index.html","rightsNotes":"Review the Reproduction of Federal Law Order and confirm scope with counsel before enabling commercial redistribution. Do not represent CARTA reproductions as official versions; exclude third-party material and editorial headnotes.","usage":"official_primary_source_rights_review"}'::jsonb),
('south-africa-govza','South African Government Documents','Government Communication and Information System / gov.za','legislation_portal','ZA',
 'https://www.gov.za/documents','', 'https://www.gov.za/documents','https://www.gov.za/about-website',
 1,true,'review_required',false,null,
 'Official government documents and constitutional materials. Link to the authoritative government publication; review copyright and reuse scope before copying text.',
 null,false,'{"jurisdiction":"ZA","usage":"official_primary_source_rights_review"}'::jsonb),
('india-legislative-department','Legislative Department of India','Ministry of Law and Justice, Government of India','legislation_portal','IN',
 'https://legislative.gov.in/','', 'https://www.indiacode.nic.in/','https://www.nic.gov.in/terms-of-use/',
 1,true,'review_required',false,null,
 'Official legislative department and India Code discovery routes for constitutional and statutory texts. NIC terms require permission for reproducing portal material; seek item-specific rights clearance.',
 null,false,'{"jurisdiction":"IN","usage":"official_primary_source_rights_review","rightsEvidenceUrl":"https://www.nic.gov.in/terms-of-use/","rightsNotes":"Portal terms require permission to reproduce featured material; third-party material is excluded. Obtain written permission or a specific public-domain basis before commercial text import or AI retrieval."}'::jsonb),
('us-constitution-congress','Constitution Annotated / Constitution of the United States','Congressional Research Service / Library of Congress','constitution_catalog','US',
 'https://constitution.congress.gov/','', 'https://constitution.congress.gov/','https://www.govinfo.gov/about/policies',
 1,true,'review_required',false,null,
 'Official U.S. Constitution reference and analysis. Distinguish constitutional text from CRS annotations and third-party source content. Use GovInfo/public-domain official text for imports after item review.',
 null,false,'{"jurisdiction":"US","usage":"official_reference_and_discovery","note":"Constitution Annotated includes editorial analysis; do not ingest as constitutional text."}'::jsonb),
('tanzania-oag','Office of the Attorney General of Tanzania','Office of the Attorney General, United Republic of Tanzania','legislation_portal','TZ',
 'https://oagmis.oag.go.tz/','', 'https://oagmis.oag.go.tz/','https://oagmis.oag.go.tz/',
 1,true,'review_required',false,null,
 'Official legislation and legal materials discovery portal; verify document status and applicable government-printer/Gazette version before importing.',
 null,false,'{"jurisdiction":"TZ","usage":"official_primary_source_rights_review"}'::jsonb),
('uganda-parliament','Parliament of Uganda','Parliament of Uganda','constitution_catalog','UG',
 'https://www.parliament.go.ug/','', 'https://www.parliament.go.ug/','https://www.parliament.go.ug/',
 1,true,'review_required',false,null,
 'Official Parliament site for constitutional, legislative and parliamentary materials discovery. Seek the current legal text and Gazette/amendment notices from authorised publishers.',
 null,false,'{"jurisdiction":"UG","usage":"official_primary_source_rights_review"}'::jsonb),
('ghana-parliament','Parliament of Ghana','Parliament of Ghana','constitution_catalog','GH',
 'https://www.parliament.gh/','', 'https://www.parliament.gh/','https://www.parliament.gh/',
 1,true,'review_required',false,null,
 'Official parliament discovery source for constitutional and legislative materials. Verify final enacted text and Gazette publication.',
 null,false,'{"jurisdiction":"GH","usage":"official_primary_source_rights_review"}'::jsonb),
('nigeria-house-assembly','National Assembly of Nigeria','National Assembly of Nigeria','constitution_catalog','NG',
 'https://nass.gov.ng/','', 'https://nass.gov.ng/','https://nass.gov.ng/',
 1,true,'review_required',false,null,
 'Official legislature discovery source. Verify current consolidated constitutional text, alterations and Federal Gazette publication before import.',
 null,false,'{"jurisdiction":"NG","usage":"official_primary_source_rights_review"}'::jsonb),
('rwanda-minijust','Ministry of Justice Rwanda','Ministry of Justice, Republic of Rwanda','legislation_portal','RW',
 'https://www.minijust.gov.rw/','', 'https://www.minijust.gov.rw/','https://www.minijust.gov.rw/',
 1,true,'review_required',false,null,
 'Official Ministry of Justice source for legal system and legislation discovery. Confirm the Official Gazette and authoritative language/version.',
 null,false,'{"jurisdiction":"RW","usage":"official_primary_source_rights_review"}'::jsonb)
on conflict (slug) do update set
 name=excluded.name,publisher=excluded.publisher,source_type=excluded.source_type,
 jurisdiction_iso=excluded.jurisdiction_iso,source_url=excluded.source_url,feed_url=excluded.feed_url,
 api_url=excluded.api_url,documentation_url=excluded.documentation_url,authority_rank=excluded.authority_rank,
 is_official=excluded.is_official,license_status=excluded.license_status,
 commercial_use_allowed=excluded.commercial_use_allowed,attribution_text=excluded.attribution_text,
 content_scope=excluded.content_scope,poll_interval_minutes=excluded.poll_interval_minutes,
 metadata=excluded.metadata,updated_at=now();

-- The Australian Register is an official, commercially reusable CC BY 4.0
-- source for most content. Exclude the Coat of Arms and third-party material.
update legal_sources set
  license_status='open_license', commercial_use_allowed=true,
  content_scope='Official Commonwealth legislation API. Most content is CC BY 4.0 and commercially reusable with attribution; exclude Commonwealth Coat of Arms and separately identified third-party material.',
  attribution_text='Sourced from the Federal Register of Legislation at [date of download]. For the latest information on Australian Government law please go to https://www.legislation.gov.au.',
  metadata=metadata || '{"rightsEvidenceUrl":"https://www.legislation.gov.au/terms-of-use","rightsNotes":"The Register states most content is CC BY 4.0 and may be copied/adapted commercially with attribution. Exclude the Commonwealth Coat of Arms and any identified third-party copyright material. Each imported document must still pass per-item review.","usage":"official_api_primary_text"}'::jsonb,
  updated_at=now()
where slug='australia-federal-register';

-- The UK OGL generally allows commercial reuse, but CARTA retains a per-item
-- review for exclusions and third-party/parliamentary material.
update legal_sources set
  license_status='open_license', commercial_use_allowed=true,
  content_scope='Official UK, Scottish, Welsh and Northern Irish legislation metadata feed. OGL v3.0 applies generally; inspect per-item exclusions and third-party material before text import.',
  attribution_text='Contains public sector information licensed under the Open Government Licence v3.0.',
  metadata=metadata || '{"rightsEvidenceUrl":"https://www.gov.uk/government/publications/open-government-licence/version/3","rightsNotes":"OGL v3.0 generally permits commercial reuse with attribution. Review each legislation item for parliamentary, third-party or other excluded material before importing the text; preserve required attribution.","usage":"official_metadata_and_text_after_item_review"}'::jsonb,
  updated_at=now()
where slug='uk-legislation-new-feed';

-- GovInfo can distribute U.S. federal government works, which are generally
-- public domain under 17 U.S.C. 105. Third-party content remains excluded.
update legal_sources set
  license_status='public_domain_verified', commercial_use_allowed=true,
  content_scope='U.S. federal government works generally public domain under 17 U.S.C. 105. Check each publication for separately copyrighted third-party content, images, and material supplied under permission.',
  metadata=metadata || '{"rightsEvidenceUrl":"https://www.govinfo.gov/about/policies","rightsNotes":"17 U.S.C. 105 generally places works prepared by U.S. federal officers/employees within official duties in the public domain. GovInfo warns that third-party copyrighted material may appear in publications; verify document components before import.","usage":"official_metadata_and_public_domain_text_after_item_review"}'::jsonb,
  updated_at=now()
where slug in ('govinfo-federal-register-rss','govinfo-bills-rss','govinfo-us-reports-rss');
