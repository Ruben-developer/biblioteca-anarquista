import React from 'react'
import { THEME, CATEGORIES } from '../constants'

const categoryName = (id) =>
  CATEGORIES.find((c) => c.id === id)?.name || id

const BarSection = ({ title, items, keyField, maxCount, labelFn, secondary, accent, cardClass, trackClass, fillClass, countLabelFn, emptyMessage }) => (
  <section className={`${cardClass} border-2 rounded-lg p-4`}>
    <h3 className={`font-display uppercase tracking-wide text-sm mb-3 ${accent}`}>
      {title}
    </h3>
    {(!items || items.length === 0) ? (
      <p className={`text-sm ${secondary}`}>{emptyMessage}</p>
    ) : (
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item[keyField]} className="flex items-center gap-2">
            <span className={`text-xs w-32 shrink-0 truncate ${secondary}`}>
              {labelFn(item)}
            </span>
            <div className={`flex-1 h-4 rounded ${trackClass} overflow-hidden`}>
              <div
                className={`h-full rounded ${fillClass}`}
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              />
            </div>
            <span className={`text-xs shrink-0 ${accent}`}>{item.count}</span>
            {countLabelFn && (
              <span className={`text-xs shrink-0 w-20 text-right ${secondary}`}>
                {countLabelFn(item)}
              </span>
            )}
          </li>
        ))}
      </ul>
    )}
  </section>
)

const TopAuthorsSection = ({ authors, darkMode, accent, secondary, cardClass }) => (
  <section className={`${cardClass} border-2 rounded-lg p-4`}>
    <h3 className={`font-display uppercase tracking-wide text-sm mb-3 ${accent}`}>
      Autores más prolíficos
    </h3>
    {(!authors || authors.length === 0) ? (
      <p className={`text-sm ${secondary}`}>Sin autores registrados.</p>
    ) : (
      <ol className="space-y-2">
        {authors.map((a) => (
          <li key={a.name} className="flex items-center justify-between gap-2">
            <span className={`text-sm truncate ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{a.name}</span>
            <span className={`text-xs shrink-0 ${accent}`}>{a.count} {a.count === 1 ? 'obra' : 'obras'}</span>
          </li>
        ))}
      </ol>
    )}
  </section>
)

const StatsPanel = ({ darkMode, stats }) => {
  const themeClass = darkMode ? THEME.dark : THEME.light
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card
  const accent = darkMode ? 'text-red-400' : 'text-amber-800'
  const secondary = darkMode ? 'text-gray-400' : 'text-amber-700'

  const headline = [
    { label: 'Textos', value: stats.texts },
    { label: 'Eventos', value: stats.events },
    { label: 'Regiones', value: stats.regions },
    { label: 'Autores', value: stats.authors }
  ]

  const archive = [
    { label: 'Descargables', value: stats.downloadables },
    { label: 'Sin archivo', value: stats.withoutFile },
    { label: 'Históricos', value: stats.historical },
    { label: 'Ideas', value: stats.ideas },
    { label: 'Pendientes (otros)', value: stats.pending || 0 }
  ]

  const maxCategory = Math.max(1, ...(stats.categories || []).map((c) => c.count))
  const maxDecade = Math.max(1, ...(stats.byDecade || []).map((d) => d.count))
  const maxRegion = Math.max(1, ...(stats.topRegions || []).map((r) => r.count))

  const trackClass = darkMode ? 'bg-gray-700' : 'bg-gray-300'
  const fillClass = darkMode ? 'bg-red-600' : 'bg-amber-700'

  return (
    <div className={`${themeClass.nav} border-b-2`}>
      <div className="container mx-auto px-4 py-6 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {headline.map((item) => (
            <div key={item.label} className={`${cardClass} border-2 rounded-lg p-4 text-center`}>
              <div className={`text-3xl font-bold ${accent}`}>{item.value}</div>
              <div className={`text-sm ${secondary}`}>{item.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {archive.map((item) => (
            <div key={item.label} className={`${cardClass} border-2 rounded-lg p-4 text-center`}>
              <div className={`text-2xl font-bold ${accent}`}>{item.value}</div>
              <div className={`text-xs ${secondary}`}>{item.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <BarSection
            title="Composición por categoría"
            items={stats.categories}
            keyField="category"
            maxCount={maxCategory}
            labelFn={(c) => categoryName(c.category)}
            secondary={secondary}
            accent={accent}
            cardClass={cardClass}
            trackClass={trackClass}
            fillClass={fillClass}
            emptyMessage="Sin datos de categorías."
          />

          <TopAuthorsSection
            authors={stats.topAuthors}
            darkMode={darkMode}
            accent={accent}
            secondary={secondary}
            cardClass={cardClass}
          />

          <BarSection
            title="Regiones con más obras"
            items={stats.topRegions}
            keyField="region"
            maxCount={maxRegion}
            labelFn={(r) => r.region}
            secondary={secondary}
            accent={accent}
            cardClass={cardClass}
            trackClass={trackClass}
            fillClass={fillClass}
            countLabelFn={(r) => r.historical > 0 ? `${r.historical}` : '—'}
            emptyMessage="Sin regiones registradas."
          />

          <BarSection
            title="Textos por década"
            items={stats.byDecade}
            keyField="decade"
            maxCount={maxDecade}
            labelFn={(d) => d.decade}
            secondary={secondary}
            accent={accent}
            cardClass={cardClass}
            trackClass={trackClass}
            fillClass={fillClass}
            emptyMessage="Sin obras con año registrado."
          />
        </div>
      </div>
    </div>
  )
}

export default StatsPanel
