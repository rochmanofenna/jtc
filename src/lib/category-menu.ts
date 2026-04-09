import { prisma } from "@/lib/prisma";
import { getDescendantCategoryIds } from "@/lib/category-tree";

export interface CategoryMenuChild {
  id: string;
  name: string;
  nameCn: string | null;
  slug: string;
  productCount: number;
}

export interface CategoryMenuItem {
  id: string;
  name: string;
  nameCn: string | null;
  slug: string;
  icon: string | null;
  productCount: number;
  children: CategoryMenuChild[];
}

/**
 * Fetches the 3 super categories with their direct children (mid-level
 * categories) and deep product counts (walking the full descendant tree).
 *
 * Shared by the desktop header mega-menu and the mobile navigation drawer
 * so both surfaces render an accurate, up-to-date category structure
 * without hardcoding any slugs.
 */
export async function getCategoryMenuData(): Promise<CategoryMenuItem[]> {
  const supers = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { sortOrder: "asc" },
  });

  return Promise.all(
    supers.map(async (sup) => {
      const superIds = await getDescendantCategoryIds(sup.id);
      const productCount = await prisma.product.count({
        where: { categoryId: { in: superIds }, isActive: true },
      });

      const children = await Promise.all(
        sup.children.map(async (child) => {
          const ids = await getDescendantCategoryIds(child.id);
          const count = await prisma.product.count({
            where: { categoryId: { in: ids }, isActive: true },
          });
          return {
            id: child.id,
            name: child.name,
            nameCn: child.nameCn,
            slug: child.slug,
            productCount: count,
          };
        })
      );

      return {
        id: sup.id,
        name: sup.name,
        nameCn: sup.nameCn,
        slug: sup.slug,
        icon: sup.icon,
        productCount,
        children,
      };
    })
  );
}
