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
      "'Playfair Display', Georgia, serif",
      "'Playfair Display', Georgia, serif",
      "'Source Sans 3', system-ui, sans-serif",
      "'IBM Plex Mono', ui-monospace, monospace"
    ]
  },

  // ── Editorial ──────────────────────────────────────────────────────────
  // Papel crema, berenjena, Playfair en los titulares y Source Sans 3 en los
  // datos. El modo noche invierte la paleta conservando el mismo esqueleto.
  'collage-vino': {
    amber: { 50: '#F6F0EC', 100: '#FBF7F4', 200: '#EDE4DE', 300: '#DDD0C8', 400: '#B9A9A1', 500: '#8A7A72', 600: '#6B1F3A', 700: '#6B1F3A', 800: '#51152B', 900: '#1A1416' },
    gray: { 100: '#FBF7F4', 200: '#EDE4DE', 300: '#DDD0C8', 400: '#9C8C84', 500: '#7A6A62', 600: '#544842', 700: '#382F2B', 800: '#241E1B', 900: '#1A1416', 950: '#0D0A09' },
    red: { 50: '#F8E9EE', 100: '#F0D2DC', 200: '#E0A7BA', 300: '#CC7A94', 400: '#B24A6C', 500: '#8E2A4C', 600: '#6B1F3A', 700: '#51152B', 800: '#3B0E1F', 900: '#280914', 950: '#15040A' },
    claro: { 'orange-50': '#F6F0EC', 'yellow-50': '#F6F0EC' },
    sem: { 'c-line': '#1A1416', 'c-line-soft': '#DDD0C8', 'c-accent': '#6B1F3A', 'c-paper': '#FBF7F4', 'c-paper-deep': '#F6F0EC' },
    rojo: ['#6B1F3A', '#51152B', '#8E2A4C'],
    radio: ['0', '0', '0', '0'],
    borde: '2px',
    sombra: ['6px 6px 0 rgb(26 20 22 / 0.10)', '10px 10px 0 rgb(26 20 22 / 0.14)'],
    fuentes: [
      "'Playfair Display', Georgia, serif",
      "'Playfair Display', Georgia, serif",
      "'Source Sans 3', system-ui, sans-serif",
      "'IBM Plex Mono', ui-monospace, monospace"
    ],
    // Noche: el papel se vuelve tinta y el acento se aclara a rosa.
    noche: {
      amber: { 50: '#14100F', 100: '#241A1F', 200: '#33222A', 300: '#4A2A35', 400: '#6B3A4A', 500: '#96536C', 600: '#B96A85', 700: '#C97E97', 800: '#E4C7D1', 900: '#F3EAE3' },
      red: { 50: '#FCF3F6', 100: '#F7E7EC', 200: '#F0D6DF', 300: '#E7BECC', 400: '#D99CB2', 500: '#C97E97', 600: '#B05C77', 700: '#8E4460', 800: '#6E3249', 900: '#4A2030', 950: '#1A0E13' },
      sem: { 'c-line': '#3B2F33', 'c-line-soft': '#2A2226', 'c-accent': '#C97E97', 'c-paper': '#14100F', 'c-paper-deep': '#0C0908' },
      rojo: ['#B05C77', '#8E4460', '#D99CB2']
    }
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

const bloqueNoche = (id, s) => {
  if (!s.noche) return '';
  const n = s.noche;
  return `/* Noche de ${id}: solo cambian los tonos, no la geometría. */
html[data-estilo="${id}"][data-modo="noche"] {
${escala(n.amber, 'amber')}
${escala(n.red, 'red')}
${escala(n.sem)}
${rojos(n.rojo)}
}`;
};

const css = `/* ============================================================================
   ESTILOS · tokens de color, forma y tipografía
   Generado por scripts/generar-estilos.mjs — no editar a mano.
   El estilo activo se elige con \`data-estilo\` en <html>; el modo noche con
   \`data-modo="noche"\`.
   ============================================================================ */

${Object.entries(ESTILOS).map(([id, s]) => [bloque(id, s), bloqueNoche(id, s)].filter(Boolean).join('\n\n')).join('\n\n')}
`;

process.stdout.write(css);
