import Image from "next/image";

interface HeroProduct {
  name: string;
  imageUrl: string;
  category: string;
}

interface HeroProductMontageProps {
  products: HeroProduct[];
}

const cardStyles = [
  { rotation: "-3deg", delay: "0s", offsetX: "0", offsetY: "0" },
  { rotation: "2deg", delay: "1.5s", offsetX: "0", offsetY: "0" },
  { rotation: "1deg", delay: "3s", offsetX: "0", offsetY: "0" },
  { rotation: "-2deg", delay: "4.5s", offsetX: "0", offsetY: "0" },
] as const;

/**
 * Product image montage for the hero section.
 *
 * Desktop: 2x2 grid of floating, slightly rotated product cards with
 * staggered float animation and a warm amber glow behind the cluster.
 *
 * Mobile: same images shown as faded background texture at 15% opacity
 * so the hero has visual weight without competing with the text.
 */
export function HeroProductMontage({ products }: HeroProductMontageProps) {
  if (products.length < 3) return null;

  const items = products.slice(0, 4);

  return (
    <>
      {/* Desktop — floating cards with staggered animation */}
      <div
        className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[42%] xl:w-[38%]"
        style={{ animation: "fadeUp 800ms ease-out 400ms both" }}
      >
        {/* Ambient warm glow behind the card cluster */}
        <div className="absolute inset-0 -inset-x-8 bg-amber-500/[0.04] rounded-full blur-3xl" />

        <div className="relative grid grid-cols-2 gap-4">
          {items.map((item, i) => (
            <div
              key={item.name}
              className="relative overflow-hidden rounded-xl bg-white shadow-2xl border border-white/20"
              style={{
                "--rotation": cardStyles[i].rotation,
                animation: `float 6s ease-in-out ${cardStyles[i].delay} infinite`,
              } as React.CSSProperties}
            >
              <div className="relative aspect-square p-4">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1280px) 12vw, 10vw"
                />
              </div>
              <div className="px-3 pb-3">
                <p className="font-display text-[8px] font-semibold uppercase tracking-widest text-amber-600">
                  {item.category}
                </p>
                <p className="font-body text-[11px] text-gray-700 line-clamp-1 mt-0.5">
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile — faded background texture */}
      <div className="lg:hidden absolute inset-0 overflow-hidden opacity-[0.08] pointer-events-none">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[80%] grid grid-cols-2 gap-3 p-6">
          {items.map((item) => (
            <div
              key={item.name}
              className="relative aspect-square rounded-lg overflow-hidden"
            >
              <Image
                src={item.imageUrl}
                alt=""
                fill
                className="object-contain"
                sizes="30vw"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
