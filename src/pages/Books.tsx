import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { books } from '../data/books'

const Books = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-red-600 mb-8">Catálogo de Libros</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-black border border-red-800 rounded-lg overflow-hidden hover:border-red-600 transition-colors">
            <div className="p-6">
              <FileText className="w-8 h-8 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{book.author}</p>
              <p className="text-gray-300 mb-4 line-clamp-3">{book.description}</p>
              <Link
                to={`/read/${book.id}`}
                className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Leer Ahora
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Books
