// Genera src/estilos.css a partir de las paletas de cada estilo.
// Uso: node scripts/generar-estilos.mjs
// El CSS resultante se versiona: no hace falta ejecutarlo en el build.

const hex = (h) => {
  const n = h.replace('#', '');
  const v = n.length === 3 ? n.split('').map((c) => c + c).join('') : n;
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16)).join(' ');
};

const escala = (o, prefijo) =>
  Object.entries(o)
    .map(([k, v]) => `  --${prefijo ? `${prefijo}-` : ''}${k}: ${hex(v)};`)
    .join('\n');

const rojos = ([base, deep, focus]) => {
  const rgb = (h) => h.replace('#', '').match(/.{2}/g).map((x) => parseInt(x, 16)).join(', ');
  return [
    `  --c-red: ${base};`,
    `  --c-red-deep: ${deep};`,
    `  --c-red-focus: ${focus};`,
    `  --c-red-rgb: ${rgb(base)};`,
    `  --c-red-deep-rgb: ${rgb(deep)};`
  ].join('\n');
};

const ESTILOS = {
  // ── Original ───────────────────────────────────────────────────────────
  clasico: {
    amber: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f' },
    gray: { 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827', 950: '#030712' },
    red: { 50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#f87171', 400: '#f87171', 500: '#f87171', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d', 950: '#7f1d1d' },
    claro: { 'orange-50': '#fffbeb', 'yellow-50': '#fffbeb' },
    sem: { 'c-line': '#B79F6E', 'c-line-soft': '#CBB788', 'c-accent': '#872320', 'c-paper': '#F5EDD9', 'c-paper-deep': '#EDE1C8' },
    rojo: ['#D02C26', '#B0241E', '#A0241A'],
    radio: ['0.375rem', '0.5rem', '0.75rem', '9999px'],
    borde: '2px',
    sombra: [
      '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
    ],
    fuentes: [
      "'High Voltage Rough', Anton, Oswald, Impact, sans-serif",
      "'Playfair Display', Georgia, serif",
      "'Source Sans 3', system-ui, sans-serif",
      "'IBM Plex Mono', ui-monospace, monospace"
    ]
  },

  // ── Brutal ─────────────────────────────────────────────────────────────
  brutal: {
    amber: { 50: '#0A0A0A', 100: '#121212', 200: '#1A1A1A', 300: '#262626', 400: '#3A3A3A', 500: '#8A8A8A', 600: '#FF6B35', 700: '#FF3B2F', 800: '#D62A1E', 900: '#F5EFDF' },
    gray: { 100: '#121212', 200: '#1A1A1A', 300: '#3A3A3A', 400: '#8A8A8A', 500: '#8A8A8A', 600: '#C9C2B2', 700: '#DCD5C4', 800: '#EAE3D2', 900: '#F5EFDF', 950: '#050505' },
    red: { 50: '#2A0A08', 100: '#3D0F0B', 200: '#5A1510', 300: '#8A1F16', 400: '#D62A1E', 500: '#FF3B2F', 600: '#FF3B2F', 700: '#FF6B35', 800: '#FF8A5C', 900: '#FFB199', 950: '#FFD6C7' },
    claro: { 'orange-50': '#0A0A0A', 'yellow-50': '#0A0A0A' },
    sem: { 'c-line': '#3A3A3A', 'c-line-soft': '#262626', 'c-accent': '#FF3B2F', 'c-paper': '#121212', 'c-paper-deep': '#0A0A0A' },
    rojo: ['#FF3B2F', '#D62A1E', '#FF5A4F'],
    radio: ['0', '0', '0', '0'],
    borde: '4px',
    sombra: ['none', 'none'],
    fuentes: [
      'Anton, Oswald, Impact, sans-serif',
      "'Playfair Display', Georgia, serif",
      "'Source Sans 3', system-ui, sans-serif",
      "'IBM Plex Mono', ui-monospace, monospace"
    ]
  },

  // Variación: mismo esqueleto, acento ácido y más mono.
  'brutal-acido': {
    amber: { 50: '#08090A', 100: '#101210', 200: '#181B18', 300: '#242824', 400: '#3A403A', 500: '#8A8F8A', 600: '#D8FF00', 700: '#D8FF00', 800: '#A8C700', 900: '#F2F0E6' },
    gray: { 100: '#101210', 200: '#181B18', 300: '#242824', 400: '#5A605A', 500: '#8A8F8A', 600: '#C8CCC4', 700: '#DDE0D6', 800: '#EDEEE6', 900: '#F2F0E6', 950: '#050605' },
    red: { 50: '#1A2000', 100: '#242E00', 200: '#3A4A00', 300: '#7E9600', 400: '#B8DB00', 500: '#D8FF00', 600: '#D8FF00', 700: '#A8C700', 800: '#8AA300', 900: '#E6FF4D', 950: '#F0FF99' },
    claro: { 'orange-50': '#08090A', 'yellow-50': '#08090A' },
    sem: { 'c-line': '#2A2F2A', 'c-line-soft': '#1E221E', 'c-accent': '#D8FF00', 'c-paper': '#101210', 'c-paper-deep': '#08090A' },
    rojo: ['#D8FF00', '#A8C700', '#E6FF4D'],
    radio: ['0', '0', '0', '0'],
    borde: '3px',
    sombra: ['none', 'none'],
    fuentes: [
      'Anton, Oswald, Impact, sans-serif',
      "'IBM Plex Mono', ui-monospace, monospace",
      "'Source Sans 3', system-ui, sans-serif",
      "'IBM Plex Mono', ui-monospace, monospace"
    ]
  },

  // ── Collage ────────────────────────────────────────────────────────────
  collage: {
    amber: { 50: '#F7F4EE', 100: '#FFFFFF', 200: '#EDE9E1', 300: '#E0DAD0', 400: '#D8D2C6', 500: '#8A857C', 600: '#B80018', 700: '#D0021B', 800: '#970015', 900: '#111111' },
    gray: { 100: '#FFFFFF', 200: '#EDE9E1', 300: '#D8D2C6', 400: '#8A857C', 500: '#8A857C', 600: '#6B665E', 700: '#4A463F', 800: '#2A2724', 900: '#111111', 950: '#000000' },
    red: { 50: '#FDECEE', 100: '#F9D3D7', 200: '#F3AEB5', 300: '#EA818C', 400: '#DE4A5C', 500: '#D0021B', 600: '#B80018', 700: '#970015', 800: '#740010', 900: '#53000B', 950: '#2E0006' },
    claro: { 'orange-50': '#F7F4EE', 'yellow-50': '#F7F4EE' },
    sem: { 'c-line': '#D8D2C6', 'c-line-soft': '#E6E1D8', 'c-accent': '#D0021B', 'c-paper': '#FFFFFF', 'c-paper-deep': '#F7F4EE' },
    rojo: ['#D0021B', '#970015', '#B80018'],
    radio: ['0.5rem', '0.75rem', '1rem', '9999px'],
    borde: '2px',
    sombra: [
      '0 2px 6px rgb(17 17 17 / 0.08)',
      '0 8px 24px rgb(17 17 17 / 0.12)'
    ],
    fuentes: [
      "'Playfair Display', Georgia, serif",
      "'Playfair Display', Georgia, serif",
      "'Source Sans 3', system-ui, sans-serif",
      "'IBM Plex Mono', ui-monospace, monospace"
    ]
  },

  // Variación: papel prensa, sin esquinas, titular condensado y mono.
  'collage-prensa': {
    amber: { 50: '#EFEBE3', 100: '#F7F4EE', 200: '#E2DCD0', 300: '#D2CABB', 400: '#A8A093', 500: '#7A7268', 600: '#C8102E', 700: '#C8102E', 800: '#A00C24', 900: '#141414' },
    gray: { 100: '#F7F4EE', 200: '#E2DCD0', 300: '#C9C1B3', 400: '#8F877A', 500: '#6E675C', 600: '#4A453D', 700: '#2E2A25', 800: '#1C1916', 900: '#141414', 950: '#0A0908' },
    red: { 50: '#FBEAEC', 100: '#F5CDD2', 200: '#EBA3AC', 300: '#DE7482', 400: '#D23F52', 500: '#C8102E', 600: '#C8102E', 700: '#A00C24', 800: '#7A091B', 900: '#560612', 950: '#2E0309' },
    claro: { 'orange-50': '#EFEBE3', 'yellow-50': '#EFEBE3' },
    sem: { 'c-line': '#C9C1B3', 'c-line-soft': '#D8D1C4', 'c-accent': '#C8102E', 'c-paper': '#F7F4EE', 'c-paper-deep': '#EFEBE3' },
    rojo: ['#C8102E', '#A00C24', '#8A0A1E'],
    radio: ['0', '0', '0', '0'],
    borde: '2px',
    sombra: ['2px 2px 0 rgb(20 20 20 / 0.18)', '5px 5px 0 rgb(20 20 20 / 0.22)'],
    fuentes: [
      'Oswald, Anton, Impact, sans-serif',
      "'Playfair Display', Georgia, serif",
      "'Source Sans 3', system-ui, sans-serif",
      "'IBM Plex Mono', ui-monospace, monospace"
    ]
  },

  // ── Nuevos ─────────────────────────────────────────────────────────────
  hud: {
    amber: { 50: '#040607', 100: '#0B0F12', 200: '#121A1F', 300: '#1B262C', 400: '#2A3A42', 500: '#5A6B72', 600: '#FF8A00', 700: '#FF6A00', 800: '#CC5500', 900: '#E8F0F2' },
    gray: { 100: '#0B0F12', 200: '#121A1F', 300: '#1B262C', 400: '#3A4A52', 500: '#5A6B72', 600: '#8FA3AB', 700: '#B8C7CD', 800: '#D4E0E4', 900: '#E8F0F2', 950: '#040607' },
    red: { 50: '#1A0D00', 100: '#2A1400', 200: '#4A2400', 300: '#8A4400', 400: '#CC5500', 500: '#FF6A00', 600: '#FF6A00', 700: '#FFB000', 800: '#FFD400', 900: '#FFE066', 950: '#FFF3B8' },
    claro: { 'orange-50': '#040607', 'yellow-50': '#040607' },
    sem: { 'c-line': '#2A3A42', 'c-line-soft': '#162026', 'c-accent': '#FF6A00', 'c-paper': '#0B0F12', 'c-paper-deep': '#040607' },
    rojo: ['#FF6A00', '#CC5500', '#FF8A00'],
    radio: ['0', '0', '0', '0'],
    borde: '1px',
    sombra: [
      '0 0 0 1px rgb(255 106 0 / 0.18), 0 0 18px rgb(255 106 0 / 0.10)',
      '0 0 0 1px rgb(255 106 0 / 0.30), 0 0 28px rgb(255 106 0 / 0.18)'
    ],
    fuentes: [
      "'Chakra Petch', 'Rajdhani', sans-serif",
      "'Chakra Petch', sans-serif",
      "'Chakra Petch', sans-serif",
      "'IBM Plex Mono', ui-monospace, monospace"
    ]
  },

  deconstructivo: {
    amber: { 50: '#F7F7F5', 100: '#FFFFFF', 200: '#ECECEA', 300: '#DCDCD8', 400: '#B4B4AE', 500: '#7A7A74', 600: '#E30613', 700: '#E30613', 800: '#B00510', 900: '#0B0B0B' },
    gray: { 100: '#FFFFFF', 200: '#ECECEA', 300: '#DCDCD8', 400: '#B4B4AE', 500: '#7A7A74', 600: '#4A4A46', 700: '#2A2A28', 800: '#1A1A18', 900: '#0B0B0B', 950: '#000000' },
    red: { 50: '#FDECEC', 100: '#FAD2D3', 200: '#F2A6A8', 300: '#E87377', 400: '#DE3A41', 500: '#E30613', 600: '#E30613', 700: '#B00510', 800: '#8A040C', 900: '#5C0208', 950: '#2E0104' },
    claro: { 'orange-50': '#F7F7F5', 'yellow-50': '#F7F7F5' },
    sem: { 'c-line': '#0B0B0B', 'c-line-soft': '#DCDCD8', 'c-accent': '#E30613', 'c-paper': '#FFFFFF', 'c-paper-deep': '#F7F7F5' },
    rojo: ['#E30613', '#B00510', '#E30613'],
    radio: ['0', '0', '0', '0'],
    borde: '2px',
    sombra: ['none', 'none'],
    fuentes: [
      "'Archivo Black', 'Source Sans 3', sans-serif",
      "'Playfair Display', Georgia, serif",
      "'Source Sans 3', system-ui, sans-serif",
      "'IBM Plex Mono', ui-monospace, monospace"
    ]
  },

  zine: {
    amber: { 50: '#FFFFFF', 100: '#FFFFFF', 200: '#F2F0EC', 300: '#E0DDD6', 400: '#A8A49C', 500: '#6E6A64', 600: '#FF4438', 700: '#FF4438', 800: '#D92F24', 900: '#0B0B0B' },
    gray: { 100: '#FFFFFF', 200: '#F2F0EC', 300: '#E0DDD6', 400: '#A8A49C', 500: '#6E6A64', 600: '#4A4742', 700: '#2E2C28', 800: '#1A1917', 900: '#0B0B0B', 950: '#000000' },
    red: { 50: '#FFF0EE', 100: '#FFD9D5', 200: '#FFB3AC', 300: '#FF8A80', 400: '#FF6A5E', 500: '#FF4438', 600: '#FF4438', 700: '#D92F24', 800: '#B01F16', 900: '#FF7A70', 950: '#7A0F0A' },
    claro: { 'orange-50': '#FFFFFF', 'yellow-50': '#FFFFFF' },
    sem: { 'c-line': '#0B0B0B', 'c-line-soft': '#D8D4CC', 'c-accent': '#FF4438', 'c-paper': '#FFFFFF', 'c-paper-deep': '#F2F0EC' },
    rojo: ['#FF4438', '#D92F24', '#FF6A5E'],
    radio: ['0', '0', '0', '9999px'],
    borde: '3px',
    sombra: ['4px 4px 0 rgb(11 11 11 / 1)', '7px 7px 0 rgb(11 11 11 / 1)'],
    fuentes: [
      'Anton, Oswald, Impact, sans-serif',
      "'Permanent Marker', 'Caveat', cursive",
      "'Source Sans 3', system-ui, sans-serif",
      "'IBM Plex Mono', ui-monospace, monospace"
    ]
  },

  // ── Primera iteración ──────────────────────────────────────────────────
  bauhaus: {
    amber: { 50: '#EDE3CE', 100: '#F5EEDD', 200: '#E0D2B6', 300: '#D2C09E', 400: '#B9A47F', 500: '#8C7B5F', 600: '#8E2B1F', 700: '#B23A2A', 800: '#8E2B1F', 900: '#26211B' },
    gray: { 100: '#F5EEDD', 200: '#E0D2B6', 300: '#B9A47F', 400: '#8C7B5F', 500: '#8C7B5F', 600: '#6B5B45', 700: '#4F4335', 800: '#3A3026', 900: '#26211B', 950: '#1A1611' },
    red: { 50: '#F6E3DC', 100: '#EDC9BE', 200: '#E0A99A', 300: '#D08672', 400: '#C25A44', 500: '#B23A2A', 600: '#A02F22', 700: '#7E2A20', 800: '#64211A', 900: '#4A1813', 950: '#2E0F0B' },
    claro: { 'orange-50': '#EDE3CE', 'yellow-50': '#EDE3CE' },
    sem: { 'c-line': '#B9A47F', 'c-line-soft': '#CBB894', 'c-accent': '#B23A2A', 'c-paper': '#F5EEDD', 'c-paper-deep': '#E0D2B6' },
    rojo: ['#B23A2A', '#7E2A20', '#8E2B1F'],
    radio: ['0', '0', '0', '0'],
    borde: '3px',
    sombra: ['4px 4px 0 rgb(38 33 27 / 0.18)', '8px 8px 0 rgb(38 33 27 / 0.22)'],
    fuentes: [
      "Jost, 'Source Sans 3', sans-serif",
      "Jost, 'Source Sans 3', sans-serif",
      "Jost, 'Source Sans 3', sans-serif",
      "'IBM Plex Mono', ui-monospace, monospace"
    ]
  },

  constructivista: {
    amber: { 50: '#E8DCC0', 100: '#F0E6CE', 200: '#DCCDAE', 300: '#CDBB98', 400: '#A8946A', 500: '#7D6B4A', 600: '#A50E1A', 700: '#C1121F', 800: '#850B15', 900: '#1A1714' },
    gray: { 100: '#F0E6CE', 200: '#DCCDAE', 300: '#A8946A', 400: '#7D6B4A', 500: '#7D6B4A', 600: '#5C4D36', 700: '#3F3425', 800: '#2A2218', 900: '#1A1714', 950: '#0F0D0B' },
    red: { 50: '#F7E3E1', 100: '#EFC7C3', 200: '#E3A29C', 300: '#D4766E', 400: '#C8403A', 500: '#C1121F', 600: '#A50E1A', 700: '#850B15', 800: '#660810', 900: '#48050B', 950: '#2A0206' },
    claro: { 'orange-50': '#E8DCC0', 'yellow-50': '#E8DCC0' },
    sem: { 'c-line': '#A8946A', 'c-line-soft': '#BFAC84', 'c-accent': '#C1121F', 'c-paper': '#F0E6CE', 'c-paper-deep': '#E8DCC0' },
    rojo: ['#C1121F', '#850B15', '#A50E1A'],
    radio: ['0', '0', '0', '0'],
    borde: '2px',
    sombra: ['3px 3px 0 rgb(26 23 20 / 0.16)', '6px 6px 0 rgb(26 23 20 / 0.2)'],
    fuentes: [
      'Oswald, Anton, Impact, sans-serif',
      "'Playfair Display', Georgia, serif",
      "'Source Sans 3', system-ui, sans-serif",
      "'IBM Plex Mono', ui-monospace, monospace"
    ]
  }
};

const bloque = (id, s) => {
  const selector = id === 'clasico' ? ':root,\nhtml[data-estilo="clasico"]' : `html[data-estilo="${id}"]`;
  const [r1, r2, r3, r4] = s.radio;
  const [sh1, sh2] = s.sombra;
  const [f1, f2, f3, f4] = s.fuentes;
  return `/* ── ${id} ─────────────────────────────────────────────── */
${selector} {
${escala(s.amber, 'amber')}
${escala(s.gray, 'gray')}
${escala(s.red, 'red')}
${escala(s.claro)}
${escala(s.sem)}
${rojos(s.rojo)}
  --r-md: ${r1};
  --r-lg: ${r2};
  --r-xl: ${r3};
  --r-full: ${r4};
  --bw-2: ${s.borde};
  --shadow-md: ${sh1};
  --shadow-lg: ${sh2};
  --font-display: ${f1};
  --font-serif: ${f2};
  --font-sans: ${f3};
  --font-mono: ${f4};
}`;
};

const css = `/* ============================================================================
   ESTILOS · tokens de color, forma y tipografía
   Generado por scripts/generar-estilos.mjs — no editar a mano.
   El estilo activo se elige con \`data-estilo\` en <html>.
   ============================================================================ */

${Object.entries(ESTILOS).map(([id, s]) => bloque(id, s)).join('\n\n')}
`;

process.stdout.write(css);
