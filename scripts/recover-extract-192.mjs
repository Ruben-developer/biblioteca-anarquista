#!/usr/bin/env node
// Recupera los 192 archivos subidos (desde subidos-nuevos.md) y extrae su texto.
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = '/home/fdr/biblioteca-anarquista';
const PDFS = join(ROOT, 'pdfs-local');
const OUT = join(ROOT, 'data/registros/revision330');
const EXTRACT = '/tmp/extract192';
mkdirSync(EXTRACT, { recursive: true });

const slugify = (n) => n.replace(/\.pdf$/i, '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const parse = (fn) => {
  const base = fn.replace(/\.pdf$/i, '');
  const m = base.match(/^(.*?)\s-\s(.*)$/);
  let autor = '', titulo = base;
  if (m) { autor = m[1].trim(); titulo = m[2].trim(); }
  const yr = (base.match(/\((\d{4})\)/) || [])[1] || '';
  titulo = titulo.replace(/\s*\([^)]*\)\s*$/g, '').trim();
  return { autor, titulo, year: yr };
};

// Mapa nombre-archivo -> (autor,titulo) en pdfs-local
const pdfs = readdirSync(PDFS).filter((f) => f.toLowerCase().endsWith('.pdf'));
const key = (a, t) => (a + '|' + t).toLowerCase();
const fileMap = new Map();
for (const f of pdfs) { const p = parse(f); fileMap.set(key(p.autor, p.titulo), f); }

// Leer subidos-nuevos.md (seccion ## Subidos)
const md = readFileSync(join(OUT, 'subidos-nuevos.md'), 'utf8');
const lines = md.split('\n');
let inSub = false;
const rows = [];
for (const l of lines) {
  if (l.startsWith('## Subidos')) { inSub = true; continue; }
  if (l.startsWith('## ')) { if (inSub) break; else continue; }
  if (inSub && l.startsWith('|') && !l.includes('Autor')) {
    const c = l.split('|').map((x) => x.trim());
    if (c.length >= 3 && c[1]) rows.push({ autor: c[1], titulo: c[2] });
  }
}

const titulos = [];
for (const r of rows) {
  const f = fileMap.get(key(r.autor, r.titulo));
  if (!f) { console.error('NO MATCH:', r.autor, '|', r.titulo); continue; }
  const p = parse(f);
  const slug = slugify(f);
  const out = join(EXTRACT, slug + '.txt');
  try { execSync(`pdftotext -enc UTF-8 "${join(PDFS, f)}" "${out}"`, { stdio: 'ignore' }); }
  catch (e) { /* scan sin texto */ }
  const txt = readFileSync(out, 'utf8').trim();
  titulos.push({ slug, file: f, author: p.autor, title: p.titulo, year: p.year, sinTexto: txt.length === 0 });
}
writeFileSync('/tmp/titulos192.json', JSON.stringify(titulos, null, 2), 'utf8');
console.log('recuperados:', titulos.length, '| sin texto:', titulos.filter((t) => t.sinTexto).length);
