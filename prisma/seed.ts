import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient({});

async function main() {
  console.log('Seeding Jakarta Trade Connect database...');

  // ─── 1. Create Supplier ──────────────────────────────────────────────────────

  const loye = await prisma.company.upsert({
    where: { id: 'loye-aman' },
    update: {},
    create: {
      id: 'loye-aman',
      name: 'LOYE AMAN',
      type: 'supplier',
      country: 'CN',
      description:
        'Leading Chinese manufacturer and exporter of industrial PPE, safety equipment, power tools, and worksite supplies. Specializing in safety helmets, protective clothing, gloves, footwear, welding equipment, and lithium battery power tools for the Indonesian market.',
      industry: 'PPE & Safety Equipment',
      verificationStatus: 'VERIFIED',
    },
  });

  console.log(`Created supplier: ${loye.name} (${loye.id})`);

  // ─── 2. Create Categories ────────────────────────────────────────────────────

  // Helper to upsert a category
  async function upsertCategory(data: {
    id: string;
    name: string;
    nameCn: string;
    slug: string;
    icon: string;
    sortOrder: number;
    parentId?: string;
  }) {
    return prisma.category.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        id: data.id,
        name: data.name,
        nameCn: data.nameCn,
        slug: data.slug,
        icon: data.icon,
        sortOrder: data.sortOrder,
        parentId: data.parentId,
      },
    });
  }

  // Top-level categories
  const catSafetyHelmets = await upsertCategory({
    id: 'cat-safety-helmets',
    name: 'Safety Helmets',
    nameCn: '安全帽',
    slug: 'safety-helmets',
    icon: 'HardHat',
    sortOrder: 1,
  });

  const catMasksRespirators = await upsertCategory({
    id: 'cat-masks-respirators',
    name: 'Masks & Respirators',
    nameCn: '口罩',
    slug: 'masks-respirators',
    icon: 'Shield',
    sortOrder: 2,
  });

  const catBodyHarnesses = await upsertCategory({
    id: 'cat-body-harnesses',
    name: 'Body Harnesses',
    nameCn: '安全带',
    slug: 'body-harnesses',
    icon: 'Anchor',
    sortOrder: 3,
  });

  const catReflectiveVests = await upsertCategory({
    id: 'cat-reflective-vests',
    name: 'Reflective Vests',
    nameCn: '反光衣',
    slug: 'reflective-vests',
    icon: 'Eye',
    sortOrder: 4,
  });

  const catRainwear = await upsertCategory({
    id: 'cat-rainwear',
    name: 'Rainwear',
    nameCn: '雨衣',
    slug: 'rainwear',
    icon: 'CloudRain',
    sortOrder: 5,
  });

  const catProtectiveClothing = await upsertCategory({
    id: 'cat-protective-clothing',
    name: 'Protective Clothing',
    nameCn: '防护服',
    slug: 'protective-clothing',
    icon: 'Shirt',
    sortOrder: 6,
  });

  const catGloves = await upsertCategory({
    id: 'cat-gloves',
    name: 'Gloves',
    nameCn: '手套',
    slug: 'gloves',
    icon: 'Hand',
    sortOrder: 7,
  });

  const catSafetyFootwear = await upsertCategory({
    id: 'cat-safety-footwear',
    name: 'Safety Footwear',
    nameCn: '鞋子',
    slug: 'safety-footwear',
    icon: 'Footprints',
    sortOrder: 8,
  });

  const catWeldingEquipment = await upsertCategory({
    id: 'cat-welding-equipment',
    name: 'Welding Equipment',
    nameCn: '电焊类',
    slug: 'welding-equipment',
    icon: 'Flame',
    sortOrder: 9,
  });

  const catLifeSafety = await upsertCategory({
    id: 'cat-life-safety',
    name: 'Life Safety',
    nameCn: '救生装备',
    slug: 'life-safety',
    icon: 'LifeBuoy',
    sortOrder: 10,
  });

  const catAntiStatic = await upsertCategory({
    id: 'cat-anti-static',
    name: 'Anti-Static',
    nameCn: '防静电',
    slug: 'anti-static',
    icon: 'Zap',
    sortOrder: 11,
  });

  const catPowerToolsBattery = await upsertCategory({
    id: 'cat-power-tools-battery',
    name: 'Power Tools Battery',
    nameCn: '锂电工具',
    slug: 'power-tools-battery',
    icon: 'BatteryCharging',
    sortOrder: 12,
  });

  const catPowerToolsAC = await upsertCategory({
    id: 'cat-power-tools-ac',
    name: 'Power Tools AC',
    nameCn: '交流电动工具',
    slug: 'power-tools-ac',
    icon: 'Plug',
    sortOrder: 13,
  });

  const catCuttingGrindingDiscs = await upsertCategory({
    id: 'cat-cutting-grinding-discs',
    name: 'Cutting & Grinding Discs',
    nameCn: '切割片磨光片',
    slug: 'cutting-grinding-discs',
    icon: 'Disc3',
    sortOrder: 14,
  });

  const catTapesTiesPackaging = await upsertCategory({
    id: 'cat-tapes-ties-packaging',
    name: 'Tapes, Ties & Packaging',
    nameCn: '胶带警示带扎带',
    slug: 'tapes-ties-packaging',
    icon: 'Package',
    sortOrder: 15,
  });

  const catWovenProducts = await upsertCategory({
    id: 'cat-woven-products',
    name: 'Woven Products',
    nameCn: '编织品',
    slug: 'woven-products',
    icon: 'Grid3x3',
    sortOrder: 16,
  });

  const catTrafficSafety = await upsertCategory({
    id: 'cat-traffic-safety',
    name: 'Traffic Safety',
    nameCn: '交通设施',
    slug: 'traffic-safety',
    icon: 'Construction',
    sortOrder: 17,
  });

  const catSiteEquipment = await upsertCategory({
    id: 'cat-site-equipment',
    name: 'Site Equipment',
    nameCn: '铁架床',
    slug: 'site-equipment',
    icon: 'Building',
    sortOrder: 18,
  });

  console.log('Created 18 top-level categories');

  // Subcategories
  // Safety Helmets subcategories
  const subFiberglassHelmets = await upsertCategory({
    id: 'sub-fiberglass-helmets',
    name: 'Fiberglass Helmets',
    nameCn: '玻璃钢安全帽',
    slug: 'fiberglass-helmets',
    icon: 'HardHat',
    sortOrder: 1,
    parentId: catSafetyHelmets.id,
  });

  const subAbsHelmets = await upsertCategory({
    id: 'sub-abs-helmets',
    name: 'ABS Helmets',
    nameCn: 'ABS安全帽',
    slug: 'abs-helmets',
    icon: 'HardHat',
    sortOrder: 2,
    parentId: catSafetyHelmets.id,
  });

  const subPeHelmets = await upsertCategory({
    id: 'sub-pe-helmets',
    name: 'PE Helmets',
    nameCn: 'PE安全帽',
    slug: 'pe-helmets',
    icon: 'HardHat',
    sortOrder: 3,
    parentId: catSafetyHelmets.id,
  });

  const subHelmetAccessories = await upsertCategory({
    id: 'sub-helmet-accessories',
    name: 'Helmet Accessories',
    nameCn: '安全帽配件',
    slug: 'helmet-accessories',
    icon: 'HardHat',
    sortOrder: 4,
    parentId: catSafetyHelmets.id,
  });

  // Masks & Respirators subcategories
  const subDisposableMasks = await upsertCategory({
    id: 'sub-disposable-masks',
    name: 'Disposable Masks',
    nameCn: '一次性口罩',
    slug: 'disposable-masks',
    icon: 'Shield',
    sortOrder: 1,
    parentId: catMasksRespirators.id,
  });

  const subKn95Masks = await upsertCategory({
    id: 'sub-kn95-masks',
    name: 'KN95 Masks',
    nameCn: 'KN95口罩',
    slug: 'kn95-masks',
    icon: 'Shield',
    sortOrder: 2,
    parentId: catMasksRespirators.id,
  });

  const subGasRespirators = await upsertCategory({
    id: 'sub-gas-respirators',
    name: 'Gas Respirators',
    nameCn: '防毒口罩',
    slug: 'gas-respirators',
    icon: 'Shield',
    sortOrder: 3,
    parentId: catMasksRespirators.id,
  });

  const subDustMasks = await upsertCategory({
    id: 'sub-dust-masks',
    name: 'Dust Masks',
    nameCn: '防尘口罩',
    slug: 'dust-masks',
    icon: 'Shield',
    sortOrder: 4,
    parentId: catMasksRespirators.id,
  });

  const subFilterCartridges = await upsertCategory({
    id: 'sub-filter-cartridges',
    name: 'Filter Cartridges',
    nameCn: '过滤棉',
    slug: 'filter-cartridges',
    icon: 'Shield',
    sortOrder: 5,
    parentId: catMasksRespirators.id,
  });

  // Body Harnesses subcategories
  const subFullBodyHarnesses = await upsertCategory({
    id: 'sub-full-body-harnesses',
    name: 'Full Body Harnesses',
    nameCn: '全身安全带',
    slug: 'full-body-harnesses',
    icon: 'Anchor',
    sortOrder: 1,
    parentId: catBodyHarnesses.id,
  });

  const subLanyards = await upsertCategory({
    id: 'sub-lanyards',
    name: 'Lanyards',
    nameCn: '安全绳',
    slug: 'lanyards',
    icon: 'Anchor',
    sortOrder: 2,
    parentId: catBodyHarnesses.id,
  });

  // Reflective Vests subcategories
  const subMultiPocketVests = await upsertCategory({
    id: 'sub-multi-pocket-vests',
    name: 'Multi-Pocket Vests',
    nameCn: '多口袋反光背心',
    slug: 'multi-pocket-vests',
    icon: 'Eye',
    sortOrder: 1,
    parentId: catReflectiveVests.id,
  });

  const subMeshVests = await upsertCategory({
    id: 'sub-mesh-vests',
    name: 'Mesh Vests',
    nameCn: '网状反光背心',
    slug: 'mesh-vests',
    icon: 'Eye',
    sortOrder: 2,
    parentId: catReflectiveVests.id,
  });

  const subZipperVests = await upsertCategory({
    id: 'sub-zipper-vests',
    name: 'Zipper Vests',
    nameCn: '拉链反光背心',
    slug: 'zipper-vests',
    icon: 'Eye',
    sortOrder: 3,
    parentId: catReflectiveVests.id,
  });

  const subVelcroVests = await upsertCategory({
    id: 'sub-velcro-vests',
    name: 'Velcro Vests',
    nameCn: '魔术贴反光背心',
    slug: 'velcro-vests',
    icon: 'Eye',
    sortOrder: 4,
    parentId: catReflectiveVests.id,
  });

  // Gloves subcategories
  const subWeldingGloves = await upsertCategory({
    id: 'sub-welding-gloves',
    name: 'Welding Gloves',
    nameCn: '电焊手套',
    slug: 'welding-gloves',
    icon: 'Hand',
    sortOrder: 1,
    parentId: catGloves.id,
  });

  const subCottonCanvasGloves = await upsertCategory({
    id: 'sub-cotton-canvas-gloves',
    name: 'Cotton & Canvas Gloves',
    nameCn: '棉线帆布手套',
    slug: 'cotton-canvas-gloves',
    icon: 'Hand',
    sortOrder: 2,
    parentId: catGloves.id,
  });

  const subNitrileGloves = await upsertCategory({
    id: 'sub-nitrile-gloves',
    name: 'Nitrile Gloves',
    nameCn: '丁腈手套',
    slug: 'nitrile-gloves',
    icon: 'Hand',
    sortOrder: 3,
    parentId: catGloves.id,
  });

  const subCutResistantGloves = await upsertCategory({
    id: 'sub-cut-resistant-gloves',
    name: 'Cut-Resistant Gloves',
    nameCn: '防切割手套',
    slug: 'cut-resistant-gloves',
    icon: 'Hand',
    sortOrder: 4,
    parentId: catGloves.id,
  });

  const subChemicalResistantGloves = await upsertCategory({
    id: 'sub-chemical-resistant-gloves',
    name: 'Chemical-Resistant Gloves',
    nameCn: '耐化学手套',
    slug: 'chemical-resistant-gloves',
    icon: 'Hand',
    sortOrder: 5,
    parentId: catGloves.id,
  });

  const subInsulatedGloves = await upsertCategory({
    id: 'sub-insulated-gloves',
    name: 'Insulated Gloves',
    nameCn: '绝缘手套',
    slug: 'insulated-gloves',
    icon: 'Hand',
    sortOrder: 6,
    parentId: catGloves.id,
  });

  const subAntiSlipGloves = await upsertCategory({
    id: 'sub-anti-slip-gloves',
    name: 'Anti-Slip Gloves',
    nameCn: '止滑手套',
    slug: 'anti-slip-gloves',
    icon: 'Hand',
    sortOrder: 7,
    parentId: catGloves.id,
  });

  // Safety Footwear subcategories
  const subSafetyShoes = await upsertCategory({
    id: 'sub-safety-shoes',
    name: 'Safety Shoes',
    nameCn: '安全鞋',
    slug: 'safety-shoes',
    icon: 'Footprints',
    sortOrder: 1,
    parentId: catSafetyFootwear.id,
  });

  const subSafetyBoots = await upsertCategory({
    id: 'sub-safety-boots',
    name: 'Safety Boots',
    nameCn: '安全靴',
    slug: 'safety-boots',
    icon: 'Footprints',
    sortOrder: 2,
    parentId: catSafetyFootwear.id,
  });

  const subInsulatedBoots = await upsertCategory({
    id: 'sub-insulated-boots',
    name: 'Insulated Boots',
    nameCn: '绝缘靴',
    slug: 'insulated-boots',
    icon: 'Footprints',
    sortOrder: 3,
    parentId: catSafetyFootwear.id,
  });

  const subRainBoots = await upsertCategory({
    id: 'sub-rain-boots',
    name: 'Rain Boots',
    nameCn: '雨靴',
    slug: 'rain-boots',
    icon: 'Footprints',
    sortOrder: 4,
    parentId: catSafetyFootwear.id,
  });

  console.log('Created all subcategories');

  // ─── 3. Create Products ──────────────────────────────────────────────────────

  // Helper to upsert a product
  async function upsertProduct(data: {
    id: string;
    name: string;
    nameCn: string;
    slug: string;
    description?: string;
    descriptionCn?: string;
    material?: string;
    materialCn?: string;
    specifications?: string;
    packaging?: string;
    moq?: number;
    unit?: string;
    colors?: string[];
    sizes?: string[];
    brandName?: string;
    sortOrder: number;
    categoryId: string;
  }) {
    return prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        id: data.id,
        name: data.name,
        nameCn: data.nameCn,
        slug: data.slug,
        description: data.description,
        descriptionCn: data.descriptionCn,
        material: data.material,
        materialCn: data.materialCn,
        specifications: data.specifications,
        packaging: data.packaging,
        moq: data.moq,
        unit: data.unit,
        colors: data.colors ?? [],
        sizes: data.sizes ?? [],
        brandName: data.brandName ?? 'LOYE AMAN',
        isActive: true,
        sortOrder: data.sortOrder,
        supplierId: loye.id,
        categoryId: data.categoryId,
      },
    });
  }

  // ─── Safety Helmets (安全帽) ─────────────────────────────────────────────────

  await upsertProduct({
    id: 'prod-fiberglass-v-helmet',
    name: 'Fiberglass V-Type Safety Helmet',
    nameCn: '真玻璃钢V字安全帽',
    slug: 'fiberglass-v-type-safety-helmet',
    description:
      'High-quality fiberglass V-type safety helmet with comfortable cotton lining and adjustable knob. Available in red, yellow, blue, and white.',
    descriptionCn: '真玻璃钢V字安全帽（红黄蓝白），舒适棉内衬、优质调节旋钮',
    material: 'Fiberglass with cotton lining',
    materialCn: '玻璃钢帽，舒适棉内衬、优质调节旋钮',
    packaging: '30 pcs/box',
    specifications: '30个/箱',
    moq: 30,
    unit: 'pcs',
    colors: ['Red', 'Yellow', 'Blue', 'White'],
    sortOrder: 1,
    categoryId: subFiberglassHelmets.id,
  });

  await upsertProduct({
    id: 'prod-abs-vt-ventilated-helmet',
    name: 'ABS VT Ventilated Safety Helmet',
    nameCn: 'ABS高品质VT透气孔安全帽',
    slug: 'abs-vt-ventilated-safety-helmet',
    description:
      'Premium ABS safety helmet with ventilation holes, comfortable cotton lining, and adjustable knob. Available in red, yellow, blue, and white.',
    descriptionCn:
      'ABS高品质VT透气孔安全帽（红黄蓝白），ABS、舒适棉内衬、优质调节旋钮',
    material: 'ABS with cotton lining and adjustable knob',
    materialCn: 'ABS、舒适棉内衬、优质调节旋钮',
    packaging: '30 pcs/box',
    specifications: '30个/箱',
    moq: 30,
    unit: 'pcs',
    colors: ['Red', 'Yellow', 'Blue', 'White'],
    sortOrder: 2,
    categoryId: subAbsHelmets.id,
  });

  await upsertProduct({
    id: 'prod-abs-imported-helmet',
    name: 'ABS Imported Safety Helmet',
    nameCn: 'ABS高品质安全帽',
    slug: 'abs-imported-safety-helmet',
    description:
      'Imported ABS safety helmet with ventilation holes. Available in red, yellow, blue, and white.',
    descriptionCn: 'ABS高品质安全帽（红黄蓝白），Helm Safety ABS dengan Lubang Ventilasi',
    material: 'ABS',
    materialCn: 'ABS',
    packaging: '30 pcs/carton',
    specifications: '30项/件',
    moq: 30,
    unit: 'pcs',
    colors: ['Red', 'Yellow', 'Blue', 'White'],
    sortOrder: 3,
    categoryId: subAbsHelmets.id,
  });

  await upsertProduct({
    id: 'prod-pe-gb13-helmet',
    name: 'PE GB13 Safety Helmet',
    nameCn: '国标13安全帽',
    slug: 'pe-gb13-safety-helmet',
    description:
      'PE safety helmet conforming to GB13 standard with plastic lining. Weight: 275g. Available in red, yellow, blue, and white.',
    descriptionCn: '国标13安全帽（红黄蓝白），PE材质，塑料内衬，重量275克',
    material: 'PE',
    materialCn: 'PE',
    packaging: '50 pcs/carton',
    specifications: '50项/件, Berat: 275 gram',
    moq: 50,
    unit: 'pcs',
    colors: ['Red', 'Yellow', 'Blue', 'White'],
    sortOrder: 4,
    categoryId: subPeHelmets.id,
  });

  await upsertProduct({
    id: 'prod-pp-180b-helmet',
    name: 'PP 180-B Safety Helmet',
    nameCn: '盔式安全帽',
    slug: 'pp-180b-safety-helmet',
    description:
      'PP cap-style safety helmet model 180-B. Weight: 290g. Available in red, yellow, blue, and white.',
    descriptionCn: '盔式安全帽（红黄蓝白），PP材质，重量290克',
    material: 'PP',
    materialCn: 'PP',
    packaging: '40 pcs/carton',
    specifications: '40项/件, Berat: 290 gram',
    moq: 40,
    unit: 'pcs',
    colors: ['Red', 'Yellow', 'Blue', 'White'],
    sortOrder: 5,
    categoryId: subPeHelmets.id,
  });

  await upsertProduct({
    id: 'prod-helmet-face-shield',
    name: 'Safety Helmet with Face Shield',
    nameCn: '安全帽防溅面屏',
    slug: 'safety-helmet-face-shield',
    description:
      'PVC safety helmet face shield attachment for splash and impact protection.',
    descriptionCn: '安全帽防溅面屏，PVC材质',
    material: 'PVC',
    materialCn: 'PVC',
    packaging: '100 pcs/box',
    specifications: '100个/箱',
    moq: 100,
    unit: 'pcs',
    sortOrder: 6,
    categoryId: subHelmetAccessories.id,
  });

  console.log('Created safety helmet products');

  // ─── Masks & Respirators (口罩) ──────────────────────────────────────────────

  await upsertProduct({
    id: 'prod-disposable-mask',
    name: 'Disposable Face Mask',
    nameCn: '一次性口罩',
    slug: 'disposable-face-mask',
    description:
      'Non-woven disposable face mask. 50 pcs per pack, sold by pack (not individually). Paper box packaging option with 1000 pcs.',
    descriptionCn: '一次性口罩，无纺布，50个/包（按包卖不拆零）要纸盒加1000',
    material: 'Non-woven fabric',
    materialCn: '无纺布',
    packaging: '50 pcs/pack, 1000 pcs with paper box',
    specifications: '50个/包（按包卖不拆零）要纸盒加1000',
    moq: 50,
    unit: 'pcs',
    sortOrder: 1,
    categoryId: subDisposableMasks.id,
  });

  await upsertProduct({
    id: 'prod-kn95-changsheng',
    name: 'KN95 Mask Chang Sheng',
    nameCn: '畅胜KN95口罩',
    slug: 'kn95-mask-chang-sheng',
    description:
      'KN95 rated face mask by Chang Sheng. Made with non-woven fabric, D-shaped cotton, and KN filter material. 20 pcs per box, 600 pcs per carton.',
    descriptionCn: '畅胜KN95口罩，无纺布、D型棉、KN滤材，20个/盒，600个/件',
    material: 'Non-woven fabric, D-shaped cotton, KN filter',
    materialCn: '无纺布、D型棉、KN滤材',
    packaging: '20 pcs/box, 600 pcs/carton',
    specifications: '20个/盒, 600个/件',
    moq: 20,
    unit: 'pcs',
    brandName: 'Chang Sheng',
    sortOrder: 2,
    categoryId: subKn95Masks.id,
  });

  await upsertProduct({
    id: 'prod-foldable-mask-9801v',
    name: 'Foldable Mask 9801V with Valve',
    nameCn: '折叠口罩9801v',
    slug: 'foldable-mask-9801v',
    description:
      'KN95 rated foldable mask with exhalation valve. 500 pcs per box, 2 pcs per bag.',
    descriptionCn: '折叠口罩9801v，带呼吸阀KN95，500个/箱，2个/袋',
    material: 'KN95 with exhalation valve',
    materialCn: '带呼吸阀KN95',
    packaging: '500 pcs/box, 2 pcs/bag',
    specifications: '500个/箱, 2个/袋',
    moq: 2,
    unit: 'pcs',
    sortOrder: 3,
    categoryId: subKn95Masks.id,
  });

  await upsertProduct({
    id: 'prod-370-filter-cotton',
    name: '370 High-Efficiency Filter Cotton',
    nameCn: '370高效过滤棉',
    slug: '370-high-efficiency-filter-cotton',
    description:
      'High-efficiency filter cotton pads (model 370) for dust masks. 500 pcs per box.',
    descriptionCn: '370高效过滤棉，500片/箱',
    packaging: '500 pcs/box',
    specifications: '500片/箱',
    moq: 500,
    unit: 'pcs',
    sortOrder: 4,
    categoryId: subFilterCartridges.id,
  });

  await upsertProduct({
    id: 'prod-602-filter-cotton',
    name: '602 High-Efficiency Filter Cotton for Gas Masks',
    nameCn: '602高效过滤棉',
    slug: '602-high-efficiency-filter-cotton',
    description:
      'High-efficiency filter cotton pads (model 602) for gas mask respirators. 70 pcs per box.',
    descriptionCn: '602高效过滤棉，防毒口罩用，70片/箱',
    material: 'For gas respirators',
    materialCn: '防毒口罩用',
    packaging: '70 pcs/box',
    specifications: '70片/箱',
    moq: 70,
    unit: 'pcs',
    sortOrder: 5,
    categoryId: subFilterCartridges.id,
  });

  await upsertProduct({
    id: 'prod-mg801-silicone-dust-mask-set',
    name: 'MG801 Silicone Dual-Canister Dust Mask Set',
    nameCn: '畅胜MG801液态硅胶双罐防尘面罩套装',
    slug: 'mg801-silicone-dual-canister-dust-mask-set',
    description:
      'Liquid silicone dual-canister dust mask set by Chang Sheng, model MG801. 18 sets per box.',
    descriptionCn: '畅胜MG801液态硅胶双罐防尘面罩套装，18个/箱',
    packaging: '18 sets/box',
    specifications: '18个/箱',
    moq: 18,
    unit: 'sets',
    brandName: 'Chang Sheng',
    sortOrder: 6,
    categoryId: subDustMasks.id,
  });

  await upsertProduct({
    id: 'prod-3000-dust-mask',
    name: '3000 Anti-Dust Mask',
    nameCn: '3000防尘口罩',
    slug: '3000-anti-dust-mask',
    description: 'Model 3000 anti-dust half-face mask. 60 pcs per box.',
    descriptionCn: '3000防尘口罩，60个/箱',
    packaging: '60 pcs/box',
    specifications: '60个/箱',
    moq: 60,
    unit: 'pcs',
    sortOrder: 7,
    categoryId: subDustMasks.id,
  });

  await upsertProduct({
    id: 'prod-2030-gas-mask',
    name: '2030 Gas Respirator Mask',
    nameCn: '2030防毒口罩',
    slug: '2030-gas-respirator-mask',
    description:
      'Model 2030 gas respirator half-face mask. TPE elastic body with PP and ABS fittings. 30 pcs per box.',
    descriptionCn: '2030防毒口罩，弹性体TPE，配件是PP和ABS，30个/箱',
    material: 'TPE body, PP and ABS fittings',
    materialCn: '弹性体TPE，配件是PP和ABS',
    packaging: '30 pcs/box',
    specifications: '30个/箱',
    moq: 30,
    unit: 'pcs',
    sortOrder: 8,
    categoryId: subGasRespirators.id,
  });

  await upsertProduct({
    id: 'prod-6200-gas-mask',
    name: '6200 Gas Respirator Mask',
    nameCn: '6200防毒口罩',
    slug: '6200-gas-respirator-mask',
    description:
      'Model 6200 gas respirator half-face mask. TPE elastic body with PP and ABS fittings. 30 pcs per box.',
    descriptionCn: '6200防毒口罩，弹性体TPE，配件是PP和ABS，30个/箱',
    material: 'TPE body, PP and ABS fittings',
    materialCn: '弹性体TPE，配件是PP和ABS',
    packaging: '30 pcs/box',
    specifications: '30个/箱',
    moq: 30,
    unit: 'pcs',
    sortOrder: 9,
    categoryId: subGasRespirators.id,
  });

  console.log('Created masks & respirators products');

  // ─── Body Harnesses (安全带) ─────────────────────────────────────────────────

  await upsertProduct({
    id: 'prod-harness-d-absorber-double-hook-2m',
    name: 'Body Harness D with Shock Absorber Double Hook 2M',
    nameCn: '安全带D缓冲双大钩2米',
    slug: 'body-harness-d-absorber-double-hook-2m',
    description:
      'Full body harness model D with shock absorber pack and double large hooks, 2 meter lanyard. Polyester material. 15 pcs per pack.',
    descriptionCn: '安全带D缓冲双大钩2米，涤纶，缓冲包、双大钩，15条/包',
    material: 'Polyester',
    materialCn: '涤纶',
    packaging: '15 pcs/pack',
    specifications: '缓冲包、双大钩, 15条/包',
    moq: 15,
    unit: 'pcs',
    sortOrder: 1,
    categoryId: subFullBodyHarnesses.id,
  });

  await upsertProduct({
    id: 'prod-harness-5point-no-absorber',
    name: 'Body Harness 5-Point Without Shock Absorber Double Hook',
    nameCn: '五点式不带缓冲双大钩安全带',
    slug: 'body-harness-5-point-no-absorber-double-hook',
    description:
      'Five-point full body harness without shock absorber, with double large hooks. Polyester material. 15 pcs per pack.',
    descriptionCn:
      '五点式不带缓冲双大钩安全带，涤纶，无缓冲双大钩，15条/包',
    material: 'Polyester',
    materialCn: '涤纶',
    packaging: '15 pcs/pack',
    specifications: '无缓冲双大钩, 15条/包',
    moq: 15,
    unit: 'pcs',
    sortOrder: 2,
    categoryId: subFullBodyHarnesses.id,
  });

  await upsertProduct({
    id: 'prod-harness-d-absorber-single-hook-2m',
    name: 'Body Harness D with Shock Absorber Single Hook 2M',
    nameCn: '安全带D缓冲单大钩2米',
    slug: 'body-harness-d-absorber-single-hook-2m',
    description:
      'Full body harness model D with shock absorber pack and single large hook, 2 meter lanyard. Polyester material.',
    descriptionCn: '安全带D缓冲单大钩2米，涤纶，缓冲包、单大钩',
    material: 'Polyester',
    materialCn: '涤纶',
    specifications: '缓冲包、单大钩',
    moq: 1,
    unit: 'pcs',
    sortOrder: 3,
    categoryId: subFullBodyHarnesses.id,
  });

  await upsertProduct({
    id: 'prod-harness-d-connected-single-hook',
    name: 'Body Harness D Connected with Single Large Hook Lanyard',
    nameCn: '安全带D连体单大钩',
    slug: 'body-harness-d-connected-single-hook-lanyard',
    description:
      'Full body harness model D with integrated single large hook lanyard, no shock absorber. Polyester material.',
    descriptionCn: '安全带D连体单大钩，涤纶，无缓冲单大钩',
    material: 'Polyester',
    materialCn: '涤纶',
    specifications: '无缓冲单大钩',
    moq: 1,
    unit: 'pcs',
    sortOrder: 4,
    categoryId: subFullBodyHarnesses.id,
  });

  await upsertProduct({
    id: 'prod-single-hook-lanyard-absorber',
    name: 'Single Hook Safety Lanyard with Shock Absorber',
    nameCn: '单钩安全带缓冲绳',
    slug: 'single-hook-lanyard-with-absorber',
    description:
      'Single hook safety lanyard with shock absorber pack, 2 meter length. Polyester material.',
    descriptionCn: '单钩安全带缓冲绳，涤纶，缓冲包、单大钩，2米',
    material: 'Polyester',
    materialCn: '涤纶',
    specifications: '缓冲包、单大钩, 2米',
    moq: 1,
    unit: 'pcs',
    sortOrder: 5,
    categoryId: subLanyards.id,
  });

  await upsertProduct({
    id: 'prod-single-hook-lanyard',
    name: 'Single Hook Safety Lanyard',
    nameCn: '单钩安全绳',
    slug: 'single-hook-safety-lanyard',
    description:
      'Single hook safety lanyard without shock absorber, 2 meter length with large hook. Polyester material.',
    descriptionCn: '单钩安全绳，涤纶，无缓冲单大钩2米',
    material: 'Polyester',
    materialCn: '涤纶',
    specifications: '无缓冲单大钩2米',
    moq: 1,
    unit: 'pcs',
    sortOrder: 6,
    categoryId: subLanyards.id,
  });

  console.log('Created body harness products');

  // ─── Reflective Vests (反光衣) ───────────────────────────────────────────────

  await upsertProduct({
    id: 'prod-multi-pocket-reflective-vest',
    name: 'Premium Multi-Pocket Reflective Safety Vest',
    nameCn: '优质高亮多口袋反光背心',
    slug: 'premium-multi-pocket-reflective-safety-vest',
    description:
      'High-quality, high-visibility multi-pocket reflective safety vest made from knitted polyester fabric. 300 pcs per pack.',
    descriptionCn:
      '优质高亮多口袋反光背心，针织布，涤纶，300件/包',
    material: 'Knitted polyester fabric',
    materialCn: '针织布，涤纶',
    packaging: '300 pcs/pack',
    specifications: '300件/包',
    moq: 300,
    unit: 'pcs',
    colors: [
      'Fluorescent Green',
      'Orange Red',
      'Dark Blue',
      'Grass Green',
      'Golden Yellow',
      'Red',
    ],
    sortOrder: 1,
    categoryId: subMultiPocketVests.id,
  });

  await upsertProduct({
    id: 'prod-mesh-peach-heart-reflective-vest',
    name: 'Premium Mesh Peach-Heart Pocket Reflective Vest',
    nameCn: '优质高亮桃心网口袋款反光背心',
    slug: 'premium-mesh-peach-heart-pocket-reflective-vest',
    description:
      'High-quality mesh-style reflective safety vest with peach-heart pockets. Made from mesh knitted polyester fabric. 300 pcs per pack.',
    descriptionCn:
      '优质高亮桃心网口袋款反光背心，网状针织布，涤纶，300件/包',
    material: 'Mesh knitted polyester fabric',
    materialCn: '网状针织布，涤纶',
    packaging: '300 pcs/pack',
    specifications: '300件/包',
    moq: 300,
    unit: 'pcs',
    colors: [
      'Fluorescent Green',
      'Orange Red',
      'Dark Blue',
      'Grass Green',
      'Golden Yellow',
      'Red',
    ],
    sortOrder: 2,
    categoryId: subMeshVests.id,
  });

  await upsertProduct({
    id: 'prod-orange-zipper-reflective-vest',
    name: 'Orange Cotton-Polyester Zipper Reflective Vest',
    nameCn: '桔色涤棉单兜拉链反光背',
    slug: 'orange-cotton-polyester-zipper-reflective-vest',
    description:
      'Orange cotton-polyester blend zipper reflective vest with single pocket. Thickened material.',
    descriptionCn: '桔色涤棉单兜拉链反光背，加厚',
    material: 'Cotton-polyester blend, thickened',
    materialCn: '加厚',
    moq: 1,
    unit: 'pcs',
    colors: ['Orange Red'],
    sortOrder: 3,
    categoryId: subZipperVests.id,
  });

  await upsertProduct({
    id: 'prod-green-zipper-reflective-vest',
    name: 'Fluorescent Green Cotton-Polyester Zipper Reflective Vest',
    nameCn: '荧光绿涤棉单兜拉链背心',
    slug: 'fluorescent-green-cotton-polyester-zipper-reflective-vest',
    description:
      'Fluorescent green cotton-polyester blend zipper reflective vest with single pocket. Thickened material.',
    descriptionCn: '荧光绿涤棉单兜拉链背心，加厚',
    material: 'Cotton-polyester blend, thickened',
    materialCn: '加厚',
    moq: 1,
    unit: 'pcs',
    colors: ['Fluorescent Green'],
    sortOrder: 4,
    categoryId: subZipperVests.id,
  });

  await upsertProduct({
    id: 'prod-velcro-reflective-vest',
    name: 'Velcro Reflective Safety Vest',
    nameCn: '魔术贴反光背心',
    slug: 'velcro-reflective-safety-vest',
    description:
      'Velcro-closure reflective safety vest made from knitted polyester fabric. 500 pcs per pack.',
    descriptionCn: '魔术贴反光背心，针织布，涤纶，500件/包',
    material: 'Knitted polyester fabric',
    materialCn: '针织布，涤纶',
    packaging: '500 pcs/pack',
    specifications: '500件/包',
    moq: 500,
    unit: 'pcs',
    colors: ['Fluorescent Green', 'Orange Red'],
    sortOrder: 5,
    categoryId: subVelcroVests.id,
  });

  await upsertProduct({
    id: 'prod-local-reflective-vest',
    name: 'Standard Reflective Safety Vest',
    nameCn: '本地产反光背心',
    slug: 'standard-reflective-safety-vest',
    description:
      'Locally produced standard reflective safety vest in fluorescent green.',
    descriptionCn: '本地产反光背心，荧光绿',
    moq: 1,
    unit: 'pcs',
    colors: ['Fluorescent Green'],
    sortOrder: 6,
    categoryId: catReflectiveVests.id,
  });

  console.log('Created reflective vest products');

  // ─── Rainwear (雨衣) ─────────────────────────────────────────────────────────

  await upsertProduct({
    id: 'prod-raincoat-set-99',
    name: 'Raincoat Set Model 99',
    nameCn: '99雨衣套装',
    slug: 'raincoat-set-99',
    description: 'PVC raincoat set model 99. 100 pcs per pack.',
    descriptionCn: '99雨衣套装，PVC，100件/包',
    material: 'PVC',
    materialCn: 'PVC',
    packaging: '100 pcs/pack',
    specifications: '100件/包',
    moq: 100,
    unit: 'pcs',
    sortOrder: 1,
    categoryId: catRainwear.id,
  });

  await upsertProduct({
    id: 'prod-raincoat-set-98',
    name: 'Raincoat Set Model 98',
    nameCn: '98雨衣套装',
    slug: 'raincoat-set-98',
    description: 'PVC raincoat set model 98. 50 pcs per pack.',
    descriptionCn: '98雨衣套装，PVC，50件/包',
    material: 'PVC',
    materialCn: 'PVC',
    packaging: '50 pcs/pack',
    specifications: '50件/包',
    moq: 50,
    unit: 'pcs',
    sortOrder: 2,
    categoryId: catRainwear.id,
  });

  await upsertProduct({
    id: 'prod-eva-raincoat',
    name: 'EVA Raincoat',
    nameCn: 'EVA雨衣',
    slug: 'eva-raincoat',
    description:
      'EVA material raincoat, recyclable, odorless, windproof, rainproof, wear-resistant, scratch-resistant. Available in 100g and 140g versions. 200 pcs per pack.',
    descriptionCn:
      'EVA雨衣，循环使用、没有异味、防风防雨、耐磨防刮，100g/件或140g/件，200件/包',
    material: 'EVA',
    materialCn: 'EVA',
    packaging: '200 pcs/pack',
    specifications: '100g/件 200件/包; 140g/件 200件/包',
    moq: 200,
    unit: 'pcs',
    sortOrder: 3,
    categoryId: catRainwear.id,
  });

  await upsertProduct({
    id: 'prod-trench-raincoat-blue',
    name: 'Trench-Style Raincoat (Blue)',
    nameCn: '风衣雨衣(蓝色)',
    slug: 'trench-style-raincoat-blue',
    description:
      'Blue trench-style raincoat made from Oxford fabric. 5 pcs per bundle, 100 pcs per pack.',
    descriptionCn: '风衣雨衣(蓝色)5单件/捆，牛津纺，100件/包',
    material: 'Oxford fabric',
    materialCn: '牛津纺',
    packaging: '5 pcs/bundle, 100 pcs/pack',
    specifications: '5单件/捆, 100件/包',
    moq: 5,
    unit: 'pcs',
    colors: ['Blue'],
    sortOrder: 4,
    categoryId: catRainwear.id,
  });

  console.log('Created rainwear products');

  // ─── Protective Clothing (防护服) ────────────────────────────────────────────

  await upsertProduct({
    id: 'prod-protective-suit-xianghefniao',
    name: 'Xiang He Niao Protective Suit',
    nameCn: '祥和鸟防护服',
    slug: 'xiang-he-niao-protective-suit',
    description:
      'Reusable protective suit by Xiang He Niao brand. 52 pcs per box.',
    descriptionCn: '祥和鸟防护服，可多次使用，52件/箱',
    material: 'Reusable fabric',
    materialCn: '可多次使用',
    packaging: '52 pcs/box',
    specifications: '52件/箱',
    moq: 52,
    unit: 'pcs',
    brandName: 'Xiang He Niao',
    sortOrder: 1,
    categoryId: catProtectiveClothing.id,
  });

  await upsertProduct({
    id: 'prod-protective-suit-t90',
    name: 'Protective Suit T90 (Thickened)',
    nameCn: '防护服 T90',
    slug: 'protective-suit-t90',
    description:
      'Thickened reusable protective suit model T90. 30 pcs per box.',
    descriptionCn: '防护服 T90，加厚，可多次使用，30件/箱',
    material: 'Thickened, reusable',
    materialCn: '加厚，可多次使用',
    packaging: '30 pcs/box',
    specifications: '30件/箱',
    moq: 30,
    unit: 'pcs',
    sortOrder: 2,
    categoryId: catProtectiveClothing.id,
  });

  // Work uniforms (under protective clothing / site equipment)
  await upsertProduct({
    id: 'prod-custom-work-uniform',
    name: 'Custom Work Uniform',
    nameCn: '工作服定做',
    slug: 'custom-work-uniform',
    description:
      'Custom-made work uniform with options for printing and embroidery. Minimum order 200 sets. Made to customer specifications.',
    descriptionCn: '工作服定做，来图定制，可印字、绣字，200套起订',
    material: 'Custom to specification',
    materialCn: '来图定制',
    specifications: '可印字、绣字，200套起订',
    moq: 200,
    unit: 'sets',
    sortOrder: 3,
    categoryId: catSiteEquipment.id,
  });

  await upsertProduct({
    id: 'prod-ready-made-work-uniform',
    name: 'Ready-Made Work Uniform',
    nameCn: '成品工作服',
    slug: 'ready-made-work-uniform',
    description:
      'Ready-made work uniform available in sizes M to XXXL.',
    descriptionCn: '成品工作服，Pakaian kerja siap pakai',
    moq: 1,
    unit: 'sets',
    sizes: ['M', 'L', 'XL', 'XXL', 'XXXL'],
    sortOrder: 4,
    categoryId: catSiteEquipment.id,
  });

  await upsertProduct({
    id: 'prod-safety-environment-work-uniform',
    name: 'Safety & Environment Work Uniform',
    nameCn: '安环工作服',
    slug: 'safety-environment-work-uniform',
    description:
      'Safety and environment-compliant work uniform with high-visibility accents. Available in sizes M to XXXL.',
    descriptionCn: '安环工作服，Pakaian kerja yang aman dan ramah lingkungan',
    moq: 1,
    unit: 'sets',
    sizes: ['M', 'L', 'XL', 'XXL', 'XXXL'],
    sortOrder: 5,
    categoryId: catSiteEquipment.id,
  });

  console.log('Created protective clothing and work uniform products');

  // ─── Life Safety (救生装备) ──────────────────────────────────────────────────

  await upsertProduct({
    id: 'prod-life-jacket',
    name: 'Life Jacket',
    nameCn: '救生衣',
    slug: 'life-jacket',
    description:
      'Standard life jacket made from Oxford fabric. One size fits all. 80 pcs per pack.',
    descriptionCn: '救生衣，牛津布，均码，80件/包',
    material: 'Oxford fabric',
    materialCn: '牛津布',
    packaging: '80 pcs/pack',
    specifications: '均码, 80件/包',
    moq: 80,
    unit: 'pcs',
    sortOrder: 1,
    categoryId: catLifeSafety.id,
  });

  await upsertProduct({
    id: 'prod-life-buoy',
    name: 'Life Buoy',
    nameCn: '救生圈',
    slug: 'life-buoy',
    description:
      'Life buoy ring made from Oxford fabric with solid foam core. 10 pcs per pack.',
    descriptionCn: '救生圈，牛津布实心泡沫，10个/包',
    material: 'Oxford fabric with solid foam',
    materialCn: '牛津布实心泡沫',
    packaging: '10 pcs/pack',
    specifications: '10个/包',
    moq: 10,
    unit: 'pcs',
    sortOrder: 2,
    categoryId: catLifeSafety.id,
  });

  console.log('Created life safety products');

  // ─── Welding Equipment (电焊类) ──────────────────────────────────────────────

  await upsertProduct({
    id: 'prod-welding-goggles',
    name: 'Welding Safety Goggles',
    nameCn: '电焊眼镜',
    slug: 'welding-safety-goggles',
    description:
      'PC lens welding safety goggles available in red/white and black/red color combinations. 480 pcs per box.',
    descriptionCn: '电焊眼镜（红白，黑红），PC，480个/箱',
    material: 'PC (Polycarbonate)',
    materialCn: 'PC',
    packaging: '480 pcs/box',
    specifications: '480个/箱',
    moq: 480,
    unit: 'pcs',
    colors: ['Red/White', 'Black/Red'],
    sortOrder: 1,
    categoryId: catWeldingEquipment.id,
  });

  await upsertProduct({
    id: 'prod-clear-safety-goggles',
    name: 'Clear Protective Safety Goggles',
    nameCn: '透明劳保护目镜(防尘防溅防冲击防雾)',
    slug: 'clear-protective-safety-goggles',
    description:
      'Clear protective safety goggles with anti-dust, anti-splash, anti-impact, and anti-fog properties. 200 pcs per box.',
    descriptionCn: '透明劳保护目镜(防尘防溅防冲击防雾)，200个/箱',
    packaging: '200 pcs/box',
    specifications: '200个/箱',
    moq: 200,
    unit: 'pcs',
    sortOrder: 2,
    categoryId: catWeldingEquipment.id,
  });

  await upsertProduct({
    id: 'prod-handheld-welding-mask-red',
    name: 'Handheld Welding Mask (Red)',
    nameCn: '手持电焊面罩',
    slug: 'handheld-welding-mask-red',
    description: 'Handheld welding mask in red color. 50 pcs per box.',
    descriptionCn: '手持电焊面罩，50个/箱，红色',
    packaging: '50 pcs/box',
    specifications: '50个/箱',
    moq: 50,
    unit: 'pcs',
    colors: ['Red'],
    sortOrder: 3,
    categoryId: catWeldingEquipment.id,
  });

  await upsertProduct({
    id: 'prod-handheld-welding-mask-pvc-black',
    name: 'Handheld Welding Mask PVC (Black)',
    nameCn: '手持电焊面罩 PVC',
    slug: 'handheld-welding-mask-pvc-black',
    description: 'Handheld welding mask made from PVC in black color. 40 pcs per box.',
    descriptionCn: '手持电焊面罩，PVC，40个/箱，黑色',
    material: 'PVC',
    materialCn: 'PVC',
    packaging: '40 pcs/box',
    specifications: '40个/箱',
    moq: 40,
    unit: 'pcs',
    colors: ['Black'],
    sortOrder: 4,
    categoryId: catWeldingEquipment.id,
  });

  await upsertProduct({
    id: 'prod-head-mounted-welding-mask',
    name: 'Head-Mounted Welding Mask',
    nameCn: '头戴式电焊面罩',
    slug: 'head-mounted-welding-mask',
    description:
      'Head-mounted welding mask made from PVC in black color. 30 pcs per box.',
    descriptionCn: '头戴式电焊面罩，PVC，30个/箱，黑色',
    material: 'PVC',
    materialCn: 'PVC',
    packaging: '30 pcs/box',
    specifications: '30个/箱',
    moq: 30,
    unit: 'pcs',
    colors: ['Black'],
    sortOrder: 5,
    categoryId: catWeldingEquipment.id,
  });

  await upsertProduct({
    id: 'prod-welding-glass-lens-white',
    name: 'Welding Glass Lens (White/Clear)',
    nameCn: '电焊玻璃镜片(白色)',
    slug: 'welding-glass-lens-white',
    description:
      'Clear/white welding glass lens replacement. 1000 pcs per box.',
    descriptionCn: '电焊玻璃镜片(白色)，玻璃，1000片/箱，透明',
    material: 'Glass',
    materialCn: '玻璃',
    packaging: '1000 pcs/box',
    specifications: '1000片/箱, 透明',
    moq: 1000,
    unit: 'pcs',
    colors: ['Clear'],
    sortOrder: 6,
    categoryId: catWeldingEquipment.id,
  });

  await upsertProduct({
    id: 'prod-welding-glass-lens-black',
    name: 'Welding Glass Lens (Black)',
    nameCn: '电焊玻璃镜片(黑色)',
    slug: 'welding-glass-lens-black',
    description:
      'Dark/black welding glass lens replacement, shade #8. 800 pcs per box.',
    descriptionCn: '电焊玻璃镜片(黑色)，玻璃，800片/箱，8号黑色',
    material: 'Glass',
    materialCn: '玻璃',
    packaging: '800 pcs/box',
    specifications: '800片/箱, 8号黑色',
    moq: 800,
    unit: 'pcs',
    colors: ['Black'],
    sortOrder: 7,
    categoryId: catWeldingEquipment.id,
  });

  console.log('Created welding equipment products');

  // ─── Gloves (手套) ───────────────────────────────────────────────────────────

  await upsertProduct({
    id: 'prod-short-welding-gloves',
    name: 'Premium Short Welding Gloves',
    nameCn: '优质短电焊手套',
    slug: 'premium-short-welding-gloves',
    description:
      'Premium short cowhide leather welding gloves. Assorted colors. 240 pairs per carton.',
    descriptionCn: '优质短电焊手套，牛皮，彩包颜色随机，240双/件',
    material: 'Cowhide leather',
    materialCn: '牛皮',
    packaging: '240 pairs/carton',
    specifications: '彩包颜色随机, 240双/件',
    moq: 240,
    unit: 'pairs',
    sortOrder: 1,
    categoryId: subWeldingGloves.id,
  });

  await upsertProduct({
    id: 'prod-long-welding-gloves',
    name: 'Premium Long Welding Gloves',
    nameCn: '优质长电焊手套',
    slug: 'premium-long-welding-gloves',
    description:
      'Premium long cowhide leather welding gloves, heat resistant. Top-layer cowhide. 72 pairs per carton.',
    descriptionCn: '优质长电焊手套，牛皮，头层牛皮，72双/件',
    material: 'Top-layer cowhide leather',
    materialCn: '头层牛皮',
    packaging: '72 pairs/carton',
    specifications: '头层牛皮, 72双/件',
    moq: 72,
    unit: 'pairs',
    sortOrder: 2,
    categoryId: subWeldingGloves.id,
  });

  await upsertProduct({
    id: 'prod-canvas-gloves-24-thread',
    name: 'Premium Canvas Gloves (24-Thread)',
    nameCn: '优质加密帆布手套',
    slug: 'premium-canvas-gloves-24-thread',
    description:
      'Premium high-density canvas gloves, 24-thread. 24cm x 13cm. White edge: 350 pairs/carton. Red edge: 300 pairs/carton. Priced per pair.',
    descriptionCn:
      '优质加密帆布手套，优质帆布，24线，白边350双/件，红边300双/件，标价为每双',
    material: 'Premium canvas',
    materialCn: '优质帆布',
    packaging: 'White edge: 350 pairs/carton; Red edge: 300 pairs/carton',
    specifications: '24线, 24cm x 13cm',
    moq: 300,
    unit: 'pairs',
    sortOrder: 3,
    categoryId: subCottonCanvasGloves.id,
  });

  await upsertProduct({
    id: 'prod-cotton-gloves-6-thread',
    name: 'Cotton Thread Gloves (6-Thread)',
    nameCn: '本地6线棉线手套',
    slug: 'cotton-thread-gloves-6-thread',
    description:
      'Locally produced 6-thread cotton gloves. 50 pairs/dozen, 600 pairs/pack. Priced per pair.',
    descriptionCn: '本地6线棉线手套，6线，50双/打，600双/包，标价为每双',
    material: '6-thread cotton',
    materialCn: '6线',
    packaging: '50 pairs/dozen, 600 pairs/pack',
    specifications: '6线, 50双/打, 600双/包',
    moq: 50,
    unit: 'pairs',
    sortOrder: 4,
    categoryId: subCottonCanvasGloves.id,
  });

  await upsertProduct({
    id: 'prod-cotton-gloves-8-thread',
    name: 'Cotton Thread Gloves (8-Thread)',
    nameCn: '本地8线棉线手套',
    slug: 'cotton-thread-gloves-8-thread',
    description:
      'Locally produced 8-thread cotton gloves. 50 pairs/dozen, 600 pairs/pack. Priced per pair.',
    descriptionCn: '本地8线棉线手套，8线，50双/打，600双/包，标价每双',
    material: '8-thread cotton',
    materialCn: '8线',
    packaging: '50 pairs/dozen, 600 pairs/pack',
    specifications: '8线, 50双/打, 600双/包',
    moq: 50,
    unit: 'pairs',
    sortOrder: 5,
    categoryId: subCottonCanvasGloves.id,
  });

  await upsertProduct({
    id: 'prod-patterned-yarn-gloves-700g',
    name: 'Patterned Yarn Gloves (700g)',
    nameCn: '700克花纱线手套',
    slug: 'patterned-yarn-gloves-700g',
    description:
      'Patterned yarn gloves, 700g weight. 600 pairs per carton. Priced per pair.',
    descriptionCn: '700克花纱线手套，花纱，600双/件，标价为每双',
    material: 'Patterned yarn',
    materialCn: '花纱',
    packaging: '600 pairs/carton',
    specifications: '700g, 600双/件',
    moq: 600,
    unit: 'pairs',
    sortOrder: 6,
    categoryId: subCottonCanvasGloves.id,
  });

  await upsertProduct({
    id: 'prod-dotted-plastic-gloves',
    name: 'PVC Dotted Cotton Gloves',
    nameCn: '点塑线手套',
    slug: 'pvc-dotted-cotton-gloves',
    description:
      'Cotton gloves with PVC dot grip pattern. 720 pairs per carton. 12 pairs per bag.',
    descriptionCn: '点塑线手套，毛纺+点塑，720双/件，12双/袋',
    material: 'Wool yarn + PVC dots',
    materialCn: '毛纺+点塑',
    packaging: '720 pairs/carton, 12 pairs/bag',
    specifications: '720双/件, 12双/袋',
    moq: 12,
    unit: 'pairs',
    sortOrder: 7,
    categoryId: subAntiSlipGloves.id,
  });

  await upsertProduct({
    id: 'prod-super-wear-resistant-gloves',
    name: 'Super Wear-Resistant Yarn Gloves',
    nameCn: '超耐磨线手套',
    slug: 'super-wear-resistant-yarn-gloves',
    description:
      'Super wear-resistant yarn gloves, 600g weight. Small pack: 12 pairs/bag. Large pack: 720 pairs/carton.',
    descriptionCn: '超耐磨线手套，毛纺，重量600g，小包装12双/袋，大包装720双/件',
    material: 'Wool yarn',
    materialCn: '毛纺',
    packaging: 'Small: 12 pairs/bag; Large: 720 pairs/carton',
    specifications: '重量600g, 小包装12双/袋, 大包装720双/件',
    moq: 12,
    unit: 'pairs',
    sortOrder: 8,
    categoryId: subCottonCanvasGloves.id,
  });

  await upsertProduct({
    id: 'prod-nitrile-dipped-gloves',
    name: 'White Yarn Blue Nitrile Half-Dipped Gloves',
    nameCn: '白纱蓝丁腈半挂手套',
    slug: 'white-yarn-blue-nitrile-half-dipped-gloves',
    description:
      'White yarn gloves with blue nitrile half-dip coating, 32g weight. Small pack: 12 pairs/pack. Large pack: 960 pairs/carton.',
    descriptionCn:
      '白纱蓝丁腈半挂手套，丁腈，重量32g，小包装12双/包，大包装960双/件',
    material: 'Nitrile',
    materialCn: '丁腈',
    packaging: 'Small: 12 pairs/pack; Large: 960 pairs/carton',
    specifications: '重量32g, 小包装12双/包, 大包装960双/件',
    moq: 12,
    unit: 'pairs',
    sortOrder: 9,
    categoryId: subNitrileGloves.id,
  });

  await upsertProduct({
    id: 'prod-metal-cut-resistant-gloves',
    name: 'Metal Cut-Resistant Gloves',
    nameCn: '金属材质防切割手套',
    slug: 'metal-cut-resistant-gloves',
    description:
      'Metal material cut-resistant gloves. 50 pieces per box, sold individually.',
    descriptionCn: '金属材质防切割手套，50只/箱，按只卖',
    packaging: '50 pcs/box, sold individually',
    specifications: '50只/箱, 按只卖',
    moq: 1,
    unit: 'pcs',
    sortOrder: 10,
    categoryId: subCutResistantGloves.id,
  });

  await upsertProduct({
    id: 'prod-pvc-anti-slip-gloves',
    name: 'PVC Anti-Slip Rubber Gloves',
    nameCn: '止滑手套（胶手套）',
    slug: 'pvc-anti-slip-rubber-gloves',
    description:
      'PVC granule anti-slip gloves, waterproof, oil-resistant, corrosion-resistant. Small pack: 10 pairs/bag. Large pack: 100 pairs/carton.',
    descriptionCn:
      '止滑手套（胶手套），PVC，防水耐油耐腐蚀，小包装10双/袋，大包装100双/件',
    material: 'PVC',
    materialCn: 'PVC',
    packaging: 'Small: 10 pairs/bag; Large: 100 pairs/carton',
    specifications: '小包装10双/袋, 大包装100双/件',
    moq: 10,
    unit: 'pairs',
    sortOrder: 11,
    categoryId: subAntiSlipGloves.id,
  });

  await upsertProduct({
    id: 'prod-rubber-industrial-gloves',
    name: 'Rubber Industrial Gloves',
    nameCn: '橡胶工业手套',
    slug: 'rubber-industrial-gloves',
    description:
      'Acid and alkali resistant, corrosion resistant rubber industrial gloves. Available in sizes 35, 45, and 55. Size 35: 100 pairs/carton. Size 45 and 55: 50 pairs/carton.',
    descriptionCn:
      '橡胶工业手套，耐酸碱耐腐蚀，35码100双/件，45码50双/件，55码50/件',
    material: 'Rubber',
    materialCn: '橡胶',
    packaging: 'Size 35: 100 pairs/carton; Size 45/55: 50 pairs/carton',
    specifications: '耐酸碱耐腐蚀',
    moq: 50,
    unit: 'pairs',
    sizes: ['35', '45', '55'],
    sortOrder: 12,
    categoryId: subChemicalResistantGloves.id,
  });

  await upsertProduct({
    id: 'prod-12kv-insulated-gloves',
    name: '12KV Insulated Gloves',
    nameCn: '12KV绝缘手套',
    slug: '12kv-insulated-gloves',
    description:
      '12KV rated insulated rubber gloves for electrical work. 40 pairs per carton.',
    descriptionCn: '12KV绝缘手套12KV，橡胶，12千伏，40双/件',
    material: 'Rubber',
    materialCn: '橡胶',
    packaging: '40 pairs/carton',
    specifications: '12千伏, 40双/件',
    moq: 40,
    unit: 'pairs',
    sortOrder: 13,
    categoryId: subInsulatedGloves.id,
  });

  await upsertProduct({
    id: 'prod-35kv-insulated-gloves',
    name: '35KV High-Voltage Insulated Gloves',
    nameCn: '35KV高压绝缘手套',
    slug: '35kv-high-voltage-insulated-gloves',
    description:
      '35KV rated high-voltage insulated rubber gloves for electrical work. 6 pairs per carton.',
    descriptionCn: '35KV高压绝缘手套，橡胶，35千伏，6双/件',
    material: 'Rubber',
    materialCn: '橡胶',
    packaging: '6 pairs/carton',
    specifications: '35千伏, 6双/件',
    moq: 6,
    unit: 'pairs',
    sortOrder: 14,
    categoryId: subInsulatedGloves.id,
  });

  await upsertProduct({
    id: 'prod-nitrile-thin-gloves',
    name: 'Thin Nitrile Examination Gloves',
    nameCn: '丁腈光里手套',
    slug: 'thin-nitrile-examination-gloves',
    description:
      'Thin nitrile examination gloves. Available in sizes L, S, and M.',
    descriptionCn: '丁腈光里手套，丁腈，L/S/M',
    material: 'Nitrile',
    materialCn: '丁腈',
    moq: 1,
    unit: 'pairs',
    sizes: ['S', 'M', 'L'],
    sortOrder: 15,
    categoryId: subNitrileGloves.id,
  });

  await upsertProduct({
    id: 'prod-disposable-nitrile-gloves',
    name: 'Disposable Nitrile Gloves',
    nameCn: '普通一次性丁腈手套',
    slug: 'disposable-nitrile-gloves',
    description:
      'Standard disposable nitrile gloves in blue. Available in M and L sizes. 50 pairs per small box, 1000 pairs per carton. Sold by small box, not individually.',
    descriptionCn:
      '普通一次性丁腈手套，丁腈，蓝色，M码和L码，50双/小盒，1000双/件（按小盒卖不拆零）',
    material: 'Nitrile',
    materialCn: '丁腈',
    packaging: '50 pairs/small box, 1000 pairs/carton',
    specifications: '50双/小盒, 1000双/件（按小盒卖不拆零）',
    moq: 50,
    unit: 'pairs',
    colors: ['Blue'],
    sizes: ['M', 'L'],
    sortOrder: 16,
    categoryId: subNitrileGloves.id,
  });

  await upsertProduct({
    id: 'prod-ansell-disposable-nitrile-gloves',
    name: 'Ansell 93-833 Disposable Nitrile Gloves',
    nameCn: '安思尔一次性丁腈手套',
    slug: 'ansell-93-833-disposable-nitrile-gloves',
    description:
      'Ansell Microflex 93-833 disposable nitrile gloves, size XL. 115 pairs per box. Sold by box, not individually.',
    descriptionCn:
      '安思尔93-833一次性丁腈手套，丁腈，XL码，115双/盒，按小盒卖不拆零',
    material: 'Nitrile',
    materialCn: '丁腈',
    packaging: '115 pairs/box',
    specifications: '安思尔93-833, XL(115双/盒)按小盒卖不拆零',
    moq: 115,
    unit: 'pairs',
    sizes: ['XL'],
    brandName: 'Ansell',
    sortOrder: 17,
    categoryId: subNitrileGloves.id,
  });

  console.log('Created glove products');

  // ─── Safety Footwear (鞋子) ──────────────────────────────────────────────────

  await upsertProduct({
    id: 'prod-ax30029-safety-shoes',
    name: 'Honeywell AX30029 Anti-Smash Anti-Puncture Anti-Static Safety Shoes',
    nameCn: 'AX30029防砸防刺防静电',
    slug: 'honeywell-ax30029-safety-shoes',
    description:
      'Honeywell AX30029 safety shoes with anti-smash, anti-puncture, and anti-static protection. Cowhide upper with PU sole. Available in sizes 38, 39, 40.',
    descriptionCn:
      'AX30029防砸防刺防静电，鞋面：牛皮，鞋底：PU，38、39、40码',
    material: 'Cowhide upper, PU sole',
    materialCn: '鞋面：牛皮，鞋底：PU',
    moq: 1,
    unit: 'pairs',
    sizes: ['38', '39', '40'],
    brandName: 'Honeywell',
    sortOrder: 1,
    categoryId: subSafetyShoes.id,
  });

  await upsertProduct({
    id: 'prod-loye-low-cut-safety-shoes',
    name: 'LOYE Low-Cut Anti-Smash Anti-Puncture Safety Shoes',
    nameCn: 'LOYE低帮防砸防刺穿安全鞋',
    slug: 'loye-low-cut-safety-shoes',
    description:
      'LOYE branded low-cut safety shoes with anti-smash and anti-puncture protection. Cowhide upper with PU sole and Kevlar bottom. Available in sizes 37, 41-45.',
    descriptionCn:
      'LOYE低帮防砸防刺穿安全鞋，鞋面：牛皮，鞋底：PU，凯夫拉底，37、41、42、43、44、45码',
    material: 'Cowhide upper, PU sole, Kevlar bottom',
    materialCn: '鞋面：牛皮，鞋底：PU，凯夫拉底',
    moq: 1,
    unit: 'pairs',
    sizes: ['37', '41', '42', '43', '44', '45'],
    sortOrder: 2,
    categoryId: subSafetyShoes.id,
  });

  await upsertProduct({
    id: 'prod-026-standard-safety-shoes',
    name: '026 Standard Safety Work Shoes',
    nameCn: '026标准工作鞋',
    slug: '026-standard-safety-work-shoes',
    description:
      '026 model standard safety work shoes with anti-smash, anti-static, anti-puncture protection and 12KV insulation.',
    descriptionCn: '026标准工作鞋，防砸防静电防刺穿绝缘12KV',
    specifications: '防砸防静电防刺穿绝缘12KV',
    moq: 1,
    unit: 'pairs',
    sortOrder: 3,
    categoryId: subSafetyShoes.id,
  });

  await upsertProduct({
    id: 'prod-502-mid-cut-safety-boots',
    name: '502 Mid-Cut Safety Boots',
    nameCn: '502高筒中靴劳保鞋防砸防刺穿',
    slug: '502-mid-cut-safety-boots',
    description:
      '502 model mid-cut cowhide safety boots with anti-smash and anti-puncture protection. Available in sizes 40-44.',
    descriptionCn: '502高筒中靴劳保鞋防砸防刺穿，牛皮，40、41、42、43、44',
    material: 'Cowhide leather',
    materialCn: '牛皮',
    moq: 1,
    unit: 'pairs',
    sizes: ['40', '41', '42', '43', '44'],
    sortOrder: 4,
    categoryId: subSafetyBoots.id,
  });

  await upsertProduct({
    id: 'prod-805-mining-safety-boots',
    name: '805 Standard Mining Safety Boots',
    nameCn: '805标准矿业工作靴',
    slug: '805-standard-mining-safety-boots',
    description:
      '805 model standard mining work boots with anti-smash, anti-static, anti-puncture protection and 12KV insulation.',
    descriptionCn: '805标准矿业工作靴，防砸防静电防刺穿绝缘12KV',
    specifications: '防砸防静电防刺穿绝缘12KV',
    moq: 1,
    unit: 'pairs',
    sortOrder: 5,
    categoryId: subSafetyBoots.id,
  });

  await upsertProduct({
    id: 'prod-20kv-insulated-boots',
    name: '20KV Insulated Safety Boots',
    nameCn: '20KV绝缘靴',
    slug: '20kv-insulated-safety-boots',
    description:
      '20KV rated insulated rubber safety boots. 10 pairs per box. Available in sizes 39-45.',
    descriptionCn:
      '20KV绝缘靴，橡胶，10双/箱，45/275, 44/270, 43/265, 42/260, 41/255, 40/250, 39/245',
    material: 'Rubber',
    materialCn: '橡胶',
    packaging: '10 pairs/box',
    specifications: '10双/箱',
    moq: 10,
    unit: 'pairs',
    sizes: ['39/245', '40/250', '41/255', '42/260', '43/265', '44/270', '45/275'],
    sortOrder: 6,
    categoryId: subInsulatedBoots.id,
  });

  await upsertProduct({
    id: 'prod-35kv-insulated-boots',
    name: '35KV High-Voltage Insulated Safety Boots',
    nameCn: '35KV高压绝缘靴',
    slug: '35kv-high-voltage-insulated-safety-boots',
    description:
      '35KV rated high-voltage insulated rubber safety boots. 6 pairs per box. Available in sizes 39-45.',
    descriptionCn:
      '35KV高压绝缘靴，橡胶，6双/箱，45/275, 44/270, 43/265, 42/260, 41/255, 40/250, 39/245',
    material: 'Rubber',
    materialCn: '橡胶',
    packaging: '6 pairs/box',
    specifications: '6双/箱',
    moq: 6,
    unit: 'pairs',
    sizes: ['39/245', '40/250', '41/255', '42/260', '43/265', '44/270', '45/275'],
    sortOrder: 7,
    categoryId: subInsulatedBoots.id,
  });

  await upsertProduct({
    id: 'prod-black-rain-boots',
    name: 'Standard Black Rain Boots',
    nameCn: '普通黑色雨靴',
    slug: 'standard-black-rain-boots',
    description:
      'Standard black PVC rain boots. Available in sizes 39-44.',
    descriptionCn: '普通黑色雨靴，PVC，39码-44码',
    material: 'PVC',
    materialCn: 'PVC',
    moq: 1,
    unit: 'pairs',
    sizes: ['39', '40', '41', '42', '43', '44'],
    colors: ['Black'],
    sortOrder: 8,
    categoryId: subRainBoots.id,
  });

  await upsertProduct({
    id: 'prod-yellow-rain-boots',
    name: 'Standard Yellow Rain Boots',
    nameCn: '普通黄色雨靴',
    slug: 'standard-yellow-rain-boots',
    description:
      'Standard yellow PVC rain boots. 15 pairs per box. Available in sizes 39-44.',
    descriptionCn: '普通黄色雨靴，PVC，15双/箱，39码-44码',
    material: 'PVC',
    materialCn: 'PVC',
    packaging: '15 pairs/box',
    specifications: '15双/箱',
    moq: 15,
    unit: 'pairs',
    sizes: ['39', '40', '41', '42', '43', '44'],
    colors: ['Yellow'],
    sortOrder: 9,
    categoryId: subRainBoots.id,
  });

  await upsertProduct({
    id: 'prod-steel-toe-rain-boots',
    name: 'Steel-Toe Rain Boots',
    nameCn: '钢头雨靴',
    slug: 'steel-toe-rain-boots',
    description:
      'PVC rain boots with steel toe protection. 12 pairs per box. Available in sizes 39-44.',
    descriptionCn: '钢头雨靴，PVC，钢头，12双/箱，39码-44码',
    material: 'PVC with steel toe',
    materialCn: 'PVC，钢头',
    packaging: '12 pairs/box',
    specifications: '12双/箱',
    moq: 12,
    unit: 'pairs',
    sizes: ['39', '40', '41', '42', '43', '44'],
    sortOrder: 10,
    categoryId: subRainBoots.id,
  });

  console.log('Created safety footwear products');

  // ─── Anti-Static (防静电) ────────────────────────────────────────────────────

  await upsertProduct({
    id: 'prod-single-station-anti-static-alarm',
    name: 'Single-Station Anti-Static Alarm',
    nameCn: '单工位防静电报警器',
    slug: 'single-station-anti-static-alarm',
    description:
      'Single-station anti-static alarm monitor. 50 pcs per carton.',
    descriptionCn: '单工位防静电报警器，50个/件',
    packaging: '50 pcs/carton',
    specifications: '50个/件',
    moq: 50,
    unit: 'pcs',
    sortOrder: 1,
    categoryId: catAntiStatic.id,
  });

  await upsertProduct({
    id: 'prod-double-station-anti-static-alarm',
    name: 'Double-Station Anti-Static Alarm',
    nameCn: '双工位防静电报警器',
    slug: 'double-station-anti-static-alarm',
    description:
      'Double-station anti-static alarm monitor. 50 pcs per carton.',
    descriptionCn: '双工位防静电报警器，50个/件',
    packaging: '50 pcs/carton',
    specifications: '50个/件',
    moq: 50,
    unit: 'pcs',
    sortOrder: 2,
    categoryId: catAntiStatic.id,
  });

  await upsertProduct({
    id: 'prod-anti-static-wrist-strap-2-5m',
    name: 'Anti-Static Wrist Strap (2.5m)',
    nameCn: '防静电手环 2.5米',
    slug: 'anti-static-wrist-strap-2-5m',
    description:
      'PU anti-static wrist strap with 2.5 meter cord length.',
    descriptionCn: '防静电手环，PU，线长2.5米',
    material: 'PU',
    materialCn: 'PU',
    specifications: '线长：2.5米',
    moq: 1,
    unit: 'pcs',
    sortOrder: 3,
    categoryId: catAntiStatic.id,
  });

  await upsertProduct({
    id: 'prod-anti-static-wrist-strap-1-8m',
    name: 'Anti-Static Wrist Strap (1.8m)',
    nameCn: '防静电手环 1.8米',
    slug: 'anti-static-wrist-strap-1-8m',
    description:
      'PU anti-static wrist strap with 1.8 meter cord length.',
    descriptionCn: '防静电手环，PU，线长1.8米',
    material: 'PU',
    materialCn: 'PU',
    specifications: '线长：1.8米',
    moq: 1,
    unit: 'pcs',
    sortOrder: 4,
    categoryId: catAntiStatic.id,
  });

  console.log('Created anti-static products');

  // ─── Power Tools Battery (锂电工具) ──────────────────────────────────────────

  await upsertProduct({
    id: 'prod-16v-brushless-drill-1500',
    name: '16V Brushless Impact Drill NW-D8163C-1500 5C',
    nameCn: '16V无刷冲击款锂电钻NW-D8163C-1500 5C',
    slug: '16v-brushless-impact-drill-nw-d8163c-1500',
    description:
      'Nanwei 16V brushless impact lithium drill, model NW-D8163C-1500 5C. Includes 2x 1.5Ah battery packs and 1x 0.6A charger. Battery platform: 1500 5C.',
    descriptionCn:
      '16V无刷冲击款锂电钻NW-D8163C-1500 5C，电池平台1500 5C，1.5Ah电池包x2，0.6A座充充电器x1',
    specifications: '电池平台：1500 5C, 1.5Ah电池包x2, 0.6A座充充电器x1',
    moq: 1,
    unit: 'pcs',
    brandName: 'Nanwei',
    sortOrder: 1,
    categoryId: catPowerToolsBattery.id,
  });

  await upsertProduct({
    id: 'prod-16v-brushless-drill-2000',
    name: '16V Brushless Impact Drill NW-D8163C-2000 5C',
    nameCn: '16V无刷冲击款锂电钻NW-D8163C-2000 5C',
    slug: '16v-brushless-impact-drill-nw-d8163c-2000',
    description:
      'Nanwei 16V brushless impact lithium drill, model NW-D8163C-2000 5C. Includes 2x 2Ah battery packs and 1x 0.6A charger. Battery platform: 2000 5C.',
    descriptionCn:
      '16V无刷冲击款锂电钻NW-D8163C-2000 5C，电池平台2000 5C，2Ah电池包x2，0.6A座充充电器x1',
    specifications: '电池平台：2000 5C, 2Ah电池包x2, 0.6A座充充电器x1',
    moq: 1,
    unit: 'pcs',
    brandName: 'Nanwei',
    sortOrder: 2,
    categoryId: catPowerToolsBattery.id,
  });

  await upsertProduct({
    id: 'prod-20v-brushless-drill-1500',
    name: '20V Brushless Impact Drill NW-8213C-1500 5C',
    nameCn: '20v无刷冲击款锂电钻NW-8213C-1500 5C',
    slug: '20v-brushless-impact-drill-nw-8213c-1500',
    description:
      'Nanwei 20V brushless impact lithium drill, model NW-8213C-1500 5C. Includes 2x 1.5Ah battery packs and 1x 0.6A charger.',
    descriptionCn:
      '20v无刷冲击款锂电钻NW-8213C-1500 5C，电池平台1500 5C，1.5Ah电池包x2，0.6A座充充电器x1',
    specifications: '电池平台：1500 5C, 1.5Ah电池包x2, 0.6A座充充电器x1',
    moq: 1,
    unit: 'pcs',
    brandName: 'Nanwei',
    sortOrder: 3,
    categoryId: catPowerToolsBattery.id,
  });

  await upsertProduct({
    id: 'prod-20v-brushless-drill-2000',
    name: '20V Brushless Impact Drill NW-8213C-2000 5C',
    nameCn: '20v无刷冲击款锂电钻NW-8213C-2000 5C',
    slug: '20v-brushless-impact-drill-nw-8213c-2000',
    description:
      'Nanwei 20V brushless impact lithium drill, model NW-8213C-2000 5C. Includes 2x 2Ah battery packs and 1x 0.6A charger.',
    descriptionCn:
      '20v无刷冲击款锂电钻NW-8213C-2000 5C，电池平台2000 5C，2Ah电池包x2，0.6A座充充电器x1',
    specifications: '电池平台：2000 5C, 2Ah电池包x2, 0.6A座充充电器x1',
    moq: 1,
    unit: 'pcs',
    brandName: 'Nanwei',
    sortOrder: 4,
    categoryId: catPowerToolsBattery.id,
  });

  await upsertProduct({
    id: 'prod-20v-brushless-13mm-drill-1500',
    name: '20V Brushless 13mm Impact Drill NW-D8216C-1500 5C',
    nameCn: '20v无刷冲击款13mm锂电钻NW-D8216C-1500 5C',
    slug: '20v-brushless-13mm-impact-drill-nw-d8216c-1500',
    description:
      'Nanwei 20V brushless 13mm impact lithium drill, model NW-D8216C-1500 5C. Includes 2x 1.5Ah battery packs and 1x 0.6A charger.',
    descriptionCn:
      '20v无刷冲击款13mm锂电钻NW-D8216C-1500 5C，电池平台1500 5C，1.5Ah电池包x2，0.6A座充充电器x1',
    specifications: '电池平台：1500 5C, 1.5Ah电池包x2, 0.6A座充充电器x1',
    moq: 1,
    unit: 'pcs',
    brandName: 'Nanwei',
    sortOrder: 5,
    categoryId: catPowerToolsBattery.id,
  });

  await upsertProduct({
    id: 'prod-20v-brushless-13mm-drill-2000',
    name: '20V Brushless 13mm Impact Drill NW-D8216C-2000 5C',
    nameCn: '20v无刷冲击款13mm锂电钻NW-D8216C-2000 5C',
    slug: '20v-brushless-13mm-impact-drill-nw-d8216c-2000',
    description:
      'Nanwei 20V brushless 13mm impact lithium drill, model NW-D8216C-2000 5C. Includes 2x 2Ah battery packs and 1x 0.6A charger.',
    descriptionCn:
      '20v无刷冲击款13mm锂电钻NW-D8216C-2000 5C，电池平台2000 5C，2Ah电池包x2，0.6A座充充电器x1',
    specifications: '电池平台：2000 5C, 2Ah电池包x2, 0.6A座充充电器x1',
    moq: 1,
    unit: 'pcs',
    brandName: 'Nanwei',
    sortOrder: 6,
    categoryId: catPowerToolsBattery.id,
  });

  await upsertProduct({
    id: 'prod-500nm-brushless-wrench-1500',
    name: '500N.m Brushless Impact Wrench NW-W8500-1500 5C',
    nameCn: '500N.m无刷锂电扳手NW-W8500-1500 5C',
    slug: '500nm-brushless-impact-wrench-nw-w8500-1500',
    description:
      'Nanwei 500N.m brushless lithium impact wrench, model NW-W8500-1500 5C. Includes 2x 1.5Ah battery packs and 1x 0.6A charger.',
    descriptionCn:
      '500N.m无刷锂电扳手NW-W8500-1500 5C，电池平台1500 5C，1.5Ah电池包x2，0.6A座充充电器x1',
    specifications: '电池平台：1500 5C, 1.5Ah电池包x2, 0.6A座充充电器x1',
    moq: 1,
    unit: 'pcs',
    brandName: 'Nanwei',
    sortOrder: 7,
    categoryId: catPowerToolsBattery.id,
  });

  await upsertProduct({
    id: 'prod-500nm-brushless-wrench-2000',
    name: '500N.m Brushless Impact Wrench NW-W8500-2000 5C',
    nameCn: '500N.m无刷锂电扳手NW-W8500-2000 5C',
    slug: '500nm-brushless-impact-wrench-nw-w8500-2000',
    description:
      'Nanwei 500N.m brushless lithium impact wrench, model NW-W8500-2000 5C. Includes 2x 2Ah battery packs and 1x 0.6A charger.',
    descriptionCn:
      '500N.m无刷锂电扳手NW-W8500-2000 5C，电池平台2000 5C，2Ah电池包x2，0.6A座充充电器x1',
    specifications: '电池平台：2000 5C, 2Ah电池包x2, 0.6A座充充电器x1',
    moq: 1,
    unit: 'pcs',
    brandName: 'Nanwei',
    sortOrder: 8,
    categoryId: catPowerToolsBattery.id,
  });

  await upsertProduct({
    id: 'prod-1000nm-brushless-wrench-1500',
    name: '1000N.m Brushless Impact Wrench NW-W8100-1500 5C',
    nameCn: '1000N.m无刷锂电扳手NW-W8100-1500 5C',
    slug: '1000nm-brushless-impact-wrench-nw-w8100-1500',
    description:
      'Nanwei 1000N.m brushless lithium impact wrench, model NW-W8100-1500 5C. Includes 2x 1.5Ah battery packs and 1x 0.6A charger.',
    descriptionCn:
      '1000N.m无刷锂电扳手NW-W8100-1500 5C，电池平台1500 5C，1.5Ah电池包x2，0.6A座充充电器x1',
    specifications: '电池平台：1500 5C, 1.5Ah电池包x2, 0.6A座充充电器x1',
    moq: 1,
    unit: 'pcs',
    brandName: 'Nanwei',
    sortOrder: 9,
    categoryId: catPowerToolsBattery.id,
  });

  await upsertProduct({
    id: 'prod-1000nm-brushless-wrench-2000',
    name: '1000N.m Brushless Impact Wrench NW-W8100-2000 5C',
    nameCn: '1000N.m无刷锂电扳手NW-W8100-2000 5C',
    slug: '1000nm-brushless-impact-wrench-nw-w8100-2000',
    description:
      'Nanwei 1000N.m brushless lithium impact wrench, model NW-W8100-2000 5C. Includes 2x 2Ah battery packs and 1x 0.6A charger.',
    descriptionCn:
      '1000N.m无刷锂电扳手NW-W8100-2000 5C，电池平台2000 5C，2Ah电池包x2，0.6A座充充电器x1',
    specifications: '电池平台：2000 5C, 2Ah电池包x2, 0.6A座充充电器x1',
    moq: 1,
    unit: 'pcs',
    brandName: 'Nanwei',
    sortOrder: 10,
    categoryId: catPowerToolsBattery.id,
  });

  await upsertProduct({
    id: 'prod-100-brushless-angle-grinder-1500',
    name: '100mm Brushless Angle Grinder NW-A8132-1500 5C',
    nameCn: '100型无刷锂电角磨机NW-A8132-1500 5C',
    slug: '100mm-brushless-angle-grinder-nw-a8132-1500',
    description:
      'Nanwei 100mm brushless lithium angle grinder, model NW-A8132-1500 5C. Includes 2x 1.5Ah battery packs and 1x 0.6A charger.',
    descriptionCn:
      '100型无刷锂电角磨机NW-A8132-1500 5C，电池平台1500 5C，1.5Ah电池包x2，0.6A座充充电器x1',
    specifications: '电池平台：1500 5C, 1.5Ah电池包x2, 0.6A座充充电器x1',
    moq: 1,
    unit: 'pcs',
    brandName: 'Nanwei',
    sortOrder: 11,
    categoryId: catPowerToolsBattery.id,
  });

  await upsertProduct({
    id: 'prod-100-brushless-angle-grinder-2000',
    name: '100mm Brushless Angle Grinder NW-A8132-2000 5C',
    nameCn: '100型无刷锂电角磨机NW-A8132-2000 5C',
    slug: '100mm-brushless-angle-grinder-nw-a8132-2000',
    description:
      'Nanwei 100mm brushless lithium angle grinder, model NW-A8132-2000 5C. Includes 2x 2Ah battery packs and 1x 0.6A charger.',
    descriptionCn:
      '100型无刷锂电角磨机NW-A8132-2000 5C，电池平台2000 5C，2Ah电池包x2，0.6A座充充电器x1',
    specifications: '电池平台：2000 5C, 2Ah电池包x2, 0.6A座充充电器x1',
    moq: 1,
    unit: 'pcs',
    brandName: 'Nanwei',
    sortOrder: 12,
    categoryId: catPowerToolsBattery.id,
  });

  await upsertProduct({
    id: 'prod-26-brushless-hammer-1500',
    name: '26mm Brushless Rotary Hammer NW-H8261-1500 5C',
    nameCn: '26型无刷锂电轻锤NW-H8261-1500 5C',
    slug: '26mm-brushless-rotary-hammer-nw-h8261-1500',
    description:
      'Nanwei 26mm brushless lithium rotary hammer, model NW-H8261-1500 5C. Includes 2x 1.5Ah battery packs and 1x 0.6A charger.',
    descriptionCn:
      '26型无刷锂电轻锤NW-H8261-1500 5C，电池平台1500 5C，1.5Ah电池包x2，0.6A座充充电器x1',
    specifications: '电池平台：1500 5C, 1.5Ah电池包x2, 0.6A座充充电器x1',
    moq: 1,
    unit: 'pcs',
    brandName: 'Nanwei',
    sortOrder: 13,
    categoryId: catPowerToolsBattery.id,
  });

  await upsertProduct({
    id: 'prod-26-brushless-hammer-2000',
    name: '26mm Brushless Rotary Hammer NW-H8261-2000 5C',
    nameCn: '26型无刷锂电轻锤NW-H8261-2000 5C',
    slug: '26mm-brushless-rotary-hammer-nw-h8261-2000',
    description:
      'Nanwei 26mm brushless lithium rotary hammer, model NW-H8261-2000 5C. Includes 2x 2Ah battery packs and 1x 0.6A charger.',
    descriptionCn:
      '26型无刷锂电轻锤NW-H8261-2000 5C，电池平台2000 5C，2Ah电池包x2，0.6A座充充电器x1',
    specifications: '电池平台：2000 5C, 2Ah电池包x2, 0.6A座充充电器x1',
    moq: 1,
    unit: 'pcs',
    brandName: 'Nanwei',
    sortOrder: 14,
    categoryId: catPowerToolsBattery.id,
  });

  console.log('Created battery power tool products');

  // ─── Power Tools AC (交流电动工具) ───────────────────────────────────────────

  await upsertProduct({
    id: 'prod-angle-grinder-nbt-ag-125nc',
    name: 'Angle Grinder NBT-AG-125NC (Side Switch)',
    nameCn: '角磨机NBT-AG-125NC',
    slug: 'angle-grinder-nbt-ag-125nc',
    description:
      'AC angle grinder model NBT-AG-125NC with side switch. Rated power: 800W. No-load speed: 11000 RPM. Max disc diameter: 125mm. Net weight: 2.3kg. Includes housing, side handle, wrench, carbon brushes, and manual with warranty card.',
    descriptionCn:
      '角磨机NBT-AG-125NC（Side Switch），额定输入功率800W，空载转速11000转/分钟，最大轮径φ125毫米，毛重2.3公斤',
    material: 'Metal housing',
    specifications:
      '额定输入功率：800W, 空载转速：11000 RPM, 最大轮径：φ125mm, 净重：2.3kg',
    moq: 1,
    unit: 'pcs',
    brandName: 'NBT',
    sortOrder: 1,
    categoryId: catPowerToolsAC.id,
  });

  await upsertProduct({
    id: 'prod-rotary-hammer-nbt-rh-26a',
    name: 'Rotary Hammer NBT-RH-26A',
    nameCn: '电锤NBT-RH-26A',
    slug: 'rotary-hammer-nbt-rh-26a',
    description:
      'SDS Plus rotary hammer model NBT-RH-26A. Original model: GBH2-26. Power: 800W. Chuck diameter: 26mm. Speed: 0-1260/0-1150 RPM. Includes carbon brushes, side handle, ruler, chisels, drill bits, and manual.',
    descriptionCn:
      '电锤NBT-RH-26A，SDS PLUS，原型号GBH2-26，功率800W，夹头直径26mm，转速0-1260/0-1150 rpm',
    specifications:
      'SDS Plus, 功率：800W, 夹头直径：26mm, 转速：0-1260/0-1150 rpm',
    moq: 1,
    unit: 'pcs',
    brandName: 'NBT',
    sortOrder: 2,
    categoryId: catPowerToolsAC.id,
  });

  await upsertProduct({
    id: 'prod-rotary-hammer-nbt-rh-26d',
    name: 'Rotary Hammer NBT-RH-26D',
    nameCn: '电锤NBT-RH-26D',
    slug: 'rotary-hammer-nbt-rh-26d',
    description:
      'SDS Plus rotary hammer model NBT-RH-26D. Rated power: 1050W. No-load speed: 820 RPM. Impact frequency: 4500/min. Impact energy: 4.0J. Drilling capacity: Steel 13mm, Concrete 26mm, Wood 40mm. Net weight: 4.6kg. Includes auxiliary handle, drill bits, chisels, lubricant, wrench, and dust cover.',
    descriptionCn:
      '电锤NBT-RH-26D，SDS Plus，额定输入功率1050W，空载转速820转/分钟，冲击频率4500次/分钟，冲击能量4.0焦耳，钻孔能力：钢材13毫米、混凝土26毫米、木材40毫米，净重4.6千克',
    specifications:
      'SDS Plus, 功率：1050W, 空载转速：820 RPM, 冲击频率：4500次/分钟, 冲击能量：4.0J, 净重：4.6kg',
    moq: 1,
    unit: 'pcs',
    brandName: 'NBT',
    sortOrder: 3,
    categoryId: catPowerToolsAC.id,
  });

  await upsertProduct({
    id: 'prod-demolition-hammer-nbt-dh-17f',
    name: 'Demolition Hammer NBT-DH-17F',
    nameCn: '电镐NBT-DH-17F',
    slug: 'demolition-hammer-nbt-dh-17f',
    description:
      'SDS HEX demolition hammer model NBT-DH-17F. Rated power: 1300W. Impact frequency: 3700 BPM. Impact energy: 20J. Net weight: 6.45kg. Includes auxiliary handle, chisels, carbon brushes, lubricant, wrench, and manual with warranty card.',
    descriptionCn:
      '电镐NBT-DH-17F，SDS HEX，额定输入功率1300W，冲击频率3700BPM，冲击能量20J，净重6.45kg',
    specifications:
      'SDS HEX, 功率：1300W, 冲击频率：3700 BPM, 冲击能量：20J, 净重：6.45kg',
    moq: 1,
    unit: 'pcs',
    brandName: 'NBT',
    sortOrder: 4,
    categoryId: catPowerToolsAC.id,
  });

  await upsertProduct({
    id: 'prod-circular-saw-nbt-cs-185b',
    name: 'Circular Saw NBT-CS-185B',
    nameCn: '电圆锯NBT-CS-185B',
    slug: 'circular-saw-nbt-cs-185b',
    description:
      'AC circular saw model NBT-CS-185B. Power: 1450W. Rated speed: 4500 RPM. Cutting size: 185mm. Cutting angle: 45/90 degrees. Includes carbon brushes, ruler, wrench, and 7-inch 40-tooth carbide blade.',
    descriptionCn:
      '电圆锯NBT-CS-185B，输入功率1450W，额定转速4500转/分钟，切割尺寸185毫米，切割角度45°/90°',
    specifications:
      '功率：1450W, 额定转速：4500 RPM, 切割尺寸：185mm, 切割角度：45°/90°',
    moq: 1,
    unit: 'pcs',
    brandName: 'NBT',
    sortOrder: 5,
    categoryId: catPowerToolsAC.id,
  });

  await upsertProduct({
    id: 'prod-cut-off-machine-nbt-mc-110b',
    name: 'Cut-Off Machine NBT-MC-110B',
    nameCn: '切割机NBT-MC-110B',
    slug: 'cut-off-machine-nbt-mc-110b',
    description:
      'AC cut-off machine model NBT-MC-110B. Original model: CM4SB. Power: 1300W. Rated speed: 12000 RPM. Cutting size: 110mm. Cutting depth: 30mm. Cutting angle: 90 degrees. Includes wrenches and carbon brushes.',
    descriptionCn:
      '切割机NBT-MC-110B，原型号CM4SB，输入功率1300W，额定转速12000转/分钟，切割尺寸110毫米，切割深度30毫米，切割角度90°',
    specifications:
      '功率：1300W, 额定转速：12000 RPM, 切割尺寸：110mm, 切割深度：30mm, 切割角度：90°',
    moq: 1,
    unit: 'pcs',
    brandName: 'NBT',
    sortOrder: 6,
    categoryId: catPowerToolsAC.id,
  });

  await upsertProduct({
    id: 'prod-profile-cut-off-machine-nbt-co-355b',
    name: 'Profile Cut-Off Machine NBT-CO-355B',
    nameCn: '型材切割机NBT-CO-355B',
    slug: 'profile-cut-off-machine-nbt-co-355b',
    description:
      'AC profile/metal cut-off machine model NBT-CO-355B. Power: 3200W. Rated speed: 4100 RPM. Cutting size: 355mm. Cutting angle: 45/90 degrees. Includes wrenches and carbon brushes.',
    descriptionCn:
      '型材切割机NBT-CO-355B，输入功率3200W，额定转速4100转/分钟，切割尺寸355毫米，切割角度45°/90°',
    specifications:
      '功率：3200W, 额定转速：4100 RPM, 切割尺寸：355mm, 切割角度：45°/90°',
    moq: 1,
    unit: 'pcs',
    brandName: 'NBT',
    sortOrder: 7,
    categoryId: catPowerToolsAC.id,
  });

  console.log('Created AC power tool products');

  // ─── Cutting & Grinding Discs (切割片磨光片) ─────────────────────────────────

  await upsertProduct({
    id: 'prod-grinding-disc-red-100x6',
    name: 'LOYE Grinding Disc Red (100x6.0x16)',
    nameCn: 'LOYE砂轮打磨片(红片 100X6.0X16)',
    slug: 'loye-grinding-disc-red-100x6-0x16',
    description:
      'LOYE branded red grinding disc, 100x6.0x16mm. Brown corundum material. 200 pcs per box.',
    descriptionCn:
      'LOYE砂轮打磨片(红片 100X6.0X16)，棕刚玉，100X6.0X16，200片/箱',
    material: 'Brown corundum',
    materialCn: '棕刚玉',
    packaging: '200 pcs/box',
    specifications: '100X6.0X16, 200片/箱',
    moq: 200,
    unit: 'pcs',
    sortOrder: 1,
    categoryId: catCuttingGrindingDiscs.id,
  });

  await upsertProduct({
    id: 'prod-grinding-disc-green-100x3',
    name: 'LOYE Grinding Disc Green (100x3.0x16)',
    nameCn: 'LOYE砂轮打磨片(绿片 100X3.0X16)',
    slug: 'loye-grinding-disc-green-100x3-0x16',
    description:
      'LOYE branded green grinding disc, 100x3.0x16mm. Brown corundum material. 400 pcs per box.',
    descriptionCn:
      'LOYE砂轮打磨片(绿片 100X3.0X16)，棕刚玉，100X3.0X16，400片/箱',
    material: 'Brown corundum',
    materialCn: '棕刚玉',
    packaging: '400 pcs/box',
    specifications: '100X3.0X16, 400片/箱',
    moq: 400,
    unit: 'pcs',
    sortOrder: 2,
    categoryId: catCuttingGrindingDiscs.id,
  });

  await upsertProduct({
    id: 'prod-cutting-disc-black-355x3',
    name: 'LOYE Cutting Disc Black (355x3.0x25.4)',
    nameCn: 'LOYE砂轮切割片(黑片 355X3.0X25.4)',
    slug: 'loye-cutting-disc-black-355x3-0x25-4',
    description:
      'LOYE branded black cutting disc, 355x3.0x25.4mm. Brown corundum material. 25 pcs per box.',
    descriptionCn:
      'LOYE砂轮切割片(黑片 355X3.0X25.4)，棕刚玉，355X3.0X25.4，25片/箱',
    material: 'Brown corundum',
    materialCn: '棕刚玉',
    packaging: '25 pcs/box',
    specifications: '355X3.0X25.4, 25片/箱',
    moq: 25,
    unit: 'pcs',
    sortOrder: 3,
    categoryId: catCuttingGrindingDiscs.id,
  });

  await upsertProduct({
    id: 'prod-cutting-disc-green-355x2-5',
    name: 'LOYE Cutting Disc Green (355x2.5x25.4)',
    nameCn: 'LOYE砂轮切割片(绿片 355X2.5X25.4)',
    slug: 'loye-cutting-disc-green-355x2-5x25-4',
    description:
      'LOYE branded green cutting disc, 355x2.5x25.4mm. Brown corundum material. 25 pcs per box.',
    descriptionCn:
      'LOYE砂轮切割片(绿片 355X2.5X25.4)，棕刚玉，355X2.5X25.4，25片/箱',
    material: 'Brown corundum',
    materialCn: '棕刚玉',
    packaging: '25 pcs/box',
    specifications: '355X2.5X25.4, 25片/箱',
    moq: 25,
    unit: 'pcs',
    sortOrder: 4,
    categoryId: catCuttingGrindingDiscs.id,
  });

  await upsertProduct({
    id: 'prod-cutting-disc-black-107x1-2',
    name: 'LOYE Cutting Disc Black (107x1.2x16)',
    nameCn: 'LOYE砂轮切割片(黑片 107X1.2X16)',
    slug: 'loye-cutting-disc-black-107x1-2x16',
    description:
      'LOYE branded black cutting disc, 107x1.2x16mm. Brown corundum material. 800 pcs per box.',
    descriptionCn:
      'LOYE砂轮切割片(黑片 107X1.2X16)，棕刚玉，107X1.2X16，800片/箱',
    material: 'Brown corundum',
    materialCn: '棕刚玉',
    packaging: '800 pcs/box',
    specifications: '107X1.2X16, 800片/箱',
    moq: 800,
    unit: 'pcs',
    sortOrder: 5,
    categoryId: catCuttingGrindingDiscs.id,
  });

  await upsertProduct({
    id: 'prod-cutting-disc-green-107x1-2',
    name: 'LOYE Cutting Disc Green (107x1.2x16)',
    nameCn: 'LOYE砂轮切割片(绿片 107X1.2X16)',
    slug: 'loye-cutting-disc-green-107x1-2x16',
    description:
      'LOYE branded green cutting disc, 107x1.2x16mm. Brown corundum material. 800 pcs per box.',
    descriptionCn:
      'LOYE砂轮切割片(绿片 107X1.2X16)，棕刚玉，107X1.2X16，800片/箱',
    material: 'Brown corundum',
    materialCn: '棕刚玉',
    packaging: '800 pcs/box',
    specifications: '107X1.2X16, 800片/箱',
    moq: 800,
    unit: 'pcs',
    sortOrder: 6,
    categoryId: catCuttingGrindingDiscs.id,
  });

  console.log('Created cutting & grinding disc products');

  // ─── Tapes, Ties & Packaging (胶带警示带扎带) ────────────────────────────────

  await upsertProduct({
    id: 'prod-polyester-safety-line',
    name: 'Polyester Safety Warning Line',
    nameCn: '警示带',
    slug: 'polyester-safety-warning-line',
    description:
      'Polyester safety warning/caution line tape, 50 meters per roll. 300 rolls per carton.',
    descriptionCn: '警示带SafetyLine，涤纶，50米，300个/件',
    material: 'Polyester',
    materialCn: '涤纶',
    packaging: '300 rolls/carton',
    specifications: '50米, 300个/件',
    moq: 300,
    unit: 'rolls',
    sortOrder: 1,
    categoryId: catTapesTiesPackaging.id,
  });

  await upsertProduct({
    id: 'prod-pvc-safety-line',
    name: 'PVC Safety Warning Line',
    nameCn: 'PVC警示带',
    slug: 'pvc-safety-warning-line',
    description:
      'PVC safety warning/caution line tape, 50 meters per roll.',
    descriptionCn: 'PVC警示带SafetyLinePVC，PVC，50米/卷',
    material: 'PVC',
    materialCn: 'PVC',
    packaging: '50 meters/roll',
    specifications: '50米/卷',
    moq: 1,
    unit: 'rolls',
    sortOrder: 2,
    categoryId: catTapesTiesPackaging.id,
  });

  await upsertProduct({
    id: 'prod-stretch-film',
    name: 'Stretch Wrap Film',
    nameCn: '缠绕膜',
    slug: 'stretch-wrap-film',
    description:
      'Polyethylene stretch wrap film, 50cm wide, 5kg per roll. High adhesion and toughness.',
    descriptionCn: '缠绕膜，聚乙烯，50CM宽，5KG/卷，高自粘高韧性',
    material: 'Polyethylene',
    materialCn: '聚乙烯',
    packaging: '5KG/roll',
    specifications: '50CM宽, 5KG/卷',
    moq: 1,
    unit: 'rolls',
    sortOrder: 3,
    categoryId: catTapesTiesPackaging.id,
  });

  await upsertProduct({
    id: 'prod-electrical-tape',
    name: 'PVC Electrical Insulation Tape',
    nameCn: '电气胶带',
    slug: 'pvc-electrical-insulation-tape',
    description:
      'PVC electrical insulation tape, 1.6cm x 8.1m. Available in red, yellow, green, blue, and black.',
    descriptionCn: '电气胶带，PVC，1.6cm*8.1，红黄绿蓝黑',
    material: 'PVC',
    materialCn: 'PVC',
    specifications: '1.6cm x 8.1m',
    moq: 1,
    unit: 'rolls',
    colors: ['Red', 'Yellow', 'Green', 'Blue', 'Black'],
    sortOrder: 4,
    categoryId: catTapesTiesPackaging.id,
  });

  await upsertProduct({
    id: 'prod-brown-packing-tape',
    name: 'Brown OPP Packing Tape',
    nameCn: '米黄胶带',
    slug: 'brown-opp-packing-tape',
    description:
      'Brown/beige OPP packing tape, 4.8cm x 126m. Extra thick and wide. 42 rolls per box.',
    descriptionCn: '米黄胶带，OPP，4.8cm*126M，42卷/箱，大卷加厚加宽',
    material: 'OPP',
    materialCn: 'OPP',
    packaging: '42 rolls/box',
    specifications: '4.8cm x 126M, 42卷/箱',
    moq: 42,
    unit: 'rolls',
    sortOrder: 5,
    categoryId: catTapesTiesPackaging.id,
  });

  await upsertProduct({
    id: 'prod-clear-packing-tape',
    name: 'Clear OPP Packing Tape',
    nameCn: '透明胶带',
    slug: 'clear-opp-packing-tape',
    description:
      'Clear/transparent OPP packing tape, 4.8cm x 137m. 42 rolls per box.',
    descriptionCn: '透明胶带，OPP，4.8cm*137M，42卷/箱',
    material: 'OPP',
    materialCn: 'OPP',
    packaging: '42 rolls/box',
    specifications: '4.8cm x 137M, 42卷/箱',
    moq: 42,
    unit: 'rolls',
    sortOrder: 6,
    categoryId: catTapesTiesPackaging.id,
  });

  await upsertProduct({
    id: 'prod-white-nylon-cable-ties',
    name: 'White Nylon Cable Ties',
    nameCn: '白色扎带',
    slug: 'white-nylon-cable-ties',
    description:
      'White nylon cable ties available in multiple sizes: 4x250mm (150g), 4x300mm (150g), 5x300mm (200g), 5x350mm (200g), 5x400mm (200g), 8x200mm (250g), 8x250mm (250g).',
    descriptionCn:
      '白色扎带KabelTiesNylon，多种规格：150g 4*250mm, 150g 4*300mm, 200g 5*300mm, 200g 5*350mm, 200g 5*400mm, 250g 8*200mm, 250g 8*250mm',
    material: 'Nylon',
    specifications:
      '4x250mm/150g, 4x300mm/150g, 5x300mm/200g, 5x350mm/200g, 5x400mm/200g, 8x200mm/250g, 8x250mm/250g',
    moq: 1,
    unit: 'packs',
    sizes: [
      '4x250mm',
      '4x300mm',
      '5x300mm',
      '5x350mm',
      '5x400mm',
      '8x200mm',
      '8x250mm',
    ],
    sortOrder: 7,
    categoryId: catTapesTiesPackaging.id,
  });

  console.log('Created tapes, ties & packaging products');

  // ─── Woven Products (编织品) ─────────────────────────────────────────────────

  await upsertProduct({
    id: 'prod-white-woven-bag',
    name: 'White Woven Polypropylene Bag',
    nameCn: '编织袋',
    slug: 'white-woven-polypropylene-bag',
    description:
      'White woven polypropylene bags available in multiple sizes. Minimum order 500 pcs. Sizes: 35x53, 40x70, 45x75, 50x80, 56x90, 60x90, 60x100, 65x105cm.',
    descriptionCn:
      '编织袋，白色编织袋，500起批，35*53, 40*70, 45*75, 50*80, 56*90, 60*90, 60*100, 65*105',
    material: 'Woven polypropylene',
    packaging: 'Minimum 500 pcs',
    specifications: '500起批',
    moq: 500,
    unit: 'pcs',
    sizes: [
      '35x53cm',
      '40x70cm',
      '45x75cm',
      '50x80cm',
      '56x90cm',
      '60x90cm',
      '60x100cm',
      '65x105cm',
    ],
    sortOrder: 1,
    categoryId: catWovenProducts.id,
  });

  await upsertProduct({
    id: 'prod-woven-mesh-bag',
    name: 'Woven Mesh Bag',
    nameCn: '编织袋(网袋)',
    slug: 'woven-mesh-bag',
    description:
      'Woven mesh bags available in multiple sizes. Minimum order 500 pcs. Sizes: 75x115, 80x125, 90x130, 95x130, 110x130, 110x150, 120x150, 110x180, 120x180, 125x180cm.',
    descriptionCn:
      '编织袋KantungRajut，500起批，75*115, 80*125, 90*130, 95*130, 110*130, 110*150, 120*150, 110*180, 120*180, 125*180',
    material: 'Woven mesh',
    packaging: 'Minimum 500 pcs',
    specifications: '500起批',
    moq: 500,
    unit: 'pcs',
    sizes: [
      '75x115cm',
      '80x125cm',
      '90x130cm',
      '95x130cm',
      '110x130cm',
      '110x150cm',
      '120x150cm',
      '110x180cm',
      '120x180cm',
      '125x180cm',
    ],
    sortOrder: 2,
    categoryId: catWovenProducts.id,
  });

  console.log('Created woven products');

  // ─── Traffic Safety (交通设施) ───────────────────────────────────────────────

  await upsertProduct({
    id: 'prod-traffic-cone-red',
    name: 'Red-Base PVC Traffic Cone',
    nameCn: '红底PVC路锥',
    slug: 'red-base-pvc-traffic-cone',
    description:
      'Red-base PVC traffic cone with Scotchlite reflective collar (replaceable). Weight: 1.75kg. Size: 70x35x35cm. 10 pcs per carton.',
    descriptionCn:
      '红底PVC路锥（锥套可换黄），PVC，重量1.75KG，尺寸70*35*35，包装10个/件',
    material: 'PVC',
    materialCn: 'PVC',
    packaging: '10 pcs/carton',
    specifications: '重量：1.75KG, 尺寸：70x35x35cm, 10个/件',
    moq: 10,
    unit: 'pcs',
    sortOrder: 1,
    categoryId: catTrafficSafety.id,
  });

  await upsertProduct({
    id: 'prod-traffic-cone-black',
    name: 'Black-Base PVC Traffic Cone',
    nameCn: '黑底PVC路锥',
    slug: 'black-base-pvc-traffic-cone',
    description:
      'Black-base PVC traffic cone. Weight: 2.5kg. Size: 75x37x37cm. 10 pcs per carton.',
    descriptionCn:
      '黑底PVC路锥，PVC，重量2.5KG，尺寸75*37*37，包装10个/件',
    material: 'PVC',
    materialCn: 'PVC',
    packaging: '10 pcs/carton',
    specifications: '重量：2.5KG, 尺寸：75x37x37cm, 10个/件',
    moq: 10,
    unit: 'pcs',
    sortOrder: 2,
    categoryId: catTrafficSafety.id,
  });

  await upsertProduct({
    id: 'prod-convex-mirror',
    name: 'Convex Safety Mirror',
    nameCn: '广角镜',
    slug: 'convex-safety-mirror',
    description:
      'Convex traffic safety mirror available in diameters: 60cm, 75cm, 80cm, 100cm.',
    descriptionCn: '广角镜ConvexMirror/KacaCermingCembung，60, 75, 80, 100cm',
    specifications: 'Diameters: 60cm, 75cm, 80cm, 100cm',
    moq: 1,
    unit: 'pcs',
    sizes: ['60cm', '75cm', '80cm', '100cm'],
    sortOrder: 3,
    categoryId: catTrafficSafety.id,
  });

  console.log('Created traffic safety products');

  // ─── Site Equipment (铁架床) ─────────────────────────────────────────────────

  await upsertProduct({
    id: 'prod-iron-bunk-bed',
    name: 'Iron Frame Bunk Bed',
    nameCn: '铁架床、高低床',
    slug: 'iron-frame-bunk-bed',
    description:
      'Iron square tube bunk bed. External dimensions: 2020x920x1700mm. Bed body weighs 47 jin (23.5kg). Includes two wooden bed boards. Single tier static load capacity: 220 jin (110kg).',
    descriptionCn:
      '铁架床、高低床，铁方管，外尺寸2020*920*1700，47斤床体带两张床板木板，单层静态承重220斤',
    material: 'Iron square tube',
    materialCn: '铁方管',
    specifications:
      '外尺寸：2020x920x1700mm, 47斤床体带两张床板木板, 单层静态承重220斤',
    moq: 1,
    unit: 'pcs',
    sortOrder: 1,
    categoryId: catSiteEquipment.id,
  });

  console.log('Created site equipment products');

  // ─── Final count ─────────────────────────────────────────────────────────────

  const productCount = await prisma.product.count();
  const categoryCount = await prisma.category.count();

  console.log('');
  console.log('========================================');
  console.log('  Seeding complete!');
  console.log(`  Companies:  1 (LOYE AMAN)`);
  console.log(`  Categories: ${categoryCount}`);
  console.log(`  Products:   ${productCount}`);
  console.log('========================================');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
