# CARTA system architecture

## Product targets

CARTA is a shared legal-content platform with two clients:

- **Web:** current React + Vite single-page application.
- **Native mobile:** Flutter applications for Android and iOS. Mobile is a committed product target, not a separate data product.

Both clients use the same live Supabase project, authentication identities, API, legal corpus, version history, citations and user library. Do not create a second mobile database or duplicate legal documents.

## Backend

- **Supabase Postgres:** jurisdictions, official-source registry, legal documents and versions, sections/provisions, searchable chunks, feed items, personal library, chat history and subscription records.
- **Supabase Auth:** identity, session and JWT.
- **Supabase Edge Function `carta-api`:** public catalogue/search/read routes, authenticated user-library and chat routes, publisher administration, ingestion and billing adapters.
- **RLS:** isolates user-specific bookmarks, notes, highlights, downloads, profiles and conversations.
- **Supabase Vault / server secrets:** service-role and third-party provider credentials remain server-side.
- **pg_cron + pg_net:** scheduled publisher-feed checks after sources are rights-cleared and activated.

Neither web nor mobile clients may contain a service-role key, database password, OpenAI key or Stripe secret. Clients authenticate with Supabase Auth and call the CARTA API with a publishable API key plus the current user bearer token where required. Never let a body-supplied user ID determine ownership.

## Canonical legal corpus and provenance

Jurisdictions are catalogue records, not proof of document coverage. Legal sources record the publisher, source URL/feed, official status, authority rank and licence/rights evidence. Documents record the jurisdiction, type, version, official URL, source reference, adopted/published/effective dates, current/superseded status, checksum, language and reuse licence. Sections preserve the chapter/article hierarchy; chunks link search and AI retrieval to an exact document and provision.

Both publication and legal-assistant retrieval require a verified current document and a rights record permitting the relevant use, including commercial redistribution and AI retrieval. Mobile offline copies additionally require explicit offline/device-copy rights. A public link or downloadable government PDF is not sufficient by itself.

Amendments are new versions with clear effective dates and relationships to prior texts. Keep historical versions for traceability but do not present them as current. Preserve the exact language/edition and distinguish authoritative text from translations, editorial annotations and plain-language summaries.

## Legal research assistant

1. Validate the authenticated user's JWT and enforce request limits.
2. Search only approved current/effective legal chunks.
3. Restrict retrieval to official and rights-cleared sources.
4. pass retrieved passages, version labels, provision references and official URLs to the model.
5. Validate that model citations point to the retrieved source set; persist the answer and source references.
6. Refuse to answer when the corpus lacks an appropriate passage.

The assistant must not invent law, amendments, court decisions, citations or effective dates; must distinguish bills from enacted laws; and must state when a source is outdated, contested or missing. CARTA provides legal information, not individual legal advice.

## Web client

The React/Vite app is the current web client. It reads public library metadata through the CARTA API and uses Supabase Auth for sign-in. Browser local storage may be used for limited device preferences and migration, but the authenticated Supabase library is the sync source of truth.

## Native Android/iOS clients

The native app is Flutter/Dart and uses:
- Supabase Flutter Auth for account sessions;
- a typed API client for `carta-api`;
- repositories/models shared conceptually with the web API contract;
- local relational storage for permitted offline texts and user actions;
- secure device storage for session-sensitive material.

Required native screens: onboarding/auth, jurisdiction catalogue, document reader, full-text search, legal assistant, daily updates, personal library, downloads/offline, profile/preferences and subscription status.

The API remains the sole source of legal currentness and rights eligibility. When offline, show the cached version and its retrieved timestamp; if a newer version is known, clearly mark the cached copy stale. Never silently replace a document whose legal version changed.

## Push notifications and widgets

Push notifications require explicit opt-in, revocable device tokens, per-user timezone and daily-digest preferences. Use Firebase Cloud Messaging for delivery, with APNs configuration for iOS. Widgets are native surfaces: Android AppWidget and iOS WidgetKit, updated from a minimal snapshot of the latest verified daily item. Show its publisher and date; do not display legal advice in notifications or widgets.

## Billing

Stripe checkout and webhook routes are a web integration and require configured secrets, Price IDs and a production site URL. The Flutter app must first be checked against current Apple App Store and Google Play rules for digital subscriptions. Use a provider-compliant mobile purchase flow and map verified purchases to the same backend entitlement for the signed-in user. Do not assume a web Stripe Checkout URL is acceptable inside either app store build.

## Current corpus gate

The live database currently contains 250 jurisdiction catalogue records (including eight EAC partner states) and eight inactive EAC source candidates, but zero verified legal documents and zero searchable chunks. Catalogue records are metadata only and do not establish constitutional coverage. No legal text should be presented as a verified corpus until publisher rights, current version and authoritative language have been reviewed.

See:
- [Phase 3 legal library and mobile plan](phase-3-legal-library-and-mobile.md)
- [Supabase deployment and production handoff](supabase-deployment.md)
- [EAC source review queue](eac-first-batch.md)
- [Native mobile requirements](native-widget-fcm.md)
