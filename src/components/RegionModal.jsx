import React from 'react';
import { MapPin, Heart, BookOpen } from 'lucide-react';
import { THEME } from '../constants';
import { getHistoricalBooks } from '../utils/library';
import { useModalFocus } from '../hooks';
import ModalHeader from './ModalHeader';

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
  const dialogRef = useModalFocus(onClose);

  if (!region || !regionData[region]) return null;

  const historicalBooks = getHistoricalBooks(regionData, region);

  const getHeartClass = (book) => {
    const isFav = favorites.some((f) => f.title === book.title);
    if (isFav) return 'fill-red-500 text-red-500';
    return darkMode ? 'text-gray-500 hover:text-gray-400' : 'text-amber-600 hover:text-amber-700';
  };

  return (
    <dialog
      ref={dialogRef}
      open
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-modal="true"
      aria-label={region}
    >
      <div className={`${cardClass} rounded-lg max-w-2xl w-full p-6`}>
        <ModalHeader darkMode={darkMode} title={region} icon={MapPin} onClose={onClose} />

        <p className={`${darkMode ? 'text-gray-400' : 'text-amber-900'} mb-4`}>
          {historicalBooks.length} textos históricos del anarquismo en {region}
        </p>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {historicalBooks.map((book, idx) => (
            <div key={idx} className={`${darkMode ? 'bg-gray-800/50 border-[#872320]/50' : 'bg-white/80 border-[#B79F6E]'} border-2 rounded-lg p-4`}>
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>
                    {book.title}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    por {book.author}
                  </p>
                  <div className="flex items-center gap-3 text-sm flex-wrap">
                    <span className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-700' : 'bg-amber-800'}`}>
                      {book.category}
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
                  onClick={() => onToggleFavorite(book.title, { author: book.author, year: book.pubYear, filename: book.filename, category: book.category })}
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
