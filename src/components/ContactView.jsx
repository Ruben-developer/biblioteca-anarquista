import React, { useState } from 'react'
import { Send, RotateCcw, Loader2 } from 'lucide-react'
import { THEME } from '../constants'

export const CONTACT_EMAIL = 'antarquia@riseup.net'
export const FORM_ENDPOINT = 'https://formsubmit.co/ajax/antarquia@riseup.net'

const SuccessView = ({ email, darkMode, resetForm, cardClass }) => (
  <div className={`${cardClass} border-2 rounded-lg p-6 shadow-md max-w-2xl card-appear`}>
    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-amber-900'}`}>
      Mensaje enviado. Gracias por escribir al archivo
      {email.trim() ? ` — te responderemos a ${email.trim()}` : ''}.
    </p>
    <button
      type="button"
      onClick={resetForm}
      className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg font-display uppercase tracking-wider text-sm transition-all ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-amber-800 text-amber-50 hover:bg-amber-700'}`}
    >
      <RotateCcw size={16} />
      Enviar otro mensaje
    </button>
  </div>
)

const ErrorView = ({ darkMode, resetForm, cardClass }) => (
  <div className={`${cardClass} border-2 border-[#872320] rounded-lg p-6 shadow-md max-w-2xl card-appear`}>
    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-amber-900'}`}>
      No se pudo enviar el mensaje desde la página. Escríbenos directamente
      a <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
    </p>
    <button
      type="button"
      onClick={resetForm}
      className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg font-display uppercase tracking-wider text-sm transition-all ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-amber-800 text-amber-50 hover:bg-amber-700'}`}
    >
      <RotateCcw size={16} />
      Reintentar
    </button>
  </div>
)

const ContactForm = ({ name, email, message, status, darkMode, setName, setEmail, setMessage, handleSubmit, inputClass, labelClass }) => (
  <form
    onSubmit={handleSubmit}
    className={`${darkMode ? THEME.dark.card : THEME.light.card} border-2 rounded-lg p-6 shadow-md max-w-2xl space-y-4`}
  >
    <div>
      <label htmlFor="contact-name" className={labelClass}>
        Nombre o apodo <span className={darkMode ? 'text-gray-500' : 'text-amber-600'}>(opcional)</span>
      </label>
      <input
        id="contact-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="¿Cómo te llamas?"
        className={inputClass}
      />
    </div>
    <div>
      <label htmlFor="contact-email" className={labelClass}>
        Correo <span className={darkMode ? 'text-gray-500' : 'text-amber-600'}>(opcional, para responderte)</span>
      </label>
      <input
        id="contact-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tucorreo@example.org"
        className={inputClass}
      />
    </div>
    <div>
      <label htmlFor="contact-message" className={labelClass}>
        Mensaje <span className={darkMode ? 'text-red-400' : 'text-red-700'}>(obligatorio)</span>
      </label>
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
      disabled={status === 'sending' || !message.trim()}
      className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg font-display uppercase tracking-wider text-sm transition-all active:scale-95 disabled:opacity-50 ${
        darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-800 text-amber-50 hover:bg-amber-900'
      }`}
    >
      {status === 'sending' ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
      {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
    </button>
    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-amber-700'}`}>
      El mensaje se envía directamente desde la página a {CONTACT_EMAIL}.
      Solo el mensaje es obligatorio; el nombre y el correo son opcionales
      (deja tu correo si quieres una respuesta directa).
    </p>
  </form>
)

const ContactView = ({ darkMode }) => {
  const cardClass = darkMode ? THEME.dark.card : THEME.light.card
  const inputClass = `w-full px-4 py-2 rounded-lg border text-sm ${
    darkMode ? 'bg-gray-800 border-[#872320] text-gray-200 placeholder-gray-500' : 'bg-white border-[#B79F6E] text-gray-800 placeholder-amber-700'
  }`
  const labelClass = `block text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-amber-900'}`

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle')

  const resetForm = () => {
    setName('')
    setEmail('')
    setMessage('')
    setStatus('idle')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    setStatus('sending')
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          nombre_o_apodo: name.trim() || 'Anónimo',
          correo: email.trim() || 'no proporcionado',
          mensaje: message.trim(),
          _subject: 'Contacto desde La Idea',
          _template: 'table',
          _captcha: 'false'
        })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setStatus(data?.success === 'true' ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const renderContent = () => {
    if (status === 'success') return <SuccessView email={email} darkMode={darkMode} resetForm={resetForm} cardClass={cardClass} />
    if (status === 'error') return <ErrorView darkMode={darkMode} resetForm={resetForm} cardClass={cardClass} />
    return (
      <ContactForm
        name={name} email={email} message={message} status={status} darkMode={darkMode}
        setName={setName} setEmail={setEmail} setMessage={setMessage} handleSubmit={handleSubmit}
        inputClass={inputClass} labelClass={labelClass}
      />
    )
  }

  return (
    <div>
      <h2 className={`text-3xl md:text-4xl font-display uppercase tracking-wide mb-2 ${darkMode ? 'text-red-400' : 'text-amber-900'}`}>
        Contacto
      </h2>
      <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
        Escríbenos para aportar textos, corregir datos o colaborar con el archivo.
        Tu mensaje llega a <span className="font-semibold">{CONTACT_EMAIL}</span>.
      </p>
      {renderContent()}
    </div>
  )
}

export default ContactView
