/**
 * Filtra eventos según los criterios proporcionados
 */
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
 * Calcula el total de textos en todas las regiones
 */
export const calculateTotalTexts = (regionData) => {
  return Object.values(regionData).reduce((sum, region) => sum + region.books.length, 0);
};

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
