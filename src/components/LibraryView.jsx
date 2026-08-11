import React, { useMemo, useState } from 'react';
import { Search, BookOpen, Heart, X } from 'lucide-react';
import { THEME, CATEGORIES, REGIONS } from '../constants';
import { getAllBooks, filterBooks, sortBooks, getDecadeFromYear } from '../utils/library';
import { getDocumentDownloadUrl } from '../services/documentService';

const DECADE_OPTIONS = ['all', '1840s', '1850s', '1860s', '1870s', '1880s', '1890s', '1900s', '1910s', '1920s', '1930s', '1940s', '1950s', '1960s'];

const LibraryView = ({
  darkMode,
  regionData,
  favorites,
  onToggleFavorite
}) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [region, setRegion] = useState('all');
  const [decade, setDecade] = useState('all');
  const [sort, setSort] = useState('rating');

  const allBooks = useMemo(() => getAllBooks(regionData), [regionData]);

  const availableDecades = useMemo(() => {
    const set = new Set(allBooks.map((b) => getDecadeFromYear(b.year)).filter((d) => d !== 'all'));
    return DECADE_OPTIONS.filter((d) => d === 'all' || set.has(d));
  }, [allBooks]);

  const filtered = useMemo(
    () => sortBooks(filterBooks(allBooks, { searchTerm, category, region, decade }), sort),
    [allBooks, searchTerm, category, region, decade, sort]
  );

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('all');
    setRegion('all');
    setDecade('all');
  };

  const selectClass = `px-3 py-2 rounded-lg border text-sm ${
    darkMode
      ? 'bg-gray-800 border-gray-700 text-gray-200'
      : 'bg-white border-amber-300 text-gray-800'
  }`;

  const inputClass = `w-full md:w-72 px-4 py-2 rounded-lg border text-sm ${
    darkMode
      ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500'
      : 'bg-white border-amber-300 text-gray-800 placeholder-amber-700'
  }`;

  return (
    <div className={`${darkMode ? 'bg-gray-900/60 border-gray-700/50' : 'bg-white/60 border-amber-300'} rounded-lg shadow-lg border-2 p-6 md:p-8`}>
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className={darkMode ? 'text-red-400' : 'text-amber-800'} size={28} />
        <h2 className={`text-3xl md:text-4xl font-display uppercase tracking-wide ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
          Biblioteca
        </h2>
      </div>
      <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
        {filtered.length} de {allBooks.length} obras del archivo. Busca y filtra por categoría, región o década.
      </p>

      <div className="flex flex-col gap-3 mb-6">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-amber-500'}`} size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título o autor…"
            className={`${inputClass} pl-10`}
            aria-label="Buscar obra"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass} aria-label="Filtrar por categoría">
            <option value="all">Todas las categorías</option>
            {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select value={region} onChange={(e) => setRegion(e.target.value)} className={selectClass} aria-label="Filtrar por región">
            <option value="all">Todas las regiones</option>
            {REGIONS.filter((r) => r !== 'all').map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select value={decade} onChange={(e) => setDecade(e.target.value)} className={selectClass} aria-label="Filtrar por década">
            <option value="all">Todas las décadas</option>
            {availableDecades.filter((d) => d !== 'all').map((d) => (
              <option key={d} value={d}>{d.replace('s', '')}s</option>
            ))}
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass} aria-label="Ordenar por">
            <option value="rating">Mejor valoradas</option>
            <option value="year">Por año (antiguo → reciente)</option>
            <option value="title">Por título</option>
          </select>

          {(searchTerm || category !== 'all' || region !== 'all' || decade !== 'all') && (
            <button
              onClick={clearFilters}
              className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 ${darkMode ? 'bg-red-900/40 text-red-300 hover:bg-red-900/60' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
            >
              <X size={14} /> Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
          No hay obras que coincidan con los filtros.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((book, idx) => {
            const isFavorite = favorites.includes(book.title);
            const downloadUrl = getDocumentDownloadUrl(book.filename);
            return (
              <div key={`${book.region}-${book.title}-${idx}`} className={`${cardClass} border-2 rounded-lg p-5 hover:shadow-xl transition-all flex flex-col`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-amber-200 text-amber-900'}`}>
                    {book.region}
                  </span>
                  <button
                    onClick={() => onToggleFavorite(book.title)}
                    className="transition-transform hover:scale-110"
                    title={isFavorite ? 'Remover de favoritos' : 'Agregar a favoritos'}
                    aria-label={isFavorite ? 'Remover de favoritos' : 'Agregar a favoritos'}
                  >
                    <Heart
                      size={18}
                      className={isFavorite ? 'fill-red-500 text-red-500' : darkMode ? 'text-gray-500' : 'text-amber-600'}
                    />
                  </button>
                </div>

                <h3 className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>
                  {book.title}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                  por {book.author}
                </p>
                <div className="flex items-center gap-3 text-xs flex-wrap mb-3">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>📅 {book.year || '—'}</span>
                  <span className={`px-2 py-0.5 rounded ${darkMode ? 'bg-gray-800' : 'bg-amber-200'}`}>{book.category}</span>
                  {book.rating && <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>⭐ {book.rating}</span>}
                </div>

                {book.summary && (
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'} mb-4 line-clamp-2 flex-1`}>
                    {book.summary}
                  </p>
                )}

                <div className="flex items-center gap-3 mt-auto">
                  {downloadUrl && (
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-700 text-amber-50 hover:bg-amber-800'
                      }`}
                    >
                      <BookOpen size={14} />
                      Leer
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LibraryView;
