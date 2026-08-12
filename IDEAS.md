# Ideas de secciones para el Archivo Histórico Anarquista

> Backlog de posibles secciones para la web, sin priorizar ni implementar aún.
> Guardado el 2026-08-09. Implementadas: **Biblioteca** (catálogo con filtros) y
> **Lector embebido** (PDF/TXT sin salir de la web).

## 2. Obra destacada del día
- Selección aleatoria diaria de una obra del archivo (portada, reseña y botón de lectura).
- En línea con el backlog de PLAN.md ("obra destacada aleatoria del día").

## 4. Glosario / Diccionario libertario
- Términos clave (anarquismo, mutualismo, sindicalismo, insurrección, colectivización, etc.)
  con definición y enlaces a obras que los tratan.

## 5. Cronología ampliada
- Ampliar el timeline más allá de 1968 hasta la actualidad, con eventos organizativos
  e históricos recientes.

## 6. Red de influencias
- Visualización en grafo de las conexiones entre autores y obras (quién influyó a quién).

## 7. Citas destacadas
- Colección de frases memorables con autor y obra de origen; seleccionables y
  compartibles (añadir a favoritos).

## 8. Estadísticas del archivo
- Panel con métricas: obras por región/década/categoría, rankings de autores y obras
  mejor valoradas, evolución histórica. (Hay un StatsPanel incipiente en el header.)

## 9. Prensa / Periódicos históricos
- Sección con publicaciones anarquistas (Le Libertaire, Tierra y Libertad,
  Solidaridad Obrera, etc.) con textos e historia de cada cabecera.

## 10. Recursos pedagógicos
- Guías de lectura por temática, cronologías imprimibles y material de estudio
  (al hilo de la Escuela Moderna de Ferrer i Guardia).

## Otros pendientes (de PLAN.md, relacionados)
- Export a TXT/EPUB además de PDF (el botón Descargar ya existe).
- Importar textos propios del servidor (401 PDFs + 125 docx) con `@content-importer`.

## Mejoras de herramientas y procesos (anotadas 2026-08-12)
- **PDFs sin backup**: `pdfs-local/` (665 MB, gitignored) es el único activo
  irrecuperable y no tiene cron de respaldo. Proponer `restic` o `rsync` a
  disco externo/NAS, diario.
- **Check de producción de `VITE_PDF_BASE`**: curl a la URL pública desde CI/cron
  y notificar a Telegram si el PDF base deja de responder (reutilizar
  `notify_downloads.sh`).
- **Actualizar Vite** (4.3 → 6/7): resolver la vulnerabilidad de esbuild que el CI
  marca como informativa. Deuda técnica real, planificar en PLAN.md.
- **Pre-commit/pre-push hooks**: `lint-staged` en pre-commit; `pre-push` con
  `npm run check` como red de seguridad del `@daily-dev`.
- **SonarQube en CI**: job con `sonar-scanner` y el gate propio (no manual),
  para que el pipeline falle si cae la cobertura.
- **Métricas por script**: computar `registro.json` desde `regionData.js` real
  (contadores, commits, cobertura) en vez de que el agente los rellene a mano.
- **`ARCHITECTURE.md`**: documentar capas + regla de fuente única para humanos
  y agentes nuevos (AGENTS.md ya cubre convenciones).
- **CI que valide `worldmap.geo.json`**: regenerar/verificar en el pipeline para
  evitar divergencias silenciosas.

## Fixes de negocio pendientes
- **Orden de países en el menú del mapa**: `WorldMapView.jsx:130` usa
  `Object.entries(regionData)` → orden de inserción en regionData.js (España,
  Francia, …) en vez de ordenarse por nº de textos históricos (desc). Ordenar
  por `getHistoricalBooks(regionData, region).length` desc.
- **Rating hardcodeado**: los 118 libros llevan `rating` fijo (ej. 4.8) sin
  origen real. Quitar de la UI y guardar la idea de "valoración puntuable" aquí.
- **6 libros sin `filename`** (En el café de Malatesta, Mártires de Chicago,
  Regeneración, Tierra y Libertad, Severino Di Giovanni, Luis E. Recabarren):
  aparecen en la Biblioteca pero no tienen PDF/TXT → no se pueden leer.
