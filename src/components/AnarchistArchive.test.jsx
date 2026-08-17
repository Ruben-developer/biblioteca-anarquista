import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { cleanup } from '@testing-library/react';
import AnarchistArchive from './AnarchistArchive';

afterEach(cleanup);

describe('AnarchistArchive', () => {
  it('renderiza la app completa con cabecera, navegación y vista por defecto (línea temporal)', () => {
    const html = renderToStaticMarkup(<AnarchistArchive />);
    expect(html).toContain('Archivo Histórico Anarquista');
    expect(html).toContain('Línea Temporal');
    expect(html).toContain('Mapa');
    expect(html).toContain('Biblioteca');
    expect(html).toContain('Autores');
    expect(html).toContain('Favoritos');
  });

  it('muestra eventos de la línea temporal en la vista inicial', () => {
    const html = renderToStaticMarkup(<AnarchistArchive />);
    expect(html).toContain('Buscar eventos');
  });
});

describe('AnarchistArchive interactivo (jsdom)', () => {
  // @vitest-environment jsdom
  it('navega a la vista Mapa al hacer clic en la navegación', async () => {
    const { render, screen, fireEvent } = await import('@testing-library/react');
    const { container } = render(<AnarchistArchive />);
    fireEvent.click(screen.getByRole('button', { name: /Mapa/ }));
    expect(screen.getByText('Mapa Mundial de Textos')).toBeTruthy();
    container.remove();
  });

  it('navega a la vista Autores y a Favoritos vacío', async () => {
    const { render, screen, fireEvent } = await import('@testing-library/react');
    const { container } = render(<AnarchistArchive />);
    fireEvent.click(screen.getByRole('button', { name: 'Autores' }));
    expect(screen.getByText('Autores del Archivo')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Favoritos/ }));
    expect(screen.getByText('Mis Favoritos')).toBeTruthy();
    expect(screen.getByText('Aún no has guardado ningún texto favorito')).toBeTruthy();
    container.remove();
  });

  it('abre las estadísticas desde la cabecera', async () => {
    const { render, screen, fireEvent } = await import('@testing-library/react');
    const { container } = render(<AnarchistArchive />);
    fireEvent.click(screen.getAllByTitle('Mostrar estadísticas')[0]);
    expect(screen.getByText('Eventos')).toBeTruthy();
    container.remove();
  });

  it('abre el modal de región al hacer clic en una región del mapa', async () => {
    const { render, screen, fireEvent } = await import('@testing-library/react');
    const { container } = render(<AnarchistArchive />);
    fireEvent.click(screen.getByRole('button', { name: /Mapa/ }));
    // Botón de navegación por región debajo del mapamundi
    const espana = screen.getAllByText('España').find((el) => el.closest('button'));
    fireEvent.click(espana);
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText(/textos históricos del anarquismo en España/)).toBeTruthy();
    container.remove();
  });

  it('aplica el fondo de modo oscuro si está guardado en localStorage', async () => {
    const { render } = await import('@testing-library/react');
    localStorage.setItem('darkMode', 'true');
    const { container } = render(<AnarchistArchive />);
    expect(container.innerHTML).toContain('bg-gradient-to-br from-red-950');
    container.remove();
    localStorage.removeItem('darkMode');
  });

  it('muestra el botón "Ir al inicio" al hacer scroll', async () => {
    const { render, screen, act } = await import('@testing-library/react');
    const { container } = render(<AnarchistArchive />);
    // jsdom no actualiza window.scrollY con scroll real → simulamos con getter
    let scrollY = 500;
    const original = Object.getOwnPropertyDescriptor(window, 'scrollY');
    Object.defineProperty(window, 'scrollY', { get: () => scrollY, configurable: true });
    await act(async () => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(screen.getByTitle('Ir al inicio')).toBeTruthy();
    scrollY = 0;
    await act(async () => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(screen.queryByTitle('Ir al inicio')).toBeNull();
    if (original) Object.defineProperty(window, 'scrollY', original);
    container.remove();
  });
});
