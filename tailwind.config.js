// Tokens: color, tipografía, radio, borde y sombra salen de variables CSS
// definidas por estilo en src/estilos.css (generado por scripts/generar-estilos.mjs).
// El estilo activo vive en <html data-estilo="…">; así un solo cambio de atributo
// re-tiñe toda la app sin tocar componentes.
const canal = (nombre) => `rgb(var(--${nombre}) / <alpha-value>)`;

const rampa = (familia, tonos) =>
  Object.fromEntries(tonos.map((t) => [t, canal(`${familia}-${t}`)]));

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: 'var(--font-display)',
        serif: 'var(--font-serif)',
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)'
      },
      colors: {
        anarchist: {
          50: '#fdf8f3',
          100: '#fbeee1',
          600: '#b97755',
          700: '#8b5a3c',
          800: '#5d3d28',
          900: '#2d1810'
        },
        // Tokens semánticos: fuente única = variables CSS de index.css
        brand: 'var(--c-red)',
        'brand-deep': 'var(--c-red-deep)',
        action: 'var(--c-red)',
        'action-hover': 'var(--c-red-deep)',
        // Tokens de estilo (cambian con data-estilo)
        line: canal('c-line'),
        'line-soft': canal('c-line-soft'),
        accent: canal('c-accent'),
        paper: canal('c-paper'),
        'paper-deep': canal('c-paper-deep'),
        // Rampas completas: cada tono apunta a su variable de estilo
        amber: rampa('amber', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        gray: rampa('gray', [100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        red: rampa('red', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        orange: { 50: canal('orange-50') },
        yellow: { 50: canal('yellow-50') }
      },
      borderRadius: {
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        xl: 'var(--r-xl)',
        full: 'var(--r-full)'
      },
      borderWidth: {
        2: 'var(--bw-2)'
      },
      boxShadow: {
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)'
      }
    },
  },
  plugins: [],
}
