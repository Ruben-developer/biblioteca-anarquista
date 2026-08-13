import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { THEME } from '../constants';
import { getDocumentDownloadUrl } from '../services/documentService';

// Widget "Obra del día": destaca una obra del archivo (seleccionada de forma
// determinista por fecha, ver getDailyFeaturedBook) con su reseña y botón de
// lectura, sin salir de la web.
const FeaturedBook = ({ darkMode, book }) => {
  if (!book) return null;

  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;
  const downloadUrl = getDocumentDownloadUrl(book.filename);

  return (
    <section
      aria-label="Obra del día"
      className={`${cardClass} border-2 rounded-xl p-6 mb-8 relative overflow-hidden`}
    >
      <span
        className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium mb-4 ${
          darkMode ? 'bg-red-900/50 text-red-300' : 'bg-amber-800 text-amber-50'
        }`}
      >
        <Sparkles size={12} />
        Obra del día
      </span>

      <div className="flex flex-col md:flex-row md:items-start md:gap-6">
        <div className="flex-1">
          <h3 className={`font-display text-2xl md:text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-1`}>
            {book.title}
          </h3>
          {book.author && (
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              por {book.author}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              📅 {book.year || '—'}
            </span>
            <span className={`px-2 py-0.5 rounded ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-amber-200 text-amber-900'}`}>
              {book.region} · {book.category}
            </span>
            {book.rating && (
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>⭐ {book.rating}</span>
            )}
          </div>
          {book.summary && (
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-4`}>
              {book.summary}
            </p>
          )}
          {downloadUrl && (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-700 text-amber-50 hover:bg-amber-800'
              }`}
            >
              <BookOpen size={14} />
              Leer esta obra
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBook;
