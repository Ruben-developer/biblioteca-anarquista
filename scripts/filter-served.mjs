#!/usr/bin/env node
// Cruza los 71 pendientes contra pdfs-local usando similitud de títulos
// (formato servido "Autor - Título (año).pdf") para detectar duplicados reales.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';

const PDFS = '/home/fdr/Documentos/anarquismo_importado/PDFs';
const LOCAL = '/home/fdr/biblioteca-anarquista/pdfs-local';
const OUT = '/home/fdr/biblioteca-anarquista/data/registros/clasificacion';
const SRC = ['sin_clasificar', 'otros', 'Revisar_otros_idiomas'];
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
function bigrams(s) { const n = norm(s); const b = new Set(); for (let i = 0; i < n.length - 1; i++) b.add(n.slice(i, i + 2)); return b; }
function dice(a, b) { const A = bigrams(a), B = bigrams(b); if (!A.size || !B.size) return 0; let inter = 0; for (const x of A) if (B.has(x)) inter++; return 2 * inter / (A.size + B.size); }
function servedTitle(f) { const m = /^(.*?)\s+-\s+(.*?)(?:\s+\(\d{4}\))?\s*\.pdf$/i.exec(f); return m ? m[2] : f.replace(/\.pdf$/i, ''); }
function slugify(n) { return n.replace(/\.pdf$/i, '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
function gather() { const out = []; for (const d of SRC) { const base = join(PDFS, d); if (!existsSync(base)) continue; const walk = (dir) => { for (const e of readdirSync(dir, { withFileTypes: true })) { const p = join(dir, e.name); if (e.isDirectory()) walk(p); else if (e.name.toLowerCase().endsWith('.pdf')) out.push(p); } }; walk(base); } return out; }

const localFiles = readdirSync(LOCAL).filter((f) => f.toLowerCase().endsWith('.pdf'));
const src = gather();
const rows = [], dups = [], nuevos = [], dudosos = [];
for (const pdf of src) {
  const base = basename(pdf); const slug = slugify(base);
  const metaPath = join(OUT, `${slug}.meta.json`);
  const m = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, 'utf8')) : {};
  const query = norm(m.titulo || base);
  let best = 0, bestF = '';
  for (const f of localFiles) { const sc = Math.max(dice(query, servedTitle(f)), dice(query, f.replace(/\.pdf$/i, ''))); if (sc > best) { best = sc; bestF = f; } }
  const enPagina = best >= 0.6; const dudoso = !enPagina && best >= 0.42;
  const det = m.tipo === 'historia' ? `${m.region} · ${m.epoca}` : m.tipo === 'teoria' ? (m.corriente || '') : (m.nota_otro || '');
  rows.push({ base, slug, score: best, enPagina, dudoso, served: bestF, tipo: m.tipo || '', anar: m.es_anarquista ? 'S' : m.es_anarquista === false ? 'N' : '?', es: m.es_espanol ? 'S' : m.es_espanol === false ? 'N' : '?', titulo: m.titulo || '?', autor: m.autor || '?', anio: m.anio || '?', region: m.region || '?', det });
  if (enPagina) dups.push({ base, served: bestF, score: best.toFixed(2) });
  else if (dudoso) dudosos.push({ base, served: bestF, score: best.toFixed(2) });
  else nuevos.push({ base, slug });
}
let md = `# Clasificación local — llama3.2:3b (cruce con página)\n\nGenerado: ${new Date().toISOString().slice(0, 16).replace('T', ' ')}\n`;
md += `Total pendientes: ${src.length} | Ya en página (dup>=0.60): ${dups.length} | Dudosos (0.42-0.60): ${dudosos.length} | Nuevos: ${nuevos.length}\n\n`;
md += `| # | en_pag | score | tipo | A | ES | título | autor | año | detalle | servido_como |\n|---|--------|-------|------|---|----|-------|-------|-----|--------|-------------|\n`;
rows.sort((a, b) => (a.enPagina === b.enPagina ? 0 : a.enPagina ? -1 : 1)).forEach((r, i) => {
  md += `| ${i + 1} | ${r.enPagina ? 'SÍ' : (r.dudoso ? '?' : 'no')} | ${r.score.toFixed(2)} | ${r.tipo} | ${r.anar} | ${r.es} | ${r.titulo} | ${r.autor} | ${r.anio} | ${r.det} | ${r.enPagina || r.dudoso ? r.served : ''} |\n`;
});
writeFileSync(join(OUT, 'review.md'), md, 'utf8');
writeFileSync(join(OUT, 'nuevos.txt'), nuevos.map((x) => x.base).join('\n') + '\n', 'utf8');
writeFileSync(join(OUT, 'dups.txt'), dups.map((x) => `${x.base}  <=>  ${x.served}  (${x.score})`).join('\n') + '\n', 'utf8');
writeFileSync(join(OUT, 'dudosos.txt'), dudosos.map((x) => `${x.base}  <=>  ${x.served}  (${x.score})`).join('\n') + '\n', 'utf8');
console.log(`pendientes=${src.length}  ya_en_pagina=${dups.length}  dudosos=${dudosos.length}  nuevos=${nuevos.length}`);
console.log('\n--- DUDOSOS (revisar manualmente) ---');
dudosos.forEach((d) => console.log(`(${d.score}) ${d.base}  <=>  ${d.served}`));
console.log('\nreview.md / nuevos.txt / dups.txt / dudosos.txt en', OUT);
