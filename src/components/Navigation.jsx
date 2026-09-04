import React, { useEffect } from 'react';
import { Calendar, MapPin, User, Heart, BookOpen, Compass, Milestone, Share2, UserSquare, X } from 'lucide-react';
import { THEME, VIEWS } from '../constants';

const Navigation = ({
  activeView,
  onViewChange,
  darkMode,
  favoriteCount,
  menuOpen,
  onMenuClose
}) => {
  const themeClass = darkMode ? THEME.dark : THEME.light;

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onMenuClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    globalThis.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      globalThis.removeEventListener('keydown', onKey);
    };
  }, [menuOpen, onMenuClose]);

  const go = (view) => {
    onMenuClose();
    onViewChange(view);
  };

  const navItems = [
    { view: VIEWS.LIBRARY, label: 'Biblioteca', icon: BookOpen },
    { view: VIEWS.MAP, label: 'Mapa', icon: MapPin },
    { view: VIEWS.TIMELINE, label: 'Línea Temporal', icon: Calendar },
    { view: VIEWS.AUTHORS, label: 'Autores', icon: User },
    { view: VIEWS.INFLUENCES, label: 'Red de Influencias', icon: Share2 },
    { view: VIEWS.ACRATAS, label: 'Acratas', icon: UserSquare },
    { view: VIEWS.THEORIES, label: 'Teorías', icon: Compass },
    { view: VIEWS.PATHS, label: 'Rutas', icon: Milestone },
    { view: VIEWS.FAVORITES, label: `Mi Biblioteca (${favoriteCount})`, icon: Heart }
  ];

  return (
    <>
      {menuOpen && (
        <dialog id="menu-lateral" open className="fixed inset-0 z-50" aria-modal="true" aria-label="Menú de navegación">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={onMenuClose}
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
                onClick={onMenuClose}
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
        </dialog>
      )}
    </>
  );
};

export default Navigation;
