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
    year: 1868,
    decade: '1860s',
    type: 'hecho',
    title: "Llegada del anarquismo a España",
    description: "Giuseppe Fanelli llega a España enviado por Bakunin, estableciendo los primeros grupos anarquistas.",
    region: "España",
    category: "movimiento",
    image: "🏴",
    quote: "La libertad sin socialismo es privilegio",
    author: "Mijaíl Bakunin"
  },
  {
    year: 1871,
    decade: '1870s',
    type: 'hecho',
    title: "La Comuna de París",
    description: "Primer gobierno obrero de la historia durante 72 días en París.",
    region: "Francia",
    category: "revolucion",
    image: "🚩",
    quote: "La comuna será la revolución",
    author: "Louise Michel"
  },
  {
    year: 1886,
    decade: '1880s',
    type: 'con_texto',
    title: "Mártires de Chicago",
    description: "Ejecución de anarquistas tras protestas por la jornada de 8 horas.",
    region: "Estados Unidos",
    category: "represion",
    image: "⚖️",
    quote: "Nuestro silencio será más poderoso",
    author: "August Spies",
    relatedTexts: ["Los Mártires de Chicago", "El origen del 1º de Mayo"]
  },
  {
    year: 1909,
    decade: '1900s',
    type: 'con_texto',
    title: "Semana Trágica de Barcelona",
    description: "Huelga general y revuelta anticlerical en Barcelona, brutalmente reprimida; ejecución de Ferrer i Guardia.",
    region: "España",
    category: "represion",
    image: "🔥",
    quote: "La escuela moderna contra el dogma",
    author: "Francesc Ferrer i Guardia",
    relatedTexts: ["Francisco Ferrer i Guardia y la Escuela Moderna", "Ricardo Mella y Francisco Ferrer i Guardia"]
  },
  {
    year: 1910,
    decade: '1910s',
    type: 'con_texto',
    title: "Fundación de la CNT",
    description: "Se funda la Confederación Nacional del Trabajo en Barcelona.",
    region: "España",
    category: "organizacion",
    image: "✊",
    quote: "Un sindicato revolucionario",
    author: "CNT",
    relatedTexts: ["Anarcosindicalismo y revolución en España (1930-1937)"]
  },
  {
    year: 1919,
    decade: '1910s',
    type: 'con_texto',
    title: "Semana Trágica Buenos Aires",
    description: "Represión violenta contra trabajadores en Argentina.",
    region: "Argentina",
    category: "represion",
    image: "💔",
    quote: "Historia de la lucha",
    author: "FORA",
    relatedTexts: ["La FORA"]
  },
  {
    year: 1921,
    decade: '1920s',
    type: 'con_texto',
    title: "Rebelión de Kronstadt",
    description: "Marineros se rebelan contra el gobierno bolchevique.",
    region: "Rusia",
    category: "revolucion",
    image: "⚓",
    quote: "Poder a los soviets",
    author: "Marineros",
    relatedTexts: ["Kronstadt 1921", "La comuna de Kronstadt", "La Revolución Rusa y el anarquismo", "Historia del Movimiento Makhnovista"]
  },
  {
    year: 1927,
    decade: '1920s',
    type: 'con_texto',
    title: "Ejecución de Sacco y Vanzetti",
    description: "Fusilados pese a las protestas mundiales; su caso se vuelve símbolo de la persecución anarquista.",
    region: "Estados Unidos",
    category: "represion",
    image: "⚖️",
    quote: "Me niego a perdonar a mis verdugos",
    author: "Bartolomeo Vanzetti",
    relatedTexts: ["La pasión de Sacco y Vanzetti"]
  },
  {
    year: 1936,
    decade: '1930s',
    type: 'con_texto',
    title: "Revolución Española",
    description: "Revolución anarquista en Cataluña y Aragón.",
    region: "España",
    category: "revolucion",
    image: "🏴‍☠️",
    quote: "Autogobierno obrero",
    author: "Buenaventura Durruti",
    relatedTexts: [
      "Columna Durruti",
      "Colectividades Libertarias",
      "Los Amigos de Durruti",
      "El corto verano de la anarquía",
      "Los anarquistas en la crisis política española (1869-1939)"
    ]
  },
  {
    year: 1968,
    decade: '1960s',
    type: 'hecho',
    title: "Mayo del 68",
    description: "Revueltas estudiantiles y obreras en Francia.",
    region: "Francia",
    category: "movimiento",
    image: "🎨",
    quote: "Seamos realistas, pidamos lo imposible",
    author: "Mayo 68"
  },
  {
    year: 1977,
    decade: '1970s',
    type: 'con_texto',
    title: "Jornadas Libertarias de Barcelona",
    description: "Tras la muerte de Franco, la CNT vuelve a la luz y organiza unas Jornadas Libertarias multitudinarias.",
    region: "España",
    category: "movimiento",
    image: "🏴",
    quote: "La CNT vuelve a la calle",
    author: "CNT",
    relatedTexts: ["Anarcosindicalismo y revolución en España (1930-1937)", "Anarquismo y anarquistas"]
  },
  {
    year: 1994,
    decade: '1990s',
    type: 'con_texto',
    title: "Levantamiento zapatista en Chiapas",
    description: "El EZLN se alza en México: autonomía indígena, mandar obedeciendo y autogobierno comunitario.",
    region: "México",
    category: "revolucion",
    image: "😷",
    quote: "Mandando obedecemos",
    author: "EZLN",
    relatedTexts: ["Tierra y Libertad", "Regeneración", "La bala y la escuela"]
  },
  {
    year: 1999,
    decade: '1990s',
    type: 'hecho',
    title: "Batalla de Seattle",
    description: "El movimiento antiglobalización bloquea la cumbre de la OMC en EE.UU. con acción directa masiva.",
    region: "Estados Unidos",
    category: "movimiento",
    image: "✊",
    quote: "Otro mundo es posible",
    author: "Movimiento antiglobalización"
  },
  {
    year: 2001,
    decade: '2000s',
    type: 'hecho',
    title: "Contracumbre de Génova",
    description: "Las protestas contra el G8 marcan el punto álgido del movimiento global; Carlo Giuliani es asesinado por la policía.",
    region: "Italia",
    category: "movimiento",
    image: "🏴",
    quote: "No a la guerra, no al G8",
    author: "Movimiento antiglobalización"
  },
  {
    year: 2011,
    decade: '2010s',
    type: 'hecho',
    title: "Movimiento 15M (Los Indignados)",
    description: "Acampadas y asambleas en plazas de toda España: democracia real ya, horizontalidad y autoorganización.",
    region: "España",
    category: "movimiento",
    image: "🏕️",
    quote: "No somos mercancía en manos de banqueros",
    author: "15M"
  },
  {
    year: 2012,
    decade: '2010s',
    type: 'con_texto',
    title: "Autonomía democrática de Rojava",
    description: "Kurdistán sirio declara su autogobierno: comunas autónomas, confederalismo democrático y ecología social.",
    region: "Siria",
    category: "organizacion",
    image: "🌱",
    quote: "La vida libre de las mujeres y los pueblos",
    author: "Confederalismo democrático",
    relatedTexts: ["El experimento del Kurdistán oeste (Kurdistán sirio)"]
  }
];
