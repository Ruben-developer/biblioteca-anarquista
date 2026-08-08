import { useState } from 'react'
import './App.css'

export interface Obra {
  slug: string
  titulo: string
  autor: string
  anio: number
  temas: string[]
  tags: string[]
  descripcion: string
  contenido: string
}

import laConquista from '../data/catalogo/la-conquista-del-pan.json'
import diosEstado from '../data/catalogo/dios-y-el-estado.json'
import anarquismo from '../data/catalogo/anarquismo-y-otros-ensayos.json'

const OBRAS: Obra[] = [
  laConquista as Obra,
  diosEstado as Obra,
  anarquismo as Obra,
]

function App() {
  const [query, setQuery] = useState('')
  const [tema, setTema] = useState<string>('todos')
  const [seleccion, setSeleccion] = useState<Obra | null>(null)

  const temas = Array.from(new Set(OBRAS.flatMap((o) => o.temas))).sort()

  const filtradas = OBRAS.filter((o) => {
    const q = query.trim().toLowerCase()
    const matchQuery =
      !q ||
      o.titulo.toLowerCase().includes(q) ||
      o.autor.toLowerCase().includes(q) ||
      o.temas.some((t) => t.toLowerCase().includes(q)) ||
      o.tags.some((t) => t.toLowerCase().includes(q))
    const matchTema = tema === 'todos' || o.temas.includes(tema)
    return matchQuery && matchTema
  })

  if (seleccion) {
    return (
      <div className="lector">
        <button className="volver" onClick={() => setSeleccion(null)}>
          ← Volver al catálogo
        </button>
        <h1>{seleccion.titulo}</h1>
        <p className="meta">
          {seleccion.autor} · {seleccion.anio}
        </p>
        <p className="tags">
          {[...seleccion.temas, ...seleccion.tags].map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </p>
        <article
          className="contenido"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(seleccion.contenido) }}
        />
      </div>
    )
  }

  return (
    <div className="app">
      <header>
        <h1>Biblioteca Anarquista</h1>
        <p className="sub">Catálogo digital de obras y textos anarquistas</p>
      </header>

      <div className="controles">
        <input
          className="busqueda"
          placeholder="Buscar por título, autor o tema…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={tema} onChange={(e) => setTema(e.target.value)}>
          <option value="todos">Todos los temas</option>
          {temas.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <p className="contador">
        {filtradas.length} {filtradas.length === 1 ? 'obra' : 'obras'}
      </p>

      <div className="grid">
        {filtradas.map((o) => (
          <button key={o.slug} className="tarjeta" onClick={() => setSeleccion(o)}>
            <h2>{o.titulo}</h2>
            <p className="meta">
              {o.autor} · {o.anio}
            </p>
            <p className="descripcion">{o.descripcion}</p>
            <p className="tags">
              {[...o.temas, ...o.tags].map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </p>
          </button>
        ))}
      </div>

      {filtradas.length === 0 && (
        <p className="vacio">Sin resultados para «{query}».</p>
      )}
    </div>
  )
}

function renderMarkdown(md: string): string {
  const escaped = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return escaped
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^«(.*?)»$/gm, '<blockquote>«$1»</blockquote>')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, ' ')
}

export default App
