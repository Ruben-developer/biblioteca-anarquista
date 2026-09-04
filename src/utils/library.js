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
    (data.books || [])
      .filter((book) => book.visible !== false)
      .map((book) => ({
        ...book,
        region
      }))
  );
};

// Filtra los libros combinando: búsqueda (título/autor), categoría, región,
// década, autor y búsqueda avanzada:
//  - `author`: 'all' o un nombre de autor exacto (insensible a mayúsculas).
//  - `availability`: 'all' | 'withFile' (solo con archivo) | 'withoutFile' (solo sin archivo).
//  - `type`: 'all' | 'historical' (categorías del mapa/timeline) | 'ideas' (teoría/biografía/diálogo).
//  - `favorites`: array de títulos guardados como favoritos (null/undefined desactiva el filtro).
const matchesFilter = (book, { term, category, region, decade, author, availability, type, favorites }) => {
  if (term && !`${book.title} ${book.author}`.toLowerCase().includes(term)) return false
  if (category !== 'all' && book.category !== category) return false
  if (region !== 'all' && book.region !== region) return false
  if (decade !== 'all' && getDecadeFromYear(book.pubYear) !== decade) return false
  if (author !== 'all' && String(book.author || '').trim().toLowerCase() !== String(author).trim().toLowerCase()) return false
  if (availability === 'withFile' && !book.filename) return false
  if (availability === 'withoutFile' && book.filename) return false
  if (type === 'historical' && !isHistoricalBook(book)) return false
  if (type === 'ideas' && isHistoricalBook(book)) return false
  if (Array.isArray(favorites) && !favorites.some((f) => (f.title || f) === book.title)) return false
  return true
}

export const filterBooks = (
  books,
  { searchTerm = '', category = 'all', region = 'all', decade = 'all', author = 'all', availability = 'all', type = 'all', favorites = null } = {}
) => {
  const term = searchTerm.trim().toLowerCase()
  return books.filter((book) => matchesFilter(book, { term, category, region, decade, author, availability, type, favorites }))
}

// Ordena los libros: rating (desc), año (asc) o título (alfabético).
export const sortBooks = (books, sort = 'rating') => {
  const sorted = [...books];
  if (sort === 'rating') {
    return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
  if (sort === 'year') {
    return sorted.sort((a, b) => (a.pubYear || 0) - (b.pubYear || 0));
  }
  if (sort === 'title') {
    return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'es'));
  }
  return sorted;
};

// Categorías históricas del movimiento (las que van al mapa y la línea temporal).
// Solo 'historia' (las antiguas revolucion/movimiento/organizacion/represion/
// periodismo/manifiesto se colapsaron aquí). Los textos de ideas (teoria) y las
// vidas (acratas) viven en Autores / Acratas. FUENTE ÚNICA: se re-exporta desde
// constants para que nadie la duplique.
export const HISTORICAL_CATEGORIES = ['historia'];
const HISTORICAL_SET = new Set(HISTORICAL_CATEGORIES);
export const isHistoricalBook = (book) => HISTORICAL_SET.has(book?.category);
export const isHistoricalCategory = (category) => HISTORICAL_SET.has(category);

// Textos históricos de una región (los de filosofía/ideas no van al mapa ni timeline).
export const getHistoricalBooks = (regionData, region) =>
  (regionData?.[region]?.books || [])
    .filter((b) => isHistoricalBook(b) && b.visible !== false)
    .map((b) => ({ ...b, region }));

// Categorías de "acratas" (narraciones de vida): biografías, autobiografías,
// memorias y epistolarios colapsados en 'acratas'. NO son históricas (no van al
// mapa ni a la línea temporal); viven en la sección Acratas y en Autores.
export const LIFE_CATEGORIES = ['acratas'];

// Vidas anarquistas del archivo (cualquiera de LIFE_CATEGORIES): lista plana con
// su región, ordenada por año (asc) y título. FUENTE ÚNICA para la vista Vidas.
export const getLifeBooks = (regionData) =>
  getAllBooks(regionData)
    .filter((b) => LIFE_CATEGORIES.includes(b.category))
    .sort((a, b) => (a.pubYear || 0) - (b.pubYear || 0) || String(a.title).localeCompare(String(b.title), 'es'));

// Personajes de "Acratas": agrupa los textos de categoría 'acratas' por su
// sujeto (campo `subject` de cada libro; si falta, el título). Cada persona
// incluye sus textos ordenados por año, el nº de obras, sus regiones y el rango
// de años. FUENTE ÚNICA para la vista Acratas (tarjeta = personaje, no libro).
export const getAcratasPersons = (regionData) => {
  const books = getAllBooks(regionData).filter((b) => b.category === 'acratas');
  const bySubject = new Map();
  books.forEach((b) => {
    const subject = String(b.subject || b.title || 'Desconocido').trim();
    if (!bySubject.has(subject)) bySubject.set(subject, { subject, books: [] });
    bySubject.get(subject).books.push(b);
  });
  return Array.from(bySubject.values())
    .map(({ subject, books: sb }) => ({
      subject,
      books: sb.sort(
        (a, b) => (a.pubYear || 0) - (b.pubYear || 0) || String(a.title).localeCompare(String(b.title), 'es')
      ),
      bookCount: sb.length
    }))
    .sort((a, b) => a.subject.localeCompare(b.subject, 'es'));
};

// Contador REAL de textos: todos los libros del catálogo (fuente única regionData).
export const countAllTexts = (regionData) =>
  Object.values(regionData || {}).reduce((sum, region) =>
    sum + (region.books?.filter((b) => b.visible !== false).length || 0), 0);

// Conteo de textos por región (todos los del catálogo, no solo históricos).
export const countRegionTexts = (regionData, region) =>
  regionData?.[region]?.books?.filter((b) => b.visible !== false).length || 0;

// Textos relacionados con un evento CON TEXTO (type 'con_texto').
// FUENTE ÚNICA de la relación: el propio evento declara `relatedTexts` con los
// TÍTULOS de los textos realmente vinculados. NO se usa la región/país para
// inferir la relación: eso evitaba que el 15M (2011) mostrase textos de la
// guerra civil española solo por compartir país. Los eventos 'hecho' (sin
// textos) no declaran relatedTexts y devuelven [].
export const getEventRelatedTexts = (regionData, event) => {
  if (!event || !regionData || !Array.isArray(event.relatedTexts)) return [];
  const wanted = new Set(event.relatedTexts.map((t) => String(t).trim().toLowerCase()))
  const allBooks = []
  Object.entries(regionData).forEach(([region, data]) =>
    (data.books || []).filter((b) => b.visible !== false).forEach((b) => allBooks.push({ ...b, region }))
  )
  return allBooks
    .filter((b) => wanted.has(String(b.title).trim().toLowerCase()))
    .sort((a, b) => (b.pubYear || 0) - (a.pubYear || 0))
};

// Eventos de la línea temporal que agrupan un libro (inversa de
// getEventRelatedTexts): busca los eventos 'con_texto' cuyo relatedTexts
// incluya el TÍTULO de la obra. Así un texto de la Biblioteca puede enlazar
// hacia la tarjeta de la línea temporal que lo agrupa (referencia cruzada).
// Devuelve [] si no hay datos o el libro no está vinculado a ningún evento.
export const getBookEvents = (timelineEvents, book) => {
  if (!Array.isArray(timelineEvents) || !book?.title) return [];
  const title = String(book.title).trim().toLowerCase();
  return timelineEvents
    .filter(
      (ev) =>
        ev?.type === 'con_texto' &&
        Array.isArray(ev.relatedTexts) &&
        ev.relatedTexts.some((t) => String(t).trim().toLowerCase() === title)
    )
    .sort((a, b) => (a.year || 0) - (b.year || 0));
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
        if (b.pubYear) {
          acc.min = Math.min(acc.min, b.pubYear);
          acc.max = Math.max(acc.max, b.pubYear);
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

// Busca un libro del catálogo por su TÍTULO (insensible a mayúsculas y
// espacios). Devuelve el libro con su región o undefined si no existe.
// Se usa para resolver los títulos referenciados por glosario, rutas de
// lectura y corrientes del anarquismo contra la fuente única regionData.
export const findBookByTitle = (regionData, title) => {
  if (!regionData || !title) return undefined;
  const wanted = String(title).trim().toLowerCase();
  for (const [region, data] of Object.entries(regionData)) {
    const found = (data.books || []).find(
      (b) => String(b.title || '').trim().toLowerCase() === wanted && b.visible !== false
    );
    if (found) return { ...found, region };
  }
  return undefined;
};

// Agrupa una lista plana de libros por autor (nombre normalizado: trim y sin
// distinción de mayúsculas). Devuelve los grupos ordenados de más a menos obras
// (y alfabéticamente en caso de empate). Los libros sin autor se agrupan bajo
// "Anónimo" para no perderlos en la vista agrupada. Devuelve [] sin datos.
export const groupBooksByAuthor = (books) => {
  if (!Array.isArray(books)) return [];
  const groups = new Map();
  books.forEach((book) => {
    const author = String(book.author || '').trim() || 'Anónimo';
    const key = author.toLowerCase();
    if (!groups.has(key)) groups.set(key, { name: author, books: [] });
    groups.get(key).books.push(book);
  });
  return Array.from(groups.values())
    .map(({ name, books: groupBooks }) => ({ name, books: groupBooks, bookCount: groupBooks.length }))
    .sort((a, b) => b.bookCount - a.bookCount || a.name.localeCompare(b.name, 'es'));
};

// Agrupa una lista plana de libros por región (campo `region` de cada libro).
// Devuelve los grupos ordenados de más a menos obras (y alfabéticamente en caso
// de empate). Los libros sin región se agrupan bajo "Sin región" para no
// perderlos en la vista agrupada. Devuelve [] sin datos.
export const groupBooksByRegion = (books) => {
  if (!Array.isArray(books)) return [];
  const groups = new Map();
  books.forEach((book) => {
    const region = String(book.region || '').trim() || 'Sin región';
    const key = region.toLowerCase();
    if (!groups.has(key)) groups.set(key, { name: region, books: [] });
    groups.get(key).books.push(book);
  });
  return Array.from(groups.values())
    .map(({ name, books: groupBooks }) => ({ name, books: groupBooks, bookCount: groupBooks.length }))
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
    hash = (hash * 31 + seed.codePointAt(i)) >>> 0
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
  const pool = withResena.length ? withResena : (readable.length ? readable : all)
  return pool[hashDate(validDate) % pool.length] || undefined;
};

// Métricas del dashboard del archivo (FASE 2): un único objeto computado desde
// la fuente única (regionData + timelineEvents) para que el StatsPanel y el
// Header/footer usen exactamente los mismos números.
export const getArchiveStats = (regionData, timelineEvents = []) => {
  const books = regionData ? getAllBooks(regionData) : [];
  // 'otros' es un cubo de contabilidad (textos aún no publicados): NO entra en
  // el total ni en la distribución por categoría; se reporta aparte como 'pending'.
  // visible: false tampoco entra (libros pendientes de importar).
  const published = books.filter((b) => b.category !== 'otros');
  const texts = published.length;
  const pending = books.length - texts;
  const events = Array.isArray(timelineEvents) ? timelineEvents.length : 0;
  const regions = Object.keys(regionData || {}).length;
  // Autores/topAutores también excluyen 'otros' (igual que la vista Autores).
  const publishedRegionData = Object.fromEntries(
    Object.entries(regionData || {}).map(([r, d]) => [
      r,
      { ...d, books: (d.books || []).filter((b) => b.category !== 'otros') }
    ])
  );
  const authors = getAllAuthors(publishedRegionData);

  const downloadables = published.filter((b) => b.filename).length;
  const historical = published.filter((b) => isHistoricalBook(b)).length;

  // Distribución por categoría (solo publicadas, ordenadas de más a menos).
  const catCounts = new Map();
  published.forEach((b) => {
    const cat = b.category || 'sin categoría';
    catCounts.set(cat, (catCounts.get(cat) || 0) + 1);
  });
  const categories = Array.from(catCounts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category, 'es'));

  // Autores más prolíficos (top 5 por número de obras).
  const topAuthors = authors.slice(0, 5).map((a) => ({ name: a.name, count: a.bookCount }));

  // Regiones con más obras (todas, no solo históricas) + nº de históricas,
  // para poder señalar cuáles aparecen en el mapa.
  const topRegions = Object.entries(regionData || {})
    .map(([region, data]) => ({
      region,
      count: data.books?.length || 0,
      historical: getHistoricalBooks(regionData, region).length
    }))
    .sort((a, b) => b.count - a.count || a.region.localeCompare(b.region, 'es'));

  // Textos por década (solo años conocidos, orden cronológico).
  const decadeCounts = new Map();
  books.forEach((b) => {
    const decade = getDecadeFromYear(b.pubYear);
    if (decade && decade !== 'all') {
      decadeCounts.set(decade, (decadeCounts.get(decade) || 0) + 1);
    }
  });
  const byDecade = Array.from(decadeCounts.entries())
    .map(([decade, count]) => ({ decade, count }))
    .sort((a, b) => a.decade.localeCompare(b.decade));

  return {
    texts,
    pending,
    events,
    regions,
    authors: authors.length,
    downloadables,
    withoutFile: texts - downloadables,
    historical,
    ideas: texts - historical,
    categories,
    topAuthors,
    topRegions,
    byDecade
  };
};
