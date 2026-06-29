"use client";

import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const enterDoneRef = useRef(false);
  const pageReadyRef = useRef(false);
  const pendingRef = useRef<string | null>(null);

  const tryDismiss = useCallback(() => {
    if (enterDoneRef.current && pageReadyRef.current) {
      enterDoneRef.current = false;
      pageReadyRef.current = false;
      pendingRef.current = null;
      setActive(false);
    }
  }, []);

  // When pathname matches the target, the new page component has mounted
  useEffect(() => {
    if (!pendingRef.current) return;
    const targetPath = pendingRef.current.split(/[?#]/)[0];
    if (pathname === targetPath) {
      pageReadyRef.current = true;
      tryDismiss();
    }
  }, [pathname, tryDismiss]);

  const navigate = useCallback(
    (href: string) => {
      if (active) return;
      enterDoneRef.current = false;
      pageReadyRef.current = false;
      pendingRef.current = href;
      setActive(true);
      setTimeout(() => {
        router.push(href);
      }, 250);
    },
    [active, router],
  );

  function onAnimationComplete() {
    // Ignore the exit animation firing after we've already cleared state
    if (!pendingRef.current) return;
    enterDoneRef.current = true;
    tryDismiss();
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
            onAnimationComplete={onAnimationComplete}
          />
        )}
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
}
