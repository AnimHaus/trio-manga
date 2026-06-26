"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface PageTransitionContextValue {
  navigate: (href: string) => void;
}

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null);

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used within PageTransitionProvider");
  return ctx;
}

export default function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const pendingRef = useRef<string | null>(null);

  const navigate = useCallback(
    (href: string) => {
      if (active) return;
      pendingRef.current = href;
      setActive(true);
      // Push midway through the enter animation so the new page
      // is ready before the overlay starts to exit
      setTimeout(() => {
        router.push(href);
      }, 250);
    },
    [active, router],
  );

  function onEnterComplete() {
    setActive(false);
    pendingRef.current = null;
  }

  return (
    <PageTransitionContext.Provider value={{ navigate }}>
      {children}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[200] bg-primary pointer-events-none"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            exit={{ clipPath: "inset(0 0% 0 100%)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={onEnterComplete}
          />
        )}
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
}
