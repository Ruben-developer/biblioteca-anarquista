export const CATEGORIES = [
  { id: 'all', name: 'Todas' },
  { id: 'historia', name: 'Historia' },
  { id: 'teoria', name: 'Teoría' },
  { id: 'acratas', name: 'Acratas' },
  { id: 'otros', name: 'Otros' }
];

// Textos "históricos": hechos del movimiento (mapa y línea temporal).
// Los de filosofía/ideas (teoria) y las vidas (acratas) viven en Autores / Acratas.
// 'otros' es un cubo de contabilidad: no se muestra en ninguna vista.
// FUENTE ÚNICA definida en utils/library.js — aquí solo se re-exporta.
export { HISTORICAL_CATEGORIES, isHistoricalCategory } from '../utils/library';
export const IDEAS_CATEGORIES = ['teoria', 'acratas'];

export const DECADES = ['all', '1700s', '1840s', '1860s', '1870s', '1880s', '1890s', '1900s', '1910s', '1920s', '1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s'];

// Regiones disponibles en el archivo. FUENTE ÚNICA: se deriva de las claves de
// regionData.js, de modo que añadir/editar una región en regionData actualiza
// automáticamente los filtros. El 'all' se antepone para los selects.
import { regionData } from '../data/regionData';
export const REGIONS = ['all', ...Object.keys(regionData)];

export const VIEWS = {
  TIMELINE: 'timeline',
  MAP: 'map',
  AUTHORS: 'authors',
  FAVORITES: 'favorites',
  LIBRARY: 'library',
  THEORIES: 'theories',
  INFLUENCES: 'influences',
  ACRATAS: 'acratas',
  PATHS: 'paths',
  GLOSSARY: 'glossary',
  CONTACT: 'contact',
  STATS: 'stats'
};

// Nombres legibles de cada vista (para el header y la navegación).
export const VIEW_LABELS = {
  [VIEWS.TIMELINE]: 'Línea Temporal',
  [VIEWS.MAP]: 'Mapa',
  [VIEWS.AUTHORS]: 'Autores',
  [VIEWS.FAVORITES]: 'Mi Biblioteca',
  [VIEWS.LIBRARY]: 'Biblioteca',
  [VIEWS.THEORIES]: 'Teorías',
  [VIEWS.INFLUENCES]: 'Red de Influencias',
  [VIEWS.ACRATAS]: 'Acratas',
  [VIEWS.PATHS]: 'Rutas',
  [VIEWS.GLOSSARY]: 'Glosario',
  [VIEWS.CONTACT]: 'Contacto',
  [VIEWS.STATS]: 'Estadísticas'
};

// Color themes for dark and light modes
// `border` es el borde único de toda la app (mismo ancho, color y opacidad
// por tema): contenedores, tarjetas, navegación, cabecera/pie, modales, mapa.
export const THEME = {
  dark: {
    bg: 'bg-gradient-to-br from-red-950 via-black to-gray-900 text-gray-100',
    header: 'bg-black/30 border-b-2 border-[#872320]/50',
    nav: 'bg-black/30 border-2 border-[#872320]/50',
    card: 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 border-[#872320]/50',
    border: 'border-2 border-[#872320]/50',
    accentText: 'text-red-400',
    accentBg: 'bg-red-600',
    accentBgHover: 'hover:bg-red-700',
    button: 'bg-black/60 hover:bg-black/80'
  },
  light: {
    bg: 'bg-gradient-to-br from-amber-50 via-amber-100 to-amber-100 text-gray-800',
    header: 'bg-amber-800/60 border-b-2 border-[#B79F6E]',
    nav: 'bg-amber-800/60 border-2 border-[#B79F6E]',
    card: 'bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-[#B79F6E]',
    border: 'border-2 border-[#B79F6E]',
    accentText: 'text-amber-800',
    accentBg: 'bg-amber-700',
    accentBgHover: 'hover:bg-amber-800',
    button: 'bg-amber-800 hover:bg-amber-700'
  }
};
