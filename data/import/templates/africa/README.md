# African Constitution Import Templates

This directory contains import templates for all 54 African UN member states with identified source candidates.

## Files Generated

- Each country has a template file: `{ISO}-constitution-template.json`
- Each country has a source registration file: `{ISO}-source-registration.sql`
- Index: [index.json](index.json) - Metadata for all templates

## How to Use

### For Each Country (replace {ISO} with country code like DZ, KE, RW):

1. Register the source (run SQL file):
   ```bash
   psql -f data/import/templates/africa/{ISO}-source-registration.sql
   ```

2. Populate the template:
   - Download constitution from the official URL
   - Extract full text
   - Replace all PLACEHOLDER text
   - Add all articles/sections
   - Fill in metadata (dates, version, etc.)

3. Legal review:
   - Verify rights basis
   - Confirm commercial use allowed
   - Obtain legal opinion if needed
   - Update source to enable commercial use

4. Dry run import:
   ```bash
   node scripts/import-constitution-documents.mjs --input data/import/templates/africa/{ISO}-constitution-template.json
   ```

5. Import (after legal approval):
   ```bash
   node scripts/import-constitution-documents.mjs --input data/import/templates/africa/{ISO}-constitution-template.json --apply
   ```

## Requirements Before Import

Each template must have:
- Document status changed to `verified`
- License status updated (official_text_exclusion, public_domain_verified, etc.)
- commercialUseAllowed set to true
- rightsEvidenceUrl filled in (HTTPS)
- rightsNotes substantive (20+ chars)
- All PLACEHOLDER text replaced
- All sections added
- Source registered and activated

## Countries Included

- **DZ** - Algeria
- **AO** - Angola
- **BJ** - Benin
- **BW** - Botswana
- **BF** - Burkina Faso
- **BI** - Burundi
- **CV** - Cabo Verde
- **CM** - Cameroon
- **CF** - Central African Republic
- **TD** - Chad
- **KM** - Comoros
- **CG** - Congo
- **CD** - Congo, The Democratic Republic of the
- **CI** - Côte d'Ivoire
- **DJ** - Djibouti
- **EG** - Egypt
- **GQ** - Equatorial Guinea
- **ER** - Eritrea
- **SZ** - Eswatini
- **ET** - Ethiopia
- **GA** - Gabon
- **GM** - Gambia
- **GH** - Ghana
- **GN** - Guinea
- **GW** - Guinea-Bissau
- **KE** - Kenya
- **LS** - Lesotho
- **LR** - Liberia
- **LY** - Libya
- **MG** - Madagascar
- **MW** - Malawi
- **ML** - Mali
- **MR** - Mauritania
- **MU** - Mauritius
- **MA** - Morocco
- **MZ** - Mozambique
- **NA** - Namibia
- **NE** - Niger
- **NG** - Nigeria
- **RW** - Rwanda
- **ST** - Sao Tome and Principe
- **SN** - Senegal
- **SC** - Seychelles
- **SL** - Sierra Leone
- **SO** - Somalia
- **ZA** - South Africa
- **SS** - South Sudan
- **SD** - Sudan
- **TZ** - Tanzania, United Republic of
- **TG** - Togo
- **TN** - Tunisia
- **UG** - Uganda
- **ZM** - Zambia
- **ZW** - Zimbabwe

## Notes

- These are templates only - not ready for import
- Legal review required for each country
- Text extraction required from official sources
- Rights verification required before activation

## See Also

- [Import Guide](../../../docs/import-guide.md)
- [Rwanda Example](../../examples/rwanda/rwanda-constitution-import-guide.md)
- [Global Collection Queue](../../../data/global-constitution-collection-queue.json)
