import React, { useState } from 'react'
import { BookOpen, Trash2, StickyNote } from 'lucide-react'
import ModalHeader from './ModalHeader'
import { useModalFocus } from '../hooks'

const BookDetailModal = ({
  darkMode,
  book,
  notes = [],
  onAddNote,
  onDeleteNote,
  onRead,
  onClose
}) => {
  const dialogRef = useModalFocus(onClose)
  const [newNote, setNewNote] = useState('')

  if (!book) return null

  const handleAdd = () => {
    const text = newNote.trim()
    if (!text) return
    onAddNote(book, text)
    setNewNote('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleAdd()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      open
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      aria-modal="true"
      aria-label={book.title}
    >
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-lg w-full max-h-[85vh] flex flex-col`}>
        <ModalHeader
          darkMode={darkMode}
          title={book.title}
          subtitle={book.author}
          icon={BookOpen}
          onClose={onClose}
        />

        <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-4">
          {/* Meta */}
          <div className="flex items-center gap-3 text-sm flex-wrap">
            {book.year && (
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{book.year}</span>
            )}
            <span className={`font-mono text-xs uppercase tracking-wider px-2 py-0.5 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-amber-200 text-amber-900'}`}>
              {book.category}
            </span>
            {book.region && (
              <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-amber-200 text-amber-900'}`}>
                {book.region}
              </span>
            )}
          </div>

          {book.summary && (
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {book.summary}
            </p>
          )}

          {/* Notes section */}
          <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-amber-200'} pt-4`}>
            <h3 className={`flex items-center gap-2 font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              <StickyNote size={16} />
              Notas
              {notes.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-amber-200 text-amber-800'}`}>
                  {notes.length}
                </span>
              )}
            </h3>

            {notes.length > 0 && (
              <div className="space-y-2 mb-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className={`flex items-start gap-2 p-2 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-amber-50'}`}
                  >
                    <p className={`flex-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} break-words`}>
                      {note.text}
                    </p>
                    <button
                      onClick={() => onDeleteNote(book, note.id)}
                      className={`shrink-0 p-1 rounded transition-colors ${darkMode ? 'text-gray-500 hover:text-red-400 hover:bg-gray-600' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                      title="Eliminar nota"
                      aria-label={`Eliminar nota: ${note.text}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe una nota..."
                rows={2}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm resize-none ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500'
                    : 'bg-white border-amber-300 text-gray-800 placeholder-amber-500'
                }`}
              />
              <button
                onClick={handleAdd}
                disabled={!newNote.trim()}
                className={`self-end px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  newNote.trim()
                    ? darkMode
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-amber-700 text-amber-50 hover:bg-amber-800'
                    : darkMode
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-amber-200 text-amber-500 cursor-not-allowed'
                }`}
              >
                Agregar
              </button>
            </div>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              Ctrl+Enter para agregar
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-amber-200'} px-6 py-3 flex justify-end`}>
          {book.filename && (
            <button
              onClick={() => onRead(book)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                darkMode
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-amber-700 text-amber-50 hover:bg-amber-800'
              }`}
            >
              <BookOpen size={14} />
              Leer
            </button>
          )}
        </div>
      </div>
    </dialog>
  )
}

export default BookDetailModal
