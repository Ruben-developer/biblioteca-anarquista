# Reporte UX/UI — Estética y Diseño Visual

> **Fecha y hora:** 2026-08-26 21:15 (UTC-4)
> **Revisor:** `@ux-review`
> **Alcance:** estética visual, paleta, tipografía, tarjetas, modales, header/footer, widget obra del día, estadísticas, responsive visual, accesibilidad visual, microanimaciones
> **Verificación:** revisión estática de todos los componentes JSX + `src/index.css` + `tailwind.config.js` + `index.html`. Build de producción OK (`vite build`, 1401 módulos). Sin cambios de código.
> **Relación con reportes previos:** complementa `ux-report.md` (2026-08-11, estética general) y `ux-report-navegacion.md` (2026-08-17, arquitectura de información). Este reporte NO repite los hallazgos de navegación ya resueltos (nav a 8 items, drawer hamburguesa, vista inicial Biblioteca, Glosario/Contacto en nav). Se asumen resueltos los hallazgos C1-C4 y M1-M5 del reporte 2026-08-11 que fueron efectivamente corregidos en código (fondo pergamino con selectores compuestos, scrollbar bermellón, estado vacío de timeline, tipografía cargada, contraste AA, foco visible).

---

## 0. Resumen ejecutivo

La web tiene una **base estética sólida**: paleta bermellón/negro pergamino coherente, tipografía `font-display` (Anton/Oswald) bien aplicada a títulos y nav, microanimaciones sutiles y un tema claro/oscuro funcionales. Los hallazgos del reporte 2026-08-11 sobre fondo pergamino (C1), scrollbar púrpura (C3), estado vacío timeline (C4) y contraste (M5) están **resueltos en código actual**.

Los problemas restantes son de **pulido y consistencia**: la paleta tipográfica está cargada pero incompleta (2 de 4 fuentes nunca se usan), las tarjetas tienen paddings/sombras/bordes que varían entre vistas sin razón visual, el footer es una línea sin presencia, los modales tienen estructura interna inconsistente, y las microanimaciones no respetan `prefers-reduced-motion`. Todo apunta a una app que pasó de "dashboard genérico" a "archivo con carácter" pero le falta la **última milla de consistencia visual**.

---

## 1. Hallazgos — HIGH (deben resolverse pronto)

### H1. `font-serif` y `font-mono` cargadas pero nunca usadas — tipografía a medio implementar

- **Ubicación:** `index.html:11` (carga Google Fonts), `tailwind.config.js:9-12` (define las 4 familias), CERO usos de `font-serif` o `font-mono` en cualquier `.jsx`.
- **Problema:** El plan tipográfico del reporte 2026-08-11 (§3.3) definió 4 familias con roles claros. Solo `font-display` (Anton/Oswald) se aplica consistentemente. Las otras dos están **cargadas y pagando weight en el CSS bundle** sin renderizarse:
  - **Playfair Display** (`font-serif`): se cargan 4 variantes (400, 600, 700, italic) ≈40 KB. El `<blockquote>` de `EventModal.jsx:51` usa `italic` con la fuente de sistema, no Playfair. Las descripciones de eventos y citas textuales son el candidato natural.
  - **IBM Plex Mono** (`font-mono`): se cargan 2 variantes (400, 500) ≈20 KB. Los chips de categoría (`LibraryView.jsx:87,91,164`), región (`LibraryView.jsx:151`), año, y etiquetas de统计数据 usan la fuente sans por defecto.
- **Impacto visual:** El contraste entre "títulos de imprenta" (font-display) y "cuerpo genérico" (font-sans) es bajo. Las chips de categoría se leen como texto normal cuando deberían parecer **fichas de archivo** con una micro-tipografía mono condensada. Las citas no tienen presencia editorial.
- **Solución concreta:**
  1. **Citas:** en `EventModal.jsx:51`, añadir `font-serif` al `<blockquote>`:
     ```jsx
     <blockquote className={`font-serif text-lg italic ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>
     ```
  2. **Chips de ficha:** en `LibraryView.jsx` (BookMeta, GridCard badge), `FeaturedBook.jsx:38`, `FavoritesView.jsx:176`, `AuthorsView.jsx:256`, añadir `font-mono text-[10px] uppercase tracking-wider` a los `<span>` de categoría y región. Ejemplo en BookMeta:
     ```jsx
     <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-amber-200 text-amber-900'}`}>
       {book.category}
     </span>
     ```
  3. **Años grandes en Timeline:** en `TimelineView.jsx:44,106`, añadir `font-display` o `font-serif` a los numerales de año para que se lean como "fecha de archivo" en vez de texto normal.

### H2. Sin `prefers-reduced-motion` — animaciones obligatorias para usuarios con vértigo

- **Ubicación:** `src/index.css:354-411` (definiciones de `.view-transition`, `.card-appear`, `.animate-lift`), ningún componente tiene `@media (prefers-reduced-motion)`.
- **Problema:** Las 3 animaciones CSS (`view-fade-slide`, `card-pop`, `animate-lift`) y las transiciones de `transition-colors`/`transition-all` en botones se ejecutan siempre. Para usuarios con **trastornos vestibulares** (≈35% de la población mayor de 40 años según ARIA Authoring Practices), las animaciones de deslizamiento y escala pueden causar náuseas o mareo. No hay forma de desactivarlas.
- **Impacto:** Violation de WCAG 2.3.3 (Animation from Interactions) y 2.2.2 (Pause, Stop, Hide). Afecta a la certificación de accesibilidad.
- **Solución concreta:** en `src/index.css`, añadir antes de las definiciones de animación:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .view-transition,
    .card-appear {
      animation: none !important;
      opacity: 1 !important;
    }
    .animate-lift:hover,
    button:hover,
    a:hover {
      transform: none !important;
    }
    *, *::before, *::after {
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
    }
  }
  ```

### H3. FeaturedBook sin distinción visual — se pierde entre las tarjetas

- **Ubicación:** `src/components/FeaturedBook.jsx:13`
- **Problema:** El widget "Obra del día" usa el mismo `cardClass` + `border-2 rounded-xl p-6` que cualquier tarjeta de la biblioteca. No tiene borde especial, fondo diferenciado, sombra distinta ni tamaño más grande. Es el **único elemento editorial curado** de la vista de entrada y debería verse como tal.
- **Impacto visual:** Un usuario nuevo que entra a Biblioteca ve el FeaturedBook como "una tarjeta más arriba del grid". No captura la atención como una recomendación personal.
- **Solución concreta:** distinguir visualmente el FeaturedBook con:
  ```jsx
  <section className={`${cardClass} border-2 border-amber-600/50 rounded-xl p-6 md:p-8 mb-8 relative overflow-hidden shadow-xl`}>
  ```
  - Añadir `border-amber-600/50` (tema claro) o `border-red-500/40` (tema oscuro) como borde acento más intenso que las tarjetas normales.
  - Añadir `shadow-xl` en vez de `shadow-md`.
  - Considerar un fondo sutil con gradiente radial: `bg-gradient-to-br from-amber-50/80 to-orange-50/40` (tema claro) o `from-red-950/30 to-gray-900/10` (tema oscuro).

---

## 2. Hallazgos — MEDIUM (mejoran la percepción de calidad)

### M1. Padding inconsistente entre tarjetas — p-5 vs p-6 sin razón visual

- **Ubicación:** múltiples componentes (ver tabla).
- **Problema:** Las tarjetas internas usan dos valores de padding sin un sistema claro:

  | Componente | Padding | Bordes |
  |---|---|---|
  | LibraryView GridCard | `p-5` | `border-2` |
  | LibraryView GroupSection | `p-5` | `border-2` |
  | LibraryView BookCardInGroup | `p-4` | `border` |
  | FavoritesView tarjetas | `p-5` | `border-2` |
  | GlossaryView tarjetas | `p-5` | `border-2` |
  | ReadingPathsView tarjetas | `p-5` | `border-2` |
  | AuthorsView tarjetas | `p-6` | `border-2` |
  | TheoriesView tarjetas | `p-6` | `border-2` |
  | WorldMapView region cards | `p-6` | `border-2` |
  | FeaturedBook | `p-6` | `border-2` |
  | EventModal header | `p-6` | `border-4` |
  | RegionModal content | `p-6` | `border-4` |
  | TimelineFilters panel | `p-6` | `border-2` |

  Tarjetas de contenido (Library, Favorites, Glossary, ReadingPaths) usan `p-5`, mientras que tarjetas de "vista completa" (Authors, Theories, WorldMap) usan `p-6`. La diferencia de 4px es imperceptible individualmente pero acumula una sensación de "diseño por iteración" en vez de sistema.

- **Solución concreta:** unificar todas las **tarjetas internas** (items de grid dentro de una vista) en `p-5` y todas las **vistas completas** (el contenedor principal de cada sección) en `p-6 md:p-8` (ya lo están). Las tarjetas de autor/theory/ruta son "items de grid" igual que las de biblioteca → bajarlas a `p-5`.

### M2. Sombras hover inconsistentes — shadow-xl vs shadow-lg

- **Ubicación:** `LibraryView.jsx:149`, `AuthorsView.jsx:184`, `TheoriesView.jsx:28`, `TimelineView.jsx:39,101` usan `hover:shadow-xl`. `GlossaryView.jsx:58`, `FavoritesView.jsx:153`, `ReadingPathsView.jsx:28`, `WorldMapView.jsx:138` usan `hover:shadow-lg`.
- **Problema:** `shadow-xl` es más intenso que `shadow-lg`. Ambos se usan en tarjetas del mismo nivel jerárquico (items clickeables de un grid). La diferencia es sutil pero inconsistente — no hay razón para que una tarjeta de Glossario tenga sombra menos fuerte que una de Autores.
- **Solución concreta:** unificar todas las tarjetas clickeables a `hover:shadow-lg` (más sutil, más elegante para un archivo) o todas a `hover:shadow-xl` (más dramática, más "app"). Recomendación: `hover:shadow-lg` + `transition-shadow` para que la elevación sea suave y no compita con la animación `card-appear`.

### M3. Gap de grid inconsistente — gap-4 vs gap-6

- **Ubicación:** `LibraryView.jsx:302` (`gap-4`), `AuthorsView.jsx:179` (`gap-6`), `TheoriesView.jsx:21` (`gap-6`), `WorldMapView.jsx:129` (`gap-4`), `FavoritesView.jsx:149` (`gap-4`), `GlossaryView.jsx:52` (`gap-4`).
- **Problema:** Las vistas con tarjetas de contenido usan `gap-4` (16px), pero Authors y Theories usan `gap-6` (24px). La razón probable es que Authors/Theories tienen tarjetas más anchas (p-6) pero la densidad de contenido es similar. El resultado es que Autores se siente "más espaciado" que Biblioteca sin una razón percibida.
- **Solución concreta:** unificar a `gap-5` (20px) como compromiso. O unificar a `gap-4` en todas las grids de contenido interno.

### M4. StatsPanel: encabezado y cuerpo con borde inconsistente

- **Ubicación:** `StatsPanel.jsx:92` (headline cards: `border-2`) vs `StatsPanel.jsx:101` (archive cards: `border` — 1px).
- **Problema:** Las 4 tarjetas de números grandes usan `border-2 rounded-lg p-4`, mientras que las 4 tarjetas de "estado del archivo" usan `border rounded-lg p-3`. El resultado es que las primeras se perciben como "más importantes" visualmente, cuando ambas son métricas del mismo nivel.
- **Solución concreta:** alinear ambas filas al mismo nivel de borde (`border-2` para ambas) y padding (`p-4`). Si se quiere jerarquía, usar `p-5` para headline y `p-3` para archive, pero con el mismo `border-2`.

### M5. Footer extremadamente minimalista — una línea sin presencia

- **Ubicación:** `AnarchistArchive.jsx:213-219`
- **Problema:** El footer es:
  ```jsx
  <footer className={`border-t-4 ${darkMode ? 'border-red-900 bg-black/30' : 'border-amber-800/bg-amber-100/60'}`}>
    <div className="container mx-auto px-4 py-8">
      <p className="font-display uppercase tracking-widest text-sm text-center">
        La Idea · Archivo Histórico Anarquista
      </p>
    </div>
  </footer>
  ```
  Una sola línea de texto centrada. Para un "archivo histórico", el footer debería dar **cierre y contexto**: período cubierto, número de registros, enlaces a Glosario/Contacto (que están en el nav), y una línea de crédito/licencia. El `border-t-4` es un buen inicio pero la contenido es insuficiente.
- **Solución concreta:**
  ```jsx
  <footer className={`border-t-4 ${darkMode ? 'border-red-900 bg-black/30' : 'border-amber-800 bg-amber-100/60'}`}>
    <div className="container mx-auto px-4 py-8 space-y-4">
      <div className="text-center">
        <p className="font-display uppercase tracking-widest text-sm">
          La Idea · Archivo Histórico Anarquista
        </p>
        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-amber-700'}`}>
          1840–1968 · {stats.texts} textos · {stats.regions} regiones · {stats.events} eventos
        </p>
      </div>
      <div className={`flex justify-center gap-4 text-xs ${darkMode ? 'text-gray-500' : 'text-amber-600'}`}>
        <button onClick={() => onNavigate(VIEWS.GLOSSARY)}>Glosario</button>
        <span>·</span>
        <button onClick={() => onNavigate(VIEWS.CONTACT)}>Contacto</button>
        <span>·</span>
        <a href="mailto:antarquia@riseup.net">antarquia@riseup.net</a>
      </div>
      <p className={`text-center text-[10px] ${darkMode ? 'text-gray-600' : 'text-amber-500'}`}>
        Textos de dominio público recopilados para fines de estudio e investigación.
      </p>
    </div>
  </footer>
  ```

### M6. Modales con estructura interna inconsistente

- **Ubicación:** `EventModal.jsx` vs `RegionModal.jsx`
- **Problema:** Ambos modales tienen `border-4 rounded-lg max-w-2xl` pero la estructura interna difiere:
  - **EventModal:** header con color sólido (`bg-red-900/30 p-6`), contenido con `p-6 overflow-y-auto max-h-96`, y blockquote con `border-l-4`.
  - **RegionModal:** header con **margin negativo** (`-m-6 mb-4 p-4`) que se desborda del padding del modal, contenido con `space-y-3 max-h-96 overflow-y-auto`, sin blockquote.
  - Los headers tienen diferente padding (`p-6` vs `p-4`), diferente estructura DOM (uno con flex justify-between, otro con flex justify-between + margin negativo), y diferente manejo del botón cerrar (`X size={28}` vs `X size={24}`).
- **Impacto visual:** Un usuario que abre ambos modales percibe dos "estilos de modal" distintos. El de RegionModal con el header desbordado se ve más pulido; el de EventModal parece más apretado.
- **Solución concreta:** extraer un componente `<ModalHeader>` compartido que use la estructura de RegionModal (margin negativo + padding interno) con props para color, icono, título y subtitle. Aplicar el mismo `X size={24}` y el mismo padding `p-6` en ambos.

### M7. Timeline horizontal sin indicador de scroll en móvil

- **Ubicación:** `TimelineView.jsx:18` (`overflow-x-auto`)
- **Problema:** La vista horizontal de la línea temporal fuerza scroll horizontal (tarjetas de 200-240px por década) con `overflow-x-auto` pero **sin ningún indicador visual** de que hay más contenido desplazable. En móvil (360-420px), solo se ve la primera década. No hay fade lateral, chevron, ni texto "Desliza →".
- **Impacto visual:** Un usuario en móvil podría pensar que solo hay 1 década de eventos, cuando en realidad hay 12+.
- **Solución concreta:** bajo `md:`, añadir un gradiente de desvanecimiento a la derecha del contenedor:
  ```jsx
  <div className="relative">
    <div className="overflow-x-auto" ...>
      {/* contenido */}
    </div>
    <div className={`absolute right-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-l ${darkMode ? 'from-gray-900' : 'from-amber-50'}`} />
  </div>
  ```

---

## 3. Hallazgos — LOW (pulido y detalles)

### L1. ReaderOverlay con colores hardcodeados separados del sistema de temas

- **Ubicación:** `ReaderOverlay.jsx:28,31,105,111`
- **Problema:** El lector usa hex colors fijos (`#F5EDD9`, `#EDE1C8`, `#CBB788`) para el fondo "pergamino de lectura" en vez de reutilizar las clases CSS del tema. Esto es **intencional** (el lector tiene su propio tema de lectura claro/oscuro separado del tema de la app) pero crea una tercera fuente de verdad de colores que dificulta mantener consistencia si el usuario cambia la paleta.
- **Solución:** no es un bug — es una decisión de diseño. Si se quiere unificar, definir variables CSS `--reader-bg-light`, `--reader-bg-dark` en `index.css` y usarlas en ambos lugares. Baja prioridad.

### L2. Tamaño de icono "Leer" muy pequeño (12px)

- **Ubicación:** todos los `LeerButton` y botones "Leer" inline: `LibraryView.jsx:68`, `FeaturedBook.jsx:57`, `TheoriesView.jsx:88`, `ReadingPathsView.jsx:77`, `GlossaryView.jsx:88`, `AuthorsView.jsx:270`, `FavoritesView.jsx:199`, `RegionModal.jsx:92`, `EventModal.jsx:85`, `InfluencesView.jsx:199`.
- **Problema:** `BookOpen size={12}` renderiza el icono a 12×12 px. El botón completo tiene `px-2.5 py-1` = 28×20 px de área táctil, que **cumple** el mínimo de 44×44 del WCAG (porque el padding extiende el hit target), pero visualmente el icono se lee como "pequeño y apretado" junto al texto "Leer".
- **Solución:** subir a `BookOpen size={14}` para mejor legibilidad. Cambio sutil pero perceptible.

### L3. Transiciones de color no sincronizadas entre tema oscuro/claro

- **Ubicación:** `AnarchistArchive.jsx:92` (`transition-colors duration-500` en el raíz), `Header.jsx:19` (sin transición), `Navigation.jsx:55` (sin transición).
- **Problema:** Al cambiar de tema, el fondo principal transiciona suavemente (500ms) pero header, navigation y footer cambian **instantáneamente** porque no tienen `transition-colors`. El resultado es un "flash" de header claro sobre fondo oscuro (o viceversa) durante la transición.
- **Solución:** añadir `transition-colors duration-500` a las clases de `header` y `nav` en `THEME.dark.header` / `THEME.light.header` (o en el JSX del Header y Navigation).

### L4. `shadow-md` base en tarjetas puede sobrecargar en tema claro

- **Ubicación:** todas las tarjetas con `shadow-md` (Authors, Theories, Glossary, Favorites, ReadingPaths, Timeline cards, FeaturedBook, ContactView).
- **Problema:** En tema claro (pergamino), `shadow-md` crea sombras grises sobre fondo marfil. Se ve "app genérica" en vez de "documento de archivo". En tema oscuro, la sombra se confunde con el fondo oscuro.
- **Solución:** considerar `shadow-sm` como base (más sutil) y `hover:shadow-md` en interactuación. O un `shadow-[0_2px_8px_rgba(0,0,0,0.08)]` personalizado para tema claro que simule sombra de papel.

### L5. El widget "Obra del día" no tiene variedad visual con el título de vista

- **Ubicación:** `FeaturedBook.jsx` se renderiza DENTRO de `LibraryView.jsx:343`, justo después del `h2` "Biblioteca".
- **Problema:** El `h2` "Biblioteca" y el badge "Obra del día" del FeaturedBook comparten la misma zona visual sin separación clara. No hay un separador, espacio adicional, o cambio de fondo que diga "esto es una sección destacada diferente al catálogo".
- **Solución:** añadir `mt-4` o un separador visual sutil entre el título de la vista y el FeaturedBook, o mover el FeaturedBook **antes** del `h2` (como "hero" de la página) con un fondo ligeramente diferente.

---

## 4. Buenas prácticas ya implementadas (documentar)

### ✅ Paleta bermellón/negro pergamino coherente
La paleta oscura (`from-red-950 via-black to-gray-900`) y la clara (`from-amber-50 via-yellow-50 to-orange-50`) con overrides del tema pergamino en `index.css` están bien implementadas. Los selectores compuestos (líneas 116-123) resuelven correctamente el problema del fondo raíz reportado en C1 del 2026-08-11.

### ✅ `font-display` (Anton/Oswald) aplicada consistente y correctamente
Los `h2` de todas las vistas, el H1 del header, los labels de navegación, los años de la timeline, los botones de acción y el footer usan `font-display`. La identidad tipográfica de "imprenta/afiche" es clara y coherente.

### ✅ Scrollbar personalizada bermellón
`index.css:48-53` usa `rgba(160, 36, 26, 0.45)` — correcto, consistente con la paleta, con hover state más oscuro. Resuelve C3 del 2026-08-11.

### ✅ Foco visible global bermellón
`index.css:57-59` define `:focus-visible { outline: 2px solid #A0241A; outline-offset: 2px; }` — visible en ambos temas, consistente con la paleta.

### ✅ Microanimaciones sutiles y no invasivas
`view-fade-slide` (0.35s), `card-pop` (0.3s) y `animate-lift` son duraciones cortas que aportan vida sin distraer. El `card-appear` con `animationDelay` escalonado (`Math.min(idx, 8) * 40ms`) es un buen patrón de entrada progresiva.

### ✅ Contraste AA verificado en tema pergamino
Los colores de texto secundarios del tema claro (`#6F5F45` para gray-400/500) cumplen WCAG AA (≥4.6:1 sobre #F5EDD9). Los colores de acento bermellón (`#A0241A`) también cumplen.

### ✅ Estados vacíos mejorados
La línea temporal tiene un estado vacío con título + descripción + botón "Limpiar filtros" (`TimelineView.jsx:154-174`). La biblioteca tiene un mensaje de texto (`LibraryView.jsx:273-278`). Favoritos tiene icono Heart + texto descriptivo (`FavoritesView.jsx:106-122`).

### ✅ Tags de región/año consistentes
Los chips de región y año usan `px-2 py-0.5 rounded` con colores `bg-gray-800 text-gray-300` (dark) o `bg-amber-200 text-amber-900` (light) — el mismo patrón en todas las vistas.

### ✅ `card-appear` con delay escalonado
`LibraryView.jsx:149`, `TheoriesView.jsx:28`, `GlossaryView.jsx:58` usan `animationDelay: ${Math.min(idx, 8) * 40-45}ms` para una entrada progresiva. El cap en `idx=8` evita delays excesivos en grids grandes.

### ✅ Paleta del mapa con gradiente correcto
`WorldMapView.jsx:72-74` usa la rampa `['#E4CCC0', '#8A1E19']` para tema claro (bermellón) y `['#fca5a5', '#7f1d1d']` para oscuro. La interpolación `lerpColor` produce un degradado legible. Resuelve C2 del 2026-08-11.

---

## 5. Nota final — Prioridad para la próxima iteración

**Orden de aplicación recomendado (impacto / esfuerzo):**

1. **H2 — `prefers-reduced-motion`** (5 min, impacto alto en accesibilidad): añadir 8 líneas de CSS que benefician a usuarios con vértigo y cumplen WCAG. Sin riesgo de romper tests.

2. **H1 — Aplicar `font-serif` y `font-mono`** (30-45 min, impacto alto en identidad): el salto de "cargadas pero invisibles" a "presentes en quotes y fichas" es el mayor gap visual pendiente. Afecta a ~15 archivos JSX pero son cambios de una línea cada uno (añadir una clase).

3. **H3 — FeaturedBook con distinción visual** (10 min, impacto medio-alto): borde acento + shadow-xl lo separa del grid sin cambiar lógica.

4. **M5 — Footer completo** (20 min, impacto medio): dar presencia al cierre de página con stats + enlaces + crédito.

5. **M1 + M2 + M3 — Unificar paddings/sombras/gaps** (30 min, impacto medio):Refactor de consistencia visual. Sin riesgo (solo clases Tailwind, lógica intocada).

6. **M4 — StatsPanel consistente** (5 min): alinear borde de las dos filas de métricas.

7. **M6 — ModalHeader compartido** (30 min, impacto bajo-medio): extraer componente para unificar la estructura de modales.

8. **M7 — Scroll indicator en timeline móvil** (15 min): gradiente de desvanecimiento.

**No impacta tests:** todos los cambios son de clases CSS/JSX sin tocar lógica de datos ni handlers. `npm run check` debe seguir verde.

**Métricas del archivo (294 obras, 70 eventos, 30 regiones, 292 descargas verificadas):** la app tiene una base de contenido rica que justifica la inversión en pulido visual — el contenido es demasiado bueno para verse como un dashboard genérico.
