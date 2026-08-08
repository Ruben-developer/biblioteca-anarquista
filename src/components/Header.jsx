import React from 'react';
import { BarChart3, Info } from 'lucide-react';
import { THEME } from '../constants';

const Header = ({ 
  darkMode, 
  onDarkModeToggle, 
  onShowTour, 
  onShowStats,
  stats 
}) => {
  const themeClass = darkMode ? THEME.dark : THEME.light;

  return (
    <header className={`${themeClass.header} backdrop-blur-sm border-b-2 sticky top-0 z-10 shadow-md`}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 
              className={`text-4xl font-bold mb-2 flex items-center gap-3 ${darkMode ? 'text-red-500' : ''}`} 
              style={{ fontFamily: 'Georgia, serif' }}
            >
              <span className="text-5xl">🏴</span>
              Archivo Histórico Anarquista
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-amber-900'}`}>
              {stats.texts} textos • {stats.events} eventos • {stats.regions} regiones
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onShowStats}
              className={`p-3 rounded-lg ${themeClass.button} transition-colors`}
              title="Mostrar estadísticas"
            >
              <BarChart3 size={20} />
            </button>
            <button 
              onClick={onShowTour}
              className={`p-3 rounded-lg ${themeClass.button} transition-colors`}
              title="Información y tour"
            >
              <Info size={20} />
            </button>
            <button 
              onClick={onDarkModeToggle}
              className={`p-3 rounded-lg ${themeClass.button} transition-colors`}
              title="Cambiar tema"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
