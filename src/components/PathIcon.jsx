import React from 'react';

// Iconos de las rutas de lectura (ReadingPathsView). Las banderas se dibujan
// como SVG inline para que se vean IGUALES en todos los navegadores/dispositivos:
// los emoji de bandera (🇪🇸, 🇺🇦) se renderizan como letras "ES"/"UA" en
// Windows/Chrome, así que se sustituyen por banderas estáticas dibujadas.
//
// Las rutas sin bandera siguen usando su emoji original (🧭 ✊ 🌎 ⚖️ 🌱 ⭐ 🔥 📖),
// que son glifos de símbolos y sí se ven iguales en todas las plataformas.

const FLAGS = {
  // Bandera de España: 3 franjas horizontales (rojo, amarillo, rojo) 1:2:1.
  espana: (
    <svg viewBox="0 0 24 24" className="inline-block w-6 h-6" aria-hidden="true">
      <rect width="24" height="6" fill="#aa151b" />
      <rect y="6" width="24" height="12" fill="#f1bf00" />
      <rect y="18" width="24" height="6" fill="#aa151b" />
    </svg>
  ),
  // Bandera de Ucrania: 2 franjas horizontales (azul cielo, amarillo) 1:1.
  'rusia-ucrania': (
    <svg viewBox="0 0 24 24" className="inline-block w-6 h-6" aria-hidden="true">
      <rect width="24" height="12" fill="#0057b7" />
      <rect y="12" width="24" height="12" fill="#ffd700" />
    </svg>
  )
};

const PathIcon = ({ id, icon }) => {
  const flag = FLAGS[id];
  if (flag) return flag;
  return <span aria-hidden="true">{icon}</span>;
};

export default PathIcon;