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

  it('muestra los textos relacionados para un evento con_texto', () => {
    const eventConTexto = { ...event, type: 'con_texto', relatedTexts: ['Los Mártires de Chicago'] };
    const regionData = {
      'Estados Unidos': {
        books: [
          { title: 'Los Mártires de Chicago', author: 'Colectivo', year: 1886, category: 'historia', filename: 'a.pdf' },
          { title: 'El origen del 1º de Mayo', author: 'Colectivo', year: 1886, category: 'historia', filename: 'b.pdf' }
        ]
      }
    };
    const html = renderToStaticMarkup(
      <EventModal darkMode event={eventConTexto} regionData={regionData} onClose={() => {}} />
    );
    // Solo el texto VINCULADO por título aparece, no todos los de la región.
    expect(html).toContain('Textos relacionados con este evento');
    expect(html).toContain('Los Mártires de Chicago');
    expect(html).not.toContain('El origen del 1º de Mayo');
    expect(html).toContain('target="_blank"');
  });

  it('no muestra textos para un evento tipo hecho (sin relatedTexts)', () => {
    const eventHecho = { ...event, type: 'hecho' };
    const regionData = {
      'Estados Unidos': {
        books: [
          { title: 'Los Mártires de Chicago', author: 'Colectivo', year: 1886, category: 'historia', filename: 'a.pdf' }
        ]
      }
    };
    const html = renderToStaticMarkup(
      <EventModal darkMode event={eventHecho} regionData={regionData} onClose={() => {}} />
    );
    expect(html).not.toContain('Textos relacionados con este evento');
    expect(html).not.toContain('Los Mártires de Chicago');
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

  it('no renderiza nada si la región no existe en regionData', () => {
    expect(renderToStaticMarkup(
      <RegionModal region="Krypton" regionData={regionData} onClose={() => {}} onToggleFavorite={() => {}} />
    )).toBe('');
  });

  it('tolera regiones sin lista de libros', () => {
    const html = renderToStaticMarkup(
      <RegionModal
        darkMode={false}
        region="España"
        regionData={{ España: { otrosCampos: true } }}
        favorites={[]}
        onClose={() => {}}
        onToggleFavorite={() => {}}
      />
    );
    expect(html).toContain('0 textos históricos');
  });

  it('muestra el resumen de la obra y marca el corazón cuando está en favoritos', () => {
    const dataConResumen = {
      España: {
        books: [{ title: 'Obra A', author: 'Autor A', filename: 'a.pdf', category: 'historia', year: 1900, rating: 4.5, summary: 'Resumen de la obra A' }]
      }
    };
    const html = renderToStaticMarkup(
      <RegionModal
        darkMode={false}
        region={region}
        regionData={dataConResumen}
        favorites={['Obra A']}
        onClose={() => {}}
        onToggleFavorite={() => {}}
      />
    );
    expect(html).toContain('Resumen de la obra A');
    expect(html).toContain('Remover de favoritos');
    expect(html).toContain('fill-red-500 text-red-500');
  });

  it('muestra "Agregar a favoritos" cuando la obra no está guardada', () => {
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
    expect(html).toContain('Agregar a favoritos');
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
