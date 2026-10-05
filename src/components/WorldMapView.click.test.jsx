// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import WorldMapView from './WorldMapView';
import { regionData } from '../data/regionData';

// El clic del mapa es la unica prueba de que un pais abre su region: WorldMapView
// resuelve la region con normalizeCountryName(context.countryName), que mira el
// NOMBRE ingles del GeoJSON y no el ISO. Un pais puede pintarse bien (el ISO
// llega) y aun asi tener el clic muerto si ese nombre falta en el diccionario.
// Estos tests hacen clic de verdad en el DOM; comprobar solo el atributo
// role="button" NO serviria, porque ese depende solo del ISO.
describe('WorldMapView (clic real en cada pais pintado)', () => {
  const renderMapa = () => {
    const seleccion = [];
    const { container } = render(
      <WorldMapView
        darkMode={false}
        regionData={regionData}
        onSelectRegion={(r) => seleccion.push(r)}
      />
    );
    const paths = [...container.querySelectorAll('path.worldmap__country')];
    return { seleccion, paths };
  };

  const clic = (path) =>
    path.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));

  it('cada pais pintado abre su region al hacer clic', () => {
    const { seleccion, paths } = renderMapa();
    const clicables = paths.filter((p) => p.getAttribute('role') === 'button');

    expect(clicables.length).toBeGreaterThan(30);

    const fallos = [];
    for (const path of clicables) {
      const antes = seleccion.length;
      clic(path);
      const abierto = seleccion.slice(antes);
      if (abierto.length !== 1 || typeof abierto[0] !== 'string') {
        fallos.push(path.getAttribute('aria-label'));
      }
    }

    // Ningun pais pintado puede dejar el clic sin efecto.
    expect(fallos).toEqual([]);
    expect(seleccion).toHaveLength(clicables.length);
  });

  // Los 7 que se rompieron al crear las regiones nuevas (Marruecos, Suecia,
  // Palestina, Venezuela) y los 3 que ya estaban rotos (Bulgaria, Paises Bajos,
  // Belgica): todos se pintaban y ninguno respondia.
  it('los 7 paises que fallaban antes de la correccion responden', () => {
    const { seleccion, paths } = renderMapa();
    const objetivo = [
      'Marruecos',
      'Suecia',
      'Palestina',
      'Venezuela',
      'Bulgaria',
      'Bélgica',
      'Países Bajos'
    ];

    for (const nombre of objetivo) {
      const path = paths.find((p) => p.getAttribute('aria-label') === nombre);
      expect(path, `no se encuentra ${nombre} en el mapa`).toBeDefined();
      const antes = seleccion.length;
      clic(path);
      expect(seleccion.slice(antes), `${nombre} no abre su region`).toHaveLength(1);
    }

    expect(seleccion.sort()).toEqual(objetivo.slice().sort());
  });

  it('la region que abre es la del pais (no la de otro)', () => {
    const { seleccion, paths } = renderMapa();
    const pathMarruecos = paths.find((p) => p.getAttribute('aria-label') === 'Marruecos');
    clic(pathMarruecos);
    expect(seleccion[0]).toBe('Marruecos');

    const nl = paths.find((p) => p.getAttribute('aria-label') === 'Países Bajos');
    clic(nl);
    expect(seleccion[1]).toBe('Países Bajos');
  });
});