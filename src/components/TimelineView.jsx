import React from 'react';
import { THEME } from '../constants';

const TimelineView = ({ 
  darkMode, 
  filteredEvents, 
  onSelectEvent
}) => {
  const themeClass = darkMode ? THEME.dark : THEME.light;
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;

  return (
    <div className={`${darkMode ? 'bg-gray-900/60 border-gray-700/50' : 'bg-white/60 border-amber-300'} rounded-lg shadow-lg border-2 p-6 overflow-x-auto`}>
      <div className="relative" style={{ minWidth: `${filteredEvents.length * 380}px` }}>
        <div className={`absolute top-12 left-0 right-0 h-1 ${darkMode ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-800' : 'bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800'}`}></div>
        
        <div className="flex gap-8">
          {filteredEvents.map((event, idx) => (
            <div key={idx} className="relative flex flex-col items-center" style={{ minWidth: '360px' }}>
              <div className={`w-10 h-10 ${darkMode ? 'bg-red-600 border-gray-900' : 'bg-amber-700 border-amber-100'} rounded-full border-4 flex items-center justify-center text-2xl shadow-lg z-10 mb-4`}>
                {event.image}
              </div>
            
              <div 
                className={`${cardClass} border-2 rounded-lg p-5 shadow-md hover:shadow-xl transition-all w-full cursor-pointer`} 
                onClick={() => onSelectEvent(event)}
              >
                <div className="flex justify-between mb-3">
                  <span className={`text-3xl font-bold ${darkMode ? 'text-gray-300' : 'text-amber-800'}`}>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
