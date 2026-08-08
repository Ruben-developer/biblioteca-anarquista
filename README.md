# Archivo Histórico Anarquista

Archivo histórico interactivo del movimiento anarquista mundial: línea temporal
(1840-1968), mapa de regiones con textos, biografías de pensadores, favoritos,
modo oscuro/claro, filtros avanzados y estadísticas.

- **Stack**: React 18 + Vite 4 + Tailwind CSS
- **Deploy**: GitHub Pages → https://ruben-developer.github.io/biblioteca-anarquista/
- **Contenido**: `src/data/` (eventos, autores, textos por región) + `public/documents/`
- **Descargas PDF**: contenedor nginx local (`http://192.168.1.117:8081/pdfs/...`), TXT desde el repo
- **Métricas**: `data/registros/registro.json`
- **Plan y evolución**: `PLAN.md` + `.daily-runs/`

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
