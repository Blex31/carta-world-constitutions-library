# Rwanda Constitution Import Example

## 📁 Directory Structure

```
rwanda/
├── README.md                          # This file
├── source-registration.sql           # SQL to register Rwandan legal sources
├── constitution-import-template.json # Template for import (with placeholders)
└── rwanda-constitution-import-guide.md # Complete step-by-step guide
```

## 🎯 Purpose

This directory provides a **complete, working example** of how to prepare and import the **Constitution of the Republic of Rwanda (2023 Revision)** into the CARTA database.

## 📋 Quick Start

### 1. Register the Legal Source

```bash
# Connect to your Supabase database
psql postgresql://postgres:[PASSWORD]@db.mvcirldxcuvcuqvlmqxv.supabase.co:5432/postgres

# Run the source registration SQL
\i data/import/examples/rwanda/source-registration.sql
```

### 2. Prepare the Import File

Edit `constitution-import-template.json`:
- Replace all `PLACEHOLDER` text with actual Constitution content
- Add all 176 articles (currently only first 9 are templated)
- Verify all metadata is accurate

### 3. Dry Run Import

```bash
cd /workspace/github__Blex31__carta-world-constitutions-library

export DATABASE_URL_UNPOOLED="postgres://postgres:[PASSWORD]@db.mvcirldxcuvcuqvlmqxv.supabase.co:5432/postgres"

# Dry run (validates but doesn't import)
node scripts/import-constitution-documents.mjs \
  --input data/import/examples/rwanda/constitution-import-template.json
```

### 4. Activate Source (After Legal Review)

Uncomment and run the activation section in `source-registration.sql`:

```sql
-- Activate Rwanda Law Reform Commission
UPDATE legal_sources 
SET 
  commercial_use_allowed = true,
  is_active = true,
  license_status = 'official_text_exclusion',
  metadata = jsonb_set(metadata, '{rightsReviewStatus}', '"legal_opinion_on_file"')
WHERE slug = 'rwanda-rlrc';
```

### 5. Import the Constitution

```bash
# Actual import
node scripts/import-constitution-documents.mjs \
  --input data/import/examples/rwanda/constitution-import-template.json \
  --apply
```

## 📚 Complete Guide

For detailed instructions, see:
- **[Complete Rwanda Import Guide](rwanda-constitution-import-guide.md)** - Step-by-step with all details
- **[General Import Guide](../../../docs/import-guide.md)** - Legal gates and requirements

## 🔍 Source Information

### Official Sources
- **Rwanda Law Reform Commission (RLRC)**: https://www.rlrc.gov.rw
- **Parliament of Rwanda**: https://www.parliament.gov.rw
- **WIPO Lex (Rights Basis)**: https://www.wipo.int/wipolex/en/legislation/details/22672

### Document Details
- **Jurisdiction**: Rwanda (RW)
- **Document Type**: Constitution
- **Version**: 2023 Revision
- **Publication Date**: 04/08/2023 (Official Gazette Special Issue)
- **Articles**: 176 + Preamble
- **Languages**: Kinyarwanda (official), English, French

### Rights Basis
- **Law**: Law No. 055/2024 of 20/06/2024
- **Article**: Article 282
- **Effective**: 31/07/2024
- **Exclusion**: Official legislative, administrative, and judicial texts excluded from copyright

## ✅ Checklist

Before importing, verify:

- [ ] Legal source registered in database
- [ ] Source marked as official (`is_official = true`)
- [ ] Source has commercial use allowed (`commercial_use_allowed = true`)
- [ ] Source is active (`is_active = true`)
- [ ] Rights evidence URL is HTTPS
- [ ] Rights notes are substantive (20+ chars)
- [ ] Rights review status is `legal_opinion_on_file`
- [ ] All placeholders replaced with actual text
- [ ] All 176 articles + preamble included
- [ ] Document status is `verified`
- [ ] License status is `official_text_exclusion`
- [ ] Commercial use allowed is `true`
- [ ] Dry run passes without errors

## 🛠️ Helper Scripts

### Extract Text from PDF

```bash
# Using pdftotext (requires poppler-utils)
pdftotext -layout rwanda-constitution-2023.pdf rwanda-constitution-full-text.txt

# Using Python
python3 scripts/extract-pdf-text.py rwanda-constitution-2023.pdf
```

### Generate Sections JSON

```bash
# Using Node.js
node scripts/generate-sections.js rwanda-constitution-full-text.txt
```

### Validate Import File

```bash
# Check JSON syntax
node -e "const data = require('./constitution-import-template.json'); console.log('Valid JSON');"

# Count sections
node -e "const data = require('./constitution-import-template.json'); console.log('Sections:', data.documents[0].sections.length);"
```

## 📞 Support

- **Legal Questions**: legal-team@carta.world
- **Technical Questions**: tech@carta.world
- **Documentation**: See docs/ directory

## ⚠️ Important Notes

1. **This is a template only** - You must replace all placeholders with actual content
2. **Legal review required** - Do not import until rights are confirmed
3. **Second review required** - All imports need second review sign-off
4. **Dry run first** - Always test with `--input` before using `--apply`
5. **Backup database** - Backup before importing

## 📄 Related Files

- `data/eac-source-candidates.json` - EAC source candidates (includes Rwanda)
- `data/global-constitution-collection-queue.json` - Global collection queue
- `docs/import-guide.md` - General import documentation
- `scripts/import-constitution-documents.mjs` - Import script
