import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import ContactView, { buildMailtoUrl, CONTACT_EMAIL } from './ContactView';

afterEach(cleanup);

describe('buildMailtoUrl', () => {
  it('dirige a antarquia@riseup.net con asunto y cuerpo codificados', () => {
    const url = buildMailtoUrl({
      name: 'Pantera',
      email: 'pantera@riseup.net',
      message: 'Quiero aportar un texto.'
    });
    expect(url.startsWith(`mailto:${CONTACT_EMAIL}?subject=`)).toBe(true);
    expect(url).toContain(encodeURIComponent('Contacto desde Antarquia — Pantera'));
    expect(url).toContain(encodeURIComponent('Nombre/apodo: Pantera'));
    expect(url).toContain(encodeURIComponent('Correo de contacto: pantera@riseup.net'));
    expect(url).toContain(encodeURIComponent('Quiero aportar un texto.'));
  });

  it('tolera campos vacíos y mensajes con saltos de línea', () => {
    const url = buildMailtoUrl({ name: '', email: '', message: 'Línea 1\nLínea 2' });
    expect(url.startsWith(`mailto:${CONTACT_EMAIL}?`)).toBe(true);
    expect(url).toContain(encodeURIComponent('Línea 1\nLínea 2'));
  });
});

describe('ContactView', () => {
  it('renderiza el formulario con apodo, correo y mensaje', () => {
    const html = renderToStaticMarkup(<ContactView darkMode={false} />);
    expect(html).toContain('Contacto');
    expect(html).toContain('Nombre o apodo');
    expect(html).toContain('Correo');
    expect(html).toContain('Mensaje');
    expect(html).toContain('Enviar mensaje');
    expect(html).toContain(CONTACT_EMAIL);
  });

  it('muestra el enlace mailto tras rellenar y enviar el formulario', () => {
    // @vitest-environment jsdom
    const { container } = render(<ContactView darkMode={false} />);
    fireEvent.change(screen.getByLabelText('Nombre o apodo'), { target: { value: 'Pantera' } });
    fireEvent.change(screen.getByLabelText('Correo'), { target: { value: 'pantera@riseup.net' } });
    fireEvent.change(screen.getByLabelText('Mensaje'), { target: { value: 'Hola, quiero colaborar.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

    const link = screen.getByRole('link');
    const expected = buildMailtoUrl({
      name: 'Pantera',
      email: 'pantera@riseup.net',
      message: 'Hola, quiero colaborar.'
    });
    expect(link.getAttribute('href')).toBe(expected);
    expect(container.innerHTML).toContain('Listo.');
  });

  it('vuelve al formulario al pulsar "Escribir otro mensaje"', () => {
    // @vitest-environment jsdom
    const { container } = render(<ContactView darkMode />);
    fireEvent.change(screen.getByLabelText('Nombre o apodo'), { target: { value: 'Pantera' } });
    fireEvent.change(screen.getByLabelText('Correo'), { target: { value: 'pantera@riseup.net' } });
    fireEvent.change(screen.getByLabelText('Mensaje'), { target: { value: 'Texto.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));
    fireEvent.click(screen.getByRole('button', { name: /Escribir otro mensaje/ }));
    expect(screen.getByLabelText('Nombre o apodo')).toBeTruthy();
    expect(screen.queryByRole('link')).toBeNull();
    expect(container.innerHTML).not.toContain('Listo.');
  });
});