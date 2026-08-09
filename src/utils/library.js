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
