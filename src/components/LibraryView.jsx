import React, { useMemo, useState } from 'react';
import { Search, BookOpen, Heart, X, CalendarClock, Users } from 'lucide-react';
import { THEME, CATEGORIES, REGIONS } from '../constants';
import { getAllBooks, getAllAuthors, filterBooks, sortBooks, getDecadeFromYear, getDailyFeaturedBook, getBookEvents, groupBooksByAuthor } from '../utils/library';
import FeaturedBook from './FeaturedBook';

const DECADE_OPTIONS = ['all', '1840s', '1850s', '1860s', '1870s', '1880s', '1890s', '1900s', '1910s', '1920s', '1930s', '1940s', '1950s', '1960s'];

const LibraryView = ({
  darkMode,
  regionData,
  favorites,
  onToggleFavorite,
  timelineEvents = [],
  onOpenEvent = () => {},
  onRead = () => {}
}) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [region, setRegion] = useState('all');
  const [decade, setDecade] = useState('all');
  const [author, setAuthor] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [type, setType] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sort, setSort] = useState('rating');
  const [groupByAuthor, setGroupByAuthor] = useState(false);

  const allBooks = useMemo(() => getAllBooks(regionData), [regionData]);

  // Autores disponibles para el selector dedicado (orden alfabético).
  const availableAuthors = useMemo(
    () => getAllAuthors(regionData).map((a) => a.name).sort((a, b) => a.localeCompare(b, 'es')),
    [regionData]
  );

  // Obra destacada del día: determinista por fecha (la misma toda la jornada).
  const featured = useMemo(() => getDailyFeaturedBook(regionData), [regionData]);

  const availableDecades = useMemo(() => {
    const set = new Set(allBooks.map((b) => getDecadeFromYear(b.year)).filter((d) => d !== 'all'));
    return DECADE_OPTIONS.filter((d) => d === 'all' || set.has(d));
  }, [allBooks]);

  const filtered = useMemo(
    () => sortBooks(
      filterBooks(allBooks, {
        searchTerm,
        category,
        region,
        decade,
        author,
        availability,
        type,
        favorites: favoritesOnly ? favorites : null
      }),
      sort
    ),
    [allBooks, searchTerm, category, region, decade, author, availability, type, favoritesOnly, favorites, sort]
  );

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('all');
    setRegion('all');
    setDecade('all');
    setAuthor('all');
    setAvailability('all');
    setType('all');
    setFavoritesOnly(false);
  };

  // Vista agrupada por autor: agrupa los libros YA filtrados y ordenados.
  const groupedBooks = useMemo(() => groupBooksByAuthor(filtered), [filtered]);

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
        {filtered.length} de {allBooks.length} obras del archivo. Busca y filtra por categoría, región, década, autor, disponibilidad, tipo o favoritos.
      </p>

      <FeaturedBook darkMode={darkMode} book={featured} onRead={onRead} />

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

          <select value={author} onChange={(e) => setAuthor(e.target.value)} className={selectClass} aria-label="Filtrar por autor">
            <option value="all">Todos los autores</option>
            {availableAuthors.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          <select value={availability} onChange={(e) => setAvailability(e.target.value)} className={selectClass} aria-label="Filtrar por disponibilidad">
            <option value="all">Con y sin archivo</option>
            <option value="withFile">Solo con archivo</option>
            <option value="withoutFile">Solo sin archivo</option>
          </select>

          <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass} aria-label="Filtrar por tipo de obra">
            <option value="all">Todos los tipos</option>
            <option value="historical">Solo históricos</option>
            <option value="ideas">Solo ideas</option>
          </select>

          <select value={favoritesOnly ? 'favorites' : 'all'} onChange={(e) => setFavoritesOnly(e.target.value === 'favorites')} className={selectClass} aria-label="Filtrar por favoritos">
            <option value="all">Todas las obras</option>
            <option value="favorites">Solo favoritas</option>
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass} aria-label="Ordenar por">
            <option value="rating">Mejor valoradas</option>
            <option value="year">Por año (antiguo → reciente)</option>
            <option value="title">Por título</option>
          </select>

          <button
            type="button"
            onClick={() => setGroupByAuthor((v) => !v)}
            aria-pressed={groupByAuthor}
            aria-label={groupByAuthor ? 'Desagrupar por autor' : 'Agrupar por autor'}
            title={groupByAuthor ? 'Desagrupar: una tarjeta por obra' : 'Agrupar: todas las obras de cada autor en una tarjeta'}
            className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1.5 transition-colors ${
              groupByAuthor
                ? darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-700 text-amber-50 hover:bg-amber-800'
                : darkMode ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border border-amber-300 text-gray-700 hover:bg-amber-100'
            }`}
          >
            <Users size={14} />
            {groupByAuthor ? 'Desagrupar' : 'Agrupar por autor'}
          </button>

          {(searchTerm || category !== 'all' || region !== 'all' || decade !== 'all' || author !== 'all' || availability !== 'all' || type !== 'all' || favoritesOnly) && (
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
      ) : groupByAuthor ? (
        <div className="flex flex-col gap-4">
          {groupedBooks.map((group) => (
            <div key={group.name} className={`${cardClass} border-2 rounded-lg p-5`}>
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className={`font-bold text-lg ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {group.name}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-amber-200 text-amber-900'}`}>
                  {group.bookCount} {group.bookCount === 1 ? 'obra' : 'obras'}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {group.books.map((book, idx) => {
                  const isFavorite = favorites.includes(book.title);
                  const bookEvents = getBookEvents(timelineEvents, book);
                  return (
                    <div key={`${book.region}-${book.title}-${idx}`} className={`rounded-lg p-4 ${darkMode ? 'bg-gray-900/50 border border-gray-700' : 'bg-white/50 border border-amber-200'}`}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h4 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                            {book.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs flex-wrap mt-1">
                            <span className={`px-2 py-0.5 rounded ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-amber-200 text-amber-900'}`}>
                              {book.region}
                            </span>
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>📅 {book.year || '—'}</span>
                            <span className={`px-2 py-0.5 rounded ${darkMode ? 'bg-gray-800' : 'bg-amber-200'}`}>{book.category}</span>
                            {book.rating && <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>⭐ {book.rating}</span>}
                          </div>
                        </div>
                        <button
                          onClick={() => onToggleFavorite(book.title)}
                          className="transition-transform hover:scale-110 shrink-0"
                          title={isFavorite ? 'Remover de favoritos' : 'Agregar a favoritos'}
                          aria-label={isFavorite ? 'Remover de favoritos' : 'Agregar a favoritos'}
                        >
                          <Heart
                            size={18}
                            className={isFavorite ? 'fill-red-500 text-red-500' : darkMode ? 'text-gray-500' : 'text-amber-600'}
                          />
                        </button>
                      </div>

                      {bookEvents.length > 0 && (
                        <button
                          onClick={() => onOpenEvent(bookEvents[0])}
                          className={`mt-2 flex items-center gap-1.5 text-xs font-medium transition-colors ${
                            darkMode ? 'text-red-400 hover:text-red-300' : 'text-amber-700 hover:text-amber-900'
                          } hover:underline`}
                          title={`Ir al evento de la línea temporal: ${bookEvents[0].title} (${bookEvents[0].year})`}
                        >
                          <CalendarClock size={14} />
                          Ver en la línea temporal: {bookEvents[0].title} ({bookEvents[0].year})
                        </button>
                      )}

                      <div className="flex items-center gap-3 mt-3">
                        {book.filename ? (
                          <button
                            onClick={() => onRead(book)}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-700 text-amber-50 hover:bg-amber-800'
                            }`}
                          >
                            <BookOpen size={14} />
                            Leer
                          </button>
                        ) : (
                          <span
                            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm border ${
                              darkMode ? 'border-gray-700 text-gray-500' : 'border-amber-300 text-amber-600'
                            }`}
                            title="Esta obra aún no tiene archivo digitalizado en el archivo"
                          >
                            Sin archivo disponible
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((book, idx) => {
            const isFavorite = favorites.includes(book.title);
            return (
              <div key={`${book.region}-${book.title}-${idx}`} className={`${cardClass} border-2 rounded-lg p-5 hover:shadow-xl transition-all flex flex-col card-appear`} style={{ animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
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

                {(() => {
                  const bookEvents = getBookEvents(timelineEvents, book);
                  if (!bookEvents.length) return null;
                  return (
                    <button
                      onClick={() => onOpenEvent(bookEvents[0])}
                      className={`mb-3 flex items-center gap-1.5 text-xs font-medium transition-colors ${
                        darkMode ? 'text-red-400 hover:text-red-300' : 'text-amber-700 hover:text-amber-900'
                      } hover:underline`}
                      title={`Ir al evento de la línea temporal: ${bookEvents[0].title} (${bookEvents[0].year})`}
                    >
                      <CalendarClock size={14} />
                      Ver en la línea temporal: {bookEvents[0].title} ({bookEvents[0].year})
                    </button>
                  );
                })()}

                <div className="flex items-center gap-3 mt-auto">
                  {book.filename ? (
                    <button
                      onClick={() => onRead(book)}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-700 text-amber-50 hover:bg-amber-800'
                      }`}
                    >
                      <BookOpen size={14} />
                      Leer
                    </button>
                  ) : (
                    <span
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm border ${
                        darkMode ? 'border-gray-700 text-gray-500' : 'border-amber-300 text-amber-600'
                      }`}
                      title="Esta obra aún no tiene archivo digitalizado en el archivo"
                    >
                      Sin archivo disponible
                    </span>
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
