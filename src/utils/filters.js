/**
 * Filtra eventos según los criterios proporcionados
 */
import { countAllTexts } from './library';

export const filterEvents = (events, filters) => {
  const { searchTerm, decade, category, region } = filters;

  return events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDecade = decade === 'all' || event.decade === decade;
    const matchesCategory = category === 'all' || event.category === category;
    const matchesRegion = region === 'all' || event.region === region;
    
    return matchesSearch && matchesDecade && matchesCategory && matchesRegion;
  });
};

/**
 * Calcula el total de textos en todas las regiones.
 * FUENTE ÚNICA: delega en utils/library.js (countAllTexts) para que todos los
 * contadores de la app coincidan.
 */
export const calculateTotalTexts = (regionData) => countAllTexts(regionData);

/**
 * Verifica si un libro está en favoritos
 */
export const isFavorite = (title, favorites) => {
  return favorites.includes(title);
};

/**
 * Agrega o elimina un favorito
 */
export const toggleFavoriteBook = (title, favorites) => {
  return isFavorite(title, favorites)
    ? favorites.filter(b => b !== title)
    : [...favorites, title];
};

/**
 * Ordena los favoritos
 */
export const sortFavorites = (favorites, sortType) => {
  if (sortType === 'newest') {
    return [...favorites].reverse();
  }
  return favorites;
};
