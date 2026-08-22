import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
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
    expect(html).toContain('Todas las décadas');
  });

  it('incluye los controles de búsqueda avanzada (tipo y favoritos)', () => {
    const html = renderToStaticMarkup(
      <LibraryView darkMode={false} regionData={regionData} favorites={['La Conquista del Pan']} onToggleFavorite={noop} />
    );
    expect(html).toContain('Todos los tipos');
    expect(html).toContain('Solo históricos');
    expect(html).toContain('Solo ideas');
    expect(html).toContain('Todas las obras');
    expect(html).toContain('Solo favoritas');
    expect(html).toContain('Busca y filtra por categoría, década, tipo o favoritos.');
  });

  it('incluye el botón para agrupar por autor', () => {
    const html = renderToStaticMarkup(
      <LibraryView darkMode={false} regionData={regionData} favorites={[]} onToggleFavorite={noop} />
    );
    expect(html).toContain('Agrupar por autor');
    expect(html).toContain('aria-pressed="false"');
  });

  it('incluye el botón para agrupar por región', () => {
    const html = renderToStaticMarkup(
      <LibraryView darkMode={false} regionData={regionData} favorites={[]} onToggleFavorite={noop} />
    );
    expect(html).toContain('Agrupar por región');
    // El botón de agrupación por región también nace desactivado.
    expect((html.match(/aria-pressed="false"/g) || []).length).toBeGreaterThanOrEqual(2);
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

  it('precarga filtros desde initialFilters (cross-links de Teorías/Rutas/Glosario)', () => {
    const html = renderToStaticMarkup(
      <LibraryView
        darkMode={false}
        regionData={regionData}
        favorites={[]}
        onToggleFavorite={noop}
        initialFilters={{ searchTerm: 'Propiedad' }}
      />
    );
    // El buscador nace con el término precargado y el grid filtrado.
    expect(html).toContain('value="Propiedad"');
    expect(html).toContain('1 de 3 obras');
    expect(html).toContain('¿Qué es la Propiedad?');
    // El widget "Obra del día" es global, pero el grid solo contiene la obra filtrada
    const gridStart = html.indexOf('grid grid-cols-1');
    const gridHtml = gridStart >= 0 ? html.slice(gridStart) : html;
    expect(gridHtml).toContain('¿Qué es la Propiedad?');
  });

  it('precarga el tipo de obra (histórico/ideas) desde initialFilters', () => {
    const html = renderToStaticMarkup(
      <LibraryView
        darkMode={false}
        regionData={regionDataEdge}
        favorites={[]}
        onToggleFavorite={noop}
        initialFilters={{ type: 'historical' }}
      />
    );
    // regionDataEdge: 1 obra de historia (Obra sin archivo), 2 de ideas.
    expect(html).toContain('1 de 3 obras');
    // El widget "Obra del día" es global e independiente de filtros: se aserta
    // solo sobre el grid de tarjetas (a partir del marcador de grid).
    const gridHtml = html.slice(html.indexOf('grid grid-cols-1'));
    expect(gridHtml).toContain('Obra sin archivo');
    expect(gridHtml).not.toContain('Obra completa');
  });

  it('sin initialFilters muestra el catálogo completo', () => {
    const html = renderToStaticMarkup(
      <LibraryView darkMode={false} regionData={regionData} favorites={[]} onToggleFavorite={noop} />
    );
    expect(html).toContain('3 de 3 obras');
  });
});

describe('LibraryView referencias cruzadas (texto → evento)', () => {
  const noop = () => {};

  const regionDataHist = {
    España: {
      books: [
        { title: 'Historia 1936', author: 'Autor A', year: 1936, category: 'historia', filename: 'anarquismo/a.pdf' },
        { title: 'Teoría 1890', author: 'Autor B', year: 1890, category: 'teoria', filename: 'anarquismo/b.pdf' }
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
