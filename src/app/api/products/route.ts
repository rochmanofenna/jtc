import { type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { productQuerySchema, createProductSchema } from "@/lib/validations"
import { slugify } from "@/lib/utils"

function isZodError(err: unknown): err is Error & { issues: unknown[] } {
  return err instanceof Error && Array.isArray((err as any).issues)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const query = productQuerySchema.parse(
      Object.fromEntries(searchParams.entries())
    )

    const where: Record<string, unknown> = {}

    // Search across name, nameCn, description, brandName
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { nameCn: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
        { brandName: { contains: query.search, mode: "insensitive" } },
      ]
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId
    }

    if (query.categorySlug) {
      where.category = { slug: query.categorySlug }
    }

    if (query.supplierId) {
      where.supplierId = query.supplierId
    }

    if (query.material) {
      where.material = { contains: query.material, mode: "insensitive" }
    }

    // Determine sort
    const orderBy: Record<string, string> = {}
    orderBy[query.sort] = query.sort === "name" ? "asc" : "asc"

    const skip = (query.page - 1) * query.limit

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          supplier: true,
          images: { orderBy: { sortOrder: "asc" } },
        },
        orderBy,
        skip,
        take: query.limit,
      }),
      prisma.product.count({ where }),
    ])

    return Response.json({
      data,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    })
  } catch (err) {
    console.error("GET /api/products error:", err)
    return Response.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Separate images from main product data
    const { images, ...productData } = body

    // Auto-generate slug if not provided
    if (!productData.slug && productData.name) {
      productData.slug = slugify(productData.name)
    }

    const validated = createProductSchema.parse(productData)

    const product = await prisma.product.create({
      data: {
        ...validated,
        images:
          images && images.length > 0
            ? {
                create: images.map((url: string, index: number) => ({
                  url,
                  sortOrder: index,
                })),
              }
            : undefined,
      },
      include: {
        category: true,
        supplier: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    })

    return Response.json(product, { status: 201 })
  } catch (err) {
    console.error("POST /api/products error:", err)

    if (isZodError(err)) {
      return Response.json(
        { error: "Validation failed", details: err.issues },
        { status: 400 }
      )
    }

    return Response.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    )
  }
}
