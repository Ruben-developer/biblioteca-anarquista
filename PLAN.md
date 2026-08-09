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
- [ ] Ampliar `timelineEvents.js` (más eventos, décadas posteriores a 1968).
- [ ] Ampliar `authors.js` (más pensadores: Rocker, Bookchin, Proudhon...).
- [ ] Enriquecer `documents.json` (más obras con metadatos completos).
- [ ] Añadir lector PDF en la web (no solo descarga).
- [ ] Dashboard de métricas del archivo.

### FASE 3 — Lectura enriquecida
- [ ] Obra destacada aleatoria del día.
- [ ] Referencias cruzadas entre textos y eventos.
- [ ] Mapas visuales por región.
- [ ] Más filtros y búsqueda avanzada.

### FASE 4 — Mapa interactivo mundial por país (alta prioridad)
Objetivo: sustituir el grid de regiones actual (`MapView`) por un **mapamundi
político interactivo**: cada país clickeable, al seleccionarlo se muestra la
lista de textos de ese país (con su modal/descarga actuales).

**Librería recomendada**: `react-svg-worldmap` (v2.x, MIT).
- Por qué: mapa bundled local (funciona en GitHub Pages sin red ni API key),
  API simple (`data`, `onCountryClick`, `color`), usa códigos ISO 3166-1 alpha-2
  (ej. `es`, `fr`, `it`, `ru`), accesible (WCAG 2.2).
- Instalación: `npm i react-svg-worldmap` (React >=16.8 ✓ compatible con React 18).

**Pasos de implementación**:
1. `npm i react-svg-worldmap`.
2. Crear `src/data/countryData.js`: mapear cada región existente → código(s) ISO
   alpha-2. Ej.: España → `es`, Francia → `fr`, Rusia → `ru`, Corea → `kr`, etc.
3. Crear componente `src/components/WorldMapView.jsx`:
   - Usar `WorldMap` con `data` = lista de países con valor (nº de textos o 1).
   - `onCountryClick={({ countryName }) => onSelectCountry(countryName)}`.
   - Colorear países con textos en rojo/negro (paleta del tema) y el resto gris.
   - Tooltip con el nombre del país (nativo del componente).
4. Integrar en `AnarchistArchive.jsx`: nueva vista `VIEWS.WORLDMAP` (o
   reemplazar `VIEWS.MAP`), conectada a `RegionModal` reutilizando la lógica
   actual de selección de región → textos.
5. Sincronizar nombres: `regionData.js` usa "Estados Unidos", "Inglaterra",
   "Corea" pero el mapa devuelve "United States of America", "United Kingdom",
   "South Korea" → crear función normalizadora `normalizeCountryName(name)` en
   `src/utils/` que traduzca los nombres del mapa a las claves de `regionData`.
6. Fallback: si el país no tiene textos, mostrar estado vacío ("Sin textos aún").

**Verificación**: `npm run build` + `npm run lint` (0 errores), probar en
`npm run preview` y en producción tras deploy.

### FASE 5 — Autonomía y agentes
- [x] Agente `daily-dev` (primary) con rutina de 9 pasos + delegación a subagentes.
- [x] Subagente `@ux-review`: revisa UX/UI y entrega `data/registros/ux-report.md`.
- [x] Subagente `@content-importer`: importa obras (PDFs/docx locales) al catálogo con `pdftotext` y verifica HTTP 200.
- [x] Cron 2 veces al día (00:00 y 12:00).
- [ ] Que `daily-dev` invoque a `@ux-review` periódicamente (p. ej. una vez por semana o cuando la tarea lo requiera).
- [ ] Que `daily-dev` use `@content-importer` para seguir ampliando el catálogo hasta agotar los ~400 PDFs disponibles.

### FASE 6 — Calidad y DevOps (DevSecOps parcial)
- [x] Tests unitarios con Vitest (`src/**/*.test.js`, actualmente 12 tests de `filters.js`).
- [x] Comando `npm run check` = lint + test + build (puerta única de calidad).
- [x] `npm run check-downloads`: verifica HTTP 200 de todos los filename del catálogo (59/59 OK).
- [x] CI de Pages ampliado: lint → test → audit → build → deploy.
- [x] Inspección autónoma del agente: `npm audit` + `check-downloads` al inicio de cada turno (paso 1.5).
- [ ] Más tests: añadir cobertura para `documentService.js`, hooks y componentes clave.
- [ ] Conectar SonarQube (ya instalado en `:9000`) para análisis de calidad del frontend (opcional, requiere scanner + token).
- [ ] Cobertura de código (umbral mínimo en CI).

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
- `documentService.js` resuelve `filename` → `http://192.168.1.117:8081/pdfs/<filename>`.
- IP usada porque el hostname `server` solo resuelve a IPv6 (ver §5.1.1).

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
- [ ] **MAPAMUNDI INTERACTIVO (FASE 4, alta prioridad)**: instalar `react-svg-worldmap`, crear `src/data/countryData.js` (región → ISO), componente `WorldMapView.jsx`, conectar a `RegionModal`, normalizar nombres de país → clave de `regionData`, build+lint+deploy.
- [ ] Corregir `REGIONS` en `src/constants/index.js` para incluir las 11 regiones del mapa (fallo detectado en revisión 2026-08-08).
- [ ] Ampliar `regionData.js` enlazando más PDFs reales del contenedor (usar `@content-importer`).
- [ ] Añadir lector PDF embebido (vista de lectura sin salir de la web).
- [ ] (Ideas de mejora en evaluación) Dashboard de métricas, obra del día, más agentes expertos.

### Nota del día (2026-08-08)
Catálogo ampliado de 23 → **65 obras** (59 con PDF descargable verificado HTTP 200) y de 8 → **11 regiones**
(nuevas: Alemania, Inglaterra, Corea). Se añadieron obras de Kropotkin, Bakunin, Proudhon, Reclus,
Stirner, Herbert Read, Emma Goldman, Fabbri, Peirats, entre otras, verificadas con `pdftotext`.
Build, lint y CI de Pages en verde.
