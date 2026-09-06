// Rutas de lectura por temática (menú "Rutas").
// Cada ruta propone un recorrido ordenado por obras del catálogo (TÍTULOS
// exactos; se resuelven contra regionData.js en ReadingPathsView).
export const readingPaths = [
  {
    id: 'origenes',
    title: 'Orígenes y fundamentos',
    icon: 'compass',
    description: 'De la primera crítica de la propiedad a la síntesis del comunismo libertario: los textos que fundaron la tradición anarquista.',
    books: ['¿Qué es la Propiedad?', 'Dios y el Estado', 'La Conquista del Pan', 'El Apoyo Mutuo']
  },
  {
    id: 'espana',
    title: 'Anarquismo en España',
    icon: 'flag-espana',
    description: 'Del movimiento libertario más fuerte de Europa a la revolución de 1936: sindicalismo, colectividades y la guerra civil.',
    books: ['Anarcosindicalismo y revolución en España (1930-1937)', 'Los anarquistas en la crisis política española (1869-1939)', 'Las colectividades libertarias en España (1936-1938)', 'El corto verano de la anarquía', 'Los Amigos de Durruti']
  },
  {
    id: 'feminismo',
    title: 'Feminismo libertario',
    icon: 'heart-handshake',
    description: 'La emancipación de la mujer como condición de la revolución: de Emma Goldman a Mujeres Libres.',
    books: ['Anarquismo', 'Mujeres Libres', 'Teresa Claramunt, la virgen roja barcelonesa', 'Lola Iturbe: vida e ideal de una luchadora anarquista', 'Mujeres Libres (1936-1939). Una lectura feminista']
  },
  {
    id: 'america-latina',
    title: 'Anarquismo en América Latina',
    icon: 'globe',
    description: 'El anarquismo llegado con la inmigración europea: sindicalismo en Argentina, Bolivia y Chile, y sus luchas del XIX y XX.',
    books: ['La FORA', 'La educación libertaria en la Argentina y en México (1861-1945)', 'Anarquismo y violencia popular en Chile (1898-1927)', 'Destruir para construir: violencia y acción directa en la corriente anarquista chilena (1890-1914)', 'La choledad antiestatal. El anarcosindicalismo en el movimiento obrero boliviano (1912-1965)', 'Los orígenes del anarquismo en Colombia y su relación con el liberalismo']
  },
  {
    id: 'rusia-ucrania',
    title: 'Rusia y el movimiento makhnovista',
    icon: 'flag-ucrania',
    description: 'La revolución rusa y su derrota: Kronstadt, el anarquismo bajo el bolchevismo y la insurrección de Ucrania.',
    books: ['Historia del Movimiento Makhnovista', 'La Makhnovschina. Un movimiento libertario bajo fuego en Ucrania (1918-1921)', 'La Banda de Chernopeev', 'Kronstadt 1921', 'La comuna de Kronstadt', 'La Revolución Rusa y el anarquismo']
  },
  {
    id: 'estado-autoridad',
    title: 'El Estado y la autoridad',
    icon: 'scale',
    description: 'La crítica radical del poder: por qué los anarquistas quieren abolir el Estado y toda forma de mando.',
    books: ['¿Qué es la Propiedad?', 'El Estado', 'El principio de autoridad', 'El principio del Estado', 'Anarquía y orden', 'Las prisiones']
  },
  {
    id: 'ecologia',
    title: 'Ecología, tecnología y anarquismo',
    icon: 'leaf',
    description: 'De la ecología social de Bookchin a la tecnología libre y la antropología anarquista contemporánea.',
    books: ['¿Anarquismo o barbarie? Historia, civilización y progreso', 'Una solución anarquista al calentamiento global', 'Internet, hackers y software libre', 'Fragmentos de antropología anarquista', 'Anarquismo social o anarquismo personal']
  },
  {
    id: 'individualismo',
    title: 'Individualismo y formas de vida',
    icon: 'star',
    description: 'El individuo contra la masa: Stirner, Tucker y el anarquismo individualista como modo de vida.',
    books: ['El único y su propiedad', 'Socialismo de Estado y anarquismo', 'El anarquismo individualista. Lo que es, vale y puede', 'El individualismo anarquista', 'Del amor']
  },
  {
    id: 'propaganda-represion',
    title: 'Propaganda, violencia y represión',
    icon: 'flame',
    description: 'La propaganda por el hecho y la respuesta del Estado: del XIX a los mártires de Chicago y Sacco y Vanzetti.',
    books: ['El terrorismo anarquista como propaganda por el hecho', 'La propaganda por los hechos en el movimiento anarquista chileno (1890-1910)', 'Destruir para construir: violencia y acción directa en la corriente anarquista chilena (1890-1914)', 'Los Mártires de Chicago', 'La pasión de Sacco y Vanzetti']
  },
  {
    id: 'educacion',
    title: 'Pedagogía y educación',
    icon: 'book-open',
    description: 'La escuela moderna y la educación integral: enseñar a pensar, no a obedecer.',
    books: ['La Escuela Moderna', 'Francisco Ferrer i Guardia y la Escuela Moderna', 'La bala y la escuela', 'La educación libertaria en la Argentina y en México (1861-1945)']
  },
  {
    id: 'anarcocristianismo',
    title: 'Anarquismo cristiano',
    icon: 'church',
    description: 'De la no resistencia de Tolstói a lo impersonal de Weil y el Estado como poder de Ellul: el Evangelio como subversión radical.',
    books: ['El Reino de Dios está dentro de vosotros', '¿Qué es el arte?', 'Reflexiones sobre las causas de la libertad y de la opresión social', 'Anarquía y cristianismo']
  },
  {
    id: 'chile',
    title: 'Anarquismo en Chile',
    icon: 'flag-chile',
    description: 'Del anarcosindicalismo peruano a la violencia popular chilena: sindicalismo, propaganda por los hechos y memoria libertaria en el cono sur.',
    books: ['Anarquismo y violencia popular en Chile (1898-1927)', 'Destruir para construir: violencia y acción directa en la corriente anarquista chilena (1890-1914)', 'Sin Dios ni patrones. Historia del anarquismo en la región chilena (1890-1990)', 'La propaganda por los hechos en el movimiento anarquista chileno (1890-1910)', 'La masacre de la Escuela Santa María de Iquique', 'Vanguardias silenciadas: tejidos de la memoria']
  },
  {
    id: 'japon',
    title: 'Anarquismo en Japón',
    icon: 'flag-japon',
    description: 'Los mártires de Tokio, Ōsugi Sakae y la Sociedad de la Guillotina: el anarquismo japonés entre la tradición y la insurrección.',
    books: ['Los Mártires de Tokio y la Sociedad de la Guillotina', 'Kotoku, Osugi, Yamaga: tres anarquistas japoneses', 'Contra el Dios Emperador. Juicios de la traición anarquista en Japón', 'Museihushugi: el anarquismo japonés', 'Reflexiones en el camino hacia la horca']
  },
  {
    id: 'anarcfeminismo',
    title: 'Anarcofeminismo',
    icon: 'heart-handshake',
    description: 'La conexión entre anarquismo y feminismo: de las milicianas de la Guerra Civil a las Mujeres Libres contemporáneas.',
    books: ['Anarquismo: la conexión feminista', 'Mujeres Libres (1936-1939). Una lectura feminista', 'El anarcofeminismo en España: las propuestas de Mujeres Libres', 'Mujeres Libres: emancipación femenina y revolución social', 'Anarcofeminismo e identidad(es)', 'Vanguardias silenciadas: tejidos de la memoria', 'Cocinando la revolución en la ciudad de La Paz (1927-1946)']
  },
  {
    id: 'insurreccionalismo',
    title: 'Insurreccionalismo',
    icon: 'flame',
    description: 'La organización informal, la afinidad y la guerra social: del Matese de Malatesta a las prácticas contemporáneas.',
    books: ['Anarquismo, insurrecciones e insurreccionalismo', 'Ai ferri corti. Romper con esta realidad', 'Archipiélago. Afinidad, organización informal y proyectos insurreccionales', 'Apuntes sobre revuelta y guerra social', 'Cuando se señala la luna... A vueltas con el insurreccionalismo', 'Nos estamos acercando: La historia de Angry Brigade']
  }
];