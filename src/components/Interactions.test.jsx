// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import TimelineFilters from './TimelineFilters';
import TourModal from './TourModal';
import EventModal from './EventModal';
import RegionModal from './RegionModal';
import LibraryView from './LibraryView';
import AnarchistArchive from './AnarchistArchive';

afterEach(cleanup);

describe('TimelineFilters interactivo', () => {
  const baseFilters = { searchTerm: '', decade: 'all', category: 'all', region: 'all' };

  it('llama onFilterChange con el término al escribir en el buscador', () => {
    const onFilterChange = vi.fn();
    render(
      <TimelineFilters
        darkMode={false}
        filters={baseFilters}
        onFilterChange={onFilterChange}
        onShowFilters={() => {}}
        showFilters
        onClearFilters={() => {}}
        eventCount={5}
        totalEventCount={16}
      />
    );
    fireEvent.change(screen.getByPlaceholderText('Buscar eventos...'), { target: { value: 'chicago' } });
    expect(onFilterChange).toHaveBeenCalledWith({ ...baseFilters, searchTerm: 'chicago' });
  });

  it('llama onFilterChange con la década al pulsar un botón de década', () => {
    const onFilterChange = vi.fn();
    render(
      <TimelineFilters
        darkMode={false}
        filters={baseFilters}
        onFilterChange={onFilterChange}
        onShowFilters={() => {}}
        showFilters
        onClearFilters={() => {}}
        eventCount={5}
        totalEventCount={16}
      />
    );
    fireEvent.click(screen.getByText('1930s'));
    expect(onFilterChange).toHaveBeenCalledWith({ ...baseFilters, decade: '1930s' });
  });

  it('llama onFilterChange con la categoría al pulsar un botón de categoría', () => {
    const onFilterChange = vi.fn();
    render(
      <TimelineFilters
        darkMode={false}
        filters={baseFilters}
        onFilterChange={onFilterChange}
        onShowFilters={() => {}}
        showFilters
        onClearFilters={() => {}}
        eventCount={5}
        totalEventCount={16}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Historia/ }));
    expect(onFilterChange).toHaveBeenCalledWith({ ...baseFilters, category: 'historia' });
  });

  it('llama onFilterChange con la región al pulsar un botón de región', () => {
    const onFilterChange = vi.fn();
    render(
      <TimelineFilters
        darkMode={false}
        filters={baseFilters}
        onFilterChange={onFilterChange}
        onShowFilters={() => {}}
        showFilters
        onClearFilters={() => {}}
        eventCount={5}
        totalEventCount={16}
      />
    );
    fireEvent.click(screen.getByText('Francia'));
    expect(onFilterChange).toHaveBeenCalledWith({ ...baseFilters, region: 'Francia' });
  });

  it('llama onShowFilters y onClearFilters con sus botones', () => {
    const onShowFilters = vi.fn();
    const onClearFilters = vi.fn();
    render(
      <TimelineFilters
        darkMode={false}
        filters={{ ...baseFilters, searchTerm: 'x' }}
        onFilterChange={() => {}}
        onShowFilters={onShowFilters}
        showFilters
        onClearFilters={onClearFilters}
        eventCount={5}
        totalEventCount={16}
      />
    );
    fireEvent.click(screen.getByText('Filtros'));
    expect(onShowFilters).toHaveBeenCalled();
    fireEvent.click(screen.getByText('Limpiar'));
    expect(onClearFilters).toHaveBeenCalled();
  });
});

describe('TourModal interactivo', () => {
  it('cierra al hacer clic en el fondo (backdrop)', () => {
    const onClose = vi.fn();
    const { container } = render(<TourModal darkMode={false} onClose={onClose} />);
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalled();
    container.remove();
  });

  it('cierra al pulsar Escape', () => {
    const onClose = vi.fn();
    const { container } = render(<TourModal darkMode={false} onClose={onClose} />);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
    container.remove();
  });

  it('cierra al pulsar el botón ¡Comenzar!', () => {
    const onClose = vi.fn();
    const { container } = render(<TourModal darkMode={false} onClose={onClose} />);
    fireEvent.click(screen.getByText('¡Comenzar!'));
    expect(onClose).toHaveBeenCalled();
    container.remove();
  });
});

describe('EventModal interactivo', () => {
  const event = {
    year: 1886,
    title: 'Mártires de Chicago',
    region: 'Estados Unidos',
    image: '⚖️',
    description: 'Descripción',
    quote: 'Cita',
    author: 'Autor'
  };

  it('cierra al hacer clic en el fondo y al pulsar Escape', () => {
    const onClose = vi.fn();
    const { container } = render(<EventModal darkMode={false} event={event} onClose={onClose} />);
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
    container.remove();
  });
});

describe('RegionModal interactivo', () => {
  const regionData = {
    España: {
      books: [
        { title: 'La Columna', author: 'Autor', year: 1936, category: 'historia', filename: 'a.pdf', rating: 4 },
        { title: 'Un ensayo', author: 'Otro', year: 1890, category: 'teoria', filename: 'b.pdf', rating: 3 }
      ]
    }
  };

  it('cierra al hacer clic en el fondo', () => {
    const onClose = vi.fn();
    const { container } = render(
      <RegionModal darkMode={false} region="España" regionData={regionData} favorites={[]} onClose={onClose} onToggleFavorite={() => {}} />
    );
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalled();
    container.remove();
  });

  it('solo muestra textos históricos y alterna favorito al pulsar el corazón', () => {
    const onToggleFavorite = vi.fn();
    const { container } = render(
      <RegionModal darkMode={false} region="España" regionData={regionData} favorites={[]} onClose={() => {}} onToggleFavorite={onToggleFavorite} />
    );
    expect(screen.getByText('La Columna')).toBeTruthy();
    expect(screen.queryByText('Un ensayo')).toBeNull();
    fireEvent.click(screen.getByTitle('Agregar a favoritos'));
    expect(onToggleFavorite).toHaveBeenCalledWith('La Columna');
    container.remove();
  });
});

describe('LibraryView interactivo', () => {
  const regionData = {
    España: {
      books: [
        { title: 'La Conquista del Pan', author: 'Kropotkin', year: 1892, category: 'teoria', rating: 4.8, filename: 'anarquismo/a.pdf' },
        { title: 'Columna Durruti', author: 'Colectivo', year: 1936, category: 'historia', rating: 4.9, filename: 'anarquismo/b.pdf' }
      ]
    },
    Francia: {
      books: [
        { title: '¿Qué es la Propiedad?', author: 'Proudhon', year: 1840, category: 'teoria', rating: 4.9, filename: 'anarquismo/c.pdf' }
      ]
    }
  };
  const noop = () => {};

  it('filtra por búsqueda y muestra el contador actualizado', () => {
    const { container } = render(<LibraryView darkMode={false} regionData={regionData} favorites={[]} onToggleFavorite={noop} />);
    fireEvent.change(screen.getByLabelText('Buscar obra'), { target: { value: 'Pan' } });
    expect(screen.getByText('1 de 3 obras del archivo. Busca y filtra por categoría, región, década, autor, disponibilidad, tipo o favoritos.')).toBeTruthy();
    // Se consulta el grid de tarjetas: el widget "Obra del día" es global y no
    // depende de los filtros (puede mostrar cualquier título).
    const grid = container.querySelector('div.grid');
    expect(grid.textContent).toContain('La Conquista del Pan');
    expect(grid.textContent).not.toContain('Columna Durruti');
    container.remove();
  });

  it('filtra por región, década y categoría con los selectores', () => {
    const { container } = render(<LibraryView darkMode={false} regionData={regionData} favorites={[]} onToggleFavorite={noop} />);
    const grid = container.querySelector('div.grid');
    fireEvent.change(screen.getByLabelText('Filtrar por región'), { target: { value: 'España' } });
    expect(grid.textContent).not.toContain('¿Qué es la Propiedad?');
    expect(grid.textContent).toContain('La Conquista del Pan');
    fireEvent.change(screen.getByLabelText('Filtrar por década'), { target: { value: '1890s' } });
    expect(screen.getByText('1 de 3 obras del archivo. Busca y filtra por categoría, región, década, autor, disponibilidad, tipo o favoritos.')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Filtrar por categoría'), { target: { value: 'teoria' } });
    // Sigue quedando La Conquista del Pan (España, 1892, teoría); Columna Durruti (1936) queda fuera por década.
    expect(grid.textContent).toContain('La Conquista del Pan');
    expect(grid.textContent).not.toContain('Columna Durruti');
    container.remove();
  });

  it('muestra el estado vacío cuando no hay coincidencias y limpia con el botón', () => {
    const { container } = render(<LibraryView darkMode={false} regionData={regionData} favorites={[]} onToggleFavorite={noop} />);
    fireEvent.change(screen.getByLabelText('Buscar obra'), { target: { value: 'noexiste' } });
    expect(screen.getByText('No hay obras que coincidan con los filtros.')).toBeTruthy();
    fireEvent.click(screen.getByText('Limpiar filtros'));
    expect(screen.getByText('3 de 3 obras del archivo. Busca y filtra por categoría, región, década, autor, disponibilidad, tipo o favoritos.')).toBeTruthy();
    container.remove();
  });

  it('filtra por disponibilidad y tipo de obra con los selectores', () => {
    const { container } = render(<LibraryView darkMode={false} regionData={regionData} favorites={[]} onToggleFavorite={noop} />);
    const grid = container.querySelector('div.grid');
    // Todas las obras del fixture tienen archivo → "Solo con archivo" mantiene las 3.
    fireEvent.change(screen.getByLabelText('Filtrar por disponibilidad'), { target: { value: 'withFile' } });
    expect(screen.getByText('3 de 3 obras del archivo. Busca y filtra por categoría, región, década, autor, disponibilidad, tipo o favoritos.')).toBeTruthy();
    // "Solo históricos" deja únicamente Columna Durruti (categoría historia).
    fireEvent.change(screen.getByLabelText('Filtrar por tipo de obra'), { target: { value: 'historical' } });
    expect(grid.textContent).toContain('Columna Durruti');
    expect(grid.textContent).not.toContain('La Conquista del Pan');
    expect(grid.textContent).not.toContain('¿Qué es la Propiedad?');
    // "Solo sin archivo" deja el grid vacío (todas tienen archivo).
    fireEvent.change(screen.getByLabelText('Filtrar por disponibilidad'), { target: { value: 'withoutFile' } });
    expect(screen.getByText('No hay obras que coincidan con los filtros.')).toBeTruthy();
    container.remove();
  });

  it('filtra por autor con el selector dedicado', () => {
    const { container } = render(<LibraryView darkMode={false} regionData={regionData} favorites={[]} onToggleFavorite={noop} />);
    const grid = container.querySelector('div.grid');
    fireEvent.change(screen.getByLabelText('Filtrar por autor'), { target: { value: 'Kropotkin' } });
    expect(grid.textContent).toContain('La Conquista del Pan');
    expect(grid.textContent).not.toContain('Columna Durruti');
    expect(grid.textContent).not.toContain('¿Qué es la Propiedad?');
    // El botón "Limpiar filtros" aparece con el filtro de autor activo y lo resetea.
    fireEvent.click(screen.getByText('Limpiar filtros'));
    expect(screen.getByText('3 de 3 obras del archivo. Busca y filtra por categoría, región, década, autor, disponibilidad, tipo o favoritos.')).toBeTruthy();
    container.remove();
  });

  it('filtra solo favoritas y lo combina con la búsqueda', () => {
    const favorites = ['La Conquista del Pan', '¿Qué es la Propiedad?'];
    const { container } = render(<LibraryView darkMode={false} regionData={regionData} favorites={favorites} onToggleFavorite={noop} />);
    const grid = container.querySelector('div.grid');
    fireEvent.change(screen.getByLabelText('Filtrar por favoritos'), { target: { value: 'favorites' } });
    expect(grid.textContent).toContain('La Conquista del Pan');
    expect(grid.textContent).toContain('¿Qué es la Propiedad?');
    expect(grid.textContent).not.toContain('Columna Durruti');
    // Combinado con la búsqueda: queda una sola favorita.
    fireEvent.change(screen.getByLabelText('Buscar obra'), { target: { value: 'Pan' } });
    expect(grid.textContent).toContain('La Conquista del Pan');
    expect(grid.textContent).not.toContain('¿Qué es la Propiedad?');
    container.remove();
  });

  it('llama onToggleFavorite al pulsar el corazón de una obra', () => {
    const onToggleFavorite = vi.fn();
    const { container } = render(<LibraryView darkMode={false} regionData={regionData} favorites={[]} onToggleFavorite={onToggleFavorite} />);
    const grid = container.querySelector('div.grid');
    const card = Array.from(grid.querySelectorAll('div.rounded-lg')).find((el) => el.textContent.includes('La Conquista del Pan'));
    fireEvent.click(within(card).getByTitle('Agregar a favoritos'));
    expect(onToggleFavorite).toHaveBeenCalledWith('La Conquista del Pan');
    container.remove();
  });

  it('abre el evento de la línea temporal al pulsar "Ver en la línea temporal"', () => {
    const onOpenEvent = vi.fn();
    const timelineEvents = [
      { title: 'Columna Durruti', year: 1936, type: 'con_texto', relatedTexts: ['Columna Durruti'] }
    ];
    const { container } = render(
      <LibraryView
        darkMode={false}
        regionData={regionData}
        favorites={[]}
        onToggleFavorite={noop}
        timelineEvents={timelineEvents}
        onOpenEvent={onOpenEvent}
      />
    );
    fireEvent.click(screen.getByText('Ver en la línea temporal: Columna Durruti (1936)'));
    expect(onOpenEvent).toHaveBeenCalledTimes(1);
    expect(onOpenEvent).toHaveBeenCalledWith(timelineEvents[0]);
    container.remove();
  });

  it('agrupa las obras por autor al pulsar el botón y desagrupa al pulsarlo de nuevo', () => {
    const { container } = render(<LibraryView darkMode={false} regionData={regionData} favorites={[]} onToggleFavorite={noop} />);
    // Vista normal: grid de tarjetas individuales.
    const grid = container.querySelector('div.grid');
    expect(grid.textContent).toContain('La Conquista del Pan');
    expect(grid.textContent).toContain('¿Qué es la Propiedad?');

    // Vista agrupada: una tarjeta por autor (Kropotkin agrupa su obra, Proudhon la suya).
    fireEvent.click(screen.getByRole('button', { name: /Agrupar por autor/ }));
    const grouped = container.querySelector('div.flex.flex-col.gap-4');
    expect(grouped).toBeTruthy();
    expect(grouped.textContent).toContain('Kropotkin');
    expect(grouped.textContent).toContain('La Conquista del Pan');
    expect(grouped.textContent).toContain('Proudhon');
    expect(grouped.textContent).toContain('¿Qué es la Propiedad?');
    expect(grouped.textContent).toContain('1 obra');

    // Desagrupar: vuelve al grid.
    fireEvent.click(screen.getByRole('button', { name: /Desagrupar/ }));
    expect(container.querySelector('div.flex.flex-col.gap-4')).toBeNull();
    expect(container.querySelector('div.grid')).toBeTruthy();
    container.remove();
  });

  it('la vista agrupada respeta los filtros activos', () => {
    const { container } = render(<LibraryView darkMode={false} regionData={regionData} favorites={[]} onToggleFavorite={noop} />);
    fireEvent.change(screen.getByLabelText('Filtrar por autor'), { target: { value: 'Kropotkin' } });
    fireEvent.click(screen.getByRole('button', { name: /Agrupar por autor/ }));
    const grouped = container.querySelector('div.flex.flex-col.gap-4');
    expect(grouped.textContent).toContain('Kropotkin');
    expect(grouped.textContent).toContain('La Conquista del Pan');
    expect(grouped.textContent).not.toContain('¿Qué es la Propiedad?');
    container.remove();
  });

  it('agrupa las obras por región al pulsar el botón y desagrupa al pulsarlo de nuevo', () => {
    const { container } = render(<LibraryView darkMode={false} regionData={regionData} favorites={[]} onToggleFavorite={noop} />);
    // Vista normal: grid de tarjetas individuales.
    const grid = container.querySelector('div.grid');
    expect(grid.textContent).toContain('La Conquista del Pan');
    expect(grid.textContent).toContain('¿Qué es la Propiedad?');

    // Vista agrupada: una tarjeta por región (España agrupa su obra, Francia la suya).
    fireEvent.click(screen.getByRole('button', { name: /Agrupar por región/ }));
    const grouped = container.querySelector('div.flex.flex-col.gap-4');
    expect(grouped).toBeTruthy();
    expect(grouped.textContent).toContain('España');
    expect(grouped.textContent).toContain('La Conquista del Pan');
    expect(grouped.textContent).toContain('Francia');
    expect(grouped.textContent).toContain('¿Qué es la Propiedad?');
    expect(grouped.textContent).toContain('2 obras');
    expect(grouped.textContent).toContain('1 obra');

    // Desagrupar: vuelve al grid.
    fireEvent.click(screen.getByRole('button', { name: /Desagrupar/ }));
    expect(container.querySelector('div.flex.flex-col.gap-4')).toBeNull();
    expect(container.querySelector('div.grid')).toBeTruthy();
    container.remove();
  });

  it('la vista agrupada por región respeta el filtro de región activo', () => {
    const { container } = render(<LibraryView darkMode={false} regionData={regionData} favorites={[]} onToggleFavorite={noop} />);
    fireEvent.change(screen.getByLabelText('Filtrar por región'), { target: { value: 'España' } });
    fireEvent.click(screen.getByRole('button', { name: /Agrupar por región/ }));
    const grouped = container.querySelector('div.flex.flex-col.gap-4');
    expect(grouped.textContent).toContain('España');
    expect(grouped.textContent).toContain('La Conquista del Pan');
    expect(grouped.textContent).not.toContain('¿Qué es la Propiedad?');
    container.remove();
  });
});

describe('AnarchistArchive interactivo (navegación completa)', () => {
  it('navega a Biblioteca y filtra una obra desde el buscador', () => {
    const { container } = render(<AnarchistArchive />);
    fireEvent.click(screen.getByRole('button', { name: /Biblioteca/ }));
    expect(screen.getAllByText('Biblioteca').length).toBeGreaterThan(0);
    fireEvent.change(screen.getByLabelText('Buscar obra'), { target: { value: 'Kropotkin' } });
    expect(screen.getAllByText(/Kropotkin/).length).toBeGreaterThan(0);
    container.remove();
  });

it('abre un evento de la línea temporal y cierra el modal con Escape', () => {
    const { container } = render(<AnarchistArchive />);
    const eventButton = screen.getAllByText(/Semana Trágica|Mártires|Revolución|huelga|Jornadas|zapatista|Seattle|Génova|15M|Rojava|Kronstadt|Comuna|Española|Primero|Chicago|Barcelona/)[0];
    fireEvent.click(eventButton);
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    container.remove();
  });

  it('referencia cruzada: desde la Biblioteca abre el evento en la línea temporal', () => {
    const { container } = render(<AnarchistArchive />);
    fireEvent.click(screen.getByRole('button', { name: /Biblioteca/ }));
    const link = screen.getAllByText(/Ver en la línea temporal:/)[0];
    const eventTitle = link.textContent.replace('Ver en la línea temporal: ', '').split(' (')[0];
    fireEvent.click(link);
    // Cambia a la vista Línea Temporal y abre el modal del evento agrupador.
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getAllByText(eventTitle).length).toBeGreaterThan(0);
    container.remove();
  });

  it('abre y cierra el tour de bienvenida', () => {
    const { container } = render(<AnarchistArchive />);
    fireEvent.click(screen.getByTitle('Información y tour'));
    expect(screen.getByText('Bienvenido')).toBeTruthy();
    fireEvent.click(screen.getByText('¡Comenzar!'));
    expect(screen.queryByText('Bienvenido')).toBeNull();
    container.remove();
  });
});
