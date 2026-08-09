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

---

## Estado actual

- **15 commits** en `main`, CI de Pages **verde**, web **HTTP 200**.
- **Catálogo**: 65 obras · 59 con PDF descargable · 11 regiones.
- **Infraestructura**: contenedor `pdf-server` (:8081) activo, cron 12:00 activo, persistencia con Linger + `podman-restart.service`.
- **Estructura de datos**: `src/data/` (eventos, autores, textos por región) + `public/documents/documents.json`.

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
