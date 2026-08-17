export const CATEGORIES = [
  { id: 'all', name: 'Todas', icon: '📚' },
  { id: 'teoria', name: 'Teoría', icon: '📖' },
  { id: 'historia', name: 'Historia', icon: '📜' },
  { id: 'revolucion', name: 'Revolución', icon: '🏴' },
  { id: 'movimiento', name: 'Movimiento', icon: '✊' },
  { id: 'organizacion', name: 'Organización', icon: '🤝' },
  { id: 'represion', name: 'Represión', icon: '⚖️' },
  { id: 'biografia', name: 'Biografía', icon: '👤' },
  { id: 'periodismo', name: 'Periodismo', icon: '📰' },
  { id: 'manifiesto', name: 'Manifiesto', icon: '📯' },
  { id: 'dialogo', name: 'Diálogo', icon: '💬' }
];

// Textos "históricos": hechos del movimiento (mapa y línea temporal).
// Los de filosofía/ideas (teoria, biografia, dialogo) viven en la sección de Autores.
// FUENTE ÚNICA definida en utils/library.js — aquí solo se re-exporta.
import { HISTORICAL_CATEGORIES as HC, isHistoricalCategory as isHC } from '../utils/library';
export const HISTORICAL_CATEGORIES = HC;
export const IDEAS_CATEGORIES = ['teoria', 'biografia', 'dialogo'];
export const isHistoricalCategory = isHC;

export const DECADES = ['all', '1860s', '1870s', '1880s', '1900s', '1910s', '1920s', '1930s', '1960s', '1970s', '1990s', '2000s', '2010s'];

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
  CONTACT: 'contact'
};

// Color themes for dark and light modes
export const THEME = {
  dark: {
    bg: 'bg-gradient-to-br from-red-950 via-black to-gray-900 text-gray-100',
    header: 'bg-black/50 border-red-900/30',
    nav: 'bg-black/30 border-red-900/20',
    card: 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-red-900/30',
    accentText: 'text-red-400',
    accentBg: 'bg-red-600',
    accentBgHover: 'hover:bg-red-700',
    button: 'bg-gray-800/50 hover:bg-gray-700/50'
  },
  light: {
    bg: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 text-gray-800',
    header: 'bg-amber-100/80 border-amber-800/30',
    nav: 'bg-amber-100/60 border-amber-800/20',
    card: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-400',
    accentText: 'text-amber-800',
    accentBg: 'bg-amber-700',
    accentBgHover: 'hover:bg-amber-800',
    button: 'bg-amber-200 hover:bg-amber-300'
  }
};
