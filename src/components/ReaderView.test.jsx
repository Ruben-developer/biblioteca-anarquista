import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReaderView from './ReaderView';

const pdfBook = {
  title: '¿Qué es la Propiedad?',
  author: 'Proudhon',
  region: 'Francia',
  year: 1840,
  filename: 'anarquismo/c.pdf'
};

const txtBook = {
  title: 'Apoyo Mutuo',
  author: 'Kropotkin',
  region: 'Rusia',
  year: 1902,
  filename: 'apoyo-mutuo.txt'
};

const noFileBook = {
  title: 'Sin archivo',
  author: 'Autor',
  region: 'España',
  year: 1900,
  filename: ''
};

describe('ReaderView', () => {
  const noop = () => {};

  it('renderiza el modal de lectura con el título y autor', () => {
    const html = renderToStaticMarkup(
      <ReaderView darkMode={false} book={pdfBook} onClose={noop} />
    );
    expect(html).toContain('¿Qué es la Propiedad?');
    expect(html).toContain('por Proudhon');
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
  });

  it('muestra un iframe embebido para PDFs', () => {
    const html = renderToStaticMarkup(
      <ReaderView darkMode={false} book={pdfBook} onClose={noop} />
    );
    expect(html).toContain('<iframe');
    expect(html).toContain('c.pdf');
  });

  it('ofrece botón de descarga cuando hay archivo', () => {
    const html = renderToStaticMarkup(
      <ReaderView darkMode={false} book={pdfBook} onClose={noop} />
    );
    expect(html).toContain('Descargar');
  });

  it('no muestra iframe para libros sin archivo', () => {
    const html = renderToStaticMarkup(
      <ReaderView darkMode={false} book={noFileBook} onClose={noop} />
    );
    expect(html).not.toContain('<iframe');
    expect(html).toContain('no tiene archivo');
  });

  it('no usa iframe para TXT (se carga el texto por fetch)', () => {
    const html = renderToStaticMarkup(
      <ReaderView darkMode={false} book={txtBook} onClose={noop} />
    );
    expect(html).not.toContain('<iframe');
    expect(html).toContain('Descargar');
  });
});
