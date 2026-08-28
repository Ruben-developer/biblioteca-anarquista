#!/usr/bin/env node
// Convierte la clasificacion previa (meta.json de llama3.2:3b) al mismo formato
// de tabla que las tablas de revision330.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = '/home/fdr/biblioteca-anarquista/data/registros/clasificacion';
const esc = (s) => String(s ?? '').replace(/\|/g, '/').replace(/\n/g, ' ').trim();

const metas = [];
for (const f of readdirSync(DIR)) {
  if (!f.endsWith('.meta.json')) continue;
  const m = JSON.parse(readFileSync(join(DIR, f), 'utf8'));
  if (!m.tipo) continue;
  metas.push(m);
}

metas.sort((a, b) => (a.autor || '').localeCompare(b.autor || '', 'es'));

let md = '# Clasificación previa — pendientes (llama3.2:3b)\n\n';
md += `_${metas.length} PDFs pendientes clasificados con llama3.2:3b. Todos ya figuraban en la página (duplicados); se conserva para registro._\n\n`;
md += '| Autor | Título | Tipo | Corriente | Mapa | Línea temporal |\n';
md += '|---|---|---|---|---|---|\n';
for (const m of metas) {
  const tipo = m.tipo;
  const corriente = tipo === 'teoria' ? (m.corriente || '') : '';
  const mapa = tipo === 'historia' ? (m.region || '') : '';
  const linea = tipo === 'historia' ? (m.epoca || '') : '';
  md += `| ${esc(m.autor)} | ${esc(m.titulo)} | ${esc(tipo)} | ${esc(corriente)} | ${esc(mapa)} | ${esc(linea)} |\n`;
}
writeFileSync(join(DIR, 'tabla-pendientes.md'), md, 'utf8');
console.log('tabla-pendientes.md:', metas.length, 'filas');
