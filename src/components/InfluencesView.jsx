import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BookOpen, Share2 } from 'lucide-react';
import { THEME } from '../constants';
import { influenceNodes, influenceEdges } from '../data/influences';
import { getAllAuthors } from '../utils/library';

const NODE_R = 1.7;
const NODE_R_ACTIVE = 2.4;

const InfluencesView = ({ darkMode, regionData, onRead = () => {} }) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const nodeById = Object.fromEntries(influenceNodes.map((n) => [n.id, n]));
  const toSvgY = (y) => y * 0.6;

  const edgePath = (fromId, toId) => {
    const a = nodeById[fromId];
    const b = nodeById[toId];
    const x1 = a.x;
    const y1 = toSvgY(a.y);
    const x2 = b.x;
    const y2 = toSvgY(b.y);
    const dx = Math.max(8, Math.abs(x2 - x1) * 0.5);
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  };

  const isActiveEdge = (fromId, toId) =>
    (selectedId === fromId || selectedId === toId) ||
    (hoveredId === fromId || hoveredId === toId);

  const selected = selectedId ? nodeById[selectedId] : null;
  const authors = React.useMemo(() => getAllAuthors(regionData), [regionData]);
  const selectedAuthor = selected
    ? authors.find((a) => a.name.toLowerCase() === String(selected.authorKey || '').toLowerCase())
    : null;

  const influencedBy = selected
    ? influenceEdges.filter(([, to]) => to === selected.id).map(([from]) => nodeById[from])
    : [];
  const influences = selected
    ? influenceEdges.filter(([from]) => from === selected.id).map(([, to]) => nodeById[to])
    : [];

  const edgeColor = darkMode ? '#D02C26' : '#B0241E';
  const dimEdgeColor = darkMode ? 'rgba(208,44,38,0.25)' : 'rgba(176,36,30,0.25)';
  const nodeFill = darkMode ? '#D02C26' : '#B0241E';
  const nodeDim = darkMode ? '#6F6C68' : '#B79F6E';
  const labelColor = darkMode ? '#E5DCD0' : '#33291A';

  return (
    <div>
      <h2 className={`text-3xl md:text-4xl font-display uppercase tracking-wide mb-2 ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
        Red de autores
      </h2>
      <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
        {influenceNodes.length} pensadores y {influenceEdges.length} relaciones de influencia. Pasa el cursor para seguir las conexiones; haz clic para ver quién influyó en quién y sus obras.
      </p>

      <div className={`${cardClass} border-2 rounded-lg p-4 shadow-md overflow-x-auto`}>
        <svg
          viewBox="0 -5 100 67"
          className="w-full min-w-[640px]"
          role="img"
          aria-label="Grafo de influencias entre autores anarquistas"
        >
          {influenceEdges.map(([from, to]) => {
            const active = isActiveEdge(from, to);
            return (
              <path
                key={`${from}-${to}`}
                d={edgePath(from, to)}
                fill="none"
                stroke={active ? edgeColor : dimEdgeColor}
                strokeWidth={active ? 0.6 : 0.25}
                opacity={active ? 1 : 0.6}
              />
            );
          })}

          {influenceNodes.map((node) => {
            const y = toSvgY(node.y);
            const active = node.id === selectedId || node.id === hoveredId;
            const dimmed = selectedId && !active && !influencedBy.some((n) => n.id === node.id) && !influences.some((n) => n.id === node.id);
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${y})`}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedId((prev) => (prev === node.id ? null : node.id))}
              >
                <circle
                  r={active ? NODE_R_ACTIVE : NODE_R}
                  fill={dimmed ? nodeDim : nodeFill}
                  opacity={dimmed ? 0.35 : 1}
                />
                <text
                  textAnchor="middle"
                  y={NODE_R_ACTIVE + 2.2}
                  fontSize={node.name.length > 10 ? 2.3 : 2.7}
                  fill={labelColor}
                  fontWeight="600"
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {selected ? (
        <div className={`${cardClass} border-2 rounded-lg p-5 mt-4 shadow-md`}>
          <div className="flex items-start gap-3 mb-3">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-red-600 text-white' : 'bg-amber-700 text-amber-50'}`}>
              <Share2 size={18} />
            </div>
            <div>
              <h3 className={`font-bold text-xl ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {selected.name}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
                {selected.years} · {selected.region}
              </p>
            </div>
          </div>

          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {selected.bio}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {influencedBy.length > 0 && (
              <div>
                <p className={`text-xs uppercase tracking-wide mb-1 ${darkMode ? 'text-gray-500' : 'text-amber-600'}`}>
                  Recibe influencia de
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {influencedBy.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => setSelectedId(n.id)}
                      className={`text-xs px-2 py-1 rounded-full transition-colors ${
                        darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-amber-200 text-amber-900 hover:bg-amber-300'
                      }`}
                    >
                      {n.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {influences.length > 0 && (
              <div>
                <p className={`text-xs uppercase tracking-wide mb-1 ${darkMode ? 'text-gray-500' : 'text-amber-600'}`}>
                  Influye en
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {influences.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => setSelectedId(n.id)}
                      className={`text-xs px-2 py-1 rounded-full transition-colors ${
                        darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-amber-200 text-amber-900 hover:bg-amber-300'
                      }`}
                    >
                      {n.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {selectedAuthor && (
            <div className={`rounded-lg border p-4 ${darkMode ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/80 border-amber-300'}`}>
              <p className={`text-xs uppercase tracking-wide mb-2 ${darkMode ? 'text-gray-500' : 'text-amber-600'}`}>
                Obras en el archivo ({selectedAuthor.bookCount})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedAuthor.books.map((book, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg border px-3 py-2 flex items-center gap-2 ${darkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-white/50 border-amber-200'}`}
                  >
                    <span className={`text-xs ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {book.title}
                    </span>
                    {book.filename && (
                      <button
                        onClick={() => onRead(book)}
                        className={`flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                          darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-700 text-amber-50 hover:bg-amber-800'
                        }`}
                        title={`Leer ${book.title}`}
                      >
                        <BookOpen size={11} />
                        Leer
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className={`text-sm mt-4 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
          Haz clic en cualquier autor del grafo para ver sus conexiones y obras.
        </p>
      )}
    </div>
  );
};

InfluencesView.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  regionData: PropTypes.object.isRequired,
  onRead: PropTypes.func
};

export default InfluencesView;