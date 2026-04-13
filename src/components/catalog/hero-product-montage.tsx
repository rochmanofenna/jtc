import Image from "next/image";

interface HeroProduct {
  name: string;
  imageUrl: string;
  category: string;
}

interface HeroProductMontageProps {
  products: HeroProduct[];
}

/**
 * Staggered grid of product images for the right side of the hero section.
 * Desktop-only (hidden on mobile where the hero is already compact).
 * Positioned absolutely so it doesn't affect the text layout.
 */
export function HeroProductMontage({ products }: HeroProductMontageProps) {
  if (products.length < 3) return null;

  // Pick 4 products max for the montage grid.
  const items = products.slice(0, 4);

  return (
    <div
      className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[42%] xl:w-[38%]"
      style={{ animation: "fadeUp 800ms ease-out 600ms both" }}
    >
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => (
          <div
            key={item.name}
            className={`relative overflow-hidden rounded-lg border border-white/10 bg-navy-800/60 backdrop-blur-sm ${
              i === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"
            }`}
            style={{
              animation: `fadeUp 600ms ease-out ${700 + i * 150}ms both`,
            }}
          >
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-contain p-3"
              sizes="(max-width: 1280px) 20vw, 16vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/80 to-transparent p-3 pt-8">
              <p className="font-display text-[9px] font-semibold uppercase tracking-widest text-amber-400">
                {item.category}
              </p>
              <p className="font-body text-xs text-white/80 line-clamp-1 mt-0.5">
                {item.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
