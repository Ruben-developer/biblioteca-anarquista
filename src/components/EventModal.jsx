import React from 'react';
import { Quote, BookOpen, Calendar } from 'lucide-react';
import { THEME } from '../constants';
import { getEventRelatedTexts } from '../utils/library';
import { useModalFocus } from '../hooks';
import ModalHeader from './ModalHeader';

const formatYear = (year) => (year === -1800 ? 'A.A.' : year);

const EventModal = ({ darkMode, event, regionData, onClose, onRead = () => {} }) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;
  const dialogRef = useModalFocus(onClose);

  if (!event) return null;

  const relatedTexts = getEventRelatedTexts(regionData, event);

  return (
    <dialog
      ref={dialogRef}
      open
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-modal="true"
      aria-label={event.title}
    >
      <div className={`${cardClass} rounded-lg max-w-2xl w-full p-6`}>
        <ModalHeader darkMode={darkMode} title={event.title} icon={Calendar} subtitle={formatYear(event.year)} onClose={onClose} />

        <div className="overflow-y-auto max-h-96">
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-4`}>
            {event.description}
          </p>
          <div className={`${darkMode ? 'bg-gray-800/50 border-[#872320]/50' : 'bg-amber-100/50 border-[#B79F6E]'} border-l-2 p-4 rounded-r-lg`}>
            <Quote className={`${darkMode ? 'text-red-500' : 'text-amber-600'} mb-2`} size={32} />
            <blockquote className={`font-serif text-lg italic ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>
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
                    className={`rounded-lg border-2 p-3 ${darkMode ? 'bg-gray-800/50 border-[#872320]/50' : 'bg-white/80 border-[#B79F6E]'}`}
                  >
                    <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>
                      {book.title}
                    </p>
                    <div className="flex items-center gap-3 text-sm flex-wrap">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>por {book.author}</span>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{book.year}</span>
                    </div>
                    <div className="flex gap-3 mt-2 flex-wrap">
                      {book.filename && (
                        <button
                          onClick={() => onRead(book)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
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
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default EventModal;
