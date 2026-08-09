import React from 'react';
import WorldMap from './WorldMap';
import { MapPin } from 'lucide-react';
import { THEME } from '../constants';
import { COUNTRY_ISO } from '../data/countryData';
import { normalizeCountryName } from '../utils/countryNames';

// Interpola un color hex entre c1 (claro, pocos textos) y c2 (oscuro, muchos).
const lerpColor = (c1, c2, t) => {
  const a = parseInt(c1.slice(1), 16);
  const b = parseInt(c2.slice(1), 16);
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

  // Países con textos en el archivo (el mapa solo muestra tooltip/valor para estos).
  const mapData = Object.entries(regionData)
    .map(([region, data]) => {
      const iso = COUNTRY_ISO[region];
      return iso ? { country: iso, value: data.books.length } : null;
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
      : ['#fde68a', '#92400e'];
    return {
      fill: lerpColor(light, dark, t),
      stroke: darkMode ? '#f87171' : '#f59e0b',
      strokeWidth: 1,
      cursor: 'pointer'
    };
  };

  const tooltipTextFunction = (context) => {
    const region = getRegionForContext(context);
    if (region) {
      return `${region}: ${regionData[region].books.length} textos`;
    }
    return context.countryNameEs || context.countryName;
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900/60 border-gray-700/50' : 'bg-white/60 border-amber-300'} rounded-lg shadow-lg border-2 p-6 md:p-8`}>
      <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
        Mapa Mundial de Textos
      </h2>
      <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
        Haz clic en un país destacado para ver sus textos. Cuanto más oscuro el color, más obras tiene ese país en el archivo.
      </p>

      <WorldMap
        data={mapData}
        frame
        backgroundColor="transparent"
        borderColor={darkMode ? '#7f1d1d' : '#b45309'}
        frameColor={darkMode ? '#7f1d1d' : '#b45309'}
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
              : 'linear-gradient(to right, #fde68a, #92400e)',
            borderColor: darkMode ? '#52525b' : '#d6d3d1'
          }}
        />
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>Muchos textos</span>
      </div>

      <h3 className={`text-xl font-bold mt-8 mb-4 ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
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
              {data.books.length} textos
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WorldMapView;
