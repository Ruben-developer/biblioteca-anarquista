#!/usr/bin/env node
/**
 * Verifica que todas las descargas del catálogo respondan HTTP 200.
 * Uso: node scripts/check-downloads.mjs [--base http://192.168.1.117:8081/pdfs/]
 * Salida: código de salida 0 si todo OK, 1 si hay rotos.
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.argv.find(a => a.startsWith('--base='))?.split('=')[1]
  ?? 'http://192.168.1.117:8081/pdfs/';

const regionData = await import(path.join(__dirname, '../src/data/regionData.js'));

const files = [];
for (const region of Object.values(regionData.regionData)) {
  for (const book of region.books) {
    if (book.filename) files.push(book.filename);
  }
}

const unique = [...new Set(files)];
console.log(`Verificando ${unique.length} descargas contra ${BASE}\n`);

const broken = [];
const checked = await Promise.all(unique.map(async (file) => {
  const url = BASE + file;
  try {
    const res = await fetch(url, { method: 'HEAD' });
    const ok = res.status === 200;
    if (!ok) broken.push({ file, status: res.status });
    return { file, status: res.status, ok };
  } catch (err) {
    broken.push({ file, status: 'ERR', error: err.message });
    return { file, status: 'ERR', ok: false, error: err.message };
  }
}));

const okCount = checked.filter(c => c.ok).length;
for (const c of checked) {
  console.log(`${c.ok ? 'OK ' : 'FALLA'} ${c.status}\t${c.file}`);
}

console.log(`\nResumen: ${okCount}/${checked.length} OK`);
if (broken.length) {
  console.error(`\nROTAS (${broken.length}):`);
  for (const b of broken) console.error(`  - ${b.file} → ${b.status}${b.error ? ` (${b.error})` : ''}`);
  process.exit(1);
}
