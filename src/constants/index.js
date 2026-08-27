export const CATEGORIES = [
  { id: 'all', name: 'Todas' },
  { id: 'teoria', name: 'Teoría' },
  { id: 'historia', name: 'Historia' },
  { id: 'revolucion', name: 'Revolución' },
  { id: 'movimiento', name: 'Movimiento' },
  { id: 'organizacion', name: 'Organización' },
  { id: 'represion', name: 'Represión' },
  { id: 'biografia', name: 'Biografía' },
  { id: 'periodismo', name: 'Periodismo' },
  { id: 'manifiesto', name: 'Manifiesto' },
  { id: 'dialogo', name: 'Diálogo' }
];

// Textos "históricos": hechos del movimiento (mapa y línea temporal).
// Los de filosofía/ideas (teoria, biografia, dialogo) viven en la sección de Autores.
// FUENTE ÚNICA definida en utils/library.js — aquí solo se re-exporta.
export { HISTORICAL_CATEGORIES, isHistoricalCategory } from '../utils/library';
export const IDEAS_CATEGORIES = ['teoria', 'biografia', 'dialogo'];

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
  [VIEWS.INFLUENCES]: 'Red de Autores',
  [VIEWS.PATHS]: 'Rutas',
  [VIEWS.GLOSSARY]: 'Glosario',
  [VIEWS.CONTACT]: 'Contacto',
  [VIEWS.STATS]: 'Estadísticas'
};

// Color themes for dark and light modes
export const THEME = {
  dark: {
    bg: 'bg-gradient-to-br from-red-950 via-black to-gray-900 text-gray-100',
    header: 'bg-black/50 border-[#872320]/30',
    nav: 'bg-black/30 border-[#872320]/20',
    card: 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-[#872320]/30',
    accentText: 'text-red-400',
    accentBg: 'bg-red-600',
    accentBgHover: 'hover:bg-red-700',
    button: 'bg-gray-800/50 hover:bg-gray-700/50'
  },
  light: {
    bg: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 text-gray-800',
    header: 'bg-amber-100/80 border-[#B79F6E]/30',
    nav: 'bg-amber-100/60 border-[#B79F6E]/20',
    card: 'bg-gradient-to-br from-amber-50 to-orange-50 border-[#B79F6E]',
    accentText: 'text-amber-800',
    accentBg: 'bg-amber-700',
    accentBgHover: 'hover:bg-amber-800',
    button: 'bg-amber-200 hover:bg-amber-300'
  }
};
