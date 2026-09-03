function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = crypto.subtle.digest('SHA-256', msgBuffer)
  return hashBuffer
}

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

let idCache = {}

export async function makeBookIdAsync(title, author) {
  const key = `${title.trim().toLowerCase()}|${author.trim().toLowerCase()}`
  if (idCache[key]) return idCache[key]
  const hashBuffer = await sha256(key)
  const id = bufferToHex(hashBuffer).slice(0, 12)
  idCache[key] = id
  return id
}

export function makeBookId(title, author) {
  const key = `${title.trim().toLowerCase()}|${author.trim().toLowerCase()}`
  if (idCache[key]) return idCache[key]

  let hash = 0
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }

  const id = Math.abs(hash).toString(36).padStart(8, '0').slice(0, 12)
  idCache[key] = id
  return id
}
