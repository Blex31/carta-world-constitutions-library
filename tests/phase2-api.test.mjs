import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const api = await readFile(new URL("../supabase/functions/carta-api/index.ts", import.meta.url), "utf8");
const auth = await readFile(new URL("../src/auth.js", import.meta.url), "utf8");
const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");

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


test("Official-text exclusion is a distinct rights basis and requires a legal opinion", () => {
  assert.ok(api.includes('"official_text_exclusion"'));
  assert.ok(api.includes("LEGAL_OPINION_REQUIRED"));
  assert.ok(api.includes("legal_opinion_on_file"));
});

test("Constitution importer blocks official-text-exclusion imports without a legal opinion", async () => {
  const importer = await readFile(new URL("../scripts/import-constitution-documents.mjs", import.meta.url), "utf8");
  assert.ok(importer.includes("'official_text_exclusion'"));
  assert.ok(importer.includes("doc.rightsReviewStatus !== 'legal_opinion_on_file'"));
  assert.ok(importer.includes("row.metadata?.rightsReviewStatus !== 'legal_opinion_on_file'"));
});


test("Browser account flow supports password recovery and reset completion", () => {
  assert.ok(auth.includes("resetPasswordForEmail"));
  assert.ok(auth.includes("updateUser({ password })"));
  assert.ok(app.includes("PASSWORD_RECOVERY"));
  assert.ok(app.includes("Forgot your password?"));
  assert.ok(app.includes("Confirm new password"));
  assert.ok(app.includes("requestPasswordReset"));
});

test("Signing out clears private shelf data from the shared browser", () => {
  assert.ok(app.includes("localStorage.removeItem('carta-bookmarks')"));
  assert.ok(app.includes("localStorage.removeItem('carta-highlights')"));
  assert.ok(app.includes("localStorage.removeItem('carta-notes')"));
  assert.ok(app.includes("localStorage.removeItem('carta-downloads')"));
  assert.ok(app.includes("localStorage.removeItem('carta-owner-user')"));
});

test("Reconstructed Phase 2 migrations include private backend objects and grants", async () => {
  const identity = await readFile(new URL("../supabase/migrations/20261104215041_phase_2_identity_limits_scheduler.sql", import.meta.url), "utf8");
  const hardening = await readFile(new URL("../supabase/migrations/20261104215451_phase_2_private_rpc_hardening.sql", import.meta.url), "utf8");
  assert.ok(identity.includes("public.billing_customers"));
  assert.ok(identity.includes("carta_on_auth_user_created"));
  assert.ok(identity.includes("carta_validate_ingest_token"));
  assert.ok(identity.includes("carta-official-feed-daily"));
  assert.ok(identity.includes("to service_role"));
  assert.ok(hardening.includes("carta_claim_chat_slot"));
  assert.ok(hardening.includes("Service role required"));
  assert.ok(hardening.includes("grant execute on function public.carta_claim_chat_slot(text, integer, integer)"));
});

test("Global jurisdiction seed remains metadata-only and preserves existing EAC records", async () => {
  const seed = await readFile(new URL("../supabase/migrations/20261105103601_seed_global_jurisdiction_catalogue.sql", import.meta.url), "utf8");
  assert.ok(seed.includes("'metadata_only'"));
  assert.ok(seed.includes("on conflict (iso_code) do nothing"));
  assert.ok(seed.includes("not proof that a jurisdiction's constitution"));
  assert.ok(seed.includes("has been acquired"));
  assert.ok(!seed.includes("'verified_current'"));
});
