#!/usr/bin/env node
// Mueve los 25 'otro' de pdfs-local a pdfs-descartes y registra en descartes.txt.
import { readFileSync, writeFileSync, renameSync, existsSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = '/home/fdr/biblioteca-anarquista';
const LOCAL = join(ROOT, 'pdfs-local');
const DESC = join(ROOT, 'pdfs-descartes');
const OUT = join(ROOT, 'data/registros/revision330');

const c = JSON.parse(readFileSync(join(OUT, 'clasificacion192.json'), 'utf8'));
const otro = c.filter((m) => m.tipo === 'otro');
let moved = 0;
const lines = [];
for (const m of otro) {
  const from = join(LOCAL, m.file);
  if (!existsSync(from)) { console.error('NO existe:', m.file); continue; }
  renameSync(from, join(DESC, m.file));
  moved++;
  lines.push(`${m.author} | ${m.title} | otro: ${m.nota}`);
}
// actualizar descartes.txt (append)
const dt = join(OUT, 'descartes.txt');
appendFileSync(dt, '\n' + lines.join('\n') + '\n', 'utf8');
import { readdirSync } from 'node:fs';
console.log('movidos a descartes:', moved);
console.log('pdfs-local ahora:', readdirSync(LOCAL).filter((f) => f.endsWith('.pdf')).length);
console.log('pdfs-descartes ahora:', readdirSync(DESC).filter((f) => f.endsWith('.pdf')).length);
