import Image from "next/image";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageFrameProps {
  src?: string | null;
  alt: string;
  aspectRatio?: "4/3" | "1/1" | "3/4" | "3/2";
  size?: "sm" | "md" | "lg";
  priority?: boolean;
  className?: string;
  /** Enable hover scale on the image (for use inside group-hover cards). */
  hoverScale?: boolean;
}

const sizeMap = {
  sm: "p-2",
  md: "p-4 sm:p-5",
  lg: "p-5 sm:p-8",
} as const;

const sizesMap = {
  sm: "64px",
  md: "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  lg: "(max-width: 1024px) 100vw, 50vw",
} as const;

/**
 * Standardized product image frame used across all surfaces —
 * product cards, featured carousel, product detail.
 *
 * Rules:
 * - bg-gray-50 background (lighter, cleaner than gray-100)
 * - Consistent internal padding so products never touch the edges
 * - object-contain always — never crop products
 * - Intentional "Image coming soon" fallback
 * - Subtle border for definition
 */
export function ProductImageFrame({
  src,
  alt,
  aspectRatio = "4/3",
  size = "md",
  priority = false,
  className,
  hoverScale = false,
}: ProductImageFrameProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-50 border border-gray-100",
        className
      )}
      style={{ aspectRatio: aspectRatio.replace("/", " / ") }}
    >
      {src ? (
        <div className={cn("absolute inset-0", sizeMap[size])}>
          <div className="relative h-full w-full">
            <Image
              src={src}
              alt={alt}
              fill
              className={cn(
                "object-contain",
                hoverScale &&
                  "transition-transform duration-500 group-hover:scale-105"
              )}
              sizes={sizesMap[size]}
              priority={priority}
            />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200/50">
            <Package className="size-7 text-gray-300" />
          </div>
          <span className="font-display text-[10px] uppercase tracking-widest text-gray-300">
            Image coming soon
          </span>
        </div>
      )}
    </div>
  );
}
