-- Evaluate the JWT once per statement rather than once per ingestion_runs row.
drop policy if exists "Admins read ingestion runs" on public.ingestion_runs;

create policy "Admins read ingestion runs"
  on public.ingestion_runs
  for select
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
