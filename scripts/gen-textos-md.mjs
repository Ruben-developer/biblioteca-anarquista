#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = '/home/fdr/biblioteca-anarquista';
const { regionData } = await import(pathToFileURL(`${ROOT}/src/data/regionData.js`));

const libros = [];
for (const [region, r] of Object.entries(regionData)) {
  for (const b of r.books) {
    libros.push({
      title: b.title,
      author: b.author != null ? b.author : '(s/a)',
      category: b.category || '(s/t)',
      region,
    });
  }
}
libros.sort((a, b) => a.title.localeCompare(b.title, 'es'));

const total = libros.length;
const porTipo = {};
for (const l of libros) porTipo[l.category] = (porTipo[l.category] || 0) + 1;
const tipos = Object.entries(porTipo).sort((a, b) => b[1] - a[1])
  .map(([k, v]) => `${k}: ${v}`).join(' · ');

let out = `# Catálogo completo de textos — título · autor · tipo\n\n`;
out += `Total: ${total}  |  por tipo: ${tipos}\n\n`;
for (const l of libros) {
  out += `- ${l.title} · ${l.author} · ${l.category}\n`;
}

const file = `${ROOT}/data/registros/revision330/textos.md`;
writeFileSync(file, out, 'utf8');
console.log('escrito:', file, '| total:', total);
