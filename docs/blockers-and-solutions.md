# CARTA — blockers, reasons and practical solutions

**Updated:** 8 November 2026  
**Purpose:** Explain why a CARTA release item is pending, what evidence or dependency is missing, and the concrete action that clears it.

A blocker is not automatically a code defect. Some items need engineering, some need a decision or credential, and some need third-party permission. We should not bypass a rights, payment or security gate merely to make a feature appear finished.

## 1. Legal-document collection — critical product blocker

**Why it is pending**

The live database has 250 jurisdiction catalogue records but zero verified legal documents and zero searchable chunks. A country name in the directory is only catalogue metadata. The current EAC sources are inactive and marked rights-review-required. Official availability on a government website does not, by itself, establish permission for CARTA to reproduce, redistribute, commercialise, index, translate, use with AI or cache offline.

**Solution**

1. Start with Rwanda, the recorded first-document candidate.
2. Send the prepared publisher confirmation and permission request to the Rwanda Law Reform Commission / relevant official publisher.
3. Obtain a Rwanda-qualified legal opinion that covers the exact use cases CARTA intends: free/paid web and mobile display, copying, full-text search, AI retrieval/embeddings/summaries, translations/plain-language derivatives and offline copies.
4. Verify the authoritative text, language precedence, commencement and amendment cut-off.
5. Reconcile the 176 articles, compute SHA-256 checksums and have a second reviewer verify the edition.
6. Run the existing importer in dry-run mode. Import only when all rights and editorial gates have been met.

**How we know it is cleared**

The source/document records contain the written or counsel-approved evidence, permitted-use scope, attribution, exact version and effective dates; the importer succeeds; and a document, provisions and chunks are visible in the live database. Until then, keep the source inactive.

## 2. AI legal research assistant

**Why it is pending**

The API route and evidence filters exist, but the corpus is empty and the OpenAI server secret is not configured. With no qualifying passages, CARTA must refuse legal answers rather than generate them from general model knowledge.

**Solution**

- Complete the first verified document import.
- Add the OpenAI API key only as a Supabase Edge Function secret; never add it to Dart, React, a mobile binary or a VITE_/DART-DEFINE client variable.
- Confirm the model, rate limits and monthly spend ceiling.
- Test questions whose answers are present, absent, amended, conflicting or out of date. Verify that every citation points to the precise provision and version.

**Clearance test**

A question with evidence returns source-linked answers; a question without evidence returns CARTA's no-source refusal; the UI shows the source/version and legal-information disclaimer.

## 3. Official legal updates

**Why it is pending**

The daily ingestion scheduler is active, but all eight candidate publishers are inactive or awaiting rights review. The scheduler cannot safely ingest a source just because its feed URL works.

**Solution**

- Approve one official publisher at a time after checking source authority and feed reuse rights.
- Store the publisher's permitted host names, canonical feed URL, attribution and scope.
- Test a feed for source identity, dates, duplicate handling, hostile feed content and corrections.
- Add monitoring and alerts for stale or failed feeds.

**Clearance test**

An approved item appears once with source, publisher, publication date and jurisdiction; an inactive/unapproved source remains excluded.

## 4. Web deployment and production email

**Why it is pending**

The React/Vite frontend has a passing build, but a production/staging host and public URL are not confirmed. Supabase Auth also needs a production redirect allow-list and reliable SMTP. Password-reset code existing in the frontend does not prove that messages reach real inboxes.

**Solution**

- Pick a hosting provider and deploy staging first.
- Set the browser-safe Supabase URL, publishable key and CARTA API URL as build variables.
- Set exact production origins in CARTA_ALLOWED_ORIGINS.
- Configure Supabase Auth Site URL, redirect allow-list, sender domain and SMTP provider.
- Add the web redirect URL and mobile callback carta://auth-callback.
- Test confirmation, reset, session expiry and account isolation using two separate accounts.

**Clearance test**

Registration and recovery emails arrive; the user lands on the correct web/mobile screen; CORS and authenticated API requests work from the staging app.

## 5. Flutter app credentials and deep links

**Why it is pending**

The native app needs the existing project's Supabase URL and publishable key at build time. The key is safe for client use with RLS; a service-role/database/provider secret is not. Password reset and confirmation also need the app's custom callback registered with Supabase and native OS runners.

**Solution**

- Build with CARTA_SUPABASE_URL, CARTA_SUPABASE_PUBLISHABLE_KEY and CARTA_API_BASE_URL.
- Use only the publishable key. Keep service-role, database, OpenAI and Stripe secrets on the backend.
- Run apps/mobile/tool/bootstrap_platforms.sh; it generates Android/iOS runners and registers carta://auth-callback.
- Add carta://auth-callback to Supabase Authentication > URL Configuration > Redirect URLs.
- Test email confirmation and recovery on real Android and iOS devices.

**Clearance test**

A reader can create an account, confirm email, sign in, reset a password and retain a refreshed session after closing/reopening the app.

## 6. Offline legal reading

**Why it is pending**

The live API does not expose a document-level approval that specifically authorises offline/device copies. A general right to display or commercialise a text is not automatically permission to cache and redistribute copies on user devices.

**Solution**

- Add explicit offline_device_copy_allowed rights metadata at source and document/version level.
- Require the importer to reject an offline download unless the exact version has that permission.
- Include the permission, document version, effective dates, source URL and SHA-256 checksum in the API response.
- Cache only eligible documents. Verify checksums and show stale-version warnings when an amendment supersedes an offline copy.
- Keep offline download UI disabled until the backend contract and a real cleared document are tested.

**Clearance test**

An explicitly licensed document can be downloaded, hash-verified and read offline; a document without offline permission cannot be cached; superseded documents are clearly marked stale.

## 7. Push notifications

**Why it is pending**

No Firebase app configuration, APNs credentials or CARTA device-token registration workflow has been completed. iOS push also needs the Apple Push Notifications service key and Xcode capabilities. A client permission prompt alone cannot deliver a message.

**Solution**

- Create/register CARTA's Android and iOS apps in Firebase.
- Add Android google-services.json and iOS GoogleService-Info.plist to the mobile build securely as public app configuration files (not server secrets).
- Upload the APNs authentication key to Firebase and enable Push Notifications / Background Modes in the iOS runner.
- Add a user-owned device-token table and authenticated register/unregister API endpoints.
- Require opt-in and support revocation. Store timezone and preferred digest time.
- Schedule per-user daily messages at the selected local time, initially 06:00, and send only verified title/source/date. Never send private chat content or legal advice in notification text.

**Clearance test**

Opted-in devices receive one correctly timed update; opted-out devices receive none; token rotation and sign-out remove stale device registrations.

## 8. Home-screen widgets

**Why it is pending**

Android AppWidget and iOS WidgetKit are native platform extensions, not ordinary Flutter screens. A widget also needs a verified daily item to display. The current legal corpus/feed is empty.

**Solution**

- First import a verified legal document and approve at least one publisher update.
- Implement an Android AppWidget and an iOS WidgetKit extension.
- Share a minimal, versioned snapshot from Flutter to the widget (Android storage / iOS App Group).
- Include the source, date and deep link. Mark stale data and never imply an old cached law is current.
- Test refresh throttling, offline state and widget removal on both platforms.

**Clearance test**

Both platforms show a verified daily item, open the matching CARTA screen on tap and never show an item as current after it has become stale.

## 9. CARTA Plus on mobile

**Why it is pending**

The current Stripe integration is for the web flow. An ad-free subscription unlocks digital app functionality/content. Google Play generally requires Play Billing for digital subscriptions/features distributed through Play, and Apple's App Review rules generally require In-App Purchase to unlock in-app functionality/content. Store programs and regional exceptions can change; do not assume a web Stripe checkout link is permitted in either native app.

**Solution**

- Keep web Stripe and mobile-store purchase systems separate at the checkout layer.
- Decide whether native Plus launches with Apple In-App Purchase and Google Play Billing.
- Implement store purchases and server-side receipt/purchase-token validation.
- Map verified store entitlements to the same CARTA user and existing subscription state.
- Implement restore purchases, renewal, cancellation, refunds, grace periods and account switching.
- Verify current store rules and any eligible regional alternative-billing program before choosing an exception.

**Clearance test**

A test purchase, renewal, cancellation and restore correctly update the same CARTA account's ad-free entitlement; the app never unlocks Plus based only on a client-side flag.

## 10. Store release and signing

**Why it is pending**

A successful Flutter build is not the same as an installable, store-ready release. Android release builds need an application ID, upload/signing key and Play Console setup. iOS distribution requires macOS/Xcode, an Apple Developer account/team, bundle identifier, signing and provisioning.

**Solution**

- Confirm the public app name, Android application ID and iOS bundle identifier.
- Create/confirm Google Play Console and Apple Developer accounts.
- Generate and securely back up the Android upload key; never commit it.
- Configure Apple certificates, provisioning profiles and App Store Connect app record.
- Add app icons, splash screen, privacy disclosures, support URL, screenshots and review notes.
- Test release builds on physical devices and submit through internal/TestFlight tracks before public release.

**Clearance test**

Signed Android AAB and iOS archive build successfully; internal testers can install, sign in, read and report issues; store review metadata and privacy disclosures are complete.

## 11. Clean database installation and dependency lockfiles

**Why it is pending**

Migrations 004/005 were reconstructed from the live database and need independent clean-install validation. The web workflow also uses npm install without a committed package lock. The Flutter package needs its generated pubspec.lock committed once dependency resolution is final.

**Solution**

- Apply all nine Supabase migrations to a disposable empty project/local stack and run the database checks.
- Compare the result with live tables, policies, functions and cron jobs.
- Run npm install once, commit package-lock.json, then switch CI to npm ci.
- Run flutter pub get with the selected stable Flutter SDK and commit apps/mobile/pubspec.lock.
- Do not update dependencies automatically without re-running analysis, tests and platform builds.

**Clearance test**

A clean checkout reproduces the web and Flutter dependency graph and builds in CI without dependency drift.

## 12. Current mobile build work

The initial Flutter source slice is being developed on feature/flutter-native-clients. It currently covers:

- Supabase email sign-up/sign-in and password reset request;
- secure persisted sessions;
- jurisdiction catalogue and empty states;
- verified legal-document reader;
- legal search;
- official update list;
- authenticated research request;
- account screen and personal-library summary;\n- dedicated My Library screen for saved documents, bookmarks, highlights and private notes, with open/remove actions (added to the Flutter branch; CI/device verification pending);
- Android/iOS runner generation and auth callback setup;
- Flutter analysis, widget tests and Android/iOS build workflow.

This is not yet a public release. Device QA, push, widgets, offline reading, mobile billing, store signing and configuration remain separate gates.


## 13. My Library — implementation added, verification pending

**Current state**

The Flutter branch now includes a dedicated My Library screen with four views: saved documents, bookmarks, highlights and private notes. Readers can open a linked verified document and remove a saved item. The screen uses the existing authenticated `GET /api/library/me` and `POST /api/library/me` actions; no schema change or production Supabase change was required.

**Remaining verification**

- [ ] Confirm Flutter analysis, widget tests, Android debug build and iOS unsigned build pass for the commit that adds the screen.
- [ ] Test real Android and iOS accounts with multiple saved items and an empty library.
- [ ] Confirm delete operations remove only the signed-in user's selected item and refresh the screen correctly.
- [ ] Confirm bookmarks/highlights/notes are consistent after sign-out, sign-in and another device.
- [ ] Test graceful display when a document has been withdrawn or is no longer in the verified publication set.

**Clearance test**

A signed-in reader can save a provision, find it in the correct My Library tab, open its document, remove the item, and see the updated state on another session without any cross-account leakage.
