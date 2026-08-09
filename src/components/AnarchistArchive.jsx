import React, { useState } from 'react';
import { timelineEvents } from '../data/timelineEvents';
import { authors } from '../data/authors';
import { regionData } from '../data/regionData';
import { VIEWS } from '../constants';
import { filterEvents, calculateTotalTexts } from '../utils/filters';
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
import ReaderView from './ReaderView';
import TourModal from './TourModal';
import RegionModal from './RegionModal';
import EventModal from './EventModal';
import ScrollTopButton from './ScrollTopButton';

const AnarchistArchive = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { favorites, toggleFavorite } = useFavorites();
  const { showScrollTop, scrollToTop } = useScrollTop();

  const [activeView, setActiveView] = useState(VIEWS.TIMELINE);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [readingBook, setReadingBook] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const [filters, setFilters] = useState({
    searchTerm: '',
    decade: 'all',
    category: 'all',
    region: 'all'
  });

  const filteredEvents = filterEvents(timelineEvents, filters);

  const stats = {
    texts: calculateTotalTexts(regionData),
    events: timelineEvents.length,
    regions: Object.keys(regionData).length,
    authors: authors.length
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      decade: 'all',
      category: 'all',
      region: 'all'
    });
  };

  const bgClass = darkMode
    ? 'bg-gradient-to-br from-red-950 via-black to-gray-900 text-gray-100'
    : 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 text-gray-800';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-500`}>
      <Header
        darkMode={darkMode}
        onDarkModeToggle={toggleDarkMode}
        onShowTour={() => setShowTour(true)}
        onShowStats={() => setShowStats(!showStats)}
        stats={stats}
      />

      <Navigation
        activeView={activeView}
        onViewChange={setActiveView}
        darkMode={darkMode}
        favoriteCount={favorites.length}
        regionCount={Object.keys(regionData).length}
      />

      {showStats && (
        <StatsPanel darkMode={darkMode} stats={stats} />
      )}

      <main className="container mx-auto px-4 py-8">
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
            authors={authors}
          />
        )}

        {activeView === VIEWS.LIBRARY && (
          <LibraryView
            darkMode={darkMode}
            regionData={regionData}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
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
      </main>

      {readingBook && (
        <ReaderView
          darkMode={darkMode}
          book={readingBook}
          onClose={() => setReadingBook(null)}
        />
      )}

      {showTour && (
        <TourModal
          darkMode={darkMode}
          onClose={() => setShowTour(false)}
        />
      )}

      {selectedRegion && (
        <RegionModal
          darkMode={darkMode}
          region={selectedRegion}
          regionData={regionData}
          favorites={favorites}
          onClose={() => setSelectedRegion(null)}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {selectedEvent && (
        <EventModal
          darkMode={darkMode}
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
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
