import React from 'react';
import { X, Quote } from 'lucide-react';
import { THEME } from '../constants';

const EventModal = ({ darkMode, event, onClose }) => {
  const themeClass = darkMode ? THEME.dark : THEME.light;
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;

  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className={`${cardClass} border-4 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden`} onClick={(e) => e.stopPropagation()}>
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
        </div>
      </div>
    </div>
  );
};

export default EventModal;
