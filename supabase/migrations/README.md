# Migration history

The live Supabase project records these applied migrations:

- `20261104205355_initial_carta_supabase_schema`
- `20261104205533_policy_and_index_hardening`
- `20261104210643_user_library_constraints`

The full reproducible migration SQL files are in the prepared source bundle. Import those files into this directory before treating this repository as the canonical clean-install source. The first migration defines the tables, EAC metadata seed, initial RLS and grants; the second tightens admin policies and adds foreign-key indexes; the third adds user-library uniqueness constraints.
- `20261104232302_official_text_exclusion_rights_basis` — supports a distinct statutory official-text exclusion status and requires source and document-level rights checks when serving public text.
