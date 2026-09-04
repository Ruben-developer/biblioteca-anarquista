import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Compass, Library } from 'lucide-react';
import { THEME } from '../constants';
import { anarchistTheories } from '../data/anarchistTheories';
import { findBookByTitle } from '../utils/library';

const TheoriesView = ({ darkMode, regionData, onRead = () => {}, onOpenLibrary = () => {} }) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className={`${darkMode ? 'bg-gray-900/60 border-[#872320]/50' : 'bg-white/60 border-[#B79F6E]'} rounded-lg shadow-lg border-2 p-6 md:p-8`}>
      <h2 className={`text-3xl md:text-4xl font-display uppercase tracking-wide mb-2 ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
        Teorías y corrientes del anarquismo
      </h2>
      <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
        {anarchistTheories.length} ramas del pensamiento libertario. Haz clic en una corriente para ver sus ideas, autores y obras del archivo.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {anarchistTheories.map((theory, idx) => {
          const isOpen = openId === theory.id;
          const books = theory.books
            .map((title) => findBookByTitle(regionData, title))
            .filter(Boolean);
          return (
            <div key={theory.id} className={`${cardClass} border-2 rounded-lg p-5 shadow-md hover:shadow-lg transition-all flex flex-col card-appear`} style={{ animationDelay: `${Math.min(idx, 8) * 45}ms` }}>
              <button
                className="text-left w-full"
                onClick={() => toggle(theory.id)}
                aria-expanded={isOpen}
              >
                <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>
                  {theory.name}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-amber-700'} mb-3`}>
                  {theory.description}
                </p>
                <div className={`flex items-center justify-between pt-3 mt-3 border-t ${darkMode ? 'border-[#872320]' : 'border-[#B79F6E]'}`}>
                  <span className="text-sm flex items-center gap-1">
                    <BookOpen size={16} className="inline mr-1" />
                    {books.length} {books.length === 1 ? 'obra' : 'obras'}
                  </span>
                  <span className="text-sm flex items-center gap-1">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="mt-4 space-y-3">
                  <div className={`rounded-lg border-2 p-3 ${darkMode ? 'bg-gray-800/60 border-[#872320]/50' : 'bg-white/80 border-[#B79F6E]'}`}>
                    <ul className="space-y-1">
                      {theory.keyIdeas.map((idea) => (
                        <li key={idea} className={`text-xs flex gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <span className={darkMode ? 'text-red-400' : 'text-amber-700'}>›</span>
                          {idea}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {theory.keyAuthors.map((author) => (
                      <span key={author} className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-amber-800 text-amber-50'}`}>
                        {author}
                      </span>
                    ))}
                  </div>

                  {books.length > 0 && (
                    <div className="space-y-2">
                      {books.map((book, idx) => (
                        <div key={`${theory.id}-${idx}`} className={`rounded-lg border-2 p-3 ${darkMode ? 'bg-gray-800/60 border-[#872320]/50' : 'bg-white/80 border-[#B79F6E]'}`}>
                          <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            {book.title}
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {book.author}
                            </span>
                            <span className="flex items-center gap-1.5 flex-shrink-0">
                              {book.filename && (
                                <button
                                  onClick={() => onRead(book)}
                                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                                    darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-700 text-amber-50 hover:bg-amber-800'
                                  }`}
                                >
                                  <BookOpen size={12} />
                                  Leer
                                </button>
                              )}
                              <button
                                onClick={() => onOpenLibrary({ searchTerm: book.title })}
                                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                                  darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white border border-[#B79F6E] text-amber-800 hover:bg-amber-800'
                                }`}
                                title={`Ver "${book.title}" en el catálogo`}
                              >
                                <Library size={12} />
                                En el catálogo
                              </button>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={`mt-8 flex items-start gap-3 rounded-lg border-2 p-4 ${darkMode ? 'bg-gray-900/40 border-[#872320]/50' : 'bg-white/60 border-[#B79F6E]'}`}>
        <Compass className={darkMode ? 'text-red-400' : 'text-amber-700'} size={20} />
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
          Las corrientes no son compartimentos estancos: casi todos los autores transitaron varias. Esta clasificación es orientativa y nace del propio catálogo.
        </p>
      </div>

      <button
        type="button"
        onClick={() => onOpenLibrary({})}
        className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          darkMode ? 'bg-gray-800 border border-[#872320] text-gray-200 hover:bg-gray-700' : 'bg-white border border-[#B79F6E] text-amber-800 hover:bg-amber-800'
        }`}
      >
        <Library size={16} />
        Ver todas las obras del catálogo
      </button>
    </div>
  );
};


export default TheoriesView;