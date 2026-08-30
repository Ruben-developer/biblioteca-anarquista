import React, { useState, useMemo, useEffect } from 'react';
import { Search, BookOpen, MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { THEME } from '../constants';
import { getLifeBooks, LIFE_CATEGORIES } from '../utils/library';

const PAGE_SIZE = 12;

// Etiquetas legibles de cada subtipo de "vida anarquista". 'all' es el chip
// "Todas"; 'acratas' agrupa biografías, autobiografías, memorias y epistolarios.
const SUBTYPE_LABELS = {
  all: 'Todas',
  acratas: 'Acratas'
};

const getStars = (rating = 0) => Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));

const VidasAnarquistasView = ({
  darkMode,
  regionData,
  onRead = () => {}
}) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;
  const [search, setSearch] = useState('');
  const [subtype, setSubtype] = useState('all');
  const [page, setPage] = useState(1);

  const lives = useMemo(
    () => getLifeBooks(regionData),
    [regionData]
  );

  const subtypeCounts = useMemo(() => {
    const counts = { all: lives.length };
    LIFE_CATEGORIES.forEach((cat) => { counts[cat] = 0; });
    lives.forEach((b) => { counts[b.category] = (counts[b.category] || 0) + 1; });
    return counts;
  }, [lives]);

  const filtered = useMemo(() => {
    let result = lives;
    if (subtype !== 'all') {
      result = result.filter((b) => b.category === subtype);
    }
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (b) => `${b.title} ${b.author || ''}`.toLowerCase().includes(term)
      );
    }
    return result;
  }, [lives, subtype, search]);

  useEffect(() => { setPage(1) }, [subtype, search]);

  const handleSubtypeClick = (cat) => {
    setSubtype((prev) => (prev === cat ? 'all' : cat));
    setSearch('');
  };

  const handleSearchChange = (e) => setSearch(e.target.value);

  return (
    <div className={`${darkMode ? 'bg-gray-900/60 border-[#872320]/50' : 'bg-white/60 border-[#B79F6E]'} rounded-lg shadow-lg border-2 p-6 md:p-8`}>
      <h2 className={`text-3xl md:text-4xl font-display uppercase tracking-wide mb-2 ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
        Acratas
      </h2>

      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
        {lives.length} vidas anarquistas (biografías, autobiografías, memorias y epistolarios) del archivo, ordenadas de más antiguo a más reciente.
      </p>

      <div className="flex flex-wrap gap-1 mb-5">
        {['all', ...LIFE_CATEGORIES].map((cat) => {
          const isActive = subtype === cat;
          const count = subtypeCounts[cat] || 0;
          const base = isActive
            ? darkMode ? 'bg-red-600 text-white' : 'bg-amber-800 text-amber-50'
            : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-amber-100 text-amber-800 hover:bg-amber-200';
          return (
            <button
              key={cat}
              onClick={() => handleSubtypeClick(cat)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${base}`}
            >
              {SUBTYPE_LABELS[cat]}
              <span className={`ml-1 text-[10px] ${isActive ? '' : darkMode ? 'text-gray-500' : 'text-amber-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative mb-4">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`} size={18} />
        <input
          type="text"
          placeholder="Buscar biografía, autor o tema..."
          aria-label="Buscar biografía, autor o tema..."
          value={search}
          onChange={handleSearchChange}
          className={`w-full ${darkMode ? 'bg-gray-800 border-[#872320] text-gray-100 placeholder-gray-500' : 'bg-white/80 border-[#B79F6E] text-gray-800 placeholder-amber-600'} border-2 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#B79F6E] transition-colors`}
        />
      </div>

      {(search || subtype !== 'all') && (
        <p className={`text-xs mb-4 ${darkMode ? 'text-gray-500' : 'text-amber-600'}`}>
          {filtered.length} obra{filtered.length === 1 ? '' : 's'} encontrada{filtered.length === 1 ? '' : 's'}
        </p>
      )}

      {filtered.length === 0 ? (
        <p className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-amber-600'}`}>
          No se encontraron obras con ese criterio.
        </p>
      ) : (() => {
        const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
        const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paged.map((book, idx) => {
                const stars = getStars(book.rating)
                return (
                  <div key={`${book.region}-${book.title}-${idx}`} className={`${cardClass} border-2 rounded-lg p-5 shadow-md hover:shadow-lg transition-all flex flex-col`}>
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2 text-center leading-snug`}>
                      {book.title}
                    </h3>
                    {book.author && (
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-amber-700'} mb-3 text-center`}>
                        {book.author}
                      </p>
                    )}

                    <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
                      {book.year && (
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {book.year}
                        </span>
                      )}
                      {book.region && (
                        <span className={`text-xs ${darkMode ? 'text-red-400' : 'text-amber-600'} flex items-center gap-1`}>
                          <MapPin size={12} /> {book.region}
                        </span>
                      )}
                    </div>

                    {stars > 0 && (
                      <div className={`flex items-center justify-center gap-0.5 mb-3 ${darkMode ? 'text-red-400' : 'text-amber-700'}`} aria-label={`Valoración ${stars} de 5`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} className={i < stars ? 'fill-current' : 'opacity-30'} />
                        ))}
                      </div>
                    )}

                    <div className={`mt-auto pt-3 border-t flex items-center justify-between ${darkMode ? 'border-[#872320]' : 'border-[#B79F6E]'}`}>
                      <span className={`text-xs uppercase tracking-wide px-2 py-0.5 rounded ${darkMode ? 'bg-gray-700' : 'bg-amber-200'}`}>
                        {book.category}
                      </span>
                      {book.filename ? (
                        <button
                          onClick={() => onRead(book)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                            darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-700 text-amber-50 hover:bg-amber-800'
                          }`}
                        >
                          <BookOpen size={12} />
                          Leer
                        </button>
                      ) : (
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-amber-600'}`}>
                          Sin archivo
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className={`flex items-center justify-center gap-3 mt-6 pt-4 border-t ${darkMode ? 'border-[#872320]' : 'border-[#B79F6E]'}`}>
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
    </div>
  );
};

export default VidasAnarquistasView;
