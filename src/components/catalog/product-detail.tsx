"use client";

import { useTranslations } from "next-intl";
import { ProductImages } from "@/components/catalog/product-images";
import { QuoteButton } from "@/components/catalog/quote-button";

interface ProductDetailProps {
  product: any;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const t = useTranslations("product");

  const specs = [
    { label: t("material"), value: product.material },
    { label: t("specifications"), value: product.specifications },
    { label: t("packaging"), value: product.packaging },
    { label: t("moq"), value: product.moq },
    { label: t("unit"), value: product.unit },
    { label: t("brand"), value: product.brandName },
  ].filter((s) => s.value);

  const colors: string[] = product.colors ?? [];
  const sizes: string[] = product.sizes ?? [];

  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Images */}
        <div>
          <ProductImages
            images={product.images ?? []}
            productName={product.name}
          />
        </div>

        {/* Details */}
        <div>
          {/* Category label */}
          {product.category?.name && (
            <p className="font-display text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-600 mb-2">
              {product.category.name}
            </p>
          )}

          {/* Product name */}
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>

          {/* Chinese name */}
          {product.nameCn && (
            <p className="font-body text-lg text-gray-400 mt-1">
              {product.nameCn}
            </p>
          )}

          {/* Separator */}
          <div className="w-10 h-0.5 bg-amber-500 my-6" />

          {/* Specifications */}
          {specs.length > 0 && (
            <div className="mb-6">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-4">
                {t("specifications")}
              </p>
              <table className="w-full text-sm">
                <tbody>
                  {specs.map((spec, i) => (
                    <tr key={spec.label} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="font-body text-sm font-medium text-gray-500 w-32 py-2.5 px-3">
                        {spec.label}
                      </td>
                      <td className="font-body text-sm text-gray-900 py-2.5 px-3">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Colors */}
          {colors.length > 0 && (
            <div className="mb-6">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-3">
                {t("colors")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {colors.map((color) => (
                  <span
                    key={color}
                    className="rounded-sm bg-gray-100 text-gray-700 text-xs px-2 py-1 font-body"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-3">
                {t("sizes")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((size) => (
                  <span
                    key={size}
                    className="rounded-sm bg-gray-100 text-gray-700 text-xs px-2 py-1 font-body"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Supplier */}
          {product.supplier && (
            <div className="mb-8">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                {t("supplier")}
              </p>
              <p className="font-body text-sm text-gray-900 mt-1">
                {product.supplier.name}
              </p>
            </div>
          )}

          {/* Desktop quote button */}
          <div className="hidden sm:block">
            <QuoteButton
              productName={product.name}
              productSlug={product.slug}

            />
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-white border-t border-gray-200 p-4 sm:hidden">
        <QuoteButton
          productName={product.name}
          productSlug={product.slug}

          className="w-full"
        />
      </div>
    </div>
  );
}
