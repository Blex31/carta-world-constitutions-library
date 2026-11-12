-- South Sudan (SS)
-- Publisher: Not specified
-- Source URL: 

INSERT INTO legal_sources (
  slug,
  name,
  publisher,
  source_type,
  jurisdiction_iso,
  source_url,
  feed_url,
  authority_rank,
  is_official,
  license_status,
  commercial_use_allowed,
  is_active,
  content_scope,
  metadata
) VALUES (
  'ss-official',
  'South Sudan Official Publisher',
  'Official Government Publisher',
  'official_gazette',
  'SS',
  '',
  NULL,
  100,
  true,
  'review_required',
  false,
  false,
  'Official constitutional and legislative texts',
  '{
    "rightsEvidenceUrl": "",
    "rightsNotes": "Rights review required. Verify official publisher, exact edition, commencement/effective dates, amendments, language precedence, attribution and intended reuse rights for CARTA use cases: full-text web/mobile display, indexing, AI retrieval/embeddings, and offline device caching.",
    "rightsReviewStatus": "review_required",
    "allowedHosts": ["example.com"]
  }'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  publisher = EXCLUDED.publisher,
  source_type = EXCLUDED.source_type,
  jurisdiction_iso = EXCLUDED.jurisdiction_iso,
  source_url = EXCLUDED.source_url,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

-- Activate after legal review (uncomment when ready):
-- UPDATE legal_sources SET commercial_use_allowed = true, is_active = true, license_status = 'official_text_exclusion', metadata = jsonb_set(metadata, '{rightsReviewStatus}', '"legal_opinion_on_file"') WHERE slug = 'ss-official';

