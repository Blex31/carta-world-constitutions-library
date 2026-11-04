-- Efficiently find official, active RSS sources whose polling interval is due.
create index if not exists legal_sources_due_feed_idx
  on legal_sources(last_polled_at)
  where is_active = true and is_official = true and feed_url is not null;
