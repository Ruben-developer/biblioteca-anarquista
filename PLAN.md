# Biblioteca Anarquista Digital

> Fecha inicio: 2026-08-07
> Estado: ACTIVA — mejora diaria autónoma (agente `daily-dev`, cron 12:00)
> Stack: React + Vite + TypeScript + GitHub Pages

---

## 1. Objetivo

Biblioteca virtual de textos y obras del anarquismo: catálogo navegable con
búsqueda, fichas por autor/tema/tags, modo lectura y métricas de crecimiento.
La biblioteca crece y mejora **cada día de forma autónoma**: el agente añade
obras, mejora la lógica (búsqueda, filtros, lector) y registra métricas.

## 2. Estructura del repo

```
PLAN.md                  → este plan (tareas, ideas, roadmap, próximo día)
data/catalogo/*.json     → obras (una por archivo: título, autor, año, tags, contenido)
data/registros/registro.json → métricas estructuradas día a día
data/registros/*.md      → logs narrativos diarios (.daily-runs/ o aquí)
src/                     → app React (catálogo, búsqueda, lector)
.github/workflows/pages.yml → build + deploy a GitHub Pages
```

## 3. Modelo de datos (obra)

Cada obra en `data/catalogo/<slug>.json`:

```json
{
  "slug": "la-conquista-del-pan",
  "titulo": "La conquista del pan",
  "autor": "Piotr Kropotkin",
  "anio": 1892,
  "temas": ["comunismo", "economia", "mutualismo"],
  "tags": ["clasico", "ensayo"],
  "descripcion": "Síntesis de la propuesta económica del comunismo anarquista.",
  "contenido": "Texto completo o extracto en Markdown..."
}
```

## 4. Roadmap (el agente lo va tachando)

### FASE 1 — Base funcional
- [ ] Catálogo: listar obras (título, autor, año, temas).
- [ ] Búsqueda por texto (título, autor, tags).
- [ ] Filtro por tema.
- [ ] Modo lectura (vista de detalle de la obra).
- [ ] Deploy a GitHub Pages con workflow.
- [ ] Registrar métricas diarias en `registro.json`.

### FASE 2 — Contenido y lógica
- [x] Añadir primeras obras (clásicos: Kropotkin, Bakunin, Goldman, Malatesta). ✅ (2026-08-08)
- [ ] Página de autor (agrupar obras por autor).
- [ ] Contador de palabras y tiempo de lectura por obra.
- [ ] Búsqueda dentro del contenido.
- [ ] Dashboard de métricas de la biblioteca.

### FASE 3 — Lectura enriquecida
- [ ] Temas del día / obra destacada aleatoria.
- [ ] Referencias cruzadas entre obras.
- [ ] Línea de tiempo histórica de autores/obras.
- [ ] Modo lectura (nocturno, tamaño de letra).

## 5. Reglas del agente (resumen)
- Trabaja SOLO en este repo, nunca en `devops-lab`.
- Cada día: elegir tarea de PLAN.md (o inventar idea razonable si no hay), implementar, build/test, commit, push, esperar CI, actualizar PLAN.md, registrar métricas en `registro.json` y log en `.daily-runs/`.
- No romper: cada cambio debe dejar build y CI verdes.
- No subir secretos ni dependencias de más (respetar package-lock).

## 5.1 Ideas de mejora del usuario (backlog, se van priorizando)
- [ ] **Estética**: iterar paleta de colores y tipografía (usar variables CSS ya separadas). Puesta a punto visual en general.
- [ ] **Línea de tiempo** de autores y obras (ordenado por año).
- [ ] **Agrupar por país** (campo `pais` en cada obra; lista primero, mapa después).
- [ ] **Agente revisor UX/UI**: subagente que critique el diseño y pase notas al agente principal.
- [ ] **Importar textos propios del servidor** a `data/catalogo/*.json` (ruta pendiente de confirmar con el usuario).
- [ ] **Descargar textos de dominio público** de fuentes fiables (The Anarchist Library, Marxists.org, etc.) cuando el usuario indique las URLs.
- [ ] **Descarga desde la página**: botón para descargar la obra en PDF/TXT/EPUB.

## 6. Próximo día
- [ ] FASE 1/2: terminar página de autor, contador de palabras, búsqueda dentro del contenido, dashboard de métricas.
- [ ] Ampliar catálogo con más obras (Rocker, Bookchin, Proudhon, etc.).
- [ ] (Ideas de mejora en evaluación) Línea de tiempo, mapa de obras por país, paleta de colores, más agentes expertos.
