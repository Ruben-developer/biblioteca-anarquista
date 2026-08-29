#!/usr/bin/env node
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
const ROOT = '/home/fdr/biblioteca-anarquista';
const SRC = `${ROOT}/data/registros/revision330/anarquistas.md`;

const lines = readFileSync(SRC, 'utf8').split('\n');
const head = [];
const bullets = [];
let inBullets = false;
for (const l of lines) {
  if (l.startsWith('- ')) { inBullets = true; bullets.push(l); }
  else if (!inBullets) head.push(l);
  else if (l.trim() === '') head.push(l); // mantener blancos previos al cuerpo
}
// head conserva todo lo anterior a la primera bala (incluye blancos)

const chunks = [];
for (let i = 0; i < bullets.length; i += 1000) chunks.push(bullets.slice(i, i + 1000));

const note = '_título y autor parsados del nombre de archivo; pueden necesitar limpieza._\n';
const titleLine = head.find((l) => l.startsWith('# ')) || '# Textos anarquistas (sin catalogar) — título · autor';

chunks.forEach((chunk, idx) => {
  const n = idx + 1;
  let md = `${titleLine} — parte ${n}\n\n`;
  md += `Total en este archivo: ${chunk.length}\n\n`;
  md += note + '\n';
  md += chunk.join('\n') + '\n';
  writeFileSync(`${ROOT}/data/registros/revision330/anarquistas_${n}.md`, md);
});

rmSync(SRC);
console.log(`Generados ${chunks.length} archivos:`, chunks.map((c, i) => `anarquistas_${i + 1}.md (${c.length})`).join(', '));
