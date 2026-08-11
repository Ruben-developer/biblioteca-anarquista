// src/services/documentService.test.js
// Tests del servicio de documentos:
// - getDocumentDownloadUrl (PDF → contenedor via /pdfs/, TXT → repo via BASE_URL)
// - funciones asíncronas sobre documents.json con fetch simulado (vitest, node env)
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Documentos simulados (mismo shape que documents.json → data.documents)
const mockDocs = [
  {
    id: 'kropotkin-conquista',
    title: 'La Conquista del Pan',
    author: 'Piotr Kropotkin',
    summary: 'La sociedad de la abundancia y la ayuda mutua.',
    tags: ['anarquismo', 'comunismo'],
    region: 'España',
    category: 'teoria',
    rating: 4.8,
    year: 1892,
    filename: 'anarquismo/f8087024_Conquista_Final_pmd.pdf',
    fileFormat: 'pdf'
  },
  {
    id: 'proudhon-propiedad',
    title: '¿Qué es la Propiedad?',
    author: 'Pierre-Joseph Proudhon',
    summary: 'La propiedad es un robo.',
    tags: ['propiedad'],
    region: 'Francia',
    category: 'teoria',
    rating: 4.9,
    year: 1840,
    filename: 'anarquismo/f7849880_Propiedad_Final_pmd.pdf',
    fileFormat: 'pdf'
  },
  {
    id: 'martires-chicago',
    title: 'Los Mártires de Chicago',
    author: 'Colectivo',
    summary: 'La revuelta de Haymarket y el 1 de Mayo.',
    tags: ['haymarket', 'historia'],
    region: 'Estados Unidos',
    category: 'historia',
    rating: 4.8,
    year: 1886,
    filename: 'ref/haymarket.txt',
    fileFormat: 'txt'
  }
];

const okResponse = (data = mockDocs) => ({
  ok: true,
  status: 200,
  json: async () => ({ documents: data })
});

const failResponse = () => ({
  ok: false,
  status: 404,
  json: async () => ({})
});

let service;

beforeEach(async () => {
  // Módulo fresco (sin cache de loadDocuments) + fetch simulado OK
  vi.resetModules();
  global.fetch = vi.fn().mockResolvedValue(okResponse());
  service = await import('./documentService.js');
});

describe('getDocumentDownloadUrl', () => {
  it('los PDFs apuntan al contenedor via /pdfs/', () => {
    expect(service.getDocumentDownloadUrl('anarquismo/a.pdf')).toBe('/pdfs/anarquismo/a.pdf');
  });

  it('los TXT apuntan a la carpeta documents del repo', () => {
    const BASE = import.meta.env.BASE_URL;
    expect(service.getDocumentDownloadUrl('ref/haymarket.txt')).toBe(`${BASE}documents/ref/haymarket.txt`);
  });

  it('devuelve null sin filename', () => {
    expect(service.getDocumentDownloadUrl(null)).toBeNull();
    expect(service.getDocumentDownloadUrl('')).toBeNull();
    expect(service.getDocumentDownloadUrl(undefined)).toBeNull();
  });
});

describe('carga de documentos (fetch simulado)', () => {
  it('loadDocuments devuelve los documentos en éxito', async () => {
    const docs = await service.loadDocuments();
    expect(docs).toHaveLength(3);
    expect(docs[0].id).toBe('kropotkin-conquista');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('loadDocuments cachea el resultado en llamadas sucesivas', async () => {
    const first = await service.loadDocuments();
    const second = await service.loadDocuments();
    expect(first).toHaveLength(3);
    expect(second).toBe(first);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('loadDocuments devuelve [] si el fetch falla', async () => {
    vi.resetModules();
    global.fetch = vi.fn().mockResolvedValue(failResponse());
    const svc = await import('./documentService.js');
    const docs = await svc.loadDocuments();
    expect(docs).toEqual([]);
  });

  it('loadDocuments devuelve [] si el JSON no trae la clave documents', async () => {
    vi.resetModules();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ vacio: true })
    });
    const svc = await import('./documentService.js');
    expect(await svc.loadDocuments()).toEqual([]);
  });

  it('getDocuments devuelve todos los documentos', async () => {
    const docs = await service.getDocuments();
    expect(docs).toHaveLength(3);
  });
});

describe('consultas sobre el catálogo', () => {
  it('getDocumentById encuentra por id y undefined si no existe', async () => {
    const doc = await service.getDocumentById('proudhon-propiedad');
    expect(doc.author).toBe('Pierre-Joseph Proudhon');
    expect(await service.getDocumentById('no-existe')).toBeUndefined();
  });

  it('getDocumentsByRegion filtra por región y "all" devuelve todo', async () => {
    expect(await service.getDocumentsByRegion('España')).toHaveLength(1);
    expect(await service.getDocumentsByRegion('all')).toHaveLength(3);
    expect(await service.getDocumentsByRegion('Marte')).toHaveLength(0);
  });

  it('getDocumentsByCategory filtra por categoría', async () => {
    expect(await service.getDocumentsByCategory('teoria')).toHaveLength(2);
    expect(await service.getDocumentsByCategory('all')).toHaveLength(3);
    expect(await service.getDocumentsByCategory('historia')).toHaveLength(1);
  });

  it('searchDocuments busca en título, autor, resumen y tags', async () => {
    expect(await service.searchDocuments('conquista')).toHaveLength(1); // título
    expect(await service.searchDocuments('kropotkin')).toHaveLength(1); // autor
    expect(await service.searchDocuments('robo')).toHaveLength(1); // resumen
    expect(await service.searchDocuments('haymarket')).toHaveLength(1); // tag
    expect(await service.searchDocuments('zzz')).toHaveLength(0);
  });

  it('getAuthors agrupa autores únicos con contador de obras', async () => {
    const authors = await service.getAuthors();
    expect(authors).toHaveLength(3);
    const kropotkin = authors.find((a) => a.name === 'Piotr Kropotkin');
    expect(kropotkin.documentCount).toBe(1);
    expect(kropotkin.region).toBe('España');
    expect(kropotkin.bio).toBeUndefined();
  });

  it('getRegions devuelve regiones únicas ordenadas', async () => {
    const regions = await service.getRegions();
    expect(regions).toEqual(['España', 'Estados Unidos', 'Francia']);
  });

  it('getDocumentsByRegionMap agrupa por región con conteo y obras', async () => {
    const map = await service.getDocumentsByRegionMap();
    expect(Object.keys(map)).toHaveLength(3);
    expect(map['España'].count).toBe(1);
    expect(map['España'].books[0].title).toBe('La Conquista del Pan');
    expect(map['España'].books[0].id).toBe('kropotkin-conquista');
  });

  it('getDocumentStats calcula totales', async () => {
    const stats = await service.getDocumentStats();
    expect(stats.totalDocuments).toBe(3);
    expect(stats.totalRegions).toBe(3);
    expect(stats.totalAuthors).toBe(3);
    expect(stats.averageRating).toBe('4.8');
    expect(stats.totalAccess).toBe(0);
  });

  it('getDocumentStats tolera documentos sin rating (media sobre 0)', async () => {
    vi.resetModules();
    const docsSinRating = [
      { id: 'a', title: 'A', author: 'A', region: 'X', category: 'teoria' },
      { id: 'b', title: 'B', author: 'B', region: 'X', category: 'teoria', rating: 5 }
    ];
    global.fetch = vi.fn().mockResolvedValue(okResponse(docsSinRating));
    const svc = await import('./documentService.js');
    const stats = await svc.getDocumentStats();
    expect(stats.totalDocuments).toBe(2);
    expect(stats.averageRating).toBe('2.5');
    expect(stats.totalAccess).toBe(0);
  });
});
