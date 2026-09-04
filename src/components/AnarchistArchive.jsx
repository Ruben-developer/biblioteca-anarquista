import React, { useState, useMemo } from 'react';
import { timelineEvents } from '../data/timelineEvents';
import { regionData } from '../data/regionData';
import { VIEWS } from '../constants';
import { filterEvents } from '../utils/filters';
import { getAllAuthors, getArchiveStats } from '../utils/library';
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

const AnarchistArchive = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { favorites, toggleFavorite, updateFavoriteNote, addFavoriteNote, deleteFavoriteNote, exportFavorites, importFavorites } = useFavorites();
  const { showScrollTop, scrollToTop } = useScrollTop();

  const [activeView, setActiveView] = useState(VIEWS.LIBRARY);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [readingBook, setReadingBook] = useState(null);
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
