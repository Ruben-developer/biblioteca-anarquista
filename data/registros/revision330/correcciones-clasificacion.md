# Correcciones de clasificación — lotes 1748 (auditoría 2026-09-01)

> Revisión de la clasificación del lote-00 pegada por el usuario (AI local).
> Veredicto: calidad alta, coherente con el canon (cartas→ACRATAS, poesía/teatro/novela/cuentos/catálogos→OTROS, movimiento→HISTORIA, ensayos/panfletos→TEORIA, volúmenes separados). Se corrigen los puntos abajo.

> Estado 2026-09-01 (apllicado): se actualizaron las listas → **faltan-1737.txt**, lotes **600/600/537**.
> - 4 salieron a ya-subidos por estar ya publicados (Bayer expropiadores, Severino Di Giovanni ×2, Páginas selectas).
> - 7 duplicados fuzzy colapsados (detalle en §3).
> - 11 = 1748−1737. El patch a la clasificación en sí (fuerza OTROS/corrección de categorías) queda listo para aplicarse cuando el output clasificado se guarde en disco.

## 1. Fuerza a OTROS — excluidos del canon (excluidos.md)
Estos NO entran a historia/teoria/acratas. El modelo los marcó HISTORIA/ACRATAS:
- `Anderson - Bajo tres banderas` → OTROS (excluido: ensayo académico)
- `Anonimx - La VOP... guerrilla` → OTROS (excluido: marxista-guevarista)
- `Anonimx - Fuego a la polvora. Guerra y guerrilla en Irak` → OTROS (excluido: guerrilla no libertaria)
- `Anónimx - Historia de la antipsiquiatria` → OTROS (excluido: ámbito clínico)
- `Cappelletti - Pierre Clastres. La sociedad contra el Estado` → OTROS (excluido: teoría antropológica)

Referencia completa de excluidos: `excluidos.md` (8 títulos; Marighella, Iron Mountain y libro rojo ya correctos en OTROS).

## 2. Discordancia con catálogo publicado (regionData.js)
- `Bayer - Los anarquistas expropiadores, Simon Radowitzky...` → **historia** (ya publicada en regionData.js L20; PDF ya en pdfs-local). Además NO debe estar en faltan-1748: el PDF ya existe localmente (`Osvaldo Bayer - Los anarquistas expropiadores (2013).pdf`) → mover a ya-subidos.
- `'Páginas selectas' de Rocker, Nettlau y Abad de Santillán` → NO debe estar en faltan-1748: ya publicada (regionData.js L197) y PDF local (`... Paginas selectas (1970).pdf`) → ya-subidos.

## 3. Duplicados que el dedup exacto no atrapó (2º pase fuzzy, umbral ≥0.85 → 7)
Colapsar a UNO (mantener la entrada sin `[ed. variante]`/con mejor puntuación):
1. `Fabbri, Luce - Carácter ético del anarquismo` = `Fabbri, Luce - El carácter ético del anarquismo` (lote-00)
2. `Fabbri, Luce - El fascismo, definición e Historia` = `Fabbri, Luce - Fascismo, definición e Historia` (lote-00)
3. `Faure, Sébastien - 12 pruebas de la inexistencia de Dios` = `Las 12 pruebas...` (lote-00)
4. `Goldman, Emma - Filosofía del ateísmo` = `La filosofía del ateísmo` (lote-01)
5. `González Prada, Manuel - Anarquía` = `La Anarquía` (lote-01)
6. `Lorenzo, Anselmo - Criterio Libertario` = `El criterio libertario` (lote-01)
7. `Mella Cea, Ricardo - La nueva Utopía` = `Nueva Utopía` (lote-02)

## 4. Categorías dudosas (discutibles — revisar con usuario antes de aplicar)
- `CNT-FAI - Manual del militante (1937)` → OTROS (yo: TEORIA, documento orgánico)
- `Bonanno - Errico Malatesta y la violencia revolucionaria` → ACRATAS (yo: TEORIA, ensayo)
- `Baginski - Stirner. El único y su propiedad` → ACRATAS (yo: TEORIA, estudio)
- `Bakunin básico` → ACRATAS (yo: TEORIA, intro al pensamiento)
- `Berkman - El mito bolchevique` → HISTORIA (aceptable; podría ser TEORIA)
- `Avilés y Morán - ¿Ha vuelto Mateo Morral?` → ACRATAS (yo: TEORIA)