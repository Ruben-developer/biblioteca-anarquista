import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { THEME } from '../constants';

const FeaturedBook = ({ darkMode, book, onRead = () => {} }) => {
  if (!book) return null;

  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;

  return (
    <section
      aria-label="Obra del día"
      className={`${cardClass} border-2 ${darkMode ? 'border-[#872320]/40' : 'border-[#B79F6E]/50'} rounded-xl p-6 md:p-8 mb-8 relative overflow-hidden shadow-xl`}
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
              {book.year || '—'}
            </span>
            <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-amber-200 text-amber-900'}`}>
              {book.region} · {book.category}
            </span>
            {book.rating && (
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{book.rating}</span>
            )}
          </div>
          {book.summary && (
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-4`}>
              {book.summary}
            </p>
          )}
          {book.filename && (
            <button
              onClick={() => onRead(book)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-700 text-amber-50 hover:bg-amber-800'
              }`}
            >
              <BookOpen size={12} />
              Leer esta obra
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBook;
