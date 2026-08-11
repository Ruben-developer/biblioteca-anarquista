import React from 'react';
import WorldMap from './WorldMap';
import { MapPin } from 'lucide-react';
import { THEME, isHistoricalCategory } from '../constants';
import { COUNTRY_ISO } from '../data/countryData';
import { normalizeCountryName } from '../utils/countryNames';

// Obras históricas de una región (el mapa solo muestra hechos del movimiento,
// no los textos de filosofía/ideas, que viven en la sección de Autores).
const getHistoricalBooks = (data) => (data.books || []).filter((b) => isHistoricalCategory(b.category));

// Interpola un color hex entre c1 (claro, pocos textos) y c2 (oscuro, muchos).
const lerpColor = (c1, c2, t) => {
  const a = Number.parseInt(c1.slice(1), 16);
  const b = Number.parseInt(c2.slice(1), 16);
  const ar = (a >> 16) & 255;
  const ag = (a >> 8) & 255;
  const ab = a & 255;
  const br = (b >> 16) & 255;
  const bg = (b >> 8) & 255;
  const bb = b & 255;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r}, ${g}, ${bl})`;
};

const WorldMapView = ({ darkMode, regionData, onSelectRegion }) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;

  // Países con textos históricos en el archivo (el mapa solo muestra hechos
  // del movimiento; los de filosofía/ideas viven en la sección de Autores).
  const mapData = Object.entries(regionData)
    .map(([region, data]) => {
      const iso = COUNTRY_ISO[region];
      return iso ? { country: iso, value: getHistoricalBooks(data).length } : null;
    })
    .filter(Boolean);

  // Resuelve la región del archivo para un contexto del mapa (o null si no hay textos).
  const getRegionForContext = (context) => {
    const region = context && normalizeCountryName(context.countryName);
    return region && regionData[region] ? region : null;
  };

  const handleCountryClick = (context) => {
    const region = getRegionForContext(context);
    if (region) onSelectRegion(region);
  };

  const styleFunction = (context) => {
    const hasTexts = Boolean(getRegionForContext(context));
    if (!hasTexts) {
      return {
        fill: darkMode ? '#3f3f46' : '#e7e5e4',
        stroke: darkMode ? '#52525b' : '#d6d3d1',
        strokeWidth: 0.5,
        cursor: 'default'
      };
    }
    // Gradiente: 1 texto = color claro, N textos = más oscuro (hasta maxValue).
    const max = Math.max(context.maxValue, 1);
    const min = Math.min(context.minValue, max);
    const t = max > min
      ? Math.min(Math.max((context.countryValue - min) / (max - min), 0), 1)
      : 1;
    const [light, dark] = darkMode
      ? ['#fca5a5', '#7f1d1d']
      : ['#E4CCC0', '#8A1E19'];
    return {
      fill: lerpColor(light, dark, t),
      stroke: darkMode ? '#f87171' : '#A0241A',
      strokeWidth: 1,
      cursor: 'pointer'
    };
  };

  const tooltipTextFunction = (context) => {
    const region = getRegionForContext(context);
    if (region) {
      return `${region}: ${getHistoricalBooks(regionData[region]).length} textos históricos`;
    }
    return context.countryNameEs || context.countryName;
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900/60 border-gray-700/50' : 'bg-white/60 border-amber-300'} rounded-lg shadow-lg border-2 p-6 md:p-8`}>
      <h2 className={`text-3xl md:text-4xl font-display uppercase tracking-wide mb-2 ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
        Mapa Mundial de Textos
      </h2>
      <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
        Haz clic en un país destacado para ver sus textos históricos. Cuanto más oscuro el color, más hechos del movimiento registra ese país. Los textos de filosofía e ideas viven en la sección de Autores.
      </p>

      <WorldMap
        data={mapData}
        frame
        backgroundColor="transparent"
        borderColor={darkMode ? '#7f1d1d' : '#A0241A'}
        frameColor={darkMode ? '#7f1d1d' : '#A0241A'}
        onClickFunction={handleCountryClick}
        styleFunction={styleFunction}
        tooltipTextFunction={tooltipTextFunction}
        containerClassName="w-full"
      />

      <div className="mt-4 flex items-center gap-3 justify-center">
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>Pocos textos</span>
        <div
          className="h-3 w-40 rounded-full border"
          style={{
            background: darkMode
              ? 'linear-gradient(to right, #fca5a5, #7f1d1d)'
              : 'linear-gradient(to right, #E4CCC0, #8A1E19)',
            borderColor: darkMode ? '#52525b' : '#d6d3d1'
          }}
        />
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>Muchos textos</span>
      </div>

      <h3 className={`text-xl font-display uppercase tracking-wide mt-8 mb-4 ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
        O navega por región
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(regionData).map(([region, data]) => (
          <button
            key={region}
            onClick={() => onSelectRegion(region)}
            className={`${cardClass} border-2 rounded-lg p-6 hover:shadow-lg transition-all text-left`}
          >
            <div className="flex items-center gap-3 mb-2">
              <MapPin className={darkMode ? 'text-red-400' : 'text-amber-700'} size={24} />
              <h4 className={`font-bold text-xl ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {region}
              </h4>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
              {getHistoricalBooks(data).length} textos históricos
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WorldMapView;
