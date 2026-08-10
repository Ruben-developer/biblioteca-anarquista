import React from 'react';
import { THEME } from '../constants';

const StatsPanel = ({ darkMode, stats }) => {
  const themeClass = darkMode ? THEME.dark : THEME.light;
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;

  const statItems = [
    { label: 'Textos', value: stats.texts },
    { label: 'Eventos', value: stats.events },
    { label: 'Regiones', value: stats.regions },
    { label: 'Autores', value: stats.authors }
  ];

  return (
    <div className={`${themeClass.nav}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((item) => (
            <div key={item.label} className={`${cardClass} border-2 rounded-lg p-4 text-center`}>
              <div className={`text-3xl font-bold ${darkMode ? 'text-red-400' : 'text-amber-800'}`}>
                {item.value}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
