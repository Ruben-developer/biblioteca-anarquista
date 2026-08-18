import React, { useState } from 'react';
import { timelineEvents } from '../data/timelineEvents';
import { regionData } from '../data/regionData';
import { VIEWS } from '../constants';
import { filterEvents } from '../utils/filters';
import { getAllAuthors, getArchiveStats } from '../utils/library';
import { useScrollTop, useDarkMode, useFavorites } from '../hooks';

// Components
import Header from './Header';
import Navigation from './Navigation';
import TimelineFilters from './TimelineFilters';
import StatsPanel from './StatsPanel';
import TimelineView from './TimelineView';
import WorldMapView from './WorldMapView';
import AuthorsView from './AuthorsView';
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
  const { favorites, toggleFavorite } = useFavorites();
  const { showScrollTop, scrollToTop } = useScrollTop();

  const [activeView, setActiveView] = useState(VIEWS.LIBRARY);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [readingBook, setReadingBook] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [filters, setFilters] = useState({
    searchTerm: '',
    decade: 'all',
    category: 'all',
    region: 'all'
  });

  const filteredEvents = filterEvents(timelineEvents, filters);

  // Autores derivados del catálogo: agrupados por autoría, de más a menos obras.
  const dynamicAuthors = getAllAuthors(regionData);

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
        stats={stats}
        activeView={activeView}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen(!menuOpen)}
      />

      <Navigation
        activeView={activeView}
        onViewChange={setActiveView}
        darkMode={darkMode}
        favoriteCount={favorites.length}
        regionCount={Object.keys(regionData).length}
        menuOpen={menuOpen}
        onMenuClose={() => setMenuOpen(false)}
      />

      <main className="container mx-auto px-4 py-8">
        <div key={activeView} className="view-transition space-y-6">
          {activeView === VIEWS.STATS && (
            <StatsPanel darkMode={darkMode} stats={stats} />
          )}

          {activeView === VIEWS.TIMELINE && (
            <div className="space-y-6">
              <TimelineFilters
                darkMode={darkMode}
                filters={filters}
                onFilterChange={setFilters}
                onShowFilters={() => setShowFilters(!showFilters)}
                showFilters={showFilters}
                onClearFilters={clearFilters}
                eventCount={filteredEvents.length}
                totalEventCount={timelineEvents.length}
              />
              <TimelineView
                darkMode={darkMode}
                filteredEvents={filteredEvents}
                onSelectEvent={setSelectedEvent}
                onClearFilters={clearFilters}
              />
            </div>
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
            />
          )}

          {activeView === VIEWS.FAVORITES && (
            <FavoritesView
              darkMode={darkMode}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          )}

          {activeView === VIEWS.THEORIES && (
            <TheoriesView
              darkMode={darkMode}
              regionData={regionData}
              onRead={setReadingBook}
            />
          )}

          {activeView === VIEWS.PATHS && (
            <ReadingPathsView
              darkMode={darkMode}
              regionData={regionData}
              onRead={setReadingBook}
            />
          )}

          {activeView === VIEWS.GLOSSARY && (
            <GlossaryView
              darkMode={darkMode}
              regionData={regionData}
              onRead={setReadingBook}
            />
          )}

          {activeView === VIEWS.CONTACT && (
            <ContactView darkMode={darkMode} />
          )}
        </div>
      </main>

      <footer className={`border-t-4 ${darkMode ? 'border-red-900 bg-black/30' : 'border-amber-800 bg-amber-100/60'}`}>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className={`font-display uppercase tracking-widest text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-amber-900'}`}>
            La Idea · Archivo Histórico Anarquista · 1840–1968
          </p>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
            Textos de dominio público · {stats.texts} registros en el catálogo
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
