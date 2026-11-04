// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup, renderHook, act } from '@testing-library/react';
import StyleSwitcher from './StyleSwitcher';
import { ESTILOS, ESTILO_KEY, aplicarEstilo, getEstilo } from '../styles/estilos';
import { useEstilo } from '../hooks';

afterEach(() => {
  cleanup();
  localStorage.clear();
  delete document.documentElement.dataset.estilo;
});

describe('StyleSwitcher', () => {
  it('muestra el estilo activo y no abre el menú hasta pulsar', () => {
    render(<StyleSwitcher estilo="clasico" onChange={() => {}} darkMode={false} />);
    const boton = screen.getByRole('button', { name: /estilo visual/i });
    expect(boton.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('abre el desplegable con todas las opciones y marca la activa', () => {
    render(<StyleSwitcher estilo="collage-vino" onChange={() => {}} darkMode={false} />);
    fireEvent.click(screen.getByRole('button', { name: /estilo visual/i }));

    expect(screen.getByRole('menu')).toBeTruthy();
    const opciones = screen.getAllByRole('menuitemradio');
    expect(opciones).toHaveLength(ESTILOS.length);

    const activa = opciones.find((o) => o.getAttribute('aria-checked') === 'true');
    expect(activa.textContent).toContain('Collage Vino');
  });

  it('al elegir un estilo avisa al padre y cierra el menú', () => {
    const onChange = vi.fn();
    render(<StyleSwitcher estilo="clasico" onChange={onChange} darkMode={false} />);
    fireEvent.click(screen.getByRole('button', { name: /estilo visual/i }));

    const opcion = screen
      .getAllByRole('menuitemradio')
      .find((o) => o.textContent.includes('Collage Vino'));
    fireEvent.click(opcion);
    expect(onChange).toHaveBeenCalledWith('collage-vino');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('se cierra con Escape', () => {
    render(<StyleSwitcher estilo="clasico" onChange={() => {}} darkMode={false} />);
    fireEvent.click(screen.getByRole('button', { name: /estilo visual/i }));
    expect(screen.getByRole('menu')).toBeTruthy();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
  });
});

describe('estilos: metadatos y aplicación', () => {
  it('todo estilo tiene id, nombre, nota y tres colores de muestra', () => {
    ESTILOS.forEach((e) => {
      expect(e.id).toBeTruthy();
      expect(e.nombre).toBeTruthy();
      expect(e.nota).toBeTruthy();
      expect(e.muestra).toHaveLength(3);
    });
  });

  it('aplicarEstilo escribe data-estilo y cae al primero si el id no existe', () => {
    aplicarEstilo('collage-vino');
    expect(document.documentElement.dataset.estilo).toBe('collage-vino');

    aplicarEstilo('no-existe');
    expect(document.documentElement.dataset.estilo).toBe(ESTILOS[0].id);
  });

  it('getEstilo devuelve el clásico cuando no encuentra el id', () => {
    expect(getEstilo('inventado').id).toBe('clasico');
  });

  it('la clave de persistencia está versionada', () => {
    expect(ESTILO_KEY).toBe('laidea_estilo_v1');
  });
});

describe('useEstilo', () => {
  it('arranca desde localStorage', () => {
    localStorage.setItem(ESTILO_KEY, 'collage-vino');
    const { result } = renderHook(() => useEstilo());
    expect(result.current.estilo).toBe('collage-vino');
  });

  it('un ?estilo= válido manda sobre lo guardado y no se persiste', () => {
    localStorage.setItem(ESTILO_KEY, 'clasico');
    window.history.replaceState(null, '', '/?estilo=collage-vino');

    const { result } = renderHook(() => useEstilo());
    expect(result.current.estilo).toBe('collage-vino');
    expect(localStorage.getItem(ESTILO_KEY)).toBe('clasico');

    window.history.replaceState(null, '', '/');
  });

  it('ignora un ?estilo= inventado', () => {
    window.history.replaceState(null, '', '/?estilo=neon');
    const { result } = renderHook(() => useEstilo());
    expect(result.current.estilo).toBe('clasico');
    window.history.replaceState(null, '', '/');
  });

  it('al cambiar desde la UI aplica el atributo y persiste', () => {
    const { result } = renderHook(() => useEstilo());
    act(() => result.current.setEstilo('collage-vino'));

    expect(document.documentElement.dataset.estilo).toBe('collage-vino');
    expect(localStorage.getItem(ESTILO_KEY)).toBe('collage-vino');
  });
});
