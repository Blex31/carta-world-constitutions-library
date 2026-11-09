import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const read = (path) => fs.readFile(new URL(`../${path}`, import.meta.url), 'utf8').then(JSON.parse);
const [seed, queue, eac] = await Promise.all([
  read('data/jurisdictions.seed.json'),
  read('data/global-constitution-collection-queue.json'),
  read('data/eac-source-candidates.json'),
]);

test('global queue covers all 193 UN members and two observer states exactly once', () => {
  const entries = queue.entries;
  assert.equal(entries.length, 195);
  assert.equal(new Set(entries.map((x) => x.iso_code)).size, 195);
  assert.equal(entries.filter((x) => x.membership_status === 'un_member_state').length, 193);
  assert.deepEqual(
    entries.filter((x) => x.membership_status === 'un_non_member_observer_state').map((x) => x.iso_code).sort(),
    ['PS', 'VA'],
  );
});

test('collection assignments match the checked-in directory geography', () => {
  const seedByCode = new Map(seed.map((x) => [x.iso_code, x]));
  for (const entry of queue.entries) {
    const row = seedByCode.get(entry.iso_code);
    assert.ok(row, entry.iso_code);
    assert.equal(entry.country, row.name, entry.iso_code);
    assert.equal(entry.continent, row.continent, entry.iso_code);
    assert.equal(entry.region, row.region, entry.iso_code);
    assert.equal(entry.membership_status === 'un_member_state', row.is_un_member, entry.iso_code);
  }
});

test('no queued jurisdiction is falsely marked acquired, commercially cleared or published', () => {
  for (const entry of queue.entries) {
    assert.equal(entry.full_text_acquired, false, entry.iso_code);
    assert.equal(entry.commercial_use_allowed, false, entry.iso_code);
    assert.equal(entry.ai_retrieval_allowed, false, entry.iso_code);
    assert.equal(entry.offline_device_copy_allowed, false, entry.iso_code);
    assert.equal(entry.publication_status, 'catalogue_only', entry.iso_code);
    assert.equal(entry.currentness_status, 'not_verified', entry.iso_code);
    assert.ok(['not_reviewed', 'review_required'].includes(entry.rights_status), entry.iso_code);
  }
});

test('existing eight EAC research leads carry through without receiving reuse approval', () => {
  const byCode = new Map(queue.entries.map((x) => [x.iso_code, x]));
  for (const item of eac.jurisdictions) {
    const entry = byCode.get(item.isoCode);
    assert.ok(entry, item.isoCode);
    assert.equal(entry.source_discovery_status, 'official_source_candidate_identified');
    assert.ok(entry.official_source_candidates.includes(item.officialSourceUrl));
    assert.equal(entry.rights_status, 'review_required');
    assert.equal(entry.commercial_use_allowed, false);
  }
});

test('non-member ISO country/area rows are not silently added to the global member/observer denominator', () => {
  const queueCodes = new Set(queue.entries.map((x) => x.iso_code));
  const otherAreas = seed.filter((x) => !x.is_un_member && !['VA', 'PS'].includes(x.iso_code));
  assert.equal(otherAreas.length, 55);
  assert.ok(otherAreas.every((x) => !queueCodes.has(x.iso_code)));
});
