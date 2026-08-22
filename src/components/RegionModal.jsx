import React from 'react';
import { X, MapPin, Heart, BookOpen } from 'lucide-react';
import { THEME } from '../constants';
import { getHistoricalBooks } from '../utils/library';

const RegionModal = ({
  darkMode,
  region,
  regionData,
  favorites,
  onClose,
  onToggleFavorite,
  onRead = () => {}
}) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;

  if (!region || !regionData[region]) return null;

  const historicalBooks = getHistoricalBooks(regionData, region);

  const getHeartClass = (book) => {
    const isFav = favorites.some((f) => f.title === book.title);
    if (isFav) return 'fill-red-500 text-red-500';
    return darkMode ? 'text-gray-500 hover:text-gray-400' : 'text-amber-600 hover:text-amber-700';
  };

  return (
    <dialog
      open
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-modal="true"
      aria-label={region}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') onClose();
      }}
    >
      <div className={`${cardClass} border-4 ${darkMode ? 'border-red-900/50' : 'border-amber-700'} rounded-lg max-w-2xl w-full p-6`}>
        <div className={`${darkMode ? 'bg-red-900/30' : 'bg-amber-700'} rounded-t-lg -m-6 mb-4 p-4`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <MapPin className={darkMode ? 'text-red-400' : 'text-amber-100'} size={28} />
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-amber-50'}`}>
                {region}
              </h2>
            </div>
            <button onClick={onClose} className={darkMode ? 'text-gray-300' : 'text-amber-100'}>
              <X size={24} />
            </button>
          </div>
        </div>

        <p className={`${darkMode ? 'text-gray-400' : 'text-amber-900'} mb-4`}>
          {historicalBooks.length} textos históricos del anarquismo en {region}
        </p>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {historicalBooks.map((book, idx) => (
            <div key={idx} className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/80 border-amber-300'} border-2 rounded-lg p-4`}>
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>
                    {book.title}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    por {book.author}
                  </p>
                  <div className="flex items-center gap-3 text-sm flex-wrap">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      📅 {book.year}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-700' : 'bg-amber-200'}`}>
                      {book.category}
                    </span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      ⭐ {book.rating}
                    </span>
                  </div>
                  {book.summary && (
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'} mt-2 line-clamp-2`}>
                      {book.summary}
                    </p>
                  )}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {book.filename && (
                      <button
                        onClick={() => onRead(book)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-700 text-amber-50 hover:bg-amber-800'
                        }`}
                      >
                        <BookOpen size={12} />
                        Leer
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onToggleFavorite(book.title, { author: book.author, year: book.year, filename: book.filename, category: book.category })}
                  className="flex-shrink-0 transition-transform hover:scale-110"
                  title={favorites.some((f) => f.title === book.title) ? 'Remover de favoritos' : 'Agregar a favoritos'}
                >
                  <Heart
                    size={20}
                    className={getHeartClass(book)}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </dialog>
  );
};

export default RegionModal;
