// src/utils/routes.js
// Enlaces profundos (deep links) del archivo. Convierte entre el hash de la URL
// (#/biblioteca, #/libro/<slug>) y el estado de la app (vista activa + obra
// abierta). Hash routing sin dependencias: GitHub Pages no tiene rewrites, el
// build de PRE usa base /preview/ y el fragmento es lo único portable entre
// PRE (develop) y PRO (main).

import { VIEWS } from '../constants';
import { getAllBooks } from './library';

// Slug legible: sin acentos, minúsculas, separados por guiones.
// Los títulos con puntuación ("¡¿Anarquismo?") quedan como "anarquismo".
export const slugify = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Prefijo de la ruta de una obra: #/libro/<slug>.
export const BOOK_ROUTE = 'libro';

// Vista → slug canónico de la URL (nombres en español, legibles para compartir).
export const VIEW_SLUGS = {
  [VIEWS.TIMELINE]: 'linea-temporal',
  [VIEWS.MAP]: 'mapa',
  [VIEWS.AUTHORS]: 'autores',
  [VIEWS.FAVORITES]: 'favoritos',
  [VIEWS.LIBRARY]: 'biblioteca',
  [VIEWS.THEORIES]: 'teorias',
  [VIEWS.INFLUENCES]: 'influencias',
  [VIEWS.ACRATAS]: 'acratas',
  [VIEWS.PATHS]: 'rutas',
  [VIEWS.GLOSSARY]: 'glosario',
  [VIEWS.CONTACT]: 'contacto',
  [VIEWS.STATS]: 'estadisticas'
};

// Token de URL (slug canónico o id interno de VIEWS, ej. #/map) → vista.
const ROUTE_TOKENS = new Map();
Object.entries(VIEW_SLUGS).forEach(([view, slug]) => {
  ROUTE_TOKENS.set(slug, view);
  ROUTE_TOKENS.set(view, view);
});

const safeDecode = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

// "#/Mapa/" → "mapa": sin '#', sin barras inicial/final, minúsculas.
const normalizeToken = (hash) =>
  safeDecode(
    String(hash ?? '')
      .replace(/^#/, '')
      .replace(/^\/+/, '')
      .replace(/\/+$/, '')
  ).toLowerCase();

// Hash → ruta de la app. Siempre devuelve una ruta utilizable:
//  - `#/libro/<slug>` con el slug resuelto → { type: 'book', slug, book }.
//  - `#/libro/<slug>` desconocido o token de vista desconocido → biblioteca.
export const parseRoute = (hash, bookIndex) => {
  const token = normalizeToken(hash);
  if (token.startsWith(`${BOOK_ROUTE}/`)) {
    const slug = token.slice(BOOK_ROUTE.length + 1);
    const book = bookIndex?.bookOf.get(slug);
    if (book) return { type: 'book', slug, book };
    return { type: 'view', view: VIEWS.LIBRARY };
  }
  return { type: 'view', view: ROUTE_TOKENS.get(token) || VIEWS.LIBRARY };
};

// Vista → hash canónico. Vista desconocida → biblioteca.
export const buildViewHash = (view) => `#/${VIEW_SLUGS[view] || VIEW_SLUGS[VIEWS.LIBRARY]}`;

// Slug de obra → hash canónico.
export const buildBookHash = (slug) => `#/${BOOK_ROUTE}/${slug}`;

// ---------------------------------------------------------------------------
// Modo dual de rutas (hash | pathname).
// - `hash` (por defecto): GitHub Pages no tiene rewrites, el fragmento es lo
//   único portable entre PRE (/preview/) y PRO.
// - `pathname` (VITE_ROUTES_MODE=pathname): rutas reales /mapa, /libro/<slug>
//   para el deploy beta en Cloudflare Workers, que sirve index.html ante
//   cualquier ruta desconocida (fallback SPA). Vite inyecta la variable en
//   build; aquí se lee en cada llamada para que los tests puedan cambiarla.
// ---------------------------------------------------------------------------

export const routesMode = () =>
  (import.meta.env?.VITE_ROUTES_MODE === 'pathname' ? 'pathname' : 'hash');

// Prefijo base del sitio ('/' o '/preview/'), siempre con barra final.
const basePath = () => {
  const base = import.meta.env?.BASE_URL || '/';
  return base.endsWith('/') ? base : `${base}/`;
};

// Entrada cruda para parseRoute según el modo. En pathname devuelve el path
// sin el prefijo base; parseRoute se encarga del resto de la normalización.
export const readRouteInput = (mode = routesMode()) => {
  if (mode === 'pathname') {
    const base = basePath();
    const path = window.location.pathname;
    return base !== '/' && path.startsWith(base) ? path.slice(base.length) : path;
  }
  return window.location.hash;
};

// Forma canónica de la URL actual (misma forma que viewHref/bookHref) para
// decidir si hace falta escribir. En pathname se ignora la barra final.
export const currentRouteHref = (mode = routesMode()) => {
  if (mode === 'pathname') {
    const path = window.location.pathname;
    return path.length > 1 ? path.replace(/\/+$/, '') : path;
  }
  return window.location.hash;
};

// Ruta → href para history.replaceState/pushState (pathname) o
// location.hash (hash). Vista desconocida → biblioteca.
export const viewHref = (view, mode = routesMode()) => {
  const rel = VIEW_SLUGS[view] || VIEW_SLUGS[VIEWS.LIBRARY];
  return mode === 'pathname' ? `${basePath()}${rel}` : buildViewHash(view);
};

// Slug de obra → href según el modo.
export const bookHref = (slug, mode = routesMode()) =>
  mode === 'pathname' ? `${basePath()}${BOOK_ROUTE}/${slug}` : buildBookHash(slug);

const keyPart = (value) => String(value ?? '').trim().toLowerCase();

// Índice de enlaces profundos de las obras del catálogo:
//  - bookOf: slug → obra (con región) para abrir el lector desde la URL.
//  - slugFor: obra → slug (admite obras parciales de favoritos, sin región).
// El slug base es slugify(title); con títulos repetidos se desambigua con
// `--<autor>`, luego `--<región>` y finalmente `--<n>` (los slugs de este
// índice son únicos: los títulos base nunca contienen `--`, así que una
// variante con `--` no puede chocar con el título de otra obra).
export const buildBookSlugIndex = (regionData) => {
  const books = getAllBooks(regionData || {});
  const bookOf = new Map();
  const byTitleAuthorRegion = new Map();
  const byTitleAuthor = new Map();
  const byTitle = new Map();
  const taken = new Set();

  const assign = (book, slug) => {
    taken.add(slug);
    bookOf.set(slug, book);
    const title = keyPart(book.title);
    const titleAuthor = `${title}|${keyPart(book.author)}`;
    if (!byTitleAuthorRegion.has(`${titleAuthor}|${keyPart(book.region)}`)) {
      byTitleAuthorRegion.set(`${titleAuthor}|${keyPart(book.region)}`, slug);
    }
    if (!byTitleAuthor.has(titleAuthor)) byTitleAuthor.set(titleAuthor, slug);
    if (!byTitle.has(title)) byTitle.set(title, slug);
  };

  const bySlugBase = new Map();
  books.forEach((book) => {
    const base = slugify(book.title) || 'obra';
    if (!bySlugBase.has(base)) bySlugBase.set(base, []);
    bySlugBase.get(base).push(book);
  });

  // Títulos únicos: el slug es el propio título.
  bySlugBase.forEach((group, base) => {
    if (group.length === 1) assign(group[0], base);
  });

  // Títulos repetidos: desambigúa por autor, región y, en último caso, número.
  bySlugBase.forEach((group, base) => {
    if (group.length === 1) return;
    group.forEach((book) => {
      const authorSlug = slugify(book.author);
      const regionSlug = slugify(book.region);
      let slug = authorSlug ? `${base}--${authorSlug}` : '';
      if (!slug || taken.has(slug)) slug = regionSlug ? `${base}--${regionSlug}` : '';
      let n = 2;
      while (!slug || taken.has(slug)) {
        slug = `${base}--${n}`;
        n += 1;
      }
      assign(book, slug);
    });
  });

  // Obra → slug: título+autor+región (exacto), luego título+autor (favoritos
  // parciales sin región) y por último título (compatibilidad máxima).
  const slugFor = (book) => {
    if (!book || !book.title) return undefined;
    const title = keyPart(book.title);
    const titleAuthor = `${title}|${keyPart(book.author)}`;
    return (
      byTitleAuthorRegion.get(`${titleAuthor}|${keyPart(book.region)}`) ??
      byTitleAuthor.get(titleAuthor) ??
      byTitle.get(title)
    );
  };

  return { bookOf, slugFor };
};
