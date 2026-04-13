"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Observes when an element enters the viewport and flips `isVisible` to true
 * (one-shot — never reverts). Used to trigger scroll-reveal animations.
 *
 * The rootMargin of -50px bottom means elements trigger slightly before
 * they're fully in view, so the animation is already running by the time
 * the user's eye reaches the element.
 */
export function useAnimateOnScroll(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
