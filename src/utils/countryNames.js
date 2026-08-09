// src/utils/countryNames.js
// Normaliza los nombres de país que devuelve react-svg-worldmap (en inglés,
// ej. "Spain", "United States", "Republic of Korea") a las claves de región
// usadas en regionData.js (en español, ej. "España", "Estados Unidos", "Corea").
const COUNTRY_NAME_TO_REGION = {
  spain: 'España',
  france: 'Francia',
  'united states': 'Estados Unidos',
  'united states of america': 'Estados Unidos',
  usa: 'Estados Unidos',
  russia: 'Rusia',
  italy: 'Italia',
  mexico: 'México',
  argentina: 'Argentina',
  chile: 'Chile',
  germany: 'Alemania',
  'united kingdom': 'Inglaterra',
  england: 'Inglaterra',
  'republic of korea': 'Corea',
  'south korea': 'Corea'
};

// Devuelve la clave de región de regionData.js para un nombre de país del mapa,
// o null si el país no tiene textos en el archivo.
export const normalizeCountryName = (name) => {
  if (!name) return null;
  const key = String(name).trim().toLowerCase();
  return COUNTRY_NAME_TO_REGION[key] || null;
};
