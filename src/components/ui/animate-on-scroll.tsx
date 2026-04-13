"use client";

import { cn } from "@/lib/utils";
import { useAnimateOnScroll } from "@/hooks/use-animate-on-scroll";

type Animation = "fadeUp" | "fadeIn" | "scaleIn" | "slideLeft" | "slideRight";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in ms before the animation starts after entering the viewport. */
  delay?: number;
  animation?: Animation;
}

const hiddenClasses: Record<Animation, string> = {
  fadeUp: "translate-y-8 opacity-0",
  fadeIn: "opacity-0",
  scaleIn: "scale-95 opacity-0",
  slideLeft: "-translate-x-8 opacity-0",
  slideRight: "translate-x-8 opacity-0",
};

/**
 * Wrapper that reveals its children with a CSS transition when the element
 * scrolls into the viewport. Uses only transform + opacity (GPU composited)
 * so scroll performance stays clean.
 *
 * Usage:
 *   <AnimateOnScroll animation="fadeUp" delay={200}>
 *     <SomeComponent />
 *   </AnimateOnScroll>
 */
export function AnimateOnScroll({
  children,
  className,
  delay = 0,
  animation = "fadeUp",
}: AnimateOnScrollProps) {
  const { ref, isVisible } = useAnimateOnScroll();

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[transform,opacity] duration-700 ease-out will-change-[transform,opacity]",
        isVisible
          ? "translate-y-0 translate-x-0 scale-100 opacity-100"
          : hiddenClasses[animation],
        className
      )}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
