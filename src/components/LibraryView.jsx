import React, { useEffect, useMemo, useState } from 'react'
import { Search, BookOpen, Heart, X, CalendarClock, Users, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { THEME, CATEGORIES } from '../constants'
import { getAllBooks, filterBooks, sortBooks, getDecadeFromYear, getDailyFeaturedBook, getBookEvents, groupBooksByAuthor, groupBooksByRegion } from '../utils/library'
import FeaturedBook from './FeaturedBook'

const DEFAULT_FILTERS = {
  searchTerm: '',
  category: 'all',
  decade: 'all',
  type: 'all',
  favoritesOnly: false
}

const DECADE_OPTIONS = ['all', '1840s', '1850s', '1860s', '1870s', '1880s', '1890s', '1900s', '1910s', '1920s', '1930s', '1940s', '1950s', '1960s']

const PAGE_SIZE = 12

const getHeartClass = (isFav, darkMode) => {
  if (isFav) return 'fill-red-500 text-red-500'
  return darkMode ? 'text-gray-500' : 'text-amber-600'
}

const getGroupBtnClass = (active, darkMode) => {
  if (active) return darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-700 text-amber-50 hover:bg-amber-800'
  return darkMode ? 'bg-gray-800 border border-[#872320] text-gray-300 hover:bg-gray-700' : 'bg-white border border-[#B79F6E] text-gray-700 hover:bg-amber-100'
}

const getLeerBtnClass = (darkMode) =>
  darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-700 text-amber-50 hover:bg-amber-800'

const getSinArchivoClass = (darkMode) =>
  darkMode ? 'border-[#872320]/50 text-gray-500' : 'border-[#B79F6E] text-amber-600'

const BookEventLink = ({ book, timelineEvents, onOpenEvent, darkMode }) => {
  const bookEvents = getBookEvents(timelineEvents, book)
  if (!bookEvents.length) return null
  return (
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
  )
}

const LeerButton = ({ book, onRead, darkMode }) => {
  if (!book.filename) {
    return (
      <span
        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm border-2 ${getSinArchivoClass(darkMode)}`}
        title="Esta obra aún no tiene archivo digitalizado en el archivo"
      >
        Sin archivo disponible
      </span>
    )
  }
  return (
    <button
      onClick={() => onRead(book)}
      className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${getLeerBtnClass(darkMode)}`}
    >
      <BookOpen size={12} />
      Leer
    </button>
  )
}

const FavoriteButton = ({ book, isFavorite, onToggleFavorite, darkMode, size = 18 }) => (
  <button
    onClick={() => onToggleFavorite(book.title, { author: book.author, year: book.year, filename: book.filename, category: book.category })}
    className="transition-transform hover:scale-110 shrink-0"
    title={isFavorite ? 'Remover de favoritos' : 'Agregar a favoritos'}
    aria-label={isFavorite ? 'Remover de favoritos' : 'Agregar a favoritos'}
  >
    <Heart size={size} className={getHeartClass(isFavorite, darkMode)} />
  </button>
)

const BookMeta = ({ book, darkMode }) => (
  <div className="flex items-center gap-3 text-xs flex-wrap mt-1">
    <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${darkMode ? 'bg-gray-800' : 'bg-amber-200'}`}>{book.category}</span>
  </div>
)

const BookCardInGroup = ({ book, favorites, onToggleFavorite, onRead, onOpenEvent, timelineEvents, darkMode }) => {
  const isFav = favorites.some((f) => f.title === book.title)
    return (
      <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-900/50 border-2 border-[#872320]/50' : 'bg-white/50 border-2 border-[#B79F6E]'}`}>
        <div className="flex items-start justify-between gap-2 mb-1">
        <div>
          <h4 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            {book.title}
          </h4>
          <BookMeta book={book} darkMode={darkMode} />
        </div>
        <FavoriteButton book={book} isFavorite={isFav} onToggleFavorite={onToggleFavorite} darkMode={darkMode} size={18} />
      </div>
      <BookEventLink book={book} timelineEvents={timelineEvents} onOpenEvent={onOpenEvent} darkMode={darkMode} />
      <div className="flex items-center gap-3 mt-3">
        <LeerButton book={book} onRead={onRead} darkMode={darkMode} />
      </div>
    </div>
  )
}

const GroupSection = ({ group, cardClass, darkMode, favorites, onToggleFavorite, onRead, onOpenEvent, timelineEvents, icon: Icon }) => (
  <div key={group.name} className={`${cardClass} border-2 rounded-lg p-5`}>
    <div className="flex items-center justify-between gap-2 mb-4">
      <h3 className={`font-bold text-lg flex items-center gap-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        <Icon size={16} className={darkMode ? 'text-red-400' : 'text-amber-700'} />
        {group.name}
      </h3>
      <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-amber-200 text-amber-900'}`}>
        {group.bookCount} {group.bookCount === 1 ? 'obra' : 'obras'}
      </span>
    </div>
    <div className="flex flex-col gap-3">
      {group.books.map((book) => (
        <BookCardInGroup
          key={`${book.region}-${book.title}`}
          book={book}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          onRead={onRead}
          onOpenEvent={onOpenEvent}
          timelineEvents={timelineEvents}
          darkMode={darkMode}
        />
      ))}
    </div>
  </div>
)

const GridCard = ({ book, idx, favorites, onToggleFavorite, onRead, onOpenEvent, timelineEvents, darkMode, cardClass }) => {
  const isFav = favorites.some((f) => f.title === book.title)
  const bookEvents = getBookEvents(timelineEvents, book)
  return (
    <div key={`${book.region}-${book.title}`} className={`${cardClass} border-2 rounded-lg p-5 hover:shadow-lg transition-all flex flex-col card-appear`} style={{ animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
      <div className="flex items-start justify-end gap-2 mb-2">
        <FavoriteButton book={book} isFavorite={isFav} onToggleFavorite={onToggleFavorite} darkMode={darkMode} />
      </div>
      <h3 className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>
        {book.title}
      </h3>
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
        por {book.author}
      </p>
      <div className="flex items-center gap-3 text-xs flex-wrap mb-3">
        <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${darkMode ? 'bg-gray-800' : 'bg-amber-200'}`}>{book.category}</span>
      </div>
      {book.summary && (
        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'} mb-4 line-clamp-2 flex-1`}>
          {book.summary}
        </p>
      )}
      {bookEvents.length > 0 && (
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
      )}
      <div className="flex items-center gap-3 mt-auto">
        <LeerButton book={book} onRead={onRead} darkMode={darkMode} />
      </div>
    </div>
  )
}

const LibraryView = ({
  darkMode,
  regionData,
  favorites,
  onToggleFavorite,
  timelineEvents = [],
  onOpenEvent = () => {},
  onRead = () => {},
  initialFilters = null
}) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card
  const seed = { ...DEFAULT_FILTERS, ...initialFilters }

  const [searchTerm, setSearchTerm] = useState(seed.searchTerm)
  const [category, setCategory] = useState(seed.category)
  const [decade, setDecade] = useState(seed.decade)
  const [type, setType] = useState(seed.type)
  const [favoritesOnly, setFavoritesOnly] = useState(seed.favoritesOnly)
  const [sort, setSort] = useState('rating')
  const [groupByAuthor, setGroupByAuthor] = useState(false)
  const [groupByRegion, setGroupByRegion] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setSearchTerm(initialFilters?.searchTerm ?? DEFAULT_FILTERS.searchTerm)
    setCategory(initialFilters?.category ?? DEFAULT_FILTERS.category)
    setDecade(initialFilters?.decade ?? DEFAULT_FILTERS.decade)
    setType(initialFilters?.type ?? DEFAULT_FILTERS.type)
    setFavoritesOnly(initialFilters?.favoritesOnly ?? DEFAULT_FILTERS.favoritesOnly)
    setPage(1)
  }, [initialFilters])

  const allBooks = useMemo(
    () => getAllBooks(regionData).filter((b) => b.category !== 'otros'),
    [regionData]
  )
  const featured = useMemo(() => getDailyFeaturedBook(regionData), [regionData])

  const availableDecades = useMemo(() => {
    const set = new Set(allBooks.map((b) => getDecadeFromYear(b.year)).filter((d) => d !== 'all'))
    return DECADE_OPTIONS.filter((d) => d === 'all' || set.has(d))
  }, [allBooks])

  const filtered = useMemo(
    () => sortBooks(
      filterBooks(allBooks, { searchTerm, category, decade, type, favorites: favoritesOnly ? favorites : null }),
      sort
    ),
    [allBooks, searchTerm, category, decade, type, favoritesOnly, favorites, sort]
  )

  useEffect(() => { setPage(1) }, [searchTerm, category, decade, type, favoritesOnly, sort])

  const clearFilters = () => {
    setSearchTerm(DEFAULT_FILTERS.searchTerm)
    setCategory(DEFAULT_FILTERS.category)
    setDecade(DEFAULT_FILTERS.decade)
    setType(DEFAULT_FILTERS.type)
    setFavoritesOnly(DEFAULT_FILTERS.favoritesOnly)
    setPage(1)
  }

  const groupedBooks = useMemo(() => groupBooksByAuthor(filtered), [filtered])
  const groupedByRegion = useMemo(() => groupBooksByRegion(filtered), [filtered])

  const toggleGroupByAuthor = () => {
    setGroupByAuthor((v) => !v)
    if (!groupByAuthor) setGroupByRegion(false)
  }
  const toggleGroupByRegion = () => {
    setGroupByRegion((v) => !v)
    if (!groupByRegion) setGroupByAuthor(false)
  }

  const hasActiveFilters = searchTerm || category !== 'all' || decade !== 'all' || type !== 'all' || favoritesOnly

  const selectClass = `px-3 py-2 rounded-lg border text-sm max-w-full overflow-hidden text-ellipsis whitespace-nowrap ${
    darkMode ? 'bg-gray-800 border-[#872320] text-gray-200' : 'bg-white border-[#B79F6E] text-gray-800'
  }`

  const inputClass = `w-full md:w-72 px-4 py-2 rounded-lg border text-sm ${
    darkMode ? 'bg-gray-800 border-[#872320] text-gray-200 placeholder-gray-500' : 'bg-white border-[#B79F6E] text-gray-800 placeholder-amber-700'
  }`

  const renderContent = () => {
    if (filtered.length === 0) {
      return (
        <p className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
          No hay obras que coincidan con los filtros.
        </p>
      )
    }
    if (groupByRegion) {
      return (
        <div className="flex flex-col gap-4">
          {groupedByRegion.map((group) => (
            <GroupSection key={group.name} group={group} cardClass={cardClass} darkMode={darkMode} favorites={favorites} onToggleFavorite={onToggleFavorite} onRead={onRead} onOpenEvent={onOpenEvent} timelineEvents={timelineEvents} icon={MapPin} />
          ))}
        </div>
      )
    }
    if (groupByAuthor) {
      return (
        <div className="flex flex-col gap-4">
          {groupedBooks.map((group) => (
            <GroupSection key={group.name} group={group} cardClass={cardClass} darkMode={darkMode} favorites={favorites} onToggleFavorite={onToggleFavorite} onRead={onRead} onOpenEvent={onOpenEvent} timelineEvents={timelineEvents} icon={Users} />
          ))}
        </div>
      )
    }
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paged.map((book, idx) => (
            <GridCard key={`${book.region}-${book.title}`} book={book} idx={idx} favorites={favorites} onToggleFavorite={onToggleFavorite} onRead={onRead} onOpenEvent={onOpenEvent} timelineEvents={timelineEvents} darkMode={darkMode} cardClass={cardClass} />
          ))}
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
  }

  return (
    <div className={`${darkMode ? 'bg-gray-900/60 border-[#872320]/50' : 'bg-white/60 border-[#B79F6E]'} rounded-lg shadow-lg border-2 p-6 md:p-8`}>
      <h2 className={`text-3xl md:text-4xl font-display uppercase tracking-wide mb-2 ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
        Biblioteca
      </h2>
      <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
        {filtered.length} de {allBooks.length} obras del archivo. Busca y filtra por categoría, década, tipo o favoritos.
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
            {CATEGORIES.filter((c) => c.id !== 'all' && c.id !== 'otros').map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select value={decade} onChange={(e) => setDecade(e.target.value)} className={selectClass} aria-label="Filtrar por década">
            <option value="all">Todas las décadas</option>
            {availableDecades.filter((d) => d !== 'all').map((d) => (
              <option key={d} value={d}>{d.replace('s', '')}s</option>
            ))}
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
            onClick={toggleGroupByAuthor}
            aria-pressed={groupByAuthor}
            aria-label={groupByAuthor ? 'Desagrupar por autor' : 'Agrupar por autor'}
            title={groupByAuthor ? 'Desagrupar: una tarjeta por obra' : 'Agrupar: todas las obras de cada autor en una tarjeta'}
            className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1.5 transition-colors ${getGroupBtnClass(groupByAuthor, darkMode)}`}
          >
            <Users size={14} />
            {groupByAuthor ? 'Desagrupar' : 'Agrupar por autor'}
          </button>

          <button
            type="button"
            onClick={toggleGroupByRegion}
            aria-pressed={groupByRegion}
            aria-label={groupByRegion ? 'Desagrupar por región' : 'Agrupar por región'}
            title={groupByRegion ? 'Desagrupar: una tarjeta por obra' : 'Agrupar: todas las obras de cada región en una tarjeta'}
            className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1.5 transition-colors ${getGroupBtnClass(groupByRegion, darkMode)}`}
          >
            <MapPin size={14} />
            {groupByRegion ? 'Desagrupar' : 'Agrupar por región'}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 ${darkMode ? 'bg-red-900/40 text-red-300 hover:bg-red-900/60' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
            >
              <X size={14} /> Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {renderContent()}
    </div>
  )
}

export default LibraryView
