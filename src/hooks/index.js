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

/**
 * Hook personalizado para manejar favoritos
 * Soporta dos formatos: strings legacy (títulos) y objetos enriquecidos:
 * { title, author, year, filename, category, note, addedAt }
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrar strings legacy a objetos enriquecidos
      const migrated = parsed.map((f) =>
        typeof f === 'string' ? { title: f, note: '', addedAt: Date.now() } : f
      );
      setFavorites(migrated);
    }
  }, []);

  // Toggle: si el título ya está, lo quita; si no, lo agrega con metadata vacía
  const toggleFavorite = (title, bookMeta = {}) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.title === title);
      const newFavorites = exists
        ? prev.filter(f => f.title !== title)
        : [...prev, {
            title,
            author: bookMeta.author || '',
            year: bookMeta.year || null,
            filename: bookMeta.filename || '',
            category: bookMeta.category || '',
            note: '',
            addedAt: Date.now()
          }];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  // Actualizar la nota personal de un favorito
  const updateFavoriteNote = (title, note) => {
    setFavorites(prev => {
      const updated = prev.map(f =>
        f.title === title ? { ...f, note } : f
      );
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Verificar si un título es favorito
  const isFavorite = (title) => favorites.some(f => f.title === title);

  // Exportar favoritos como texto plano
  const exportFavorites = () => {
    return favorites.map((f, i) => {
      const parts = [`${i + 1}. ${f.title}`];
      if (f.author) parts.push(`   Autor: ${f.author}`);
      if (f.year) parts.push(`   Año: ${f.year}`);
      if (f.note) parts.push(`   Nota: ${f.note}`);
      return parts.join('\n');
    }).join('\n\n');
  };

  return { favorites, toggleFavorite, updateFavoriteNote, isFavorite, exportFavorites };
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
