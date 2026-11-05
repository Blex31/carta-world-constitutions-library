# Migration history

The live Supabase project records these applied migrations:

- `20261104205355_initial_carta_supabase_schema`
- `20261104205533_policy_and_index_hardening`
- `20261104210643_user_library_constraints`
- `20261104215041_phase_2_identity_limits_scheduler`
- `20261104215451_phase_2_private_rpc_hardening`
- `20261104232302_official_text_exclusion_rights_basis`
- `20261104232545_official_text_exclusion_evidence_constraints`

The repository checks in SQL for migrations 001–008. Migrations 004 and 005 were reconstructed from the live database's table definitions, RLS policies, triggers, function definitions, function grants and scheduled-job definition. They still need independent validation against a disposable clean-install database before claiming full reproducibility. Migrations 001–003 define the schema, metadata seed, RLS, grants and user-library constraints; 006 adds the separate official-text-exclusion basis and hardens document/section/chunk reads to require source-level eligibility; 007 requires a documented legal opinion and HTTPS evidence for any source or document using that basis.
- `20261104232302_official_text_exclusion_rights_basis` — supports a distinct statutory official-text exclusion status and requires source and document-level rights checks when serving public text.


Migrations 006 and 007 do not approve any publisher or document. The Rwanda source remains inactive, `review_required`, and not approved for commercial reuse.


The live project applied `20261105103601_seed_global_jurisdiction_catalogue`, which seeds 250 metadata-only global jurisdiction records with `ON CONFLICT DO NOTHING` so existing EAC jurisdiction and source metadata is preserved. These entries do not imply that constitutions have been acquired, verified or imported.
