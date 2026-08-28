import React, { useState, useRef } from 'react';
import { Heart, BookOpen, X, Download, Upload, StickyNote, Calendar, User, Tag } from 'lucide-react';
import { THEME } from '../constants';

const CATEGORY_LABELS = {
  teoria: 'Teoría', historia: 'Historia', biografia: 'Biografía',
  movimiento: 'Movimiento', organizacion: 'Organización', represion: 'Represión',
  periodismo: 'Periodismo', revolucion: 'Revolución', manifiesto: 'Manifiesto',
  dialogo: 'Diálogo'
};

const renderNoteSection = (fav, { editingNote, noteText, setNoteText, saveNote, setEditingNote, startEditNote }, darkMode) => {
  if (editingNote === fav.title) {
    return (
      <div className="mb-3">
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Escribe una nota personal sobre este texto..."
          className={`w-full text-sm rounded-lg border p-2.5 resize-none ${
            darkMode
              ? 'bg-gray-800 border-[#872320] text-gray-200 placeholder-gray-500'
              : 'bg-white border-[#B79F6E] text-gray-800 placeholder-amber-600'
          }`}
          rows={3}
          autoFocus
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={saveNote}
            className={`px-3 py-1 rounded text-xs font-medium ${
              darkMode ? 'bg-red-600 text-white' : 'bg-amber-700 text-amber-50'
            }`}
          >
            Guardar
          </button>
          <button
            onClick={() => setEditingNote(null)}
            className={`px-3 py-1 rounded text-xs ${
              darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-amber-600 hover:text-amber-700'
            }`}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  if (fav.note) {
    return (
      <button
        className={`mb-3 p-2.5 rounded-lg text-sm cursor-pointer text-left w-full ${
          darkMode ? 'bg-gray-800/60 text-gray-300' : 'bg-amber-50 text-amber-800'
        }`}
        onClick={() => startEditNote(fav)}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <StickyNote size={12} className={darkMode ? 'text-amber-400' : 'text-amber-600'} />
          <span className={`text-xs font-medium ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>Mi nota</span>
        </div>
        {fav.note}
      </button>
    );
  }

  return null;
};

const FavoritesView = ({
  darkMode,
  favorites,
  onToggleFavorite,
  onUpdateNote,
  onExport,
  onImport,
  onRead
}) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [importMsg, setImportMsg] = useState(null);
  const fileInputRef = useRef(null);

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = onImport(reader.result);
      setImportMsg(res.ok ? `Importados ${res.count} texto(s).` : res.error);
    };
    reader.onerror = () => setImportMsg('No se pudo leer el archivo.');
    reader.readAsText(file);
  };

  const startEditNote = (fav) => {
    setEditingNote(fav.title);
    setNoteText(fav.note || '');
  };

  const saveNote = () => {
    if (editingNote) {
      onUpdateNote(editingNote, noteText);
      setEditingNote(null);
      setNoteText('');
    }
  };

  const handleExport = () => {
    const text = onExport();
    const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'la-idea-favoritos.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (favorites.length === 0) {
    return (
      <div className={`${darkMode ? 'bg-gray-900/60 border-[#872320]/50' : 'bg-white/60 border-[#B79F6E]'} rounded-lg shadow-lg border-2 p-6 md:p-8`}>
        <div className="mb-6 text-center">
          <h2 className={`text-3xl md:text-4xl font-display uppercase tracking-wide ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
            Mi Biblioteca
          </h2>
          <div className="flex justify-center mt-4">
            <button
              onClick={handleImportClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-[#872320]'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-[#B79F6E]'
              }`}
            >
              <Upload size={16} />
              Importar lista
            </button>
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImportFile} />
        {importMsg && (
          <p className={`text-sm mb-4 ${importMsg.startsWith('Importados') ? (darkMode ? 'text-red-400' : 'text-amber-800') : (darkMode ? 'text-red-400' : 'text-red-600')}`}>
            {importMsg}
          </p>
        )}
        <div className={`${cardClass} border-2 rounded-lg p-12 text-center`}>
          <Heart size={64} className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-amber-300'}`} />
          <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-amber-800'}`}>
            Tu biblioteca personal está vacía
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-amber-600'} mt-2`}>
            Guarda textos desde la Biblioteca o el Mapa para construir tu colección
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'bg-gray-900/60 border-[#872320]/50' : 'bg-white/60 border-[#B79F6E]'} rounded-lg shadow-lg border-2 p-6 md:p-8`}>
      <div className="mb-6 text-center">
        <h2 className={`text-3xl md:text-4xl font-display uppercase tracking-wide ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
          Mi Biblioteca
        </h2>
        <p className={`text-sm mt-1 mb-4 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
          {favorites.length} texto{favorites.length === 1 ? '' : 's'} en tu colección personal
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleImportClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              darkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-[#872320]'
                : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-[#B79F6E]'
            }`}
          >
            <Upload size={16} />
            Importar lista
          </button>
          <button
            onClick={handleExport}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              darkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-[#872320]'
                : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-[#B79F6E]'
            }`}
          >
            <Download size={16} />
            Exportar lista
          </button>
        </div>
      </div>
      <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImportFile} />
      {importMsg && (
        <p className={`text-sm mb-4 ${importMsg.startsWith('Importados') ? (darkMode ? 'text-red-400' : 'text-amber-800') : (darkMode ? 'text-red-400' : 'text-red-600')}`}>
          {importMsg}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[...favorites].reverse().map((fav) => (
          <div
            key={fav.title}
            className={`${cardClass} border-2 rounded-lg p-5 shadow-md hover:shadow-lg transition-all group`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} leading-tight`}>
                  {fav.title}
                </h3>
                {fav.author && (
                  <div className={`flex items-center gap-1.5 mt-1.5 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
                    <User size={13} />
                    <span className="text-sm">{fav.author}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => onToggleFavorite(fav.title)}
                className={`${darkMode ? 'text-red-400 hover:text-red-500' : 'text-red-500 hover:text-red-600'} transition-colors flex-shrink-0`}
                title="Quitar de favoritos"
              >
                <X size={20} />
              </button>
            </div>

            <div className={`flex flex-wrap gap-2 mb-3 text-xs ${darkMode ? 'text-gray-500' : 'text-amber-600'}`}>
              {fav.year && (
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {fav.year}
                </span>
              )}
              {fav.category && (
                <span className="flex items-center gap-1">
                  <Tag size={12} />
                  {CATEGORY_LABELS[fav.category] || fav.category}
                </span>
              )}
            </div>

            {renderNoteSection(fav, { editingNote, noteText, setNoteText, saveNote, setEditingNote, startEditNote }, darkMode)}

            <div className="flex items-center gap-2 mt-auto">
              {fav.filename && (
                <button
                  onClick={() => onRead({ title: fav.title, author: fav.author, filename: fav.filename })}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    darkMode
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-amber-700 text-amber-50 hover:bg-amber-800'
                  }`}
                >
                  <BookOpen size={12} />
                  Leer
                </button>
              )}
              <button
                onClick={() => startEditNote(fav)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  darkMode
                    ? 'bg-gray-800 text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}
              >
                <StickyNote size={13} />
                {fav.note ? 'Editar nota' : 'Añadir nota'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesView;
