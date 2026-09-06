import fs from 'fs';
const cn = t => t.toLowerCase().replace(/\s+/g,' ').replace(/\.pdf$/,'').trim();
const lote00 = fs.readFileSync('lote-00.txt','utf8').split('\n').map(cn).filter(Boolean);
const cls = fs.readFileSync('/tmp/opencode/clasif-raw.txt','utf8').split('\n');
const clsT = cls.map(l=>{const i=l.indexOf('|'); return i<0?null:cn(l.slice(0,i));}).filter(Boolean);
const clsS = new Set(clsT);
let covered=0; const missing=[];
for(const t of lote00){ if(clsS.has(t)) covered++; else missing.push(t); }
console.log('lote-00 total:', lote00.length, '| cubiertos:', covered, '| faltan:', missing.length);
console.log('--- faltantes en lote-00 (hasta 15) ---');
missing.slice(0,15).forEach(m=>console.log('MISS:', m));
// how many cls titles are NOT in lote00
const l00S = new Set(lote00);
const extra = clsT.filter(t=>!l00S.has(t));
console.log('--- clasif NO en lote-00:', extra.length);
