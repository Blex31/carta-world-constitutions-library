# Migration history

The live Supabase project records these applied migrations:

- `20261104205355_initial_carta_supabase_schema`
- `20261104205533_policy_and_index_hardening`
- `20261104210643_user_library_constraints`
- `20261104215041_phase_2_identity_limits_scheduler`
- `20261104215451_phase_2_private_rpc_hardening`
- `20261104232302_official_text_exclusion_rights_basis`
- `20261104232545_official_text_exclusion_evidence_constraints`

The repository currently checks in the SQL for migrations 001–003 and 006–007. The live migrations 004 and 005 were applied to Supabase, but their migration SQL files are not present in this repository yet. This repository is therefore not yet a complete clean-install migration source; reconstruct and review 004/005 from the live schema and functions before claiming full reproducibility. Migrations 001–003 define the schema, metadata seed, RLS, grants and user-library constraints; 006 adds the separate official-text-exclusion basis and hardens document/section/chunk reads to require source-level eligibility; 007 requires a documented legal opinion and HTTPS evidence for any source or document using that basis.
- `20261104232302_official_text_exclusion_rights_basis` — supports a distinct statutory official-text exclusion status and requires source and document-level rights checks when serving public text.


Migrations 006 and 007 do not approve any publisher or document. The Rwanda source remains inactive, `review_required`, and not approved for commercial reuse.
