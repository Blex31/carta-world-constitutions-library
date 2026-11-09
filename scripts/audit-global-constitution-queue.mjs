#!/usr/bin/env node
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
const report = {
  queueEntries: entries.length,
  uniqueCodes: new Set(codes).size,
  unMemberStates: memberEntries.length,
  observerStates: observers.length,
  sourceCandidatesIdentified: entries.filter((entry) => entry.source_discovery_status === 'official_source_candidate_identified').length,
  africaResearchAssignments: entries.filter((entry) => entry.continent === 'Africa').length,
  metadataMismatches: mismatches.length,
  preClearedOrPublishedRecords: rightsRisk.length,
  eacCandidateLinksMissing: missingSourceCandidate.length,
  warning: 'This audits a research queue, not a legal-text corpus or legal clearance.',
};
console.log(JSON.stringify(report, null, 2));
if (entries.length !== 195 || new Set(codes).size !== 195 ||
    memberEntries.length !== 193 || observers.length !== 2 ||
    report.sourceCandidatesIdentified !== 54 ||
    mismatches.length || rightsRisk.length || missingSourceCandidate.length) {
  process.exitCode = 1;
}
