# CARTA system architecture

## Application boundary

CARTA is a React/Vite single-page application. It does not depend on Floot or Supabase. The frontend uses `@neondatabase/auth` with the Better Auth React adapter, obtains short-lived access tokens and calls the CARTA Neon Function directly. No database credentials are shipped to the browser.

## Neon services

- **Lakebase Postgres:** jurisdiction catalogue, source registry, legal documents and versions, provisions, full-text chunks, feed items, personal library, chat history and subscription records.
- **Managed Neon Auth:** user identity and session. The API verifies JWTs against `NEON_AUTH_JWKS_URL` and `NEON_AUTH_BASE_URL`; `sub` is the account owner key.
- **Neon Function:** Hono REST API, scoped user data, legal-document search, citation-grounded streaming Q&A, Stripe endpoints, feed ingestion and source-administration routes.
- **Function Trigger:** hourly feed polling; each publisher is polled no more often than its registered `poll_interval_minutes`. The client rotates its daily card after 06:00 in the device’s local timezone. Push notifications at each user’s local 06:00 are a separate mobile notification service and are not active in this build.
- **AI Gateway:** optional branch-scoped model routing. It requires a paid Neon plan; a server-side OpenAI-compatible provider key is an alternative.

Neon Functions are backend primitives, not frontend hosting. Host the Vite build on a static app host and configure `VITE_CARTA_API_URL` with the Function invocation URL.

## Corpus provenance and legal-document lifecycle

A jurisdiction record is a catalogue entry, not a full constitutional text. Legal sources track publisher, official status, source URL/feed/API, authority rank and reuse rights. Documents track jurisdiction, document type, version, adoption/publication/effective dates, current/superseded status, official URL, content checksum, licence and editorial verification. Document sections preserve the article/section hierarchy. Search chunks are linked back to their exact source document and provision.

Publication and assistant retrieval both require a `verified` document, an approved/public-domain/open/permission-granted licence and `commercial_use_allowed = true`. The import tool also requires the source publisher to be official and commercially cleared. A later amendment is imported as a new version; the previous current version is marked superseded. No source is assumed reusable because it is publicly viewable.

## Current feed

The scheduled ingestion process reads only active official feeds when their publisher-specific polling interval is due. It verifies that each item link remains on the publisher's domain, deduplicates by source + external ID/canonical URL and stores metadata. It does not copy RSS article snippets or page bodies unless reuse permission is cleared. The daily feed is sourced from `feed_items` and displays canonical publisher links.

## User data isolation

The Function obtains user identity only from a validated bearer JWT. A body-supplied user ID is never trusted. Bookmark, highlight, note, download, chat-conversation and billing queries filter by the verified JWT subject. Conversation IDs are checked against the owner before history is read or appended.

## AI answer flow

1. Verify JWT and check the per-user request limit.
2. Identify a likely jurisdiction and search `document_chunks` using PostgreSQL full-text search.
3. Restrict retrieval to official sources and current, effective, verified, commercially reusable legal material.
4. Pass the retrieved excerpts, version metadata and canonical official URLs to the model.
5. Buffer the model draft, validate that every citation label belongs to the retrieved source set, then release the validated answer in small stream events; persist the conversation and exact chunk citation references.
6. Return no answer when no qualifying primary-source passage is found.

The model must not infer current law from memory, invent a holding/citation/date, treat a bill as enacted law, or follow instructions embedded in source documents. The product explains that it provides legal information, not advice.

## Deployment

See the root README and `docs/release-checklist.md`. Apply migrations in numeric order, enable Neon Auth, deploy the Function and daily trigger, configure CORS origins and secrets, publish the Vite bundle on an app host and verify auth isolation before launch.
