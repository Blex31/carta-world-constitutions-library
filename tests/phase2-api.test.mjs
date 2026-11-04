import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const api = await readFile(new URL("../supabase/functions/carta-api/index.ts", import.meta.url), "utf8");
const auth = await readFile(new URL("../src/auth.js", import.meta.url), "utf8");

test("Phase 2 exposes the frontend's legal research and billing routes", () => {
  for (const route of [
    'path==="/api/legal-chat"',
    'path==="/api/billing/checkout"',
    'path==="/api/billing/portal"',
    'path==="/api/billing/verify"',
    'path==="/api/billing/webhook"',
  ]) assert.ok(api.includes(route), `Missing API route: ${route}`);
});

test("Legal AI is limited to current, official, reusable primary-source passages", () => {
  assert.ok(api.includes('eq("legal_documents.document_status","verified")'));
  assert.ok(api.includes('eq("legal_documents.is_current",true)'));
  assert.ok(api.includes('eq("legal_documents.legal_sources.is_official",true)'));
  assert.ok(api.includes('eq("legal_documents.commercial_use_allowed",true)'));
  assert.ok(api.includes('store:false'));
  assert.ok(api.includes("carta_claim_chat_slot"));
  assert.ok(api.includes("noVerifiedSources:true"));
});

test("Scheduled ingestion uses a Vault-backed token and an explicit host allow-list", () => {
  assert.ok(api.includes("carta_validate_ingest_token"));
  assert.ok(api.includes("x-carta-cron-token"));
  assert.ok(api.includes("allowedHosts"));
  assert.ok(api.includes("redirect:\"manual\""));
  assert.ok(api.includes('.eq("is_active",true)'));
  assert.ok(api.includes('.eq("commercial_use_allowed",true)'));
});

test("Publisher activation remains rights-gated", () => {
  assert.ok(api.includes("RIGHTS_EVIDENCE_REQUIRED"));
  assert.ok(api.includes("SOURCE_NOT_CLEARED"));
  assert.ok(api.includes("!cur.data.is_official"));
  assert.ok(api.includes('license_status:"review_required"'));
});

test("Stripe webhook verifies the signature and supports idempotent retries", () => {
  assert.ok(api.includes("stripeSig(raw"));
  assert.ok(api.includes("Stripe webhook sync failed"));
  assert.ok(api.includes('from("payment_events").select("event_id")'));
  assert.ok(api.includes('from("payment_events").insert'));
});

test("Browser auth does not contain privileged server secrets", () => {
  assert.ok(!auth.includes("SUPABASE_SERVICE_ROLE_KEY"));
  assert.ok(!auth.includes("OPENAI_API_KEY"));
  assert.ok(!auth.includes("STRIPE_SECRET_KEY"));
});
