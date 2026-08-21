// Ramas y corrientes del anarquismo (menú "Teorías").
// Cada corriente referencia obras del catálogo por su TÍTULO exacto (los
// enlaces se resuelven contra regionData.js en TheoriesView).
export const anarchistTheories = [
  {
    id: 'anarcocomunismo',
    name: 'Anarco-comunismo',
    icon: '🌾',
    description: 'La corriente más influyente: abolición del Estado Y de la propiedad privada, producción y reparto según necesidades y capacidades, con los recursos en común.',
    keyIdeas: ['Comunismo libertario', 'De cada cual según sus capacidades, a cada cual según sus necesidades', 'Apoyo mutuo como ley evolutiva', 'Comuna como unidad de base'],
    keyAuthors: ['Piotr Kropotkin', 'Errico Malatesta', 'Élisée Reclus', 'Joseph Déjacque'],
    books: ['La Conquista del Pan', 'El Apoyo Mutuo', 'Campos, fábricas y talleres', '¡Abajo los jefes!', 'El ideal anarquista', 'Evolución, revolución y anarquismo', 'La Anarquía y el Método del Anarquismo', 'Origen y evolución de la moral']
  },
  {
    id: 'anarcosindicalismo',
    name: 'Anarcosindicalismo',
    icon: '⚒️',
    description: 'El sindicato como escuela y vanguardia de la revolución: la organización obrera de masas, por federación y acción directa, como embrión de la sociedad futura.',
    keyIdeas: ['Acción directa y huelga general', 'El sindicato como organización de la clase trabajadora', 'Federalismo sindical', 'Neutralidad política (no a los partidos)'],
    keyAuthors: ['Rudolf Rocker', 'CNT', 'FORA', 'Emile Pouget'],
    books: ['Anarcosindicalismo y revolución en España (1930-1937)', 'Los anarquistas en la crisis política española (1869-1939)', 'La FORA', 'La choledad antiestatal. El anarcosindicalismo en el movimiento obrero boliviano (1912-1965)', 'El origen del 1º de Mayo']
  },
  {
    id: 'anarcocolectivismo',
    name: 'Anarco-colectivismo',
    icon: '🤝',
    description: 'La propuesta de Bakunin y la Internacional: socialización de los medios de producción en colectividades de trabajadores, manteniendo el salario por trabajo realizado en la transición.',
    keyIdeas: ['Colectivización de los medios de producción', 'Retribución según el trabajo', 'Rechazo del Estado y de la autoridad', 'Antiautoritarismo frente a Marx'],
    keyAuthors: ['Mijaíl Bakunin', 'James Guillaume'],
    books: ['Dios y el Estado', 'Federalismo, socialismo y antiteologismo', 'El principio de autoridad', 'El patriotismo']
  },
  {
    id: 'mutualismo',
    name: 'Mutualismo',
    icon: '🔁',
    description: 'La propuesta de Proudhon: intercambio de productos del trabajo a precio de coste, con crédito y cooperación libre, sin Estado ni explotación.',
    keyIdeas: ['La propiedad es un robo', 'Intercambio justo y reciprocidad', 'Crédito mutualista / banca del pueblo', 'Federalismo político'],
    keyAuthors: ['Pierre-Joseph Proudhon'],
    books: ['¿Qué es la Propiedad?', 'El principio federativo', 'Política unitaria', 'La capacidad política de la clase obrera', 'Amor y matrimonio']
  },
  {
    id: 'anarcoindividualismo',
    name: 'Anarco-individualismo',
    icon: '⭐',
    description: 'El individuo como fin supremo: autonomía personal frente a toda colectividad, asociación voluntaria y rechazo de la moral impuesta.',
    keyIdeas: ['El único y su propiedad', 'Soberanía del individuo', 'Asociación voluntaria y efímera', 'Egoísmo ético'],
    keyAuthors: ['Max Stirner', 'Benjamin Tucker', 'Émile Armand'],
    books: ['El único y su propiedad', 'Socialismo de Estado y anarquismo', 'El anarquismo individualista como vida y actividad', 'El anarquismo individualista. Lo que es, vale y puede', 'El individualismo anarquista', 'Individualismo y Comunismo']
  },
  {
    id: 'anarcofeminismo',
    name: 'Anarcofeminismo',
    icon: '✊',
    description: 'La emancipación de la mujer como parte inseparable de la revolución: no hay libertad sin autonomía de género, sexual y reproductiva.',
    keyIdeas: ['La liberación de la mujer es la liberación de todas', 'Autonomía y educación de la mujer', 'Mujeres Libres y organizaciones propias', 'Crítica a la familia y al matrimonio'],
    keyAuthors: ['Emma Goldman', 'Mujeres Libres', 'Lucía Sánchez Saornil'],
    books: ['Anarquismo', 'Mujeres Libres', 'Mujeres Libres (1936-1939). Una lectura feminista', 'Fraternalmente, Emma', 'Lola Iturbe: vida e ideal de una luchadora anarquista', 'Teresa Claramunt, la virgen roja barcelonesa']
  },
  {
    id: 'ecologismo-social',
    name: 'Ecología social y municipalismo',
    icon: '🌱',
    description: 'De Bookchin en adelante: la dominación de la naturaleza es hija de la dominación entre humanos; frente a ella, comunas autogestionadas y ecología social.',
    keyIdeas: ['La crisis ecológica es una crisis social', 'Municipalismo libertario', 'Anarquismo social frente a anarquismo personal', 'Confederalismo democrático'],
    keyAuthors: ['Murray Bookchin', 'Peter Gelderloos'],
    books: ['¿Anarquismo o barbarie? Historia, civilización y progreso', 'Anarquismo social o anarquismo personal', 'Una solución anarquista al calentamiento global']
  },
  {
    id: 'plataformismo',
    name: 'Plataformismo y especifismo',
    icon: '🎯',
    description: 'Organización específica de anarquistas con unidad teórica y táctica, nacida del exilio ruso de Makhno y Arshinov: una plataforma común frente a la dispersión.',
    keyIdeas: ['Unidad teórica y táctica', 'Responsabilidad colectiva', 'Organización específica de militantes', 'Ligazón con los movimientos populares'],
    keyAuthors: ['Néstor Makhno', 'Piotr Arshinov'],
    books: ['Historia del Movimiento Makhnovista', 'La Makhnovschina. Un movimiento libertario bajo fuego en Ucrania (1918-1921)', 'La Banda de Chernopeev', 'Un plan de organización anarquista', 'Kronstadt 1921', 'La comuna de Kronstadt']
  },
  {
    id: 'insurreccionalismo',
    name: 'Insurreccionalismo',
    icon: '🔥',
    description: 'La revolución como acto espontáneo de los de abajo: acción directa, expropiación y propaganda por el hecho, sin vanguardia que la conduzca.',
    keyIdeas: ['Propaganda por el hecho', 'Acción directa sin mediación', 'Expropiación individual y colectiva', 'Crítica a la organización permanente'],
    keyAuthors: ['Miguel Amorós', 'Grupo Amigos de Durruti', 'Alfredo M. Bonanno'],
    books: ['Anarquía profesional y desarme teórico', 'Los Amigos de Durruti', 'El terrorismo anarquista como propaganda por el hecho', 'Destruir para construir: violencia y acción directa en la corriente anarquista chilena (1890-1914)', 'La propaganda por los hechos en el movimiento anarquista chileno (1890-1910)', 'La bala y la escuela']
  },
  {
    id: 'pedagogia-racionalista',
    name: 'Pedagogía racionalista',
    icon: '📖',
    description: 'La escuela como laboratorio de libertad: educación integral, laica y científica, sin premios ni castigos, al servicio de la emancipación.',
    keyIdeas: ['Educación integral (física, intelectual, moral)', 'Laicismo y racionalismo', 'Autogestión pedagógica', 'La Escuela Moderna como proyecto global'],
    keyAuthors: ['Francisco Ferrer i Guardia', 'Ricardo Mella'],
    books: ['La Escuela Moderna', 'Francisco Ferrer i Guardia y la Escuela Moderna', 'La educación libertaria en la Argentina y en México (1861-1945)', 'La bala y la escuela']
  },
  {
    id: 'anarcocristianismo',
    name: 'Anarcocristianismo',
    icon: '✝️',
    description: 'La corriente que funde la radicalidad del Evangelio con la crítica del Estado: la no resistencia al mal, lo impersonal como sagrado y la incompatibilidad del cristianismo con toda autoridad.',
    keyIdeas: ['No resistencia al mal por la fuerza', 'El Reino de Dios frente al Reino del César', 'Lo impersonal como lo sagrado', 'El Estado como poder contra Dios'],
    keyAuthors: ['León Tolstói', 'Simone Weil', 'Jacques Ellul'],
    books: ['El Reino de Dios está dentro de vosotros', '¿Qué es el arte?', 'Reflexiones sobre las causas de la libertad y de la opresión social', 'La persona y lo sagrado', 'Anarquía y cristianismo']
  }
];