import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

const root = new URL("../", import.meta.url);
const [seed, crosswalk] = await Promise.all([
  fs.readFile(new URL("data/jurisdictions.seed.json", root), "utf8").then(JSON.parse),
  fs.readFile(new URL("data/jurisdiction-classification-crosswalk.json", root), "utf8").then(JSON.parse),
]);

test("crosswalk covers all 250 seed records exactly once", () => {
  const seedCodes = seed.map(row => row.iso_code).sort();
  const crosswalkCodes = crosswalk.entries.map(row => row.iso_code).sort();
  assert.equal(seed.length, 250);
  assert.equal(crosswalk.entries.length, 250);
  assert.equal(new Set(crosswalkCodes).size, 250, "duplicate crosswalk codes");
  assert.deepEqual(crosswalkCodes, seedCodes);
});

test("UN member-state count and flags are exact", () => {
  const members = crosswalk.entries.filter(row => row.classification_status === "un_member_state");
  assert.equal(members.length, 193);
  assert.ok(members.every(row => row.jurisdiction_kind === "sovereign_state" && row.is_un_member === true));
});

test("non-member observer states are represented separately", () => {
  const observers = crosswalk.entries.filter(row => row.classification_status === "non_member_observer_state");
  assert.deepEqual(observers.map(row => row.iso_code).sort(), ["PS", "VA"]);
  assert.ok(observers.every(row => row.jurisdiction_kind === "sovereign_state" && row.is_un_member === false));
});

test("special-status records are not silently promoted to sovereign states", () => {
  const special = crosswalk.entries.filter(row => ["XK", "TW", "EH", "CK", "NU"].includes(row.iso_code));
  assert.equal(special.length, 5);
  assert.ok(special.every(row => row.jurisdiction_kind === "unclassified" && row.is_un_member === false));
});

test("every directory entry has geographic metadata and a recorded basis", () => {
  assert.ok(crosswalk.entries.every(row => row.continent && row.region && row.geography_basis));
});

test("seed metadata matches the crosswalk", () => {
  const byCode = new Map(crosswalk.entries.map(row => [row.iso_code, row]));
  for (const row of seed) {
    const expected = byCode.get(row.iso_code);
    assert.equal(row.jurisdiction_kind, expected.jurisdiction_kind, row.iso_code);
    assert.equal(row.is_un_member, expected.is_un_member, row.iso_code);
    assert.equal(row.continent, expected.continent, row.iso_code);
    assert.equal(row.region, expected.region, row.iso_code);
  }
});
