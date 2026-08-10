import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import AnarchistArchive from './AnarchistArchive';

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
    fireEvent.click(screen.getByRole('button', { name: /Autores/ }));
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
});
