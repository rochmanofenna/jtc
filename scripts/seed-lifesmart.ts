import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('Seeding LifeSmart products...');

  // ─── 1. Create Supplier ──────────────────────────────────────────────────────

  const lifesmart = await prisma.company.upsert({
    where: { id: 'lifesmart' },
    update: {},
    create: {
      id: 'lifesmart',
      name: 'LifeSmart',
      type: 'supplier',
      country: 'CN',
      city: 'Hangzhou',
      description:
        'Smart home and building automation manufacturer. Product lines include security sensors (DEFED sub-brand), smart control panels, smart switches, curtain motors, smart locks, and universal remote controllers. Protocols: CoSS, WiFi, ZigBee, Z-Wave, 4G. Red Dot "Best of the Best" award winner.',
      industry: 'Smart Home & Building Automation',
      verificationStatus: 'VERIFIED',
    },
  });

  console.log(`Created supplier: ${lifesmart.name} (${lifesmart.id})`);

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

  // Parent category
  const catSmartBuilding = await upsertCategory({
    id: 'cat-smart-building',
    name: 'Smart Building',
    nameCn: '智能建筑 / Bangunan Pintar',
    slug: 'smart-building',
    icon: 'Home',
    sortOrder: 24,
  });

  console.log('Created 1 parent category');

  // Subcategories
  const subSecuritySensors = await upsertCategory({
    id: 'sub-security-sensors',
    name: 'Security Sensors',
    nameCn: '安防传感器 / Sensor Keamanan',
    slug: 'security-sensors',
    icon: 'Shield',
    sortOrder: 1,
    parentId: catSmartBuilding.id,
  });

  const subSmartControlPanels = await upsertCategory({
    id: 'sub-smart-control-panels',
    name: 'Smart Control Panels',
    nameCn: '智能控制面板 / Panel Kontrol Pintar',
    slug: 'smart-control-panels',
    icon: 'Monitor',
    sortOrder: 2,
    parentId: catSmartBuilding.id,
  });

  const subSmartSwitches = await upsertCategory({
    id: 'sub-smart-switches',
    name: 'Smart Switches',
    nameCn: '智能开关 / Saklar Pintar',
    slug: 'smart-switches',
    icon: 'ToggleRight',
    sortOrder: 3,
    parentId: catSmartBuilding.id,
  });

  const subSmartLocks = await upsertCategory({
    id: 'sub-smart-locks',
    name: 'Smart Locks',
    nameCn: '智能门锁 / Kunci Pintar',
    slug: 'smart-locks',
    icon: 'Lock',
    sortOrder: 4,
    parentId: catSmartBuilding.id,
  });

  const subSmartMotorsAccessories = await upsertCategory({
    id: 'sub-smart-motors-accessories',
    name: 'Smart Motors & Accessories',
    nameCn: '智能电机与配件 / Motor & Aksesori Pintar',
    slug: 'smart-motors-accessories',
    icon: 'Settings',
    sortOrder: 5,
    parentId: catSmartBuilding.id,
  });

  console.log('Created 5 subcategories');

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
        brandName: data.brandName ?? 'LifeSmart',
        isActive: true,
        sortOrder: data.sortOrder,
        supplierId: lifesmart.id,
        categoryId: data.categoryId,
      },
    });
  }

  // ═══ Security Sensors (4 products) ═══════════════════════════════════════

  await upsertProduct({
    id: 'prod-defed-door-window-sensor',
    name: 'DEFED Door/Window Sensor',
    nameCn: 'DEFED 门窗传感器',
    slug: 'defed-door-window-sensor',
    description: 'Fits most doors and windows, detects temperature, and has tamper protection. Sends app alerts on intrusion, with 800m wireless range and 10-year battery life.',
    material: 'PC',
    specifications: 'Radio Protocol: CoSS | Frequency: 433MHz | Signal Range: 800m (open field) | Dimensions: Sensor 22x22x89mm, Magnet 10x12x89mm | Weight: 44g | Operating Temperature: -5~45°C | Humidity: 5~90% | Battery: 10-year life',
    brandName: 'DEFED (LifeSmart)',
    sortOrder: 1,
    categoryId: subSecuritySensors.id,
  });

  await upsertProduct({
    id: 'prod-defed-motion-sensor',
    name: 'DEFED Motion Sensor',
    nameCn: 'DEFED 人体传感器',
    slug: 'defed-motion-sensor',
    description: 'Professional motion sensor for alarm systems with up to 12m detection range, dual-color LED status indicators, and tamper protection for wall and casing.',
    material: 'PC+ABS',
    specifications: 'IR Detection Range: Up to 12m | Detection Angle: Up to 90° | Power Supply: Battery CR123A 3V | Battery Life: Up to 7 years | Dimensions: 100x59.2mm | LED Indicator: Supported | Static Consumption: ≤0.05mW',
    brandName: 'DEFED (LifeSmart)',
    sortOrder: 2,
    categoryId: subSecuritySensors.id,
  });

  await upsertProduct({
    id: 'prod-defed-smart-station',
    name: 'DEFED Smart Station (Alarm Hub)',
    nameCn: 'DEFED 智能主机',
    slug: 'defed-smart-station',
    description: 'Control center of the DEFED alarm system. Collects, processes, and reports every signal and information of the system.',
    material: 'PC+ABS',
    specifications: 'Radio Protocol: CoSS, WiFi, ZigBee, 4G, Z-Wave | LED Indicator: Supported | Power Supply: DC 12V1A / Battery Backup / PoE | Operating Temperature: -5~45°C | Humidity: 5~90%',
    brandName: 'DEFED (LifeSmart)',
    sortOrder: 3,
    categoryId: subSecuritySensors.id,
  });

  await upsertProduct({
    id: 'prod-lifesmart-water-leak-sensor',
    name: 'LifeSmart Water Leak Sensor',
    nameCn: 'LifeSmart 水浸传感器',
    slug: 'lifesmart-water-leak-sensor',
    description: '24/7 water leak monitoring. Detects leaks and pooling, sends instant alerts via app to prevent damage.',
    material: 'ABS+PC',
    specifications: 'Radio Protocol: CoSS | Signal Range: 100m (open field) | Dimensions: 50x72x20mm | Weight: 31g | Operating Temperature: -5~45°C | Humidity: 5~90% | Power Supply: 1x CR2450 3V battery',
    brandName: 'LifeSmart',
    sortOrder: 4,
    categoryId: subSecuritySensors.id,
  });

  console.log('Created 4 Security Sensor products');

  // ═══ Smart Control Panels (2 products) ════════════════════════════════════

  await upsertProduct({
    id: 'prod-lifesmart-nature-7-pro',
    name: 'LifeSmart Nature 7 PRO Smart Panel',
    nameCn: 'LifeSmart Nature 7 PRO 智能面板',
    slug: 'lifesmart-nature-7-pro',
    description: 'Industry-leading transmission distance for whole-home connectivity. Eliminates dead zones, delivering reliable control across all rooms.',
    material: 'PC',
    specifications: 'Colors: Matte Grey / White | Dimensions: Exposed 249x113x16mm, Full 249x113x28.6mm | Weight: 525g | Installation: In-wall concealed with pre-embedded box (standard) | Operating Temperature: -5~45°C',
    brandName: 'LifeSmart',
    sortOrder: 1,
    categoryId: subSmartControlPanels.id,
  });

  await upsertProduct({
    id: 'prod-lifesmart-nature-mini-pro',
    name: 'LifeSmart Nature Mini Pro Smart Panel',
    nameCn: 'LifeSmart Nature Mini Pro 智能面板',
    slug: 'lifesmart-nature-mini-pro',
    description: 'One panel, total control. Whole-home smart control with one-tap scenes. Manage HVAC, lighting, curtains, floor heating, ventilation, motion, and door/window sensors from a single interface.',
    material: 'Bottom Cover PC, Top Cover ABS+PC',
    specifications: 'Colors: White / Gray / Black | Dimensions: Outside wall 86x86x11mm, Full 86x86x36mm | Wireless Protocol: Wi-Fi / CoSS / ZigBee | Signal Range: CoSS 200m, ZigBee 100m (open field)',
    brandName: 'LifeSmart',
    sortOrder: 2,
    categoryId: subSmartControlPanels.id,
  });

  console.log('Created 2 Smart Control Panel products');

  // ═══ Smart Switches (1 product) ═══════════════════════════════════════════

  await upsertProduct({
    id: 'prod-lifesmart-nature-switch-3-way',
    name: 'LifeSmart Nature Switch 3-Way (Red Dot Winner)',
    nameCn: 'LifeSmart Nature 智能开关 三路',
    slug: 'lifesmart-nature-switch-3-way',
    description: 'Red Dot Best of the Best award winner — a rare honor among 10,000 contenders. Premium smart switch with magnetic latching relay.',
    material: 'PC',
    specifications: 'Wiring: Live + Neutral | Control Unit: 16A magnetic latching relay | Operating Temperature: -5~45°C | Humidity: 5~90% | Power Supply: AC 100-240V 50/60Hz | Maximum Overload: Resistive load 500W',
    brandName: 'LifeSmart',
    sortOrder: 1,
    categoryId: subSmartSwitches.id,
  });

  console.log('Created 1 Smart Switch product');

  // ═══ Smart Locks (1 product) ══════════════════════════════════════════════

  await upsertProduct({
    id: 'prod-lifesmart-smart-door-lock-c200',
    name: 'LifeSmart Smart Door Lock C200',
    nameCn: 'LifeSmart 智能门锁 C200',
    slug: 'lifesmart-smart-door-lock-c200',
    description: 'Opens immediately on grip. Fingerprint sensor centered on handle pivot for ergonomic grip-to-open experience.',
    material: 'Aluminum alloys + IML',
    specifications: 'Colors: Black / Gold | Dimensions: 360x73x23mm | Radio Protocol: CoSS | Range: 200m (open field) | Unlocking: Fingerprint / Password / Mechanical Key / LifeSmart App / Electronic Key',
    brandName: 'LifeSmart',
    sortOrder: 1,
    categoryId: subSmartLocks.id,
  });

  console.log('Created 1 Smart Lock product');

  // ═══ Smart Motors & Accessories (2 products) ══════════════════════════════

  await upsertProduct({
    id: 'prod-lifesmart-quicklink-curtain-motor',
    name: 'LifeSmart QuickLink Curtain Motor',
    nameCn: 'LifeSmart QuickLink 窗帘电机',
    slug: 'lifesmart-quicklink-curtain-motor',
    description: 'Smart curtain motor with quick-link installation. Supports curtain tracks up to 5.2m.',
    specifications: 'Model: BCM100D | Max Curtain Track: 5.2m | Speed: 12cm/s | Rated Torque: 1.2Nm | Operating Temperature: -20~85°C | Humidity: 0~80% | Power Supply: 100-240V AC 50/60Hz',
    brandName: 'LifeSmart',
    sortOrder: 1,
    categoryId: subSmartMotorsAccessories.id,
  });

  await upsertProduct({
    id: 'prod-lifesmart-spot-universal-remote',
    name: 'LifeSmart SPOT Universal Remote Controller',
    nameCn: 'LifeSmart SPOT 万能遥控器',
    slug: 'lifesmart-spot-universal-remote',
    description: 'Turn appliances smart. Control all home appliances or manage them remotely from anywhere. Paired with the LifeSmart app, oversee every device in the home.',
    specifications: 'Operating Temperature: -5~45°C | Humidity: 5~90% | Power Supply: DC 5V | Interfaces: Micro USB power / USB output | Indicator: 16 million color LED | Remote Range: IR (built-in)',
    brandName: 'LifeSmart',
    sortOrder: 2,
    categoryId: subSmartMotorsAccessories.id,
  });

  console.log('Created 2 Smart Motors & Accessories products');

  // ─── Summary ─────────────────────────────────────────────────────────────────

  const supplierProducts = await prisma.product.count({
    where: { supplierId: 'lifesmart' },
  });
  console.log(
    `\nDone! Added ${supplierProducts} LifeSmart products.`
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
