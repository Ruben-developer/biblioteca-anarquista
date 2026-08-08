import React from 'react';
import { X } from 'lucide-react';
import { THEME } from '../constants';

const TourModal = ({ darkMode, onClose }) => {
  const themeClass = darkMode ? THEME.dark : THEME.light;
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;

  const tourItems = [
    { icon: '📅', title: 'Línea Temporal', description: 'Navega por eventos históricos' },
    { icon: '🗺️', title: 'Mapa', description: 'Explora textos por región' },
    { icon: '👤', title: 'Biografías', description: 'Conoce a los pensadores' },
    { icon: '⭐', title: 'Favoritos', description: 'Guarda textos' }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className={`${cardClass} border-2 rounded-lg max-w-2xl w-full p-8`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">ℹ️</span>
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Bienvenido
          </h2>
        </div>
        <div className="space-y-4">
          {tourItems.map((item) => (
            <p key={item.title}>
              {item.icon} <strong>{item.title}:</strong> {item.description}
            </p>
          ))}
        </div>
        <button 
          onClick={onClose}
          className={`mt-6 ${themeClass.accentBg} ${themeClass.accentBgHover} text-white px-6 py-3 rounded-lg w-full transition-colors`}
        >
          ¡Comenzar!
        </button>
      </div>
    </div>
  );
};

export default TourModal;
