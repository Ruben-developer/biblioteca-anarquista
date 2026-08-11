/**
 * Servicio de descargas de documentos.
 *
 * ÚNICA responsabilidad y FUENTE ÚNICA de URLs de descarga. Los metadatos de las
 * obras no viven aquí: viven en regionData.js (catálogo real). La API legacy de
 * documents.json (loadDocuments, getAuthors, getRegions...) se eliminó por estar
 * en desuso: ningún componente la consumía.
 */

const BASE_URL = import.meta.env.BASE_URL;
// URL base de los PDFs. En desarrollo se resuelve vía el proxy de Vite
// (ruta relativa /pdfs → el servidor interno definido en vite.config.js),
// de modo que la IP interna nunca queda expuesta en el bundle. En producción
// se usa VITE_PDF_BASE (variable de entorno, no versionada) o el fallback.
const PDF_BASE = import.meta.env.VITE_PDF_BASE || '/pdfs/';

/**
 * Obtiene URL para descargar/leer un documento a partir de su filename.
 * Los PDFs se sirven desde el contenedor local; el resto (TXT, etc.) desde el repo.
 */
export const getDocumentDownloadUrl = (filename) => {
  if (!filename) return null;
  if (filename.endsWith('.pdf')) {
    return PDF_BASE + filename;
  }
  return `${BASE_URL}documents/${filename}`;
};

export default {
  getDocumentDownloadUrl
};
