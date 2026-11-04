# Constitution acquisition and import workflow

## 1. Find the authoritative instrument

Start at the jurisdiction's constitution/parliament, ministry of justice, Attorney-General, government printer or official Gazette. Record the institution and canonical document URL. Use Constitute/CCP, WorldLII and regional information institutes to locate records, not to replace official publication.

## 2. Establish the correct version

Check adoption/enactment, publication, commencement and amendment history. Confirm whether the file is the current consolidated text, an original text, a translation, or an archival version. Record exact dates and distinguish the legally authoritative language from other translations. If amendments are published separately, obtain the consolidation or apply the amendments only through a documented legal editorial process.

## 3. Clear text and translation rights

A reviewer must record the exact public-domain basis, open licence or written permission. Check commercial use, translation rights, attribution, modification and redistribution. The import tool blocks `review_required`, `noncommercial_only` and `restricted` sources/documents. A source being official or accessible does not itself satisfy the licence test.

## 4. Prepare import JSON

Copy `data/import/constitutions.example.json` to `data/import/constitutions.json`. Provide one document object per version and one section object per searchable provision. Preserve the official text; do not silently paraphrase it. Keep the plain-language summary separate and have it editorially reviewed. Supply a precise `sourceLocation` (article/section/chapter/page/paragraph).

## 5. Dry-run and commit

Set `DATABASE_URL_UNPOOLED` in the local environment. First run without `--apply`:

```bash
npm run import:constitutions -- --input data/import/constitutions.json
```

The preflight checks jurisdiction, source slug, official source, source/document licence status, commercial permission, HTTPS source URL and provision text. After legal review and successful preflight:

```bash
npm run import:constitutions -- --input data/import/constitutions.json --apply
```

The importer uses a database transaction, calculates a SHA-256 content hash, creates a versioned document, stores its sections and builds FTS chunks. Chunk indexes are unique per section, so every provision can start at chunk zero. Current constitution versions are superseded only within the same official language; parallel authoritative languages remain available. When a new current version is imported, the previous current version of the same document type/jurisdiction is marked superseded. Re-importing unchanged text preserves its provision IDs so saved references are not unnecessarily broken.

## 6. Verify publication

Check:

- the official link opens and points to the imported version;
- source, title, language, dates, document number and amendments are correct;
- every article/section order and text are exact;
- the current version is marked `is_current=true` and previous versions are superseded;
- the document and source have a cleared licence and `commercial_use_allowed=true`;
- jurisdiction status is `verified_current` only after full review;
- search returns the intended provisions and the legal chatbot cites their exact document/source.

## Never

- Fill a missing jurisdiction with a guessed or generated constitution.
- Mark Constitute/CCP's non-commercial text as commercially reusable without permission.
- Use an unverified translation as if it were the authoritative text.
- Treat a bill as enacted law or a press release as a court judgment.
- Let chatbot retrieval use draft, superseded, restricted or non-current text for a present-tense legal answer.
