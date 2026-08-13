import React from 'react';
import { THEME, CATEGORIES } from '../constants';

// Dashboard de métricas del archivo (FASE 2): cabecera de números clave +
// composición por categoría, autores más prolíficos, regiones con más obras y
// distribución por década. Todo se computa en utils/library.js (getArchiveStats)
// desde la fuente única regionData + timelineEvents.
const categoryName = (id) =>
  CATEGORIES.find((c) => c.id === id)?.name || id;

const StatsPanel = ({ darkMode, stats }) => {
  const themeClass = darkMode ? THEME.dark : THEME.light;
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;
  const accent = darkMode ? 'text-red-400' : 'text-amber-800';
  const secondary = darkMode ? 'text-gray-400' : 'text-amber-700';

  const headline = [
    { label: 'Textos', value: stats.texts },
    { label: 'Eventos', value: stats.events },
    { label: 'Regiones', value: stats.regions },
    { label: 'Autores', value: stats.authors }
  ];

  const archive = [
    { label: 'Descargables', value: stats.downloadables },
    { label: 'Sin archivo', value: stats.withoutFile },
    { label: 'Históricos', value: stats.historical },
    { label: 'Ideas', value: stats.ideas }
  ];

  const maxCategory = Math.max(1, ...(stats.categories || []).map((c) => c.count));
  const maxDecade = Math.max(1, ...(stats.byDecade || []).map((d) => d.count));
  const maxRegion = Math.max(1, ...(stats.topRegions || []).map((r) => r.count));

  // El modo oscuro es estado de la app (clases condicionales), no variante
  // `dark:` de Tailwind (que solo seguiría al tema del SO).
  const trackClass = darkMode ? 'bg-gray-700' : 'bg-gray-300';
  const fillClass = darkMode ? 'bg-red-600' : 'bg-amber-700';

  return (
    <div className={`${themeClass.nav} border-b-2`}>
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Números clave */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {headline.map((item) => (
            <div key={item.label} className={`${cardClass} border-2 rounded-lg p-4 text-center`}>
              <div className={`text-3xl font-bold ${accent}`}>{item.value}</div>
              <div className={`text-sm ${secondary}`}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Estado del archivo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {archive.map((item) => (
            <div key={item.label} className={`${cardClass} border rounded-lg p-3 text-center`}>
              <div className={`text-2xl font-bold ${accent}`}>{item.value}</div>
              <div className={`text-xs ${secondary}`}>{item.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Composición por categoría */}
          <section className={`${cardClass} border-2 rounded-lg p-4`}>
            <h3 className={`font-display uppercase tracking-wide text-sm mb-3 ${accent}`}>
              Composición por categoría
            </h3>
            {(!stats.categories || stats.categories.length === 0) ? (
              <p className={`text-sm ${secondary}`}>Sin datos de categorías.</p>
            ) : (
              <ul className="space-y-2">
                {stats.categories.map((c) => (
                  <li key={c.category} className="flex items-center gap-2">
                    <span className={`text-xs w-28 shrink-0 truncate ${secondary}`}>
                      {categoryName(c.category)}
                    </span>
                    <div className={`flex-1 h-4 rounded ${trackClass} overflow-hidden`}>
                      <div
                        className={`h-full rounded ${fillClass}`}
                        style={{ width: `${(c.count / maxCategory) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs w-6 text-right ${accent}`}>{c.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Autores más prolíficos */}
          <section className={`${cardClass} border-2 rounded-lg p-4`}>
            <h3 className={`font-display uppercase tracking-wide text-sm mb-3 ${accent}`}>
              Autores más prolíficos
            </h3>
            {(!stats.topAuthors || stats.topAuthors.length === 0) ? (
              <p className={`text-sm ${secondary}`}>Sin autores registrados.</p>
            ) : (
              <ol className="space-y-2">
                {stats.topAuthors.map((a) => (
                  <li key={a.name} className="flex items-center justify-between gap-2">
                    <span className={`text-sm truncate ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{a.name}</span>
                    <span className={`text-xs shrink-0 ${accent}`}>{a.count} {a.count === 1 ? 'obra' : 'obras'}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {/* Regiones con más obras */}
          <section className={`${cardClass} border-2 rounded-lg p-4`}>
            <h3 className={`font-display uppercase tracking-wide text-sm mb-3 ${accent}`}>
              Regiones con más obras
            </h3>
            {(!stats.topRegions || stats.topRegions.length === 0) ? (
              <p className={`text-sm ${secondary}`}>Sin regiones registradas.</p>
            ) : (
              <ul className="space-y-2">
                {stats.topRegions.map((r) => (
                  <li key={r.region} className="flex items-center gap-2">
                    <span className={`text-xs w-32 shrink-0 truncate ${secondary}`}>{r.region}</span>
                    <div className={`flex-1 h-4 rounded ${trackClass} overflow-hidden`}>
                      <div
                        className={`h-full rounded ${fillClass}`}
                        style={{ width: `${(r.count / maxRegion) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs shrink-0 ${accent}`}>{r.count}</span>
                    <span className={`text-xs shrink-0 w-20 text-right ${secondary}`}>
                      {r.historical > 0 ? `🗺️ ${r.historical}` : '—'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Textos por década */}
          <section className={`${cardClass} border-2 rounded-lg p-4`}>
            <h3 className={`font-display uppercase tracking-wide text-sm mb-3 ${accent}`}>
              Textos por década
            </h3>
            {(!stats.byDecade || stats.byDecade.length === 0) ? (
              <p className={`text-sm ${secondary}`}>Sin obras con año registrado.</p>
            ) : (
              <ul className="space-y-2">
                {stats.byDecade.map((d) => (
                  <li key={d.decade} className="flex items-center gap-2">
                    <span className={`text-xs w-14 shrink-0 ${secondary}`}>{d.decade}</span>
                    <div className={`flex-1 h-4 rounded ${trackClass} overflow-hidden`}>
                      <div
                        className={`h-full rounded ${fillClass}`}
                        style={{ width: `${(d.count / maxDecade) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs w-6 text-right ${accent}`}>{d.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
