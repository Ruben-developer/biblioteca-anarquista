#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, unlinkSync, rmdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';

const WORKDIR = '/home/fdr/Documentos/anarquismo_importado/biblioteca-inv';
const unzipDir = join(WORKDIR, 'pdfs');
const OUTFILE = join(WORKDIR, 'inventario.json');
const REPORT = join(WORKDIR, 'fase1-limpieza.json');

const data = JSON.parse(readFileSync(OUTFILE, 'utf8'));
const items = data.inventory;

console.log('=== FASE 1: LIMPIEZA ===');
console.log(`PDFs totales: ${items.length}`);

// ─── 1. Eliminar no-PDFs ────────────────────────────────────────────────
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

console.log('\nEliminando no-PDFs...');
const allFiles = walkDir(unzipDir);
const nonPDFs = allFiles.filter(f => !/\.pdf$/i.test(f));
for (const f of nonPDFs) {
  try { unlinkSync(f); } catch {}
}
console.log(`  Eliminados: ${nonPDFs.length} archivos no-PDF`);

// ─── 2. Eliminar duplicados exactos ────────────────────────────────────
console.log('\nEliminando duplicados exactos...');

const hashMap = {};
for (const item of items) {
  const h = item.hash;
  if (!h) continue;
  if (!hashMap[h]) hashMap[h] = [];
  hashMap[h].push(item);
}

const removed = [];
const kept = [];
let freedBytes = 0;

for (const [hash, group] of Object.entries(hashMap)) {
  if (group.length <= 1) continue;

  // Elegir cuál conservar: preferir coincidencia de autor con carpeta
  let bestIdx = 0;
  for (let i = 0; i < group.length; i++) {
    const folder = group[i].path.split('/')[0].toLowerCase();
    const author = (group[i].author || '').toLowerCase();
    if (author && folder.includes(author.split(',')[0].trim())) {
      bestIdx = i;
      break;
    }
  }

  for (let i = 0; i < group.length; i++) {
    if (i === bestIdx) {
      kept.push(group[i]);
      continue;
    }
    const fullPath = join(unzipDir, group[i].path);
    try {
      const size = statSync(fullPath).size;
      unlinkSync(fullPath);
      freedBytes += size;
      removed.push({ path: group[i].path, sizeMB: group[i].sizeMB, kept: group[bestIdx].path });
    } catch {}
  }
}

console.log(`  Duplicados eliminados: ${removed.length}`);
console.log(`  Espacio liberado: ${(freedBytes / 1024 / 1024 / 1024).toFixed(2)} GB`);

// ─── 3. Eliminar carpetas vacías ───────────────────────────────────────
console.log('\nEliminando carpetas vacías...');
let emptyDirs = 0;
function cleanEmptyDirs(dir) {
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      try {
        if (statSync(full).isDirectory()) {
          cleanEmptyDirs(full);
          if (readdirSync(full).length === 0) {
            rmdirSync(full);
            emptyDirs++;
          }
        }
      } catch {}
    }
  } catch {}
}
cleanEmptyDirs(unzipDir);
console.log(`  Carpetas vacías eliminadas: ${emptyDirs}`);

// ─── 4. Reconstruir inventario limpio ──────────────────────────────────
console.log('\nReconstruyendo inventario...');

const cleanPDFs = walkDir(unzipDir).filter(f => /\.pdf$/i.test(f));
console.log(`  PDFs después de limpieza: ${cleanPDFs.length}`);

// Actualizar inventory
const cleanItems = [];
const authors = {};

for (const pdf of cleanPDFs) {
  const relPath = pdf.slice(unzipDir.length + 1);
  const existing = items.find(i => i.path === relPath);
  if (existing) {
    cleanItems.push(existing);
  } else {
    // Recalcular metadata básica
    const { basename: bn, extname: ex } = await import('path');
    const name = bn(pdf).replace(/\.pdf$/i, '');
    cleanItems.push({
      filename: bn(pdf),
      path: relPath,
      title: name,
      author: relPath.split('/')[0].replace(/\s*\[.*?\]\s*/g, '').trim(),
      sizeMB: (statSync(pdf).size / 1024 / 1024).toFixed(1)
    });
  }
}

// Reconstruir stats
for (const item of cleanItems) {
  const a = item.author || 'Desconocido';
  if (!authors[a]) authors[a] = { count: 0, years: [] };
  authors[a].count++;
  if (item.year) authors[a].years.push(item.year);
}

const authorList = Object.entries(authors)
  .map(([name, d]) => ({
    name, count: d.count,
    yearMin: d.years.length ? Math.min(...d.years) : null,
    yearMax: d.years.length ? Math.max(...d.years) : null
  }))
  .sort((a, b) => b.count - a.count);

const decades = {};
for (const item of cleanItems) {
  if (item.year) {
    const dec = `${Math.floor(item.year / 10) * 10}s`;
    decades[dec] = (decades[dec] || 0) + 1;
  }
}

const cleanReport = {
  generated: new Date().toISOString(),
  phase: 'Fase 1 — Limpieza',
  before: {
    totalPDFs: items.length,
    totalSizeMB: data.stats.totalSizeMB
  },
  actions: {
    nonPDFsRemoved: nonPDFs.length,
    duplicatesRemoved: removed.length,
    emptyDirsRemoved: emptyDirs,
    freedGB: (freedBytes / 1024 / 1024 / 1024).toFixed(2)
  },
  after: {
    totalPDFs: cleanItems.length,
    uniqueAuthors: authorList.length,
    totalSizeMB: (cleanItems.reduce((s, i) => s + (parseFloat(i.sizeMB) || 0), 0)).toFixed(1)
  },
  decades,
  topAuthors: authorList.slice(0, 30),
  removedSample: removed.slice(0, 20).map(r => ({
    removed: r.path,
    kept: r.kept,
    sizeMB: r.sizeMB
  }))
};

writeFileSync(REPORT, JSON.stringify(cleanReport, null, 2));

// Actualizar inventario.json principal
data.inventory = cleanItems.map(i => ({
  author: i.author, title: i.title, year: i.year, editorial: i.editorial,
  filename: i.filename, path: i.path, hash: i.hash, sizeMB: i.sizeMB
}));
data.stats = cleanReport.after;
data.stats.totalZIPs = data.stats.totalZIPs || 720;
data.stats.zipsErrors = 42;
data.decades = decades;
data.topAuthors = authorList.slice(0, 30);
data.phase1 = cleanReport.actions;

writeFileSync(OUTFILE, JSON.stringify(data, null, 2));

console.log(`\n=== RESUMEN FASE 1 ===`);
console.log(`ANTES: ${cleanReport.before.totalPDFs} PDFs, ${cleanReport.before.totalSizeMB} MB`);
console.log(`DESPUÉS: ${cleanReport.after.totalPDFs} PDFs, ${cleanReport.after.totalSizeMB} MB`);
console.log(`Eliminados: ${nonPDFs.length} no-PDFs + ${removed.length} duplicados = ${nonPDFs.length + removed.length} archivos`);
console.log(`Espacio liberado: ${cleanReport.actions.freedGB} GB`);
console.log(`Autores únicos: ${cleanReport.after.uniqueAuthors}`);
console.log(`\nReporte: ${REPORT}`);
console.log(`Inventario: ${OUTFILE}`);
