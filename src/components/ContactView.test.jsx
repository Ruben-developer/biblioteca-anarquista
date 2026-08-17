import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import ContactView, { CONTACT_EMAIL, FORM_ENDPOINT } from './ContactView';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('ContactView', () => {
  it('renderiza el formulario con apodo y correo opcionales y mensaje obligatorio', () => {
    const html = renderToStaticMarkup(<ContactView darkMode={false} />);
    expect(html).toContain('Contacto');
    expect(html).toContain('Nombre o apodo');
    expect(html).toContain('(opcional)');
    expect(html).toContain('Correo');
    expect(html).toContain('Mensaje');
    expect(html).toContain('(obligatorio)');
    expect(html).toContain('Enviar mensaje');
    expect(html).toContain(CONTACT_EMAIL);
    expect(html).not.toContain('mailto:');
  });

  it('no envía sin mensaje (el mensaje es obligatorio)', () => {
    // @vitest-environment jsdom
    const fetchMock = vi.fn();
    global.fetch = fetchMock;
    const { container } = render(<ContactView darkMode={false} />);
    fireEvent.change(screen.getByLabelText(/Nombre o apodo/), { target: { value: 'Pantera' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(container.innerHTML).toContain('Enviar mensaje');
  });

  it('envía desde la página con solo el mensaje (apodo y correo opcionales)', async () => {
    // @vitest-environment jsdom
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: 'true', message: 'ok' })
    });
    global.fetch = fetchMock;
    const { container } = render(<ContactView darkMode={false} />);
    fireEvent.change(screen.getByLabelText(/Mensaje/), { target: { value: 'Quiero aportar un texto.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe(FORM_ENDPOINT);
    expect(opts.method).toBe('POST');
    const body = JSON.parse(opts.body);
    expect(body.nombre_o_apodo).toBe('Anónimo');
    expect(body.correo).toBe('no proporcionado');
    expect(body.mensaje).toBe('Quiero aportar un texto.');

    expect(await screen.findByText(/Mensaje enviado/)).toBeTruthy();
    expect(container.innerHTML).toContain(CONTACT_EMAIL);
  });

  it('incluye apodo y correo en el envío cuando se rellenan', async () => {
    // @vitest-environment jsdom
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: 'true' })
    });
    global.fetch = fetchMock;
    render(<ContactView darkMode />);
    fireEvent.change(screen.getByLabelText(/Nombre o apodo/), { target: { value: 'Pantera' } });
    fireEvent.change(screen.getByLabelText(/Correo/), { target: { value: 'pantera@riseup.net' } });
    fireEvent.change(screen.getByLabelText(/Mensaje/), { target: { value: 'Hola.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

    const [, opts] = fetchMock.mock.calls[0];
    const body = JSON.parse(opts.body);
    expect(body.nombre_o_apodo).toBe('Pantera');
    expect(body.correo).toBe('pantera@riseup.net');
    expect(await screen.findByText(/te responderemos a pantera@riseup.net/)).toBeTruthy();
  });

  it('muestra el mensaje de error y el correo directo si falla el envío', async () => {
    // @vitest-environment jsdom
    const fetchMock = vi.fn().mockRejectedValue(new Error('red caída'));
    global.fetch = fetchMock;
    const { container } = render(<ContactView darkMode={false} />);
    fireEvent.change(screen.getByLabelText(/Mensaje/), { target: { value: 'Hola.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

    expect(await screen.findByText(/No se pudo enviar/)).toBeTruthy();
    expect(container.innerHTML).toContain(`mailto:${CONTACT_EMAIL}`);
    expect(container.innerHTML).toContain('Reintentar');
  });

  it('permite enviar otro mensaje tras el éxito', async () => {
    // @vitest-environment jsdom
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: 'true' })
    });
    const { container } = render(<ContactView darkMode />);
    fireEvent.change(screen.getByLabelText(/Mensaje/), { target: { value: 'Hola.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));
    await screen.findByText(/Mensaje enviado/);
    fireEvent.click(screen.getByRole('button', { name: /Enviar otro mensaje/ }));
    expect(screen.getByLabelText(/Mensaje/)).toBeTruthy();
    expect(container.innerHTML).not.toContain('Mensaje enviado');
  });
});