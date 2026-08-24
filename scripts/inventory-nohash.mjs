#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, basename, extname } from 'path';

const WORKDIR = '/home/fdr/Documentos/anarquismo_importado/biblioteca-inv';
const unzipDir = join(WORKDIR, 'pdfs');
const OUTFILE = join(WORKDIR, 'inventario.json');

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

console.log('Escaneando PDFs...');
const allFiles = walkDir(unzipDir);
const pdfFiles = allFiles.filter(f => /\.pdf$/i.test(f));
console.log(`PDFs: ${pdfFiles.length}`);

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

const inventory = [];
let processed = 0;
for (const pdf of pdfFiles) {
  const meta = parseFilename(pdf);
  const size = statSync(pdf).size;
  inventory.push({ ...meta, size, sizeMB: (size / 1024 / 1024).toFixed(1) });
  processed++;
}

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

const totalSizeMB = (inventory.reduce((s, i) => s + i.size, 0) / 1024 / 1024).toFixed(1);

const report = {
  generated: new Date().toISOString(),
  stats: {
    totalPDFs: pdfFiles.length,
    uniqueAuthors: authorList.length,
    totalSizeMB
  },
  decades,
  topAuthors: authorList.slice(0, 30),
  inventory: inventory.map(i => ({
    author: i.author, title: i.title, year: i.year, editorial: i.editorial,
    filename: i.filename, path: i.path.slice(unzipDir.length + 1), sizeMB: i.sizeMB
  }))
};

writeFileSync(OUTFILE, JSON.stringify(report, null, 2));

console.log(`\n=== RESUMEN ===`);
console.log(`PDFs: ${report.stats.totalPDFs}`);
console.log(`Autores: ${report.stats.uniqueAuthors}`);
console.log(`Tamaño total: ${report.stats.totalSizeMB} MB`);
console.log(`\nTop 15 autores:`);
authorList.slice(0, 15).forEach(a => console.log(`  ${a.count} PDFs — ${a.name}`));
console.log(`\nDécadas:`, decades);
console.log(`\nInventario: ${OUTFILE}`);
