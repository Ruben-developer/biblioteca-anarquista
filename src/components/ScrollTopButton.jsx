import React from 'react';
import { ArrowUp } from 'lucide-react';
import { THEME } from '../constants';

const ScrollTopButton = ({ darkMode, onClick }) => {
  const themeClass = darkMode ? THEME.dark : THEME.light;

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 p-4 rounded-full ${themeClass.accentBg} ${themeClass.accentBgHover} text-white shadow-lg transition-all z-40`}
      title="Ir al inicio"
      aria-label="Ir al inicio"
    >
      <ArrowUp size={24} />
    </button>
  );
};

export default ScrollTopButton;
