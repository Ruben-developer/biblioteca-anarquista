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
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Leer favoritos guardados en localStorage
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const toggleFavorite = (title) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(title)
        ? prev.filter(b => b !== title)
        : [...prev, title];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  return { favorites, toggleFavorite };
};
