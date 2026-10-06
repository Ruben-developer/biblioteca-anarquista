import { describe, it, expect } from 'vitest';
import { regionData } from '../data/regionData';
import { getAllBooks } from './library';
import {
  slugify,
  VIEW_SLUGS,
  parseRoute,
  buildViewHash,
  buildBookHash,
  buildBookSlugIndex
} from './routes';
import { VIEWS } from '../constants';

describe('slugify', () => {
  it('quita acentos, puntuación y pasa a minúsculas con guiones', () => {
    expect(slugify('La Conquista del Pan')).toBe('la-conquista-del-pan');
    expect(slugify('¿Anarquía?')).toBe('anarquia');
    expect(slugify('¡¿Anarquismo?!')).toBe('anarquismo');
    expect(slugify('Compilación de escritos')).toBe('compilacion-de-escritos');
    expect(slugify('Prólogo a Anselmo Lorenzo. El Proletariado Militante')).toBe(
      'prologo-a-anselmo-lorenzo-el-proletariado-militante'
    );
  });

  it('recorta guiones sobrantes y devuelve cadena vacía sin contenido útil', () => {
    expect(slugify('  --- Hola, Mundo!! --- ')).toBe('hola-mundo');
    expect(slugify('¿¿??')).toBe('');
    expect(slugify('')).toBe('');
    expect(slugify(null)).toBe('');
    expect(slugify(undefined)).toBe('');
  });

  it('genera slugs sin dobles guiones (los títulos base nunca contienen "--")', () => {
    expect(slugify('Durruti y Ascaso. La CNT y la revolución de Julio')).not.toContain('--');
  });
});

describe('rutas de vista', () => {
  it('todas las vistas tienen slug y el roundtrip parse(build(v)) devuelve la vista', () => {
    Object.values(VIEWS).forEach((view) => {
      expect(VIEW_SLUGS[view]).toBeTruthy();
      const route = parseRoute(buildViewHash(view));
      expect(route).toEqual({ type: 'view', view });
    });
  });

  it('construye hashes canónicos legibles', () => {
    expect(buildViewHash(VIEWS.MAP)).toBe('#/mapa');
    expect(buildViewHash(VIEWS.TIMELINE)).toBe('#/linea-temporal');
    expect(buildViewHash(VIEWS.LIBRARY)).toBe('#/biblioteca');
    expect(buildBookHash('la-conquista-del-pan')).toBe('#/libro/la-conquista-del-pan');
  });

  it('acepta alias en inglés (ids de VIEWS), mayúsculas y barras sobrantes', () => {
    expect(parseRoute('#/map')).toEqual({ type: 'view', view: VIEWS.MAP });
    expect(parseRoute('#timeline')).toEqual({ type: 'view', view: VIEWS.TIMELINE });
    expect(parseRoute('#/MAPA')).toEqual({ type: 'view', view: VIEWS.MAP });
    expect(parseRoute('#/linea-temporal/')).toEqual({ type: 'view', view: VIEWS.TIMELINE });
    expect(parseRoute('#/acratas')).toEqual({ type: 'view', view: VIEWS.ACRATAS });
  });

  it('cae a la biblioteca ante hash vacío, desconocido o malformado', () => {
    expect(parseRoute('')).toEqual({ type: 'view', view: VIEWS.LIBRARY });
    expect(parseRoute(undefined)).toEqual({ type: 'view', view: VIEWS.LIBRARY });
    expect(parseRoute(null)).toEqual({ type: 'view', view: VIEWS.LIBRARY });
    expect(parseRoute('#/vista-inexistente')).toEqual({ type: 'view', view: VIEWS.LIBRARY });
    expect(parseRoute('#/libro')).toEqual({ type: 'view', view: VIEWS.LIBRARY });
    expect(parseRoute('#/libro/%zz')).toEqual({ type: 'view', view: VIEWS.LIBRARY });
    // Vista desconocida → hash canónico de biblioteca.
    expect(buildViewHash('no-existe')).toBe('#/biblioteca');
  });
});

describe('buildBookSlugIndex (datos de prueba)', () => {
  const mockRegionData = {
    España: {
      books: [
        { title: 'Anarquismo', author: 'Emma Goldman', category: 'teoria' },
        { title: '¡¿Anarquismo?', author: 'Michael Albert', category: 'teoria' },
        { title: 'Obra Única', author: 'Autor X', category: 'historia' }
      ]
    },
    Ideas: {
      books: [
        { title: 'Anarquismo', author: 'Emma Goldman', category: 'teoria' },
        { title: 'Duplicado', author: 'Autor Y', category: 'historia' }
      ]
    },
    Testigos: {
      books: [
        { title: 'Duplicado', author: 'Autor Y', category: 'historia' },
        { title: 'Duplicado', author: 'Autor Y', category: 'historia' }
      ]
    }
  };

  it('usa el título como slug cuando no hay colisión', () => {
    const index = buildBookSlugIndex(mockRegionData);
    expect(index.slugFor({ title: 'Obra Única', author: 'Autor X' })).toBe('obra-unica');
    expect(index.bookOf.get('obra-unica').title).toBe('Obra Única');
    expect(index.bookOf.has('obra-nica')).toBe(false);
  });

  it('desambigua títulos repetidos con autor y después con región', () => {
    const index = buildBookSlugIndex(mockRegionData);
    const slugs = [
      index.slugFor({ title: 'Anarquismo', author: 'Emma Goldman', region: 'España' }),
      index.slugFor({ title: 'Anarquismo', author: 'Emma Goldman', region: 'Ideas' }),
      index.slugFor({ title: '¡¿Anarquismo?', author: 'Michael Albert', region: 'España' })
    ];
    expect(slugs).toEqual(['anarquismo--emma-goldman', 'anarquismo--ideas', 'anarquismo--michael-albert']);
    expect(new Set(slugs).size).toBe(3);
  });

  it('cae al sufijo numérico cuando autor y región ya están tomados', () => {
    const index = buildBookSlugIndex(mockRegionData);
    const duplicados = [...index.bookOf.entries()].filter(([, book]) => book.title === 'Duplicado');
    const slugs = duplicados.map(([slug]) => slug);
    expect(slugs.sort()).toEqual(['duplicado--2', 'duplicado--autor-y', 'duplicado--testigos']);
    expect(index.bookOf.get('duplicado--2').title).toBe('Duplicado');
  });

  it('resuelve obras parciales de favoritos (sin región) y rechaza títulos inexistentes', () => {
    const index = buildBookSlugIndex(mockRegionData);
    const slug = index.slugFor({ title: 'Anarquismo', author: 'Emma Goldman' });
    expect(slug).toBe('anarquismo--emma-goldman');
    expect(index.bookOf.get(slug).title).toBe('Anarquismo');
    expect(index.slugFor({ title: 'Obra que no existe' })).toBeUndefined();
    expect(index.slugFor(null)).toBeUndefined();
    expect(index.slugFor({ author: 'Sin título' })).toBeUndefined();
  });
});

describe('buildBookSlugIndex (catálogo real)', () => {
  const books = getAllBooks(regionData);
  const index = buildBookSlugIndex(regionData);

  it('indexa todas las obras visibles del catálogo con un slug propio', () => {
    expect(books.length).toBeGreaterThan(0);
    expect(index.bookOf.size).toBe(books.length);
    expect(new Set(books.map((book) => index.slugFor(book))).size).toBe(books.length);
  });

  it('cada slug resuelve de vuelta a su obra exacta (título, autor y región)', () => {
    books.forEach((book) => {
      const found = index.bookOf.get(index.slugFor(book));
      expect(found).toBeDefined();
      expect(found.title).toBe(book.title);
      expect(found.author).toBe(book.author);
      expect(found.region).toBe(book.region);
    });
  });

  it('resuelve también obras parciales como las de la vista Favoritos', () => {
    books.forEach((book) => {
      const slug = index.slugFor({ title: book.title, author: book.author });
      expect(index.bookOf.get(slug)?.title).toBe(book.title);
    });
  });

  it('todos los títulos repetidos del catálogo quedan desambiguados con "--"', () => {
    const byBase = new Map();
    books.forEach((book) => {
      const base = slugify(book.title);
      if (!byBase.has(base)) byBase.set(base, []);
      byBase.get(base).push(book);
    });
    const collisions = [...byBase.values()].filter((group) => group.length > 1);
    // El catálogo real tiene títulos repetidos (10 grupos); si desaparecieran,
    // la desambigüación seguiría cubierta por los tests con datos de prueba.
    collisions.forEach((group) => {
      const slugs = group.map((book) => index.slugFor(book));
      expect(new Set(slugs).size).toBe(group.length);
      slugs.forEach((slug) => expect(slug).toContain('--'));
    });
  });

  it('parseRoute abre la obra a partir de su hash y cae a biblioteca si no existe', () => {
    const book = books.find((b) => b.filename) || books[0];
    const slug = index.slugFor(book);
    expect(parseRoute(buildBookHash(slug), index)).toEqual({ type: 'book', slug, book });
    expect(parseRoute(`#/libro/${slug}/extra`, index)).toEqual({ type: 'view', view: VIEWS.LIBRARY });
    expect(parseRoute('#/libro/obra-que-no-existe', index)).toEqual({ type: 'view', view: VIEWS.LIBRARY });
  });
});
