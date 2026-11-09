# CARTA Constitution Import Guide

## Overview

This guide explains how to import constitutional documents into the CARTA database using the `import-constitution-documents.mjs` script. This script enforces strict legal compliance gates to ensure only verified, commercially-licensed documents are imported.

## Prerequisites

### 1. Database Connection
Set one of these environment variables:
- `DATABASE_URL_UNPOOLED` (preferred for imports)
- `DATABASE_URL` (fallback)

```bash
# Example (Supabase)
export DATABASE_URL_UNPOOLED="postgres://postgres:[YOUR-PASSWORD]@db.mvcirldxcuvcuqvlmqxv.supabase.co:5432/postgres"
```

### 2. Jurisdiction Catalogue
The jurisdiction must exist in the `jurisdictions` table with a valid `iso_code`.

### 3. Legal Source Registration
The source must be registered in the `legal_sources` table with:
- `is_official = true`
- `commercial_use_allowed = true`
- `license_status` in: `['approved', 'public_domain_verified', 'open_license', 'permission_granted', 'official_text_exclusion']`
- `metadata` must contain:
  - `rightsEvidenceUrl` (HTTPS)
  - `rightsNotes` (minimum 20 characters, substantive)
  - For `official_text_exclusion`: `rightsReviewStatus = 'legal_opinion_on_file'`

## Input File Format

Create a JSON file at `data/import/constitutions.json` following this structure:

```json
{
  "documents": [
    {
      "jurisdictionIso": "KE",
      "sourceSlug": "kenya-law",
      "docType": "constitution",
      "title": "Constitution of Kenya, 2010",
      "shortTitle": "Kenya Constitution",
      "documentNumber": null,
      "languageCode": "en",
      "officialUrl": "https://www.kenyalaw.org/kl/index.php?id=398",
      "sourceReference": "Constitution of Kenya, 2010",
      "adoptedAt": "2010-08-27",
      "publishedAt": "2010-08-27",
      "effectiveFrom": "2010-08-27",
      "effectiveUntil": null,
      "versionLabel": "2010 (as amended)",
      "isCurrent": true,
      "documentStatus": "verified",
      "licenseStatus": "public_domain_verified",
      "commercialUseAllowed": true,
      "attributionText": "Reproduced with permission from Kenya Law",
      "fullText": "[COMPLETE OFFICIAL TEXT HERE]",
      "sections": [
        {
          "sectionNumber": "1",
          "heading": "Sovereignty of the People",
          "text": "All sovereign power belongs to the people of Kenya...",
          "summary": "This article establishes that all power belongs to the people.",
          "sourceLocation": "Chapter 1, Article 1"
        }
      ],
      "rightsEvidenceUrl": "https://www.kenyalaw.org/terms-of-use",
      "rightsNotes": "Kenya Law terms explicitly permit reproduction for non-commercial and commercial purposes with attribution. The Constitution of Kenya, 2010 is a public document as per Section 5 of the Kenya Information and Communications Act, 1998.",
      "rightsReviewStatus": null,
      "replacesDocumentId": null,
      "logicalDocumentKey": "kenya-constitution-2010",
      "editor": "legal-team@carta.world"
    }
  ]
}
```

## Required Fields

### Document-Level Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `jurisdictionIso` | string | 2-3 letter ISO jurisdiction code | `"KE"` |
| `sourceSlug` | string | Slug of registered legal source | `"kenya-law"` |
| `docType` | string | Document type | `"constitution"` |
| `title` | string | Full document title | `"Constitution of Kenya, 2010"` |
| `fullText` | string | Complete official text (no placeholders) | Full constitution text |
| `officialUrl` | string | HTTPS URL to official source | `"https://..."` |
| `documentStatus` | string | Must be `"verified"` | `"verified"` |
| `licenseStatus` | string | Approved license type | `"public_domain_verified"` |
| `commercialUseAllowed` | boolean | Must be `true` | `true` |
| `rightsEvidenceUrl` | string | HTTPS URL to rights evidence | `"https://.../terms"` |
| `rightsNotes` | string | Substantive rights justification (min 20 chars) | Detailed explanation |
| `sections` | array | Non-empty array of provisions | `[{...}]` |

### Section-Level Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `text` | string | Full section text | `"All sovereign power..."` |

### Optional but Recommended Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `shortTitle` | string | Shortened title | `"Kenya Constitution"` |
| `documentNumber` | string | Official document number | `"No. 2 of 2010"` |
| `languageCode` | string | ISO 639-1 language code | `"en"` |
| `sourceReference` | string | Citation reference | `"Constitution of Kenya, 2010"` |
| `adoptedAt` | string | ISO date (YYYY-MM-DD) | `"2010-08-27"` |
| `publishedAt` | string | ISO date (YYYY-MM-DD) | `"2010-08-27"` |
| `effectiveFrom` | string | ISO date (YYYY-MM-DD) | `"2010-08-27"` |
| `effectiveUntil` | string | ISO date (YYYY-MM-DD) | `null` |
| `versionLabel` | string | Version identifier | `"2010 (as amended to 2023)"` |
| `isCurrent` | boolean | Is this the current version? | `true` |
| `replacesDocumentId` | string | ID of document this supersedes | `null` |
| `logicalDocumentKey` | string | Unique key for logical document | `"kenya-constitution-2010"` |
| `editor` | string | Editor/approver identifier | `"legal-team@carta.world"` |

### Section Optional Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `sectionNumber` | string | Section/Article number | `"1"` |
| `heading` | string | Section heading | `"Sovereignty of the People"` |
| `summary` | string | Plain language summary | `"All power belongs to the people"` |
| `sourceLocation` | string | Location in source document | `"Chapter 1, Article 1"` |

## Legal Compliance Gates

The import script enforces these gates in order:

### Gate 1: File Validation
- Input file must exist and be valid JSON
- Must contain non-empty `documents` array

### Gate 2: Document Structure Validation
- All required fields must be present
- No placeholder text allowed (checked against: `paste the`, `example only`, `replace with`, `placeholder`, `lorem ipsum`)
- `jurisdictionIso` must be 2-3 uppercase letters
- `sourceSlug` must be valid slug format
- `docType` must be valid type
- `officialUrl` must start with `https://`
- `documentStatus` must be `"verified"`
- `licenseStatus` must be in approved list
- `commercialUseAllowed` must be `true`
- `rightsEvidenceUrl` must start with `https://`
- `rightsNotes` must be at least 20 characters
- `sections` must be non-empty array
- All dates must be ISO format (YYYY-MM-DD)

### Gate 3: Source Validation
- Source slug must exist in `legal_sources` table
- Source must have `is_official = true`
- Source `license_status` must be in approved list
- Source `commercial_use_allowed` must be `true`
- Source metadata must contain:
  - `rightsEvidenceUrl` starting with `https://`
  - `rightsNotes` with at least 20 characters
- If source uses `official_text_exclusion`:
  - Source metadata must have `rightsReviewStatus = 'legal_opinion_on_file'`
  - Document must have `rightsReviewStatus = 'legal_opinion_on_file'`

### Gate 4: Jurisdiction Validation
- Jurisdiction ISO code must exist in `jurisdictions` table

### Gate 5: Content Validation
- Full text must not contain placeholder patterns
- All section texts must be non-empty

## Usage

### Dry Run (Recommended First)

```bash
# Validate without importing
node scripts/import-constitution-documents.mjs

# With custom input file
node scripts/import-constitution-documents.mjs --input data/import/my-constitutions.json
```

### Actual Import

```bash
# After dry run passes, use --apply to import
node scripts/import-constitution-documents.mjs --apply

# With custom input file
node scripts/import-constitution-documents.mjs --input data/import/kenya.json --apply
```

## What the Script Does

1. **Validates** all documents against legal gates
2. **Checks** source and jurisdiction records
3. **Computes** SHA-256 hash of full text for deduplication
4. **Inserts/Updates** documents in `legal_documents` table
5. **Manages** document versions:
   - If `isCurrent = true` and `docType = 'constitution'`: Marks previous current constitutions for same jurisdiction/language as superseded
   - If `replacesDocumentId` is set: Marks replaced document as superseded
6. **Creates** sections in `document_sections` table
7. **Chunks** sections into searchable chunks (420 words max, 55 word overlap)
8. **Inserts** chunks into `document_chunks` table
9. **Updates** jurisdiction `constitution_status`
10. **Commits** transaction (all or nothing)

## Chunking Algorithm

The script automatically chunks section text for search:
- Max words per chunk: 420
- Overlap between chunks: 55 words
- Each chunk is stored with:
  - Document ID
  - Section ID
  - Chunk index
  - Language code
  - Heading
  - Content
  - Token count
  - Metadata (source location)

## Error Handling

If any validation fails:
- Script exits with code 1
- Error message describes the specific failure
- No data is written to the database

If database operation fails:
- Transaction is rolled back
- Error is logged
- No partial imports occur

## Post-Import Verification

After successful import:

1. **Check database**:
   ```sql
   SELECT COUNT(*) FROM legal_documents WHERE document_status = 'verified';
   SELECT COUNT(*) FROM document_sections;
   SELECT COUNT(*) FROM document_chunks;
   ```

2. **Verify jurisdiction status**:
   ```sql
   SELECT iso_code, constitution_status FROM jurisdictions WHERE iso_code = 'KE';
   ```

3. **Test search**:
   ```sql
   SELECT * FROM document_chunks WHERE search_vector @@ to_tsquery('english', 'sovereign');
   ```

## Example: Importing Kenya Constitution

### Step 1: Register Source

```sql
INSERT INTO legal_sources (
  slug, name, publisher, source_type, jurisdiction_iso,
  source_url, is_official, license_status, commercial_use_allowed,
  is_active, metadata
) VALUES (
  'kenya-law',
  'Kenya Law',
  'National Council for Law Reporting',
  'official_gazette',
  'KE',
  'https://www.kenyalaw.org',
  true,
  'public_domain_verified',
  true,
  true,
  '{"rightsEvidenceUrl": "https://www.kenyalaw.org/terms-of-use", "rightsNotes": "Kenya Law terms permit reproduction for commercial and non-commercial purposes with attribution. Constitutional texts are public documents.", "rightsReviewStatus": null, "allowedHosts": ["www.kenyalaw.org"]}'
);
```

### Step 2: Prepare Input File

Create `data/import/kenya-constitution.json` with the full document.

### Step 3: Dry Run

```bash
DATABASE_URL_UNPOOLED=postgres://... node scripts/import-constitution-documents.mjs --input data/import/kenya-constitution.json
```

### Step 4: Import

```bash
DATABASE_URL_UNPOOLED=postgres://... node scripts/import-constitution-documents.mjs --input data/import/kenya-constitution.json --apply
```

## Troubleshooting

### Common Errors

**Error**: `Unknown source slug: kenya-law`
**Solution**: Register the source in `legal_sources` table first

**Error**: `kenya-law is not marked as an official publisher`
**Solution**: Update source to set `is_official = true`

**Error**: `kenya-law is not cleared for commercial reuse`
**Solution**: Update source to set `commercial_use_allowed = true` and valid `license_status`

**Error**: `Jurisdiction KE is not in the jurisdiction catalogue`
**Solution**: Ensure jurisdiction exists in `jurisdictions` table

**Error**: `contains placeholder text`
**Solution**: Remove all placeholder text from fullText and sections

**Error**: `needs an HTTPS rightsEvidenceUrl and at least 20 characters of rightsNotes`
**Solution**: Provide valid HTTPS URL and substantive rights notes

### Debugging

Add `console.log` statements to the script for debugging, or use:

```bash
# Show more detail
node --inspect scripts/import-constitution-documents.mjs
```

## Best Practices

1. **Start with one document**: Test import with a single document first
2. **Use dry run**: Always run without `--apply` first
3. **Validate source first**: Ensure source record is complete before importing
4. **Check jurisdiction**: Verify jurisdiction exists in catalogue
5. **Small batches**: Import documents in small batches (5-10 at a time)
6. **Verify after import**: Check database to confirm successful import
7. **Backup first**: Backup database before large imports
8. **Test search**: Verify imported documents are searchable

## Legal Review Checklist

Before importing any document, verify:

- [ ] Document is from official publisher
- [ ] Document is complete (no omissions)
- [ ] Document version is current
- [ ] Adoption/effective dates are correct
- [ ] Source URL is official and HTTPS
- [ ] License status is approved
- [ ] Commercial reuse is explicitly allowed
- [ ] Rights evidence URL is valid HTTPS
- [ ] Rights notes are substantive (20+ chars)
- [ ] For official_text_exclusion: Legal opinion is on file
- [ ] All placeholder text removed
- [ ] Sections are properly structured
- [ ] Text is accurate copy of official source

## See Also

- [Constitution Ingestion Documentation](constitution-ingestion.md)
- [Global Constitution Collection Plan](global-constitution-collection-plan.md)
- [Import Playbook](import-playbook.md)
- [Legal AI Policy](legal-ai.md)
