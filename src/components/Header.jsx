import React from 'react';
import { BarChart3, Mail, Menu, Sun, Moon, Heart } from 'lucide-react';
import { THEME, VIEW_LABELS, VIEWS } from '../constants';

const Header = ({
  darkMode,
  onDarkModeToggle,
  onShowStats,
  onShowContact,
  onViewChange,
  favoriteCount,
  stats,
  activeView,
  menuOpen,
  onMenuToggle
}) => {
  const themeClass = darkMode ? THEME.dark : THEME.light;
  const activeLabel = VIEW_LABELS[activeView];

  return (
    <header className={`${themeClass.header} backdrop-blur-sm border-b-2 sticky top-0 z-10 shadow-md`}>
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="grid items-center gap-x-4 gap-y-3 grid-cols-[auto_1fr] [grid-template-areas:'titu_titu'_'menu_bots'] md:grid-cols-[auto_1fr_auto] md:[grid-template-areas:'menu_titu_bots']">
          <button
            onClick={onMenuToggle}
            aria-label="Abrir menú de navegación"
            aria-expanded={menuOpen}
            aria-controls="menu-lateral"
            className={`[grid-area:menu] justify-self-start flex items-center gap-2 px-3 py-2 rounded-lg transition-all active:scale-95 ${
              darkMode
                ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                : 'bg-amber-200/50 text-amber-900 hover:bg-amber-200'
            }`}
          >
            <Menu size={20} />
            <span className="md:hidden font-display text-sm uppercase tracking-wider">
              {activeLabel || 'Menú'}
            </span>
          </button>

          <div className="[grid-area:bots] justify-self-end flex items-center gap-2 md:gap-3">
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
              onClick={() => onViewChange(VIEWS.FAVORITES)}
              className={`p-2 md:p-3 rounded-lg ${themeClass.button} transition-colors relative`}
              title="Ir a favoritos"
              aria-label="Ir a favoritos"
            >
              <Heart size={20} />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[11px] leading-[18px] text-center font-semibold">
                  {favoriteCount}
                </span>
              )}
            </button>
            <button
              onClick={onDarkModeToggle}
              className={`p-2 md:p-3 rounded-lg ${themeClass.button} transition-colors`}
              title={darkMode ? 'Activar tema claro' : 'Activar tema oscuro'}
              aria-label={darkMode ? 'Activar tema claro' : 'Activar tema oscuro'}
              aria-pressed={darkMode}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div className="[grid-area:titu] md:justify-self-start min-w-0">
            <h1
              className={`text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-display tracking-tight uppercase flex items-center gap-2 md:gap-3 ${darkMode ? 'text-red-500' : ''}`}
            >
              <span className="break-words">La Idea</span>
            </h1>
            <p className={`hidden sm:block text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-amber-900'}`}>
              Archivo Histórico Anarquista · {stats.texts} textos · {stats.events} eventos · {stats.regions} regiones
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
