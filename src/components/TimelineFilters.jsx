import React from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Clock, Tag, MapPin } from 'lucide-react';
import { CATEGORIES, DECADES, REGIONS, THEME } from '../constants';

const TimelineFilters = ({ 
  darkMode,
  filters,
  onFilterChange,
  onShowFilters,
  showFilters,
  onClearFilters,
  eventCount,
  totalEventCount
}) => {
  const themeClass = darkMode ? THEME.dark : THEME.light;
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;

  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, searchTerm: e.target.value })
  }

  const handleDecadeChange = (decade) => {
    onFilterChange({ ...filters, decade })
  }

  const handleCategoryChange = (category) => {
    onFilterChange({ ...filters, category })
  }

  const handleRegionChange = (region) => {
    onFilterChange({ ...filters, region })
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`} size={20} />
        <input
          type="text"
          placeholder="Buscar eventos..."
          aria-label="Buscar eventos"
          value={filters.searchTerm}
          onChange={handleSearchChange}
          className={`w-full ${darkMode ? 'bg-gray-800 border-[#872320] text-gray-100' : 'bg-white/80 border-[#B79F6E] text-gray-800'} border-2 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#B79F6E]`}
        />
      </div>

      <button
        onClick={onShowFilters}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${themeClass.button} transition-colors`}
      >
        <Filter size={18} />
        Filtros
        {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {showFilters && (
        <div className={`${cardClass} border-2 rounded-lg p-6 space-y-4`}>
          <div className="flex justify-between">
            <h3 className="font-bold">Filtrar eventos</h3>
            <button 
              onClick={onClearFilters}
              className={`text-sm ${darkMode ? 'text-red-400' : 'text-amber-700'} underline`}
            >
              Limpiar
            </button>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              <Clock size={16} className="inline mr-2" />
              Década
            </label>
            <div className="flex flex-wrap gap-2">
              {DECADES.map(decade => (
                <button
                  key={decade}
                  onClick={() => handleDecadeChange(decade)}
                  className={`px-3 py-1 rounded text-sm ${
                    filters.decade === decade
                      ? darkMode ? 'bg-red-600 text-white' : 'bg-amber-700 text-white'
                      : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-amber-800 text-amber-50'
                  }`}
                >
                  {decade === 'all' ? 'Todas' : decade}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              <Tag size={16} className="inline mr-2" />
              Categoría
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3 py-1 rounded text-sm ${
                    filters.category === cat.id
                      ? darkMode ? 'bg-red-600 text-white' : 'bg-amber-700 text-white'
                      : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-amber-800 text-amber-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              <MapPin size={16} className="inline mr-2" />
              Región
            </label>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map(region => (
                <button
                  key={region}
                  onClick={() => handleRegionChange(region)}
                  className={`px-3 py-1 rounded text-sm ${
                    filters.region === region
                      ? darkMode ? 'bg-red-600 text-white' : 'bg-amber-700 text-white'
                      : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-amber-800 text-amber-50'
                  }`}
                >
                  {region === 'all' ? 'Todas' : region}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-amber-800'}`}>
        Mostrando {eventCount} de {totalEventCount} eventos
      </p>
    </div>
  );
};

export default TimelineFilters;
