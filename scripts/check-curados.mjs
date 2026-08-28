#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = '/home/fdr/biblioteca-anarquista';
const { regionData } = await import(pathToFileURL(`${ROOT}/src/data/regionData.js`));

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');

const catPorNorm = new Map();
for (const [region, r] of Object.entries(regionData)) {
  for (const b of r.books) {
    const k = norm(b.title);
    if (!catPorNorm.has(k)) catPorNorm.set(k, []);
    catPorNorm.get(k).push({ title: b.title, category: b.category, region });
  }
}

const lineas = readFileSync(`${ROOT}/data/registros/revision330/curados-historia.txt`, 'utf8')
  .split('\n').map((l) => l.trim()).filter(Boolean);

let found = 0, missing = 0, teoria = 0;
const faltan = [], teoriaList = [];
for (const t of lineas) {
  const k = norm(t);
  const m = catPorNorm.get(k);
  if (!m) { missing++; faltan.push(t); continue; }
  found++;
  const cats = m.map((x) => x.category);
  if (cats.includes('teoria')) { teoria++; teoriaList.push(`${t}  ->  [${m.map((x) => x.category).join(', ')}]`); }
}

console.log(`Total títulos curados: ${lineas.length}`);
console.log(`Encontrados en regionData: ${found}`);
console.log(`Faltantes: ${missing}`);
console.log(`Marcados como 'teoria': ${teoria}\n`);

if (teoriaList.length) {
  console.log('=== TÍTULOS CUYRADOS QUE ESTÁN COMO TEORÍA (revisar) ===');
  console.log(teoriaList.join('\n'));
}
if (faltan.length) {
  console.log('\n=== FALTANTES EN EL CATÁLOGO ===');
  console.log(faltan.join('\n'));
}
// también: curados que aparecen pero con categoría no-histórica (dialogo/otros)
const noHist = [];
for (const t of lineas) {
  const m = catPorNorm.get(norm(t));
  if (m && m.some((x) => ['dialogo', 'otros'].includes(x.category))) {
    noHist.push(`${t} -> ${m.map((x) => x.category).join(', ')}`);
  }
}
if (noHist.length) {
  console.log('\n=== CUYRADOS CON CATEGORÍA NO-HISTÓRICA (dialogo/otros) ===');
  console.log(noHist.join('\n'));
}
