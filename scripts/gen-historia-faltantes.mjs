#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = '/home/fdr/biblioteca-anarquista';
const { regionData } = await import(pathToFileURL(`${ROOT}/src/data/regionData.js`));
const { timelineEvents } = await import(pathToFileURL(`${ROOT}/src/data/timelineEvents.js`));

const HIST = ['historia', 'revolucion', 'movimiento', 'organizacion', 'represion', 'periodismo', 'manifiesto'];
const enlazados = new Set();
for (const e of timelineEvents) for (const t of (e.relatedTexts || [])) enlazados.add(t);

const faltan = [];
for (const [region, r] of Object.entries(regionData)) {
  for (const b of r.books) {
    if (HIST.includes(b.category) && !enlazados.has(b.title)) {
      faltan.push({ title: b.title, author: b.author || '(s/a)', category: b.category, region });
    }
  }
}
faltan.sort((a, b) => a.title.localeCompare(b.title, 'es'));

const porCat = {};
for (const f of faltan) porCat[f.category] = (porCat[f.category] || 0) + 1;
const cats = Object.entries(porCat).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}: ${v}`).join(' · ');

let out = `# Libros de HISTORIA del catálogo NO enlazados en la línea temporal (para revisar)\n\n`;
out += `Total historia-catálogo no enlazado: ${faltan.length}  |  por categoría: ${cats}\n\n`;
for (const f of faltan) out += `- ${f.title} · ${f.author}  _(${f.category}, ${f.region})_\n`;

const file = `${ROOT}/data/registros/revision330/textos-historia-faltantes.md`;
writeFileSync(file, out, 'utf8');
console.log('escrito:', file, '| historia faltante:', faltan.length);
