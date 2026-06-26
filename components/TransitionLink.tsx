"use client";

import { usePageTransition } from "@/components/PageTransitionProvider";
import type { ComponentProps, MouseEvent } from "react";

type TransitionLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
};

export default function TransitionLink({
  href,
  children,
  onClick,
  ...rest
}: TransitionLinkProps) {
  const { navigate } = usePageTransition();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (href.startsWith("http") || href.startsWith("//") || href.startsWith("#")) return;
    e.preventDefault();
    onClick?.(e);
    navigate(href);
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
