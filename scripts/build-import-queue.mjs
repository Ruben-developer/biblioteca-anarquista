#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = '/home/fdr/biblioteca-anarquista';
const SRC = '/home/fdr/Documentos/anarquismo_importado';
const CLA = `${ROOT}/data/registros/revision330/clasificacion-anarquista.md`;
const { regionData } = await import(pathToFileURL(`${ROOT}/src/data/regionData.js`));

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

// Catálogo actual (títulos ya presentes en regionData)
const catalogTitles = new Set();
for (const r of Object.values(regionData)) for (const b of r.books) if (b.title) catalogTitles.add(norm(b.title));

// PDFs fuente
function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.pdf$/i.test(e)) out.push(p);
  }
  return out;
}
const todos = walk(SRC);
const sourceNorm = todos.map((p) => norm(p.split('/').pop().replace(/\.pdf$/i, '')));

function enFuente(t) {
  if (t.length < 6) return false;
  return sourceNorm.some((n) => n.includes(t));
}

// Parsear la sección 2 (Plenamente Anarquistas)
const txt = readFileSync(CLA, 'utf8');
const ini = txt.indexOf('## 2.');
const sec = txt.slice(ini);

const entryRe = /^-\s+\*\*([^*]+)\*\*:\s*(.+)$/gm;
const autores = [];
let m;
while ((m = entryRe.exec(sec))) {
  const autor = m[1].trim();
  const bloque = m[2];
  // split por comas fuera de paréntesis
  const titulos = [];
  let depth = 0, cur = '';
  for (const ch of bloque) {
    if (ch === '(') depth++;
    else if (ch === ')') depth = Math.max(0, depth - 1);
    if (ch === ',' && depth === 0) { if (cur.trim()) titulos.push(cur.trim()); cur = ''; }
    else cur += ch;
  }
  if (cur.trim()) titulos.push(cur.trim());
  // limpiar la última si es un fragmento de nota
  const limpios = titulos.map((t) => t.replace(/\.$/, '').trim()).filter(Boolean);
  autores.push({ autor, titulos: limpios });
}

// Clasificar
let cCat = 0, cPend = 0, cNo = 0;
const salida = [];
for (const { autor, titulos } of autores) {
  const lineas = [];
  for (const t of titulos) {
    const nt = norm(t);
    let estado;
    if (catalogTitles.has(nt)) { estado = 'CAT'; cCat++; }
    else if (enFuente(nt)) { estado = 'PDF'; cPend++; }
    else { estado = 'NO'; cNo++; }
    lineas.push({ t, estado });
  }
  salida.push({ autor, lineas });
}

// Escribir .md
let md = '# Textos anarquistas pendientes de catalogar\n\n';
md += `Fuente: clasificacion-anarquista.md (sección 2). Cruce contra el catálogo actual (${catalogTitles.size} títulos) y los PDFs de la biblioteca fuente.\n\n`;
md += `## Resumen\n\n`;
md += `- **CAT** (ya en el catálogo, ignorar): ${cCat}\n`;
md += `- **PDF** (falta pero el PDF está en la fuente → candidato a importar): ${cPend}\n`;
md += `- **NO** (no encontrado en el catálogo ni en los PDF fuente): ${cNo}\n\n`;
md += `---\n\n`;

for (const { autor, lineas } of salida) {
  const pend = lineas.filter((l) => l.estado !== 'CAT');
  if (pend.length === 0) continue;
  md += `## ${autor}\n\n`;
  for (const l of pend) {
    const mark = l.estado === 'PDF' ? '[PDF]' : '[NO ]';
    md += `- ${mark} ${l.t}\n`;
  }
  md += '\n';
}

writeFileSync(`${ROOT}/data/registros/revision330/textos-anarquistas-pendientes.md`, md);

console.log(`Autores parseados: ${autores.length}`);
console.log(`Total títulos: ${autores.reduce((a, x) => a + x.titulos.length, 0)}`);
console.log(`CAT (ya catalogado): ${cCat}`);
console.log(`PDF (pendiente, PDF disponible): ${cPend}`);
console.log(`NO (no encontrado): ${cNo}`);
