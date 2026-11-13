# CARTA — World Constitutions Library

**Every Constitution. Every Country. In Plain Language.**

CARTA is a document-first legal information platform. It preserves official provenance, amendment history, effective dates and source rights while helping readers navigate constitutional and legal documents in plain language.

## Product

- **Web:** React + Vite.
- **Android and iOS:** Flutter native clients under `apps/mobile`.
- **Shared backend:** Supabase Postgres, Supabase Auth and the `carta-api` Edge Function.
- **Personal library:** saved documents, bookmarks, highlights and private notes.
- **Legal research:** retrieval restricted to verified, current, official and rights-cleared legal passages.
- **Publisher updates:** source-scoped feed ingestion, with publisher approval and rights checks.

## Current directory and corpus status — 13 November 2026

The live Supabase directory contains 250 country/area records:

| Classification | Live count |
|---|---:|
| UN Member States | 193 |
| UN non-member observer states | 2 |
| Other country/area records awaiting precise status review | 55 |
| Geographic metadata gaps | 0 |

The legal corpus is still empty: **0 verified legal documents, 0 provisions/sections and 0 searchable chunks**. The [global constitutional collection queue](data/global-constitution-collection-queue.json) tracks 195 assignments (193 members + two observers); source/status discovery covers **127 of 195** (all 54 African UN Member States plus 73 others including a full Oceania batch). All leads remain rights-review-required; zero texts are cleared for commercial reuse. Eritrea is flagged because the 1997 text has not entered into force.

See the [global collection plan](docs/global-constitution-collection-plan.md), [African corpus plan](docs/africa-first-wave-corpus-plan.md), and [EAC source review](docs/eac-first-batch.md).

## Legal-content rule

Do not publish a legal document as current or reusable until its official publisher, exact edition, commencement/effective dates, amendments, language precedence, attribution and intended reuse rights have been checked.

CARTA's rights review must separately cover free/paid web and mobile display, reproduction/redistribution, search/indexing/snippets, AI retrieval/embeddings/summaries, translations/derivatives and offline/device copies. Public access or an official government URL is not, by itself, permission for these uses.

The importer in `scripts/import-constitution-documents.mjs` enforces the source, version, complete-text and commercial-rights gates. Dry-run first; import only after the legal and second-review sign-offs. The `--allow-uncleared` fast lane (owner decision, 10 Nov 2026) imports texts pending rights review with `commercial_use_allowed=false` and an `importBypassedRightsGates` provenance marker; rights-gated retrieval stays closed until per-country review. The legal assistant must refuse to invent an answer when no qualifying passage is available.

## Roadmap — how CARTA moves forward

This is the single forward plan. Each phase has an owner, concrete work, and exit criteria. Update statuses after every session; do not mark items complete without the stated acceptance test.

### Phase 0 — Foundation hardening (owner: engineering, ~1 week)

- [x] Single Pages deploy pipeline (duplicate env-less workflow removed, PR #19).
- [ ] Verify GitHub Pages is enabled ("GitHub Actions" source) and the site loads with working auth.
- [ ] Commit `package-lock.json`; switch CI and docs from `npm install` to `npm ci`.
- [ ] Validate migrations 001–009 from an empty disposable Supabase project (especially reconstructed 004/005).
- [ ] Add an automated check that the deployed Edge Function source matches the repository.
- [ ] Stop `mobile-ci.yml` from committing generated runners to branches from CI (`contents: write` is risky); generate runners as build artifacts instead.

**Exit criteria:** a fresh clone + `npm ci` + migrations builds, tests pass, and the deployed web app authenticates a real user.

### Phase 1 — Corpus at scale (owner: legal research + engineering, ongoing; critical path)

- [ ] Build the bulk acquisition pipeline: a script + GitHub Action that consumes the 127 official source leads in the queue, fetches each official text, normalizes it, computes SHA-256 and emits `data/import/batch-*.json`.
- [ ] Import first tranche with the fast lane: Kenya, Rwanda, Uganda, Tanzania, plus the Oceania batch (official government-hosted texts already identified).
- [ ] Respect publisher terms: no bulk extraction from sources whose terms prohibit it (e.g., Kenya Law automated extraction; Constitute reuse) — route those through licence requests or one-time manual exports.
- [ ] Keep permanent legal holds: Somalia (disputed 2026 text), Afghanistan (no recognized current order), Eritrea (1997 text never in force).
- [ ] Per-country rights review after import: flip `commercial_use_allowed` only when clearance covers display, redistribution, search/snippets, AI retrieval, derivatives and offline copies.
- [ ] Finish discovery for the remaining 68 jurisdictions (Americas 30, Asia 26, Europe 12).
- [ ] Second-person editorial review: reconcile article/section structure, dates and language precedence for every imported document.

**Exit criteria for first release:** 15 verified African collections imported and readable end-to-end (reader, navigation, search, exact citations), stretch 25.

### Phase 2 — Mobile release engineering (owner: mobile developers; builds are CI-ready today)

The Android and iOS build pipelines already exist and are verified in CI. What remains is signing, store accounts and device acceptance — see [Mobile builds](#mobile-builds-android--ios-developer-handoff) below.

- [ ] Android: generate an upload keystore, add `ANDROID_KEYSTORE_B64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD` as repository secrets, and produce the first signed AAB.
- [ ] iOS: enroll in the Apple Developer Program ($99/yr), create an App Store Connect API key, add signing secrets, and extend `mobile-release.yml` with fastlane/xcrun upload to TestFlight.
- [ ] Register `carta://auth-callback` in Supabase Authentication → URL Configuration → Redirect URLs.
- [ ] Real-device acceptance on Android and iOS: sign-up, email confirmation, password reset, session persistence, reader, search, My Library isolation, low-bandwidth behaviour.
- [ ] Store listing assets: app name, descriptions, privacy policy URL, screenshots, icons, content ratings.

**Exit criteria:** a signed AAB uploads to Play Console internal testing and a signed IPA reaches TestFlight; both pass the device acceptance script.

### Phase 3 — Product UX (owner: product + mobile developers, parallel with Phase 2)

- [ ] Empty states that teach: every empty screen explains why (e.g., "Verified texts for this country are in rights review") and offers a notify/waitlist action.
- [ ] Reading experience: persistent font-size/serif-sans/theme settings, sticky chapter/Part index, long-press exact-citation copy ("Article 26(3), Constitution of Kenya, 2010").
- [ ] Search UX: results grouped document → chapter → article with highlighted snippets, recent searches, country/type filters.
- [ ] Trust surfaces: every provision shows source, version label, effective dates and a "verified current" badge; superseded versions visibly marked.
- [ ] Onboarding: 3 skippable screens, shown once (mission, plain-language promise, library value).
- [ ] Performance: cache the 250-row directory locally, lazy-load document text, skeleton loaders, <2s cold start on mid-range Android.
- [ ] Accessibility: WCAG AA contrast, dynamic type, screen-reader labels, Swahili (`sw`) localization groundwork.

**Exit criteria:** a first-time user in Kenya can find, read, cite and save a constitutional provision on a mid-range Android in under two minutes.

### Phase 4 — Post-launch (owner: product, after first store release)

- [ ] Offline reading (requires explicit `offline_device_copy_allowed` per document version; hash-verified cache, stale-version warnings).
- [ ] Push notifications (Firebase + APNs setup, opt-in device tokens, daily digest at user-selected local time).
- [ ] Home-screen widgets (Android AppWidget + iOS WidgetKit; needs a verified daily item and stale marking).
- [ ] Mobile billing: decide store billing (Google Play Billing / StoreKit) vs web Stripe entitlements — store rules generally require store billing for in-app features.
- [ ] AI legal research assistant: configure the OpenAI key as an Edge Function secret only; verify citations point to exact provisions and refusals when no qualifying passage exists.

## Mobile builds (Android & iOS) — developer handoff

The build infrastructure is **ready and CI-verified**. Mobile CI (Flutter 3.47.0, analyze + widget tests + debug APK) passed on the merged `main` baseline; the release workflow produces store-ready artifacts.

**What exists today**

- `apps/mobile` — Flutter client (Dart source, tests, runner bootstrap); app id `com.aztechnor.carta_mobile`.
- `.github/workflows/mobile-ci.yml` — analyze, widget tests, Android debug APK on every mobile change.
- `.github/workflows/mobile-release.yml` — release APK + AAB (signed when keystore secrets are configured, debug-signed otherwise) and an unsigned iOS release archive; runs on `v*` tags or manually via **Run workflow**.
- `apps/mobile/tool/bootstrap_platforms.sh` — regenerates native runners and configures the `carta://auth-callback` deep link.

**How to produce builds**

1. CI (recommended): GitHub → Actions → **CARTA Mobile Release** → *Run workflow* (optionally untick analyze/tests for a fast build), or push a `v*` tag. Artifacts: `carta-android-release-apk`, `carta-android-release-aab`, `carta-ios-unsigned-archive` (90-day retention).
2. Local: `cd apps/mobile && bash tool/bootstrap_platforms.sh && flutter pub get && flutter build apk --release && flutter build appbundle --release && flutter build ipa --release`.

**What the handoff developers must add**

- Android signing: create the upload keystore, base64 it into `ANDROID_KEYSTORE_B64` plus the three password/alias secrets (the workflow already consumes them).
- iOS signing: Apple Developer Program enrollment, App Store Connect API key, certificate and provisioning profile secrets; extend the iOS job with fastlane `pilot` or `xcrun altool` for TestFlight upload.
- Build-time configuration: `CARTA_SUPABASE_URL`, `CARTA_SUPABASE_PUBLISHABLE_KEY` (publishable key only — never a service-role or provider secret) and `CARTA_API_BASE_URL` as `--dart-define` values.
- Supabase Auth: add the mobile redirect `carta://auth-callback` to the redirect allow-list.
- Store presence: Play Console app + Apple App Store Connect record, icons, screenshots and privacy disclosures.

**Build rules**

- Release builds without signing secrets are debug-signed sideload test builds — never ship them to stores.
- No credential (service-role key, database password, AI provider key, payment secret) may enter a mobile binary, Dart define, or repository file.

## Repository and backend

Project: `CARTA-World-Constitutions-Library`  
Supabase project ref: `mvcirldxcuvcuqvlmqxv`  
Region: `ap-south-1` (Mumbai)  
API: `https://mvcirldxcuvcuqvlmqxv.supabase.co`

The live `carta-api` Edge Function is active. The repository contains the Supabase migrations and Flutter/web clients. The global jurisdiction classification migration is applied to live Supabase. Reconstructed historical migrations 004/005 still need validation in a disposable clean environment before claiming a fully reproducible fresh install.

## Development

1. Install Node.js 22 or later.
2. Run `npm install` (switches to `npm ci` once the lockfile lands — Phase 0).
3. Copy `.env.example` to `.env.local` and set browser-safe Supabase values.
4. Run `npm run dev`.
5. Run `npm test`, `npm run audit:global-queue`, `npm run typecheck`, `npm run syntaxcheck` and `npm run build`.

Never place a Supabase service-role key, database password, AI provider key, payment secret or other backend credential in a browser variable, mobile binary or GitHub source file. Use Supabase Edge Function secrets for backend credentials.

## Project links

- [GitHub repository](https://github.com/Blex31/carta-world-constitutions-library)
- [Supabase project dashboard](https://supabase.com/dashboard/project/mvcirldxcuvcuqvlmqxv)
- [Master launch checklist](docs/launch-checklist.md)
- [Blockers and solutions](docs/blockers-and-solutions.md)
- [Global constitution collection plan](docs/global-constitution-collection-plan.md)
- [Architecture](docs/architecture.md)
- [Supabase deployment handoff](docs/supabase-deployment.md)
