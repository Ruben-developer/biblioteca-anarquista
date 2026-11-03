import React, { useEffect, useRef, useState } from 'react';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { ESTILOS, getEstilo, gruposDeEstilos } from '../styles/estilos';

/**
 * Selector de estilo visual. Un desplegable accesible (teclado + clic fuera)
 * que cambia <html data-estilo>. El estado vive en AnarchistArchive.
 */
const StyleSwitcher = ({ estilo, onChange, darkMode }) => {
  const [open, setOpen] = useState(false);
  const contenedor = useRef(null);
  const actual = getEstilo(estilo);
  const grupos = gruposDeEstilos();

  // Cerrar al hacer clic fuera o con Escape.
  useEffect(() => {
    if (!open) return undefined;
    const alClic = (e) => {
      if (contenedor.current && !contenedor.current.contains(e.target)) setOpen(false);
    };
    const alTecla = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', alClic);
    document.addEventListener('keydown', alTecla);
    return () => {
      document.removeEventListener('mousedown', alClic);
      document.removeEventListener('keydown', alTecla);
    };
  }, [open]);

  const elegir = (id) => {
    onChange(id);
    setOpen(false);
  };

  const boton = darkMode
    ? 'bg-black/60 hover:bg-black/80 text-gray-200'
    : 'bg-amber-200 hover:bg-amber-300 text-amber-900';

  return (
    <div className="relative" ref={contenedor}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Estilo visual: ${actual.nombre}`}
        title={`Estilo visual: ${actual.nombre}`}
        className={`flex items-center gap-2 px-2 md:px-3 py-2 md:py-3 rounded-lg transition-colors ${boton}`}
      >
        <Palette size={20} />
        <span className="hidden lg:inline font-sans text-sm font-semibold">{actual.nombre}</span>
        <ChevronDown size={16} className={`hidden lg:inline transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Elegir estilo visual"
          className={`absolute right-0 mt-2 w-80 max-h-[85vh] overflow-y-auto z-30 rounded-lg border-2 shadow-lg p-2 ${
            darkMode ? 'bg-gray-900 border-accent/50 text-gray-100' : 'bg-paper border-line text-amber-900'
          }`}
        >
          {grupos.map((grupo) => (
            <div key={grupo.nombre} role="group" aria-label={grupo.nombre}>
              <p className={`px-2 pt-2 pb-1 text-[10px] font-mono uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-amber-700'}`}>
                {grupo.nombre}
              </p>
              {grupo.estilos.map((e) => {
                const activo = e.id === actual.id;
                return (
                  <button
                    key={e.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={activo}
                    onClick={() => elegir(e.id)}
                    className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-left transition-colors ${
                      activo
                        ? darkMode ? 'bg-white/10' : 'bg-amber-100'
                        : darkMode ? 'hover:bg-white/5' : 'hover:bg-amber-100/60'
                    }`}
                  >
                    <span className="flex shrink-0 rounded-sm overflow-hidden border border-current/20" aria-hidden="true">
                      {e.muestra.map((c) => (
                        <span key={c} className="block w-3 h-6" style={{ backgroundColor: c }} />
                      ))}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold leading-tight">{e.nombre}</span>
                      <span className={`block text-[11px] leading-tight ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
                        {e.nota}
                      </span>
                    </span>
                    {activo && <Check size={16} className="shrink-0" />}
                  </button>
                );
              })}
            </div>
          ))}
          <p className={`px-2 pt-2 pb-1 text-[10px] leading-tight ${darkMode ? 'text-gray-500' : 'text-amber-700'}`}>
            {ESTILOS.length} estilos · se guarda tu elección
          </p>
        </div>
      )}
    </div>
  );
};

export default StyleSwitcher;
