'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/components/AuthProvider'
import TransitionLink from '@/components/TransitionLink'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faMinus, faPlus, faArrowLeft, faLock, faCrown, faBoxOpen } from '@fortawesome/free-solid-svg-icons'

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'http://localhost:3001'
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
const TOKEN_KEY = 'trio_access_token'

function fmt(paise: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paise / 100)
}

export default function CartPage() {
  const { items, itemCount, totalPaise, removeItem, updateQty, clearCart } = useCart()
  const { user } = useAuth()

  async function handleCheckout() {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      window.location.href = `${DASHBOARD_URL}/login?redirect=cart`
      return
    }
    const res = await fetch(`${API_URL}/api/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ items: items.map((i) => ({ id: i.id, type: i.type, quantity: i.quantity, price: i.price })) }),
    })
    if (!res.ok) return
    const { razorpay_order_id, amount, key_id } = await res.json()

    // Load Razorpay checkout script dynamically
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    document.body.appendChild(script)
    script.onload = () => {
      const rzp = new (window as any).Razorpay({
        key: key_id,
        amount,
        currency: 'INR',
        name: 'Trio Manga',
        description: items.map((i) => i.title).join(', '),
        order_id: razorpay_order_id,
        handler: async (response: any) => {
          await fetch(`${API_URL}/api/orders/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
            body: JSON.stringify(response),
          })
          clearCart()
          window.location.href = '/cart/success'
        },
        theme: { color: '#9CFE08' },
      })
      rzp.open()
    }
  }

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6 px-4 pt-24 text-center">
        <FontAwesomeIcon icon={faBoxOpen} className="h-16 w-16 text-muted/20" />
        <h1 className="font-display text-2xl font-black text-white">Your cart is empty</h1>
        <p className="text-sm text-muted/50">Browse Trio manga and add volumes or a subscription.</p>
        <TransitionLink href="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-bg hover:bg-primary/90 transition-colors">
          <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
          Browse Manga
        </TransitionLink>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <TransitionLink href="/" className="text-muted/50 hover:text-primary transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
          </TransitionLink>
          <h1 className="font-display text-2xl font-black text-white">Your Cart</h1>
          <span className="text-sm text-muted/50">({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
        </div>

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4"
              >
                {/* Cover */}
                <div className="relative h-20 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
                  {item.image ? (
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FontAwesomeIcon icon={item.type === 'subscription' ? faCrown : faBoxOpen} className="h-5 w-5 text-muted/30" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm font-bold text-white truncate">{item.title}</p>
                  <p className="mt-0.5 text-xs text-muted/50 capitalize">{item.type === 'subscription' ? 'Monthly Subscription' : 'Hard Copy'}</p>
                  <p className="mt-1 text-sm font-semibold text-primary">{fmt(item.price)}{item.type === 'subscription' ? '/mo' : ''}</p>
                </div>

                {/* Qty (hard copies only) */}
                {item.type === 'hardcopy' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-muted/60 hover:border-primary/40 hover:text-primary transition-colors"
                    >
                      <FontAwesomeIcon icon={faMinus} className="h-2.5 w-2.5" />
                    </button>
                    <span className="w-6 text-center text-sm text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-muted/60 hover:border-primary/40 hover:text-primary transition-colors"
                    >
                      <FontAwesomeIcon icon={faPlus} className="h-2.5 w-2.5" />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-muted/30 hover:text-red-400 transition-colors ml-2"
                  aria-label="Remove"
                >
                  <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="mt-8 rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <div className="flex justify-between text-sm text-muted/60 mb-2">
            <span>Subtotal</span>
            <span>{fmt(totalPaise)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted/60 mb-4">
            <span>Shipping</span>
            <span className="text-primary">Calculated at checkout</span>
          </div>
          <div className="flex justify-between font-display text-lg font-bold text-white border-t border-white/5 pt-4">
            <span>Total</span>
            <span>{fmt(totalPaise)}</span>
          </div>

          {!user && (
            <p className="mt-4 flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-3 text-xs text-primary">
              <FontAwesomeIcon icon={faLock} className="h-3 w-3" />
              <a href={`${DASHBOARD_URL}/login?redirect=cart`} className="underline underline-offset-2">Sign in</a> to complete your order
            </p>
          )}

          <button
            onClick={handleCheckout}
            className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-semibold text-bg transition-colors hover:bg-primary/90"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}
