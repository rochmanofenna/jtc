import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories, suppliers] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.company.findMany({ where: { type: "supplier" } }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold">Edit Product</h1>
      <ProductForm
        categories={categories}
        suppliers={suppliers}
        initialData={product}
      />
    </div>
  );
}
