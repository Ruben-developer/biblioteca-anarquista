#!/usr/bin/env node
// Revisión de los 330 configurados (pdfs-local). Extrae texto (2 primeras
// páginas) y detecta duplicados por título. La clasificación de contenido
// (es_anarquista/es_espanol/tipo/region-epoca/corriente-tema) va en subagentes.
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, basename } from 'node:path';

const PDFS = '/home/fdr/biblioteca-anarquista/pdfs-local';
const EXT = '/tmp/extract330';
const OUT = '/home/fdr/biblioteca-anarquista/data/registros/revision330';
mkdirSync(EXT, { recursive: true });
mkdirSync(OUT, { recursive: true });

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
function bigrams(s) { const n = norm(s); const b = new Set(); for (let i = 0; i < n.length - 1; i++) b.add(n.slice(i, i + 2)); return b; }
function dice(a, b) { const A = bigrams(a), B = bigrams(b); if (!A.size || !B.size) return 0; let inter = 0; for (const x of A) if (B.has(x)) inter++; return 2 * inter / (A.size + B.size); }
function slugify(n) { return n.replace(/\.pdf$/i, '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }

const files = readdirSync(PDFS).filter((f) => f.toLowerCase().endsWith('.pdf'));
const books = [];
for (const f of files) {
  const m = /^(.*?)\s+-\s+(.*?)(?:\s+\((\d{4})\))?\s*\.pdf$/i.exec(f);
  const author = m ? m[1] : ''; const title = m ? m[2] : f.replace(/\.pdf$/i, ''); const year = m ? m[3] : '';
  const slug = slugify(f);
  const txtPath = join(EXT, `${slug}.txt`);
  let words = '';
  if (!existsSync(txtPath)) {
    const r = spawnSync('pdftotext', ['-q', '-f', '1', '-l', '2', join(PDFS, f), '-'], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
    words = (r.status === 0 ? r.stdout || '' : '').split(/\s+/).filter(Boolean).slice(0, 1500).join(' ');
    writeFileSync(txtPath, words, 'utf8');
  } else words = readFileSync(txtPath, 'utf8');
  books.push({ slug, file: f, author, title, year, words: words.length });
}
writeFileSync(join(OUT, 'titulos.json'), JSON.stringify(books, null, 2), 'utf8');

// duplicados por título
const dups = [];
for (let i = 0; i < books.length; i++)
  for (let j = i + 1; j < books.length; j++) {
    const d = dice(books[i].title, books[j].title);
    if (d >= 0.82) dups.push({ a: books[i].file, b: books[j].file, score: +d.toFixed(2) });
  }
dups.sort((a, b) => b.score - a.score);
writeFileSync(join(OUT, 'duplicados.json'), JSON.stringify(dups, null, 2), 'utf8');
console.log(`PDFs: ${books.length} | extraídos: ${books.filter((b) => b.words > 0).length} | sin texto (posible escaneo): ${books.filter((b) => b.words === 0).length}`);
console.log(`Pares duplicados (title dice>=0.82): ${dups.length}`);
dups.slice(0, 30).forEach((d) => console.log(`  (${d.score}) ${d.a}  <=>  ${d.b}`));
