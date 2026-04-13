"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Small back-to-top button in the bottom-left corner (opposite the
 * floating quote button). Appears after 2 screen heights of scroll.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > window.innerHeight * 2);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 left-6 z-50 flex items-center justify-center size-10 rounded-full bg-navy-800 text-white shadow-lg hover:bg-navy-700 transition-colors duration-200 animate-in fade-in slide-in-from-bottom-2"
      aria-label="Back to top"
    >
      <ArrowUp className="size-4" />
    </button>
  );
}
