#!/usr/bin/env node
// Prepara lotes de texto para clasificación por subagentes hy3-free.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = '/home/fdr/biblioteca-anarquista/data/registros/revision330';
const EXT = '/tmp/extract330';
const BATCH = 15;
const books = JSON.parse(readFileSync(join(OUT, 'titulos.json'), 'utf8'));
mkdirSync('/tmp/batches330', { recursive: true });
const batches = [];
for (let i = 0; i < books.length; i += BATCH) {
  const chunk = books.slice(i, i + BATCH);
  const n = String(Math.floor(i / BATCH) + 1).padStart(2, '0');
  let txt = `# Lote ${n} — clasifica CADA libro segun el esquema.\n\n`;
  for (const b of chunk) {
    const body = existsSync(join(EXT, `${b.slug}.txt`)) ? readFileSync(join(EXT, `${b.slug}.txt`), 'utf8') : '';
    txt += `=== SLUG: ${b.slug} | FILE: ${b.file} | AUTHOR: ${b.author} | TITLE: ${b.title} | YEAR: ${b.year} ===\n${body}\n\n`;
  }
  writeFileSync(`/tmp/batches330/batch_${n}.txt`, txt, 'utf8');
  batches.push({ batch: n, slugs: chunk.map((b) => b.slug) });
}
writeFileSync('/tmp/batches330/batches.json', JSON.stringify(batches, null, 2), 'utf8');
console.log(`Lotes: ${batches.length} (${BATCH} libros c/u) -> /tmp/batches330/`);
