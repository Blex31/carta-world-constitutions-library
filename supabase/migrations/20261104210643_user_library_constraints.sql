create unique index if not exists user_notes_target_unique_idx
  on public.user_notes(user_id, document_id, section_id) where section_id is not null;
create unique index if not exists user_highlights_target_unique_idx
  on public.user_highlights(user_id, document_id, section_id) where section_id is not null;
