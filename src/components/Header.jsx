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
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <div className="min-w-0">
            <h1 
              className={`text-2xl sm:text-3xl md:text-4xl font-bold flex items-center gap-2 md:gap-3 ${darkMode ? 'text-red-500' : ''}`} 
              style={{ fontFamily: 'Georgia, serif' }}
            >
              <span className="text-3xl sm:text-4xl md:text-5xl">🏴</span>
              <span className="break-words">Archivo Histórico Anarquista</span>
            </h1>
            <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-amber-900'}`}>
              {stats.texts} textos • {stats.events} eventos • {stats.regions} regiones
            </p>
          </div>
          <div className="flex gap-2 md:gap-3">
            <button 
              onClick={onShowStats}
              className={`p-2 md:p-3 rounded-lg ${themeClass.button} transition-colors`}
              title="Mostrar estadísticas"
            >
              <BarChart3 size={20} />
            </button>
            <button 
              onClick={onShowTour}
              className={`p-2 md:p-3 rounded-lg ${themeClass.button} transition-colors`}
              title="Información y tour"
            >
              <Info size={20} />
            </button>
            <button 
              onClick={onDarkModeToggle}
              className={`p-2 md:p-3 rounded-lg ${themeClass.button} transition-colors`}
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
