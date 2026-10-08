import { describe, it, expect } from 'vitest';
import { filterEvents } from './filters';

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