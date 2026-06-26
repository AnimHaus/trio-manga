'use client'

import TransitionLink from '@/components/TransitionLink'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'

export default function CartSuccessPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6 px-4 text-center">
      <FontAwesomeIcon icon={faCircleCheck} className="h-16 w-16 text-primary" />
      <h1 className="font-display text-3xl font-black text-white">Order Confirmed!</h1>
      <p className="text-sm text-muted/60 max-w-sm">
        Thank you for your purchase. You&apos;ll receive a confirmation email shortly.
      </p>
      <TransitionLink href="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-bg hover:bg-primary/90 transition-colors">
        Back to Browse
      </TransitionLink>
    </div>
  )
}
