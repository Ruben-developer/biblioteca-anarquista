#!/usr/bin/env node
// Genera lotes de clasificacion para los 192 nuevos (igual esquema que revision330).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = '/home/fdr/biblioteca-anarquista';
const EXTRACT = '/tmp/extract192';
const OUT = '/tmp/batches192';
mkdirSync(OUT, { recursive: true });

const t = JSON.parse(readFileSync('/tmp/titulos192.json', 'utf8'));
const BATCH = 15;
const batches = [];
for (let i = 0; i < t.length; i += BATCH) batches.push(t.slice(i, i + BATCH));

const promptHead = `Eres un clasificador de libros anarquistas en español. Para cada libro decide:
- tipo: "historia" (relato/estudio de hechos, movimientos, biografias, guerras, revoluciones anarquistas) | "teoria" (ensayo/argumento ideologico, filosofia, critica, manifesto, metodo) | "otro" (no anarquista, novela literaria, guia tecnica, miscelanea no apta).
- Si tipo="historia": asigna "region" (PAIS o zona donde ocurrio el hecho, en español: Espana, Francia, Mexico, Argentina, Cuba, Rusia, Estados Unidos, Italia, Alemania, Uruguay, Chile, Bolivia, Peru, Colombia, Espana/Cataluna, Internacional, etc.) y "epoca" (rango: "siglo XIX", "1900-1920", "1921-1935", "1936-1939", "1940-1975", "1976-2000", "2001-actual", "colonial", "edad antigua", "edad media").
- Si tipo="teoria": asigna "corriente" (anarcosindicalismo, anarcofeminismo, anarcocomunismo, anarquismo individualista, anarquismo cristiano, anarquismo sin adjetivos, anarcopacifismo, anarquismo verde/ecologico, anarquismo primitivista, plataformismo, anarquismo social, insurreccionalismo, anarcopunk, educacion libertaria, anarquismo y sexualidad, etc.). NO asignes region ni epoca (los de teoria NO van al mapa ni a la linea temporal).
- Si tipo="otro": pon en "nota" el motivo y deja region/epoca/corriente vacios.
Responde SOLO con un array JSON valido, sin texto extra, con este formato por libro:
{"slug","tipo","region","epoca","corriente","nota"}
Libros a clasificar:

`;

batches.forEach((b, idx) => {
  let body = '';
  for (const x of b) {
    let txt = '';
    try { txt = readFileSync(join(EXTRACT, x.slug + '.txt'), 'utf8').trim(); } catch {}
    if (txt) txt = txt.slice(0, 2500);
    body += `\n### slug: ${x.slug}\nautor: ${x.author}\ntitulo: ${x.title}\nano: ${x.year}\n${txt ? 'texto (extracto):\n' + txt : '[SIN TEXTO: clasifica solo por autor/titulo]'}\n`;
  }
  writeFileSync(join(OUT, `batch_${String(idx + 1).padStart(2, '0')}.txt`), promptHead + body, 'utf8');
});
console.log('lotes generados:', batches.length, '| libros:', t.length);
