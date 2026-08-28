#!/usr/bin/env node
// Hoja de trabajo: primeros 200 PDFs no catalogados (pdfs-no-configurados).
// Misma tabla que las otras, pero solo Autor | Titulo (a la espera de clasificar).
import { readdirSync, writeFileSync } from 'node:fs';

const DIR = '/home/fdr/biblioteca-anarquista/pdfs-no-configurados';
const esc = (s) => String(s ?? '').replace(/\|/g, '/').replace(/\n/g, ' ').trim();

const files = readdirSync(DIR).filter((f) => f.toLowerCase().endsWith('.pdf')).sort();
const sel = files.slice(0, 200);

const parse = (fn) => {
  const base = fn.replace(/\.pdf$/i, '');
  const m = base.match(/^(.*?)\s-\s(.*)$/);
  let autor = '', titulo = base;
  if (m) { autor = m[1].trim(); titulo = m[2].trim(); }
  titulo = titulo.replace(/\s*\((?:[^)]*\d{4}[^)]*)\)\s*$/, '').trim();
  return { autor, titulo };
};

let md = '# Nuevos no catalogados (muestra 200)\n\n';
md += `_Primeros 200 de los ${files.length} PDFs en pdfs-no-configurados (no están en el catálogo de 330). Solo autor y título, pendientes de clasificación._\n\n`;
md += '| Autor | Título |\n|---|---|\n';
for (const f of sel) {
  const { autor, titulo } = parse(f);
  md += `| ${esc(autor)} | ${esc(titulo)} |\n`;
}
writeFileSync('/home/fdr/biblioteca-anarquista/data/registros/revision330/tabla-nuevos-200.md', md, 'utf8');
console.log('tabla-nuevos-200.md:', sel.length, 'filas (total no catalogados:', files.length, ')');
