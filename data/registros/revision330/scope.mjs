import fs from 'fs';
const cn = t => t.toLowerCase().replace(/\s+/g,' ').replace(/\.pdf$/,'').trim();
const cls = fs.readFileSync('/tmp/opencode/clasif-raw.txt','utf8').split('\n')
  .map(l=>{const i=l.indexOf('|'); return i<0?null:cn(l.slice(0,i));}).filter(Boolean);
const clsS = new Set(cls);
for (const f of ['lote-01.txt','lote-02.txt']) {
  const arr = fs.readFileSync(f,'utf8').split('\n').map(cn).filter(Boolean);
  const cov = arr.filter(t=>clsS.has(t)).length;
  console.log(f, 'total', arr.length, '| cubiertos por clasif:', cov);
}
