#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
const ROOT = '/home/fdr/biblioteca-anarquista';
const MD = `${ROOT}/data/registros/revision330/clasificacion-fuentes.md`;

const txt = readFileSync(MD, 'utf8');

function parse(base) {
  let s = base.replace(/\.pdf$/i, '');
  let year = '';
  const m = s.match(/\((\d{3,4})\)\s*$/);
  if (m) { year = m[1]; s = s.slice(0, m.index).trim(); }
  let author = '(s/a)', title = s;
  const i = s.indexOf(' - ');
  if (i > 0) { author = s.slice(0, i).trim(); title = s.slice(i + 3).trim(); }
  else { const i2 = s.indexOf(' — '); if (i2 > 0) { author = s.slice(0, i2).trim(); title = s.slice(i2 + 3).trim(); } }
  return { title, author, year };
}

// Extraer secciones
const secciones = {};
let cur = null;
for (const line of txt.split('\n')) {
  const h = line.match(/^## (.+?) \(\d+\)$/);
  if (h) { cur = h[1].trim(); secciones[cur] = []; continue; }
  if (cur && line.startsWith('- ')) secciones[cur].push(line.slice(2).trim());
}

function emit(nombre, arr) {
  const filas = arr.map((b) => parse(b));
  filas.sort((a, b) => (a.author + a.title).localeCompare(b.author + b.title, 'es'));
  let md = `# ${nombre} — título · autor\n\n`;
  md += `Total: ${arr.length}\n\n`;
  md += `_título y autor parsados del nombre de archivo; pueden necesitar limpieza._\n\n`;
  for (const f of filas) md += `- ${f.title} · ${f.author}\n`;
  return md;
}

const anarq = secciones['Anarquistas (candidatos a importar)'] || [];
const indet = secciones['Indeterminado (revisar manualmente)'] || [];

writeFileSync(`${ROOT}/data/registros/revision330/anarquistas.md`, emit('Textos anarquistas (sin catalogar)', anarq));
writeFileSync(`${ROOT}/data/registros/revision330/indeterminado.md`, emit('Textos indeterminados (sin catalogar, revisar)', indet));
console.log('anarquistas.md:', anarq.length, '| indeterminado.md:', indet.length);
