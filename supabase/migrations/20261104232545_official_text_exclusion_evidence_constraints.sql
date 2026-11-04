-- Require a written legal opinion record before a source or document can claim
-- the statutory official-text-exclusion rights basis. This is separate from a licence.
alter table public.legal_sources
  drop constraint if exists legal_sources_official_text_exclusion_review_check;
alter table public.legal_sources
  add constraint legal_sources_official_text_exclusion_review_check
  check (
    license_status <> 'official_text_exclusion'
    or (
      metadata->>'rightsReviewStatus' = 'legal_opinion_on_file'
      and coalesce(metadata->>'rightsEvidenceUrl','') ~ '^https://'
      and length(trim(coalesce(metadata->>'rightsNotes',''))) >= 20
    )
  );

alter table public.legal_documents
  drop constraint if exists legal_documents_official_text_exclusion_review_check;
alter table public.legal_documents
  add constraint legal_documents_official_text_exclusion_review_check
  check (
    license_status <> 'official_text_exclusion'
    or (
      metadata->>'rightsReviewStatus' = 'legal_opinion_on_file'
      and coalesce(metadata->>'rightsEvidenceUrl','') ~ '^https://'
      and length(trim(coalesce(metadata->>'rightsNotes',''))) >= 20
    )
  );
