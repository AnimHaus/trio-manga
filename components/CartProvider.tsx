'use client'

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { useAuth } from '@/components/AuthProvider'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export type CartItemType = 'hardcopy' | 'subscription'

export interface CartItem {
  id: string
  type: CartItemType
  title: string
  image: string
  price: number   // in INR paise (e.g. 29900 = ₹299)
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  totalPaise: number
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

function getToken(): string | null {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(/(?:^|; )trio_access_token=([^;]*)/)
  return m ? decodeURIComponent(m[1]) : null
}

const LOCAL_CART_KEY = 'trio_guest_cart'

function loadLocalCart(): CartItem[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

function saveLocalCart(items: CartItem[]): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items))
}

function clearLocalCart(): void {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(LOCAL_CART_KEY)
}

async function syncToBackend(items: CartItem[]): Promise<void> {
  const token = getToken()
  if (!token) return
  await fetch(`${API_URL}/api/cart`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(items),
  }).catch(() => {/* best-effort */})
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { user, loading } = useAuth()
  const prevUser = useRef<string | null | undefined>(undefined)

  useEffect(() => {
    if (loading) return

    if (user && user !== prevUser.current) {
      // Just logged in — fetch backend cart and merge with any guest items
      const token = getToken()
      const guestItems = loadLocalCart()
      if (token) {
        fetch(`${API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((data: CartItem[] | null) => {
            const backendItems: CartItem[] = Array.isArray(data) ? data : []
            if (guestItems.length === 0) {
              setItems(backendItems)
            } else {
              // Merge: backend wins for existing ids, guest items appended
              const merged = [...backendItems]
              for (const g of guestItems) {
                const idx = merged.findIndex((i) => i.id === g.id)
                if (idx === -1) merged.push(g)
                else if (g.type !== 'subscription') merged[idx] = { ...merged[idx], quantity: merged[idx].quantity + g.quantity }
              }
              setItems(merged)
              syncToBackend(merged)
              clearLocalCart()
            }
          })
          .catch(() => { setItems(guestItems) })
      }
    } else if (!user && prevUser.current) {
      // Logged out — move current cart to localStorage as guest cart
      setItems((current) => {
        if (current.length > 0) saveLocalCart(current)
        return []
      })
    } else if (!user && prevUser.current === undefined) {
      // Initial load with no session — restore guest cart from localStorage
      setItems(loadLocalCart())
    }

    prevUser.current = user
  }, [user, loading])

  // Persist to localStorage on every change when guest
  useEffect(() => {
    if (!user && !loading) {
      saveLocalCart(items)
    }
  }, [items, user, loading])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      let next: CartItem[]
      if (existing) {
        if (existing.type === 'subscription') return prev
        next = prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      } else {
        next = [...prev, { ...item, quantity: 1 }]
      }
      syncToBackend(next)
      return next
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id)
      syncToBackend(next)
      return next
    })
  }, [])

  const updateQty = useCallback((id: string, qty: number) => {
    setItems((prev) => {
      const next = qty < 1
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => i.id === id ? { ...i, quantity: qty } : i)
      syncToBackend(next)
      return next
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    clearLocalCart()
    syncToBackend([])
  }, [])

  const itemCount = items.reduce((s, i) => s + i.quantity, 0)
  const totalPaise = items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, itemCount, totalPaise, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}
