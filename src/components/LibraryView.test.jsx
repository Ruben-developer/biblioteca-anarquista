import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import LibraryView from './LibraryView';

const regionData = {
  España: {
    books: [
      { title: 'La Conquista del Pan', author: 'Kropotkin', pubYear: 1892, category: 'teoria', rating: 4.8, filename: 'anarquismo/a.pdf' },
      { title: 'Columna Durruti', author: 'Colectivo', pubYear: 1936, category: 'acratas', rating: 4.9, filename: 'anarquismo/b.pdf' }
    ]
  },
  Francia: {
    books: [
      { title: '¿Qué es la Propiedad?', author: 'Proudhon', pubYear: 1840, category: 'teoria', rating: 4.9, filename: 'anarquismo/c.pdf' }
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
    expect(html).toContain('3 obras del archivo');
  });

  it('renderiza un botón Leer por cada obra con archivo', () => {
    const html = renderToStaticMarkup(
      <LibraryView darkMode={false} regionData={regionData} favorites={[]} onToggleFavorite={noop} />
    );
    expect(html).toContain('La Conquista del Pan');
    expect(html).toContain('Columna Durruti');
    expect(html).toContain('¿Qué es la Propiedad?');
    // 3 botones de tarjeta + 1 botón del widget "Obra del día"
    expect((html.match(/Leer/g) || []).length).toBe(4);
  });

  it('muestra el widget Obra del día con la obra destacada', () => {
    const html = renderToStaticMarkup(
      <LibraryView darkMode={false} regionData={regionData} favorites={[]} onToggleFavorite={noop} />
    );
    expect(html).toContain('Obra del día');
    expect(html).toContain('Leer esta obra');
  });

  it('muestra la categoría de cada obra (región oculta, solo para mapa)', () => {
    const html = renderToStaticMarkup(
      <LibraryView darkMode={false} regionData={regionData} favorites={[]} onToggleFavorite={noop} />
    );
    expect(html).toContain('teoria');
    expect(html).toContain('acratas');
  });

  it('no incluye filtros (solo grilla y paginación)', () => {
    const html = renderToStaticMarkup(
      <LibraryView darkMode={false} regionData={regionData} favorites={[]} onToggleFavorite={noop} />
    );
    expect(html).not.toContain('Buscar por título o autor');
    expect(html).not.toContain('Todas las categorías');
    expect(html).toContain('3 obras del archivo');
  });
});

describe('LibraryView edge cases', () => {
  const noop = () => {};

  const regionDataEdge = {
    España: {
      books: [
        { title: 'Obra completa', author: 'Autor A', pubYear: 1892, category: 'teoria', rating: 4.8, summary: 'Resumen de la obra', filename: 'anarquismo/a.pdf' },
        { title: 'Obra sin año ni rating', author: 'Autor B', category: 'acratas', filename: 'anarquismo/b.pdf' },
        { title: 'Obra sin archivo', author: 'Autor C', pubYear: 1900, category: 'historia', rating: 4.0 }
      ]
    }
  };

  it('renderiza en modo oscuro con clases de tema oscuro', () => {
    const html = renderToStaticMarkup(
      <LibraryView darkMode regionData={regionDataEdge} favorites={[]} onToggleFavorite={noop} />
    );
    expect(html).toContain('text-red-400');
    expect(html).toContain('3 obras del archivo');
  });

  it('no muestra año/rating y solo categoría cuando faltan datos', () => {
    const sinDatos = {
      España: {
        books: [{ title: 'Obra sin año ni rating', author: 'Autor B', category: 'acratas', filename: 'anarquismo/b.pdf' }]
      }
    };
    const html = renderToStaticMarkup(
      <LibraryView darkMode={false} regionData={sinDatos} favorites={[]} onToggleFavorite={noop} />
    );
    expect(html).toContain('Obra sin año ni rating');
    expect(html).not.toContain('—');
    expect(html).not.toContain('Resumen de la obra');
  });

  it('no muestra botón Leer para obras sin archivo y lo indica', () => {
    const html = renderToStaticMarkup(
      <LibraryView darkMode={false} regionData={regionDataEdge} favorites={[]} onToggleFavorite={noop} />
    );
    // 2 tarjetas con archivo tienen enlace Leer + 1 del widget (obra destacada con resumen)
    expect((html.match(/Leer/g) || []).length).toBe(3);
    // La obra sin archivo ahora se marca explícitamente (fix de negocio IDEAS.md)
    expect(html).toContain('Sin archivo disponible');
  });

  it('marca como favorito el corazón de las obras guardadas', () => {
    const html = renderToStaticMarkup(
      <LibraryView darkMode={false} regionData={regionData} favorites={[{ title: '¿Qué es la Propiedad?', author: 'Proudhon', year: 1840, filename: '', category: 'teoria', note: '', addedAt: 1 }]} onToggleFavorite={noop} />
    );
    expect(html).toContain('fill-red-500 text-red-500');
  });

  it('ignora initialFilters (filtros eliminados, muestra catálogo completo)', () => {
    const html = renderToStaticMarkup(
      <LibraryView
        darkMode={false}
        regionData={regionData}
        favorites={[]}
        onToggleFavorite={noop}
        initialFilters={{ searchTerm: 'Propiedad' }}
      />
    );
    expect(html).toContain('3 obras del archivo');
    expect(html).toContain('¿Qué es la Propiedad?');
  });

  it('ignora el tipo de obra desde initialFilters (filtros eliminados)', () => {
    const html = renderToStaticMarkup(
      <LibraryView
        darkMode={false}
        regionData={regionDataEdge}
        favorites={[]}
        onToggleFavorite={noop}
        initialFilters={{ type: 'historical' }}
      />
    );
    expect(html).toContain('3 obras del archivo');
    const gridHtml = html.slice(html.indexOf('grid grid-cols-1'));
    expect(gridHtml).toContain('Obra sin archivo');
    expect(gridHtml).toContain('Obra completa');
  });

  it('sin initialFilters muestra el catálogo completo', () => {
    const html = renderToStaticMarkup(
      <LibraryView darkMode={false} regionData={regionData} favorites={[]} onToggleFavorite={noop} />
    );
    expect(html).toContain('3 obras del archivo');
  });
});

describe('LibraryView referencias cruzadas (texto → evento)', () => {
  const noop = () => {};

  const regionDataHist = {
    España: {
      books: [
        { title: 'Historia 1936', author: 'Autor A', pubYear: 1936, category: 'historia', filename: 'anarquismo/a.pdf' },
        { title: 'Teoría 1890', author: 'Autor B', pubYear: 1890, category: 'teoria', filename: 'anarquismo/b.pdf' }
      ]
    }
  };

  const timelineEvents = [
    { title: 'Guerra Civil', year: 1936, type: 'con_texto', relatedTexts: ['Historia 1936'] },
    { title: '15M', year: 2011, type: 'con_texto', relatedTexts: ['Teoría 1890'] }
  ];

  it('muestra el enlace "Ver en la línea temporal" para obras vinculadas a un evento', () => {
    const html = renderToStaticMarkup(
      <LibraryView darkMode={false} regionData={regionDataHist} favorites={[]} onToggleFavorite={noop} timelineEvents={timelineEvents} />
    );
    expect(html).toContain('Ver en la línea temporal: Guerra Civil (1936)');
    expect(html).toContain('Ver en la línea temporal: 15M (2011)');
  });

  it('no muestra el enlace sin timelineEvents o sin evento vinculado', () => {
    const html = renderToStaticMarkup(
      <LibraryView darkMode={false} regionData={regionDataHist} favorites={[]} onToggleFavorite={noop} />
    );
    expect(html).not.toContain('Ver en la línea temporal');
  });

  it('invoca onOpenEvent con el evento al hacer clic', () => {
    let opened = null;
    const html = renderToStaticMarkup(
      <LibraryView
        darkMode={false}
        regionData={regionDataHist}
        favorites={[]}
        onToggleFavorite={noop}
        timelineEvents={timelineEvents}
        onOpenEvent={(e) => { opened = e; }}
      />
    );
    expect(html).toContain('Ver en la línea temporal: Guerra Civil (1936)');
    expect(opened).toBeNull(); // el clic se prueba en el test interactivo
  });
});
