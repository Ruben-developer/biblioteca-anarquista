import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import WorldMapView from './WorldMapView';
import { regionData } from '../data/regionData';

describe('WorldMapView (gradiente por nº de textos)', () => {
  const noop = () => {};

  it('renderiza la leyenda de gradiente de colores', () => {
    const html = renderToStaticMarkup(
      <WorldMapView darkMode={false} regionData={regionData} onSelectRegion={noop} />
    );
    expect(html).toContain('Pocos textos');
    expect(html).toContain('Muchos textos');
    expect(html).toContain('linear-gradient');
  });

  const getFill = (html, ariaLabel) => {
    const pathMatch = html.match(
      new RegExp(`style="([^"]*)"[^>]*aria-label="${ariaLabel}"`)
    );
    if (!pathMatch) return null;
    const fillMatch = pathMatch[1].match(/fill:(#[0-9a-fA-F]{6}|rgb\([^)]*\))/);
    return fillMatch ? fillMatch[1] : null;
  };

  const brightness = (fill) => {
    const [r, g, b] = fill.startsWith('#')
      ? [parseInt(fill.slice(1, 3), 16), parseInt(fill.slice(3, 5), 16), parseInt(fill.slice(5, 7), 16)]
      : fill.match(/rgb\((\d+), (\d+), (\d+)\)/).slice(1).map(Number);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  it('el país con más textos históricos (España, 9) usa el color más oscuro', () => {
    const html = renderToStaticMarkup(
      <WorldMapView darkMode={false} regionData={regionData} onSelectRegion={noop} />
    );
    const fill = getFill(html, 'España');
    expect(fill).not.toBeNull();
    expect(brightness(fill)).toBeLessThan(180);
  });

  it('el país con menos textos históricos (Alemania, 1) usa un color más claro', () => {
    const html = renderToStaticMarkup(
      <WorldMapView darkMode={false} regionData={regionData} onSelectRegion={noop} />
    );
    const fill = getFill(html, 'Alemania');
    expect(fill).not.toBeNull();
    expect(brightness(fill)).toBeGreaterThan(180);
  });

  it('Alemania (1 texto histórico) es más claro que España (9 textos históricos)', () => {
    const html = renderToStaticMarkup(
      <WorldMapView darkMode={false} regionData={regionData} onSelectRegion={noop} />
    );
    const deBright = brightness(getFill(html, 'Alemania'));
    const esBright = brightness(getFill(html, 'España'));
    expect(deBright).toBeGreaterThan(esBright);
  });
});

describe('WorldMapView edge cases', () => {
  const noop = () => {};

  it('renderiza en modo oscuro con colores de tema oscuro', () => {
    const html = renderToStaticMarkup(
      <WorldMapView darkMode regionData={regionData} onSelectRegion={noop} />
    );
    expect(html).toContain('bg-gray-900/60');
    expect(html).toContain('linear-gradient(to right, #fca5a5, #7f1d1d)');
    expect(html).toContain('Pocos textos');
    expect(html).toContain('Muchos textos');
  });

  it('ignora regiones sin código ISO en el mapamundi pero las lista como botón', () => {
    const dataConRegionSinISO = {
      ...regionData,
      'Tierra de Nadie': {
        books: [{ title: 'Obra X', author: 'Autor', year: 1900, category: 'historia' }]
      }
    };
    const html = renderToStaticMarkup(
      <WorldMapView darkMode={false} regionData={dataConRegionSinISO} onSelectRegion={noop} />
    );
    // La región sin ISO aparece como botón de navegación (tiene 1 histórico)...
    expect(html).toContain('Tierra de Nadie');
    // ...con el singular correcto
    expect(html).toContain('1 texto histórico');
  });

  it('tolera regiones sin lista de libros', () => {
    const dataSinBooks = {
      ...regionData,
      'Atlántida': { sinBooks: true }
    };
    const html = renderToStaticMarkup(
      <WorldMapView darkMode={false} regionData={dataSinBooks} onSelectRegion={noop} />
    );
    // Sin libros no hay textos históricos → la región NO genera tarjeta ni se pinta.
    expect(html).not.toContain('Atlántida');
    expect(html).not.toContain('0 textos históricos');
  });
});

describe('WorldMapView — países con 0 textos históricos no se marcan en el mapa', () => {
  const noop = () => {};

  it('Inglaterra (solo textos de teoría) queda en gris y no recibe color de gradiente', () => {
    const html = renderToStaticMarkup(
      <WorldMapView darkMode={false} regionData={regionData} onSelectRegion={noop} />
    );
    // Inglaterra existe en regionData e ISO='gb' pero sus 3 libros son de teoría
    // (no históricos) → value 0. El mapa debe tratarla como país sin textos:
    // su path usa el gris por defecto, NO un fill de gradiente (que va en rápido a color).
    const engMatch = html.match(/style="([^"]*)"[^>]*aria-label="Reino Unido"/);
    expect(engMatch).not.toBeNull();
    expect(engMatch[1]).toContain('#e7e5e4'); // gris por defecto en modo claro
    expect(engMatch[1]).not.toMatch(/rgb\(/);
    // Regla de negocio: con 0 textos históricos, Inglaterra NO genera tarjeta
    // en "O navega por región" (solo aparecen regiones con ≥1 histórico).
    expect(html).not.toContain('Inglaterra');
    expect(html).not.toContain('0 textos históricos');
  });

  it('España (con textos históricos) sí recibe color de gradiente en el mapa', () => {
    const html = renderToStaticMarkup(
      <WorldMapView darkMode={false} regionData={regionData} onSelectRegion={noop} />
    );
    const esMatch = html.match(/style="([^"]*)"[^>]*aria-label="España"/);
    expect(esMatch).not.toBeNull();
    expect(esMatch[1]).toMatch(/rgb\(/);
    expect(esMatch[1]).toBeTruthy();
  });
});
