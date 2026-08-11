// src/data/countryData.js
// Mapeo región → código ISO 3166-1 alpha-2 para el mapamundi.
//
// FUENTE ÚNICA: el ISO vive declarado como `iso` en cada región de
// regionData.js (la única fuente de verdad de regiones/libros). Aquí solo se
// deriva ese campo, de modo que ya no hay que mantener sync a mano.

import { regionData } from './regionData';

export const COUNTRY_ISO = Object.fromEntries(
  Object.entries(regionData)
    .map(([region, data]) => [region, data.iso])
    .filter(([, iso]) => Boolean(iso))
);

// Devuelve el código ISO de una región (o null si no tiene mapeo).
// Los países sin ISO simplemente no se pintan en el mapamundi.
export const getIsoCode = (region) => COUNTRY_ISO[region] || null;
