#!/usr/bin/env node
// Corrige el campo `decade` de todos los eventos (habia un 0 de mas: 19100s -> 1910s).
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = '/home/fdr/biblioteca-anarquista';
const FILE = `${ROOT}/src/data/timelineEvents.js`;
const { timelineEvents } = await import(pathToFileURL(FILE));

let fixed = 0;
for (const e of timelineEvents) {
  const d = String(Math.floor(Number(e.year) / 10) * 10) + 's';
  if (e.decade !== d) { fixed++; e.decade = d; }
}
console.log('decades corregidos:', fixed);

const raw = readFileSync(FILE, 'utf8');
const marker = 'export const timelineEvents = [';
const idx = raw.indexOf(marker);
const header = raw.slice(0, idx);

function serEvent(e, ind) {
  const f = [];
  f.push(`year: ${e.year}`);
  f.push(`decade: ${JSON.stringify(e.decade)}`);
  f.push(`type: ${JSON.stringify(e.type)}`);
  f.push(`title: ${JSON.stringify(e.title)}`);
  f.push(`description: ${JSON.stringify(e.description)}`);
  f.push(`region: ${JSON.stringify(e.region)}`);
  f.push(`category: ${JSON.stringify(e.category)}`);
  if (e.image) f.push(`image: ${JSON.stringify(e.image)}`);
  if (e.quote) f.push(`quote: ${JSON.stringify(e.quote)}`);
  if (e.author) f.push(`author: ${JSON.stringify(e.author)}`);
  if (e.relatedTexts && e.relatedTexts.length) {
    f.push(`relatedTexts: [${e.relatedTexts.map((t) => JSON.stringify(t)).join(', ')}]`);
  }
  return `${ind}{\n${ind}  ${f.join(',\n' + ind + '  ')}\n${ind}}`;
}

const body = timelineEvents.map((e, i) => serEvent(e, '  ') + (i < timelineEvents.length - 1 ? ',' : '')).join('\n');
writeFileSync(FILE, header + marker + '\n' + body + '\n];\n', 'utf8');

// verificacion
const bad = timelineEvents.filter((e) => !/^\d{4}s$/.test(e.decade));
console.log('decades aun anomalos:', bad.length);
