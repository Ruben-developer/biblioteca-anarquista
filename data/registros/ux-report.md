# Reporte UX/UI — Biblioteca Anarquista (Archivo Histórico Anarquista)

> **Fecha y hora:** 2026-10-07 20:59 (UTC-3)
> **Revisor:** `@ux-review`
> **Alcance:** estética visual, experiencia (navegación, búsqueda, filtros, lectura, mobile) y propuestas de módulos.
> **Verificación:** revisión estática de `src/components/*`, `src/index.css`, `tailwind.config.js`, `src/constants/index.js`, `src/utils/library.js`, `src/hooks/index.js`, `index.html` + **comprobaciones de datos reales** ejecutadas con `node` contra `regionData.js` y `timelineEvents.js` (los números citados abajo son medidos, no estimados).
> **Relación con reportes previos:** este documento reemplaza a `ux-report.md` (2026-08-11, recuperable con git) y complementa `ux-report-navegacion.md` (2026-08-17) y `ux-report-estetica.md` (2026-08-26). Se han verificado como **resueltos** en el código actual: fondo pergamino, scrollbar bermellón, foco global `:focus-visible`, `prefers-reduced-motion`, estados vacíos de Timeline, trampa de foco en `RegionModal`/`EventModal` (`useModalFocus`), `ModalHeader` compartido, mapa con `tabIndex`/`Enter`/`Space`, `font-mono`/`font-serif` al menos en Biblioteca y EventModal.

---

## 0. Resumen ejecutivo

La capa estética ("archivo/afiche") está asentada y es coherente en tema, tipografía display y bordes. Los problemas actuales son de **funcionalidad de filtros y navegación que contradicen los datos reales**, más que de pinceladas:

1. **La línea temporal tiene filtros que no pueden dar resultados**: el filtro "Región" renderiza **343 chips** (307 son nombres de autor o pseudosecciones de `regionData`), y de las 22 regiones de los eventos solo 4 coinciden con algún chip. El filtro "Categoría" ofrece Teoría/Acratas/Otros cuando **los 31 eventos son `historia`**.
2. **La Biblioteca (vista raíz, 1.838 obras publicadas) no tiene filtros ni orden**: `filterBooks` y `sortBooks` existen en `utils/library.js` pero no se usan; solo hay búsqueda libre y paginación de 12 → ~153 páginas en orden arbitrario. Además `LibraryView.jsx:126` excluye `otros` pero **no** `acratas`: las 358 obras de vidas aparecen duplicadas en Biblioteca y Autores contra la regla de `AGENTS.md` (ver A5).
3. **El año de obra está desincronizado**: `getAllBooks` devuelve `pubYear` (542 libros) pero los componentes leen `book.year` (**0 de 1.844 libros lo tienen**) → la "Línea de tiempo de su obra" de Autores es código muerto y ninguna tarjeta muestra el año.
4. **Navegación sin mapa del sitio**: en desktop el único camino es el drawer; la vista activa no se indica fuera de él; Glosario y Estadísticas **no tienen ningún botón de entrada** (solo URL).

---

## 1. Hallazgos — ALTA prioridad

### A1. Filtros de la línea temporal que no pueden dar resultados (Región: 343 chips; Categoría: solo Historia)
- **Ubicación:** `src/constants/index.js:22` (`REGIONS = ['all', ...Object.keys(regionData)]`), `src/components/TimelineFilters.jsx:97-110` y `:119-131`.
- **Problema (medido con node):** `regionData` tiene **343 claves**, de las cuales solo 36 tienen `iso` (países reales); las otras 307 son autores y agrupaciones ("Ideas", "Abraham Guillen", …). El filtro "Región" las renderiza **todas** como chips. De las 22 regiones de `timelineEvents` ("España, Francia e Italia", "Mediterráneo y Caribe", …) solo **4 coinciden** con alguna clave (`España`, `Chile`, `Japón`, `Italia`). Clicar "Abraham Guillen" o "Mediterráneo y Caribe" → vacío garantizado. Además el grupo "Categoría" ofrece Teoría/Acratas/Otros cuando **31/31 eventos son `historia`** — esas tres chips solo llevan al estado vacío.
- **Solución concreta (1-2 frases):** derivar las opciones de región **de los datos de eventos** (`[...new Set(timelineEvents.map(e => e.region))]` con contadores) y eliminar el grupo Categoría del timeline o sustituirlo por un filtro real derivado de `event.type` ("con texto" / "hecho"). `REGIONS` de constants queda únicamente para la futura Biblioteca (ver A2).

### A2. Biblioteca sin filtros ni orden — infraestructura muerta (`filterBooks`/`sortBooks`)
- **Ubicación:** `src/components/LibraryView.jsx:131-138` (filtro inline solo por texto) frente a `src/utils/library.js:44-65` (`filterBooks` con categoría/región/década/autor/disponibilidad/favoritos y `sortBooks` — **0 usos** fuera de tests).
- **Problema (medido):** el catálogo publica **1.838 obras** (863 historia, 617 teoría, 358 acratas) pero la única vista inicial solo permite búsqueda de palabras; no hay filtro por categoría/región/década, no hay selector de orden y las 12 tarjetas por página aparecen en orden de inserción de `regionData` (~153 páginas arbitrarias). El README describe la web como "filtros avanzados" que hoy no existen en el catálogo.
- **Solución concreta:** conectar `filterBooks` + `sortBooks` a la UI de `LibraryView`: chips de categoría (Historia/Teoría/Acratas) + chips o select de región derivado de claves con `iso` + selector de orden ("Mejor valorado" / "Título" / "Año"), reutilizando el patrón visual de `TimelineFilters.jsx:57-134`.
- **Nota:** la búsqueda semántica y filtros cruzados ya están en `IDEAS.md` (F3); esta nota es solo lo que `filterBooks` ya resuelve.

### A3. Año de obra desincronizado: `book.year` vs `pubYear` → feature muerta y tarjetas sin año
- **Ubicación:** `src/utils/library.js:13-22` (`getAllBooks` no normaliza el año), `src/components/AuthorsView.jsx:178` (filtra `b.year` para la "Línea de tiempo de su obra") y `:221-225` (muestra `book.year`), `src/components/LibraryView.jsx:74-107` (GridCard no muestra año).
- **Problema (medido):** en `regionData` **0 de 1.844 libros tienen `year`** y 542 tienen `pubYear`. Como los componentes leen `book.year`, la mini-línea de tiempo de obras por autor **nunca se renderiza**, el año no aparece en ninguna tarjeta de un archivo histórico, y `FavoriteButton` guarda `year: null` (`LibraryView.jsx:61`).
- **Solución concreta:** normalizar en `getAllBooks` (`year: book.pubYear ?? book.year`) y cambiar las 3 lecturas a `book.year` normalizado; con eso la línea de tiempo de autor y el chip de año en GridCard funcionan sin tocar datos.

### A4. Navegación invisible en desktop + vistas huérfanas (Glosario y Estadísticas sin entrada)
- **Ubicación:** `src/components/Navigation.jsx:48-98` (solo renderiza el `<dialog>` del drawer), `src/components/Header.jsx:8` (`onShowStats` se recibe pero nunca se usa → sin botón), `src/components/AnarchistArchive.jsx:318-324` (footer de una línea, sin enlaces) y `:206-315` (`GLOSSARY` y `STATS` solo alcanzables por URL `/glosario`, `/estadisticas`).
- **Problema:** en desktop no hay pestañas persistentes ni breadcrumb; la vista activa solo se deduce del `h2` del contenido (el label del menú está oculto con `md:hidden`, `Header.jsx:36`). "Mi Biblioteca (N)" queda dentro del drawer. Glosario y StatsPanel (`StatsPanel.jsx`, 166 líneas de trabajo) no tienen botón en ninguna parte.
- **Solución concreta:** volver a una barra de pestañas desktop (≤7: Biblioteca, Mapa, Línea Temporal, Autores, Acratas, Teorías, Rutas; Favoritos ya vive en el header) con `aria-current` (ya implementado en el drawer); mover Glosario + Estadísticas al footer como enlaces (ver M8). El panel de Estadísticas, además, hoy es la única vista sin `h2` ni contenedor tipo tarjeta (ver §3).

### A5. Las 358 obras "acratas" están duplicadas en Biblioteca y Autores (contradice `AGENTS.md`)
- **Ubicación:** `src/components/LibraryView.jsx:126` (filtra `b.category !== 'otros'` pero **no** `'acratas'`) y `src/utils/library.js` `getAllAuthors` (agrupa los **1.844** libros, incluidos `acratas` y `otros`) → `AnarchistArchive.jsx:79` pasa ese resultado a `AuthorsView`.
- **Problema (medido con node):** las 358 obras de vidas (categoría `acratas`) aparecen **tres veces**: en Biblioteca (catálogo), en Autores (222 de los 740 autores tienen libros acratas) y en la sección Acratas. `AGENTS.md` es explícito: "`acratas` … NO van al mapa ni a la línea temporal; **tampoco a la Biblioteca ni Autores** (apartadas)". El resultado es una arquitectura de información incoherente: el usuario ve la misma biografía duplicada en dos índices distintos sin saber que es la misma colección.
- **Solución concreta:** en `LibraryView.jsx:126` añadir `&& b.category !== 'acratas'` (mismo tratamiento que `otros`) y en `getAllAuthors` excluir también `acratas`/`otros` — o, si se decide intencionadamente integrarlas en el catálogo (es defendible: 358 obras es el 19% del catálogo), **actualizar `AGENTS.md` y el README** para que la documentación refleje la elección y evitar el doble inventario.

---

## 2. Hallazgos — MEDIA prioridad

### M1. Foco de teclado invisible en 3 buscadores (`focus:outline-none` + borde de foco = color de reposo)
- **Ubicación:** `src/components/AuthorsView.jsx:98`, `src/components/AcratasView.jsx:133`, `src/components/TimelineFilters.jsx:44`. Las tres usan `focus:outline-none focus:border-[#B79F6E]` (light) o `focus:border-[#872320]` (dark) — **idéntico al borde de reposo** → al tabear, el input no muestra ningún cambio.
- **Solución concreta:** reemplazar por `focus:border-[#A0241A] focus:ring-2 focus:ring-[#A0241A]/30` (o simplemente quitar `focus:outline-none` para que actúe el `:focus-visible` global de `index.css:57-60`).

### M2. Drawer de navegación sin trampa de foco ni foco inicial
- **Ubicación:** `src/components/Navigation.jsx:46-99`.
- **Problema:** al abrir el drawer, el foco queda en el botón hamburguesa; `Tab` recorre el contenido de detrás (el overlay lo tapa visualmente pero el teclado "sale"). No se restaura el foco al cerrar. `RegionModal`/`EventModal` ya resuelven esto con `useModalFocus` (`src/hooks/index.js:171`).
- **Solución concreta:** reutilizar `useModalFocus` (o su variante sin escape) sobre el `<dialog>` del drawer: mover foco al primer item, atrapar `Tab`/`Shift+Tab`, restaurar al desmontar.

### M3. Inputs `bg-white` puros que rompen la paleta pergamino
- **Ubicación:** `LibraryView.jsx:156`, `AuthorsView.jsx:98`, `AcratasView.jsx:133`, `GlossaryView.jsx:23, 95, 118`, `TheoriesView.jsx:98, 129`, `ReadingPathsView.jsx:86, 110`, `ContactView.jsx:108`, `FavoritesView.jsx:214` (todos `bg-white` sin opacidad) — y `src/index.css:166-169` solo sobreescribe `.bg-white/60` y `.bg-white/80`.
- **Problema:** sobre el fondo pergamino (`#F5EDD9→#D6BF8F`), los inputs y botones "En el catálogo" quedan **blanco puro #FFFFFF**, exactamente donde el tema litera los demás blancos → parches de "formulario genérico" en un archivo cálido.
- **Solución concreta:** añadir en `index.css` `.theme-constructivista .bg-white { background-color: rgba(248,240,220,0.95); }` (y su variante `theme-pergamino`), o sustituir `bg-white` por `bg-white/80` en esos 10 sitios.

### M4. Estados vacíos sin acción (Biblioteca, Autores, Acratas) y Favoritos sin CTA
- **Ubicación:** `LibraryView.jsx:163-165` (un `<p>` plano), `AuthorsView.jsx:132-136`, `AcratasView.jsx:143-146`, `FavoritesView.jsx:91-99` (icono + texto pero sin botón; invita a "ir a Biblioteca o el Mapa" sin enlace).
- **Problema:** el timeline ya tiene el patrón correcto (`TimelineView.jsx:164-184`: mensaje + botón "Limpiar filtros"); las demás vistas no. Un usuario con búsqueda sin resultados no tiene qué hacer.
- **Solución concreta:** un patrón mínimo compartido (espacio vacío de `p-12`, icono lucide, mensaje con el término buscado y botón "Limpiar búsqueda") y, en Favoritos, un botón primario que navegue a `VIEWS.LIBRARY` (el scroll "Guarda textos desde la Biblioteca…" no clica).

### M5. Elevación y radio de tarjeta inconsistentes
- **Ubicación:** tarjetas con **sombra base** (`shadow-md`): `AuthorsView.jsx:146`, `TheoriesView.jsx:28`, `AcratasView.jsx:156`, `GlossaryView.jsx:58`, `ReadingPathsView.jsx:28`, `FavoritesView.jsx:151`, `TimelineView.jsx:44,109` — frente a tarjetas **sin sombra en reposo**: `LibraryView.jsx:74` (GridCard solo `hover:shadow-lg`) y `WorldMapView.jsx:140` (tarjeta de región). Además `FeaturedBook.jsx:13` usa `rounded-xl` mientras **todas** las demás tarjetas usan `rounded-lg` (incluido el resto de la Biblioteca).
- **Problema:** el grid de la vista inicial se ve "plano" respecto a Autores/Teorías/Glosario; la obra del día tiene un radio distinto sin motivo.
- **Solución concreta:** añadir `shadow-md` (o `shadow-sm`) a `GridCard` y a las tarjetas de región del mapa, y unificar `rounded-xl → rounded-lg` en `FeaturedBook`.

### M6. Grafo de influencias inaccesible por teclado y con `role="img"` sobre contenido interactivo
- **Ubicación:** `src/components/InfluencesView.jsx:63-119` (`<svg role="img">` con `<g onMouseEnter/onClick>` por nodo), y el mismo patrón `role="img"` con paths enfocables en `WorldMap.jsx:118-125`.
- **Problema:** `role="img"` priva a los hijos del árbol de accesibilidad (el lector de pantalla lee solo la etiqueta del grafo) y, además, los nodos del grafo **no son enfocables** (a diferencia del `WorldMap`, que ya tiene `tabIndex`/`Enter`/`Space`, `WorldMap.jsx:91-102`): un usuario de teclado no puede seleccionar pensadores.
- **Solución concreta:** en `InfluencesView` cambiar a `role="group"` y añadir `tabIndex={0}` + `role="button"` + `onKeyDown` (Enter/Espacio → `setSelectedId`) a cada `<g>` de nodo, más `:focus-visible` con el borde del tema (como `.worldmap__country:focus-visible`, `index.css:75-79`). En `WorldMap.jsx`, usar `role="group"` en el `svg` y dejar `role="button"` en los paths.

### M7. Chips de década/categoría que llevan al vacío (desalineados con los datos)
- **Ubicación:** `src/constants/index.js:16` (`DECADES` fijo) + `TimelineFilters.jsx:75-87`, con `CATEGORIES` (`index.js:1-7`).
- **Problema (medido):** las décadas de los eventos son `-1800s, 1860s–1930s, 1960s, 1970s, 2000s, 2010s`; los chips `1700s, 1840s, 1940s, 1950s, 1980s` dan siempre 0 resultados, y `-1800s` (el evento "A.A.") **no existe como chip** para el usuario. "Otros" de `CATEGORIES` es un cubo interno que nunca aparecerá en la UI del timeline.
- **Solución concreta:** derivar las décadas presentes de `filterEvents` (con contador por chip, como hace `AuthorsView.jsx:117-121` con las letras) y eliminar de este filtro las categorías que no existen en eventos.

### M8. Footer de una línea: Glosario/Estadísticas/Contacto huérfanos y sin cierre de archivo
- **Ubicación:** `AnarchistArchive.jsx:318-324`.
- **Problema:** el acceso a Glosario y Estadísticas (A4) se arregla exactamente aquí: hoy el footer es solo "La Idea · Archivo Histórico Anarquista" y no tiene un solo enlace. El reporte de estética (2026-08-26, M5) ya propuso el footer completo y sigue sin implementarse.
- **Solución concreta:** añadir al footer las estadísticas (`stats.texts` / `stats.events` / `stats.regions`, ya computadas en `AnarchistArchive.jsx:87`) y enlaces a Glosario, Estadísticas y Contacto reutilizando `handleViewChange`.

---

## 3. Hallazgos — BAJA prioridad

### B1. Botones del header por debajo del área táctil de 44px en móvil
- **Ubicación:** `src/components/Header.jsx:29-71` (`p-2 md:p-3`; con icono de 20px → 36×36px < 44px) y `ScrollTopButton.jsx:9-16` (`p-4` + icono 24 → 56px, correcto).
- **Solución concreta:** en móvil usar `p-3` en los 3 botones del header (correo, tema, favoritos) para alcanzar ~44px, o añadir un área de toque invisible.

### B2. Toolbar del lector sin `flex-wrap` → riesgo de corte en pantallas ≤375px; sin estado de carga del PDF
- **Ubicación:** `src/components/ReaderOverlay.jsx:31-103`.
- **Problema:** la barra superior tiene 5 controles ("Cerrar", "Claro/Oscuro", Descargar, Abrir, Favorito) en una fila sin `flex-wrap`: el mínimo aproximado es ~382-390px (medido de sus paddings/iconos) → en 360-375px el último botón puede quedar recortado (el `overflow-x:hidden` global, `index.css:19-22`, lo ocultaría en silencio). Además el `<iframe>` de PDF no muestra indicador mientras carga.
- **Solución concreta:** añadir `flex-wrap` a la barra (o colapsar etiquetas a iconos bajo `sm`) y un sutil `loading` (spinner `Loader2` + `animate-spin`) sobre el iframe con `onLoad` para restaurarlo — en la línea de `ContactView.jsx:94`.

### B3. Compartir en redes: sin Open Graph, Twitter Card ni `theme-color`
- **Ubicación:** `index.html` (no hay `og:*`, `twitter:*`, `theme-color`; solo `title` + `description`).
- **Problema:** cada vista tiene URL compartible (`/mapa`, `/libro/<slug>`, `/estadisticas` vía `utils/routes.js`) pero al pegarla en Telegram/WhatsApp/X sale una tarjeta genérica.
- **Solución concreta:** añadir `og:title`, `og:description`, `og:type=website` y `meta name="theme-color"` con `#1A1818` (oscuro) / `#F5EDD9` (claro, según `useDarkMode` — puede fijarse el del tema por defecto).

### B4. "Obra del día" no se oculta al buscar
- **Ubicación:** `LibraryView.jsx:161` (`<FeaturedBook/>` se renderiza antes de comprobar `filtered.length === 0`).
- **Problema:** al escribir "Kropotkin" en la búsqueda, la obra destacada (que puede no coincidir) sigue arriba del grid de resultados.
- **Solución concreta:** renderizar `FeaturedBook` solo cuando `!searchTerm.trim()` (o mostrar "resultados de la búsqueda" como título de sección reemplazando al destacado).

---

## 4. Incoherencias visuales entre vistas (verificadas en código)

| Aspecto | Vista A | Vista B | Detalle |
|---|---|---|---|
| Sombra base de tarjetas | Autores/Teorías/Glosario/Acratas/Rutas/Favoritos/Timeline (`shadow-md`) | **Biblioteca** (`LibraryView.jsx:74`) y **tarjetas de región del mapa** (`WorldMapView.jsx:140`) **sin sombra** | El grid raíz se ve plano frente al resto |
| Radio de tarjeta | `rounded-lg` en todas las tarjetas | **`rounded-xl`** solo en `FeaturedBook.jsx:13` | Obra del día con radio distinto sin motivo |
| Chips de categoría/región | `LibraryView.jsx:85` y `FeaturedBook.jsx:35`: `font-mono text-[10px] uppercase` + `rounded` | `RegionModal.jsx:60` y `AuthorsView.jsx:218`: sans `text-xs`, `rounded`; `TimelineView.jsx:53`, `TheoriesView.jsx:66` y `InfluencesView.jsx:153`: `rounded-full` | 3-4 estilos de "ficha" sin sistema (candidato a componente `Chip`) |
| Inputs de búsqueda | `TimelineFilters.jsx:38-45`: `border-2 py-3`, `bg-white/80` | `AuthorsView.jsx:98` / `AcratasView.jsx:133`: `border-2 py-2.5`, `bg-white`; `LibraryView.jsx:156`: `border` (1px) `py-2`; `GlossaryView.jsx:20-24`: `w-full md:w-96` | 4 alturas/grosor de borde/anchos distintos y fondo blanco puro (M3) |
| Cabecera de vista | `h2 text-3xl md:text-4xl font-display` + subtítulo `mb-4` (Biblioteca, Timeline, Autores, Acratas) | Subtítulo `mb-6` (Mapa, Teorías, Rutas, Glosario, Influencias, Contacto) | Ritmo vertical de apertura distinto según vista |
| Contenedor de vista | Panel con `rounded-lg shadow-lg border-2 p-6 md:p-8` en 10 vistas | **Contacto** (`ContactView.jsx:161-172`) sin contenedor; **Estadísticas** (`StatsPanel.jsx:89`) con estilo `nav` y sin `h2` | Contacto "flota" sobre el fondo; Estadísticas no parece una vista |
| Estado vacío | Timeline: panel + título + CTA (`TimelineView.jsx:164-184`) | Biblioteca: `<p>` plano; Autores/Acratas: `<p>` plano; Favoritos: icono sin botón | Falta el patrón único (M4) |
| Fade del timeline | `TimelineView.jsx:72` usa `from-amber-50` (light) | El tema pergamino sobreescribe el fondo pero **no** `.from-amber-50` (`index.css` no lo cubre) | Posible costura blanquecina en el borde derecho del fade en tema claro |
| Foco de inputs | `:focus-visible` global bermellón | 3 inputs lo anulan con `focus:outline-none` (M1) | Foco invisible por excepción |

---

## 5. Nuevos módulos propuestos (no están en `IDEAS.md`)

1. **Miniaturas de portada generadas desde los PDFs** — pipeline offline (script una vez, no por petición) que renderice la primera página de los 1.842 PDFs a WebP (~300px) y los sirva como `src` de las tarjetas, con fallback monograma del autor (iniciales sobre el fondo pergamino). **Valor:** alto — rompe la monotonía textual de 1.838 fichas y da sensación de colección real; mejora el escaneo visual de la Biblioteca en ~153 páginas. **Esfuerzo:** M.
2. **Mapa de circulación y exilios** — capa opcional en `WorldMap` que trace arcos entre las regiones de los autores con obra en varios países (`getAllAuthors` ya agrupa libro con `region`): visualiza la red transnacional del movimiento (España→Francia→América, etc.), conectando con la identidad histórica del archivo. **Valor:** medio-alto; esfuerzo M.
3. **"Siguiente lectura" al cerrar el lector** — al cerrar `ReaderOverlay`, minitarjetas de obras relacionadas (mismo autor → misma categoría → mismo sujeto acrata) y un botón "Al azar" en la Biblioteca que abra un libro aleatorio con archivo. Reutiliza `getAllBooks`/`findBookByTitle`; sube la retención en el modo de lectura que es el corazón de la app. **Valor:** alto; esfuerzo **S**.
4. **Segunda capa del mapa: "Vidas (Acratas)"** — toggle en `WorldMapView` para pintar el mapa por número de biografías/memorias (categoría `acratas`, 358 textos, agrupados por `subject` en `getAcratasPersons`) en vez de solo textos históricos; hoy el mapa solo pinta `historia` (`WorldMapView.jsx:32-39`) y deja a Acratas sin expresión geográfica. **Valor:** medio; esfuerzo S.
5. **Árbol genealógico de corrientes** — vista diagramática (árbol/radial) de derivación de las corrientes de `TheoriesView` (mutualismo → colectivismo → anarcosindicalismo…), clicable hacia autores y obras; es la pieza educativa que hoy el grafo de personas (`InfluencesView`) no cubre. **Valor:** medio (pedagógico); esfuerzo M.

---

## 6. Nota final — prioridad para la próxima iteración

1. **A1 + A2 + A5 (filtros contra los datos reales + duplicación acratas)** — es el mayor gap de usabilidad: la web describe "filtros" que no filtran, el catálogo (entidad raíz) no tiene ni categoría ni región ni orden, y 358 obras viven duplicadas en dos índices. Esfuerzo: 1-2 h con infraestructura ya escrita (`utils/library.js`) y la exclusión de acratas es un cambio de una línea (más decidir documento vs código: actualizar `AGENTS.md` si se integran).
2. **A3 (año `pubYear` vs `year`)** — 20 min y desbloquea una feature completa (línea de tiempo de autor) + el dato "año" en todas las tarjetas de un archivo histórico.
3. **A4 + M2 + M1 (navegación y foco)** — barra de pestañas desktop, entradas de Glosario/Estadísticas en el footer y drawer con `useModalFocus`: son los tres cambios que "arreglan el wayfinding" de una app con 12 vistas.
4. **M3 (blancos puros del tema)** — 5 líneas de CSS que rematan la paleta pergamino en los inputs.
5. Baja prioridad: M4, M5, M6, M7, B1-B4 — pulido y una ronda de accesibilidad (grafo de influencias) que no afecta lógica de datos.

Ninguno de los cambios propuestos toca la lógica de datos (salvo la normalización de `year` en `getAllBooks`, que es un añadido sin efecto sobre `regionData`); `npm run check` debe seguir verde con actualizaciones menores de aserciones de UI donde se modifiquen textos o chips.