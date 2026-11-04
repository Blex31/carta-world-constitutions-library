-- CARTA initial Supabase schema. This migration is the reproducible counterpart
-- of the live MCP-applied migration with the same timestamp/name.
create extension if not exists pgcrypto;

create table if not exists public.jurisdictions (
  iso_code text primary key,
  name text not null,
  official_name text,
  native_name text,
  flag_emoji text,
  continent text,
  region text,
  jurisdiction_kind text not null default 'unclassified'
    check (jurisdiction_kind in ('sovereign_state','territory','dependent_area','international','unclassified')),
  is_un_member boolean,
  is_active boolean not null default true,
  constitution_status text not null default 'not_loaded'
    check (constitution_status in ('not_loaded','metadata_only','text_loaded','verified_current','needs_review','no_single_written_constitution')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.legal_sources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  publisher text,
  source_type text not null,
  jurisdiction_iso text references public.jurisdictions(iso_code) on delete set null,
  source_url text not null,
  feed_url text,
  api_url text,
  documentation_url text,
  authority_rank smallint not null default 50 check (authority_rank between 1 and 100),
  is_official boolean not null default false,
  license_status text not null default 'review_required'
    check (license_status in ('approved','public_domain_verified','open_license','review_required','noncommercial_only','restricted','permission_granted')),
  commercial_use_allowed boolean not null default false,
  attribution_text text,
  content_scope text,
  poll_interval_minutes integer check (poll_interval_minutes is null or poll_interval_minutes >= 15),
  last_polled_at timestamptz,
  last_success_at timestamptz,
  is_active boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.legal_documents (
  id uuid primary key default gen_random_uuid(),
  jurisdiction_iso text references public.jurisdictions(iso_code) on delete set null,
  source_id uuid references public.legal_sources(id) on delete set null,
  doc_type text not null check (doc_type in ('constitution','constitutional_amendment','act','bill','regulation','gazette_notice','court_decision','treaty','international_instrument','official_guidance','other')),
  title text not null,
  short_title text,
  document_number text,
  language_code text not null default 'en',
  official_url text not null,
  source_reference text,
  adopted_at date,
  published_at date,
  effective_from date,
  effective_until date,
  version_label text,
  is_current boolean not null default false,
  document_status text not null default 'needs_review' check (document_status in ('draft','needs_review','verified','superseded','repealed','withdrawn')),
  full_text text,
  content_sha256 text,
  license_status text not null default 'review_required' check (license_status in ('approved','public_domain_verified','open_license','review_required','noncommercial_only','restricted','permission_granted')),
  commercial_use_allowed boolean not null default false,
  replaces_document_id uuid references public.legal_documents(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists legal_documents_source_url_sha_uq on public.legal_documents(official_url, coalesce(content_sha256, ''));
create index if not exists legal_documents_country_type_idx on public.legal_documents(jurisdiction_iso, doc_type, is_current);
create index if not exists legal_documents_current_idx on public.legal_documents(is_current, document_status);

create table if not exists public.document_sections (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.legal_documents(id) on delete cascade,
  parent_section_id uuid references public.document_sections(id) on delete cascade,
  section_number text,
  heading text,
  section_order integer not null default 0,
  original_text text not null,
  plain_language_summary text,
  source_location text,
  updated_at timestamptz not null default now()
);
create index if not exists document_sections_document_order_idx on public.document_sections(document_id, section_order);

create table if not exists public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.legal_documents(id) on delete cascade,
  section_id uuid references public.document_sections(id) on delete cascade,
  chunk_index integer not null,
  language_code text not null default 'en',
  heading text,
  content text not null,
  token_count integer,
  search_vector tsvector generated always as (to_tsvector('simple', coalesce(heading, '') || ' ' || content)) stored,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(document_id, section_id, chunk_index, language_code)
);
create index if not exists document_chunks_search_idx on public.document_chunks using gin(search_vector);
create index if not exists document_chunks_document_idx on public.document_chunks(document_id, chunk_index);

create table if not exists public.feed_items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.legal_sources(id) on delete restrict,
  jurisdiction_iso text references public.jurisdictions(iso_code) on delete set null,
  document_id uuid references public.legal_documents(id) on delete set null,
  external_id text,
  item_type text not null default 'legal_update',
  title text not null,
  summary text,
  content_excerpt text,
  canonical_url text not null,
  published_at timestamptz,
  fetched_at timestamptz not null default now(),
  verification_status text not null default 'source_verified',
  relevance_score numeric(5,2),
  language_code text not null default 'en',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create unique index if not exists feed_items_source_external_uq on public.feed_items(source_id, external_id) where external_id is not null;
create unique index if not exists feed_items_source_url_uq on public.feed_items(source_id, canonical_url);
create index if not exists feed_items_published_idx on public.feed_items(published_at desc);
create index if not exists feed_items_jurisdiction_idx on public.feed_items(jurisdiction_iso, published_at desc);

create table if not exists public.user_profiles (
  user_id text primary key,
  display_name text,
  preferred_jurisdiction_iso text references public.jurisdictions(iso_code) on delete set null,
  timezone text not null default 'Africa/Nairobi',
  language_code text not null default 'en',
  daily_digest_enabled boolean not null default true,
  offline_default_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.user_bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  document_id uuid not null references public.legal_documents(id) on delete cascade,
  section_id uuid references public.document_sections(id) on delete cascade,
  created_at timestamptz not null default now()
);
create unique index if not exists user_bookmarks_unique_target_idx on public.user_bookmarks(user_id, document_id, coalesce(section_id, '00000000-0000-0000-0000-000000000000'::uuid));
create index if not exists user_bookmarks_user_idx on public.user_bookmarks(user_id, created_at desc);
create table if not exists public.user_highlights (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  document_id uuid not null references public.legal_documents(id) on delete cascade,
  section_id uuid references public.document_sections(id) on delete cascade,
  selected_text text not null,
  color text not null default 'yellow',
  created_at timestamptz not null default now()
);
create table if not exists public.user_notes (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  document_id uuid not null references public.legal_documents(id) on delete cascade,
  section_id uuid references public.document_sections(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.user_saved_documents (
  user_id text not null,
  document_id uuid not null references public.legal_documents(id) on delete cascade,
  saved_at timestamptz not null default now(),
  primary key(user_id, document_id)
);

create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text,
  jurisdiction_iso text references public.jurisdictions(iso_code) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  user_id text not null,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
create table if not exists public.chat_message_sources (
  message_id uuid not null references public.chat_messages(id) on delete cascade,
  document_id uuid not null references public.legal_documents(id) on delete restrict,
  chunk_id uuid references public.document_chunks(id) on delete set null,
  citation_label text not null,
  citation_url text not null,
  primary key(message_id, document_id, citation_label)
);
create index if not exists chat_conversations_user_idx on public.chat_conversations(user_id, updated_at desc);
create index if not exists chat_messages_conversation_idx on public.chat_messages(conversation_id, created_at);

create table if not exists public.chat_rate_limits (
  user_id text not null,
  window_started_at timestamptz not null,
  request_count integer not null default 0,
  primary key(user_id, window_started_at)
);
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  provider text not null default 'stripe',
  provider_customer_id text,
  provider_subscription_id text not null unique,
  plan_key text not null,
  status text not null default 'incomplete',
  period_ends_at timestamptz,
  cancel_at_period_end boolean not null default false,
  is_live_mode boolean not null default false,
  updated_at timestamptz not null default now()
);
create index if not exists subscriptions_user_mode_idx on public.subscriptions(user_id, is_live_mode, status);
create table if not exists public.payment_events (
  event_id text primary key,
  event_type text not null,
  is_live_mode boolean not null default false,
  received_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);
create table if not exists public.ingestion_runs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.legal_sources(id) on delete set null,
  run_type text not null,
  status text not null default 'running',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  records_seen integer not null default 0,
  records_added integer not null default 0,
  records_skipped integer not null default 0,
  error_message text,
  metadata jsonb not null default '{}'::jsonb
);
create index if not exists ingestion_runs_started_idx on public.ingestion_runs(started_at desc);

create or replace view public.jurisdiction_constitution_coverage
with (security_invoker = true) as
select j.iso_code, j.name, j.jurisdiction_kind, j.is_un_member, j.constitution_status,
       count(d.id) filter (where d.doc_type = 'constitution' and d.document_status = 'verified') as verified_constitutions,
       max(d.updated_at) filter (where d.doc_type = 'constitution' and d.is_current) as last_constitution_update
from public.jurisdictions j left join public.legal_documents d on d.jurisdiction_iso = j.iso_code
group by j.iso_code, j.name, j.jurisdiction_kind, j.is_un_member, j.constitution_status;

-- EAC catalog entries are deliberately metadata-only and rights-review gated.
insert into public.jurisdictions (iso_code,name,flag_emoji,continent,region,jurisdiction_kind,is_un_member,constitution_status) values
('BI','Burundi','🇧🇮','Africa','East Africa','sovereign_state',true,'metadata_only'),
('CD','Democratic Republic of the Congo','🇨🇩','Africa','Central Africa','sovereign_state',true,'metadata_only'),
('KE','Kenya','🇰🇪','Africa','East Africa','sovereign_state',true,'metadata_only'),
('RW','Rwanda','🇷🇼','Africa','East Africa','sovereign_state',true,'metadata_only'),
('SO','Somalia','🇸🇴','Africa','East Africa','sovereign_state',true,'metadata_only'),
('SS','South Sudan','🇸🇸','Africa','East Africa','sovereign_state',true,'metadata_only'),
('TZ','Tanzania','🇹🇿','Africa','East Africa','sovereign_state',true,'metadata_only'),
('UG','Uganda','🇺🇬','Africa','East Africa','sovereign_state',true,'metadata_only')
on conflict (iso_code) do update set name=excluded.name,flag_emoji=excluded.flag_emoji,continent=excluded.continent,region=excluded.region,jurisdiction_kind=excluded.jurisdiction_kind,is_un_member=excluded.is_un_member,constitution_status=excluded.constitution_status;

insert into public.legal_sources (slug,name,publisher,source_type,jurisdiction_iso,source_url,documentation_url,authority_rank,is_official,license_status,commercial_use_allowed,content_scope,is_active,metadata) values
('eac-burundi-constitution','Burundi Constitution — Presidency / Constitutional Court','Presidency of the Republic of Burundi','constitution_catalog','BI','https://presidence.gov.bi/2018/07/6271-2/','https://courconstitutionnelle.gov.bi/',1,true,'review_required',false,'Official-source candidate. Verify amendments, effective version and reuse rights.',false,'{"region":"EAC","currentVersionVerified":false,"rightsReview":"required"}'::jsonb),
('eac-drc-constitution','DR Congo Constitution — Cour de Cassation','Cour de Cassation, Democratic Republic of the Congo','constitution_catalog','CD','https://cassation.cd/textes-legaux/constitution-rdc','https://cassation.cd/textes-legaux/constitution-rdc',1,true,'review_required',false,'Official-source candidate. Verify later amendments and Journal Officiel.',false,'{"region":"EAC","currentVersionVerified":false,"rightsReview":"required"}'::jsonb),
('kenya-law','Kenya Constitution — National Council for Law Reporting / Kenya Law','National Council for Law Reporting','legislation_portal','KE','https://new.kenyalaw.org/legislation/','https://kenyalaw.org/terms-of-use/',1,true,'review_required',false,'Metadata/link-only until a written NCLR licence covers automated extraction, commercial reuse and AI retrieval.',false,'{"region":"EAC","rightsReview":"written_nclr_licence_required"}'::jsonb),
('rwanda-minijust','Rwanda Constitution — Ministry of Justice / Official Gazette','Ministry of Justice, Republic of Rwanda','constitution_catalog','RW','https://www.minijust.gov.rw/fileadmin/user_upload/Minijust/Publications/Laws/Constitution.pdf','https://www.minijust.gov.rw/fileadmin/user_upload/Minijust/Publications/Laws/Constitution.pdf',1,true,'review_required',false,'Official-source candidate. Verify Gazette version, later changes and rights.',false,'{"region":"EAC","currentVersionVerified":false,"rightsReview":"required"}'::jsonb),
('eac-somalia-constitution','Somalia Federal Constitution — Ministry of Interior / Federal Affairs','Ministry of Interior, Federal Affairs & Reconciliation','constitution_catalog','SO','https://moifar.gov.so/en/page/federal-constitution','https://moifar.gov.so/en/page/federal-constitution',1,true,'review_required',false,'Hold publication pending reconciliation of official constitution versions and amendments.',false,'{"region":"EAC","currentVersionVerified":false,"rightsReview":"required","legalReview":"required"}'::jsonb),
('eac-south-sudan-constitution','South Sudan Transitional Constitution — Ministry of Justice','Ministry of Justice and Constitutional Affairs, Republic of South Sudan','constitution_catalog','SS','https://mojca.gov.ss/the-transitional-constitution-of-the-repulic-of-south-sudan/','https://mojca.gov.ss/constitution-and-government/',1,true,'review_required',false,'Obtain latest consolidated amendments and verify effective dates and rights.',false,'{"region":"EAC","currentVersionVerified":false,"rightsReview":"required"}'::jsonb),
('tanzania-oag','Tanzania Constitution — Office of the Attorney General','Office of the Attorney General, United Republic of Tanzania','legislation_portal','TZ','https://oagmis.oag.go.tz/public','https://oagmis.oag.go.tz/public',1,true,'review_required',false,'Reconcile Parliament document with current OAG amendment history; catalogue Zanzibar separately.',false,'{"region":"EAC","currentVersionVerified":false,"rightsReview":"required"}'::jsonb),
('uganda-parliament','Uganda Constitution — Uganda Law Reform Commission','Uganda Law Reform Commission','constitution_catalog','UG','https://publications.ulrc.go.ug/constitution/29','https://publications.ulrc.go.ug/constitution/29',1,true,'review_required',false,'Verify current consolidated text, amendments and subscription access rights.',false,'{"region":"EAC","currentVersionVerified":false,"rightsReview":"required"}'::jsonb)
on conflict (slug) do update set name=excluded.name,publisher=excluded.publisher,jurisdiction_iso=excluded.jurisdiction_iso,source_url=excluded.source_url,documentation_url=excluded.documentation_url,license_status='review_required',commercial_use_allowed=false,is_active=false,content_scope=excluded.content_scope,metadata=public.legal_sources.metadata || excluded.metadata,updated_at=now();

-- RLS and API access are explicit; application data is never public by default.
alter table public.jurisdictions enable row level security;
alter table public.legal_sources enable row level security;
alter table public.legal_documents enable row level security;
alter table public.document_sections enable row level security;
alter table public.document_chunks enable row level security;
alter table public.feed_items enable row level security;
alter table public.user_profiles enable row level security;
alter table public.user_bookmarks enable row level security;
alter table public.user_highlights enable row level security;
alter table public.user_notes enable row level security;
alter table public.user_saved_documents enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chat_message_sources enable row level security;
alter table public.chat_rate_limits enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payment_events enable row level security;
alter table public.ingestion_runs enable row level security;

create policy "Public can read jurisdiction catalogue" on public.jurisdictions for select to anon,authenticated using (true);
create policy "Public can read official source metadata" on public.legal_sources for select to anon,authenticated using (is_official = true);
create policy "Public can read reusable verified legal documents" on public.legal_documents for select to anon,authenticated using (document_status='verified' and license_status in ('approved','public_domain_verified','open_license','permission_granted') and commercial_use_allowed=true);
create policy "Public can read reusable verified sections" on public.document_sections for select to anon,authenticated using (exists(select 1 from public.legal_documents d where d.id=document_id and d.document_status='verified' and d.license_status in ('approved','public_domain_verified','open_license','permission_granted') and d.commercial_use_allowed=true));
create policy "Public can read reusable verified chunks" on public.document_chunks for select to anon,authenticated using (exists(select 1 from public.legal_documents d where d.id=document_id and d.document_status='verified' and d.license_status in ('approved','public_domain_verified','open_license','permission_granted') and d.commercial_use_allowed=true));
create policy "Public can read verified official feed metadata" on public.feed_items for select to anon,authenticated using (verification_status in ('source_verified','editor_review') and exists(select 1 from public.legal_sources s where s.id=source_id and s.is_official=true));
create policy "Own profile" on public.user_profiles for all to authenticated using (user_id=(select auth.uid())::text) with check (user_id=(select auth.uid())::text);
create policy "Own bookmarks" on public.user_bookmarks for all to authenticated using (user_id=(select auth.uid())::text) with check (user_id=(select auth.uid())::text);
create policy "Own highlights" on public.user_highlights for all to authenticated using (user_id=(select auth.uid())::text) with check (user_id=(select auth.uid())::text);
create policy "Own notes" on public.user_notes for all to authenticated using (user_id=(select auth.uid())::text) with check (user_id=(select auth.uid())::text);
create policy "Own saved documents" on public.user_saved_documents for all to authenticated using (user_id=(select auth.uid())::text) with check (user_id=(select auth.uid())::text);
create policy "Own conversations" on public.chat_conversations for all to authenticated using (user_id=(select auth.uid())::text) with check (user_id=(select auth.uid())::text);
create policy "Own chat messages" on public.chat_messages for all to authenticated using (user_id=(select auth.uid())::text and exists(select 1 from public.chat_conversations c where c.id=conversation_id and c.user_id=(select auth.uid())::text)) with check (user_id=(select auth.uid())::text and exists(select 1 from public.chat_conversations c where c.id=conversation_id and c.user_id=(select auth.uid())::text));
create policy "Own message citations" on public.chat_message_sources for select to authenticated using (exists(select 1 from public.chat_messages m where m.id=message_id and m.user_id=(select auth.uid())::text));
create policy "Own subscription status" on public.subscriptions for select to authenticated using (user_id=(select auth.uid())::text);
create policy "Admins manage jurisdictions" on public.jurisdictions for all to authenticated
  using (((select auth.jwt())->'app_metadata'->>'role')='admin')
  with check (((select auth.jwt())->'app_metadata'->>'role')='admin');
create policy "Admins manage source registry" on public.legal_sources for all to authenticated
  using (((select auth.jwt())->'app_metadata'->>'role')='admin')
  with check (((select auth.jwt())->'app_metadata'->>'role')='admin');
create policy "Admins manage legal documents" on public.legal_documents for all to authenticated
  using (((select auth.jwt())->'app_metadata'->>'role')='admin')
  with check (((select auth.jwt())->'app_metadata'->>'role')='admin');
create policy "Admins manage sections" on public.document_sections for all to authenticated
  using (((select auth.jwt())->'app_metadata'->>'role')='admin')
  with check (((select auth.jwt())->'app_metadata'->>'role')='admin');
create policy "Admins manage chunks" on public.document_chunks for all to authenticated
  using (((select auth.jwt())->'app_metadata'->>'role')='admin')
  with check (((select auth.jwt())->'app_metadata'->>'role')='admin');
create policy "Admins manage feed" on public.feed_items for all to authenticated
  using (((select auth.jwt())->'app_metadata'->>'role')='admin')
  with check (((select auth.jwt())->'app_metadata'->>'role')='admin');
create policy "Admin reads ingestion runs" on public.ingestion_runs for select to authenticated using (((select auth.jwt())->'app_metadata'->>'role')='admin');

revoke all on public.chat_rate_limits from anon,authenticated;
revoke all on public.payment_events from anon,authenticated;
revoke insert,update,delete on public.subscriptions from anon,authenticated;
revoke insert,update,delete on public.ingestion_runs from anon,authenticated;
grant usage on schema public to anon,authenticated;
grant select on public.jurisdictions,public.legal_sources,public.legal_documents,public.document_sections,public.document_chunks,public.feed_items,public.jurisdiction_constitution_coverage to anon,authenticated;
grant select,insert,update,delete on public.user_profiles,public.user_bookmarks,public.user_highlights,public.user_notes,public.user_saved_documents,public.chat_conversations,public.chat_messages to authenticated;
grant select on public.chat_message_sources,public.subscriptions to authenticated;
grant select,insert,update,delete on public.jurisdictions,public.legal_sources,public.legal_documents,public.document_sections,public.document_chunks,public.feed_items to authenticated;
