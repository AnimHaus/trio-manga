"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

interface AuthContextValue {
  user: string | null
  role: string
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null)
  const [role, setRole] = useState<string>("user")
  const [loading, setLoading] = useState(true)

  const verifySession = useCallback(async () => {
    const r = await fetch(`${API_URL}/api/auth/me`, {
      credentials: "include",
    }).catch(() => null)
    if (r?.ok) {
      const data = await r.json()
      if (data?.username) { setUser(data.username); setRole(data.role ?? "user"); return }
    }
    setUser(null)
    setRole("user")
  }, [])

  useEffect(() => {
    verifySession().finally(() => setLoading(false))
    // Re-check when user tabs back — picks up login/logout on dashboard tab
    window.addEventListener("focus", verifySession)
    return () => window.removeEventListener("focus", verifySession)
  }, [verifySession])

  const login = useCallback(async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) throw new Error("Login failed")
    const data = await res.json()
    setUser(data.username)
    setRole(data.role ?? "user")
  }, [])

  const logout = useCallback(() => {
    fetch(`${API_URL}/api/auth/logout`, { method: "POST", credentials: "include" }).catch(() => null)
    setUser(null)
    setRole("user")
  }, [])

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
