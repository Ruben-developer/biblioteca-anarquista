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
