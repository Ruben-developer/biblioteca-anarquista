export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"High Voltage Rough"', 'Anton', 'Oswald', 'Impact', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace']
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
        // Desduplicación de la escala (mismo color, un solo valor):
        // rojos oscuros fragmentados -> un rojo de enlace y un rojo de scrim
        red: {
          300: '#f87171',
          400: '#f87171',
          500: '#f87171',
          950: '#7f1d1d'
        },
        // Ámbar claro: paletas casi idénticas colapsadas a ámbar-50
        amber: { 50: '#fffbeb' },
        orange: { 50: '#fffbeb' },
        yellow: { 50: '#fffbeb' }
      }
    },
  },
  plugins: [],
}
