import React from 'react';
import { Search } from 'lucide-react';

const TimelineFilters = ({
  darkMode,
  filters,
  onFilterChange,
  eventCount,
  totalEventCount
}) => {
  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, searchTerm: e.target.value })
  }

  return (
    <div className="space-y-3 mb-6">
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`} size={20} />
        <input
          type="text"
          placeholder="Buscar eventos..."
          aria-label="Buscar eventos"
          value={filters.searchTerm}
          onChange={handleSearchChange}
          className={`w-full ${darkMode ? 'bg-gray-800 border-accent text-gray-100' : 'bg-white/80 border-line text-gray-800'} border-2 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-line`}
        />
      </div>

      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-amber-800'}`}>
        Mostrando {eventCount} de {totalEventCount} eventos
      </p>
    </div>
  );
};

export default TimelineFilters;
