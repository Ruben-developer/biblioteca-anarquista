# Biblioteca Anarquista Digital — Archivo Histórico Anarquista

> Fecha inicio: 2026-08-07
> Estado: ACTIVA — mejora diaria autónoma (agente `daily-dev`, cron 12:00)
> Stack: React 18 + Vite 4 + Tailwind CSS + GitHub Pages

---

## 1. Objetivo

Archivo histórico interactivo del movimiento anarquista mundial: línea temporal
(1840-1968), mapa de regiones con textos, biografías de pensadores, favoritos,
modo oscuro/claro, filtros avanzados y estadísticas. La web crece y mejora
**cada día de forma autónoma**: el agente añade contenido (eventos, autores,
textos), mejora la lógica y registra métricas.

## 2. Estructura del repo

```
PLAN.md                  → este plan (tareas, ideas, roadmap, próximo día)
data/registros/registro.json → métricas estructuradas día a día
data/registros/ux-report.md → reporte del revisor UX/UI (subagente @ux-review)
.daily-runs/*.md         → logs narrativos diarios del agente
src/                     → app React (componentes, datos, servicios)
  components/            → Header, Navigation, TimelineView, MapView, AuthorsView, FavoritesView, modales...
  data/                  → timelineEvents.js, authors.js, regionData.js, countryData.js (ISO por región)
  services/              → documentService.js (descargas de documentos)
  constants/  hooks/  utils/
public/documents/        → documents.json (metadatos) + TXT de descarga
.github/workflows/pages.yml → build + deploy a GitHub Pages
```

## 3. Modelo de datos

- `src/data/timelineEvents.js`: eventos históricos (año, década, región, categoría, cita).
- `src/data/authors.js`: biografías de pensadores (nombre, años, región, bio, nº textos).
- `src/data/regionData.js`: textos por región (título, autor, año, categoría, `filename` → PDF en el contenedor).
- `public/documents/documents.json`: metadatos completos por obra (id, tags, summary, filename, rating...).
- `src/services/documentService.js`: carga metadatos y resuelve URL de descarga
  (PDFs → contenedor nginx local, TXT → dentro del repo).

## 4. Roadmap (el agente lo va tachando)

### FASE 1 — Base funcional (proyecto real migrado 2026-08-08)
- [x] Migrar proyecto original "Archivo Histórico Anarquista" a este repo.
- [x] Línea temporal interactiva con filtros (década, categoría, región, búsqueda).
- [x] Mapa de regiones con textos por país.
- [x] Biografías de pensadores.
- [x] Favoritos con persistencia en localStorage.
- [x] Modo oscuro/claro con persistencia.
- [x] Estadísticas (textos, eventos, regiones, pensadores).
- [x] Deploy a GitHub Pages con workflow (`base: /biblioteca-anarquista/`).
- [x] Descargas: PDFs desde contenedor nginx local :8081 + TXT desde el repo.

### FASE 2 — Contenido y lógica
- [x] Ampliar `regionData.js` a 65 obras con 59 PDFs verificados y 11 regiones (agente autónomo 2026-08-08 12:03).
- [x] **Biblioteca/catálogo** (`LibraryView.jsx`): navegación por obras con búsqueda y filtros combinados (categoría + región + década + orden), util `src/utils/library.js`.
- [x] **Lector embebido** (`ReaderView.jsx`): PDF en iframe y TXT con controles de fuente/tema; se abre sin salir de la web.
- [x] **Enmascarar servidor de PDFs**: `PDF_BASE = VITE_PDF_BASE || '/pdfs/'` + proxy de Vite en dev; la IP interna no se versiona ni queda en el bundle.
- [x] Ampliar `timelineEvents.js` a 16 eventos históricos (1900s–2010s, décadas posteriores a 1968) (2026-08-10).
- [ ] Ampliar `authors.js` (más pensadores: Rocker, Bookchin, Proudhon...). → **SUPERADO 2026-08-10**: la sección de Autores ahora se deriva del catálogo con `getAllAuthors()` (ver FASE 2 nota).
- [ ] Enriquecer `documents.json` (más obras con metadatos completos).
- [ ] Dashboard de métricas del archivo.

### FASE 3 — Lectura enriquecida
- [x] **Obra destacada aleatoria del día** ✅ 2026-08-12: widget "Obra del día" en la Biblioteca — selección determinista por fecha local (`getDailyFeaturedBook` en `library.js`), prioriza obras legibles con resumen, botón de lectura directo. Commit 5a76b39.
- [ ] Referencias cruzadas entre textos y eventos.
- [ ] Mapas visuales por región.
- [ ] Más filtros y búsqueda avanzada.

### FASE 4 — Mapa interactivo mundial por país (alta prioridad) ✅ COMPLETADA 2026-08-09
Objetivo cumplido: el grid de regiones (`MapView`) se sustituyó por un
**mapamundi político interactivo**: cada país clickeable, al seleccionarlo se
abre `RegionModal` con los textos de ese país (con su modal/descarga actuales).

**Librería usada**: `react-svg-worldmap` (v2.0.2, MIT).
- Por qué: mapa bundled local (funciona en GitHub Pages sin red ni API key),
  API simple, usa códigos ISO 3166-1 alpha-2 (ej. `es`, `fr`, `it`, `ru`), accesible (WCAG 2.2).
- Instalación: `npm i react-svg-worldmap` (React >=16.8 ✓ compatible con React 18).

**Pasos implementados** (2026-08-09, agente `daily-dev` 12:00):
1. `npm i react-svg-worldmap` ✓
2. `src/data/countryData.js`: mapeo región → ISO alpha-2 (11 regiones) ✓
3. `src/components/WorldMapView.jsx`: `WorldMap` con `data` (países con valor = nº
   de textos), `onClickFunction` → región, `styleFunction` (países con textos en
   rojo/ámbar del tema, resto gris), tooltip nativo con nº de textos ✓
4. Integrado en `AnarchistArchive.jsx` en `VIEWS.MAP` (reemplaza `MapView`),
   conectado a `RegionModal`; el grid de regiones queda como listado bajo el mapa ✓
5. `src/utils/countryNames.js`: `normalizeCountryName()` traduce nombres del mapa
   ("United States", "United Kingdom", "Republic of Korea"... ) a claves de `regionData`
   ("Estados Unidos", "Inglaterra", "Corea"), con 3 tests unitarios ✓
6. Fallback: países sin textos no son clickeables (estado vacío controlado) ✓

**Verificación**: `npm run check` (lint 0 errores + 15 tests + build) verde, CI de Pages verde.

### FASE 5 — Autonomía y agentes
- [x] Agente `daily-dev` (primary) con rutina de 9 pasos + delegación a subagentes.
- [x] Subagente `@ux-review`: revisa UX/UI y entrega `data/registros/ux-report.md`.
- [x] Subagente `@content-importer`: importa obras (PDFs/docx locales) al catálogo con `pdftotext` y verifica HTTP 200.
- [x] Cron 2 veces al día (00:00 y 12:00).
- [ ] Que `daily-dev` invoque a `@ux-review` periódicamente (p. ej. una vez por semana o cuando la tarea lo requiera).
- [ ] Que `daily-dev` use `@content-importer` para seguir ampliando el catálogo hasta agotar los ~400 PDFs disponibles.

### FASE 6 — Calidad y DevOps (DevSecOps parcial)
- [x] Tests unitarios con Vitest (`src/**/*.test.js`, actualmente 28 tests: 12 de `filters.js` + 3 de `countryNames.js` + 8 de `WorldMap` + 5 de modales).
- [x] Comando `npm run check` = lint + test + build (puerta única de calidad).
- [x] `npm run check-downloads`: verifica HTTP 200 de todos los filename del catálogo (59/59 OK).
- [x] CI de Pages ampliado: lint → test → audit → build → deploy.
- [x] Inspección autónoma del agente: `npm audit` + `check-downloads` al inicio de cada turno (paso 1.5).
- [x] **SonarQube conectado** (scanner 8.1.0, `sonar-project.properties`, token en `~/.config/biblioteca/sonar.token`). Quality gate «Biblioteca Anarquista»: **OK**, 0 bugs, 0 vulns, ratings A/A/A, `new_coverage` 61.4%. Hotspot PDF_BASE marcado SAFE.
- [x] Cobertura de código con Vitest v8 (`npm run test:coverage`, coverage global 32%, gate con umbral en código nuevo).
- [x] Más tests: cobertura para `documentService.js`, hooks y componentes clave (2026-08-10): **59 → 80 tests**, statements 55.4%→62.9%, functions 41.1%→59.0%. SonarQube gate OK (new_coverage 61.4%).
- [ ] (Opcional) Añadir análisis SonarQube al CI de Pages (secrets: token).

## 5. Reglas del agente (resumen)
- Trabaja SOLO en este repo, nunca en `devops-lab`.
- Cada día: elegir tarea de PLAN.md (o inventar idea razonable si no hay), implementar, build/test, commit, push, esperar CI, actualizar PLAN.md, registrar métricas en `registro.json` y log en `.daily-runs/`.
- No romper: cada cambio debe dejar build y CI verdes.
- No subir secretos ni dependencias de más (respetar package-lock).
- Lint: `npm run lint` (eslint, 0 errores; warnings de prop-types tolerados).

## 5.1 Servidor de descargas (PDFs)

Los PDFs (≈660 MB, 401 archivos) NO van al repo git. Se sirven desde un
contenedor nginx local en la máquina siempre-encendida, y la web enlaza
`Descargar →` a esa URL.

- Contenedor: `pdf-server` (nginx:alpine), puerto **8081**, sirve la copia
  `pdfs-local/` (`/pdfs/...`), `autoindex off`.
- Copia en `/home/fdr/biblioteca-anarquista/pdfs-local/` (subcarpetas
  `anarquismo/`, `otros/`, `ref/`), nunca la carpeta original de `Documentos`.
- Origen: `/home/fdr/Documentos/anarquismo_importado/PDFs/` (401 PDFs)
  + `Editorial_Gato_Negro/` (125 docx).
- `documentService.js` resuelve `filename` → `PDF_BASE` (ver §enmascaramiento abajo).
- IP usada porque el hostname `server` solo resuelve a IPv6 (ver §5.1.1).

### Enmascaramiento del servidor de PDFs (2026-08-09)
- **La IP interna NO se versiona ni queda en el bundle.**
- `documentService.js`: `PDF_BASE = import.meta.env.VITE_PDF_BASE || '/pdfs/'`.
- **Dev**: proxy de Vite (`vite.config.js` → `/pdfs` a `http://192.168.1.117:8081`);
  la app solo ve rutas relativas. Verificado: 0 requests con la IP en el bundle.
- **Producción (GitHub Pages)**: el CI (`pages.yml`) inyecta `VITE_PDF_BASE` desde el
  secret `VITE_PDF_BASE`. Si el secret apunta a una URL pública (túnel Cloudflare,
  Tailscale Serve), los PDFs se sirven enmascarando la IP. Sin secret, el fallback
  `/pdfs/` solo funciona con el proxy de dev.
- Ver `.env.example`.

### 5.1.1 Pendiente servidor
- [ ] Añadir `server` a `/etc/hosts` (`192.168.1.117 server`) → cambiar PDF_BASE a `http://server:8081/pdfs/`.
- [ ] Script de sincronización de `pdfs-local/` desde `Documentos` cuando cambie.

### Plan FUTURO — Cloudflare Tunnel (guardado, cuando se quiera acceso público)
1. Instalar `cloudflared` y autenticar con el dominio de Cloudflare.
2. Crear túnel: `cloudflared tunnel create biblioteca` → enruta el puerto 8081
   al dominio (ej. `biblioteca.<tudominio>.com` o DuckDNS).
3. **No se abre ningún puerto en el router**: el túnel sale de la máquina.
4. HTTPS automático por Cloudflare, sin exponer IP ni port-forward.
5. Medidas de seguridad SIEMPRE: contenedor sin root, filesystem de solo
   lectura, servir copia (nunca la original), `autoindex off`, actualizaciones
   periódicas de la imagen nginx.
6. Riesgo aceptado: si la máquina se apaga o el túnel cae, las descargas
   fallan (la web sigue en GitHub Pages).

## 5.2 Ideas de mejora del usuario (backlog, se van priorizando)
- [ ] **Estética**: iterar paleta de colores y tipografía (variables CSS ya separadas). Puesta a punto visual en general.
- [ ] **Línea de tiempo** de autores y obras (ordenado por año). ← ya existe en el proyecto real, pulir.
- [ ] **Agrupar por país** (campo `pais` en cada obra; lista primero, mapa después). ← el mapa interactivo (FASE 4) lo cubre.
- [ ] **Agente revisor UX/UI**: subagente que critique el diseño y pase notas al agente principal. ✅ creado como `@ux-review`.
- [ ] **Importar textos propios del servidor** (401 PDFs + 125 docx en `Documentos/anarquismo_importado/`; fichas con `pdftotext` para extracto + `filename` al servidor local). ✅ subagente `@content-importer`.
- [ ] **Descargar textos de dominio público** de fuentes fiables (The Anarchist Library, Marxists.org, etc.) cuando el usuario indique las URLs.
- [ ] **Descarga desde la página**: botón para descargar la obra en PDF/TXT/EPUB (el botón ya existe, falta el export TXT/EPUB).

## 6. Próximo día
 - [x] **MAPAMUNDI INTERACTIVO (FASE 4)** ✅ completada 2026-08-09: `react-svg-worldmap` instalado, `countryData.js`, `WorldMapView.jsx`, conectado a `RegionModal`, `normalizeCountryName()` con tests, build+lint+CI verdes.
 - [x] **Mapa propio con d3-geo** ✅ 2026-08-09: sustituye `react-svg-worldmap` por `src/components/WorldMap.jsx` + `src/data/worldmap.geo.json` (generado por `npm run generate-worldmap`). La geometría de Israel se fusiona dentro de Palestine (Israel deja de existir en el mapa); 174 países, 23 tests verdes.
 - [x] Corregir `REGIONS` en `src/constants/index.js` para incluir las 11 regiones del mapa (revisado 2026-08-09: ya sincronizado desde el 2026-08-08).
 - [x] **FASE 2**: ampliar `timelineEvents.js` con más eventos y décadas posteriores a 1968 ✅ 2026-08-10: 8 → 16 eventos históricos reales (1909-2012: Semana Trágica, Sacco y Vanzetti, Jornadas Libertarias, zapatismo, Seattle, Génova, 15M, Rojava). `DECADES` sincronizada (quita 1840s vacía, añade 1970s-2010s). Build+64 tests+CI verdes.
 - [x] **Sección Autores dinámica** ✅ 2026-08-10 (humano): "Biografías" → "Autores del Archivo" derivados del catálogo (`getAllAuthors`), mapa y timeline solo con textos históricos, `EventModal` con textos relacionados (`getEventRelatedTexts`). Catálogo ampliado a 109 obras (commits 205c138, 53768ae, 1ac1394).
 - [x] **FASE 6: tests de `documentService.js` y hooks** ✅ 2026-08-10 (12:00): 15 tests del servicio de documentos (URLs PDF/TXT, fetch simulado, consultas, estadísticas) + 6 tests de hooks (estado inicial y persistencia en localStorage). 59→80 tests, statements 55.4%→62.9%, functions 41.1%→59.0%. SonarQube gate OK (new_coverage 61.4%). Commit 52d6c2d.
 - [x] **FASE 6: tests interactivos de componentes clave** ✅ 2026-08-11 (00:00): nuevo `src/components/Interactions.test.jsx` con 18 tests jsdom que ejecutan los handlers de `TimelineFilters` (búsqueda/década/categoría/región/limpiar), `TourModal`/`EventModal`/`RegionModal` (cierre por backdrop y Escape, favoritos) y `LibraryView` (filtros combinados, vacío, favoritos) + navegación completa de `AnarchistArchive` (Biblioteca, evento→modal, tour). **Coverage: statements 94.65%→97%, branches 68.7%→79.35%, functions 61.22%→84.69%**. 99→117 tests, CI verde (run 31457459234). Commits 22e0ef0 + 7995d2c (caniuse-lite).
 - [x] **FASE 6: cubrir ramas pendientes (objetivo 85%+ SUPERADO)** ✅ 2026-08-11 (12:00): 37 tests nuevos en 8 archivos (Views, WorldMapView, LibraryView, Modals, AnarchistArchive, WorldMap, library, documentService) para ramas edge: modos de tema oscuro de vistas, regiones sin ISO/sin books en el mapa, libros sin año/rating/resumen, favoritos, región inexistente, autores sin años/regiones, obras sin archivo, scroll top, tooltip/click del mapa (jsdom), sort con campos incompletos, `getEventRelatedTexts` y JSON malformado. **Coverage: 117→154 tests, statements 97%→98.98%, branches 79.35%→97.96% (396/499→578/590), functions 84.69%→90.81%**. `npm run check` verde, CI de Pages verde (run 31511160387). Commit 49bea9f.
 - [ ] Enriquecer `documents.json` con metadatos completos de las obras nuevas del catálogo (hoy solo 2 entradas; el servicio usa `regionData` como fuente principal, ver decisión en la nota del día). → **BAJA PRIORIDAD**: `documents.json` quedó legacy (solo lo usa `documentService.js` para consultas no usadas por la UI; el catálogo real vive en `regionData.js` + `library.js`). Se sugiere en su lugar **eliminar la deuda**: valorar deprecar `documentService` o documentar que es mantenimiento de compatibilidad.
 - [x] ~~FASE 6 (siguiente): subir ramas hacia el 85%+ y cubrir ramas pendientes de `WorldMap`, `RegionModal`, `LibraryView`, `EventModal` (branch coverage actual 79.35%).~~ → **SUPERADO 2026-08-11 (12:00)**: branches 97.96%, functions 90.81%.
 - [ ] (Ideas de mejora en evaluación) Dashboard de métricas, obra del día, más agentes expertos. → **OBRA DEL DÍA ✅ 2026-08-12**; siguen pendientes Dashboard de métricas y más agentes expertos.
 - [ ] **6 libros sin filename** (En el café, Mártires de Chicago, Regeneración, Tierra y Libertad, Severino Di Giovanni, Luis E. Recabarren): → **parcialmente atendido 2026-08-12**: ya se marcan "Sin archivo disponible" en la Biblioteca (UX honesta). Falta conseguir los textos (no están en el contenedor ni en el origen local; Bayer/Grez con derechos de autor). Pendiente para `@content-importer` cuando haya fuentes.
 - [ ] Ampliar el catálogo con `@content-importer` hasta agotar los ~400 PDFs del contenedor.
 - [x] **Invariante mapa ↔ timeline (regla de negocio con el usuario)** ✅ 2026-08-12 (12:00): tarjetas "O navega por región" SOLO con ≥1 texto histórico ordenadas por nº DESC (Inglaterra, solo teoría, ni se pinta ni crea tarjeta). **Invariante 27/44 → 44/44**: todos los textos históricos vinculados a eventos. Los eventos NACEN de los textos: 16 tarjetas nuevas + Makhnovschina→Kronstadt (32 eventos). `filterEvents` ordena cronológicamente. Autores = obra completa (historia + ideas). Nuevo subagente `@evento-builder` que mantiene `timeline == mapa`. **119 textos (44 hist / 75 ideas), 17 regiones, 32 eventos, 113 descargables**. 143 tests OK, `npm run check` verde, CI verde (run 31619838053). Commits 4d85cc7 + 6392eab.
 - [x] **FASE 3: Obra destacada del día** ✅ 2026-08-12 (ejecución extra 21:1x): widget "Obra del día" en la Biblioteca — `getDailyFeaturedBook` (determinista por fecha local; prioriza legibles con resumen; hoy: "La lucha contra el Estado", Nettlau 1920) + `FeaturedBook.jsx` con reseña y botón de lectura. Fix de negocio menor (IDEAS.md): las 6 obras sin `filename` muestran "Sin archivo disponible" en la Biblioteca. **143 → 155 tests**, `npm run check` verde (lint 0 + 155 tests + build), CI verde (run 31656981533). Commit 5a76b39.

### Nota del día (2026-08-12, 12:00)
Turno 12:00 del agente `daily-dev` (completado manualmente desde el chat: el cron
no pudo iniciar por cambios sin marcar previos). Inspección (paso 1.5): descargas
**113/113 OK**, regiones sincronizadas **17/17/17** (fuente única `regionData.js`),
`npm audit` con 5 vulnerabilidades SOLO en devDeps build-time (vite/vitest/esbuild;
fix exigiría `--force` y rompería Vite 4 → no aplica a Pages), build sin warnings.
**Tarea del plan (regla de negocio definida con el usuario — invariante mapa ↔
timeline)**:
- **Tarjetas del mapa**: SOLO regiones con ≥1 texto de categoría histórica,
  ordenadas por número DESC (`WorldMapView.jsx`). Inglaterra (solo teoría) ni se
  pinta en el mapa ni crea tarjeta.
- **Invariante `timeline == mapa`**: los textos de la línea temporal (vinculados a
  eventos) igualan los textos históricos del mapa. Antes **27/44**; ahora **44/44**.
- **Los eventos NACEN de los textos**: creadas 16 tarjetas nuevas (banda del Matese,
  propaganda por el hecho, mártires de Tokio, anarquismo en Chile/Colombia/Bolivia,
  comuna de Shinmin, educación libertaria, espejo judío, bajo la bandera negra,
  Nettlau, surrealismo, conjura de los indomables, historia de América Latina,
  África, Zapatista ampliado) + Makhnovschina → Kronstadt. Timeline: **32 eventos**.
- **Autores = obra completa**: `AuthorsView` muestra TODOS los libros por autor
  (historia + ideas); la suma "historia + autores = biblioteca" deja de ser una
  invariante frágil, cada vista responde a su propósito.
- **`filterEvents` ordena cronológicamente** (antes dependía del orden del archivo).
- **Nuevo subagente `@evento-builder`**: los textos históricos importados quedan
  siempre vinculados a una tarjeta de evento (creándola si no existe), manteniendo
  la invariante.
- Catálogo: **119 textos (44 históricos / 75 ideas), 17 regiones, 32 eventos,
  113 descargables** (nuevo PDF verificado: La Banda de Chernopeev 1903).

**Verificación**: `npm run check` (lint 0 errores + **143 tests** + build) verde.
`npm run check-downloads` → **113/113 OK**. CI de Pages verde (run 31619838053).
Commits 4d85cc7 (feat) + 6392eab (docs: IDEAS.md con backups PDFs, Vite, hooks,
SonarQube CI y fixes de negocio pendientes: rating y libros sin filename).

### Nota del día (2026-08-12, ejecución extra ~21:1x)
Ejecución adicional del agente `daily-dev` (el turno 12:00 ya se había completado
a las 13:26). Inspección (paso 1.5): descargas **113/113 OK**, regiones
sincronizadas **17/17/17** (fuente única `regionData.js`, verificadas con
`vite-node`), invariante `timeline == mapa` **44/44** (32 eventos, 0 títulos
fantasma, 0 `con_texto` sin textos), `npm audit` con 5 vulnerabilidades SOLO en
devDeps build-time (vite/vitest/vite-node; fix exigiría `--force` y rompería
Vite 4 → no aplica a Pages), build sin warnings. Sin errores críticos, así que
se continuó con la siguiente tarea del plan.
**Tarea del plan (FASE 3, primer checkbox pendiente — "Obra destacada aleatoria
del día", IDEAS.md §2)**:
- **Widget "Obra del día"** (`src/components/FeaturedBook.jsx`): destaca una
  obra del catálogo con su reseña y botón de lectura, integrado arriba de los
  filtros de la Biblioteca.
- **`getDailyFeaturedBook(regionData, date)`** (`src/utils/library.js`): selección
  determinista por **fecha local** (hash YYYY-MM-DD, sin depender de UTC para
  que el cambio ocurra a medianoche local). Prioriza obras legibles (con
  `filename`) y, entre ellas, las que tienen resumen. Devuelve `undefined` con
  catálogo vacío o fecha inválida. Hoy destaca: **"La lucha contra el Estado"
  (Max Nettlau, 1920, Alemania)** — PDF verificado HTTP 200.
- **Fix de negocio menor (IDEAS.md)**: las **6 obras sin `filename`** (En el
  café, Mártires de Chicago, Regeneración, Tierra y Libertad, Severino Di
  Giovanni, Luis E. Recabarren) muestran "Sin archivo disponible" en la tarjeta
  de la Biblioteca en vez de un hueco sin botón. Verificado: esos textos no
  están en el contenedor ni en el origen local (los de Bayer/Grez tienen
  derechos de autor); queda registrado para `@content-importer` cuando haya
  fuentes.
- **Tests**: 143 → **155** (7 de `getDailyFeaturedBook` en `library.test.js`:
  determinismo, variación diaria, prioridad legibles/resumen, fallback, fechas
  inválidas; 4 del widget en `Views.test.jsx`; reajustes en
  `LibraryView.test.jsx` e `Interactions.test.jsx` para consultar el grid de
  tarjetas, ya que el widget es global e independiente de filtros).

**Verificación**: `npm run check` (lint 0 errores + **155 tests** + build) verde.
CI de Pages verde (run 31656981533). Commit 5a76b39.
Turno 12:00 del agente `daily-dev`. Inspección (paso 1.5): descargas **112/112 OK**,
regiones sincronizadas **16/16/16**, `npm audit` con 5 vulnerabilidades SOLO en
devDeps build-time (vite/vitest/esbuild; fix exigiría `--force` y rompería el stack
Vite 4 → no aplica a Pages), build sin warnings. **Tarea del plan (FASE 6, "Próximo
día")**: subir el branch coverage hacia el 85%+ cubriendo las ramas pendientes de
los componentes. Se ampliaron 8 archivos de test con **37 tests nuevos**:
- `Views.test.jsx`: TimelineView/StatsPanel/ScrollTopButton en modo oscuro,
  FavoritesView con 1 favorito (singular), AuthorsView con autor sin años/regiones
  y obras sin archivo (jsdom, `Leer` solo con filename).
- `WorldMapView.test.jsx`: darkMode, región sin ISO (solo botón, no mapa) y región
  sin lista de libros (`0 textos históricos`).
- `LibraryView.test.jsx`: darkMode, obra sin año/rating/resumen (guion y sin ⭐),
  obra sin archivo (sin botón Leer) y corazón en estado favorito.
- `Modals.test.jsx`: RegionModal con región inexistente, sin books, resumen + favorito
  (`Remover de favoritos` / corazón lleno) y `Agregar a favoritos`.
- `AnarchistArchive.test.jsx`: apertura de `RegionModal` desde el mapa (clic en
  botón de región), darkMode vía localStorage y `ScrollTopButton` (scroll simulado
  con getter de `window.scrollY` + `act`).
- `WorldMap.test.jsx`: data vacío (min/max 0), valores string, y tests jsdom de
  tooltip (mouseEnter/Leave) y click (`onClickFunction` con `countryCode`).
- `library.test.js`: regiones sin books, `sortBooks` con campos incompletos y
  criterio no soportado, `getEventRelatedTexts` (sin evento, sin datos, región
  inexistente, obras sin año), `getAllAuthors` sin años y sin autor.
- `documentService.test.js`: JSON sin clave `documents` (→[]) y stats con docs sin
  rating (media sobre 0).

**Cobertura final: 117→154 tests, statements 97%→98.98%, branches 79.35%→97.96%
(396/499→578/590), functions 84.69%→90.81%**. `npm run check` (lint 0 errores +
154 tests + build) verde, CI de Pages verde (run 31511160387). Commit 49bea9f.
Se recomienda re-análisis SonarQube (`npm run test:coverage` + `sonar-scanner`)
para actualizar el gate con la nueva cobertura (new_coverage ≈98% statements).

### Nota del día (2026-08-11, 00:00)
Turno 00:00 del agente `daily-dev`. Inspección (paso 1.5): descargas **112/112 OK**,
regiones sincronizadas **16/16/16**, `npm audit` con 5 vulnerabilidades SOLO en
devDeps build-time (vite/vitest/esbuild; fix exigiría `--force` y rompería el stack
Vite 4 → no aplica a Pages), build OK. **Tarea del plan (FASE 6, "Próximo día")**:
tests interactivos de componentes clave que tenían handlers sin ejecutar
(renderizado estático no cubría funciones/ramas). Se añadió
`src/components/Interactions.test.jsx` con 18 tests jsdom: TimelineFilters
(búsqueda, década, categoría, región, limpiar), TourModal/EventModal/RegionModal
(cierre por backdrop, tecla Escape, alternar favoritos) y LibraryView (filtros
combinados por región/década/categoría, estado vacío + limpiar, favoritos) más
navegación completa de AnarchistArchive (ir a Biblioteca y filtrar, abrir evento
de la línea temporal y cerrar con Escape, abrir/cerrar tour). **99 → 117 tests**,
coverage global statements 94.65%→97%, branches 68.7%→79.35%, functions
61.22%→84.69%. `npm run check` verde, CI de Pages verde (run 31457459234). Además,
mejora menor segura de la inspección: `npx update-browserslist-db`
(caniuse-lite 1.0.30001776→30001809) que elimina el warning de browserslist del
build (commit 7995d2c, solo package-lock.json, sin cambios en el árbol de
dependencias). Observación para SonarQube: se recomienda re-análisis con
`npm run test:coverage` + `sonar-scanner` para actualizar el gate con la nueva
cobertura (new_coverage ahora ≈85%+ en funciones).

### Nota del día (2026-08-10, 00:00)
Turno 00:00 del agente `daily-dev`. Inspección (paso 1.5): descargas 91/91 OK,
regiones sincronizadas 16/16/16, `npm audit` sin fix seguro sin `--force`
(solo devDeps build-time: vite/vitest/esbuild, no aplica a Pages).
**Actividad humana concurrente**: Ruben-developer trabajó en paralelo con VSCode
(sesión abierta desde ago09) y pusheó la refactorización "Autores dinámicos +
mapa solo histórico + timeline con textos relacionados" (205c138) y la expansión
del catálogo 97→109 (53768ae, 1ac1394). El agente respetó ese trabajo (no lo
commiteó ni revirtió a medias) e hizo su tarea del plan en archivos sin conflicto:
**línea temporal ampliada de 8 → 16 eventos históricos reales** con décadas
posteriores a 1968 y `DECADES` sincronizada (commit 6ee6fa2). CI de Pages verde
para todos los commits del día. Pendiente sugerido: FASE 6 tests de
`documentService.js`/hooks para subir cobertura, y verificar `ReaderView`.

### Nota del día (2026-08-09)
FASE 4 completada: **mapamundi interactivo por país** (react-svg-worldmap) sustituye
al grid de regiones — países con textos coloreados por tema, click abre el modal de
la región, tooltip con nº de textos, normalización de nombres del mapa→claves del
catálogo y tests propios. Además se validó e integró el trabajo de DevOps/calidad
que había quedado sin commitear (vitest, `npm run check`, `check-downloads` 59/59,
CI ampliado). Build, 15 tests y CI de Pages verdes.

### Nota del día (2026-08-09, tarde)
**Sustituido `react-svg-worldmap` por mapa propio con `d3-geo`** para poder eliminar
Israel del mapa: `npm run generate-worldmap` produce `src/data/worldmap.geo.json`
(174 países) fusionando la geometría de Israel dentro de Palestine (bordes disueltos
con topojson merge). `WorldMap.jsx` replica la API (styleFunction, onClickFunction,
tooltipTextFunction) con tooltip `<title>`. 23 tests verdes (8 nuevos de WorldMap,
incluyen: Israel ausente, Palestine presente, 174 paths). Build y CI verdes.

### Nota del día (2026-08-08)
Catálogo ampliado de 23 → **65 obras** (59 con PDF descargable verificado HTTP 200) y de 8 → **11 regiones**
(nuevas: Alemania, Inglaterra, Corea). Se añadieron obras de Kropotkin, Bakunin, Proudhon, Reclus,
Stirner, Herbert Read, Emma Goldman, Fabbri, Peirats, entre otras, verificadas con `pdftotext`.
Build, lint y CI de Pages en verde.
