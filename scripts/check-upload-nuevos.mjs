#!/usr/bin/env node
// 1) Chequea que los 200 candidatos (pdfs-no-configurados, sin exclusiones) no
//    sean duplicados de libros ya subidos (pdfs-local / catalogo).
// 2) Sube (mueve a pdfs-local) los que no son duplicado.
import { readdirSync, renameSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SRC = '/home/fdr/biblioteca-anarquista/pdfs-no-configurados';
const DST = '/home/fdr/biblioteca-anarquista/pdfs-local';
const OUT = '/home/fdr/biblioteca-anarquista/data/registros/revision330';
mkdirSync(DST, { recursive: true });

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const EXCL = ['marighella','manual del guerrillero','guerrilla olvidada','fuego a la polvora','bajo tres banderas','iron mountain','libro rojo del cole','antipsiquiatria'];
const parse = (fn) => {
  const base = fn.replace(/\.pdf$/i, '');
  const m = base.match(/^(.*?)\s-\s(.*)$/);
  let autor = '', titulo = base;
  if (m) { autor = m[1].trim(); titulo = m[2].trim(); }
  titulo = titulo.replace(/\s*\([^)]*\)\s*$/g, '').trim();
  return { autor, titulo };
};
const tokens = (s) => new Set(norm(s).split(/\s+/).filter((w) => w.length > 2));
const jaccard = (a, b) => { const A = tokens(a), B = tokens(b); if (!A.size || !B.size) return 0; let i = 0; for (const w of A) if (B.has(w)) i++; return i / (A.size + B.size - i); };

// Ya subidos: pdfs-local
const subidos = readdirSync(DST).filter((f) => f.toLowerCase().endsWith('.pdf')).map(parse);
const subTitles = subidos.map((s) => norm(s.titulo));

// Candidatos: primeros 200 no excluidos
const files = readdirSync(SRC).filter((f) => f.toLowerCase().endsWith('.pdf')).sort();
const candidatos = [];
for (const f of files) {
  const p = parse(f);
  if (EXCL.some((k) => norm(p.autor + ' ' + p.titulo).includes(k))) continue;
  candidatos.push({ file: f, ...p });
  if (candidatos.length >= 200) break;
}

const dup = [], posible = [], nuevo = [];
for (const c of candidatos) {
  const nt = norm(c.titulo);
  if (subTitles.includes(nt)) { dup.push(c); continue; }
  let best = 0;
  for (const st of subTitles) { const j = jaccard(c.titulo, st); if (j > best) best = j; }
  if (best >= 0.7 && nt.length > 4) posible.push({ ...c, score: best.toFixed(2) });
  else nuevo.push(c);
}

// Subir los nuevos
const md = '# Subidos desde tabla-nuevos-200\n\n';
let log = `_Total candidatos: ${candidatos.length} | Duplicados (no subidos): ${dup.length} | Posibles duplicados (no subidos): ${posible.length} | **Subidos: ${nuevo.length}**_\n\n`;
log += '## Subidos\n| Autor | Título |\n|---|---|\n';
for (const c of nuevo) { renameSync(join(SRC, c.file), join(DST, c.file)); log += `| ${c.autor} | ${c.titulo} |\n`; }
log += '\n## Duplicados (no subidos)\n| Autor | Título |\n|---|---|\n';
for (const c of dup) log += `| ${c.autor} | ${c.titulo} |\n`;
log += '\n## Posibles duplicados (no subidos, revisar)\n| Autor | Título | score |\n|---|---|---|\n';
for (const c of posible) log += `| ${c.autor} | ${c.titulo} | ${c.score} |\n`;
writeFileSync(join(OUT, 'subidos-nuevos.md'), log, 'utf8');
console.log(`candidatos=${candidatos.length} dup=${dup.length} posible=${posible.length} subidos=${nuevo.length}`);
console.log('pdfs-local ahora:', readdirSync(DST).filter((f) => f.toLowerCase().endsWith('.pdf')).length);
