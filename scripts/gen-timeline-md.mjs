#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = '/home/fdr/biblioteca-anarquista';
const { timelineEvents } = await import(pathToFileURL(`${ROOT}/src/data/timelineEvents.js`));
const { regionData } = await import(pathToFileURL(`${ROOT}/src/data/regionData.js`));

const libros = {};
for (const r of Object.values(regionData)) for (const b of r.books) libros[b.title] = b;

const byTitle = {};
for (const e of timelineEvents) byTitle[e.title] = e;

function bloque(eventos) {
  const evs = [...eventos].sort((a, b) => a.year - b.year);
  let out = '';
  for (const e of evs) {
    out += `\n## ${e.year} — ${e.title}\n`;
    const rts = e.relatedTexts || [];
    if (!rts.length) {
      out += '_sin textos asociados_\n';
    } else {
      const lineas = rts.map((t) => {
        const b = libros[t];
        if (!b) return `  - ⚠ no encontrado en catálogo: ${t}`;
        const anio = b.year != null ? b.year : '(s/a)';
        const autor = b.author != null ? b.author : '(s/a)';
        return `  - ${anio} · ${b.title} · ${autor}`;
      });
      out += lineas.join('\n') + '\n';
    }
  }
  return out;
}

// LISTA 1: timeline actual (todos los eventos)
const actual = `# Timeline actual — eventos y textos asociados\n\n` +
  `Total de eventos: ${timelineEvents.length}\n` + bloque(timelineEvents);

// LISTA 2: propuesta breve (hitos)
const propuestas = [
  'Revuelta de los campesinos de Inglaterra',
  'Guerra de los Campesinos Alemanes',
  'Los Diggers (Gerrard Winstanley)',
  'Pedro Kropotkin',
  'Llegada del anarquismo a España',
  'Bakunin y Necháiev: el Catecismo Revolucionario',
  'La Comuna de París',
  'Mártires de Chicago',
  'La masacre de la Escuela Santa María de Iquique',
  'Semana Trágica de Barcelona',
  'Fundación de la CNT',
  'La Revolución Mexicana',
  'Revolución en Baja California',
  'Semana Trágica Buenos Aires',
  'Rebelión de Kronstadt',
  'Las huelgas de la Patagonia Rebelde',
  'El Expediente Picasso y el Desastre de Annual',
  'Ejecución de Sacco y Vanzetti',
  'La Comuna de Shinmin',
  'Revolución Española',
  'Represión franquista y exilio',
  'La resistencia anarquista italiana al fascismo',
  'Mayo del 68',
  'La fuga de Punta Carretas',
  'Jornadas Libertarias de Barcelona',
  'Okupación y autogestión en Madrid',
  'Levantamiento zapatista en Chiapas',
  'Batalla de Seattle',
  'Contracumbre de Génova',
  'Movimiento 15M (Los Indignados)',
  'Autonomía democrática de Rojava',
].map((t) => byTitle[t]).filter(Boolean);

const propuesta = `# Propuesta de timeline breve — hitos y textos asociados\n\n` +
  `Eventos seleccionados: ${propuestas.length}\n` + bloque(propuestas);

const dir = `${ROOT}/data/registros/revision330`;
writeFileSync(`${dir}/timeline-actual.md`, actual, 'utf8');
writeFileSync(`${dir}/timeline-propuesta.md`, propuesta, 'utf8');
console.log('escritos:', `${dir}/timeline-actual.md`, 'y', `${dir}/timeline-propuesta.md`);
