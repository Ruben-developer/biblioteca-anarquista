#!/usr/bin/env node
// Integra los 167 validos (84 historia + 83 teoria) en src/data/regionData.js.
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = '/home/fdr/biblioteca-anarquista';
const RD = `${ROOT}/src/data/regionData.js`;
const CLAS = `${ROOT}/data/registros/revision330/clasificacion192.json`;

const regionData = (await import(pathToFileURL(RD))).regionData;

const clas = JSON.parse(readFileSync(CLAS, 'utf8'));
const valid = clas.filter((m) => m.tipo !== 'otro');

// mapa mi region -> clave existente en regionData
const REGION_MAP = {
  'Espana': 'España', 'Espana/Cataluna': 'España', 'Mexico': 'México',
  'Japon': 'Japón', 'Reino Unido': 'Inglaterra',
  'Argentina': 'Argentina', 'Alemania': 'Alemania', 'Estados Unidos': 'Estados Unidos',
  'Francia': 'Francia', 'Rusia': 'Rusia', 'Internacional': 'Internacional',
  'Belgica': 'Bélgica',
};

// filenames ya catalogados (evitar duplicados)
const existingFiles = new Set();
for (const r of Object.values(regionData)) for (const b of r.books || []) if (b.filename) existingFiles.add(b.filename);

const byRegion = {}; // regionKey -> [entry]
let added = 0, skipped = 0;
for (const m of valid) {
  if (existingFiles.has(m.file)) { skipped++; continue; }
  const isHist = m.tipo === 'historia';
  const regionKey = isHist ? (REGION_MAP[m.region] || 'Internacional') : 'Internacional';
  const yearNum = /^\d{4}$/.test(String(m.year)) ? Number(m.year) : null;
  const entry = {
    title: m.title,
    author: m.author,
    ...(yearNum ? { year: yearNum } : {}),
    category: isHist ? 'historia' : 'teoria',
    rating: 4.5,
    filename: m.file,
  };
  (byRegion[regionKey] ||= []).push(entry);
  added++;
}

// insertar
for (const [key, books] of Object.entries(byRegion)) {
  if (regionData[key]) {
    regionData[key].books.push(...books);
  } else {
    const iso = { 'Bélgica': 'be' }[key] || 'xx';
    regionData[key] = { iso, books };
  }
}

function serialize(rd) {
  const lines = ['export const regionData = {'];
  const regions = Object.keys(rd);
  regions.forEach((region, ri) => {
    const { iso, books } = rd[region];
    lines.push(`  ${JSON.stringify(region)}: {`);
    lines.push(`    iso: ${JSON.stringify(iso)},`);
    lines.push(`    books: [`);
    books.forEach((b, bi) => {
      const f = [];
      f.push(`title: ${JSON.stringify(b.title)}`);
      if (b.author) f.push(`author: ${JSON.stringify(b.author)}`);
      if (b.year != null) f.push(`year: ${b.year}`);
      if (b.category) f.push(`category: ${JSON.stringify(b.category)}`);
      if (b.rating != null) f.push(`rating: ${b.rating}`);
      if (b.summary) f.push(`summary: ${JSON.stringify(b.summary)}`);
      if (b.filename) f.push(`filename: ${JSON.stringify(b.filename)}`);
      const comma = bi < books.length - 1 ? ',' : '';
      lines.push(`      { ${f.join(', ')} }${comma}`);
    });
    lines.push(`    ]`);
    lines.push(`  }${ri < regions.length - 1 ? ',' : ''}`);
  });
  lines.push('};');
  return lines.join('\n') + '\n';
}

writeFileSync(RD, serialize(regionData), 'utf8');
console.log('agregados:', added, '| omitidos (ya catalogados):', skipped);
console.log('total regiones:', Object.keys(regionData).length, '| total libros:', Object.values(regionData).reduce((s, r) => s + r.books.length, 0));
