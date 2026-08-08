import { Link } from 'react-router-dom'
import { BookOpen, Users, Globe, ExternalLink } from 'lucide-react'
import { books } from '../data/books'
import { communityItems } from '../data/communityItems'
import Carousel from '../components/Carousel'

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Biblioteca Anarquista Libertaria</h1>
        <p className="text-xl text-gray-300">Conocimiento libre para mentes libres</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-black p-6 rounded-lg border border-red-800">
          <BookOpen className="w-12 h-12 text-red-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Acceso Libre</h3>
          <p className="text-gray-400">Textos fundamentales del pensamiento anarquista y libertario disponibles para todos.</p>
        </div>
        <div className="bg-black p-6 rounded-lg border border-red-800">
          <Users className="w-12 h-12 text-red-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Comunidad</h3>
          <p className="text-gray-400">Una biblioteca construida por y para la comunidad, sin jerarquías ni restricciones.</p>
        </div>
        <div className="bg-black p-6 rounded-lg border border-red-800">
          <Globe className="w-12 h-12 text-red-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Sin Fronteras</h3>
          <p className="text-gray-400">El conocimiento no conoce fronteras. Accede desde cualquier lugar, en cualquier momento.</p>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-red-600 mb-6">Documentos Disponibles</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-black">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-red-500 border-b border-red-800">Título</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-red-500 border-b border-red-800">Autor</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-red-500 border-b border-red-800">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-800">
              {books.map((book) => (
                <tr key={book.id} className="bg-neutral-900 hover:bg-neutral-800">
                  <td className="px-6 py-4 text-sm text-gray-300">{book.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{book.author}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/read/${book.id}`}
                      className="inline-flex items-center text-sm text-red-500 hover:text-red-400"
                    >
                      Leer
                      <ExternalLink className="ml-1 w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-red-600 mb-6">Actividades de la Comunidad</h2>
        <Carousel items={communityItems} />
      </div>

      <div className="text-center">
        <Link
          to="/books"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          Explorar Biblioteca
        </Link>
      </div>
    </div>
  )
}

export default Home
