#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = '/home/fdr/biblioteca-anarquista';
const { regionData } = await import(pathToFileURL(`${ROOT}/src/data/regionData.js`));
const { timelineEvents } = await import(pathToFileURL(`${ROOT}/src/data/timelineEvents.js`));

const enlazados = new Set();
for (const e of timelineEvents) for (const t of (e.relatedTexts || [])) enlazados.add(t);

const faltan = [];
for (const [region, r] of Object.entries(regionData)) {
  for (const b of r.books) {
    if (!enlazados.has(b.title)) faltan.push({ title: b.title, author: b.author || '(s/a)', category: b.category || '?', region });
  }
}
faltan.sort((a, b) => a.title.localeCompare(b.title, 'es'));

const porCat = {};
for (const f of faltan) porCat[f.category] = (porCat[f.category] || 0) + 1;
const cats = Object.entries(porCat).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}: ${v}`).join(' · ');

let out = `# Textos del catálogo NO enlazados en la línea temporal\n\n`;
out += `Total catálogo: ${Object.values(regionData).reduce((s, r) => s + r.books.length, 0)}  |  enlazados en timeline: ${enlazados.size}  |  **faltantes: ${faltan.length}**\n`;
out += `Por categoría: ${cats}\n\n`;
for (const f of faltan) out += `- ${f.title} · ${f.author}  _(${f.category}, ${f.region})_\n`;

const file = `${ROOT}/data/registros/revision330/textos-faltantes.md`;
writeFileSync(file, out, 'utf8');
console.log('escrito:', file, '| faltantes:', faltan.length);
