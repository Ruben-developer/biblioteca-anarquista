import { describe, it, expect } from 'vitest';
import { getDecadeFromYear, getAllBooks, filterBooks, sortBooks } from './library';

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
});
