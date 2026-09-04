import React, { useState, useMemo, useEffect } from 'react';
import { Book, ChevronDown, ChevronUp, BookOpen, MapPin, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { THEME } from '../constants';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const PAGE_SIZE = 12;

const getTodosButtonClass = (darkMode, activeLetter, search) => {
  const isActive = !activeLetter && !search;
  if (isActive) {
    return darkMode ? 'bg-red-600 text-white' : 'bg-amber-800 text-amber-50';
  }
  return darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-amber-800 text-amber-50 hover:bg-amber-800';
};

const getLetterButtonClass = (darkMode, activeLetter, letter, letterCount) => {
  if (activeLetter === letter) {
    return darkMode ? 'bg-red-600 text-white' : 'bg-amber-800 text-amber-50';
  }
  if (letterCount) {
    return darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-amber-800 text-amber-50 hover:bg-amber-800';
  }
  return darkMode ? 'bg-gray-900 text-gray-600 cursor-default' : 'bg-gray-100 text-gray-400 cursor-default';
};

const getLetterCountClass = (darkMode, activeLetter, letter) => {
  if (activeLetter === letter) {
    return '';
  }
  return darkMode ? 'text-gray-500' : 'text-amber-600';
};

const AuthorsView = ({
  darkMode,
  authors,
  onRead = () => {}
}) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;
  const [openAuthor, setOpenAuthor] = useState(null);
  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState(null);
  const [page, setPage] = useState(1);

  const toggleAuthor = (name) => {
    setOpenAuthor((prev) => (prev === name ? null : name));
  };

  const letterCounts = useMemo(() => {
    const counts = {};
    authors.forEach((a) => {
      const letter = a.name.charAt(0).toUpperCase();
      counts[letter] = (counts[letter] || 0) + 1;
    });
    return counts;
  }, [authors]);

  const filtered = useMemo(() => {
    let result = authors;
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((a) => a.name.toLowerCase().includes(term));
    }
    if (activeLetter) {
      result = result.filter((a) => a.name.charAt(0).toUpperCase() === activeLetter);
    }
    return result;
  }, [authors, search, activeLetter]);

  useEffect(() => { setPage(1) }, [search, activeLetter]);

  const handleLetterClick = (letter) => {
    setActiveLetter((prev) => (prev === letter ? null : letter));
    setSearch('');
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value) setActiveLetter(null);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900/60 border-[#872320]/50' : 'bg-white/60 border-[#B79F6E]'} rounded-lg shadow-lg border-2 p-6 md:p-8`}>
      <h2 className={`text-3xl md:text-4xl font-display uppercase tracking-wide mb-2 ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
        Autores
      </h2>

      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
        {authors.length} autores, ordenados de más a menos textos de su autoría.
      </p>

      <div className="relative mb-4">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`} size={18} />
        <input
          type="text"
          placeholder="Buscar autor..."
          value={search}
          onChange={handleSearchChange}
          className={`w-full ${darkMode ? 'bg-gray-800 border-[#872320] text-gray-100 placeholder-gray-500' : 'bg-white/80 border-[#B79F6E] text-gray-800 placeholder-amber-600'} border-2 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#B79F6E] transition-colors`}
        />
      </div>

      <div className="flex flex-wrap gap-1 mb-5">
        <button
          onClick={() => { setActiveLetter(null); setSearch(''); }}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${getTodosButtonClass(darkMode, activeLetter, search)}`}
        >
          Todos
        </button>
        {ALPHABET.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            disabled={!letterCounts[letter]}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors min-w-[28px] ${getLetterButtonClass(darkMode, activeLetter, letter, letterCounts[letter])}`}
          >
            {letter}
            {letterCounts[letter] ? (
              <span className={`ml-0.5 text-[9px] ${getLetterCountClass(darkMode, activeLetter, letter)}`}>
                {letterCounts[letter]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {(search || activeLetter) && (
        <p className={`text-xs mb-4 ${darkMode ? 'text-gray-500' : 'text-amber-600'}`}>
          {filtered.length} autor{filtered.length === 1 ? '' : 'es'} encontrado{filtered.length === 1 ? '' : 's'}
        </p>
      )}

      {filtered.length === 0 ? (
        <p className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-amber-600'}`}>
          No se encontraron autores con ese criterio.
        </p>
      ) : (() => {
        const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
        const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paged.map((author) => {
            const isOpen = openAuthor === author.name;
            const primaryRegion = author.regions[0];
            return (
              <div key={author.name} className={`${cardClass} border-2 rounded-lg p-5 shadow-md hover:shadow-lg transition-all flex flex-col`}>
                <button
                  className="text-left w-full"
                  onClick={() => toggleAuthor(author.name)}
                  aria-expanded={isOpen}
                >
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2 text-center`}>
                    {author.name}
                  </h3>
                  {primaryRegion && (
                    <p className={`text-xs ${darkMode ? 'text-red-400' : 'text-amber-600'} mb-3 text-center`}>
                      {author.regions.join(', ')}
                    </p>
                  )}
                  <div className={`flex items-center justify-between pt-3 mt-3 border-t ${darkMode ? 'border-[#872320]' : 'border-[#B79F6E]'}`}>
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
                        className={`rounded-lg border-2 p-3 ${darkMode ? 'bg-gray-800/60 border-[#872320]/50' : 'bg-white/80 border-[#B79F6E]'}`}
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
                              <span className={`px-2 py-0.5 rounded text-xs ${darkMode ? 'bg-gray-700' : 'bg-amber-800'}`}>
                                {book.category}
                              </span>
                            </div>
                          </div>
                          {book.filename && (
                            <button
                              onClick={() => onRead(book)}
                              className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                                darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-700 text-amber-50 hover:bg-amber-800'
                              }`}
                            >
                              <BookOpen size={12} />
                              Leer
                            </button>
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
            {totalPages > 1 && (
              <div className={`flex items-center justify-center gap-3 mt-6 pt-4 border-t ${darkMode ? 'border-[#872320]' : 'border-[#B79F6E]'}`}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`p-2 rounded-lg transition-colors ${page === 1 ? 'opacity-30 cursor-default' : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-amber-800 text-amber-50 hover:bg-amber-800'}`}
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`p-2 rounded-lg transition-colors ${page === totalPages ? 'opacity-30 cursor-default' : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-amber-800 text-amber-50 hover:bg-amber-800'}`}
                  aria-label="Página siguiente"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )
      })()}
    </div>
  );
};

export default AuthorsView
