// src/data/countryData.js
// Mapeo región (clave de regionData.js) → código ISO 3166-1 alpha-2
// para el mapamundi interactivo (react-svg-worldmap).
//
// IMPORTANTE: mantener SIEMPRE sincronizado con regionData.js y con
// REGIONS en src/constants/index.js (los 3 sitios o el mapa/filtros se desincronizan).
export const COUNTRY_ISO = {
  'España': 'es',
  'Francia': 'fr',
  'Estados Unidos': 'us',
  'Rusia': 'ru',
  'Italia': 'it',
  'México': 'mx',
  'Argentina': 'ar',
  'Chile': 'cl',
  'Alemania': 'de',
  'Inglaterra': 'gb',
  'Corea': 'kr',
  'Colombia': 'co',
  'Bolivia': 'bo',
  'Japón': 'jp',
  'Siria': 'sy',
  'Nigeria': 'ng'
};

// Devuelve el código ISO de una región (o null si no tiene mapeo).
// Los países sin ISO simplemente no se pintan en el mapamundi.
export const getIsoCode = (region) => COUNTRY_ISO[region] || null;
