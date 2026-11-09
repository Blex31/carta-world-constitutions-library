#!/usr/bin/env node
/**
 * CARTA Global Constitution Queue Auditor
 * 
 * Purpose: Validates the global constitution collection queue for data integrity.
 * 
 * Checks:
 * - Total entries = 195 (193 UN member states + 2 observers)
 * - Unique ISO codes = 195
 * - UN member states = 193
 * - Observer states = 2
 * - Africa research assignments = 54
 * - Africa source status leads = 54
 * - Source candidates identified = 115
 * - No metadata mismatches with jurisdictions.seed.json
 * - No pre-cleared or published records (queue is research assignments only)
 * - No missing EAC candidate links
 * 
 * USAGE:
 *   node scripts/audit-global-constitution-queue.mjs
 * 
 * OUTPUT: JSON report with validation results
 * 
 * EXIT CODES:
 *   0 = All checks passed
 *   1 = One or more checks failed
 * 
 * NOTE: This audits a RESEARCH QUEUE, not a legal-text corpus.
 * Queue entries are research assignments, not assertions of acquired/verified texts.
 */
import fs from 'node:fs/promises';

const [seed, queue, eac] = await Promise.all([
  fs.readFile(new URL('../data/jurisdictions.seed.json', import.meta.url), 'utf8').then(JSON.parse),
  fs.readFile(new URL('../data/global-constitution-collection-queue.json', import.meta.url), 'utf8').then(JSON.parse),
  fs.readFile(new URL('../data/eac-source-candidates.json', import.meta.url), 'utf8').then(JSON.parse),
]);
const entries = queue.entries ?? [];
const codes = entries.map((entry) => entry.iso_code);
const seedByCode = new Map(seed.map((entry) => [entry.iso_code, entry]));
const memberEntries = entries.filter((entry) => entry.membership_status === 'un_member_state');
const observers = entries.filter((entry) => entry.membership_status === 'un_non_member_observer_state');
const mismatches = entries.filter((entry) => {
  const source = seedByCode.get(entry.iso_code);
  return !source ||
    source.is_un_member !== (entry.membership_status === 'un_member_state') ||
    source.name !== entry.country ||
    source.continent !== entry.continent ||
    source.region !== entry.region;
});
const rightsRisk = entries.filter((entry) =>
  entry.commercial_use_allowed === true ||
  entry.ai_retrieval_allowed === true ||
  entry.offline_device_copy_allowed === true ||
  entry.publication_status !== 'catalogue_only' ||
  entry.full_text_acquired === true
);
const missingSourceCandidate = eac.jurisdictions.filter((item) =>
  !entries.find((entry) => entry.iso_code === item.isoCode)?.official_source_candidates.includes(item.officialSourceUrl)
);
const africaSourceStatusLeads = entries.filter((entry) =>
  entry.continent === 'Africa' &&
  entry.membership_status === 'un_member_state' &&
  entry.source_discovery_status === 'official_source_candidate_identified'
).length;
const report = {
  queueEntries: entries.length,
  uniqueCodes: new Set(codes).size,
  unMemberStates: memberEntries.length,
  observerStates: observers.length,
  sourceCandidatesIdentified: entries.filter((entry) => entry.source_discovery_status === 'official_source_candidate_identified').length,
  africaResearchAssignments: entries.filter((entry) => entry.continent === 'Africa' && entry.membership_status === 'un_member_state').length,
  africaSourceStatusLeads,
  metadataMismatches: mismatches.length,
  preClearedOrPublishedRecords: rightsRisk.length,
  eacCandidateLinksMissing: missingSourceCandidate.length,
  warning: 'This audits a research queue, not a legal-text corpus or legal clearance.',
};
console.log(JSON.stringify(report, null, 2));
if (entries.length !== 195 || new Set(codes).size !== 195 ||
    memberEntries.length !== 193 || observers.length !== 2 ||
    report.africaResearchAssignments !== 54 ||
    report.africaSourceStatusLeads !== 54 ||
    report.sourceCandidatesIdentified !== 115 ||
    mismatches.length || rightsRisk.length || missingSourceCandidate.length) {
  process.exitCode = 1;
}
