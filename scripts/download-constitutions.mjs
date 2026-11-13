#!/usr/bin/env node
/**
 * Constitution Downloader
 * 
 * Downloads constitutions from official government URLs in the global queue.
 * Only downloads from official .gov, .org, and other trusted domains.
 * 
 * USAGE:
 *   node scripts/download-constitutions.mjs [region]
 * 
 * EXAMPLES:
 *   node scripts/download-constitutions.mjs africa
 *   node scripts/download-constitutions.mjs all
 *   node scripts/download-constitutions.mjs
 * 
 * OUTPUT:
 *   Downloads to: data/constitutions/pdf/{region|world}/
 *   Logs to: data/constitutions/download-log.txt
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout } from 'node:timers/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Load queue data
const queueData = JSON.parse(await fs.readFile(path.join(projectRoot, 'data', 'global-constitution-collection-queue.json'), 'utf8'));

// Trusted domains for scraping
const TRUSTED_DOMAINS = [
  'gov.', 'parliament.', 'presidency.', 'president.', 'assembly.',
  'congress.', 'senate.', 'house.', 'judiciary.', 'court.',
  'ministry.', 'government.', 'official.', 'state.', 'national.',
  'rlrc.', 'kenyalaw.', 'wipo.', 'un.', 'refworld.',
  'faolex.', 'who.', 'worldbank.', 'imf.', 'afdb.'
];

// Untrusted domains to avoid
const UNTRUSTED_DOMAINS = [
  'wikipedia.', 'fandom.', 'blogspot.', 'wordpress.',
  'medium.', 'github.', 'gitlab.', 'bitbucket.'
];

function isTrustedUrl(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    
    // Check if any trusted domain is in the hostname
    const isTrusted = TRUSTED_DOMAINS.some(domain => hostname.includes(domain));
    
    // Check if any untrusted domain is in the hostname
    const isUntrusted = UNTRUSTED_DOMAINS.some(domain => hostname.includes(domain));
    
    return isTrusted && !isUntrusted;
  } catch {
    return false;
  }
}

function isPdfUrl(url) {
  return url.toLowerCase().endsWith('.pdf');
}

function isTextUrl(url) {
  const textExtensions = ['.txt', '.html', '.htm', '.shtml'];
  return textExtensions.some(ext => url.toLowerCase().endsWith(ext));
}

function sanitizeFilename(name) {
  return name
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
}

async function downloadFile(url, outputPath) {
  // Note: This uses Node.js fetch which may not work in all environments
  // For production, use wget or curl instead
  try {
    const response = await fetch(url, { 
      redirect: 'follow',
      timeout: 30000 
    });
    
    if (!response.ok) {
      console.log(`  ✗ HTTP ${response.status} for ${url}`);
      return false;
    }
    
    const contentType = response.headers.get('content-type') || '';
    const contentLength = response.headers.get('content-length');
    
    // Check if it's a PDF
    if (!contentType.includes('pdf') && !isPdfUrl(url)) {
      console.log(`  ⚠ Not a PDF (Content-Type: ${contentType})`);
      return false;
    }
    
    // Check size (skip if too large or too small)
    if (contentLength) {
      const size = parseInt(contentLength);
      if (size > 50 * 1024 * 1024) { // 50MB max
        console.log(`  ⚠ File too large (${(size / 1024 / 1024).toFixed(1)}MB)`);
        return false;
      }
      if (size < 1024) { // 1KB min
        console.log(`  ⚠ File too small (${size} bytes)`);
        return false;
      }
    }
    
    const arrayBuffer = await response.arrayBuffer();
    await fs.writeFile(outputPath, Buffer.from(arrayBuffer));
    
    const stats = await fs.stat(outputPath);
    console.log(`  ✓ Downloaded (${(stats.size / 1024).toFixed(1)}KB)`);
    return true;
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}`);
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const region = args[0]?.toLowerCase() || 'africa';
  
  console.log(`Constitution Downloader`);
  console.log(`======================\n`);
  
  // Filter countries
  let countries;
  if (region === 'all') {
    countries = queueData.entries.filter(e => 
      e.source_discovery_status === 'official_source_candidate_identified' &&
      e.official_source_candidates?.length > 0
    );
    console.log(`Downloading ALL countries with source candidates (${countries.length} countries)\n`);
  } else if (region === 'africa') {
    countries = queueData.entries.filter(e => 
      e.continent === 'Africa' && 
      e.source_discovery_status === 'official_source_candidate_identified' &&
      e.official_source_candidates?.length > 0
    );
    console.log(`Downloading AFRICA countries (${countries.length} countries)\n`);
  } else {
    // Default to Africa
    countries = queueData.entries.filter(e => 
      e.continent === 'Africa' && 
      e.source_discovery_status === 'official_source_candidate_identified' &&
      e.official_source_candidates?.length > 0
    );
    console.log(`Downloading AFRICA countries (${countries.length} countries)\n`);
  }
  
  // Create output directory
  const outputDir = path.join(projectRoot, 'data', 'constitutions', 'pdf', region);
  await fs.mkdir(outputDir, { recursive: true });
  
  // Log file
  const logFile = path.join(projectRoot, 'data', 'constitutions', 'download-log.txt');
  const logStream = fs.createWriteStream(logFile, { flags: 'a' });
  
  let downloaded = 0;
  let failed = 0;
  let skipped = 0;
  
  for (const country of countries) {
    const { iso_code: iso, country: countryName, official_source_candidates: sources } = country;
    
    if (!sources || sources.length === 0) {
      console.log(`${iso} - ${countryName}: No source URLs`);
      skipped++;
      continue;
    }
    
    // Try each source URL
    for (const url of sources) {
      if (!url || !url.startsWith('http')) continue;
      
      // Check if URL is trusted
      if (!isTrustedUrl(url)) {
        console.log(`${iso} - ${countryName}: Skipping untrusted URL: ${url}`);
        logStream.write(`[SKIP] ${iso} - ${countryName}: ${url} (untrusted domain)\n`);
        skipped++;
        continue;
      }
      
      // Check if it's a PDF or text file
      if (!isPdfUrl(url) && !isTextUrl(url)) {
        console.log(`${iso} - ${countryName}: Skipping non-PDF/text URL: ${url}`);
        logStream.write(`[SKIP] ${iso} - ${countryName}: ${url} (not PDF/text)\n`);
        skipped++;
        continue;
      }
      
      const filename = `${iso}-${sanitizeFilename(countryName)}-constitution${isPdfUrl(url) ? '.pdf' : '.txt'}`;
      const outputPath = path.join(outputDir, filename);
      
      console.log(`${iso} - ${countryName}: Downloading from ${url}...`);
      logStream.write(`[TRY] ${iso} - ${countryName}: ${url}\n`);
      
      const success = await downloadFile(url, outputPath);
      
      if (success) {
        downloaded++;
        logStream.write(`[OK] ${iso} - ${countryName}: ${url}\n`);
        // Only download first successful source per country
        break;
      } else {
        failed++;
        logStream.write(`[FAIL] ${iso} - ${countryName}: ${url}\n`);
      }
    }
    
    // Rate limiting
    await setTimeout(1000);
  }
  
  logStream.end();
  
  console.log(`\n======================`);
  console.log(`Summary:`);
  console.log(`  Downloaded: ${downloaded}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Total: ${countries.length}`);
  console.log(`\nOutput directory: ${outputDir}`);
  console.log(`Log file: ${logFile}`);
}

main().catch(console.error);
