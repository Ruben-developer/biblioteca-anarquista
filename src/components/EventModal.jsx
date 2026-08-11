import React from 'react';
import { X, Quote, BookOpen } from 'lucide-react';
import { THEME } from '../constants';
import { getDocumentDownloadUrl } from '../services/documentService';
import { getEventRelatedTexts } from '../utils/library';

const EventModal = ({ darkMode, event, regionData, onClose }) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;

  if (!event) return null;

  const relatedTexts = getEventRelatedTexts(regionData, event);

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={event.title}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className={`${cardClass} border-4 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden`}>
        <div className={`${darkMode ? 'bg-red-900/30' : 'bg-amber-700'} p-6`}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{event.image}</span>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-amber-50'}`}>
                  {event.title}
                </h2>
              </div>
              <span className={`text-xl font-bold ${darkMode ? 'text-gray-300' : 'text-amber-200'}`}>
                {event.year}
              </span>
            </div>
            <button onClick={onClose} className={darkMode ? 'text-gray-300' : 'text-amber-100'}>
              <X size={28} />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-96">
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-4`}>
            {event.description}
          </p>
          <div className={`${darkMode ? 'bg-gray-800/50 border-red-900/30' : 'bg-amber-100/50 border-amber-400'} border-l-4 p-4 rounded-r-lg`}>
            <Quote className={`${darkMode ? 'text-red-500' : 'text-amber-600'} mb-2`} size={32} />
            <blockquote className={`text-lg italic ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>
              &ldquo;{event.quote}&rdquo;
            </blockquote>
            <p className={`text-right font-semibold ${darkMode ? 'text-gray-400' : 'text-amber-900'}`}>
              — {event.author}
            </p>
          </div>

          {event.type === 'con_texto' && relatedTexts.length > 0 && (
            <div className="mt-6">
              <h3 className={`font-bold mb-3 ${darkMode ? 'text-red-400' : 'text-amber-800'}`}>
                Textos relacionados con este evento
              </h3>
              <div className="space-y-3">
                {relatedTexts.map((book, idx) => (
                  <div
                    key={`${book.region}-${book.title}-${idx}`}
                    className={`rounded-lg border p-3 ${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/80 border-amber-300'}`}
                  >
                    <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>
                      {book.title}
                    </p>
                    <div className="flex items-center gap-3 text-sm flex-wrap">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>por {book.author}</span>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>📅 {book.year}</span>
                    </div>
                    <div className="flex gap-3 mt-2 flex-wrap">
                      {book.filename && (
                        <a
                          href={getDocumentDownloadUrl(book.filename)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-xs ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-amber-700 hover:text-amber-900'} flex items-center gap-1 hover:underline transition-colors`}
                        >
                          <BookOpen size={14} />
                          Ver
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
