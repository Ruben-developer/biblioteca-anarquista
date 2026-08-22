import { useState, useEffect } from 'react';

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
