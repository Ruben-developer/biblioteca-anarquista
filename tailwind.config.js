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
        }
      }
    },
  },
  plugins: [],
}
