#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = '/home/fdr/biblioteca-anarquista';
const FILE = `${ROOT}/src/data/timelineEvents.js`;
const { timelineEvents } = await import(pathToFileURL(FILE));

const NUEVOS = [
  { year: 1381, type: 'hecho', title: 'Revuelta de los campesinos de Inglaterra',
    description: 'La revuelta de 1381 (Wat Tyler y John Ball) cuestionó el orden feudal y la autoridad clerical, anticipando demandas de igualdad y autonomía.',
    region: 'Inglaterra', category: 'movimiento' },
  { year: 1430, type: 'hecho', title: 'Los taboritas husitas',
    description: 'La corriente radical de la reforma husita (Taboritas) practicó comunismo agrario y resistencia armada contra el poder imperial y eclesiástico en Bohemia.',
    region: 'Internacional', category: 'movimiento' },
  { year: 1525, type: 'hecho', title: 'Guerra de los Campesinos Alemanes',
    description: 'La gran sublevación campesina de 1524-1525, inspirada por Thomas Müntzer, reivindicó libertad, fin de la servidumbre y reparto de la tierra.',
    region: 'Alemania', category: 'movimiento' },
  { year: 1534, type: 'hecho', title: 'Los anabaptistas de Münster',
    description: 'Experimento comunitario anabaptista en Münster (1534-1535) que llevó la igualdad y la propiedad común hasta sus últimas consecuencias.',
    region: 'Alemania', category: 'movimiento' },
  { year: 1649, type: 'hecho', title: 'Los Diggers (Gerrard Winstanley)',
    description: 'Los "Diggers" o "Saqueadores de la tierra" de Winstanley ocuparon tierras comunales en 1649 reclamándolas como bien común frente a la propiedad privada.',
    region: 'Inglaterra', category: 'movimiento' },
];

for (const e of NUEVOS) {
  e.decade = String(Math.floor(Number(e.year) / 10) * 10) + 's';
  if (!timelineEvents.some((x) => x.year === e.year && x.title === e.title)) {
    timelineEvents.push(e);
  }
}
timelineEvents.sort((a, b) => a.year - b.year);

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
console.log('eventos totales ahora:', timelineEvents.length);
console.log('proto agregados:', NUEVOS.map((e) => e.year + ' ' + e.title).join(' | '));
