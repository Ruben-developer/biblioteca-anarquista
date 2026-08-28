import React from 'react';
import { X } from 'lucide-react';

// Cabecera compartida para los modales (EventModal y RegionModal).
// Usa la estructura de RegionModal: margen negativo para pegarse al borde
// del contenedor (que debe tener `p-6`) y padding interno uniforme.
const ModalHeader = ({ darkMode, title, subtitle, icon: Icon, iconSize = 28, onClose }) => (
  <div className={`${darkMode ? 'bg-red-900/30' : 'bg-amber-700'} rounded-t-lg -m-6 mb-4 p-6`}>
    <div className="flex justify-between items-center gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <Icon
            className={`${darkMode ? 'text-red-400' : 'text-amber-100'} shrink-0`}
            size={iconSize}
          />
        )}
        <div className="min-w-0">
          <h2 className={`text-2xl font-bold break-words ${darkMode ? 'text-gray-100' : 'text-amber-50'}`}>
            {title}
          </h2>
          {subtitle && (
            <span className={`text-xl font-bold ${darkMode ? 'text-gray-300' : 'text-amber-200'}`}>
              {subtitle}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={onClose}
        className={`shrink-0 ${darkMode ? 'text-gray-300' : 'text-amber-100'}`}
        aria-label="Cerrar"
      >
        <X size={24} />
      </button>
    </div>
  </div>
);

export default ModalHeader;
