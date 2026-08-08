import React from 'react';
import { MapPin } from 'lucide-react';
import { THEME } from '../constants';

const MapView = ({ 
  darkMode, 
  regionData,
  onSelectRegion
}) => {
  const themeClass = darkMode ? THEME.dark : THEME.light;
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;

  return (
    <div className={`${darkMode ? 'bg-gray-900/60 border-gray-700/50' : 'bg-white/60 border-amber-300'} rounded-lg shadow-lg border-2 p-8`}>
      <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
        Textos por Región
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(regionData).map(([region, data]) => (
          <button
            key={region}
            onClick={() => onSelectRegion(region)}
            className={`${cardClass} border-2 rounded-lg p-6 hover:shadow-lg transition-all text-left`}
          >
            <div className="flex items-center gap-3 mb-2">
              <MapPin className={darkMode ? 'text-red-400' : 'text-amber-700'} size={24} />
              <h3 className={`font-bold text-xl ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {region}
              </h3>
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

export default MapView;
