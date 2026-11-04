import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { THEME } from '../constants'
import { useIsMobile } from '../hooks'
import TimelineFilters from './TimelineFilters'

const formatYear = (year) => (year === -1800 ? 'A.A.' : year)
const formatDecade = (decade) => (decade === '-1800s' ? 'A.A.' : decade.replace('s', ''))

/**
 * Barra de scroll propia para la línea temporal.
 * Chrome usa barras superpuestas que solo aparecen al desplazar (y que ignoran
 * ::-webkit-scrollbar), así que la dibujamos nosotros: siempre visible, pegada
 * al borde inferior del panel y con los colores del estilo activo.
 */
const BarraHorizontal = ({ contenedorRef, darkMode }) => {
  const [estado, setEstado] = useState({ ancho: 100, izq: 0, visible: false })

  const medir = useCallback(() => {
    const el = contenedorRef.current
    if (!el) return
    const desborde = el.scrollWidth - el.clientWidth
    if (desborde <= 1) {
      setEstado({ ancho: 100, izq: 0, visible: false })
      return
    }
    // El pulgar nunca baja del 12%: sigue siendo agarrable en líneas largas.
    const ancho = Math.max((el.clientWidth / el.scrollWidth) * 100, 12)
    const izq = (el.scrollLeft / desborde) * (100 - ancho)
    setEstado({ ancho, izq, visible: true })
  }, [contenedorRef])

  useEffect(() => {
    medir()
    const el = contenedorRef.current
    if (!el) return undefined
    const observador = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(medir) : null
    if (observador) observador.observe(el)
    el.addEventListener('scroll', medir, { passive: true })
    globalThis.addEventListener('resize', medir)
    return () => {
      if (observador) observador.disconnect()
      el.removeEventListener('scroll', medir)
      globalThis.removeEventListener('resize', medir)
    }
  }, [contenedorRef, medir])

  const irA = useCallback((fraccion) => {
    const el = contenedorRef.current
    if (!el) return
    el.scrollLeft = fraccion * (el.scrollWidth - el.clientWidth)
  }, [contenedorRef])

  const arrastrar = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const el = contenedorRef.current
    if (!el) return
    const inicioX = e.clientX
    const inicioScroll = el.scrollLeft
    const desborde = el.scrollWidth - el.clientWidth
    const pista = e.currentTarget.parentElement
    const anchoPista = pista ? pista.clientWidth : 1
    const mover = (ev) => {
      const delta = ((ev.clientX - inicioX) / anchoPista) * desborde
      el.scrollLeft = inicioScroll + delta
    }
    const soltar = () => {
      globalThis.removeEventListener('pointermove', mover)
      globalThis.removeEventListener('pointerup', soltar)
    }
    globalThis.addEventListener('pointermove', mover)
    globalThis.addEventListener('pointerup', soltar)
  }

  const saltar = (e) => {
    if (e.target !== e.currentTarget) return
    const rect = e.currentTarget.getBoundingClientRect()
    irA((e.clientX - rect.left) / rect.width)
  }

  const fraccionActual = () => {
    const el = contenedorRef.current
    if (!el) return 0
    const desborde = el.scrollWidth - el.clientWidth
    return desborde > 0 ? el.scrollLeft / desborde : 0
  }

  const teclas = (e) => {
    const paso = 0.1
    if (e.key === 'ArrowRight') { e.preventDefault(); irA(Math.min(1, fraccionActual() + paso)) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); irA(Math.max(0, fraccionActual() - paso)) }
    else if (e.key === 'Home') { e.preventDefault(); irA(0) }
    else if (e.key === 'End') { e.preventDefault(); irA(1) }
  }

  if (!estado.visible) return null

  const pistaClass = darkMode ? 'bg-gray-700/70' : 'bg-line-soft/60'
  const pulgarClass = darkMode ? 'bg-red-400/80 hover:bg-red-300' : 'bg-accent hover:bg-red-deep'

  return (
    <div
      className={`absolute inset-x-0 bottom-0 h-3 rounded-full cursor-pointer ${pistaClass}`}
      onClick={saltar}
      role="scrollbar"
      aria-orientation="horizontal"
      aria-controls="linea-temporal-pista"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(estado.izq + estado.ancho / 2)}
      tabIndex={0}
      onKeyDown={teclas}
    >
      <div
        className={`absolute top-0 h-3 rounded-full ${pulgarClass} cursor-grab active:cursor-grabbing`}
        style={{ width: `${estado.ancho}%`, left: `${estado.izq}%` }}
        onPointerDown={arrastrar}
      />
    </div>
  )
}

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
}) => {
  const scrollRef = useRef(null)

  return (
  <div className={`${darkMode ? 'bg-gray-900/60 border-accent/50' : 'bg-white/60 border-line'} rounded-lg shadow-lg border-2 p-6 pb-0`}>
    <div className="relative">
      {/* La barra propia vive en el borde inferior del panel; el padding
          inferior del contenedor que desliza separa las tarjetas de ella. */}
      <div
        id="linea-temporal-pista"
        ref={scrollRef}
        className="timeline-scroll overflow-x-auto pb-6"
      >
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
      <BarraHorizontal contenedorRef={scrollRef} darkMode={darkMode} />
    </div>
  </div>
  )
}

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
  <div className={`${darkMode ? 'bg-gray-900/60 border-accent/50' : 'bg-white/60 border-line'} rounded-lg shadow-lg border-2 p-6`}>
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
      <div className={`${darkMode ? 'bg-gray-900/60 border-accent/50' : 'bg-white/60 border-line'} rounded-lg shadow-lg border-2 p-12 text-center`}>
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
  const dotBorder = darkMode ? 'border-accent' : 'border-line'
  const decadeBg = darkMode ? 'bg-red-600 border-accent' : 'bg-amber-700 border-line'
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
    <div className={`${darkMode ? 'bg-gray-900/60 border-accent/50' : 'bg-white/60 border-line'} rounded-lg shadow-lg border-2 p-6 md:p-8`}>
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
