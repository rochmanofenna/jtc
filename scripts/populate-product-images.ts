/**
 * populate-product-images.ts
 *
 * Reads local image folders (Joyfull Indonesia, Life Smart, Loye Aman),
 * matches every file to a product slug, compresses with sharp, uploads to
 * Supabase Storage (bucket: products), and upserts ProductImage rows so the
 * frontend can render them.
 *
 * The 3 supplier folders are treated as ONE pool — every file is tried
 * against every matcher, so a misfiled image (e.g. Smart Door Lock C200.png
 * living in the LOYE folder) still ends up attached to its real product.
 *
 * Usage:
 *   npx tsx scripts/populate-product-images.ts --supplier=joyfull --dry-run
 *   npx tsx scripts/populate-product-images.ts --supplier=joyfull
 *   npx tsx scripts/populate-product-images.ts --all
 *   npx tsx scripts/populate-product-images.ts --all --dry-run
 *
 * Flags:
 *   --dry-run          Log matches without uploading or writing to the DB.
 *   --supplier=NAME    Only process files from one folder: joyfull|lifesmart|loye.
 *   --all              Process all 3 folders (default if --supplier not given).
 */

import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { config as loadDotenv } from 'dotenv';

// Load both .env (DATABASE_URL) and .env.local (Supabase keys) — the latter
// overrides the former, matching Next.js's env resolution order.
loadDotenv();
loadDotenv({ path: '.env.local', override: true });

// ─── Config ──────────────────────────────────────────────────────────────────

const BUCKET = 'products';
const MAX_WIDTH = 1600;
const JPEG_QUALITY = 80;

const FOLDERS: Record<
  'joyfull' | 'lifesmart' | 'loye',
  { folderPath: string; supplierId: string }
> = {
  joyfull: {
    folderPath:
      '/home/ryan/jtc/Joyfull Indonesia-20260409T060254Z-3-001/Joyfull Indonesia',
    supplierId: 'joyfull-tech',
  },
  lifesmart: {
    folderPath:
      '/home/ryan/jtc/Life Smart-20260409T060320Z-3-001/Life Smart',
    supplierId: 'lifesmart',
  },
  loye: {
    folderPath:
      '/home/ryan/jtc/Loye Aman-20260409T060325Z-3-001/Loye Aman',
    supplierId: 'loye-aman',
  },
};

// ─── LifeSmart alias table ──────────────────────────────────────────────────
// The folder uses the short product name ("Nature 7 PRO") but the DB slugs
// prefix most products with "lifesmart-". These aliases map the slugified
// filename prefix to the real DB slug.
const LIFESMART_ALIASES: Record<string, string> = {
  'defed-door-window-sensor': 'defed-door-window-sensor',
  'defed-motion-sensor': 'defed-motion-sensor',
  'defed-smart-station': 'defed-smart-station',
  'nature-7-pro': 'lifesmart-nature-7-pro',
  'nature-mini-pro': 'lifesmart-nature-mini-pro',
  'nature-switch-3-way': 'lifesmart-nature-switch-3-way',
  // Supplier typo: "Curtaint" vs "Curtain"
  'quicklink-curtaint-motor': 'lifesmart-quicklink-curtain-motor',
  'quicklink-curtain-motor': 'lifesmart-quicklink-curtain-motor',
  'water-leak-sensor': 'lifesmart-water-leak-sensor',
  'smart-door-lock-c200': 'lifesmart-smart-door-lock-c200',
  'spot-universal-remote-controller': 'lifesmart-spot-universal-remote',
};

// ─── LOYE manual mapping ────────────────────────────────────────────────────
// Indonesian → English product slugs. Many of these I translated by hand
// after reading both the filename list and the DB slug list. Where a file
// could plausibly map to more than one slug I picked the best candidate
// and left a comment.
//
// Keys are the ORIGINAL filename (minus extension and " (1)" dup suffix).
// The matcher normalizes incoming filenames the same way before lookup.
const LOYE_MANUAL_MAP: Record<string, string> = {
  // Grinding / cutting discs
  '(100x3.0x16）grinding hijau': 'loye-grinding-disc-green-100x3-0x16',
  '(107x1.2x16) grinding hijau': 'loye-cutting-disc-green-107x1-2x16',
  '(355x2.5x25.4) grinding hijau': 'loye-cutting-disc-green-355x2-5x25-4',
  '(355x3.0x25.4) grinding hitam': 'loye-cutting-disc-black-355x3-0x25-4',

  // Masks & filters
  '370 kapas penyaring masker debu': '370-high-efficiency-filter-cotton',
  'masker 1 kali pakai': 'disposable-face-mask',
  'masker anti debu 3000': '3000-anti-dust-mask',
  'masker anti racun 2030': '2030-gas-respirator-mask',
  'masker anti racun 6200': '6200-gas-respirator-mask',

  // Boots
  '502 bot': '502-mid-cut-safety-boots',
  '805 bot': '805-standard-mining-safety-boots',
  'bot berinsulasi 20kv': '20kv-insulated-safety-boots',
  'bot berinsulasi 35kv': '35kv-high-voltage-insulated-safety-boots',
  'sepatu bot hujan alas baja': 'steel-toe-rain-boots',
  'sepatu bot hujan hitam biasa': 'standard-black-rain-boots',
  'sepatu bot hujan kuning biasa': 'standard-yellow-rain-boots',
  'king power l-026x': '026-standard-safety-work-shoes',
  ax30029: 'honeywell-ax30029-safety-shoes',

  // Anti-static
  'alarm anti statis double station': 'double-station-anti-static-alarm',
  'alarm anti statis single station': 'single-station-anti-static-alarm',
  'gelang anti statis': 'anti-static-wrist-strap-1-8m', // ambiguous; defaults to 1.8m

  // Body harness / lanyards
  'body harnessd absorber double hook 2m': 'body-harness-d-absorber-double-hook-2m',
  'body harnessd absorber single hook 2m': 'body-harness-d-absorber-single-hook-2m',
  'single hook lanyard + absorber': 'single-hook-lanyard-with-absorber',

  // Helmets
  'helm safety type abs 2': 'abs-vt-ventilated-safety-helmet',
  'helm safety type pe': 'pe-gb13-safety-helmet',
  'helm safety type v': 'fiberglass-v-type-safety-helmet',

  // Rainwear
  'jas hujan anti angin': 'trench-style-raincoat-blue',
  'jas hujan eva': 'eva-raincoat',
  'jas hujan set 98': 'raincoat-set-98',
  'jas hujan set 99': 'raincoat-set-99',

  // Gloves
  'metal cut resistant glove': 'metal-cut-resistant-gloves',
  'sarung tangan anti haus': 'super-wear-resistant-yarn-gloves',
  'sarung tangan anti slip': 'pvc-anti-slip-rubber-gloves',
  'sarung tangan industri karet': 'rubber-industrial-gloves',
  'sarung tangan kain bertitik plastik': 'pvc-dotted-cotton-gloves',
  'sarung tangan kain katun berat 700g': 'patterned-yarn-gloves-700g',
  'sarung tangan kanvas': 'premium-canvas-gloves-24-thread',
  'sarung tangan katun 6 benang lokal': 'cotton-thread-gloves-6-thread',
  'sarung tangan katun 8 benang lokal': 'cotton-thread-gloves-8-thread',
  'sarung tangan las panjang': 'premium-long-welding-gloves',
  'sarung tangan las pendek': 'premium-short-welding-gloves',
  'sarung tangan nitrile biru putih': 'white-yarn-blue-nitrile-half-dipped-gloves',
  'sarung tangan nitrile sekali pakai': 'disposable-nitrile-gloves',
  'sarung tangan nitril tipis': 'thin-nitrile-examination-gloves',
  'sarung tangan terisolasi 12kv': '12kv-insulated-gloves',
  'sarung tangan terisolasi 35kv': '35kv-high-voltage-insulated-gloves',

  // Tapes & ties
  'electrical tape': 'pvc-electrical-insulation-tape',
  'kabel ties nylon': 'white-nylon-cable-ties',
  'lakban coklat': 'brown-opp-packing-tape',
  'lakban putih bening': 'clear-opp-packing-tape',
  'strech film plast': 'stretch-wrap-film', // supplier typo: Strech/Stretch

  // Traffic / site
  'convex mirror': 'convex-safety-mirror',
  'ranjang besi, ranjang susun': 'iron-frame-bunk-bed',
  'traffic cone dasar hitam': 'black-base-pvc-traffic-cone',
  'traffic cone dasar merah': 'red-base-pvc-traffic-cone',

  // Safety lines (ambiguous between polyester/pvc — arbitrary split)
  'safety line 1': 'polyester-safety-warning-line',
  'safety line 2': 'pvc-safety-warning-line',

  // Reflective vests
  'rompi safety biasa': 'standard-reflective-safety-vest',
  'rompi safety dengan banyak kantong berkualitas':
    'premium-multi-pocket-reflective-safety-vest',
  'rompi safety katun polyester risleting orange':
    'orange-cotton-polyester-zipper-reflective-vest',
  'rompi safety velcro': 'velcro-reflective-safety-vest',
  // Supplier typo in filename: "Ropi" vs "Rompi"
  'ropi safety katun polyester risleting hijau stabilo':
    'fluorescent-green-cotton-polyester-zipper-reflective-vest',

  // Welding
  'welded glass lenses (black)': 'welding-glass-lens-black',
  'welded glass lenses (white)': 'welding-glass-lens-white',
  'welder mask cap': 'handheld-welding-mask-red',
  'head mounted welding mask': 'head-mounted-welding-mask',
  'kaca mata las plastik': 'welding-safety-goggles',
  'kacamata pelindung plastik': 'clear-protective-safety-goggles',

  // Goggles already above
  // Protective clothing
  'custom baju apd': 'custom-work-uniform',
  'pakaian kerja siap pakai': 'ready-made-work-uniform',
  t90: 'protective-suit-t90',
  'xiang heniao': 'xiang-he-niao-protective-suit',

  // Life safety
  'life buoy': 'life-buoy',
  'life jacket': 'life-jacket',

  // Power tools — these already use SKU prefixes so the SKU matcher handles
  // them automatically, no need to list here.
};

// Files we deliberately ignore (logos, marketing, etc.)
const IGNORE_FILES = new Set(['loye aman']);

// ─── Utilities ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const supplierFilter = (() => {
  const arg = args.find((a) => a.startsWith('--supplier='));
  return arg ? arg.split('=')[1] : undefined;
})();

const selectedSuppliers: Array<keyof typeof FOLDERS> = supplierFilter
  ? [supplierFilter as keyof typeof FOLDERS]
  : (['joyfull', 'lifesmart', 'loye'] as const);

function log(...parts: unknown[]) {
  // eslint-disable-next-line no-console
  console.log(...parts);
}

interface Candidate {
  /** The base string to look up — without extension, dup suffix, stripping. */
  base: string;
  /** Image index to record in ProductImage.sortOrder. Defaults to 1. */
  sortOrder: number;
}

/**
 * Normalize a filename into a set of candidate bases to try against matchers.
 *
 * We return MULTIPLE candidates because trailing numbers are ambiguous:
 *   - "DEFED Door Window Sensor 3" — `3` is an image index, strip it
 *   - "Jas Hujan Set 98"           — `98` is part of the name, keep it
 *   - "Helm Safety Type ABS 2.1"   — `2` is name, `.1` is image index
 *   - "NW-8213C-1500 5C"           — ` 5C` is a supplier-specific suffix
 *
 * Matchers iterate candidates in order and return the first hit. The order
 * is: most preserved → most stripped.
 */
function normalizeFilename(filename: string): {
  ext: string;
  candidates: Candidate[];
} {
  // 1. Strip extension
  const m = filename.match(/^(.*)\.(jpe?g|png)$/i);
  const noExt = m ? m[1] : filename;
  const ext = m ? m[2].toLowerCase() : 'jpg';

  // 2. Strip Google Drive " (N)" duplicate suffix
  const noDup = noExt.replace(/\s*\(\d+\)\s*$/, '').trim();

  // 3. Also consider a version with the LOYE power-tool " 5C" suffix stripped
  const no5c = noDup.replace(/\s+5c\s*$/i, '').trim();

  const candidates: Candidate[] = [];

  // Candidate A: completely preserved — lets LOYE manual map look up full
  // names with trailing numbers like "Jas Hujan Set 98" or "Masker Anti
  // Debu 3000".
  candidates.push({ base: noDup, sortOrder: 1 });

  // Candidate B: 5C suffix stripped (only if that actually changed something)
  if (no5c !== noDup) {
    candidates.push({ base: no5c, sortOrder: 1 });
  }

  // Candidate C: trailing ".M" sub-index stripped — "Helm Safety Type ABS 2.1"
  //              → base "Helm Safety Type ABS 2", sortOrder 1.
  const subIdx = no5c.match(/^(.+)\.(\d+)$/);
  if (subIdx) {
    candidates.push({
      base: subIdx[1].trim(),
      sortOrder: parseInt(subIdx[2], 10),
    });
  }

  // Candidate D: trailing " N" image index stripped — "DEFED Door Window
  //              Sensor 3" → base "DEFED Door Window Sensor", sortOrder 3.
  //              Skip this if stripping would turn "BA-LB-A0301-1" into
  //              "BA-LB-A0301" (dash-number, not space-number — already
  //              handled by our dash-separated SKU matcher).
  const spaceIdx = no5c.match(/^(.+?)\s+(\d+)$/);
  if (spaceIdx) {
    const stripped = spaceIdx[1].trim();
    candidates.push({
      base: stripped,
      sortOrder: parseInt(spaceIdx[2], 10),
    });
  }

  return { ext, candidates };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[（）()]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ─── Matchers ───────────────────────────────────────────────────────────────

interface Product {
  id: string;
  slug: string;
  name: string;
  supplierId: string;
}

interface MatchResult {
  product: Product;
  sortOrder: number;
  strategy: 'sku' | 'loye-manual' | 'lifesmart-alias' | 'lifesmart-name';
}

/**
 * SKU matcher — works for both Joyfull (slug starts with SKU) and LOYE power
 * tools (slug ends with SKU). We check every segment boundary so the SKU has
 * to appear as a whole dash-delimited segment of the slug, which keeps us
 * safe from false positives on short SKUs.
 */
function matchBySKU(
  candidate: Candidate,
  products: Product[]
): MatchResult | null {
  const normalized = candidate.base.toLowerCase().replace(/\s+/g, '-');
  if (!normalized) return null;

  const found = products.find((p) => {
    const slug = p.slug;
    return (
      slug === normalized ||
      slug.startsWith(`${normalized}-`) ||
      slug.endsWith(`-${normalized}`) ||
      slug.includes(`-${normalized}-`)
    );
  });
  if (found) {
    return {
      product: found,
      sortOrder: candidate.sortOrder,
      strategy: 'sku',
    };
  }
  return null;
}

function matchLoyeManual(
  candidate: Candidate,
  products: Product[]
): MatchResult | null {
  const key = candidate.base.toLowerCase().trim();
  const slug = LOYE_MANUAL_MAP[key];
  if (!slug) return null;

  const product = products.find((p) => p.slug === slug);
  if (!product) return null;

  return {
    product,
    sortOrder: candidate.sortOrder,
    strategy: 'loye-manual',
  };
}

function matchLifesmart(
  candidate: Candidate,
  products: Product[]
): MatchResult | null {
  const slugified = slugify(candidate.base);
  if (!slugified) return null;

  // Alias table hit
  const aliasSlug = LIFESMART_ALIASES[slugified];
  if (aliasSlug) {
    const product = products.find((p) => p.slug === aliasSlug);
    if (product) {
      return {
        product,
        sortOrder: candidate.sortOrder,
        strategy: 'lifesmart-alias',
      };
    }
  }

  // Direct slug match against any LifeSmart product
  const lifesmartProducts = products.filter(
    (p) => p.supplierId === 'lifesmart'
  );
  const direct = lifesmartProducts.find((p) => p.slug === slugified);
  if (direct) {
    return {
      product: direct,
      sortOrder: candidate.sortOrder,
      strategy: 'lifesmart-name',
    };
  }

  // Name contains (case-insensitive)
  const baseLower = candidate.base.toLowerCase();
  const byName = lifesmartProducts.find((p) =>
    p.name.toLowerCase().includes(baseLower)
  );
  if (byName) {
    return {
      product: byName,
      sortOrder: candidate.sortOrder,
      strategy: 'lifesmart-name',
    };
  }
  return null;
}

function match(
  filename: string,
  products: Product[]
): MatchResult | null {
  const { candidates } = normalizeFilename(filename);

  // Short-circuit ignore list — checked against the first (fullest) candidate
  if (IGNORE_FILES.has(candidates[0].base.toLowerCase())) return null;

  // Try each candidate in order (most preserved → most stripped) against
  // every matcher (most specific → most fuzzy). First hit wins.
  for (const candidate of candidates) {
    const result =
      matchLoyeManual(candidate, products) ??
      matchBySKU(candidate, products) ??
      matchLifesmart(candidate, products);
    if (result) return result;
  }
  return null;
}

// ─── Supabase + Prisma clients ──────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

// ─── Processing ─────────────────────────────────────────────────────────────

async function compressToJpeg(absPath: string): Promise<Buffer> {
  const input = await readFile(absPath);
  return sharp(input)
    .rotate() // honor EXIF orientation
    .resize({ width: MAX_WIDTH, withoutEnlargement: true, fit: 'inside' })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();
}

function supplierPrefix(supplierId: string): string {
  switch (supplierId) {
    case 'joyfull-tech':
      return 'joyfull';
    case 'lifesmart':
      return 'lifesmart';
    case 'loye-aman':
      return 'loye';
    default:
      return 'other';
  }
}

function buildStoragePath(
  product: Product,
  sortOrder: number
): string {
  const prefix = supplierPrefix(product.supplierId);
  return `${prefix}/${product.slug}-${sortOrder}.jpg`;
}

async function uploadBuffer(
  storagePath: string,
  buffer: Buffer
): Promise<string> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: 'image/jpeg',
      cacheControl: '31536000',
      upsert: true,
    });
  if (error) throw new Error(`Supabase upload failed (${storagePath}): ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

async function upsertProductImage(
  productId: string,
  url: string,
  altText: string,
  sortOrder: number
) {
  // ProductImage has no natural unique key, so we delete+recreate for the
  // (productId, sortOrder) pair. That keeps re-runs idempotent.
  await prisma.productImage.deleteMany({
    where: { productId, sortOrder },
  });
  await prisma.productImage.create({
    data: {
      productId,
      url,
      altText,
      sortOrder,
    },
  });
}

async function processFile(
  folderPath: string,
  filename: string,
  products: Product[],
  stats: Stats
) {
  // Skip Google Drive duplicate variants entirely — keep only the pristine
  // file without the " (1)" suffix. If the pristine version doesn't exist
  // we still process this one, otherwise we drop it.
  if (/\s*\(\d+\)\s*\.(jpe?g|png)$/i.test(filename)) {
    const pristine = filename.replace(/\s*\(\d+\)\s*\.(jpe?g|png)$/i, '.$1');
    try {
      await readFile(path.join(folderPath, pristine));
      stats.dupesSkipped++;
      return;
    } catch {
      // pristine doesn't exist — fall through and use the dup
    }
  }

  // Check ignore list up front so ignored files don't inflate the
  // unmatched-files report.
  const { candidates } = normalizeFilename(filename);
  if (IGNORE_FILES.has(candidates[0].base.toLowerCase())) {
    stats.ignoredFiles++;
    return;
  }

  const result = match(filename, products);
  if (!result) {
    stats.unmatchedFiles.push({ folder: folderPath, filename });
    return;
  }

  const { product, sortOrder, strategy } = result;
  const storagePath = buildStoragePath(product, sortOrder);
  const altText = `${product.name} - ${sortOrder}`;

  stats.matched++;
  stats.matchedByStrategy[strategy] = (stats.matchedByStrategy[strategy] ?? 0) + 1;
  stats.matchedProducts.add(product.id);

  log(
    `  [${strategy}] ${filename}`,
    '\n      →',
    `${product.slug} (sortOrder=${sortOrder}) → ${storagePath}`
  );

  if (dryRun) return;

  const absPath = path.join(folderPath, filename);
  const buffer = await compressToJpeg(absPath);
  const publicUrl = await uploadBuffer(storagePath, buffer);
  await upsertProductImage(product.id, publicUrl, altText, sortOrder);
}

// ─── Reporting ──────────────────────────────────────────────────────────────

interface Stats {
  matched: number;
  matchedByStrategy: Record<string, number>;
  matchedProducts: Set<string>;
  unmatchedFiles: Array<{ folder: string; filename: string }>;
  dupesSkipped: number;
  ignoredFiles: number;
}

function freshStats(): Stats {
  return {
    matched: 0,
    matchedByStrategy: {},
    matchedProducts: new Set(),
    unmatchedFiles: [],
    dupesSkipped: 0,
    ignoredFiles: 0,
  };
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  log('');
  log('═══ Populate Product Images ═══');
  log(
    `Mode: ${dryRun ? 'DRY RUN (no uploads, no DB writes)' : 'LIVE UPLOAD'}`
  );
  log(`Suppliers: ${selectedSuppliers.join(', ')}`);
  log('');

  // Fetch all products once. Matchers run against the full pool so
  // misfiled images cross-route correctly.
  const products = (await prisma.product.findMany({
    select: { id: true, slug: true, name: true, supplierId: true },
    orderBy: { slug: 'asc' },
  })) as Product[];
  log(`Loaded ${products.length} products from DB\n`);

  const stats = freshStats();

  for (const supplier of selectedSuppliers) {
    const { folderPath } = FOLDERS[supplier];
    log(`━━━ ${supplier.toUpperCase()} — ${folderPath.split('/').pop()} ━━━`);

    let files: string[];
    try {
      files = await readdir(folderPath);
    } catch (e) {
      log(`  ! Could not read folder: ${(e as Error).message}\n`);
      continue;
    }

    files.sort();
    for (const filename of files) {
      if (!/\.(jpe?g|png)$/i.test(filename)) continue;
      await processFile(folderPath, filename, products, stats);
    }
    log('');
  }

  // ─── Summary ─────────────────────────────────────────────────────────────
  log('─── Summary ───');
  log(`  Matched files:        ${stats.matched}`);
  log(`  Duplicates skipped:   ${stats.dupesSkipped}`);
  log(`  Unmatched files:      ${stats.unmatchedFiles.length}`);
  log(`  Distinct products hit: ${stats.matchedProducts.size}`);
  log(`  By strategy:`);
  for (const [strategy, n] of Object.entries(stats.matchedByStrategy)) {
    log(`    ${strategy}: ${n}`);
  }

  if (stats.unmatchedFiles.length > 0) {
    log('');
    log('─── Unmatched files (need manual mapping) ───');
    for (const { folder, filename } of stats.unmatchedFiles) {
      const folderName = folder.split('/').pop();
      log(`  [${folderName}] ${filename}`);
    }

    // Write a todo-map JSON so the user can fill it in.
    if (dryRun) {
      const todoMap: Record<string, string> = {};
      for (const { filename } of stats.unmatchedFiles) {
        const { candidates } = normalizeFilename(filename);
        // Use the fullest candidate as the key
        todoMap[candidates[0].base.toLowerCase()] = '';
      }
      const outPath = path.join(
        '/home/ryan/jtc/jakarta-trade-connect',
        'scripts',
        'unmatched-images-todo.json'
      );
      await writeFile(outPath, JSON.stringify(todoMap, null, 2));
      log(`\n  Todo map written to: ${outPath}`);
    }
  }

  // Products with no images at all (across suppliers we processed)
  const unmatchedProducts: Product[] = [];
  for (const p of products) {
    if (
      selectedSuppliers.some(
        (s) => FOLDERS[s].supplierId === p.supplierId
      ) &&
      !stats.matchedProducts.has(p.id)
    ) {
      unmatchedProducts.push(p);
    }
  }

  if (unmatchedProducts.length > 0) {
    log('');
    log(`─── Products with no image (${unmatchedProducts.length}) ───`);
    for (const p of unmatchedProducts) {
      log(`  ${p.slug} | ${p.name}`);
    }
  }

  log('');
  log(dryRun ? 'Dry run complete — no changes written.' : 'Upload complete.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
