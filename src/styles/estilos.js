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
    id: 'collage-vino',
    nombre: 'Collage Vino',
    nota: 'Crema, rojo oscuro, Playfair, passe-partout',
    grupo: 'Editorial',
    muestra: ['#F6F0EC', '#8A1C1C', '#1A1416']
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
