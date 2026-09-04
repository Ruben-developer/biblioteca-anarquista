import React, { useMemo, useState } from 'react'
import { BookOpen, Heart, CalendarClock, ChevronLeft, ChevronRight } from 'lucide-react'
import { THEME } from '../constants'
import { getAllBooks, getDailyFeaturedBook, getBookEvents } from '../utils/library'
import FeaturedBook from './FeaturedBook'

const PAGE_SIZE = 12

const getHeartClass = (isFav, darkMode) => {
  if (isFav) return 'fill-red-500 text-red-500'
  return darkMode ? 'text-gray-500' : 'text-amber-600'
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

const GridCard = ({ book, idx, favorites, onToggleFavorite, onRead, onOpenEvent, timelineEvents, darkMode, cardClass }) => {
  const isFav = favorites.some((f) => f.title === book.title)
  const bookEvents = getBookEvents(timelineEvents, book)
  return (
    <div key={`${book.region}-${book.title}`} className={`${cardClass} border-2 rounded-lg p-5 hover:shadow-lg transition-all flex flex-col card-appear`} style={{ animationDelay: `${Math.min(idx, 8) * 40}ms` }}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} flex-1`}>
          {book.title}
        </h3>
        <FavoriteButton book={book} isFavorite={isFav} onToggleFavorite={onToggleFavorite} darkMode={darkMode} />
      </div>
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
}) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card
  const [page, setPage] = useState(1)

  const allBooks = useMemo(
    () => getAllBooks(regionData).filter((b) => b.category !== 'otros'),
    [regionData]
  )
  const featured = useMemo(() => getDailyFeaturedBook(regionData), [regionData])

  const totalPages = Math.ceil(allBooks.length / PAGE_SIZE)
  const paged = allBooks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className={`${darkMode ? 'bg-gray-900/60 border-[#872320]/50' : 'bg-white/60 border-[#B79F6E]'} rounded-lg shadow-lg border-2 p-6 md:p-8`}>
      <h2 className={`text-3xl md:text-4xl font-display uppercase tracking-wide mb-2 ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
        Biblioteca
      </h2>
      <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
        {allBooks.length} obras del archivo.
      </p>

      <FeaturedBook darkMode={darkMode} book={featured} onRead={onRead} />

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
    </div>
  )
}

export default LibraryView
