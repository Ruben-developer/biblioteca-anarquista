#!/usr/bin/env node
// Benchmark de modelos para el pipeline de textos "La Idea".
// Corre el MISMO prompt de clasificación sobre los 10 extractos y mide tiempos.
//
//   node scripts/bench-models.mjs --model qwen3:8b        (corre 1 modelo)
//   node scripts/bench-models.mjs --build                  (arma tablas desde lo recolectado)
//   node scripts/bench-models.mjs --model all             (corre todos los locales)
//
// Modelos considerados "libres ligeros": los listados en LOCAL_MODELS.
// hy3-free (el actual, hosted) se integra aparte vía subagentes.

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'data/registros/benchmark');
const EXTRACT = process.env.BENCH_EXTRACT
  ? join(ROOT, process.env.BENCH_EXTRACT)
  : join(ROOT, 'data/registros/pipeline');
const OLLAMA = 'http://localhost:11434/api/generate';

const SIZES = {
  'qwen2.5:7b': '4.7 GB', 'qwen3:0.6b': '0.5 GB', 'qwen3:4b': '2.5 GB',
  'qwen3:8b': '5.2 GB', 'llama3.2:3b': '2.0 GB', 'llama3.1:8b': '4.9 GB',
  'gemma3:4b': '3.3 GB', 'mistral:7b': '4.4 GB',
};
// Solo modelos ligeros (<7B, CPU-only): los 8B son inviables en esta máquina.
const LOCAL_MODELS = ['qwen3:4b', 'gemma3:4b', 'llama3.2:3b', 'qwen3:0.6b'];

const PROMPT = (text) => `Eres un clasificador para un archivo histórico anarquista.
Analiza el siguiente extracto (primeras ~1500 palabras de un PDF) y responde SOLO
con un objeto JSON válido (sin markdown, sin texto extra) con estas claves exactas:

{
  "es_anarquista": true|false,
  "es_espanol": true|false,
  "tipo": "historia"|"teoria"|"otro",
  "titulo": string,
  "autor": string,
  "anio": string,
  "region": string,
  "contexto": string,        // si tipo=historia: contexto del suceso
  "epoca": string,           // si tipo=historia: época/años
  "corriente": string,       // si tipo=teoria: corriente anarquista (anarcosindicalismo, individualismo, comunismo anárquico, anarcofeminismo, anarquismo sin adjetivos, etc.)
  "nota_otro": string        // si tipo=otro: qué es (novela, cómic, etc.)
}

Extracto:
"""${text}"""`;

function extractJson(s) {
  if (!s) return null;
  let t = s.trim();
  // quita fences ```json ... ```
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/```$/i, '').trim();
  const a = t.indexOf('{'); const b = t.lastIndexOf('}');
  if (a >= 0 && b > a) t = t.slice(a, b + 1);
  try { return JSON.parse(t); } catch { return null; }
}

async function callOllama(model, text) {
  const res = await fetch(OLLAMA, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt: PROMPT(text), stream: false, options: { temperature: 0 } }),
  });
  const j = await res.json();
  return j.response || '';
}

function getExtracts() {
  return readdirSync(EXTRACT)
    .filter(f => f.endsWith('.txt') && f !== 'manifest.json')
    .map(f => ({ slug: f.replace(/\.txt$/, ''), text: readFileSync(join(EXTRACT, f), 'utf8') }));
}

async function runModel(model) {
  const dir = join(OUT, model.replace(/[:.]/g, '_'));
  mkdirSync(dir, { recursive: true });
  const texts = getExtracts();
  const out = [];
  let totalMs = 0, ok = 0;
  for (const { slug, text } of texts) {
    const t0 = Date.now();
    let raw = '', fields = null, err = '';
    try {
      raw = await callOllama(model, text);
      fields = extractJson(raw);
      if (!fields) { err = 'no JSON'; raw = raw.slice(0, 500); }
      else ok++;
    } catch (e) { err = String(e); }
    const ms = Date.now() - t0; totalMs += ms;
    const rec = { slug, ms, fields, raw, err };
    out.push(rec);
    writeFileSync(join(dir, `${slug}.json`), JSON.stringify(rec, null, 2), 'utf8');
    console.log(`${model} ${slug}: ${ms}ms ${fields ? 'OK' : 'ERR ' + err}`);
  }
  const summary = { model, size: SIZES[model] || '?', totalMs, avgMs: Math.round(totalMs / texts.length), ok, total: texts.length };
  writeFileSync(join(dir, 'summary.json'), JSON.stringify(summary, null, 2), 'utf8');
  console.log(`=> ${model}: ${ok}/${texts.length} OK, total ${totalMs}ms (~${(totalMs/1000).toFixed(1)}s)`);
}

function loadModelDir(d) {
  const dir = join(OUT, d);
  try { if (!statSync(dir).isDirectory()) return null; } catch { return null; }
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'summary.json');
  if (!files.length) return null;
  const sp = join(dir, 'summary.json');
  const summary = existsSync(sp) ? JSON.parse(readFileSync(sp, 'utf8')) : null;
  const recs = files.map(f => JSON.parse(readFileSync(join(dir, f), 'utf8')));
  const totalMs = summary ? summary.totalMs : recs.reduce((a, r) => a + (r.ms || 0), 0);
  const ok = summary ? summary.ok : recs.filter(r => r.fields).length;
  const total = summary ? summary.total : recs.length;
  return { model: summary ? summary.model : d, size: summary ? summary.size : '?', totalMs, avgMs: totalMs ? Math.round(totalMs / total) : 0, ok, total, dir: d };
}

function build() {
  const all = readdirSync(OUT).map(loadModelDir).filter(Boolean);
  const models = all.slice().sort((a, b) => a.totalMs - b.totalMs);
  const nTexts = getExtracts().length;

  let a = '# Benchmark de modelos — pipeline de textos "La Idea"\n\n';
  a += `Generado: ${new Date().toISOString().slice(0, 16).replace('T', ' ')}\n`;
  a += `Modelos locales en Ollama (CPU, sin GPU). Textos en la muestra: ${nTexts}.\n\n`;
  a += `## Tabla A — Rendimiento\n\n`;
  a += `| Modelo | Tamaño | Tiempo total | Tiempo/texto (prom) | OK/${nTexts} |\n`;
  a += `|--------|--------|--------------|---------------------|-------|\n`;
  for (const m of models) {
    const tot = m.totalMs ? `${(m.totalMs / 1000).toFixed(1)} s` : '—';
    const avg = m.avgMs ? `${m.avgMs} ms` : '—';
    a += `| ${m.model} | ${m.size} | ${tot} | ${avg} | ${m.ok}/${m.total} |\n`;
  }

  const slugs = getExtracts().map(t => t.slug);
  const data = {};
  for (const m of all) {
    data[m.model] = {};
    for (const s of slugs) {
      const p = join(OUT, m.dir, `${s}.json`);
      if (existsSync(p)) data[m.model][s] = JSON.parse(readFileSync(p, 'utf8')).fields;
    }
  }
  const modelList = Object.keys(data);

  a += `\n## Tabla B — Clasificación por texto\n\n`;
  a += `A=anarquista · ES=español · T=tipo. Por tipo: historia → región/época · teoría → corriente · otro → nota.\n\n`;
  for (const slug of slugs) {
    a += `### ${slug}\n\n`;
    a += `| Modelo | A | ES | T | detalle (región/época · corriente · nota) | título / autor |\n`;
    a += `|--------|---|----|---|------------------------------------------|------------------|\n`;
    for (const m of modelList) {
      const f = data[m][slug];
      if (!f) { a += `| ${m} | – | – | – | (sin datos) | – |\n`; continue; }
      const det = f.tipo === 'historia' ? `${f.region || '?'} · ${f.epoca || '?'}` :
                  f.tipo === 'teoria' ? (f.corriente || '?') : (f.nota_otro || '?');
      a += `| ${m} | ${f.es_anarquista ? 'S' : 'N'} | ${f.es_espanol ? 'S' : 'N'} | ${f.tipo || '?'} | ${det} | ${(f.titulo || '?')} / ${(f.autor || '?')} |\n`;
    }
    a += `\n`;
  }
  writeFileSync(join(OUT, 'compara.md'), a, 'utf8');
  console.log(`Tablas escritas en ${join(OUT, 'compara.md')}`);
}

const arg = process.argv.slice(2);
const modelArg = arg.includes('--model') ? arg[arg.indexOf('--model') + 1] : null;
if (arg.includes('--build')) build();
else if (modelArg === 'all') { (async () => { for (const m of LOCAL_MODELS) await runModel(m); build(); })(); }
else if (modelArg) { (async () => { await runModel(modelArg); build(); })(); }
else { console.error('usa --model <m|all> o --build'); process.exit(1); }
