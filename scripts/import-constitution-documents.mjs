#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import pg from 'pg';

const { Pool } = pg;
const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};
const apply = args.includes('--apply');
const inputPath = path.resolve(getArg('--input', 'data/import/constitutions.json'));
const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
const validLicense = new Set(['approved', 'public_domain_verified', 'open_license', 'permission_granted', 'official_text_exclusion']);
const validTypes = new Set(['constitution','constitutional_amendment','act','bill','regulation','gazette_notice','court_decision','treaty','international_instrument','official_guidance','other']);

function fail(message) {
  console.error(`\nCARTA import stopped: ${message}`);
  process.exit(1);
}
function safeDate(value, field) {
  if (value == null || value === '') return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    throw new Error(`${field} must be an ISO date (YYYY-MM-DD).`);
  }
  return value;
}
function hash(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}
function chunkText(text, maxWords = 420, overlap = 55) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const chunks = [];
  for (let start = 0; start < words.length; start += maxWords - overlap) {
    const chunk = words.slice(start, start + maxWords).join(' ');
    if (chunk) chunks.push(chunk);
    if (start + maxWords >= words.length) break;
  }
  return chunks;
}
function validateDocument(doc, index) {
  const prefix = `documents[${index}]`;
  if (!doc || typeof doc !== 'object') throw new Error(`${prefix} must be an object.`);
  if (!/^[A-Z]{2,3}$/.test(doc.jurisdictionIso || '')) throw new Error(`${prefix}.jurisdictionIso must be a two- or three-letter jurisdiction code.`);
  if (!/^[a-z0-9][a-z0-9-]{1,80}$/.test(doc.sourceSlug || '')) throw new Error(`${prefix}.sourceSlug is required.`);
  if (!validTypes.has(doc.docType)) throw new Error(`${prefix}.docType is invalid.`);
  if (!doc.title?.trim() || !doc.fullText?.trim()) throw new Error(`${prefix} needs a title and fullText.`);
  if (/paste the|example only|replace with|placeholder|lorem ipsum/i.test(doc.fullText) || doc.sections?.some(section => /paste the|example only|replace with|placeholder|lorem ipsum/i.test(section.text || ''))) throw new Error(`${prefix} contains placeholder text. Only the complete, exact official text can be imported.`);
  if (!doc.officialUrl?.startsWith('https://')) throw new Error(`${prefix}.officialUrl must be HTTPS.`);
  if (doc.documentStatus !== 'verified') throw new Error(`${prefix} must be documentStatus "verified" to enter the published corpus.`);
  if (!validLicense.has(doc.licenseStatus) || doc.commercialUseAllowed !== true) {
    throw new Error(`${prefix} is blocked: commercial reuse must be explicitly cleared under an approved rights basis.`);
  }
  if (doc.licenseStatus === 'official_text_exclusion' && doc.rightsReviewStatus !== 'legal_opinion_on_file') {
    throw new Error(`${prefix} uses an official-text exclusion but has no documented legal opinion covering CARTA's intended uses.`);
  }
  if (!doc.rightsEvidenceUrl?.startsWith('https://') || (doc.rightsNotes || '').trim().length < 20 || /example only|replace with|placeholder/i.test(doc.rightsNotes || '')) {
    throw new Error(`${prefix} needs an HTTPS rightsEvidenceUrl and at least 20 characters of rightsNotes.`);
  }
  if (!Array.isArray(doc.sections) || doc.sections.length === 0) throw new Error(`${prefix}.sections must contain one or more provisions.`);
  for (const [sectionIndex, section] of doc.sections.entries()) {
    if (!section?.text?.trim()) throw new Error(`${prefix}.sections[${sectionIndex}].text is required.`);
  }
  for (const field of ['adoptedAt','publishedAt','effectiveFrom','effectiveUntil']) safeDate(doc[field], `${prefix}.${field}`);
}

if (!databaseUrl) fail('Set DATABASE_URL_UNPOOLED (preferred for imports) or DATABASE_URL.');
let input;
try { input = JSON.parse(await fs.readFile(inputPath, 'utf8')); }
catch (error) { fail(`Cannot read ${inputPath}: ${error.message}. Copy data/import/constitutions.example.json to data/import/constitutions.json first.`); }
if (!Array.isArray(input.documents) || input.documents.length === 0) fail('The import JSON needs a non-empty documents array.');
try { input.documents.forEach(validateDocument); }
catch (error) { fail(error.message); }

const pool = new Pool({ connectionString: databaseUrl, max: 2, connectionTimeoutMillis: 10000 });
const client = await pool.connect();
try {
  const sources = new Map();
  const jurisdictions = new Set();
  for (const doc of input.documents) {
    const source = await client.query(`select id,slug,name,is_official,license_status,commercial_use_allowed,metadata
      from legal_sources where slug=$1`, [doc.sourceSlug]);
    if (!source.rowCount) throw new Error(`Unknown source slug: ${doc.sourceSlug}. Add it to legal_sources first.`);
    const row = source.rows[0];
    if (!row.is_official) throw new Error(`${doc.sourceSlug} is not marked as an official publisher.`);
    if (!validLicense.has(row.license_status) || row.commercial_use_allowed !== true) {
      throw new Error(`${doc.sourceSlug} is not cleared for commercial reuse. Update its source record only after a legal rights review.`);
    }
    if (!row.metadata?.rightsEvidenceUrl || (row.metadata?.rightsNotes || '').trim().length < 20) {
      throw new Error(`${doc.sourceSlug} is missing its source-level rights evidence record.`);
    }
    if (row.license_status === 'official_text_exclusion' &&
        (row.metadata?.rightsReviewStatus !== 'legal_opinion_on_file' || doc.rightsReviewStatus !== 'legal_opinion_on_file')) {
      throw new Error(`${doc.sourceSlug} uses an official-text exclusion but lacks a documented legal opinion covering CARTA's intended uses.`);
    }
    sources.set(doc.sourceSlug, row);
    const exists = await client.query('select 1 from jurisdictions where iso_code=$1', [doc.jurisdictionIso]);
    if (!exists.rowCount) throw new Error(`Jurisdiction ${doc.jurisdictionIso} is not in the jurisdiction catalogue.`);
    jurisdictions.add(doc.jurisdictionIso);
  }

  console.log(`Preflight passed: ${input.documents.length} document(s), ${jurisdictions.size} jurisdiction(s).`);
  console.log('Every document has an official HTTPS URL, verified text, and a commercial-use-approved licence.');
  if (!apply) {
    console.log('\nDry run only. No rows were written. Re-run with --apply to import.');
  } else {
    await client.query('begin');
    try {
      for (const doc of input.documents) {
        const source = sources.get(doc.sourceSlug);
        const fullText = doc.fullText.trim();
        const digest = hash(fullText);
        const existing = await client.query('select id from legal_documents where official_url=$1 and content_sha256=$2 limit 1', [doc.officialUrl, digest]);
        const metadata = JSON.stringify({logicalDocumentKey:doc.logicalDocumentKey||null,attributionText:doc.attributionText||null,rightsEvidenceUrl:doc.rightsEvidenceUrl,rightsNotes:doc.rightsNotes,rightsReviewStatus:doc.rightsReviewStatus||null,importedAt:new Date().toISOString(),editor:doc.editor||null});
        let documentId;
        let preserveIndexedSections = false;
        if (existing.rowCount) {
          documentId = existing.rows[0].id;
          const indexed = await client.query(`select exists (
            select 1 from document_sections s join document_chunks c on c.section_id=s.id
            where s.document_id=$1
          ) as has_chunks`, [documentId]);
          preserveIndexedSections = indexed.rows[0]?.has_chunks === true;
          if (!preserveIndexedSections) {
            // Repair an earlier partial import instead of preserving sections that were never chunk-indexed.
            await client.query('delete from document_sections where document_id=$1', [documentId]);
          }
          await client.query(`update legal_documents set jurisdiction_iso=$2,source_id=$3,doc_type=$4,title=$5,short_title=$6,
            document_number=$7,language_code=$8,source_reference=$9,adopted_at=$10,published_at=$11,effective_from=$12,effective_until=$13,
            version_label=$14,is_current=$15,document_status='verified',full_text=$16,content_sha256=$17,license_status=$18,
            commercial_use_allowed=true,replaces_document_id=$19,metadata=$20,updated_at=now() where id=$1`, [
            documentId,doc.jurisdictionIso,source.id,doc.docType,doc.title,doc.shortTitle||null,doc.documentNumber||null,doc.languageCode||'en',
            doc.sourceReference||null,safeDate(doc.adoptedAt,'adoptedAt'),safeDate(doc.publishedAt,'publishedAt'),safeDate(doc.effectiveFrom,'effectiveFrom'),
            safeDate(doc.effectiveUntil,'effectiveUntil'),doc.versionLabel||null,doc.isCurrent===true,fullText,digest,doc.licenseStatus,doc.replacesDocumentId||null,metadata
          ]);
        } else {
          const inserted = await client.query(`insert into legal_documents(jurisdiction_iso,source_id,doc_type,title,short_title,document_number,language_code,
            official_url,source_reference,adopted_at,published_at,effective_from,effective_until,version_label,is_current,document_status,full_text,
            content_sha256,license_status,commercial_use_allowed,replaces_document_id,metadata)
            values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'verified',$16,$17,$18,true,$19,$20) returning id`, [
            doc.jurisdictionIso,source.id,doc.docType,doc.title,doc.shortTitle||null,doc.documentNumber||null,doc.languageCode||'en',doc.officialUrl,
            doc.sourceReference||null,safeDate(doc.adoptedAt,'adoptedAt'),safeDate(doc.publishedAt,'publishedAt'),safeDate(doc.effectiveFrom,'effectiveFrom'),
            safeDate(doc.effectiveUntil,'effectiveUntil'),doc.versionLabel||null,doc.isCurrent===true,fullText,digest,doc.licenseStatus,doc.replacesDocumentId||null,metadata
          ]);
          documentId = inserted.rows[0].id;
        }
        if (doc.isCurrent === true) {
          if (doc.docType === 'constitution') {
            // Keep parallel official-language editions current independently.
            await client.query(`update legal_documents set is_current=false,document_status='superseded',updated_at=now()
              where jurisdiction_iso=$1 and doc_type='constitution' and language_code=$3 and is_current=true and id<>$2`, [doc.jurisdictionIso,documentId,doc.languageCode||'en']);
          } else if (doc.replacesDocumentId) {
            await client.query(`update legal_documents set is_current=false,document_status='superseded',updated_at=now()
              where id=$1 and jurisdiction_iso=$2 and id<>$3`, [doc.replacesDocumentId,doc.jurisdictionIso,documentId]);
          } else if (doc.logicalDocumentKey) {
            await client.query(`update legal_documents set is_current=false,document_status='superseded',updated_at=now()
              where jurisdiction_iso=$1 and doc_type=$2 and metadata->>'logicalDocumentKey'=$3 and is_current=true and id<>$4`, [doc.jurisdictionIso,doc.docType,doc.logicalDocumentKey,documentId]);
          } else if (doc.documentNumber) {
            await client.query(`update legal_documents set is_current=false,document_status='superseded',updated_at=now()
              where jurisdiction_iso=$1 and doc_type=$2 and document_number=$3 and is_current=true and id<>$4`, [doc.jurisdictionIso,doc.docType,doc.documentNumber,documentId]);
          }
        }
        if (!preserveIndexedSections) for (const [sectionIndex, section] of doc.sections.entries()) {
          const sectionResult = await client.query(`insert into document_sections(document_id,section_number,heading,section_order,original_text,plain_language_summary,source_location)
            values($1,$2,$3,$4,$5,$6,$7) returning id`, [documentId,section.sectionNumber||null,section.heading||null,section.sectionOrder??sectionIndex,section.text.trim(),section.summary||null,section.sourceLocation||null]);
          const sectionId = sectionResult.rows[0].id;
          const chunks = chunkText(section.text);
          for (const [chunkIndex, content] of chunks.entries()) {
            await client.query(`insert into document_chunks(document_id,section_id,chunk_index,language_code,heading,content,token_count,metadata)
              values($1,$2,$3,$4,$5,$6,$7,$8)`, [documentId,sectionId,chunkIndex,doc.languageCode||'en',section.heading||section.sectionNumber||null,content,content.split(/\s+/).length,JSON.stringify({sourceLocation:section.sourceLocation||null})]);
          }
        }
        if (doc.docType === 'constitution') {
          await client.query(`update jurisdictions set constitution_status=$2,updated_at=now() where iso_code=$1`, [
            doc.jurisdictionIso,doc.isCurrent===true?'verified_current':'needs_review'
          ]);
        } else {
          await client.query(`update jurisdictions set constitution_status='text_loaded',updated_at=now()
            where iso_code=$1 and constitution_status in ('not_loaded','metadata_only')`, [doc.jurisdictionIso]);
        }
        console.log(`✓ ${doc.jurisdictionIso} — ${doc.title} (${doc.sections.length} provisions)`);
      }
      await client.query('commit');
      console.log('\nImport committed. The documents are searchable and eligible for CARTA legal Q&A.');
    } catch (error) {
      await client.query('rollback');
      throw error;
    }
  }
} catch (error) {
  console.error(`\nImport failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
