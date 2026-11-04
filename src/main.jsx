import React from 'react'
import ReactDOM from 'react-dom/client'
import AnarchistArchive from './components/AnarchistArchive'
import './index.css'
// Tokens de los estilos visuales (color, forma, tipografía). Va después de
// index.css para que sus variables manden sobre los valores por defecto.
import './estilos.css'
import './estilos-extra.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AnarchistArchive />
  </React.StrictMode>,
)
