import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const jurisdictions = JSON.parse(await read('data/jurisdictions.seed.json'));
const schema = await read('neon/migrations/001_initial_schema.sql');
const sourceRegistry = await read('neon/migrations/002_source_registry.sql');
const feeds = await read('neon/migrations/004_official_feed_sources.sql');
const additionalSources = await read('neon/migrations/005_official_national_sources.sql');
const pollIndex = await read('neon/migrations/007_feed_poll_index.sql');
const chunkIndexMigration = await read('neon/migrations/008_chunk_section_uniqueness.sql');
const coverageAudit = await read('scripts/audit-coverage.mjs');
const dailySources = await read('neon/migrations/006_official_daily_sources.sql');
const api = await read('neon/functions/carta/index.ts');
const readSourceTree = async (dir) => {
  const entries = await readdir(new URL(`../${dir}`, import.meta.url), { withFileTypes: true });
  let out = '';
  for (const entry of entries.sort((a, b) => a.name < b.name ? -1 : 1)) {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) out += await readSourceTree(rel);
    else if (/\.(js|jsx)$/.test(entry.name)) out += `\n${await read(rel)}`;
  }
  return out;
};
const app = await readSourceTree('src');
const importer = await read('scripts/import-constitution-documents.mjs');
const neonConfig = await read('neon.ts');

test('jurisdiction directory is unique ISO metadata, not falsely labelled as complete constitutional coverage', () => {
  assert.ok(jurisdictions.length >= 240, `expected broad jurisdiction directory, received ${jurisdictions.length}`);
  const codes = jurisdictions.map((item) => item.iso_code);
  assert.equal(new Set(codes).size, codes.length, 'jurisdiction codes must be unique');
  for (const item of jurisdictions) {
    assert.match(item.iso_code, /^[A-Z]{2,3}$/);
    assert.equal(item.jurisdiction_kind, 'unclassified');
    assert.equal(item.is_un_member, null);
  }
  assert.ok(!jurisdictions.some((item) => item.constitution_status === 'verified_current'));
});

test('legal corpus schema captures provenance, exact versions, effective dates, and reuse flags', () => {
  for (const field of ['source_id', 'official_url', 'version_label', 'effective_from', 'effective_until', 'content_sha256', 'license_status', 'commercial_use_allowed', 'is_current']) {
    assert.ok(schema.includes(field), `schema should include ${field}`);
  }
  assert.ok(schema.includes('document_sections'));
  assert.ok(schema.includes('document_chunks'));
  assert.ok(schema.includes('search_vector tsvector generated always'));
  assert.match(schema, /unique\(document_id, section_id, chunk_index, language_code\)/);
  assert.match(chunkIndexMigration, /unique \(document_id, section_id, chunk_index, language_code\)/);
});

test('restricted/unclear sources are not automatically approved for commercial corpus or AI use', () => {
  assert.match(sourceRegistry, /'kenya-law'[\s\S]*?'review_required',false/);
  assert.match(sourceRegistry, /'saflii-directory'[\s\S]*?'review_required',false/);
  assert.match(sourceRegistry, /'constitute-ccp'[\s\S]*?'noncommercial_only',false/);
  assert.match(dailySources, /update legal_sources set is_active=false, commercial_use_allowed=false/);
  assert.match(api, /s\.license_status in \('approved','public_domain_verified','open_license','permission_granted'\)/);
  assert.match(api, /s\.commercial_use_allowed\s*=\s*true/);
});

test('feed ingestion is publisher-scoped, metadata-only by default, deduplicated, and rate-limited', () => {
  assert.match(api, /last_polled_at is null or last_polled_at <= now\(\) - make_interval/);
  assert.match(api, /allowedHosts/);
  assert.match(api, /on conflict do nothing returning id/);
  assert.match(api, /metadataOnly: !summaryText/);
  assert.match(pollIndex, /legal_sources_due_feed_idx/);
  assert.match(coverageAudit, /verified_current_constitutions/);
  assert.match(api, /allowFeedSnippets === true/);
  assert.match(neonConfig, /cron: '0 \* \* \* \*'/);
});

test('daily card distinguishes actual bills from enacted legislation and court updates', () => {
  assert.match(api, /item\.item_type === "bill" \? "BILL"/);
  assert.match(api, /item\.item_type === "judgment" \? "COURT UPDATE"/);
  assert.match(api, /item\.item_type === "legislation" \? "LEGISLATION"/);
  assert.match(app, /item\.type==='BILL'\?'BILL':'CURRENT AFFAIR'/);
  assert.ok(app.includes('daily-category'), 'daily randomizer should be stable by country and local day');
  assert.ok(app.includes('{daily?'), 'daily card should render only when a verified daily item exists');
  assert.match(app, /No eligible daily item yet/);
});

test('source registry additions require an administrator and start inactive with rights review pending', () => {
  assert.match(api, /app\.post\(\"\/api\/admin\/sources\"/);
  assert.match(api, /const adminId = await requireAdmin\(c\.req\.raw\)/);
  assert.match(api, /values\(\$1,\$2,\$3,\$4,\$5,\$6,\$7,\$8,\$9,\$10,\$11,'review_required',false,\$12,\$13,false/);
  assert.match(app, /Register an official publisher \/ feed/);
});

test('legal chatbot requires a current, verified, effective, licensed official source', () => {
  assert.match(api, /d\.document_status='verified'/);
  assert.match(api, /d\.is_current = true/);
  assert.match(api, /d\.effective_from is null or d\.effective_from <= current_date/);
  assert.match(api, /d\.effective_until is null or d\.effective_until >= current_date/);
  assert.match(api, /s\.is_official = true/);
  assert.match(api, /websearch_to_tsquery/);
  assert.match(api, /I don't have a verified primary-source passage matching that question/);
  assert.match(api, /citation label/);
  assert.match(api, /Do not infer missing law from general knowledge/);
});

test('document importer blocks placeholder and noncommercial/unlicensed material', () => {
  assert.match(importer, /commercial reuse must be explicitly cleared/);
  assert.match(importer, /if \(!row\.is_official\)/);
  assert.match(importer, /row\.commercial_use_allowed !== true/);
  assert.match(importer, /documentStatus !== 'verified'/);
  assert.match(importer, /--apply/);
  assert.match(importer, /rightsEvidenceUrl/);
  assert.match(importer, /language_code=\$3 and is_current=true/);
  assert.match(importer, /placeholder text/);
});


test('daily reader rotation follows 06:00 local time and official feeds can be refreshed while the app stays open', () => {
  assert.match(app, /function dayKey\(now=new Date\(\)\)/);
  assert.match(app, /d\.getHours\(\)<6/);
  assert.match(app, /setInterval\(\(\)=>setClockTick\(Date\.now\(\)\),60_000\)/);
  assert.match(app, /setInterval\(\(\)=>void refreshFeed\(false\),5\*60_000\)/);
  assert.match(app, /apiFetch\(`feed\?limit=80&country=/);
});

test('document import schema permits repeated chunk numbers across different provisions and preserves language editions', () => {
  assert.match(schema, /unique\(document_id, section_id, chunk_index, language_code\)/);
  assert.match(chunkIndexMigration, /drop constraint if exists document_chunks_document_id_chunk_index_language_code_key/);
  assert.match(importer, /language_code=\$3 and is_current=true/);
});

const eacCandidates = JSON.parse(await read('data/eac-source-candidates.json'));
const eacMigration = await read('neon/migrations/009_eac_constitution_sources.sql');

test('EAC first-batch source map covers all eight partner states without granting unverified text rights', () => {
  const expected = ['BI','CD','KE','RW','SO','SS','TZ','UG'];
  const codes = eacCandidates.jurisdictions.map((item) => item.isoCode).sort();
  assert.deepEqual(codes, expected);
  assert.equal(eacCandidates.jurisdictions.length, 8);
  assert.equal(eacCandidates.policy.publicationStatus, 'metadata_only');
  assert.equal(eacCandidates.policy.commercialUseAllowed, false);
  for (const item of eacCandidates.jurisdictions) {
    assert.ok(item.officialSourceUrl.startsWith('https://'));
    assert.match(item.rightsStatus, /review_required|restricted_pending_written_licence/);
  }
  for (const slug of ['eac-burundi-constitution','eac-drc-constitution','kenya-law','rwanda-minijust','eac-somalia-constitution','eac-south-sudan-constitution','tanzania-oag','uganda-parliament']) {
    assert.ok(eacMigration.includes(`'${slug}'`), `migration must register ${slug}`);
  }
  assert.match(eacMigration, /license_status='review_required'/);
  assert.match(eacMigration, /commercial_use_allowed=false/);
  assert.match(eacMigration, /is_active=false/);
  assert.match(eacMigration, /hold publication pending reconciliation/i);
});

