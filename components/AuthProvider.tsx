"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
const TOKEN_COOKIE = "trio_access_token"

// Cookies on `localhost` are not port-scoped — dashboard (3001) and
// trio-manga (3000) share the same cookie, so login on either app is
// immediately visible here without any iframe bridge.
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const m = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)"))
  return m ? decodeURIComponent(m[1]) : null
}

function setCookie(name: string, value: string): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; path=/; SameSite=Lax; max-age=0`
}

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

  const verifyToken = useCallback(async () => {
    const token = getCookie(TOKEN_COOKIE)
    if (!token) { setUser(null); setRole("user"); return }
    const r = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => null)
    if (r?.ok) {
      const data = await r.json()
      if (data?.username) { setUser(data.username); setRole(data.role ?? "user"); return }
    }
    deleteCookie(TOKEN_COOKIE)
    setUser(null)
    setRole("user")
  }, [])

  useEffect(() => {
    verifyToken().finally(() => setLoading(false))
    // Re-check when user tabs back — picks up login/logout on dashboard tab
    window.addEventListener("focus", verifyToken)
    return () => window.removeEventListener("focus", verifyToken)
  }, [verifyToken])

  const login = useCallback(async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) throw new Error("Login failed")
    const data = await res.json()
    setCookie(TOKEN_COOKIE, data.access_token)
    setUser(data.username)
    setRole(data.role ?? "user")
  }, [])

  const logout = useCallback(() => {
    deleteCookie(TOKEN_COOKIE)
    setUser(null)
    setRole("user")
  }, [])

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
