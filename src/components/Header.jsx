import React from 'react';
import { BarChart3, Mail, Menu } from 'lucide-react';
import { THEME, VIEW_LABELS } from '../constants';

const Header = ({
  darkMode,
  onDarkModeToggle,
  onShowStats,
  onShowContact,
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
        {/* Grid con áreas: en móvil el título va en su propia fila arriba
            y la hamburguesa + botones en la fila de abajo; en web todo en
            una fila: hamburguesa · título (anclado a la izquierda) · botones. */}
        <div className="grid items-center gap-x-4 gap-y-3 grid-cols-[auto_1fr] [grid-template-areas:'titu_titu'_'menu_bots'] md:grid-cols-[auto_1fr_auto] md:[grid-template-areas:'menu_titu_bots']">
          {/* Hamburguesa: en móvil al inicio de la línea de botones; en web
              como icono-logo a la izquierda, junto al título. */}
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
            {/* En smartphone: la hamburguesa lleva el texto del menú activo. */}
            <span className="md:hidden font-display text-sm uppercase tracking-wider">
              {activeLabel || 'Menú'}
            </span>
          </button>

          {/* Botones de acción: en móvil cierran la línea de la hamburguesa
              (a la derecha); en web van a la derecha del grupo. */}
          <div className="[grid-area:bots] justify-self-end flex items-center gap-2 md:gap-3">
            {activeLabel && (
              <span
                className={`hidden sm:inline-block px-3 py-1.5 rounded-lg text-xs md:text-sm font-display uppercase tracking-wider ${darkMode ? 'bg-gray-800/60 text-red-400' : 'bg-amber-100/70 text-amber-900'}`}
                aria-hidden="true"
              >
                {activeLabel}
              </span>
            )}
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

          {/* Título: en móvil ocupa su propia fila arriba (área titu); en web va
              en la columna central pero anclado a la izquierda, justo al
              lado de la hamburguesa. */}
          <div className="[grid-area:titu] md:justify-self-start min-w-0">
            <h1
              className={`text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-display tracking-tight uppercase flex items-center gap-2 md:gap-3 ${darkMode ? 'text-red-500' : ''}`}
            >
              <span className="text-5xl sm:text-6xl md:text-6xl">🏴</span>
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