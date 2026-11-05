-- Reconstructed from live pg_proc definitions and function ACLs.
-- Keep authenticated callers on the auth.uid()-scoped overload only if needed;
-- the Edge Function uses the explicitly service-role-scoped user-id overload.

create or replace function public.carta_claim_chat_slot(
  p_max_requests integer default 12,
  p_window_seconds integer default 60
)
returns table(allowed boolean, remaining integer, retry_after_seconds integer)
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  v_uid text := auth.uid()::text;
  v_window timestamptz;
  v_count integer;
begin
  if v_uid is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if p_max_requests < 1 or p_max_requests > 120
     or p_window_seconds < 10 or p_window_seconds > 3600 then
    raise exception 'Invalid rate-limit parameters' using errcode = '22023';
  end if;

  v_window := to_timestamp(
    floor(extract(epoch from clock_timestamp()) / p_window_seconds) * p_window_seconds
  );

  insert into public.chat_rate_limits(user_id, window_started_at, request_count)
  values (v_uid, v_window, 1)
  on conflict (user_id, window_started_at)
  do update set request_count = public.chat_rate_limits.request_count + 1
  returning request_count into v_count;

  return query
  select
    v_count <= p_max_requests,
    greatest(0, p_max_requests - v_count),
    case when v_count <= p_max_requests then 0
      else greatest(
        1,
        ceil(extract(epoch from (
          v_window + make_interval(secs => p_window_seconds) - now()
        )))::integer
      )
    end;
end;
$function$;

create or replace function public.carta_claim_chat_slot(
  p_user_id text,
  p_max_requests integer default 12,
  p_window_seconds integer default 60
)
returns table(allowed boolean, remaining integer, retry_after_seconds integer)
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  v_role text := coalesce(current_setting('request.jwt.claim.role', true), '');
  v_window timestamptz;
  v_count integer;
begin
  if v_role <> 'service_role' then
    raise exception 'Service role required' using errcode = '42501';
  end if;
  if p_user_id is null or length(p_user_id) < 10 then
    raise exception 'A valid user identifier is required' using errcode = '22023';
  end if;
  if p_max_requests < 1 or p_max_requests > 120
     or p_window_seconds < 10 or p_window_seconds > 3600 then
    raise exception 'Invalid rate-limit parameters' using errcode = '22023';
  end if;

  v_window := to_timestamp(
    floor(extract(epoch from clock_timestamp()) / p_window_seconds) * p_window_seconds
  );

  insert into public.chat_rate_limits(user_id, window_started_at, request_count)
  values (p_user_id, v_window, 1)
  on conflict (user_id, window_started_at)
  do update set request_count = public.chat_rate_limits.request_count + 1
  returning request_count into v_count;

  return query
  select
    v_count <= p_max_requests,
    greatest(0, p_max_requests - v_count),
    case when v_count <= p_max_requests then 0
      else greatest(
        1,
        ceil(extract(epoch from (
          v_window + make_interval(secs => p_window_seconds) - now()
        )))::integer
      )
    end;
end;
$function$;

-- The no-user-id overload derives ownership from auth.uid(), but current clients
-- call the service-role overload through the private Edge Function only.
revoke all on function public.carta_claim_chat_slot(integer, integer)
  from public, anon, authenticated, service_role;
revoke all on function public.carta_claim_chat_slot(text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.carta_claim_chat_slot(text, integer, integer)
  to service_role;
