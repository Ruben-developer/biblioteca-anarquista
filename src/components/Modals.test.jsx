import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import EventModal from './EventModal';
import RegionModal from './RegionModal';
import TourModal from './TourModal';

describe('EventModal', () => {
  const event = {
    year: 1886,
    title: 'Mártires de Chicago',
    region: 'Estados Unidos',
    image: '⚖️',
    description: 'Texto de prueba',
    quote: 'Cita de prueba'
  };

  it('no renderiza nada si no hay evento', () => {
    expect(renderToStaticMarkup(<EventModal event={null} onClose={() => {}} />)).toBe('');
  });

  it('renderiza el diálogo con role, aria y el título', () => {
    const html = renderToStaticMarkup(
      <EventModal darkMode event={event} onClose={() => {}} />
    );
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain(event.title);
    expect(html).toContain(event.quote);
  });

  it('muestra los textos históricos relacionados de la región del evento', () => {
    const regionData = {
      'Estados Unidos': {
        books: [
          { title: 'Los Mártires de Chicago', author: 'Colectivo', year: 1886, category: 'historia', filename: 'a.pdf' },
          { title: 'El origen del 1º de Mayo', author: 'Colectivo', year: 1886, category: 'historia', filename: 'b.pdf' }
        ]
      }
    };
    const html = renderToStaticMarkup(
      <EventModal darkMode event={event} regionData={regionData} onClose={() => {}} />
    );
    expect(html).toContain('Textos históricos relacionados');
    expect(html).toContain('Los Mártires de Chicago');
    expect(html).toContain('target="_blank"');
  });

  it('no muestra textos si no hay obras históricas en la región', () => {
    const regionData = {
      'Estados Unidos': { books: [] }
    };
    const html = renderToStaticMarkup(
      <EventModal darkMode event={event} regionData={regionData} onClose={() => {}} />
    );
    expect(html).not.toContain('Textos históricos relacionados');
  });

});

describe('RegionModal', () => {
  const region = 'España';
  const regionData = {
    España: {
      books: [{ title: 'Obra A', author: 'Autor A', filename: 'a.pdf', category: 'historia' }]
    }
  };

  it('no renderiza nada si no hay región', () => {
    expect(renderToStaticMarkup(
      <RegionModal region={null} regionData={regionData} onClose={() => {}} onToggleFavorite={() => {}} />
    )).toBe('');
  });

  it('renderiza el diálogo con la región y sus textos', () => {
    const html = renderToStaticMarkup(
      <RegionModal
        darkMode
        region={region}
        regionData={regionData}
        favorites={[]}
        onClose={() => {}}
        onToggleFavorite={() => {}}
      />
    );
    expect(html).toContain('role="dialog"');
    expect(html).toContain('Obra A');
  });
});

describe('TourModal', () => {
  it('renderiza el tour de bienvenida con role dialog', () => {
    const html = renderToStaticMarkup(
      <TourModal darkMode onClose={() => {}} />
    );
    expect(html).toContain('role="dialog"');
    expect(html).toContain('Bienvenido');
    expect(html).toContain('Comenzar');
  });
});
