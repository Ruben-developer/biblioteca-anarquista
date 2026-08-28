#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = '/home/fdr/biblioteca-anarquista';
const { regionData } = await import(pathToFileURL(`${ROOT}/src/data/regionData.js`));
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
const toks = (s) => new Set(norm(s).split(' ').filter((w) => w.length >= 4));

const catalogo = [];
for (const [region, r] of Object.entries(regionData)) for (const b of r.books) catalogo.push({ t: b.title, c: b.category, region, tk: toks(b.title) });

const lineas = readFileSync(`${ROOT}/data/registros/revision330/curados-historia.txt`, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);
const exactas = new Set(catalogo.map((x) => norm(x.t)));

const renombrados = [], ausentes = [];
for (const t of lineas) {
  if (exactas.has(norm(t))) continue;
  const tk = toks(t);
  let best = null, bestScore = 0;
  for (const c of catalogo) {
    let inter = 0; for (const w of tk) if (c.tk.has(w)) inter++;
    const score = tk.size ? inter / tk.size : 0;
    if (score > bestScore) { bestScore = score; best = c; }
  }
  if (best && bestScore >= 0.55 && tk.size >= 3) renombrados.push({ cur: t, cand: best.t, cat: best.c, score: bestScore.toFixed(2) });
  else ausentes.push(t);
}

console.log(`Renombrados (presentes, título distinto): ${renombrados.length}`);
for (const r of renombrados) console.log(`  ${r.cur}\n     ~ ${r.cand}  [${r.cat}]  (${r.score})`);
console.log(`\nRealmente ausentes del catálogo: ${ausentes.length}`);
console.log(ausentes.join('\n'));
