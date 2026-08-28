# Benchmark de modelos — pipeline de textos "La Idea"

Generado: 2026-08-27 20:54
Modelos locales en Ollama (CPU, sin GPU). Textos en la muestra: 5.

## Tabla A — Rendimiento

| Modelo | Tamaño | Tiempo total | Tiempo/texto (prom) | OK/5 |
|--------|--------|--------------|---------------------|-------|
| hy3-free | hosted | — | — | 5/5 |
| llama3.2:3b | 2.0 GB | 944.7 s | 188931 ms | 5/5 |
| gemma3:4b | 3.3 GB | 975.8 s | 195169 ms | 5/5 |
| qwen3:0.6b | 0.5 GB | 1012.0 s | 202410 ms | 4/5 |

## Tabla B — Clasificación por texto

A=anarquista · ES=español · T=tipo. Por tipo: historia → región/época · teoría → corriente · otro → nota.

### arshinov-historia-del-movimiento-makhnovista

| Modelo | A | ES | T | detalle (región/época · corriente · nota) | título / autor |
|--------|---|----|---|------------------------------------------|------------------|
| gemma3:4b | S | S | teoria | Anarquismo (específicamente, con elementos de anarcosindicalismo y un enfoque en la experiencia directa del movimiento machnovista) | HISTORIA DEL MOVIMIENTO MAKHNOVISTA / Piotr Arshinov |
| hy3-free | S | S | historia | Ucrania · 1918-1921 | Historia del movimiento makhnovista / Piotr Arshinov |
| llama3.2:3b | S | N | historia | Ucrania/Rusia · 1919-1920 | Piotr Arshinov, HISTORIA DEL MOVIMIENTO MAKHNOVISTA / Piotr Arshinov |
| qwen3:0.6b | S | S | historia | Estados Unidos · 1919-1920 | Piotr Arshinov HISTORIA DEL MOVIMIENTO MAKHNOVISTA / Piotr Arshinov |

### dios-y-el-estado

| Modelo | A | ES | T | detalle (región/época · corriente · nota) | título / autor |
|--------|---|----|---|------------------------------------------|------------------|
| gemma3:4b | S | S | teoria | Anarquismo Individualista | Dios y el Estado / Mikhail Alexandrovich Bakunin |
| hy3-free | S | S | teoria | antiautoritarismo / anarquismo colectivista (crítica religión y Estado) | Dios y el Estado / Mikhail Alexandrovich Bakunin |
| llama3.2:3b | S | S | teoria | Anarquismo | Dios y el Estado / Mikhail Bakunin |
| qwen3:0.6b | S | S | historia | Geneva · 1882 | Dios y el Estado / Mikhail Alexandrovich Bakunin |

### el-club-de-la-pelea

| Modelo | A | ES | T | detalle (región/época · corriente · nota) | título / autor |
|--------|---|----|---|------------------------------------------|------------------|
| gemma3:4b | S | N | teoria | Anarcocapitalismo (implícito), Nihilismo, Anarquía | El Club de la Lucha / Chuck Palahniuk |
| hy3-free | N | S | otro | novela (ficción) | El Club de la Lucha / Chuck Palahniuk |
| llama3.2:3b | N | S | otro | Novela | EL CLUB DE LA LUCHA / Chuck Palahniuk |
| qwen3:0.6b | N | N | ? | ? | ? / ? |

### frank-fernandez-el-anarquismo-en-cuba

| Modelo | A | ES | T | detalle (región/época · corriente · nota) | título / autor |
|--------|---|----|---|------------------------------------------|------------------|
| gemma3:4b | S | S | historia | Cuba · 1865-1998 | El ANARQUISMO EN CUBA / Frank Fernández |
| hy3-free | S | S | historia | Cuba · 1865-1980 | El anarquismo en Cuba / Frank Fernández |
| llama3.2:3b | S | S | historia | Cuba · Siglo XX | El Anarquismo en Cuba / Frank Fernández |
| qwen3:0.6b | – | – | – | (sin datos) | – |

### la-anarquia-errico-malatesta

| Modelo | A | ES | T | detalle (región/época · corriente · nota) | título / autor |
|--------|---|----|---|------------------------------------------|------------------|
| gemma3:4b | S | S | teoria | Anarquismo (principalmente anarquismo individualista y corriente principal) | La Anarquía / Errico Malatesta |
| hy3-free | S | S | teoria | anarquismo comunista / organización | La Anarquía / Errico Malatesta |
| llama3.2:3b | S | S | historia | Italiana · Fin del siglo XIX | La Anarquía / Errico Malatesta |
| qwen3:0.6b | S | S | historia | Italiana · 19th century | Anarchy / Errico Malatesta |

