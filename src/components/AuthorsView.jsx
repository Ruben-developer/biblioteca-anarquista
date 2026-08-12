import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Book, ChevronDown, ChevronUp, BookOpen, MapPin } from 'lucide-react';
import { THEME } from '../constants';
import { getDocumentDownloadUrl } from '../services/documentService';

const AuthorsView = ({
  darkMode,
  authors
}) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;
  const [openAuthor, setOpenAuthor] = useState(null);

  const toggleAuthor = (name) => {
    setOpenAuthor((prev) => (prev === name ? null : name));
  };

  return (
    <div>
      <h2 className={`text-3xl md:text-4xl font-display uppercase tracking-wide mb-2 ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
        Autores del Archivo
      </h2>
      <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
        {authors.length} autores, ordenados de más a menos textos de su autoría. Haz clic en un autor para ver su obra completa.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => {
          const isOpen = openAuthor === author.name;
          const primaryRegion = author.regions[0];
          return (
            <div key={author.name} className={`${cardClass} border-2 rounded-lg p-6 shadow-md hover:shadow-xl transition-all flex flex-col`}>
              <button
                className="text-left w-full"
                onClick={() => toggleAuthor(author.name)}
                aria-expanded={isOpen}
              >
                <div className="text-5xl mb-3 text-center">👤</div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2 text-center`}>
                  {author.name}
                </h3>
                {author.yearsRange && (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-amber-700'} mb-2 text-center`}>
                    {author.yearsRange} (años de sus obras)
                  </p>
                )}
                {primaryRegion && (
                  <p className={`text-xs ${darkMode ? 'text-red-400' : 'text-amber-600'} mb-3 text-center`}>
                    📍 {author.regions.join(', ')}
                  </p>
                )}
                <div className={`flex items-center justify-between pt-3 mt-3 border-t ${darkMode ? 'border-gray-700' : 'border-amber-300'}`}>
                  <span className="text-sm">
                    <Book size={16} className="inline mr-1" />
                    {author.bookCount} {author.bookCount === 1 ? 'texto' : 'textos'}
                  </span>
                  <span className="text-sm flex items-center gap-1">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="mt-4 space-y-2">
                  {author.books.map((book, idx) => (
                    <div
                      key={`${book.region}-${book.title}-${idx}`}
                      className={`rounded-lg border p-3 ${darkMode ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/80 border-amber-300'}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            {book.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-1`}>
                              <MapPin size={12} /> {book.region}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs ${darkMode ? 'bg-gray-700' : 'bg-amber-200'}`}>
                              {book.category}
                            </span>
                            {book.year && (
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {book.year}
                              </span>
                            )}
                          </div>
                        </div>
                        {book.filename && (
                          <a
                            href={getDocumentDownloadUrl(book.filename)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                              darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-700 text-amber-50 hover:bg-amber-800'
                            }`}
                          >
                            <BookOpen size={12} />
                            Leer
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

AuthorsView.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      bookCount: PropTypes.number.isRequired,
      books: PropTypes.array,
      regions: PropTypes.array,
      yearsRange: PropTypes.string
    })
  ).isRequired
};

export default AuthorsView;
