import React from 'react';
import { Heart, Book, X } from 'lucide-react';
import { THEME } from '../constants';

const FavoritesView = ({ 
  darkMode, 
  favorites,
  onToggleFavorite
}) => {
  const themeClass = darkMode ? THEME.dark : THEME.light;
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;

  return (
    <div>
      <h2 className={`text-3xl md:text-4xl font-display uppercase tracking-wide mb-6 ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
        Mis Favoritos
      </h2>
      {favorites.length === 0 ? (
        <div className={`${cardClass} border-2 rounded-lg p-12 text-center`}>
          <Heart size={64} className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-amber-300'}`} />
          <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-amber-800'}`}>
            Aún no has guardado ningún texto favorito
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-amber-600'} mt-2`}>
            Explora el mapa y guarda los textos que te interesen
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-amber-700'} mb-4`}>
            {favorites.length} texto{favorites.length !== 1 ? 's' : ''} guardado{favorites.length !== 1 ? 's' : ''}
          </p>
          {[...favorites].reverse().map((fav, idx) => (
            <div 
              key={idx}
              className={`${cardClass} border-2 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-all`}
            >
              <div className="flex items-center gap-3 flex-1">
                <Book className={darkMode ? 'text-red-400' : 'text-amber-700'} size={20} />
                <span className={`${darkMode ? 'text-gray-200' : 'text-gray-800'} font-medium`}>
                  {fav}
                </span>
              </div>
              <button 
                onClick={() => onToggleFavorite(fav)}
                className={`${darkMode ? 'text-red-400 hover:text-red-500' : 'text-red-500 hover:text-red-600'} transition-colors`}
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesView;
