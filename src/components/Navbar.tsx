import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Book, Home } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()
  const [isHovered, setIsHovered] = useState<string | null>(null)

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="fixed w-full bg-black/80 backdrop-blur-sm border-b border-red-900/30 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center space-x-3 text-white group"
            onMouseEnter={() => setIsHovered('logo')}
            onMouseLeave={() => setIsHovered(null)}
          >
            <Book
              size={22}
              className={`transition-colors duration-300 ${
                isHovered === 'logo' ? 'text-red-500' : 'text-red-600'
              }`}
            />
            <span className="font-medium tracking-wide text-sm transition-colors duration-300 group-hover:text-red-500">
              BIBLIOTECA LIBERTARIA
            </span>
          </Link>

          <div className="flex space-x-8">
            {[
              { path: '/', icon: Home, label: 'Inicio' },
              { path: '/books', icon: Book, label: 'Libros' },
            ].map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className="relative group"
                onMouseEnter={() => setIsHovered(path)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <div className="flex items-center space-x-2 py-1">
                  <Icon
                    size={18}
                    className={`transition-colors duration-300 ${
                      isActive(path) ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500'
                    }`}
                  />
                  <span
                    className={`text-sm transition-colors duration-300 ${
                      isActive(path) ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                <div
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform origin-left transition-transform duration-300 ${
                    isActive(path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
