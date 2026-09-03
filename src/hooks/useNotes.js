import { useState, useCallback } from 'react'
import { makeBookId } from '../utils/bookId'

const STORAGE_KEY = 'la-idea-notes'

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export function useNotes() {
  const [notesMap, setNotesMap] = useState(loadNotes)

  const getNotes = useCallback(
    (book) => {
      const id = makeBookId(book.title, book.author)
      return notesMap[id] || []
    },
    [notesMap]
  )

  const addNote = useCallback((book, text) => {
    const id = makeBookId(book.title, book.author)
    const note = {
      id: 'n' + Date.now().toString(36),
      text,
      ts: new Date().toISOString(),
    }
    setNotesMap((prev) => {
      const updated = { ...prev, [id]: [...(prev[id] || []), note] }
      saveNotes(updated)
      return updated
    })
  }, [])

  const deleteNote = useCallback((book, noteId) => {
    const id = makeBookId(book.title, book.author)
    setNotesMap((prev) => {
      const updated = { ...prev, [id]: (prev[id] || []).filter((n) => n.id !== noteId) }
      saveNotes(updated)
      return updated
    })
  }, [])

  const exportNotes = useCallback(() => {
    const data = Object.entries(notesMap).map(([id, notes]) => ({ id, notes }))
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `la-idea-notes-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [notesMap])

  const importNotes = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const incoming = JSON.parse(e.target.result)
          setNotesMap((prev) => {
            const merged = { ...prev }
            for (const entry of incoming) {
              if (entry.id && Array.isArray(entry.notes)) {
                const existing = merged[entry.id] || []
                const existingIds = new Set(existing.map((n) => n.id))
                const newNotes = entry.notes.filter((n) => !existingIds.has(n.id))
                merged[entry.id] = [...existing, ...newNotes]
              }
            }
            saveNotes(merged)
            return merged
          })
          resolve()
        } catch (err) {
          reject(err)
        }
      }
      reader.readAsText(file)
    })
  }, [])

  return { getNotes, addNote, deleteNote, exportNotes, importNotes }
}
