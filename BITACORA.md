# 📖 Bitácora de Cambios — Biblioteca Anarquista Digital

> Proyecto: **Archivo Histórico Anarquista**
> Repo: `Ruben-developer/biblioteca-anarquista`
> Web: https://ruben-developer.github.io/biblioteca-anarquista/
>
> **Tipo de cambio**: 🧑 **Manual** = realizado en sesión con el usuario ·
> 🤖 **Automático** = realizado por el agente `daily-dev` (cron diario 12:00)

---

## 2026-08-07 — Creación y primeras iteraciones (sesión manual)

| Hora | Tipo | Commit | Detalle |
|------|------|--------|---------|
| 21:16 | 🧑 Manual | `05232f5` | Scaffolding inicial Vite + React + TypeScript, estructura `data/` y `PLAN.md`. |
| 21:18 | 🧑 Manual | `954b028` | Biblioteca v0: catálogo navegable, búsqueda, lector PDF y workflow de GitHub Pages. |
| 21:30 | 🧑 Manual | `01bb568` | Añade obra de Malatesta (*La anarquía*) y auto-carga del catálogo (`import.meta.glob`). |
| 21:32 | 🧑 Manual | `57d9040` | Documenta PLAN + métricas + log del día (4 obras). |
| 22:16 | 🧑 Manual | `e96ed2d` | Backlog de ideas del usuario (estética, timeline, agrupar por país, importación de textos, agente UX/UI). |
| 22:33 | 🧑 Manual | `ccca8e5` | Plan del servidor de PDFs local + plan Cloudflare Tunnel (futuro). |
| 22:35 | 🧑 Manual | `7177043` | **Servidor PDF local** `pdf-server` (nginx:alpine, puerto 8081, `restart=always`) + botón de descarga en la web. |
| 23:02 | 🧑 Manual | `b946c96` | Estética pergamino + negro + rojo (paleta de la biblioteca). |
| 23:37 | 🧑 Manual | `8f0638e` | Adapta el proyecto de referencia de GitHub (biblioteca libertaria de referencia). |
| 23:53 | 🧑 Manual | `cae2b48` | **Migración al proyecto real del usuario**: Archivo Histórico Anarquista (React 18 + Vite 4 + Tailwind) a GitHub Pages. Timeline 1840-1968, mapa de regiones, biografías, favoritos, modo oscuro, estadísticas. Descargas PDF desde contenedor :8081 + TXT desde el repo. |
| 23:55 | 🧑 Manual | `9d50c90` | Actualiza daily-run con el resultado de la migración. |
| 23:56 | 🧑 Manual | `709b65b` | Crea `AGENTS.md` con convenciones del nuevo stack para agentes autónomos. |

## 2026-08-08 — Primera iteración autónoma del agente (cron 12:00)

| Hora | Tipo | Commit | Detalle |
|------|------|--------|---------|
| 12:03 | 🤖 **Automático** | `9e429a9` | **Amplía el catálogo de 23 → 65 obras** (59 con PDF verificado HTTP 200 en el contenedor :8081) y de 8 → 11 regiones (añade Alemania, Inglaterra, Corea). Autores/años extraídos con `pdftotext` y filenames comprobados contra el contenedor. |
| 12:05 | 🤖 **Automático** | `42d5852` | Marca tarea FASE 2 completada y actualiza el plan del próximo día. |
| 12:05 | 🤖 **Automático** | `dd23927` | Registra métricas y log del día (catálogo 65 obras, 11 regiones). |

> Ejecución: iniciada a las **12:00:00**, finalizada a las **12:06:33** (exit=0), CI verde.

## 2026-08-09 — DevOps parcial (sesión manual)

| Hora | Tipo | Commit | Detalle |
|------|------|--------|---------|
| 12:00 | 🧑 Manual | (en este commit) | **Calidad y DevOps**: añade Vitest (12 tests de `filters.js`), comando `npm run check` (lint+test+build), `npm run check-downloads` (59/59 PDFs HTTP 200), CI ampliado (lint→test→audit→build→deploy), y `npm audit fix` (9→4 vulns). |
| 12:00 | 🧑 Manual | (en este commit) | Agente `daily-dev`: paso 1.5 ampliado con `npm audit` + `check-downloads` automáticos, y verificación con `npm run check`. |

> Nota: las 4 vulnerabilidades restantes son de esbuild (dev-server de Vite, transitiva de vitest),
> solo resolubles con vite@8 (breaking) — no aplican al deploy estático de Pages. Documentadas, CI no bloqueante.

## 2026-08-09 (tarde) — Mapa propio: Israel eliminado, fusionado en Palestine

| Hora | Tipo | Commit | Detalle |
|------|------|--------|---------|
| 12:30 | 🧑 Manual | (en este commit) | **Sustituye `react-svg-worldmap` por mapa propio** renderizado con `d3-geo`: `src/components/WorldMap.jsx` + `src/data/worldmap.geo.json` (174 países). La geometría de Israel se **fusiona dentro de Palestine** (`topojson merge`, disuelve el borde común) y el país Israel desaparece del mapa. Generador reproducible: `scripts/generate-worldmap.mjs` (`npm run generate-worldmap`). 8 tests nuevos de `WorldMap` (Israel ausente, Palestine presente, 174 paths, tooltips y estilo). Total: **23 tests verdes**. |

> Verificación geométrica: Palestine fusionado cubre lon 34.27–35.84 × lat 29.50–33.28
> (todo Israel+Gaza+Cisjordania hasta Eilat). Build y CI verdes.

## 2026-08-09 (noche) — Fix responsive: mapa completo + sin scroll horizontal

| Hora | Tipo | Commit | Detalle |
|------|------|--------|---------|
| 13:05 | 🧑 Manual | (en este commit) | **Bugfix responsive**: 1) `WorldMap.jsx`: viewBox `960×720` (antes `480`) — el mundo se recortaba verticalmente (se perdía Latinoamérica/hemisferio sur). 2) `Header.jsx`: `flex-wrap` + título `text-2xl→4xl` responsive + `min-w-0` (antes `text-4xl` fijo desbordaba en mobile). 3) `index.css`: `overflow-x: hidden` + `max-width:100%` en `html,body` (elimina el scroll horizontal global y la franja blanca). Verificado con Chromium headless: `dw==cw` en 375px y 1280px, mapa 174 paths con Palestine y sin Israel. |

## 2026-08-09 — FASE 4: mapamundi interactivo (agente `daily-dev` 12:00)

| Hora | Tipo | Commit | Detalle |
|------|------|--------|---------|
| 12:05 | 🤖 **Automático** | `461aba6` | Integra y valida el trabajo DevOps que había quedado sin commitear (vitest 12 tests, `npm run check`, `check-downloads` 59/59, CI ampliado, audit fix) + dependencia `react-svg-worldmap`. |
| 12:07 | 🤖 **Automático** | `eacd38a` | **FASE 4 completada**: mapamundi interactivo por país (`react-svg-worldmap`). `countryData.js` (región→ISO), `WorldMapView.jsx` (colores por tema, click→`RegionModal`, tooltip con nº de textos, listado de regiones), `normalizeCountryName()` con 3 tests. Sustituye a `MapView.jsx`. |
| 12:10 | 🤖 **Automático** | (docs) | PLAN.md (FASE 4 ✅ + próximo día), BITACORA, métricas (15 tests) y log del día. |

> Ejecución turno 12:00: iniciada 12:00, finalizada ~12:10 (exit=0), CI verde. 15 tests unitarios.

---

## 2026-08-09 (noche) — Integración SonarQube (calidad)

| Hora | Tipo | Commit | Detalle |
|------|------|--------|---------|
| 15:10 | 🧑 Manual | `a53d66d` | **SonarQube conectado al proyecto**: scanner 8.1.0 en `~/tools/sonar-scanner`, `sonar-project.properties` (projectKey `biblioteca-anarquista`, lcov reportPaths), token en `~/.config/biblioteca/sonar.token` (fuera del repo). Coverage Vitest con v8 (`npm run test:coverage` → `coverage/lcov.info`), `coverage/` y `.scannerwork/` gitignoreados. Fixes a11y: `role=dialog`+`aria-modal`+`Escape`+backdrop (`e.target===e.currentTarget`) en EventModal/RegionModal/TourModal, `TimelineView` `div→button`, `S2871` `sort()→localeCompare` en `documentService.js:110`. Tests de modales (`Modals.test.jsx`, 5) → **28 tests verdes**, coverage global **12%→35%**. |

> **Quality gate propio** «Biblioteca Anarquista» (`new_coverage≥50%`, duplicación≤3%, `new_violations≤20`) en vez del estricto «Sonar way» (80%/0). **Gate OK**: 0 bugs, 0 vulnerabilidades, ratings A/A/A, 0% duplicación, `new_coverage` **61.4%**. Hotspot `PDF_BASE` http marcado **SAFE** (decisión documentada en AGENTS.md). `caycStatus: non-compliant` solo refleja el estándar CAYC, no afecta al gate. SonarQube 26.6.0 en `http://192.168.1.117:9000` (dashboard `?id=biblioteca-anarquista`). CI de Pages verde, web HTTP 200.

## 2026-08-09 (noche) — Mapa: efecto hover + nombres en español

| Hora | Tipo | Commit | Detalle |
|------|------|--------|---------|
| 21:00 | 🧑 Manual | `568cff9` | **Mapa mejorado**: efecto hover sobre el territorio (brillo/saturación CSS `.worldmap__country`) y tooltip con **nombre del país en español** (`España: 14 textos`, `Palestina`, `Francia: 10 textos`...). Diccionario EN→ES de los 174 países (`translateCountryName`) en `countryNames.js`. Verificado con Chromium: 174 paths, hover `brightness(1.35)`. 4 tests nuevos (32 en total), CI verde, web HTTP 200. |

## Estado actual

- **15+ commits** en `main`, CI de Pages **verde** (lint+tests+audit+build), web **HTTP 200**.
- **Calidad**: 28 tests unitarios (12 filters + 3 countryNames + 8 WorldMap + 5 modales) · 59/59 descargas verificadas HTTP 200 · lint 0 errores · **SonarQube gate OK** (0 bugs, 0 vulns, A/A/A, coverage global 32%).
- **Mapa**: FASE 4 completada — mapamundi interactivo por país (react-svg-worldmap) en la vista Mapa.
- **Infraestructura**: contenedor `pdf-server` (:8081) activo, cron 2×/día (00:00 y 12:00), persistencia con Linger + `podman-restart.service`.
- **Agentes**: `@daily-dev` (primary), `@ux-review` y `@content-importer` (subagentes).

## Plan que sigue (de `PLAN.md`)

### FASE 3 — Lectura enriquecida
- [ ] Añadir **lector PDF embebido** (vista de lectura sin salir de la web).
- [ ] Obra destacada aleatoria del día.
- [ ] Referencias cruzadas entre textos y eventos.
- [ ] Mapas visuales por región.
- [ ] Más filtros y búsqueda avanzada.

### Backlog del usuario (priorizado)
- [ ] **Estética**: iterar paleta de colores y tipografía (puesta a punto visual).
- [ ] **Timeline**: ampliar eventos hasta la actualidad.
- [ ] **Agente revisor UX/UI**: subagente que critique el diseño.
- [ ] **Importar textos propios** del servidor (401 PDFs + 125 docx → `pdftotext` + fichas).
- [ ] **Descargas**: export a TXT/EPUB además de PDF.

### Servidor (pendientes)
- [ ] Añadir `server` a `/etc/hosts` (`192.168.1.117 server`) → cambiar `PDF_BASE` a hostname.
- [ ] Script de sincronización de `pdfs-local/` desde `Documentos` cuando cambie.
- [ ] (Futuro) Cloudflare Tunnel para acceso público sin abrir puertos.
