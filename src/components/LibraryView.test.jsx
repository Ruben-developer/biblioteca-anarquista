import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import LibraryView from './LibraryView';

const regionData = {
  España: {
    books: [
      { title: 'La Conquista del Pan', author: 'Kropotkin', year: 1892, category: 'teoria', rating: 4.8, filename: 'anarquismo/a.pdf' },
      { title: 'Columna Durruti', author: 'Colectivo', year: 1936, category: 'biografia', rating: 4.9, filename: 'anarquismo/b.pdf' }
    ]
  },
  Francia: {
    books: [
      { title: '¿Qué es la Propiedad?', author: 'Proudhon', year: 1840, category: 'teoria', rating: 4.9, filename: 'anarquismo/c.pdf' }
    ]
  }
};

describe('LibraryView', () => {
  const noop = () => {};

  it('renderiza el título y el contador de obras', () => {
    const html = renderToStaticMarkup(
      <LibraryView darkMode={false} regionData={regionData} favorites={[]} onToggleFavorite={noop} />
    );
    expect(html).toContain('Biblioteca');
    expect(html).toContain('3 de 3 obras');
  });

  it('renderiza un botón Leer por cada obra con archivo', () => {
    const html = renderToStaticMarkup(
      <LibraryView darkMode={false} regionData={regionData} favorites={[]} onToggleFavorite={noop} />
    );
    expect(html).toContain('La Conquista del Pan');
    expect(html).toContain('Columna Durruti');
    expect(html).toContain('¿Qué es la Propiedad?');
    expect((html.match(/Leer/g) || []).length).toBe(3);
  });

  it('muestra la región y categoría de cada obra', () => {
    const html = renderToStaticMarkup(
      <LibraryView darkMode={false} regionData={regionData} favorites={[]} onToggleFavorite={noop} />
    );
    expect(html).toContain('España');
    expect(html).toContain('Francia');
    expect(html).toContain('teoria');
    expect(html).toContain('biografia');
  });

  it('incluye el control de búsqueda y filtros', () => {
    const html = renderToStaticMarkup(
      <LibraryView darkMode={false} regionData={regionData} favorites={[]} onToggleFavorite={noop} />
    );
    expect(html).toContain('Buscar por título o autor');
    expect(html).toContain('Todas las categorías');
    expect(html).toContain('Todas las regiones');
    expect(html).toContain('Todas las décadas');
  });
});

describe('LibraryView edge cases', () => {
  const noop = () => {};

  const regionDataEdge = {
    España: {
      books: [
        { title: 'Obra completa', author: 'Autor A', year: 1892, category: 'teoria', rating: 4.8, summary: 'Resumen de la obra', filename: 'anarquismo/a.pdf' },
        { title: 'Obra sin año ni rating', author: 'Autor B', category: 'biografia', filename: 'anarquismo/b.pdf' },
        { title: 'Obra sin archivo', author: 'Autor C', year: 1900, category: 'historia', rating: 4.0 }
      ]
    }
  };

  it('renderiza en modo oscuro con clases de tema oscuro', () => {
    const html = renderToStaticMarkup(
      <LibraryView darkMode regionData={regionDataEdge} favorites={[]} onToggleFavorite={noop} />
    );
    expect(html).toContain('bg-gray-900/60');
    expect(html).toContain('text-red-400');
    expect(html).toContain('3 de 3 obras');
  });

  it('muestra guión cuando falta el año y no muestra rating ni resumen si no existen', () => {
    const sinDatos = {
      España: {
        books: [{ title: 'Obra sin año ni rating', author: 'Autor B', category: 'biografia', filename: 'anarquismo/b.pdf' }]
      }
    };
    const html = renderToStaticMarkup(
      <LibraryView darkMode={false} regionData={sinDatos} favorites={[]} onToggleFavorite={noop} />
    );
    expect(html).toContain('Obra sin año ni rating');
    expect(html).toContain('📅 —');
    expect(html).not.toContain('⭐');
    expect(html).not.toContain('Resumen de la obra');
  });

  it('no muestra botón Leer para obras sin archivo', () => {
    const html = renderToStaticMarkup(
      <LibraryView darkMode={false} regionData={regionDataEdge} favorites={[]} onToggleFavorite={noop} />
    );
    // Solo las 2 obras con filename tienen enlace Leer
    expect((html.match(/Leer/g) || []).length).toBe(2);
  });

  it('marca como favorito el corazón de las obras guardadas', () => {
    const html = renderToStaticMarkup(
      <LibraryView darkMode={false} regionData={regionData} favorites={['¿Qué es la Propiedad?']} onToggleFavorite={noop} />
    );
    expect(html).toContain('fill-red-500 text-red-500');
  });
});
