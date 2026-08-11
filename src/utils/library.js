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

// Textos históricos relacionados con un evento: misma región, ordenados por
// cercanía al año del evento (mismo año primero, luego los más próximos).
export const getEventRelatedTexts = (regionData, event) => {
  if (!event || !regionData) return [];
  const regionBooks = regionData?.[event.region]?.books || [];
  return regionBooks
    .filter((b) => isHistoricalBook(b) && b.year)
    .map((book) => ({ ...book, distance: Math.abs(book.year - event.year) }))
    .sort((a, b) => a.distance - b.distance || b.rating - a.rating);
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
