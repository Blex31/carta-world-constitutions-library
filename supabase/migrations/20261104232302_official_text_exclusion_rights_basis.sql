-- Distinguish statutory exclusion of official texts from a licence or public-domain finding.
-- This status must remain blocked for publication until a documented legal opinion
-- confirms the exact statutory basis covers CARTA's intended commercial/mobile/AI uses.

alter table public.legal_sources
  drop constraint if exists legal_sources_license_status_check;
alter table public.legal_sources
  add constraint legal_sources_license_status_check
  check (license_status in (
    'approved','public_domain_verified','open_license','review_required',
    'noncommercial_only','restricted','permission_granted','official_text_exclusion'
  ));

alter table public.legal_documents
  drop constraint if exists legal_documents_license_check;
alter table public.legal_documents
  add constraint legal_documents_license_check
  check (license_status in (
    'approved','public_domain_verified','open_license','review_required',
    'noncommercial_only','restricted','permission_granted','official_text_exclusion'
  ));

drop policy if exists "Read reusable legal documents or admin" on public.legal_documents;
create policy "Read reusable legal documents or admin"
on public.legal_documents for select to anon,authenticated
using (
  (
    document_status='verified'
    and license_status in ('approved','public_domain_verified','open_license','permission_granted','official_text_exclusion')
    and commercial_use_allowed=true
    and exists (
      select 1 from public.legal_sources s
      where s.id=source_id
        and s.is_official=true
        and s.license_status in ('approved','public_domain_verified','open_license','permission_granted','official_text_exclusion')
        and s.commercial_use_allowed=true
    )
  )
  or (((select auth.jwt())->'app_metadata'->>'role')='admin')
);

drop policy if exists "Read reusable sections or admin" on public.document_sections;
create policy "Read reusable sections or admin"
on public.document_sections for select to anon,authenticated
using (
  exists (
    select 1
    from public.legal_documents d
    join public.legal_sources s on s.id=d.source_id
    where d.id=document_id
      and d.document_status='verified'
      and d.license_status in ('approved','public_domain_verified','open_license','permission_granted','official_text_exclusion')
      and d.commercial_use_allowed=true
      and s.is_official=true
      and s.license_status in ('approved','public_domain_verified','open_license','permission_granted','official_text_exclusion')
      and s.commercial_use_allowed=true
  )
  or (((select auth.jwt())->'app_metadata'->>'role')='admin')
);

drop policy if exists "Read reusable chunks or admin" on public.document_chunks;
create policy "Read reusable chunks or admin"
on public.document_chunks for select to anon,authenticated
using (
  exists (
    select 1
    from public.legal_documents d
    join public.legal_sources s on s.id=d.source_id
    where d.id=document_id
      and d.document_status='verified'
      and d.license_status in ('approved','public_domain_verified','open_license','permission_granted','official_text_exclusion')
      and d.commercial_use_allowed=true
      and s.is_official=true
      and s.license_status in ('approved','public_domain_verified','open_license','permission_granted','official_text_exclusion')
      and s.commercial_use_allowed=true
  )
  or (((select auth.jwt())->'app_metadata'->>'role')='admin')
);
