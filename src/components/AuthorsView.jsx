import React, { useState, useMemo, useEffect } from 'react';
import { Book, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { THEME } from '../constants';
import CollectionModal from './CollectionModal';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const PAGE_SIZE = 12;

const getTodosButtonClass = (darkMode, activeLetter, search) => {
  const isActive = !activeLetter && !search;
  if (isActive) {
    return darkMode ? 'bg-red-600 text-white' : 'bg-amber-800 text-amber-50';
  }
  return darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-amber-100 text-amber-700 hover:bg-amber-200';
};

const getLetterButtonClass = (darkMode, activeLetter, letter, letterCount) => {
  if (activeLetter === letter) {
    return darkMode ? 'bg-red-600 text-white' : 'bg-amber-800 text-amber-50';
  }
  if (letterCount) {
    return darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-amber-100 text-amber-800 hover:bg-amber-200';
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
  onRead = () => {},
  onOpenLibrary = () => {}
}) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState(null);
  const [page, setPage] = useState(1);

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
    <div className={`${darkMode ? 'bg-gray-900/60 border-accent/50' : 'bg-white/60 border-line'} rounded-lg shadow-lg border-2 p-6 md:p-8`}>
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
          className={`w-full ${darkMode ? 'bg-gray-800 border-accent text-gray-100 placeholder-gray-500' : 'bg-white/80 border-line text-gray-800 placeholder-amber-600'} border-2 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-line transition-colors`}
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
                const primaryRegion = author.regions[0];
                return (
                  <button
                    key={author.name}
                    type="button"
                    onClick={() => setSelectedAuthor(author.name)}
                    aria-haspopup="dialog"
                    className={`${cardClass} border-2 rounded-lg p-5 shadow-md hover:shadow-lg transition-all flex flex-col text-left`}
                  >
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
                        {author.regions.join(', ')}
                      </p>
                    )}
                    <div className={`flex items-center justify-between pt-3 mt-auto border-t ${darkMode ? 'border-accent' : 'border-line'}`}>
                      <span className="text-sm">
                        <Book size={16} className="inline mr-1" />
                        {author.bookCount} {author.bookCount === 1 ? 'texto' : 'textos'}
                      </span>
                      <span className={`text-xs ${darkMode ? 'text-red-400' : 'text-amber-700'}`}>
                        Ver obras
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className={`flex items-center justify-center gap-3 mt-6 pt-4 border-t ${darkMode ? 'border-accent' : 'border-line'}`}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`p-2 rounded-lg transition-colors ${page === 1 ? 'opacity-30 cursor-default' : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}
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
                  className={`p-2 rounded-lg transition-colors ${page === totalPages ? 'opacity-30 cursor-default' : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}
                  aria-label="Página siguiente"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )
      })()}

      {selectedAuthor && (() => {
        const author = authors.find((a) => a.name === selectedAuthor);
        if (!author) return null;
        const timed = author.books.filter((b) => b.pubYear);
        return (
          <CollectionModal
            darkMode={darkMode}
            title={author.name}
            subtitle={`${author.bookCount} ${author.bookCount === 1 ? 'texto' : 'textos'}`}
            icon={Book}
            books={author.books}
            onClose={() => setSelectedAuthor(null)}
            onRead={onRead}
            onOpenLibrary={onOpenLibrary}
            extra={timed.length > 1 ? (
              <div className={`mb-4 rounded-lg border-2 p-3 ${darkMode ? 'bg-gray-800/60 border-accent/50' : 'bg-white/80 border-line'}`}>
                <p className={`text-xs uppercase tracking-wide mb-2 ${darkMode ? 'text-gray-500' : 'text-amber-600'}`}>
                  Línea de tiempo de su obra
                </p>
                <div className="flex items-center gap-0 overflow-x-auto pb-1">
                  {timed
                    .slice()
                    .sort((a, b) => a.pubYear - b.pubYear)
                    .map((b, i, arr) => (
                      <div key={`${b.title}-${i}`} className="flex items-center">
                        <div className="flex flex-col items-center min-w-[64px]">
                          <span className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{b.pubYear}</span>
                          <span className={`w-3 h-3 rounded-full mt-1 ${darkMode ? 'bg-red-600' : 'bg-amber-700'}`} />
                          <span className={`text-[10px] text-center leading-tight mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {b.title.length > 22 ? `${b.title.slice(0, 22)}…` : b.title}
                          </span>
                        </div>
                        {i < arr.length - 1 && (
                          <span className={`h-0.5 w-4 ${darkMode ? 'bg-gray-600' : 'bg-amber-400'}`} />
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ) : null}
          />
        );
      })()}
    </div>
  );
};

export default AuthorsView
