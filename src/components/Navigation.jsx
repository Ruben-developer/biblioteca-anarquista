import React from 'react';
import { Calendar, MapPin, User, Heart, BookOpen, Compass, Milestone, BookMarked } from 'lucide-react';
import { THEME, VIEWS } from '../constants';

const Navigation = ({ 
  activeView, 
  onViewChange, 
  darkMode,
  favoriteCount,
  regionCount
}) => {
  const themeClass = darkMode ? THEME.dark : THEME.light;
  
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

  return (
    <nav aria-label="Navegación principal" className={`${themeClass.nav} backdrop-blur-sm border-b`}>
      <div className="container mx-auto px-4">
        <div className="flex gap-2 py-4 overflow-x-auto">
          {navItems.map(({ view, label, icon: Icon }) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              aria-current={activeView === view ? 'page' : undefined}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg transition-all font-display text-sm uppercase tracking-wider whitespace-nowrap active:scale-95 ${
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
      </div>
    </nav>
  );
};

export default Navigation;
