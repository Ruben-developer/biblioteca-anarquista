import React, { useState } from 'react';
import { LayoutList, LayoutGrid } from 'lucide-react';
import { THEME } from '../constants';

const TimelineView = ({
  darkMode,
  filteredEvents,
  onSelectEvent,
  onClearFilters
}) => {
  const themeClass = darkMode ? THEME.dark : THEME.light;
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

  // Agrupar eventos por década para la vista vertical
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

  return (
    <div>
      {/* Toggle de layout */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setLayout('horizontal')}
          className={layout === 'horizontal' ? toggleBtnActive : toggleBtn}
          title="Vista horizontal (scroll)"
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
        /* ── Vista horizontal (original) ── */
        <div className={`${darkMode ? 'bg-gray-900/60 border-gray-700/50' : 'bg-white/60 border-amber-300'} rounded-lg shadow-lg border-2 p-6 overflow-x-auto`}>
          <div className="relative" style={{ minWidth: `${filteredEvents.length * 380}px` }}>
            <div className={`absolute top-12 left-0 right-0 h-1 ${darkMode ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-800' : 'bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800'}`}></div>
            <div className="flex gap-8">
              {filteredEvents.map((event, idx) => (
                <div key={idx} className="relative flex flex-col items-center" style={{ minWidth: '360px' }}>
                  <div className={`w-10 h-10 ${darkMode ? 'bg-red-600 border-gray-900' : 'bg-amber-700 border-amber-100'} rounded-full border-4 flex items-center justify-center text-2xl shadow-lg z-10 mb-4`}>
                    {event.image}
                  </div>
                  <button
                    className={`${cardClass} border-2 rounded-lg p-5 shadow-md hover:shadow-xl transition-all w-full cursor-pointer text-left`}
                    onClick={() => onSelectEvent(event)}
                  >
                    <div className="flex justify-between mb-3">
                      <span className={`text-3xl font-display ${darkMode ? 'text-gray-300' : 'text-amber-800'}`}>
                        {event.year}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-amber-200'}`}>
                        {event.region}
                      </span>
                    </div>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-3`}>
                      {event.title}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                      {event.description}
                    </p>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── Vista vertical (feed por década) ── */
        <div className="space-y-8">
          {sortedDecades.map((decade) => (
            <div key={decade}>
              {/* Separador de década */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`flex-shrink-0 w-16 h-16 ${darkMode ? 'bg-red-600 border-gray-900' : 'bg-amber-700 border-amber-100'} rounded-full border-4 flex items-center justify-center shadow-lg`}>
                  <span className="text-lg font-display text-white">{decade.replace('s', '')}</span>
                </div>
                <div className={`flex-1 h-px ${darkMode ? 'bg-red-900/50' : 'bg-amber-300'}`}></div>
                <span className={`text-xs font-display uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-amber-600'}`}>
                  {groupedByDecade[decade].length} evento{groupedByDecade[decade].length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Eventos de la década */}
              <div className="space-y-4 ml-8 border-l-2 border-dashed pl-6" style={{ borderColor: darkMode ? 'rgba(220,38,38,0.3)' : 'rgba(180,83,9,0.3)' }}>
                {groupedByDecade[decade].map((event, idx) => (
                  <div key={idx} className="relative">
                    {/* Punto en la línea */}
                    <div className={`absolute -left-[31px] top-5 w-4 h-4 ${darkMode ? 'bg-red-500' : 'bg-amber-600'} rounded-full border-2 ${darkMode ? 'border-gray-900' : 'border-amber-100'} z-10`}></div>

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
