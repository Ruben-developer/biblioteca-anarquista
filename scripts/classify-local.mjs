#!/usr/bin/env node
// Clasificación local de PDFs con llama3.2:3b vía Ollama (analizador local).
// Une extracción (pdftotext, 1500 palabras) + clasificación y escribe meta.json
// por texto + un review.md. Para las ~71 obras pendientes (sin comparar).
//
//   node scripts/classify-local.mjs [--model llama3.2:3b] [--limit N]

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PDFS = '/home/fdr/Documentos/anarquismo_importado/PDFs';
const OUT = join(ROOT, 'data/registros/clasificacion');
const OLLAMA = 'http://localhost:11434/api/generate';
const MODEL = process.argv.includes('--model') ? process.argv[process.argv.indexOf('--model') + 1] : 'llama3.2:3b';
const LIMIT = process.argv.includes('--limit') ? parseInt(process.argv[process.argv.indexOf('--limit') + 1]) : Infinity;
const MAX_WORDS = 1500;

const SRC_DIRS = ['sin_clasificar', 'otros', 'Revisar_otros_idiomas'];

const PROMPT = (text) => `Eres un clasificador para un archivo histórico anarquista.
Analiza el extracto (primeras ~1500 palabras de un PDF) y responde SOLO con un
objeto JSON válido (sin markdown) con estas claves:
{
  "es_anarquista": true|false,
  "es_espanol": true|false,
  "tipo": "historia"|"teoria"|"otro",
  "titulo": string, "autor": string, "anio": string, "region": string,
  "contexto": string, "epoca": string, "corriente": string, "nota_otro": string
}
Extracto:
"""${text}"""`;

function slugify(n) {
  return n.replace(/\.pdf$/i, '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function firstWords(t, n) { return t.split(/\s+/).filter(Boolean).slice(0, n).join(' '); }
function extractPdf(p) {
  const r = spawnSync('pdftotext', ['-q', p, '-'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return r.status === 0 ? r.stdout || '' : '';
}
function extractJson(s) {
  if (!s) return null;
  let t = s.trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/i, '').trim();
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  if (a >= 0 && b > a) t = t.slice(a, b + 1);
  try { return JSON.parse(t); } catch { return null; }
}
async function callOllama(text) {
  const r = await fetch(OLLAMA, { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, prompt: PROMPT(text), stream: false, options: { temperature: 0 } }) });
  const j = await r.json();
  return j.response || '';
}
function gather() {
  const out = [];
  for (const d of SRC_DIRS) {
    const base = join(PDFS, d);
    if (!existsSync(base)) continue;
    const walk = (dir) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.toLowerCase().endsWith('.pdf')) out.push(p);
      }
    };
    walk(base);
  }
  return out;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const FORCE = process.argv.includes('--force');
  let pdfs = gather();
  if (LIMIT !== Infinity) pdfs = pdfs.slice(0, LIMIT);
  let n = 0, ok = 0; const start = Date.now();
  for (const pdf of pdfs) {
    const slug = slugify(basename(pdf));
    const metaPath = join(OUT, `${slug}.meta.json`);
    if (!FORCE && existsSync(metaPath)) { n++; console.log(`${n}/${pdfs.length} ${slug}: skip (ya existe)`); continue; }
    const txt = firstWords(extractPdf(pdf), MAX_WORDS);
    const t0 = Date.now(); let raw = '', fields = null, err = '';
    try { raw = await callOllama(txt); fields = extractJson(raw); if (!fields) { err = 'no JSON'; raw = raw.slice(0, 400); } else ok++; }
    catch (e) { err = String(e); }
    const ms = Date.now() - t0;
    const meta = {
      slug, source_pdf: pdf, model: MODEL, ms,
      es_anarquista: fields?.es_anarquista ?? null, es_espanol: fields?.es_espanol ?? null,
      tipo: fields?.tipo ?? '', titulo: fields?.titulo ?? '', autor: fields?.autor ?? '',
      anio: fields?.anio ?? '', region: fields?.region ?? '', contexto: fields?.contexto ?? '',
      epoca: fields?.epoca ?? '', corriente: fields?.corriente ?? '', nota_otro: fields?.nota_otro ?? '',
      doubt: txt.trim() ? '' : 'sin texto extraíble (posible escaneo)', err,
    };
    writeFileSync(join(OUT, `${slug}.meta.json`), JSON.stringify(meta, null, 2), 'utf8');
    n++;
    console.log(`${n}/${pdfs.length} ${slug}: ${ms}ms ${fields ? 'OK' : 'ERR ' + err}`);
  }
  const secs = ((Date.now() - start) / 1000).toFixed(0);
  console.log(`\nClasificación local (${MODEL}): ${ok}/${n} OK en ${secs}s`);
  let md = `# Clasificación local — ${MODEL}\n\nGenerado: ${new Date().toISOString().slice(0, 16).replace('T', ' ')}\nTotal: ${n} (OK ${ok})\n\n`;
  md += `| # | tipo | A | ES | título | autor | año | región | detalle |\n|---|------|---|----|-------|-------|-----|--------|--------|\n`;
  let i = 0;
  for (const pdf of pdfs) {
    const slug = slugify(basename(pdf)); const p = join(OUT, `${slug}.meta.json`);
    if (!existsSync(p)) continue;
    const m = JSON.parse(readFileSync(p, 'utf8')); i++;
    const det = m.tipo === 'historia' ? `${m.region} · ${m.epoca}` : m.tipo === 'teoria' ? (m.corriente || '') : (m.nota_otro || '');
    md += `| ${i} | ${m.tipo} | ${m.es_anarquista ? 'S' : 'N'} | ${m.es_espanol ? 'S' : 'N'} | ${m.titulo || '?'} | ${m.autor || '?'} | ${m.anio || '?'} | ${m.region || '?'} | ${det} |\n`;
  }
  writeFileSync(join(OUT, 'review.md'), md, 'utf8');
  console.log('Review: ' + join(OUT, 'review.md'));
}
main();
