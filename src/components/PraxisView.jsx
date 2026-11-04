import React, { useMemo, useState } from 'react';
import { BookOpen, Compass } from 'lucide-react';
import { THEME } from '../constants';
import { anarchistTheories } from '../data/anarchistTheories';
import { findBookByTitle } from '../utils/library';
import CollectionModal from './CollectionModal';

const PraxisView = ({ darkMode, regionData, onRead = () => {}, onOpenLibrary = () => {} }) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;
  const [selectedId, setSelectedId] = useState(null);

  // Cada corriente con sus obras resueltas contra el catálogo, ordenadas de
  // más a menos obras para que las principales queden arriba.
  const theories = useMemo(
    () =>
      anarchistTheories
        .map((theory) => ({
          ...theory,
          resolvedBooks: theory.books
            .map((title) => findBookByTitle(regionData, title))
            .filter(Boolean)
        }))
        .sort((a, b) => b.resolvedBooks.length - a.resolvedBooks.length),
    [regionData]
  );

  const selected = theories.find((theory) => theory.id === selectedId) || null;

  return (
    <div className={`${darkMode ? 'bg-gray-900/60 border-accent/50' : 'bg-white/60 border-line'} rounded-lg shadow-lg border-2 p-6 md:p-8`}>
      <h2 className={`text-3xl md:text-4xl font-display uppercase tracking-wide mb-2 ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
        Praxis anarquista
      </h2>
      <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
        {anarchistTheories.length} ramas del pensamiento libertario, ordenadas por número de obras. Haz clic en una corriente para ver sus ideas, autores y obras en la biblioteca.
      </p>

      <div className={`mb-6 flex items-start gap-3 rounded-lg border-2 p-4 ${darkMode ? 'bg-gray-900/40 border-accent/50' : 'bg-white/60 border-line'}`}>
        <Compass className={darkMode ? 'text-red-400' : 'text-amber-700'} size={20} />
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
          Las corrientes no son dogmas físicos: casi todos los autores transitaron varias. Esta clasificación es orientativa y nace del propio catálogo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {theories.map((theory, idx) => (
          <button
            key={theory.id}
            type="button"
            onClick={() => setSelectedId(theory.id)}
            aria-haspopup="dialog"
            className={`${cardClass} border-2 rounded-lg p-5 shadow-md hover:shadow-lg transition-all flex flex-col text-left card-appear`}
            style={{ animationDelay: `${Math.min(idx, 8) * 45}ms` }}
          >
            <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>
              {theory.name}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-amber-700'} mb-3`}>
              {theory.description}
            </p>
            <div className={`flex items-center justify-between pt-3 mt-auto border-t ${darkMode ? 'border-accent' : 'border-line'}`}>
              <span className="text-sm flex items-center gap-1">
                <BookOpen size={16} className="inline mr-1" />
                {theory.resolvedBooks.length} {theory.resolvedBooks.length === 1 ? 'obra' : 'obras'}
              </span>
              <span className={`text-xs ${darkMode ? 'text-red-400' : 'text-amber-700'}`}>
                Ver ideas y obras
              </span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <CollectionModal
          darkMode={darkMode}
          title={selected.name}
          subtitle={`${selected.resolvedBooks.length} ${selected.resolvedBooks.length === 1 ? 'obra' : 'obras'}`}
          icon={Compass}
          books={selected.resolvedBooks}
          onClose={() => setSelectedId(null)}
          onRead={onRead}
          onOpenLibrary={onOpenLibrary}
          extra={
            <div className="mb-4 space-y-3">
              <div className={`rounded-lg border-2 p-3 ${darkMode ? 'bg-gray-800/60 border-accent/50' : 'bg-white/80 border-line'}`}>
                <p className={`text-xs uppercase tracking-wide mb-2 ${darkMode ? 'text-gray-500' : 'text-amber-600'}`}>
                  Ideas clave
                </p>
                <ul className="space-y-1">
                  {selected.keyIdeas.map((idea) => (
                    <li key={idea} className={`text-xs flex gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className={darkMode ? 'text-red-400' : 'text-amber-700'}>›</span>
                      {idea}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selected.keyAuthors.map((author) => (
                  <span
                    key={author}
                    className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-amber-200 text-amber-900'}`}
                  >
                    {author}
                  </span>
                ))}
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

export default PraxisView;
