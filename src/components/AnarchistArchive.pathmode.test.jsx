// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { regionData } from '../data/regionData';
import { getAllBooks } from '../utils/library';

let AnarchistArchive;
let routes;

const SAMPLE_BOOK = getAllBooks(regionData).find((b) => b.filename) || getAllBooks(regionData)[0];

beforeEach(async () => {
  vi.stubEnv('VITE_ROUTES_MODE', 'pathname');
  vi.resetModules();
  AnarchistArchive = (await import('./AnarchistArchive')).default;
  routes = await import('../utils/routes');
  window.history.replaceState(null, '', '/');
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  window.history.replaceState(null, '', '/');
});

const openDrawer = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Abrir menú de navegación' }));

describe('Rutas reales (pathname): deep links', () => {
  it('abre el mapa con /mapa y conserva la URL', () => {
    window.history.replaceState(null, '', '/mapa');
    render(<AnarchistArchive />);
    expect(screen.getByText('Mapa Mundial de Textos')).toBeTruthy();
    expect(window.location.pathname).toBe('/mapa');
  });

  it('abre el lector con /libro/<slug> sin reescribir la URL', () => {
    const slug = routes.buildBookSlugIndex(regionData).slugFor(SAMPLE_BOOK);
    window.history.replaceState(null, '', `/libro/${slug}`);
    render(<AnarchistArchive />);
    expect(screen.getByRole('dialog', { name: `Lector: ${SAMPLE_BOOK.title}` })).toBeTruthy();
    expect(window.location.pathname).toBe(`/libro/${slug}`);
  });

  it('la raíz / se normaliza a /biblioteca sin añadir historia', () => {
    render(<AnarchistArchive />);
    expect(window.location.pathname).toBe('/biblioteca');
    expect(window.location.hash).toBe('');
  });

  it('una ruta desconocida cae en la biblioteca y normaliza la URL', () => {
    window.history.replaceState(null, '', '/ruta-que-no-existe');
    const { container } = render(<AnarchistArchive />);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(container.innerHTML).toContain('obras del archivo');
    expect(window.location.pathname).toBe('/biblioteca');
  });

  it('cerrar un lector abierto por deep link lleva al path de la biblioteca', () => {
    const slug = routes.buildBookSlugIndex(regionData).slugFor(SAMPLE_BOOK);
    window.history.replaceState(null, '', `/libro/${slug}`);
    render(<AnarchistArchive />);
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar lector' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(window.location.pathname).toBe('/biblioteca');
  });
});

describe('Rutas reales (pathname): navegación e historial', () => {
  it('navegar desde el menú escribe la ruta real con pushState', () => {
    render(<AnarchistArchive />);
    openDrawer();
    fireEvent.click(screen.getByRole('button', { name: /Mapa/ }));
    expect(window.location.pathname).toBe('/mapa');
    expect(window.location.hash).toBe('');
    expect(screen.getByText('Mapa Mundial de Textos')).toBeTruthy();
  });

  it('el botón Atrás del navegador vuelve a la vista anterior (popstate)', async () => {
    const { container } = render(<AnarchistArchive />);
    expect(window.location.pathname).toBe('/biblioteca');
    openDrawer();
    fireEvent.click(screen.getByRole('button', { name: /Mapa/ }));
    expect(window.location.pathname).toBe('/mapa');

    window.history.back();

    await waitFor(
      () => {
        expect(window.location.pathname).toBe('/biblioteca');
        expect(container.innerHTML).toContain('obras del archivo');
      },
      { timeout: 3000 }
    );
  });

  it('cambiar de vista tras volver atrás sigue sincronizando la URL', async () => {
    render(<AnarchistArchive />);
    openDrawer();
    fireEvent.click(screen.getByRole('button', { name: /Autores/ }));
    expect(window.location.pathname).toBe('/autores');

    window.history.back();
    await waitFor(() => expect(window.location.pathname).toBe('/biblioteca'), { timeout: 3000 });

    openDrawer();
    fireEvent.click(screen.getByRole('button', { name: /Mapa/ }));
    expect(window.location.pathname).toBe('/mapa');
  });
});
