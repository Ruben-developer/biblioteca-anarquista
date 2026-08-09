/**
 * Servicio para cargar documentos desde documents.json
 * Proporciona métodos para acceder a documentos y metadatos
 */

const BASE_URL = import.meta.env.BASE_URL;
// URL base de los PDFs. En desarrollo se resuelve vía el proxy de Vite
// (ruta relativa /pdfs → el servidor interno definido en vite.config.js),
// de modo que la IP interna nunca queda expuesta en el bundle. En producción
// se usa VITE_PDF_BASE (variable de entorno, no versionada) o el fallback.
const PDF_BASE = import.meta.env.VITE_PDF_BASE || '/pdfs/';

let documentsCache = null;

/**
 * Carga los documentos desde el archivo JSON
 */
export const loadDocuments = async () => {
  if (documentsCache) {
    return documentsCache;
  }

  try {
    const response = await fetch(`${BASE_URL}documents/documents.json`);
    if (!response.ok) {
      throw new Error(`Error al cargar documentos: ${response.status}`);
    }
    const data = await response.json();
    documentsCache = data.documents || [];
    return documentsCache;
  } catch (error) {
    console.error('Error cargando documentos:', error);
    return [];
  }
};

/**
 * Obtiene todos los documentos
 */
export const getDocuments = async () => {
  return await loadDocuments();
};

/**
 * Obtiene un documento por ID
 */
export const getDocumentById = async (id) => {
  const docs = await loadDocuments();
  return docs.find(doc => doc.id === id);
};

/**
 * Obtiene documentos por región
 */
export const getDocumentsByRegion = async (region) => {
  const docs = await loadDocuments();
  if (region === 'all') return docs;
  return docs.filter(doc => doc.region === region);
};

/**
 * Obtiene documentos por categoría
 */
export const getDocumentsByCategory = async (category) => {
  const docs = await loadDocuments();
  if (category === 'all') return docs;
  return docs.filter(doc => doc.category === category);
};

/**
 * Busca documentos por término
 */
export const searchDocuments = async (searchTerm) => {
  const docs = await loadDocuments();
  const term = searchTerm.toLowerCase();
  
  return docs.filter(doc => 
    doc.title.toLowerCase().includes(term) ||
    doc.author.toLowerCase().includes(term) ||
    doc.summary.toLowerCase().includes(term) ||
    (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(term)))
  );
};

/**
 * Obtiene todos los autores únicos
 */
export const getAuthors = async () => {
  const docs = await loadDocuments();
  const authorsMap = new Map();
  
  docs.forEach(doc => {
    if (!authorsMap.has(doc.author)) {
      authorsMap.set(doc.author, {
        name: doc.author,
        bio: doc.authorBio,
        years: doc.authorYear,
        region: doc.region,
        documentCount: 0
      });
    }
    authorsMap.get(doc.author).documentCount += 1;
  });
  
  return Array.from(authorsMap.values());
};

/**
 * Obtiene todas las regiones únicas
 */
export const getRegions = async () => {
  const docs = await loadDocuments();
  const regions = new Set(docs.map(doc => doc.region));
  return Array.from(regions).sort((a, b) => a.localeCompare(b));
};

/**
 * Obtiene documentos organizados por región
 */
export const getDocumentsByRegionMap = async () => {
  const docs = await loadDocuments();
  const regionMap = {};
  
  docs.forEach(doc => {
    if (!regionMap[doc.region]) {
      regionMap[doc.region] = {
        region: doc.region,
        count: 0,
        books: []
      };
    }
    
    regionMap[doc.region].books.push({
      title: doc.title,
      author: doc.author,
      year: doc.year,
      category: doc.category,
      rating: doc.rating,
      summary: doc.summary,
      filename: doc.filename,
      fileFormat: doc.fileFormat,
      id: doc.id
    });
    
    regionMap[doc.region].count += 1;
  });
  
  return regionMap;
};

/**
 * Obtiene URL para descargar un documento
 * Los PDFs se sirven desde el contenedor nginx local; los TXT desde el repo
 */
export const getDocumentDownloadUrl = (filename) => {
  if (!filename) return null;
  if (filename.endsWith('.pdf')) {
    return PDF_BASE + filename;
  }
  return `${BASE_URL}documents/${filename}`;
};

/**
 * Obtiene estadísticas de documentos
 */
export const getDocumentStats = async () => {
  const docs = await loadDocuments();
  const regions = await getRegions();
  
  return {
    totalDocuments: docs.length,
    totalRegions: regions.length,
    totalAuthors: new Set(docs.map(doc => doc.author)).size,
    averageRating: (docs.reduce((sum, doc) => sum + (doc.rating || 0), 0) / docs.length).toFixed(1),
    totalAccess: docs.reduce((sum, doc) => sum + (doc.accessCount || 0), 0)
  };
};

export default {
  loadDocuments,
  getDocuments,
  getDocumentById,
  getDocumentsByRegion,
  getDocumentsByCategory,
  searchDocuments,
  getAuthors,
  getRegions,
  getDocumentsByRegionMap,
  getDocumentDownloadUrl,
  getDocumentStats
};
