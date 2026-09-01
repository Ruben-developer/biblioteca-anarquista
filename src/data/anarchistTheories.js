// Ramas y corrientes del anarquismo (menú "Teorías").
// Cada corriente referencia obras del catálogo por su TÍTULO exacto (los
// enlaces se resuelven contra regionData.js en TheoriesView).
export const anarchistTheories = [
  {
    id: 'anarcocomunismo',
    name: 'Anarcomunismo',
    icon: '🌾',
    description: 'La corriente más influyente: abolición del Estado Y de la propiedad privada, producción y reparto según necesidades y capacidades, con los recursos en común.',
    keyIdeas: ['Comunismo libertario', 'De cada cual según sus capacidades, a cada cual según sus necesidades', 'Apoyo mutuo como ley evolutiva', 'Comuna como unidad de base'],
    keyAuthors: ['Piotr Kropotkin', 'Errico Malatesta', 'Élisée Reclus', 'Joseph Déjacque', 'Luigi Fabbri', 'Max Nettlau', 'Louise Michel'],
    books: [
      'La Conquista del Pan',
      'La conquista del pan: volviendo a una obra de Kropotkin',
      'A los jóvenes',
      'El pensamiento de Kropotkin: ciencia, ética y anarquía',
      '¿Qué es la Anarquía? (basado en el ABC del comunismo libertario de Berkman)',
      'La Anarquía y el Método del Anarquismo',
      'En el café',
      'Evolución, revolución y anarquismo',
      'El ideal anarquista',
      '¡Abajo los jefes!',
      'Crítica revolucionaria',
      'Influencias burguesas sobre el anarquismo',
      'La Revolución Rusa y el anarquismo',
      'Comunismo autoritario y comunismo libertario',
      'La lucha contra el Estado',
      'La responsabilidad y la solidaridad en la lucha obrera',
    ]
  },
  {
    id: 'anarcosindicalismo',
    name: 'Anarcosindicalismo',
    icon: '⚒️',
    description: 'El sindicato como escuela y vanguardia de la revolución: la organización obrera de masas, por federación y acción directa, como embrión de la sociedad futura.',
    keyIdeas: ['Acción directa y huelga general', 'El sindicato como organización de la clase trabajadora', 'Federalismo sindical', 'Neutralidad política (no a los partidos)'],
    keyAuthors: ['Rudolf Rocker', 'CNT', 'FORA', 'Emile Pouget', 'Diego Abad de Santillán', 'Eduardo Colombo'],
    books: [
      'Anarcosindicalismo en el siglo XXI',
      'Sindicalismo en la empresa y el territorio',
      'El sujeto de la acción revolucionaria',
      'Páginas selectas'
    ]
  },
  {
    id: 'anarcocolectivismo',
    name: 'Anarcocolectivismo',
    icon: '🤝',
    description: 'La propuesta de Bakunin y la Internacional: socialización de los medios de producción en colectividades de trabajadores, manteniendo el salario por trabajo realizado en la transición.',
    keyIdeas: ['Colectivización de los medios de producción', 'Retribución según el trabajo', 'Rechazo del Estado y de la autoridad', 'Antiautoritarismo frente a Marx'],
    keyAuthors: ['Mijaíl Bakunin', 'James Guillaume', 'Elena Sánchez Gómez', 'Frank Mintz'],
    books: [
      'Dios y el Estado',
      'Federalismo, socialismo y antiteologismo',
      'El principio de autoridad',
      'El patriotismo',
      'Kant y Bakunin',
      'Bakunin y sus persistentes calumniadores'
    ]
  },
  {
    id: 'mutualismo',
    name: 'Mutualismo',
    icon: '🔁',
    description: 'La propuesta de Proudhon: intercambio de productos del trabajo a precio de coste, con crédito y cooperación libre, sin Estado ni explotación.',
    keyIdeas: ['La propiedad es un robo', 'Intercambio justo y reciprocidad', 'Crédito mutualista / banca del pueblo', 'Federalismo político'],
    keyAuthors: ['Pierre-Joseph Proudhon'],
    books: [
      '¿Qué es la Propiedad?',
      'El principio federativo',
      'Política unitaria',
      'La capacidad política de la clase obrera',
      'Amor y matrimonio',
      'Propiedad intelectual: una crítica libertaria'
    ]
  },
  {
    id: 'anarcoindividualismo',
    name: 'Anarcoindividualismo',
    icon: '⭐',
    description: 'El individuo como fin supremo: autonomía personal frente a toda colectividad, asociación voluntaria y rechazo de la moral impuesta.',
    keyIdeas: ['El único y su propiedad', 'Soberanía del individuo', 'Asociación voluntaria y efímera', 'Egoísmo ético'],
    keyAuthors: ['Max Stirner', 'Benjamin Tucker', 'Émile Armand', 'Renzo Novatore', 'Miguel Giménez Igualada', 'Johann Most', 'Ricardo Mella'],
    books: [
      'El único y su propiedad',
      'Socialismo de Estado y anarquismo',
      'El anarquismo individualista como vida y actividad',
      'El anarquismo individualista. Lo que es, vale y puede',
      'El individualismo anarquista',
      'Individualismo anarquista y camaradería amorosa',
      'Individualismo y Comunismo',
      'La acción como propaganda',
      'Lombroso y los anarquistas',
      'Del amor',
      'La coacción moral',
      'Nueva Utopía'
    ]
  },
  {
    id: 'anarcofeminismo',
    name: 'Anarcofeminismo',
    icon: '✊',
    description: 'La emancipación de la mujer como parte inseparable de la revolución: no hay libertad sin autonomía de género, sexual y reproductiva.',
    keyIdeas: ['La liberación de la mujer es la liberación de todas', 'Autonomía y educación de la mujer', 'Mujeres Libres y organizaciones propias', 'Crítica a la familia y al matrimonio'],
    keyAuthors: ['Emma Goldman', 'Mujeres Libres', 'Lucía Sánchez Saornil', 'Peggy Kornegger', 'Alma Méijome Tejero'],
    books: [
      'Anarquismo: la conexión feminista',
      'Anarcofeminismo e identidad(es)',
      'Anarquismo y sexualidad',
      'De la anarquia academicista a la realidad socioterritorial'
    ]
  },
  {
    id: 'anarquismo-verde',
    name: 'Anarquismo Verde',
    icon: '🌿',
    description: 'Crítica radical a la civilización industrial: desde la ecología social de Bookchin hasta el primitivismo de Kaczynski, pasando por el antidesarrollismo y la liberación animal.',
    keyIdeas: ['La crisis ecológica es una crisis social', 'Municipalismo libertario', 'Antidesarrollismo y decrocimiento', 'Liberación animal y anarcoveganismo'],
    keyAuthors: ['Murray Bookchin', 'Peter Gelderloos', 'Miquel Amorós', 'Andrew Flood', 'Ted Kaczynski', 'Juanma Agulles'],
    books: [
      '¿Anarquismo o barbarie? Historia, civilización y progreso',
      'Anarquismo social o anarquismo personal',
      'Una solución anarquista al calentamiento global',
      '¡Escucha, marxista!',
      'Tecnología y anarquismo',
      'El anarquismo y el movimiento ambiental',
      'Contra la nocividad. Anarquismo, antidesarrollismo, revolución',
      'Perspectivas antidesarrollistas',
      'Fuck Green New Deal. Colapso y alternativas',
      'El tren de los dirigentes. Conferencia sobre el TAV',
      'Encendiendo la llama del ecologismo revolucionario',
      'La vida administrada. Sobre el naufragio social',
      'La plaga de nuestro tiempo',
      'La sociedad industrial y su futuro',
      'Civilización, primitivismo y anarquismo',
      'Anarcoveganismo y naturismo libertario',
      'Los veganarquistas',
      'Bioterios y experimentación animal en Chile',
      'El altruismo como factor de la evolución'
    ]
  },
  {
    id: 'plataformismo',
    name: 'Plataformismo y especifismo',
    icon: '🎯',
    description: 'Organización específica de anarquistas con unidad teórica y táctica, nacida del exilio ruso de Makhno y Arshinov: una plataforma común frente a la dispersión.',
    keyIdeas: ['Unidad teórica y táctica', 'Responsabilidad colectiva', 'Organización específica de militantes', 'Ligazón con los movimientos populares'],
    keyAuthors: ['Néstor Makhno', 'Piotr Arshinov', 'Patrick Rossineri', 'George Fontenis', 'Amigos de Durruti', 'José Antonio Gutiérrez'],
    books: [
      'Plataforma organizacional de los comunistas libertarios',
      'El debate sobre La Plataforma',
      'Entre la plataforma y el partido',
      'Hacia una nueva revolucin',
      'El mensaje revolucionario de Los Amigos de Durruti',
      'Organización Ácrata. Propuestas y debates',
      'La importancia de la crítica en el desarrollo del movimiento revolucionario'
    ]
  },
  {
    id: 'insurreccionalismo',
    name: 'Insurreccionalismo',
    icon: '🔥',
    description: 'La revolución como acto espontáneo de los de abajo: acción directa, expropiación y propaganda por el hecho, sin vanguardia que la conduzca.',
    keyIdeas: ['Propaganda por el hecho', 'Acción directa sin mediación', 'Expropiación individual y colectiva', 'Crítica a la organización permanente'],
    keyAuthors: ['Miguel Amorós', 'Amigos de Durruti', 'Alfredo M. Bonanno', 'Comité Invisible', 'Tiqqun', 'CrimethInc', 'Andrew Flood'],
    books: [
      'Autogestión',
      'La insurrección que llega',
      'Introducción a la guerra civil',
      'Archipiélago. Afinidad, organización informal y proyectos insurreccionales',
      'Cuando se señala la luna... A vueltas con el insurreccionalismo',
      'Anarquismo, insurrecciones e insurreccionalismo',
      'Grupos de afinidad. Una parte esencial de la organización anarquista',
      'Anarquía profesional y desarme teórico',
      'Golpes y contragolpes',
      'Cómo la no violencia protege al Estado',
      'Apuntes sobre revuelta y guerra social',
      'Cuadernos de negación',
      'Antes del momento'
    ]
  },
  {
    id: 'lucha-anticarcelaria',
    name: 'Lucha anticarcelaria y autodefensa',
    icon: '⛓️',
    description: 'La cárcel como institución represiva del sistema capitalista: abolicionismo penal, acción directa y autodefensa como herramientas de liberación.',
    keyIdeas: ['Abolicionismo penal', 'Autodefensa y resistencia', 'Acción directa económica', 'Crítica a la institución carcelaria'],
    keyAuthors: ['Varios Autores', 'Carlos Malato'],
    books: [
      'La cárcel en Chile. Análisis penal y experiencia carcelaria',
      'Podrán detenernos pero no pararnos',
      'Manual de desobediencia economica',
      'Los papeles de Albert Mason, Volumen I. Accion Directa Economica',
      'Manual del manifestante'
    ]
  },
  {
    id: 'pedagogia-racionalista',
    name: 'Pedagogía racionalista y antiautoritaria',
    icon: '📖',
    description: 'La escuela como laboratorio de libertad: educación integral, laica y científica, sin premios ni castigos, al servicio de la emancipación.',
    keyIdeas: ['Educación integral (física, intelectual, moral)', 'Laicismo y racionalismo', 'Autogestión pedagógica', 'La Escuela Moderna como proyecto global'],
    keyAuthors: ['Francisco Ferrer i Guardia', 'Ricardo Mella', 'Pedro García Olivo', 'Frank Mintz', 'Hugues Lenoir', 'Valeria Giacomoni'],
    books: [
      'La Escuela Moderna',
      'Ricardo Mella y Francisco Ferrer i Guardia',
      'Anarquismo y educación: la propuesta sociopolítica de la pedagogía libertaria',
      'Una molesta piedra en el camino: educación anarquista',
      'Educación y pedagogía en la tradición libertaria',
      'La evolución del concepto de pedagogía libertaria',
      'Paideia, la escuela de la anarquía. 34 años de educación libertaria',
      'El educador mercenario (Escrituras ahuyentables I)',
      'El enigma de la docilidad'
    ]
  },
  {
    id: 'sin-adjetivos',
    name: 'Anarquismo sin adjetivos, síntesis y filosofía general',
    icon: '🔮',
    description: 'El anarquismo como doctrina unitaria que trasciende las corrientes: síntesis de las diferentes tendencias, reflexión filosófica y debate sobre la identidad libertaria.',
    keyIdeas: ['Síntesis de las corrientes anarquistas', 'Anarquismo sin adjetivos', 'Filosofía general de la anarquía', 'Debate identitario libertario'],
    keyAuthors: ['Fernando Tarrida Mármol', 'Sébastien Faure', 'Volin', 'Daniel Guérin', 'Diego Abad de Santillán', 'Tomás Ibáñez', 'Peter Gelderloos', 'Colin Ward', 'Michael Albert'],
    books: [
      'La síntesis del anarquismo',
      'El anarquismo sin adjetivos: de ayer a hoy',
      'El lenguaje libertario. Antología del pensamiento anarquista contemporáneo',
      'Cabezas de tormenta. Ensayos sobre lo ingobernable',
      'Pensadores anarquistas',
      'El pensamiento anarquista - Antologia',
      'Anarquismo: de la teoría a la práctica',
      'Anarquismo básico',
      'El anarquismo como doctrina y movimiento',
      'Senderos de libertad',
      'Sobre el anarquismo',
      'Anarquismo: argumentos a favor y en contra',
      'Actualidad del anarquismo',
      '¿Qué significado tendrá mañana el anarquismo?',
      'Hacia un nuevo anarquismo',
      'Bitácora de la Utopía: Anarquismo para el Siglo XXI',
      'La Anarquía Funciona',
      'El principio moral de la Anarquia',
      'En torno a nuestros objetivos libertarios',
      'El problema de la libertad',
      'Preguntas frecuentes sobre el anarquismo',
      'Reflexiones para un mundo libre',
      'Por una teoría propia',
      'El anarquismo en la sociedad actual. Entrevistas X Aniversario Portal Libertario OACA',
      'Mi anarquismo y otros escritos',
      'Anarquismo hoy',
      'Curso de teoría política',
      'Antirracionalismo',
      '¡¿Anarquismo?'
    ]
  },
  {
    id: 'critica-estado',
    name: 'Crítica al Estado, la democracia y el Derecho',
    icon: '⚖️',
    description: 'El anarquismo frente a las instituciones del poder: crítica radical a la democracia, al sistema judicial, al fiscalismo y a la ideología democrática como forma de dominación.',
    keyIdeas: ['Crítica a la democracia representativa', 'El Derecho como herramienta de dominación', 'Anti-juridismo y anti-fiscalismo', 'El Estado como violentador de la libertad'],
    keyAuthors: ['Eduardo Colombo', 'Miriam Qarmat', 'Aníbal A. D\'Auria', 'Diego Abad de Santillán'],
    books: [
      'Contra la democracia',
      'La voluntad del pueblo. Democracia y anarquía',
      'Contra los jueces. El discurso anarquista en sede judicial',
      'El ocaso de la ideología democrática',
      'Las cargas tributarias',
      'Las 12 pruebas de la inexistencia de Dios',
      'La Semana Santa. Los atentados',
      'Los males de la guerra'
    ]
  },
  {
    id: 'post-izquierda',
    name: 'Anarquismo postizquierda, situacionismo y autonomía',
    icon: '🌀',
    description: 'La crítica anarquista a la izquierda tradicional: autonomía obrera, situacionismo, artificialismo y las zonas temporalmente autónomas como espacio de revuelta.',
    keyIdeas: ['Crítica a la izquierda del capitalismo', 'Autonomía obrera y autogestión', 'Situacionismo y construcciones de situaciones', 'TAZ como espacio de libertad temporal'],
    keyAuthors: ['Hakim Bey', 'David Graeber', 'Miquel Amorós', 'Maximilien Rubel'],
    books: [
      'TAZ: Zona Temporalmente Autónoma',
      'Fragmentos de antropología anarquista',
      'Las interzonas anarquistas',
      'El manifiesto negro',
      'Marx anarquista'
    ]
  },
  {
    id: 'ciberactivismo',
    name: 'Ciberactivismo, tecnocrítica y contravigilancia',
    icon: '💻',
    description: 'El anarquismo en la era digital: hacktivismo, software libre, critique de la vigilancia y guerrilla de la comunicación como formas de resistencia.',
    keyIdeas: ['Hacktivismo y software libre', 'Crítica a la vigilancia estatal y corporativa', 'Guerrilla de la comunicación', 'Anarquismo y tecnología'],
    keyAuthors: ['Carlos Gradin', 'Vladimir Garay', 'CrimethInc'],
    books: [
      'Internet, hackers y software libre',
      'Hacktivismo, Software Libre y Anarquismo',
      'La historia del cerebro anarquista de Anonymous',
      'Tecnología y vigilancia en la Operación Huracán',
      'Manual de guerrilla de la comunicacion'
    ]
  },
  {
    id: 'confederalismo',
    name: 'Confederalismo democrático y anarquismos no occidentales',
    icon: '🌍',
    description: 'El anarquismo más allá de Europa y América: confederalismo democrático de Öcalan, anarquismo en China, y reflexiones sobre el contexto global.',
    keyIdeas: ['Confederalismo democrático', 'Autonomía kurda', 'Anarquismo en contextos no occidentales', 'Crítica al occidentalismo'],
    keyAuthors: ['Abdullah Öcalan', 'Jason Adams', 'Ba Jin', 'Víctor García'],
    books: [
      'Confederalismo Democrático',
      'Anarquismos no occidentales. Reflexiones sobre el contexto global',
      'Problemas del anarquismo y la revolución en China',
      'América, hoy'
    ]
  },
  {
    id: 'critica-marxismo',
    name: 'Crítica libertaria al marxismo y al totalitarismo',
    icon: '🔴',
    description: 'La crítica anarquista al marxismo-leninismo y a los totalitarismos del siglo XX: desde la revolución rusa hasta el stalinismo, pasando por la desilusión de Goldman.',
    keyIdeas: ['Crítica al leninismo y al stalinismo', 'La revolución rusa desde el anarquismo', 'Totalitarismo y represión', 'Desilusión y ruptura con la izquierda'],
    keyAuthors: ['Agustín Guillamón', 'Gastón Leval', 'Emma Goldman', 'Felipe Alaiz', 'Diego Abad de Santillán'],
    books: [
      'La revolución rusa. Una interpretación crítica y libertaria',
      'Mi mayor desilusión con Rusia',
      'La zarpa de Stalin sobre Europa',
      'Los anarquistas y la reaccion contemporanea',
      'Rompamos las cadenas'
    ]
  },
  {
    id: 'cultura-libertaria',
    name: 'Cultura libertaria',
    icon: '🎭',
    description: 'Arte, literatura y cultura desde la anarquía: poesía, narrativa, ensayo y creación artística como herramientas de emancipación y transformación social.',
    keyIdeas: ['Arte como propaganda', 'Literatura y anarquismo', 'Cultura popular y transformación', 'Poesía de combate'],
    keyAuthors: ['Herbert Read', 'Dan Connor', 'Rafael Gumucio', 'Varios Autores'],
    books: [
      'Arte, poesía, anarquismo',
      'Anarquía y orden',
      'Lirios y cañonazos: la prosa anarquista de Vicente Huidobro',
      'Utopistas, anarquistas y rebeldes'
    ]
  },
  {
    id: 'anarquismos-contemporaneos',
    name: 'Anarquismos contemporáneos',
    icon: '🔮',
    description: 'Los debates y reformulaciones teóricas del anarquismo actual: desde el programa mínimo hasta las nuevas corrientes del siglo XXI.',
    keyIdeas: ['Programa mínimo libertario', 'Reformulación teórica contemporánea', 'Anarquismo y política actual', 'Debates internos del movimiento'],
    keyAuthors: ['Stefano d\'Errico', 'Gustavo Rodríguez', 'Akira', 'APOC', 'Felipe Alaiz', 'Octavio Alberola', 'Agustín Guillamón'],
    books: [
      'Anarquismo y política. El \'programa mínimo\' de los libertarios del Tercer Milenio',
      'Algunas reflexiones sobre el extravío teórico ideológico en el pensamiento ácrata contemporáneo',
      'Anarquía en la ciudad',
      'Hacia una federación de autónomas ibéricas (F.A.I.)',
      'Hacia una federación de autónomas ibéricas (F.A.I.). Capítulo XVII. País Vasco y Cataluña',
      'Debate entre Agustín Guillamón y Octavio Alberola'
    ]
  },
  {
    id: 'anarcocristianismo',
    name: 'Anarcocristianismo',
    icon: '✝️',
    description: 'La corriente que funde la radicalidad del Evangelio con la crítica del Estado: la no resistencia al mal, lo impersonal como sagrado y la incompatibilidad del cristianismo con toda autoridad.',
    keyIdeas: ['No resistencia al mal por la fuerza', 'El Reino de Dios frente al Reino del César', 'Lo impersonal como lo sagrado', 'El Estado como poder contra Dios'],
    keyAuthors: ['León Tolstói', 'Simone Weil', 'Jacques Ellul'],
    books: [
      'El Reino de Dios está dentro de vosotros',
      '¿Qué es el arte?',
      'Reflexiones sobre las causas de la libertad y de la opresión social',
      'Anarquía y cristianismo'
    ]
  }
];
