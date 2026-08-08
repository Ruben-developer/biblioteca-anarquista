# Biblioteca Anarquista

Biblioteca virtual de textos y obras del anarquismo. Catálogo navegable con
búsqueda, filtros por tema, fichas de autor y modo lectura.

- **Stack**: React + Vite + TypeScript
- **Deploy**: GitHub Pages → https://ruben-developer.github.io/biblioteca-anarquista/
- **Contenido**: `data/catalogo/*.json` (una obra por archivo)
- **Métricas**: `data/registros/registro.json`
- **Plan y evolución**: `PLAN.md` + `.daily-runs/`

## Desarrollo local

```bash
npm install
npm run dev
```

## Añadir una obra

Crea un archivo en `data/catalogo/<slug>.json` con el esquema de
`la-conquista-del-pan.json` y haz commit. La app la carga automáticamente.
