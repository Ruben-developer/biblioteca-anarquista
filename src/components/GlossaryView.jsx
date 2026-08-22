import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BookOpen, Search, BookMarked, Library } from 'lucide-react';
import { THEME } from '../constants';
import { glossaryTerms } from '../data/glossary';
import { findBookByTitle } from '../utils/library';

const GlossaryView = ({ darkMode, regionData, onRead = () => {}, onOpenLibrary = () => {} }) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;
  const [query, setQuery] = useState('');

  const term = query.trim().toLowerCase();
  const filtered = term
    ? glossaryTerms.filter(
        (g) =>
          g.term.toLowerCase().includes(term) ||
          g.definition.toLowerCase().includes(term)
      )
    : glossaryTerms;

  const inputClass = `w-full md:w-96 px-4 py-2 rounded-lg border text-sm ${
    darkMode
      ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500'
      : 'bg-white border-amber-300 text-gray-800 placeholder-amber-700'
  }`;

  return (
    <div className={`${darkMode ? 'bg-gray-900/60 border-gray-700/50' : 'bg-white/60 border-amber-300'} rounded-lg shadow-lg border-2 p-6 md:p-8`}>
      <h2 className={`text-3xl md:text-4xl font-display uppercase tracking-wide mb-2 ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
        Glosario libertario
      </h2>
      <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
        {glossaryTerms.length} términos del vocabulario anarquista, con sus definiciones y las obras del archivo que los tratan.
      </p>

      <div className="relative mb-6">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-amber-500'}`} size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar término o definición…"
          className={`${inputClass} pl-10`}
          aria-label="Buscar término del glosario"
        />
      </div>

      {filtered.length === 0 ? (
        <p className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
          No hay términos que coincidan con «{query}».
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((g) => {
            const books = (g.books || [])
              .map((title) => findBookByTitle(regionData, title))
              .filter(Boolean);
            return (
              <div key={g.term} className={`${cardClass} border-2 rounded-lg p-5 shadow-md hover:shadow-lg transition-all flex flex-col card-appear`}>
                <div className="flex items-center gap-2 mb-2">
                  <BookMarked className={darkMode ? 'text-red-400' : 'text-amber-700'} size={18} />
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    {g.term}
                  </h3>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-3 flex-1`}>
                  {g.definition}
                </p>
                {books.length > 0 && (
                  <div className={`pt-3 mt-3 border-t ${darkMode ? 'border-gray-700' : 'border-amber-300'}`}>
                    <p className={`text-xs uppercase tracking-wide mb-2 ${darkMode ? 'text-gray-500' : 'text-amber-600'}`}>
                      Obras del archivo
                    </p>
                    <div className="space-y-1.5">
                      {books.map((book, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2">
                          <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {book.title}
                          </span>
                          <span className="flex items-center gap-1.5 flex-shrink-0">
                            {book.filename && (
                              <button
                                onClick={() => onRead(book)}
                                className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                                  darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-700 text-amber-50 hover:bg-amber-800'
                                }`}
                                title={`Leer ${book.title}`}
                              >
                                <BookOpen size={12} />
                                Leer
                              </button>
                            )}
                            <button
                              onClick={() => onOpenLibrary({ searchTerm: book.title })}
                              className={`flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                                darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white border border-amber-300 text-amber-800 hover:bg-amber-100'
                              }`}
                              title={`Ver "${book.title}" en el catálogo`}
                            >
                              <Library size={11} />
                              En el catálogo
                            </button>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => onOpenLibrary({})}
        className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          darkMode ? 'bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700' : 'bg-white border border-amber-300 text-amber-800 hover:bg-amber-100'
        }`}
      >
        <Library size={16} />
        Ver todas las obras del catálogo
      </button>
    </div>
  );
};

GlossaryView.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  regionData: PropTypes.object.isRequired,
  onRead: PropTypes.func,
  onOpenLibrary: PropTypes.func
};

export default GlossaryView;