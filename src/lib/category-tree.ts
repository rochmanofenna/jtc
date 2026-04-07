import { prisma } from "@/lib/prisma";

/**
 * Walk the category tree starting from one or more root categories and return
 * the IDs of every descendant (including the roots themselves).
 *
 * The site has up to 4 levels: super → mid → leaf → products. This helper
 * traverses the full tree breadth-first using a single SQL query per level,
 * so it stays cheap regardless of the depth.
 */
export async function getDescendantCategoryIds(
  rootIds: string | string[]
): Promise<string[]> {
  const collected = new Set<string>();
  let frontier = Array.isArray(rootIds) ? [...rootIds] : [rootIds];

  while (frontier.length > 0) {
    for (const id of frontier) collected.add(id);

    const children = await prisma.category.findMany({
      where: { parentId: { in: frontier } },
      select: { id: true },
    });

    frontier = children.map((c) => c.id).filter((id) => !collected.has(id));
  }

  return Array.from(collected);
}

/**
 * Resolve a category by slug and return all descendant IDs (including itself),
 * or null if the slug is not found.
 */
export async function getDescendantIdsForSlug(
  slug: string
): Promise<string[] | null> {
  const root = await prisma.category.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!root) return null;
  return getDescendantCategoryIds(root.id);
}
