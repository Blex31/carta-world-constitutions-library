# CARTA pre-release checklist

## Neon infrastructure
- [ ] Create/attach a dedicated CARTA Neon project in a supported region.
- [ ] Apply `001_initial_schema.sql`, `002_source_registry.sql`, `003_seed_jurisdictions.sql`, `004_official_feed_sources.sql`, `005_official_national_sources.sql`, `006_official_daily_sources.sql`, `007_feed_poll_index.sql`, `008_chunk_section_uniqueness.sql` in order.
- [ ] Enable Managed Neon Auth and set the frontend auth URL.
- [ ] Deploy the `carta` Neon Function and hourly feed trigger; verify each source respects its polling interval and the UI changes daily after 06:00 local time.
- [ ] Configure exact `APP_ORIGIN` / `APP_ORIGINS` CORS values and `CARTA_ADMIN_USER_IDS`.
- [ ] Test expired/missing JWT rejection and cross-user isolation.
- [ ] Configure automated backup/snapshot policy and restore test.

## Corpus and feed
- [ ] Confirm jurisdiction classification; do not equate the ISO directory with a count of sovereign states.
- [ ] Verify current official text, amendments, commencement and authoritative language for each imported jurisdiction.
- [ ] Record commercial reuse rights and attribution for every document and translation.
- [ ] Run the constitution importer in dry-run mode, then apply only approved source packages.
- [ ] Confirm old versions are marked superseded and remain traceable.
- [ ] Approve official RSS feeds before enabling them; check daily ingestion, deduplication and canonical publisher links.
- [ ] Confirm that restricted/unclear feeds remain metadata-only or disabled.

## Legal assistant
- [ ] Configure a Neon AI Gateway credential (paid plan) or a server-only OpenAI-compatible key.
- [ ] Confirm only current, effective, verified, commercially cleared official-source chunks are retrieved.
- [ ] Test supported answers with exact citations and version/effective dates.
- [ ] Test no-source refusal, fake citations, prompt injection inside source text, bills vs enacted law and cross-jurisdiction confusion.
- [ ] Test urgent/legal-dispute queries receive general information only and recommend qualified legal counsel.
- [ ] Confirm chat histories and sources are scoped to the authenticated user.

## Personal library and billing
- [ ] Test sign-up, sign-in, sign-out and session restoration.
- [ ] Save/remove bookmarks, highlights, notes and downloads as User A.
- [ ] Sign in as User B and confirm User A's saved data and chat history are not visible.
- [ ] Test a second device and local-first migration.
- [ ] Confirm checkout ownership verification and no entitlement from an unverified return URL.
- [ ] Test subscription renewal, failed payment, cancellation, duplicate webhook, portal and test/live separation.
- [ ] Confirm active Plus hides configured ads; verify free tier ads only after approval/consent configuration.

## Legal, privacy and operations
- [ ] Add privacy, terms, legal-information disclaimer, source attribution and correction request process.
- [ ] Confirm local-law, data-protection, tax and subscription obligations for launch markets.
- [ ] Conduct security review, rate-limit review and database restore test.
- [ ] Build and visually test web/PWA on target screen sizes.
- [ ] Configure custom domain/HTTPS, monitoring, error alerts and incident contacts.
- [ ] If native mobile is a launch requirement, complete separate Android/iOS purchase, AdMob, offline, FCM and widget work; those binaries are not part of this React bundle.
