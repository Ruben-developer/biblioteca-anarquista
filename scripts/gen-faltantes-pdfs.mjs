#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = '/home/fdr/biblioteca-anarquista';
const SRC = '/home/fdr/Documentos/anarquismo_importado';
const { regionData } = await import(pathToFileURL(`${ROOT}/src/data/regionData.js`));

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const catalogo = new Set();
for (const r of Object.values(regionData)) for (const b of r.books) if (b.filename) catalogo.add(norm(b.filename));

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.pdf$/i.test(e)) out.push(p);
  }
  return out;
}
const todos = walk(SRC);

function parse(base) {
  let s = base.replace(/\.pdf$/i, '');
  let year = '';
  const m = s.match(/\((\d{3,4})\)\s*$/);
  if (m) { year = m[1]; s = s.slice(0, m.index).trim(); }
  let author = '(s/a)', title = s;
  const i = s.indexOf(' - ');
  if (i > 0) { author = s.slice(0, i).trim(); title = s.slice(i + 3).trim(); }
  else { const i2 = s.indexOf(' — '); if (i2 > 0) { author = s.slice(0, i2).trim(); title = s.slice(i2 + 3).trim(); } }
  return { title, author, year };
}

const faltan = [];
let yaCatalogados = 0;
for (const p of todos) {
  const base = p.split('/').pop();
  if (catalogo.has(norm(base))) { yaCatalogados++; continue; }
  const { title, author, year } = parse(base);
  faltan.push({ title, author, year });
}
faltan.sort((a, b) => a.title.localeCompare(b.title, 'es'));

let out = `# Textos SIN CATALOGAR (~4500 PDFs fuente)\n\n`;
out += `PDFs fuente totales: ${todos.length}  |  ya catalogados: ${yaCatalogados}  |  **faltantes (este listado): ${faltan.length}**\n`;
out += `_Nota: título y autor se parsian del nombre de archivo; pueden necesitar limpieza._\n\n`;
for (const f of faltan) out += `- ${f.title} · ${f.author}${f.year ? ' (' + f.year + ')' : ''}\n`;

const file = `${ROOT}/data/registros/revision330/textos-faltantes-pdfs.md`;
writeFileSync(file, out, 'utf8');
console.log('escrito:', file, '| fuente:', todos.length, '| ya catalogados:', yaCatalogados, '| faltantes:', faltan.length);
