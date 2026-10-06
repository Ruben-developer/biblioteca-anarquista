// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor, act } from '@testing-library/react';
import AnarchistArchive from './AnarchistArchive';
import { regionData } from '../data/regionData';
import { getAllBooks } from '../utils/library';
import { buildBookSlugIndex, buildBookHash } from '../utils/routes';

const BOOK_INDEX = buildBookSlugIndex(regionData);
const SAMPLE_BOOK = getAllBooks(regionData).find((book) => book.filename) || getAllBooks(regionData)[0];
const SAMPLE_SLUG = BOOK_INDEX.slugFor(SAMPLE_BOOK);
const SAMPLE_HASH = buildBookHash(SAMPLE_SLUG);

const clearHash = () =>
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
const openDrawer = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Abrir menú de navegación' }));

beforeEach(clearHash);
afterEach(() => {
  cleanup();
  clearHash();
});

describe('Deep links: la URL abre directamente vista u obra', () => {
  it('abre la vista del mapa con #/mapa y conserva la URL', () => {
    window.history.replaceState(null, '', '#/mapa');
    render(<AnarchistArchive />);
    expect(screen.getByText('Mapa Mundial de Textos')).toBeTruthy();
    expect(window.location.hash).toBe('#/mapa');
  });

  it('abre la vista de autores con #/autores y conserva la URL', () => {
    window.history.replaceState(null, '', '#/autores');
    render(<AnarchistArchive />);
    expect(screen.getByText('Autores', { selector: 'h2' })).toBeTruthy();
    expect(window.location.hash).toBe('#/autores');
  });

  it('abre el lector de una obra con #/libro/<slug> sin reescribir la URL', () => {
    window.history.replaceState(null, '', SAMPLE_HASH);
    render(<AnarchistArchive />);
    expect(screen.getByRole('dialog', { name: `Lector: ${SAMPLE_BOOK.title}` })).toBeTruthy();
    expect(window.location.hash).toBe(SAMPLE_HASH);
  });

  it('cerrar un lector abierto por deep link lleva al hash de la biblioteca', () => {
    window.history.replaceState(null, '', SAMPLE_HASH);
    render(<AnarchistArchive />);
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar lector' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(window.location.hash).toBe('#/biblioteca');
  });

  it('un slug de obra desconocido cae en la biblioteca y normaliza la URL', () => {
    window.history.replaceState(null, '', '#/libro/obra-que-no-existe');
    const { container } = render(<AnarchistArchive />);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(container.innerHTML).toContain('obras del archivo');
    expect(window.location.hash).toBe('#/biblioteca');
  });
});

describe('Deep links: la navegación escribe la URL', () => {
  it('el primer render fija la vista actual en la URL sin añadir historia', () => {
    render(<AnarchistArchive />);
    expect(window.location.hash).toBe('#/biblioteca');
  });

  it('navegar desde el menú actualiza el hash', () => {
    render(<AnarchistArchive />);
    openDrawer();
    fireEvent.click(screen.getByRole('button', { name: /Mapa/ }));
    expect(window.location.hash).toBe('#/mapa');
    expect(screen.getByText('Mapa Mundial de Textos')).toBeTruthy();
  });

  it('abrir una obra desde la biblioteca escribe su hash y cerrarla restaura el de la vista', () => {
    render(<AnarchistArchive />);
    expect(window.location.hash).toBe('#/biblioteca');
    fireEvent.click(screen.getAllByRole('button', { name: 'Leer' })[0]);
    const dialog = screen.getByRole('dialog');
    const title = dialog.getAttribute('aria-label').replace('Lector: ', '');
    expect(window.location.hash).toMatch(/^#\/libro\//);
    const slug = window.location.hash.slice('#/libro/'.length);
    expect(BOOK_INDEX.bookOf.get(slug).title).toBe(title);
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar lector' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(window.location.hash).toBe('#/biblioteca');
  });
});

describe('Deep links: hashchange y atrás/adelante', () => {
  it('cambiar el hash a mano cambia la vista (hashchange)', async () => {
    render(<AnarchistArchive />);
    await act(async () => {
      window.location.hash = '#/favoritos';
      window.dispatchEvent(new Event('hashchange'));
    });
    expect(screen.getByText('Tu biblioteca personal está vacía')).toBeTruthy();
  });

  it('apuntar el hash a una obra abre el lector sin cambiar de vista', async () => {
    window.history.replaceState(null, '', '#/mapa');
    render(<AnarchistArchive />);
    expect(screen.getByText('Mapa Mundial de Textos')).toBeTruthy();
    await act(async () => {
      window.location.hash = SAMPLE_HASH;
      window.dispatchEvent(new Event('hashchange'));
    });
    expect(screen.getByRole('dialog', { name: `Lector: ${SAMPLE_BOOK.title}` })).toBeTruthy();
    // Al cerrar, la URL vuelve al hash de la vista que estaba activa.
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar lector' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByText('Mapa Mundial de Textos')).toBeTruthy();
    expect(window.location.hash).toBe('#/mapa');
  });

  it('cambiar el hash a una vista mientras hay un lector abierto lo cierra', async () => {
    window.history.replaceState(null, '', SAMPLE_HASH);
    render(<AnarchistArchive />);
    expect(screen.queryByRole('dialog')).toBeTruthy();
    await act(async () => {
      window.location.hash = '#/mapa';
      window.dispatchEvent(new Event('hashchange'));
    });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByText('Mapa Mundial de Textos')).toBeTruthy();
  });

  it('el botón Atrás del navegador vuelve a la vista anterior', async () => {
    render(<AnarchistArchive />);
    openDrawer();
    fireEvent.click(screen.getByRole('button', { name: /Mapa/ }));
    openDrawer();
    fireEvent.click(screen.getByRole('button', { name: /Autores/ }));
    expect(screen.getByText('Autores', { selector: 'h2' })).toBeTruthy();
    window.history.back();
    await waitFor(() => {
      expect(window.location.hash).toBe('#/mapa');
      expect(screen.getByText('Mapa Mundial de Textos')).toBeTruthy();
    });
  });
});
