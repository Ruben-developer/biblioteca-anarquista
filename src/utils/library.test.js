import { describe, it, expect } from 'vitest';
import { getDecadeFromYear, getAllBooks, getAllAuthors, getEventRelatedTexts, getBookEvents, filterBooks, sortBooks, getDailyFeaturedBook, getArchiveStats } from './library';

const regionData = {
  España: {
    books: [
      { title: 'La Conquista del Pan', author: 'Kropotkin', year: 1892, category: 'teoria', rating: 4.8 },
      { title: 'Columna Durruti', author: 'Colectivo', year: 1936, category: 'biografia', rating: 4.9 }
    ]
  },
  Francia: {
    books: [
      { title: '¿Qué es la Propiedad?', author: 'Proudhon', year: 1840, category: 'teoria', rating: 4.9 }
    ]
  }
};

describe('getDecadeFromYear', () => {
  it('calcula la década correctamente', () => {
    expect(getDecadeFromYear(1840)).toBe('1840s');
    expect(getDecadeFromYear(1892)).toBe('1890s');
    expect(getDecadeFromYear(1936)).toBe('1930s');
  });

  it('devuelve "all" sin año', () => {
    expect(getDecadeFromYear(undefined)).toBe('all');
    expect(getDecadeFromYear(null)).toBe('all');
  });
});

describe('getAllBooks', () => {
  it('aplana los libros añadiendo su región', () => {
    const books = getAllBooks(regionData);
    expect(books.length).toBe(3);
    expect(books[0]).toMatchObject({ title: 'La Conquista del Pan', region: 'España' });
    expect(books[2]).toMatchObject({ title: '¿Qué es la Propiedad?', region: 'Francia' });
  });
});

describe('getAllAuthors', () => {
  it('agrupa libros por autor y omite los Colectivo', () => {
    const authors = getAllAuthors(regionData);
    expect(authors.some((a) => a.name === 'Kropotkin')).toBe(true);
    expect(authors.some((a) => a.name === 'Proudhon')).toBe(true);
    expect(authors.some((a) => a.name === 'Colectivo')).toBe(false);
  });

  it('cuenta las obras y ordena de más a menos', () => {
    const authors = getAllAuthors(regionData);
    expect(authors[0].bookCount).toBe(1);
    expect(authors.every((a) => a.bookCount >= 1)).toBe(true);
  });

  it('incluye la región y el rango de años de las obras', () => {
    const authors = getAllAuthors(regionData);
    const kropotkin = authors.find((a) => a.name === 'Kropotkin');
    expect(kropotkin.regions).toContain('España');
    expect(kropotkin.yearsRange).toBe('1892-1892');
    expect(kropotkin.books[0]).toMatchObject({ title: 'La Conquista del Pan', region: 'España' });
  });

  it('deja el rango de años vacío cuando las obras no tienen año', () => {
    const sinAnos = {
      España: { books: [{ title: 'Obra sin año', author: 'Misterioso', category: 'teoria' }] }
    };
    const authors = getAllAuthors(sinAnos);
    const autor = authors.find((a) => a.name === 'Misterioso');
    expect(autor.yearsRange).toBe('');
  });

  it('omite los libros sin autor', () => {
    const sinAutor = {
      España: { books: [{ title: 'Anónimo', category: 'teoria' }] }
    };
    expect(getAllAuthors(sinAutor).length).toBe(0);
  });
});

describe('filterBooks', () => {
  const books = getAllBooks(regionData);

  it('devuelve todo sin filtros', () => {
    expect(filterBooks(books).length).toBe(3);
  });

  it('busca por título y autor (insensible a mayúsculas)', () => {
    expect(filterBooks(books, { searchTerm: 'conquista' }).length).toBe(1);
    expect(filterBooks(books, { searchTerm: 'KROPOTKIN' }).length).toBe(1);
  });

  it('filtra por categoría', () => {
    expect(filterBooks(books, { category: 'teoria' }).length).toBe(2);
  });

  it('filtra por región', () => {
    expect(filterBooks(books, { region: 'Francia' }).length).toBe(1);
  });

  it('filtra por década', () => {
    expect(filterBooks(books, { decade: '1930s' }).length).toBe(1);
  });

  it('combina varios filtros', () => {
    const result = filterBooks(books, { category: 'teoria', region: 'España' });
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('La Conquista del Pan');
  });
});

describe('sortBooks', () => {
  const books = getAllBooks(regionData);

  it('ordena por rating descendente', () => {
    const sorted = sortBooks(books, 'rating');
    expect(sorted[0].rating).toBe(4.9);
    expect(sorted[2].rating).toBe(4.8);
  });

  it('ordena por año ascendente', () => {
    const sorted = sortBooks(books, 'year');
    expect(sorted[0].year).toBe(1840);
    expect(sorted[2].year).toBe(1936);
  });

  it('ordena por título alfabéticamente', () => {
    const sorted = sortBooks(books, 'title');
    expect(sorted[0].title).toBe('¿Qué es la Propiedad?');
  });

  it('no muta la lista original', () => {
    const original = [...books];
    sortBooks(books, 'year');
    expect(books[0].year).toBe(original[0].year);
  });

  it('devuelve la lista sin cambios con un criterio de orden no soportado', () => {
    const original = [...books];
    const sorted = sortBooks(books, 'desconocido');
    expect(sorted.map((b) => b.title)).toEqual(original.map((b) => b.title));
  });

  it('no falla con libros sin rating, año o título', () => {
    const incompletos = [
      { title: 'Sin año', author: 'A', category: 'teoria' },
      { title: undefined, author: 'B', year: 1900, rating: 3 },
      { title: 'Sin rating', author: 'C', year: 1850 }
    ];
    expect(sortBooks(incompletos, 'rating').length).toBe(3);
    expect(sortBooks(incompletos, 'year').length).toBe(3);
    expect(sortBooks(incompletos, 'title').length).toBe(3);
  });
});

describe('getAllBooks edge cases', () => {
  it('tolera regiones sin lista de libros', () => {
    const books = getAllBooks({ 'Tierra de Nadie': { otrosCampos: true } });
    expect(books.length).toBe(0);
  });
});

describe('getEventRelatedTexts', () => {
  const rd = {
    España: {
      books: [
        { title: 'Historia 1936', author: 'A', year: 1936, category: 'historia', rating: 4.0 },
        { title: 'Guerra Civil 1977', author: 'C', year: 1977, category: 'historia', rating: 5.0 },
        { title: 'Teoría 1890', author: 'B', year: 1890, category: 'teoria' }
      ]
    },
    Siria: {
      books: [{ title: 'Rojava', author: 'D', year: 2015, category: 'revolucion' }]
    }
  };

  it('devuelve SOLO los textos listados en relatedTexts por título, sin importar la región/año', () => {
    // El evento 15M (España, 2011) declara un texto sí mismo; NO debe arrastrar
    // 'Guerra Civil 1977' solo por compartir país (regresión del bug de negocio).
    const related = getEventRelatedTexts(rd, { region: 'España', year: 2011, relatedTexts: ['Teoría 1890'] });
    expect(related.length).toBe(1);
    expect(related[0].title).toBe('Teoría 1890');
    expect(related.every((b) => b.title !== 'Guerra Civil 1977')).toBe(true);
  });

  it('puede enlazar textos de OTRA región distinta a la del evento', () => {
    // El vínculo es por título, no por país.
    const related = getEventRelatedTexts(rd, { region: 'España', year: 2012, relatedTexts: ['Rojava'] });
    expect(related.length).toBe(1);
    expect(related[0].region).toBe('Siria');
  });

  it('devuelve lista vacía sin evento, sin regionData o sin relatedTexts', () => {
    expect(getEventRelatedTexts(rd, null)).toEqual([]);
    expect(getEventRelatedTexts(null, { region: 'España', year: 1936 })).toEqual([]);
    // Un evento 'hecho' no lleva relatedTexts → sin textos.
    expect(getEventRelatedTexts(rd, { region: 'España', year: 2011 })).toEqual([]);
  });

  it('ignora títulos de relatedTexts que no existen en el catálogo', () => {
    const related = getEventRelatedTexts(rd, { region: 'España', year: 1936, relatedTexts: ['No existe', 'Historia 1936'] });
    expect(related.length).toBe(1);
    expect(related[0].title).toBe('Historia 1936');
  });
});

describe('getBookEvents', () => {
  const events = [
    { title: 'Guerra Civil', year: 1936, type: 'con_texto', relatedTexts: ['Historia 1936', 'Teoría 1890'] },
    { title: '15M', year: 2011, type: 'con_texto', relatedTexts: ['Rojava'] },
    { title: 'Makhnovschina', year: 1918, type: 'hecho' },
    { title: 'Revolución Mexicana', year: 1910, type: 'con_texto', relatedTexts: ['Historia 1936'] }
  ];

  it('devuelve los eventos con_texto cuyo relatedTexts incluye el título del libro', () => {
    const found = getBookEvents(events, { title: 'Historia 1936' });
    expect(found.length).toBe(2);
    // Ordenados cronológicamente
    expect(found.map((e) => e.year)).toEqual([1910, 1936]);
  });

  it('ignora eventos tipo hecho (sin relatedTexts) y títulos no listados', () => {
    expect(getBookEvents(events, { title: 'Makhnovschina' })).toEqual([]);
    expect(getBookEvents(events, { title: 'No existe' })).toEqual([]);
  });

  it('tolera datos ausentes', () => {
    expect(getBookEvents(null, { title: 'Historia 1936' })).toEqual([]);
    expect(getBookEvents(events, null)).toEqual([]);
    expect(getBookEvents(events, {})).toEqual([]);
  });

  it('empareja por título sin importar mayúsculas ni espacios', () => {
    const found = getBookEvents(events, { title: '  historia 1936 ' });
    expect(found.length).toBe(2);
  });
});

describe('getDailyFeaturedBook', () => {
  const rd = {
    España: {
      books: [
        { title: 'Obra A con resumen', author: 'A', year: 1892, category: 'teoria', rating: 4.8, filename: 'x.pdf', summary: 'Reseña A.' },
        { title: 'Obra B con resumen', author: 'B', year: 1936, category: 'biografia', rating: 4.9, filename: 'y.pdf', summary: 'Reseña B.' },
        { title: 'Con archivo sin resumen', author: 'C', year: 1900, category: 'historia', filename: 'z.pdf' },
        { title: 'Sin archivo', author: 'D', year: 1910, category: 'historia' }
      ]
    }
  };

  it('devuelve undefined con catálogo vacío o inexistente', () => {
    expect(getDailyFeaturedBook({})).toBeUndefined();
    expect(getDailyFeaturedBook(undefined)).toBeUndefined();
    expect(getDailyFeaturedBook(null)).toBeUndefined();
  });

  it('es determinista: la misma fecha devuelve siempre la misma obra', () => {
    const d = new Date('2026-08-12T10:00:00');
    expect(getDailyFeaturedBook(rd, d)).toEqual(getDailyFeaturedBook(rd, new Date('2026-08-12T23:59:00')));
  });

  it('varía a lo largo de los días (no es fija)', () => {
    const days = [];
    for (let i = 0; i < 40; i += 1) days.push(new Date(2026, 7, 12 + i));
    const titles = new Set(days.map((d) => getDailyFeaturedBook(rd, d).title));
    expect(titles.size).toBeGreaterThan(1);
  });

  it('prioriza obras legibles (con filename) sobre las que no tienen archivo', () => {
    for (let i = 0; i < 30; i += 1) {
      const featured = getDailyFeaturedBook(rd, new Date(2026, 7, 12 + i));
      expect(featured.filename).toBeTruthy();
    }
  });

  it('prioriza las legibles con resumen para el widget', () => {
    for (let i = 0; i < 30; i += 1) {
      const featured = getDailyFeaturedBook(rd, new Date(2026, 7, 12 + i));
      expect(featured.summary).toBeTruthy();
    }
  });

  it('cae a libros sin archivo si no hay ninguno legible', () => {
    const soloFicha = { España: { books: [{ title: 'Solo ficha', author: 'X', year: 1900, category: 'historia' }] } };
    expect(getDailyFeaturedBook(soloFicha, new Date('2026-08-12'))).toMatchObject({ title: 'Solo ficha' });
  });

  it('tolera fechas inválidas (usa la fecha actual)', () => {
    const featured = getDailyFeaturedBook(rd, new Date('no-valid'));
    expect(featured).toBeDefined();
    expect(featured.filename).toBeTruthy();
  });
});

describe('getArchiveStats', () => {
  const rd = {
    España: {
      books: [
        { title: 'Teoría A', author: 'Autor 1', year: 1892, category: 'teoria', filename: 'a.pdf' },
        { title: 'Historia B', author: 'Autor 2', year: 1937, category: 'historia', filename: 'b.pdf' },
        { title: 'Teoría C', author: 'Autor 1', year: 1910, category: 'teoria', filename: 'c.pdf' },
        { title: 'Sin año', author: 'Autor 3', category: 'manifiesto' }
      ]
    },
    Francia: {
      books: [
        { title: 'Revolución D', author: 'Autor 1', year: 1871, category: 'revolucion', filename: 'd.pdf' },
        { title: 'Biografía E', author: 'Autor 4', year: 1920, category: 'biografia' }
      ]
    }
  };
  const events = [{ title: 'E1' }, { title: 'E2' }, { title: 'E3' }];

  it('devuelve ceros y listas vacías con catálogo vacío', () => {
    const s = getArchiveStats({}, []);
    expect(s).toMatchObject({ texts: 0, events: 0, regions: 0, authors: 0, downloadables: 0, withoutFile: 0, historical: 0, ideas: 0 });
    expect(s.categories).toEqual([]);
    expect(s.topAuthors).toEqual([]);
    expect(s.topRegions).toEqual([]);
    expect(s.byDecade).toEqual([]);
  });

  it('cuenta textos, eventos, regiones y autores', () => {
    const s = getArchiveStats(rd, events);
    expect(s.texts).toBe(6);
    expect(s.events).toBe(3);
    expect(s.regions).toBe(2);
    expect(s.authors).toBe(4);
  });

  it('separa descargables vs sin archivo', () => {
    const s = getArchiveStats(rd);
    expect(s.downloadables).toBe(4); // a.pdf + b.pdf + c.pdf + d.pdf
    expect(s.withoutFile).toBe(2); // Sin año + Biografía E
  });

  it('separa históricos (mapa/timeline) vs ideas (autores)', () => {
    const s = getArchiveStats(rd);
    expect(s.historical).toBe(3); // Historia B + Sin año (manifiesto) + Revolución D
    expect(s.ideas).toBe(3); // Teoría A + Teoría C + Biografía E
  });

  it('agrupa por categoría de más a menos obras', () => {
    const s = getArchiveStats(rd);
    expect(s.categories[0]).toEqual({ category: 'teoria', count: 2 });
    const counts = s.categories.map((c) => c.count);
    expect(counts).toEqual([...counts].sort((a, b) => b - a));
  });

  it('topAutores: los más prolíficos primero (top 5)', () => {
    const s = getArchiveStats(rd);
    expect(s.topAuthors[0]).toEqual({ name: 'Autor 1', count: 3 });
    expect(s.topAuthors).toHaveLength(4);
  });

  it('topRegiones: ordenadas por nº de obras DESC con conteo histórico', () => {
    const s = getArchiveStats(rd);
    expect(s.topRegions[0]).toEqual({ region: 'España', count: 4, historical: 2 });
    expect(s.topRegions[1]).toEqual({ region: 'Francia', count: 2, historical: 1 });
  });

  it('byDecade: cronológico e ignora obras sin año', () => {
    const s = getArchiveStats(rd);
    expect(s.byDecade.map((d) => d.decade)).toEqual(['1870s', '1890s', '1910s', '1920s', '1930s']);
    expect(s.byDecade[0]).toEqual({ decade: '1870s', count: 1 });
  });
});
