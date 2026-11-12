#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const queueData = JSON.parse(await fs.readFile(path.join(projectRoot, 'data', 'global-constitution-collection-queue.json'), 'utf8'));
const eacData = JSON.parse(await fs.readFile(path.join(projectRoot, 'data', 'eac-source-candidates.json'), 'utf8'));

const africaCountries = queueData.entries
  .filter(e => e.continent === 'Africa' && e.source_discovery_status === 'official_source_candidate_identified')
  .map(e => ({ ...e, iso: e.iso_code }))
  .sort((a, b) => a.country.localeCompare(b.country));

const eacMap = new Map(eacData.jurisdictions.map(j => [j.isoCode, j]));

const outputDir = path.join(projectRoot, 'data', 'import', 'templates', 'africa');
await fs.mkdir(outputDir, { recursive: true });

function generateTemplate(countryData) {
  const { iso, country, publisher, sources, instrument } = countryData;
  const eac = eacMap.get(iso);
  const yearMatch = instrument?.match(/(\d{4})/);
  const year = yearMatch ? yearMatch[1] : null;
  const primaryUrl = sources?.[0] || '';
  const sourceSlug = `${iso.toLowerCase()}-official`;
  
  let rightsNotes = `Official constitutional text from ${publisher || 'official government source'}. Rights review required before commercial use. Verify official publisher, exact edition, commencement/effective dates, amendments, language precedence, attribution and intended reuse rights.`;
  if (eac) rightsNotes = eac.notes || rightsNotes;
  
  return {
    documents: [{
      jurisdictionIso: iso,
      sourceSlug: sourceSlug,
      docType: 'constitution',
      title: `Constitution of ${country}, ${year || 'TBD'}`,
      shortTitle: `${country} Constitution`,
      documentNumber: null,
      languageCode: 'en',
      officialUrl: primaryUrl.startsWith('http') ? primaryUrl : '',
      sourceReference: publisher || 'Official Publisher',
      adoptedAt: null,
      publishedAt: null,
      effectiveFrom: null,
      effectiveUntil: null,
      versionLabel: null,
      isCurrent: true,
      documentStatus: 'draft',
      licenseStatus: 'review_required',
      commercialUseAllowed: false,
      attributionText: `Official text from ${publisher || 'official source'}`,
      fullText: `PLACEHOLDER: Insert complete Constitution text here.\n\nDownload from: ${primaryUrl}\n\nVerify: This must be the complete, exact official text with no placeholders.`,
      sections: [
        {
          sectionNumber: 'Preamble',
          heading: 'Preamble',
          text: 'PLACEHOLDER: Insert Preamble text here',
          summary: 'The Preamble establishes the founding principles and authority of the Constitution.',
          sourceLocation: 'Preamble'
        },
        {
          sectionNumber: '1',
          heading: 'Sovereignty',
          text: 'PLACEHOLDER: Insert Article 1 text here',
          summary: 'Defines the sovereignty of the State.',
          sourceLocation: 'Article 1'
        }
      ],
      rightsEvidenceUrl: '',
      rightsNotes: rightsNotes,
      rightsReviewStatus: null,
      replacesDocumentId: null,
      logicalDocumentKey: `${iso.toLowerCase()}-constitution`,
      editor: 'legal-team@carta.world'
    }]
  };
}

function generateSourceSQL(countryData) {
  const { iso, country, publisher, sources } = countryData;
  const sourceSlug = `${iso.toLowerCase()}-official`;
  const primaryUrl = sources?.[0] || '';
  const hostname = primaryUrl ? new URL(primaryUrl).hostname : 'example.com';
  
  return `-- ${country} (${iso})
-- Publisher: ${publisher || 'Not specified'}
-- Source URL: ${primaryUrl}

INSERT INTO legal_sources (
  slug,
  name,
  publisher,
  source_type,
  jurisdiction_iso,
  source_url,
  feed_url,
  authority_rank,
  is_official,
  license_status,
  commercial_use_allowed,
  is_active,
  content_scope,
  metadata
) VALUES (
  '${sourceSlug}',
  '${country} Official Publisher',
  '${publisher || 'Official Government Publisher'}',
  'official_gazette',
  '${iso}',
  '${primaryUrl}',
  NULL,
  100,
  true,
  'review_required',
  false,
  false,
  'Official constitutional and legislative texts',
  '{
    "rightsEvidenceUrl": "",
    "rightsNotes": "Rights review required. Verify official publisher, exact edition, commencement/effective dates, amendments, language precedence, attribution and intended reuse rights for CARTA use cases: full-text web/mobile display, indexing, AI retrieval/embeddings, and offline device caching.",
    "rightsReviewStatus": "review_required",
    "allowedHosts": ["${hostname}"]
  }'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  publisher = EXCLUDED.publisher,
  source_type = EXCLUDED.source_type,
  jurisdiction_iso = EXCLUDED.jurisdiction_iso,
  source_url = EXCLUDED.source_url,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

-- Activate after legal review (uncomment when ready):
-- UPDATE legal_sources SET commercial_use_allowed = true, is_active = true, license_status = 'official_text_exclusion', metadata = jsonb_set(metadata, '{rightsReviewStatus}', '"legal_opinion_on_file"') WHERE slug = '${sourceSlug}';

`;
}

async function main() {
  console.log(`Generating templates for ${africaCountries.length} African countries...\n`);
  
  const index = {
    total: africaCountries.length,
    generatedAt: new Date().toISOString(),
    countries: []
  };
  
  for (const country of africaCountries) {
    const { iso, country: countryName } = country;
    
    const template = generateTemplate(country);
    const templatePath = path.join(outputDir, `${iso}-constitution-template.json`);
    await fs.writeFile(templatePath, JSON.stringify(template, null, 2), 'utf8');
    
    const sourceSQL = generateSourceSQL(country);
    const sqlPath = path.join(outputDir, `${iso}-source-registration.sql`);
    await fs.writeFile(sqlPath, sourceSQL, 'utf8');
    
    index.countries.push({
      iso,
      country: countryName,
      publisher: country.publisher,
      primarySource: country.sources?.[0],
      instrument: country.candidate_instrument?.substring(0, 100),
      templateFile: `${iso}-constitution-template.json`,
      sourceFile: `${iso}-source-registration.sql`
    });
    
    console.log(`  generated ${iso} - ${countryName}`);
  }
  
  await fs.writeFile(path.join(outputDir, 'index.json'), JSON.stringify(index, null, 2), 'utf8');
  
  const countryList = africaCountries.map(c => `- **${c.iso}** - ${c.country}`).join('\n');
  
  const readme = `# African Constitution Import Templates

This directory contains import templates for all ${africaCountries.length} African UN member states with identified source candidates.

## Files Generated

- Each country has a template file: \`{ISO}-constitution-template.json\`
- Each country has a source registration file: \`{ISO}-source-registration.sql\`
- Index: [index.json](index.json) - Metadata for all templates

## How to Use

### For Each Country (replace {ISO} with country code like DZ, KE, RW):

1. Register the source (run SQL file):
   \`\`\`bash
   psql -f data/import/templates/africa/{ISO}-source-registration.sql
   \`\`\`

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
   \`\`\`bash
   node scripts/import-constitution-documents.mjs --input data/import/templates/africa/{ISO}-constitution-template.json
   \`\`\`

5. Import (after legal approval):
   \`\`\`bash
   node scripts/import-constitution-documents.mjs --input data/import/templates/africa/{ISO}-constitution-template.json --apply
   \`\`\`

## Requirements Before Import

Each template must have:
- Document status changed to \`verified\`
- License status updated (official_text_exclusion, public_domain_verified, etc.)
- commercialUseAllowed set to true
- rightsEvidenceUrl filled in (HTTPS)
- rightsNotes substantive (20+ chars)
- All PLACEHOLDER text replaced
- All sections added
- Source registered and activated

## Countries Included

${countryList}

## Notes

- These are templates only - not ready for import
- Legal review required for each country
- Text extraction required from official sources
- Rights verification required before activation

## See Also

- [Import Guide](../../../docs/import-guide.md)
- [Rwanda Example](../../examples/rwanda/rwanda-constitution-import-guide.md)
- [Global Collection Queue](../../../data/global-constitution-collection-queue.json)
`;
  
  await fs.writeFile(path.join(outputDir, 'README.md'), readme, 'utf8');
  
  console.log(`\nDone! Generated ${africaCountries.length} country templates.`);
  console.log(`Output directory: ${outputDir}`);
  console.log(`Index: ${outputDir}/index.json`);
  console.log(`README: ${outputDir}/README.md`);
}

main().catch(console.error);
