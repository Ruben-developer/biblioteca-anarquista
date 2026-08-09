// Genera src/data/worldmap.geo.json a partir del TopoJSON bundled de
// react-svg-worldmap (Natural Earth Admin 0). Fusiona la geometría de Israel
// dentro de Palestine y elimina el país Israel (los arcos compartidos se disuelven).
// Uso: node scripts/generate-worldmap.mjs  (requiere node_modules instalados)
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { feature, merge } from 'topojson-client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LIB_DIST = path.join(__dirname, '../node_modules/react-svg-worldmap/dist/index.js');
const OUT = path.join(__dirname, '../src/data/worldmap.geo.json');

// 1. Extraer el objeto topoData (objeto literal JS) del bundle
const src = fs.readFileSync(LIB_DIST, 'utf8');
const start = src.indexOf('var topoData = ');
if (start < 0) throw new Error('no se encontró topoData');
const s = src.indexOf('{', start);
let depth = 0, inStr = false, esc = false, end = -1;
for (let i = s; i < src.length; i++) {
  const c = src[i];
  if (inStr) {
    if (esc) esc = false;
    else if (c === '\\') esc = true;
    else if (c === '"') inStr = false;
  } else if (c === '"') inStr = true;
  else if (c === '{') depth++;
  else if (c === '}') { depth--; if (depth === 0) { end = i; break; } }
}
if (end < 0) throw new Error('no se encontró el cierre del topoData');
let jsonStr = src.slice(s, end + 1);
// El bundle usa escapes Latin-1 (\xNN); convertirlos a unicode para JSON válido
jsonStr = jsonStr.replace(/\\x([0-9A-Fa-f]{2})/g, (_, h) => '\\u00' + h.toUpperCase());
const topo = JSON.parse(jsonStr);

// 2. Fusionar Israel dentro de Palestine
const geometries = topo.objects.countries.geometries;
const il = geometries.find(g => g.properties.I === 'IL');
const ps = geometries.find(g => g.properties.I === 'PS');
if (!il || !ps) throw new Error('faltan Israel/Palestina en el mapa');
const merged = merge(topo, [il, ps]);

const features = geometries
  .filter(g => g.properties.I !== 'IL')
  .map(g => feature(topo, g));

const fc = {
  type: 'FeatureCollection',
  features: features.map(f => f.properties.I === 'PS'
    ? { type: 'Feature', properties: { N: 'Palestine', I: 'PS' }, geometry: { type: merged.type, coordinates: merged.coordinates } }
    : f)
};

fs.writeFileSync(OUT, JSON.stringify(fc));
console.log(`OK: ${OUT} (${fc.features.length} países, ${fs.statSync(OUT).size} bytes). Israel eliminado, fusionado en Palestine.`);
