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
| 21:15 | 🧑 Manual | `2d9b675` | **Tooltip propio que sigue al puntero** (sustituye al `title` nativo del navegador): al pasar por un país aparece una burbuja junto al cursor con el nombre en español, se oculta al salir. Posicionado en contenedor relativo (`.worldmap__tooltip`), `role="tooltip"`. Verificado con Chromium: hover → `España: 14 textos`; mouseleave → se oculta. 33 tests, CI verde, web HTTP 200. |
| 21:25 | 🧑 Manual | `605d155` | **Gradiente de color en el mapa**: los países con pocos textos salen en color claro y con más textos más oscuros (interpolación `lerpColor` escalada entre `minValue`/`maxValue`). Leyenda «Pocos textos → Muchos textos» bajo el mapa + texto descriptivo actualizado. Verificado en Chromium: luminancia España(14)=83 → Alemania(1)=226. 4 tests nuevos del gradiente (37 en total), CI verde, web HTTP 200. |
| 22:26 | 🧑 Manual | `98517f3` | **Biblioteca + Lector embebido + enmascaramiento del servidor PDF**: 1) `LibraryView` — catálogo de las 65 obras de `regionData` con búsqueda y filtros combinados (categoría + región + década + orden), util `src/utils/library.js`. 2) `ReaderView` — lector sin salir de la web: PDF en iframe y TXT con fetch + controles de tamaño de letra y modo sepia. 3) **Enmascaramiento**: `PDF_BASE = VITE_PDF_BASE \|\| '/pdfs/'` + proxy de Vite en dev (la IP interna ya no se versiona ni queda en el bundle — verificado 0 ocurrencias en `dist/`); CI inyecta `VITE_PDF_BASE` desde secret; `.env.example` documenta. Guardadas las demás secciones en `IDEAS.md`. Verificado en navegador: 65 obras, filtros, lector PDF abierto, 0 requests con la IP. 22 tests nuevos (59 en total), CI verde, web HTTP 200. |

## 2026-08-09 (noche) — Expansión de catálogo: +26 obras

| Hora | Tipo | Commit | Detalle |
|------|------|--------|---------|
| 19:21 | 🧑 Manual | `dae3608` | **Catálogo ampliado 65 → 91 obras**. Se escanearon los 410 PDFs del `pdfs-local/` (324 anarquismo + 77 otros + 9 ref) con `pdftotext`, descartando afiches, panfletos, PowerPoints, documentos legales, duplicados y ficheros escaneados sin texto. Se añadieron **26 obras nuevas** a `regionData.js` (26/26 filenames HTTP 200): España — García Oliver (*El eco de los pasos*), Mujeres Libres, Mella (x2), Avilés; Francia — Proudhon (x2), Guérin, Kropotkin; Rusia — Kronstadt (Petritchenko/Berkman/Makhno), La Makhnovschina, Bakunin; Italia — Malatesta, Fabbri; EEUU — Graeber, Gelderloos, Bookchin; Alemania — Wittkop, Nettlau (x2); Inglaterra — Meltzer; México — La bala y la escuela, Benítez (x2); Argentina — Bayer; Chile — Wobblie. **85/85 obras con filename descargable**, `check-downloads` OK, `npm run check` verde (lint + 59 tests + build). |

## 2026-08-09 (noche) — Nuevas regiones: Colombia, Bolivia, Japón, Siria, Nigeria

| Hora | Tipo | Commit | Detalle |
|------|------|--------|---------|
| 19:52 | 🧑 Manual | `4145c23` | **Catálogo 91 → 97 obras y +5 regiones**: se añaden **6 obras nuevas** y se crean las regiones **Colombia** (2), **Bolivia** (1), **Japón** (1), **Siria** (1, Rojava) y **Nigeria** (1, anarquismo africano). Se sincronizaron los **3 archivos** (regionData.js, countryData.js con ISO co/bo/jp/sy/ng, REGIONS en constants/index.js). Filenames 6/6 HTTP 200, `check-downloads` **91/91 OK**, `npm run check` verde (lint + 59 tests + build). |
| 20:05 | 🧑 Manual | `cc32892` | **fix: países nuevos en el mapa**: `normalizeCountryName()` no reconocía Colombia, Bolivia, Japón, Siria y Nigeria, así que el mapa las pintaba grises y no eran clicables. Añadidas al diccionario EN→ES + test. |
| 00:05 | 🧑 Manual | `205c138` | **Reestructuración por autoría (decisión de UX)**: 1) **Autores dinámicos** — se elimina `authors.js` estático y se deriva de `regionData` (`getAllAuthors` en `library.js`): agrupa por autor, cuenta obras, ordena de más a menos, muestra la lista de obras con botón Leer. Vista renombrada «Autores». 2) **Mapa solo histórico** — se añade `HISTORICAL_CATEGORIES`/`IDEAS_CATEGORIES` (`isHistoricalCategory`) y el mapa + `RegionModal` solo muestran textos de historia (no filosofía/ideas). 3) **Timeline** — solo hechos históricos (se quitan las publicaciones de Proudhon 1840 y Kropotkin 1902, que viven en Autores); `EventModal` ahora muestra **textos históricos relacionados** con botones **Ver/Descargar/Compartir**. 64 tests verdes. |
| 00:25 | 🧑 Manual | `53768ae` | **Catálogo 97 → 109 obras (+12)**: autores clásicos ampliados — España: *Mella y Ferrer* (Mintz), *Nueva Utopía*, *La coacción moral*, *La Escuela Moderna*; Francia: Émile Armand (×3); EEUU: Goldman (*Durruti ha muerto*), Tucker (*Socialismo de Estado y anarquismo*); Italia: Malatesta (*Plan de organización*, *Elecciones*); Alemania: Nettlau (*Responsabilidad y solidaridad*). **103/103 con filename**, `check-downloads` OK, `npm run check` verde (lint + 64 tests + build). |
| 01:10 | 🧑 Manual | `2bc7959` | **Catálogo 109 → 114 obras (+5) + UX lector**: 1) **Lector mejorado** — modal más grande (max-w-5xl → max-w-7xl, 96vh) y nuevo botón **«Nueva pestaña»** (ExternalLink) que abre el PDF a pantalla completa fuera del lector. 2) **fix Nigeria** — *Anarquismo africano* estaba categorizada como `teoria`, así que el mapa (solo histórico) mostraba Nigeria en 0 textos; se reclasifica a `historia`. 3) **Nuevas obras**: España — *El corto verano de la anarquía* (Enzensberger), *El error político-militar de la República* (Guillén), *El anarquismo como doctrina y movimiento* (Yanes Herreros); Francia — *La conjura de los indomables* (Montes de Oca); Rusia — *El anarquismo en el espejo judío* (Mellado). **108/108 descargas OK**, `npm run check` verde (lint + 64 tests + build). |
| 01:50 | 🧑 Manual | `aa408c3` | **UX lectura simplificada**: se elimina el lector embebido (`ReaderView.jsx` + su test), que era un rectángulo pequeño incómodo en móvil. Ahora **«Leer»/«Ver» abre el PDF directamente en una pestaña nueva del navegador** (`target="_blank"`, enlace simple: se lee y se descarga desde el visor nativo). Se eliminan los botones **Descargar** y **Compartir** (LibraryView, AuthorsView, RegionModal, EventModal) y las props `onRead`/estado `readingBook`. 59 tests verdes (se retiran los 5 del lector), build OK. |
| 13:25 | 🧑 Manual | `1037729` | **Cobertura de tests 62.87% → 94.66% + gate OK**: se añaden **19 tests** (99 en total) — `Views.test.jsx` (14: Navigation, Header, StatsPanel, TimelineView, TimelineFilters, FavoritesView, ScrollTopButton, AuthorsView) y `AnarchistArchive.test.jsx` (5, con interacción jsdom: cambiar de vista, abrir estadísticas). Nuevas devDeps: `jsdom`, `@testing-library/react`, `@testing-library/dom`. **SonarQube: coverage global 90.4%, gate OK** (new_coverage 88.6%, duplicación 0%, violaciones 17≤20). Refactors menores que SonarQube marcaba como violaciones nuevas: `themeClass` sin usar (LibraryView, EventModal, RegionModal), `Number.parseInt`, `Set` para categorías históricas, optional chaining. |

## 2026-08-10 (tarde) — Catálogo 108 → 112 obras con `@content-importer` (sesión manual)

| Hora | Tipo | Commit | Detalle |
|------|------|--------|---------|
| 17:20 | 🧑 Manual | `a10da39` | **Catálogo ampliado de 108 → 112 obras (+4)** con el subagente `@content-importer`: **Chile ×2** — *Destruir para construir: violencia y acción directa en el anarquismo chileno (1890-1914)* (Darío Covarrubias Bañados, historia) y *Cuando la patria mata: la historia del anarquista Julio Rebosio* (Víctor Muñoz Cortés, biografia); **Argentina ×2** — *América, hoy* (Víctor García, teoria, 1956) e *Internet, hackers y software libre* (Carlos Gradin comp., teoria, 2004). Se descartaron 4 PDFs (corrupto, manual técnico de antenas, hoja escolar, tapa de revista). 4/4 filenames HTTP 200, `check-downloads` **112/112 OK**, `npm run check` verde (lint + 99 tests + build). |

## 2026-08-27 — Pulido estético MEDIUM del reporte @ux-review (sesión manual)

| Hora | Tipo | Commit | Detalle |
|------|------|--------|---------|
| — | 🧑 Manual | (pendiente) | **Implementados los 7 hallazgos MEDIUM** del `ux-report-estetica.md`: **M1** padding de tarjetas de autor/teoría/mapa unificado a `p-5`; **M2** sombras hover de timeline/biblioteca/autores/teorías unificadas a `hover:shadow-lg`; **M3** grid gaps unificados a `gap-5` (biblioteca/favoritos/glosario/autores/teorías/mapa); **M4** StatsPanel ambas filas de métricas a `border-2 p-4`; **M5** footer expandido con stats (1840–1968 · N textos/regiones/eventos), enlaces Glosario/Contacto y crédito de dominio público; **M6** componente `ModalHeader` compartido extraído y usado en `EventModal` y `RegionModal` (mismo `X size={24}`, mismo padding); **M7** indicador de scroll en la timeline horizontal (gradiente de desvanecimiento a la derecha). |

> Verificación: `npm run check` (lint 0 errores + **250 tests** + build) verde. Sin cambios de lógica ni de datos; los HIGH (H1-H3) ya estaban resueltos en el turno 2026-08-26 12:00.

## 2026-08-27 (segunda parte) — Unificación de bordes de toda la app (sesión manual)

| Hora | Tipo | Commit | Detalle |
|------|------|--------|---------|
| — | 🧑 Manual | (pendiente) | **Borde único por tema** para toda la interfaz: mismo ancho (2px), color y opacidad en claro/oscuro. Token `THEME.*.border` = `border-2 border-[#872320]/50` (oscuro) / `border-2 border-[#B79F6E]` (claro). Actualizados `card`, `nav` y `header` en `constants/index.js` para usar ese borde. Cabecera y pie comparten ahora la misma línea (`border-b-2`/`border-t-2`, mismo color): el pie lleva sombra hacia arriba (`shadow-[0_-4px_12px_rgba(0,0,0,0.25)]`). Modales `EventModal`/`RegionModal` bajan de `border-4` a `border-2` (heredan el borde de `cardClass`). Se elimina el `frame` interior recto/delgado del mapa (`WorldMapView`) para que solo quede el borde unificado del panel. Subtarjetas anidadas (Autores, Teorías, Rutas, Glosario, Red de Autores, Biblioteca, EventModal) pasan de borde 1px a `border-2` y se unifican a `/50` de opacidad en oscuro. |

> Verificación: `npm run check` (lint 0 errores + **250 tests** + build) verde. Se dejan a 1px los bordes de controles interactivos (botones, inputs, textarea) por convención de UI.

## 2026-08-27 (tercera parte) — Marco redondeado del mapamundi (sesión manual)

| Hora | Tipo | Commit | Detalle |
|------|------|--------|---------|
| — | 🧑 Manual | (pendiente) | Se reañade el marco del propio mapa (`WorldMap` `frame`), que antes era recto y fino y se había eliminado. Ahora usa el **borde unificado**: `strokeWidth=2`, color `rgba(135,35,32,0.5)` (oscuro) / `#B79F6E` (claro) y **esquinas redondeadas** (`rx=16`), igual que el resto de paneles (`rounded-lg`). |

> Verificación: `npm run check` (lint 0 errores + **250 tests** + build) verde.

## 2026-08-27 (cuarta parte) — Mapa con la misma curvatura que las tarjetas (sesión manual)

| Hora | Tipo | Commit | Detalle |
|------|------|--------|---------|
| — | 🧑 Manual | (pendiente) | El marco del mapa pasa a ser CSS (`rounded-lg border-2` + color por tema) sobre el contenedor del SVG, en vez del `rect` interno del SVG cuyo `rx` escalaba con el ancho y nunca igualaba el `rounded-lg` de las tarjetas. Ahora mapa, tarjetas, secciones y menús comparten la **misma curvatura** (8px). Se elimina el código muerto `frame`/`frameColor` de `WorldMap.jsx`. |

> Verificación: `npm run check` (lint 0 errores + **250 tests** + build) verde.

## 2026-08-27 (quinta parte) — Línea/Feed por dispositivo + paneles unificados (develop)

| Hora | Tipo | Commit | Detalle |
|------|------|--------|---------|
| — | 🧑 Manual | (pendiente) | En `TimelineView` se elimina el toggle manual Línea/Feed. Ahora la vista se elige por dispositivo: **escritorio → Línea** (horizontal), **móvil → Feed** (vertical) vía `useIsMobile` (nuevo hook `useMediaQuery`/`useIsMobile` en `hooks/index.js`, seguro si `matchMedia` no existe). Ambos paneles (`HorizontalTimeline`/`VerticalTimeline`) comparten el **mismo borde y fondo** (`border-2`, `bg-gray-900/60`/`bg-white/60`, `shadow-lg`), igual que el resto de tarjetas. Se añade una etiqueta no interactiva "Vista: Línea (escritorio) / Feed (móvil)". |

> Verificación: `npm run check` (lint 0 errores + **250 tests** + build) verde. Pendiente de merge de PR #11 (producción) antes de pushear develop.

## 2026-08-27 (sexta parte) — Quitar grises azulados en modo oscuro (develop)

| Hora | Tipo | Commit | Detalle |
|------|------|--------|---------|
| — | 🧑 Manual | (pendiente) | `theme-constructivista` ya volvía cálidos la mayoría de `gray-*`, pero filtraban los azulados de Tailwind en modo oscuro: `bg-gray-950`, `bg-gray-900`, `bg-gray-900/50`, `bg-gray-900/40`, `bg-gray-700/50`, `bg-gray-600` y el `from-gray-900` del fade de la línea temporal. Se añaden overrides en `index.css` que los mapean a los mismos cálidos ya usados en el tema (`#0A0909`, `rgba(10,9,9,*)`, `#6F6C68`/`rgba`, `#5A5652`). También se elimina el caption «Vista: …» de `TimelineView`. |

> Verificación: `npm run check` (lint 0 errores + **250 tests** + build) verde.

## 2026-08-27 (séptima parte) — Restos de gris azulado (hover/placeholder) + Mi Biblioteca a la izquierda (develop)

| Hora | Tipo | Commit | Detalle |
|------|------|--------|---------|
| — | 🧑 Manual | (pendiente) | Se completa el de-azulado: los overrides previos cubrían las clases base pero no las **variantes** `hover:bg-gray-700/50`, `hover:bg-gray-700`, `hover:bg-gray-600` ni `placeholder-gray-500`, así que el hover del menú de hamburguesa/sus opciones y el placeholder «Buscar autor…» seguían azulados. Se añaden esos overrides en `index.css` (mismos cálidos del tema). En `FavoritesView` el título y los botones Importar/Exportar vuelven a la **izquierda** (se quita `text-center`/`justify-center`). |

> Verificación: `npm run check` (lint 0 errores + **250 tests** + build) verde.

## 2026-08-27 (octava parte) — Auditoría final de grises azulados (develop)

| Hora | Tipo | Commit | Detalle |
|------|------|--------|---------|
| — | 🧑 Manual | (pendiente) | Auditoría de todos los `gray-*` (con variantes `hover/focus/placeholder`, degradados y modo claro). Quedaban por cubrir: `hover:text-gray-300`, `hover:text-gray-400` (textos azulados al hover), stops de degradado `to-gray-900`/`from-gray-800`/`via-gray-900`, y tokens base de modo claro `text-gray-900`/`bg-gray-100`/`bg-gray-300`. Se añaden sus overrides cálidos en `index.css`. No se usan otros paletes azulados (`blue/slate/indigo/sky/cyan/zinc`). |

> Verificación: `npm run check` (lint 0 errores + **250 tests** + build) verde.

## 2026-08-28 (novena parte) — Fuente única de color (variables CSS + tokens semánticos)

| Hora | Tipo | Commit | Detalle |
|------|------|--------|---------|
| — | 🧑 Manual | (pendiente) | Tras el análisis de color (octava parte) y con ayuda de un modelo local (qwen3/llama3.2), se implementa una **fuente única de color**. En `index.css` se definen variables CSS `--c-*` (rojo bermellón, rojo profundo, tinta, vacío, piedra, crema, etc.) y se sustituyen los literales repetidos (`#D02C26`×12, `#B0241E`×9, grises/cremas) por `var(--c-…)`; un color = una variable. En `tailwind.config.js` se añaden tokens semánticos (`brand`, `action`, `action-hover`) que apuntan a esas vars, y se **desduplican las escalas fragmentadas**: rojos oscuros `red-300/400/500`→un solo rojo y `red-950`→`red-900`; ámbar claro `orange-50`/`yellow-50`→`amber-50`. No se tocaron componentes (las clases existentes resuelven al mismo color), así que tests/snapshots siguen verdes. Pendiente opcional: migrar las clases de componentes a los tokens semánticos (`bg-action` en vez de `bg-red-600`/`bg-amber-700`) y normalizar el border `#872320` a variable. |

> Verificación: `npm run check` (lint 0 errores + **250 tests** + build) verde.

## Estado actual

- **25+ commits** en `main`, CI de Pages **verde** (lint+tests+audit+build), web **HTTP 200**.
- **Calidad**: 99 tests unitarios · **112/112 descargas verificadas HTTP 200** · lint 0 errores · **SonarQube gate OK** (0 bugs, 0 vulns, A/A/A, **coverage global 90.4%**).
- **Catálogo**: **112 obras** en `regionData.js`, distribuidas en **16 regiones**.
- **PDFs públicos**: túnel **Tailscale Funnel** activo (`https://server.taile963c6.ts.net/pdfs/`) + secret `VITE_PDF_BASE` en GitHub → los PDFs ya descargan desde la web (antes 404).
- **Autores**: sección dinámica derivada del catálogo, ordenada de más a menos obras.
- **Mapa**: solo textos históricos; los de filosofía/ideas viven en Autores.
- **Timeline**: hechos históricos con textos relacionados (ver/descargar/compartir).
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
