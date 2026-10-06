import React, { useState, useMemo, useEffect, useRef } from 'react';
import { timelineEvents } from '../data/timelineEvents';
import { regionData } from '../data/regionData';
import { VIEWS } from '../constants';
import { filterEvents } from '../utils/filters';
import { getAllAuthors, getArchiveStats } from '../utils/library';
import {
  parseRoute,
  buildBookSlugIndex,
  readRouteInput,
  currentRouteHref,
  viewHref,
  bookHref,
  routesMode
} from '../utils/routes';
import { useScrollTop, useDarkMode, useFavorites } from '../hooks';

// Components
import Header from './Header';
import Navigation from './Navigation';
import StatsPanel from './StatsPanel';
import TimelineView from './TimelineView';
import WorldMapView from './WorldMapView';
import AuthorsView from './AuthorsView';
import InfluencesView from './InfluencesView';
import AcratasView from './AcratasView';
import FavoritesView from './FavoritesView';
import LibraryView from './LibraryView';
import TheoriesView from './TheoriesView';
import ReadingPathsView from './ReadingPathsView';
import GlossaryView from './GlossaryView';
import ContactView from './ContactView';
import ReaderOverlay from './ReaderOverlay';
import RegionModal from './RegionModal';
import EventModal from './EventModal';
import ScrollTopButton from './ScrollTopButton';

// Índice de enlaces profundos (slug ↔ obra): se calcula una sola vez por módulo,
// no en cada render. Inmutable durante la vida de la app (regionData es fijo).
const BOOK_INDEX = buildBookSlugIndex(regionData);

// Ruta inicial de la URL (#/mapa, #/libro/<slug>…). En SSR no hay window:
// se usa la vista por defecto (biblioteca) sin abrir ninguna obra.
const getInitialRoute = () =>
  typeof window === 'undefined'
    ? { type: 'view', view: VIEWS.LIBRARY }
    : parseRoute(readRouteInput(), BOOK_INDEX);

const AnarchistArchive = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { favorites, toggleFavorite, updateFavoriteNote, addFavoriteNote, deleteFavoriteNote, exportFavorites, importFavorites } = useFavorites();
  const { showScrollTop, scrollToTop } = useScrollTop();

  // Ruta inicial de la URL: un deep link (#/mapa, #/libro/<slug>) abre
  // directamente esa vista/obra; sin hash se parte de la biblioteca.
  const [initialRoute] = useState(getInitialRoute);
  const [activeView, setActiveView] = useState(
    initialRoute.type === 'view' ? initialRoute.view : VIEWS.LIBRARY
  );
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [readingBook, setReadingBook] = useState(initialRoute.type === 'book' ? initialRoute.book : null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [libraryInitialFilters, setLibraryInitialFilters] = useState(null);

  const [filters, setFilters] = useState({
    searchTerm: '',
    decade: 'all',
    category: 'all',
    region: 'all'
  });

  const filteredEvents = filterEvents(timelineEvents, filters);

  // Autores derivados del catálogo: agrupados por autoría, de más a menos obras.
  // Se excluye 'otros' (cubo de contabilidad: no se publica en ninguna vista).
  const dynamicAuthors = useMemo(
    () => getAllAuthors(regionData)
      .map((a) => ({ ...a, books: a.books.filter((b) => b.category !== 'otros') }))
      .filter((a) => a.books.length > 0),
    [regionData]
  );

  // Métricas del archivo (dashboard + header/footer) — fuente única
  // getArchiveStats(regionData, timelineEvents).
  const stats = getArchiveStats(regionData, timelineEvents);

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      decade: 'all',
      category: 'all',
      region: 'all'
    });
  };

  // Referencia cruzada Biblioteca → línea temporal: abre la vista de timeline
  // con el evento que agrupa la obra y muestra su modal.
  const openEventFromLibrary = (event) => {
    setActiveView(VIEWS.TIMELINE);
    setSelectedEvent(event);
  };

  // Cross-links desde Teorías/Rutas/Glosario → Biblioteca con filtros
  // precargados (cambio 5 del reporte @ux-review de navegación, 2026-08-17).
  const openLibraryWithFilters = (filters) => {
    setLibraryInitialFilters(filters || null);
    setActiveView(VIEWS.LIBRARY);
  };

  // Navegación general (nav/header): al ir a Biblioteca se limpian los filtros
  // precargados por cross-links, para que el menú siempre abra el catálogo completo.
  const handleViewChange = (view) => {
    if (view === VIEWS.LIBRARY) setLibraryInitialFilters(null);
    setActiveView(view);
  };

  // Estado → URL: la URL siempre refleja la vista activa y la obra abierta,
  // para que cualquier página sea compartible. El primer sincronizado usa
  // replaceState (no añade entrada al historial); los cambios posteriores
  // crean entrada y habilitan Atrás/Adelante: location.hash en modo hash,
  // pushState en modo pathname (rutas reales del beta en Cloudflare Workers).
  // Si la URL ya coincide no se toca nada (evita bucles con hashchange).
  const hashSyncedRef = useRef(false);
  useEffect(() => {
    let target;
    if (readingBook) {
      const slug = BOOK_INDEX.slugFor(readingBook);
      // Obra sin enlace canónico (p. ej. un favorito cuyo título ya no está en
      // el catálogo): se abre el lector sin reescribir la URL.
      if (!slug) return;
      target = bookHref(slug);
    } else {
      target = viewHref(activeView);
    }
    if (currentRouteHref() === target) {
      hashSyncedRef.current = true;
      return;
    }
    if (hashSyncedRef.current) {
      if (routesMode() === 'pathname') {
        window.history.pushState(null, '', target);
      } else {
        window.location.hash = target;
      }
    } else {
      hashSyncedRef.current = true;
      window.history.replaceState(null, '', target);
    }
  }, [activeView, readingBook]);

  // URL → estado: responde a Atrás/Adelante, a la edición manual de la URL y a
  // enlaces externos. Escucha también popstate por si el navegador no emite
  // hashchange en la traversión (en modo pathname, popstate es el único que
  // llega). Handler idempotente: si el estado ya coincide con la URL, ningún
  // setState cambia y no se re-renderiza.
  useEffect(() => {
    const syncFromHash = () => {
      const route = parseRoute(readRouteInput(), BOOK_INDEX);
      if (route.type === 'book') {
        // Un deep link de obra no cambia la vista: solo abre (o sustituye) el lector.
        setReadingBook((prev) => (prev && BOOK_INDEX.slugFor(prev) === route.slug ? prev : route.book));
        return;
      }
      setReadingBook(null);
      if (route.view === VIEWS.LIBRARY) setLibraryInitialFilters(null);
      setActiveView(route.view);
    };
    window.addEventListener('hashchange', syncFromHash);
    window.addEventListener('popstate', syncFromHash);
    return () => {
      window.removeEventListener('hashchange', syncFromHash);
      window.removeEventListener('popstate', syncFromHash);
    };
  }, []);

  const bgClass = darkMode
    ? 'bg-gradient-to-br from-red-950 via-black to-gray-900 text-gray-100'
    : 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 text-gray-800';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-500 theme-constructivista theme-pergamino`}>
      <Header
        darkMode={darkMode}
        onDarkModeToggle={toggleDarkMode}
        onShowStats={() => setActiveView(VIEWS.STATS)}
        onShowContact={() => setActiveView(VIEWS.CONTACT)}
        onViewChange={handleViewChange}
        favoriteCount={favorites.length}
        stats={stats}
        activeView={activeView}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen(!menuOpen)}
      />

      <Navigation
        activeView={activeView}
        onViewChange={handleViewChange}
        darkMode={darkMode}
        favoriteCount={favorites.length}
        menuOpen={menuOpen}
        onMenuClose={() => setMenuOpen(false)}
      />

      <main className="container mx-auto px-4 py-8">
        <div key={activeView} className="view-transition space-y-6">
          {activeView === VIEWS.STATS && (
            <StatsPanel darkMode={darkMode} stats={stats} />
          )}

          {activeView === VIEWS.TIMELINE && (
            <TimelineView
              darkMode={darkMode}
              filteredEvents={filteredEvents}
              onSelectEvent={setSelectedEvent}
              onClearFilters={clearFilters}
              filters={filters}
              onFilterChange={setFilters}
              onShowFilters={() => setShowFilters(!showFilters)}
              showFilters={showFilters}
              totalEventCount={timelineEvents.length}
            />
          )}

          {activeView === VIEWS.MAP && (
            <WorldMapView
              darkMode={darkMode}
              regionData={regionData}
              onSelectRegion={setSelectedRegion}
            />
          )}

          {activeView === VIEWS.AUTHORS && (
            <AuthorsView
              darkMode={darkMode}
              authors={dynamicAuthors}
              onRead={setReadingBook}
            />
          )}

          {activeView === VIEWS.INFLUENCES && (
            <InfluencesView
              darkMode={darkMode}
              regionData={regionData}
              onRead={setReadingBook}
            />
          )}

          {activeView === VIEWS.ACRATAS && (
            <AcratasView
              darkMode={darkMode}
              regionData={regionData}
              onRead={setReadingBook}
            />
          )}

          {activeView === VIEWS.LIBRARY && (
            <LibraryView
              darkMode={darkMode}
              regionData={regionData}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              timelineEvents={timelineEvents}
              onOpenEvent={openEventFromLibrary}
              onRead={setReadingBook}
              initialFilters={libraryInitialFilters}
            />
          )}

          {activeView === VIEWS.FAVORITES && (
            <FavoritesView
              darkMode={darkMode}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onAddNote={addFavoriteNote}
              onDeleteNote={deleteFavoriteNote}
              onUpdateNote={updateFavoriteNote}
              onExport={exportFavorites}
              onImport={importFavorites}
              onRead={setReadingBook}
            />
          )}

          {activeView === VIEWS.THEORIES && (
            <TheoriesView
              darkMode={darkMode}
              regionData={regionData}
              onRead={setReadingBook}
              onOpenLibrary={openLibraryWithFilters}
            />
          )}

          {activeView === VIEWS.PATHS && (
            <ReadingPathsView
              darkMode={darkMode}
              regionData={regionData}
              onRead={setReadingBook}
              onOpenLibrary={openLibraryWithFilters}
            />
          )}

          {activeView === VIEWS.GLOSSARY && (
            <GlossaryView
              darkMode={darkMode}
              regionData={regionData}
              onRead={setReadingBook}
              onOpenLibrary={openLibraryWithFilters}
            />
          )}

          {activeView === VIEWS.CONTACT && (
            <ContactView darkMode={darkMode} />
          )}
        </div>
      </main>

      <footer className={`border-t-2 shadow-[0_-4px_12px_rgba(0,0,0,0.25)] ${darkMode ? 'border-[#872320]/50 bg-black/30' : 'border-[#B79F6E] bg-amber-100/60'}`}>
        <div className="container mx-auto px-4 py-8">
          <p className={`font-display uppercase tracking-widest text-sm text-center ${darkMode ? 'text-gray-300' : 'text-amber-900'}`}>
            La Idea · Archivo Histórico Anarquista
          </p>
        </div>
      </footer>

      {selectedRegion && (
        <RegionModal
          darkMode={darkMode}
          region={selectedRegion}
          regionData={regionData}
          favorites={favorites}
          onClose={() => setSelectedRegion(null)}
          onToggleFavorite={toggleFavorite}
          onRead={setReadingBook}
        />
      )}

      {selectedEvent && (
        <EventModal
          darkMode={darkMode}
          event={selectedEvent}
          regionData={regionData}
          onClose={() => setSelectedEvent(null)}
          onRead={setReadingBook}
        />
      )}

      {readingBook && (
        <ReaderOverlay
          book={readingBook}
          darkMode={darkMode}
          onClose={() => setReadingBook(null)}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {showScrollTop && (
        <ScrollTopButton
          darkMode={darkMode}
          onClick={scrollToTop}
        />
      )}
    </div>
  );
};

export default AnarchistArchive;
