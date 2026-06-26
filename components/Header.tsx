'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TransitionLink from '@/components/TransitionLink'
import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/components/AuthProvider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faUser, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'http://localhost:3001'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { itemCount } = useCart()
  const { user, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all ${
          scrolled
            ? 'bg-bg/50 backdrop-blur-md border-b border-white/5'
            : 'bg-transparent border-b border-transparent'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDuration: '400ms',
        }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <TransitionLink href="/" className="flex items-center gap-3">
            <Image src="/trio.png" alt="Trio Manga" width={120} height={36} className="h-8 w-auto" />
          </TransitionLink>

          <div className="hidden items-center gap-6 md:flex">

            {/* Cart */}
            <TransitionLink href="/cart" className="relative text-muted/70 hover:text-primary transition-colors" aria-label="Cart">
              <FontAwesomeIcon icon={faCartShopping} className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-bg leading-none">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </TransitionLink>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-3">
                <a
                  href={`${DASHBOARD_URL}/dashboard`}
                  className="flex items-center gap-1.5 text-sm text-muted/70 hover:text-primary transition-colors"
                >
                  <FontAwesomeIcon icon={faUser} className="h-3.5 w-3.5" />
                  {user}
                </a>
                <button
                  onClick={logout}
                  className="text-muted/40 hover:text-red-400 transition-colors"
                  aria-label="Sign out"
                >
                  <FontAwesomeIcon icon={faArrowRightFromBracket} className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : null}

            {user ? (
              <a
                href={`${DASHBOARD_URL}/dashboard/upload`}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-bg transition-colors hover:bg-primary/90"
              >
                Upload
              </a>
            ) : (
              <a
                href={`${DASHBOARD_URL}/login`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <FontAwesomeIcon icon={faUser} className="h-3 w-3" />
                Sign In
              </a>
            )}
          </div>

          {/* Mobile right side */}
          <div className="flex items-center gap-4 md:hidden">
            <TransitionLink href="/cart" className="relative text-muted/70" aria-label="Cart">
              <FontAwesomeIcon icon={faCartShopping} className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-bg leading-none">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </TransitionLink>
            <button
              onClick={() => setOpen(!open)}
              className="flex flex-col gap-1.5"
              aria-label="Menu"
            >
              <span className={`block h-0.5 w-6 bg-muted transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 w-6 bg-muted transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-6 bg-muted transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(100% 0 0 0)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-bg md:hidden"
          >
            <div className="flex flex-col items-center gap-6 text-lg">
              <TransitionLink href="/" className="text-muted/70 hover:text-primary transition-colors" onClick={() => setOpen(false)}>Browse</TransitionLink>
              <TransitionLink href="/cart" className="text-muted/70 hover:text-primary transition-colors" onClick={() => setOpen(false)}>Cart {itemCount > 0 && `(${itemCount})`}</TransitionLink>
              {user ? (
                <>
                  <a href={`${DASHBOARD_URL}/dashboard`} className="text-muted/70 hover:text-primary transition-colors" onClick={() => setOpen(false)}>{user}</a>
                  <button onClick={() => { logout(); setOpen(false) }} className="text-muted/40 hover:text-red-400 transition-colors text-sm">Sign Out</button>
                  <a href={`${DASHBOARD_URL}/dashboard/upload`} className="text-muted/70 hover:text-primary transition-colors" onClick={() => setOpen(false)}>Upload Manga</a>
                </>
              ) : (
                <a href={`${DASHBOARD_URL}/login`} target="_blank" rel="noopener noreferrer" className="text-muted/70 hover:text-primary transition-colors" onClick={() => setOpen(false)}>Sign In</a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}