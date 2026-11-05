-- Reconstructed from the live Supabase catalogue and applied migration history.
-- Phase 2 identity bootstrap, private operational-table access and daily feed scheduler.
-- Vault values are provisioned separately; no secret values belong in this migration.

create table if not exists public.billing_customers (
  user_id text primary key,
  provider text not null default 'stripe',
  provider_customer_id text not null unique,
  livemode boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.billing_customers enable row level security;

drop policy if exists "Service role manages billing customers" on public.billing_customers;
create policy "Service role manages billing customers"
  on public.billing_customers for all to service_role
  using (true) with check (true);

revoke all on public.billing_customers from public, anon, authenticated;
grant all on public.billing_customers to service_role;

-- Operational records are private to the trusted Edge Function.
drop policy if exists "Service role manages chat rate limits" on public.chat_rate_limits;
create policy "Service role manages chat rate limits"
  on public.chat_rate_limits for all to service_role
  using (true) with check (true);

drop policy if exists "Service role manages payment events" on public.payment_events;
create policy "Service role manages payment events"
  on public.payment_events for all to service_role
  using (true) with check (true);

drop policy if exists "Service role manages ingestion runs" on public.ingestion_runs;
create policy "Service role manages ingestion runs"
  on public.ingestion_runs for all to service_role
  using (true) with check (true);

revoke all on public.chat_rate_limits from public, anon, authenticated;
revoke all on public.payment_events from public, anon, authenticated;
revoke insert, update, delete on public.ingestion_runs from public, anon, authenticated;

-- Create a private profile row whenever Supabase Auth creates a new identity.
create or replace function public.carta_handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $function$
begin
  insert into public.user_profiles(user_id, display_name)
  values (
    new.id::text,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'display_name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'Reader'
    )
  )
  on conflict (user_id) do nothing;
  return new;
end;
$function$;

revoke all on function public.carta_handle_new_auth_user() from public, anon, authenticated;
drop trigger if exists carta_on_auth_user_created on auth.users;
create trigger carta_on_auth_user_created
  after insert on auth.users
  for each row execute function public.carta_handle_new_auth_user();

-- These helpers can only be invoked by the service role.
create or replace function public.carta_get_server_secret(p_name text)
returns text
language plpgsql
security definer
set search_path = public, vault, pg_temp
as $function$
declare
  v_role text;
  v_secret text;
begin
  v_role := coalesce(current_setting('request.jwt.claim.role', true), '');
  if v_role <> 'service_role' then
    raise exception 'Service role required' using errcode = '42501';
  end if;
  select decrypted_secret into v_secret
  from vault.decrypted_secrets
  where name = p_name
  limit 1;
  return v_secret;
end;
$function$;

revoke all on function public.carta_get_server_secret(text) from public, anon, authenticated;
grant execute on function public.carta_get_server_secret(text) to service_role;

create or replace function public.carta_validate_ingest_token(p_token text)
returns boolean
language sql
security definer
set search_path = public, vault, pg_temp
as $function$
  select coalesce(
    p_token is not null
    and length(p_token) >= 48
    and p_token = (
      select decrypted_secret from vault.decrypted_secrets
      where name = 'carta_ingest_token'
      limit 1
    ),
    false
  );
$function$;

revoke all on function public.carta_validate_ingest_token(text) from public, anon, authenticated;
grant execute on function public.carta_validate_ingest_token(text) to service_role;

-- Supabase hosts pg_cron and pg_net. Provision these extensions on a fresh project.
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

-- Schedule the poll only after all three required Vault values exist.
-- Required names: carta_project_url, carta_publishable_key, carta_ingest_token.
do $schedule$
begin
  if (
    select count(*) = 3
    from vault.decrypted_secrets
    where name in ('carta_project_url', 'carta_publishable_key', 'carta_ingest_token')
  ) and not exists (
    select 1 from cron.job where jobname = 'carta-official-feed-daily'
  ) then
    perform cron.schedule(
      'carta-official-feed-daily',
      '10 3 * * *',
      $job$
        select net.http_post(
          url := (select decrypted_secret from vault.decrypted_secrets where name='carta_project_url')
            || '/functions/v1/carta-api/api/admin/ingest',
          headers := jsonb_build_object(
            'Content-Type','application/json',
            'apikey',(select decrypted_secret from vault.decrypted_secrets where name='carta_publishable_key'),
            'x-carta-cron-token',(select decrypted_secret from vault.decrypted_secrets where name='carta_ingest_token')
          ),
          body := jsonb_build_object('trigger','scheduled','scheduledAt',now()),
          timeout_milliseconds := 10000
        ) as request_id;
      $job$
    );
  else
    raise notice 'CARTA daily feed scheduler not created: required Vault values may be missing or the job already exists.';
  end if;
end;
$schedule$;
