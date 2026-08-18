import React from 'react';
import {
  Compass, Globe, Scale, Leaf, Star, Flame, BookOpen, HeartHandshake
} from 'lucide-react';

// Iconos de las rutas de lectura (ReadingPathsView). Se dibujan TODOS como
// SVG (banderas inline propias o iconos lucide-react) para que se vean IGUALES
// en todos los navegadores/dispositivos:
//  - Los emoji de bandera (🇪🇸, 🇺🇦) se renderizaban como letras "ES"/"UA" en
//    Windows/Chrome, así que se sustituyen por banderas estáticas dibujadas.
//  - Los emoji de símbolos (🧭 ✊ 🌎 ⚖️ 🌱 ⭐ 🔥 📖) se ven como "emoticonos"
//    y varían según la plataforma; se sustituyen por iconos SVG de lucide.
//
// El campo `icon` de cada ruta es un nombre: 'compass', 'flag-espana', etc.

const FLAGS = {
  // Bandera de España: 3 franjas horizontales (rojo, amarillo, rojo) 1:2:1.
  'flag-espana': (
    <svg viewBox="0 0 24 24" className="inline-block w-6 h-6" aria-hidden="true">
      <rect width="24" height="6" fill="#aa151b" />
      <rect y="6" width="24" height="12" fill="#f1bf00" />
      <rect y="18" width="24" height="6" fill="#aa151b" />
    </svg>
  ),
  // Bandera de Ucrania: 2 franjas horizontales (azul cielo, amarillo) 1:1.
  'flag-ucrania': (
    <svg viewBox="0 0 24 24" className="inline-block w-6 h-6" aria-hidden="true">
      <rect width="24" height="12" fill="#0057b7" />
      <rect y="12" width="24" height="12" fill="#ffd700" />
    </svg>
  )
};

const SYMBOLS = {
  compass: Compass,
  globe: Globe,
  scale: Scale,
  leaf: Leaf,
  star: Star,
  flame: Flame,
  'book-open': BookOpen,
  'heart-handshake': HeartHandshake
};

const PathIcon = ({ icon }) => {
  const flag = FLAGS[icon];
  if (flag) return flag;
  const Symbol = SYMBOLS[icon];
  if (Symbol) return <Symbol size={22} strokeWidth={2} className="inline-block" aria-hidden="true" />;
  // Fallback: si el dato no es un nombre conocido, se muestra tal cual.
  return <span aria-hidden="true">{icon}</span>;
};

export default PathIcon;