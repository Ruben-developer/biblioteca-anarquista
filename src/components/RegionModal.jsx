import React from 'react';
import { X, MapPin, Download, Share2, Heart } from 'lucide-react';
import { THEME } from '../constants';
import { getDocumentDownloadUrl } from '../services/documentService';

const RegionModal = ({ 
  darkMode, 
  region, 
  regionData, 
  favorites,
  onClose, 
  onToggleFavorite 
}) => {
  const themeClass = darkMode ? THEME.dark : THEME.light;
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;

  if (!region || !regionData[region]) return null;

  const handleDownload = (filename) => {
    const url = getDocumentDownloadUrl(filename);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = (title) => {
    if (navigator.share) {
      navigator.share({
        title: 'Archivo Histórico Anarquista',
        text: `Descubre: ${title}`,
        url: window.location.href
      });
    } else {
      const url = `${window.location.href}#${title}`;
      navigator.clipboard.writeText(url);
      alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={region}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className={`${cardClass} border-4 ${darkMode ? 'border-red-900/50' : 'border-amber-700'} rounded-lg max-w-2xl w-full p-6`}>
        <div className={`${darkMode ? 'bg-red-900/30' : 'bg-amber-700'} rounded-t-lg -m-6 mb-4 p-4`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <MapPin className={darkMode ? 'text-red-400' : 'text-amber-100'} size={28} />
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-amber-50'}`}>
                {region}
              </h2>
            </div>
            <button onClick={onClose} className={darkMode ? 'text-gray-300' : 'text-amber-100'}>
              <X size={24} />
            </button>
          </div>
        </div>
        
        <p className={`${darkMode ? 'text-gray-400' : 'text-amber-900'} mb-4`}>
          Textos del anarquismo en {region}
        </p>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {regionData[region].books.map((book, idx) => (
            <div key={idx} className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/80 border-amber-300'} border-2 rounded-lg p-4`}>
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>
                    {book.title}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    por {book.author}
                  </p>
                  <div className="flex items-center gap-3 text-sm flex-wrap">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      📅 {book.year}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-700' : 'bg-amber-200'}`}>
                      {book.category}
                    </span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      ⭐ {book.rating}
                    </span>
                  </div>
                  {book.summary && (
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'} mt-2 line-clamp-2`}>
                      {book.summary}
                    </p>
                  )}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {book.filename && (
                      <button 
                        onClick={() => handleDownload(book.filename)}
                        className={`text-xs ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-amber-700 hover:text-amber-900'} flex items-center gap-1 hover:underline transition-colors`}
                      >
                        <Download size={14} />
                        Descargar
                      </button>
                    )}
                    <button 
                      onClick={() => handleShare(book.title)}
                      className={`text-xs ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-amber-700 hover:text-amber-900'} flex items-center gap-1 hover:underline transition-colors`}
                    >
                      <Share2 size={14} />
                      Compartir
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => onToggleFavorite(book.title)}
                  className="flex-shrink-0 transition-transform hover:scale-110"
                  title={favorites.includes(book.title) ? 'Remover de favoritos' : 'Agregar a favoritos'}
                >
                  <Heart 
                    size={20} 
                    className={favorites.includes(book.title) ? 'fill-red-500 text-red-500' : darkMode ? 'text-gray-500 hover:text-gray-400' : 'text-amber-600 hover:text-amber-700'}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegionModal;
