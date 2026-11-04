# La Idea — Biblioteca digital anarquista

Biblioteca digital del movimiento anarquista mundial: **más de 1.800 textos en PDF**
de descarga libre, línea temporal (1840-1968), mapa de regiones, biografías de
pensadores, rutas de lectura, favoritos, modo oscuro/claro, filtros avanzados y
estadísticas.

- **Contacto**: antarquia@riseup.net (formulario en la propia web)
- **Stack**: React 18 + Vite 4 + Tailwind CSS
- **Deploy**: Cloudflare Workers → https://laidea.antarquia.cl (prod, `main`) y
  beta desde `develop`; GitHub Pages queda como respaldo
- **Contenido**: `src/data/` (eventos, autores, textos por región) + `public/documents/`
- **Descargas PDF**: contenedor nginx local vía Tailscale (`VITE_PDF_BASE`), TXT desde el repo
- **Métricas**: `data/registros/registro.json`
- **Plan y evolución**: `PLAN.md` + `.daily-runs/`
- **Seguridad**: ver [`SECURITY.md`](SECURITY.md) · **Licencia**: MIT (ver [`LICENSE`](LICENSE))

## Desarrollo local

```bash
npm install
npm run dev
```

## Estructura

```
src/
├── components/   # Header, Navigation, TimelineView, MapView, AuthorsView, FavoritesView, modales...
├── data/         # timelineEvents.js, authors.js, regionData.js
├── services/     # documentService.js (carga metadatos y resuelve descargas)
├── constants/    # Categorías, décadas, regiones, vistas, temas de color
├── hooks/        # useScrollTop, useDarkMode, useFavorites
└── utils/        # filters.js (filtrado de eventos, estadísticas)
```

## Añadir contenido

- **Evento histórico**: edita `src/data/timelineEvents.js`
- **Autor**: edita `src/data/authors.js`
- **Texto por región**: edita `src/data/regionData.js` (campo `filename` enlaza al PDF del contenedor)
- **Metadatos completos**: `public/documents/documents.json`
