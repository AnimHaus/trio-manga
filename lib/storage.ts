export interface MangaChapter {
  number: number
  pages: string[]
  uploadedAt: string
}

export interface UserManga {
  id: string
  title: string
  author: string
  description: string
  coverImage: string
  chapters: MangaChapter[]
  genre: string
  createdAt: string
  updatedAt: string
  uploadedBy: string
}

const MANGA_KEY = "trio_user_mangas"

export function getUserMangas(): UserManga[] {
  if (typeof window === "undefined") return []
  const raw = localStorage.getItem(MANGA_KEY)
  return raw ? JSON.parse(raw) : []
}

export function addUserManga(manga: Omit<UserManga, "id" | "createdAt">): UserManga {
  const mangas = getUserMangas()
  const newManga: UserManga = {
    ...manga,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  mangas.push(newManga)
  localStorage.setItem(MANGA_KEY, JSON.stringify(mangas))
  return newManga
}

export function deleteUserManga(id: string) {
  const mangas = getUserMangas().filter((m) => m.id !== id)
  localStorage.setItem(MANGA_KEY, JSON.stringify(mangas))
}
