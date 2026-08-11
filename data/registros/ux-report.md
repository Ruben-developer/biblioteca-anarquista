# Reporte UX/UI — Biblioteca Anarquista (Archivo Histórico Anarquista)

> **Fecha y hora:** 2026-08-11 15:11 (UTC-4)
> **Revisor:** `@ux-review`
> **Alcance:** `src/components/*`, `src/index.css`, `src/constants/index.js`, `index.html`, `tailwind.config.js`
> **Verificación:** build de producción OK (`vite build`, 1398 módulos) + análisis del CSS generado en `dist/` + revisión estática de todos los componentes.

---

## 0. Resumen ejecutivo

La base funcional es sólida (112 obras, mapa propio d3-geo, 154 tests, CI verde). El problema no es de contenido sino de **"piel de plantilla"**: la app se lee como un dashboard genérico con una paleta parcialmente aplicada. Verifiqué tres cosas graves que lo demuestran:

1. **El pergamino no llega al fondo de la página** (bug real de CSS): el selector de `index.css` usa un combinatorio de descendiente y la clase del tema vive en el MISMO elemento que las clases de fondo, así que el degradado raíz sigue siendo el amarillo de Tailwind (`#fffbeb → #fefce8 → #fff7ed`).
2. **Quedan residuos de ámbar/amarillo** en el tema claro (países del mapa, leyenda, marco, placeholder de búsqueda) exactamente donde el usuario pidió bermellón.
3. **Elementos de plantilla sin teñir**: scrollbar **púrpura** (`rgba(155,89,182,…)`), emojis genéricos, tipografías de sistema, sin footer.

El reporte entrega hallazgos por severidad con valores exactos, un plan tipográfico completo y cierra con las 5 acciones de máximo impacto.

---

## 1. Hallazgos — SEVERIDAD CRÍTICA

### C1. El fondo del tema pergamino NO se aplica a la página (sigue el amarillo de Tailwind)
- **Ubicación:** `src/components/AnarchistArchive.jsx:64-69` + `src/index.css:236-238` y `93-98`.
- **Problema:** La raíz renderiza
  ```jsx
  <div className={`min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 text-gray-800 … theme-constructivista theme-pergamino`}>
  ```
  y el override del tema es `.theme-constructivista.theme-pergamino .bg-gradient-to-br.from-amber-50.via-yellow-50.to-orange-50` (con **espacio** = combinatorio descendiente). Un elemento no es descendiente de sí mismo, así que la regla **no matchea la raíz**: el fondo visible sigue siendo el degradado por defecto de Tailwind (`amber-50 #fffbeb → yellow-50 #fefce8 → orange-50 #fff7ed`), que es **amarillento**. Lo confirmé en el CSS compilado (`dist/`): no existe ninguna regla sin espacio (`.theme-constructivista.bg-gradient…`).
- **Impacto:** La premisa central del tema ("fondo marfil→tan, sin amarillo") está rota en el elemento más visible de la web. Afecta también al modo oscuro (`index.css:93-95`) y al `text-gray-800` heredado de la raíz.
- **Solución concreta:**
  1. Duplicar las 3-4 reglas que apuntan a la raíz con selector compuesto (sin espacio): `.theme-constructivista.theme-pergamino.bg-gradient-to-br.from-amber-50.via-yellow-50.to-orange-50` (y equivalente para `from-red-950.via-black.to-gray-900` y `text-gray-800`).
  2. Alternativa más robusta (recomendada): aplicar los colores de fondo a `body` desde CSS cuando `.theme-pergamino` esté presente, y dejar la raíz con `bg-transparent`:
     ```css
     .theme-constructivista.theme-pergamino { background-image: linear-gradient(135deg,#F5EDD9 0%,#F0E3C9 45%,#E2D0A9 75%,#D6BF8F 100%); }
     ```
     y quitar `bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50` del `bgClass`.

---

### C2. Residuos de ámbar/amarillo en el tema claro (mapa, leyenda, placeholder, bordes)
- **Ubicación:** `src/components/WorldMapView.jsx:67-75, 99-100, 109-117`; `src/components/LibraryView.jsx:51`; `src/constants/index.js:49-51`.
- **Problema:** En tema claro (pergamino) siguen visibles colores ámbar Tailwind que contradicen la paleta bermellón:
  - Países del mapa: `['#fde68a', '#92400e']` (ámbar-200 → ámbar-800, amarillento).
  - Marco y borde del mapa: `frameColor/borderColor = '#b45309'` (ámbar-700).
  - Leyenda: `linear-gradient(to right, #fde68a, #92400e)`.
  - Placeholder de búsqueda: `placeholder-amber-400` = `#fbbf24` (amarillo puro, sin override en `index.css`).
  - Bordes de header/nav claros: `border-amber-800/30` y `border-amber-800/20` (sin override en el tema).
- **Solución concreta:**
  - `WorldMapView.jsx`: en tema claro usar la rampa rojo bermellón: `['#E4CCC0', '#8A1E19']` (ya definida en `index.css:290-305`); `frameColor/borderColor = '#A0241A'`; leyenda `linear-gradient(to right, #E4CCC0, #8A1E19)`.
  - `LibraryView.jsx:51`: cambiar `placeholder-amber-400` por `placeholder-amber-700` (→ `#A3201A`) o añadir en `index.css` un override `.theme-constructivista .placeholder-amber-400::placeholder { color: #8A6336; }`.
  - `constants/index.js`: añadir overrides para `border-amber-800/30` y `border-amber-800/20` en el bloque constructivista (→ `rgba(160,36,26,0.35)` y `rgba(160,36,26,0.25)`).

---

### C3. Scrollbar púrpura de plantilla
- **Ubicación:** `src/index.css:39-46`.
- **Problema:** `::-webkit-scrollbar-thumb { background: rgba(155, 89, 182, 0.5) }` — púrpura de un template genérico, totalmente fuera de la paleta (y visible en toda la app al hacer scroll vertical).
- **Solución concreta:** sustituir por tono del tema:
  ```css
  ::-webkit-scrollbar-thumb { background: rgba(160, 36, 26, 0.45); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(160, 36, 26, 0.65); }
  ```
  (rojo bermellón semitransparente sobre pergamino; en dark podría alternarse a `rgba(208,44,38,.5)`).

---

### C4. Línea temporal sin estado vacío (búsqueda sin resultados = contenedor mudo)
- **Ubicación:** `src/components/TimelineView.jsx:13-14` + `src/components/TimelineFilters.jsx:136-138`.
- **Problema:** Cuando `filteredEvents.length === 0`, `minWidth` se calcula como `0 * 380 = 0` y el panel renderiza un contenedor vacío con una franja de gradiente y **cero mensajes**: solo queda el contador "Mostrando 0 de 16 eventos" arriba. El usuario no recibe feedback visual de por qué no hay nada.
- **Solución concreta:** en `TimelineView.jsx`, antes de renderizar el contenedor, añadir:
  ```jsx
  {filteredEvents.length === 0 ? (
    <div className="p-12 text-center …">
      <p className="text-xl …">No hay eventos que coincidan con los filtros</p>
      <button onClick={onClearFilters} className="…">Limpiar filtros</button>
    </div>
  ) : ( …el contenedor actual… )}
  ```
  pasando `onClearFilters` como prop desde `AnarchistArchive.jsx:103-107` (ya existe `clearFilters`).

---

## 2. Hallazgos — MEJORA

### M1. Tipografía de sistema: falta identidad de archivo/imprenta
- **Ubicación:** `src/index.css:16-22` (stack de sistema), `src/components/Header.jsx:21` (`fontFamily: 'Georgia, serif'` inline).
- **Problema:** Todo el texto usa el stack genérico de navegador; el único intento de carácter es un `Georgia` inline en el H1. Es el mayor responsable de la sensación de "web con plantilla".
- **Plan tipográfico concreto** (ver §3 más abajo): Google Fonts + `tailwind.config.js` → `font-display`, `font-serif`, `font-sans`, `font-mono`; aplicar `font-display` a títulos/nav/años, `font-serif` a citas, `font-sans` a cuerpo y `font-mono` a las "fichas" (chips de categoría/región).

---

### M2. Modales sin gestión de foco (teclado roto al abrir)
- **Ubicación:** `src/components/EventModal.jsx:14-26`, `RegionModal.jsx:23-35`, `TourModal.jsx:16-28`.
- **Problema:** Los tres modales tienen `role="dialog" aria-modal="true"` y cierran con Escape, pero:
  - Al abrir no se mueve el foco al modal (el foco sigue en el botón disparador, fuera del overlay) → **Escape no funciona hasta que el usuario clica dentro**.
  - No hay trampa de foco (Tab puede salirse al contenido de atrás).
  - Al cerrar no se restaura el foco al elemento que abrió.
  - El scroll de fondo no se bloquea (`overflow` del body activo).
- **Solución concreta:** usar un helper mínimo (sin librería): al montar, `ref` + `focus()` sobre el panel (o el botón cerrar) con `tabIndex={-1}`; `onKeyDown` con `Tab`/`Shift+Tab` para mantener el foco dentro; al desmontar, restaurar `document.activeElement` anterior y `body.style.overflow = ''`. Un solo hook `useModalFocus(open, onClose)` reutilizable en los tres modales.

---

### M3. Mapa no navegable por teclado
- **Ubicación:** `src/components/WorldMap.jsx:83-95`.
- **Problema:** Los `<path>` de países tienen `aria-label` y `onClick`, pero un `<path>` SVG **no es enfocable**: un usuario de teclado no puede seleccionar ningún país (solo existe el grid de regiones de abajo como alternativa, y es desconocida).
- **Solución concreta:** en `WorldMap.jsx`, sobre los paths con datos añadir `tabIndex={0}`, `role="button"`, `onKeyDown` con `Enter`/`Space` → `onClickFunction(context)`, y estilos `:focus` con `outline` (p. ej. `filter: drop-shadow(0 0 2px #A0241A)`). Si se considera complejo, al menos `focusable` + `tabIndex` sobre los países con `countryValue !== undefined`.

---

### M4. Navegación sin `aria-current` y botones con estados ambiguos
- **Ubicación:** `src/components/Navigation.jsx:26-43`, `src/components/Header.jsx:45-51`, `LibraryView.jsx:133-143`, `RegionModal.jsx:96-105`.
- **Problema:**
  - La pestaña activa se comunica solo por color → añadir `aria-current="page"` al botón activo.
  - El toggle de tema usa emoji `☀️/🌙` sin `aria-pressed` ni label del estado destino → para lector de pantalla es solo "🌙". Usar `aria-label="Activar tema claro"`/`"Activar tema oscuro"` y `aria-pressed={darkMode}`.
  - Los corazones de favorito (LibraryView y RegionModal) tienen `title` pero no `aria-pressed`; añadir `aria-pressed={isFavorite}`.
  - El `<nav>` de `Navigation.jsx` no tiene `aria-label` (hay dos landmarks `nav` en pantalla: navegación y pestañas de filtros).
- **Solución concreta:** añadir los atributos ARIA listados; reemplazar los emojis del header por iconos `lucide-react` (`Sun`/`Moon`, ya disponible en las deps) con `aria-hidden`.

---

### M5. Contraste insuficiente en la paleta pergamino
- **Ubicación:** `src/index.css:286-289` (`.text-gray-400/500 → #98896B`), `LibraryView.jsx:51` (placeholder).
- **Problema (medido):** sobre el fondo marfil `#F5EDD9`:
  - `#98896B` (gris 400/500 del tema) → **2.94:1 — FALLA AA** (normal y grande).
  - `#8A6336` (ámbar 600/700) → 4.59:1 (pasa AA por 0.09 — al límite en texto de 12px).
  - `#77684C` (gris 600/700) → 4.65:1 (al límite).
  - Correctos: tinta `#33291A` → 12.2:1; bermellón `#A0241A` → 6.5:1; botón `#8A1E19` + marfil → 7.9:1.
- **Solución concreta:**
  - Oscurecer el gris secundario del tema a `#6F5F45` (≥4.6:1) o mejor a `#5F5238` (≈5.6:1).
  - Oscurecer el ámbar secundario a `#7A5230`.
  - Placeholder: `#8A6336` en lugar de `#fbbf24`.
  - Mantener los tonos de tinta/bermellón actuales (ya cumplen AA).

---

### M6. Dimensiones y composición inconsistentes entre vistas
- **Ubicación:** `LibraryView.jsx:55,123,128` / `AuthorsView.jsx:26,31` / `WorldMapView.jsx:124,129` / `TimelineView.jsx:14-25` / `AnarchistArchive.jsx:90`.
- **Problema:** la rejilla de la app es coherente de fondo pero los detalles delatan plantilla:
  - Paddings de tarjeta: `p-5` (20px) en Biblioteca vs `p-6` (24px) en Autores y Mapa.
  - Gaps de rejilla: `gap-4` (16px) en Biblioteca/Mapa vs `gap-6` (24px) en Autores.
  - Ritmo vertical del `main`: `py-8` (32px) en todas las vistas, sin variación entre secciones.
  - Bloques de cabecera de vista inconsistentes: `h2 mb-2` + subtítulo `mb-6` en Biblioteca/Mapa/Autores vs `h2 mb-6` sin subtítulo en Favoritos.
- **Solución concreta (valores exactos):**
  - Unificar tarjetas en `p-6` (24px) y rejillas en `gap-5` (20px) en las tres vistas.
  - `main`: `py-10 md:py-12` (40/48px) para dar aire de archivo.
  - Cabecera de vista estándar: `h2 text-3xl md:text-4xl font-bold` + `mt-1` línea de separación doble + subtítulo `mb-8`; aplicar el mismo patrón en las 4 vistas.
  - `TimelineView`: tarjeta `p-5 → p-6`, ancho `360 → 380px`, gap `gap-8 → gap-10` (deja respirar la línea).

---

### M7. Responsive: mapa minúsculo en móvil y timeline de scroll infinito
- **Ubicación:** `WorldMapView.jsx:95-105`, `TimelineView.jsx:14`.
- **Problema:**
  - El SVG del mapamundi ocupa `width:100%` (≈360px en móvil) → los 174 países quedan con objetivos de clic de pocos píxeles.
  - La línea temporal fuerza scroll horizontal con tarjetas de 380px **incluso en móvil**, sin indicación de que se puede deslizar.
- **Solución concreta:**
  - Mapa: envolver el `WorldMap` en un contenedor con `overflow-x-auto` y `min-width: 620px` bajo `sm`, de modo que en móvil se deslice el mapa sin encoger los países.
  - Timeline: bajo `md` mostrar el scroll horizontal igual, pero añadir una pista "⟶ Desliza para ver más eventos" (visible solo en móvil), y `scrollbar-width: none` + fade lateral en el contenedor.

---

### M8. Estados vacíos mejorables (Favoritos y Biblioteca)
- **Ubicación:** `FavoritesView.jsx:18-27`, `LibraryView.jsx:118-121`.
- **Problema:** el vacío de Favoritos explica qué hacer pero **no ofrece acción** ("Explora el mapa…" sin botón); el de Biblioteca es un `<p>` plano sin icono ni CTA.
- **Solución concreta:**
  - Favoritos: botón primario "Explorar el mapa" → requiere prop `onNavigate(VIEWS.MAP)` desde `AnarchistArchive.jsx:136-142`.
  - Biblioteca: estado vacío con icono (lucide `BookX` o `SearchX`), texto y botón "Limpiar filtros" (reutilizar `clearFilters`, ya existente).

---

### M9. Falta footer, skip-link y foco visible global
- **Ubicación:** `AnarchistArchive.jsx:68-178`, `index.css` (sin `:focus-visible`), `index.html:10-12`.
- **Problema:**
  - No existe `<footer>`: la página termina en seco tras el contenido.
  - No hay "Saltar al contenido" para teclado (la navegación se repite en las 5 vistas).
  - No hay regla global `:focus-visible`; el único input con foco custom es el de TimelineFilters (`focus:outline-none focus:border-amber-600`, línea 43, que además usa ámbar tenue `#8A6336`).
- **Solución concreta:**
  - Añadir footer con carácter: "Archivo Histórico Anarquista · 1840–1968 · Textos de dominio público" + doble regla superior (ver S4).
  - Añadir `main` con `tabIndex={-1}` y un enlace oculto "Saltar al contenido" antes de `Header`.
  - CSS global: `:focus-visible { outline: 2px solid #A0241A; outline-offset: 2px; }` (bermellón, visible en ambos temas) y en `TimelineFilters` cambiar el foco del input a `focus:border-red-700`.

---

## 3. Plan tipográfico con carácter de archivo/imprenta (dimensiones 3)

Estado actual: `body` usa stack de sistema (`index.css:16-22`) y el único acento es `Georgia` inline en el H1 (`Header.jsx:21`).

### 3.1 Fuentes (Google Fonts)
1. **Cartel condensado — títulos:** `Anton` (400, una sola variante, muy condensada, ideal para wordmark y años) con fallback `Oswald` 600/700 para títulos de sección y navegación. Apariencia de encabezado de imprenta/afiche soviético.
2. **Serif editorial — citas y textos "históricos":** `Playfair Display` 400/600/700 + cursiva para blockquotes, descripciones de eventos y años en modales (estética de periódico antiguo).
3. **Sans racional — cuerpo:** `Source Sans 3` 400/600 (gótica de lectura moderna que no compite con el carácter de los títulos).
4. **Mono de máquina — fichas de archivo:** `IBM Plex Mono` 400/500 para etiquetas pequeñas tipo ficha ("N.º 034", "AÑO 1892", chips de categoría/región).

### 3.2 Implementación
- **`index.html`** (antes del CSS):
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Mono:wght@400;500&family=Oswald:wght@500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
  ```
- **`tailwind.config.js`** → `theme.extend.fontFamily`:
  ```js
  display: ['Anton', 'Oswald', 'Impact', 'sans-serif'],
  serif: ['"Playfair Display"', 'Georgia', 'serif'],
  sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
  mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
  ```
  Y reemplazar el stack de `body` en `index.css:16-22` por `font-family: 'Source Sans 3', system-ui, sans-serif`.

### 3.3 Asignación de fuentes a elementos
| Elemento | Fuente | Clase |
|---|---|---|
| H1 wordmark (Header) | Anton, uppercase, `tracking-tight` | `font-display` (quitar el `Georgia` inline) |
| Pestañas de navegación | Oswald 600, `text-sm uppercase tracking-wider` | `font-display` |
| `h2`/`h3` de vistas | Oswald 600, `uppercase tracking-wide` | `font-display` |
| Años de la línea temporal y modales | Anton (numeral grande de cartel) o Playfair 700 | `font-display` / `font-serif` |
| Blockquote de EventModal | Playfair Display itálica | `font-serif italic` |
| Cuerpo (descripciones, resúmenes, metadatos) | Source Sans 3 | `font-sans` (default) |
| Chips de categoría/región y etiquetas "N.º x" | IBM Plex Mono, `text-[11px] uppercase tracking-wider` | `font-mono` |

---

## 4. Hallazgos — SUGERENCIA (detalles con carácter y microinteracciones)

### S1. Textura de papel sutil
- **Ubicación:** `src/index.css` (regla del fondo raíz, C1).
- **Solución:** superponer sobre el degradado pergamino un ruido fino con `feTurbulence` en data-URI a ~3-4% de opacidad, o un `radial-gradient` de viñeta de 6-8% en las esquinas. Debe ser imperceptible pero romper la planitud de "pantalla".

### S2. Microinteracción de favorito con feedback
- **Ubicación:** `LibraryView.jsx:133-143`, `RegionModal.jsx:96-105`.
- **Solución:** añadir `active:scale-90` y una animación de "pop" (`transition-all duration-150`) al corazón; opcionalmente un mini-toast "Guardado en favoritos" de 2s. Añadir `aria-pressed` (ya pedido en M4). El cambio de estado actual (relleno) es correcto pero se siente estático.

### S3. Separadores y marcos de archivo
- **Ubicación:** cabeceras de vista (`LibraryView.jsx:56-64`, `WorldMapView.jsx:88-93`, `AuthorsView.jsx:20-25`, `FavoritesView.jsx:15`).
- **Solución:** bajo cada `h2`, una doble regla `─── ● ───` (o `border-t-2 border-b border-amber-300`) en lugar de solo `mb`. Los bordes de tarjeta podrían pasar de `border-2` a doble línea (`border-2` + `outline` 1px interior) para imitar marcos de documento.

### S4. Footer de archivo (junto a M9)
- **Ubicación:** `AnarchistArchive.jsx` (después de `</main>`).
- **Solución:** `<footer>` con doble regla superior, "ARCHIVO HISTÓRICO ANARQUISTA · 1840–1968", línea de créditos ("Textos de dominio público. Descargas desde el repositorio interno.") y contador `N.º {stats.texts} registros` — cierra la experiencia de archivo.

### S5. Tratamiento de imágenes y avatares
- **Ubicación:** `AuthorsView.jsx:37` (`👤 text-5xl`), `Header.jsx:23` (`🏴`), `LibraryView.jsx:155` y `RegionModal.jsx:74` (`⭐`), `TimelineView.jsx:21` (emojis de evento), `TourModal.jsx:9-14` (emojis).
- **Solución:** sustituir el avatar `👤` por un **monograma** (iniciales del autor, p. ej. "MA" de Malatesta) en un cuadrado con doble borde y rotación de 1-2º (sello de archivo). Los `⭐` y `📅` de las tarjetas por iconos lucide (`Star`, `Calendar`) ya que están en el bundle. Los emojis de la timeline pueden quedarse (aportan carácter) pero dentro de un medallón con doble borde (ya existe el círculo) y `aria-hidden`. El `🏴` del header se puede sustituir por un `Flag` de lucide o mantener emoji pero escalado con alineación cuidada.

### S6. Tooltip y leyenda del mapa en clave pergamino
- **Ubicación:** `src/index.css:62-85`, `WorldMapView.jsx:107-119`.
- **Solución:** tooltip del mapa con fondo `#1A1818` y texto `#E5DCD0` (ya es aceptable) pero con borde de 1px bermellón y tipografía `font-mono` de 12px (ficha de archivo); la leyenda ya pasa a bermellón con C2.

### S7. Navegación con muesca de afiche
- **Ubicación:** `Navigation.jsx:30-38`.
- **Solución:** en vez de píldora completa activa, mantener el fondo neutro y añadir bajo la pestaña activa un **triángulo/muesca roja** (como en los afiches) o `border-b-2 border-red-700`; refuerza el carácter sin recargar.

### S8. Numeración de fichas en el catálogo
- **Ubicación:** `LibraryView.jsx:128-180`.
- **Solución:** micro-etiqueta mono superior-izquierda `N.º {idx+1:03d}` con el año (`AÑO 1892`) en `font-mono text-[10px] uppercase tracking-widest text-gray-500` → convierte la rejilla en un catálogo.

---

## 5. Nota final — Prioridad para la próxima iteración

**Las 5 mejoras de MÁXIMO impacto, en orden de aplicación:**

1. **C1 — Arreglar el fondo raíz del tema pergamino** (selector compuesto o fondo en el contenedor raíz). Es la base de todo lo visual: sin esto la app "parece amarilla" aunque el resto del tema esté bien.
2. **C2 — Purga de ámbar/amarillo del tema claro** (países del mapa, leyenda, marco, placeholder, bordes del header). Junto a C1 cierra el 80% del "carácter pergamino".
3. **M1 — Plan tipográfico** (Google Fonts: Anton/Oswald + Playfair + Source Sans 3 + IBM Plex Mono y asignación de la §3.3). El salto visual más perceptible a "imprenta/afiche".
4. **C3 + C4 — Scrollbar púrpura → bermellón** y **estado vacío de la línea temporal** (y CTA en Favoritos/Biblioteca). Pequeños, seguros y de gran impacto percibido.
5. **M2 + M3 — Accesibilidad de teclado** (foco de modales + mapa enfocable + `aria-current`/`aria-pressed` + `:focus-visible` global + skip-link). Son los cambios que llevan la web de "bonita" a "profesional y usable".

**Orden de esfuerzo estimado:** C1+C2+C3+C4 ≈ 30-45 min; M1 ≈ 45-60 min; M2+M3+M8+M9 ≈ 1-2 h; el resto (sección 4) puede ir en iteraciones posteriores sin romper tests ni build. Ninguno de estos cambios afecta a la lógica de datos, por lo que `npm run check` (lint + 154 tests + build) debe seguir verde; los tests existentes que buscan cadenas como `☀️` o `⭐` (`Views.test.jsx:53`, `LibraryView.test.jsx:95`) deberán actualizarse al sustituir emojis por iconos.
