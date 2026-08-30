// Línea temporal del archivo.
//
// Cada evento tiene un TIPO:
// - 'con_texto': tiene textos históricos reales vinculados en el catálogo.
//                Declara `relatedTexts` con los TÍTULOS exactos de esos textos.
// - 'hecho':    suceso significativo del que NO hay (o aún no) un texto propio
//               en el catálogo. No lleva `relatedTexts` y no muestra textos.
//
// IMPORTANTE (negocio): `relatedTexts` empareja por TÍTULO, no por región/país.
// Así el 15M (2011) enlaza SOLO con textos del 15M y no con la guerra civil,
// aunque ambos sean de España.
export const timelineEvents = [
  {
    year: -1800,
    decade: "-1800s",
    type: "con_texto",
    title: "Protoanarquismo, Utopías y Piratería",
    description: "1800 a.C. – 1780 d.C. · Mediterráneo y Caribe",
    region: "Mediterráneo y Caribe",
    category: "historia",
    relatedTexts: ["Utopías antiguas y modernas", "El anarquismo en la antigua Grecia"]
  },
  {
    year: 1868,
    decade: "1860s",
    type: "con_texto",
    title: "La Primera Internacional, Bakunin y la Comuna de París",
    description: "1868–1877 · Europa (Francia, Suiza, España)",
    region: "Europa (Francia, Suiza, España)",
    category: "historia",
    relatedTexts: ["La Comuna de París", "La comuna de París (antología)", "Bakunin-Netchaiev. El Catecismo Revolucionario", "Elisee Reclus. El geografo acrata y su paisaje de la libertad", "Memorias de un revolucionario"]
  },
  {
    year: 1886,
    decade: "1880s",
    type: "con_texto",
    title: "Los Mártires de Chicago y el nacimiento del 1º de Mayo",
    description: "1886 · Estados Unidos e Internacional",
    region: "Estados Unidos e Internacional",
    category: "historia",
    relatedTexts: ["Los Mártires de Chicago", "El origen del 1º de Mayo", "1º de mayo. Su origen y significado", "Los orígenes libertarios del Primero de Mayo: de Chicago a América Latina (1886-1930)"]
  },
  {
    year: 1880,
    decade: "1880s",
    type: "con_texto",
    title: "La Propaganda por el Hecho y el Magnicidio en Europa",
    description: "1880–1914 · Europa (Francia, Suiza, España, Guayana)",
    region: "Europa (Francia, Suiza, España, Guayana)",
    category: "historia",
    relatedTexts: ["El terrorismo anarquista como propaganda por el hecho", "1894. La Epidemia Terrorista. Declaraciones de Ravachol y de Emile Henry", "Cómo y porqué asesiné a la princesa Sissi", "La peste, la bestia y el monstruo: Johann Most", "La conjura de los indomables"]
  },
  {
    year: 1880,
    decade: "1880s",
    type: "con_texto",
    title: "Auge del Anarquismo en el Cono Sur: Argentina y Uruguay",
    description: "1880–1930 · Argentina y Uruguay",
    region: "Argentina y Uruguay",
    category: "historia",
    relatedTexts: ["El movimiento anarquista en la Argentina (Desde sus inicios hasta 1910)", "La F. O. R. A. Ideologia y trayectoria del movimiento obrero en la Argentina", "Los anarquistas expropiadores", "Severino Di Giovanni", "La Patagonia Rebelde", "El fusilamiento de Penina", "La primera víctima del movimiento obrero. El discurso anarquista sobre la muerte (Argentina)", "Orígenes del movimiento obrero en el Uruguay", "La primera huelga general en el Uruguay (23 de mayo de 1911)", "La vida anárquica de Florencio Sánchez", "Anarquismo trashumante. Crónicas de crotos y linyeras", "Historia ArgentinaDesde la aparicion del hombre hasta la obra de M. M. de Guemes", "Historia ArgentinaDesde la liberacion de Chile hasta la constitucion de la Provincia de Bs. As.", "Historia ArgentinaDesde la presidencia de Urquiza a la eleccion de H. Yrigoyen"]
  },
  {
    year: 1890,
    decade: "1890s",
    type: "con_texto",
    title: "Movimiento Obrero, Masacres y Acción Directa en Chile",
    description: "1890–1940 · Chile",
    region: "Chile",
    category: "historia",
    relatedTexts: ["Sin Dios ni patrones. Historia del anarquismo en la región chilena (1890-1990)", "Destruir para construir: violencia y acción directa en la corriente anarquista chilena (1890-1914)", "La propaganda por los hechos en el movimiento anarquista chileno (1890-1910)", "Anarquismo y violencia popular en Chile (1898-1927)", "La masacre de la Escuela Santa María de Iquique", "Entre el dolor y la ira, la venganza de Ramón Ramón", "Cuando la patria mata: la historia del anarquista Julio Rebosio (1914-1920)", "Represión contra los anarquistas: Voltaire Argandoña y Hortensia Quinio (Santiago, 1913)", "Rebeldía y libertad: José Domingo Gómez Rojas", "Juan Gandulfo: la hoja sanitaria, el policlínico de la IWW y su legado (1923-1942)", "Wobblie. Hombres, ideas y problemas del anarquismo en los años veinte", "Flora Sanhueza Rebolledo. Su lucha social en Iquique (1942-1974)", "Historia e historiografía del anarquismo en Chile (1980-2015)"]
  },
  {
    year: 1898,
    decade: "1890s",
    type: "con_texto",
    title: "Anarcosindicalismo en la Región Andina: Perú, Bolivia y Colombia",
    description: "1898–1945 · Perú, Bolivia, Colombia y Paraguay",
    region: "Perú, Bolivia, Colombia y Paraguay",
    category: "historia",
    relatedTexts: ["Anarquismo y sindicalismo en el Perú (1904-1929)", "El anarcosindicalismo en el Perú", "El anarcosindicalismo en el sur andino peruano: Arequipa, Mollendo, Cusco, Puno", "La choledad antiestatal. El anarcosindicalismo en el movimiento obrero boliviano (1912-1965)", "Cocinando la revolución en la ciudad de La Paz (1927-1946)", "Los orígenes del anarquismo en Colombia y su relación con el liberalismo", "Pasado y presente del anarquismo y del anarcosindicalismo en Colombia", "La comuna de Encarnación", "Barrett"]
  },
  {
    year: 1890,
    decade: "1890s",
    type: "con_texto",
    title: "El Movimiento Libertario en Brasil y Cuba",
    description: "1890–1940 · Brasil, Cuba y América Latina",
    region: "Brasil, Cuba y América Latina",
    category: "historia",
    relatedTexts: ["El movimiento obrero brasileño", "El anarquismo en Cuba", "Libertarias en América del Sur. De la A a la Z", "Contribución a una historia del anarquismo en América Latina", "Repensar el anarquismo en América Latina: historias, epistemes, luchas y otras formas de organización", "Vanguardias silenciadas: tejidos de la memoria", "La educación libertaria en la Argentina y en México (1861-1945)"]
  },
  {
    year: 1900,
    decade: "1900s",
    type: "con_texto",
    title: "La Revolución Mexicana y el Magonismo",
    description: "1900–1925 · México y Sur de EE.UU.",
    region: "México y Sur de EE.UU.",
    category: "historia",
    relatedTexts: ["Historia de la Revolucion Mexicana", "Ricardo Flores Magon, el apostol de la revolucion social mexicana", "Revolución en Baja California, México (1911)", "Baja California heroica", "Librado Rivera en el movimiento anarquista mexicano", "Lazos indisolubles de una amistad revolucionaria. Librado Rivera y Ricardo Flores Magon", "Librado Rivera y los hermanos rojos en el movimiento social y cultural anarquista en Villa Cecilia y Tampico, Tamaulipas, 1915-1930", "Librado Rivera. El indomable magonero", "El correo de la revolucion magonista. Espias y revoltosos", "El papel revolucionario de la prensa en el movimiento obrero anarquista mexicano", "Quién es Flores Magón y cuál su obra"]
  },
  {
    year: 1901,
    decade: "1900s",
    type: "con_texto",
    title: "La Escuela Moderna y la Semana Trágica de Barcelona",
    description: "1901–1909 · España (Cataluña)",
    region: "España (Cataluña)",
    category: "historia",
    relatedTexts: ["Francisco Ferrer i Guardia y la Escuela Moderna", "La Revolución de Barcelona (Semana Trágica, 1909)", "La Revolución de Cataluña", "Pedagogía libertaria española a inicios del siglo XX", "Teresa Claramunt, la virgen roja barcelonesa"]
  },
  {
    year: 1910,
    decade: "1910s",
    type: "con_texto",
    title: "El Incidente de Alta Traición y el Anarquismo en Japón",
    description: "1910–1911 · Japón",
    region: "Japón",
    category: "historia",
    relatedTexts: ["En contra del Dios-Emperador. Las ejecuciones de anarquistas en el Japn (1911)", "Contra el Dios Emperador. Juicios de la traición anarquista en Japón", "Kotoku, Osugi, Yamaga: tres anarquistas japoneses", "Museihushugi: el anarquismo japonés", "Reflexiones en el camino hacia la horca", "Los Mártires de Tokio y la Sociedad de la Guillotina"]
  },
  {
    year: 1917,
    decade: "1910s",
    type: "con_texto",
    title: "La Revolución Rusa, la Makhnovtchina y Kronstadt",
    description: "1917–1921 · Rusia y Ucrania",
    region: "Rusia y Ucrania",
    category: "historia",
    relatedTexts: ["La revolución desconocida", "Los anarquistas en la Revolución Rusa: la Makhnovtchina (Ucrania 1919)", "Historia del Movimiento Makhnovista", "La Revolución Rusa en Ucrania (1918-1921)", "La Makhnovschina. Un movimiento libertario bajo fuego en Ucrania (1918-1921)", "Kronstadt 1921", "La comuna de Kronstadt", "Los anarquistas y los soviets", "Chernoe Znamia (anarquistas rusos, 1900s)", "La Banda de Chernopeev"]
  },
  {
    year: 1917,
    decade: "1910s",
    type: "con_texto",
    title: "Pistolerismo, Dictadura de Primo de Rivera y Fundación de la FAI",
    description: "1917–1931 · España",
    region: "España",
    category: "historia",
    relatedTexts: ["Los anarquistas españoles. Los años heroicos (1868-1936)", "Historia del movimiento obrero espanol I", "El movimiento obrero en Espana, siglos XIX y XX", "Identidad politica y cambio de paradigma estetico en el anarquismo barcelones", "Lideres obreros y vanguardias culturales. La presencia del obrerismo en la Barcelona de la primera posguerra europea", "Tiempos de plomo. Grupos de Accin y Defensa Confederal", "La búsqueda de la unidad anarquista: la FAI antes de la II República", "El anarquismo individualista en España (1923-1938)", "La huelga de alquileres y el comite de defensa economica", "La revuelta de las mujeres", "Eleuterio Quintanilla. Vida y obra del maestro", "Antonia Maymon. Anarquista, maestra, naturista.", "Puntos de fuga en la cultura obrera"]
  },
  {
    year: 1920,
    decade: "1920s",
    type: "con_texto",
    title: "El Caso Sacco y Vanzetti en Estados Unidos",
    description: "1920–1927 · Estados Unidos",
    region: "Estados Unidos",
    category: "historia",
    relatedTexts: ["Bartolomeo Vanzetti: historia de la vida de un proletario", "Sacco y Vanzetti. El enemigo extranjero", "La pasión de Sacco y Vanzetti"]
  },
  {
    year: 1890,
    decade: "1890s",
    type: "con_texto",
    title: "Anarquismo Anticolonial en Asia y Redes Globales",
    description: "1890–1950 · Internacional (Corea, China, Filipinas, África)",
    region: "Internacional (Corea, China, Filipinas, África)",
    category: "historia",
    relatedTexts: ["Revolución anarquista en Corea: la Comuna de Shinmin (1929-1932)", "El anarquismo en China", "Anarquismos no occidentales", "Anarquismo africano", "El anarquismo en el espejo judío"]
  },
  {
    year: 1936,
    decade: "1930s",
    type: "con_texto",
    title: "La Revolución Española y la Guerra Civil",
    description: "1936–1939 · España",
    region: "España",
    category: "historia",
    relatedTexts: ["Los anarquistas en la crisis política española (1869-1939)", "El eco de los pasos", "Homenaje a Cataluña", "Colectividades Libertarias", "Las colectividades libertarias en España (1936-1938)", "La experiencia autogestionaria durante la Guerra Civil española", "Barricadas en Barcelona", "Durruti en el laberinto", "La muerte de Durruti", "Buenaventura Durruti (antología)", "Durruti ha muerto, pero está vivo todavía", "Fraternalmente, Emma", "Por que perdimos la guerra (1940)", "Los comitиs de defensa confederales", "Milicias anarquistas y anarcosindicalistas en la guerra civil espaola", "Jose Pellicer, el anarquista integro", "Un incontrolado de la Columna de Hierro", "Maroto, el heroe. Una biografia del anarquismo andaluz", "Francisco Carreno y los arduos caminos de la anarquia", "Juan Peiró, teórico y militante del anarcosindicalismo español", "Cipriano Mera", "Vida y muerte de Ramón Acín", "1936. De la revolución española", "Catalogo de decisiones y fragilidades", "Anarcosindicalismo y revolución en España (1930-1937)"]
  },
  {
    year: 1936,
    decade: "1930s",
    type: "con_texto",
    title: "Mujeres Libres y Emancipación Femenina",
    description: "1936–1939 · España",
    region: "España",
    category: "historia",
    relatedTexts: ["Mujeres Libres. España 1936-1939", "Mujeres Libres: emancipación femenina y revolución social", "El anarcofeminismo en España: las propuestas de Mujeres Libres", "Mujeres Libres (1936-1939). Una lectura feminista", "Mujeres Libres", "Discursos y experiencias femeninas en el anarquismo espanol. Mujeres Libres en la retaguardia oscense", "La miliciana en la Guerra Civil: realidad e imagen", "Concha Pérez Collado: anarquista, miliciana en la Guerra Civil española", "Lola Iturbe: vida e ideal de una luchadora anarquista", "Ada Marti Vall. El sueno de la conciencia libre"]
  },
  {
    year: 1939,
    decade: "1930s",
    type: "con_texto",
    title: "Antifascismo, Exilio y Resistencia Armada contra Franco",
    description: "1939–1975 · España, Francia e Italia",
    region: "España, Francia e Italia",
    category: "historia",
    relatedTexts: ["El anarquismo espaol y la accin revolucionaria (1961-1974)", "La resistencia Libertaria contra el Franquismo. El D.I.", "Los servicios secretos en Espaa. La represin contra el Movimiento Libertario espaol", "El Internado Durruti", "Años rojos, años negros. La resistencia anarquista contra el fascismo en Italia", "Los libertarios y la Memoria histrica"]
  },
  {
    year: 1965,
    decade: "1960s",
    type: "con_texto",
    title: "Mayo del 68, Situacionismo y Movimiento Autónomo",
    description: "1965–1980 · Francia, Italia, Reino Unido y Países Bajos",
    region: "Francia, Italia, Reino Unido y Países Bajos",
    category: "historia",
    relatedTexts: ["1968. El ano sublime de la acracia", "La rebelión de Mayo 68", "Los situacionistas y la anarquia", "Que fue la autonomia obrera", "El movimiento Provo", "Días de sueño y de plomo", "Nos estamos acercando: La historia de Angry Brigade", "La Brigada de la Cólera"]
  },
  {
    year: 1975,
    decade: "1970s",
    type: "con_texto",
    title: "Reorganización Libertaria y Lucha Anticarcelaria",
    description: "1975–2000 · Francia, Bélgica, Uruguay y España",
    region: "Francia, Bélgica, Uruguay y España",
    category: "historia",
    relatedTexts: ["Odio las mañanas", "Dentro contra fuera, sobre la agitacion dentro y fuera de las carceles belgas", "O Inimigo do Rei, el grito irreverente y osado de la anarquía", "La Federación Anarquista Uruguaya", "Fuga (túneles de Punta Carretas)", "Masacre en Jacinto Vera", "Okupa Madrid (1985-2011). Memoria, reflexion, debate y autogestion"]
  },
  {
    year: 2000,
    decade: "2000s",
    type: "con_texto",
    title: "Insurreccionalismo Urbano y Revueltas en Europa",
    description: "2000–2010 · Francia y Grecia",
    region: "Francia y Grecia",
    category: "historia",
    relatedTexts: ["A tres años de la revuelta griega", "Reflexiones sobre el movimiento anarquista en Grecia y la solidaridad con los presos políticos"]
  },
  {
    year: 2011,
    decade: "2010s",
    type: "con_texto",
    title: "Resistencias Contemporáneas y Descolonización",
    description: "2011–Presente · Siria (Rojava), Egipto y España",
    region: "Siria (Rojava), Egipto y España",
    category: "historia",
    relatedTexts: ["El experimento del Kurdistán oeste (Kurdistán sirio)", "El Anarquismo Descolonizado: una historia de las experiencias antiautoritarias en Egipto (1860-2016)", "Hacia un estudio decolonial del anarquismo. Egipto y Túnez", "Los anarquistas y la Revolución Cubana: entre el júbilo y el desencanto", "Anarquismo en Polonia (Wojna 1)", "Enrabiaos, apuntes sobre la spanishrevolution"]
  }
];
