// Red de influencias entre pensadores (menú "Red de Influencias").
// Nodos con posiciones relativas (0-100) en un lienzo SVG y aristas de
// influencia. Los libros de cada autor se resuelven contra regionData.js
// por nombre de autor (getAllAuthors).
//
// Layout direccional: X = flujo de influencia (izq = influyó en otros,
// der = fue influido). Y = año de nacimiento (arriba = más antiguo,
// abajo = más reciente). Las aristas siempre van de izq → der.
const _rawInfluenceNodes = [
  // ── 1800s: fundadores ──
  { id: 'stirner', name: 'Stirner', years: '1806–1856', region: 'Alemania', authorKey: 'Max Stirner', x: 10, y: 63, bio: 'Autor de "El único y su propiedad": el egoísmo como base del individualismo radical.' },
  { id: 'proudhon', name: 'Proudhon', years: '1809–1865', region: 'Francia', authorKey: 'Pierre-Joseph Proudhon', x: 20, y: 61, bio: 'Padre del mutualismo y primer autoproclamado anarquista. Su pregunta "¿qué es la propiedad?" abre la tradición.' },
  // ── 1810s: organización ──
  { id: 'bakunin', name: 'Bakunin', years: '1814–1876', region: 'Rusia', authorKey: 'Mijaíl Bakunin', x: 35, y: 58, bio: 'Fundador del anarco-colectivismo y del anarquismo organizado en la Internacional.' },
  // ── 1820s: comunismo temprano + cristiandad ──
  { id: 'dejacque', name: 'Déjacque', years: '1821–1864', region: 'Francia', authorKey: 'Joseph Déjacque', x: 35, y: 53, bio: 'Primero en usar el término "libertario". Anarquista comunista frente al mutualismo de Proudhon.' },
  { id: 'tolstoi', name: 'Tolstói', years: '1828–1910', region: 'Rusia', authorKey: 'León Tolstói', x: 25, y: 49, bio: 'Anarquista cristiano: la no resistencia al mal y el pacifismo como revolución.' },
  // ── 1830s: geografía + comuna ──
  { id: 'reclus', name: 'Reclus', years: '1830–1905', region: 'Francia', authorKey: 'Élisée Reclus', x: 35, y: 48, bio: 'Geógrafo anarquista: la naturaleza y la sociedad se transforman juntas.' },
  { id: 'michel', name: 'Louise Michel', years: '1830–1905', region: 'Francia', x: 55, y: 48, bio: 'La "virgen roja" de la Comuna de París, poeta y militante incansable.' },
  // ── 1840s: comunismo ──
  { id: 'kropotkin', name: 'Kropotkin', years: '1842–1921', region: 'Rusia', authorKey: 'Piotr Kropotkin', x: 50, y: 41, bio: 'Teórico del anarco-comunismo: apoyo mutuo, comunas libres y federación.' },
  // ── 1850s: colectivismo + individualismo + pedagogía ──
  { id: 'malatesta', name: 'Malatesta', years: '1853–1932', region: 'Italia', authorKey: 'Errico Malatesta', x: 50, y: 34, bio: 'Revolucionario y organizador: el anarquismo como praxis insurreccional permanente.' },
  { id: 'tucker', name: 'Tucker', years: '1854–1939', region: 'EE. UU.', authorKey: 'Benjamin Tucker', x: 25, y: 33, bio: 'Principal anarquista individualista norteamericano: socialismo de Estado frente a anarquismo.' },
  { id: 'ferrer', name: 'Ferrer i Guardia', years: '1859–1909', region: 'España', authorKey: 'Francisco Ferrer Guardia', x: 62, y: 30, bio: 'Fundador de la Escuela Moderna; fusilado por su pedagogía racionalista.' },
  // ── 1860s: anarquismo español + EE.UU. + Europa ──
  { id: 'mella', name: 'Mella', years: '1861–1925', region: 'España', authorKey: 'Ricardo Mella', x: 70, y: 29, bio: 'El teórico más lúcido del anarquismo español; del colectivismo al comunismo.' },
  { id: 'nett', name: 'Nettlau', years: '1865–1944', region: 'Austria', authorKey: 'Max Nettlau', x: 50, y: 26, bio: 'El cronista del anarquismo: documentó desde dentro toda la historia del movimiento.' },
  { id: 'goldman', name: 'Goldman', years: '1869–1940', region: 'EE. UU.', authorKey: 'Emma Goldman', x: 65, y: 24, bio: 'Pionera del anarcofeminismo: "si no puedo bailar, no es mi revolución".' },
  // ── 1870s: individualismo + sindicalismo + Latam ──
  { id: 'armand', name: 'Armand', years: '1872–1962', region: 'Francia', authorKey: 'Émile Armand', x: 30, y: 22, bio: 'Anarquista individualista: camaradería amorosa y vida no convencional.' },
  { id: 'rocker', name: 'Rocker', years: '1873–1958', region: 'Alemania', x: 75, y: 21, bio: 'Teórico del anarcosindicalismo: "anarcosindicalismo: teoría y práctica".' },
  { id: 'floresmagon', name: 'Flores Magón', years: '1874–1922', region: 'México', x: 82, y: 20, bio: 'El alma del anarquismo mexicano: Tierra y Libertad y la revolución magonista.' },
  { id: 'kotoku', name: 'Kōtoku Shūsui', years: '1871–1911', region: 'Japón', x: 45, y: 22, bio: 'Padre del anarquismo japonés; ejecutado por el incidente de alta traición de 1911.' },
  { id: 'fabbri', name: 'Fabbri', years: '1877–1935', region: 'Italia', authorKey: 'Luigi Fabbri', x: 50, y: 18, bio: 'Discípulo de Malatesta y crítico del bolchevismo desde el anarquismo.' },
  { id: 'rivera', name: 'Librado Rivera', years: '1864–1932', region: 'México', x: 88, y: 26, bio: 'Magonista y educador: compañero de Flores Magón en la prisión y el exilio.' },
  { id: 'claramunt', name: 'Teresa Claramunt', years: '1846–1921', region: 'España', x: 62, y: 38, bio: 'La "virgen roja" de Barcelona: pionera del anarcosindicalismo y la lucha obrera.' },
  // ── 1880s: insurrección + Latam ──
  { id: 'guerrero', name: 'Práxedis Guerrero', years: '1882–1910', region: 'México', authorKey: 'Práxedis G. Guerrero', x: 92, y: 15, bio: 'Periodista y guerrillero magonista: propaganda por el hecho en la frontera.' },
  { id: 'seguí', name: 'Salvador Seguí', years: '1879–1923', region: 'España', x: 68, y: 17, bio: 'Líder del anarcosindicalismo catalán; "el noi del sucre" del movimiento obrero.' },
  { id: 'sugae', name: 'Ōsugi Sakae', years: '1885–1923', region: 'Japón', x: 55, y: 13, bio: 'Anarquista japonés: individualismo, free love y represión del Estado post-terremoto de Kantō.' },
  { id: 'makhno', name: 'Makhno', years: '1888–1934', region: 'Ucrania', authorKey: 'Néstor Makhno', x: 70, y: 11, bio: 'El ejército insurrecto de Ucrania; origen del plataformismo.' },
  // ── 1890s: estética + Latam + guerra civil ──
  { id: 'mera', name: 'Cipriano Mera', years: '1897–1975', region: 'España', authorKey: 'Cipriano Mera', x: 80, y: 6, bio: 'Anarcosindicalista y general de milicias: la columna de hierro en la guerra civil.' },
  { id: 'read', name: 'Herbert Read', years: '1893–1968', region: 'Inglaterra', authorKey: 'Herbert Read', x: 78, y: 8, bio: 'Crítico de arte anarquista: la estética como política de la libertad.' },
  { id: 'abad', name: 'Abad de Santillán', years: '1897–1983', region: 'Argentina', authorKey: 'Diego Abad de Santillán', x: 92, y: 5, bio: 'Militante y editor: la FORA, Bakunin en español y el anarquismo organizado latinoamericano.' },
  { id: 'digiovanni', name: 'Severino Di Giovanni', years: '1901–1931', region: 'Argentina', x: 95, y: 3, bio: 'Expropiador y propagandista: la acción directa en el anarquismo argentino.' },
  { id: 'garcia_oliver', name: 'Juan García Oliver', years: '1901–1980', region: 'España', authorKey: 'Juan García Oliver', x: 85, y: 3, bio: 'Ministro anarquista y fundador de la Columna de Hierro; del atentado al gobierno revolucionario.' },
  // ── 1900s: autogestión + Asia + cristiandad ──
  { id: 'guerin', name: 'Guérin', years: '1904–1988', region: 'Francia', authorKey: 'Daniel Guérin', x: 70, y: 1, bio: 'Anarquista y escritor que unió anarquismo, autogestión y liberación sexual.' },
  { id: 'bajin', name: 'Ba Jin', years: '1904–2005', region: 'China', authorKey: 'Ba Jin', x: 55, y: 1, bio: 'Escritor y anarquista chino: "La familia" y la influencia del anarquismo en Asia.' },
  { id: 'weil', name: 'Weil', years: '1909–1943', region: 'Francia', authorKey: 'Simone Weil', x: 35, y: -2, bio: 'Filósofa y mística: lo impersonal frente a la idolatría del Estado, la opresión como mecanismo de toda organización social.' },
  { id: 'ellul', name: 'Ellul', years: '1912–1994', region: 'Francia', authorKey: 'Jacques Ellul', x: 42, y: -4, bio: 'Teólogo y anarquista cristiano: el Estado como poder satánico y el cristianismo como subversión de toda autoridad.' },
  // ── 1920s: ecología social ──
  { id: 'bookchin', name: 'Bookchin', years: '1921–2006', region: 'EE. UU.', authorKey: 'Murray Bookchin', x: 82, y: -10, bio: 'Ecología social y municipalismo libertario: la crisis ecológica como crisis social.' },
  // ── 1960s-80s: hoy ──
  { id: 'graeber', name: 'Graeber', years: '1961–2020', region: 'EE. UU.', authorKey: 'David Graeber', x: 82, y: -17, bio: 'Antropólogo anarquista: la etnografía como inspiración de organización libre.' },
  { id: 'gelderloos', name: 'Gelderloos', years: '1982–', region: 'EE. UU.', authorKey: 'Peter Gelderloos', x: 92, y: -20, bio: 'Autor contemporáneo sobre anarquismo, ecología y acción directa.' },
];

// Aristas: [desde, hacia]. El grafo es dirigido (influencia →).
export const influenceEdges = [
  ['proudhon', 'bakunin'],
  ['proudhon', 'dejacque'],
  ['proudhon', 'tucker'],
  ['proudhon', 'mella'],
  ['stirner', 'tucker'],
  ['stirner', 'armand'],
  ['dejacque', 'kropotkin'],
  ['bakunin', 'kropotkin'],
  ['bakunin', 'malatesta'],
  ['bakunin', 'mella'],
  ['bakunin', 'rocker'],
  ['bakunin', 'makhno'],
  ['reclus', 'kropotkin'],
  ['reclus', 'bookchin'],
  ['kropotkin', 'goldman'],
  ['kropotkin', 'mella'],
  ['kropotkin', 'rocker'],
  ['kropotkin', 'graeber'],
  ['malatesta', 'goldman'],
  ['tucker', 'armand'],
  ['michel', 'goldman'],
  ['goldman', 'graeber'],
  ['goldman', 'gelderloos'],
  ['ferrer', 'makhno'],
  ['bookchin', 'graeber'],
  ['bookchin', 'gelderloos'],
  ['proudhon', 'tolstoi'],
  ['tolstoi', 'weil'],
  ['tolstoi', 'ellul'],
  ['weil', 'ellul'],
  ['kropotkin', 'nett'],
  ['reclus', 'nett'],
  ['malatesta', 'fabbri'],
  ['malatesta', 'abad'],
  ['kropotkin', 'read'],
  ['kropotkin', 'floresmagon'],
  ['floresmagon', 'guerrero'],
  ['floresmagon', 'rivera'],
  ['malatesta', 'claramunt'],
  ['malatesta', 'seguí'],
  ['kropotkin', 'kotoku'],
  ['bakunin', 'kotoku'],
  ['goldman', 'sugae'],
  ['kropotkin', 'sugae'],
  ['rocker', 'seguí'],
  ['abad', 'digiovanni'],
  ['makhno', 'garcia_oliver'],
  ['abad', 'mera'],
  ['abad', 'garcia_oliver'],
  ['kropotkin', 'bajin'],
  ['graeber', 'gelderloos'],
  ['proudhon', 'guerin']
];

// ─────────────────────────────────────────────────────────────────────────────
// Layout orgánico de la red (force-directed «relajado»).
//
// Sustituye las coordenadas manuales (solapes y nodos a la izquierda de quien
// los influyó) por un layout calculado que combina tres deseos:
//   • ANTIGÜEDAD: el eje Y se ordena por año de nacimiento (arriba = más
//     antiguo, abajo = más reciente). No es un orden rígido por filas: cada
//     nodo conserva libertad horizontal y cierto juego vertical.
//   • FLUJO: cada nodo influido queda SIEMPRE a la derecha de quien lo influyó
//     (X = flujo izq → der), sin columnas forzadas.
//   • SIN SOLAPES: repulsión entre nodos que tiene en cuenta el RADIO de cada
//     uno INCLUIDA SU ETIQUETA (mitad del ancho del nombre y mitad de la altura
//     círculo+nombre), de modo que ni los nodos ni sus nombres se tocan.
//
// Es un pequeño simulador de fuerzas determinista (las posiciones iniciales son
// los objetivos, sin aleatoriedad) que itera hasta llegar a una disposición
// estable. Las coordenadas «x»/«y» se emiten ya en el espacio alto del lienzo
// (la vista usa el mismo espacio en su viewBox).
// ─────────────────────────────────────────────────────────────────────────────
const birthYear = (node) => {
  const m = String(node.years || '').match(/(\d{4})/);
  return m ? Number(m[1]) : 0;
};

// Lienzo (espacio svg): ANCHO, la red crece hacia la derecha siguiendo el flujo
// de influencia (con scroll horizontal), y compacto en vertical (antigüedad).
const LX0 = -10, LX1 = 360, LY0 = -14, LY1 = 52;

const halfW = (name) => Math.max(3.2, String(name).length * 0.62);
const halfH = 3.8; // círculo + etiqueta (radio de no-solape que incluye el nombre)
const GAP = 2.6;

const buildInfluenceLayout = (rawNodes, edges) => {
  // X objetivo: flujo de influencia (camino más largo), como base horizontal.
  const col = {};
  const longestPath = (id) => {
    if (col[id] !== undefined) return col[id];
    const incoming = edges.filter(([, to]) => to === id).map(([from]) => from);
    if (incoming.length === 0) { col[id] = 0; return 0; }
    col[id] = Math.max(...incoming.map(longestPath)) + 1;
    return col[id];
  };
  rawNodes.forEach((n) => longestPath(n.id));
  const maxCol = Math.max(...rawNodes.map((n) => col[n.id]));
  const targetX = (n) => LX0 + 12 + (col[n.id] / (maxCol || 1)) * (LX1 - LX0 - 24);

  // Y objetivo: antigüedad (año de nacimiento, arriba más antiguo).
  const byYear = rawNodes.slice().sort((a, b) => birthYear(a) - birthYear(b));
  const rank = {};
  byYear.forEach((n, i) => { rank[n.id] = i; });
  const targetY = (n) => LY0 + 6 + (rank[n.id] / (rawNodes.length - 1)) * (LY1 - LY0 - 12);

  // Posiciones iniciales = objetivos (sin aleatoriedad → determinista).
  const pos = {};
  rawNodes.forEach((n) => { pos[n.id] = { x: targetX(n), y: targetY(n) }; });

  const minBox = (a, b) => ({
    minX: halfW(a.name) + halfW(b.name) + GAP,
    minY: halfH + halfH + GAP,
  });
  const overlap = (a, b) => {
    const dx = pos[a.id].x - pos[b.id].x;
    const dy = pos[a.id].y - pos[b.id].y;
    const { minX, minY } = minBox(a, b);
    const ox = minX - Math.abs(dx);
    const oy = minY - Math.abs(dy);
    return ox > 0 && oy > 0 ? { ox, oy, dx, dy } : null;
  };

  // Simulación de fuerzas: repulsión (incluye etiqueta) + flujo + antigüedad.
  for (let iter = 0; iter < 3000; iter++) {
    for (let i = 0; i < rawNodes.length; i++) {
      for (let j = i + 1; j < rawNodes.length; j++) {
        const a = rawNodes[i], b = rawNodes[j];
        const c = overlap(a, b);
        if (!c) continue;
        if (c.dx >= 0) { pos[a.id].x += c.ox * 0.5; pos[b.id].x -= c.ox * 0.5; }
        else { pos[a.id].x -= c.ox * 0.5; pos[b.id].x += c.ox * 0.5; }
        if (c.dy >= 0) { pos[a.id].y += c.oy * 0.5; pos[b.id].y -= c.oy * 0.5; }
        else { pos[a.id].y -= c.oy * 0.5; pos[b.id].y += c.oy * 0.5; }
      }
    }
    for (const [from, to] of edges) {
      const want = Math.max(9, halfW(rawNodes.find((n) => n.id === from).name) + halfW(rawNodes.find((n) => n.id === to).name) + 4);
      const dx = pos[to].x - pos[from].x;
      if (dx < want) { const d = (want - dx) * 0.2; pos[to].x += d; pos[from].x -= d * 0.4; }
    }
    for (const n of rawNodes) {
      pos[n.id].x += (targetX(n) - pos[n.id].x) * 0.04;
      pos[n.id].y += (targetY(n) - pos[n.id].y) * 0.12;
    }
    for (let k = 0; k < 3; k++) {
      for (const [from, to] of edges) {
        const req = halfW(rawNodes.find((n) => n.id === from).name) + halfW(rawNodes.find((n) => n.id === to).name) + 1;
        if (pos[to].x < pos[from].x + req) pos[to].x = pos[from].x + req;
      }
    }
    for (const n of rawNodes) {
      pos[n.id].x = Math.max(LX0 + 3, Math.min(LX1 - 3, pos[n.id].x));
      pos[n.id].y = Math.max(LY0 + 2, Math.min(LY1 - 2, pos[n.id].y));
    }
  }

  // Desenredo final: elimina cualquier solape residual RESPETANDO el flujo
  // (nadie a la izquierda de quien lo influyó). Al empujar un nodo hacia la
  // derecha no puede pasar a quienes influye; hacia la izquierda no puede
  // quedar a la izquierda de quienes lo influyen.
  const edgeReqs = (id) => {
    let minRight = null; // límite derecho impuesto por las aristas salientes
    let maxLeft = null;  // límite izquierdo impuesto por las aristas entrantes
    for (const [from, to] of edges) {
      const req = halfW(rawNodes.find((n) => n.id === from).name) + halfW(rawNodes.find((n) => n.id === to).name) + 1;
      if (to === id) maxLeft = Math.max(maxLeft ?? -Infinity, pos[from].x + req);
      if (from === id) minRight = Math.min(minRight ?? Infinity, pos[to].x - req);
    }
    return { minRight, maxLeft };
  };
  for (let guard = 0; guard < 6000; guard++) {
    let any = false;
    for (let i = 0; i < rawNodes.length; i++) {
      for (let j = i + 1; j < rawNodes.length; j++) {
        const a = rawNodes[i], b = rawNodes[j];
        const c = overlap(a, b);
        if (!c) continue;
        any = true;
        if (Math.abs(pos[a.id].y - pos[b.id].y) < halfH + halfH + 2) {
          // misma fila → separar horizontalmente, respetando el flujo
          const { minRight: mrA, maxLeft: mlA } = edgeReqs(a.id);
          const { minRight: mrB, maxLeft: mlB } = edgeReqs(b.id);
          let da, db;
          if (pos[a.id].x <= pos[b.id].x) { da = -0.1; db = c.ox + 0.2; }
          else { da = c.ox + 0.2; db = -0.1; }
          let na = pos[a.id].x + da, nb = pos[b.id].x + db;
          if (da < 0 && mlA != null) na = Math.max(na, mlA);
          if (da > 0 && mrA != null) na = Math.min(na, mrA);
          if (db < 0 && mlB != null) nb = Math.max(nb, mlB);
          if (db > 0 && mrB != null) nb = Math.min(nb, mrB);
          if (na !== pos[a.id].x && na >= pos[a.id].x + da - 0.001) pos[a.id].x = na;
          else pos[a.id].x += da;
          if (nb !== pos[b.id].x && nb >= pos[b.id].x + db - 0.001) pos[b.id].x = nb;
          else pos[b.id].x += db;
        } else {
          // filas distintas → separar verticalmente (no afecta al flujo)
          if (pos[a.id].y <= pos[b.id].y) { pos[b.id].y += c.oy; pos[a.id].y -= 0.1; }
          else { pos[a.id].y += c.oy; pos[b.id].y -= 0.1; }
        }
      }
    }
    if (!any) break;
    // refuerzo de flujo (empuja al influido a la derecha del influyente)
    for (const [from, to] of edges) {
      const req = halfW(rawNodes.find((n) => n.id === from).name) + halfW(rawNodes.find((n) => n.id === to).name) + 1;
      if (pos[to].x < pos[from].x + req) pos[to].x = pos[from].x + req;
    }
    for (const n of rawNodes) {
      pos[n.id].x = Math.max(LX0 + 2, Math.min(LX1 - 2, pos[n.id].x));
      pos[n.id].y = Math.max(LY0 + 2, Math.min(LY1 - 2, pos[n.id].y));
    }
  }

  return rawNodes.map((n) => ({
    ...n,
    x: Math.round(pos[n.id].x * 100) / 100,
    y: Math.round(pos[n.id].y * 100) / 100,
  }));
};

export const influenceNodes = buildInfluenceLayout(_rawInfluenceNodes, influenceEdges);

// Radio de «no toparse» que incluye la etiqueta (usado por testes y la vista).
export const influenceBox = { halfW, halfH, gap: GAP };