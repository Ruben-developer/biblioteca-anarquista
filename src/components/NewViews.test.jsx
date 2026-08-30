import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { cleanup } from '@testing-library/react';
import { regionData } from '../data/regionData';
import { anarchistTheories } from '../data/anarchistTheories';
import { glossaryTerms } from '../data/glossary';
import { readingPaths } from '../data/readingPaths';
import { influenceNodes, influenceEdges } from '../data/influences';
import { findBookByTitle, getAllBooks } from '../utils/library';
import TheoriesView from './TheoriesView';
import GlossaryView from './GlossaryView';
import ReadingPathsView from './ReadingPathsView';
import InfluencesView from './InfluencesView';
import AcratasView from './AcratasView';
import ReaderOverlay from './ReaderOverlay';
const catalogTitles = new Set(getAllBooks(regionData).map((b) => b.title));

afterEach(cleanup);

describe('Datos de las nuevas secciones', () => {
  it('todas las obras referenciadas por las teorías existen en el catálogo', () => {
    const missing = anarchistTheories.flatMap((t) => t.books).filter((title) => !catalogTitles.has(title));
    expect(missing).toEqual([]);
  });

  it('todas las obras del glosario existen en el catálogo', () => {
    const missing = glossaryTerms.flatMap((g) => g.books || []).filter((title) => !catalogTitles.has(title));
    expect(missing).toEqual([]);
  });

  it('todas las obras de las rutas de lectura existen en el catálogo', () => {
    const missing = readingPaths.flatMap((p) => p.books).filter((title) => !catalogTitles.has(title));
    expect(missing).toEqual([]);
  });

  it('las aristas de influencia referencian nodos válidos', () => {
    const ids = new Set(influenceNodes.map((n) => n.id));
    const invalid = influenceEdges.flat().filter((id) => !ids.has(id));
    expect(invalid).toEqual([]);
  });

  it('todos los nodos de influencia con authorKey coinciden con un autor del catálogo', () => {
    const authorNames = new Set(getAllBooks(regionData).map((b) => b.author));
    const unmatched = influenceNodes.filter(
      (n) => n.authorKey && !authorNames.has(n.authorKey)
    );
    expect(unmatched).toEqual([]);
  });
});

describe('TheoriesView', () => {
  it('renderiza el título y todas las corrientes', () => {
    const html = renderToStaticMarkup(
      <TheoriesView darkMode={false} regionData={regionData} />
    );
    expect(html).toContain('Teorías y corrientes del anarquismo');
    expect(html).toContain('Anarco-comunismo');
    expect(html).toContain('Anarcosindicalismo');
    expect(html).toContain('Mutualismo');
    expect(html).toContain('Plataformismo y especifismo');
  });

  it('despliega ideas, autores y obras al hacer clic', async () => {
    // @vitest-environment jsdom
    const { render, screen, fireEvent } = await import('@testing-library/react');
    render(<TheoriesView darkMode={false} regionData={regionData} />);
    fireEvent.click(screen.getByText('Anarco-comunismo'));
    expect(screen.getByText('Comunismo libertario')).toBeTruthy();
    expect(screen.getByText('Piotr Kropotkin')).toBeTruthy();
    expect(screen.getByText('La Conquista del Pan')).toBeTruthy();
  });

  it('llama onOpenLibrary con el título al pulsar "En el catálogo" de una obra', async () => {
    // @vitest-environment jsdom
    const { render, screen, fireEvent } = await import('@testing-library/react');
    const onOpenLibrary = vi.fn();
    render(<TheoriesView darkMode={false} regionData={regionData} onOpenLibrary={onOpenLibrary} />);
    fireEvent.click(screen.getByText('Anarco-comunismo'));
    fireEvent.click(screen.getAllByTitle(/Ver "La Conquista del Pan" en el catálogo/)[0]);
    expect(onOpenLibrary).toHaveBeenCalledWith({ searchTerm: 'La Conquista del Pan' });
  });

  it('llama onOpenLibrary sin filtros al pulsar "Ver todas las obras del catálogo"', async () => {
    // @vitest-environment jsdom
    const { render, screen, fireEvent } = await import('@testing-library/react');
    const onOpenLibrary = vi.fn();
    render(<TheoriesView darkMode={false} regionData={regionData} onOpenLibrary={onOpenLibrary} />);
    fireEvent.click(screen.getByText('Ver todas las obras del catálogo'));
    expect(onOpenLibrary).toHaveBeenCalledWith({});
  });
});

describe('GlossaryView', () => {
  it('renderiza los términos con sus definiciones', () => {
    const html = renderToStaticMarkup(<GlossaryView darkMode={false} regionData={regionData} />);
    expect(html).toContain('Glosario libertario');
    expect(html).toContain('Anarquismo');
    expect(html).toContain('Autogestión');
  });

  it('filtra los términos por búsqueda', async () => {
    // @vitest-environment jsdom
    const { render, screen, fireEvent } = await import('@testing-library/react');
    render(<GlossaryView darkMode regionData={regionData} />);
    expect(screen.getByText('Anarquismo')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Buscar término del glosario'), { target: { value: 'mutualismo' } });
    expect(screen.getByText('Mutualismo')).toBeTruthy();
    expect(screen.queryByText('Anarquismo')).toBeNull();
  });

  it('llama onOpenLibrary con el título al pulsar "En el catálogo" de una obra', async () => {
    // @vitest-environment jsdom
    const { render, screen, fireEvent } = await import('@testing-library/react');
    const onOpenLibrary = vi.fn();
    render(<GlossaryView darkMode regionData={regionData} onOpenLibrary={onOpenLibrary} />);
    fireEvent.click(screen.getAllByTitle(/Ver "La Conquista del Pan" en el catálogo/)[0]);
    expect(onOpenLibrary).toHaveBeenCalledWith({ searchTerm: 'La Conquista del Pan' });
  });

  it('llama onOpenLibrary sin filtros al pulsar "Ver todas las obras del catálogo"', async () => {
    // @vitest-environment jsdom
    const { render, screen, fireEvent } = await import('@testing-library/react');
    const onOpenLibrary = vi.fn();
    render(<GlossaryView darkMode regionData={regionData} onOpenLibrary={onOpenLibrary} />);
    fireEvent.click(screen.getByText('Ver todas las obras del catálogo'));
    expect(onOpenLibrary).toHaveBeenCalledWith({});
  });
});

describe('ReadingPathsView', () => {
  it('renderiza las rutas de lectura', () => {
    const html = renderToStaticMarkup(<ReadingPathsView darkMode={false} regionData={regionData} />);
    expect(html).toContain('Rutas de lectura');
    expect(html).toContain('Orígenes y fundamentos');
    expect(html).toContain('Anarquismo en España');
  });

  it('al abrir una ruta muestra sus obras', async () => {
    // @vitest-environment jsdom
    const { render, screen, fireEvent } = await import('@testing-library/react');
    render(<ReadingPathsView darkMode regionData={regionData} />);
    fireEvent.click(screen.getByText('Orígenes y fundamentos'));
    expect(screen.getByText('¿Qué es la Propiedad?')).toBeTruthy();
    expect(screen.getByText('Dios y el Estado')).toBeTruthy();
  });

  it('llama onOpenLibrary con el título al pulsar "En el catálogo" de una obra', async () => {
    // @vitest-environment jsdom
    const { render, screen, fireEvent } = await import('@testing-library/react');
    const onOpenLibrary = vi.fn();
    render(<ReadingPathsView darkMode regionData={regionData} onOpenLibrary={onOpenLibrary} />);
    fireEvent.click(screen.getByText('Orígenes y fundamentos'));
    fireEvent.click(screen.getAllByTitle(/Ver "¿Qué es la Propiedad\?" en el catálogo/)[0]);
    expect(onOpenLibrary).toHaveBeenCalledWith({ searchTerm: '¿Qué es la Propiedad?' });
  });

  it('llama onOpenLibrary sin filtros al pulsar "Ver todas las obras del catálogo"', async () => {
    // @vitest-environment jsdom
    const { render, screen, fireEvent } = await import('@testing-library/react');
    const onOpenLibrary = vi.fn();
    render(<ReadingPathsView darkMode regionData={regionData} onOpenLibrary={onOpenLibrary} />);
    fireEvent.click(screen.getByText('Ver todas las obras del catálogo'));
    expect(onOpenLibrary).toHaveBeenCalledWith({});
  });
});

describe('InfluencesView', () => {
  it('renderiza el grafo con nodos y leyenda', () => {
    const html = renderToStaticMarkup(<InfluencesView darkMode={false} regionData={regionData} />);
    expect(html).toContain('Red de Autores');
    expect(html).toContain('Grafo de influencias');
    expect(html).toContain('Haz clic en cualquier autor');
  });

  it('muestra el panel del autor seleccionado con conexiones y obras', async () => {
    // @vitest-environment jsdom
    const { render, screen, fireEvent } = await import('@testing-library/react');
    render(<InfluencesView darkMode regionData={regionData} />);
    fireEvent.click(screen.getByText('Kropotkin'));
    expect(screen.getByText(/Recibe influencia de/)).toBeTruthy();
    expect(screen.getByText(/Influye en/)).toBeTruthy();
    expect(screen.getByText(/Obras en el archivo/)).toBeTruthy();
    expect(screen.getByText('La Conquista del Pan')).toBeTruthy();
  });
});

describe('AcratasView', () => {
  it('renderiza el título y agrupa por personaje', () => {
    const html = renderToStaticMarkup(<AcratasView darkMode={false} regionData={regionData} />);
    expect(html).toContain('Acratas');
    expect(html).toContain('Buenaventura Durruti');
    expect(html).toContain('personas del archivo');
  });

  it('filtra las personas por búsqueda', async () => {
    // @vitest-environment jsdom
    const { render, screen, fireEvent } = await import('@testing-library/react');
    render(<AcratasView darkMode regionData={regionData} />);
    expect(screen.getByText('Buenaventura Durruti')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Buscar persona o texto...'), { target: { value: 'Teresa Claramunt' } });
    expect(screen.getByText(/Teresa Claramunt/)).toBeTruthy();
    expect(screen.queryByText('Buenaventura Durruti')).toBeNull();
  });

  it('despliega los textos de una persona al hacer clic', async () => {
    // @vitest-environment jsdom
    const { render, screen, fireEvent } = await import('@testing-library/react');
    render(<AcratasView darkMode={false} regionData={regionData} />);
    fireEvent.click(screen.getByText('Emma Goldman'));
    expect(screen.getByText('Anarquismo')).toBeTruthy();
    expect(screen.getByText('Fraternalmente, Emma')).toBeTruthy();
  });
});

describe('ReaderOverlay', () => {
  const book = { title: 'La Conquista del Pan', author: 'Kropotkin', filename: 'anarquismo/conquista.pdf' };

  it('renderiza el iframe del documento y los controles', () => {
    const html = renderToStaticMarkup(
      <ReaderOverlay book={book} darkMode={false} onClose={() => {}} />
    );
    expect(html).toContain('<dialog');
    expect(html).toContain('Lector: La Conquista del Pan');
    expect(html).toContain('La Conquista del Pan');
    expect(html).toContain('/pdfs/anarquismo/conquista.pdf');
    expect(html).toContain('Cerrar');
  });

  it('llama onClose al pulsar el botón Cerrar', async () => {
    // @vitest-environment jsdom
    const { render, screen, fireEvent } = await import('@testing-library/react');
    const onClose = vi.fn();
    render(<ReaderOverlay book={book} darkMode onClose={onClose} />);
    fireEvent.click(screen.getByText('Cerrar'));
    expect(onClose).toHaveBeenCalled();
  });

  it('no renderiza nada sin libro', () => {
    expect(renderToStaticMarkup(<ReaderOverlay book={null} onClose={() => {}} />)).toBe('');
  });

  it('muestra mensaje para obras sin archivo', () => {
    const html = renderToStaticMarkup(
      <ReaderOverlay book={{ title: 'Sin archivo', filename: undefined }} onClose={() => {}} />
    );
    expect(html).toContain('Esta obra no tiene archivo digitalizado');
  });
});

// Utilidad findBookByTitle se usa en las vistas nuevas: sanity check con datos reales.
describe('findBookByTitle contra el catálogo real', () => {
  it('resuelve un título referenciado por las rutas', () => {
    const book = findBookByTitle(regionData, 'La Conquista del Pan');
    expect(book).toBeTruthy();
    expect(book.region).toBeTruthy();
  });
});