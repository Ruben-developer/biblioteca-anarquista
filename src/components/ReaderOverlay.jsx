import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { X, BookOpen, Download, Sun, Moon, ExternalLink } from 'lucide-react';
import { getDocumentDownloadUrl } from '../services/documentService';

// Lector embebido "modo lectura": muestra el documento en un iframe a pantalla
// completa, sobre un fondo neutro tipo epub (claro/pergamino u oscuro),
// con controles de cierre, descarga, abrir en pestaña y cambio de fondo.
const ReaderOverlay = ({ book, darkMode, onClose }) => {
  const [readingDark, setReadingDark] = useState(Boolean(darkMode));

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  if (!book) return null;

  const url = getDocumentDownloadUrl(book.filename);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col ${readingDark ? 'bg-gray-950' : 'bg-[#F5EDD9]'}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Lector: ${book.title}`}
    >
      <div className={`flex items-center gap-3 px-4 py-3 border-b ${readingDark ? 'bg-gray-900 border-gray-800' : 'bg-[#EDE1C8] border-[#CBB788]'}`}>
        <button
          onClick={onClose}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            readingDark ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-white/70 text-gray-800 hover:bg-white'
          }`}
          aria-label="Cerrar lector"
        >
          <X size={16} />
          Cerrar
        </button>
        <div className="flex-1 min-w-0">
          <p className={`font-display text-sm font-bold truncate ${readingDark ? 'text-gray-100' : 'text-gray-900'}`}>
            {book.title}
          </p>
          {book.author && (
            <p className={`text-xs truncate ${readingDark ? 'text-gray-400' : 'text-amber-800'}`}>
              por {book.author}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setReadingDark((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              readingDark ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-white/70 text-gray-800 hover:bg-white'
            }`}
            title={readingDark ? 'Fondo de lectura claro' : 'Fondo de lectura oscuro'}
          >
            {readingDark ? <Sun size={16} /> : <Moon size={16} />}
            {readingDark ? 'Claro' : 'Oscuro'}
          </button>
          {url && (
            <a
              href={url}
              download
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                readingDark ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-white/70 text-gray-800 hover:bg-white'
              }`}
              title="Descargar el documento"
            >
              <Download size={16} />
            </a>
          )}
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                readingDark ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-white/70 text-gray-800 hover:bg-white'
              }`}
              title="Abrir en pestaña nueva"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      <div className={`flex-1 flex flex-col items-center px-4 py-4 overflow-hidden ${readingDark ? 'bg-gray-950' : 'bg-[#F5EDD9]'}`}>
        {url ? (
          <iframe
            src={url}
            title={`Lector de ${book.title}`}
            className={`w-full max-w-5xl flex-1 rounded-lg border ${
              readingDark ? 'bg-white border-gray-800' : 'bg-white border-[#CBB788]'
            }`}
          />
        ) : (
          <div className={`flex-1 flex flex-col items-center justify-center text-center ${readingDark ? 'text-gray-400' : 'text-amber-800'}`}>
            <BookOpen size={48} className="mb-3" />
            <p className="text-lg font-semibold mb-1">Esta obra no tiene archivo digitalizado</p>
            <p className="text-sm">Pronto estará disponible para leer.</p>
          </div>
        )}
      </div>
    </div>
  );
};

ReaderOverlay.propTypes = {
  book: PropTypes.object,
  darkMode: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

export default ReaderOverlay;