#!/usr/bin/env node
// Une las clasificaciones de los 13 lotes con los metadatos y genera tabla.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = '/home/fdr/biblioteca-anarquista';
const OUT = join(ROOT, 'data/registros/revision330');
const RDIR = '/tmp/result192';
const tit = JSON.parse(readFileSync('/tmp/titulos192.json', 'utf8'));
const bySlug = new Map(tit.map((t) => [t.slug, t]));

const clas = [];
for (const f of readdirSync(RDIR).filter((x) => /^batch_\d+\.json$/.test(x))) {
  const arr = JSON.parse(readFileSync(join(RDIR, f), 'utf8'));
  for (const e of arr) clas.push(e);
}
console.log('clasificaciones leidas:', clas.length);

// unir con metadata
const merged = [];
const seen = new Set();
for (const e of clas) {
  const m = bySlug.get(e.slug);
  if (!m) { console.error('slug sin metadata:', e.slug); continue; }
  if (seen.has(e.slug)) continue;
  seen.add(e.slug);
  merged.push({
    file: m.file, author: m.author, title: m.title, year: m.year,
    tipo: e.tipo || '', region: e.region || '', epoca: e.epoca || '',
    corriente: e.corriente || '', nota: e.nota || '',
  });
}
console.log('unidas (unique):', merged.length);

const hist = merged.filter((m) => m.tipo === 'historia');
const teor = merged.filter((m) => m.tipo === 'teoria');
const otro = merged.filter((m) => m.tipo === 'otro');
console.log('historia:', hist.length, '| teoria:', teor.length, '| otro:', otro.length);

writeFileSync(join(OUT, 'clasificacion192.json'), JSON.stringify(merged, null, 2), 'utf8');

// Tabla markdown (mismo formato que las otras)
const esc = (s) => String(s || '').replace(/\|/g, '\\|').replace(/\n/g, ' ').trim();
let md = `# Clasificación de los 192 nuevos subidos\n\n`;
md += `_historia: ${hist.length} (con región → mapa + línea temporal) · teoría: ${teor.length} (solo corriente, sin región/mapa/timeline) · otro: ${otro.length} (candidatos a descarte)_\n\n`;
md += `| Autor | Título | Tipo | Corriente | Mapa | Línea temporal | Nota |\n`;
md += `|---|---|---|---|---|---|---|\n`;
for (const m of merged) {
  md += `| ${esc(m.author)} | ${esc(m.title)} | ${esc(m.tipo)} | ${esc(m.corriente)} | ${esc(m.region)} | ${esc(m.epoca)} | ${esc(m.nota)} |\n`;
}
writeFileSync(join(OUT, 'tabla-nuevos-clasificados.md'), md, 'utf8');
console.log('escritos clasificacion192.json + tabla-nuevos-clasificados.md');
