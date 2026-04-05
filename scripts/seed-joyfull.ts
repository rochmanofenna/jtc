import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('Seeding Joyfull Technology Indonesia products...');

  // ─── 1. Create Supplier ──────────────────────────────────────────────────────

  const joyfull = await prisma.company.upsert({
    where: { id: 'joyfull-tech' },
    update: {},
    create: {
      id: 'joyfull-tech',
      name: 'Joyfull Technology Indonesia',
      type: 'supplier',
      country: 'CN',
      city: 'Tangerang',
      description:
        'Energy storage and solar power solutions manufacturer and distributor. Product lines include LiFePO4 batteries, inverters, energy storage systems, all-in-one battery inverters, and solar panels. Warehouse in PIK2, Tangerang.',
      industry: 'Energy Storage & Solar Power',
      verificationStatus: 'VERIFIED',
    },
  });

  console.log(`Created supplier: ${joyfull.name} (${joyfull.id})`);

  // ─── 2. Create Categories ────────────────────────────────────────────────────

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

  // Parent categories
  const catEnergyStorage = await upsertCategory({
    id: 'cat-energy-storage',
    name: 'Energy Storage',
    nameCn: '储能系统 / Penyimpanan Energi',
    slug: 'energy-storage',
    icon: 'Battery',
    sortOrder: 19,
  });

  const catInverters = await upsertCategory({
    id: 'cat-inverters',
    name: 'Inverters',
    nameCn: '逆变器 / Inverter',
    slug: 'inverters',
    icon: 'Zap',
    sortOrder: 20,
  });

  const catEnergyStorageSystems = await upsertCategory({
    id: 'cat-energy-storage-systems',
    name: 'Energy Storage Systems',
    nameCn: '储能柜 / Sistem Penyimpanan Energi',
    slug: 'energy-storage-systems',
    icon: 'Server',
    sortOrder: 21,
  });

  const catAllInOneSystems = await upsertCategory({
    id: 'cat-all-in-one-systems',
    name: 'All-in-One Systems',
    nameCn: '一体机 / Sistem All-in-One',
    slug: 'all-in-one-systems',
    icon: 'Box',
    sortOrder: 22,
  });

  const catSolarPower = await upsertCategory({
    id: 'cat-solar-power',
    name: 'Solar Power',
    nameCn: '太阳能 / Tenaga Surya',
    slug: 'solar-power',
    icon: 'Sun',
    sortOrder: 23,
  });

  console.log('Created 5 parent categories');

  // Subcategories — Energy Storage
  const subLifepo4Batteries = await upsertCategory({
    id: 'sub-lifepo4-batteries',
    name: 'LiFePO4 Batteries',
    nameCn: '磷酸铁锂电池',
    slug: 'lifepo4-batteries',
    icon: 'Battery',
    sortOrder: 1,
    parentId: catEnergyStorage.id,
  });

  const subRackMountBatteries = await upsertCategory({
    id: 'sub-rack-mount-batteries',
    name: 'Rack-mount Batteries',
    nameCn: '机架式电池',
    slug: 'rack-mount-batteries',
    icon: 'Battery',
    sortOrder: 2,
    parentId: catEnergyStorage.id,
  });

  const subWallMountBatteries = await upsertCategory({
    id: 'sub-wall-mount-batteries',
    name: 'Wall-mount Batteries',
    nameCn: '壁挂式电池',
    slug: 'wall-mount-batteries',
    icon: 'Battery',
    sortOrder: 3,
    parentId: catEnergyStorage.id,
  });

  const subStandingBatteries = await upsertCategory({
    id: 'sub-standing-batteries',
    name: 'Standing Batteries',
    nameCn: '站立式电池',
    slug: 'standing-batteries',
    icon: 'Battery',
    sortOrder: 4,
    parentId: catEnergyStorage.id,
  });

  const subStackableBatteries = await upsertCategory({
    id: 'sub-stackable-batteries',
    name: 'Stackable Batteries',
    nameCn: '堆叠式电池',
    slug: 'stackable-batteries',
    icon: 'Battery',
    sortOrder: 5,
    parentId: catEnergyStorage.id,
  });

  const subHighVoltageBatteries = await upsertCategory({
    id: 'sub-high-voltage-batteries',
    name: 'High Voltage Batteries',
    nameCn: '高压电池组',
    slug: 'high-voltage-batteries',
    icon: 'Battery',
    sortOrder: 6,
    parentId: catEnergyStorage.id,
  });

  // Subcategories — Inverters
  const subOffGridInverters = await upsertCategory({
    id: 'sub-off-grid-inverters',
    name: 'Off-Grid Inverters',
    nameCn: '离网逆变器',
    slug: 'off-grid-inverters',
    icon: 'Zap',
    sortOrder: 1,
    parentId: catInverters.id,
  });

  const subHybridInverters = await upsertCategory({
    id: 'sub-hybrid-inverters',
    name: 'Hybrid Inverters',
    nameCn: '混合逆变器',
    slug: 'hybrid-inverters',
    icon: 'Zap',
    sortOrder: 2,
    parentId: catInverters.id,
  });

  const subThreePhaseInverters = await upsertCategory({
    id: 'sub-three-phase-inverters',
    name: 'Three-Phase Inverters',
    nameCn: '三相逆变器',
    slug: 'three-phase-inverters',
    icon: 'Zap',
    sortOrder: 3,
    parentId: catInverters.id,
  });

  // Subcategories — Energy Storage Systems
  const subRackMountEss = await upsertCategory({
    id: 'sub-rack-mount-ess',
    name: 'Rack-mount ESS',
    nameCn: '机架式储能柜',
    slug: 'rack-mount-ess',
    icon: 'Server',
    sortOrder: 1,
    parentId: catEnergyStorageSystems.id,
  });

  const subIp54SealedEss = await upsertCategory({
    id: 'sub-ip54-sealed-ess',
    name: 'IP54 Sealed ESS',
    nameCn: '密封储能柜',
    slug: 'ip54-sealed-ess',
    icon: 'Server',
    sortOrder: 2,
    parentId: catEnergyStorageSystems.id,
  });

  const subEvChargingStorage = await upsertCategory({
    id: 'sub-ev-charging-storage',
    name: 'EV Charging + Storage',
    nameCn: '车储充一体',
    slug: 'ev-charging-storage',
    icon: 'Server',
    sortOrder: 3,
    parentId: catEnergyStorageSystems.id,
  });

  // Subcategories — All-in-One Systems
  const subWallMountAio = await upsertCategory({
    id: 'sub-wall-mount-aio',
    name: 'Wall-mount All-in-One',
    nameCn: '壁挂式一体机',
    slug: 'wall-mount-aio',
    icon: 'Box',
    sortOrder: 1,
    parentId: catAllInOneSystems.id,
  });

  const subStandingAio = await upsertCategory({
    id: 'sub-standing-aio',
    name: 'Standing All-in-One',
    nameCn: '站立式一体机',
    slug: 'standing-aio',
    icon: 'Box',
    sortOrder: 2,
    parentId: catAllInOneSystems.id,
  });

  const subStackableAio = await upsertCategory({
    id: 'sub-stackable-aio',
    name: 'Stackable All-in-One',
    nameCn: '堆叠一体机',
    slug: 'stackable-aio',
    icon: 'Box',
    sortOrder: 3,
    parentId: catAllInOneSystems.id,
  });

  console.log('Created 20 subcategories');

  // ─── 3. Create Products ──────────────────────────────────────────────────────

  async function upsertProduct(data: {
    id: string;
    name: string;
    nameCn?: string;
    slug: string;
    description?: string;
    material?: string;
    specifications?: string;
    packaging?: string;
    warranty?: string;
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
        material: data.material,
        specifications: data.specifications,
        packaging: data.packaging,
        warranty: data.warranty,
        brandName: data.brandName ?? 'Joyfull',
        isActive: true,
        sortOrder: data.sortOrder,
        supplierId: joyfull.id,
        categoryId: data.categoryId,
      },
    });
  }

  // ═══ LiFePO4 Batteries (6 products) ═══════════════════════════════════════

  await upsertProduct({
    id: 'prod-lifepo4-12v-50ah',
    name: 'LiFePO4 Battery 12.8V 50Ah',
    nameCn: '磷酸铁锂电池 12.8V50AH',
    slug: 'ba-llb-s0401-1-lifepo4-12v-50ah',
    description: 'LiFePO4 battery 12.8V 50Ah with plastic housing. High cost performance, wide application scenarios: electric vehicles, fishing boats, power storage.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 12.8V | Rated capacity: 50Ah | Charge cut-off voltage: 14.6V | Discharge cut-off voltage: 10.0V | Max charge current: 25A | Max discharge current: 50A | Communication: Bluetooth/RS485 | Dimensions: 230x140x210mm | Weight: 6kg',
    packaging: '239x154x252mm (0.0093 m3)',
    warranty: '5 Year',
    sortOrder: 1,
    categoryId: subLifepo4Batteries.id,
  });

  await upsertProduct({
    id: 'prod-lifepo4-12v-100ah',
    name: 'LiFePO4 Battery 12.8V 100Ah',
    nameCn: '磷酸铁锂电池 12.8V100AH',
    slug: 'ba-llb-s0401-2-lifepo4-12v-100ah',
    description: 'LiFePO4 battery 12.8V 100Ah with plastic housing. High cost performance, wide application scenarios: electric vehicles, fishing boats, power storage.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 12.8V | Rated capacity: 100Ah | Charge cut-off voltage: 14.6V | Discharge cut-off voltage: 10.0V | Max charge current: 50/100A | Max discharge current: 100A | Communication: Bluetooth/RS485 | Dimensions: 330x175x215mm | Weight: 11.5kg',
    packaging: '342x181x265mm (0.0164 m3)',
    warranty: '5 Year',
    sortOrder: 2,
    categoryId: subLifepo4Batteries.id,
  });

  await upsertProduct({
    id: 'prod-lifepo4-12v-150ah',
    name: 'LiFePO4 Battery 12.8V 150Ah',
    nameCn: '磷酸铁锂电池 12.8V150AH',
    slug: 'ba-llb-s0401-3-lifepo4-12v-150ah',
    description: 'LiFePO4 battery 12.8V 150Ah with plastic housing. High cost performance, wide application scenarios: electric vehicles, fishing boats, power storage.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 12.8V | Rated capacity: 150Ah | Charge cut-off voltage: 14.6V | Discharge cut-off voltage: 10.0V | Max charge current: 50/150A | Max discharge current: 100A | Communication: Bluetooth/RS485 | Dimensions: 485x170x240mm | Weight: 17kg',
    packaging: '497x180x292mm (0.0261 m3)',
    warranty: '5 Year',
    sortOrder: 3,
    categoryId: subLifepo4Batteries.id,
  });

  await upsertProduct({
    id: 'prod-lifepo4-12v-200ah',
    name: 'LiFePO4 Battery 12.8V 200Ah',
    nameCn: '磷酸铁锂电池 12.8V200AH',
    slug: 'ba-llb-s0401-4-lifepo4-12v-200ah',
    description: 'LiFePO4 battery 12.8V 200Ah with plastic housing. High cost performance, wide application scenarios: electric vehicles, fishing boats, power storage.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 12.8V | Rated capacity: 200Ah | Charge cut-off voltage: 14.6V | Discharge cut-off voltage: 10.0V | Max charge current: 100A | Max discharge current: 100/200A | Communication: Bluetooth/RS485 | Dimensions: 520x240x220mm | Weight: 21kg',
    packaging: '532x252x268mm (0.0359 m3)',
    warranty: '5 Year',
    sortOrder: 4,
    categoryId: subLifepo4Batteries.id,
  });

  await upsertProduct({
    id: 'prod-lifepo4-25v-100ah',
    name: 'LiFePO4 Battery 25.6V 100Ah',
    nameCn: '磷酸铁锂电池 25.6V100AH',
    slug: 'ba-llb-s0401-5-lifepo4-25v-100ah',
    description: 'LiFePO4 battery 25.6V 100Ah with plastic housing. High cost performance, wide application scenarios: electric vehicles, fishing boats, power storage.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 25.6V | Rated capacity: 100Ah | Charge cut-off voltage: 29.2V | Discharge cut-off voltage: 28V | Max charge current: 50A | Max discharge current: 100A | Communication: Bluetooth/RS485 | Dimensions: 522x18x238mm | Weight: 28kg',
    packaging: '532x252x268mm (0.0359 m3)',
    warranty: '5 Year',
    sortOrder: 5,
    categoryId: subLifepo4Batteries.id,
  });

  await upsertProduct({
    id: 'prod-lifepo4-25v-150ah',
    name: 'LiFePO4 Battery 25.6V 150Ah',
    nameCn: '磷酸铁锂电池 25.6V150AH',
    slug: 'ba-llb-s0401-6-lifepo4-25v-150ah',
    description: 'LiFePO4 battery 25.6V 150Ah with plastic housing. High cost performance, wide application scenarios: electric vehicles, fishing boats, power storage.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 25.6V | Rated capacity: 150Ah | Charge cut-off voltage: 29.2V | Discharge cut-off voltage: 28V | Max charge current: 75A | Max discharge current: 150A | Communication: Bluetooth/RS485 | Dimensions: 522x18x238mm | Weight: 32kg',
    packaging: '532x252x268mm (0.0359 m3)',
    warranty: '5 Year',
    sortOrder: 6,
    categoryId: subLifepo4Batteries.id,
  });

  console.log('Created 6 LiFePO4 Battery products');

  // ═══ Rack-mount Batteries (4 products) ════════════════════════════════════

  await upsertProduct({
    id: 'prod-rack-battery-5kwh',
    name: 'Rack-mount Battery 51.2V 5KWh',
    nameCn: '机架式电池 51.2V5KWH',
    slug: 'ba-lb-a0301-1-rack-battery-5kwh',
    description: 'Rack-mount battery 51.2V 5KWh with 3U/4U/5U rack-mount design.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 51.2V | Rated capacity: 100Ah | Charge cut-off voltage: 58.0V | Discharge cut-off voltage: 42.0V | Max charge current: 100A | Max discharge current: 100A | Communication: RS485/CAN | Dimensions: 442x420x133mm | Weight: 40/43kg',
    packaging: '442x420x133mm (0.0247 m3)',
    warranty: '5 Year',
    sortOrder: 1,
    categoryId: subRackMountBatteries.id,
  });

  await upsertProduct({
    id: 'prod-rack-battery-7kwh',
    name: 'Rack-mount Battery 51.2V 7.5KWh',
    nameCn: '机架式电池 51.2V7.5KWH',
    slug: 'ba-lb-a0301-2-rack-battery-7kwh',
    description: 'Rack-mount battery 51.2V 7.5KWh with 3U/4U/5U rack-mount design.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 51.2V | Rated capacity: 150Ah | Charge cut-off voltage: 58.0V | Discharge cut-off voltage: 42.0V | Max charge current: 100A | Max discharge current: 100A | Communication: RS485/CAN | Dimensions: 442x450x190mm | Weight: 63/66kg',
    packaging: '442x420x133mm (0.0247 m3)',
    warranty: '5 Year',
    sortOrder: 2,
    categoryId: subRackMountBatteries.id,
  });

  await upsertProduct({
    id: 'prod-rack-battery-10kwh',
    name: 'Rack-mount Battery 51.2V 10KWh',
    nameCn: '机架式电池 51.2V10KWH',
    slug: 'ba-lb-a0301-3-rack-battery-10kwh',
    description: 'Rack-mount battery 51.2V 10KWh with 3U/4U/5U rack-mount design.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 51.2V | Rated capacity: 200Ah | Charge cut-off voltage: 58.0V | Discharge cut-off voltage: 42.0V | Max charge current: 100A | Max discharge current: 150/200A | Communication: RS485/CAN | Dimensions: 442x420x265mm | Weight: 85/88kg',
    packaging: '442x420x133mm (0.0247 m3)',
    warranty: '5 Year',
    sortOrder: 3,
    categoryId: subRackMountBatteries.id,
  });

  await upsertProduct({
    id: 'prod-rack-battery-15kwh',
    name: 'Rack-mount Battery 51.2V 15KWh',
    nameCn: '机架式电池 51.2V15KWH',
    slug: 'ba-lb-a0301-4-rack-battery-15kwh',
    description: 'Rack-mount battery 51.2V 15KWh with 3U/4U/5U rack-mount design.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 51.2V | Rated capacity: 280Ah | Charge cut-off voltage: 58.0V | Discharge cut-off voltage: 42.0V | Max charge current: 150A | Max discharge current: 200A | Communication: RS485/CAN | Dimensions: 400x715x230mm | Weight: 100/107kg',
    packaging: '400x715x230mm (0.0658 m3)',
    warranty: '5 Year',
    sortOrder: 4,
    categoryId: subRackMountBatteries.id,
  });

  console.log('Created 4 Rack-mount Battery products');

  // ═══ Wall-mount Batteries (6 products) ════════════════════════════════════

  await upsertProduct({
    id: 'prod-wall-battery-2kwh',
    name: 'Wall-mount Battery 51.2V 2.56KWh',
    nameCn: '壁挂式电池 51.2V2.56KWH',
    slug: 'ba-lb-a0302-1-wall-battery-2kwh',
    description: 'Wall-mount battery 51.2V 2.56KWh (100Ah) with wall-mount design.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 48V | Rated capacity: 100Ah | End-of-charge voltage: 54.0V | End-of-discharge voltage: 39.0V | Communication: RS485/CAN | Dimensions: 590x410x145mm | Weight: 43kg | Protection: IP65',
    packaging: '442x420x133mm (0.0247 m3)',
    warranty: '5 Year',
    sortOrder: 1,
    categoryId: subWallMountBatteries.id,
  });

  await upsertProduct({
    id: 'prod-wall-battery-5kwh',
    name: 'Wall-mount Battery 51.2V 5KWh',
    nameCn: '壁挂式电池 51.2V5KWH',
    slug: 'ba-lb-a0302-2-wall-battery-5kwh',
    description: 'Wall-mount battery 51.2V 5KWh (100Ah) with key display, wall-mount design.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 51.2V | Rated capacity: 100Ah | Charge cut-off voltage: 58.0V | Discharge cut-off voltage: 42.0V | Max charge current: 100A | Max discharge current: 100A | Communication: RS485/CAN | Dimensions: 770x520x90mm | Weight: 42/44kg',
    packaging: '485x145x850mm (0.0598 m3)',
    warranty: '5 Year',
    sortOrder: 2,
    categoryId: subWallMountBatteries.id,
  });

  await upsertProduct({
    id: 'prod-wall-battery-10kwh',
    name: 'Wall-mount Battery 51.2V 10KWh',
    nameCn: '壁挂式电池 51.2V10KWH',
    slug: 'ba-lb-a0302-3-wall-battery-10kwh',
    description: 'Wall-mount battery 51.2V 10KWh (200Ah) with key display, wall-mount design.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 51.2V | Rated capacity: 200Ah | Charge cut-off voltage: 58.0V | Discharge cut-off voltage: 42.0V | Max charge current: 100A | Max discharge current: 100/200A | Communication: RS485/CAN | Dimensions: 850x485x145mm | Weight: 84/89kg',
    packaging: '485x400x837mm (0.1624 m3)',
    warranty: '5 Year',
    sortOrder: 3,
    categoryId: subWallMountBatteries.id,
  });

  await upsertProduct({
    id: 'prod-wall-stackable-battery-5kwh',
    name: 'Wall-mount Stackable Battery 51.2V 5KWh',
    nameCn: '壁挂堆叠式电池 51.2V5KWH',
    slug: 'ba-lb-a0305-1-wall-stackable-5kwh',
    description: 'Ultra-thin wall-mounted stackable battery, single unit supports up to 15KWh, supports parallel expansion.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 51.2V | Rated capacity: 100Ah | Charge cut-off voltage: 58.0V | Discharge cut-off voltage: 42.0V | Max charge current: 100A | Max discharge current: 100A | Communication: RS485/CAN | Dimensions: 430x230x570mm | Weight: 52kg',
    packaging: '430x230x570mm (0.0564 m3)',
    warranty: '5 Year',
    sortOrder: 4,
    categoryId: subWallMountBatteries.id,
  });

  await upsertProduct({
    id: 'prod-wall-stackable-battery-10kwh',
    name: 'Wall-mount Stackable Battery 51.2V 10KWh',
    nameCn: '壁挂堆叠式电池 51.2V10KWH',
    slug: 'ba-lb-a0305-2-wall-stackable-10kwh',
    description: 'Ultra-thin wall-mounted stackable battery, single unit supports up to 15KWh, supports parallel expansion.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 51.2V | Rated capacity: 200Ah | Charge cut-off voltage: 58.0V | Discharge cut-off voltage: 42.0V | Max charge current: 100A | Max discharge current: 100A | Communication: RS485/CAN | Dimensions: 430x230x980mm | Weight: 98kg',
    packaging: '430x230x980mm (0.0969 m3)',
    warranty: '5 Year',
    sortOrder: 5,
    categoryId: subWallMountBatteries.id,
  });

  await upsertProduct({
    id: 'prod-wall-stackable-battery-15kwh',
    name: 'Wall-mount Stackable Battery 51.2V 15KWh',
    nameCn: '壁挂堆叠式电池 51.2V15KWH',
    slug: 'ba-lb-a0305-3-wall-stackable-15kwh',
    description: 'Ultra-thin wall-mounted stackable battery, single unit supports up to 15KWh, supports parallel expansion.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 51.2V | Rated capacity: 300Ah | Charge cut-off voltage: 58.0V | Discharge cut-off voltage: 42.0V | Max charge current: 100A | Max discharge current: 100A | Communication: RS485/CAN | Dimensions: 430x230x1390mm | Weight: 145kg',
    packaging: '430x230x1390mm (0.1375 m3)',
    warranty: '5 Year',
    sortOrder: 6,
    categoryId: subWallMountBatteries.id,
  });

  console.log('Created 6 Wall-mount Battery products');

  // ═══ Standing Batteries (4 products) ══════════════════════════════════════

  await upsertProduct({
    id: 'prod-standing-battery-6kwh',
    name: 'Standing Battery 51.2V 130Ah (6.6KWh)',
    nameCn: '站立式电池 51.2V130AH',
    slug: 'ba-hselb-s0301-standing-battery-6kwh',
    description: 'Standing battery 51.2V 130Ah with LED RGB light display.',
    material: 'LiFePO4',
    specifications: 'Battery type: LiFePO4 | Total energy: 6656Wh | Voltage window: 44.8~58.4V | Fast charge voltage: 57.6V | Float charge voltage: 56.0V | Low DC cut-off voltage: 46.8V | Max continuous discharge current: 100A | Max continuous charge current: 65A | Product size: 1090x685x120mm | Package size: 1150x720x205mm | Net weight: 78.6kg | Gross weight: 97.2kg',
    packaging: '485x400x1025mm (0.1989 m3)',
    warranty: '5 Year',
    sortOrder: 1,
    categoryId: subStandingBatteries.id,
  });

  await upsertProduct({
    id: 'prod-standing-battery-10kwh',
    name: 'Standing Battery 51.2V 10KWh',
    nameCn: '站立式电池 51.2V10KWH',
    slug: 'ba-lb-a0303-1-standing-battery-10kwh',
    description: 'Standing battery 51.2V 10KWh with touch screen display.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 51.2V | Rated capacity: 200Ah | End-of-charge voltage: 54.0V/58.0V | End-of-discharge voltage: 42.0V | Communication: RS485/CAN | Dimensions: 485x145x850mm | Weight: 96kg',
    packaging: '485x145x850mm (0.0598 m3)',
    warranty: '5 Year',
    sortOrder: 2,
    categoryId: subStandingBatteries.id,
  });

  await upsertProduct({
    id: 'prod-standing-battery-15kwh',
    name: 'Standing Battery 51.2V 15KWh',
    nameCn: '站立式电池 51.2V15KWH',
    slug: 'ba-lb-a0303-2-standing-battery-15kwh',
    description: 'Standing battery 51.2V 15KWh with touch screen display.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 51.2V | Rated capacity: 300Ah | Charge cut-off voltage: 58.0V | Discharge cut-off voltage: 42.0V | Max charge current: 200A | Max discharge current: 200A | Communication: RS485/CAN | Dimensions: 470x237x690mm | Weight: 118kg',
    packaging: '485x400x837mm (0.1624 m3)',
    warranty: '5 Year',
    sortOrder: 3,
    categoryId: subStandingBatteries.id,
  });

  await upsertProduct({
    id: 'prod-standing-battery-20kwh',
    name: 'Standing Battery 51.2V 20KWh',
    nameCn: '站立式电池 51.2V20KWH',
    slug: 'ba-lb-a0303-3-standing-battery-20kwh',
    description: 'Standing battery 51.2V 20KWh with touch screen display.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 51.2V | Rated capacity: 400Ah | Charge cut-off voltage: 58.0V | Discharge cut-off voltage: 42.0V | Max charge current: 200A | Max discharge current: 200A | Communication: RS485/CAN | Dimensions: 510x293x970mm | Weight: 162kg',
    packaging: '485x400x1025mm (0.1989 m3)',
    warranty: '5 Year',
    sortOrder: 4,
    categoryId: subStandingBatteries.id,
  });

  console.log('Created 4 Standing Battery products');

  // ═══ Stackable Batteries (3 products) ═════════════════════════════════════

  await upsertProduct({
    id: 'prod-stackable-battery-15kwh',
    name: 'Stackable Battery 51.2V 15KWh',
    nameCn: '堆叠式电池 51.2V15KWH',
    slug: 'ba-lb-a0304-1-stackable-battery-15kwh',
    description: 'Stackable mobile battery, single stack supports up to 30KWh, supports parallel expansion. Configuration: 5KWh x 3.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 51.2V | Rated capacity: 100Ah x 3 | Charge cut-off voltage: 58.0V | Discharge cut-off voltage: 42.0V | Max charge current: 100A | Max discharge current: 100A | Communication: RS485/CAN | Module dimensions: 580x360x150mm | Weight: 42kg per module',
    packaging: '585x360x800mm (0.1685 m3)',
    warranty: '5 Year',
    sortOrder: 1,
    categoryId: subStackableBatteries.id,
  });

  await upsertProduct({
    id: 'prod-stackable-battery-20kwh',
    name: 'Stackable Battery 51.2V 20KWh',
    nameCn: '堆叠式电池 51.2V20KWH',
    slug: 'ba-lb-a0304-2-stackable-battery-20kwh',
    description: 'Stackable mobile battery, single stack supports up to 30KWh, supports parallel expansion. Configuration: 10KWh x 2.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 51.2V | Rated capacity: 200Ah x 2 | Charge cut-off voltage: 58.0V | Discharge cut-off voltage: 42.0V | Max charge current: 100A | Max discharge current: 100A | Communication: RS485/CAN | Module dimensions: 590x500x245mm | Weight: 75kg per module',
    packaging: '585x360x975mm (0.2053 m3)',
    warranty: '5 Year',
    sortOrder: 2,
    categoryId: subStackableBatteries.id,
  });

  await upsertProduct({
    id: 'prod-stackable-battery-25kwh',
    name: 'Stackable Battery 51.2V 25KWh',
    nameCn: '堆叠式电池 51.2V25KWH',
    slug: 'ba-lb-a0304-3-stackable-battery-25kwh',
    description: 'Stackable mobile battery, single stack supports up to 30KWh, supports parallel expansion. Configuration: 5KWh x 5.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 51.2V | Rated capacity: 100Ah x 5 | Charge cut-off voltage: 58.0V | Discharge cut-off voltage: 42.0V | Max charge current: 100A | Max discharge current: 100A | Communication: RS485/CAN | Module dimensions: 580x360x150mm | Weight: 42kg per module',
    packaging: '585x360x1150mm (0.2422 m3)',
    warranty: '5 Year',
    sortOrder: 3,
    categoryId: subStackableBatteries.id,
  });

  console.log('Created 3 Stackable Battery products');

  // ═══ High Voltage Batteries (3 products) ══════════════════════════════════

  await upsertProduct({
    id: 'prod-hv-rack-battery-51v-100ah',
    name: 'High Voltage Rack-mount Battery 51.2V 100Ah (5.12KWh)',
    nameCn: '高压机架式电池 51.2V100Ah',
    slug: 'ba-lb-a0306-1-hv-rack-51v-100ah',
    description: 'High voltage battery pack, without display, communication method supports CAN.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 51.2V | Rated capacity: 100Ah | Charge cut-off voltage: 57.6V | Discharge cut-off voltage: 43.0V | Max charge current: 100A | Max discharge current: 100A | Communication: CAN | Dimensions: 442x420x133mm (3U) | Weight: 42kg',
    packaging: '442x420x133mm (0.0247 m3)',
    warranty: '5 Year',
    sortOrder: 1,
    categoryId: subHighVoltageBatteries.id,
  });

  await upsertProduct({
    id: 'prod-hv-rack-battery-102v-100ah',
    name: 'High Voltage Rack-mount Battery 102V 100Ah',
    nameCn: '高压机架式电池 102V100Ah',
    slug: 'ba-lb-a0306-2-hv-rack-102v-100ah',
    description: 'High voltage battery pack, without display, communication method supports CAN.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 102.4V | Rated capacity: 100Ah | Charge cut-off voltage: 115V | Discharge cut-off voltage: 87V | Max charge current: 100A | Max discharge current: 100A | Communication: CAN | Dimensions: 442x750x133mm (3U) | Weight: 80kg',
    packaging: '442x750x133mm (0.0441 m3)',
    warranty: '5 Year',
    sortOrder: 2,
    categoryId: subHighVoltageBatteries.id,
  });

  await upsertProduct({
    id: 'prod-hv-rack-battery-51v-280ah',
    name: 'High Voltage Rack-mount Battery 51.2V 280Ah',
    nameCn: '高压机架式电池 51.2V280Ah',
    slug: 'ba-lb-a0306-3-hv-rack-51v-280ah',
    description: 'High voltage battery pack, without display, communication method supports CAN.',
    material: 'LiFePO4',
    specifications: 'Nominal voltage: 51.2V | Rated capacity: 280Ah | Charge cut-off voltage: 57.6V | Discharge cut-off voltage: 43.0V | Max charge current: 200A | Max discharge current: 200A | Communication: CAN | Dimensions: 400x700x225mm (5U) | Weight: 105kg',
    packaging: '400x700x225mm (0.063 m3)',
    warranty: '5 Year',
    sortOrder: 3,
    categoryId: subHighVoltageBatteries.id,
  });

  console.log('Created 3 High Voltage Battery products');

  // ═══ Off-Grid Inverters (8 products) ══════════════════════════════════════

  await upsertProduct({
    id: 'prod-offgrid-inverter-1kw',
    name: 'Off-Grid Inverter 1KW',
    nameCn: '离网逆变器 1KW',
    slug: 'ba-inv-a0101-1-offgrid-inverter-1kw',
    description: 'Off-grid inverter 1KW, single-phase, not support parallel.',
    specifications: 'Battery voltage: 24Vdc | Rated power: 1KW | AC voltage: 230Vac | MPPT PV power: 600W | MPPT max voltage: 150Vdc | MPPT PV voltage: 20~150Vdc | Protection: IP21 | Dimensions: 175x65x260mm | Weight: 2.8kg',
    packaging: '175x65x260mm (0.003 m3)',
    warranty: '2 Year',
    sortOrder: 1,
    categoryId: subOffGridInverters.id,
  });

  await upsertProduct({
    id: 'prod-offgrid-inverter-3kw',
    name: 'Off-Grid Inverter 3KW',
    nameCn: '离网逆变器 3KW',
    slug: 'ba-inv-a0101-2-offgrid-inverter-3kw',
    description: 'Off-grid inverter 3KW, single-phase, not support parallel.',
    specifications: 'Battery voltage: 24Vdc | Rated power: 3KW | AC voltage: 230Vac | MPPT PV power: 3000W | MPPT max voltage: 450Vdc | MPPT PV voltage: 30~400Vdc | Protection: IP21 | Dimensions: 270x95x350mm | Weight: 6kg',
    packaging: '275x95x360mm (0.0094 m3)',
    warranty: '2 Year',
    sortOrder: 2,
    categoryId: subOffGridInverters.id,
  });

  await upsertProduct({
    id: 'prod-offgrid-inverter-6kw',
    name: 'Off-Grid Inverter 6KW',
    nameCn: '离网逆变器 6KW',
    slug: 'ba-inv-a0101-3-offgrid-inverter-6kw',
    description: 'Off-grid inverter 6KW, single-phase, not support parallel.',
    specifications: 'Battery voltage: 48Vdc | Rated power: 6KW | AC voltage: 230Vac | MPPT PV power: 5500W | MPPT max voltage: 500Vdc | MPPT PV voltage: 90~450Vdc | Protection: IP21 | Dimensions: 350x115x425mm | Weight: 12kg',
    packaging: '335x125x480mm (0.0201 m3)',
    warranty: '2 Year',
    sortOrder: 3,
    categoryId: subOffGridInverters.id,
  });

  await upsertProduct({
    id: 'prod-offgrid-inverter-10kw',
    name: 'Off-Grid Inverter 10KW',
    nameCn: '离网逆变器 10KW',
    slug: 'ba-inv-a0101-4-offgrid-inverter-10kw',
    description: 'Off-grid inverter 10KW, single-phase, not support parallel.',
    specifications: 'Battery voltage: 48Vdc | Rated power: 10KW | AC voltage: 230Vac | MPPT PV power: 6000W x 2 | MPPT max voltage: 500Vdc | MPPT PV voltage: 90~450Vdc (2 channels) | Protection: IP21 | Dimensions: 400x170x620mm | Weight: 16kg',
    packaging: '420x125x550mm (0.0289 m3)',
    warranty: '2 Year',
    sortOrder: 4,
    categoryId: subOffGridInverters.id,
  });

  await upsertProduct({
    id: 'prod-offgrid-inverter-3-6kw',
    name: 'Off-Grid Inverter 3.6KW',
    nameCn: '离网逆变器 3.6KW',
    slug: 'ba-inv-a0102-1-offgrid-inverter-3-6kw',
    description: 'Off-grid inverter 3.6KW, single-phase, not support parallel.',
    specifications: 'Rated power: 3.6KW | Protection: IP21',
    packaging: '300x110x360mm (0.0119 m3)',
    warranty: '2 Year',
    sortOrder: 5,
    categoryId: subOffGridInverters.id,
  });

  await upsertProduct({
    id: 'prod-offgrid-inverter-5kw',
    name: 'Off-Grid Inverter 5KW',
    nameCn: '离网逆变器 5KW',
    slug: 'ba-inv-a0101-5-offgrid-inverter-5kw',
    description: 'Off-grid inverter 5KW, single-phase, not support parallel.',
    specifications: 'Rated power: 5KW | Protection: IP21',
    packaging: '335x125x480mm (0.0201 m3)',
    warranty: '2 Year',
    sortOrder: 6,
    categoryId: subOffGridInverters.id,
  });

  await upsertProduct({
    id: 'prod-offgrid-inverter-11kw-parallel',
    name: 'Off-Grid Inverter 11KW (Parallel)',
    nameCn: '离网逆变器 11KW 可并机',
    slug: 'ba-inv-a0102-3-offgrid-inverter-11kw',
    description: 'Off-grid inverter 11KW, supports parallel operation.',
    specifications: 'Battery voltage: 48Vdc | Rated power: 11KW | AC voltage: 230Vac | MPPT PV power: 5.5KW x 2 | MPPT PV voltage: 90~450Vdc (2 channels) | MPPT trackers: 3 | Protection: IP21 | Dimensions: 148x433x553mm | Weight: 18.4kg',
    packaging: '420x125x550mm (0.0289 m3)',
    warranty: '2 Year',
    sortOrder: 7,
    categoryId: subOffGridInverters.id,
  });

  await upsertProduct({
    id: 'prod-offgrid-inverter-5kw-parallel',
    name: 'Off-Grid Inverter 5KW (Parallel)',
    nameCn: '离网逆变器 5KW 可并机',
    slug: 'ba-inv-a0103-1-offgrid-inverter-5kw-p',
    description: 'Off-grid inverter 5KW, single-phase, supports parallel operation.',
    specifications: 'Battery voltage: 48Vdc | Rated power: 5000W | Rated grid voltage: 230Vac | MPPT range: 120-430Vdc | Protection: IP21 | Dimensions: 585x360x155mm / 430x230x440mm | Weight: 12-13kg',
    packaging: '585x360x155mm (0.0326 m3)',
    warranty: '2 Year',
    sortOrder: 8,
    categoryId: subOffGridInverters.id,
  });

  console.log('Created 8 Off-Grid Inverter products');

  // ═══ Hybrid Inverters (6 products) ════════════════════════════════════════

  await upsertProduct({
    id: 'prod-hybrid-inverter-3-9kw',
    name: 'Hybrid Inverter 3.9KW IP65',
    nameCn: '混合逆变器 3.9KW IP65',
    slug: 'ba-inv-a0104-1-hybrid-inverter-3-9kw',
    description: 'Hybrid inverter (off-grid & on-grid) 3.9KW. Waterproof IP65, single-phase, supports parallel operation, supports grid-tied and off-grid modes.',
    specifications: 'Battery voltage: 48Vdc | Rated power: 3960W | Rated grid voltage: 230Vac | MPPT range: 120-430Vdc | Protection: IP65 | Dimensions: 350x230x580mm | Weight: 23.5kg',
    packaging: '350x230x580mm (0.0467 m3)',
    warranty: '2 Year',
    sortOrder: 1,
    categoryId: subHybridInverters.id,
  });

  await upsertProduct({
    id: 'prod-hybrid-inverter-5kw',
    name: 'Hybrid Inverter 5KW IP65',
    nameCn: '混合逆变器 5KW IP65',
    slug: 'ba-inv-a0104-2-hybrid-inverter-5kw',
    description: 'Hybrid inverter (off-grid & on-grid) 5KW. Waterproof IP65, single-phase, supports parallel operation.',
    specifications: 'Battery voltage: 48Vdc | Rated power: 5000W | Rated grid voltage: 230Vac | MPPT range: 120-430Vdc | Protection: IP65 | Dimensions: 350x230x580mm | Weight: 23.5kg',
    packaging: '350x230x580mm',
    warranty: '2 Year',
    sortOrder: 2,
    categoryId: subHybridInverters.id,
  });

  await upsertProduct({
    id: 'prod-hybrid-inverter-5-5kw',
    name: 'Hybrid Inverter 5.5KW IP65',
    nameCn: '混合逆变器 5.5KW IP65',
    slug: 'ba-inv-a0104-3-hybrid-inverter-5-5kw',
    description: 'Hybrid inverter (off-grid & on-grid) 5.5KW. Waterproof IP65, single-phase, supports parallel operation.',
    specifications: 'Battery voltage: 48Vdc | Rated power: 5500W | Rated grid voltage: 230Vac | MPPT range: 120-430Vdc | Protection: IP65 | Dimensions: 350x230x580mm | Weight: 23.5kg',
    packaging: '350x230x580mm',
    warranty: '2 Year',
    sortOrder: 3,
    categoryId: subHybridInverters.id,
  });

  await upsertProduct({
    id: 'prod-hybrid-inverter-3-5-5kw-hv',
    name: 'Hybrid Inverter 3.5-5KW HV IP65',
    nameCn: '混合逆变器 3.5-5KW 高压 IP65',
    slug: 'ba-inv-a0105-1-hybrid-inverter-hv-5kw',
    description: 'Hybrid inverter (off-grid & on-grid) 3.5-5KW high voltage. Waterproof IP65, single-phase, supports parallel operation, supports grid-tied and off-grid modes.',
    specifications: 'Battery voltage: 80-500Vdc | Rated power: 3960VA/5500VA | AC voltage: 230Vac | MPPT highest voltage: 120-430Vdc / 80-580Vdc | Max PV voltage: 500Vdc/600Vdc | Max PV power: 5200W/10000W | Protection: IP65 | Dimensions: 410x400x165mm | Weight: 15kg',
    packaging: '410x400x165mm (0.0271 m3)',
    warranty: '2 Year',
    sortOrder: 4,
    categoryId: subHybridInverters.id,
  });

  await upsertProduct({
    id: 'prod-hybrid-inverter-6kw-hv',
    name: 'Hybrid Inverter 6KW HV IP65',
    nameCn: '混合逆变器 6KW 高压 IP65',
    slug: 'ba-inv-a0105-2-hybrid-inverter-hv-6kw',
    description: 'Hybrid inverter (off-grid & on-grid) 6KW high voltage. Waterproof IP65, supports parallel operation.',
    specifications: 'Battery voltage: 80-500Vdc | Rated power: 6500VA | AC voltage: 230Vac | MPPT highest voltage: 80-580Vdc | Max PV voltage: 600Vdc | Max PV power: 12000W | Protection: IP65 | Dimensions: 410x400x165mm | Weight: 15kg',
    packaging: '410x400x165mm',
    warranty: '2 Year',
    sortOrder: 5,
    categoryId: subHybridInverters.id,
  });

  await upsertProduct({
    id: 'prod-hybrid-inverter-8kw-hv',
    name: 'Hybrid Inverter 8KW HV IP65',
    nameCn: '混合逆变器 8KW 高压 IP65',
    slug: 'ba-inv-a0105-3-hybrid-inverter-hv-8kw',
    description: 'Hybrid inverter (off-grid & on-grid) 8KW high voltage. Waterproof IP65, supports parallel operation.',
    specifications: 'Battery voltage: 80-500Vdc | Rated power: 8500VA | AC voltage: 230Vac | MPPT highest voltage: 80-580Vdc | Max PV voltage: 600Vdc | Max PV power: 16000W | Protection: IP65 | Dimensions: 410x400x165mm | Weight: 15kg',
    packaging: '410x400x165mm',
    warranty: '2 Year',
    sortOrder: 6,
    categoryId: subHybridInverters.id,
  });

  console.log('Created 6 Hybrid Inverter products');

  // ═══ Three-Phase Inverters (5 products) ═══════════════════════════════════

  await upsertProduct({
    id: 'prod-3phase-inverter-10kw',
    name: 'Three-Phase Hybrid Inverter 10KW',
    nameCn: '三相混合逆变器 10KW',
    slug: 'ba-inv-s0106-1-3phase-inverter-10kw',
    description: 'Three-phase hybrid inverter (off-grid & on-grid) 10KW. IP65, warranty period up to 5 years.',
    specifications: 'Max DC input power: 13000W | Max DC input voltage: 1000V | Start-up voltage: 180V | MPPT range: 325-850V | PV input current: 20+20A | MPPT trackers: 2 | Strings per MPPT: 1+1 | Rated AC output power: 10000W | Max AC output power: 11000W | AC output rated current: 15.2A | Max continuous AC passthrough: 40A | Dimensions: 408x638x237mm | Weight: 30kg',
    packaging: '408x638x237mm (0.0617 m3)',
    warranty: '2 Year',
    sortOrder: 1,
    categoryId: subThreePhaseInverters.id,
  });

  await upsertProduct({
    id: 'prod-3phase-inverter-12kw',
    name: 'Three-Phase Hybrid Inverter 12KW',
    nameCn: '三相混合逆变器 12KW',
    slug: 'ba-inv-s0106-2-3phase-inverter-12kw',
    description: 'Three-phase hybrid inverter (off-grid & on-grid) 12KW. IP65, warranty period up to 5 years.',
    specifications: 'Max DC input power: 15600W | Max DC input voltage: 1000V | Start-up voltage: 180V | MPPT range: 325-850V | PV input current: 26+26A | MPPT trackers: 2 | Strings per MPPT: 2+2 | Rated AC output power: 12000W | Max AC output power: 14400W | AC output rated current: 18.2A | Max continuous AC passthrough: 48A | Dimensions: 408x638x237mm | Weight: 30kg',
    packaging: '408x638x237mm (0.0617 m3)',
    warranty: '2 Year',
    sortOrder: 2,
    categoryId: subThreePhaseInverters.id,
  });

  await upsertProduct({
    id: 'prod-3phase-inverter-20kw',
    name: 'Three-Phase Hybrid Inverter 20KW',
    nameCn: '三相混合逆变器 20KW',
    slug: 'ba-inv-s0106-3-3phase-inverter-20kw',
    description: 'Three-phase hybrid inverter (off-grid & on-grid) 20KW. IP65, warranty period up to 5 years.',
    specifications: 'Max DC input power: 26000W | Max DC input voltage: 1000V | Start-up voltage: 180V | MPPT range: 325-850V | PV input current: 26+26A | MPPT trackers: 2 | Strings per MPPT: 2+2 | Rated AC output power: 20000W | Max AC output power: 22000W | AC output rated current: 30.4A | Max continuous AC passthrough: 80A | Dimensions: 408x638x237mm | Weight: 30kg',
    packaging: '408x638x237mm (0.0617 m3)',
    warranty: '2 Year',
    sortOrder: 3,
    categoryId: subThreePhaseInverters.id,
  });

  await upsertProduct({
    id: 'prod-3phase-inverter-30kw',
    name: 'Three-Phase Hybrid Inverter 30KW',
    nameCn: '三相混合逆变器 30KW',
    slug: 'ba-inv-s0107-1-3phase-inverter-30kw',
    description: 'Three-phase hybrid inverter (off-grid & on-grid) 30KW. IP65, warranty period up to 5 years.',
    specifications: 'Max DC input power: 39000W | Max DC input voltage: 1000V | Start-up voltage: 180V | MPPT range: 150-850V | Full load MPPT range: 360-850V | PV input current: 36+36+36A | MPPT trackers: 3 | Strings per MPPT: 2+2+2 | Rated AC output power: 30000W | Max AC output power: 33000W | AC output rated current: 45.6A | Max continuous AC passthrough: 118A | Peak power: 1.5x rated, 10s | THDi: <3% | Dimensions: 527x894x294mm | Weight: 80kg',
    packaging: '527x894x294mm (0.1385 m3)',
    warranty: '2 Year',
    sortOrder: 4,
    categoryId: subThreePhaseInverters.id,
  });

  await upsertProduct({
    id: 'prod-3phase-inverter-50kw',
    name: 'Three-Phase Hybrid Inverter 50KW',
    nameCn: '三相混合逆变器 50KW',
    slug: 'ba-inv-s0107-2-3phase-inverter-50kw',
    description: 'Three-phase hybrid inverter (off-grid & on-grid) 50KW. IP65, warranty period up to 5 years.',
    specifications: 'Max DC input power: 65000W | Max DC input voltage: 1000V | Start-up voltage: 180V | MPPT range: 150-850V | Full load MPPT range: 450-850V | PV input current: 36+36+36A | MPPT trackers: 4 | Strings per MPPT: 2+2+2 | Rated AC output power: 50000W | Max AC output power: 55000W | AC output rated current: 76.0A | Max continuous AC passthrough: 197A | Peak power: 1.5x rated, 10s | THDi: <3% | Dimensions: 527x894x294mm | Weight: 80kg',
    packaging: '527x894x294mm (0.1385 m3)',
    warranty: '2 Year',
    sortOrder: 5,
    categoryId: subThreePhaseInverters.id,
  });

  console.log('Created 5 Three-Phase Inverter products');

  // ═══ Rack-mount ESS (12 products) ═════════════════════════════════════════

  await upsertProduct({
    id: 'prod-ess-rack-20kwh-10kw',
    name: 'ESS 20KWh+10KW Rack IP20',
    nameCn: '锂电池柜 20KWh+10KW 机架式 IP20',
    slug: 'ba-ess-a0501-1-rack-20kwh-10kw',
    description: 'LiFePO4 battery energy storage power station, rack-mount design, IP20.',
    specifications: 'Battery: 20KWh | PCS: 10KW | MPPT: 10KW | MPPT range: 90~450Vdc | AC voltage: 230Vac | Protection: IP20 | Diesel generator support: Yes | Communication: RS485/WiFi | Dimensions: 670x800x1000mm | Weight: 350kg',
    packaging: '600x600x1200mm (0.432 m3)',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 1,
    categoryId: subRackMountEss.id,
  });

  await upsertProduct({
    id: 'prod-ess-rack-30kwh-10kw',
    name: 'ESS 30KWh+10KW Rack IP20',
    nameCn: '锂电池柜 30KWh+10KW 机架式 IP20',
    slug: 'ba-ess-a0501-2-rack-30kwh-10kw',
    description: 'LiFePO4 battery energy storage power station, rack-mount design, IP20.',
    specifications: 'Battery: 30KWh | PCS: 10KW | MPPT: 10KW | AC voltage: 230Vac | Protection: IP20 | Diesel generator support: Yes | Communication: RS485/WiFi | Dimensions: 600x600x1400mm | Weight: 380kg',
    packaging: '600x600x1400mm (0.504 m3)',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 2,
    categoryId: subRackMountEss.id,
  });

  await upsertProduct({
    id: 'prod-ess-rack-30kwh-20kw',
    name: 'ESS 30KWh+20KW Rack IP20',
    nameCn: '锂电池柜 30KWh+20KW 机架式 IP20',
    slug: 'ba-ess-a0501-3-rack-30kwh-20kw',
    description: 'LiFePO4 battery energy storage power station, rack-mount design, IP20.',
    specifications: 'Battery: 30KWh | PCS: 20KW | MPPT: 20KW | AC voltage: 230Vac/240Vac | Protection: IP20 | Diesel generator support: Yes | Communication: RS485/WiFi | Dimensions: 600x600x1750mm | Weight: 480kg',
    packaging: '600x600x1750mm (0.63 m3)',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 3,
    categoryId: subRackMountEss.id,
  });

  await upsertProduct({
    id: 'prod-ess-rack-40kwh-20kw',
    name: 'ESS 40KWh+20KW Rack IP20',
    nameCn: '锂电池柜 40KWh+20KW 机架式 IP20',
    slug: 'ba-ess-a0506-4-rack-40kwh-20kw',
    description: 'LiFePO4 battery energy storage power station, rack-mount design, IP20.',
    specifications: 'Battery: 40KWh | PCS: 20KW | Protection: IP20',
    packaging: '600x600x1900mm (0.684 m3)',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 4,
    categoryId: subRackMountEss.id,
  });

  await upsertProduct({
    id: 'prod-ess-rack-15kwh-5kw',
    name: 'ESS 15KWh+5KW',
    nameCn: '储能柜 15KWh+5KW',
    slug: 'ba-ess-a0512-rack-15kwh-5kw',
    description: 'Energy storage system 15KWh battery with 5KW inverter.',
    specifications: 'Battery voltage: 51.2V | Battery capacity: 312Ah | Total battery energy: 15KWh | Inverter power: 5KW | MPPT voltage range: 120-450Vdc | Waterproof grade: IP20 | Communication: RS485/WiFi | Dimensions: 510x377x770mm | Weight: 120kg',
    packaging: '510x377x770mm',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 5,
    categoryId: subRackMountEss.id,
  });

  await upsertProduct({
    id: 'prod-ess-rack-28kwh-15kw',
    name: 'ESS 28KWh+15KW',
    nameCn: '储能柜 28KWh+15KW',
    slug: 'ba-ess-a0513-rack-28kwh-15kw',
    description: 'Energy storage system 28KWh battery with 15KW inverter.',
    specifications: 'Battery voltage: 51.2V | Total battery energy: 28.6KWh | Inverter power: 15KW | MPPT voltage range: 120-450Vdc | Waterproof grade: IP20 | Communication: RS485/WiFi | Dimensions: 670x900x1560mm | Weight: 260kg',
    packaging: '670x900x1560mm',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 6,
    categoryId: subRackMountEss.id,
  });

  await upsertProduct({
    id: 'prod-ess-rack-43kwh-15kw',
    name: 'ESS 43KWh+15KW',
    nameCn: '储能柜 43KWh+15KW',
    slug: 'ba-ess-a0514-rack-43kwh-15kw',
    description: 'Energy storage system 43KWh battery with 15KW inverter.',
    specifications: 'Battery capacity: 43KWh | PCS output: 15KW | MPPT power: 15KW | MPPT range: 90-450Vdc | Waterproof grade: IP54 | Communication: RS485/WiFi | AC voltage: 400Vac/230Vac | Dimensions: 670x900x1560mm | Weight: 550kg',
    packaging: '670x900x1560mm',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 7,
    categoryId: subRackMountEss.id,
  });

  await upsertProduct({
    id: 'prod-ess-rack-57kwh-15kw',
    name: 'ESS 57KWh+15KW',
    nameCn: '储能柜 57KWh+15KW',
    slug: 'ba-ess-a0515-rack-57kwh-15kw',
    description: 'Energy storage system 57KWh battery with 15KW inverter.',
    specifications: 'Battery capacity: 57KWh | PCS output: 15KW | MPPT power: 15KW | MPPT range: 90-450Vdc | Waterproof grade: IP54 | Communication: RS485/WiFi | AC voltage: 400Vac/230Vac | Dimensions: 670x900x1560mm | Weight: 550kg',
    packaging: '670x900x1560mm',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 8,
    categoryId: subRackMountEss.id,
  });

  await upsertProduct({
    id: 'prod-ess-rack-48kwh-15kw-3phase',
    name: 'ESS 48KWh+15KW Three-phase',
    nameCn: '储能柜 48KWh+15KW 离网三相低压交直流一体柜 IP20',
    slug: 'ba-ess-a0516-rack-48kwh-15kw-3p',
    description: 'Energy storage system 48KWh battery with 15KW inverter, three-phase off-grid low-voltage AC/DC integrated cabinet.',
    specifications: 'Battery capacity: 48KWh | PCS output: 15KW | MPPT power: 15KW | MPPT range: 90-450Vdc | Waterproof grade: IP54 | Communication: RS485/WiFi | AC voltage: 400Vac/230Vac | Dimensions: 670x900x1560mm | Weight: 550kg',
    packaging: '670x900x1560mm',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 9,
    categoryId: subRackMountEss.id,
  });

  await upsertProduct({
    id: 'prod-ess-rack-64kwh-30kw',
    name: 'ESS 64KWh+30KW',
    nameCn: '储能柜 64KWh+30KW 离网三相低压光储柴一体柜 IP54',
    slug: 'ba-ess-a0517-rack-64kwh-30kw',
    description: 'Energy storage system 64KWh battery with 30KW inverter, three-phase off-grid solar-storage-diesel integrated cabinet.',
    specifications: 'Battery capacity: 64KWh | PCS output: 30KW | MPPT power: 33KW | MPPT range: 90-450Vdc | Waterproof grade: IP54 | Communication: RS485/WiFi | AC voltage: 400Vac/230Vac | Dimensions: 670x900x1600mm | Weight: 650kg',
    packaging: '670x900x1600mm',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 10,
    categoryId: subRackMountEss.id,
  });

  await upsertProduct({
    id: 'prod-ess-rack-96kwh-30kw',
    name: 'ESS 96KWh+30KW',
    nameCn: '储能柜 96KWh+30KW 离网三相低压光储柴一体柜 IP54',
    slug: 'ba-ess-a0518-rack-96kwh-30kw',
    description: 'Energy storage system 96KWh battery with 30KW inverter, three-phase off-grid solar-storage-diesel integrated cabinet.',
    specifications: 'Battery capacity: 96KWh | PCS output: 30KW | MPPT power: 33KW | MPPT range: 90-450Vdc | Waterproof grade: IP54 | Communication: RS485/WiFi | AC voltage: 400Vac/230Vac | Dimensions: 670x900x1600mm | Weight: 650kg',
    packaging: '670x900x1600mm',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 11,
    categoryId: subRackMountEss.id,
  });

  await upsertProduct({
    id: 'prod-ess-rack-128kwh-60kw',
    name: 'ESS 128KWh+60KW',
    nameCn: '储能柜 128KWh+60KW',
    slug: 'ba-ess-a0519-rack-128kwh-60kw',
    description: 'Energy storage system 128KWh battery with 60KW inverter.',
    specifications: 'Battery capacity: 128KWh | PCS output: 60KW | MPPT power: 70KW | MPPT range: 250-800Vdc | Waterproof grade: IP54 | Communication: RS485/WiFi | AC voltage: 400Vac/230Vac | Dimensions: 1060x1035x1850mm | Weight: 1350kg',
    packaging: '1060x1035x1850mm',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 12,
    categoryId: subRackMountEss.id,
  });

  console.log('Created 12 Rack-mount ESS products');

  // ═══ IP54 Sealed ESS (7 products) ═════════════════════════════════════════

  await upsertProduct({
    id: 'prod-ess-ip54-50kwh-30kw',
    name: 'IP54 ESS 50KWh+30KW',
    nameCn: '储能柜风冷 IP54 50KWh+30KW',
    slug: 'ba-ess-a0502-1-ip54-50kwh-30kw',
    description: 'IP54 energy storage system, fully sealed housing with built-in air conditioning.',
    specifications: 'Battery: 50KWh | PCS: 30KW | MPPT: 38KW | MPPT range: 200~800Vdc | AC voltage: 400Vac/230Vac | Protection: IP54 | Diesel generator support: Yes | Dimensions: 660x990x1885mm | Weight: 750kg',
    packaging: '660x1130x1850mm (1.3797 m3)',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 1,
    categoryId: subIp54SealedEss.id,
  });

  await upsertProduct({
    id: 'prod-ess-ip54-60kwh-30kw',
    name: 'IP54 ESS 60KWh+30KW',
    nameCn: '储能柜风冷 IP54 60KWh+30KW',
    slug: 'ba-ess-a0502-2-ip54-60kwh-30kw',
    description: 'IP54 energy storage system, fully sealed housing with built-in air conditioning.',
    specifications: 'Battery: 60KWh | PCS: 30KW | MPPT: 38KW | MPPT range: 200~800Vdc | AC voltage: 400Vac/230Vac | Protection: IP54 | Diesel generator support: Yes | Dimensions: 660x990x1885mm | Weight: 830kg',
    packaging: '660x1130x1850mm (1.3797 m3)',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 2,
    categoryId: subIp54SealedEss.id,
  });

  await upsertProduct({
    id: 'prod-ess-ip20-50kwh-30kw-rack',
    name: 'IP20 ESS 50KWh+30KW Rack',
    nameCn: '储能柜风冷 IP20 50KWh+30KW 机架式',
    slug: 'ba-ess-a0502-3-ip20-50kwh-30kw-rack',
    description: 'IP20 energy storage system, rack-mount design.',
    specifications: 'Battery: 50KWh | PCS: 30KW | MPPT: 38KW | MPPT range: 200~800Vdc | AC voltage: 400Vac/230Vac | Protection: IP54 | Diesel generator support: Yes | Dimensions: 660x990x1885mm | Weight: 750kg',
    packaging: '600x850x1750mm (0.8925 m3)',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 3,
    categoryId: subIp54SealedEss.id,
  });

  await upsertProduct({
    id: 'prod-ess-ip20-60kwh-30kw-rack',
    name: 'IP20 ESS 60KWh+30KW Rack',
    nameCn: '储能柜风冷 IP20 60KWh+30KW 机架式',
    slug: 'ba-ess-a0502-4-ip20-60kwh-30kw-rack',
    description: 'IP20 energy storage system, rack-mount design.',
    specifications: 'Battery: 60KWh | PCS: 30KW | MPPT: 38KW | MPPT range: 200~800Vdc | AC voltage: 400Vac/230Vac | Protection: IP54 | Diesel generator support: Yes | Dimensions: 660x990x1885mm | Weight: 830kg',
    packaging: '600x850x1750mm (0.8925 m3)',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 4,
    categoryId: subIp54SealedEss.id,
  });

  await upsertProduct({
    id: 'prod-ess-ip54-215kwh-100kw',
    name: 'IP54 ESS 215KWh+100KW',
    nameCn: '储能柜风冷 IP54 215KWh+100KW',
    slug: 'ba-ess-a0504-1-ip54-215kwh-100kw',
    description: 'IP54 energy storage system, fully sealed housing with built-in air conditioning.',
    specifications: 'Battery: 215KWh | PCS: 100KW | MPPT: 120KW | MPPT range: 250~850Vdc | AC voltage: 208Vac/120Vac, 230Vac/133Vac, 480Vac/277Vac | Protection: IP54 | Diesel generator support: 10 units | Dimensions: 1580x1050x2090mm | Weight: 2700kg',
    packaging: '1450x1355x2190mm (4.3028 m3)',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 5,
    categoryId: subIp54SealedEss.id,
  });

  await upsertProduct({
    id: 'prod-ess-ip54-241kwh-100kw',
    name: 'IP54 ESS 241KWh+100KW',
    nameCn: '储能柜风冷 IP54 241KWh+100KW',
    slug: 'ba-ess-a0504-2-ip54-241kwh-100kw',
    description: 'IP54 energy storage system, fully sealed housing with built-in air conditioning.',
    specifications: 'Battery: 241KWh | PCS: 100KW | MPPT: 120KW | MPPT range: 250~850Vdc | AC voltage: 208Vac/120Vac, 230Vac/133Vac, 480Vac/277Vac | Protection: IP54 | Diesel generator support: 10 units | Dimensions: 1580x1050x2090mm | Weight: 2750kg',
    packaging: '1450x1355x2190mm (4.3028 m3)',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 6,
    categoryId: subIp54SealedEss.id,
  });

  await upsertProduct({
    id: 'prod-ess-ip54-100kwh-50kw',
    name: 'IP54 ESS 100KWh+50KW',
    nameCn: '储能柜 IP54 100KWh+50KW',
    slug: 'ba-ess-a0503-1-ip54-100kwh-50kw',
    description: 'IP54 energy storage system, fully sealed housing with built-in air conditioning.',
    specifications: 'Battery: 100KWh | PCS: 50KW | MPPT: 70KW | MPPT range: 250~800Vdc | AC voltage: 400Vac/230Vac | Protection: IP54 | Diesel generator support: Yes | Dimensions: 1060x1035x1850mm | Weight: 1200kg',
    packaging: '1200x1400x2200mm (3.696 m3)',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 7,
    categoryId: subIp54SealedEss.id,
  });

  console.log('Created 7 IP54 Sealed ESS products');

  // ═══ EV Charging + Storage (3 products) ═══════════════════════════════════

  await upsertProduct({
    id: 'prod-ev-charging-60kwh-60kw',
    name: 'EV Charging+Storage 60KWh+60KW (1 port)',
    nameCn: '车储充一体 60KWh+60KW 单枪',
    slug: 'ba-ess-a0505-1-ev-charging-60kwh-60kw',
    description: 'EV charging + energy storage all-in-one, IP54, fully sealed housing with built-in air conditioning, 1 charging port.',
    specifications: 'Lithium battery energy: 60KWh | Quick charge power: 60KW | Max DC charging power: 30KW | Max AC charging power: 30KW | Max PV charging power: 38KW | Communication: RS485/WiFi/4G | Protection: IP54 | Dimensions: 1100x850x1050mm | Weight: 750kg',
    packaging: '1100x850x1050mm (0.9818 m3)',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 1,
    categoryId: subEvChargingStorage.id,
  });

  await upsertProduct({
    id: 'prod-ev-charging-141kwh-120kw',
    name: 'EV Charging+Storage 141KWh+120KW (2 ports)',
    nameCn: '车储充一体 141KWh+120KW 双枪',
    slug: 'ba-ess-a0505-2-ev-charging-141kwh-120kw',
    description: 'EV charging + energy storage all-in-one, IP54, fully sealed housing with built-in air conditioning, 2 charging ports.',
    specifications: 'Lithium battery energy: 141KWh | Quick charge power: 120KW | Max DC charging power: 70KW | Max AC charging power: 60KW | Max PV charging power: 70KW | Communication: RS485/WiFi/4G | Protection: IP54 | Dimensions: 1700x1350x1000mm | Weight: 1400kg',
    packaging: '1700x1350x1000mm (2.295 m3)',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 2,
    categoryId: subEvChargingStorage.id,
  });

  await upsertProduct({
    id: 'prod-ev-charging-172kwh-120kw',
    name: 'EV Charging+Storage 172KWh+120KW (2 ports)',
    nameCn: '车储充一体 172KWh+120KW 双枪',
    slug: 'ba-ess-a0505-3-ev-charging-172kwh-120kw',
    description: 'EV charging + energy storage all-in-one, IP54, fully sealed housing with built-in air conditioning, 2 charging ports.',
    specifications: 'Lithium battery energy: 172KWh | Quick charge power: 120KW | Max DC charging power: 80KW | Max AC charging power: 60KW | Max PV charging power: 70KW | Communication: RS485/WiFi/4G | Protection: IP54 | Dimensions: 1800x1650x1050mm | Weight: 1550kg',
    packaging: '1800x1650x1050mm (3.1185 m3)',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 3,
    categoryId: subEvChargingStorage.id,
  });

  console.log('Created 3 EV Charging+Storage products');

  // ═══ Wall-mount All-in-One (2 products) ═══════════════════════════════════

  await upsertProduct({
    id: 'prod-aio-wall-2kwh-1kw',
    name: 'Wall-mount AIO 2.56KWh 1KW',
    nameCn: '壁挂式一体机 2.56KWh 1KW',
    slug: 'ba-aio-a0201-1-wall-aio-2kwh-1kw',
    description: 'Wall-mount all-in-one battery + inverter system, 2.56KWh battery with 1KW inverter.',
    specifications: 'Energy: 2.56KWh | Inverter power: 1KW | Rated power: 800W/600W | Max PV power: 1000W | MPPT voltage: 20~50V | AC voltage: 110/230Vac | Protection: IP65 | Dimensions: 505x105x690mm | Weight: 31kg',
    packaging: '505x105x690mm (0.0366 m3)',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 1,
    categoryId: subWallMountAio.id,
  });

  await upsertProduct({
    id: 'prod-aio-wall-2kwh-3kw',
    name: 'Wall-mount AIO 2.56KWh 3KW',
    nameCn: '壁挂式一体机 2.56KWh 3KW',
    slug: 'ba-aio-a0202-1-wall-aio-2kwh-3kw',
    description: 'Wall-mount all-in-one battery + inverter system, 2.56KWh battery with 3KW inverter.',
    specifications: 'Battery voltage: 25.6V | Battery capacity: 100Ah | Energy: 2.56KWh | Inverter power: 3KW | MPPT voltage: 40~450Vdc | Protection: IP20 | Communication: RS485/WiFi | Dimensions: 450x140x570mm | Weight: 30kg',
    packaging: '460x140x700mm (0.0451 m3)',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 2,
    categoryId: subWallMountAio.id,
  });

  console.log('Created 2 Wall-mount AIO products');

  // ═══ Standing All-in-One (2 products) ═════════════════════════════════════

  await upsertProduct({
    id: 'prod-aio-stand-5kwh-5kw',
    name: 'Standing AIO 5.12KWh 5KW',
    nameCn: '站立式一体机 5.12KWh 5KW',
    slug: 'ba-aio-a0202-2-stand-aio-5kwh-5kw',
    description: 'Standing all-in-one battery + inverter system, 5.12KWh battery with 5KW inverter.',
    specifications: 'Battery voltage: 51.2V | Battery capacity: 100Ah | Energy: 5.12KWh | Inverter power: 5KW | MPPT voltage: 120~430Vdc | Protection: IP20 | Communication: RS485/WiFi | Dimensions: 500x150x730mm | Weight: 58kg',
    packaging: '500x140x700mm (0.049 m3)',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 1,
    categoryId: subStandingAio.id,
  });

  await upsertProduct({
    id: 'prod-aio-stand-10kwh-5kw',
    name: 'Standing AIO 10.24KWh 5KW',
    nameCn: '站立式一体机 10.24KWh 5KW',
    slug: 'ba-aio-a0202-3-stand-aio-10kwh-5kw',
    description: 'Standing all-in-one battery + inverter system, 10.24KWh battery with 5KW inverter.',
    specifications: 'Battery energy: 10.24KWh | Nominal voltage: 51.2V | Rated capacity: 200Ah | Max PV power: 5000W | MPPT voltage range: 120~450Vdc | Rated AC output power: 5.0KW | AC voltage: 230Vac | AC frequency: 50Hz/60Hz | Transfer time: <20ms | Protection: IP20 | Operating temp: -10~50C',
    packaging: '620x150x1300mm (0.1209 m3)',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 2,
    categoryId: subStandingAio.id,
  });

  console.log('Created 2 Standing AIO products');

  // ═══ Stackable All-in-One (4 products) ════════════════════════════════════

  await upsertProduct({
    id: 'prod-aio-stackable-15kwh-10kw',
    name: 'Stackable AIO 15KWh 10KW',
    nameCn: '堆叠一体机 15KWh 10KW',
    slug: 'ba-aio-a0203-2-stackable-aio-15kwh-10kw',
    description: 'Stackable all-in-one battery + inverter system, 15KWh battery with 10KW inverter.',
    specifications: 'Energy: 15KWh | Inverter power: 10KW',
    packaging: '585x360x915mm (0.1927 m3)',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 1,
    categoryId: subStackableAio.id,
  });

  await upsertProduct({
    id: 'prod-aio-stackable-15kwh-5kw',
    name: 'Stackable AIO 15KWh 5KW',
    nameCn: '堆叠一体机 15KWh 5KW',
    slug: 'ba-aio-a0203-3-stackable-aio-15kwh-5kw',
    description: 'Stackable all-in-one battery + inverter system, 15KWh battery with 5KW inverter.',
    specifications: 'Voltage: 51.2V | Rated capacity: 300Ah | Energy: 15KWh | Inverter power: 5KW | Protection: IP21 | Dimensions: 585x360x760mm | Weight: 144kg',
    packaging: '585x360x915mm (0.1927 m3)',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 2,
    categoryId: subStackableAio.id,
  });

  await upsertProduct({
    id: 'prod-aio-stackable-20kwh-5kw',
    name: 'Stackable AIO 20KWh 5KW',
    nameCn: '堆叠一体机 20KWh 5KW',
    slug: 'ba-aio-a0203-4-stackable-aio-20kwh-5kw',
    description: 'Stackable all-in-one battery + inverter system, 20KWh battery with 5KW inverter.',
    specifications: 'Voltage: 51.2V | Rated capacity: 400Ah | Energy: 20KWh | Inverter power: 5KW | Protection: IP21 | Dimensions: 585x360x915mm | Weight: 168kg',
    packaging: '585x360x915mm (0.1927 m3)',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 3,
    categoryId: subStackableAio.id,
  });

  await upsertProduct({
    id: 'prod-aio-stackable-25kwh-5kw',
    name: 'Stackable AIO 25KWh 5KW',
    nameCn: '堆叠一体机 25KWh 5KW',
    slug: 'ba-aio-a0203-5-stackable-aio-25kwh-5kw',
    description: 'Stackable all-in-one battery + inverter system, 25KWh battery with 5KW inverter.',
    specifications: 'Voltage: 51.2V | Rated capacity: 500Ah | Energy: 25KWh | Inverter power: 5KW | Protection: IP21 | Dimensions: 585x360x1070mm | Weight: 228kg',
    packaging: '585x360x1070mm (0.2253 m3)',
    warranty: 'Battery 5 Year / Inverter 2 Year',
    sortOrder: 4,
    categoryId: subStackableAio.id,
  });

  console.log('Created 4 Stackable AIO products');

  // ═══ Solar Panels (3 products) ════════════════════════════════════════════

  await upsertProduct({
    id: 'prod-solar-panel-100wp',
    name: 'Energizer Portable Solar Panel 100WP',
    nameCn: 'Energizer 便携式太阳能板 100WP',
    slug: 'en-pv03-s100-solar-panel-100wp',
    description: 'Portable PV 100WP foldable solar panel (2 folds). Monocrystalline silicon cells with 22% efficiency.',
    specifications: 'Cell type: Monocrystalline silicon | Rated power: 100WP | Efficiency: 22% | Power voltage: 20.52V | Power current: 4.87A | Open circuit voltage: 24.12V +/-3% | Short circuit current: 5.11A +/-3% | Operating temp: -20C to +60C | Dimensions (open): 1082x655x35mm | Dimensions (folded): 540x655x70mm | Weight: 4.7kg',
    packaging: 'Folded: 540x655x70mm',
    warranty: '1 Year',
    brandName: 'Energizer',
    sortOrder: 1,
    categoryId: catSolarPower.id,
  });

  await upsertProduct({
    id: 'prod-solar-panel-200wp',
    name: 'Energizer Portable Solar Panel 200WP',
    nameCn: 'Energizer 便携式太阳能板 200WP',
    slug: 'en-pv04-s200-solar-panel-200wp',
    description: 'Portable PV 200WP foldable solar panel (4 folds). Monocrystalline silicon cells with 22% efficiency.',
    specifications: 'Cell type: Monocrystalline silicon | Rated power: 200WP | Efficiency: 22% | Power voltage: 20.52V | Power current: 9.75A | Open circuit voltage: 24.12V +/-3% | Short circuit current: 10.24A +/-3% | Operating temp: -20C to +60C | Dimensions (open): 2211x645x35mm | Dimensions (folded): 555x645x70mm | Weight: 8.4kg',
    packaging: 'Folded: 555x645x70mm',
    warranty: '1 Year',
    brandName: 'Energizer',
    sortOrder: 2,
    categoryId: catSolarPower.id,
  });

  await upsertProduct({
    id: 'prod-solar-panel-400wp',
    name: 'Energizer Portable Solar Panel 400WP',
    nameCn: 'Energizer 便携式太阳能板 400WP',
    slug: 'en-pv01-s400-solar-panel-400wp',
    description: 'Portable PV 400WP foldable solar panel (4 folds). Monocrystalline silicon cells with 22% efficiency. Includes free carrying bag.',
    specifications: 'Cell type: Monocrystalline silicon | Rated power: 400WP | Efficiency: 22% | Power voltage: 40.0V | Power current: 10.0A | Open circuit voltage: 47.5V +/-3% | Short circuit current: 10.55A +/-3% | Operating temp: -20C to +60C | Dimensions (open): 1058x2365x25mm | Dimensions (folded): 1058x627x28mm | Weight: 16kg',
    packaging: 'Folded: 1058x627x28mm',
    warranty: '1 Year',
    brandName: 'Energizer',
    sortOrder: 3,
    categoryId: catSolarPower.id,
  });

  console.log('Created 3 Solar Panel products');

  // ─── Summary ─────────────────────────────────────────────────────────────────

  const supplierProducts = await prisma.product.count({
    where: { supplierId: 'joyfull-tech' },
  });
  console.log(
    `\nDone! Added ${supplierProducts} Joyfull Technology products.`
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
