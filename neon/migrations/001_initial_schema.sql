-- CARTA: global legal text, verified current-affairs feed, personal library and legal Q&A.
-- Apply on a dedicated CARTA Neon project after enabling Managed Neon Auth.
-- Jurisdiction catalogue rows are metadata only until an official text/version and reuse rights are verified.

create table if not exists jurisdictions (
  iso_code text primary key,
  name text not null,
  official_name text,
  native_name text,
  flag_emoji text,
  continent text,
  region text,
  jurisdiction_kind text not null default 'unclassified',
  is_un_member boolean,
  is_active boolean not null default true,
  constitution_status text not null default 'not_loaded',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint jurisdictions_kind_check check (jurisdiction_kind in ('sovereign_state','territory','dependent_area','international','unclassified')),
  constraint jurisdictions_constitution_status_check check (constitution_status in ('not_loaded','metadata_only','text_loaded','verified_current','needs_review','no_single_written_constitution'))
);

create table if not exists legal_sources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  publisher text,
  source_type text not null,
  jurisdiction_iso text references jurisdictions(iso_code) on delete set null,
  source_url text not null,
  feed_url text,
  api_url text,
  documentation_url text,
  authority_rank smallint not null default 50,
  is_official boolean not null default false,
  license_status text not null default 'review_required',
  commercial_use_allowed boolean not null default false,
  attribution_text text,
  content_scope text,
  poll_interval_minutes integer,
  last_polled_at timestamptz,
  last_success_at timestamptz,
  is_active boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint legal_sources_type_check check (source_type in ('constitution_catalog','official_gazette','legislation_portal','court_feed','court_database','treaty_database','government_news','data_catalog','other')),
  constraint legal_sources_license_check check (license_status in ('approved','public_domain_verified','open_license','review_required','noncommercial_only','restricted','permission_granted')),
  constraint legal_sources_authority_rank_check check (authority_rank between 1 and 100),
  constraint legal_sources_poll_interval_check check (poll_interval_minutes is null or poll_interval_minutes >= 15)
);

create table if not exists legal_documents (
  id uuid primary key default gen_random_uuid(),
  jurisdiction_iso text references jurisdictions(iso_code) on delete set null,
  source_id uuid references legal_sources(id) on delete set null,
  doc_type text not null,
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
  document_status text not null default 'needs_review',
  full_text text,
  content_sha256 text,
  license_status text not null default 'review_required',
  commercial_use_allowed boolean not null default false,
  replaces_document_id uuid references legal_documents(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint legal_documents_type_check check (doc_type in ('constitution','constitutional_amendment','act','bill','regulation','gazette_notice','court_decision','treaty','international_instrument','official_guidance','other')),
  constraint legal_documents_status_check check (document_status in ('draft','needs_review','verified','superseded','repealed','withdrawn')),
  constraint legal_documents_license_check check (license_status in ('approved','public_domain_verified','open_license','review_required','noncommercial_only','restricted','permission_granted'))
);
create unique index if not exists legal_documents_source_url_sha_uq on legal_documents(official_url, coalesce(content_sha256, ''));
create index if not exists legal_documents_country_type_idx on legal_documents(jurisdiction_iso, doc_type, is_current);
create index if not exists legal_documents_current_idx on legal_documents(is_current, document_status);

create table if not exists document_sections (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references legal_documents(id) on delete cascade,
  parent_section_id uuid references document_sections(id) on delete cascade,
  section_number text,
  heading text,
  section_order integer not null default 0,
  original_text text not null,
  plain_language_summary text,
  source_location text,
  updated_at timestamptz not null default now()
);
create index if not exists document_sections_document_order_idx on document_sections(document_id, section_order);

create table if not exists document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references legal_documents(id) on delete cascade,
  section_id uuid references document_sections(id) on delete cascade,
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
create index if not exists document_chunks_search_idx on document_chunks using gin(search_vector);
create index if not exists document_chunks_document_idx on document_chunks(document_id, chunk_index);

create table if not exists feed_items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references legal_sources(id) on delete restrict,
  jurisdiction_iso text references jurisdictions(iso_code) on delete set null,
  document_id uuid references legal_documents(id) on delete set null,
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
  created_at timestamptz not null default now(),
  constraint feed_items_type_check check (item_type in ('judgment','legislation','bill','gazette','treaty','constitutional_change','court_news','government_update','legal_explainer','other')),
  constraint feed_items_verification_check check (verification_status in ('source_verified','editor_review','rejected','withdrawn'))
);
create unique index if not exists feed_items_source_external_uq on feed_items(source_id, external_id) where external_id is not null;
create unique index if not exists feed_items_source_url_uq on feed_items(source_id, canonical_url);
create index if not exists feed_items_published_idx on feed_items(published_at desc);
create index if not exists feed_items_jurisdiction_idx on feed_items(jurisdiction_iso, published_at desc);

create table if not exists user_profiles (
  user_id text primary key,
  display_name text,
  preferred_jurisdiction_iso text references jurisdictions(iso_code) on delete set null,
  timezone text not null default 'Africa/Nairobi',
  language_code text not null default 'en',
  daily_digest_enabled boolean not null default true,
  offline_default_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists user_bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  document_id uuid not null references legal_documents(id) on delete cascade,
  section_id uuid references document_sections(id) on delete cascade,
  created_at timestamptz not null default now()
);
create unique index if not exists user_bookmarks_unique_target_idx
  on user_bookmarks(user_id, document_id, coalesce(section_id, '00000000-0000-0000-0000-000000000000'::uuid));
create index if not exists user_bookmarks_user_idx on user_bookmarks(user_id, created_at desc);
create table if not exists user_highlights (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  document_id uuid not null references legal_documents(id) on delete cascade,
  section_id uuid references document_sections(id) on delete cascade,
  selected_text text not null,
  color text not null default 'yellow',
  created_at timestamptz not null default now()
);
create table if not exists user_notes (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  document_id uuid not null references legal_documents(id) on delete cascade,
  section_id uuid references document_sections(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists user_saved_documents (
  user_id text not null,
  document_id uuid not null references legal_documents(id) on delete cascade,
  saved_at timestamptz not null default now(),
  primary key(user_id, document_id)
);

create table if not exists chat_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text,
  jurisdiction_iso text references jurisdictions(iso_code) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references chat_conversations(id) on delete cascade,
  user_id text not null,
  role text not null,
  content text not null,
  created_at timestamptz not null default now(),
  constraint chat_messages_role_check check (role in ('user','assistant'))
);
create table if not exists chat_message_sources (
  message_id uuid not null references chat_messages(id) on delete cascade,
  document_id uuid not null references legal_documents(id) on delete restrict,
  chunk_id uuid references document_chunks(id) on delete set null,
  citation_label text not null,
  citation_url text not null,
  primary key(message_id, document_id, citation_label)
);
create index if not exists chat_conversations_user_idx on chat_conversations(user_id, updated_at desc);
create index if not exists chat_messages_conversation_idx on chat_messages(conversation_id, created_at);

create table if not exists chat_rate_limits (
  user_id text not null,
  window_started_at timestamptz not null,
  request_count integer not null default 0,
  primary key(user_id, window_started_at)
);

create table if not exists subscriptions (
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
create index if not exists subscriptions_user_mode_idx on subscriptions(user_id, is_live_mode, status);
create table if not exists payment_events (
  event_id text primary key,
  event_type text not null,
  is_live_mode boolean not null default false,
  received_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

create table if not exists ingestion_runs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references legal_sources(id) on delete set null,
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
create index if not exists ingestion_runs_started_idx on ingestion_runs(started_at desc);

create or replace view jurisdiction_constitution_coverage as
select
  j.iso_code,
  j.name,
  j.jurisdiction_kind,
  j.is_un_member,
  j.constitution_status,
  count(d.id) filter (where d.doc_type = 'constitution' and d.document_status = 'verified') as verified_constitutions,
  max(d.updated_at) filter (where d.doc_type = 'constitution' and d.is_current) as last_constitution_update
from jurisdictions j
left join legal_documents d on d.jurisdiction_iso = j.iso_code
group by j.iso_code, j.name, j.jurisdiction_kind, j.is_un_member, j.constitution_status;
