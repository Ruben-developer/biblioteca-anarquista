#!/usr/bin/env node
import { readFileSync, writeFileSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { createHash } from 'crypto';

const WORKDIR = '/home/fdr/Documentos/anarquismo_importado/biblioteca-inv';
const unzipDir = join(WORKDIR, 'pdfs');
const OUTFILE = join(WORKDIR, 'inventario.json');

const data = JSON.parse(readFileSync(OUTFILE, 'utf8'));
const startIdx = parseInt(process.argv[2] || '0');
const batchSize = parseInt(process.argv[3] || '500');

const end = Math.min(startIdx + batchSize, data.inventory.length);
console.log(`Hashing PDFs ${startIdx}–${end - 1} de ${data.inventory.length}...`);

const hashMap = {};

for (let i = startIdx; i < end; i++) {
  const item = data.inventory[i];
  const fullPath = join(unzipDir, item.path);
  try {
    const buf = readFileSync(fullPath);
    item.hash = createHash('sha256').update(buf).digest('hex').slice(0, 16);
    if (!hashMap[item.hash]) hashMap[item.hash] = [];
    hashMap[item.hash].push(item.path);
  } catch {
    item.hash = null;
  }
}

// Detect duplicates from this batch
const newDups = {};
for (const [hash, paths] of Object.entries(hashMap)) {
  if (paths.length > 1) newDups[hash] = paths;
}

writeFileSync(OUTFILE, JSON.stringify(data, null, 2));
console.log(`Done. Hashed ${end - startIdx} files. Duplicates in batch: ${Object.keys(newDups).length}`);
