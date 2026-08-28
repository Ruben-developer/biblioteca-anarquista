#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = '/home/fdr/biblioteca-anarquista';
const SRC = '/home/fdr/Documentos/anarquismo_importado';
const { regionData } = await import(pathToFileURL(`${ROOT}/src/data/regionData.js`));

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

// ---- Catálogo actual (para excluir ya catalogados y como señal de autor anarquista) ----
const catalogo = new Set();
const catalogAutores = new Set();
for (const r of Object.values(regionData)) for (const b of r.books) {
  if (b.filename) catalogo.add(norm(b.filename));
  if (b.author) catalogAutores.add(b.author);
}

// Autores del catálogo en ambos órdenes (nombre apellido / apellido nombre)
function ordenes(a) {
  const p = a.split(/[,\.]/).map((x) => x.trim()).filter(Boolean);
  const full = p.join('');
  const rev = [...p].reverse().join('');
  return [full, rev].map(norm).filter(Boolean);
}
const anarqSet = new Set();
for (const a of catalogAutores) for (const o of ordenes(a)) anarqSet.add(o);

// Tokens adicionales de autores anarquistas (de la clasificación del usuario)
const anarqTokens = ['bakunin','kropotkin','proudhon','malatesta','stirner','reclus','nettlau','faure','majn','arshinov','volin','goldman','berkman','magn','santilln','rocker','lorenzo','mella','clamunt','fabbri','libertad','armand','novatore','peir','seg','pesta','montseny','barrett','prada','ferrer','bookchin','bonanno','amors','graeber','gelderloos','cappelletti','bayer','guillamn','ealham','rosell','mintz','lida','gme','paz','vadillo','muozcorts','godoy','ib','taibo','adams','fernndezcordero','roca','crimethinc','tiqqun','comit'];
for (const t of anarqTokens) anarqSet.add(t);

// ---- Descartes: autores/no-anarquista (de la sección 1 del usuario) ----
// grupo -> lista de tokens (nombre completo en ambos órdenes + apellido)
const descartes = {
  ficcion: ['camus','kafka','tolstoi','tolstoy','levtolstoi','wilde','leguin','ursulakleguin','dariofo','francarame','orwell','georgeorwell','btraven','traven','cesrfalcn','hildegart','alfonsomartnez','salvadorsediles','augustovivero','ramnfranco','gkosinka','antoniojimnez','rodrigosoriano','emadarasz','sadreddinea','ramnmagre','josantoniobalbotn','novelaproletaria'],
  marxismo: ['karlmarx','marx','friedrichengels','engels','lenin','kautsky','bujarin'],
  linguistica: ['noamchomsky','chomsky'],
  filosofia: ['bertrandrussell','russell','paulfeyerabend','feyerabend','michelonfray','onfray','aristteles','aristoteles','pierreclastres','clastres'],
  guerrilla: ['carlosmarighella','marighella','ricardopalmasalamanca','palmasalamanca','fpmr'],
};
const descSet = {}; // token -> grupo
for (const [g, toks] of Object.entries(descartes)) for (const t of toks) descSet[t] = g;

// ---- Basura / metadatos rotos ----
const basuraToks = ['presentaci','afiche','panfletocristian','thejolly','f101','f135','dump','tmp'];
const esBasura = (n) => basuraToks.some((t) => n.includes(t)) || /^\w{0,3}\d{6,}/.test(n);

// ---- Recorrer fuente ----
function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.pdf$/i.test(e)) out.push(p);
  }
  return out;
}
const todos = walk(SRC);

function autorDe(base) {
  let s = base.replace(/\.pdf$/i, '');
  s = s.replace(/\s*\(\d{3,4}\)\s*$/, '').trim();
  const i = s.indexOf(' - ');
  if (i > 0) return s.slice(0, i).trim();
  const i2 = s.indexOf(' — ');
  if (i2 > 0) return s.slice(0, i2).trim();
  return '';
}

const grupos = { anarquista: [], ficcion: [], marxismo: [], linguistica: [], filosofia: [], guerrilla: [], basura: [], indeterminado: [] };

for (const p of todos) {
  const base = p.split('/').pop();
  if (catalogo.has(norm(base))) continue; // ya catalogado
  const nb = norm(base);
  const autor = autorDe(base);
  const na = norm(autor);

  if (esBasura(nb)) { grupos.basura.push(base); continue; }

  // Descartes por autor
  let encontrado = null;
  if (na) {
    for (const tok of Object.keys(descSet)) {
      if (na === tok || na.includes(tok)) { encontrado = descSet[tok]; break; }
    }
  }
  if (encontrado) { grupos[encontrado].push(base); continue; }

  // Anarquista por autor
  if (na && (anarqSet.has(na) || [...anarqSet].some((t) => t.length >= 4 && (na === t || na.includes(t))))) {
    grupos.anarquista.push(base); continue;
  }

  grupos.indeterminado.push(base);
}

// ---- Segunda pasada: heurística sobre indeterminado (autor embebido o keywords) ----
const anarqKw = ['acracia','anarqu','sindical','fora','fai','iww','libertari','comunismolibertario','kropotkin','bakunin','malatesta','proudhon','stirner','reclus','nettlau','faure','majn','rocker','lorenzo','mella','fabbri','goldman','berkman','magn','santilln','montseny','barrett','prada','ferrer','bookchin','bonanno','amors','graeber','gelderloos','cappelletti','bayer','crimethinc','tiqqun'];
const ind = grupos.indeterminado;
grupos.indeterminado = [];
for (const base of ind) {
  const nb = norm(base);
  let moved = false;
  for (const tok of Object.keys(descSet)) { if (nb.includes(tok)) { grupos[descSet[tok]].push(base); moved = true; break; } }
  if (moved) continue;
  if (anarqKw.some((t) => nb.includes(t))) { grupos.anarquista.push(base); continue; }
  grupos.indeterminado.push(base);
}

// ---- Resumen ----
const total = Object.values(grupos).reduce((a, x) => a + x.length, 0);
console.log('Total sin catalogar clasificados:', total);
console.log('anarquista        :', grupos.anarquista.length);
console.log('descarte ficcion  :', grupos.ficcion.length);
console.log('descarte marxismo :', grupos.marxismo.length);
console.log('descarte linguist :', grupos.linguistica.length);
console.log('descarte filosofia:', grupos.filosofia.length);
console.log('descarte guerrilla:', grupos.guerrilla.length);
console.log('descarte basura   :', grupos.basura.length);
console.log('indeterminado     :', grupos.indeterminado.length);

// ---- MD ----
let md = '# Clasificación de la biblioteca fuente (PDFs sin catalogar)\n\n';
md += `Total sin catalogar: **${total}**\n\n`;
md += `| Grupo | Cantidad |\n|---|---:|\n`;
md += `| Anarquistas (importar) | ${grupos.anarquista.length} |\n`;
md += `| Descarte: ficción/literatura | ${grupos.ficcion.length} |\n`;
md += `| Descarte: marxismo/leninismo | ${grupos.marxismo.length} |\n`;
md += `| Descarte: lingüística | ${grupos.linguistica.length} |\n`;
md += `| Descarte: filosofía académica | ${grupos.filosofia.length} |\n`;
md += `| Descarte: guerrilla no anarquista | ${grupos.guerrilla.length} |\n`;
md += `| Descarte: basura/duplicados | ${grupos.basura.length} |\n`;
md += `| Indeterminado (revisar) | ${grupos.indeterminado.length} |\n\n---\n\n`;

const nombres = { anarquista: 'Anarquistas (candidatos a importar)', ficcion: 'Descarte: ficción / literatura', marxismo: 'Descarte: marxismo / leninismo', linguistica: 'Descarte: lingüística', filosofia: 'Descarte: filosofía académica', guerrilla: 'Descarte: guerrilla no anarquista', basura: 'Descarte: basura / duplicados', indeterminado: 'Indeterminado (revisar manualmente)' };
for (const [k, tit] of Object.entries(nombres)) {
  md += `## ${tit} (${grupos[k].length})\n\n`;
  for (const f of grupos[k].sort()) md += `- ${f}\n`;
  md += '\n';
}
writeFileSync(`${ROOT}/data/registros/revision330/clasificacion-fuentes.md`, md);
console.log('MD escrito: data/registros/revision330/clasificacion-fuentes.md');
