import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const [categories, suppliers] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.company.findMany({ where: { type: "supplier" } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold">Add New Product</h1>
      <ProductForm categories={categories} suppliers={suppliers} />
    </div>
  );
}
