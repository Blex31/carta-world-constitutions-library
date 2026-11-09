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

test('all 54 African UN Member States have a source lead or explicit status finding without rights clearance', () => {
  const africanMembers = queue.entries.filter((entry) =>
    entry.continent === 'Africa' && entry.membership_status === 'un_member_state'
  );
  assert.equal(africanMembers.length, 54);
  assert.ok(africanMembers.every((entry) =>
    entry.source_discovery_status === 'official_source_candidate_identified'
  ));
  for (const entry of africanMembers) {
    assert.equal(entry.rights_status, 'review_required', entry.iso_code);
    assert.equal(entry.commercial_use_allowed, false, entry.iso_code);
    assert.equal(entry.publication_status, 'catalogue_only', entry.iso_code);
    assert.equal(entry.full_text_acquired, false, entry.iso_code);
  }
  const eritrea = queue.entries.find((entry) => entry.iso_code === 'ER');
  assert.match(eritrea.candidate_instrument, /never entered into force/);
  assert.equal(eritrea.currentness_status, 'not_verified');
  const guineaBissau = queue.entries.find((entry) => entry.iso_code === 'GW');
  assert.equal(guineaBissau.instrument_form, 'transitional_or_interim_instrument');
  assert.match(guineaBissau.special_review_flag, /validity_review/);
});

test('global source discovery batch covers 12 Americas, European and Oceanian jurisdictions without rights clearance', () => {
  const globalCodes = ['US','CA','MX','BR','AR','DE','FR','ES','IT','PT','AU','NZ'];
  for (const code of globalCodes) {
    const entry = queue.entries.find((item) => item.iso_code === code);
    assert.ok(entry, code);
    assert.equal(entry.source_discovery_status, 'official_source_candidate_identified', code);
    assert.equal(entry.rights_status, 'review_required', code);
    assert.equal(entry.commercial_use_allowed, false, code);
    assert.equal(entry.ai_retrieval_allowed, false, code);
    assert.equal(entry.offline_device_copy_allowed, false, code);
    assert.equal(entry.full_text_acquired, false, code);
    assert.equal(entry.publication_status, 'catalogue_only', code);
    assert.ok(entry.official_source_candidates.some((url) => url.startsWith('https://')), code);
  }
  assert.equal(queue.entries.filter((entry) => entry.source_discovery_status === 'official_source_candidate_identified').length, 66);
  assert.equal(queue.entries.find((entry) => entry.iso_code === 'CA').instrument_form, 'multiple_foundational_instruments');
  assert.equal(queue.entries.find((entry) => entry.iso_code === 'NZ').instrument_form, 'uncodified_or_unwritten');
});

test('Asian source discovery batch covers 12 jurisdictions without rights clearance', () => {
  const asiaCodes = ['IN','JP','CN','KR','PH','SG','MY','BD','NP','LK','PK','ID'];
  for (const code of asiaCodes) {
    const entry = queue.entries.find((item) => item.iso_code === code);
    assert.ok(entry, code);
    assert.equal(entry.source_discovery_status, 'official_source_candidate_identified', code);
    assert.equal(entry.rights_status, 'review_required', code);
    assert.equal(entry.commercial_use_allowed, false, code);
    assert.equal(entry.ai_retrieval_allowed, false, code);
    assert.equal(entry.offline_device_copy_allowed, false, code);
    assert.equal(entry.full_text_acquired, false, code);
    assert.equal(entry.publication_status, 'catalogue_only', code);
    assert.ok(entry.official_source_candidates.some((url) => url.startsWith('https://')), code);
  }
  assert.equal(queue.entries.filter((entry) => entry.source_discovery_status === 'official_source_candidate_identified').length, 78);
  assert.match(queue.entries.find((entry) => entry.iso_code === 'KR').version_status, /no legal or official effect/i);
  assert.match(queue.entries.find((entry) => entry.iso_code === 'BD').version_status, /proposals/i);
  assert.match(queue.entries.find((entry) => entry.iso_code === 'LK').version_status, /Twenty Second Amendment/i);
  assert.equal(queue.entries.find((entry) => entry.iso_code === 'CN').currentness_status, 'not_verified');
});
