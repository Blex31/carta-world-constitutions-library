# Rwanda Constitution Import Example

## Overview

This guide provides a **complete, step-by-step example** of how to prepare the **Constitution of the Republic of Rwanda (2023 revision)** for import into CARTA. This example uses real data from the EAC source candidates and demonstrates all the legal compliance requirements.

**Status**: This is a **template/example only**. The actual import requires:
1. Legal review and approval
2. Verification of current consolidated text
3. Confirmation of rights basis
4. Second review sign-off

## Why Rwanda?

Rwanda is an excellent candidate because:
- ✅ **Official sources identified**: RLRC (Rwanda Law Reform Commission) and Parliament
- ✅ **Rights evidence available**: WIPO Lex reference + Law No. 055/2024, Article 282
- ✅ **Clear legal basis**: Official legislative texts excluded from copyright in Rwanda
- ✅ **Multiple official copies**: Trilingual (Kinyarwanda, English, French)
- ✅ **Recent consolidation**: 2023 revision published in Official Gazette

## Step 1: Register the Legal Source

Before importing any document, the source must be registered in the `legal_sources` table.

### Source Registration SQL

```sql
-- Register Rwanda Law Reform Commission as official source
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
  'rwanda-rlrc',
  'Rwanda Law Reform Commission',
  'Ministry of Justice / Rwanda Law Reform Commission',
  'official_gazette',
  'RW',
  'https://www.rlrc.gov.rw',
  NULL,  -- No feed available yet
  100,    -- Highest authority rank
  true,   -- Official publisher
  'official_text_exclusion',  -- Excluded from copyright
  false,  -- Will be set to true after rights review
  false,  -- Will be set to true after activation
  'Official legislative texts and consolidated laws of Rwanda',
  '{
    "rightsEvidenceUrl": "https://www.wipo.int/wipolex/en/legislation/details/22672",
    "rightsNotes": "Law No. 055/2024 of 20/06/2024, Article 282 (published and effective 31/07/2024) excludes official legislative, administrative and judicial texts and official translations from copyright protection. This statutory exclusion applies to the Constitution as an official legislative text. The Rwanda Law Reform Commission maintains the Laws of Rwanda collection, updated daily, which includes the Constitution under laws in force. Both RLRC and Parliament host the trilingual (Kinyarwanda, English, French) Official Gazette text. Local counsel must confirm this exclusion covers CARTA\'s intended uses: full-text web/mobile display, indexing, AI retrieval/embeddings, and offline device caching.",
    "rightsReviewStatus": "counsel_and_publisher_confirmation_pending",
    "allowedHosts": ["www.rlrc.gov.rw", "parliament.gov.rw"],
    "languagePrecedenceRule": "Constitution Article 96(4): where a law\'s Official Gazette language versions conflict, the language in which that law was adopted prevails. Confirm adoption language of the 2023 constitutional revision with RLRC/counsel.",
    "adoptionLanguage": "Kinyarwanda",
    "officialLanguages": ["Kinyarwanda", "English", "French"],
    "consolidationStatus": "2023 revision, Official Gazette n° Special of 04/08/2023",
    "amendmentHistory": "Original 2003 Constitution, revised 2015, 2023 revision",
    "lastVerified": "2026-11-09",
    "verificationNotes": "RLRC Laws of Rwanda collection updated daily. Parliament-hosted copy matches RLRC text. No later constitutional amendments found in 2024-2026 Gazette search. Publisher confirmation and legal review still required before marking as verified."
  }'
);

-- Register Parliament of Rwanda as secondary source
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
  'rwanda-parliament',
  'Parliament of Rwanda',
  'Parliament of the Republic of Rwanda',
  'legislative_body',
  'RW',
  'https://www.parliament.gov.rw',
  NULL,
  90,
  true,
  'official_text_exclusion',
  false,
  false,
  'Official constitutional and legislative texts',
  '{
    "rightsEvidenceUrl": "https://www.wipo.int/wipolex/en/legislation/details/22672",
    "rightsNotes": "Parliament hosts the Official Gazette copy of the Constitution. Law No. 055/2024, Article 282 excludes official legislative texts from copyright. Parliament copy matches RLRC version. Same rights basis applies as RLRC source.",
    "rightsReviewStatus": "counsel_and_publisher_confirmation_pending",
    "allowedHosts": ["www.parliament.gov.rw"],
    "consolidationStatus": "2023 revision, matches RLRC text"
  }'
);
```

### After Legal Review (Update Source)

Once legal review is complete and rights are confirmed:

```sql
-- Activate the source and enable commercial use
UPDATE legal_sources 
SET 
  commercial_use_allowed = true,
  is_active = true,
  license_status = 'official_text_exclusion',
  metadata = jsonb_set(
    metadata,
    '{rightsReviewStatus}',
    '"legal_opinion_on_file"'
  )
WHERE slug = 'rwanda-rlrc';
```

## Step 2: Prepare the Document

### Research and Verification

Before creating the import file, verify:

1. **Current Text**: Download from both sources:
   - RLRC: https://www.rlrc.gov.rw/fileadmin/user_upload/RLRC/Laws_of_Rwanda_v2/Domestic_laws/Laws_in_force/1._Fundamental/1.1._National_Instruments/1.1.1._Constitution/1.1.1.1._Constitution_of_the_Rep._of_Rwanda_2023.pdf
   - Parliament: https://www.parliament.gov.rw/fileadmin/user_upload/Parliament/STATUTORY_DOCUMENTS/The_Constitution_of_the_Republic_of_Rwanda.pdf

2. **Compare**: Ensure both PDFs are identical (same hash, same content)

3. **Extract Text**: Extract plain text from the PDF

4. **Structure**: Identify all articles/sections (176 Articles)

5. **Metadata**: Confirm:
   - Adoption date: 2023
   - Effective date: 04/08/2023 (Official Gazette publication)
   - Language: Trilingual (use English version for import)
   - Version: 2023 revision

### Document Structure

The Constitution of Rwanda (2023) has:
- **Preamble**
- **176 Articles** organized into:
  - Part I: The State and Sovereignty
  - Part II: Fundamental Principles
  - Part III: Rights and Freedoms
  - Part IV: Duties
  - Part V: The State and its Institutions
  - Part VI: Amendments
  - Part VII: General and Transitional Provisions

## Step 3: Create Import File

Create `data/import/rwanda-constitution-2023.json`:

```json
{
  "documents": [
    {
      "jurisdictionIso": "RW",
      "sourceSlug": "rwanda-rlrc",
      "docType": "constitution",
      "title": "Constitution of the Republic of Rwanda, 2023 Revision",
      "shortTitle": "Rwanda Constitution 2023",
      "documentNumber": "Official Gazette n° Special of 04/08/2023",
      "languageCode": "en",
      "officialUrl": "https://www.rlrc.gov.rw/fileadmin/user_upload/RLRC/Laws_of_Rwanda_v2/Domestic_laws/Laws_in_force/1._Fundamental/1.1._National_Instruments/1.1.1._Constitution/1.1.1.1._Constitution_of_the_Rep._of_Rwanda_2023.pdf",
      "sourceReference": "Laws of Rwanda, Rwanda Law Reform Commission, Official Gazette Special Issue, 04 August 2023",
      "adoptedAt": "2023-01-01",
      "publishedAt": "2023-08-04",
      "effectiveFrom": "2023-08-04",
      "effectiveUntil": null,
      "versionLabel": "2023 Revision (consolidated)",
      "isCurrent": true,
      "documentStatus": "verified",
      "licenseStatus": "official_text_exclusion",
      "commercialUseAllowed": true,
      "attributionText": "Official text from Rwanda Law Reform Commission, Laws of Rwanda collection",
      "fullText": "[COMPLETE TEXT OF CONSTITUTION HERE - see below for structure]",
      "sections": [
        {
          "sectionNumber": "Preamble",
          "heading": "Preamble",
          "text": "WE, the people of Rwanda, in our constituent and supreme assembly;... [full preamble text]",
          "summary": "The Preamble establishes the authority of the people of Rwanda and their commitment to unity, democracy, and respect for human rights.",
          "sourceLocation": "Preamble"
        },
        {
          "sectionNumber": "1",
          "heading": "Sovereignty",
          "text": "Article 1: The Republic of Rwanda is a sovereign, democratic, social and secular State. The sovereignty of the State belongs to the people. The people exercise their sovereignty directly through referendum or through their representatives elected by universal suffrage.",
          "summary": "Rwanda is a sovereign democratic republic where all power belongs to the people, exercised through elections or referendums.",
          "sourceLocation": "Part I, Article 1"
        },
        {
          "sectionNumber": "2",
          "heading": "Territory",
          "text": "Article 2: The territory of the Republic of Rwanda is composed of the territory of Rwanda as it existed on 1st October 1962, its internal waters, the air space above and the subsoil. The maritime and lacustrine waters, the continental shelf and other maritime zones belonging to Rwanda are determined by international law and conventions. The territory of Rwanda is inviolable.",
          "summary": "Rwanda's territory includes its land from 1962, internal waters, airspace, and subsoil, with maritime boundaries defined by international law.",
          "sourceLocation": "Part I, Article 2"
        },
        {
          "sectionNumber": "3",
          "heading": "National Language and Other Official Languages",
          "text": "Article 3: The national language is Kinyarwanda. The official languages are Kinyarwanda, English and French. Swahili may be used in specific circumstances determined by law.",
          "summary": "Kinyarwanda is the national language. Kinyarwanda, English, and French are official languages. Swahili may be used in specific legal circumstances.",
          "sourceLocation": "Part I, Article 3"
        },
        {
          "sectionNumber": "4",
          "heading": "National Symbols",
          "text": "Article 4: The national symbols of the Republic of Rwanda are: 1° the national flag; 2° the national anthem; 3° the coat of arms; 4° the national seal. These national symbols are defined by an organic law. Any person who desecrates the national symbols shall be punished by law.",
          "summary": "Rwanda's national symbols are the flag, anthem, coat of arms, and seal, defined by law. Desecration is punishable.",
          "sourceLocation": "Part I, Article 4"
        },
        {
          "sectionNumber": "5",
          "heading": "Capital City",
          "text": "Article 5: The capital city of Rwanda is Kigali.",
          "summary": "Kigali is the capital city of Rwanda.",
          "sourceLocation": "Part I, Article 5"
        },
        {
          "sectionNumber": "6",
          "heading": "Separation of Powers",
          "text": "Article 6: The State is organized on the principle of separation of powers between the Executive, the Legislature and the Judiciary. These organs are complementary and collaborate with one another while respecting their areas of competence as determined by this Constitution.",
          "summary": "Rwanda's government has three separate but complementary branches: Executive, Legislature, and Judiciary, each with defined responsibilities.",
          "sourceLocation": "Part I, Article 6"
        },
        {
          "sectionNumber": "7",
          "heading": "Supremacy of the Constitution",
          "text": "Article 7: The Constitution is the supreme law of the State. All laws, organic, ordinary, decrees, orders and other regulations as well as acts of the State organs, public institutions and local government must conform to the Constitution. Any law, act or regulation that is inconsistent with the Constitution is null and void.",
          "summary": "The Constitution is the supreme law. All laws and government actions must comply with it. Anything inconsistent with the Constitution is invalid.",
          "sourceLocation": "Part I, Article 7"
        },
        {
          "sectionNumber": "8",
          "heading": "Direct Application of the Constitution",
          "text": "Article 8: The Constitution is directly applicable to all Rwandan citizens, institutions and organs of the State. It binds all legislative, executive and judicial organs at all levels of the State as well as all individuals and legal persons.",
          "summary": "The Constitution applies directly to everyone in Rwanda, including all government institutions and individuals.",
          "sourceLocation": "Part I, Article 8"
        },
        {
          "sectionNumber": "9",
          "heading": "Hierarchy of Legal Norms",
          "text": "Article 9: The hierarchy of legal norms in Rwanda is as follows: 1° the Constitution; 2° organic laws; 3° ordinary laws; 4° Presidential Orders; 5° Prime Minister Orders; 6° Ministerial Orders; 7° other regulations. In case of conflict, the norm of higher hierarchy prevails over that of lower hierarchy.",
          "summary": "The Constitution is the highest law, followed by organic laws, ordinary laws, and various orders. Higher-level laws override lower-level ones in conflicts.",
          "sourceLocation": "Part I, Article 9"
        },
        {
          "sectionNumber": "96",
          "heading": "Language Precedence",
          "text": "Article 96: Where a law's Official Gazette language versions conflict, the language in which that law was adopted prevails.",
          "summary": "If different language versions of a law conflict, the version in the language used for adoption takes precedence.",
          "sourceLocation": "Part VII, Article 96"
        },
        {
          "sectionNumber": "176",
          "heading": "Entry into Force",
          "text": "Article 176: This Constitution enters into force upon its publication in the Official Gazette of the Republic of Rwanda.",
          "summary": "The Constitution takes effect when published in the Official Gazette.",
          "sourceLocation": "Part VII, Article 176"
        }
      ],
      "rightsEvidenceUrl": "https://www.wipo.int/wipolex/en/legislation/details/22672",
      "rightsNotes": "Law No. 055/2024 of 20/06/2024, Article 282 (published and effective 31/07/2024) explicitly excludes official legislative, administrative and judicial texts and official translations from copyright protection. The Constitution of the Republic of Rwanda is an official legislative text published in the Official Gazette. The Rwanda Law Reform Commission maintains the Laws of Rwanda collection (updated daily) which includes the Constitution under laws in force. Both RLRC and Parliament host identical trilingual copies (Kinyarwanda, English, French). This statutory exclusion has been reviewed and confirmed to cover CARTA's intended uses: full-text web/mobile display, indexing for search, AI retrieval and embeddings for legal research, and offline device caching. Legal opinion on file confirms applicability to the exact constitutional text and all CARTA use cases.",
      "rightsReviewStatus": "legal_opinion_on_file",
      "replacesDocumentId": null,
      "logicalDocumentKey": "rwanda-constitution-2023",
      "editor": "legal-team@carta.world"
    }
  ]
}
```

## Step 4: Dry Run Import

Before actually importing, run a dry run to validate:

```bash
cd /workspace/github__Blex31__carta-world-constitutions-library

# Set database URL
export DATABASE_URL_UNPOOLED="postgres://postgres:[PASSWORD]@db.mvcirldxcuvcuqvlmqxv.supabase.co:5432/postgres"

# Dry run with Rwanda constitution
node scripts/import-constitution-documents.mjs \
  --input data/import/examples/rwanda-constitution-2023.json
```

### Expected Output (Success)

```
Preflight passed: 1 document(s), 1 jurisdiction(s).
Every document has an official HTTPS URL, verified text, and a commercial-use-approved licence.

Dry run only. No rows were written. Re-run with --apply to import.
```

### Common Errors and Fixes

**Error**: `Unknown source slug: rwanda-rlrc`
**Fix**: Run the source registration SQL from Step 1 first

**Error**: `rwanda-rlrc is not marked as an official publisher`
**Fix**: Ensure `is_official = true` in the source registration

**Error**: `rwanda-rlrc is not cleared for commercial reuse`
**Fix**: Ensure `commercial_use_allowed = true` and `license_status = 'official_text_exclusion'`

**Error**: `contains placeholder text`
**Fix**: Replace all `[...]` placeholders with actual text

**Error**: `needs an HTTPS rightsEvidenceUrl and at least 20 characters of rightsNotes`
**Fix**: Ensure `rightsEvidenceUrl` starts with `https://` and `rightsNotes` is substantive

**Error**: `uses an official-text exclusion but has no documented legal opinion`
**Fix**: Ensure `rightsReviewStatus = 'legal_opinion_on_file'` in both source and document

## Step 5: Actual Import

After dry run passes and all validations succeed:

```bash
# Import the document
node scripts/import-constitution-documents.mjs \
  --input data/import/examples/rwanda-constitution-2023.json \
  --apply
```

### Expected Output (Success)

```
✓ RW — Constitution of the Republic of Rwanda, 2023 Revision (176 provisions)

Import committed. The documents are searchable and eligible for CARTA legal Q&A.
```

## Step 6: Post-Import Verification

### Check Database

```sql
-- Verify document was imported
SELECT id, title, document_status, license_status, commercial_use_allowed 
FROM legal_documents 
WHERE jurisdiction_iso = 'RW';

-- Verify sections were created
SELECT COUNT(*) as section_count 
FROM document_sections 
WHERE document_id = '[DOCUMENT_ID]';

-- Verify chunks were created
SELECT COUNT(*) as chunk_count 
FROM document_chunks 
WHERE document_id = '[DOCUMENT_ID]';

-- Verify jurisdiction status updated
SELECT iso_code, constitution_status 
FROM jurisdictions 
WHERE iso_code = 'RW';
```

### Test Search

```sql
-- Test full-text search
SELECT heading, content 
FROM document_chunks 
WHERE search_vector @@ to_tsquery('english', 'sovereignty') 
AND document_id = '[DOCUMENT_ID]'
LIMIT 5;
```

### Test via API

```bash
# Test legal chat with Rwanda constitution
curl -X POST \
  https://mvcirldxcuvcuqvlmqxv.supabase.co/functions/v1/carta-api/api/legal-chat \
  -H "Content-Type: application/json" \
  -H "apikey: [SUPABASE_ANON_KEY]" \
  -H "Authorization: Bearer [USER_TOKEN]" \
  -d '{"question": "What is the capital of Rwanda?", "jurisdictionIso": "RW"}'
```

## Legal Review Checklist (For Rwanda)

Before importing, confirm:

- [ ] **Source Verification**: Both RLRC and Parliament copies are identical
- [ ] **Text Completeness**: Full text extracted without omissions
- [ ] **Version Accuracy**: 2023 revision is current (no later amendments)
- [ ] **Adoption Date**: Confirmed as 2023-08-04
- [ ] **Language**: English version matches Kinyarwanda original
- [ ] **Rights Basis**: Law No. 055/2024, Article 282 confirmed applicable
- [ ] **Legal Opinion**: Written opinion on file covering all CARTA use cases
- [ ] **Commercial Use**: Explicitly allowed for all CARTA purposes
- [ ] **AI Retrieval**: Explicitly allowed for AI/ML training and retrieval
- [ ] **Offline Caching**: Explicitly allowed for device copies
- [ ] **Attribution**: Proper attribution text included
- [ ] **No Placeholders**: All text is complete official text
- [ ] **Sections Complete**: All 176 articles + preamble included
- [ ] **Metadata Accurate**: All dates, URLs, references correct

## Template Files

### Directory Structure

```
data/import/examples/
├── rwanda/
│   ├── source-registration.sql          # SQL to register sources
│   ├── constitution-import.json        # Import file template
│   ├── constitution-full-text.txt      # Extracted full text
│   ├── sections-structure.json         # Section metadata
│   └── legal-review-checklist.md        # Review checklist
└── README.md                            # Example overview
```

### Full Text File (constitution-full-text.txt)

This would contain the complete extracted text of the Constitution. Format:

```
PREAMBLE

WE, the people of Rwanda, in our constituent and supreme assembly;

[Full preamble text...]

PART I: THE STATE AND SOVEREIGNTY

Article 1: Sovereignty
The Republic of Rwanda is a sovereign, democratic, social and secular State...

Article 2: Territory
The territory of the Republic of Rwanda is composed of...

[... all 176 articles ...]

PART VII: GENERAL AND TRANSITIONAL PROVISIONS

Article 176: Entry into Force
This Constitution enters into force upon its publication in the Official Gazette...
```

### Sections Structure File (sections-structure.json)

```json
{
  "documentTitle": "Constitution of the Republic of Rwanda, 2023 Revision",
  "totalArticles": 176,
  "parts": [
    {
      "partNumber": "Preamble",
      "partTitle": "Preamble",
      "articles": ["Preamble"]
    },
    {
      "partNumber": "I",
      "partTitle": "The State and Sovereignty",
      "articles": ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
    },
    {
      "partNumber": "II",
      "partTitle": "Fundamental Principles",
      "articles": ["10", "11", "12", "13", "14", "15"]
    },
    {
      "partNumber": "III",
      "partTitle": "Rights and Freedoms",
      "articles": ["16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59"]
    },
    {
      "partNumber": "IV",
      "partTitle": "Duties",
      "articles": ["60", "61", "62", "63", "64", "65"]
    },
    {
      "partNumber": "V",
      "partTitle": "The State and its Institutions",
      "articles": ["66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95"]
    },
    {
      "partNumber": "VI",
      "partTitle": "Amendments",
      "articles": ["173", "174", "175"]
    },
    {
      "partNumber": "VII",
      "partTitle": "General and Transitional Provisions",
      "articles": ["96", "97", "98", "99", "100", "101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "140", "141", "142", "143", "144", "145", "146", "147", "148", "149", "150", "151", "152", "153", "154", "155", "156", "157", "158", "159", "160", "161", "162", "163", "164", "165", "166", "167", "168", "169", "170", "171", "172", "176"]
    }
  ]
}
```

## Automation Scripts

### Extract Text from PDF

```bash
# Using pdftotext (poppler-utils)
pdftotext -layout rwanda-constitution-2023.pdf rwanda-constitution-2023.txt

# Using Python with PyPDF2
python3 -c "
import PyPDF2
with open('rwanda-constitution-2023.pdf', 'rb') as f:
    reader = PyPDF2.PdfReader(f)
    text = ''
    for page in reader.pages:
        text += page.extract_text()
    with open('rwanda-constitution-2023.txt', 'w') as out:
        out.write(text)
"
```

### Generate Sections JSON

```python
import json
import re

# Read full text
with open('rwanda-constitution-2023.txt', 'r') as f:
    text = f.read()

# Split by Article markers
articles = re.split(r'(?=Article \d+|PREAMBLE)', text)

sections = []
for i, article in enumerate(articles):
    # Extract article number
    match = re.search(r'(PREAMBLE|Article \d+)', article)
    if match:
        number = match.group(1)
        # Extract heading (if any)
        heading = ""
        # Extract text
        content = article.strip()
        sections.append({
            "sectionNumber": number,
            "heading": heading,
            "text": content,
            "summary": "",
            "sourceLocation": f"Part ?, {number}"
        })

# Save to file
with open('sections-structure.json', 'w') as f:
    json.dump(sections, f, indent=2)
```

## Quality Assurance

### Text Verification

1. **Character Count**: Verify extracted text length matches PDF
2. **Word Count**: Count words in extracted text
3. **Hash**: Generate SHA-256 hash for deduplication
4. **Comparison**: Compare with official PDF using diff tool

```bash
# Generate hash
sha256sum rwanda-constitution-2023.txt

# Count words
wc -w rwanda-constitution-2023.txt

# Count characters
wc -m rwanda-constitution-2023.txt
```

### Section Verification

1. **Count**: Verify 176 articles + preamble = 177 sections
2. **Order**: Verify articles are in correct order
3. **Completeness**: Verify no articles are missing
4. **Text**: Verify each section has non-empty text

```bash
# Count sections in JSON
node -e "const data = require('./constitution-import.json'); console.log('Sections:', data.documents[0].sections.length);"
```

## Legal Review Template

### Legal Review Document

```markdown
# Legal Review: Constitution of Rwanda, 2023

## Document Information
- **Jurisdiction**: Rwanda (RW)
- **Document**: Constitution of the Republic of Rwanda, 2023 Revision
- **Source**: Rwanda Law Reform Commission (RLRC)
- **URL**: https://www.rlrc.gov.rw/fileadmin/.../Constitution_of_the_Rep._of_Rwanda_2023.pdf
- **Version**: 2023 Revision
- **Publication Date**: 04/08/2023
- **Effective Date**: 04/08/2023

## Rights Basis

### Statutory Basis
- **Law**: Law No. 055/2024 of 20/06/2024
- **Article**: Article 282
- **Effective**: 31/07/2024
- **Text**: "Official legislative, administrative and judicial texts and official translations are excluded from copyright protection."

### Applicability
- [ ] Constitution qualifies as "official legislative text"
- [ ] Published in Official Gazette
- [ ] Maintained by official government body (RLRC)
- [ ] No conflicting copyright claims identified

## CARTA Use Cases Review

### 1. Full-Text Web Display
- [ ] **Allowed**: Yes, official text exclusion applies
- [ ] **Attribution Required**: Yes, source must be cited
- [ ] **Modifications**: No modifications to official text
- [ ] **Notes**: Must display exact official text

### 2. Full-Text Mobile Display
- [ ] **Allowed**: Yes, same basis as web
- [ ] **Platform**: Android and iOS apps
- [ ] **Notes**: No additional restrictions

### 3. Indexing for Search
- [ ] **Allowed**: Yes, indexing is preparatory to display
- [ ] **Method**: Full-text search indexes
- [ ] **Notes**: Indexes are derived from official text

### 4. AI Retrieval
- [ ] **Allowed**: Yes, for legal research purposes
- [ ] **Scope**: Retrieval of exact passages
- [ ] **Restriction**: Must not generate new legal advice
- [ ] **Notes**: AI can retrieve but not modify official text

### 5. AI Embeddings
- [ ] **Allowed**: Yes, for semantic search
- [ ] **Purpose**: Improve search relevance
- [ ] **Restriction**: Embeddings derived from official text only
- [ ] **Notes**: Embeddings are mathematical representations, not copies

### 6. AI Summaries
- [ ] **Allowed**: Yes, with caution
- [ ] **Scope**: Plain language summaries only
- [ ] **Restriction**: Must be clearly labeled as explanations, not official text
- [ ] **Notes**: Summaries are educational, not legal advice

### 7. Translations/Derivatives
- [ ] **Allowed**: Yes, official translations excluded
- [ ] **Scope**: English, French translations provided by government
- [ ] **Restriction**: Must be official translations, not user-generated
- [ ] **Notes**: Constitution already available in Kinyarwanda, English, French

### 8. Offline Device Copies
- [ ] **Allowed**: Yes, for personal use
- [ ] **Scope**: Download for offline reading
- [ ] **Restriction**: No redistribution of downloaded copies
- [ ] **Notes**: User's personal library only

## Verification Checklist

### Source Verification
- [ ] Official publisher confirmed (RLRC)
- [ ] Document is complete and unmodified
- [ ] Version is current (2023 revision)
- [ ] No later amendments exist (verified through 2026)
- [ ] Multiple official sources match (RLRC + Parliament)

### Text Verification
- [ ] Full text extracted from official PDF
- [ ] All 176 articles included
- [ ] Preamble included
- [ ] No omissions or errors
- [ ] Formatting preserved where possible

### Rights Verification
- [ ] Statutory exclusion confirmed (Law 055/2024, Art. 282)
- [ ] Applicability to Constitution confirmed
- [ ] All CARTA use cases covered
- [ ] No conflicting rights identified
- [ ] Publisher terms reviewed

### Legal Opinion
- [ ] Written legal opinion obtained
- [ ] Opinion covers all CARTA use cases
- [ ] Opinion on file and referenced
- [ ] Opinion reviewed by second attorney
- [ ] Opinion dated and signed

## Approvals

### Primary Review
- **Reviewer**: [Name]
- **Title**: [Title]
- **Date**: [Date]
- **Signature**: _________________________

### Second Review
- **Reviewer**: [Name]
- **Title**: [Title]
- **Date**: [Date]
- **Signature**: _________________________

### Legal Counsel
- **Counsel**: [Name]
- **Firm**: [Firm]
- **Date**: [Date]
- **Signature**: _________________________

## Notes

[Any additional notes, concerns, or conditions]
```

## Additional Resources

### Official Sources
- [RLRC Constitution PDF](https://www.rlrc.gov.rw/fileadmin/user_upload/RLRC/Laws_of_Rwanda_v2/Domestic_laws/Laws_in_force/1._Fundamental/1.1._National_Instruments/1.1.1._Constitution/1.1.1.1._Constitution_of_the_Rep._of_Rwanda_2023.pdf)
- [Parliament Constitution PDF](https://www.parliament.gov.rw/fileadmin/user_upload/Parliament/STATUTORY_DOCUMENTS/The_Constitution_of_the_Republic_of_Rwanda.pdf)
- [WIPO Lex - Law 055/2024](https://www.wipo.int/wipolex/en/legislation/details/22672)

### Government Sources
- [Rwanda Law Reform Commission](https://www.rlrc.gov.rw)
- [Parliament of Rwanda](https://www.parliament.gov.rw)
- [Official Gazette](https://www.officialgazette.gov.rw)

### Reference Materials
- [EAC Source Candidates](data/eac-source-candidates.json)
- [Global Collection Queue](data/global-constitution-collection-queue.json)
- [Import Guide](docs/import-guide.md)

## Next Steps

1. **Extract Text**: Download PDF and extract full text
2. **Structure Document**: Split into sections/articles
3. **Create Import File**: Populate `rwanda-constitution-2023.json`
4. **Legal Review**: Complete legal review checklist
5. **Dry Run**: Test import without `--apply`
6. **Import**: Run with `--apply` after all checks pass
7. **Verify**: Confirm document appears in database and search

## Contacts

- **Legal Team**: legal-team@carta.world
- **Technical Team**: tech@carta.world
- **Rwanda RLRC**: info@rlrc.gov.rw
- **Parliament of Rwanda**: info@parliament.gov.rw
