// src/utils/library.js
// Utilidades para el catálogo/biblioteca: normaliza los libros de regionData
// (añadiendo la región a cada obra) y aplica búsqueda + filtros combinados.

export const getDecadeFromYear = (year) => {
  if (!year) return 'all';
  return `${Math.floor(year / 10) * 10}s`;
};

// Construye una lista plana de todos los libros del archivo con su región.
// Cada libro conserva sus campos (title, author, year, category, rating,
// filename, summary) y se le añade `region`.
export const getAllBooks = (regionData) => {
  return Object.entries(regionData).flatMap(([region, data]) =>
    (data.books || []).map((book) => ({
      ...book,
      region
    }))
  );
};

// Filtra los libros combinando: búsqueda (título/autor), categoría, región y década.
export const filterBooks = (books, { searchTerm = '', category = 'all', region = 'all', decade = 'all' } = {}) => {
  const term = searchTerm.trim().toLowerCase();

  return books.filter((book) => {
    if (term && !`${book.title} ${book.author}`.toLowerCase().includes(term)) {
      return false;
    }
    if (category !== 'all' && book.category !== category) {
      return false;
    }
    if (region !== 'all' && book.region !== region) {
      return false;
    }
    if (decade !== 'all' && getDecadeFromYear(book.year) !== decade) {
      return false;
    }
    return true;
  });
};

// Ordena los libros: rating (desc), año (asc) o título (alfabético).
export const sortBooks = (books, sort = 'rating') => {
  const sorted = [...books];
  if (sort === 'rating') {
    return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
  if (sort === 'year') {
    return sorted.sort((a, b) => (a.year || 0) - (b.year || 0));
  }
  if (sort === 'title') {
    return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'es'));
  }
  return sorted;
};

// Categorías históricas del movimiento (las que van al mapa y la línea temporal).
// Los textos de filosofía/ideas (teoria, biografia, dialogo) viven en Autores.
// FUENTE ÚNICA: también se re-exporta desde constants para que nadie la duplique.
export const HISTORICAL_CATEGORIES = ['historia', 'revolucion', 'movimiento', 'organizacion', 'represion', 'periodismo', 'manifiesto'];
const HISTORICAL_SET = new Set(HISTORICAL_CATEGORIES);
export const isHistoricalBook = (book) => HISTORICAL_SET.has(book?.category);
export const isHistoricalCategory = (category) => HISTORICAL_SET.has(category);

// Textos históricos de una región (los de filosofía/ideas no van al mapa ni timeline).
export const getHistoricalBooks = (regionData, region) =>
  (regionData?.[region]?.books || [])
    .filter((b) => isHistoricalBook(b))
    .map((b) => ({ ...b, region }));

// Contador REAL de textos: todos los libros del catálogo (fuente única regionData).
export const countAllTexts = (regionData) =>
  Object.values(regionData || {}).reduce((sum, region) => sum + (region.books?.length || 0), 0);

// Conteo de textos por región (todos los del catálogo, no solo históricos).
export const countRegionTexts = (regionData, region) => regionData?.[region]?.books?.length || 0;

// Textos relacionados con un evento CON TEXTO (type 'con_texto').
// FUENTE ÚNICA de la relación: el propio evento declara `relatedTexts` con los
// TÍTULOS de los textos realmente vinculados. NO se usa la región/país para
// inferir la relación: eso evitaba que el 15M (2011) mostrase textos de la
// guerra civil española solo por compartir país. Los eventos 'hecho' (sin
// textos) no declaran relatedTexts y devuelven [].
export const getEventRelatedTexts = (regionData, event) => {
  if (!event || !regionData || !Array.isArray(event.relatedTexts)) return [];
  const wanted = event.relatedTexts.map((t) => String(t).trim().toLowerCase());
  const allBooks = [];
  Object.entries(regionData).forEach(([region, data]) =>
    (data.books || []).forEach((b) => allBooks.push({ ...b, region }))
  );
  return allBooks
    .filter((b) => wanted.includes(String(b.title).trim().toLowerCase()))
    .sort((a, b) => (b.year || 0) - (a.year || 0));
};

// Agrupa los libros por autor y los ordena de más a menos obras.
// Cada autor incluye la lista de sus obras (con región) para poder navegarlas.
// Los "Colectivo"/organizaciones sin autoría individual se omiten.
export const getAllAuthors = (regionData) => {
  const books = getAllBooks(regionData);
  const byAuthor = new Map();

  books.forEach((book) => {
    if (!book.author) return;
    const author = String(book.author).trim();
    if (!author || /^colectivo$/i.test(author)) return;
    if (!byAuthor.has(author)) {
      byAuthor.set(author, { name: author, books: [] });
    }
    byAuthor.get(author).books.push(book);
  });

  return Array.from(byAuthor.values())
    .map(({ name, books: authorBooks }) => ({
      name,
      books: authorBooks,
      bookCount: authorBooks.length,
      regions: Array.from(new Set(authorBooks.map((b) => b.region))).sort((a, b) => a.localeCompare(b, 'es')),
      years: authorBooks.reduce((acc, b) => {
        if (b.year) {
          acc.min = Math.min(acc.min, b.year);
          acc.max = Math.max(acc.max, b.year);
        }
        return acc;
      }, { min: Infinity, max: 0 })
    }))
    .map((author) => ({
      ...author,
      yearsRange: author.years.max ? `${author.years.min}-${author.years.max}` : ''
    }))
    .sort((a, b) => b.bookCount - a.bookCount || a.name.localeCompare(b.name, 'es'));
};

// Hash determinista de una fecha local (YYYY-MM-DD del reloj del usuario): la
// misma obra toda la jornada, una nueva cada día. Usa la fecha local (no UTC)
// para que el cambio de obra ocurra a medianoche local, no al borde UTC.
const hashDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const seed = `${y}-${m}-${d}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
};

// Obra destacada del día: selección diaria y determinista de una obra del
// archivo para el widget "Obra del día" (IDEAS.md §2). Prioriza obras legibles
// (con filename) y, entre ellas, las que tienen resumen (la "reseña" del
// widget). Si el catálogo está vacío o la fecha es inválida devuelve undefined.
export const getDailyFeaturedBook = (regionData, date = new Date()) => {
  const all = regionData ? getAllBooks(regionData) : [];
  if (!all.length) return undefined;
  const validDate = date instanceof Date && !Number.isNaN(date.getTime()) ? date : new Date();
  const readable = all.filter((b) => b.filename);
  const withResena = readable.filter((b) => b.summary);
  const pool = withResena.length ? withResena : readable.length ? readable : all;
  return pool[hashDate(validDate) % pool.length] || undefined;
};
