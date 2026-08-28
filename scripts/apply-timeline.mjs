#!/usr/bin/env node
// Aplica /tmp/timelinePlan.json a src/data/timelineEvents.js.
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = '/home/fdr/biblioteca-anarquista';
const FILE = `${ROOT}/src/data/timelineEvents.js`;
const PLAN = '/tmp/timelinePlan.json';

const { timelineEvents } = await import(pathToFileURL(FILE));
const plan = JSON.parse(readFileSync(PLAN, 'utf8'));

// --- apply modify ---
let modCount = 0;
for (const m of plan.modify) {
  const ev = timelineEvents.find((e) => e.title === m.eventTitle);
  if (!ev) { console.error('NO encontrado para modificar:', m.eventTitle); continue; }
  ev.relatedTexts = ev.relatedTexts || [];
  for (const t of m.addRelatedTexts) {
    if (!ev.relatedTexts.includes(t)) { ev.relatedTexts.push(t); modCount++; }
  }
  if (ev.type === 'hecho') ev.type = 'con_texto';
}
console.log('relacionados añadidos a eventos existentes:', modCount);

// --- apply newEvents ---
function decadeOf(y) { const d = Math.floor(Number(y) / 10) * 10; return `${d}0s`; }
let newCount = 0;
for (const e of plan.newEvents) {
  const ev = { ...e, decade: decadeOf(e.year), type: 'con_texto' };
  timelineEvents.push(ev);
  newCount++;
}
console.log('eventos nuevos añadidos:', newCount);

// --- serialize preserving header comment ---
const raw = readFileSync(FILE, 'utf8');
const marker = 'export const timelineEvents = [';
const idx = raw.indexOf(marker);
const header = raw.slice(0, idx); // comment block

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
const out = header + marker + '\n' + body + '\n];\n';
writeFileSync(FILE, out, 'utf8');
console.log('eventos totales ahora:', timelineEvents.length);
