#!/usr/bin/env node
// Genera dos tablas .md desde la clasificacion:
//  - tabla-manual.md   : los libros con etiquetas manuales del usuario
//  - tabla-procesados.md: el resto ya clasificado como valido (teoria/historia)
// Empareja por NOMBRE DE ARCHIVO exacto (via titulos.json) para evitar fallos de slugify.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = '/home/fdr/biblioteca-anarquista/data/registros/revision330';

const titulos = JSON.parse(readFileSync(join(OUT, 'titulos.json'), 'utf8'));
const byFile = new Map(titulos.map((t) => [t.file, t]));
const bySlug = new Map(titulos.map((t) => [t.slug, t]));

// Resultados automaticos (lotes 01-23)
const resultados = new Map();
for (const f of readdirSync('/tmp/batches330').filter((f) => /^result_\d+\.json$/.test(f))) {
  const arr = JSON.parse(readFileSync(join('/tmp/batches330', f), 'utf8'));
  for (const r of arr) if (!resultados.has(r.slug)) resultados.set(r.slug, r);
}

// Conjuntos por archivo exacto
const manual = JSON.parse(readFileSync(join(OUT, 'clasificacion-manual.json'), 'utf8'));
const manualFiles = new Set(manual.map((m) => m.archivo));

const descartesTxt = readFileSync(join(OUT, 'descartes.txt'), 'utf8');
const descartesFiles = new Set(
  descartesTxt.split('\n').filter(Boolean).map((l) => l.split('\t')[0].trim())
);

const esc = (s) => String(s ?? '').replace(/\|/g, '/').replace(/\n/g, ' ').trim();
const info = (slug) => bySlug.get(slug) || {};

// ---- Tabla 1: manual ----
let md1 = '# Clasificacion manual (revision 330)\n\n';
md1 += '| Autor | Título | Tipo | Corriente | Mapa | Línea temporal |\n';
md1 += '|---|---|---|---|---|---|\n';
for (const m of manual) {
  const t = byFile.get(m.archivo) || {};
  const tipo = m.tipo;
  const corriente = tipo === 'teoria' ? (m.corriente || '') : '';
  const mapa = tipo === 'historia' ? (m.region || '') : '';
  const lt = [m.epoca_rango, m.epoca_etiqueta].filter(Boolean).join(' — ');
  md1 += `| ${esc(t.author || '')} | ${esc(t.title || m.archivo)} | ${esc(tipo)} | ${esc(corriente)} | ${esc(mapa)} | ${esc(lt)} |\n`;
}

// ---- Tabla 2: procesados (validos, no manual, no descartes) ----
const filas2 = [];
for (const [slug, r] of resultados) {
  if (!r.es_anarquista) continue;
  if (r.tipo !== 'teoria' && r.tipo !== 'historia') continue;
  const t = info(slug);
  if (!t.file) continue;
  if (manualFiles.has(t.file)) continue;
  if (descartesFiles.has(t.file)) continue;
  filas2.push({
    autor: t.author || '',
    titulo: t.title || slug,
    tipo: r.tipo,
    corriente: r.tipo === 'teoria' ? r.corriente : '',
    mapa: r.tipo === 'historia' ? r.region : '',
    linea: r.tipo === 'historia' ? r.epoca : '',
  });
}
filas2.sort((a, b) => a.autor.localeCompare(b.autor, 'es'));

let md2 = `# Procesados para subir (revision 330)\n\n`;
md2 += `_${filas2.length} libros clasificados como válidos (teoría/historia), excluyendo los ${manual.length} de etiqueta manual y los ${descartesFiles.size} descartes._\n\n`;
md2 += '| Autor | Título | Tipo | Corriente | Mapa | Línea temporal |\n';
md2 += '|---|---|---|---|---|---|\n';
for (const f of filas2) {
  md2 += `| ${esc(f.autor)} | ${esc(f.titulo)} | ${esc(f.tipo)} | ${esc(f.corriente)} | ${esc(f.mapa)} | ${esc(f.linea)} |\n`;
}

writeFileSync(join(OUT, 'tabla-manual.md'), md1, 'utf8');
writeFileSync(join(OUT, 'tabla-procesados.md'), md2, 'utf8');
console.log('tabla-manual.md:', manual.length, 'filas');
console.log('tabla-procesados.md:', filas2.length, 'filas');
