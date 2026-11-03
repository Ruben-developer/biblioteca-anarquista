// Estilos visuales disponibles. El CSS de cada uno vive en src/estilos.css
// (generado por scripts/generar-estilos.mjs) y se activa con
// <html data-estilo="…">. Aquí solo van los metadatos para el selector.

export const ESTILO_KEY = 'laidea_estilo_v1';
export const ESTILO_DEFAULT = 'clasico';

export const ESTILOS = [
  {
    id: 'clasico',
    nombre: 'Clásico',
    nota: 'Papel ámbar, tinta roja',
    muestra: ['#fffbeb', '#78350f', '#dc2626']
  },
  {
    id: 'bauhaus',
    nombre: 'Bauhaus',
    nota: 'Diagonal, geométrica, terracota',
    muestra: ['#EDE3CE', '#26211B', '#B23A2A']
  },
  {
    id: 'brutal',
    nombre: 'Brutal',
    nota: 'Negro denso, condensada, coral',
    muestra: ['#0A0A0A', '#F5EFDF', '#FF3B2F']
  },
  {
    id: 'collage',
    nombre: 'Collage',
    nota: 'Blanco roto, serif, carmesí',
    muestra: ['#F7F4EE', '#111111', '#D0021B']
  },
  {
    id: 'constructivista',
    nombre: 'Constructivista',
    nota: 'Papel viejo, carmesí, técnica',
    muestra: ['#E8DCC0', '#1A1714', '#C1121F']
  }
];

export const getEstilo = (id) => ESTILOS.find((e) => e.id === id) || ESTILOS[0];

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
