#!/usr/bin/env python3
"""
Micro-servicio de analytics invisible para La Idea.
- Cuenta visitas por día/semana/mes/año
- Excluye IP del administrador
- Detecta país vía IP (geojs.me, sin cookies)
- Almacena en JSON (append-only)
- Sirve 1x1 GIF transparente como beacon
"""

import json
import os
import time
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from functools import lru_cache

from flask import Flask, request, Response, jsonify

app = Flask(__name__)

# Config
DATA_DIR = Path(os.environ.get('DATA_DIR', '/data'))
VISITS_FILE = DATA_DIR / 'visits.jsonl'
GEO_CACHE_FILE = DATA_DIR / 'geo_cache.json'
EXCLUDE_IP = os.environ.get('EXCLUDE_IP', '')
PORT = int(os.environ.get('PORT', 8090))

# 1x1 transparent GIF (base64)
PIXEL = (
    b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00'
    b'\xff\xff\xff\x00\x00\x00\x21\xf9\x04\x00\x00\x00\x00'
    b'\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02'
    b'\x44\x01\x00\x3b'
)


def get_country(ip):
    """Obtiene país desde IP usando geojs.me (gratis, sin API key)."""
    if ip in ('127.0.0.1', '::1', ''):
        return 'Local'

    # Cache simple
    cache = {}
    if GEO_CACHE_FILE.exists():
        try:
            cache = json.loads(GEO_CACHE_FILE.read_text())
        except Exception:
            cache = {}

    if ip in cache:
        return cache[ip]

    try:
        import urllib.request
        req = urllib.request.Request(
            f'https://get.geojs.io/v1/ip/country/{ip}.json',
            headers={'User-Agent': 'analytics/1.0'}
        )
        with urllib.request.urlopen(req, timeout=2) as resp:
            data = json.loads(resp.read())
            country = data.get('country', 'Desconocido')
            cache[ip] = country
            GEO_CACHE_FILE.write_text(json.dumps(cache))
            return country
    except Exception:
        return 'Desconocido'


def append_visit(ip, page, country):
    """Append una visita al archivo JSONL."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    entry = {
        'ts': datetime.utcnow().isoformat(),
        'ip': hashlib.sha256(ip.encode()).hexdigest()[:12],  # hash, no IP real
        'page': page,
        'country': country,
    }
    with open(VISITS_FILE, 'a') as f:
        f.write(json.dumps(entry) + '\n')


def load_visits():
    """Carga todas las visitas."""
    if not VISITS_FILE.exists():
        return []
    visits = []
    for line in VISITS_FILE.read_text().strip().split('\n'):
        if line:
            try:
                visits.append(json.loads(line))
            except Exception:
                pass
    return visits


@app.route('/pixel.gif')
def pixel():
    """Beacon invisible: registra visita y devuelve GIF transparente."""
    ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    if ip:
        ip = ip.split(',')[0].strip()

    # Excluir IP del admin
    if EXCLUDE_IP and ip == EXCLUDE_IP:
        return Response(PIXEL, mimetype='image/gif')

    page = request.args.get('p', '/')
    country = get_country(ip)
    append_visit(ip, page, country)

    return Response(PIXEL, mimetype='image/gif')


@app.route('/stats')
def stats():
    """API de métricas."""
    period = request.args.get('period', 'day')  # day, week, month, year
    now = datetime.utcnow()
    visits = load_visits()

    # Filtrar por período
    if period == 'day':
        cutoff = now - timedelta(days=1)
    elif period == 'week':
        cutoff = now - timedelta(weeks=1)
    elif period == 'month':
        cutoff = now - timedelta(days=30)
    elif period == 'year':
        cutoff = now - timedelta(days=365)
    else:
        cutoff = datetime.min

    filtered = [v for v in visits if datetime.fromisoformat(v['ts']) >= cutoff]

    # Calcular métricas
    unique_ips = set(v['ip'] for v in filtered)
    countries = {}
    pages = {}
    by_date = {}

    for v in filtered:
        c = v.get('country', 'Desconocido')
        countries[c] = countries.get(c, 0) + 1
        p = v.get('page', '/')
        pages[p] = pages.get(p, 0) + 1
        d = v['ts'][:10]
        by_date[d] = by_date.get(d, 0) + 1

    return jsonify({
        'period': period,
        'total_visits': len(filtered),
        'unique_visitors': len(unique_ips),
        'countries': dict(sorted(countries.items(), key=lambda x: -x[1])),
        'pages': dict(sorted(pages.items(), key=lambda x: -x[1])),
        'by_date': dict(sorted(by_date.items())),
    })


@app.route('/health')
def health():
    return jsonify({'status': 'ok'})


DASHBOARD_HTML = '''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Analytics — La Idea</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui;background:#111;color:#e5dcd0;padding:2rem}
h1{font-size:1.5rem;color:#D02C26;margin-bottom:1.5rem;text-transform:uppercase;letter-spacing:.1em}
.tabs{display:flex;gap:.5rem;margin-bottom:1.5rem}
.tabs button{background:#222;color:#aaa;border:1px solid #444;padding:.4rem 1rem;border-radius:4px;cursor:pointer;font-size:.85rem}
.tabs button.active{background:#D02C26;color:#fff;border-color:#D02C26}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:2rem}
.card{background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:1.2rem}
.card .label{font-size:.75rem;color:#888;text-transform:uppercase;letter-spacing:.05em}
.card .value{font-size:2rem;font-weight:700;color:#D02C26;margin-top:.3rem}
table{width:100%;border-collapse:collapse;margin-bottom:1.5rem}
th{text-align:left;font-size:.75rem;color:#888;text-transform:uppercase;padding:.5rem;border-bottom:1px solid #333}
td{padding:.5rem;border-bottom:1px solid #222;font-size:.9rem}
td:last-child{text-align:right;color:#D02C26;font-weight:600}
h2{font-size:1rem;color:#aaa;margin:1.5rem 0 .8rem;text-transform:uppercase;letter-spacing:.05em}
.period{color:#666;font-size:.8rem}
</style>
</head>
<body>
<h1>Analytics — La Idea</h1>
<div class="tabs" id="tabs">
<button data-p="day" class="active">Hoy</button>
<button data-p="week">Semana</button>
<button data-p="month">Mes</button>
<button data-p="year">Año</button>
<button data-p="all">Todo</button>
</div>
<div class="grid" id="cards"></div>
<div id="tables"></div>
<script>
const API=location.protocol+'//'+location.hostname+':8090';
let cur='day';
async function load(p){
cur=p;
const r=await fetch(API+'/stats?period='+p);
const d=await r.json();
document.getElementById('cards').innerHTML=
'<div class="card"><div class="label">Visitas</div><div class="value">'+d.total_visits+'</div></div>'+
'<div class="card"><div class="label">Visitantes únicos</div><div class="value">'+d.unique_visitors+'</div></div>'+
'<div class="card"><div class="label">Países</div><div class="value">'+Object.keys(d.countries).length+'</div></div>'+
'<div class="card"><div class="label">Páginas</div><div class="value">'+Object.keys(d.pages).length+'</div></div>';
let h='';
if(Object.keys(d.countries).length){
h+='<h2>Por país</h2><table><tr><th>País</th><th>Visitas</th></tr>';
for(const[k,v] of Object.entries(d.countries))h+='<tr><td>'+k+'</td><td>'+v+'</td></tr>';
h+='</table>';}
if(Object.keys(d.pages).length){
h+='<h2>Por página</h2><table><tr><th>Página</th><th>Visitas</th></tr>';
for(const[k,v] of Object.entries(d.pages))h+='<tr><td>'+k+'</td><td>'+v+'</td></tr>';
h+='</table>';}
if(Object.keys(d.by_date).length){
h+='<h2>Por fecha</h2><table><tr><th>Fecha</th><th>Visitas</th></tr>';
for(const[k,v] of Object.entries(d.by_date).reverse())h+='<tr><td>'+k+'</td><td>'+v+'</td></tr>';
h+='</table>';}
document.getElementById('tables').innerHTML=h;}
document.getElementById('tabs').onclick=e=>{if(e.target.dataset.p){
document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('active'));
e.target.classList.add('active');load(e.target.dataset.p);}};
load('day');
</script>
</body></html>'''


@app.route('/dashboard')
def dashboard():
    return Response(DASHBOARD_HTML, mimetype='text/html')


if __name__ == '__main__':
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    app.run(host='0.0.0.0', port=PORT, debug=False)
