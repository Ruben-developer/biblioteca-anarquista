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
