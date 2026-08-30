import { describe, it, expect } from 'vitest';
import {
  filterEvents,
  calculateTotalTexts,
  isFavorite,
  toggleFavoriteBook,
  sortFavorites
} from './filters';

const events = [
  {
    year: 1840,
    decade: '1840s',
    title: '¿Qué es la Propiedad?',
    description: 'Obra de Proudhon.',
    region: 'Francia',
    category: 'teoria'
  },
  {
    year: 1936,
    decade: '1930s',
    title: 'Colectividades',
    description: 'Experiencias en España.',
    region: 'España',
    category: 'historia'
  }
];

const regionData = {
  España: { books: [{ title: 'A' }, { title: 'B' }] },
  Francia: { books: [{ title: 'C' }] }
};

describe('filterEvents', () => {
  it('devuelve todos los eventos con filtros en all', () => {
    const filters = { searchTerm: '', decade: 'all', category: 'all', region: 'all' };
    expect(filterEvents(events, filters)).toHaveLength(2);
  });

  it('filtra por término de búsqueda (título)', () => {
    const filters = { searchTerm: 'propiedad', decade: 'all', category: 'all', region: 'all' };
    const result = filterEvents(events, filters);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('¿Qué es la Propiedad?');
  });

  it('filtra por década', () => {
    const filters = { searchTerm: '', decade: '1930s', category: 'all', region: 'all' };
    const result = filterEvents(events, filters);
    expect(result).toHaveLength(1);
    expect(result[0].year).toBe(1936);
  });

  it('filtra por categoría', () => {
    const filters = { searchTerm: '', decade: 'all', category: 'teoria', region: 'all' };
    const result = filterEvents(events, filters);
    expect(result).toHaveLength(1);
    expect(result[0].category).toBe('teoria');
  });

  it('filtra por región', () => {
    const filters = { searchTerm: '', decade: 'all', category: 'all', region: 'España' };
    const result = filterEvents(events, filters);
    expect(result).toHaveLength(1);
    expect(result[0].region).toBe('España');
  });

  it('combina criterios (región + categoría) y devuelve vacío si no coincide', () => {
    const filters = { searchTerm: '', decade: 'all', category: 'teoria', region: 'España' };
    expect(filterEvents(events, filters)).toHaveLength(0);
  });

  it('es insensible a mayúsculas en la búsqueda', () => {
    const filters = { searchTerm: 'PROPIEDAD', decade: 'all', category: 'all', region: 'all' };
    expect(filterEvents(events, filters)).toHaveLength(1);
  });
});

describe('calculateTotalTexts', () => {
  it('suma los libros de todas las regiones', () => {
    expect(calculateTotalTexts(regionData)).toBe(3);
  });

  it('devuelve 0 con datos vacíos', () => {
    expect(calculateTotalTexts({})).toBe(0);
  });
});

describe('favoritos', () => {
  it('isFavorite detecta si un título está en la lista', () => {
    expect(isFavorite('A', ['A', 'B'])).toBe(true);
    expect(isFavorite('C', ['A', 'B'])).toBe(false);
  });

  it('toggleFavoriteBook agrega si no existe y elimina si existe', () => {
    expect(toggleFavoriteBook('C', ['A'])).toEqual(['A', 'C']);
    expect(toggleFavoriteBook('A', ['A', 'C'])).toEqual(['C']);
  });

  it('sortFavorites "newest" invierte la lista y default la deja igual', () => {
    expect(sortFavorites(['A', 'B', 'C'], 'newest')).toEqual(['C', 'B', 'A']);
    expect(sortFavorites(['A', 'B'], 'title')).toEqual(['A', 'B']);
  });
});
