// Estilos visuales disponibles. El CSS de cada uno vive en src/estilos.css
// (generado por scripts/generar-estilos.mjs) y se activa con
// <html data-estilo="…">. Aquí solo van los metadatos para el selector.

export const ESTILO_KEY = 'laidea_estilo_v1';
export const ESTILO_DEFAULT = 'clasico';

export const ESTILOS = [
  {
    id: 'clasico',
    nombre: 'Clásico',
    nota: 'Pergamino, tinta roja, serif',
    grupo: 'Original',
    muestra: ['#F5EDD9', '#D02C26', '#1A1818']
  },
  {
    id: 'brutal',
    nombre: 'Brutal',
    nota: 'Negro, coral, Anton, sin sombras',
    grupo: 'Brutal',
    muestra: ['#0A0A0A', '#FF3B2F', '#F5EFDF']
  },
  {
    id: 'brutal-acido',
    nombre: 'Brutal ácido',
    nota: 'Negro, lima, mono, rejilla dura',
    grupo: 'Brutal',
    muestra: ['#08090A', '#D8FF00', '#F2F0E6']
  },
  {
    id: 'collage',
    nombre: 'Collage',
    nota: 'Blanco, carmesí, serif, recortes',
    grupo: 'Collage',
    muestra: ['#FFFFFF', '#D0021B', '#111111']
  },
  {
    id: 'collage-prensa',
    nombre: 'Collage prensa',
    nota: 'Papel prensa, rojo, Oswald, trama',
    grupo: 'Collage',
    muestra: ['#EFEBE3', '#C8102E', '#141414']
  },
  {
    id: 'hud',
    nombre: 'HUD sci-fi',
    nota: 'Negro, naranja neón, corchetes',
    grupo: 'Nuevos',
    muestra: ['#040607', '#FF6A00', '#FFD400']
  },
  {
    id: 'deconstructivo',
    nombre: 'Deconstructivo',
    nota: 'Blanco, rojo puro, círculos, solape',
    grupo: 'Nuevos',
    muestra: ['#FFFFFF', '#E30613', '#0B0B0B']
  },
  {
    id: 'zine',
    nombre: 'Zine',
    nota: 'Tomate, negro, marcador, estrellas',
    grupo: 'Nuevos',
    muestra: ['#FFFFFF', '#FF4438', '#0B0B0B']
  },
  {
    id: 'bauhaus',
    nombre: 'Bauhaus',
    nota: 'Crema, terracota, Jost, diagonales',
    grupo: 'Primera iteración',
    muestra: ['#EDE3CE', '#B23A2A', '#26211B']
  },
  {
    id: 'constructivista',
    nombre: 'Constructivista',
    nota: 'Papel viejo, carmesí, Oswald',
    grupo: 'Primera iteración',
    muestra: ['#E8DCC0', '#C1121F', '#1A1714']
  }
];

export const getEstilo = (id) => ESTILOS.find((e) => e.id === id) || ESTILOS[0];

/** Estilos agrupados para el desplegable, en el orden de ESTILOS. */
export const gruposDeEstilos = () =>
  ESTILOS.reduce((acc, e) => {
    const grupo = e.grupo || 'Estilos';
    const existente = acc.find((g) => g.nombre === grupo);
    if (existente) existente.estilos.push(e);
    else acc.push({ nombre: grupo, estilos: [e] });
    return acc;
  }, []);

/**
 * Estilo inicial: `?estilo=` manda (enlaces de muestra y QA), luego lo
 * guardado y, si no hay nada, el clásico.
 */
export const estiloInicial = () => {
  if (typeof window === 'undefined') return ESTILO_DEFAULT;
  try {
    const pedido = new URLSearchParams(window.location.search).get('estilo');
    if (pedido && ESTILOS.some((e) => e.id === pedido)) return pedido;
    return getEstilo(localStorage.getItem(ESTILO_KEY)).id;
  } catch {
    return ESTILO_DEFAULT;
  }
};

/** Aplica el estilo al documento. Seguro en SSR (no hay document). */
export const aplicarEstilo = (id) => {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.estilo = getEstilo(id).id;
};
