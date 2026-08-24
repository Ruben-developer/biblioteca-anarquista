#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join, basename, extname } from 'path';
import { createHash } from 'crypto';

const COLLECTION = process.argv[2] || '/home/fdr/Documentos/anarquismo_importado/PDFs/sin_clasificar/biblioteca';
const WORKDIR = process.argv[3] || '/home/fdr/Documentos/anarquismo_importado/biblioteca-inv';
const OUTFILE = join(WORKDIR, 'inventario.json');

console.log('=== FASE 0: Inventario ===');
console.log(`Colección: ${COLLECTION}`);

const zips = readdirSync(COLLECTION).filter(f => f.endsWith('.zip')).sort();
console.log(`ZIPs encontrados: ${zips.length}`);

const unzipDir = join(WORKDIR, 'pdfs');
mkdirSync(unzipDir, { recursive: true });

let unzipCount = 0;
let skippedCount = 0;
let errorCount = 0;
const errors = [];

for (let i = 0; i < zips.length; i++) {
  const zip = zips[i];
  const zipPath = join(COLLECTION, zip);

  // Derivar nombre de carpeta: limpiar caracteres problemáticos
  const authorName = zip.replace(/\.zip$/i, '');
  const authorDir = join(unzipDir, authorName);

  if (existsSync(authorDir) && readdirSync(authorDir).length > 0) {
    skippedCount++;
    continue;
  }

  try {
    execSync(`7z x -y -o"${unzipDir}" "${zipPath}"`, { stdio: 'pipe', timeout: 120000 });
    unzipCount++;
  } catch (e) {
    errors.push({ zip, error: e.message.slice(0, 80) });
    errorCount++;
  }

  const done = skippedCount + unzipCount + errorCount;
  if (done % 50 === 0 || done === zips.length) {
    console.log(`  Progreso: ${done}/${zips.length} (extraídos: ${unzipCount}, saltados: ${skippedCount}, errores: ${errorCount})`);
  }
}

console.log(`\nExtracción: ${unzipCount} nuevos, ${skippedCount} ya existían, ${errorCount} errores`);
if (errors.length > 0) {
  console.log(`\nErrores (${errors.length}):`);
  errors.forEach(e => console.log(`  ${e.zip}: ${e.error}`));
}

// ─── Encontrar todos los archivos ──────────────────────────────────────
console.log('\nEscaneando archivos...');

function walkDir(dir) {
  const results = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      try {
        if (statSync(full).isDirectory()) results.push(...walkDir(full));
        else results.push(full);
      } catch {}
    }
  } catch {}
  return results;
}

const allFiles = walkDir(unzipDir);
const pdfFiles = allFiles.filter(f => /\.pdf$/i.test(f));
console.log(`Archivos totales: ${allFiles.length}, PDFs: ${pdfFiles.length}`);

// ─── Parsear filenames ─────────────────────────────────────────────────
function parseFilename(filepath) {
  const name = basename(filepath, extname(filepath));
  const relPath = filepath.slice(unzipDir.length + 1);
  const parts = relPath.split('/');
  const folderAuthor = parts.length > 1 ? parts[0] : null;

  let author = null;
  let title = name;
  let year = null;
  let editorial = null;

  const dashMatch = name.match(/^(.+?)\s*[-–—]\s*(.+)$/);
  if (dashMatch) {
    author = dashMatch[1].trim();
    title = dashMatch[2].trim();
  }

  const yearMatch = title.match(/\[(?:.*?,\s*)?(\d{4})\]/);
  if (yearMatch) {
    year = parseInt(yearMatch[1]);
    const editMatch = title.match(/\[(.+?),\s*\d{4}\]/);
    if (editMatch) editorial = editMatch[1].trim();
  }

  title = title.replace(/\s*\[.*?\]\s*/g, '').trim();
  title = title.replace(/^\(Pr[oó]logo,?\s*\d*\)\s*[-–—]\s*/i, '');

  if (!author && folderAuthor) {
    author = folderAuthor.replace(/\s*\[.*?\]\s*/g, '').trim();
  }

  return { author, title, year, editorial, filename: basename(filepath), path: filepath };
}

// ─── Calcular hashes y detectar duplicados ─────────────────────────────
console.log('Calculando hashes SHA256...');

function sha256(file) {
  try {
    return createHash('sha256').update(readFileSync(file)).digest('hex');
  } catch { return null; }
}

const inventory = [];
const hashMap = {};
let processed = 0;

for (const pdf of pdfFiles) {
  const hash = sha256(pdf);
  const meta = parseFilename(pdf);
  const size = statSync(pdf).size;
  inventory.push({ ...meta, hash, size, sizeMB: (size / 1024 / 1024).toFixed(1) });
  if (hash) {
    if (!hashMap[hash]) hashMap[hash] = [];
    hashMap[hash].push(pdf);
  }
  processed++;
  if (processed % 500 === 0) console.log(`  Hashes: ${processed}/${pdfFiles.length}`);
}

// Duplicados
const duplicates = {};
for (const [hash, paths] of Object.entries(hashMap)) {
  if (paths.length > 1) duplicates[hash] = paths;
}
const dupCount = Object.keys(duplicates).length;
const dupFiles = Object.values(duplicates).reduce((s, arr) => s + arr.length - 1, 0);

// ─── Estadísticas ──────────────────────────────────────────────────────
const authors = {};
for (const item of inventory) {
  const a = item.author || 'Desconocido';
  if (!authors[a]) authors[a] = { count: 0, totalSize: 0, years: [] };
  authors[a].count++;
  authors[a].totalSize += item.size;
  if (item.year) authors[a].years.push(item.year);
}

const authorList = Object.entries(authors)
  .map(([name, d]) => ({
    name, count: d.count,
    totalSizeMB: (d.totalSize / 1024 / 1024).toFixed(1),
    yearMin: d.years.length ? Math.min(...d.years) : null,
    yearMax: d.years.length ? Math.max(...d.years) : null
  }))
  .sort((a, b) => b.count - a.count);

const decades = {};
for (const item of inventory) {
  if (item.year) {
    const dec = `${Math.floor(item.year / 10) * 10}s`;
    decades[dec] = (decades[dec] || 0) + 1;
  }
}

// ─── Guardar inventario ────────────────────────────────────────────────
const report = {
  generated: new Date().toISOString(),
  collection: COLLECTION,
  stats: {
    totalZIPs: zips.length,
    zipsUnzipped: unzipCount + skippedCount,
    zipsErrors: errorCount,
    totalPDFs: pdfFiles.length,
    duplicateGroups: dupCount,
    duplicateFiles: dupFiles,
    uniqueAuthors: authorList.length,
    totalSizeMB: (inventory.reduce((s, i) => s + i.size, 0) / 1024 / 1024).toFixed(1)
  },
  decades,
  topAuthors: authorList.slice(0, 30),
  duplicates: Object.entries(duplicates).map(([hash, paths]) => ({
    hash: hash.slice(0, 12), count: paths.length,
    files: paths.map(p => p.slice(unzipDir.length + 1))
  })),
  errors,
  inventory: inventory.map(i => ({
    author: i.author, title: i.title, year: i.year, editorial: i.editorial,
    filename: i.filename, path: i.path.slice(unzipDir.length + 1),
    hash: i.hash?.slice(0, 12), sizeMB: i.sizeMB
  }))
};

writeFileSync(OUTFILE, JSON.stringify(report, null, 2));

console.log(`\n=== RESUMEN ===`);
console.log(`PDFs: ${report.stats.totalPDFs}`);
console.log(`Autores: ${report.stats.uniqueAuthors}`);
console.log(`Duplicados exactos: ${dupFiles} archivos en ${dupCount} grupos`);
console.log(`Tamaño total: ${report.stats.totalSizeMB} MB`);
console.log(`Errores ZIP: ${errorCount}`);
console.log(`\nTop 10 autores:`);
authorList.slice(0, 10).forEach(a => console.log(`  ${a.count} PDFs — ${a.name}`));
console.log(`\nDécadas:`, decades);
console.log(`\nInventario: ${OUTFILE}`);
