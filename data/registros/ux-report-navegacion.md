# Reporte UX/UI — Arquitectura de información y navegación

> **Fecha y hora:** 2026-08-17 22:07 (UTC-4)
> **Revisor:** `@ux-review`
> **Alcance:** navegación y vistas — `src/components/Navigation.jsx`, `src/components/AnarchistArchive.jsx`, `src/components/LibraryView.jsx`, `src/components/TheoriesView.jsx`, `src/components/AuthorsView.jsx`, `src/components/InfluencesView.jsx`, `src/components/ReadingPathsView.jsx`, `src/components/GlossaryView.jsx`, `src/components/ContactView.jsx`, `src/constants/index.js`, tests (`Views.test.jsx`, `AnarchistArchive.test.jsx`, `Interactions.test.jsx`, `NewViews.test.jsx`)
> **Verificación:** `npm run test` → **227/227 verdes** (baseline confirmado antes de proponer cambios). Sin cambios de código.
> **Relación con reportes previos:** este es un reporte NUEVO sobre IA/navegación; no modifica `data/registros/ux-report.md` (2026-08-11).

---

## 0. Resumen ejecutivo

La app tiene **10 destinos en una barra horizontal única** (`Navigation.jsx:14-25`) con `overflow-x-auto`
(`Navigation.jsx:30`): se desborda incluso en desktop (~1.300 px de píldoras para un contenedor de ~1.200 px,
así que Glosario, Contacto y Favoritos quedan **fuera de pantalla sin ningún affordance de scroll** — no hay
fade, ni chevron, ni indicador). En móvil la barra es una cinta deslizable invisible que viola toda heurística
de visibilidad y deja la navegación fuera de la ley de Miller (5-7 items de primer nivel).

**Dos hallazgos evaluados:**

1. **Vista inicial inconsistente** (Mejora — prioridad alta): `AnarchistArchive.jsx:35` abre en `TIMELINE`
   mientras la primera pestaña del nav es `Biblioteca` (`Navigation.jsx:15`). La pestaña activa queda en la
   posición 3. **Recomendación: abrir en `LIBRARY`** (el catálogo es la entidad raíz de la arquitectura de
   datos y la tarea dominante del archivo), con alternativa documentada de mantener Timeline reordenando el nav.
2. **Saturación de menús** (Crítico): **arquitectura objetivo de 7 items de primer nivel**
   (Biblioteca, Mapa, Línea Temporal, Autores —que **absorbe** "Red de Autores" como sub-modo—, Teorías,
   Rutas, Favoritos) + **Glosario y Contacto al footer**. En móvil, hamburguesa/drawer agrupado (los botones
   permanecen en el DOM: el colapso es visual, no condicional en JS, para no romper los tests jsdom).

**Impacto en tests:** con los cambios completos se tocan **4 aserciones en 3 archivos**
(`AnarchistArchive.test.jsx`, `Interactions.test.jsx`, `Views.test.jsx`); el resto (223 aserciones) sigue
verde sin tocar. Detalle por cambio en §2.4 y §3.

---

## 1. Hallazgo 1 — Vista inicial inconsistente

### Severidad: MEJORA (prioridad alta) — 1 línea de código + 2 tests

### Ubicación exacta
- `src/components/AnarchistArchive.jsx:35` → `const [activeView, setActiveView] = useState(VIEWS.TIMELINE);`
- `src/components/Navigation.jsx:14-25` → el item **1** de `navItems` es `VIEWS.LIBRARY` ("Biblioteca"), el **3** es `VIEWS.TIMELINE`.

### Problema
Al abrir la web se renderiza la vista **Línea Temporal** (posición 3 del nav) y la píldora activa
(`activeView === view`, `Navigation.jsx:36-43`) ilumina la tercera pestaña. El primer item ("Biblioteca")
no es el activo, por lo que el estado inicial **contradice el orden del propio menú** y se percibe como
"hecho mal", aunque sea intencional. Esto es una violación directa de la heurística de **consistencia y
estándares** (el nav es el mapa del sitio; la posición 1 = inicio esperado) y de **reconocimiento**
(el usuario infiere que la primera pestaña es la home).

### Análisis de opciones (evaluadas contra el código real)

| Opción | A favor | En contra | Veredicto |
|---|---|---|---|
| **A. Abrir en `LIBRARY`** | El catálogo es la **entidad raíz** de la arquitectura de datos: `regionData.js` es FUENTE ÚNICA (`AGENTS.md`) y todas las demás vistas derivan de él (`getAllBooks`, `getAllAuthors` en `utils/library.js`). Es la tarea dominante (encontrar y leer textos): única vista con búsqueda global y filtros completos (`LibraryView.jsx:20-31`). Tiene "Obra del día" (`FeaturedBook`), el mejor gancho de entrada. El nav ya la lista primero → coherencia total entre orden y estado inicial. | Rompe 2 tests que asumen timeline inicial (ver §1.2). La identidad "histórica/cronológica" del README pasa a segundo plano. | **RECOMENDADO** |
| **B. Abrir en `MAP`** | Visualmente impactante. | Es una **lente** (solo textos históricos por geografía, `WorldMapView.jsx:32-39`), no el contenido. La navegación por región ya existe dentro del mapa y como filtro/agrupación de la Biblioteca. Cierra el embudo en vez de abrirlo. | Descartado |
| **C. Mantener `TIMELINE` y reordenar el nav (Timeline primero)** | Refuerza la identidad del proyecto (el README describe primero "línea temporal 1840-1968"). **Coste 0 en tests** (ningún test asume la posición). Conserva el "storytelling" cronológico como bienvenida. | Des-prioriza la tarea de consulta; el usuario debe saltar a Biblioteca para buscar. La línea temporal no tiene búsqueda de obras, solo de eventos (`TimelineFilters`). | Alternativa viable documentada (ver §1.3) |

### Solución concreta (opción A — recomendada)
1. `AnarchistArchive.jsx:35`: `useState(VIEWS.TIMELINE)` → `useState(VIEWS.LIBRARY)`.
2. **No** hace falta tocar `Navigation.jsx`: el orden [Biblioteca, Mapa, Línea Temporal, …] ya es el correcto
   para este default. El footer (`AnarchistArchive.jsx:199-208`) y las referencias cruzadas
   (`openEventFromLibrary`, `AnarchistArchive.jsx:70-73`) siguen funcionando: la timeline queda a 1 clic.
3. Actualizar el copy del tour (`TourModal`) si su recorrido empieza por la timeline (verificar; no se
   autoejecuta hoy, `showTour=false`).

### 1.1 Test impact de la opción A (preciso)
- `src/components/AnarchistArchive.test.jsx:22-25` — el test "muestra eventos de la línea temporal en la
  vista inicial" espera `'Buscar eventos'` (string de `TimelineFilters`, que solo se renderiza con
  `activeView === TIMELINE`). **Se actualiza**: cambiar la aserción a `'Buscar obra'` (input de
  `LibraryView`) y el título del test a "…vista inicial (biblioteca)". El test de la línea 10-20 sigue verde
  (renderiza TODOS los items del nav, incluida "Línea Temporal").
- `src/components/Interactions.test.jsx:402-410` — "abre un evento de la línea temporal" hace
  `render(<AnarchistArchive />)` y clica un evento **sin navegar antes**. Con Biblioteca de default no hay
  eventos en pantalla → `getAllByText(...)[0]` lanza. **Se actualiza**: añadir
  `fireEvent.click(screen.getByRole('button', { name: /Línea Temporal/ }))` antes de buscar el evento
  (label que permanece en el nav → el matcher sigue funcionando).
- `AnarchistArchive.test.jsx:10-20`, `:30-36` (clic a Mapa), `:38-47` (Autores/Favoritos), `Views.test.jsx`
  (Navigation se renderiza directo con `activeView` explícito) → **sin cambios, verdes**.

### 1.2 Alternativa (opción C) si el dueño prefiere la identidad cronológica
- Reordenar `navItems` en `Navigation.jsx:14-25` para que `TIMELINE` sea el item 1 (y mover Biblioteca a la
  posición 2). **Cero tests rotos** (ninguno asume el orden) y la píldora activa pasa a ser la primera.
- Coste: la búsqueda de obras queda a 1 clic extra; el catálogo pierde el lugar de "home" que ya ocupa en
  el nav. Es una decisión de producto, no de código.

---

## 2. Hallazgo 2 — Saturación de menús (10 items en barra única)

### Severidad: CRÍTICO (la navegación es el único sistema de wayfinding del sitio)

### Ubicación exacta
- `src/components/Navigation.jsx:14-25` — 10 items con label + icono `lucide`.
- `src/components/Navigation.jsx:30` — `flex gap-2 py-4 overflow-x-auto`: cinta horizontal sin indicador
  de scroll (sin fade, sin chevron, sin "peek" del siguiente item).
- `src/components/Navigation.jsx:35` — `whitespace-nowrap` en cada píldora (impide wrap).

### Problema (verificado)
- **Desktop (~1.280 px):** 10 píldoras de `font-display` (Anton, condensada pero en mayúsculas +
  `tracking-wider`), icono 18 px y `px-5` suman ≈ 1.250-1.400 px → el contenedor `container mx-auto`
  (~1.200 px con `px-4`) se desborda y los items 8-10 (**Glosario, Contacto, Favoritos**) quedan **ocultos
  sin ninguna pista visual** de que hay más. Peor aún: "Favoritos" (clúster personal con badge) queda
  enterrado al final.
- **Móvil (< 768 px):** cinta deslizable invisible de 10 items; viola visibilidad de estado del sistema,
  hace difícil el objetivo táctil (píldoras de texto largo que se deslizan) y oculta el estado activo al
  salir del viewport.
- **Cognitivo:** 10 items de primer nivel superan el rango sano de 5-7 (Miller 7±2; en navegación global
  de sitios de contenido se recomienda ≤7). Además hay **solapamiento conceptual** entre vistas que duplica
  la sensación de saturación (ver §2.1).

### 2.1 Análisis de solapamientos y candidatos a absorción (contrastado con el código)

| Vista | Naturaleza real (verificada) | ¿Solapa con…? | ¿Absorber? | Qué pasa con su contenido |
|---|---|---|---|---|
| **Teorías** (`TheoriesView.jsx`) | Capa **editorial curada** sobre el catálogo: 10 corrientes con descripción, ideas clave, autores y obras resueltas con `findBookByTitle`. La Biblioteca ya puede filtrar `categoría=teoria` y `tipo=ideas` (`LibraryView.jsx:130-168`), pero **no** tiene las corrientes (agrupación semántica única). | Biblioteca (parcial: solo el filtro de categoría, NO el contenido editorial) | **No** absorber: se pierde el valor editorial (ideas clave, corrientes). | Se **mantiene íntegra** como vista de primer nivel (o en "Explorar" si se quiere bajar a 6). Opcional: botón "Ver en el catálogo" → Biblioteca con filtro precargado. |
| **Red de Autores** (`InfluencesView.jsx`) | Misma **entidad** que Autores: grafo de 18 pensadores con aristas de influencia, bios y obras (resueltas con `getAllAuthors`). Los datos del grafo (relaciones) son únicos, pero el 100% de su contenido cuelga de la misma entidad "autor" que ya es `AuthorsView`. | **Autores** (`AuthorsView.jsx`) — misma entidad | **SÍ — absorber** como sub-modo de Autores | Nada se pierde: el grafo, bios, aristas y obras se renderizan dentro de la vista Autores con un toggle "Lista / Red de influencias" (componente `InfluencesView` intacto, render condicional). Se ahorra 1 slot de primer nivel. |
| **Rutas** (`ReadingPathsView.jsx`) | **Playlists curadas** de lectura: 10 itinerarios con orden numerado e intención editorial sobre obras del catálogo. No son un filtro (la Biblioteca no tiene "rutas"). | Biblioteca (solo los títulos referenciados) | **No** absorber: son guías de lectura, un patrón UX distinto (recorrido paso a paso con línea temporal visual). | Se **mantiene íntegra** como primer nivel (o en "Explorar"). Opcional: "Abrir todas en el catálogo". |
| **Glosario** (`GlossaryView.jsx`) | **Soporte/referencia**: 20 términos con definición + obras. Sin entidad padre en la IA. | Ninguna (utilidad transversal) | **Sí — demover** a secundario/footer | Se **mantiene íntegra**: solo cambia su ubicación en la jerarquía (footer o menú "Explorar"). |
| **Contacto** (`ContactView.jsx`) | **Meta-información** (formulario FormSubmit). No es contenido del archivo. | Ninguna | **Sí — demover al footer** (patrón estándar) | Se **mantiene íntegra**; el enlace del footer abre la misma vista `CONTACT`. |
| **Favoritos** (`FavoritesView.jsx`) | Clúster **personal** con badge (`localStorage`). | Biblioteca (filtro `favoritesOnly`) | **No absorber**: es el clúster personal; debe seguir a 1 clic | Se **mantiene** como 7.º item con badge (dentro del rango 5-7). |
| **Mapa / Línea Temporal / Biblioteca** | Lentes espacial / cronológica + catálogo. | Entre sí solo parcialmente (todas son derivadas del catálogo pero con valor visual único) | **No** | Se mantienen como núcleo del primer nivel. |

**Conclusión del análisis:** solo hay **una absorción real** (Red de Autores → Autores, misma entidad) y
**dos demociones** (Glosario y Contacto → footer). Teorías y Rutas son contenido editorial con valor propio
y no deben fusionarse con la Biblioteca: no son "filtros del catálogo", son capas de exploración guiada.

### 2.2 Opciones de presentación evaluadas

| Opción | Veredicto |
|---|---|
| **Pestañas superiores (actual)** | Válida **si** se baja a ≤7 items y se elimina el `overflow-x-auto` en desktop. |
| **Menú desplegable "Explorar ▾"** | Pragmática (fallback de bajo riesgo): agrupar {Red de Autores, Glosario} bajo un solo item. **Ojo:** si los labels se renderizan siempre (incluso colapsados), `Views.test.jsx` sigue verde; si se renderizan con lazy/condicional, rompe 1 aserción. |
| **Barra lateral (sidebar)** | Descarta: la app es de contenido de lectura larga; un sidebar fijo roba ancho al contenedor de lectura y duplica el header sticky. Solo tendría sentido si el catálogo creciera a secciones anidadas profundas. |
| **Hamburguesa en móvil** | **Recomendada < `md`** con drawer agrupado (ver §2.3). Constraint de tests: los botones deben **permanecer en el DOM** (colapso por CSS `hidden`/`flex`), porque `AnarchistArchive.test.jsx:33,41,60` e `Interactions.test.jsx:395` hacen `getByRole('button', {name: …})` sobre la app completa en jsdom (sin media queries). |
| **Bottom tab bar en móvil** | Viable (5 slots + "Más ▾") pero con 7 destinos + footer obliga a un "Más" que vuelve a ocultar contenido; el drawer agrupado es más limpio para este volumen. |

### 2.3 Arquitectura de información objetivo (recomendada)

**Primer nivel (7 items — rango cognitivo sano, sin overflow en desktop):**

1. **Biblioteca** (home por defecto — ver Hallazgo 1)
2. **Mapa (N)**
3. **Línea Temporal**
4. **Autores** → absorbe "Red de Autores" como **sub-modo**: toggle segmentado en la cabecera de
   `AuthorsView` ([Autores] [Red de influencias], con `aria-pressed`/`role=tablist`). El label del nav
   puede mostrar un chevron discreto que indique submodos.
5. **Teorías**
6. **Rutas**
7. **Favoritos (N)** (clúster personal, badge)

**Secundario / meta (fuera del primer nivel):**
- **Glosario** → enlace del footer (junto a la línea de créditos) o item del menú "Explorar ▾" si se
  prefiere mantenerlo visible sin bajar a footer. Misma vista `GLOSSARY`, misma URL.
- **Contacto** → enlace del footer. Patrón estándar de archivos/bibliotecas.

**Móvil (< `md`):** hamburguesa (icono `Menu` de lucide) → drawer que agrupa:
- **Archivo**: Biblioteca, Mapa, Línea Temporal, Autores, Teorías, Rutas.
- **Personal**: Favoritos (con badge).
- **Información**: Glosario, Contacto.
Botones siempre en el DOM (CSS `hidden md:flex` / drawer), píldora activa con `aria-current="page"`.

**Desktop/tablet:** 7 píldoras en fila **sin** `overflow-x-auto` (el cálculo de ancho cabe en ≥1.024 px:
≈ 950-1.000 px con labels actuales). Si se quiere un salvavidas visual, mantener `overflow-x-auto` pero con
fade lateral + `scrollbar-width:none` como affordance (no como patrón principal).

### 2.4 Lista numerada priorizada (cada cambio con esfuerzo y riesgo)

1. **[CRÍTICO] Reestructurar `Navigation.jsx` a 7 items** (absorber Red de Autores → sub-modo en
   `AuthorsView`; mover Glosario y Contacto al footer). Esfuerzo: **45-90 min**. Riesgo de romper tests:
   **bajo-medio** — solo `Views.test.jsx:26` (espera "Red de Autores" en Navigation): mover esa aserción al
   test de `AuthorsView` (o a `NewViews.test.jsx`, donde `InfluencesView` ya se testea). `Views.test.jsx:29`
   ("Contacto") → mover aserción al test del footer/`AnarchistArchive` (el footer vive en `AnarchistArchive`,
   así que `AnarchistArchive.test.jsx:19` sigue pasando). Si en su lugar se usa el dropdown "Explorar ▾"
   renderizado siempre, **0 aserciones rotas**.
2. **[MEJORA alta] Vista inicial → `LIBRARY`** (`AnarchistArchive.jsx:35`). Esfuerzo: **5-10 min**.
   Riesgo: 2 tests a actualizar (ver §1.1).
3. **[MEJORA] Móvil: hamburguesa/drawer agrupado < `md`**, botones siempre en DOM. Esfuerzo: **1-2 h**.
   Riesgo: **medio** (nuevo estado de UI + cobertura de un par de tests del drawer). Los tests jsdom
   existentes no se rompen si el colapso es visual.
4. **[MEJORA] Accesibilidad del nav resultante**: `aria-current="page"` en la píldora activa
   (`Navigation.jsx:36`), `aria-label="Navegación principal"` en el `<nav>` (ya pedido en el reporte
   2026-08-11, M4, aún sin implementar), y `aria-expanded` en el hamburguesa. Esfuerzo: **15-30 min**.
   Riesgo: nulo (atributos añadidos, sin cambiar textos).
5. **[SUGERENCIA] Cross-links de ida y vuelta**: botones "Ver en el catálogo" desde Teorías/Rutas/Glosario
   → `LIBRARY` con filtros precargados (nuevo prop `initialFilters` en `LibraryView`), y enlace "Glosario"
   desde la vista Autores (o viceversa). Esfuerzo: **1-2 h**. Riesgo: **bajo** (nuevos props con default;
   `LibraryView.test.jsx` requiere 1-2 casos nuevos).
6. **[SUGERENCIA] Consolidar labels**: "Red de Autores" desaparece del nav (queda "Red de influencias"
   como subtítulo dentro de Autores); "Mapa (17)" podría dejar el número (ya se ve el contador en la
   vista) para ganar ancho. Esfuerzo: 10 min. Riesgo: actualizar `Views.test.jsx:21` si se quita el número.

### 2.5 Resumen del impacto en tests (propuesta completa → 227 verdes)

| Cambio | Tests afectados | Acción necesaria |
|---|---|---|
| Default → LIBRARY | `AnarchistArchive.test.jsx:22-25`; `Interactions.test.jsx:402-410` | 2 aserciones: una pasa a `'Buscar obra'`; la otra añade un clic previo a "Línea Temporal" |
| Red de Autores absorbido (label fuera de Navigation) | `Views.test.jsx:26` | 1 aserción: trasladar a `AuthorsView`/`NewViews.test.jsx` |
| Contacto → footer | `Views.test.jsx:29` | 1 aserción: trasladar al test de `AnarchistArchive`/footer |
| Glosario → footer o dropdown renderizado | `Views.test.jsx:28` | 0 si el label permanece en el DOM; 1 si se oculta condicionalmente |
| Teorías / Rutas / Favoritos / Mapa / Biblioteca (labels intactos) | — | 0 |

Los tests de interacción que clican nav (`AnarchistArchive.test.jsx:33,41,43,60`;
`Interactions.test.jsx:395,414`) siguen verdes: los labels y botones permanecen en el DOM en todas las
propuestas (se mueven de contenedor, no se eliminan).

---

## 3. Nota final — Qué conviene priorizar en la próxima iteración

1. **Hallazgo 2, cambio 1 (reestructurar nav a 7 + footer)** — es el de mayor impacto percibido: elimina el
   scroll invisible, deja de ocultar Favoritos/Glosario/Contacto en desktop y baja la carga cognitiva a 7.
   Incluye decidir entre **sub-modo en Autores** (IA óptima, 1 aserción a mover) o **dropdown "Explorar ▾"**
   (cero aserciones, aceptable a corto plazo).
2. **Hallazgo 1 (default → Biblioteca)** — 5-10 minutos; es la percepción de "mal hecho" que reportó el
   usuario y cierra la inconsistencia entre estado inicial y primer item del nav.
3. **Cambio 3 (móvil)** — urgente si el tráfico móvil es relevante: la cinta horizontal actual es el peor
   patrón móvil de toda la app (sin affordance + objetivos táctiles pequeños).
4. Cambios 4-6 (ARIA, cross-links, labels) — pueden ir en iteraciones siguientes; ninguno rompe la lógica
   de datos y todos mantienen `npm run check` (lint + tests + build) verde con las actualizaciones de tests
   descritas en §1.1 y §2.5.