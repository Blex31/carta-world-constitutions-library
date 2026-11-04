#!/usr/bin/env node
import fs from 'node:fs/promises';
const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!databaseUrl) {
  if (process.argv.includes("--require-database")) {
    console.error("Set DATABASE_URL_UNPOOLED (preferred) or DATABASE_URL to run the live database audit.");
    process.exit(1);
  }
  const [jurisdictions, sourceMap] = await Promise.all([
    fs.readFile(new URL("../data/jurisdictions.seed.json", import.meta.url), "utf8").then(JSON.parse),
    fs.readFile(new URL("../data/eac-source-candidates.json", import.meta.url), "utf8").then(JSON.parse),
  ]);
  const candidates = sourceMap.jurisdictions ?? [];
  const report = {
    mode: "checked-in-metadata-only",
    seedJurisdictions: jurisdictions.length,
    eacPartnerStateCandidates: candidates.length,
    eacCandidatesWithRightsEvidence: candidates.filter(x => Boolean(x.rightsEvidenceUrl)).length,
    eacCandidatesClearedForCommercialUse: candidates.filter(x => ["approved", "public_domain_verified", "open_license", "permission_granted", "official_text_exclusion"].includes(x.rightsStatus)).length,
    databaseCoverage: "not_checked_without_DATABASE_URL",
    publicationWarning: "This is a static catalogue audit, not a live database or legal-text coverage audit.",
    generatedAt: new Date().toISOString(),
  };
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}
const { Pool } = await import("pg");
const output = process.argv.includes('--csv') ? 'csv' : 'json';
const pool = new Pool({ connectionString: databaseUrl, max: 2, connectionTimeoutMillis: 10000 });

function csvCell(value) {
  const text = value == null ? '' : Array.isArray(value) ? value.join('; ') : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

try {
  const result = await pool.query(`
    select
      j.iso_code,
      j.name,
      j.jurisdiction_kind,
      j.is_un_member,
      j.constitution_status,
      count(distinct d.id) filter (
        where d.doc_type='constitution' and d.is_current=true
          and d.document_status='verified'
          and (d.effective_from is null or d.effective_from <= current_date)
          and (d.effective_until is null or d.effective_until >= current_date)
          and d.license_status in ('approved','public_domain_verified','open_license','permission_granted','official_text_exclusion')
          and d.commercial_use_allowed=true
      )::int as verified_current_constitutions,
      count(distinct d.id) filter (where d.doc_type='constitution')::int as constitution_versions,
      count(distinct s.id) filter (where s.is_official=true)::int as official_sources,
      count(distinct s.id) filter (where s.is_active=true and s.feed_url is not null)::int as active_feeds,
      count(distinct s.id) filter (where s.license_status in ('approved','public_domain_verified','open_license','permission_granted','official_text_exclusion') and s.commercial_use_allowed=true)::int as commercially_cleared_sources,
      coalesce(array_agg(distinct s.slug) filter (where s.id is not null), '{}') as source_slugs
    from jurisdictions j
    left join legal_documents d on d.jurisdiction_iso=j.iso_code
    left join legal_sources s on s.jurisdiction_iso=j.iso_code
    where j.is_active=true
    group by j.iso_code,j.name,j.jurisdiction_kind,j.is_un_member,j.constitution_status
    order by j.name
  `);
  const summary = {
    jurisdictions: result.rowCount,
    withVerifiedCurrentConstitution: result.rows.filter(row => row.verified_current_constitutions > 0).length,
    metadataOnlyOrNeedsReview: result.rows.filter(row => row.verified_current_constitutions === 0).length,
    withOfficialSource: result.rows.filter(row => row.official_sources > 0).length,
    generatedAt: new Date().toISOString(),
  };
  if (output === 'csv') {
    const headers = Object.keys(result.rows[0] || {});
    const lines = [headers.map(csvCell).join(','), ...result.rows.map(row => headers.map(key => csvCell(row[key])).join(','))];
    await fs.writeFile('carta-coverage-report.csv', lines.join('\n') + '\n');
    console.log(JSON.stringify({ ...summary, file: 'carta-coverage-report.csv' }, null, 2));
  } else {
    console.log(JSON.stringify({ summary, jurisdictions: result.rows }, null, 2));
  }
} catch (error) {
  console.error('Coverage audit failed:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
