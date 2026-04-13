"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProductImageFrame } from "@/components/catalog/product-image-frame";

interface ProductImagesProps {
  images: Array<{ url: string; altText?: string }>;
  productName: string;
}

export function ProductImages({ images, productName }: ProductImagesProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <ProductImageFrame
        alt={productName}
        aspectRatio="4/3"
        size="lg"
        className="rounded-lg"
      />
    );
  }

  const activeImage = images[activeIndex];

  return (
    <div className="space-y-3">
      {/* Main image — uses Framer Motion for cross-fade between images */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 p-5 sm:p-8"
          >
            <div className="relative h-full w-full">
              <Image
                src={activeImage.url}
                alt={activeImage.altText || productName}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-gray-50 transition-all",
                index === activeIndex
                  ? "ring-2 ring-amber-500"
                  : "ring-1 ring-gray-200 hover:ring-gray-300"
              )}
            >
              <Image
                src={img.url}
                alt={img.altText || `${productName} ${index + 1}`}
                fill
                className="object-contain p-1"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
