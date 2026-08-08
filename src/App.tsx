import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Books from './pages/Books'
import Reader from './pages/Reader'

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-neutral-900 text-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8 pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/read/:id" element={<Reader />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}

export default App
