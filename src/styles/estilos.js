// Estilo visual único del sitio. El CSS vive en src/estilos.css (generado por
// scripts/generar-estilos.mjs) y se activa con <html data-estilo="…">.
export const ESTILO = 'collage-vino';

export const ESTILOS = [
  {
    id: ESTILO,
    nombre: 'Collage Vino',
    nota: 'Crema, rojo oscuro, Playfair',
    muestra: ['#F6F0EC', '#8A1C1C', '#1A1416']
  }
];

export const getEstilo = () => ESTILOS[0];

/** Aplica el estilo al documento. Seguro en SSR (no hay document). */
export const aplicarEstilo = () => {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.estilo = ESTILO;
};
