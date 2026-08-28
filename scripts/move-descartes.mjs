#!/usr/bin/env node
// Mueve a pdfs-descartes los libros de los 330 que no calzan con las reglas
// (no anarquista / otro tipo como novela) y los duplicados redundantes.
import { readdirSync, renameSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const PDFS = '/home/fdr/biblioteca-anarquista/pdfs-local';
const DEST = '/home/fdr/biblioteca-anarquista/pdfs-descartes';
const slugify = (n) => n.replace(/\.pdf$/i, '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const reasons = {
  'carlos-malato-antes-del-momento': 'novela (no anarquista)',
  'colectivo-el-club-de-la-pelea': 'novela (Fight Club), no anarquista',
  'colectivo-banalidades-de-base': 'situacionismo, no anarquista',
  'colectivo-jefes-cabecillas-abusones': 'ensayo antropológico (Marvin Harris), no anarquista',
  'colectivo-los-invisibles': 'novela documental, no anarquista',
  'angel-j-cappelletti-utopias-antiguas-y-modernas': 'ensayo sobre utopías, no anarquista',
  'leon-tolstoi-que-es-el-arte': 'ensayo de filosofía del arte, no anarquista',
  'lopez-ortiz-geovani-el-altruismo-como-factor-de-la-evolucion': 'biología evolutiva, no anarquista',
  'louise-michel-el-mundo-nuevo': 'novela utópica, no anarquista',
  'ricardo-flores-magon-tierra-y-libertad': 'obra de teatro, no ensayo/historia',
  'ricardo-palma-salamanca-el-gran-rescate': 'obra literaria/poética, no anarquista',
  'simone-weil-la-persona-y-lo-sagrado': 'mística/filosofía, no anarquista',
  'simone-weil-reflexiones-sobre-las-causas-de-la-libertad-y-de-la-opresion-social': 'socialismo, no anarquista',
  'ted-kaczynski-la-sociedad-industrial-y-su-futuro': 'antiindustrialismo, no anarquista',
  'varios-autores-dinamita-cerebral-coleccion-de-cuentos-anarquistas': 'cuentos (literatura), no ensayo/historia',
};
const dups = [
  'Errico Malatesta - Anarquia (1891) (2).pdf',
  'Federacion anarquista del Peru - El anarcosindicalismo en el Peru (1961).pdf',
  'Peter Gelderloos - Como la no violencia protege al Estado (variante) (2007).pdf',
];

mkdirSync(DEST, { recursive: true });
const files = readdirSync(PDFS).filter((f) => f.toLowerCase().endsWith('.pdf'));
const match = (s) => files.find((f) => { const k = slugify(f); return k === s || k.startsWith(s + '-'); });
let moved = 0; const man = [];
for (const s of Object.keys(reasons)) {
  const f = match(s);
  if (f) { renameSync(join(PDFS, f), join(DEST, f)); moved++; man.push(`${f}\t${reasons[s]}`); }
  else console.log('NO MATCH', s);
}
for (const f of dups) {
  if (existsSync(join(PDFS, f))) { renameSync(join(PDFS, f), join(DEST, f)); moved++; man.push(`${f}\tduplicado redundante`); }
  else console.log('NO DUP', f);
}
writeFileSync(join(DEST, 'descartes.txt'), man.join('\n') + '\n', 'utf8');
console.log('movidos:', moved);
console.log('pdfs-local ahora:', readdirSync(PDFS).filter((f) => f.toLowerCase().endsWith('.pdf')).length);
