#!/usr/bin/env node
// Deja en pdfs-local SOLO los libros configurados (catálogo all_books.json,
// 330) y mueve el resto a pdfs-no-configurados. Reversible: mover de vuelta.
import { readFileSync, writeFileSync, readdirSync, renameSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const CFG = '/tmp/all_books.json';
const MAP = '/home/fdr/Documentos/anarquismo_importado/biblioteca-inv/filename_mapping.json';
const PDFS = '/home/fdr/biblioteca-anarquista/pdfs-local';
const DEST = '/home/fdr/biblioteca-anarquista/pdfs-no-configurados';
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const cfg = JSON.parse(readFileSync(CFG, 'utf8'));
const mapRaw = JSON.parse(readFileSync(MAP, 'utf8'));
const mapping = {};
for (const k of Object.keys(mapRaw)) mapping[k.toLowerCase()] = mapRaw[k];

const configuredCleaned = new Set();
for (const b of cfg.books) {
  if (!b.filename) continue;
  const c = mapping[b.filename.toLowerCase()];
  if (c) configuredCleaned.add(norm(c));
}
const local = readdirSync(PDFS).filter((f) => f.toLowerCase().endsWith('.pdf'));
const present = local.filter((f) => configuredCleaned.has(norm(f)));
const toMove = local.filter((f) => !configuredCleaned.has(norm(f)));

console.log(`configurados: ${configuredCleaned.size} | presentes: ${present.length} | a mover: ${toMove.length}`);
if (present.length < 300 || present.length > 360) { console.error('GUARD: present fuera de rango, aborto'); process.exit(1); }

mkdirSync(DEST, { recursive: true });
let moved = 0; const manifest = [];
for (const f of toMove) {
  try { renameSync(join(PDFS, f), join(DEST, f)); moved++; manifest.push(f); }
  catch (e) { console.error('fallo', f, e.message); }
}
writeFileSync(join(DEST, 'manifest-movidos.txt'), manifest.join('\n') + '\n', 'utf8');
const rest = readdirSync(PDFS).filter((f) => f.toLowerCase().endsWith('.pdf')).length;
console.log(`movidos: ${moved} | pdfs-local ahora: ${rest}`);
