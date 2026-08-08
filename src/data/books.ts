export const PDF_BASE = 'http://192.168.1.117:8081/pdfs/ref/'

export interface Book {
  id: string
  title: string
  author: string
  description: string
  pdfUrl?: string
}

export const books: Book[] = [
  {
    id: '1',
    title: 'La Conquista del Pan',
    author: 'Piotr Kropotkin',
    description: 'Una obra fundamental del pensamiento anarquista que explora la organización social y económica en una sociedad libre.',
    pdfUrl: PDF_BASE + 'Kropotkin-La_Conquista_del_pan.pdf',
  },
  {
    id: '2',
    title: 'El Apoyo Mutuo',
    author: 'Piotr Kropotkin',
    description: 'Un estudio sobre la cooperación y la solidaridad como factores en la evolución.',
    pdfUrl: PDF_BASE + 'Piotr-Kropotkin-El-apoyo-mutuo.pdf',
  },
  {
    id: '3',
    title: 'Dios y el Estado',
    author: 'Mijaíl Bakunin',
    description: 'Una crítica fundamental a la religión y al Estado desde una perspectiva anarquista.',
    pdfUrl: PDF_BASE + 'Bakunin-Dios_y_el_Estado.pdf',
  },
  {
    id: '4',
    title: 'La Ciudad Futura',
    author: 'Antonio Gramsci',
    description: 'La "Ciudad Futura" de Gramsci refleja su visión de una sociedad transformada, donde la lucha de clases se resuelve con una participación activa del pueblo, promoviendo la igualdad y una reconfiguración del poder.',
  },
  {
    id: '5',
    title: '50 maneras para prepararse para la revolución',
    author: 'Stephanie McMillan',
    description: 'La gente en Estados Unidos está, actualmente, incapacitada para apropiarse un momento revolucionario. Debemos solucionar eso. ¿Cómo podemos incrementar la conciencia revolucionaria, de organización y de lucha?',
    pdfUrl: PDF_BASE + '50-maneras-para-prepararse-para-la-revolucion.pdf',
  },
  {
    id: '6',
    title: 'La Anarquía explicada a los niños',
    author: 'José Antonio Emmanuel',
    description: 'Este folleto está escrito para contestar a la pregunta que nos han formulado varios camaradas: ¿Cómo educaré a mis hijos? Pregunta que ya esperábamos y a la que respondemos ateniéndonos a los dictados de la Razón y de la Ciencia.',
    pdfUrl: PDF_BASE + 'jose-antonio-emmanuel-la-anarquia-explicada-a-los-ninos.pdf',
  },
  {
    id: '7',
    title: 'Revolución es más que una palabra: 23 tesis sobre el anarquismo',
    author: 'Gabriel Kuhn',
    description: 'Colección de ensayos que exploran el anarquismo desde diversas perspectivas. Kuhn presenta 23 tesis que abordan temas como la teoría y la práctica anarquista, la relación entre el anarquismo y otros movimientos sociales, y la importancia de la acción directa y la autogestión.',
    pdfUrl: PDF_BASE + 'gabriel-kuhn-revolucion-es-mas-que-una-palabra.pdf',
  },
  {
    id: '8',
    title: 'Cristianismo y Anarquismo',
    author: 'León Tolstói',
    description: 'Obra que explora la relación entre los principios cristianos y las ideas anarquistas. Tolstói argumenta que el verdadero cristianismo, basado en el amor y la no violencia, es incompatible con el Estado y sus instituciones coercitivas.',
    pdfUrl: PDF_BASE + 'leon-tolstoi-cristianismo-y-anarquismo.pdf',
  },
  {
    id: '9',
    title: 'Unabomber Manifesto',
    author: 'Theodore Kaczynski',
    description: 'El manifiesto del Unabomber critica la industrialización y el progreso tecnológico, argumentando que estos han llevado a la deshumanización y la destrucción del medio ambiente.',
    pdfUrl: PDF_BASE + '2_i_3_Theodore_Kaczynski_Manifiesto_de_Unabomber.pdf',
  },
  {
    id: '10',
    title: 'Cuadernos de la Cárcel',
    author: 'Antonio Gramsci',
    description: 'Obra fundamental del pensamiento marxista del siglo XX, escrita por Antonio Gramsci durante su encarcelamiento por el régimen fascista italiano entre 1929 y 1935. En estos cuadernos, Gramsci desarrolla conceptos clave como hegemonía cultural, bloque histórico, intelectuales orgánicos y revolución pasiva.',
  },
]
