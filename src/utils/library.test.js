import { describe, it, expect } from 'vitest';
import { getDecadeFromYear, getAllBooks, getAllAuthors, getEventRelatedTexts, filterBooks, sortBooks } from './library';

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
        { title: 'Teoría 1890', author: 'B', year: 1890, category: 'teoria' },
        { title: 'Revolución 1937', author: 'C', year: 1937, category: 'revolucion', rating: 5.0 }
      ]
    }
  };

  it('devuelve solo textos históricos ordenados por cercanía al año del evento', () => {
    const related = getEventRelatedTexts(rd, { region: 'España', year: 1936 });
    expect(related.length).toBe(2);
    expect(related[0].title).toBe('Historia 1936');
    expect(related[1].title).toBe('Revolución 1937');
  });

  it('devuelve lista vacía sin evento o sin regionData', () => {
    expect(getEventRelatedTexts(rd, null)).toEqual([]);
    expect(getEventRelatedTexts(null, { region: 'España', year: 1936 })).toEqual([]);
  });

  it('devuelve lista vacía si la región del evento no existe en los datos', () => {
    expect(getEventRelatedTexts(rd, { region: 'Krypton', year: 1936 })).toEqual([]);
  });

  it('ignora los textos históricos sin año', () => {
    const sinAno = { España: { books: [{ title: 'Sin año', author: 'A', category: 'historia' }] } };
    expect(getEventRelatedTexts(sinAno, { region: 'España', year: 1936 })).toEqual([]);
  });
});
