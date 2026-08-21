// src/hooks/index.test.js
// Tests de los hooks personalizados (useScrollTop, useDarkMode, useFavorites).
// Se renderizan con un componente sonda en SSR (renderToStaticMarkup).
// Como en SSR React no reprocesa los updates de estado (los updaters funcionales
// de los hooks —donde se escribe en localStorage— no se ejecutarían), se mockea
// useState con un setter que invoca el updater al instante para poder verificar
// la persistencia.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useScrollTop, useDarkMode, useFavorites } from './index.js';

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // setter con invocación inmediata del updater funcional
    useState: (initialValue) => {
      let value = initialValue;
      const setValue = (newValue) => {
        value = typeof newValue === 'function' ? newValue(value) : newValue;
        return value;
      };
      return [value, setValue];
    }
  };
});

let storage = {};
globalThis.localStorage = {
  getItem: (k) => (k in storage ? storage[k] : null),
  setItem: (k, v) => {
    storage[k] = String(v);
  },
  removeItem: (k) => {
    delete storage[k];
  },
  clear: () => {
    storage = {};
  }
};

const renderHook = (useHook) => {
  let captured;
  const Probe = () => {
    captured = useHook();
    return null;
  };
  renderToStaticMarkup(React.createElement(Probe));
  return captured;
};

beforeEach(() => {
  storage = {};
  vi.clearAllMocks();
});

describe('useScrollTop', () => {
  it('empieza con showScrollTop false', () => {
    globalThis.window = {
      scrollY: 0,
      scrollTo: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    };
    const { showScrollTop } = renderHook(useScrollTop);
    expect(showScrollTop).toBe(false);
  });

  it('scrollToTop hace scroll suave al inicio', () => {
    const scrollTo = vi.fn();
    globalThis.window = {
      scrollY: 500,
      scrollTo,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    };
    const { scrollToTop } = renderHook(useScrollTop);
    scrollToTop();
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});

describe('useDarkMode', () => {
  it('empieza en modo claro', () => {
    const { darkMode } = renderHook(useDarkMode);
    expect(darkMode).toBe(false);
  });

  it('toggleDarkMode persiste el nuevo valor en localStorage', () => {
    const { toggleDarkMode } = renderHook(useDarkMode);
    toggleDarkMode();
    expect(localStorage.getItem('darkMode')).toBe('true');
  });
});

describe('useFavorites', () => {
  it('empieza sin favoritos', () => {
    const { favorites } = renderHook(useFavorites);
    expect(favorites).toEqual([]);
  });

  it('toggleFavorite añade una obra a favoritos en localStorage', () => {
    const { toggleFavorite } = renderHook(useFavorites);
    toggleFavorite('La Conquista del Pan');
    const stored = JSON.parse(localStorage.getItem('favorites'));
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe('La Conquista del Pan');
  });
});
