import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Mail, Send, RotateCcw } from 'lucide-react';
import { THEME } from '../constants';

// Correo de contacto del proyecto.
export const CONTACT_EMAIL = 'antarquia@riseup.net';

// Construye un enlace mailto con asunto y cuerpo a partir del formulario.
// Es la vía de contacto de una web estática (sin backend): el mensaje se
// prepara y se abre en la aplicación de correo del visitante.
export const buildMailtoUrl = ({ name, email, message }) => {
  const subject = `Contacto desde Antarquia${name ? ` — ${name}` : ''}`;
  const body = [
    'Mensaje desde el formulario de Antarquia',
    '',
    `Nombre/apodo: ${name}`,
    `Correo de contacto: ${email}`,
    '',
    message
  ].join('\n');
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const ContactView = ({ darkMode }) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card;
  const inputClass = `w-full px-4 py-2 rounded-lg border text-sm ${
    darkMode
      ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500'
      : 'bg-white border-amber-300 text-gray-800 placeholder-amber-700'
  }`;
  const labelClass = `block text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-amber-900'}`;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [mailtoUrl, setMailtoUrl] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMailtoUrl(buildMailtoUrl({ name, email, message }));
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setMessage('');
    setMailtoUrl(null);
  };

  return (
    <div>
      <h2 className={`text-3xl md:text-4xl font-display uppercase tracking-wide mb-2 ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
        Contacto
      </h2>
      <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
        Escríbenos para aportar textos, corregir datos o colaborar con el archivo.
        Tu mensaje llega a <span className="font-semibold">{CONTACT_EMAIL}</span>.
      </p>

      {mailtoUrl ? (
        <div className={`${cardClass} border-2 rounded-lg p-6 shadow-md max-w-2xl card-appear`}>
          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-amber-900'}`}>
            Listo. Pulsa el enlace para abrir tu aplicación de correo con el
            mensaje ya escrito hacia {CONTACT_EMAIL}:
          </p>
          <a
            href={mailtoUrl}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg font-display uppercase tracking-wider text-sm transition-all ${
              darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-800 text-amber-50 hover:bg-amber-900'
            }`}
          >
            <Mail size={18} />
            Enviar mensaje a {CONTACT_EMAIL}
          </a>
          <button
            type="button"
            onClick={resetForm}
            className={`ml-3 inline-flex items-center gap-2 px-4 py-3 rounded-lg font-display uppercase tracking-wider text-sm transition-all ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-amber-200 text-amber-900 hover:bg-amber-300'}`}
          >
            <RotateCcw size={16} />
            Escribir otro mensaje
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className={`${cardClass} border-2 rounded-lg p-6 shadow-md max-w-2xl space-y-4`}
        >
          <div>
            <label htmlFor="contact-name" className={labelClass}>Nombre o apodo</label>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="¿Cómo te llamas?"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="contact-email" className={labelClass}>Correo</label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@example.org"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="contact-message" className={labelClass}>Mensaje</label>
            <textarea
              id="contact-message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tu mensaje para el archivo…"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg font-display uppercase tracking-wider text-sm transition-all active:scale-95 ${
              darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-800 text-amber-50 hover:bg-amber-900'
            }`}
          >
            <Send size={18} />
            Enviar mensaje
          </button>

          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-amber-700'}`}>
            Al enviar se abrirá tu programa de correo con el mensaje dirigido a
            {CONTACT_EMAIL}. Es la vía de contacto de una web estática: sin
            servidores intermedios, tu mensaje viaja solo entre tu correo y el del archivo.
          </p>
        </form>
      )}
    </div>
  );
};

ContactView.propTypes = {
  darkMode: PropTypes.bool
};

export default ContactView;