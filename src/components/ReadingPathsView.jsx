import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BookOpen, ChevronDown, ChevronUp, Milestone } from 'lucide-react';
import { THEME } from '../constants';
import { readingPaths } from '../data/readingPaths';
import { findBookByTitle } from '../utils/library';

const ReadingPathsView = ({ darkMode, regionData, onRead = () => {} }) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;
  const [openId, setOpenId] = useState(readingPaths[0]?.id || null);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div>
      <h2 className={`text-3xl md:text-4xl font-display uppercase tracking-wide mb-2 ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
        Rutas de lectura
      </h2>
      <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
        {readingPaths.length} itinerarios temáticos para adentrarse en el archivo. Cada ruta enlaza obras del catálogo en el orden propuesto.
      </p>
      <div className="flex flex-col gap-4">
        {readingPaths.map((path) => {
          const isOpen = openId === path.id;
          const books = path.books
            .map((title) => findBookByTitle(regionData, title))
            .filter(Boolean);
          return (
            <div key={path.id} className={`${cardClass} border-2 rounded-lg p-5 shadow-md hover:shadow-lg transition-all card-appear`}>
              <button
                className="w-full text-left"
                onClick={() => toggle(path.id)}
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{path.icon}</span>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                      {path.title}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-amber-700'} line-clamp-2`}>
                      {path.description}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-amber-200 text-amber-900'}`}>
                    {books.length} {books.length === 1 ? 'obra' : 'obras'}
                  </span>
                  <span className={`flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-amber-600'}`}>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-amber-300'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-amber-700'} mb-4`}>
                    {path.description}
                  </p>
                  <div className="relative">
                    <div className={`absolute top-0 bottom-0 left-[11px] w-0.5 ${darkMode ? 'bg-red-600/60' : 'bg-amber-600/60'}`} />
                    <div className="flex flex-col gap-3">
                      {books.map((book, idx) => (
                        <div key={idx} className="relative flex items-center gap-3 pl-7">
                          <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${
                            darkMode ? 'bg-gray-900 border-red-600 text-red-400' : 'bg-amber-50 border-amber-700 text-amber-800'
                          }`}>
                            {idx + 1}
                          </span>
                          <div className={`flex-1 rounded-lg border p-3 ${darkMode ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/80 border-amber-300'}`}>
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <p className={`text-sm font-medium truncate ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                  {book.title}
                                </p>
                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {book.author} · {book.year || '—'}
                                </p>
                              </div>
                              {book.filename && (
                                <button
                                  onClick={() => onRead(book)}
                                  className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                                    darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-700 text-amber-50 hover:bg-amber-800'
                                  }`}
                                >
                                  <BookOpen size={12} />
                                  Leer
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

ReadingPathsView.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  regionData: PropTypes.object.isRequired,
  onRead: PropTypes.func
};

export default ReadingPathsView;