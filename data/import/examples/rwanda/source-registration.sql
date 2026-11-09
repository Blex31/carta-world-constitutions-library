-- CARTA: Rwanda Legal Source Registration
-- 
-- This SQL file registers the official Rwandan legal sources for constitution import.
-- Run this BEFORE attempting to import the Rwanda Constitution.
--
-- PREREQUISITE: Ensure the jurisdiction 'RW' exists in the jurisdictions table
--
-- VERIFY: Check if jurisdiction exists
--   SELECT * FROM jurisdictions WHERE iso_code = 'RW';
--
-- If it doesn't exist, seed it first using:
--   psql -f data/jurisdictions.seed.json

-- ============================================================================
-- SOURCE 1: Rwanda Law Reform Commission (Primary Source)
-- ============================================================================
-- This is the authoritative source for Rwandan legislation
-- URL: https://www.rlrc.gov.rw

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
  'rwanda-rlrc',
  'Rwanda Law Reform Commission',
  'Ministry of Justice / Rwanda Law Reform Commission',
  'official_gazette',
  'RW',
  'https://www.rlrc.gov.rw',
  NULL,
  100,
  true,
  'review_required',
  false,
  false,
  'Official legislative texts and consolidated laws of Rwanda',
  '{
    "rightsEvidenceUrl": "https://www.wipo.int/wipolex/en/legislation/details/22672",
    "rightsNotes": "Law No. 055/2024 of 20/06/2024, Article 282 (published and effective 31/07/2024) excludes official legislative, administrative and judicial texts and official translations from copyright protection. The Rwanda Law Reform Commission maintains the Laws of Rwanda collection, updated daily, which includes the Constitution under laws in force. Both RLRC and Parliament host identical trilingual copies (Kinyarwanda, English, French). Local counsel must confirm this exclusion covers CARTA\'s intended uses: full-text web/mobile display, indexing, AI retrieval/embeddings, and offline device caching.",
    "rightsReviewStatus": "counsel_and_publisher_confirmation_pending",
    "allowedHosts": ["www.rlrc.gov.rw", "rlrc.gov.rw"],
    "languagePrecedenceRule": "Constitution Article 96(4): where a law\'s Official Gazette language versions conflict, the language in which that law was adopted prevails. Confirm adoption language of the 2023 constitutional revision with RLRC/counsel.",
    "adoptionLanguage": "Kinyarwanda",
    "officialLanguages": ["Kinyarwanda", "English", "French"],
    "consolidationStatus": "2023 revision, Official Gazette n° Special of 04/08/2023",
    "amendmentHistory": "Original 2003 Constitution, revised 2015, 2023 revision",
    "lastVerified": "2026-11-09",
    "verificationNotes": "RLRC Laws of Rwanda collection updated daily. Parliament-hosted copy matches RLRC text. No later constitutional amendments found in 2024-2026 Gazette search. Publisher confirmation and legal review still required before marking as verified.",
    "documentationUrl": "https://www.rlrc.gov.rw/about-us",
    "contactEmail": "info@rlrc.gov.rw",
    "sourceCategory": "primary"
  }'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  publisher = EXCLUDED.publisher,
  source_type = EXCLUDED.source_type,
  jurisdiction_iso = EXCLUDED.jurisdiction_iso,
  source_url = EXCLUDED.source_url,
  feed_url = EXCLUDED.feed_url,
  authority_rank = EXCLUDED.authority_rank,
  is_official = EXCLUDED.is_official,
  license_status = EXCLUDED.license_status,
  commercial_use_allowed = EXCLUDED.commercial_use_allowed,
  is_active = EXCLUDED.is_active,
  content_scope = EXCLUDED.content_scope,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

-- ============================================================================
-- SOURCE 2: Parliament of Rwanda (Secondary Source)
-- ============================================================================
-- Hosts the Official Gazette copy of the Constitution
-- URL: https://www.parliament.gov.rw

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
  'rwanda-parliament',
  'Parliament of Rwanda',
  'Parliament of the Republic of Rwanda',
  'legislative_body',
  'RW',
  'https://www.parliament.gov.rw',
  NULL,
  90,
  true,
  'review_required',
  false,
  false,
  'Official constitutional and legislative texts',
  '{
    "rightsEvidenceUrl": "https://www.wipo.int/wipolex/en/legislation/details/22672",
    "rightsNotes": "Parliament hosts the Official Gazette copy of the Constitution. Law No. 055/2024, Article 282 excludes official legislative texts from copyright. Parliament copy matches RLRC version. Same rights basis applies as RLRC source. This is a secondary/confirmation source.",
    "rightsReviewStatus": "counsel_and_publisher_confirmation_pending",
    "allowedHosts": ["www.parliament.gov.rw", "parliament.gov.rw"],
    "consolidationStatus": "2023 revision, matches RLRC text",
    "sourceRole": "confirmation",
    "documentationUrl": "https://www.parliament.gov.rw/about-parliament",
    "contactEmail": "info@parliament.gov.rw",
    "sourceCategory": "secondary"
  }'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  publisher = EXCLUDED.publisher,
  source_type = EXCLUDED.source_type,
  jurisdiction_iso = EXCLUDED.jurisdiction_iso,
  source_url = EXCLUDED.source_url,
  feed_url = EXCLUDED.feed_url,
  authority_rank = EXCLUDED.authority_rank,
  is_official = EXCLUDED.is_official,
  license_status = EXCLUDED.license_status,
  commercial_use_allowed = EXCLUDED.commercial_use_allowed,
  is_active = EXCLUDED.is_active,
  content_scope = EXCLUDED.content_scope,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

-- ============================================================================
-- ACTIVATION SCRIPT (Run AFTER Legal Review)
-- ============================================================================
-- This script activates the sources and enables commercial use AFTER:
-- 1. Legal review is complete
-- 2. Rights basis is confirmed
-- 3. Legal opinion is on file
--
-- Uncomment and run this AFTER legal approval:

-- -- Activate Rwanda Law Reform Commission
-- UPDATE legal_sources 
-- SET 
--   commercial_use_allowed = true,
--   is_active = true,
--   license_status = 'official_text_exclusion',
--   metadata = jsonb_set(
--     metadata,
--     '{rightsReviewStatus}',
--     '"legal_opinion_on_file"'
--   )
-- WHERE slug = 'rwanda-rlrc';
--
-- -- Activate Parliament of Rwanda
-- UPDATE legal_sources 
-- SET 
--   commercial_use_allowed = true,
--   is_active = true,
--   license_status = 'official_text_exclusion',
--   metadata = jsonb_set(
--     metadata,
--     '{rightsReviewStatus}',
--     '"legal_opinion_on_file"'
--   )
-- WHERE slug = 'rwanda-parliament';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check if sources were registered:
-- SELECT slug, name, is_official, commercial_use_allowed, is_active, license_status 
-- FROM legal_sources 
-- WHERE slug IN ('rwanda-rlrc', 'rwanda-parliament');

-- Check jurisdiction exists:
-- SELECT iso_code, name, constitution_status 
-- FROM jurisdictions 
-- WHERE iso_code = 'RW';
