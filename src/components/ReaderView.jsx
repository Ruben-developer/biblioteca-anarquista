import React, { useEffect, useState } from 'react';
import { X, Download, Minus, Plus } from 'lucide-react';
import { THEME } from '../constants';
import { getDocumentDownloadUrl } from '../services/documentService';

const ReaderView = ({ darkMode, book, onClose }) => {
  const [text, setText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [sepia, setSepia] = useState(false);

  const filename = book.filename || '';
  const isPdf = filename.toLowerCase().endsWith('.pdf');
  const url = getDocumentDownloadUrl(filename);

  useEffect(() => {
    setText(null);
    if (isPdf) return;
    if (!url) return;
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then((res) => (res.ok ? res.text() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((content) => {
        if (!cancelled) setText(content);
      })
      .catch((err) => {
        if (!cancelled) setText(`No se pudo cargar el texto (${err.message}). Descarga el archivo directamente.`);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isPdf, url]);

  const themeClass = darkMode ? THEME.dark : THEME.light;
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Lectura de ${book.title}`}
    >
      <div className={`${cardClass} border-2 rounded-lg w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden`}>
        <div className={`${darkMode ? 'bg-red-900/30' : 'bg-amber-700'} p-4 flex items-center justify-between gap-3`}>
          <div className="flex-1 min-w-0">
            <h2 className={`text-lg font-bold truncate ${darkMode ? 'text-gray-100' : 'text-amber-50'}`}>
              {book.title}
            </h2>
            <p className={`text-xs truncate ${darkMode ? 'text-gray-300' : 'text-amber-100'}`}>
              por {book.author} · {book.region} {book.year ? `· ${book.year}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isPdf && text && (
              <button
                onClick={() => setSepia(!sepia)}
                className={`text-xs px-3 py-1.5 rounded transition-colors ${sepia ? 'bg-amber-600 text-white' : darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-amber-100 text-amber-900 hover:bg-amber-200'}`}
              >
                {sepia ? 'Modo sepia' : 'Modo normal'}
              </button>
            )}
            {!isPdf && text && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setFontSize((s) => Math.max(12, s - 2))}
                  className={`p-1.5 rounded ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-amber-100 text-amber-900 hover:bg-amber-200'}`}
                  aria-label="Reducir letra"
                >
                  <Minus size={14} />
                </button>
                <span className={`text-xs px-1 ${darkMode ? 'text-gray-300' : 'text-amber-50'}`}>{fontSize}px</span>
                <button
                  onClick={() => setFontSize((s) => Math.min(32, s + 2))}
                  className={`p-1.5 rounded ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-amber-100 text-amber-900 hover:bg-amber-200'}`}
                  aria-label="Aumentar letra"
                >
                  <Plus size={14} />
                </button>
              </div>
            )}
            {url && (
              <a
                href={url}
                download={filename.split('/').pop()}
                className={`text-xs px-3 py-1.5 rounded flex items-center gap-1 ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-amber-100 text-amber-900 hover:bg-amber-200'}`}
              >
                <Download size={14} />
                Descargar
              </a>
            )}
            <button
              onClick={onClose}
              className={`p-1.5 rounded ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-amber-100 text-amber-900 hover:bg-amber-200'}`}
              aria-label="Cerrar lector"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden min-h-0">
          {isPdf ? (
            url ? (
              <iframe
                src={url}
                title={`Lector PDF de ${book.title}`}
                className="w-full h-full"
                style={{ border: 'none', background: '#fff' }}
              />
            ) : (
              <p className="p-6 text-center">Este libro no tiene archivo asociado.</p>
            )
          ) : loading ? (
            <p className="p-6 text-center">Cargando texto…</p>
          ) : text ? (
            <div
              className={`h-full overflow-y-auto p-6 md:p-10 leading-relaxed ${sepia ? 'bg-[#f4ecd8] text-[#5b4636]' : darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'}`}
            >
              <pre
                className="whitespace-pre-wrap font-serif"
                style={{ fontSize: `${fontSize}px` }}
              >
                {text}
              </pre>
            </div>
          ) : (
            <p className="p-6 text-center">Este libro no tiene archivo de texto.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReaderView;
