import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('Seeding super-categories (PPE, Construction Tools, Electric Supply)...');

  // ─── 1. Create the 3 super-parent categories ───────────────────────────────

  async function upsertSuperCategory(data: {
    id: string;
    name: string;
    nameCn: string;
    slug: string;
    icon: string;
    sortOrder: number;
  }) {
    return prisma.category.upsert({
      where: { slug: data.slug },
      update: {
        name: data.name,
        nameCn: data.nameCn,
        icon: data.icon,
        sortOrder: data.sortOrder,
        parentId: null,
      },
      create: {
        id: data.id,
        name: data.name,
        nameCn: data.nameCn,
        slug: data.slug,
        icon: data.icon,
        sortOrder: data.sortOrder,
        parentId: null,
      },
    });
  }

  const ppe = await upsertSuperCategory({
    id: 'cat-ppe',
    name: 'PPE',
    nameCn: '个人防护装备',
    slug: 'ppe',
    icon: 'ShieldCheck',
    sortOrder: 1,
  });
  console.log(`  ✓ Super: ${ppe.name} (${ppe.id})`);

  const constructionTools = await upsertSuperCategory({
    id: 'cat-construction-tools',
    name: 'Construction Tools',
    nameCn: '建筑工具',
    slug: 'construction-tools',
    icon: 'Wrench',
    sortOrder: 2,
  });
  console.log(`  ✓ Super: ${constructionTools.name} (${constructionTools.id})`);

  const electricSupply = await upsertSuperCategory({
    id: 'cat-electric-supply',
    name: 'Electric Supply',
    nameCn: '电力设备',
    slug: 'electric-supply',
    icon: 'Zap',
    sortOrder: 3,
  });
  console.log(`  ✓ Super: ${electricSupply.name} (${electricSupply.id})`);

  // ─── 2. Re-parent existing categories ─────────────────────────────────────

  // PPE — 10 LOYE leaves (currently parentId: null)
  const ppeSlugs = [
    'safety-helmets',
    'gloves',
    'safety-footwear',
    'masks-respirators',
    'reflective-vests',
    'body-harnesses',
    'protective-clothing',
    'rainwear',
    'welding-equipment',
    'life-safety',
  ];

  // Construction Tools — 7 LOYE leaves
  const constructionSlugs = [
    'power-tools-battery',
    'power-tools-ac',
    'cutting-grinding-discs',
    'tapes-ties-packaging',
    'traffic-safety',
    'site-equipment',
    'woven-products',
  ];

  // Electric Supply — Anti-Static (LOYE) + Joyfull's 5 parents + LifeSmart's 1 parent
  const electricSlugs = [
    'anti-static',
    'energy-storage',
    'inverters',
    'energy-storage-systems',
    'all-in-one-systems',
    'solar-power',
    'smart-building',
  ];

  const ppeUpdate = await prisma.category.updateMany({
    where: { slug: { in: ppeSlugs } },
    data: { parentId: ppe.id },
  });
  console.log(`  ✓ Re-parented ${ppeUpdate.count} PPE child categories`);

  const constructionUpdate = await prisma.category.updateMany({
    where: { slug: { in: constructionSlugs } },
    data: { parentId: constructionTools.id },
  });
  console.log(
    `  ✓ Re-parented ${constructionUpdate.count} Construction Tools child categories`
  );

  const electricUpdate = await prisma.category.updateMany({
    where: { slug: { in: electricSlugs } },
    data: { parentId: electricSupply.id },
  });
  console.log(
    `  ✓ Re-parented ${electricUpdate.count} Electric Supply child categories`
  );

  // ─── 3. Verify ──────────────────────────────────────────────────────────────

  const tree = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: {
        include: {
          children: { select: { id: true, name: true } },
          _count: { select: { products: true } },
        },
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });

  console.log('\n─── New top-level structure ───');
  for (const root of tree) {
    console.log(`\n${root.name} (${root.slug})`);
    for (const mid of root.children) {
      const grandkidsCount = mid.children.length;
      const directProducts = mid._count.products;
      console.log(
        `  └─ ${mid.name} — ${directProducts} direct products, ${grandkidsCount} subcategories`
      );
    }
  }

  console.log('\nDone! Super-category migration complete.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
