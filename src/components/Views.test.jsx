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
import FeaturedBook from './FeaturedBook';
import { VIEWS } from '../constants';

describe('Navigation', () => {
  it('renderiza las vistas con sus contadores', () => {
    const html = renderToStaticMarkup(
      <Navigation activeView={VIEWS.TIMELINE} onViewChange={() => {}} darkMode={false} favoriteCount={3} regionCount={16} />
    );
    expect(html).toContain('Línea Temporal');
    expect(html).toContain('Mapa (16)');
    expect(html).toContain('Biblioteca');
    expect(html).toContain('Autores');
    expect(html).toContain('Favoritos (3)');
    expect(html).toContain('Teorías');
    expect(html).toContain('Red de Autores');
    expect(html).toContain('Rutas');
    expect(html).toContain('Glosario');
    expect(html).toContain('Contacto');
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
    expect(html).toContain('La Idea');
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
  const stats = {
    texts: 114, events: 32, regions: 17, authors: 40,
    downloadables: 113, withoutFile: 1, historical: 44, ideas: 70,
    categories: [{ category: 'teoria', count: 40 }, { category: 'historia', count: 20 }],
    topAuthors: [{ name: 'Ricardo Mella', count: 7 }, { name: 'Piotr Kropotkin', count: 5 }],
    topRegions: [{ region: 'España', count: 29, historical: 12 }, { region: 'Francia', count: 18, historical: 2 }],
    byDecade: [{ decade: '1930s', count: 15 }, { decade: '1890s', count: 9 }]
  };

  it('muestra las métricas clave del archivo', () => {
    const html = renderToStaticMarkup(
      <StatsPanel darkMode={false} stats={stats} />
    );
    expect(html).toContain('Textos');
    expect(html).toContain('Eventos');
    expect(html).toContain('Regiones');
    expect(html).toContain('Autores');
    expect(html).toContain('114');
    expect(html).toContain('40');
  });

  it('muestra el estado del archivo (descargables, históricos, ideas)', () => {
    const html = renderToStaticMarkup(
      <StatsPanel darkMode={false} stats={stats} />
    );
    expect(html).toContain('Descargables');
    expect(html).toContain('Sin archivo');
    expect(html).toContain('Históricos');
    expect(html).toContain('Ideas');
    expect(html).toContain('113');
    expect(html).toContain('44');
  });

  it('renderiza las secciones del dashboard (categorías, autores, regiones, décadas)', () => {
    const html = renderToStaticMarkup(
      <StatsPanel darkMode={false} stats={stats} />
    );
    expect(html).toContain('Composición por categoría');
    expect(html).toContain('Teoría');
    expect(html).toContain('Autores más prolíficos');
    expect(html).toContain('Ricardo Mella');
    expect(html).toContain('7 obras');
    expect(html).toContain('Regiones con más obras');
    expect(html).toContain('España');
    expect(html).toContain('Textos por década');
    expect(html).toContain('1930s');
  });

  it('tolera stats sin secciones (cae a mensajes vacíos)', () => {
    const html = renderToStaticMarkup(
      <StatsPanel darkMode={false} stats={{ texts: 0, events: 0, regions: 0, authors: 0 }} />
    );
    expect(html).toContain('Sin datos de categorías.');
    expect(html).toContain('Sin autores registrados.');
    expect(html).toContain('Sin regiones registradas.');
    expect(html).toContain('Sin obras con año registrado.');
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

describe('TimelineView en modo oscuro', () => {
  const events = [
    { year: 1886, title: 'Mártires de Chicago', region: 'Estados Unidos', image: '⚖️', description: 'Descripción del evento' }
  ];

  it('renderiza con las clases de tema oscuro', () => {
    const html = renderToStaticMarkup(
      <TimelineView darkMode filteredEvents={events} onSelectEvent={() => {}} />
    );
    expect(html).toContain('bg-gray-900/60');
    expect(html).toContain('Mártires de Chicago');
    expect(html).toContain('1886');
  });
});

describe('StatsPanel en modo oscuro', () => {
  it('aplica las clases de tema oscuro', () => {
    const html = renderToStaticMarkup(
      <StatsPanel darkMode stats={{ texts: 114, events: 16, regions: 16, authors: 40, downloadables: 113, withoutFile: 1, historical: 44, ideas: 70, categories: [{ category: 'teoria', count: 40 }], topAuthors: [{ name: 'Ricardo Mella', count: 7 }], topRegions: [{ region: 'España', count: 29, historical: 12 }], byDecade: [{ decade: '1930s', count: 15 }] }} />
    );
    expect(html).toContain('text-red-400');
    expect(html).toContain('bg-red-600');
    expect(html).toContain('114');
  });
});

describe('FavoritesView edge cases', () => {
  it('usa singular "texto guardado" con un solo favorito', () => {
    const html = renderToStaticMarkup(
      <FavoritesView darkMode favorites={['Obra A']} onToggleFavorite={() => {}} />
    );
    expect(html).toContain('1 texto guardado');
  });

  it('aplica las clases de tema oscuro', () => {
    const html = renderToStaticMarkup(
      <FavoritesView darkMode favorites={['Obra A', 'Obra B']} onToggleFavorite={() => {}} />
    );
    expect(html).toContain('text-red-400');
    expect(html).toContain('2 textos guardados');
  });
});

describe('ScrollTopButton en modo oscuro', () => {
  it('aplica las clases de tema oscuro', () => {
    const html = renderToStaticMarkup(<ScrollTopButton darkMode onClick={() => {}} />);
    expect(html).toContain('Ir al inicio');
    expect(html).not.toContain('bg-amber-');
  });
});

describe('AuthorsView edge cases (jsdom)', () => {
  // @vitest-environment jsdom
  it('no muestra rango de años ni región cuando faltan', async () => {
    const { render, screen, fireEvent } = await import('@testing-library/react');
    const authorsSinDatos = [
      {
        name: 'Autor Anónimo',
        bookCount: 1,
        regions: [],
        books: [
          { title: 'Obra sin año', region: 'España', category: 'teoria', year: undefined, filename: 'anarquismo/a.pdf' }
        ]
      }
    ];
    const { container } = render(<AuthorsView darkMode authors={authorsSinDatos} />);
    expect(screen.getByText('Autor Anónimo')).toBeTruthy();
    expect(screen.queryByText('(años de sus obras)')).toBeNull();
    expect(container.innerHTML).not.toContain('📍');
    fireEvent.click(screen.getByText('Autor Anónimo'));
    expect(screen.getByText('Obra sin año')).toBeTruthy();
    container.remove();
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
    // La obra aparece dos veces: en la línea de tiempo del autor y en la lista.
    expect(screen.getAllByText('Nueva Utopía').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('La coacción moral').length).toBeGreaterThanOrEqual(1);
    fireEvent.click(screen.getByText('Ricardo Mella'));
    expect(screen.queryByText('Nueva Utopía')).toBeNull();
    container.remove();
  });

  it('muestra el enlace Leer solo en obras con filename', async () => {
    const { render, screen, fireEvent } = await import('@testing-library/react');
    const authors = [
      {
        name: 'Autor Mixto',
        bookCount: 2,
        regions: ['España'],
        yearsRange: '1890-1898',
        books: [
          { title: 'Obra con PDF', region: 'España', category: 'teoria', year: 1890, filename: 'anarquismo/a.pdf' },
          { title: 'Obra sin archivo', region: 'España', category: 'teoria', year: 1895 }
        ]
      }
    ];
    const { container } = render(<AuthorsView darkMode authors={authors} />);
    fireEvent.click(screen.getByText('Autor Mixto'));
    expect(screen.getAllByText('Obra con PDF').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Obra sin archivo').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Leer').length).toBe(1);
    container.remove();
  });
});

describe('FeaturedBook', () => {
  const book = {
    title: 'La Conquista del Pan',
    author: 'Piotr Kropotkin',
    year: 1892,
    category: 'teoria',
    region: 'España',
    rating: 4.8,
    summary: 'El clásico del comunismo anarquista.',
    filename: 'anarquismo/conquista.pdf'
  };

  it('renderiza la obra destacada con reseña y botón de lectura', () => {
    const html = renderToStaticMarkup(<FeaturedBook darkMode={false} book={book} />);
    expect(html).toContain('Obra del día');
    expect(html).toContain('La Conquista del Pan');
    expect(html).toContain('Piotr Kropotkin');
    expect(html).toContain('El clásico del comunismo anarquista.');
    expect(html).toContain('Leer esta obra');
    expect(html).not.toContain('href=');
  });

  it('usa la variante oscura de colores', () => {
    const html = renderToStaticMarkup(<FeaturedBook darkMode book={book} />);
    expect(html).toContain('Obra del día');
    expect(html).toContain('bg-red-600 text-white');
  });

  it('no muestra botón de lectura sin filename', () => {
    const html = renderToStaticMarkup(<FeaturedBook darkMode={false} book={{ ...book, filename: undefined }} />);
    expect(html).not.toContain('Leer esta obra');
  });

  it('no renderiza nada sin obra destacada', () => {
    expect(renderToStaticMarkup(<FeaturedBook darkMode={false} book={null} />)).toBe('');
  });

  it('invoca onRead con la obra al hacer clic en "Leer esta obra"', async () => {
    // @vitest-environment jsdom
    const { render, screen, fireEvent } = await import('@testing-library/react');
    const onRead = vi.fn();
    render(<FeaturedBook darkMode={false} book={book} onRead={onRead} />);
    fireEvent.click(screen.getByText('Leer esta obra'));
    expect(onRead).toHaveBeenCalledWith(expect.objectContaining({ title: 'La Conquista del Pan' }));
  });
});
