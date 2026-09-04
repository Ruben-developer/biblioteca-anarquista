import React, { useMemo } from 'react'
import { THEME } from '../constants'
import { useIsMobile } from '../hooks'
import TimelineFilters from './TimelineFilters'

const formatYear = (year) => (year === -1800 ? 'A.A.' : year)
const formatDecade = (decade) => (decade === '-1800s' ? 'A.A.' : decade.replace('s', ''))

const HorizontalTimeline = ({
  sortedDecades,
  groupedByDecade,
  darkMode,
  dashedColor,
  dotColor,
  dotBorder,
  decadeBg,
  lineColor,
  cardClass,
  onSelectEvent
}) => (
  <div className={`${darkMode ? 'bg-gray-900/60 border-[#872320]/50' : 'bg-white/60 border-[#B79F6E]'} rounded-lg shadow-lg border-2 p-6`}>
    <div className="relative">
      <div className="overflow-x-auto">
        <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
          {sortedDecades.map((decade) => (
            <div key={decade} className="flex flex-col" style={{ minWidth: `${groupedByDecade[decade].length * 220 + 60}px` }}>
              <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                <div className={`flex-shrink-0 w-14 h-14 ${decadeBg} rounded-full border-4 flex items-center justify-center shadow-lg`}>
                  <span className="text-base font-display text-white">{formatDecade(decade)}</span>
                </div>
                <div className={`flex-1 h-px ${lineColor}`}></div>
                <span className={`text-xs font-display uppercase tracking-wider flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-amber-600'}`}>
                  {groupedByDecade[decade].length}
                </span>
              </div>

              <div className="relative flex-1" style={{ borderTop: `2px dashed ${dashedColor}`, paddingTop: '24px' }}>
                <div className="flex gap-5">
                  {groupedByDecade[decade].map((event) => (
                    <div key={`${event.year}-${event.title}`} className="relative flex flex-col items-center" style={{ minWidth: '200px', maxWidth: '240px' }}>
                      <div className={`absolute -top-[31px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 ${dotColor} rounded-full border-2 ${dotBorder} z-10`}></div>

                      <button
                        className={`${cardClass} border-2 rounded-lg p-3 shadow-md hover:shadow-lg transition-all w-full cursor-pointer text-left`}
                        onClick={() => onSelectEvent(event)}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-lg font-display ${darkMode ? 'text-gray-300' : 'text-amber-800'}`}>
                              {formatYear(event.year)}
                            </span>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full min-w-0 text-right leading-tight ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-amber-200 text-amber-800'}`}>
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
      <div className={`absolute right-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-l ${darkMode ? 'from-gray-900' : 'from-amber-50'}`} />
    </div>
  </div>
)

const VerticalTimeline = ({
  sortedDecades,
  groupedByDecade,
  darkMode,
  dashedColor,
  dotColor,
  dotBorder,
  decadeBg,
  lineColor,
  cardClass,
  onSelectEvent
}) => (
  <div className={`${darkMode ? 'bg-gray-900/60 border-[#872320]/50' : 'bg-white/60 border-[#B79F6E]'} rounded-lg shadow-lg border-2 p-6`}>
    <div className="space-y-8">
    {sortedDecades.map((decade) => (
      <div key={decade}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`flex-shrink-0 w-16 h-16 ${decadeBg} rounded-full border-4 flex items-center justify-center shadow-lg`}>
            <span className="text-lg font-display text-white">{formatDecade(decade)}</span>
          </div>
          <div className={`flex-1 h-px ${lineColor}`}></div>
          <span className={`text-xs font-display uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-amber-600'}`}>
            {groupedByDecade[decade].length} evento{groupedByDecade[decade].length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="space-y-4 ml-8 pl-6" style={{ borderLeft: `2px dashed ${dashedColor}` }}>
          {groupedByDecade[decade].map((event) => (
            <div key={`${event.year}-${event.title}`} className="relative">
              <div className={`absolute -left-[31px] top-5 w-4 h-4 ${dotColor} rounded-full border-2 ${dotBorder} z-10`}></div>

              <button
                className={`${cardClass} border-2 rounded-lg p-5 shadow-md hover:shadow-lg transition-all w-full cursor-pointer text-left`}
                onClick={() => onSelectEvent(event)}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-display ${darkMode ? 'text-gray-300' : 'text-amber-800'}`}>
                      {formatYear(event.year)}
                    </span>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full min-w-0 text-right leading-tight ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-amber-200 text-amber-800'}`}>
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
  </div>
)

const TimelineView = ({
  darkMode,
  filteredEvents,
  onSelectEvent,
  onClearFilters,
  filters,
  onFilterChange,
  onShowFilters,
  showFilters,
  totalEventCount
}) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card
  // Línea (horizontal) en escritorio, Feed (vertical) en móvil
  const isMobile = useIsMobile()
  const layout = isMobile ? 'vertical' : 'horizontal'

  const { groupedByDecade, sortedDecades } = useMemo(() => {
    const grouped = {}
    filteredEvents.forEach((event) => {
      const decade = event.decade || `${Math.floor(event.year / 10) * 10}s`
      if (!grouped[decade]) grouped[decade] = []
      grouped[decade].push(event)
    })
    return { groupedByDecade: grouped, sortedDecades: Object.keys(grouped).sort((a, b) => Number.parseInt(a) - Number.parseInt(b)) }
  }, [filteredEvents])

  if (filteredEvents.length === 0) {
    return (
      <div className={`${darkMode ? 'bg-gray-900/60 border-[#872320]/50' : 'bg-white/60 border-[#B79F6E]'} rounded-lg shadow-lg border-2 p-12 text-center`}>
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
    )
  }

  const dashedColor = darkMode ? 'rgba(220,38,38,0.3)' : 'rgba(180,83,9,0.3)'
  const dotColor = darkMode ? 'bg-red-500' : 'bg-amber-600'
  const dotBorder = darkMode ? 'border-[#872320]' : 'border-[#B79F6E]'
  const decadeBg = darkMode ? 'bg-red-600 border-[#872320]' : 'bg-amber-700 border-[#B79F6E]'
  const lineColor = darkMode ? 'bg-red-900/50' : 'bg-amber-300'

  const timelineProps = {
    sortedDecades,
    groupedByDecade,
    darkMode,
    dashedColor,
    dotColor,
    dotBorder,
    decadeBg,
    lineColor,
    cardClass,
    onSelectEvent
  }

  return (
    <div className={`${darkMode ? 'bg-gray-900/60 border-[#872320]/50' : 'bg-white/60 border-[#B79F6E]'} rounded-lg shadow-lg border-2 p-6 md:p-8`}>
      <h2 className={`text-3xl md:text-4xl font-display uppercase tracking-wide mb-2 ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
        Línea Temporal
      </h2>
      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
        Navega por diferentes contextos históricos.
      </p>

      <TimelineFilters
        darkMode={darkMode}
        filters={filters}
        onFilterChange={onFilterChange}
        onShowFilters={onShowFilters}
        showFilters={showFilters}
        onClearFilters={onClearFilters}
        eventCount={filteredEvents.length}
        totalEventCount={totalEventCount}
      />

      {layout === 'horizontal' ? (
        <HorizontalTimeline {...timelineProps} />
      ) : (
        <VerticalTimeline {...timelineProps} />
      )}
    </div>
  )
}

export default TimelineView
