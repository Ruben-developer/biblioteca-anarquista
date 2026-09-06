import fs from 'fs';
const cn = t => t.toLowerCase().replace(/\s+/g,' ').replace(/\.pdf$/,'').trim();
const faltan = fs.readFileSync('lista-anarquistas-faltan-1737.txt','utf8').split('\n').map(cn).filter(Boolean);
const cls = fs.readFileSync('/tmp/opencode/clasif-raw.txt','utf8').split('\n')
  .map(l=>{const i=l.indexOf('|'); return i<0?null:{t:cn(l.slice(0,i)),c:l.slice(i+1)};}).filter(Boolean);
const clsS = new Set(cls.map(o=>o.t));
const missing = faltan.filter(t=>!clsS.has(t));
console.log('--- 6 faltan en clasif ---');
missing.forEach(m=>console.log('MISS:', m));
// search partial in cls for each
for(const m of missing){
  const partial = cls.filter(o=>o.t.includes(m.slice(0,25)) || m.includes(o.t.slice(0,25)));
  console.log('  parcial para:', m.slice(0,40));
  partial.slice(0,5).forEach(p=>console.log('    ->', p.t, '|', p.c));
}
