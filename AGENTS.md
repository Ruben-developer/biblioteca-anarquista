# AGENTS.md — Convenciones del proyecto

Guía para agentes autónomos (y humanos) que iteran sobre este repo.

## Qué es esto
**Archivo Histórico Anarquista** — app interactiva del movimiento anarquista:
línea temporal (1840-1968), mapa de regiones con textos, biografías, favoritos,
modo oscuro/claro, filtros y estadísticas. Deploy en GitHub Pages.

## Stack (IMPORTANTE)
- **React 18** + **Vite 4** + **Tailwind CSS 3** — JavaScript/JSX (NO TypeScript).
- Commands:
  - `npm run dev` — servidor de desarrollo (puerto 3000)
  - `npm run check` — verificación completa: **lint + tests + build** (DEBE pasar siempre)
  - `npm run test` — tests unitarios (Vitest, `src/**/*.test.js`)
  - `npm run build` — build de producción a `dist/`
  - `npm run lint` — `eslint src --ext .js,.jsx` (0 errores; warnings de prop-types tolerados)
  - `npm run check-downloads` — verifica que todos los `filename` del catálogo respondan HTTP 200 en el contenedor
  - `npm run test:coverage` — tests Vitest con cobertura v8 (genera `coverage/lcov.info`)
  - `npm run preview` — sirve el build local
- CI de Pages: `npm ci` → lint → test → audit (informativo) → build → deploy.

## Estructura
```
src/
├── components/   # Header, Navigation, TimelineView, WorldMapView + WorldMap (mapamundi propio con d3-geo), AuthorsView, FavoritesView, modales
├── data/         # regionData.js (FUENTE ÚNICA: regiones + libros + iso), timelineEvents.js, authors.js, countryData.js (deriva ISO), worldmap.geo.json (geometrías del mapa)
├── services/     # documentService.js (solo getDocumentDownloadUrl: PDFs del contenedor, TXT del repo)
├── constants/    # Categorías, décadas, regiones (derivadas), vistas, temas de color
├── hooks/        # useScrollTop, useDarkMode, useFavorites
└── utils/        # filters.js, countryNames.js (normalización nombres de país del mapa)
public/documents/ # documents.json (metadatos) + TXT de descarga
data/registros/   # registro.json (métricas diarias del agente)
.daily-runs/      # logs diarios del agente
```
## Cómo añadir contenido
- **Evento histórico** → `src/data/timelineEvents.js` (año, década, title, description, region, category, image, quote, author).
  - Cada evento tiene un **`type`**: `'con_texto'` (tiene textos vinculados, declara `relatedTexts` con los TÍTULOS) o `'hecho'` (suceso sin texto propio).
  - `relatedTexts` empareja por **título**, NO por región/país: así el 15M (2011) enlaza solo con textos del 15M y no con la guerra civil (ambos son de España).
- **Autor** → `src/data/authors.js` (name, years, region, bio, books, image).
- **Texto por región** → `src/data/regionData.js`. Campos: `title`, `author`, `year`, `category`, `rating`, y opcional `filename`. **FUENTE ÚNICA**: `REGIONS` (filtros) y el ISO del mapa se derivan automáticamente de aquí; no hay que tocar `countryData.js` ni `REGIONS` manualmente.
- **Metadatos completos de obra** → legacy en `public/documents/documents.json`. Ya no se consume en la app (el catálogo real es `regionData.js`); no añadir obras nuevas aquí.
- **Nuevo PDF descargable** → añade `filename` al libro en `regionData.js` (el botón Descargar solo aparece si hay `filename`).
- **Nuevo país en el mapa** → añade la región a `regionData.js` con su campo `iso` (ej. `"Francia": { iso: "fr", books: [...] }`). El mapa, los filtros y `countryData.js` se actualizan solos. Si un país no tiene `iso`, no se pinta en el mapa pero sí aparece en la lista por región.
- **Mapa**: un país solo se destaca si tiene AL MENOS 1 texto de categoría histórica (historia/revolucion/movimiento/organizacion/represion/periodismo/manifiesto). Si solo tiene teoría (p. ej. Inglaterra), queda en gris. Los textos históricos se filtran con `getHistoricalBooks(regionData, region)` en `src/utils/library.js`.
- **Biblioteca (catálogo)** → usa automáticamente todos los libros de `regionData.js` (`getAllBooks` en `src/utils/library.js`). No requiere registro aparte.
- **Lector embebido** → `src/components/ReaderView.jsx`. PDFs se muestran en iframe; TXT se cargan por fetch. Al abrir un libro desde la Biblioteca o el mapa se lanza `ReaderView`.

### Content importer — flujo de clasificación por TIPO
- Las obras se clasifican en 2 grandes tipos (ver `@content-importer`):
  - **historia** → mapa + línea temporal (categorías: historia, revolucion, movimiento, organizacion, represion, periodismo, manifiesto).
  - **filosofia** → autores (categorías: teoria, biografia, dialogo).
  - Ambos alimentan la **biblioteca** (`regionData.js`).
- El material entrante se deja en `PDFs/sin_clasificar/` y al clasificarlo se
  mueve a `PDFs/historia/` o `PDFs/filosofia/` en `/home/fdr/Documentos/anarquismo_importado/PDFs/`.

## Seguridad: servidor de PDFs (no exponer la IP)
- La IP interna del servidor (`192.168.1.117:8081`) NO debe aparecer en el código
  del repo ni en el bundle. `documentService.js` usa `PDF_BASE = VITE_PDF_BASE || '/pdfs/'`.
- **Desarrollo**: el proxy de Vite (`vite.config.js`, `/pdfs → http://192.168.1.117:8081`)
  resuelve la ruta relativa. Nunca pongas la IP en `documentService.js` ni en componentes.
- **Producción**: el CI inyecta `VITE_PDF_BASE` desde el secret de GitHub Actions.
  Si el secret no existe, el fallback `/pdfs/` NO funcionará en GitHub Pages
  (solo con el proxy de dev). Ver `.env.example` y `IDEAS.md`.

## Mapa interactivo mundial (FASE 4)
- **Componente propio** `src/components/WorldMap.jsx` renderizado con `d3-geo`
  (no usa librería externa de mapas). Datos en `src/data/worldmap.geo.json`
  (FeatureCollection GeoJSON, generado por `npm run generate-worldmap`).
- `src/data/countryData.js`: deriva `COUNTRY_ISO` desde el campo `iso` de cada región en `regionData.js` (fuente única, no hay que mantenerlo a mano).
- `src/components/WorldMapView.jsx`: vista que alimenta `WorldMap` con `data`,
  `styleFunction`, `onClickFunction`, `tooltipTextFunction` y colores por tema.
- **Política del mapa**: el GeoJSON fusiona la geometría de Israel dentro de
  Palestine (`npm run generate-worldmap` lo reconstruye desde el TopoJSON de
  Natural Earth). Israel NO existe como país en el mapa. No revertir esto.
- Los nombres que devuelve el mapa (inglés, ej. "United States of America") NO
  coinciden con las claves de `regionData.js` ("Estados Unidos") → usa
  `normalizeCountryName()` en `src/utils/` para traducir.
- Al seleccionar un país se abre `RegionModal` con sus textos (reutilizar lógica actual).
- Si algún día se quiere regenerar el GeoJSON (nuevos datos o geometrías),
  editar `scripts/generate-worldmap.mjs` y ejecutar `npm run generate-worldmap`.

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

## SonarQube (calidad)
- SonarQube 26.6.0 en `http://192.168.1.117:9000` (dashboard: `?id=biblioteca-anarquista`).
  Contenedores podman: `sonarqube` (server) + `sonarqube-db` (postgres).
- **Quality gate «Biblioteca Anarquista»** (asociado al proyecto): `new_coverage ≥ 50%`,
  `new_duplicated_lines_density ≤ 3%`, `new_violations ≤ 20`. NO usar «Sonar way» (80%/0, inviable en este frontend).
- Scanner local: `~/tools/sonar-scanner` (symlink `~/.local/bin/sonar-scanner`).
  Token (secreto, NO commitear): `~/.config/biblioteca/sonar.token`.
- Análisis manual:
  ```
  cd ~/biblioteca-anarquista && npm run test:coverage
  sonar-scanner -Dsonar.host.url=http://192.168.1.117:9000 \
    -Dsonar.login="$(cat ~/.config/biblioteca/sonar.token)" \
    -Dsonar.projectBaseDir=/home/fdr/biblioteca-anarquista
  ```
  (el `sonar-project.properties` ya apunta a `sources=src` y `coverage/lcov.info`).
- Estado objetivo: **0 bugs, 0 vulnerabilidades, ratings A/A/A, gate OK**. `caycStatus: non-compliant` es el estándar CAYC de SonarQube, no afecta al gate.
- El hotspot `PDF_BASE` http (`documentService.js`) está marcado **SAFE** por diseño (PDFs locales). No revertir.
- Regenerar `coverage/` es normal; `coverage/` y `.scannerwork/` están en `.gitignore`.

## Reglas de los agentes (resumen)
- Trabaja SOLO en este repo, nunca en `devops-lab` ni otros proyectos.
- No toques `pdfs-local/` (los PDFs no se versionan) ni subas artefactos (`dist/`, `node_modules/`).
- No cambies `PDF_BASE` a hostname ni rompas la ruta `base: /biblioteca-anarquista/` en `vite.config.js`.
- Al añadir regiones al mapa, edita SOLO `regionData.js` (con su `iso`); `REGIONS` y `countryData.js` se derivan solos. No tocar esos dos manualmente.
- Tras cada cambio: `npm run check` (lint + tests + build) debe pasar, y el CI de Pages quedar verde. Si tocaste el catálogo, corre también `npm run check-downloads`.
- Mantén actualizados `PLAN.md`, `data/registros/registro.json` y `.daily-runs/`.
- Commits convencionales en español (`feat:`, `fix:`, `docs:`, `chore:`).

## Corrección autónoma de errores
- `@daily-dev` inicia cada turno con una inspección (paso 1.5 de su rutina):
  desincronizaciones entre archivos de regiones, descargas rotas (curl HTTP 200),
  warnings de build que puedan volverse errores.
- Errores críticos (rompen build/CI/descargas) se corrigen ANTES que la tarea del plan.
- Errores menores se corrigen en el momento o se registran como primera tarea pendiente.
- Además de la tarea del plan, el agente puede hacer 1-2 mejoras pequeñas y seguras
  por turno, en commits separados.

## Subagentes disponibles
- `@daily-dev` (primary): rutina diaria autónoma, 2 turnos (00:00 y 12:00).
- `@ux-review`: revisa UX/UI y entrega `data/registros/ux-report.md`.
- `@content-importer`: importa obras (PDFs/docx locales) con `pdftotext` y verifica HTTP 200 antes de publicar.
