# AGENTS.md — Convenciones del proyecto

Guía para agentes autónomos (y humanos) que iteran sobre este repo.

## Qué es esto
**Archivo Histórico Anarquista** — app interactiva del movimiento anarquista:
línea temporal (1840-1968), mapa de regiones con textos, biografías, favoritos,
modo oscuro/claro, filtros y estadísticas. Deploy en GitHub Pages.

## Stack (IMPORTANTE)
- **React 18** + **Vite 4** + **Tailwind CSS 3** — JavaScript/JSX (NO TypeScript).
- No hay tests configurados; verificación = build + lint.
- Commands:
  - `npm run dev` — servidor de desarrollo (puerto 3000)
  - `npm run build` — build de producción a `dist/` (DEBE pasar siempre)
  - `npm run lint` — `eslint src --ext .js,.jsx` (0 errores; warnings de prop-types tolerados)
  - `npm run preview` — sirve el build local

## Estructura
```
src/
├── components/   # Header, Navigation, TimelineView, MapView, AuthorsView, FavoritesView, modales
├── data/         # timelineEvents.js, authors.js, regionData.js
├── services/     # documentService.js (descargas: PDFs del contenedor, TXT del repo)
├── constants/    # Categorías, décadas, regiones, vistas, temas de color
├── hooks/        # useScrollTop, useDarkMode, useFavorites
└── utils/        # filters.js
public/documents/ # documents.json (metadatos) + TXT de descarga
data/registros/   # registro.json (métricas diarias del agente)
.daily-runs/      # logs diarios del agente
```

## Cómo añadir contenido
- **Evento histórico** → `src/data/timelineEvents.js` (año, década, title, description, region, category, image, quote, author).
- **Autor** → `src/data/authors.js` (name, years, region, bio, books, image).
- **Texto por región** → `src/data/regionData.js`. Campos: `title`, `author`, `year`, `category`, `rating`, y opcional `filename`.
- **Metadatos completos de obra** → `public/documents/documents.json` (id, title, author, summary, tags, filename, rating...).
- **Nuevo PDF descargable** → añade `filename` al libro en `regionData.js` (el botón Descargar solo aparece si hay `filename`).
- **Nuevo país en el mapa** → añade la región a `regionData.js`, el código ISO en `src/data/countryData.js`, y a `REGIONS` en `src/constants/index.js` (¡los 3 lugares o el mapa/filtros quedan desincronizados!).

## Mapa interactivo mundial (FASE 4)
- Librería: `react-svg-worldmap` (mapa bundled, sin API key, compatible GitHub Pages).
- `src/data/countryData.js`: mapea región → código ISO 3166-1 alpha-2 (ej. `es`, `fr`, `ru`).
- `src/components/WorldMapView.jsx`: `WorldMap` con `data`, `onCountryClick`, colores por tema.
- Los nombres que devuelve el mapa (inglés, ej. "United States of America") NO
  coinciden con las claves de `regionData.js` ("Estados Unidos") → usa
  `normalizeCountryName()` en `src/utils/` para traducir.
- Al seleccionar un país se abre `RegionModal` con sus textos (reutilizar lógica actual).

## Descargas (PDFs)
- Los PDFs NO viven en el repo (gitignored `pdfs-local/`). Se sirven desde el
  contenedor nginx local en `http://192.168.1.117:8081/pdfs/<filename>`.
- `src/services/documentService.js`:
  - `getDocumentDownloadUrl(filename)`: si es `.pdf` → `PDF_BASE` (contenedor); si no → `${BASE_URL}documents/` (TXT del repo).
  - `PDF_BASE = 'http://192.168.1.117:8081/pdfs/'` — usar la **IP**, no el hostname
    (`server` solo resuelve a IPv6). No cambiar sin coordinación.
- `filename` reales disponibles: carpeta `anarquismo/` (~324 PDFs), `otros/` (~77),
  `ref/` (~9). Verifica con `ls ~/biblioteca-anarquista/pdfs-local/` y prueba con
  `curl -s -o /dev/null -w "%{http_code}" http://192.168.1.117:8081/pdfs/<file>`.

## Reglas de los agentes (resumen)
- Trabaja SOLO en este repo, nunca en `devops-lab` ni otros proyectos.
- No toques `pdfs-local/` (los PDFs no se versionan) ni subas artefactos (`dist/`, `node_modules/`).
- No cambies `PDF_BASE` a hostname ni rompas la ruta `base: /biblioteca-anarquista/` en `vite.config.js`.
- Al añadir regiones al mapa, actualiza SIEMPRE los 3 sitios: `regionData.js`, `countryData.js`, `REGIONS` en `constants/index.js`.
- Tras cada cambio: `npm run build` + `npm run lint` deben pasar, y el CI de Pages quedar verde.
- Mantén actualizados `PLAN.md`, `data/registros/registro.json` y `.daily-runs/`.
- Commits convencionales en español (`feat:`, `fix:`, `docs:`, `chore:`).

## Subagentes disponibles
- `@daily-dev` (primary): rutina diaria autónoma, 2 turnos (00:00 y 12:00).
- `@ux-review`: revisa UX/UI y entrega `data/registros/ux-report.md`.
- `@content-importer`: importa obras (PDFs/docx locales) con `pdftotext` y verifica HTTP 200 antes de publicar.
