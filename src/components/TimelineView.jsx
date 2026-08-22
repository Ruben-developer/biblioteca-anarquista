import React, { useState } from 'react';
import { LayoutList, LayoutGrid } from 'lucide-react';
import { THEME } from '../constants';

const TimelineView = ({
  darkMode,
  filteredEvents,
  onSelectEvent,
  onClearFilters
}) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;
  const [layout, setLayout] = useState('horizontal');

  if (filteredEvents.length === 0) {
    return (
      <div className={`${darkMode ? 'bg-gray-900/60 border-gray-700/50' : 'bg-white/60 border-amber-300'} rounded-lg shadow-lg border-2 p-12 text-center`}>
        <p className={`text-xl font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-amber-900'}`}>
          No hay eventos que coincidan con los filtros
        </p>
        <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
          Prueba con otra búsqueda o limita menos la década, categoría o región.
        </p>
        <button
          onClick={onClearFilters}
          className={`px-5 py-3 rounded-lg font-display uppercase tracking-wide text-sm transition-all ${
            darkMode
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-amber-800 text-amber-50 hover:bg-red-700'
          }`}
        >
          Limpiar filtros
        </button>
      </div>
    );
  }

  const groupedByDecade = {};
  filteredEvents.forEach((event) => {
    const decade = event.decade || `${Math.floor(event.year / 10) * 10}s`;
    if (!groupedByDecade[decade]) groupedByDecade[decade] = [];
    groupedByDecade[decade].push(event);
  });
  const sortedDecades = Object.keys(groupedByDecade).sort((a, b) => parseInt(a) - parseInt(b));

  const toggleBtn = `px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
    darkMode
      ? 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
  }`;
  const toggleBtnActive = `px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
    darkMode
      ? 'bg-red-600 text-white'
      : 'bg-amber-800 text-amber-50'
  }`;

  const dashedColor = darkMode ? 'rgba(220,38,38,0.3)' : 'rgba(180,83,9,0.3)';
  const dotColor = darkMode ? 'bg-red-500' : 'bg-amber-600';
  const dotBorder = darkMode ? 'border-gray-900' : 'border-amber-100';
  const decadeBg = darkMode ? 'bg-red-600 border-gray-900' : 'bg-amber-700 border-amber-100';
  const lineColor = darkMode ? 'bg-red-900/50' : 'bg-amber-300';

  return (
    <div className={`${darkMode ? 'bg-gray-900/60 border-gray-700/50' : 'bg-white/60 border-amber-300'} rounded-lg shadow-lg border-2 p-6 md:p-8`}>
      <h2 className={`text-3xl md:text-4xl font-display uppercase tracking-wide mb-2 ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
        Línea Temporal
      </h2>
      <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
        {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} del movimiento anarquista. Navega por décadas o cambia a vista feed.
      </p>

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setLayout('horizontal')}
          className={layout === 'horizontal' ? toggleBtnActive : toggleBtn}
          title="Vista horizontal"
        >
          <LayoutGrid size={14} className="inline mr-1" />
          Línea
        </button>
        <button
          onClick={() => setLayout('vertical')}
          className={layout === 'vertical' ? toggleBtnActive : toggleBtn}
          title="Vista vertical (feed)"
        >
          <LayoutList size={14} className="inline mr-1" />
          Feed
        </button>
        <span className={`text-xs ml-2 ${darkMode ? 'text-gray-500' : 'text-amber-600'}`}>
          {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''}
        </span>
      </div>

      {layout === 'horizontal' ? (
        /* ── Vista horizontal con estética feed ── */
        <div className={`${darkMode ? 'bg-gray-900/60 border-gray-700/50' : 'bg-white/60 border-amber-300'} rounded-lg shadow-lg border-2 p-6 overflow-x-auto`}>
          <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
            {sortedDecades.map((decade) => (
              <div key={decade} className="flex flex-col" style={{ minWidth: `${groupedByDecade[decade].length * 220 + 60}px` }}>
                {/* Separador de década */}
                <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                  <div className={`flex-shrink-0 w-14 h-14 ${decadeBg} rounded-full border-4 flex items-center justify-center shadow-lg`}>
                    <span className="text-base font-display text-white">{decade.replace('s', '')}</span>
                  </div>
                  <div className={`flex-1 h-px ${lineColor}`}></div>
                  <span className={`text-xs font-display uppercase tracking-wider flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-amber-600'}`}>
                    {groupedByDecade[decade].length}
                  </span>
                </div>

                {/* Línea con eventos */}
                <div className="relative flex-1" style={{ borderTop: `2px dashed ${dashedColor}`, paddingTop: '24px' }}>
                  <div className="flex gap-5">
                    {groupedByDecade[decade].map((event, idx) => (
                      <div key={idx} className="relative flex flex-col items-center" style={{ minWidth: '200px', maxWidth: '240px' }}>
                        {/* Punto */}
                        <div className={`absolute -top-[31px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 ${dotColor} rounded-full border-2 ${dotBorder} z-10`}></div>

                        <button
                          className={`${cardClass} border-2 rounded-lg p-3 shadow-md hover:shadow-xl transition-all w-full cursor-pointer text-left`}
                          onClick={() => onSelectEvent(event)}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-lg">{event.image}</span>
                              <span className={`text-lg font-display ${darkMode ? 'text-gray-300' : 'text-amber-800'}`}>
                                {event.year}
                              </span>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-amber-200 text-amber-800'}`}>
                              {event.region}
                            </span>
                          </div>
                          <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1 line-clamp-2`}>
                            {event.title}
                          </h3>
                          <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-700'} line-clamp-2`}>
                            {event.description}
                          </p>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── Vista vertical (feed por década) ── */
        <div className="space-y-8">
          {sortedDecades.map((decade) => (
            <div key={decade}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`flex-shrink-0 w-16 h-16 ${decadeBg} rounded-full border-4 flex items-center justify-center shadow-lg`}>
                  <span className="text-lg font-display text-white">{decade.replace('s', '')}</span>
                </div>
                <div className={`flex-1 h-px ${lineColor}`}></div>
                <span className={`text-xs font-display uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-amber-600'}`}>
                  {groupedByDecade[decade].length} evento{groupedByDecade[decade].length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-4 ml-8 border-l-2 border-dashed pl-6" style={{ borderColor: dashedColor }}>
                {groupedByDecade[decade].map((event, idx) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[31px] top-5 w-4 h-4 ${dotColor} rounded-full border-2 ${dotBorder} z-10`}></div>

                    <button
                      className={`${cardClass} border-2 rounded-lg p-5 shadow-md hover:shadow-xl transition-all w-full cursor-pointer text-left`}
                      onClick={() => onSelectEvent(event)}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{event.image}</span>
                          <span className={`text-2xl font-display ${darkMode ? 'text-gray-300' : 'text-amber-800'}`}>
                            {event.year}
                          </span>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full flex-shrink-0 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-amber-200 text-amber-800'}`}>
                          {event.region}
                        </span>
                      </div>
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>
                        {event.title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                        {event.description}
                      </p>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimelineView;
