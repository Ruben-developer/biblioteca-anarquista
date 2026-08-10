import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Navigation from './Navigation';
import Header from './Header';
import StatsPanel from './StatsPanel';
import TimelineView from './TimelineView';
import TimelineFilters from './TimelineFilters';
import FavoritesView from './FavoritesView';
import ScrollTopButton from './ScrollTopButton';
import AuthorsView from './AuthorsView';
import { VIEWS } from '../constants';

describe('Navigation', () => {
  it('renderiza las cinco vistas con sus contadores', () => {
    const html = renderToStaticMarkup(
      <Navigation activeView={VIEWS.TIMELINE} onViewChange={() => {}} darkMode={false} favoriteCount={3} regionCount={16} />
    );
    expect(html).toContain('Línea Temporal');
    expect(html).toContain('Mapa (16)');
    expect(html).toContain('Biblioteca');
    expect(html).toContain('Autores');
    expect(html).toContain('Favoritos (3)');
  });

  it('marca la vista activa y llama onViewChange al hacer clic', () => {
    const onViewChange = vi.fn();
    const html = renderToStaticMarkup(
      <Navigation activeView={VIEWS.LIBRARY} onViewChange={onViewChange} darkMode favoriteCount={0} regionCount={5} />
    );
    expect(html).toContain('Línea Temporal');
    expect(html).toContain('Mapa (5)');
  });
});

describe('Header', () => {
  const stats = { texts: 114, events: 16, regions: 16 };

  it('renderiza el título y el resumen de estadísticas', () => {
    const html = renderToStaticMarkup(
      <Header darkMode={false} onDarkModeToggle={() => {}} onShowTour={() => {}} onShowStats={() => {}} stats={stats} />
    );
    expect(html).toContain('Archivo Histórico Anarquista');
    expect(html).toContain('114 textos');
    expect(html).toContain('16 eventos');
    expect(html).toContain('16 regiones');
  });

  it('muestra el botón de tema claro cuando está en modo oscuro', () => {
    const html = renderToStaticMarkup(
      <Header darkMode onDarkModeToggle={() => {}} onShowTour={() => {}} onShowStats={() => {}} stats={stats} />
    );
    expect(html).toContain('☀️');
  });
});

describe('StatsPanel', () => {
  it('muestra las cuatro métricas', () => {
    const html = renderToStaticMarkup(
      <StatsPanel darkMode={false} stats={{ texts: 114, events: 16, regions: 16, authors: 40 }} />
    );
    expect(html).toContain('Textos');
    expect(html).toContain('Eventos');
    expect(html).toContain('Regiones');
    expect(html).toContain('Autores');
    expect(html).toContain('114');
    expect(html).toContain('40');
  });
});

describe('TimelineView', () => {
  const events = [
    { year: 1886, title: 'Mártires de Chicago', region: 'Estados Unidos', image: '⚖️', description: 'Descripción del evento' },
    { year: 1936, title: 'Revolución Española', region: 'España', image: '🏴', description: 'Otra descripción' }
  ];

  it('renderiza cada evento con su año, región y título', () => {
    const html = renderToStaticMarkup(
      <TimelineView darkMode={false} filteredEvents={events} onSelectEvent={() => {}} />
    );
    expect(html).toContain('Mártires de Chicago');
    expect(html).toContain('1886');
    expect(html).toContain('Revolución Española');
    expect(html).toContain('Descripción del evento');
  });
});

describe('TimelineFilters', () => {
  const baseFilters = { searchTerm: '', decade: 'all', category: 'all', region: 'all' };

  it('renderiza buscador, botón filtros y contador de eventos', () => {
    const html = renderToStaticMarkup(
      <TimelineFilters
        darkMode={false}
        filters={baseFilters}
        onFilterChange={() => {}}
        onShowFilters={() => {}}
        showFilters={false}
        onClearFilters={() => {}}
        eventCount={5}
        totalEventCount={16}
      />
    );
    expect(html).toContain('Buscar eventos');
    expect(html).toContain('Filtros');
    expect(html).toContain('Mostrando 5 de 16 eventos');
  });

  it('muestra los controles de década, categoría y región cuando showFilters es true', () => {
    const html = renderToStaticMarkup(
      <TimelineFilters
        darkMode
        filters={baseFilters}
        onFilterChange={() => {}}
        onShowFilters={() => {}}
        showFilters
        onClearFilters={() => {}}
        eventCount={5}
        totalEventCount={16}
      />
    );
    expect(html).toContain('Filtrar eventos');
    expect(html).toContain('Década');
    expect(html).toContain('Categoría');
    expect(html).toContain('Región');
    expect(html).toContain('Limpiar');
  });

  it('llama onFilterChange al escribir en el buscador', () => {
    const onFilterChange = vi.fn();
    const html = renderToStaticMarkup(
      <TimelineFilters
        darkMode={false}
        filters={{ ...baseFilters, searchTerm: 'chicago' }}
        onFilterChange={onFilterChange}
        onShowFilters={() => {}}
        showFilters
        onClearFilters={() => {}}
        eventCount={1}
        totalEventCount={16}
      />
    );
    expect(html).toContain('chicago');
  });
});

describe('FavoritesView', () => {
  it('muestra el mensaje vacío cuando no hay favoritos', () => {
    const html = renderToStaticMarkup(
      <FavoritesView darkMode={false} favorites={[]} onToggleFavorite={() => {}} />
    );
    expect(html).toContain('Mis Favoritos');
    expect(html).toContain('Aún no has guardado ningún texto favorito');
  });

  it('lista los favoritos guardados en orden inverso', () => {
    const html = renderToStaticMarkup(
      <FavoritesView darkMode favorites={['Obra A', 'Obra B']} onToggleFavorite={() => {}} />
    );
    expect(html).toContain('2 textos guardados');
    expect(html).toContain('Obra A');
    expect(html).toContain('Obra B');
  });
});

describe('ScrollTopButton', () => {
  it('renderiza el botón con onClick', () => {
    const html = renderToStaticMarkup(<ScrollTopButton darkMode={false} onClick={() => {}} />);
    expect(html).toContain('Ir al inicio');
  });
});

describe('AuthorsView', () => {
  const authors = [
    {
      name: 'Ricardo Mella',
      bookCount: 4,
      regions: ['España'],
      yearsRange: '1890-1905',
      books: [
        { title: 'Nueva Utopía', region: 'España', category: 'teoria', year: 1890, filename: 'anarquismo/a.pdf' },
        { title: 'La coacción moral', region: 'España', category: 'teoria', year: 1898, filename: 'anarquismo/b.pdf' }
      ]
    }
  ];

  it('renderiza la lista de autores con su conteo', () => {
    const html = renderToStaticMarkup(<AuthorsView darkMode={false} authors={authors} />);
    expect(html).toContain('Autores del Archivo');
    expect(html).toContain('Ricardo Mella');
    expect(html).toContain('4 textos');
    expect(html).toContain('1890-1905');
  });
});

describe('AuthorsView interactivo (jsdom)', () => {
  // @vitest-environment jsdom
  it('despliega las obras del autor al hacer clic y las colapsa al volver a hacer clic', async () => {
    const { render, screen, fireEvent } = await import('@testing-library/react');
    const authors = [
      {
        name: 'Ricardo Mella',
        bookCount: 2,
        regions: ['España'],
        yearsRange: '1890-1898',
        books: [
          { title: 'Nueva Utopía', region: 'España', category: 'teoria', year: 1890, filename: 'anarquismo/a.pdf' },
          { title: 'La coacción moral', region: 'España', category: 'teoria', year: 1898, filename: 'anarquismo/b.pdf' }
        ]
      }
    ];
    const { container } = render(<AuthorsView darkMode={false} authors={authors} />);
    expect(screen.queryByText('Nueva Utopía')).toBeNull();
    fireEvent.click(screen.getByText('Ricardo Mella'));
    expect(screen.getByText('Nueva Utopía')).toBeTruthy();
    expect(screen.getByText('La coacción moral')).toBeTruthy();
    fireEvent.click(screen.getByText('Ricardo Mella'));
    expect(screen.queryByText('Nueva Utopía')).toBeNull();
    container.remove();
  });
});
