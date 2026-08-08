import { useParams, Link } from 'react-router-dom'
import { Worker, Viewer } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { books } from '../data/books'
import { ArrowLeft } from 'lucide-react'

const Reader = () => {
  const { id } = useParams()
  const book = books.find((b) => b.id === id)
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  if (!book) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Libro no encontrado</h2>
        <Link to="/books" className="text-gray-300 hover:text-red-500">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link to="/books" className="flex items-center text-gray-300 hover:text-red-500 mb-4">
          <ArrowLeft className="mr-2" />
          Volver al catálogo
        </Link>
        <h1 className="text-2xl font-bold text-red-600">{book.title}</h1>
        <p className="text-gray-400">{book.author}</p>
      </div>

      {book.pdfUrl ? (
        <div className="bg-white rounded-lg overflow-hidden h-[800px]">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              fileUrl={book.pdfUrl}
              plugins={[defaultLayoutPluginInstance]}
              defaultScale={1.2}
              theme={{
                theme: 'dark',
              }}
            />
          </Worker>
        </div>
      ) : (
        <div className="text-center py-16 bg-black border border-red-800 rounded-lg">
          <p className="text-gray-300 mb-4">Este documento aún no tiene PDF disponible.</p>
          <Link to="/books" className="text-red-500 hover:text-red-400">
            Volver al catálogo
          </Link>
        </div>
      )}
    </div>
  )
}

export default Reader
