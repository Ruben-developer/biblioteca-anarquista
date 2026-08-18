import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, User, Heart, BookOpen, Compass, Milestone, BookMarked, Menu, X } from 'lucide-react';
import { THEME, VIEWS } from '../constants';

const Navigation = ({ 
  activeView, 
  onViewChange, 
  darkMode,
  favoriteCount,
  regionCount
}) => {
  const themeClass = darkMode ? THEME.dark : THEME.light;
  const [menuOpen, setMenuOpen] = useState(false);

  // Cerrar el drawer con Escape y bloquear el scroll de fondo mientras está abierto.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const go = (view) => {
    setMenuOpen(false);
    onViewChange(view);
  };

  const navItems = [
    { view: VIEWS.LIBRARY, label: 'Biblioteca', icon: BookOpen },
    { view: VIEWS.MAP, label: `Mapa (${regionCount})`, icon: MapPin },
    { view: VIEWS.TIMELINE, label: 'Línea Temporal', icon: Calendar },
    { view: VIEWS.AUTHORS, label: 'Autores', icon: User },
    { view: VIEWS.THEORIES, label: 'Teorías', icon: Compass },
    { view: VIEWS.PATHS, label: 'Rutas', icon: Milestone },
    { view: VIEWS.GLOSSARY, label: 'Glosario', icon: BookMarked },
    { view: VIEWS.FAVORITES, label: `Favoritos (${favoriteCount})`, icon: Heart }
  ];

  const pillClass = (view) =>
    `flex items-center gap-2 px-5 py-3 rounded-lg transition-all font-display text-sm uppercase tracking-wider whitespace-nowrap active:scale-95 ${
      activeView === view
        ? darkMode 
          ? 'bg-red-600 text-white' 
          : 'bg-amber-800 text-amber-50'
        : darkMode 
          ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50' 
          : 'bg-amber-200/50 text-amber-900 hover:bg-amber-200'
    }`;

  return (
    <>
      <nav aria-label="Navegación principal" className={`${themeClass.nav} backdrop-blur-sm border-b`}>
        <div className="container mx-auto px-4">
          {/* Todos los tamaños: hamburguesa que abre el drawer lateral.
              En md+ se complementa con las píldoras de escritorio. */}
          <div className="flex items-center justify-between gap-3 py-3">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú de navegación"
              aria-expanded={menuOpen}
              aria-controls="menu-lateral"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all active:scale-95 ${
                darkMode
                  ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  : 'bg-amber-200/50 text-amber-900 hover:bg-amber-200'
              }`}
            >
              <Menu size={20} />
              <span className="font-display text-sm uppercase tracking-wider md:hidden">
                {navItems.find((i) => i.view === activeView)?.label || 'Menú'}
              </span>
            </button>

            {/* Desktop/tablet (md+): píldoras en fila */}
            <div className="hidden md:flex gap-2 overflow-x-auto">
              {navItems.map(({ view, label, icon: Icon }) => (
                <button
                  key={view}
                  onClick={() => go(view)}
                  aria-current={activeView === view ? 'page' : undefined}
                  className={pillClass(view)}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Drawer lateral: overlay + panel (todos los tamaños) */}
      {menuOpen && (
        <div id="menu-lateral" className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Menú de navegación">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            aria-label="Navegación lateral"
            className={`absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] overflow-y-auto p-4 shadow-2xl ${themeClass.nav} backdrop-blur-md`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`font-display text-sm uppercase tracking-wider ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
                La Idea
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Cerrar menú de navegación"
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'text-gray-300 hover:bg-gray-700/50'
                    : 'text-amber-900 hover:bg-amber-200'
                }`}
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {navItems.map(({ view, label, icon: Icon }) => (
                <button
                  key={view}
                  onClick={() => go(view)}
                  aria-current={activeView === view ? 'page' : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-display text-sm uppercase tracking-wider text-left active:scale-[0.98] ${
                    activeView === view
                      ? darkMode 
                        ? 'bg-red-600 text-white' 
                        : 'bg-amber-800 text-amber-50'
                      : darkMode 
                        ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50' 
                        : 'bg-amber-200/50 text-amber-900 hover:bg-amber-200'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navigation;
