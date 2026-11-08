# CARTA jurisdiction classification

**Prepared:** 8 November 2026  
**Status:** Proposed metadata crosswalk; apply through the versioned migration and review remaining special-status entries before claiming complete legal-jurisdiction classification.

## Scope

The live CARTA directory contains 250 ISO-style country/area records. The previous directory had only eight records classified as UN member sovereign states; 242 were still marked `unclassified`.

This crosswalk separates three things that must not be conflated:

1. **Identifier:** the ISO alpha-2 code used to identify a country or area record.
2. **Membership:** whether the entity is one of the 193 current UN Member States.
3. **Geography:** the continent and sub-region used to organise the directory.

The UN M49 standard is the geographic source. It explicitly says its groupings are for statistical convenience and do not imply political or other affiliation or legal status. UN membership is checked separately from the UN membership list. The two non-member observer states are Holy See and State of Palestine.

## Proposed result

| Classification | Count | Treatment |
|---|---:|---|
| UN Member States | 193 | `sovereign_state`, `is_un_member=true` |
| Non-member observer states | 2 | `sovereign_state`, `is_un_member=false` |
| Other country/area records | 55 | Remain `unclassified`, `is_un_member=false` pending status review |
| Total directory records | 250 | Complete continent and region mapping |

The 55 unresolved area records are not all necessarily equivalent. They include dependencies, territories, special administrative areas, associated states, disputed-status records, and other ISO area entries. CARTA deliberately does not collapse those statuses into `territory` or `dependent_area` without a separate review.

### Special-status records explicitly flagged

- **VA — Holy See:** non-member observer state.
- **PS — State of Palestine:** non-member observer state.
- **XK — Kosovo:** remains unclassified; user-assigned code, not an official ISO alpha-2 code; geography is a manual Europe / Southern Europe placement only.
- **TW — Taiwan:** remains unclassified; manually placed in Asia / East Asia for directory navigation only.
- **EH — Western Sahara:** remains unclassified; M49 geography is North Africa and does not determine sovereignty.
- **CK — Cook Islands** and **NU — Niue:** remain unclassified pending review of their free-association and international legal status.

## Geography method

The crosswalk follows UN M49 regions and normalises sub-region labels to the names already used in CARTA (for example, Eastern Africa becomes East Africa). The region groups are:

- Africa: North, East, Central, Southern and West Africa.
- Americas: Caribbean, Central America, South America and North America.
- Asia: Central, East, Southeast, South and West Asia.
- Europe: Eastern, Northern, Southern and Western Europe.
- Oceania: Australia and New Zealand, Melanesia, Micronesia and Polynesia.
- Antarctica: Antarctica.

Kosovo and Taiwan have manual geographic placements because they are not separate rows in the M49 table used for this crosswalk. These placements do not express recognition or sovereignty.

## Implementation

- `data/jurisdiction-classification-crosswalk.json` is the reviewed mapping and records the basis and status of every row.
- `data/jurisdictions.seed.json` now carries the derived kind, membership flag and geographic metadata for reproducible seed/audit use.
- `supabase/migrations/20261108120000_classify_global_jurisdiction_catalogue.sql` applies the mapping to the database.
- `tests/jurisdiction-crosswalk.test.mjs` checks coverage, uniqueness, counts, observer states, special-status records and geography completeness.

The migration is additive to the migration history. It does not change `constitution_status`, legal documents, publisher records, rights approvals, or user data. It is not a legal-text import and does not activate any source.

## Remaining review

The 55 non-member country/area records should be reviewed and assigned a precise `territory`, `dependent_area`, or other supported CARTA type only when the legal/governance basis is clear. Consider adding a more expressive status field before attempting to represent associated states and disputed entities. Do not describe the resulting 250 rows as 250 countries.

The crosswalk does not establish constitutional status, identify a constitution in force, or grant rights to reproduce any legal text. Those checks remain separate per-document publication gates.

## Sources

- UN Statistics Division, [Standard Country or Area Codes for Statistical Use (M49)](https://unstats.un.org/unsd/methodology/m49/overview) — alpha-2 codes and geographic regions; disclaimer that regional groupings do not imply political affiliation or legal status.
- UN Research Guide, [UN Membership](https://research.un.org/en/unmembers/intro) — 193 current Member States.
- UN Research Guide, [Non-Member Observer States](https://research.un.org/en/unmembers/observers) — Holy See and State of Palestine.
- ISO, [Country Codes](https://www.iso.org/iso-3166-country-codes.html) — context for ISO 3166 country/area identifiers.

**Publication rule:** directory metadata is not a constitution collection. A document remains unavailable until its exact text, authoritative source, currentness and intended reuse rights pass CARTA's separate legal-content release gate.
