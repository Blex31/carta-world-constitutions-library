-- Each section starts its own chunk_index at zero. Include section_id in the
-- uniqueness key so every article/provision can have chunk 0, chunk 1, etc.
-- This is safe for a fresh schema and repairs the original document-wide key.
alter table document_chunks
  drop constraint if exists document_chunks_document_id_chunk_index_language_code_key;

alter table document_chunks
  drop constraint if exists document_chunks_document_id_section_id_chunk_index_language_code_key;

alter table document_chunks
  add constraint document_chunks_document_id_section_id_chunk_index_language_code_key
  unique (document_id, section_id, chunk_index, language_code);
