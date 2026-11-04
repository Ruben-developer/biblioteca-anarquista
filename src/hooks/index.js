import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook personalizado para manejar el desplazamiento y mostrar botón "ir arriba"
 */
export const useScrollTop = (threshold = 300) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > threshold);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { showScrollTop, scrollToTop };
};

/**
 * Hook personalizado para manejar modo oscuro
 */
export const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Leer preferencia guardada en localStorage si existe
    const saved = localStorage.getItem('darkMode');
    if (saved) {
      setDarkMode(JSON.parse(saved));
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('darkMode', JSON.stringify(newValue));
      return newValue;
    });
  };

  return { darkMode, toggleDarkMode };
};

function makeId(title, author) {
  const raw = `${(title || '').trim().toLowerCase()}|${(author || '').trim().toLowerCase()}`;
  let h = 0;
  for (let i = 0; i < raw.length; i++) { h = ((h << 5) - h + raw.charCodeAt(i)) | 0; }
  return Math.abs(h).toString(36).padStart(8, '0').slice(0, 12);
}
function makeNoteId() { return 'n' + Math.random().toString(36).slice(2, 10); }

/**
 * Hook personalizado para manejar favoritos
 * Formato: { id, title, author, year, filename, category, notes: [{id,text,ts}], addedAt }
 * Migra automáticamente `note` (string legacy) → `notes[]`
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      const parsed = JSON.parse(saved);
      const migrated = parsed.map((f) => {
        if (typeof f === 'string') return { id: makeId(f, ''), title: f, author: '', year: null, filename: '', category: '', notes: [], addedAt: Date.now() };
        const notes = Array.isArray(f.notes) ? f.notes : (f.note ? [{ id: makeNoteId(), text: f.note, ts: new Date().toISOString() }] : []);
        return { id: f.id || makeId(f.title, f.author || ''), title: f.title, author: f.author || '', year: f.year ?? null, filename: f.filename || '', category: f.category || '', notes, addedAt: f.addedAt || Date.now() };
      });
      setFavorites(migrated);
    }
  }, []);

  const persist = (next) => localStorage.setItem('favorites', JSON.stringify(next));

  const toggleFavorite = (title, bookMeta = {}) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.title === title);
      const next = exists
        ? prev.filter(f => f.title !== title)
        : [...prev, { id: makeId(title, bookMeta.author || ''), title, author: bookMeta.author || '', year: bookMeta.year || null, filename: bookMeta.filename || '', category: bookMeta.category || '', notes: [], addedAt: Date.now() }];
      persist(next);
      return next;
    });
  };

  const addFavoriteNote = (title, text) => {
    const t = text.trim();
    if (!t) return;
    setFavorites(prev => {
      const next = prev.map(f => f.title === title ? { ...f, notes: [...(f.notes || []), { id: makeNoteId(), text: t, ts: new Date().toISOString() }] } : f);
      persist(next);
      return next;
    });
  };

  const deleteFavoriteNote = (title, noteId) => {
    setFavorites(prev => {
      const next = prev.map(f => f.title === title ? { ...f, notes: (f.notes || []).filter(n => n.id !== noteId) } : f);
      persist(next);
      return next;
    });
  };

  // Compat: mantiene updateFavoriteNote para tests viejos
  const updateFavoriteNote = (title, note) => {
    setFavorites(prev => {
      const next = prev.map(f => f.title === title ? { ...f, notes: note ? [{ id: makeNoteId(), text: note, ts: new Date().toISOString() }] : [] } : f);
      persist(next);
      return next;
    });
  };

  const isFavorite = (title) => favorites.some(f => f.title === title);

  // Exporta id, title, author, filename, notes (preserva Leer)
  const exportFavorites = () => JSON.stringify(favorites.map(f => ({ id: f.id || makeId(f.title, f.author), title: f.title, author: f.author || '', year: f.year ?? null, filename: f.filename || '', category: f.category || '', notes: f.notes || [] })), null, 2);

  const importFavorites = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) return { ok: false, error: 'El archivo no es una lista válida.' };
      const cleaned = parsed.filter(f => f && (typeof f === 'string' || f.title)).map(f => {
        if (typeof f === 'string') return { id: makeId(f, ''), title: f, author: '', year: null, filename: '', category: '', notes: [], addedAt: Date.now() };
        const notes = Array.isArray(f.notes) ? f.notes : (f.note ? [{ id: makeNoteId(), text: f.note, ts: new Date().toISOString() }] : []);
        return { id: f.id || makeId(f.title, f.author || ''), title: f.title, author: f.author || '', year: f.year ?? null, filename: f.filename || '', category: f.category || '', notes, addedAt: f.addedAt || Date.now() };
      });
      // Merge: preserva filename si el import no lo trae, y fusiona notas
      let next;
      setFavorites(prev => {
        const map = new Map(prev.map(f => [f.title, f]));
        for (const c of cleaned) {
          const existing = map.get(c.title);
          if (existing) {
            const ids = new Set((existing.notes || []).map(n => n.id));
            const newNotes = (c.notes || []).filter(n => !ids.has(n.id));
            const filename = c.filename || existing.filename || '';
            map.set(c.title, { ...existing, ...c, filename, notes: [...(existing.notes || []), ...newNotes] });
          } else {
            map.set(c.title, c);
          }
        }
        next = [...map.values()];
        persist(next);
        return next;
      });
      return { ok: true, count: cleaned.length };
    } catch {
      return { ok: false, error: 'No se pudo leer el archivo.' };
    }
  };

  return { favorites, toggleFavorite, addFavoriteNote, deleteFavoriteNote, updateFavoriteNote, isFavorite, exportFavorites, importFavorites };
};

/**
 * Hook para trampa de foco en modales (dialog).
 * - Guarda el elemento activo al abrir y lo restaura al cerrar.
 * - Bloquea Tab dentro del modal (focus trap).
 * - Bloquea scroll del fondo mientras está abierto.
 * - Escape cierra el modal.
 * - Devuelve ref que debe colocarse en el <dialog>.
 */
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const useModalFocus = (onClose) => {
  const dialogRef = useRef(null);
  const previousFocus = useRef(null);

  const getFocusableElements = useCallback(() => {
    if (!dialogRef.current) return [];
    return Array.from(dialogRef.current.querySelectorAll(FOCUSABLE));
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Save previously focused element
    previousFocus.current = document.activeElement;

    // Block body scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus first focusable element (or the dialog itself)
    const focusFirst = () => {
      const elements = getFocusableElements();
      if (elements.length > 0) {
        elements[0].focus();
      } else {
        dialog.focus();
      }
    };
    // Use requestAnimationFrame to ensure the dialog is rendered
    requestAnimationFrame(focusFirst);

    // Handle keydown: Escape + focus trap
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const elements = getFocusableElements();
      if (elements.length === 0) {
        e.preventDefault();
        return;
      }
      const first = elements[0];
      const last = elements[elements.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: si estamos en el primero, ir al último
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: si estamos en el último, ir al primero
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    dialog.addEventListener('keydown', handleKeyDown);

    return () => {
      dialog.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      // Restore focus
      if (previousFocus.current && typeof previousFocus.current.focus === 'function') {
        previousFocus.current.focus();
      }
    };
  }, [onClose, getFocusableElements]);

  return dialogRef;
};

/**
 * Hook para consultar una media query (CSS) y reaccionar a cambios.
 * Útil para adaptar la UI entre escritorio y móvil.
 */
export const useMediaQuery = (query) => {
  const getMatch = () => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    return window.matchMedia(query).matches;
  };
  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    setMatches(mql.matches);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

/**
 * Devuelve true en pantallas pequeñas (móvil).
 * Se usa para mostrar la línea temporal como feed en smartphone.
 */
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
