import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, Library, MapPin, Search } from 'lucide-react';
import { useModalFocus } from '../hooks';
import ModalHeader from './ModalHeader';

// Modal compartido para listas largas de obras (Praxis, Acratas y Autores).
// Evita que una tarjeta crezca cientos de píxeles al desplegarse: la lista
// vive aquí, con scroll propio y buscador cuando hay muchas obras.
const CollectionModal = ({
  darkMode,
  title,
  subtitle,
  icon,
  books = [],
  extra = null,
  onClose,
  onRead = () => {},
  onOpenLibrary = () => {}
}) => {
  const dialogRef = useModalFocus(onClose);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return books;
    return books.filter((book) =>
      `${book.title} ${book.author || ''}`.toLowerCase().includes(term)
    );
  }, [books, search]);

  const handleRead = (book) => {
    onRead(book);
    onClose();
  };

  const handleOpenLibrary = (book) => {
    onOpenLibrary({ searchTerm: book.title });
    onClose();
  };

  const modal = (
    <dialog
      ref={dialogRef}
      open
      className="fixed inset-0 w-full h-full bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-modal="true"
      aria-label={title}
    >
      <div className={`bg-paper border-2 ${darkMode ? 'border-accent/50' : 'border-line'} rounded-lg max-w-3xl w-full p-6 max-h-[90vh] flex flex-col`}>
        <ModalHeader
          darkMode={darkMode}
          title={title}
          subtitle={subtitle}
          icon={icon}
          onClose={onClose}
        />

        {extra}

        {books.length > 8 && (
          <div className="relative mb-3">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}
              size={16}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar obra o autor..."
              aria-label="Buscar obra o autor en la lista"
              className={`w-full ${darkMode ? 'bg-gray-800 border-accent text-gray-100 placeholder-gray-500' : 'bg-white/80 border-line text-gray-800 placeholder-amber-600'} border-2 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-line transition-colors`}
            />
          </div>
        )}

        <div className="space-y-2 overflow-y-auto pr-1 min-h-0">
          {filtered.map((book, idx) => (
            <div
              key={`${book.region || ''}-${book.title}-${idx}`}
              className={`rounded-lg border-2 p-3 ${darkMode ? 'bg-gray-800/60 border-accent/50' : 'bg-white/80 border-line'}`}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium font-serif ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {book.title}
                  </p>
                  {book.author && (
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {book.author}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {book.region && (
                      <span className={`text-xs flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <MapPin size={11} /> {book.region}
                      </span>
                    )}
                    {book.category && (
                      <span className={`px-2 py-0.5 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-amber-200 text-amber-900'}`}>
                        {book.category}
                      </span>
                    )}
                    {book.pubYear && (
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {book.pubYear}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {book.filename && (
                    <button
                      onClick={() => handleRead(book)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-700 text-amber-50 hover:bg-amber-800'
                      }`}
                    >
                      <BookOpen size={12} />
                      Leer
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenLibrary(book)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                      darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white border border-line text-amber-800 hover:bg-amber-100'
                    }`}
                    title={`Ver "${book.title}" en el catálogo`}
                  >
                    <Library size={12} />
                    En el catálogo
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className={`text-center py-6 text-sm ${darkMode ? 'text-gray-500' : 'text-amber-600'}`}>
              No hay obras que coincidan con la búsqueda.
            </p>
          )}
        </div>

        {books.length > 8 && (
          <p className={`mt-3 pt-3 border-t text-xs text-center ${darkMode ? 'border-accent text-gray-500' : 'border-line text-amber-600'}`}>
            {filtered.length} de {books.length} obras
          </p>
        )}
      </div>
    </dialog>
  );

  // Portal al body: el contenedor de la vista usa `transform` (animación de
  // entrada), lo que convertiría a un ancestro en el bloque contenedor de
  // `position: fixed` y descuadraría el modal.
  if (typeof document === 'undefined') return null;
  return createPortal(modal, document.body);
};

export default CollectionModal;
