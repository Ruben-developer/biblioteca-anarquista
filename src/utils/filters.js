/**
 * Filtra eventos según los criterios proporcionados
 */
export const filterEvents = (events, filters) => {
  const { searchTerm, decade, category, region } = filters;

  const filtered = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDecade = decade === 'all' || event.decade === decade;
    const matchesCategory = category === 'all' || event.category === category;
    const matchesRegion = region === 'all' || event.region === region;
    
    return matchesSearch && matchesDecade && matchesCategory && matchesRegion;
  });

  // Cronológico (ascendente) para que el timeline se lea en orden aunque el
  // archivo de datos no esté perfectamente ordenado. Orden estable.
  return filtered.sort((a, b) => (a.year || 0) - (b.year || 0));
};