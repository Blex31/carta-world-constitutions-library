# CARTA Backend Development Guide

## Overview

The CARTA backend is built on **Supabase Postgres** with **Edge Functions** written in TypeScript. It provides the data layer and API for the web and mobile applications.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CARTA API                               │
│  (Edge Function: supabase/functions/carta-api/index.ts)     │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   Supabase Postgres                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Tables     │  │  Functions  │  │    Row Level        │ │
│  │             │  │             │  │    Security (RLS)   │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    Migrations                           │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  OpenAI     │  │  Stripe     │  │   Feed Publishers    │ │
│  │  (AI Chat)  │  │ (Billing)   │  │   (Official Feeds)   │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
supabase/
├── functions/
│   └── carta-api/
│       └── index.ts          # Main Edge Function
├── migrations/
│   ├── 20261104205355_initial_carta_supabase_schema.sql
│   ├── 20261104205533_policy_and_index_hardening.sql
│   ├── 20261104210643_user_library_constraints.sql
│   ├── 20261104215041_phase_2_identity_limits_scheduler.sql
│   ├── 20261104215451_phase_2_private_rpc_hardening.sql
│   ├── 20261104232302_official_text_exclusion_rights_basis.sql
│   ├── 20261104232545_official_text_exclusion_evidence_constraints.sql
│   ├── 20261105103601_seed_global_jurisdiction_catalogue.sql
│   ├── 20261105104522_optimize_ingestion_runs_admin_rls.sql
│   └── 20261108120000_classify_global_jurisdiction_catalogue.sql
└── config.toml                  # Supabase configuration
```

## Getting Started

### Prerequisites

- Supabase account and project
- Node.js 22+ (for Edge Functions)
- Deno (for local Edge Function testing)
- PostgreSQL client

### Setup

```bash
# Navigate to supabase directory
cd supabase

# Install Edge Function dependencies (if any)
cd functions/carta-api
# Deno uses remote imports, no npm install needed

# Deploy to Supabase
supabase functions deploy carta-api
```

### Environment Variables

Set these in Supabase Dashboard → Project Settings → Environment Variables:

```
# Required
SUPABASE_URL=https://mvcirldxcuvcuqvlmqxv.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI Provider (for legal chat)
OPENAI_API_KEY=sk-...

# Billing (Stripe)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_YEARLY=price_...

# Application
CARTA_SITE_URL=https://carta.world
CARTA_AI_MODEL=gpt-4.1-mini
CARTA_ALLOWED_ORIGINS=http://localhost:5173,https://carta.world
```

## Edge Function (carta-api)

The main Edge Function handles all API requests from web and mobile clients.

### Features

- **CORS**: Validates origins against allowed list
- **Authentication**: Validates JWT tokens from Supabase Auth
- **Authorization**: Checks admin role for sensitive operations
- **Rate Limiting**: Enforced via Supabase RLS and application logic
- **Error Handling**: Consistent error responses with proper HTTP codes

### Routes

#### Public Routes

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| GET | `/` | Health check | No |
| GET | `/health` | Health check with readiness | No |
| GET | `/api/library` | Get jurisdictions and documents | No |
| GET | `/api/library/:id` | Get specific document | No |
| GET | `/api/search` | Search documents | No |

#### Authenticated Routes

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| GET | `/api/library/me` | Get user library data | Yes |
| POST | `/api/legal-chat` | Ask legal research question | Yes |
| GET | `/api/billing/status` | Get subscription status | Yes |
| POST | `/api/billing/checkout` | Create checkout session | Yes |
| GET | `/api/billing/verify` | Verify checkout | Yes |
| POST | `/api/billing/portal` | Open billing portal | Yes |

#### Admin Routes

| Method | Path | Description | Auth Required | Admin Required |
|--------|------|-------------|---------------|----------------|
| GET | `/api/admin/sources` | List legal sources | Yes | Yes |
| POST | `/api/admin/sources` | Create legal source | Yes | Yes |
| PATCH | `/api/admin/sources/:id` | Update legal source | Yes | Yes |
| POST | `/api/admin/ingest` | Trigger feed ingestion | Yes | Yes or Cron Token |

#### Webhook Routes

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| POST | `/api/billing/webhook` | Stripe webhook | No (signature verified) |

### Request Flow

```typescript
// 1. Request received
Deno.serve(async (req: Request) => {
  // 2. Validate CORS origin
  const origin = req.headers.get("Origin");
  if (origin && !ORIGINS.has(origin)) {
    return fail("Origin is not allowed.", 403, "ORIGIN_NOT_ALLOWED", origin);
  }
  
  // 3. Initialize Supabase client
  let db: SupabaseClient;
  try {
    db = client(req);
  } catch (e) {
    return fail((e as Error).message, 500, "CONFIGURATION_ERROR", origin);
  }
  
  // 4. Parse URL and route
  const url = new URL(req.url);
  const path = route(url.pathname);
  
  // 5. Handle route
  if (path === "/api/legal-chat" && req.method === "POST") {
    const u = await userFor(req, db);
    if (!u) return fail("Sign in to use the legal research assistant.", 401, "AUTH_REQUIRED", origin);
    
    // 6. Process request
    // ...
  }
  
  // 7. Return response
  return json({ ok: true }, 200, origin);
});
```

### Helper Functions

#### Authentication

```typescript
// Get authenticated user from request
async function userFor(req: Request, db: SupabaseClient) {
  const a = req.headers.get("Authorization") ?? "";
  if (!a.toLowerCase().startsWith("bearer ")) return null;
  const { data, error } = await db.auth.getUser(a.slice(7).trim());
  return error ? null : data.user;
}

// Check if user is admin
function admin(u: any) {
  return u?.app_metadata?.role === "admin";
}
```

#### Response Helpers

```typescript
// Create JSON response
function json(data: unknown, status = 200, origin: string | null = null) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...headers(origin),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

// Create error response
function fail(message: string, status = 400, code?: string, origin: string | null = null) {
  return json({ error: message, ...(code ? { code } : {}) }, status, origin);
}

// Create streaming response
function stream(events: Array<{ event: string, data: unknown }>, origin: string | null) {
  const body = new ReadableStream<Uint8Array>({ ... });
  return new Response(body, {
    headers: {
      ...headers(origin),
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive"
    }
  });
}
```

#### Supabase Clients

```typescript
// Client with user token (for authenticated requests)
function client(req: Request): SupabaseClient {
  if (!SUPABASE_URL || !PUB) throw new Error("Supabase function configuration is incomplete.");
  const a = req.headers.get("Authorization");
  return createClient(SUPABASE_URL, PUB, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: a ? { headers: { Authorization: a } } : undefined
  });
}

// Service client (for admin operations)
function service(): SupabaseClient {
  if (!SUPABASE_URL || !SERVICE) throw new Error("The server-side Supabase service key is not available.");
  return createClient(SUPABASE_URL, SERVICE, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
```

### Key Features

#### Legal Chat

The legal chat endpoint provides AI-powered legal research:

1. **Validates** user authentication
2. **Claims** chat slot (rate limiting)
3. **Searches** for verified chunks matching the question
4. **Filters** by jurisdiction (optional)
5. **Calls** OpenAI API with context
6. **Streams** response back to client
7. **Saves** conversation and sources

```typescript
async function verifiedChunks(db: SupabaseClient, term: string, country: string | null) {
  const safe = term.replace(/[^\p{L}\p{N}\s\"'&-]/gu, " ").slice(0, 200);
  let q = db.from("document_chunks").select("...")
    .textSearch("search_vector", safe, { type: "websearch", config: "simple" })
    .eq("legal_documents.document_status", "verified")
    .eq("legal_documents.is_current", true)
    .eq("legal_documents.commercial_use_allowed", true)
    .in("legal_documents.license_status", LICENSES)
    .limit(80);
  
  if (country) q = q.eq("legal_documents.jurisdiction_iso", country);
  
  const r = await q;
  const today = new Date().toISOString().slice(0, 10);
  return (r.data ?? []).filter((x: any) => {
    const d = x.legal_documents;
    return (!d.effective_from || d.effective_from <= today) &&
           (!d.effective_until || d.effective_until >= today);
  }).slice(0, 12);
}
```

#### Feed Ingestion

The ingestion system polls official feeds for updates:

1. **Creates** ingestion run record
2. **Fetches** active, official, commercially-approved sources with feeds
3. **Checks** poll interval (minimum 15 minutes)
4. **Validates** feed URL and host
5. **Fetches** feed content (RSS/Atom/XML/JSON)
6. **Parses** items
7. **Validates** item URLs and hosts
8. **Saves** items to `feed_items` table
9. **Updates** source `last_polled_at`
10. **Records** results in ingestion run

```typescript
async function ingest(s: SupabaseClient) {
  const run = await s.from("ingestion_runs").insert({
    run_type: "official_feed_poll",
    status: "running"
  }).select("id").single();
  
  // Get eligible sources
  const sr = await s.from("legal_sources").select("...")
    .eq("is_active", true)
    .eq("is_official", true)
    .eq("commercial_use_allowed", true)
    .in("license_status", LICENSES)
    .not("feed_url", "is", null)
    .limit(100);
  
  // Process each source
  for (const source of sr.data ?? []) {
    // Check poll interval
    // Fetch feed
    // Parse items
    // Save to database
  }
  
  // Update ingestion run
  await s.from("ingestion_runs").update({
    status: problems.length ? "completed_with_warnings" : "completed",
    completed_at: new Date().toISOString(),
    records_seen: seen,
    records_added: added,
    records_skipped: skipped,
    error_message: problems.slice(0, 10).join("; ").slice(0, 1800) || null
  }).eq("id", run.data.id);
}
```

#### Billing Integration

Stripe integration for subscriptions:

1. **Checkout**: Create Stripe checkout session
2. **Webhook**: Handle Stripe events (checkout completed, subscription updated, etc.)
3. **Verify**: Verify checkout completion
4. **Portal**: Open Stripe customer portal
5. **Sync**: Sync subscription data to database

```typescript
// Create checkout session
async function checkout(req: Request, db: SupabaseClient, origin: string | null) {
  const u = await userFor(req, db);
  if (!u) return fail("Sign in before upgrading.", 401, "AUTH_REQUIRED", origin);
  
  const b = await req.json();
  const plan = b.plan === "monthly" ? "monthly" : "yearly";
  const price = plan === "monthly" ? MONTHLY_PRICE : YEARLY_PRICE;
  
  // Get or create Stripe customer
  const svc = service();
  let customerId = await getCustomerId(svc, u.id);
  
  // Create checkout session
  const form = new URLSearchParams();
  form.set("mode", "subscription");
  form.set("customer", customerId);
  form.set("line_items[0][price]", price);
  form.set("success_url", SITE + "/?checkoutSessionId={CHECKOUT_SESSION_ID}");
  form.set("cancel_url", SITE + "/?checkout=cancelled");
  
  const session = await stripe("checkout/sessions", form);
  return json({ url: session.url, sessionId: session.id }, 200, origin);
}
```

## Database Schema

### Core Tables

#### jurisdictions

Stores jurisdiction (country/area) information.

```sql
CREATE TABLE jurisdictions (
  id SERIAL PRIMARY KEY,
  iso_code VARCHAR(3) UNIQUE NOT NULL,
  name VARCHAR(240) NOT NULL,
  flag_emoji VARCHAR(10),
  jurisdiction_kind VARCHAR(80),
  is_un_member BOOLEAN DEFAULT false,
  continent VARCHAR(80),
  region VARCHAR(80),
  constitution_status VARCHAR(80) DEFAULT 'not_loaded',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### legal_sources

Stores information about legal document sources.

```sql
CREATE TABLE legal_sources (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(80) UNIQUE NOT NULL,
  name VARCHAR(240) NOT NULL,
  publisher VARCHAR(240),
  source_type VARCHAR(80),
  jurisdiction_iso VARCHAR(3) REFERENCES jurisdictions(iso_code),
  source_url TEXT NOT NULL,
  feed_url TEXT,
  api_url TEXT,
  documentation_url TEXT,
  authority_rank INTEGER DEFAULT 50,
  poll_interval_minutes INTEGER,
  is_official BOOLEAN DEFAULT false,
  license_status VARCHAR(80) DEFAULT 'review_required',
  commercial_use_allowed BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT false,
  content_scope TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### legal_documents

Stores legal documents (constitutions, amendments, etc.).

```sql
CREATE TABLE legal_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jurisdiction_iso VARCHAR(3) NOT NULL REFERENCES jurisdictions(iso_code),
  source_id INTEGER NOT NULL REFERENCES legal_sources(id),
  doc_type VARCHAR(80) NOT NULL,
  title VARCHAR(500) NOT NULL,
  short_title VARCHAR(240),
  document_number VARCHAR(100),
  language_code VARCHAR(10) DEFAULT 'en',
  official_url TEXT NOT NULL,
  source_reference VARCHAR(240),
  adopted_at DATE,
  published_at DATE,
  effective_from DATE,
  effective_until DATE,
  version_label VARCHAR(240),
  is_current BOOLEAN DEFAULT true,
  document_status VARCHAR(80) DEFAULT 'draft',
  full_text TEXT NOT NULL,
  content_sha256 VARCHAR(64) NOT NULL,
  license_status VARCHAR(80) NOT NULL,
  commercial_use_allowed BOOLEAN NOT NULL DEFAULT false,
  replaces_document_id UUID REFERENCES legal_documents(id),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### document_sections

Stores sections/articles of legal documents.

```sql
CREATE TABLE document_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES legal_documents(id) ON DELETE CASCADE,
  section_number VARCHAR(100),
  heading VARCHAR(500),
  section_order INTEGER NOT NULL,
  original_text TEXT NOT NULL,
  plain_language_summary TEXT,
  source_location VARCHAR(240),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### document_chunks

Stores searchable chunks of section text.

```sql
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES legal_documents(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES document_sections(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  language_code VARCHAR(10) DEFAULT 'en',
  heading VARCHAR(500),
  content TEXT NOT NULL,
  token_count INTEGER NOT NULL,
  metadata JSONB,
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### User Library Tables

#### user_bookmarks

```sql
CREATE TABLE user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES legal_documents(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES document_sections(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, section_id)
);
```

#### user_highlights

```sql
CREATE TABLE user_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES legal_documents(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES document_sections(id) ON DELETE CASCADE,
  selected_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, section_id)
);
```

#### user_notes

```sql
CREATE TABLE user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES legal_documents(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES document_sections(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### user_downloads

```sql
CREATE TABLE user_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES legal_documents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, document_id)
);
```

### Billing Tables

#### billing_customers

```sql
CREATE TABLE billing_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider VARCHAR(80) NOT NULL,
  provider_customer_id VARCHAR(240) NOT NULL,
  livemode BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, provider)
);
```

#### subscriptions

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider VARCHAR(80) NOT NULL,
  provider_customer_id VARCHAR(240) NOT NULL,
  provider_subscription_id VARCHAR(240) NOT NULL,
  plan_key VARCHAR(80) NOT NULL,
  status VARCHAR(80) NOT NULL,
  period_ends_at TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  is_live_mode BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(provider_subscription_id)
);
```

#### payment_events

```sql
CREATE TABLE payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id VARCHAR(240) NOT NULL,
  event_type VARCHAR(240) NOT NULL,
  is_live_mode BOOLEAN DEFAULT false,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id)
);
```

### Feed Tables

#### feed_items

```sql
CREATE TABLE feed_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id INTEGER NOT NULL REFERENCES legal_sources(id) ON DELETE CASCADE,
  jurisdiction_iso VARCHAR(3) REFERENCES jurisdictions(iso_code),
  external_id VARCHAR(500),
  item_type VARCHAR(80) NOT NULL,
  title VARCHAR(1000) NOT NULL,
  summary TEXT,
  content_excerpt TEXT,
  canonical_url TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  verification_status VARCHAR(80) DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(source_id, canonical_url)
);
```

#### ingestion_runs

```sql
CREATE TABLE ingestion_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_type VARCHAR(80) NOT NULL,
  status VARCHAR(80) NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  records_seen INTEGER DEFAULT 0,
  records_added INTEGER DEFAULT 0,
  records_skipped INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB
);
```

#### chat_conversations

```sql
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  jurisdiction_iso VARCHAR(3),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### chat_messages

```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(80) NOT NULL,  -- 'user' or 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### chat_message_sources

```sql
CREATE TABLE chat_message_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES legal_documents(id) ON DELETE CASCADE,
  chunk_id UUID NOT NULL REFERENCES document_chunks(id) ON DELETE CASCADE,
  citation_label VARCHAR(500) NOT NULL,
  citation_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Row Level Security (RLS)

All tables have RLS policies to control access.

### Example Policies

```sql
-- Allow read access to published documents
CREATE POLICY "Allow read access to published documents"
ON legal_documents FOR SELECT
USING (
  document_status = 'verified' AND
  commercial_use_allowed = true AND
  license_status IN ('approved', 'public_domain_verified', 'open_license', 'permission_granted', 'official_text_exclusion')
);

-- Allow users to read their own library
CREATE POLICY "Allow users to read their library"
ON user_bookmarks FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to manage their own library
CREATE POLICY "Allow users to manage their library"
ON user_bookmarks FOR ALL
USING (auth.uid() = user_id);

-- Allow admin to manage all data
CREATE POLICY "Allow admin full access"
ON ALL TABLES FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND app_metadata->>'role' = 'admin'
  )
);
```

## Migrations

### Migration Files

Migrations are SQL files in the `supabase/migrations/` directory. They are applied in alphabetical order.

#### 001: Initial Schema (20261104205355_initial_carta_supabase_schema.sql)

Creates core tables:
- jurisdictions
- legal_sources
- legal_documents
- document_sections
- document_chunks
- user_bookmarks
- user_highlights
- user_notes
- user_downloads
- billing_customers
- subscriptions
- payment_events
- feed_items
- ingestion_runs
- chat_conversations
- chat_messages
- chat_message_sources

#### 002: Policy and Index Hardening (20261104205533_policy_and_index_hardening.sql)

Adds:
- RLS policies for all tables
- Indexes for performance
- Constraints for data integrity

#### 003: User Library Constraints (20261104210643_user_library_constraints.sql)

Adds:
- Unique constraints for user library
- Foreign key constraints
- Check constraints

#### 004-005: Phase 2 (20261104215041_phase_2_identity_limits_scheduler.sql, 20261104215451_phase_2_private_rpc_hardening.sql)

Adds:
- Rate limiting functions
- Private RPC functions
- Additional security constraints

#### 006-007: Official Text Exclusion (20261104232302_official_text_exclusion_rights_basis.sql, 20261104232545_official_text_exclusion_evidence_constraints.sql)

Adds:
- Support for official_text_exclusion license status
- Evidence constraints for official text exclusion
- Rights review status tracking

#### 008: Seed Global Jurisdiction Catalogue (20261105103601_seed_global_jurisdiction_catalogue.sql)

Seeds the jurisdictions table with:
- 193 UN member states
- 2 UN observer states
- ISO codes
- Names
- Flags
- Continents
- Regions
- Jurisdiction kinds

#### 009: Optimize Ingestion Runs (20261105104522_optimize_ingestion_runs_admin_rls.sql)

Optimizes:
- Ingestion run queries
- Admin RLS policies
- Indexes for feed ingestion

#### 010: Classify Global Jurisdictions (20261108120000_classify_global_jurisdiction_catalogue.sql)

Updates:
- Jurisdiction classifications
- Constitution status
- Metadata

## Indexes

### Performance Indexes

```sql
-- Document search
CREATE INDEX idx_document_chunks_search ON document_chunks USING GIN(search_vector);

-- Jurisdiction lookups
CREATE INDEX idx_legal_documents_jurisdiction ON legal_documents(jurisdiction_iso);
CREATE INDEX idx_document_sections_document ON document_sections(document_id);
CREATE INDEX idx_document_chunks_document ON document_chunks(document_id);

-- User library
CREATE INDEX idx_user_bookmarks_user ON user_bookmarks(user_id);
CREATE INDEX idx_user_highlights_user ON user_highlights(user_id);
CREATE INDEX idx_user_notes_user ON user_notes(user_id);

-- Date filters
CREATE INDEX idx_legal_documents_effective ON legal_documents(effective_from, effective_until);
CREATE INDEX idx_feed_items_published ON feed_items(published_at);

-- Status filters
CREATE INDEX idx_legal_documents_status ON legal_documents(document_status, is_current, commercial_use_allowed);
CREATE INDEX idx_legal_sources_status ON legal_sources(is_official, commercial_use_allowed, is_active);
```

## Triggers

### Updated At Trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_jurisdictions_updated_at
  BEFORE UPDATE ON jurisdictions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Similar triggers for other tables
```

### Search Vector Trigger

```sql
CREATE OR REPLACE FUNCTION update_document_chunks_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('simple', COALESCE(NEW.heading, '') || ' ' || COALESCE(NEW.content, ''));
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_document_chunks_search_vector
  BEFORE INSERT OR UPDATE ON document_chunks
  FOR EACH ROW EXECUTE FUNCTION update_document_chunks_search_vector();
```

## RPC Functions

### Claim Chat Slot

```sql
CREATE OR REPLACE FUNCTION carta_claim_chat_slot(
  p_user_id UUID,
  p_max_requests INTEGER DEFAULT 12,
  p_window_seconds INTEGER DEFAULT 60
)
RETURNS SETOF RECORD AS $$
BEGIN
  -- Check if user has exceeded rate limit
  -- Return allowed = true/false
  -- This is a simplified version
  RETURN QUERY
  SELECT 
    CASE 
      WHEN (SELECT COUNT(*) FROM chat_messages 
            WHERE user_id = p_user_id 
            AND created_at > NOW() - (p_window_seconds || ' seconds')::INTERVAL) < p_max_requests
      THEN TRUE
      ELSE FALSE
    END AS allowed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Validate Ingest Token

```sql
CREATE OR REPLACE FUNCTION carta_validate_ingest_token(p_token TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Validate cron token for scheduled ingestion
  RETURN p_token = (SELECT configuration_value FROM supabase_config WHERE configuration_key = 'carta_cron_token');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Deployment

### Deploy Edge Function

```bash
# Deploy to Supabase
supabase functions deploy carta-api

# Deploy with specific version
supabase functions deploy carta-api --version 2.0.0
```

### Apply Migrations

Migrations are automatically applied when:
- Pushed to Supabase via GitHub Actions
- Applied manually via Supabase dashboard
- Applied via CLI: `supabase db push`

### Rollback

To rollback a migration:

```bash
# List migrations
supabase migrations list

# Reset database (WARNING: destructive!)
supabase db reset

# Re-apply migrations
supabase db push
```

## Monitoring

### Supabase Dashboard

Monitor:
- Function logs
- Database performance
- Query performance
- Error rates
- Usage metrics

### Logging

Edge Function logs are available in:
- Supabase Dashboard → Functions → carta-api → Logs
- Can also be streamed via CLI

```bash
# Stream logs
supabase functions logs carta-api
```

### Metrics

Track:
- Request count
- Error rate
- Latency
- Database query performance
- AI API usage
- Billing events

## Security

### Environment Variables

- Never commit secrets to Git
- Use Supabase's encrypted environment variables
- Rotate keys regularly

### Authentication

- All sensitive routes require authentication
- Admin routes require admin role
- Use Supabase Auth for user management

### Authorization

- RLS policies control data access
- Application logic validates permissions
- Admin role checked in code

### Rate Limiting

- Chat: 12 requests per 60 seconds per user
- Feed ingestion: Minimum 15 minutes between polls
- API: Consider adding rate limiting middleware

### Input Validation

- All inputs are validated
- SQL injection prevented via parameterized queries
- XSS prevented via output encoding

## Testing

### Test Edge Function Locally

```bash
# Install Deno
curl -fsSL https://deno.land/x/install/install.sh | sh

# Run locally
deno run --allow-net --allow-env index.ts

# Or with Supabase CLI
supabase functions serve
```

### Test Database

```bash
# Connect to database
psql postgresql://postgres:[YOUR-PASSWORD]@db.mvcirldxcuvcuqvlmqxv.supabase.co:5432/postgres

# Run queries
SELECT * FROM jurisdictions LIMIT 10;
```

## Best Practices

1. **Migrations**: Always test migrations in staging before production
2. **RLS**: Always test RLS policies thoroughly
3. **Indexes**: Add indexes for frequently queried columns
4. **Logging**: Add comprehensive logging for debugging
5. **Error Handling**: Handle errors gracefully with appropriate HTTP codes
6. **Validation**: Validate all inputs and outputs
7. **Security**: Never expose service role keys in client code
8. **Performance**: Optimize queries and add indexes as needed
9. **Backups**: Regularly backup database
10. **Monitoring**: Set up monitoring and alerts

## Troubleshooting

### Common Issues

**Issue**: Edge Function not deploying
**Solution**: Check for syntax errors, ensure Deno can access dependencies

**Issue**: RLS blocking queries
**Solution**: Check RLS policies, test with `SELECT * FROM table WHERE auth.uid() = user_id`

**Issue**: Performance issues
**Solution**: Add indexes, optimize queries, check for N+1 queries

**Issue**: Authentication failing
**Solution**: Verify JWT secret, check Supabase Auth configuration

**Issue**: AI API errors
**Solution**: Check OpenAI API key, verify rate limits, check model availability

### Debugging

```bash
# Check function logs
supabase functions logs carta-api

# Check database logs
supabase logs

# Test function locally
supabase functions serve

# Query database directly
psql [CONNECTION_STRING]
```

## Contributing

1. Create a new migration file with timestamp prefix
2. Add SQL to migration file
3. Test migration locally
4. Test Edge Function changes locally
5. Commit changes
6. Push to repository
7. Open pull request

## License

This project is private and proprietary. Do not redistribute without permission.
