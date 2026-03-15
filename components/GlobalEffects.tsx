"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

type GlobalEffectsProps = {
  children: React.ReactNode;
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function scrollToTopOnRouteChange() {
  if (typeof window === "undefined") return;
  const reduced = prefersReducedMotion();
  try {
    window.scrollTo({ top: 0, left: 0, behavior: reduced ? "auto" : "smooth" });
  } catch {
    window.scrollTo(0, 0);
  }
}

function setupScrollReveal(root: ParentNode = document) {
  const elements = Array.from(
    root.querySelectorAll<HTMLElement>(
      [
        "[data-reveal='true']",
        ".main-content > *",
        "main > *",
      ].join(",")
    )
  ).filter((el) => el && el.offsetParent !== null);

  if (elements.length === 0) return () => {};

  for (const el of elements) {
    el.classList.add("reveal-on-scroll");
    el.classList.remove("reveal-in");
  }

  if (prefersReducedMotion()) {
    for (const el of elements) el.classList.add("reveal-in");
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          el.classList.add("reveal-in");
          observer.unobserve(el);
        }
      }
    },
    { root: null, threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
  );

  for (const el of elements) observer.observe(el);
  return () => observer.disconnect();
}

// Route-specific transition variants
const getVariants = (pathname: string) => {
  // Checkout / Payment pages get a vertical slide
  if (pathname.includes("Checkout") || pathname.includes("payment")) {
    return {
      initial: { opacity: 0, y: 30, filter: "blur(8px)" },
      animate: { opacity: 1, y: 0, filter: "blur(0px)" },
      exit:    { opacity: 0, y: -20, filter: "blur(8px)" },
    };
  }
  // Shop / Menu get a horizontal slide
  if (pathname.includes("Shop") || pathname.includes("MenuPage")) {
    return {
      initial: { opacity: 0, x: 24, filter: "blur(6px)" },
      animate: { opacity: 1, x: 0, filter: "blur(0px)" },
      exit:    { opacity: 0, x: -16, filter: "blur(6px)" },
    };
  }
  // Default: elegant fade + subtle scale
  return {
    initial: { opacity: 0, scale: 0.985, filter: "blur(8px)" },
    animate: { opacity: 1, scale: 1,     filter: "blur(0px)" },
    exit:    { opacity: 0, scale: 1.008, filter: "blur(8px)" },
  };
};

export default function GlobalEffects({ children }: GlobalEffectsProps) {
  const pathname = usePathname();
  const prevPathnameRef = useRef<string>(pathname);

  const transition = useMemo(
    () => ({
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as const,
    }),
    []
  );

  const variants = useMemo(() => getVariants(pathname ?? ""), [pathname]);

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      scrollToTopOnRouteChange();
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const id = window.setTimeout(() => setupScrollReveal(document), 80);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className="page-transition"
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
