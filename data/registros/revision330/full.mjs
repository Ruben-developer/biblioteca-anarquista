import fs from 'fs';
const cn = t => t.toLowerCase().replace(/\s+/g,' ').replace(/\.pdf$/,'').trim();
const faltan = fs.readFileSync('lista-anarquistas-faltan-1737.txt','utf8').split('\n').map(cn).filter(Boolean);
const cls = fs.readFileSync('/tmp/opencode/clasif-raw.txt','utf8').split('\n')
  .map(l=>{const i=l.indexOf('|'); return i<0?null:cn(l.slice(0,i));}).filter(Boolean);
const clsS = new Set(cls);
const cov = faltan.filter(t=>clsS.has(t)).length;
const extra = cls.filter(t=>!new Set(faltan).has(t));
console.log('faltan-1737 total:', faltan.length, '| cubiertos:', cov);
console.log('clasif total unicos:', clsS.size, '| NO en faltan:', new Set(extra).size);
console.log('--- extras (hasta 10) ---');
[...new Set(extra)].slice(0,10).forEach(x=>console.log('EXTRA:', x));
