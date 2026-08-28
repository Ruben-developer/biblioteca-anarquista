#!/usr/bin/env node
// Hoja de trabajo: 200 PDFs no catalogados (pdfs-no-configurados) que SÍ son
// candidatos anarquistas. Se excluyen los títulos no anarquistas segun la lista
// de exclusion del usuario (marxistas/guerrilla, ensayo académico, ficción).
import { readdirSync, writeFileSync } from 'node:fs';

const DIR = '/home/fdr/biblioteca-anarquista/pdfs-no-configurados';
const OUT = '/home/fdr/biblioteca-anarquista/data/registros/revision330/tabla-nuevos-200.md';
const esc = (s) => String(s ?? '').replace(/\|/g, '/').replace(/\n/g, ' ').trim();
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

// Subcadenas de exclusión (normalizadas)
const EXCL = [
  'marighella', 'manual del guerrillero',
  'guerrilla olvidada', 'fuego a la polvora',
  'bajo tres banderas', 'iron mountain',
  'libro rojo del cole', 'antipsiquiatria',
];
const isExcl = (autor, titulo) => {
  const t = norm(autor + ' ' + titulo);
  return EXCL.some((k) => t.includes(k));
};

const parse = (fn) => {
  const base = fn.replace(/\.pdf$/i, '');
  const m = base.match(/^(.*?)\s-\s(.*)$/);
  let autor = '', titulo = base;
  if (m) { autor = m[1].trim(); titulo = m[2].trim(); }
  titulo = titulo.replace(/\s*\((?:[^)]*\d{4}[^)]*)\)\s*$/, '').trim();
  return { autor, titulo };
};

const files = readdirSync(DIR).filter((f) => f.toLowerCase().endsWith('.pdf')).sort();
const candidatos = [];
for (const f of files) {
  const { autor, titulo } = parse(f);
  if (isExcl(autor, titulo)) continue;
  candidatos.push({ autor, titulo });
  if (candidatos.length >= 200) break;
}

let md = '# Nuevos no catalogados (muestra 200)\n\n';
md += `_200 de los ${files.length} PDFs en pdfs-no-configurados que son candidatos anarquistas. `;
md += `Se excluyeron los títulos no anarquistas (marxistas/guerrilla, ensayo académico, ficción); ver excluidos.md._\n\n`;
md += '| Autor | Título |\n|---|---|\n';
for (const c of candidatos) md += `| ${esc(c.autor)} | ${esc(c.titulo)} |\n`;
writeFileSync(OUT, md, 'utf8');
console.log('tabla-nuevos-200.md:', candidatos.length, 'filas (excluidos los no anarquistas)');
