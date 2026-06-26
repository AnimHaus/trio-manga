"use client";

import { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  onLoad?: boolean;
}

export default function WordReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.08,
  duration = 0.85,
  as: Tag = "span",
  onLoad = false,
}: WordRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (onLoad || inView) {
      controls.start("visible");
    }
  }, [onLoad, inView, controls]);

  const words = text.split(" ");

  return (
    <div ref={ref} className="inline">
      <Tag className={`inline ${className}`}>
        {words.map((word, i) => {
          const wordDelay = delay + i * stagger;
          return (
            <span key={i} className="inline-block overflow-hidden mr-[0.22em] last:mr-0 leading-[1.1]">
              <motion.span
                className="inline-block"
                initial="hidden"
                animate={controls}
                variants={{
                  hidden: { y: "110%" },
                  visible: { y: "0%" },
                }}
                transition={{ duration, delay: wordDelay, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            </span>
          );
        })}
      </Tag>
    </div>
  );
}


