import React from 'react';
import { BarChart3, Mail } from 'lucide-react';
import { THEME } from '../constants';

const Header = ({ 
  darkMode, 
  onDarkModeToggle, 
  onShowStats,
  onShowContact,
  stats 
}) => {
  const themeClass = darkMode ? THEME.dark : THEME.light;

  return (
    <header className={`${themeClass.header} backdrop-blur-sm border-b-2 sticky top-0 z-10 shadow-md`}>
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <div className="min-w-0">
            <h1 
              className={`text-2xl sm:text-3xl md:text-4xl font-display tracking-tight uppercase flex items-center gap-2 md:gap-3 ${darkMode ? 'text-red-500' : ''}`}
            >
              <span className="text-3xl sm:text-4xl md:text-5xl">🏴</span>
              <span className="break-words">La Idea</span>
            </h1>
            <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-amber-900'}`}>
              Archivo Histórico Anarquista · {stats.texts} textos · {stats.events} eventos · {stats.regions} regiones
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
              onClick={onShowContact}
              className={`p-2 md:p-3 rounded-lg ${themeClass.button} transition-colors`}
              title="Contacto"
              aria-label="Contacto"
            >
              <Mail size={20} />
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
