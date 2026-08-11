// src/services/documentService.test.js
// Tests del servicio de descargas.
// El servicio quedó reducido a getDocumentDownloadUrl (única función en uso):
// - PDF → contenedor via /pdfs/
// - TXT → repo via BASE_URL/documents/
import { describe, it, expect, vi, beforeEach } from 'vitest';

let service;

beforeEach(async () => {
  vi.resetModules();
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

  it('no expone la IP interna del servidor de PDFs en el bundle', () => {
    expect(service.getDocumentDownloadUrl('anarquismo/a.pdf')).not.toMatch(/192\.168\./);
    expect(service.getDocumentDownloadUrl('anarquismo/a.pdf')).not.toMatch(/http/);
  });
});
