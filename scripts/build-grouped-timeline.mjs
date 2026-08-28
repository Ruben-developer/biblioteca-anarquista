#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = '/home/fdr/biblioteca-anarquista';
const FILE = `${ROOT}/src/data/timelineEvents.js`;
const { regionData } = await import(pathToFileURL(FILE.replace('timelineEvents.js', 'regionData.js')));

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
const toks = (s) => new Set(norm(s).split(' ').filter((w) => w.length >= 4));

const libroExacto = new Map();
const catalogo = [];
for (const [region, r] of Object.entries(regionData)) {
  for (const b of r.books) {
    const n = norm(b.title);
    if (!libroExacto.has(n)) libroExacto.set(n, b.title);
    catalogo.push({ exact: b.title, tk: toks(b.title) });
  }
}

const OVERRIDES = {
  'Barricadas en Barcelona (Mayo 1937)': ['Barricadas en Barcelona'],
  'La revuelta de los Banlieusards (Francia, 2005)': ['La revuelta de los Banlieusards'],
  'La Banda de Chernopeev (Levantamiento de Ilinden, 1903)': ['La Banda de Chernopeev'],
  'Historia Argentina (Tomos I, II y III)': [
    'Historia ArgentinaDesde la aparicion del hombre hasta la obra de M. M. de Guemes',
    'Historia ArgentinaDesde la liberacion de Chile hasta la constitucion de la Provincia de Bs. As.',
    'Historia ArgentinaDesde la presidencia de Urquiza a la eleccion de H. Yrigoyen',
  ],
};

function resolverArr(titulo) {
  if (OVERRIDES[titulo]) return OVERRIDES[titulo].slice();
  const n = norm(titulo);
  if (libroExacto.has(n)) return [libroExacto.get(n)];
  const tk = toks(titulo);
  let best = null, bestScore = 0;
  for (const c of catalogo) {
    let inter = 0; for (const w of tk) if (c.tk.has(w)) inter++;
    const score = tk.size ? inter / tk.size : 0;
    if (score > bestScore) { bestScore = score; best = c.exact; }
  }
  return (best && bestScore >= 0.55 && tk.size >= 3) ? [best] : [];
}

const SECTIONS = [
  { title: 'Protoanarquismo, Utopías y Piratería', year: -1800, range: '1800 a.C. – 1780 d.C.', region: 'Mediterráneo y Caribe', books: [
    'Utopías antiguas y modernas', 'El anarquismo en la antigua Grecia', 'Los hermanos de la Costa. Piratería libertaria en el Caribe' ] },
  { title: 'La Primera Internacional, Bakunin y la Comuna de París', year: 1868, range: '1868–1877', region: 'Europa (Francia, Suiza, España)', books: [
    'La Comuna de París', 'La comuna de París (antología)', 'Bakunin-Netchaiev. El Catecismo Revolucionario',
    'Prólogo a Anselmo Lorenzo: El Proletariado Militante', 'Élisée Reclus. El geógrafo ácrata y su paisaje de la libertad', 'Memorias de un revolucionario' ] },
  { title: 'Los Mártires de Chicago y el nacimiento del 1º de Mayo', year: 1886, range: '1886', region: 'Estados Unidos e Internacional', books: [
    'Los Mártires de Chicago', 'El origen del 1º de Mayo', '1º de mayo. Su origen y significado',
    'Los orígenes libertarios del Primero de Mayo: de Chicago a América Latina' ] },
  { title: 'La Propaganda por el Hecho y el Magnicidio en Europa', year: 1880, range: '1880–1914', region: 'Europa (Francia, Suiza, España, Guayana)', books: [
    'El terrorismo anarquista como propaganda por el hecho', 'Anarquistas vengadores',
    '1892–1894. La Epidemia Terrorista (Declaraciones de Ravachol y Émile Henry)', 'Cómo y por qué asesiné a la princesa Sissi',
    'La peste, la bestia y el monstruo: Johann Most', 'La conjura de los indomables' ] },
  { title: 'Auge del Anarquismo en el Cono Sur: Argentina y Uruguay', year: 1880, range: '1880–1930', region: 'Argentina y Uruguay', books: [
    'El movimiento anarquista en la Argentina (Hasta 1910)', 'La F.O.R.A. Ideología y trayectoria del movimiento obrero en la Argentina',
    'Los anarquistas en el Río de la Plata (1880-1910)', 'Los anarquistas expropiadores', 'Severino Di Giovanni', 'La Patagonia Rebelde',
    'El fusilamiento de Penina', 'La primera víctima del movimiento obrero (1901)', 'Orígenes del movimiento obrero en el Uruguay',
    'La primera huelga general en el Uruguay (1911)', 'La vida anárquica de Florencio Sánchez', 'Anarquismo trashumante. Crónicas de crotos y linyeras',
    'Juan Lazarte, Militante Social, Médico, Humanista', 'Historia Argentina (Tomos I, II y III)' ] },
  { title: 'Movimiento Obrero, Masacres y Acción Directa en Chile', year: 1890, range: '1890–1940', region: 'Chile', books: [
    'Sin Dios ni patrones. Historia del anarquismo en la región chilena (1890-1990)', 'Destruir para construir: violencia y acción directa en Chile (1890-1914)',
    'La propaganda por los hechos en el movimiento anarquista chileno (1890-1910)', 'Anarquismo y violencia popular en Chile (1898-1927)',
    'La masacre de la Escuela Santa María de Iquique (1907)', 'Entre el dolor y la ira, la venganza de Ramón Ramón',
    'Cuando la patria mata: la historia de Julio Rebosio (1914-1920)', 'Represión contra Voltaire Argandoña y Hortensia Quinio (1913)',
    'Rebeldía y libertad: José Domingo Gómez Rojas', 'Juan Gandulfo: el policlínico de la IWW (1923-1942)',
    'Wobblie. Hombres, ideas y problemas del anarquismo en los años veinte', 'Flora Sanhueza Rebolledo. Su lucha social en Iquique (1942-1974)',
    'Historia e historiografía del anarquismo en Chile (1980-2015)' ] },
  { title: 'Anarcosindicalismo en la Región Andina: Perú, Bolivia y Colombia', year: 1898, range: '1898–1945', region: 'Perú, Bolivia, Colombia y Paraguay', books: [
    'Anarquismo y sindicalismo en el Perú (1904-1929)', 'El anarcosindicalismo en el Perú', 'El anarcosindicalismo en el sur andino peruano',
    'La choledad antiestatal. El anarcosindicalismo en Bolivia (1912-1965)', 'Cocinando la revolución en la ciudad de La Paz (1927-1946)',
    'Los orígenes del anarquismo en Colombia', 'Pasado y presente del anarquismo en Colombia', 'La comuna de Encarnación', 'Barrett' ] },
  { title: 'El Movimiento Libertario en Brasil y Cuba', year: 1890, range: '1890–1940', region: 'Brasil, Cuba y América Latina', books: [
    'El movimiento obrero brasileño', 'El anarquismo en Cuba', 'Libertarias en América del Sur. De la A a la Z',
    'Contribución a una historia del anarquismo en América Latina', 'Repensar el anarquismo en América Latina',
    'Vanguardias silenciadas: tejidos de la memoria', 'La educación libertaria en la Argentina y en México (1861-1945)' ] },
  { title: 'La Revolución Mexicana y el Magonismo', year: 1900, range: '1900–1925', region: 'México y Sur de EE.UU.', books: [
    'Historia de la Revolución Mexicana', 'Ricardo Flores Magón, el apóstol de la revolución social', 'Revolución en Baja California, México (1911)',
    'Baja California heroica', 'Librado Rivera en el movimiento anarquista mexicano', 'Lazos indisolubles: Librado Rivera y Flores Magón',
    'Librado Rivera y los hermanos rojos en Tampico (1915-1930)', 'Librado Rivera. El indomable magonero',
    'El correo de la revolución magonista. Espías y revoltosos', 'El papel revolucionario de la prensa en México', 'Quién es Flores Magón y cuál su obra' ] },
  { title: 'La Escuela Moderna y la Semana Trágica de Barcelona', year: 1901, range: '1901–1909', region: 'España (Cataluña)', books: [
    'Francisco Ferrer i Guàrdia y la Escuela Moderna', 'La Revolución de Barcelona (Semana Trágica, 1909)', 'La Revolución de Cataluña',
    'Pedagogía libertaria española a inicios del siglo XX', 'Teresa Claramunt, la virgen roja barcelonesa' ] },
  { title: 'El Incidente de Alta Traición y el Anarquismo en Japón', year: 1910, range: '1910–1911', region: 'Japón', books: [
    'En contra del Dios-Emperador. Las ejecuciones en Japón (1911)', 'Contra el Dios Emperador. Juicios de la traición anarquista en Japón',
    'Kotoku, Osugi, Yamaga: tres anarquistas japoneses', 'Museihushugi: el anarquismo japonés', 'Reflexiones en el camino hacia la horca',
    'Los Mártires de Tokio y la Sociedad de la Guillotina' ] },
  { title: 'La Revolución Rusa, la Makhnovtchina y Kronstadt', year: 1917, range: '1917–1921', region: 'Rusia y Ucrania', books: [
    'La revolución desconocida', 'Los anarquistas en la Revolución Rusa: la Makhnovtchina (1919)', 'Historia del Movimiento Makhnovista',
    'La Revolución Rusa en Ucrania (1918-1921)', 'La Makhnovschina. Un movimiento bajo fuego en Ucrania', 'Kronstadt 1921',
    'La comuna de Kronstadt', 'Los anarquistas y los soviets', 'Chernoe Znamia (anarquistas rusos, 1900s)', 'La Banda de Chernopeev (Levantamiento de Ilinden, 1903)' ] },
  { title: 'Pistolerismo, Dictadura de Primo de Rivera y Fundación de la FAI', year: 1917, range: '1917–1931', region: 'España', books: [
    'Los anarquistas españoles. Los años heroicos (1868-1936)', 'Historia del movimiento obrero español I', 'El movimiento obrero en España, siglos XIX y XX',
    'Identidad política y cambio de paradigma estético en Barcelona', 'Líderes obreros y vanguardias culturales en Barcelona',
    'Tópicos y revisión historiográfica: Salvador Seguí', 'Tiempos de plomo. Grupos de Acción y Defensa Confederal',
    'Tras las huellas de una vida generosa: Aurelio Fernández y Los Solidarios', 'La búsqueda de la unidad anarquista: la FAI antes de la II República',
    'El anarquismo individualista en España (1923-1938)', 'La huelga de alquileres y el comité de defensa económica (1931)',
    'La revuelta de las mujeres (1918)', 'Eleuterio Quintanilla. Vida y obra del maestro', 'Antonia Maymón. Anarquista, maestra, naturista',
    'Puntos de fuga en la cultura obrera' ] },
  { title: 'El Caso Sacco y Vanzetti en Estados Unidos', year: 1920, range: '1920–1927', region: 'Estados Unidos', books: [
    'Bartolomeo Vanzetti: historia de la vida de un proletario', 'Sacco y Vanzetti. El enemigo extranjero', 'La pasión de Sacco y Vanzetti' ] },
  { title: 'Anarquismo Anticolonial en Asia y Redes Globales', year: 1890, range: '1890–1950', region: 'Internacional (Corea, China, Filipinas, África)', books: [
    'Revolución anarquista en Corea: la Comuna de Shinmin (1929-1932)', 'El anarquismo en China', 'Anarquismos no occidentales',
    'Anarquismo africano', 'El anarquismo en el espejo judío' ] },
  { title: 'La Revolución Española y la Guerra Civil', year: 1936, range: '1936–1939', region: 'España', books: [
    'Los anarquistas en la crisis política española (1869-1939)', 'El eco de los pasos', 'Homenaje a Cataluña', 'El corto verano de la anarquía',
    'Colectividades Libertarias', 'Las colectividades libertarias en España (1936-1938)', 'La experiencia autogestionaria durante la Guerra Civil',
    'Barricadas en Barcelona (Mayo 1937)', 'La revolución traicionada: Balius y Los Amigos de Durruti', 'Durruti en el laberinto', 'La muerte de Durruti',
    'Buenaventura Durruti (antología)', 'Buenaventura Durruti, o el heroísmo bien entendido', 'Durruti ha muerto, pero está vivo todavía', 'Fraternalmente, Emma',
    'Por qué perdimos la guerra (1940)', 'Los comités de defensa confederales', 'Milicias anarquistas y anarcosindicalistas en la guerra civil',
    'José Pellicer, el anarquista íntegro (Columna de Hierro)', 'Un incontrolado de la Columna de Hierro', 'Maroto, el héroe. Biografía del anarquismo andaluz',
    'Francisco Carreño y los arduos caminos de la anarquía', 'Juan Peiró, teórico y militante del anarcosindicalismo', 'Cipriano Mera', 'Vida y muerte de Ramón Acín',
    '19 de julio de 1936. España CNT-FAI', '1936. De la revolución española', 'Catálogo de decisiones y fragilidades', 'Anarcosindicalismo y revolución en España (1930-1937)' ] },
  { title: 'Mujeres Libres y Emancipación Femenina', year: 1936, range: '1936–1939', region: 'España', books: [
    'Mujeres Libres. España 1936-1939', 'Mujeres Libres: emancipación femenina y revolución social', 'El anarcofeminismo en España: las propuestas de Mujeres Libres',
    'Mujeres Libres (1936-1939). Una lectura feminista', 'Mujeres Libres', 'Discursos y experiencias: Mujeres Libres en la retaguardia oscense',
    'La miliciana en la Guerra Civil: realidad e imagen', 'Concha Pérez Collado: miliciana en la Guerra Civil', 'Lola Iturbe: vida e ideal de una luchadora anarquista',
    'Ada Martí Vall. El sueño de la conciencia libre' ] },
  { title: 'Antifascismo, Exilio y Resistencia Armada contra Franco', year: 1939, range: '1939–1975', region: 'España, Francia e Italia', books: [
    'El anarquismo español y la acción revolucionaria (1961-1974)', 'La resistencia Libertaria contra el Franquismo. El D.I.',
    'Los servicios secretos en España contra el Movimiento Libertario', 'Fidel Miró Solanes. Memorias de un catalán exiliado', 'El Internado Durruti',
    'Años rojos, años negros. La resistencia anarquista contra el fascismo en Italia', 'Pensar la utopía en acción. Trazas de un anarquista heterodoxo',
    'Los libertarios y la Memoria histórica' ] },
  { title: 'Mayo del 68, Situacionismo y Movimiento Autónomo', year: 1965, range: '1965–1980', region: 'Francia, Italia, Reino Unido y Países Bajos', books: [
    '1968. El año sublime de la acracia', 'La rebelión de Mayo 68', 'Los situacionistas y la anarquía', 'Qué fue la autonomía obrera',
    'El movimiento Provo', 'Días de sueño y de plomo', 'Nos estamos acercando: La historia de Angry Brigade', 'La Brigada de la Cólera', 'Anarquismo y anarquistas' ] },
  { title: 'Reorganización Libertaria y Lucha Anticarcelaria', year: 1975, range: '1975–2000', region: 'Francia, Bélgica, Uruguay y España', books: [
    'Odio las mañanas', 'Dentro contra fuera: la agitación en las cárceles belgas', 'O Inimigo do Rei, el grito irreverente de la anarquía (Brasil)',
    'La Federación Anarquista Uruguaya', 'Fuga (túneles de Punta Carretas)', 'Masacre en Jacinto Vera (Uruguay, 1994)', 'Okupa Madrid (1985-2011). Memoria, reflexión y autogestión' ] },
  { title: 'Insurreccionalismo Urbano y Revueltas en Europa', year: 2000, range: '2000–2010', region: 'Francia y Grecia', books: [
    'La revuelta de los Banlieusards (Francia, 2005)', 'A tres años de la revuelta griega (2008)', 'Reflexiones sobre el movimiento en Grecia y la solidaridad con presos políticos' ] },
  { title: 'Resistencias Contemporáneas y Descolonización', year: 2011, range: '2011–Presente', region: 'Siria (Rojava), Egipto y España', books: [
    'El experimento del Kurdistán oeste (Rojava, Siria)', 'El Anarquismo Descolonizado: experiencias en Egipto (1860-2016)',
    'Hacia un estudio decolonial del anarquismo. Egipto y Túnez', 'Los anarquistas y la Revolución Cubana: entre el júbilo y el desencanto',
    'Anarquismo en Polonia (Wojna 1)', 'Enrabiaos, apuntes sobre la spanishrevolution (15-M)' ] },
];

const eventos = [];
let totalLinked = 0;
const omitidos = [];
for (const s of SECTIONS) {
  const linked = [];
  for (const t of s.books) {
    const exs = resolverArr(t);
    if (exs.length) { for (const ex of exs) if (!linked.includes(ex)) linked.push(ex); }
    else omitidos.push(`${s.title} :: ${t}`);
  }
  totalLinked += linked.length;
  const decade = String(Math.floor(Number(s.year) / 10) * 10) + 's';
  eventos.push({
    year: s.year, decade, type: linked.length ? 'con_texto' : 'hecho',
    title: s.title, description: `${s.range} · ${s.region}`, region: s.region,
    category: 'historia', relatedTexts: linked,
  });
}

const raw = readFileSync(FILE, 'utf8');
const marker = 'export const timelineEvents = [';
const header = raw.slice(0, raw.indexOf(marker));
function serEvent(e, ind) {
  const f = [];
  f.push(`year: ${e.year}`);
  f.push(`decade: ${JSON.stringify(e.decade)}`);
  f.push(`type: ${JSON.stringify(e.type)}`);
  f.push(`title: ${JSON.stringify(e.title)}`);
  f.push(`description: ${JSON.stringify(e.description)}`);
  f.push(`region: ${JSON.stringify(e.region)}`);
  f.push(`category: ${JSON.stringify(e.category)}`);
  if (e.relatedTexts && e.relatedTexts.length) f.push(`relatedTexts: [${e.relatedTexts.map((t) => JSON.stringify(t)).join(', ')}]`);
  return `${ind}{\n${ind}  ${f.join(',\n' + ind + '  ')}\n${ind}}`;
}
const body = eventos.map((e, i) => serEvent(e, '  ') + (i < eventos.length - 1 ? ',' : '')).join('\n');
writeFileSync(FILE, header + marker + '\n' + body + '\n];\n', 'utf8');

console.log(`Secciones: ${SECTIONS.length} | eventos generados: ${eventos.length} | libros enlazados: ${totalLinked}`);
console.log(`Omitidos (no en catálogo): ${omitidos.length}`);
console.log(omitidos.join('\n'));
