# CARTA native mobile requirements — Android and iOS

**Status:** committed product requirement; implementation is a separate Flutter deliverable.  
**Backend:** existing Supabase project and `carta-api` Edge Function.

## Product decision

CARTA must serve web, Android and iOS users. The current React/Vite codebase is the web client; it is not itself an Android or iOS application. Build the native clients in Flutter/Dart and connect them to the same backend and legal corpus. Do not fork the legal-data model.

## Shared backend contract

- Supabase Auth for sign-up, sign-in, token refresh and sign-out.
- CARTA Edge Function for library, documents, search, feeds, personal library, legal chat and billing status.
- User-scoped actions must be authorised by the current bearer token and enforced by RLS.
- No database password, service-role key, OpenAI key or Stripe secret in the app binary.
- Legal content, version state, source provenance, rights status and citations must match web.

## Native screens and behaviour

1. Welcome, registration, login and account recovery.
2. Country/jurisdiction catalogue and coverage states.
3. Document library and constitutional document reader with chapters, articles, source and version information.
4. Search results linked to exact provisions and official sources.
5. Legal assistant with source citations, document version labels and explicit no-source refusal.
6. Daily legal updates with publisher and publication date.
7. Personal library: bookmarks, highlights, notes and saved documents.
8. Downloads/offline library with stale-version warnings.
9. Account/profile/preferences, timezone, language and notification controls.
10. CARTA Plus membership and restore-purchases flow, using a store-compliant mobile payment implementation.

## Offline legal reading

Only cache documents whose exact rights record permits offline/device copies and whose version is approved for publication. Each offline object must retain document ID, version label, effective dates, source URL, SHA-256 content hash and downloaded timestamp. Verify the hash at download and re-check version status when connectivity returns.

If a newer version supersedes the cached copy, mark it stale and prompt for an update. Do not silently overwrite or present an old offline version as current. User notes/bookmarks may be queued locally and synced when authenticated.

## Notifications

Use FCM for Android and APNs-backed FCM for iOS. Require user opt-in, allow revocation, store device tokens against the authenticated user, respect timezone and daily-digest settings, and keep notification copy to a neutral title/source/date. Do not include legal advice or private chat content.

## Home-screen widgets

- Android: native AppWidget implementation showing a short verified daily item and deep link.
- iOS: WidgetKit extension backed by an App Group snapshot.
- Refresh from minimal public data; preserve source and date; deep-link into the correct document/article.
- Widget content must never imply that an old cached version is current.

## Billing and store review

The current Stripe endpoints support the web subscription flow only. Before enabling the mobile paywall, review the then-current Apple and Google policies for digital subscriptions, implement the appropriate in-app purchase or permitted alternative flow, verify receipts server-side and map entitlements to the same CARTA user account. Test restore purchases, cancellation, renewals, refunds and account switching.

## Mobile acceptance criteria

- The same account and library appear on web and mobile.
- A bookmark created on one client synchronises to the other.
- A licensed document can be downloaded, read offline and clearly marked stale when superseded.
- Search and AI citations open the correct document version and provision.
- No legal answer is generated without qualifying source chunks.
- Push notification opt-in/opt-out and timezone handling work.
- Text scaling, screen readers, low-bandwidth use and session expiry are tested.
- Android and iOS release builds pass device QA and store submission checks.
