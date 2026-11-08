#!/usr/bin/env node
// CARTA import readiness report.
// Read-only: reports, per jurisdiction, whether the rights-gated import preconditions
// from scripts/import-constitution-documents.mjs are satisfied. Never writes to the database.
import pg from 'pg';

const { Pool } = pg;
const args = process.argv.slice(2);
const focusIndex = args.indexOf('--jurisdiction');
const focus = focusIndex >= 0 && args[focusIndex + 1] ? args[focusIndex + 1].toUpperCase() : null;
const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('Set DATABASE_URL_UNPOOLED (preferred) or DATABASE_URL to run the readiness report.');
  process.exit(1);
}

const validLicenses = new Set(['approved', 'public_domain_verified', 'open_license', 'permission_granted', 'official_text_exclusion']);

const pool = new Pool({ connectionString: databaseUrl, max: 2, connectionTimeoutMillis: 10000 });
try {
  const jurisdictions = await pool.query('select iso_code, name, constitution_status from jurisdictions order by iso_code');
  const sources = await pool.query('select slug, jurisdiction_iso, is_official, is_active, license_status, commercial_use_allowed, metadata from legal_sources order by slug');
  const verifiedDocs = await pool.query("select jurisdiction_iso, count(*)::int as n from legal_documents where document_status='verified' group by jurisdiction_iso");
  const verifiedByIso = new Map(verifiedDocs.rows.map((r) => [r.jurisdiction_iso, r.n]));

  const sourceBlockers = (row) => {
    const blockers = [];
    if (!row.is_official) blockers.push('not marked as an official publisher');
    if (!validLicenses.has(row.license_status)) blockers.push(`license_status=${row.license_status}`);
    if (row.commercial_use_allowed !== true) blockers.push('commercial reuse not cleared');
    const evidence = row.metadata?.rightsEvidenceUrl;
    if (!evidence || !/^https:\/\//.test(evidence)) blockers.push('missing HTTPS rights evidence URL');
    const notes = (row.metadata?.rightsNotes || '').trim();
    if (notes.length < 20) blockers.push('rights notes missing or under 20 characters');
    if (row.license_status === 'official_text_exclusion' && row.metadata?.rightsReviewStatus !== 'legal_opinion_on_file') {
      blockers.push('official-text exclusion without a documented legal opinion');
    }
    return blockers;
  };

  const rows = jurisdictions.rows.map((j) => {
    const jurisdictionSources = sources.rows.filter((s) => s.jurisdiction_iso === j.iso_code);
    const officialSources = jurisdictionSources.filter((s) => s.is_official);
    const cleared = officialSources.filter((s) => sourceBlockers(s).length === 0);
    const blockers = [...new Set(officialSources.flatMap(sourceBlockers))];
    return {
      iso: j.iso_code,
      name: j.name,
      status: j.constitution_status,
      verified: verifiedByIso.get(j.iso_code) || 0,
      sources: jurisdictionSources.length,
      official: officialSources.length,
      cleared: cleared.length,
      ready: cleared.length > 0,
      blockers,
    };
  });

  const visible = focus ? rows.filter((r) => r.iso === focus) : rows;
  if (!visible.length) {
    console.error(focus ? `Jurisdiction ${focus} is not in the catalogue.` : 'No jurisdictions found.');
    process.exitCode = 1;
  }

  const pad = (s, n) => String(s).slice(0, n).padEnd(n);
  console.log(`\nCARTA import readiness report${focus ? ` — ${focus}` : ''}`);
  console.log('Rights-gated: a jurisdiction is READY only when an official publisher source is cleared');
  console.log('for commercial reuse with recorded evidence and substantive rights notes.\n');
  console.log(`${pad('ISO', 4)}${pad('Jurisdiction', 28)}${pad('Constitution status', 20)}${pad('Verified docs', 14)}${pad('Official sources', 17)}Ready`);
  console.log('-'.repeat(100));
  for (const r of visible) {
    console.log(`${pad(r.iso, 4)}${pad(r.name, 28)}${pad(r.status.replaceAll('_', ' '), 20)}${pad(r.verified, 14)}${pad(`${r.cleared}/${r.official}`, 17)}${r.ready ? 'YES' : 'no'}`);
  }

  const ready = visible.filter((r) => r.ready);
  const blocked = visible.filter((r) => !r.ready);
  console.log(`\nReady for rights-cleared import: ${ready.length}`);
  if (blocked.length && !focus) {
    console.log(`Still gated (official source, rights, or evidence missing): ${blocked.length}`);
  }
  for (const r of blocked.slice(0, focus ? 50 : 0)) {
    console.log(`\nBlockers for ${r.iso} — ${r.name}:`);
    for (const b of r.blockers) console.log(`  - ${b}`);
  }

  if (focus) {
    const r = visible[0];
    if (r && !r.ready) {
      console.log(`\n${focus} is NOT ready to import. Resolve the blockers above before running`);
      console.log('scripts/import-constitution-documents.mjs --apply.');
      process.exitCode = 1;
    } else if (r) {
      console.log(`\n${focus} is READY: run scripts/import-constitution-documents.mjs (dry run first, then --apply).`);
    }
  }
} catch (error) {
  console.error(`Readiness report failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await pool.end();
}
