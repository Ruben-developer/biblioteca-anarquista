// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { regionData } from '../data/regionData';
import { getAllBooks } from './library';
import {
  parseRoute,
  buildBookSlugIndex,
  routesMode,
  readRouteInput,
  currentRouteHref,
  viewHref,
  bookHref
} from './routes';
import { VIEWS } from '../constants';

const BOOK_INDEX = buildBookSlugIndex(regionData);
const SAMPLE_BOOK = getAllBooks(regionData).find((b) => b.filename) || getAllBooks(regionData)[0];
const SAMPLE_SLUG = BOOK_INDEX.slugFor(SAMPLE_BOOK);

const goto = (path) => window.history.replaceState(null, '', path);

beforeEach(() => goto('/'));

describe('modo pathname: hrefs con ruta real', () => {
  it('por defecto el modo sigue siendo hash (GitHub Pages)', () => {
    expect(routesMode()).toBe('hash');
  });

  it('viewHref/bookHref en pathname devuelven rutas reales con barra inicial', () => {
    expect(viewHref(VIEWS.MAP, 'pathname')).toBe('/mapa');
    expect(viewHref(VIEWS.TIMELINE, 'pathname')).toBe('/linea-temporal');
    expect(viewHref(VIEWS.LIBRARY, 'pathname')).toBe('/biblioteca');
    expect(bookHref(SAMPLE_SLUG, 'pathname')).toBe(`/libro/${SAMPLE_SLUG}`);
  });

  it('viewHref/bookHref en hash conservan el esquema #/', () => {
    expect(viewHref(VIEWS.MAP, 'hash')).toBe('#/mapa');
    expect(bookHref(SAMPLE_SLUG, 'hash')).toBe(`#/libro/${SAMPLE_SLUG}`);
  });
});

describe('modo pathname: leer la URL', () => {
  it('lee /mapa como vista de mapa', () => {
    goto('/mapa');
    const route = parseRoute(readRouteInput('pathname'), BOOK_INDEX);
    expect(route).toEqual({ type: 'view', view: VIEWS.MAP });
  });

  it('lee /libro/<slug> como obra del catálogo', () => {
    goto(`/libro/${SAMPLE_SLUG}`);
    const route = parseRoute(readRouteInput('pathname'), BOOK_INDEX);
    expect(route).toEqual({ type: 'book', slug: SAMPLE_SLUG, book: SAMPLE_BOOK });
  });

  it('la raíz / y una ruta desconocida caen en la biblioteca', () => {
    expect(parseRoute(readRouteInput('pathname'), BOOK_INDEX)).toEqual({
      type: 'view',
      view: VIEWS.LIBRARY
    });
    goto('/ruta-que-no-existe');
    expect(parseRoute(readRouteInput('pathname'), BOOK_INDEX)).toEqual({
      type: 'view',
      view: VIEWS.LIBRARY
    });
  });

  it('normaliza mayúsculas y barra final como el modo hash', () => {
    goto('/MAPA/');
    const route = parseRoute(readRouteInput('pathname'), BOOK_INDEX);
    expect(route).toEqual({ type: 'view', view: VIEWS.MAP });
  });

  it('currentRouteHref compara sin la barra final', () => {
    goto('/mapa/');
    expect(currentRouteHref('pathname')).toBe('/mapa');
    goto('/');
    expect(currentRouteHref('pathname')).toBe('/');
  });

  it('en modo hash lee el fragmento como siempre', () => {
    goto('/#/autores');
    expect(readRouteInput('hash')).toBe('#/autores');
    expect(currentRouteHref('hash')).toBe('#/autores');
  });
});
