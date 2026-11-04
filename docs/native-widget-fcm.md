# Future native Android/iOS features

The current repository ships a React/Vite web/PWA application. A native Android/iOS release is a separate deliverable; this document records the architecture for adding it without introducing a second source of truth.

## Shared backend

Use the same Neon Postgres corpus, Neon Auth identity and CARTA Neon Function API. A future Flutter app should call the API with the short-lived bearer JWT obtained from Neon Auth. It must not connect directly to Postgres or contain server credentials. Keep the same document/version/licence and chat citation rules across web and mobile.

## Offline reading

A native client can download only documents that the API marks verified and legally reusable. Store the document ID, content hash, version label, effective dates, source URL and retrieved timestamp with the cached text. When a new version supersedes a cached document, mark the offline copy as stale and prompt for an update rather than silently replacing it. Sync bookmarks/notes using the authenticated library endpoints.

## Daily notifications

Daily reminders should respect the user's stored timezone and `daily_digest_enabled` preference. The Neon Function Trigger polls feeds hourly with per-source rate limits. CARTA rotates the visible daily item after 06:00 in each reader’s local timezone. Push delivery is a separate notification job and is not yet deployed; it should only send after user opt-in. A mobile client may use Firebase Cloud Messaging for Android and APNs/FCM for iOS; store device tokens against the authenticated user, allow revocation, and never send legal advice in notification previews.

## Home-screen widgets

- Android: implement an AppWidgetProvider with a small cache of the latest verified daily item and a deep link into the relevant CARTA document.
- iOS: implement WidgetKit with an App Group-backed read-only snapshot and a deep link into the app.
- Both widgets must show the source/publisher and publication date where available. A notification/widget item is an update summary, not the full legal text or legal advice.

## Release requirements

Build from the shared Neon API, validate purchase entitlements with the platform store, test offline version invalidation, timezone handling, notification opt-out and widget refresh. The current ZIP does not contain Flutter/Dart projects, native widgets, FCM registration or app-store binaries.
