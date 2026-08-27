#!/usr/bin/env node
// Pipeline de textos "La Idea" — etapas 4-5 (extracción + análisis + entrega).
//
// Uso:
//   node scripts/text-pipeline.mjs extract  --input data/registros/pipeline-input.txt --out data/registros/pipeline
//   node scripts/text-pipeline.mjs aggregate --out data/registros/pipeline [--telegram]
//
// extract : por cada PDF en el input, corre pdftotext, guarda las primeras 1500
//           palabras en <slug>.txt y crea <slug>.meta.json (plantilla vacía que
//           debe rellenar un humano/IA).
// aggregate: lee los meta.json rellenados, genera pipeline-review.md (doc editable),
//            anexa dudas a pipeline-dudas.log y (--telegram) avisa por Telegram.

import { readFileSync, writeFileSync, existsSync, readdirSync, appendFileSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const NOTIFY = `${process.env.HOME}/.config/biblioteca/notify.sh`;
const MAX_WORDS = 1500;

function slugify(name) {
  return name
    .replace(/\.pdf$/i, '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function firstWords(text, n) {
  const words = text.split(/\s+/).filter(Boolean);
  return words.slice(0, n).join(' ');
}

function extractPdf(pdfPath) {
  const res = spawnSync('pdftotext', ['-q', pdfPath, '-'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (res.status !== 0) return '';
  return res.stdout || '';
}

function extract(inputFile, outDir) {
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const lines = readFileSync(inputFile, 'utf8').split('\n').map(l => l.trim()).filter(Boolean);
  const manifest = [];
  for (const pdf of lines) {
    const slug = slugify(basename(pdf));
    const text = extractPdf(pdf);
    const excerpt = firstWords(text, MAX_WORDS);
    writeFileSync(join(outDir, `${slug}.txt`), excerpt, 'utf8');
    const meta = {
      slug,
      source_pdf: pdf,
      type: '',            // historia | teoria | otros2
      title: '',
      author: '',
      year: '',
      region: '',          // clave REGION del catálogo (p.ej. Brasil, Ucrania, Cuba, Grecia, Argentina, México, Internacional)
      category: '',        // historia: historia|revolucion|movimiento|organizacion|represion|periodismo|manifiesto|biografia
                           // teoria:  teoria|biografia|dialogo
      place: '',           // historia: dónde ocurrió (ciudad/país)
      date: '',            // historia: cuándo (año o rango, p.ej. 1918-1921, 1886)
      theories_rutas_fit: '', // teoria: valoración para Teorías y Rutas
      doubt: '',           // dudas / flags para el registro
      reviewed: false,
    };
    writeFileSync(join(outDir, `${slug}.meta.json`), JSON.stringify(meta, null, 2), 'utf8');
    manifest.push({ slug, pdf, excerptWords: excerpt.split(/\s+/).filter(Boolean).length });
    console.log(`extract: ${slug} (${meta && manifest.at(-1).excerptWords} palabras) <- ${basename(pdf)}`);
  }
  writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\n${manifest.length} PDFs extraídos en ${outDir}`);
}

function aggregate(outDir, telegram) {
  const files = readdirSync(outDir).filter(f => f.endsWith('.meta.json'));
  const rows = [];
  const doubts = [];
  for (const f of files) {
    const m = JSON.parse(readFileSync(join(outDir, f), 'utf8'));
    rows.push(m);
    if (m.doubt && m.doubt.trim()) doubts.push({ slug: m.slug, doubt: m.doubt.trim() });
  }
  rows.sort((a, b) => (a.type || 'z').localeCompare(b.type || 'z') || a.slug.localeCompare(b.slug));

  const counts = rows.reduce((acc, m) => { acc[m.type || '??'] = (acc[m.type || '??'] || 0) + 1; return acc; }, {});
  const stamp = new Date().toISOString().replace('T', ' ').slice(0, 16);

  // Documento editable de revisión.
  let md = `# Revisión de pipeline de textos — ${stamp}\n\n`;
  md += `Total procesados: **${rows.length}**  ·  por tipo: ` +
    Object.entries(counts).map(([k, v]) => `\`${k}\`=${v}`).join(', ') + `\n\n`;
  md += `> Editable: completa/corrige los campos y luego propón la entrada en \`src/data/regionData.js\`.\n\n`;
  md += `## Resumen\n\n| # | tipo | título | autor | año | región | categoría | lugar/fecha |\n`;
  md += `|---|------|-------|-------|-----|--------|-----------|-------------|\n`;
  rows.forEach((m, i) => {
    md += `| ${i + 1} | ${m.type || '??'} | ${m.title || '—'} | ${m.author || '—'} | ${m.year || '—'} | ${m.region || '—'} | ${m.category || '—'} | ${[m.place, m.date].filter(Boolean).join(' / ') || '—'} |\n`;
  });
  md += `\n## Detalle por texto\n\n`;
  rows.forEach((m) => {
    md += `### ${m.title || m.slug}  \n`;
    md += `- **tipo**: ${m.type || '??'}  ·  **categoría**: ${m.category || '—'}\n`;
    md += `- **autor**: ${m.author || '—'}  ·  **año**: ${m.year || '—'}  ·  **región**: ${m.region || '—'}\n`;
    if (m.type === 'historia') md += `- **lugar**: ${m.place || '—'}  ·  **fecha**: ${m.date || '—'}\n`;
    if (m.type === 'teoria') md += `- **valoración Teorías/Rutas**: ${m.theories_rutas_fit || '—'}\n`;
    md += `- **fuente**: \`${m.source_pdf}\`\n`;
    if (m.doubt) md += `- ⚠️ **duda**: ${m.doubt}\n`;
    md += `\n`;
  });

  const reviewPath = join(outDir, 'pipeline-review.md');
  writeFileSync(reviewPath, md, 'utf8');

  // Registro de dudas.
  if (doubts.length) {
    const logPath = join(ROOT, 'data/registros/pipeline-dudas.log');
    const header = `\n=== ${stamp} (${doubts.length} dudas) ===\n`;
    appendFileSync(logPath, header + doubts.map(d => `- ${d.slug}: ${d.doubt}`).join('\n') + '\n');
  }

  // Mensaje Telegram.
  const summary = `Pipeline textos: ${rows.length} procesados (${Object.entries(counts).map(([k, v]) => `${k}=${v}`).join(', ')}). ` +
    `Dudas: ${doubts.length}. Revisa data/registros/pipeline/pipeline-review.md`;
  console.log(`\n${summary}`);
  console.log(`Doc editable: ${reviewPath}`);
  if (telegram) {
    const r = spawnSync('bash', [NOTIFY, '--auto', summary], { encoding: 'utf8' });
    console.log(r.stdout || r.stderr || '(sin salida de notify)');
  }
}

const [cmd, ...rest] = process.argv.slice(2);
const getOpt = (name) => { const i = rest.indexOf(name); return i >= 0 ? rest[i + 1] : null; };
if (cmd === 'extract') {
  extract(getOpt('--input'), getOpt('--out'));
} else if (cmd === 'aggregate') {
  aggregate(getOpt('--out'), rest.includes('--telegram'));
} else {
  console.error('uso: text-pipeline.mjs extract|aggregate ...');
  process.exit(1);
}
