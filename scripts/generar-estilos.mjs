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

  brutal: {
    amber: { 50: '#0A0A0A', 100: '#141414', 200: '#1E1E1E', 300: '#2A2A2A', 400: '#3A3A3A', 500: '#8A8A8A', 600: '#FF6B35', 700: '#FF3B2F', 800: '#D62A1E', 900: '#F5EFDF' },
    gray: { 100: '#141414', 200: '#1E1E1E', 300: '#3A3A3A', 400: '#8A8A8A', 500: '#8A8A8A', 600: '#C9C2B2', 700: '#DCD5C4', 800: '#EAE3D2', 900: '#F5EFDF', 950: '#0A0A0A' },
    red: { 50: '#2A0A08', 100: '#3D0F0B', 200: '#5A1510', 300: '#8A1F16', 400: '#D62A1E', 500: '#FF3B2F', 600: '#FF3B2F', 700: '#FF6B35', 800: '#FF8A5C', 900: '#FFB199', 950: '#FFD6C7' },
    claro: { 'orange-50': '#0A0A0A', 'yellow-50': '#0A0A0A' },
    sem: { 'c-line': '#3A3A3A', 'c-line-soft': '#2A2A2A', 'c-accent': '#FF3B2F', 'c-paper': '#141414', 'c-paper-deep': '#0A0A0A' },
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
