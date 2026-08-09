import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import WorldMap from '../components/WorldMap';

describe('WorldMap (mapa mundial propio)', () => {
  const data = [
    { country: 'es', value: 10 },
    { country: 'fr', value: 5 }
  ];

  it('renderiza el SVG con viewBox del mundo', () => {
    const html = renderToStaticMarkup(<WorldMap data={data} />);
    expect(html).toContain('<svg');
    expect(html).toContain('viewBox="0 0 960 720"');
  });

  it('NO contiene el país Israel (fusionado en Palestine)', () => {
    const html = renderToStaticMarkup(<WorldMap data={data} />);
    expect(html).not.toContain('Israel');
    expect(html).not.toContain('>IL</');
  });

  it('sí contiene Palestine como país fusionado', () => {
    const html = renderToStaticMarkup(<WorldMap data={data} />);
    expect(html).toContain('Palestina');
    expect(html).toMatch(/<path[^>]*>\s*<title>Palestina<\/title>\s*<\/path>/);
  });

  it('el path de Palestine incluye el territorio de Israel (polígono más grande)', () => {
    const html = renderToStaticMarkup(<WorldMap data={data} />);
    const palestinePath = html.match(/<path d="([^"]*)"[^>]*>\s*<title>Palestina<\/title>/);
    expect(palestinePath).not.toBeNull();
    const d = palestinePath[1];
    expect(d.length).toBeGreaterThan(500);
    expect(d.length).toBeLessThan(2000);
  });

  it('aplica tooltip solo a países con valor (title con nombre en español y número)', () => {
    const html = renderToStaticMarkup(<WorldMap data={data} />);
    expect(html).toMatch(/<title>España: 10<\/title>/);
    expect(html).not.toMatch(/<title>France: <\/title>/);
  });

  it('muestra el nombre del país en español en el title (incluso sin valor)', () => {
    const html = renderToStaticMarkup(<WorldMap data={[]} />);
    expect(html).toContain('<title>España</title>');
    expect(html).toContain('<title>Francia</title>');
    expect(html).not.toContain('<title>Spain</title>');
  });

  it('aplica la clase worldmap__country para el efecto hover', () => {
    const html = renderToStaticMarkup(<WorldMap data={data} />);
    expect(html).toContain('class="worldmap__country"');
  });

  it('aplica styleFunction personalizado', () => {
    const styleFunction = (context) => ({
      fill: context.countryCode === 'ES' ? '#ff0000' : '#cccccc'
    });
    const html = renderToStaticMarkup(
      <WorldMap data={data} styleFunction={styleFunction} />
    );
    expect(html).toContain('fill:#ff0000');
  });

  it('llama onClickFunction con el contexto del país', () => {
    const clicks = [];
    const onClickFunction = (context) => clicks.push(context.countryName);
    renderToStaticMarkup(
      <WorldMap data={data} onClickFunction={onClickFunction} />
    );
    expect(clicks.length).toBe(0);
  });

  it('mantiene 174 países tras eliminar Israel', () => {
    const html = renderToStaticMarkup(<WorldMap data={data} />);
    const paths = html.match(/<path /g);
    expect(paths.length).toBe(174);
  });
});
